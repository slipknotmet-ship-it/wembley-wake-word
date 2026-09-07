import * as THREE from 'three';
import { CONFIG as DEFAULT_CONFIG } from '../core/config.js';

/**
 * entities/monsterFace_b.js  -  THE PROTECTOR OF EMEEM LAND.
 *
 * A giant bare human torso that walks. There is no head: the face IS the body.
 *   - a pair of black sunglasses across the upper chest are the EYES
 *   - the navel is the NOSE
 *   - the crease of the belly fold under it is the MOUTH, turned down in a frown
 *   - arms hang at the sides, dark shorts at the waist
 *
 * ---------------------------------------------------------------------------
 * HOW THE FACE MOVES: MORPH TARGETS
 * ---------------------------------------------------------------------------
 * The whole torso is ONE BufferGeometry carrying two RELATIVE morph targets:
 *
 *   [0] SCOWL - the furious face. Frown arc twice as deep and half a metre
 *       wider, corners hooked down and pinched INTO the silhouette, lips
 *       thickened, corrugator furrows dug between the lenses, brow ridge,
 *       nostrils flared, chest and flanks swollen, traps risen, neck craned.
 *   [1] MAW - the belly fold torn open into a funnel: the aperture splits
 *       vertically, the interior drives 48cm back into the body and the lips
 *       curl 15cm out in front of the calm silhouette.
 *
 * Both are authored by running ONE parametric sculpt function over three
 * parameter sets (neutral / scowl / maw) and storing the differences. That is
 * the whole trick: the extremes are hand-tuned deliberately - placid at 0,
 * genuinely wrong at 1 - and every in-between is a GPU lerp that costs two
 * floats a frame instead of a thousand vertex writes.
 *
 * Morph normals are supplied alongside the positions (three r185 blends them
 * through the same DataArrayTexture), so the maw actually LIGHTS like a hole
 * instead of like a painted spot.
 *
 * ---------------------------------------------------------------------------
 * LEGIBILITY AT 40 METRES THROUGH FOG
 * ---------------------------------------------------------------------------
 * Colour dies in fog, so anger is spent on things that survive it:
 *   1. the frown corners are pinched laterally until they cut two NOTCHES into
 *      the body outline - a silhouette change, not a shading change;
 *   2. the mouth line is baked dark into the vertex colours, so the frown is a
 *      stroke of ink across the belly rather than a subtle crease;
 *   3. the whole animal swells sideways, hunches and rises at the traps;
 *   4. the sunglasses tilt into an angry brow - inner edges dropping - and the
 *      arms flare off the ribs;
 *   5. only then does the skin flush and the lenses take a red glow (additive,
 *      fog-exempt, so it is the last thing to disappear).
 *
 * BUDGET: 23 meshes over 16 geometries and 8 materials, ~4.3k triangles, of
 * which the torso is 2.2k because the torso is the entire performance. Every
 * scratch object is at module scope; update() allocates nothing and only SETS
 * transforms, so a ten minute chase cannot drift the pose by a millimetre.
 */

// The module-scope alias lets buildFace default its own THREE argument while
// still shadowing it inside the function body (tests inject their own).
const THREE_NS = THREE;

// --------------------------------------------------------------- scratch ---
// Nothing below is allowed to be constructed inside update().
const _colA = new THREE_NS.Color();
const _colB = new THREE_NS.Color();
const _vec = new THREE_NS.Vector3();
const _quat = new THREE_NS.Quaternion();
const _eul = new THREE_NS.Euler();
const _mtx = new THREE_NS.Matrix4();
const _scl = new THREE_NS.Vector3();
const EMPTY_OPTS = {};

const TAU = Math.PI * 2;

// ------------------------------------------------------------ small maths ---
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
const sq = (v) => v * v;
/** Unit-height gaussian: 1 at d = 0, ~0.37 at d = s. */
const gauss = (d, s) => Math.exp(-((d * d) / (s * s)));
function smoothstep(e0, e1, x) {
  const d = e1 - e0;
  const t = clamp01(d === 0 ? (x >= e1 ? 1 : 0) : (x - e0) / d);
  return t * t * (3 - 2 * t);
}
/** Frame-rate independent exponential approach. */
const damp = (cur, target, rate, dt) => lerp(cur, target, 1 - Math.exp(-rate * dt));
/** Deterministic 2D hash in [0,1) - the skin mottle must be identical every run. */
function hash2(a, b) {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Uniform Catmull-Rom through p1..p2, used to smooth the torso profile. */
function catmull(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t
    + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2
    + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

// ----------------------------------------------------------- proportions ---
// Everything is metres at scale 1, feet on y = 0, facing -Z.
const HEIGHT = 3.40;

const HIP_Y = 1.40;        // torso pivot: the lean has to happen at the hips
const KNEE_Y = 0.70;
const ANKLE_Y = 0.12;
const SHOULDER_Y = 2.98;

const BROW_Y = 2.885;      // sunglasses centre-line  (the EYES)
const NAVEL_Y = 2.36;      // navel                   (the NOSE)
const MOUTH_Y = 2.03;      // belly fold              (the MOUTH)

/**
 * Sunglasses. Sized off the reference: the frames span ~88% of the chest and
 * the bridge gap is about an eighth of a lens. Chest half-width at BROW_Y is
 * 0.735, so a 1.30m spread lands the outer corners just inboard of the flanks -
 * any wider and they wrap round the sides and stop reading as a face.
 */
const LENS_CX = 0.344;     // lens centre offset from the sternum
const LENS_W = 0.520;      // lens aperture
const LENS_H = 0.325;
const FRAME_T = 0.046;     // frame thickness around the aperture
const FRAME_STANDOFF = 0.035; // how far the frame's front face stands off the skin

// Torso profile control points: y, half-width (x), front depth, back depth and
// the superellipse exponent. Exponents below 1 bulge the cross-section out
// toward a rounded rectangle, which is what a human trunk actually is; the
// front depth exceeds the back everywhere below the ribs, which is the paunch.
const PROFILE = [
  //  y,    halfW, front, back,  exp
  [1.26, 0.300, 0.240, 0.240, 0.90], // buried inside the shorts
  [1.44, 0.560, 0.420, 0.380, 0.88],
  [1.64, 0.640, 0.500, 0.440, 0.86], // waist
  [1.84, 0.670, 0.550, 0.460, 0.86],
  [2.04, 0.685, 0.575, 0.470, 0.85], // widest paunch - the mouth lives here
  [2.24, 0.665, 0.555, 0.460, 0.84],
  [2.46, 0.645, 0.505, 0.455, 0.82], // ribs
  [2.70, 0.665, 0.475, 0.450, 0.80],
  [2.90, 0.735, 0.465, 0.440, 0.78], // pecs - widest point, the glasses line
  [3.10, 0.700, 0.432, 0.408, 0.80], // clavicles
  [3.34, 0.340, 0.245, 0.260, 0.88], // blunt neck stump. There is no head.
];
const BODY_BOT = PROFILE[0][0];
const BODY_TOP = PROFILE[PROFILE.length - 1][0];

// Tessellation. NU is even so the column set is mirror-symmetric about the
// sternum; a face whose halves disagree by half a column reads as broken.
const NU = 34;
const RINGS = 32;
/**
 * Column warp. phi = a - k*sin(a) is odd about both 0 and PI, so symmetry is
 * exact, and its derivative 1 - k*cos(a) is 0.38 at the front: the face gets
 * two and a half times the column density of the back for free.
 */
const U_WARP = 0.62;

// ------------------------------------------------------- sculpt parameters ---
/**
 * One field function, three parameter sets. NEUTRAL is the placid face from the
 * photograph; the other two are pure differences from it, which is exactly what
 * a relative morph target stores.
 */
const NEUTRAL = {
  // mouth - the belly fold
  mouthY: MOUTH_Y, mouthArc: 0.075, mouthHalfW: 0.460,
  creaseDepth: 0.042, creaseSig: 0.042,
  lipUp: 0.014, lipDn: 0.032, lipOff: 0.085, lipSig: 0.075,
  cornerPull: 0.018, cornerDepth: 0.020, cornerPinch: 0.000,
  // maw
  mawDepth: 0.000, jawDrop: 0.000, lipFlare: 0.000, mawRx: 0.470, mawRy: 0.210,
  // brow, behind the sunglasses
  browFurrow: 0.000, browRidge: 0.000,
  // navel - the nose
  navelDepth: 0.072, noseRidge: 0.024, nostril: 0.006,
  // torso detail
  sternum: 0.020, pecCrease: 0.022,
  // bulk
  chestSwell: 0.000, bellySwell: 0.000, flankSwell: 0.000, trapRise: 0.000, crane: 0.000,
};

/** [0] SCOWL. Everything an angry face does, transplanted onto a trunk. */
const SCOWL = {
  mouthY: MOUTH_Y - 0.015,
  // Corners hang 19cm below the centre and the mouth grows to 1.24m across -
  // wider than the shoulders. Any deeper and the frown falls behind the
  // waistband, which is where the face runs out of body to be made of.
  mouthArc: 0.190,
  mouthHalfW: 0.620,
  creaseDepth: 0.105, creaseSig: 0.050,
  lipUp: 0.052, lipDn: 0.082, lipOff: 0.105, lipSig: 0.082,
  cornerPull: 0.092, cornerDepth: 0.062, cornerPinch: 0.115,
  browFurrow: 0.052, browRidge: 0.048,
  navelDepth: 0.105, noseRidge: 0.072, nostril: 0.042,
  sternum: 0.038, pecCrease: 0.034,
  chestSwell: 0.070, bellySwell: 0.055, flankSwell: 0.098,
  trapRise: 0.075, crane: 0.070,
};

/** [1] MAW. Only the mouth region moves, so it stacks cleanly on the scowl. */
const MAW = {
  mawDepth: 0.480, jawDrop: 0.250, lipFlare: 0.105,
  mouthHalfW: 0.550,
  creaseDepth: 0.012,       // the fold is hauled open; the crease flattens out
  lipUp: 0.045, lipDn: 0.060, lipOff: 0.155, lipSig: 0.090,
};

const MORPH_SCOWL = 0;
const MORPH_MAW = 1;

// ------------------------------------------------------------- animation ---
const LEAN_IDLE = 0.045;    // radians of forward hip lean when calm
const LEAN_ANGER = 0.240;   // extra lean at full anger: a stalking hunch
const BOB_HEIGHT = 0.085;   // hip drop per footfall
const STRIDE_LENGTH = 1.35; // metres of ground per stride, sets the cadence
const BROW_TILT = 0.340;    // radians the lenses rotate into a scowl (~19 deg)

/**
 * Builds the Protector.
 *
 * @param {object} T THREE namespace (injected so the module is testable).
 * @param {object} C the game CONFIG.
 * @returns {{group: object, height: number, setAnger: Function,
 *            setMouthOpen: Function, update: Function, dispose: Function}}
 */
export function buildFace(T = THREE_NS, C = DEFAULT_CONFIG) {
  const PAL = (C && C.palette) || {};
  const shadows = !!(C && C.render && C.render.shadows);

  const geometries = [];
  const materials = [];
  const keepGeo = (g) => { geometries.push(g); return g; };
  const keepMat = (m) => { materials.push(m); return m; };

  // ======================================================== torso profile ===
  // Profile values are Catmull-Rom interpolated across the control points, but
  // the LOOKUP is by y: the keys are monotonic in height, so a bracket search
  // plus a local fraction gives a C1 silhouette with no banding.
  const prof = { hw: 0, front: 0, back: 0, exp: 0.85 };
  function profileAt(y) {
    const n = PROFILE.length;
    let i = 0;
    while (i < n - 2 && y > PROFILE[i + 1][0]) i++;
    const a = PROFILE[i];
    const b = PROFILE[i + 1];
    const span = b[0] - a[0];
    const t = span > 1e-6 ? clamp01((y - a[0]) / span) : 0;
    const p0 = PROFILE[i > 0 ? i - 1 : 0];
    const p3 = PROFILE[i + 2 < n ? i + 2 : n - 1];
    prof.hw = catmull(p0[1], a[1], b[1], p3[1], t);
    prof.front = catmull(p0[2], a[2], b[2], p3[2], t);
    prof.back = catmull(p0[3], a[3], b[3], p3[3], t);
    prof.exp = catmull(p0[4], a[4], b[4], p3[4], t);
    return prof;
  }

  /**
   * Superellipse cross-section. x = a*sgn(sin)|sin|^m with m < 1 pushes the
   * 45-degree corner OUT past the circle, which is the difference between a
   * barrel and a torso. phi = 0 faces -Z (the face), phi = PI is the back.
   */
  const S = { x: 0, y: 0, z: 0 };
  function surfacePoint(phi, y, out) {
    const p = profileAt(y);
    const s = Math.sin(phi);
    const c = Math.cos(phi);
    const m = p.exp;
    out.x = p.hw * Math.sign(s) * Math.pow(Math.abs(s), m);
    const depth = c >= 0 ? p.front : p.back;
    out.z = -depth * Math.sign(c) * Math.pow(Math.abs(c), m);
    out.y = y;
    return out;
  }

  // Outward normal by central differences of the two parametric tangents. The
  // features are displaced along THIS normal for every target, so the morph
  // deltas describe the face and nothing else.
  const _a = { x: 0, y: 0, z: 0 };
  const _b = { x: 0, y: 0, z: 0 };
  const _c = { x: 0, y: 0, z: 0 };
  const _d = { x: 0, y: 0, z: 0 };
  const N = { x: 0, y: 0, z: 0 };
  function surfaceNormal(phi, y, out) {
    const h = 0.012;
    surfacePoint(phi + h, y, _a);
    surfacePoint(phi - h, y, _b);
    surfacePoint(phi, y + h, _c);
    surfacePoint(phi, y - h, _d);
    const ux = _a.x - _b.x, uy = 0, uz = _a.z - _b.z;         // d/dphi
    const vx = _c.x - _d.x, vy = _c.y - _d.y, vz = _c.z - _d.z; // d/dy
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    // Sign convention: the outward normal must agree with the radial direction.
    if (nx * _a.x + nz * _a.z < 0) { nx = -nx; ny = -ny; nz = -nz; }
    const len = Math.hypot(nx, ny, nz) || 1;
    out.x = nx / len; out.y = ny / len; out.z = nz / len;
    return out;
  }

  // ============================================== the parametric face field ===
  const off = { x: 0, y: 0, z: 0 };
  /**
   * Evaluates one parameter set at a surface point. Returns the displacement
   * ALONG the outward normal; tangential and vertical motion goes into `off`.
   *
   * @param {object} pr parameter set (NEUTRAL / scowl / maw resolved)
   * @param {number} x  lateral position of the base surface point
   * @param {number} y  height of the base surface point
   * @param {number} fw "frontness": 1 on the face, 0 on the flanks and back
   * @param {number} fwWide the same, but reaching round onto the flanks - the
   *        corner terms need it, because the notch they cut is ON the outline
   *        and the outline is exactly where fw has already fallen to nothing
   */
  function faceField(pr, x, y, fw, fwWide) {
    off.x = 0; off.y = 0; off.z = 0;
    let n = 0;

    // ------------------------------------------------------------- MOUTH
    // The frown line hangs its corners BELOW its centre: yLine drops with the
    // square of the across-mouth coordinate, so the fold is an upside-down
    // parabola - the single most legible "this thing hates you" shape there is.
    const halfW = pr.mouthHalfW;
    const nx = x / halfW;
    const anx = Math.abs(nx);
    const yLine = pr.mouthY - pr.mouthArc * Math.min(nx * nx, 1.35);
    const dL = y - yLine;                              // metres above the line
    const lat = 1 - smoothstep(0.92, 1.38, anx);       // dies past the corners

    // the crease itself, cut in along the normal
    n -= pr.creaseDepth * gauss(dL, pr.creaseSig) * lat * fw;
    // lips: a thin roll above, a heavy overhanging fold of gut below
    n += (pr.lipUp * gauss(dL - pr.lipOff, pr.lipSig)
        + pr.lipDn * gauss(dL + pr.lipOff, pr.lipSig)) * lat * fw;

    // Corners. Hooked down, dug in, and pinched laterally toward the midline so
    // that at full anger the ends of the frown bite two notches out of the body
    // OUTLINE. Fog eats colour; it does not eat a notch.
    const corner = gauss(anx - 1.0, 0.30) * gauss(dL, 0.14) * fwWide;
    off.y -= pr.cornerPull * corner;
    off.x -= pr.cornerPinch * corner * Math.sign(x);
    n -= pr.cornerDepth * corner;

    // --------------------------------------------------------------- MAW
    if (pr.mawDepth > 0 || pr.jawDrop > 0) {
      const ax = x / pr.mawRx;
      const ay = (y - (pr.mouthY - 0.02)) / pr.mawRy;
      const r = Math.sqrt(ax * ax + ay * ay);          // 1 at the aperture rim
      const inside = Math.max(0, 1 - r * r);
      // funnel: deepest at the centre, driven back into the body
      n -= pr.mawDepth * Math.pow(inside, 1.1) * fw;
      // The aperture SPLITS: flesh above the line rides up, flesh below rides
      // down. Depth alone reads as a stain; the vertical split is what reads as
      // a mouth coming open. It is deliberately lopsided, because this thing's
      // chin is the waistband of its shorts and its nose is only 33cm above the
      // fold: the gape is biased upward so it eats its own navel before it
      // reaches the elastic, which is the correct thing for it to do.
      const split = ay < -1 ? -1 : ay > 1 ? 1 : ay;
      const asym = split > 0 ? 1.12 : 0.88;
      off.y += pr.jawDrop * split * asym * (1 - smoothstep(1.0, 2.1, r)) * fw;
      // lips curl outward around the rim: a snarl, not a hole
      n += pr.lipFlare * gauss(r - 1.05, 0.42) * fw;
    }

    // -------------------------------------------------------------- BROW
    // Two vertical furrows over the sternum notch between the lenses. On a real
    // face this is the corrugator, and it is the cue people read as ANGER
    // before they read the mouth at all.
    if (pr.browFurrow > 0) {
      n -= pr.browFurrow * gauss(Math.abs(x) - 0.075, 0.055)
         * gauss(y - BROW_Y, 0.115) * fw;
    }
    if (pr.browRidge > 0) {
      n += pr.browRidge * gauss(y - (BROW_Y + 0.16), 0.115)
         * (1 - smoothstep(0.18, 0.62, Math.abs(x))) * fw;
    }

    // -------------------------------------------------------------- NOSE
    // The navel is a tight round pit; the linea alba above it swells into
    // something the eye happily accepts as a bridge.
    const dn = Math.sqrt(sq(x / 0.085) + sq((y - NAVEL_Y) / 0.105));
    n -= pr.navelDepth * Math.exp(-dn * dn) * fw;
    n += pr.noseRidge * gauss(x, 0.14) * gauss(y - (NAVEL_Y + 0.17), 0.20) * fw;
    // nostrils: two pits either side of the navel, only ever open in the scowl
    n -= pr.nostril * gauss(Math.abs(x) - 0.13, 0.055)
       * gauss(y - (NAVEL_Y + 0.015), 0.065) * fw;

    // ------------------------------------------------------------ DETAIL
    n -= pr.sternum * gauss(x, 0.055)
       * (smoothstep(2.40, 2.62, y) - smoothstep(3.06, 3.26, y)) * fw;
    // pec creases arc upward as they run outboard, like the underside of a chest
    const pecY = 2.66 + 0.16 * sq(Math.min(1, Math.abs(x) / 0.55));
    n -= pr.pecCrease * gauss(y - pecY, 0.055)
       * smoothstep(0.12, 0.34, Math.abs(x))
       * (1 - smoothstep(0.50, 0.70, Math.abs(x))) * fw;

    // -------------------------------------------------------------- BULK
    // Anger inflates the animal. The flank term rides (1 - fw) so it pushes
    // along the SIDEWAYS normal: the thing gets wider, which is a silhouette
    // change and therefore survives the fog.
    n += pr.chestSwell * gauss(y - 2.86, 0.30) * fw;
    n += pr.bellySwell * gauss(y - 2.10, 0.34) * fw;
    n += pr.flankSwell * gauss(y - 2.24, 0.60) * (1 - fw);
    off.y += pr.trapRise * smoothstep(2.92, 3.30, y);
    off.z -= pr.crane * smoothstep(2.80, BODY_TOP, y);

    return n;
  }

  // Resolve the two extremes into full parameter sets once, so faceField never
  // has to think about which keys an override happens to carry.
  const P_NEUTRAL = NEUTRAL;
  const P_SCOWL = Object.assign({}, NEUTRAL, SCOWL);
  const P_MAW = Object.assign({}, NEUTRAL, MAW);

  // ========================================================= torso geometry ===
  /**
   * Ring heights come from a density function integrated at build time: the
   * mouth band gets ~2.5x the vertical sampling of the back so a 4cm crease is
   * resolved by three rings instead of falling between two.
   */
  const ringY = new Float64Array(RINGS + 1);
  {
    const STEPS = 512;
    const cdf = new Float64Array(STEPS + 1);
    const dy = (BODY_TOP - BODY_BOT) / STEPS;
    let acc = 0;
    for (let s = 0; s <= STEPS; s++) {
      const y = BODY_BOT + s * dy;
      const density = 1
        + 2.4 * gauss(y - MOUTH_Y, 0.20)
        + 1.2 * gauss(y - NAVEL_Y, 0.16)
        + 0.9 * gauss(y - BROW_Y, 0.22);
      acc += density;
      cdf[s] = acc;
    }
    const total = cdf[STEPS];
    let cursor = 0;
    for (let i = 0; i <= RINGS; i++) {
      const want = (i / RINGS) * total;
      while (cursor < STEPS && cdf[cursor] < want) cursor++;
      // linear inverse-lookup inside the bucket we landed in
      const lo = cursor > 0 ? cdf[cursor - 1] : 0;
      const hi = cdf[cursor];
      const f = hi > lo ? (want - lo) / (hi - lo) : 0;
      ringY[i] = BODY_BOT + ((cursor - 1) + f) * dy;
    }
    ringY[0] = BODY_BOT;
    ringY[RINGS] = BODY_TOP;
  }

  const phiOf = new Float64Array(NU);
  for (let j = 0; j < NU; j++) {
    const a = (TAU * j) / NU;
    phiOf[j] = a - U_WARP * Math.sin(a); // odd about 0 and PI -> exact symmetry
  }

  const ringVerts = (RINGS + 1) * NU;
  const vertCount = ringVerts + 2;           // + two cap centres
  const basePos = new Float32Array(vertCount * 3);
  const scowlPos = new Float32Array(vertCount * 3);
  const mawPos = new Float32Array(vertCount * 3);
  const colors = new Float32Array(vertCount * 3);

  /** Writes S + N*field + off for one parameter set into a target array. */
  function writeTarget(arr, at, sx, sy, sz, nx, ny, nz, pr, fw, fwWide) {
    const n = faceField(pr, sx, sy, fw, fwWide);
    arr[at] = sx + nx * n + off.x;
    arr[at + 1] = sy + ny * n + off.y;
    arr[at + 2] = sz + nz * n + off.z;
  }

  /**
   * Vertex colours are the static half of the look: baked creases, a top-down
   * ambient gradient, body hair, and - critically - a dark stroke along the
   * mouth line. They are pure MULTIPLIERS, so the dynamic flush lives in
   * material.color and the two compose without a second bake.
   */
  function bakeColor(at, x, y, fw, i, j) {
    let sh = 1;
    // ambient: the underside of a paunch never sees the sky
    sh *= 0.78 + 0.22 * smoothstep(1.25, 3.05, y);
    // the flanks turn away from the light and sit under the arms
    sh *= 1 - 0.24 * (1 - fw);

    // creases, using the neutral field's own shapes
    const nx = x / P_NEUTRAL.mouthHalfW;
    const yLine = P_NEUTRAL.mouthY - P_NEUTRAL.mouthArc * Math.min(nx * nx, 1.35);
    const dL = y - yLine;
    const lat = 1 - smoothstep(0.92, 1.38, Math.abs(nx));
    const creaseAO = 0.46 * gauss(dL, 0.045) * lat * fw;
    sh *= 1 - 0.74 * Math.exp(-(sq(x / 0.100) + sq((y - NAVEL_Y) / 0.120)));
    sh *= 1 - 0.30 * gauss(x, 0.05)
        * (smoothstep(2.42, 2.62, y) - smoothstep(3.06, 3.26, y)) * fw;

    // The maw interior, pre-blackened. At rest it is a soft shadow inside the
    // fold; once the morph hauls those same vertices 40cm into the body it is
    // the throat, and it costs nothing per frame because it travels with them.
    const ar = Math.sqrt(sq(x / P_MAW.mawRx) + sq((y - (MOUTH_Y - 0.02)) / P_MAW.mawRy));
    const throat = 0.70 * Math.pow(Math.max(0, 1 - ar * ar), 2.4) * fw;
    sh *= 1 - Math.max(creaseAO, throat);

    // ---- body hair
    let hair = gauss(x, 0.30) * gauss(y - 3.06, 0.16) * 1.10;          // chest thatch
    hair += gauss(x, 0.055)                                             // trail
      * (smoothstep(1.60, 1.92, y) - smoothstep(2.28, 2.50, y)) * 1.05;
    // a band of coarse hair along the fold: this is what turns the frown into a
    // readable STROKE at forty metres instead of a soft shadow
    hair += gauss(dL + 0.015, 0.052) * lat * 0.45 * fw;
    hair += gauss(y - 2.20, 0.30) * 0.22 * fw;                          // dusting
    hair *= 0.55 + 0.90 * hash2(i * 7 + 3, j * 13 + 5);                 // ragged edges
    hair = clamp01(hair);

    const mottle = 0.90 + 0.10 * hash2(i + 91, j + 17);
    const s2 = clamp01(sh * mottle);
    colors[at] = lerp(s2, s2 * 0.36, hair);
    colors[at + 1] = lerp(s2, s2 * 0.31, hair);
    colors[at + 2] = lerp(s2, s2 * 0.28, hair);
  }

  for (let i = 0; i <= RINGS; i++) {
    const y = ringY[i];
    for (let j = 0; j < NU; j++) {
      const phi = phiOf[j];
      surfacePoint(phi, y, S);
      surfaceNormal(phi, y, N);
      // "Frontness" from the normal rather than from phi, so it stays honest
      // wherever the profile changes shape. 1 across the face, 0 on the flanks.
      const fw = smoothstep(0.10, 0.58, -N.z);
      const fwWide = smoothstep(-0.34, 0.24, -N.z);
      const at = (i * NU + j) * 3;
      writeTarget(basePos, at, S.x, S.y, S.z, N.x, N.y, N.z, P_NEUTRAL, fw, fwWide);
      writeTarget(scowlPos, at, S.x, S.y, S.z, N.x, N.y, N.z, P_SCOWL, fw, fwWide);
      writeTarget(mawPos, at, S.x, S.y, S.z, N.x, N.y, N.z, P_MAW, fw, fwWide);
      bakeColor(at, S.x, S.y, fw, i, j);
    }
  }

  // Cap centres. fw = 0 kills the face terms; the trap/crane terms are keyed on
  // height alone, so the neck stump still swells and cranes with the scowl.
  const capBot = ringVerts;
  const capTop = ringVerts + 1;
  {
    const sets = [[basePos, P_NEUTRAL], [scowlPos, P_SCOWL], [mawPos, P_MAW]];
    for (let k = 0; k < sets.length; k++) {
      const arr = sets[k][0];
      const pr = sets[k][1];
      writeTarget(arr, capBot * 3, 0, BODY_BOT - 0.06, 0, 0, -1, 0, pr, 0, 0);
      writeTarget(arr, capTop * 3, 0, BODY_TOP + 0.04, -0.02, 0, 1, 0, pr, 0, 0);
    }
    colors[capBot * 3] = 0.55; colors[capBot * 3 + 1] = 0.50; colors[capBot * 3 + 2] = 0.48;
    colors[capTop * 3] = 0.62; colors[capTop * 3 + 1] = 0.56; colors[capTop * 3 + 2] = 0.54;
  }

  // Indices. Columns wrap with a modulo instead of a duplicated seam column, so
  // the seam shares vertices and computeVertexNormals smooths straight across
  // it. Winding: (a, c, b) is counter-clockwise seen from outside, checked
  // against the front quad where the outward normal is -Z.
  const idx = new Uint16Array(RINGS * NU * 6 + NU * 6);
  let ip = 0;
  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < NU; j++) {
      const j2 = (j + 1) % NU;
      const a = i * NU + j;
      const b = i * NU + j2;
      const c = (i + 1) * NU + j;
      const d = (i + 1) * NU + j2;
      idx[ip++] = a; idx[ip++] = c; idx[ip++] = b;
      idx[ip++] = b; idx[ip++] = c; idx[ip++] = d;
    }
  }
  for (let j = 0; j < NU; j++) {
    const j2 = (j + 1) % NU;
    idx[ip++] = capBot; idx[ip++] = j; idx[ip++] = j2;                       // down
    idx[ip++] = capTop; idx[ip++] = RINGS * NU + j2; idx[ip++] = RINGS * NU + j; // up
  }

  const geoTorso = keepGeo(new T.BufferGeometry());
  geoTorso.setIndex(new T.BufferAttribute(idx, 1));
  geoTorso.setAttribute('position', new T.BufferAttribute(basePos, 3));
  geoTorso.setAttribute('color', new T.BufferAttribute(colors, 3));
  geoTorso.computeVertexNormals();

  // ------------------------------------------------- morph attribute build ---
  /**
   * Relative morph targets: three.js adds `target * influence` straight onto
   * the base, so influences compose without the base-influence bookkeeping that
   * absolute targets need, and scowl + maw can both be 1 at once.
   *
   * Normals are diffed the same way. Without them the maw would light like a
   * flat decal - with them it lights like a hole, which is the entire point of
   * opening one.
   */
  const baseNrm = geoTorso.attributes.normal.array;
  function makeMorph(targetPos, name) {
    const tmp = new T.BufferGeometry();
    tmp.setIndex(new T.BufferAttribute(idx, 1));
    tmp.setAttribute('position', new T.BufferAttribute(targetPos, 3));
    tmp.computeVertexNormals();
    const tn = tmp.attributes.normal.array;
    const dPos = new Float32Array(vertCount * 3);
    const dNrm = new Float32Array(vertCount * 3);
    for (let k = 0; k < vertCount * 3; k++) {
      dPos[k] = targetPos[k] - basePos[k];
      dNrm[k] = tn[k] - baseNrm[k];
    }
    tmp.dispose();
    const pa = new T.BufferAttribute(dPos, 3);
    const na = new T.BufferAttribute(dNrm, 3);
    pa.name = name;
    na.name = name;
    return { pa, na };
  }
  const mScowl = makeMorph(scowlPos, 'scowl');
  const mMaw = makeMorph(mawPos, 'maw');
  geoTorso.morphTargetsRelative = true;
  geoTorso.morphAttributes.position = [mScowl.pa, mMaw.pa];
  geoTorso.morphAttributes.normal = [mScowl.na, mMaw.na];
  geoTorso.computeBoundingSphere();
  // The bounding sphere is computed from the base pose; the scowl swells the
  // body by up to 9cm, so pad it or the thing culls at the screen edge mid-roar.
  if (geoTorso.boundingSphere) geoTorso.boundingSphere.radius += 0.45;

  // ============================================================= materials ===
  const skinBase = new T.Color(PAL.hand !== undefined ? PAL.hand : 0xf6c9a8);
  skinBase.multiplyScalar(0.92);                       // torso skin, not a hand
  const skinFlush = skinBase.clone().lerp(
    new T.Color(PAL.monsterEye !== undefined ? PAL.monsterEye : 0xff2b1a), 0.46);
  const limbBase = skinBase.clone().multiplyScalar(0.88);
  const limbFlush = skinFlush.clone().multiplyScalar(0.88);
  const eyeColor = new T.Color(PAL.monsterEye !== undefined ? PAL.monsterEye : 0xff2b1a);
  const shortsColor = new T.Color(PAL.monster !== undefined ? PAL.monster : 0x2b1220);

  const matSkin = keepMat(new T.MeshStandardMaterial({
    color: skinBase.clone(), vertexColors: true, roughness: 0.88, metalness: 0.0,
  }));
  const matLimb = keepMat(new T.MeshStandardMaterial({
    color: limbBase.clone(), roughness: 0.92, metalness: 0.0,
  }));
  const matShorts = keepMat(new T.MeshStandardMaterial({
    color: shortsColor.clone(), roughness: 0.98, metalness: 0.0,
  }));
  const matBand = keepMat(new T.MeshStandardMaterial({
    color: shortsColor.clone().multiplyScalar(1.9), roughness: 0.95, metalness: 0.0,
  }));
  const matFrame = keepMat(new T.MeshStandardMaterial({
    color: 0x14141a, roughness: 0.42, metalness: 0.05,
  }));
  const matLens = keepMat(new T.MeshStandardMaterial({
    color: 0x0b0d12, roughness: 0.14, metalness: 0.45,
    emissive: eyeColor.clone(), emissiveIntensity: 0.0,
  }));
  // Additive, fog-exempt: at full dread this is the last thing you can still
  // see of it, two red coals behind the lenses.
  const matGlow = keepMat(new T.MeshBasicMaterial({
    color: eyeColor.clone(), transparent: true, opacity: 0.0, depthWrite: false,
    blending: T.AdditiveBlending, fog: false, side: T.DoubleSide,
    vertexColors: true,
  }));
  const matTooth = keepMat(new T.MeshStandardMaterial({
    color: 0xd8c9b0, roughness: 0.55, metalness: 0.0, flatShading: true,
  }));

  // ================================================================ rig ====
  const group = new T.Group();
  group.name = 'monsterFace_b';

  // rig carries the walk (bob + roll) for the whole animal including the legs.
  const rig = new T.Group();
  group.add(rig);

  // torso pivots at the HIPS, so the lean tips the body over its own feet
  // instead of driving the leading foot through the floor.
  const torso = new T.Group();
  torso.position.y = HIP_Y;
  rig.add(torso);

  const torsoMesh = new T.Mesh(geoTorso, matSkin);
  torsoMesh.position.y = -HIP_Y;   // geometry is authored in feet-origin metres
  torsoMesh.castShadow = shadows;
  torso.add(torsoMesh);
  const influences = torsoMesh.morphTargetInfluences; // [scowl, maw]

  // ------------------------------------------------------------- clothing ---
  /**
   * The shorts are lofted with the SAME superellipse cross-section as the body,
   * a couple of centimetres proud of it, so the fabric hugs the hips instead of
   * intersecting them the way a plain cylinder would. They hang off `rig`, not
   * off `torso`: the waistband belongs to the legs, and the torso's bottom cap
   * slides around inside it as the body leans.
   */
  function buildSleeve(keys, segs) {
    const rows = keys.length;
    const pos = new Float32Array(rows * segs * 3);
    const ind = new Uint16Array((rows - 1) * segs * 6);
    let q = 0;
    for (let r = 0; r < rows; r++) {
      const k = keys[r];
      for (let j = 0; j < segs; j++) {
        const a = (TAU * j) / segs;
        const phi = a - 0.25 * Math.sin(a);
        const s = Math.sin(phi);
        const c = Math.cos(phi);
        const at = (r * segs + j) * 3;
        pos[at] = k[1] * Math.sign(s) * Math.pow(Math.abs(s), k[4]);
        pos[at + 1] = k[0];
        pos[at + 2] = -(c >= 0 ? k[2] : k[3]) * Math.sign(c) * Math.pow(Math.abs(c), k[4]);
      }
    }
    // rows are authored top-down, so the winding is the mirror of the torso's
    for (let r = 0; r < rows - 1; r++) {
      for (let j = 0; j < segs; j++) {
        const j2 = (j + 1) % segs;
        const A = r * segs + j, B = r * segs + j2;
        const Cc = (r + 1) * segs + j, D = (r + 1) * segs + j2;
        ind[q++] = A; ind[q++] = B; ind[q++] = Cc;
        ind[q++] = B; ind[q++] = D; ind[q++] = Cc;
      }
    }
    const g = new T.BufferGeometry();
    g.setIndex(new T.BufferAttribute(ind, 1));
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return keepGeo(g);
  }

  const geoShorts = buildSleeve([
    //  y,   halfW, front, back,  exp
    [1.48, 0.700, 0.560, 0.520, 0.85],
    [1.32, 0.720, 0.575, 0.535, 0.86],
    [1.14, 0.700, 0.550, 0.510, 0.88],
    [1.00, 0.640, 0.500, 0.475, 0.90],
    [0.88, 0.590, 0.455, 0.445, 0.92],
  ], 20);
  const shorts = new T.Mesh(geoShorts, matShorts);
  shorts.castShadow = shadows;
  rig.add(shorts);

  const geoBand = buildSleeve([
    [1.50, 0.712, 0.572, 0.532, 0.85],
    [1.40, 0.722, 0.580, 0.540, 0.85],
    [1.34, 0.706, 0.566, 0.526, 0.85],
  ], 20);
  const band = new T.Mesh(geoBand, matBand);
  band.castShadow = false;
  rig.add(band);

  // ----------------------------------------------------------------- legs ---
  const THIGH_LEN = HIP_Y - KNEE_Y;      // 0.70
  const SHIN_LEN = KNEE_Y - ANKLE_Y;     // 0.58
  const geoThigh = keepGeo(new T.CapsuleGeometry(0.215, THIGH_LEN - 0.10, 3, 8));
  const geoShin = keepGeo(new T.CapsuleGeometry(0.170, SHIN_LEN - 0.08, 3, 8));
  const geoFoot = keepGeo(new T.BoxGeometry(0.30, 0.16, 0.56));
  const geoUpperArm = keepGeo(new T.CapsuleGeometry(0.190, 0.60, 3, 8));
  const geoForearm = keepGeo(new T.CapsuleGeometry(0.158, 0.54, 3, 8));
  const geoHand = keepGeo(new T.SphereGeometry(1, 8, 6));

  function makeLeg(side) {
    const hip = new T.Group();
    hip.position.set(side * 0.285, HIP_Y, 0.02);
    rig.add(hip);

    const thigh = new T.Mesh(geoThigh, matLimb);
    thigh.position.y = -THIGH_LEN * 0.5;
    thigh.castShadow = shadows;
    hip.add(thigh);

    const knee = new T.Group();
    knee.position.y = -THIGH_LEN;
    hip.add(knee);

    const shin = new T.Mesh(geoShin, matLimb);
    shin.position.y = -SHIN_LEN * 0.5;
    shin.castShadow = shadows;
    knee.add(shin);

    const foot = new T.Mesh(geoFoot, matLimb);
    foot.position.set(0, -SHIN_LEN - 0.03, -0.14);
    foot.castShadow = shadows;
    knee.add(foot);

    return { hip, knee, foot };
  }
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  // ----------------------------------------------------------------- arms ---
  function makeArm(side) {
    const shoulder = new T.Group();
    shoulder.position.set(side * 0.735, SHOULDER_Y - HIP_Y, -0.02);
    torso.add(shoulder);

    const upper = new T.Mesh(geoUpperArm, matLimb);
    upper.position.y = -0.36;
    upper.castShadow = shadows;
    shoulder.add(upper);

    const elbow = new T.Group();
    elbow.position.y = -0.72;
    shoulder.add(elbow);

    const fore = new T.Mesh(geoForearm, matLimb);
    fore.position.y = -0.33;
    fore.castShadow = shadows;
    elbow.add(fore);

    const hand = new T.Mesh(geoHand, matLimb);
    hand.scale.set(0.155, 0.22, 0.120);
    hand.position.y = -0.78;
    hand.castShadow = shadows;
    elbow.add(hand);

    return { shoulder, elbow };
  }
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // =========================================================== sunglasses ===
  /**
   * Rounded-rect outline sampled WITH its outward normal. Offsetting every
   * point along its own normal gives an exactly parallel outline, which is what
   * lets the frame be built as quad strips instead of a triangulated annulus -
   * and quad strips are what keep every chord short enough to follow the chest.
   */
  function roundRectRim(w, h, r, seg) {
    const hx = Math.max(0, w * 0.5 - r);
    const hy = Math.max(0, h * 0.5 - r);
    // four quarter-arcs walked counter-clockwise from the bottom-right corner;
    // the straight edges fall out as the chords between consecutive arcs
    const cx = [hx, hx, -hx, -hx];
    const cy = [-hy, hy, hy, -hy];
    const a0 = [-Math.PI * 0.5, 0, Math.PI * 0.5, Math.PI];
    const pts = [];
    for (let c = 0; c < 4; c++) {
      for (let t = 0; t <= seg; t++) {
        const a = a0[c] + (Math.PI * 0.5 * t) / seg;
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        pts.push({ x: cx[c] + r * nx, y: cy[c] + r * ny, nx, ny });
      }
    }
    return pts;
  }

  /**
   * The frame: a rounded-rect ring of the given thickness, extruded back into
   * the chest, plus half a bridge bar reaching in toward the sternum. Built by
   * hand rather than extruded from a Shape because ExtrudeGeometry triangulates
   * a ring with long chords across it, and a chord long enough to span the rim
   * dips further than the frame stands proud - the chest then bites pieces out
   * of the glasses in three-quarter view.
   */
  function buildFrameGeo(side, wIn, hIn, rIn, t, depth, barW, barH) {
    const rim = roundRectRim(wIn, hIn, rIn, 4);
    const N = rim.length;
    const pos = [];
    const ind = [];
    const put = (x, y, z) => { pos.push(x, y, z); return pos.length / 3 - 1; };
    const inF = [], outF = [], inB = [], outB = [];
    for (let j = 0; j < N; j++) {
      const q = rim[j];
      inF.push(put(q.x, q.y, 0));
      outF.push(put(q.x + q.nx * t, q.y + q.ny * t, 0));
      inB.push(put(q.x, q.y, depth));
      outB.push(put(q.x + q.nx * t, q.y + q.ny * t, depth));
    }
    for (let j = 0; j < N; j++) {
      const k = (j + 1) % N;
      // front face (-Z), outer wall (outward), inner wall (into the aperture)
      ind.push(inF[j], inF[k], outF[k], inF[j], outF[k], outF[j]);
      ind.push(outF[j], outF[k], outB[k], outF[j], outB[k], outB[j]);
      ind.push(inF[j], inB[j], inB[k], inF[j], inB[k], inF[k]);
    }
    // half the bridge, reaching from the inner edge of this lens to the midline
    const bx = -side * (wIn * 0.5 + t + barW * 0.5 - 0.006);
    const x0 = bx - barW * 0.5, x1 = bx + barW * 0.5;
    const y0 = -barH * 0.5, y1 = barH * 0.5;
    const a = put(x0, y0, 0), b = put(x1, y0, 0), c = put(x1, y1, 0), d = put(x0, y1, 0);
    const ab = put(x0, y0, depth), bb = put(x1, y0, depth);
    const cb = put(x1, y1, depth), db = put(x0, y1, depth);
    ind.push(a, c, b, a, d, c);          // front
    ind.push(d, cb, c, d, db, cb);       // top edge
    ind.push(a, b, bb, a, bb, ab);       // bottom edge
    const g = new T.BufferGeometry();
    g.setIndex(new T.BufferAttribute(new Uint16Array(ind), 1));
    g.setAttribute('position', new T.BufferAttribute(new Float32Array(pos), 3));
    return g;
  }

  /**
   * Bakes a radial 1 -> 0 ramp into a plane's vertex colours, measured in units
   * of its own half-extent so the fade is elliptical rather than circular.
   */
  function radialFade(geo) {
    const p = geo.attributes.position;
    let hx = 1e-5, hy = 1e-5;
    for (let k = 0; k < p.count; k++) {
      hx = Math.max(hx, Math.abs(p.getX(k)));
      hy = Math.max(hy, Math.abs(p.getY(k)));
    }
    const col = new Float32Array(p.count * 3);
    for (let k = 0; k < p.count; k++) {
      const r = Math.hypot(p.getX(k) / hx, p.getY(k) / hy);
      const v = Math.pow(clamp01(1 - r), 1.35);
      col[k * 3] = v; col[k * 3 + 1] = v; col[k * 3 + 2] = v;
    }
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    return geo;
  }

  /**
   * A filled rounded rectangle, subdivided from the centre outward.
   *
   * ExtrudeGeometry cannot be used for the lens: it triangulates a filled shape
   * from OUTLINE vertices only, so however carefully the outline is laid on the
   * chest, the middle of the plate is a flat chord across a bulging surface and
   * the pec pushes through the glass. Rings of interior vertices give the plate
   * something to be curved BY. (The frame is still extruded - it is a 46mm-wide
   * annulus, and a chord that short sags by millimetres.)
   */
  function roundedDisc(w, h, r, rings) {
    const outline = roundRectRim(w, h, r, 4);
    const N = outline.length;
    const pos = new Float32Array((N * rings + 1) * 3);
    for (let k = 1; k <= rings; k++) {
      const f = k / rings;
      for (let j = 0; j < N; j++) {
        const at = (1 + (k - 1) * N + j) * 3;
        pos[at] = outline[j].x * f;
        pos[at + 1] = outline[j].y * f;
      }
    }
    // The outline runs counter-clockwise, which normals +Z; this face has to
    // look at the camera down -Z, so every triangle is wound backwards.
    const ind = new Uint16Array(N * 3 + (rings - 1) * N * 6);
    let q = 0;
    for (let j = 0; j < N; j++) {
      const j2 = (j + 1) % N;
      ind[q++] = 0; ind[q++] = 1 + j2; ind[q++] = 1 + j;
    }
    for (let k = 1; k < rings; k++) {
      for (let j = 0; j < N; j++) {
        const j2 = (j + 1) % N;
        const a = 1 + (k - 1) * N + j, b = 1 + (k - 1) * N + j2;
        const c = 1 + k * N + j, d = 1 + k * N + j2;
        ind[q++] = a; ind[q++] = b; ind[q++] = c;
        ind[q++] = b; ind[q++] = d; ind[q++] = c;
      }
    }
    const g = new T.BufferGeometry();
    g.setIndex(new T.BufferAttribute(ind, 1));
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    return g;
  }

  /**
   * Front of the torso at a given (x, y), solved analytically by inverting the
   * cross-section: x = hw*|sin|^m gives |sin| = (|x|/hw)^(1/m), and the rest is
   * Pythagoras. Exact, and free, because the profile is already a function.
   */
  function chestFrontZ(x, y) {
    const pr = profileAt(y);
    const t = Math.min(0.985, Math.abs(x) / Math.max(1e-4, pr.hw));
    const sinPhi = Math.pow(t, 1 / pr.exp);
    const cosPhi = Math.sqrt(Math.max(0, 1 - sinPhi * sinPhi));
    return -pr.front * Math.pow(cosPhi, pr.exp);
  }

  /**
   * Lays a flat extruded plate ONTO that surface: every vertex column is pushed
   * back to the chest depth beneath it, less a standoff. A curvature constant
   * cannot do this job - the chest curves in x and y by different amounts, and
   * fitting one of them sank the bottom edge of the lens into the pec, which in
   * three-quarter view showed as a leaf of bare skin inside the glass.
   *
   * The plate keeps its extruded thickness (z = 0 is the front face, +depth
   * runs into the body), and the brow's own origin still pivots at the lens
   * centre, so the angry tilt lifts the outer corner off the chest exactly the
   * way a real pair of glasses would ride up.
   */
  function layOnChest(geo, cx, standoff) {
    const p = geo.attributes.position;
    for (let k = 0; k < p.count; k++) {
      const zSurf = chestFrontZ(p.getX(k) + cx, p.getY(k) + BROW_Y);
      p.setZ(k, p.getZ(k) + zSurf - standoff);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }

  function buildBrow(side) {
    const brow = new T.Group();
    brow.position.set(side * LENS_CX, BROW_Y - HIP_Y, 0);
    torso.add(brow);

    // z = 0 is the front face and +depth runs into the body, so the standoff
    // is simply how far the frame stands proud of the skin: 35mm of frame with
    // the glass recessed 24mm behind it.
    const geoFrame = keepGeo(layOnChest(
      buildFrameGeo(side, LENS_W, LENS_H, 0.062, FRAME_T, 0.062, 0.085, 0.060),
      side * LENS_CX, FRAME_STANDOFF));
    const frame = new T.Mesh(geoFrame, matFrame);
    frame.castShadow = shadows;
    brow.add(frame);

    const geoLens = keepGeo(layOnChest(
      roundedDisc(LENS_W + 0.006, LENS_H + 0.006, 0.058, 5),
      side * LENS_CX, FRAME_STANDOFF - 0.005));
    const lens = new T.Mesh(geoLens, matLens);
    brow.add(lens);

    // The coal behind the glass. Additive, fog-exempt and depth-write-free, and
    // its falloff is baked into VERTEX COLOURS rather than a texture: black at
    // the rim means the additive blend contributes nothing there, so the halo
    // fades out over the frame instead of ending in a hard red rectangle.
    const geoGlow = keepGeo(layOnChest(
      radialFade(new T.PlaneGeometry(LENS_W * 1.18, LENS_H * 1.30, 6, 5)),
      side * LENS_CX, FRAME_STANDOFF - 0.002));
    const glow = new T.Mesh(geoGlow, matGlow);
    glow.renderOrder = 3;
    brow.add(glow);

    return { brow, glow };
  }
  const browL = buildBrow(-1);
  const browR = buildBrow(1);
  const BROW_REST_Y = BROW_Y - HIP_Y;

  // ================================================================ teeth ===
  /**
   * Blunt pale nubs along the fold, hidden inside the lips until the maw opens.
   * Two instanced rows, each in its own group so the rows can part with the
   * jaw without touching a single matrix per frame.
   */
  const TEETH_PER_ROW = 6;
  const geoTooth = keepGeo(new T.ConeGeometry(0.5, 1, 5));
  function buildToothRow(pointDown) {
    const holder = new T.Group();
    holder.position.y = MOUTH_Y - HIP_Y;
    torso.add(holder);
    const inst = new T.InstancedMesh(geoTooth, matTooth, TEETH_PER_ROW);
    inst.castShadow = false;
    inst.frustumCulled = false;
    for (let k = 0; k < TEETH_PER_ROW; k++) {
      // spread across the aperture, following the frown arc so the row hangs
      // the way the lip does
      const u = (k + 0.5) / TEETH_PER_ROW * 2 - 1;   // -1..1
      const x = u * 0.40;
      const sag = -0.10 * u * u;
      const len = (0.090 + 0.050 * (1 - Math.abs(u))) * (0.85 + 0.3 * hash2(k, pointDown ? 3 : 7));
      const wid = 0.074 + 0.024 * (1 - Math.abs(u));
      _vec.set(x, sag + (pointDown ? -len * 0.5 : len * 0.5), 0);
      _eul.set(pointDown ? Math.PI : 0, 0, u * 0.10);
      _quat.setFromEuler(_eul);
      _scl.set(wid, len, wid);
      _mtx.compose(_vec, _quat, _scl);
      inst.setMatrixAt(k, _mtx);
    }
    inst.instanceMatrix.needsUpdate = true;
    holder.add(inst);
    return holder;
  }
  const teethUpper = buildToothRow(true);   // hang down from the upper lip
  const teethLower = buildToothRow(false);  // stand up out of the fold
  teethUpper.visible = false;
  teethLower.visible = false;

  // ============================================================== state ====
  let anger = 0;
  let mouthOpen = 0;
  let clock = 0;
  let gait = 0;
  let gaitSpeed = 0;
  let lastProx = 0;
  let angerWritten = -1;

  /**
   * Writes the whole expression from stored state. Called by the setters AND by
   * update(), so the pose is correct whichever the caller touches, and is pure
   * assignment throughout - no accumulation, no drift.
   */
  function applyExpression() {
    // Front-loaded, not eased: a smoothstep spends the first third of the
    // range doing almost nothing, and the player has to be able to SEE the tier
    // tick over the instant it happens. pow(0.78) still lands exactly on 0 and
    // 1, so calm is genuinely placid and furious is genuinely the extreme.
    const scowl = anger <= 0 ? 0 : Math.pow(anger, 0.78);

    // Involuntary mouth motion: a shallow pant that scales with anger, and a
    // chewing chomp that only shows up once it is close enough to matter.
    const breathRate = 1.15 + 2.4 * anger + 1.4 * lastProx;
    const pant = 0.07 * anger * (0.5 + 0.5 * Math.sin(clock * breathRate * 2));
    const chew = 0.20 * anger * lastProx * (0.5 + 0.5 * Math.sin(clock * (4 + 6 * anger)));
    const maw = clamp01(mouthOpen + pant + chew);

    if (influences) {
      influences[MORPH_SCOWL] = scowl;
      influences[MORPH_MAW] = maw;
    }

    // ------------------------------------------------------------- brow
    // Inner edges drop, outer edges lift, and the pair squeezes toward the
    // sternum: the classic angry brow, worn as sunglasses.
    const tilt = BROW_TILT * scowl;
    browL.brow.rotation.z = -tilt;
    browR.brow.rotation.z = tilt;
    const squeeze = 0.030 * scowl;
    browL.brow.position.x = -LENS_CX + squeeze;
    browR.brow.position.x = LENS_CX - squeeze;
    // Settling down onto the ridge, and riding the swell forward. The scowl
    // morph pushes the chest out by ~67mm at BROW_Y, so the glasses have to
    // travel at least that far or the flesh simply swallows them.
    browL.brow.position.y = BROW_REST_Y - 0.055 * scowl;
    browR.brow.position.y = browL.brow.position.y;
    browL.brow.position.z = -0.085 * scowl;
    browR.brow.position.z = browL.brow.position.z;
    browL.brow.rotation.x = -0.10 * scowl;
    browR.brow.rotation.x = browL.brow.rotation.x;

    // ------------------------------------------------------------ teeth
    // Nothing until the fold is actually parted. The rows then ride the same
    // jawDrop the morph uses, so they stay planted in the lips, and they sit a
    // few centimetres BEHIND the rim - deep enough that the funnel's baked
    // blackness is what you see between them.
    const reveal = smoothstep(0.25, 0.78, maw) * (0.35 + 0.65 * scowl);
    const show = reveal > 0.02;
    teethUpper.visible = show;
    teethLower.visible = show;
    if (show) {
      // Planted where the funnel is actually OPEN, which is nearer the mouth's
      // centre than its rim: the morph hauls the rim flesh up and out into a
      // lip, so a tooth placed level with the lip is simply behind it. These
      // two factors are the lopsided jaw drop (1.15 up, 0.95 down) tuned until
      // both rows stood clear of the throat at full gape.
      const drop = MAW.jawDrop * maw;
      const outY = MOUTH_Y - 0.02 - HIP_Y;
      const z = -0.455 - 0.055 * maw;
      teethUpper.position.set(0, outY + drop * 1.15, z);
      teethLower.position.set(0, outY - drop * 0.95, z);
      teethUpper.scale.setScalar(reveal);
      teethLower.scale.setScalar(reveal);
    }

    // ------------------------------------------------------- lens glow
    const heat = smoothstep(0.42, 1.0, anger);
    const pulse = 1 + 0.22 * Math.sin(clock * (3 + 8 * lastProx)) * (0.3 + 0.7 * lastProx);
    matGlow.opacity = clamp01(heat * (0.40 + 0.55 * lastProx) * pulse);
    matLens.emissiveIntensity = heat * 0.85 * pulse;
    const gs = 1 + 0.18 * heat + 0.12 * lastProx;
    browL.glow.scale.set(gs, gs, 1);
    browR.glow.scale.set(gs, gs, 1);

    // ------------------------------------------------------------ flush
    // Colour work is a uniform upload each; gate it on anger actually moving,
    // which over a whole run is a few dozen writes rather than a few thousand.
    if (angerWritten < 0 || Math.abs(anger - angerWritten) > 0.004) {
      angerWritten = anger;
      const f = smoothstep(0.10, 1.0, anger);
      matSkin.color.copy(_colA.copy(skinBase).lerp(skinFlush, f));
      matLimb.color.copy(_colB.copy(limbBase).lerp(limbFlush, f));
      // a last ember of self-illumination so the flush survives dread fog
      const e = 0.07 * smoothstep(0.55, 1.0, anger);
      matSkin.emissive.setRGB(e * eyeColor.r, e * eyeColor.g * 0.35, e * eyeColor.b * 0.3);
      matLimb.emissive.copy(matSkin.emissive);
    }
  }

  /** 0..1 threat level. Drives the frown, the brow, the flush and the bulk. */
  function setAnger(t) {
    anger = clamp01(typeof t === 'number' ? t : 0);
    applyExpression();
  }

  /** 0..1 maw. Roars and the final lunge drive this on top of anger. */
  function setMouthOpen(t) {
    mouthOpen = clamp01(typeof t === 'number' ? t : 0);
    applyExpression();
  }

  /**
   * @param {number} dt seconds
   * @param {object} opts { anger, proximity, speed, time }
   */
  function update(dt, opts) {
    const o = opts || EMPTY_OPTS;
    const step = dt > 0 ? (dt < 0.1 ? dt : 0.1) : 0;
    if (typeof o.time === 'number') clock = o.time; else clock += step;
    if (typeof o.anger === 'number') anger = clamp01(o.anger);
    if (typeof o.proximity === 'number') lastProx = clamp01(o.proximity);
    const prox = lastProx;
    const speed = typeof o.speed === 'number' && o.speed > 0 ? o.speed : 0;

    // ------------------------------------------------------------- gait
    // Cadence falls out of the physics: metres per second over metres per
    // stride. A heavier, angrier animal takes longer, slower strides.
    gaitSpeed = damp(gaitSpeed, speed, 6, step);
    const walk = clamp01(gaitSpeed / 1.8);
    gait += TAU * (0.55 + gaitSpeed / STRIDE_LENGTH) * step;
    if (gait > TAU) gait -= TAU * Math.floor(gait / TAU);

    const swing = Math.sin(gait);
    const legAmp = (0.30 + 0.26 * walk) * (0.35 + 0.65 * walk);

    // Legs hang down -Y; a positive rotation about X carries the foot toward
    // -Z, which is forward for this model. Knees fold BACKWARD (negative).
    legL.hip.rotation.x = swing * legAmp;
    legR.hip.rotation.x = -swing * legAmp;
    legL.knee.rotation.x = -(0.10 + Math.max(0, -swing) * 0.85 * walk);
    legR.knee.rotation.x = -(0.10 + Math.max(0, swing) * 0.85 * walk);
    // ankles counter the chain so the soles stay roughly parallel to the ground
    // Full cancellation of the hip+knee chain keeps the soles parallel to the
    // ground; the sine term is the toe-off that stops it looking like a doll.
    legL.foot.rotation.x = -(legL.hip.rotation.x + legL.knee.rotation.x) + Math.max(0, swing) * 0.22 * walk;
    legR.foot.rotation.x = -(legR.hip.rotation.x + legR.knee.rotation.x) + Math.max(0, -swing) * 0.22 * walk;

    // The hips fall twice per stride and are highest at mid-stance, when the
    // legs are together under the mass. Bobbing the other way would float the
    // whole animal off the deck, which at 2x scale is a third of a metre.
    const heavy = 0.35 + 0.65 * walk;
    rig.position.y = -(0.5 - 0.5 * Math.cos(gait * 2)) * BOB_HEIGHT * heavy;
    rig.rotation.z = swing * 0.055 * heavy + Math.sin(clock * 0.7) * 0.018 * (1 - walk);

    // ------------------------------------------------------------ trunk
    // Forward hunch at the hips; deeper with anger, deeper again at speed.
    torso.rotation.x = -(LEAN_IDLE + LEAN_ANGER * anger + 0.09 * walk + 0.07 * prox);
    // It looks around while it hunts, and stops looking around once it has you.
    torso.rotation.y = Math.sin(clock * 0.43) * 0.10 * (1 - 0.85 * prox);
    torso.rotation.z = -swing * 0.035 * heavy;

    // Breathing: chest and flanks, not height - scaling Y would lift the whole
    // torso off the hips. Fast and shallow when it is angry and close.
    const breathRate = 1.15 + 2.4 * anger + 1.4 * prox;
    const breath = Math.sin(clock * breathRate);
    const amp = 0.009 + 0.018 * anger;
    // Y is barely touched: the geometry is authored in feet-origin metres, so a
    // 1% stretch in Y would lift the whole torso 3cm off its own hips.
    torsoMesh.scale.set(1 + breath * amp, 1 + breath * amp * 0.2, 1 + breath * amp * 1.25);

    // ------------------------------------------------------------- arms
    // They counter-swing while it walks, flare off the ribs as it swells, and
    // abandon the swing entirely to reach when it is nearly on top of you.
    const reach = smoothstep(0.45, 0.90, prox);
    const armAmp = 0.26 + 0.30 * walk;
    const flare = 0.06 + 0.30 * anger;
    const swingL = lerp(-swing * armAmp, 1.15, reach);
    const swingR = lerp(swing * armAmp, 1.15, reach);
    armL.shoulder.rotation.x = swingL;
    armR.shoulder.rotation.x = swingR;
    armL.shoulder.rotation.z = -flare - 0.22 * reach;
    armR.shoulder.rotation.z = flare + 0.22 * reach;
    armL.elbow.rotation.x = lerp(0.18 + Math.max(0, -swing) * 0.30, -0.85, reach);
    armR.elbow.rotation.x = lerp(0.18 + Math.max(0, swing) * 0.30, -0.85, reach);
    // shoulders ride up into the hunch as the traps swell under them
    const hunch = 0.065 * anger + 0.02 * breath;
    armL.shoulder.position.y = SHOULDER_Y - HIP_Y + hunch;
    armR.shoulder.position.y = armL.shoulder.position.y;
    armL.shoulder.position.z = -0.02 - 0.05 * anger;
    armR.shoulder.position.z = armL.shoulder.position.z;

    applyExpression();
  }

  /** Release everything this rig owns. The caller still removes `group`. */
  function dispose() {
    for (let i = 0; i < geometries.length; i++) geometries[i].dispose();
    for (let i = 0; i < materials.length; i++) materials[i].dispose();
    geometries.length = 0;
    materials.length = 0;
  }

  // Land on the calm pose before the first frame.
  applyExpression();

  return { group, height: HEIGHT, setAnger, setMouthOpen, update, dispose };
}

export default buildFace;
