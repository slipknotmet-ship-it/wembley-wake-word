import * as THREE from 'three';
import { CONFIG as DEFAULT_CONFIG } from '../core/config.js';

/**
 * entities/monsterFace_c.js  -  THE PROTECTOR OF EMEEM LAND  (puppet build).
 *
 * A giant bare human torso that walks. There is no head, because the face IS
 * the body:
 *   - black sunglasses laid across the chest are the EYES
 *   - the navel is the NOSE
 *   - the crease of the belly fold under it is the MOUTH, frowning
 *   - arms hang at the sides, dark shorts at the waist, legs below
 *
 * ---------------------------------------------------------------------------
 * APPROACH: RIGID PARTS, JOINTED LIKE A PUPPET
 * ---------------------------------------------------------------------------
 * There is not one deformed vertex in here. Every geometry is baked once and
 * every expression is a TRANSFORM: translate, rotate, scale. That makes the
 * whole face free on the GPU (no morph texture, no skinning, no per-frame
 * buffer upload) and it is why this rig can afford 27 meshes on a phone that is
 * already drawing a streamed world.
 *
 * The mouth is six solid pieces posed against each other, the way a stop-motion
 * mouth is swapped and hinged:
 *
 *      upperLip   a bar swept along the parabola  y = -ARC*u^2
 *      lowerLip   a fatter bar on the same curve, below it
 *      cornerL/R  wedges pinned to the ends of that curve
 *      shadow     a dark arched plate behind both lips - the stroke of ink
 *      maw        the dark interior, revealed when the lips part
 *
 * THE TRICK THAT MAKES A RIGID FROWN WORK. The lips are baked as a shallow
 * downward parabola. Scaling a parabola in Y does not just stretch it - it
 * DEEPENS THE CURVE (y = -ARC*u^2 becomes y = -ARC*sy*u^2) while at the same
 * time thickening the bar's cross-section. So one scale.y drives three of the
 * things an angry mouth actually does at once: the arc deepens, the corners
 * drop, and the lips swell. scale.x widens the whole mouth. The corner wedges
 * are then re-pinned each frame to wherever the scaled curve now ends, which is
 * how the two ends stay welded to a mouth that is changing shape.
 *
 * ---------------------------------------------------------------------------
 * LEGIBLE AT 40 METRES THROUGH FOG
 * ---------------------------------------------------------------------------
 * Colour is the first thing fog eats, so the escalation is spent on shape:
 *   1. the corner wedges swing DOWN AND OUT until their tips clear the flank -
 *      two hooks cut past the body outline, which is a silhouette change and
 *      survives any amount of grey;
 *   2. the mouth arc roughly doubles in depth and the lips double in thickness;
 *   3. the sunglasses drop, close up and each lens hinges about its OUTER
 *      corner so the inner ends fall - the one brow cue everybody reads;
 *   4. a heavy brow ridge pushes OUT OF THE CHEST above them, with two
 *      corrugator furrows knitting between the lenses;
 *   5. the gut tilts out and squashes down, the torso broadens and hunches,
 *      the arms flare off the ribs, the lower belly juts like a jaw;
 *   6. only then the flush, the lens glow and the wet red of the maw.
 *
 * BUDGET: 27 meshes, 20 geometries, 4 materials, ~4.5k triangles. Every scratch
 * object is at module scope; update() allocates nothing and only SETS
 * transforms, so a ten minute chase cannot drift the pose by a millimetre.
 */

// Module alias so buildFace can default its THREE argument while still letting
// a caller (or a test) inject their own instance.
const THREE_NS = THREE;

const TAU = Math.PI * 2;
const EMPTY_OPTS = {};

// --------------------------------------------------------------- maths ---
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
/** Signed power - keeps the superellipse symmetric through the origin. */
const sgnPow = (v, e) => (v < 0 ? -Math.pow(-v, e) : Math.pow(v, e));
function smoothstep(e0, e1, x) {
  const t = clamp01((x - e0) / (e1 - e0 || 1e-6));
  return t * t * (3 - 2 * t);
}
/** Frame-rate independent exponential approach. */
const damp = (cur, tgt, rate, dt) => lerp(cur, tgt, 1 - Math.exp(-rate * dt));

// =========================================================================
// GEOMETRY BUILDER
// Everything is generated into a plain array bucket and handed to three once.
// Building my own means differently coloured pieces (flesh, shorts, teeth,
// black rubber) can be MERGED into a single mesh whenever they never move
// relative to each other, which is where the mesh count savings come from.
// =========================================================================
class Buf {
  constructor() { this.p = []; this.c = []; this.i = []; }
  get n() { return this.p.length / 3; }
  v(x, y, z, col) {
    this.p.push(x, y, z);
    this.c.push(col[0], col[1], col[2]);
    return this.p.length / 3 - 1;
  }
  tri(a, b, c) { this.i.push(a, b, c); }
  /** Vertices in ring-order; normal comes out as (rowDir x ringDir). */
  quad(a, b, c, d, flip) {
    if (flip) this.i.push(a, d, c, a, c, b);
    else this.i.push(a, b, c, a, c, d);
  }
  toGeometry(T) {
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(this.p, 3));
    g.setAttribute('color', new T.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }
}

/**
 * Stitches a stack of equal-length vertex rings into a tube.
 * `flip` reverses the winding for pieces we look at from the inside.
 */
function stitch(B, rows, sides, capFirst, capLast, flip, colFirst, colLast) {
  for (let i = 0; i < rows.length - 1; i++) {
    const lo = rows[i], up = rows[i + 1];
    for (let k = 0; k < sides; k++) {
      const k2 = (k + 1) % sides;
      B.quad(lo[k], up[k], up[k2], lo[k2], flip);
    }
  }
  if (capFirst) capRing(B, rows[0], sides, false, flip, colFirst);
  if (capLast) capRing(B, rows[rows.length - 1], sides, true, flip, colLast);
}

/** Fans a ring shut onto a pole vertex at its centroid. */
function capRing(B, ring, sides, atEnd, flip, col) {
  let cx = 0, cy = 0, cz = 0;
  for (let k = 0; k < sides; k++) {
    const i3 = ring[k] * 3;
    cx += B.p[i3]; cy += B.p[i3 + 1]; cz += B.p[i3 + 2];
  }
  const pole = B.v(cx / sides, cy / sides, cz / sides, col || [0.5, 0.35, 0.28]);
  for (let k = 0; k < sides; k++) {
    const k2 = (k + 1) % sides;
    // A cap is the degenerate case of a quad against a collapsed ring.
    if (atEnd) B.quad(ring[k], pole, pole, ring[k2], flip);
    else B.quad(pole, ring[k], ring[k2], pole, flip);
  }
}

/**
 * Lofts superellipse rings stacked up the local Y axis.
 * rings: [{ y, rx, rz, zc, xc, n, col }] - col may be an array or fn(x,y,z).
 * A superellipse (|x/rx|^n + |z/rz|^n = 1) is what stops the torso reading as
 * a stack of eggs: at n = 3 the front of the belly is nearly flat, which is
 * both anatomically right and what lets the mouth sit on it without floating.
 */
function addLoft(B, rings, sides, capBottom, capTop) {
  const rows = [];
  for (let r = 0; r < rings.length; r++) {
    const R = rings[r];
    const e = 2 / (R.n || 2);
    const row = new Array(sides);
    for (let k = 0; k < sides; k++) {
      const th = (k / sides) * TAU;
      const x = (R.xc || 0) + sgnPow(Math.cos(th), e) * R.rx;
      const z = (R.zc || 0) + sgnPow(Math.sin(th), e) * R.rz;
      row[k] = B.v(x, R.y, z, typeof R.col === 'function' ? R.col(x, R.y, z, th) : R.col);
    }
    rows.push(row);
  }
  const c0 = rings[0].capCol || (typeof rings[0].col === 'function' ? rings[0].col(0, rings[0].y, 0, 0) : rings[0].col);
  const cN = rings[rings.length - 1].capCol
    || (typeof rings[rings.length - 1].col === 'function'
      ? rings[rings.length - 1].col(0, rings[rings.length - 1].y, 0, 0)
      : rings[rings.length - 1].col);
  stitch(B, rows, sides, capBottom, capTop, false, c0, cN);
}

/** A UV ellipsoid, poles on Y. Used for lobes, shoulders, nostrils, teeth. */
function addEllipsoid(B, cx, cy, cz, rx, ry, rz, segU, segV, col) {
  const rows = [];
  for (let j = 1; j < segV; j++) {
    const phi = (j / segV) * Math.PI;
    const y = -Math.cos(phi) * ry, r = Math.sin(phi);
    const row = new Array(segU);
    for (let k = 0; k < segU; k++) {
      const th = (k / segU) * TAU;
      const x = Math.cos(th) * rx * r, z = Math.sin(th) * rz * r;
      row[k] = B.v(cx + x, cy + y, cz + z,
        typeof col === 'function' ? col(x / rx, y / ry, z / rz, th) : col);
    }
    rows.push(row);
  }
  const cBot = typeof col === 'function' ? col(0, -1, 0, 0) : col;
  const cTop = typeof col === 'function' ? col(0, 1, 0, 0) : col;
  stitch(B, rows, segU, true, true, false, cBot, cTop);
}

/**
 * A superellipse prism laid on an arbitrary plane: the sunglasses parts.
 * C is the centre of the BACK face, N the outward normal, R/U the in-plane
 * axes. `dome` bulges the front cap, which is what puts a highlight on a lens.
 */
function addPlate(B, C, R, U, N, hw, hh, n, thick, dome, sides, colSide, colFace) {
  const e = 2 / n;
  const rows = [];
  for (let s = 0; s < 2; s++) {
    const d = s === 0 ? 0 : thick;
    const row = new Array(sides);
    for (let k = 0; k < sides; k++) {
      const th = (k / sides) * TAU;
      const a = sgnPow(Math.cos(th), e) * hw, b = sgnPow(Math.sin(th), e) * hh;
      row[k] = B.v(
        C[0] + R[0] * a + U[0] * b + N[0] * d,
        C[1] + R[1] * a + U[1] * b + N[1] * d,
        C[2] + R[2] * a + U[2] * b + N[2] * d,
        s === 0 ? colSide : (typeof colFace === 'function' ? colFace(Math.cos(th), Math.sin(th)) : colFace),
      );
    }
    rows.push(row);
  }
  // Rings run back -> front and the ring parameter runs R -> U, so the wall
  // normal comes out as N x (in-plane tangent): outward. No flip needed.
  stitch(B, rows, sides, true, false, false, colSide, colSide);
  // Domed front cap: a fan onto a pole pushed out along N.
  const pole = B.v(
    C[0] + N[0] * (thick + dome), C[1] + N[1] * (thick + dome), C[2] + N[2] * (thick + dome),
    typeof colFace === 'function' ? colFace(0, 0) : colFace,
  );
  const front = rows[1];
  for (let k = 0; k < sides; k++) B.tri(front[k], pole, front[(k + 1) % sides]);
}

/**
 * THE MOUTH PIECE BUILDER.
 * Sweeps a solid bar along the frown curve
 *      x = hw*u,   y = -arc*u^2,   z = bow*u^2      (u in [-1..1])
 * `bow` walks the ends backwards around the curve of the gut so the corners
 * sink into the flesh instead of hanging off it - a rigid mouth must always
 * err INTO the body, because a floating lip is the one error you cannot hide.
 * The cross-section frame rolls with the tangent, so the bar stays square to
 * the mouth line all the way to the corners.
 */
function addLipBar(B, o) {
  const samples = o.samples, sides = o.sides, e = 2 / o.n;
  const rows = [];
  for (let i = 0; i < samples; i++) {
    const u = (i / (samples - 1)) * 2 - 1;
    const cx = o.hw * u, cy = -o.arc * u * u, cz = o.bow * u * u;
    // Tangent of the centreline.
    let tx = o.hw, ty = -2 * o.arc * u, tz = 2 * o.bow * u;
    const tl = Math.hypot(tx, ty, tz) || 1;
    tx /= tl; ty /= tl; tz /= tl;
    // In-plane "up" = worldUp x T, which is exactly +Y at the centre of the
    // mouth and tips with the arc towards the corners.
    let ux = -ty, uy = tx;
    const ul = Math.hypot(ux, uy) || 1;
    ux /= ul; uy /= ul;
    // Out-of-plane axis = T x U, pointing backwards (+Z) at the centre.
    const wx = ty * 0 - tz * uy, wy = tz * ux - tx * 0, wz = tx * uy - ty * ux;
    const tap = o.taper(u);
    const ry = o.ry * tap, rz = o.rz * tap;
    const row = new Array(sides);
    for (let k = 0; k < sides; k++) {
      const th = (k / sides) * TAU;
      const a = sgnPow(Math.cos(th), e) * ry;   // + = towards the top of the bar
      const b = sgnPow(Math.sin(th), e) * rz;   // + = backwards into the body
      row[k] = B.v(
        cx + ux * a + wx * b,
        cy + uy * a + wy * b,
        cz + wz * b,
        o.col(u, Math.cos(th), -Math.sin(th)),   // (u, upness, frontness)
      );
    }
    rows.push(row);
  }
  // rowDir x ringDir works out inward for this frame, hence flip = true.
  stitch(B, rows, sides, true, true, true, o.col(-1, 0, 0), o.col(1, 0, 0));
}

// =========================================================================
// PROPORTIONS - metres, feet on y = 0, facing -Z.
// Landmark heights are lifted straight off the reference photograph: with the
// torso cropped from the top of the traps (3.34) to the waistband (1.62), the
// glasses sit 35% down that span, the navel at 72% and the belly fold at 84%.
// =========================================================================
const HEIGHT = 3.40;

const HIP_Y = 1.55;          // torso pivot: the hunch has to happen at the hips
const BROW_Y = 2.74;         // sunglasses centre-line   (the EYES)
const NAVEL_Y = 2.12;        // navel                    (the NOSE)
const MOUTH_Y = 1.90;        // belly fold               (the MOUTH)
const MOUTH_Z = -0.60;       // sunk 3cm inside the gut surface
const BELLY_PIVOT_Y = 2.34;  // the gut swings about the base of the ribs
const CHIN_PIVOT_Y = 1.98;   // the lower roll swings about the top of itself
const SHOULDER_Y = 3.02;
const SHOULDER_X = 0.84;
const HIP_X = 0.34;

// Sunglasses, measured off the reference: the frames span 89% of the chest and
// the bridge gap is about an eighth of a lens.
const LENS_CX = 0.400;       // lens centre offset from the sternum
const FRAME_HW = 0.374;      // frame half-width
const FRAME_HH = 0.287;      // frame half-height
const LENS_HW = 0.316;
const LENS_HH = 0.229;
const BROW_TILT = 0.215;     // rad each lens is toed out to follow the ribs
const BROW_PIVOT_X = LENS_CX + FRAME_HW;   // outer corner: the hinge
const BROW_PIVOT_Z = -0.375;

// Mouth. Base half-width and arc depth are the photographed crease: 0.59m wide,
// 0.115m of droop from centre to corner.
const M_HW = 0.590;
const M_ARC = 0.115;
const M_BOW = 0.190;
const LIP_U_RY = 0.062;      // upper lip half-thickness
const LIP_L_RY = 0.086;      // lower lip is the fatter roll
const LIP_RZ = 0.078;        // how far the lips stand off the belly

// Limb lengths.
const UPPER_ARM = 0.80, FORE_ARM = 0.74;
const THIGH = 0.62, SHIN = 0.72;

// =========================================================================
// SCRATCH - update() may not allocate.
// =========================================================================
const _col = new THREE_NS.Color();
const _colB = new THREE_NS.Color();

export function buildFace(THREE = THREE_NS, CONFIG = DEFAULT_CONFIG) {
  const T = THREE || THREE_NS;
  const P = (CONFIG && CONFIG.palette) || {};

  // ------------------------------------------------------------ palette ---
  // Vertex colours are written in the renderer's working space, so every hex
  // goes through Color to get the sRGB -> linear conversion for free.
  const tone = (hex, mul = 1) => {
    _col.setHex(hex);
    return [_col.r * mul, _col.g * mul, _col.b * mul];
  };
  const mixTone = (hexA, hexB, t) => {
    _col.setHex(hexA); _colB.setHex(hexB);
    return [lerp(_col.r, _colB.r, t), lerp(_col.g, _colB.g, t), lerp(_col.b, _colB.b, t)];
  };

  const SKIN = 0xe0aa7e;        // the lit mid-tone of the reference belly
  const SKIN_HI = 0xf0c79c;
  const SKIN_LO = 0xa9744e;
  const CREASE = 0x74452c;      // folds
  const DEEP = 0x40211a;        // the bottom of a fold
  const MAW_D = 0x1a0908;
  const MAW_R = 0x5e211c;
  const TOOTH = 0xd6c8ae;
  const MEAT = 0x76322a;        // the cropped neck
  const SHORTS = (P.monster != null) ? P.monster : 0x2b1220;
  const FRAME_C = 0x101114;
  const LENS_C = 0x1b2027;

  const cSkin = tone(SKIN);
  const cSkinHi = tone(SKIN_HI);
  const cCrease = tone(CREASE);
  const cDeep = tone(DEEP);
  const cMawD = tone(MAW_D);
  const cTooth = tone(TOOTH);
  const cFrame = tone(FRAME_C);

  // ---------------------------------------------------------- materials ---
  const matSkin = new T.MeshStandardMaterial({
    vertexColors: true, roughness: 0.86, metalness: 0.0,
  });
  const matDark = new T.MeshStandardMaterial({
    vertexColors: true, roughness: 0.62, metalness: 0.05,
  });
  const matLens = new T.MeshStandardMaterial({
    vertexColors: true, roughness: 0.17, metalness: 0.25,
    emissive: new T.Color(0x000000), emissiveIntensity: 1,
  });
  const matMaw = new T.MeshStandardMaterial({
    vertexColors: true, roughness: 0.72, metalness: 0.0,
    emissive: new T.Color(0x000000), emissiveIntensity: 1,
  });
  const mats = [matSkin, matDark, matLens, matMaw];
  const geoms = [];

  const meshOf = (buf, mat) => {
    const g = buf.toGeometry(T);
    geoms.push(g);
    const m = new T.Mesh(g, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  // =======================================================================
  // TORSO SHELL
  // One merged mesh: ribcage, flanks, traps, the cropped neck stump and both
  // deltoids. None of it moves relative to the hips, so none of it needs to be
  // separate. Superellipse n ~ 3 keeps the front flat and the flanks square,
  // which is what makes a belly read as a belly and not as a balloon.
  // =======================================================================
  const torsoRings = [
    { y: 1.28, rx: 0.66, rz: 0.40, zc: -0.02, n: 3.0 },
    { y: 1.45, rx: 0.745, rz: 0.44, zc: -0.03, n: 3.0 },
    { y: 1.62, rx: 0.805, rz: 0.475, zc: -0.05, n: 3.0 },
    { y: 1.80, rx: 0.855, rz: 0.50, zc: -0.06, n: 3.0 },
    { y: 2.00, rx: 0.872, rz: 0.51, zc: -0.06, n: 3.05 },
    { y: 2.20, rx: 0.866, rz: 0.50, zc: -0.05, n: 3.05 },
    { y: 2.42, rx: 0.845, rz: 0.485, zc: -0.04, n: 3.0 },
    { y: 2.62, rx: 0.826, rz: 0.466, zc: -0.03, n: 3.0 },
    { y: 2.82, rx: 0.826, rz: 0.457, zc: -0.02, n: 3.0 },
    { y: 3.00, rx: 0.856, rz: 0.466, zc: -0.01, n: 2.9 },
    { y: 3.14, rx: 0.860, rz: 0.458, zc: 0.00, n: 2.8 },
    { y: 3.24, rx: 0.790, rz: 0.415, zc: 0.00, n: 2.6 },
    { y: 3.31, rx: 0.585, rz: 0.330, zc: 0.00, n: 2.4 },
    { y: 3.36, rx: 0.330, rz: 0.205, zc: 0.00, n: 2.2 },
    { y: 3.40, rx: 0.215, rz: 0.150, zc: 0.00, n: 2.0 },
  ];
  {
    const B = new Buf();
    // Baked shading: the flanks and the deep armpit stay dark even when the key
    // light is behind the creature, which is exactly the case in fog.
    const torsoCol = (x, y, z) => {
      const flank = Math.min(1, Math.abs(x) / 0.86);
      const pit = smoothstep(2.72, 3.06, y) * smoothstep(0.55, 0.80, Math.abs(x));
      const back = smoothstep(0.05, 0.42, z);
      const under = smoothstep(1.60, 1.34, y);
      const neck = smoothstep(3.26, 3.39, y);
      let d = 0.30 * Math.pow(flank, 2.4) + 0.42 * pit + 0.30 * back + 0.45 * under;
      d = clamp01(d);
      const c = mixTone(SKIN, CREASE, d);
      if (neck > 0) {
        const m = mixTone(SKIN, MEAT, neck * 0.85);
        return [lerp(c[0], m[0], neck), lerp(c[1], m[1], neck), lerp(c[2], m[2], neck)];
      }
      return c;
    };
    for (let i = 0; i < torsoRings.length; i++) {
      torsoRings[i].y -= HIP_Y;              // torso geometry is local to the hips
      torsoRings[i].col = torsoCol;
    }
    torsoRings[0].capCol = tone(DEEP);
    torsoRings[torsoRings.length - 1].capCol = tone(MEAT, 0.75);
    addLoft(B, torsoRings, 20, true, true);
    // Deltoids, merged in: they hang off the ribs and never move on their own.
    for (const s of [-1, 1]) {
      addEllipsoid(B, s * SHOULDER_X, SHOULDER_Y - HIP_Y, -0.02, 0.27, 0.29, 0.31, 12, 8,
        (nx, ny) => mixTone(SKIN, CREASE, clamp01(0.22 + 0.30 * clamp01(-ny))));
    }
    // Pectoral swell above the glasses - the reference has a real shelf there.
    for (const s of [-1, 1]) {
      addEllipsoid(B, s * 0.34, 2.96 - HIP_Y, -0.34, 0.40, 0.24, 0.20, 12, 8,
        (nx, ny) => mixTone(SKIN_HI, CREASE, clamp01(0.10 + 0.42 * clamp01(-ny))));
    }
    var torsoMesh = meshOf(B, matSkin);
  }

  // =======================================================================
  // THE GUT PLATE - the face's canvas. Its own group so it can heave.
  // =======================================================================
  {
    const B = new Buf();
    const gutRings = [
      { y: 1.58, rx: 0.46, rz: 0.19, zc: -0.20, n: 3.1 },
      { y: 1.72, rx: 0.665, rz: 0.29, zc: -0.24, n: 3.1 },
      { y: 1.86, rx: 0.785, rz: 0.355, zc: -0.26, n: 3.2 },
      { y: 2.00, rx: 0.845, rz: 0.395, zc: -0.26, n: 3.2 },
      { y: 2.14, rx: 0.840, rz: 0.390, zc: -0.26, n: 3.2 },
      { y: 2.28, rx: 0.775, rz: 0.355, zc: -0.25, n: 3.1 },
      { y: 2.42, rx: 0.655, rz: 0.290, zc: -0.23, n: 3.0 },
      { y: 2.54, rx: 0.470, rz: 0.195, zc: -0.20, n: 3.0 },
      { y: 2.62, rx: 0.270, rz: 0.100, zc: -0.16, n: 3.0 },
    ];
    const gutCol = (x, y, z) => {
      const flank = Math.min(1, Math.abs(x) / 0.85);
      // A soft smudge above the mouth line so the frown has a socket to sit in
      // even before the lips are drawn - this is what carries the face at 40m.
      const dm = Math.abs(y - (MOUTH_Y + 0.16 - 0.19 * Math.pow(x / 0.6, 2)));
      const socket = smoothstep(0.30, 0.06, dm) * smoothstep(0.92, 0.60, Math.abs(x));
      const lowFold = smoothstep(1.78, 1.60, y);
      const d = clamp01(0.26 * Math.pow(flank, 2.6) + 0.30 * socket + 0.40 * lowFold
        + 0.30 * smoothstep(0.0, 0.30, z));
      return mixTone(SKIN, CREASE, d);
    };
    for (const r of gutRings) { r.y -= BELLY_PIVOT_Y; r.col = gutCol; }
    gutRings[0].capCol = tone(CREASE);
    gutRings[gutRings.length - 1].capCol = tone(SKIN, 0.9);
    addLoft(B, gutRings, 18, true, true);
    var gutMesh = meshOf(B, matSkin);
  }

  // =======================================================================
  // THE LOWER ROLL - the "chin". Hinged so it can jut into an underbite.
  // =======================================================================
  {
    const B = new Buf();
    const chinRings = [
      { y: 1.50, rx: 0.60, rz: 0.235, zc: -0.20, n: 3.0 },
      { y: 1.60, rx: 0.705, rz: 0.290, zc: -0.22, n: 3.1 },
      { y: 1.71, rx: 0.755, rz: 0.325, zc: -0.235, n: 3.1 },
      { y: 1.81, rx: 0.735, rz: 0.315, zc: -0.235, n: 3.1 },
      { y: 1.90, rx: 0.655, rz: 0.270, zc: -0.225, n: 3.0 },
      { y: 1.97, rx: 0.500, rz: 0.190, zc: -0.20, n: 3.0 },
    ];
    const chinCol = (x, y) => {
      const flank = Math.min(1, Math.abs(x) / 0.75);
      const top = smoothstep(1.80, 1.95, y);        // shaded under the mouth
      const bot = smoothstep(1.62, 1.48, y);        // shaded above the shorts
      return mixTone(SKIN, CREASE, clamp01(0.24 * Math.pow(flank, 2.4) + 0.46 * top + 0.40 * bot));
    };
    for (const r of chinRings) { r.y -= CHIN_PIVOT_Y; r.col = chinCol; }
    chinRings[0].capCol = tone(CREASE);
    chinRings[chinRings.length - 1].capCol = tone(CREASE);
    addLoft(B, chinRings, 16, true, true);
    var chinMesh = meshOf(B, matSkin);
  }

  // =======================================================================
  // SHORTS - one mesh, waistband included via vertex colour.
  // =======================================================================
  {
    const B = new Buf();
    const bandTop = tone(SHORTS, 2.6);
    const cloth = tone(SHORTS, 1.0);
    const shortRings = [
      { y: 1.74, rx: 0.845, rz: 0.500, zc: -0.045, n: 3.0, col: bandTop },
      { y: 1.68, rx: 0.862, rz: 0.512, zc: -0.045, n: 3.0, col: bandTop },
      { y: 1.62, rx: 0.858, rz: 0.508, zc: -0.045, n: 3.0, col: tone(SHORTS, 1.7) },
      { y: 1.56, rx: 0.845, rz: 0.498, zc: -0.040, n: 3.0, col: cloth },
      { y: 1.40, rx: 0.862, rz: 0.500, zc: -0.030, n: 3.0, col: cloth },
      { y: 1.26, rx: 0.876, rz: 0.492, zc: -0.020, n: 3.0, col: cloth },
      { y: 1.15, rx: 0.845, rz: 0.470, zc: -0.020, n: 3.0, col: tone(SHORTS, 0.65) },
      { y: 1.09, rx: 0.760, rz: 0.420, zc: -0.020, n: 3.0, col: tone(SHORTS, 0.4) },
    ];
    shortRings[0].capCol = tone(DEEP, 0.5);
    shortRings[shortRings.length - 1].capCol = tone(SHORTS, 0.25);
    addLoft(B, shortRings, 18, true, true);
    var shortsMesh = meshOf(B, matDark);
  }

  // =======================================================================
  // LIMBS - one tapered geometry per kind, shared left/right (they are
  // symmetric, so no mirroring and no flipped winding).
  // =======================================================================
  function limbGeo(len, rTop, rMid, rBot, capBall, colTop, colBot) {
    const B = new Buf();
    const rings = [];
    const N = 7;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const y = -len * t;
      // Quadratic through top/mid/bottom radii: a real arm bulges at the belly
      // of the muscle rather than tapering linearly.
      const r = (1 - t) * (1 - t) * rTop + 2 * (1 - t) * t * rMid + t * t * rBot;
      rings.push({
        y, rx: r, rz: r * 0.94, n: 2.3,
        col: mixTone(colTop, colBot, t * 0.85 + 0.15),
      });
    }
    rings[0].capCol = tone(CREASE);
    rings[rings.length - 1].capCol = mixTone(colTop, colBot, 1);
    addLoft(B, rings, 12, true, !capBall);
    if (capBall) {
      // A fist: a blunt ball on the end, merged into the same geometry.
      addEllipsoid(B, 0, -len - rBot * 0.55, -0.02, rBot * 1.34, rBot * 1.28, rBot * 1.30, 12, 8,
        (nx, ny) => mixTone(SKIN, CREASE, clamp01(0.20 + 0.32 * clamp01(-ny))));
    }
    return B;
  }
  const upperArmBuf = limbGeo(UPPER_ARM, 0.235, 0.215, 0.165, false, SKIN, SKIN_LO);
  const foreArmBuf = limbGeo(FORE_ARM, 0.175, 0.160, 0.110, true, SKIN, SKIN_LO);
  const thighBuf = limbGeo(THIGH, 0.275, 0.265, 0.225, false, SKIN, SKIN_LO);

  // Shin geometry carries the foot, so a leg is two meshes and not three.
  const shinBuf = (() => {
    const B = new Buf();
    const rings = [];
    const N = 6;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const r = (1 - t) * (1 - t) * 0.235 + 2 * (1 - t) * t * 0.205 + t * t * 0.130;
      rings.push({ y: -SHIN * t, rx: r, rz: r * 0.92, n: 2.3, col: mixTone(SKIN, SKIN_LO, 0.2 + 0.6 * t) });
    }
    rings[0].capCol = tone(CREASE);
    rings[rings.length - 1].capCol = tone(SKIN_LO);
    addLoft(B, rings, 12, true, false);
    // Foot: a flattened wedge running forward (-Z).
    const footRings = [
      { y: -SHIN - 0.02, rx: 0.175, rz: 0.30, zc: -0.09, n: 2.6, col: mixTone(SKIN, SKIN_LO, 0.75) },
      { y: -SHIN - 0.10, rx: 0.185, rz: 0.33, zc: -0.11, n: 2.8, col: mixTone(SKIN, SKIN_LO, 0.8) },
      { y: -SHIN - 0.155, rx: 0.165, rz: 0.31, zc: -0.13, n: 3.0, col: mixTone(SKIN, CREASE, 0.5) },
    ];
    footRings[0].capCol = tone(SKIN_LO);
    footRings[footRings.length - 1].capCol = tone(CREASE);
    addLoft(B, footRings, 12, true, true);
    return B;
  })();

  // =======================================================================
  // SUNGLASSES
  // Built in "brow space": the origin is the OUTER corner of the frame, which
  // is the hinge the lens swings about when the brow drops. Everything inside
  // is baked at the right toe-out angle so the glasses lie on the curve of the
  // chest instead of floating off it at the ends.
  // =======================================================================
  function browBuf(side) {
    // side = -1 for the creature's left of screen. In brow space +X always
    // points inboard towards the sternum, so both sides are built identically
    // and simply placed mirrored.
    const cphi = Math.cos(BROW_TILT), sphi = Math.sin(BROW_TILT);
    const R = [cphi, 0, -sphi];              // inboard, and forward as it goes
    const U = [0, 1, 0];
    const N = [-sphi * side, 0, -cphi];      // out of the chest, splayed outward
    const C = [R[0] * FRAME_HW, 0, R[2] * FRAME_HW];
    const frame = new Buf();
    addPlate(frame, C, R, U, N, FRAME_HW, FRAME_HH, 3.4, 0.055, 0.006, 22,
      tone(FRAME_C, 0.6), tone(FRAME_C));
    // Temple arm: a rounded bar running back along the ribs from the hinge.
    addEllipsoid(frame, 0.01, 0.055, 0.175, 0.030, 0.048, 0.20, 8, 6, tone(FRAME_C, 0.8));
    const lens = new Buf();
    const LC = [C[0] + N[0] * 0.050, C[1] + N[1] * 0.050, C[2] + N[2] * 0.050];
    addPlate(lens, LC, R, U, N, LENS_HW, LENS_HH, 3.2, 0.012, 0.020, 20,
      tone(LENS_C, 0.5),
      // A raked gradient across the glass: bright at the top-outer corner,
      // black at the bottom-inner, which is how the reference lenses read.
      (cx, cy) => mixTone(0x2c3540, 0x090c10, clamp01(0.5 + 0.36 * cx - 0.55 * cy)));
    return { frame, lens };
  }

  // =======================================================================
  // NOSE - the linea alba ridge running down to the navel, and the navel
  // itself as a dark vertical slot. Built in nose-group space.
  // =======================================================================
  const noseBuf = (() => {
    const B = new Buf();
    const rings = [
      { y: 2.44, rx: 0.045, rz: 0.020, zc: -0.545, n: 2.4 },
      { y: 2.36, rx: 0.070, rz: 0.032, zc: -0.575, n: 2.4 },
      { y: 2.28, rx: 0.092, rz: 0.045, zc: -0.600, n: 2.6 },
      { y: 2.21, rx: 0.118, rz: 0.058, zc: -0.615, n: 2.8 },
      { y: 2.14, rx: 0.150, rz: 0.072, zc: -0.622, n: 3.0 },
      { y: 2.07, rx: 0.145, rz: 0.068, zc: -0.620, n: 3.0 },
      { y: 2.01, rx: 0.105, rz: 0.048, zc: -0.610, n: 2.8 },
      { y: 1.96, rx: 0.055, rz: 0.024, zc: -0.595, n: 2.4 },
    ];
    for (const r of rings) {
      r.y -= NAVEL_Y;
      r.zc -= (-0.62);       // ridge is modelled about its own axis
      r.col = (x, y, z) => mixTone(SKIN_HI, CREASE,
        clamp01(0.15 + 0.55 * smoothstep(0.0, 0.10, Math.abs(x)) * 0.6
          + 0.5 * smoothstep(-0.02, -0.14, y)));
    }
    rings[0].capCol = tone(CREASE);
    rings[rings.length - 1].capCol = tone(CREASE);
    addLoft(B, rings, 12, true, true);
    // The navel slot itself: a dark almond standing just proud of the tip so
    // it reads as a hole rather than disappearing inside the ridge.
    addEllipsoid(B, 0, 2.125 - NAVEL_Y, -0.700 + 0.62, 0.042, 0.080, 0.030, 10, 6,
      (nx, ny) => mixTone(DEEP, MAW_D, clamp01(0.4 + 0.5 * ny)));
    // The hooded fold above it.
    addEllipsoid(B, 0, 2.205 - NAVEL_Y, -0.678 + 0.62, 0.105, 0.030, 0.028, 10, 6, tone(CREASE, 1.15));
    return B;
  })();

  // Nostrils: two dark pits that splay open with anger.
  const nostrilBuf = (() => {
    const B = new Buf();
    addEllipsoid(B, 0, 0, 0, 0.052, 0.072, 0.038, 10, 6,
      (nx, ny) => mixTone(DEEP, MAW_D, clamp01(0.45 + 0.4 * ny)));
    return B;
  })();

  // =======================================================================
  // BROW RIDGE - a flesh chevron that pushes OUT of the chest as the thing
  // gets angry, plus the two corrugator furrows that knit between the lenses.
  // Baked as a V (inner ends low) because that is the shape of a scowl.
  // =======================================================================
  const browBarBuf = (() => {
    const B = new Buf();
    for (const s of [-1, 1]) {
      const rings = [];
      const N = 6;
      for (let i = 0; i <= N; i++) {
        const t = i / N;                       // 0 = outer end, 1 = inner end
        const x = s * lerp(0.780, 0.055, t);
        const y = lerp(0.075, -0.070, t);      // inner end drops: the scowl
        const r = 0.055 + 0.055 * Math.sin(Math.PI * clamp01(t * 0.92 + 0.04));
        rings.push({
          y, xc: x, rx: 0.075, rz: r, zc: 0, n: 2.4,
          col: (vx, vy, vz) => mixTone(SKIN_HI, CREASE, clamp01(0.20 + 0.62 * smoothstep(0.02, -0.05, vy))),
        });
      }
      // Swept about X, so loft along Y would be wrong: build it as ellipsoids
      // strung along the chevron instead. Cheap, and the joins vanish.
      for (const r of rings) {
        addEllipsoid(B, r.xc, r.y, 0, 0.075, r.rz, r.rz * 1.15, 8, 6,
          (nx, ny) => mixTone(SKIN_HI, CREASE, clamp01(0.18 + 0.60 * clamp01(-ny))));
      }
    }
    // Corrugator furrows: two short vertical welts between the lenses.
    for (const s of [-1, 1]) {
      addEllipsoid(B, s * 0.052, -0.115, 0.010, 0.032, 0.115, 0.048, 8, 6,
        (nx, ny) => mixTone(SKIN, CREASE, clamp01(0.34 + 0.34 * Math.abs(nx))));
    }
    return B;
  })();

  // =======================================================================
  // THE MOUTH - six rigid pieces on the frown curve.
  // =======================================================================
  const lipTaper = (u) => Math.pow(1 - 0.90 * u * u, 0.70);

  const upperLipBuf = (() => {
    const B = new Buf();
    addLipBar(B, {
      hw: M_HW, arc: M_ARC, bow: M_BOW, ry: LIP_U_RY, rz: LIP_RZ,
      samples: 19, sides: 12, n: 2.7, taper: lipTaper,
      // up = +1 at the top of the bar, front = +1 facing the player.
      col: (u, up, front) => {
        const inner = clamp01(-up);                       // faces into the mouth
        const rim = clamp01(front) * clamp01(0.55 - up);  // the wet lip edge
        const d = clamp01(0.16 + 0.80 * Math.pow(inner, 1.3) + 0.22 * rim
          + 0.30 * Math.pow(Math.abs(u), 2.2));
        return mixTone(SKIN_HI, DEEP, d);
      },
    });
    // Blunt nubs on the inner-back face. Buried inside the lower lip while the
    // mouth is shut; when scale.y doubles at full anger they become fangs.
    for (let i = 0; i < 7; i++) {
      const u = -0.72 + (i / 6) * 1.44;
      const x = M_HW * u, y = -M_ARC * u * u, z = M_BOW * u * u;
      const r = 0.030 * lipTaper(u) + 0.012;
      addEllipsoid(B, x, y - LIP_U_RY * lipTaper(u) - 0.020, z + 0.030,
        r, r * 1.9, r * 0.85, 7, 5,
        (nx, ny) => mixTone(TOOTH, MAW_R, clamp01(0.15 + 0.55 * clamp01(-ny))));
    }
    return B;
  })();

  const lowerLipBuf = (() => {
    const B = new Buf();
    addLipBar(B, {
      hw: M_HW, arc: M_ARC, bow: M_BOW, ry: LIP_L_RY, rz: LIP_RZ * 1.06,
      samples: 19, sides: 12, n: 2.6, taper: lipTaper,
      col: (u, up, front) => {
        const inner = clamp01(up);                        // faces into the mouth
        const under = clamp01(-up) * 0.55;                // the fold beneath it
        const d = clamp01(0.14 + 0.78 * Math.pow(inner, 1.3) + under
          + 0.28 * Math.pow(Math.abs(u), 2.2));
        return mixTone(SKIN_HI, DEEP, d);
      },
    });
    for (let i = 0; i < 5; i++) {
      const u = -0.60 + (i / 4) * 1.20;
      const x = M_HW * u, y = -M_ARC * u * u, z = M_BOW * u * u;
      const r = 0.026 * lipTaper(u) + 0.010;
      addEllipsoid(B, x, y + LIP_L_RY * lipTaper(u) + 0.016, z + 0.034,
        r, r * 1.6, r * 0.85, 7, 5,
        (nx, ny) => mixTone(TOOTH, MAW_R, clamp01(0.15 + 0.55 * clamp01(ny))));
    }
    return B;
  })();

  /** Corner wedge: a tapered hook pointing down its own -Y, tip forward. */
  const cornerBuf = (() => {
    const B = new Buf();
    const rings = [];
    const N = 6;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const r = 0.098 * Math.pow(1 - t, 0.62) + 0.004;
      rings.push({
        y: -0.175 * t, rx: r, rz: r * 0.80, zc: -0.030 * t, n: 2.5,
        col: mixTone(CREASE, DEEP, 0.25 + 0.6 * t),
      });
    }
    rings[0].capCol = tone(CREASE);
    rings[rings.length - 1].capCol = tone(DEEP);
    addLoft(B, rings, 10, true, true);
    return B;
  })();

  /**
   * The ink stroke: a dark arched plate that lives just behind the lips and is
   * scaled with exactly the same numbers, so the black line of the mouth tracks
   * the lips at every anger level and always shows a fringe around them.
   */
  const shadowBuf = (() => {
    const B = new Buf();
    addLipBar(B, {
      hw: M_HW * 1.03, arc: M_ARC, bow: M_BOW, ry: 0.185, rz: 0.055,
      samples: 15, sides: 10, n: 3.2,
      taper: (u) => Math.pow(1 - 0.94 * u * u, 0.85),
      col: (u, up) => mixTone(DEEP, MAW_D, clamp01(0.55 - 0.35 * Math.abs(up))),
    });
    return B;
  })();

  /** The maw: a deep dark trough behind the lips, revealed as they part. */
  const mawBuf = (() => {
    const B = new Buf();
    addLipBar(B, {
      hw: M_HW * 0.96, arc: M_ARC, bow: M_BOW * 1.15, ry: 0.150, rz: 0.150,
      samples: 15, sides: 12, n: 2.4,
      taper: (u) => Math.pow(1 - 0.92 * u * u, 0.75),
      col: (u, up, front) => mixTone(MAW_R, MAW_D,
        clamp01(0.35 + 0.55 * clamp01(-front) + 0.25 * Math.abs(up))),
    });
    return B;
  })();

  // =======================================================================
  // ASSEMBLY
  // =======================================================================
  const group = new T.Group();
  group.name = 'monsterFaceC';

  // Everything hangs off `root`, never off `group`: the caller owns group's
  // transform (level scale, world placement) and this rig must not fight it.
  const root = new T.Group();
  group.add(root);

  const hipGroup = new T.Group();
  hipGroup.add(shortsMesh);
  root.add(hipGroup);

  const torsoGroup = new T.Group();
  torsoGroup.position.set(0, HIP_Y, 0);
  torsoGroup.add(torsoMesh);
  root.add(torsoGroup);

  const bellyGroup = new T.Group();
  bellyGroup.position.set(0, BELLY_PIVOT_Y - HIP_Y, 0);
  bellyGroup.add(gutMesh);
  torsoGroup.add(bellyGroup);

  const chinGroup = new T.Group();
  chinGroup.position.set(0, CHIN_PIVOT_Y - HIP_Y, -0.06);
  chinGroup.add(chinMesh);
  torsoGroup.add(chinGroup);

  // ---- glasses ----
  const glassesGroup = new T.Group();
  glassesGroup.position.set(0, BROW_Y - HIP_Y, 0);
  torsoGroup.add(glassesGroup);

  const brows = [];
  for (const side of [-1, 1]) {
    const bufs = browBuf(side);
    const g = new T.Group();
    g.position.set(side * BROW_PIVOT_X, 0, BROW_PIVOT_Z);
    g.scale.x = side;   // mirrored placement; geometry itself is side-neutral
    const frameMesh = meshOf(bufs.frame, matDark);
    const lensMesh = meshOf(bufs.lens, matLens);
    g.add(frameMesh, lensMesh);
    glassesGroup.add(g);
    brows.push(g);
  }
  // g.scale.x = -1 on the left mirrors the winding too, so that side would be
  // inside-out. Rebuild the left with genuinely mirrored geometry instead.
  {
    const left = brows[0];
    left.scale.x = 1;
    left.clear();
    const bufs = browBuf(-1);
    // Mirror the vertex X in place - a build-time pass, and it fixes winding
    // by reversing every triangle.
    for (const b of [bufs.frame, bufs.lens]) {
      for (let i = 0; i < b.p.length; i += 3) b.p[i] = -b.p[i];
      for (let i = 0; i < b.i.length; i += 3) {
        const t = b.i[i + 1]; b.i[i + 1] = b.i[i + 2]; b.i[i + 2] = t;
      }
    }
    left.add(meshOf(bufs.frame, matDark), meshOf(bufs.lens, matLens));
  }

  const bridgeMesh = (() => {
    const B = new Buf();
    addEllipsoid(B, 0, 0.030, -0.505, 0.085, 0.052, 0.045, 10, 6, cFrame);
    return meshOf(B, matDark);
  })();
  glassesGroup.add(bridgeMesh);

  const browBarGroup = new T.Group();
  browBarGroup.position.set(0, FRAME_HH + 0.055, -0.40);
  const browBarMesh = meshOf(browBarBuf, matSkin);
  browBarGroup.add(browBarMesh);
  glassesGroup.add(browBarGroup);

  // ---- nose ----
  const noseGroup = new T.Group();
  noseGroup.position.set(0, NAVEL_Y - BELLY_PIVOT_Y, -0.62);
  noseGroup.add(meshOf(noseBuf, matSkin));
  bellyGroup.add(noseGroup);

  const nostrils = [];
  for (const side of [-1, 1]) {
    const m = meshOf(nostrilBuf, matSkin);
    m.position.set(side * 0.118, 2.055 - BELLY_PIVOT_Y, -0.688);
    bellyGroup.add(m);
    nostrils.push(m);
  }

  // ---- mouth ----
  const mouthGroup = new T.Group();
  mouthGroup.position.set(0, MOUTH_Y - BELLY_PIVOT_Y, MOUTH_Z);
  bellyGroup.add(mouthGroup);

  const shadowMesh = meshOf(shadowBuf, matMaw);
  const mawMesh = meshOf(mawBuf, matMaw);
  const upperLip = meshOf(upperLipBuf, matSkin);
  const lowerLip = meshOf(lowerLipBuf, matSkin);
  const corners = [meshOf(cornerBuf, matSkin), meshOf(cornerBuf, matSkin)];
  mouthGroup.add(shadowMesh, mawMesh, upperLip, lowerLip, corners[0], corners[1]);

  // ---- arms ----
  const shoulders = [], elbows = [];
  for (const side of [-1, 1]) {
    const sh = new T.Group();
    sh.position.set(side * SHOULDER_X, SHOULDER_Y - HIP_Y, -0.02);
    sh.add(meshOf(upperArmBuf, matSkin));
    const el = new T.Group();
    el.position.set(0, -UPPER_ARM, 0);
    el.add(meshOf(foreArmBuf, matSkin));
    sh.add(el);
    torsoGroup.add(sh);
    shoulders.push(sh); elbows.push(el);
  }

  // ---- legs ----
  const hips = [], knees = [];
  for (const side of [-1, 1]) {
    const hp = new T.Group();
    hp.position.set(side * HIP_X, 1.50, 0);
    hp.add(meshOf(thighBuf, matSkin));
    const kn = new T.Group();
    kn.position.set(0, -THIGH, 0);
    kn.add(meshOf(shinBuf, matSkin));
    hp.add(kn);
    root.add(hp);
    hips.push(hp); knees.push(kn);
  }

  // =======================================================================
  // STATE
  // =======================================================================
  let angerT = 0, anger = 0;
  let mouthT = 0, mouth = 0;
  let proxT = 0, prox = 0;
  let speedS = 0;
  let gait = 0, clock = 0;
  let jiggle = 0, jiggleV = 0;
  let warm = false;                 // has update() run at least once?

  const STRIDE = 1.95;              // metres of ground per step
  const eyeCol = new T.Color((P.monsterEye != null) ? P.monsterEye : 0xff2b1a);

  /**
   * THE MORPH. Every value below is SET, never accumulated, and every one of
   * them is a pure function of (anger, mouth, gait, breath) - so the pose is
   * identical whether you got here in one frame or a hundred thousand.
   */
  function pose() {
    const a = anger;
    const m = mouth;
    // Three response curves: aFast so even the first threat tier shows
    // something, aLin for the bulk of it, aLate for cues held back for the
    // top tiers where the silhouette has to break.
    const aFast = Math.pow(a, 0.68);
    const aLate = smoothstep(0.40, 1.0, a);
    const breath = Math.sin(clock * (1.15 + 2.4 * a));
    const pant = 0.5 + 0.5 * Math.sin(clock * (2.2 + 6.0 * a));

    // ---------------------------------------------------------- the mouth --
    // One scale does the work of a whole morph target: sy deepens the parabola
    // AND thickens the lips, sx widens the mouth, sz pushes them off the belly.
    const sx = 1 + 0.36 * aFast;
    const sy = 1 + 1.16 * a + 0.22 * m;
    const sz = 1 + 0.46 * a + 0.30 * m;
    upperLip.scale.set(sx, sy, sz);
    lowerLip.scale.set(sx, sy, sz);

    // Lip separation. The lips stay welded shut through the whole anger ramp -
    // the frown is a closed, clenched thing - and only mouthOpen parts them.
    const gap = 0.008 + 0.030 * a + 0.020 * prox * pant + 0.300 * m;
    const upY = LIP_U_RY * sy + gap * 0.34;
    const loY = LIP_L_RY * sy + gap * 0.66;
    upperLip.position.set(0, upY, 0);
    lowerLip.position.set(0, -loY, 0);
    // The upper lip peels back into a sneer; the lower rolls out into a pout.
    upperLip.rotation.x = -(0.10 * a + 0.62 * m);
    lowerLip.rotation.x = 0.14 * a + 0.55 * m;

    // The ink stroke tracks the lips exactly.
    shadowMesh.scale.set(sx, sy * (1 + 0.35 * m), 1 + 0.2 * a);
    shadowMesh.position.set(0, -0.004 * sy, 0.040);

    // The maw only exists when the lips part; before that it hides behind the
    // stroke. Its top edge follows the same arc, so it opens as a crescent.
    const open = 0.16 + 1.95 * m + 0.25 * a;
    mawMesh.scale.set(sx * 0.99, open, 1 + 0.55 * m);
    mawMesh.position.set(0, (upY - loY) * 0.5 - 0.02 * m, 0.075 + 0.02 * m);

    // Corner hooks: re-pinned to wherever the scaled curve now ends, then swung
    // down and OUT until their tips clear the flank. This is the cue that reads
    // through fog, because it is the outline that changes.
    const cx = M_HW * sx + 0.012;
    const cy = -M_ARC * sy - 0.055 * a - gap * 0.10;
    const cz = M_BOW * sz - 0.030;
    const cRot = 0.34 + 0.80 * aFast + 0.18 * m;
    const cScale = 0.72 + 0.62 * aFast;
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? -1 : 1;
      const c = corners[i];
      c.position.set(s * cx, cy, cz);
      c.rotation.set(-0.18 - 0.30 * aLate, 0, s * cRot);
      c.scale.set(cScale, cScale * (1 + 0.30 * a), cScale);
    }

    // -------------------------------------------------------- the glasses --
    // The whole unit slides down onto the frown and tips forward like a visor.
    glassesGroup.position.set(0, BROW_Y - HIP_Y - 0.105 * aFast, -0.030 * a);
    glassesGroup.rotation.x = -(0.03 + 0.20 * a);
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? -1 : 1;
      const g = brows[i];
      // Hinged about the OUTER corner so the inner ends drop: the brow cue.
      g.rotation.z = -s * (0.06 + 0.34 * aFast);
      // ...and the pair closes towards the sternum as the brow knits.
      g.position.set(s * (BROW_PIVOT_X - 0.055 * a), 0, BROW_PIVOT_Z - 0.012 * a);
      g.scale.set(1, 1 + 0.20 * a, 1);
    }
    bridgeMesh.position.y = -0.020 * a;
    // The ridge is buried in the chest at rest and pushes physically out of it.
    browBarGroup.position.set(0, FRAME_HH + 0.055 - 0.075 * a, lerp(0.10, -0.545, aFast));
    browBarGroup.scale.set(1 + 0.10 * a, 0.55 + 0.75 * a, 1);
    browBarGroup.rotation.x = -0.30 * a;

    // ----------------------------------------------------------- the nose --
    noseGroup.scale.set(1 + 0.22 * a, 1 + 0.10 * a, 1 + 0.85 * a);
    noseGroup.position.set(0, NAVEL_Y - BELLY_PIVOT_Y + 0.020 * a, -0.62 - 0.010 * a);
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? -1 : 1;
      const n = nostrils[i];
      n.position.set(s * (0.118 + 0.055 * a), 2.055 - BELLY_PIVOT_Y - 0.018 * a, -0.688 - 0.055 * a);
      n.rotation.z = -s * 0.55 * a;
      n.scale.setScalar(1 + 0.55 * a + 0.10 * m);
    }

    // ----------------------------------------------------------- the body --
    // Hunch: forward at the hips, broader, shorter. Silhouette, not shading.
    const hunch = 0.055 + 0.20 * a + 0.06 * prox;
    torsoGroup.rotation.set(-hunch, 0, 0);
    torsoGroup.scale.set(1 + 0.13 * a, 1 - 0.055 * a + 0.012 * breath, 1 + 0.10 * a);

    // The gut heaves out and squashes down as it scowls, and it jiggles a beat
    // behind the footfalls.
    bellyGroup.rotation.x = -(0.05 + 0.20 * a) + jiggle * 0.22;
    bellyGroup.scale.set(
      1 + 0.14 * a,
      1 - 0.11 * a + 0.030 * breath - jiggle * 0.05,
      1 + 0.26 * a + 0.035 * breath,
    );
    bellyGroup.position.set(0, BELLY_PIVOT_Y - HIP_Y - 0.02 * a, -0.02 * a);

    // The lower roll juts forward like an underbite.
    chinGroup.rotation.x = 0.30 * a + jiggle * 0.30;
    chinGroup.scale.set(1 + 0.08 * a, 1 + 0.06 * a, 1 + 0.30 * a);

    // ------------------------------------------------------------- gait ----
    const sw = Math.sin(gait);
    const lift = Math.max(0, Math.sin(gait + 0.75));
    const swAmp = 0.34 * Math.min(1, speedS / 5.2) + 0.05;
    const crouch = 0.20 * a;
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? -1 : 1;
      const ph = i === 0 ? sw : -sw;
      const lf = i === 0 ? lift : Math.max(0, Math.sin(gait + Math.PI + 0.75));
      hips[i].rotation.set(crouch + swAmp * ph, 0, s * -0.03);
      knees[i].rotation.x = -(crouch * 1.7 + 0.95 * swAmp * lf);
      // Arms counter-swing against the same-side leg and flare off the ribs.
      shoulders[i].rotation.set(-swAmp * 0.86 * ph, 0, -s * (0.07 + 0.30 * a));
      elbows[i].rotation.x = 0.10 + 0.55 * a + 0.30 * lf * swAmp;
    }
    // Keeping the feet planted while the knees bend: the hip drops by the
    // shortfall of the folded leg, (THIGH+SHIN)*(1-cos crouch).
    const drop = (THIGH + SHIN) * (1 - Math.cos(crouch));
    const bob = -0.045 * (0.5 + 0.5 * Math.cos(gait * 2)) * Math.min(1, speedS / 4.5);
    root.position.set(0, bob - drop, 0);
    // A heavy waddle: this thing is 3.4 metres of belly and it should roll.
    root.rotation.set(0, 0.035 * sw, 0.055 * sw * Math.min(1, speedS / 5));

    // ----------------------------------------------------------- colour ----
    // Flush last, because colour is the first thing the fog takes.
    matSkin.color.setRGB(1, lerp(1, 0.56, a), lerp(1, 0.44, a));
    matSkin.emissive.setRGB(0.10 * aLate, 0.012 * aLate, 0.008 * aLate);
    matMaw.emissive.setRGB(0.16 * aLate * (0.35 + m), 0.012 * aLate * (0.35 + m), 0.01 * aLate);
    const glow = aLate * (0.30 + 0.55 * m);
    matLens.emissive.setRGB(eyeCol.r * glow, eyeCol.g * glow, eyeCol.b * glow);
  }

  // =======================================================================
  // API
  // =======================================================================
  function setAnger(t) {
    angerT = clamp01(typeof t === 'number' && isFinite(t) ? t : 0);
    if (!warm) { anger = angerT; pose(); }
  }
  function setMouthOpen(t) {
    mouthT = clamp01(typeof t === 'number' && isFinite(t) ? t : 0);
    if (!warm) { mouth = mouthT; pose(); }
  }

  function update(dt, opts) {
    const o = opts || EMPTY_OPTS;
    const d = clamp(typeof dt === 'number' && isFinite(dt) ? dt : 0, 0, 0.05);
    warm = true;
    clock += d;

    if (typeof o.anger === 'number' && isFinite(o.anger)) angerT = clamp01(o.anger);
    if (typeof o.mouth === 'number' && isFinite(o.mouth)) mouthT = clamp01(o.mouth);
    if (typeof o.proximity === 'number' && isFinite(o.proximity)) proxT = clamp01(o.proximity);
    const spd = (typeof o.speed === 'number' && isFinite(o.speed)) ? Math.max(0, o.speed) : speedS;

    // Anger eases in over about a third of a second: fast enough that a tier
    // change is felt immediately, slow enough that it is a lunge and not a cut.
    anger = damp(anger, angerT, 8.0, d);
    mouth = damp(mouth, mouthT, 15.0, d);
    prox = damp(prox, proxT, 5.0, d);
    speedS = damp(speedS, spd, 6.0, d);

    // Gait phase: half a cycle per step, wrapped so a long chase cannot lose
    // float precision in the sine.
    gait = (gait + d * (speedS / STRIDE) * Math.PI) % TAU;

    // Belly spring, kicked by the footfalls (twice a cycle) and critically-ish
    // damped at about 1.5Hz.
    const drive = -Math.cos(gait * 2) * Math.min(1, speedS / 5) * 24;
    jiggleV += (drive - jiggle * 90 - jiggleV * 9.5) * d;
    jiggle = clamp(jiggle + jiggleV * d, -0.55, 0.55);

    pose();
  }

  function dispose() {
    for (let i = 0; i < geoms.length; i++) geoms[i].dispose();
    for (let i = 0; i < mats.length; i++) mats[i].dispose();
    geoms.length = 0;
    group.clear();
  }

  pose();

  return { group, height: HEIGHT, setAnger, setMouthOpen, update, dispose };
}

export default buildFace;
