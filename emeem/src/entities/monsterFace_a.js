import * as THREE from 'three';
import { CONFIG as DEFAULT_CONFIG } from '../core/config.js';

/**
 * entities/monsterFace_a.js
 *
 * THE PROTECTOR OF EMEEM LAND.
 *
 * A giant bare torso that walks. There is no head, and there is not supposed to
 * be one: the face IS the body. A pair of enormous black wayfarers lies across
 * the pecs and those are the eyes. The navel is the nose. The crease of the
 * belly fold under it is the mouth, and it is frowning at you.
 *
 * WHAT MAKES IT WORK
 *
 * 1. THE MOUTH IS REAL GEOMETRY, REWRITTEN EVERY FRAME.
 *    It is a five-row ribbon (upper lip / upper rim / throat / lower rim /
 *    lower lip) sampled along a parametric curve across the belly. Every term
 *    of that curve - the arc, the corner droop, the width, the lip thickness,
 *    the pout, the gape - is its own function of anger, so the shape slides
 *    continuously from a faint sag to a savage scowl instead of snapping
 *    between poses. 105 vertices, one position rewrite and one hand-rolled
 *    normal pass per frame, zero allocation.
 *
 * 2. THE BODY IS ONE CONTINUOUS SKIN, NOT A STACK OF PRIMITIVES.
 *    Five squashed spheres - shoulders, chest, waist, belly roll, hips - are
 *    unioned in the RADIUS domain with a p-norm (see `profileAt`), so where two
 *    lobes overlap the skin bulges out into a soft fillet the way fat does.
 *    One BufferGeometry, one draw call, and the same profile function is what
 *    the mouth, the navel and the sunglasses use to sit ON the surface rather
 *    than float above it.
 *
 * 3. EVERY ANGER CUE IS A SILHOUETTE CUE.
 *    Colour dies in fog at 40m. So anger widens the mouth until it reaches the
 *    flanks, drops the corners, fattens and pouts the lips, tips the two lens
 *    halves into an angry brow (outer ends up, inner ends down), swells the
 *    brow ridges out of the chest, bunches the belly over the fold, hunches the
 *    trunk and flushes the skin. Any one of them read alone would do; together
 *    they are unmissable.
 *
 * AXES. Origin at the FEET, +Y up, facing -Z (matching hand.js and monster.js,
 * and matching Object3D.lookAt). Everything is authored in absolute metres from
 * the ground at scale 1; nested "pivot / inverse-pivot" group pairs let the
 * trunk lean and swell about the waist without any coordinate rebasing.
 *
 * DRIFT. `pose()` is the single writer of every transform and is a pure
 * function of the state variables, so setAnger / setMouthOpen / update may be
 * called in any order, any number of times per frame, forever, without the pose
 * creeping. Nothing is ever accumulated onto a transform.
 */

const TAU = Math.PI * 2;

/**
 * Written as a positive test so NaN falls through to 0. A NaN speed or dread
 * arriving from the game would otherwise poison gaitPhase and every vertex the
 * curve writes, permanently and with no way back - the pose never recovers,
 * because every frame integrates the last one.
 */
const clamp01 = (v) => (v > 0 ? (v < 1 ? v : 1) : 0);
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt));
const smoothstep = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
/** Smooth 0 -> 1 -> 0 hump across [lo, hi]. sin^2 has zero slope at both ends. */
const hump = (lo, hi, x) => {
  const t = clamp01((x - lo) / (hi - lo));
  const s = Math.sin(Math.PI * t);
  return s * s;
};

const EMPTY_OPTS = {};

// ===========================================================================
// PROPORTIONS. Metres, feet on y = 0, at scale 1. These are read straight off
// the reference photograph: the frame of the photo runs from the top of the
// trapezius to the waistband, and every landmark below is that photo's pixel
// height mapped onto a 1.90m torso.
// ===========================================================================

const Y_TOP = 3.34;        // crown of the shoulder mass (no head above it)
const Y_TORSO_BOT = 1.38;  // torso ends inside the shorts
const Y_GLASSES = 2.70;    // lens centre line - sits exactly on the nipple line
const Y_NAVEL = 2.04;      // the nose
const Y_MOUTH = 1.84;      // rest position of the belly fold
const Y_BAND_TOP = 1.56;   // top of the waistband

const HEIGHT = Y_TOP;

/**
 * The five body lobes: [yCentre, yRadius, halfWidth, frontDepth, backDepth].
 *
 * Widths come from the photo: 1.44m across the shoulders, pinching to 1.21m at
 * the waist under the glasses, opening back out to 1.36m at the belly roll and
 * tucking to 1.24m where the shorts bite. Depth is roughly 0.55 of width - a
 * real torso is deeper than that, but flattening it turns the front into a
 * face-shaped canvas, which is the entire point of this creature.
 */
const LOBES = new Float64Array([
  // yc     ry    halfW  front  back
  // Shoulders are a wide, SHALLOW lobe (aspect 0.33): a rounder one domes up
  // into something that reads as a head, which is the one thing this creature
  // must not have. It closes the top at 3.34.
  3.08, 0.26, 0.780, 0.250, 0.250,
  2.76, 0.46, 0.720, 0.300, 0.255, // chest - the glasses sit across this
  2.34, 0.44, 0.600, 0.290, 0.230, // waist pinch
  1.94, 0.44, 0.680, 0.350, 0.250, // belly roll - the cheeks of the face
  1.56, 0.32, 0.610, 0.290, 0.225, // lower belly falling into the shorts
]);
const LOBE_COUNT = 5;

/**
 * Cross-section exponent. n = 2 is an ellipse; 2.5 is a slightly boxy
 * superellipse, which is what a slab of human torso actually looks like from
 * above. x = a*|sin t|^(2/n), z = b*|cos t|^(2/n).
 */
const SE_POW = 0.8;       // 2/n
const SE_INV = 1.25;      // n/2, used to invert x -> t for the mouth

// Nose. A vertical ridge of flesh runs from between the pecs down to the navel
// and swells into a ball just above it - that ridge is the bridge of the nose,
// and it is baked into the skin rather than stuck on as a separate mesh.
const RIDGE_SIG2 = 0.045; // 2*sigma^2 for the bridge, metres^2
const BALL_SIG2 = 0.075;  // wider gaussian for the ball of the nose

// Neck notch. A shallow saddle across the top of the shoulders where a head
// would be. Depends on |x| only, so it dips at the front and back centre and
// leaves the shoulder tops proud. Kept SHALLOW on purpose: at 0.18 the two
// halves separate into distinct lobes and the whole top of the creature starts
// reading as a heart, or worse, a backside. It only has to hint at an absence.
const NOTCH_DEPTH = 0.062;
const NOTCH_SIG2 = 0.20;

const TORSO_SEGS = 24;    // around
const TORSO_RINGS = 24;   // bottom to top

// ------------------------------------------------------------ mouth curve --
// Every one of these is (rest, gain): value = rest + gain * anger.
// Half width. The gain overshoots the belly on purpose - softLimit pins the
// corners onto the flank, so past about anger 0.6 the extra width stops buying
// span and starts buying DROP, which is the cue that actually reads.
const MOUTH_HW0 = 0.34, MOUTH_HW_A = 0.30;
const ARC0 = 0.055, ARC_A = 0.120;           // quadratic sag of the whole arc
const COR0 = 0.014, COR_A = 0.105;           // |u|^5 term: corners ONLY
const RISE_A = 0.04;                         // the fold rides up as it bunches
const LIP_UP0 = 0.022, LIP_UP_A = 0.055;     // upper lip half-thickness
const LIP_LO0 = 0.030, LIP_LO_A = 0.072;     // lower lip is the fuller one
const POUT0 = 0.010, POUT_A = 0.055;         // how far the lips stand proud
const GAP0 = 0.11, GAP_A = 0.34;             // maw height at full open
const GROOVE0 = 0.030, GROOVE_A = 0.055;     // depth of the closed crease
const THROAT_MAX = 0.26;                     // cavity can't punch out the back

const MOUTH_COLS = 21;
const MOUTH_ROWS = 5;
const MOUTH_VERTS = MOUTH_COLS * MOUTH_ROWS;

// ------------------------------------------------- anger body deformation --
const SWELL_BELLY = 0.045;   // belly roll pushes forward over the fold
const SWELL_CHEST = 0.030;   // pecs bunch above the glasses
const FOLD_DEEPEN = 0.038;   // the crease itself cuts back in
const SHOULDER_RISE = 0.055; // traps come up around the absent neck

// ------------------------------------------------------------------ gait --
const BOB_HEIGHT = 0.14;
const STRIDE_LENGTH = 1.9;
const IDLE_STRIDE = 0.55;

// ----------------------------------------------------------------- scratch --
// Module scope, allocated once at import. Nothing below is allowed to allocate
// per frame: at 60fps a single Vector3 in the mouth loop is 6300 objects a
// second and a GC hitch in the middle of a chase.
const _prof = new Float64Array(3);   // [halfWidth, frontDepth, backDepth]

/**
 * Half-width and front/back half-depths of the body at height `y`.
 *
 * Each lobe contributes an ellipse cross-section of scale s = sqrt(1 - t^2);
 * the lobes are then combined with a 6-norm, (sum r_i^6)^(1/6). That is a
 * smooth maximum: where one lobe dominates you get that lobe exactly, and where
 * two are equal you get 2^(1/6) = 1.12 times either, i.e. a 12% fillet. That
 * fillet is what turns five stacked spheres into one soft continuous body.
 * The sixth root is a sqrt and a cbrt, both far cheaper than Math.pow.
 */
function profileAt(y) {
  let sw = 0, sf = 0, sb = 0;
  for (let i = 0; i < LOBE_COUNT; i++) {
    const o = i * 5;
    const t = (y - LOBES[o]) / LOBES[o + 1];
    if (t <= -1 || t >= 1) continue;
    const s = Math.sqrt(1 - t * t);
    let v = LOBES[o + 2] * s; let v2 = v * v; sw += v2 * v2 * v2;
    v = LOBES[o + 3] * s; v2 = v * v; sf += v2 * v2 * v2;
    v = LOBES[o + 4] * s; v2 = v * v; sb += v2 * v2 * v2;
  }
  _prof[0] = sw > 0 ? Math.cbrt(Math.sqrt(sw)) : 0;
  _prof[1] = sf > 0 ? Math.cbrt(Math.sqrt(sf)) : 0;
  _prof[2] = sb > 0 ? Math.cbrt(Math.sqrt(sb)) : 0;
}

/** Strength of the nose bridge at height y. Peaks between the pecs, dies at the fold. */
function ridgeAmp(y) {
  return 0.030 * hump(1.95, 2.72, y) + 0.038 * hump(1.94, 2.20, y);
}

/** Depth of the neck saddle at height y. */
function notchAmp(y) {
  return NOTCH_DEPTH * smoothstep(3.00, Y_TOP, y);
}

/**
 * Anger's contribution to the FRONT surface at height y, in metres of forward
 * (-Z) travel. Shared by the skin rebuild, the mouth ribbon and the glasses so
 * all three swell together instead of tearing apart.
 */
function angerFront(y, a) {
  return a * (SWELL_BELLY * hump(1.86, 2.24, y)
    + SWELL_CHEST * hump(2.74, 3.18, y)
    - FOLD_DEEPEN * hump(1.66, 1.90, y));
}

/** Blend front depth into back depth around the sides so there is no crease. */
function depthAt(cosT, front, back) {
  const w = 0.5 + 0.5 * cosT;         // 0 at the front, 1 at the back
  return front + (back - front) * w;
}

/**
 * z of the front skin at a given (x, y) and anger. Inverts the superellipse:
 * x = halfW * |sin t|^(2/n)  =>  |sin t| = (x / halfW)^(n/2).
 * Returns 0 (the body's centre plane) once x runs off the silhouette edge.
 */
function frontZ(x, y, a) {
  profileAt(y);
  const hw = _prof[0];
  if (hw <= 1e-4) return 0;
  let s = Math.abs(x) / hw;
  if (s > 1) s = 1;
  const sinT = Math.pow(s, SE_INV);
  const cosT = Math.sqrt(Math.max(0, 1 - sinT * sinT));
  const rz = depthAt(-cosT, _prof[1], _prof[2]);
  let z = -rz * Math.pow(cosT, SE_POW);
  // Nose bridge, then the anger swell. Both push toward -Z.
  z -= ridgeAmp(y) * Math.exp(-(x * x) / RIDGE_SIG2) * cosT;
  z -= angerFront(y, a);
  return z;
}

/**
 * Smooth saturating clamp of the mouth corner onto the silhouette edge. A hard
 * min() would kink the lip line the instant the mouth outgrew the belly; this
 * eases into `lim` over the last quarter and never quite reaches it.
 */
function softLimit(v, lim) {
  const knee = lim * 0.72;
  if (v <= knee) return v;
  const span = lim - knee;
  return knee + span * (1 - Math.exp(-(v - knee) / span));
}

// ===========================================================================

export function buildFace(THREE_, CONFIG) {
  const T = THREE_ || THREE;
  const C = CONFIG || DEFAULT_CONFIG;
  const P = C.palette;
  const shadows = !!(C.render && C.render.shadows);

  const geometries = [];
  const materials = [];
  const track = (o) => {
    if (o.isBufferGeometry) geometries.push(o); else materials.push(o);
    return o;
  };

  // ------------------------------------------------------------- palette --
  // The skin comes off CONFIG.palette.hand so the Protector is made of the same
  // meat as the player's hand; the shorts and the frames come off
  // palette.monster; the flush and the throat glow come off palette.monsterEye.
  const SKIN_CALM = new T.Color(P.hand).multiplyScalar(0.94);
  // 0.42 toward the eye red turned the whole creature into a traffic cone once
  // the emissive was on top of it. The flush has to be a flush, not a repaint:
  // the silhouette cues are what carry the escalation.
  const SKIN_HOT = new T.Color(P.hand).lerp(new T.Color(P.monsterEye), 0.26).multiplyScalar(0.88);
  const LIP_CALM = new T.Color(P.handShadow).multiplyScalar(0.66);
  const LIP_HOT = new T.Color(P.handShadow).lerp(new T.Color(P.monsterEye), 0.5).multiplyScalar(0.55);
  const DARK = new T.Color(P.monster);
  const FRAME = new T.Color(P.monster).multiplyScalar(0.45);

  const matSkin = track(new T.MeshStandardMaterial({
    color: SKIN_CALM, roughness: 0.86, metalness: 0.0, vertexColors: true,
  }));
  const matLip = track(new T.MeshStandardMaterial({
    color: LIP_CALM, roughness: 0.62, metalness: 0.0,
  }));
  const matMaw = track(new T.MeshStandardMaterial({
    color: 0x1a0407, emissive: new T.Color(P.monsterEye), emissiveIntensity: 0.12,
    roughness: 1.0, metalness: 0.0, side: T.DoubleSide,
  }));
  const matDark = track(new T.MeshStandardMaterial({
    color: DARK, roughness: 0.92, metalness: 0.0,
  }));
  const matBand = track(new T.MeshStandardMaterial({
    color: new T.Color(P.monster).multiplyScalar(1.7), roughness: 0.8, metalness: 0.0,
  }));
  const matFrame = track(new T.MeshStandardMaterial({
    color: FRAME, roughness: 0.42, metalness: 0.0,
  }));
  // Flat plates, so both are DoubleSide: a ShapeGeometry's normal is +Z and the
  // player is always looking at this creature from -Z.
  const matLens = track(new T.MeshStandardMaterial({
    // Matte, not glossy: a flat plate at roughness 0.3 catches the whole sun as
    // one broad specular and turns both eyes into pale grey windows.
    color: 0x0b0d10, roughness: 0.55, metalness: 0.0, side: T.DoubleSide,
    emissive: new T.Color(P.monsterEye), emissiveIntensity: 0.0,
  }));
  // Fog-exempt additive smear over each lens. Two dark rectangles read as eyes
  // up close; at forty metres in dread fog this is what still reads.
  const matGlow = track(new T.MeshBasicMaterial({
    color: P.monsterEye, transparent: true, opacity: 0.0, depthWrite: false,
    blending: T.AdditiveBlending, fog: false, side: T.DoubleSide,
  }));

  // ------------------------------------------------------- shared shapes --
  /**
   * matSkin reads vertex colours (the torso bakes its shading into them). A
   * mesh using it whose geometry has no `color` attribute gets the WebGL
   * default of black, so every shared shape the skin material touches carries a
   * flat white one.
   */
  const whiten = (geo) => {
    const n = geo.attributes.position.count;
    const c = new Float32Array(n * 3).fill(1);
    geo.setAttribute('color', new T.BufferAttribute(c, 3));
    return geo;
  };
  // 12x8 is 168 triangles. Eight of these hang off the rig (brows, navel,
  // hands, feet, hips) and they are all small on screen; the detail budget
  // belongs to the torso and the mouth, which is where the face is.
  const geoSphere = track(whiten(new T.SphereGeometry(1, 12, 8)));
  const geoLimb = track(whiten(new T.CylinderGeometry(0.5, 0.38, 1, 8, 1)));
  const geoBox = track(new T.BoxGeometry(1, 1, 1));
  const geoTube = track(new T.CylinderGeometry(0.97, 1.03, 1, 20, 1, true));
  const geoRing = track(new T.CylinderGeometry(1, 1, 1, 20, 1, true));
  const geoPlane = track(new T.PlaneGeometry(1, 1));

  /** Non-uniformly scaled sphere: the workhorse for soft body masses. */
  const blob = (mat, sx, sy, sz, x, y, z) => {
    const m = new T.Mesh(geoSphere, mat);
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z);
    m.castShadow = shadows;
    return m;
  };
  /**
   * Tapered segment hanging from its parent's origin down -Y. The shared
   * cylinder is r = 0.5 top / 0.38 bottom, so one scale gives a limb of radius
   * rTop narrowing to 0.76*rTop at the joint below - the taper every arm and
   * leg here wants anyway.
   */
  const limb = (rTop, len) => {
    const m = new T.Mesh(geoLimb, matSkin);
    m.scale.set(rTop * 2, len, rTop * 2);
    m.position.y = -len * 0.5;
    m.castShadow = shadows;
    return m;
  };

  // =========================================================================
  // THE SKIN
  // =========================================================================
  const torsoGeo = track(new T.BufferGeometry());
  const vCount = TORSO_RINGS * TORSO_SEGS + 2; // + two cap centres
  const torsoBase = new Float32Array(vCount * 3);  // undeformed, anger = 0
  const torsoPos = new Float32Array(vCount * 3);
  const torsoCol = new Float32Array(vCount * 3);
  // Per-vertex anger weights, packed [belly, fold, chest, shoulder].
  const torsoW = new Float32Array(vCount * 4);

  /**
   * Baked shading. There are no textures anywhere in this game, so the chest
   * hair, the linea alba, the fold shadow and the ambient falloff all live in
   * vertex colours - free, and they multiply the flush instead of fighting it.
   */
  const tintAt = (x, y, frontal) => {
    let m = 0.70 + 0.30 * frontal;                       // ambient wrap
    const ax = Math.abs(x);
    // Body hair. The reference is a hairy chest and a treasure trail, and at
    // 24 segments a gaussian smudge is the honest way to draw that: at any
    // distance where you could resolve a hair, you are already dead.
    m *= 1 - 0.42 * frontal * Math.exp(-(x * x / 0.10 + (y - 2.98) * (y - 2.98) / 0.070));
    m *= 1 - 0.30 * frontal * Math.exp(-(x * x / 0.020 + (y - 2.40) * (y - 2.40) / 0.36));
    m *= 1 - 0.34 * frontal * Math.exp(-(x * x / 0.060 + (y - 2.07) * (y - 2.07) / 0.045));
    // Shadow under the ball of the nose - the single cue that turns a navel
    // into a nose, since the geometry ridge alone is too shallow to shade.
    m *= 1 - 0.22 * frontal * Math.exp(-(x * x / 0.030 + (y - 1.985) * (y - 1.985) / 0.0030));
    // Fold shadow. Broad and soft: a hard band here reads as a SECOND mouth
    // sitting under the real one once the ribbon rides up with anger.
    const arcY = Y_MOUTH + 0.02 - 0.06 * (x * x) / 0.12;
    m *= 1 - 0.20 * frontal * Math.exp(-((y - arcY) * (y - arcY)) / 0.012);
    // Armpit hollow and the crease where the waistband bites.
    m *= 1 - 0.34 * Math.exp(-((ax - 0.66) * (ax - 0.66) / 0.022 + (y - 2.86) * (y - 2.86) / 0.11));
    m *= 1 - 0.26 * smoothstep(1.82, 1.48, y);
    // The saddle where the head is missing sits in its own shadow.
    m *= 1 - 0.30 * Math.exp(-(x * x) / 0.10) * smoothstep(2.96, Y_TOP, y);
    return m;
  };

  {
    let p = 0;
    for (let j = 0; j < TORSO_RINGS; j++) {
      const y0 = Y_TORSO_BOT + (Y_TOP - Y_TORSO_BOT) * (j / (TORSO_RINGS - 1));
      profileAt(y0);
      const hw = _prof[0], df = _prof[1], db = _prof[2];
      const ridge = ridgeAmp(y0);
      const notch = notchAmp(y0);
      for (let i = 0; i < TORSO_SEGS; i++) {
        const th = (i / TORSO_SEGS) * TAU;   // 0 -> +Z (back), PI -> -Z (front)
        const st = Math.sin(th), ct = Math.cos(th);
        const sx = Math.sign(st) * Math.pow(Math.abs(st), SE_POW);
        const sz = Math.sign(ct) * Math.pow(Math.abs(ct), SE_POW);
        const x = hw * sx;
        let z = depthAt(ct, df, db) * sz;
        const frontal = ct < 0 ? -ct : 0;
        // Nose bridge / ball, front only, gaussian across the midline.
        z -= ridge * Math.exp(-(x * x) / (y0 < 2.24 ? BALL_SIG2 : RIDGE_SIG2)) * frontal;
        // Neck saddle: pull the midline down, leave the shoulder tops alone.
        const y = y0 - notch * Math.exp(-(x * x) / NOTCH_SIG2);

        torsoBase[p] = x; torsoBase[p + 1] = y; torsoBase[p + 2] = z;
        const tint = tintAt(x, y, frontal);
        torsoCol[p] = tint; torsoCol[p + 1] = tint * 0.985; torsoCol[p + 2] = tint * 0.97;

        const w = (p / 3) * 4;
        torsoW[w] = hump(1.86, 2.24, y) * frontal;
        torsoW[w + 1] = hump(1.66, 1.90, y) * frontal;
        torsoW[w + 2] = hump(2.74, 3.18, y) * frontal;
        torsoW[w + 3] = smoothstep(2.80, Y_TOP, y);
        p += 3;
      }
    }
    // Cap centres: bottom (buried in the shorts) then top (inside the saddle).
    torsoBase[p] = 0; torsoBase[p + 1] = Y_TORSO_BOT; torsoBase[p + 2] = 0;
    torsoCol[p] = 0.55; torsoCol[p + 1] = 0.54; torsoCol[p + 2] = 0.53;
    p += 3;
    torsoBase[p] = 0; torsoBase[p + 1] = Y_TOP - NOTCH_DEPTH; torsoBase[p + 2] = 0;
    torsoCol[p] = 0.60; torsoCol[p + 1] = 0.59; torsoCol[p + 2] = 0.58;
    torsoW[(p / 3) * 4 + 3] = 1;

    torsoPos.set(torsoBase);

    const idx = [];
    for (let j = 0; j < TORSO_RINGS - 1; j++) {
      for (let i = 0; i < TORSO_SEGS; i++) {
        const i2 = (i + 1) % TORSO_SEGS;
        const a = j * TORSO_SEGS + i, b = j * TORSO_SEGS + i2;
        const c = (j + 1) * TORSO_SEGS + i, d = (j + 1) * TORSO_SEGS + i2;
        // (a,b,c) gives (b-a) x (c-a) = (sin, 0, cos): outward. Do not reorder.
        idx.push(a, b, c, b, d, c);
      }
    }
    const capB = TORSO_RINGS * TORSO_SEGS, capT = capB + 1;
    const topRow = (TORSO_RINGS - 1) * TORSO_SEGS;
    for (let i = 0; i < TORSO_SEGS; i++) {
      const i2 = (i + 1) % TORSO_SEGS;
      idx.push(capB, i2, i);                       // faces -Y
      idx.push(capT, topRow + i, topRow + i2);     // faces +Y
    }

    torsoGeo.setAttribute('position', new T.BufferAttribute(torsoPos, 3));
    torsoGeo.setAttribute('color', new T.BufferAttribute(torsoCol, 3));
    torsoGeo.setIndex(idx);
    torsoGeo.computeVertexNormals();
  }
  const torsoMesh = new T.Mesh(torsoGeo, matSkin);
  torsoMesh.castShadow = shadows;

  // =========================================================================
  // THE MOUTH - the deformable ribbon this whole creature is built around
  // =========================================================================
  const mouthGeo = track(new T.BufferGeometry());
  const mouthPos = new Float32Array(MOUTH_VERTS * 3);
  const mouthNrm = new Float32Array(MOUTH_VERTS * 3);
  {
    const idx = [];
    // Row bands, ordered so the two lip bands are contiguous and can share one
    // material group and the two cavity walls another. Rows top -> bottom are
    // 0 upper lip edge, 1 upper rim, 2 throat, 3 lower rim, 4 lower lip edge.
    const band = (rA, rB) => {
      for (let c = 0; c < MOUTH_COLS - 1; c++) {
        const a = rA * MOUTH_COLS + c, b = a + 1;
        const cc = rB * MOUTH_COLS + c, d = cc + 1;
        idx.push(a, b, cc, b, d, cc);   // same winding rule as the torso
      }
    };
    band(0, 1); band(3, 4);   // lips
    const lipCount = idx.length;
    band(1, 2); band(2, 3);   // cavity walls, meeting at the throat line
    mouthGeo.setAttribute('position', new T.BufferAttribute(mouthPos, 3));
    mouthGeo.setAttribute('normal', new T.BufferAttribute(mouthNrm, 3));
    mouthGeo.setIndex(idx);
    mouthGeo.addGroup(0, lipCount, 0);
    mouthGeo.addGroup(lipCount, idx.length - lipCount, 1);
  }
  const mouthMesh = new T.Mesh(mouthGeo, [matLip, matMaw]);
  mouthMesh.castShadow = false;   // a 6cm lip casting shadow costs more than it shows
  mouthMesh.frustumCulled = false; // it moves every frame; the torso already culls

  /**
   * Rewrites all 105 mouth vertices from the curve.
   *
   *   yLine(u) = yc + rise*a  -  arc(a)*u^2  -  corner(a)*|u|^5
   *
   * The u^2 term bows the whole line into a frown. The |u|^5 term is flat
   * across the middle and then plunges - that is depressor anguli oris, the
   * muscle that hauls the corners of a real angry mouth down, and separating it
   * from the arc is what lets a faint sag and a savage scowl be the same
   * equation. Width, lip thickness, pout and gape are their own terms again, so
   * nothing here is a keyframe: it is all one continuous surface in anger.
   */
  const writeMouth = (a, open) => {
    const hw = MOUTH_HW0 + MOUTH_HW_A * a;
    const arc = ARC0 + ARC_A * a;
    const cor = COR0 + COR_A * a;
    const yc = Y_MOUTH + RISE_A * a;
    const lipU = LIP_UP0 + LIP_UP_A * a;
    const lipL = LIP_LO0 + LIP_LO_A * a;
    const pout = POUT0 + POUT_A * a;
    const gapA = (GAP0 + GAP_A * a) * open;
    const groove = GROOVE0 + GROOVE_A * a;

    for (let c = 0; c < MOUTH_COLS; c++) {
      const u = -1 + 2 * c / (MOUTH_COLS - 1);
      const au = u < 0 ? -u : u;
      const u2 = u * u;
      const au5 = au * au * au * au * au;

      const yLine = yc - arc * u2 - cor * au5;

      // Corners wrap onto the flanks. At full anger the frown wants to be wider
      // than the belly is, so it is eased onto the silhouette edge instead -
      // which is exactly the read we want: a mouth that reaches ear to ear on a
      // creature with no ears.
      profileAt(yLine);
      const x = Math.sign(u) * softLimit(hw * au, _prof[0] * 0.93);

      const inner = Math.max(0, 1 - u2);
      const taper = 0.28 + 0.72 * Math.pow(inner, 0.55);   // lips are fullest mid-mouth
      const gap = gapA * Math.pow(inner, 0.8);             // and gape only in the middle
      const push = pout * Math.sqrt(inner);                // and stop pouting at the corners

      const rimU = yLine + 0.32 * gap;   // the jaw drops far more than the lip lifts
      const rimL = yLine - 0.68 * gap;
      const yUp = rimU + lipU * taper;
      const yLo = rimL - lipL * taper;
      const yTh = yLine - 0.23 * gap;    // throat line, just under the opening
      let depth = groove + 0.75 * gap;
      if (depth > THROAT_MAX) depth = THROAT_MAX;

      // Each row hugs the belly at its own height, so the ribbon curves around
      // the body instead of being a decal floating on a flat plane.
      const w0 = c * 3;
      mouthPos[w0] = x;
      mouthPos[w0 + 1] = yUp;
      mouthPos[w0 + 2] = frontZ(x, yUp, a) - push * 0.45;

      const w1 = (MOUTH_COLS + c) * 3;
      mouthPos[w1] = x;
      mouthPos[w1 + 1] = rimU;
      mouthPos[w1 + 2] = frontZ(x, rimU, a) - push;

      const w2 = (2 * MOUTH_COLS + c) * 3;
      mouthPos[w2] = x;
      mouthPos[w2 + 1] = yTh;
      mouthPos[w2 + 2] = frontZ(x, yTh, a) - push + depth;

      const w3 = (3 * MOUTH_COLS + c) * 3;
      mouthPos[w3] = x;
      mouthPos[w3 + 1] = rimL;
      mouthPos[w3 + 2] = frontZ(x, rimL, a) - push;

      const w4 = (4 * MOUTH_COLS + c) * 3;
      mouthPos[w4] = x;
      mouthPos[w4 + 1] = yLo;
      mouthPos[w4 + 2] = frontZ(x, yLo, a) - push * 0.45;
    }

    // Normals by central differences on the (column, row) grid. Hand-rolled
    // because BufferGeometry.computeVertexNormals allocates five Vector3 per
    // call and this runs every frame. n = du x dv, with du along +x and dv
    // pointing DOWN the rows, which comes out facing -Z: toward the player.
    for (let r = 0; r < MOUTH_ROWS; r++) {
      const rm = (r > 0 ? r - 1 : r) * MOUTH_COLS;
      const rp = (r < MOUTH_ROWS - 1 ? r + 1 : r) * MOUTH_COLS;
      const rr = r * MOUTH_COLS;
      for (let c = 0; c < MOUTH_COLS; c++) {
        const cm = c > 0 ? c - 1 : c;
        const cp = c < MOUTH_COLS - 1 ? c + 1 : c;
        const iA = (rr + cp) * 3, iB = (rr + cm) * 3;
        const iC = (rp + c) * 3, iD = (rm + c) * 3;
        const ux = mouthPos[iA] - mouthPos[iB];
        const uy = mouthPos[iA + 1] - mouthPos[iB + 1];
        const uz = mouthPos[iA + 2] - mouthPos[iB + 2];
        const vx = mouthPos[iC] - mouthPos[iD];
        const vy = mouthPos[iC + 1] - mouthPos[iD + 1];
        const vz = mouthPos[iC + 2] - mouthPos[iD + 2];
        let nx = uy * vz - uz * vy;
        let ny = uz * vx - ux * vz;
        let nz = ux * vy - uy * vx;
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
        const o = (rr + c) * 3;
        if (len > 1e-9) {
          const inv = 1 / len;
          mouthNrm[o] = nx * inv; mouthNrm[o + 1] = ny * inv; mouthNrm[o + 2] = nz * inv;
        } else {
          mouthNrm[o] = 0; mouthNrm[o + 1] = 0; mouthNrm[o + 2] = -1;
        }
      }
    }
    mouthGeo.attributes.position.needsUpdate = true;
    mouthGeo.attributes.normal.needsUpdate = true;
  };

  /** Reapplies the anger swell to the skin. Gated - see syncBody(). */
  const writeTorso = (a) => {
    for (let i = 0, w = 0; i < vCount * 3; i += 3, w += 4) {
      torsoPos[i] = torsoBase[i];
      torsoPos[i + 1] = torsoBase[i + 1] + a * SHOULDER_RISE * torsoW[w + 3];
      torsoPos[i + 2] = torsoBase[i + 2]
        - a * (SWELL_BELLY * torsoW[w] + SWELL_CHEST * torsoW[w + 2])
        + a * FOLD_DEEPEN * torsoW[w + 1];
    }
    torsoGeo.attributes.position.needsUpdate = true;
    torsoGeo.computeVertexNormals();   // the deepening crease has to actually shade
  };

  // =========================================================================
  // THE SUNGLASSES
  // =========================================================================
  // Straight off the photo: 1.24m across, each half 0.56 x 0.417 with a 0.05
  // border, sitting dead on the nipple line. Absurdly big, which is the joke.
  const LENS_W = 0.56, LENS_H = 0.417, RIM = 0.055;
  const HALF_PIVOT = 0.05;          // inner edge of each half; the tilt hinge
  const HALF_CENTRE = 0.29;         // frame centre, relative to that hinge

  const roundRect = (w, h, r) => {
    const s = new T.Shape();
    const x = w * 0.5, y = h * 0.5;
    s.moveTo(-x + r, -y);
    s.lineTo(x - r, -y);
    s.quadraticCurveTo(x, -y, x, -y + r);
    s.lineTo(x, y - r);
    s.quadraticCurveTo(x, y, x - r, y);
    s.lineTo(-x + r, y);
    s.quadraticCurveTo(-x, y, -x, y - r);
    s.lineTo(-x, -y + r);
    s.quadraticCurveTo(-x, -y, -x + r, -y);
    return s;
  };

  /**
   * Bends a flat plate onto the chest. The skin's z across the glasses line is
   * very nearly z = -0.302 + 0.31*x^2 (checked against frontZ at the inner
   * edge, the centre and the outer edge), so a single quadratic in WORLD x
   * makes the frame hug the pecs instead of hovering off them by 12cm at the
   * outer corner. Each side needs its own geometry because the bend is about
   * x = 0, not about the frame's own centre.
   */
  const bendToChest = (geo, side, standoff) => {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const lx = pos.getX(i);
      const wx = side * HALF_PIVOT + lx;
      pos.setZ(i, pos.getZ(i) - 0.302 - standoff + 0.31 * wx * wx);
    }
    geo.computeVertexNormals();
    return geo;
  };

  const glassesRoot = new T.Group();
  const halves = [];
  for (let k = 0; k < 2; k++) {
    const side = k === 0 ? -1 : 1;
    const half = new T.Group();
    half.position.set(side * HALF_PIVOT, Y_GLASSES, 0);

    const shape = roundRect(LENS_W, LENS_H, 0.075);
    shape.holes.push(roundRect(LENS_W - RIM * 2, LENS_H - RIM * 2, 0.045));
    const gFrame = new T.ExtrudeGeometry(shape, {
      depth: 0.05, bevelEnabled: true, bevelThickness: 0.012,
      bevelSize: 0.012, bevelSegments: 1, curveSegments: 3, steps: 1,
    });
    gFrame.translate(side * HALF_CENTRE, 0, 0);
    track(bendToChest(gFrame, side, 0.02));
    const frame = new T.Mesh(gFrame, matFrame);
    frame.castShadow = shadows;
    half.add(frame);

    const gLens = new T.ShapeGeometry(roundRect(LENS_W - RIM * 1.5, LENS_H - RIM * 1.5, 0.05), 3);
    gLens.translate(side * HALF_CENTRE, 0, 0);
    track(bendToChest(gLens, side, 0.008));
    half.add(new T.Mesh(gLens, matLens));

    // The glow sits INSIDE the lens hole, one centimetre proud of the lens
    // plate, so the frame occludes it on every side. Parked in front of the
    // whole assembly it becomes a metre-wide additive sheet that bleaches the
    // entire creature the moment anger comes up; boxed into the hole it reads
    // as exactly what it should - something lit up behind the shades.
    const glow = new T.Mesh(geoPlane, matGlow);
    const gx = HALF_PIVOT + HALF_CENTRE;
    glow.scale.set(LENS_W - RIM * 2.2, LENS_H - RIM * 2.2, 1);
    glow.position.set(side * HALF_CENTRE, 0, -0.302 - 0.018 + 0.31 * gx * gx);
    glow.renderOrder = 2;
    half.add(glow);

    // Temple arm, hugging the flank and running back past the armpit.
    const temple = new T.Mesh(geoBox, matFrame);
    temple.scale.set(0.045, 0.062, 0.36);
    temple.position.set(side * 0.63, 0.10, 0.02);
    temple.rotation.y = side * -0.30;
    half.add(temple);

    halves.push(half);
    glassesRoot.add(half);
  }
  // Bridge. Stays put while the halves hinge around it, so the gap between the
  // two inner edges narrows into a furrow instead of tearing open.
  const bridge = new T.Mesh(geoBox, matFrame);
  bridge.scale.set(0.135, 0.30, 0.055);
  bridge.position.set(0, Y_GLASSES, -0.325);
  bridge.castShadow = shadows;
  glassesRoot.add(bridge);

  // Brow ridges: buried in the pecs at rest, swelling out of them with anger
  // and dipping at their inner ends. Pure silhouette - they survive fog.
  const BROW_Y = 2.98;
  const BROW_X = 0.34;
  const BROW_DEPTH = 0.16;   // half-depth of the blob, i.e. how far its tip reaches
  // Fully buried at rest: the tip has to end up BEHIND the skin, not level with
  // its centre, or two pale lozenges sit on the chest of a perfectly calm
  // monster. It breaks the surface around a = 0.3 and keeps coming.
  const BROW_Z = frontZ(BROW_X, BROW_Y, 0) + BROW_DEPTH + 0.02;
  const brows = [];
  for (let k = 0; k < 2; k++) {
    const side = k === 0 ? -1 : 1;
    const b = new T.Group();
    b.position.set(side * BROW_X, BROW_Y, BROW_Z);
    b.add(blob(matSkin, 0.325, 0.072, BROW_DEPTH, 0, 0, 0));
    brows.push(b);
  }

  // =========================================================================
  // NAVEL - the nose. A vertical slit set into the ridge, which flares wider
  // and darker with anger the way real nostrils do.
  // =========================================================================
  const matNavel = track(new T.MeshStandardMaterial({
    color: new T.Color(P.handShadow).multiplyScalar(0.34), roughness: 0.95,
  }));
  const navel = blob(matNavel, 0.062, 0.115, 0.05, 0, Y_NAVEL, frontZ(0, Y_NAVEL, 0) + 0.028);
  navel.castShadow = false;

  // =========================================================================
  // THE RIG
  // =========================================================================
  const group = new T.Group();
  group.name = 'monsterFaceA';

  // rig carries the whole-body bob and roll; trunk pivots at the waist so the
  // lean happens where a spine bends and not around the ankles.
  const rig = new T.Group();
  group.add(rig);

  const TRUNK_PIVOT = 1.50;
  const trunk = new T.Group();
  trunk.position.y = TRUNK_PIVOT;
  rig.add(trunk);
  // Undoes the pivot so every child below can stay in absolute feet-origin
  // metres. trunk's scale and rotation therefore act about the waist.
  const body = new T.Group();
  body.position.y = -TRUNK_PIVOT;
  trunk.add(body);

  body.add(torsoMesh, mouthMesh, navel, glassesRoot, brows[0], brows[1]);

  // ------------------------------------------------------------------ arms --
  const makeArm = (side) => {
    const shoulder = new T.Group();
    // Set back in Z as well as out in X: an arm hanging in the plane of the
    // chest fights the outer corner of the glasses for the same pixels, and the
    // two read as one flat slab. Behind the frame, the flank separates.
    shoulder.position.set(side * 0.755, 2.98, 0.075);
    shoulder.add(limb(0.185, 0.70));
    const elbow = new T.Group();
    elbow.position.y = -0.70;
    elbow.add(limb(0.145, 0.64));
    // Flat paddle of a hand, thumb side inward, hanging slack.
    elbow.add(blob(matSkin, 0.115, 0.20, 0.075, 0, -0.72, -0.01));
    shoulder.add(elbow);
    body.add(shoulder);
    return { shoulder, elbow };
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // ---------------------------------------------------------------- shorts --
  // Sits OUTSIDE the trunk group: the shorts belong to the hips, and letting
  // them inherit the trunk's lean would shear them off the legs.
  const shorts = new T.Group();
  rig.add(shorts);
  shorts.add(blob(matDark, 0.60, 0.38, 0.31, 0, 1.32, 0));   // seals the leg holes
  // Barely tapered and only 0.5m deep. Flared, they stop being shorts and
  // become a skirt, which is a different joke entirely.
  const shortsMesh = new T.Mesh(geoTube, matDark);
  shortsMesh.scale.set(0.645, 0.50, 0.325);
  shortsMesh.position.y = 1.31;
  shortsMesh.castShadow = shadows;
  shorts.add(shortsMesh);
  const bandMesh = new T.Mesh(geoRing, matBand);
  bandMesh.scale.set(0.655, 0.10, 0.335);
  bandMesh.position.y = Y_BAND_TOP - 0.05;
  shorts.add(bandMesh);

  // ------------------------------------------------------------------ legs --
  const makeLeg = (side) => {
    const hip = new T.Group();
    hip.position.set(side * 0.28, 1.30, 0);
    hip.add(limb(0.235, 0.64));
    const knee = new T.Group();
    knee.position.y = -0.64;
    knee.add(limb(0.185, 0.54));
    knee.add(blob(matSkin, 0.155, 0.095, 0.28, 0, -0.55, -0.09)); // bare foot
    hip.add(knee);
    rig.add(hip);
    return { hip, knee };
  };
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  // =========================================================================
  // STATE + POSE
  // =========================================================================
  let anger = 0;
  let mouthOpen = 0;
  let proximity = 0;
  let speed = 0;
  let clock = 0;
  let gaitPhase = 0;
  let breathPhase = 0;
  let animSpeed = 0;
  let chew = 0;            // update()'s contribution to the gape
  let lastMouthA = -1, lastMouthO = -1;
  let lastBodyA = -1;
  let lastTintA = -1;

  /** Rebuilds the two deformable meshes, but only when they would change. */
  const syncGeometry = () => {
    const open = clamp01(mouthOpen + chew);
    if (Math.abs(anger - lastMouthA) > 0.002 || Math.abs(open - lastMouthO) > 0.002) {
      lastMouthA = anger; lastMouthO = open;
      writeMouth(anger, open);
    }
    // The skin costs a normal recompute, so it gets a coarser gate: 0.02 of
    // anger is under 2cm of travel anywhere on the body, invisible as a step.
    if (Math.abs(anger - lastBodyA) > 0.02) {
      lastBodyA = anger;
      writeTorso(anger);
    }
  };

  /**
   * THE SINGLE WRITER. Every transform, colour and uniform is set here from the
   * state variables above - never accumulated - so calling this twice in a
   * frame is identical to calling it once, and a ten minute chase ends in
   * exactly the pose the numbers say it should.
   */
  const pose = () => {
    const a = anger;
    const a2 = a * a;
    const prox = proximity;
    const breath = Math.sin(breathPhase);
    const swing = Math.sin(gaitPhase);
    const speedNorm = clamp01(animSpeed / 7.0);
    const heavy = 0.3 + 0.7 * speedNorm;

    syncGeometry();

    // ---------------------------------------------------------------- body --
    // Hips drop twice a stride (deepest at full leg spread, which is when a
    // swung leg would otherwise lift its own foot off the deck).
    rig.position.y = -(0.5 - 0.5 * Math.cos(gaitPhase * 2)) * BOB_HEIGHT * heavy;
    rig.rotation.z = swing * 0.075 * heavy + Math.sin(clock * 0.7) * 0.012;

    // Hunch. Negative X tips the trunk's up axis toward -Z, i.e. forward over
    // its own feet, which is what turns "standing there" into "coming for you".
    trunk.rotation.x = -(0.02 + 0.20 * a + 0.05 * speedNorm);
    // Swell about the waist. Chest and belly gain in girth and depth while the
    // whole thing compresses in height: it inflates rather than grows.
    trunk.scale.set(
      (1 + 0.085 * a) * (1 + 0.018 * breath),
      (1 - 0.045 * a) * (1 - 0.012 * breath),
      (1 + 0.110 * a) * (1 + 0.032 * breath),
    );

    // -------------------------------------------------------------- glasses --
    // The brow. Each half hinges on its INNER edge and lifts its outer end, so
    // the two lens tops form a downward V over the nose - the single most
    // legible "this thing is furious" cue a face has. The whole assembly also
    // slides down and stands further off the chest as the pecs bunch under it.
    const tilt = 0.30 * a;
    halves[0].rotation.z = -tilt;
    halves[1].rotation.z = tilt;
    glassesRoot.position.y = -0.05 * a;
    glassesRoot.position.z = -angerFront(Y_GLASSES, a);
    bridge.scale.y = 0.30 * (1 - 0.18 * a);
    bridge.position.z = -0.325 - 0.02 * a;

    // Something red wakes up behind the lenses. Pulses with the heartbeat when
    // it has you, and the additive smear ignores fog entirely.
    const pulse = 1 + 0.25 * Math.sin(clock * (3 + 9 * prox)) * (0.3 + 0.7 * prox);
    // a^2 keeps the lenses honestly black for the first half of the escalation,
    // so when they do light up it means something.
    matLens.emissiveIntensity = (0.015 + 0.26 * a2) * (1 + 0.5 * prox) * pulse;
    matGlow.opacity = clamp01((0.015 + 0.17 * a2 + 0.10 * prox * a) * (0.85 + 0.15 * pulse));

    // ----------------------------------------------------------------- brows --
    for (let k = 0; k < 2; k++) {
      const side = k === 0 ? -1 : 1;
      const b = brows[k];
      // Rise out of the chest, drop toward the bridge, and dip the inner end.
      b.position.set(
        side * (BROW_X - 0.03 * a),
        BROW_Y - 0.05 * a,
        BROW_Z - 0.26 * a,
      );
      b.rotation.z = side * 0.38 * a;
      b.scale.set(1 + 0.10 * a, 1 + 0.45 * a, 1 + 0.20 * a);
    }

    // ----------------------------------------------------------------- navel --
    // Nostril flare, and it darkens as the blood comes up.
    navel.scale.set(0.062 * (1 + 0.55 * a), 0.115 * (1 + 0.18 * a), 0.05);
    navel.position.z = frontZ(0, Y_NAVEL, a) + 0.028;

    // ------------------------------------------------------------------ arms --
    // Counter-swing to the legs, then abandon it entirely and reach when it is
    // nearly on top of you.
    const reach = clamp01((prox - 0.45) / 0.4);
    const armAmp = 0.22 + 0.26 * speedNorm;
    armL.shoulder.rotation.x = lerp(-swing * armAmp, 1.15, reach);
    armR.shoulder.rotation.x = lerp(swing * armAmp, 1.15, reach);
    // An arm hangs down -Y, and R_z maps (0,-1,0) to (sin z, -cos z, 0), so the
    // LEFT arm needs a negative z to splay outward. It has to clear a belly
    // that gains 11% in girth with anger, hence the same driver as the swell.
    // At full reach both converge inward, which is what makes it read as a grab.
    armL.shoulder.rotation.z = lerp(-(0.11 + 0.10 * a), 0.16, reach);
    armR.shoulder.rotation.z = lerp(0.11 + 0.10 * a, -0.16, reach);
    armL.elbow.rotation.x = lerp(0.16 + Math.max(0, -swing) * 0.22, -0.85, reach);
    armR.elbow.rotation.x = lerp(0.16 + Math.max(0, swing) * 0.22, -0.85, reach);

    // ------------------------------------------------------------------ legs --
    // Legs extend down -Y, so a positive X rotation swings the foot toward -Z.
    const legAmp = 0.30 + 0.22 * speedNorm;
    legL.hip.rotation.x = swing * legAmp;
    legR.hip.rotation.x = -swing * legAmp;
    legL.knee.rotation.x = 0.16 + Math.max(0, -swing) * 0.80;
    legR.knee.rotation.x = 0.16 + Math.max(0, swing) * 0.80;
    // Shorts ride with the hips, not with the leaning trunk.
    shorts.rotation.x = -0.02 * a;

    // ---------------------------------------------------------------- colour --
    // Uniform uploads only when the flush has actually moved.
    if (Math.abs(a - lastTintA) > 0.008) {
      lastTintA = a;
      matSkin.color.copy(SKIN_CALM).lerp(SKIN_HOT, a);
      // Just enough ember to keep the body off black in dread fog. a^3 holds it
      // at nothing until the last couple of tiers.
      matSkin.emissive.setRGB(0.055 * a2 * a, 0.006 * a2 * a, 0.010 * a2 * a);
      matLip.color.copy(LIP_CALM).lerp(LIP_HOT, a);
      matNavel.color.copy(LIP_CALM).multiplyScalar(0.55).lerp(LIP_HOT, a * 0.8);
    }
    // Gated on the gape SQUARED. A closed mouth is a dark crease in flesh - if
    // it glows shut, the frown stops being a fold and becomes a letterbox.
    const gape = clamp01(mouthOpen + chew);
    matMaw.emissiveIntensity = 0.03 + 1.5 * a2 * gape * gape;
  };

  // =========================================================================
  // PUBLIC API
  // =========================================================================

  /**
   * 0..1 threat. Applied immediately rather than eased internally: the game
   * already hands this thing a smoothed `dread`, and a second filter here would
   * only add lag between the level-up and the face. Safe to spam.
   */
  const setAnger = (t) => {
    const v = clamp01(t);
    if (v === anger) return;
    anger = v;
    pose();
  };


  /** 0..1 gape. Roars, the final lunge, and whatever else wants a maw. */
  const setMouthOpen = (t) => {
    const v = clamp01(t);
    if (v === mouthOpen) return;
    mouthOpen = v;
    pose();
  };

  /**
   * @param {number} dt seconds
   * @param {{anger?:number, proximity?:number, speed?:number, time?:number}} opts
   */
  const update = (dt, opts) => {
    const o = opts || EMPTY_OPTS;
    let step = dt > 0 ? dt : 0;
    if (step > 0.05) step = 0.05;   // a hitch must not teleport the gait

    clock = Number.isFinite(o.time) ? o.time : clock + step;
    if (o.anger !== undefined) anger = clamp01(o.anger);
    if (o.proximity !== undefined) proximity = clamp01(o.proximity);
    if (Number.isFinite(o.speed)) speed = o.speed < 0 ? 0 : o.speed;

    // Cadence falls out of the physics: metres per second over metres per
    // stride. A heavy body takes long slow steps whatever its speed.
    animSpeed = damp(animSpeed, speed, 6, step);
    gaitPhase += TAU * (IDLE_STRIDE + animSpeed / STRIDE_LENGTH) * step;
    if (gaitPhase > TAU) gaitPhase %= TAU;

    // Breathing accelerates and deepens with anger: by the end it is heaving.
    breathPhase += TAU * (0.42 + 0.85 * anger + 0.35 * proximity) * step;
    if (breathPhase > TAU) breathPhase %= TAU;

    // Chewing the air. Only close, only angry, and it rides on top of whatever
    // setMouthOpen was told to do.
    chew = proximity * (0.10 + 0.30 * anger) * (0.5 + 0.5 * Math.sin(clock * 7.5));

    pose();
  };

  const dispose = () => {
    for (let i = 0; i < geometries.length; i++) geometries[i].dispose();
    for (let i = 0; i < materials.length; i++) materials[i].dispose();
    geometries.length = 0;
    materials.length = 0;
    group.clear();
  };

  // Author the rest pose before anyone sees it.
  writeMouth(0, 0);
  lastMouthA = 0; lastMouthO = 0;
  pose();

  return { group, height: HEIGHT, setAnger, setMouthOpen, update, dispose };
}
