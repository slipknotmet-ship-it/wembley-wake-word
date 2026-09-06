import * as THREE from 'three';
import { CONFIG as DEFAULT_CONFIG } from '../core/config.js';

/**
 * entities/hand.js
 *
 * The player character: a right hand, palm down, that scampers around like a
 * creature. Pure puppet - no game state, no ctx, no logic. player.js owns the
 * returned `group`'s position/rotation; everything this module animates lives
 * on an inner `rig` group so the two never fight over a transform.
 *
 * Anatomy and axes (all in the group's LOCAL space):
 *   -Z is forward. +Y is up. The group's origin sits on the ground, i.e. the
 *   fingertips plant at local y = 0, so player.js can copy the player's foot
 *   position straight onto group.position.
 *   THUMB + INDEX point forward and form the catching claw.
 *   MIDDLE + RING + PINKY point down and are the three legs it runs on.
 *   For a right hand held palm-down with the fingers pointing away from you the
 *   thumb is on the LEFT, so the claw lives at -X and the legs march from the
 *   centre out to +X.
 *
 * Two things carry the animation:
 *   1. A two-bone analytic IK solver. Every finger is posed by handing it a
 *      fingertip target rather than by stacking Euler angles, which means the
 *      three legs plant *exactly* on the ground however the body bobs, leans or
 *      crouches, and the claw's two tips meet *exactly* at pinch = 1 however the
 *      fingers are proportioned.
 *   2. The leg targets are authored in GROUP space (planted on the ground) and
 *      pulled back into rig space through the inverse of the rig matrix, so the
 *      body can bob and roll on top of feet that stay stuck to the floor.
 *
 * Every rotation is written with `set`/`copy`, never accumulated, so a ten
 * minute run cannot drift the pose.
 */

// ---------------------------------------------------------------------------
// Module-scope scratch. Nothing in update() is allowed to allocate: one Vector3
// per finger per frame is ~600 objects/second, which on a phone is a GC hitch
// every few seconds right in the middle of a chase.
// ---------------------------------------------------------------------------
const _dir = new THREE.Vector3();
const _foot = new THREE.Vector3();
const _tuck = new THREE.Vector3();
const _tip = new THREE.Vector3();
const _tipOpen = new THREE.Vector3();
const _tipShut = new THREE.Vector3();
const _pivot = new THREE.Vector3();
const _invRig = new THREE.Matrix4();
const _qA = new THREE.Quaternion();
const _qB = new THREE.Quaternion();
const _qC = new THREE.Quaternion();
const _qD = new THREE.Quaternion();
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);
const EMPTY_OPTS = {};

const TAU = Math.PI * 2;

// --------------------------------------------------------------- tuning ----
// Lengths below are metres authored against the default CONFIG.player.radius of
// 0.45 and are multiplied by `U` at build time so the puppet rescales with the
// collision capsule instead of drifting out of it.

/** Fraction of CONFIG.player.height the palm floats at: a crouched sprinter. */
const STAND_FRACTION = 0.41;

/** Gait cadence in Hz: base is the idle shuffle, the rest is bought with speed. */
const CADENCE_BASE = 1.25;
const CADENCE_PER_SPEED = 0.42;
const CADENCE_MAX = 4.6;
/**
 * Half a stride, metres. A foot in stance travels 2*strideHalf backwards in one
 * half cycle, so `speed / (4 * cadence)` is the no-slip stride and the clamp is
 * what stops the legs from over-extending at top speed. Above that speed the
 * feet do slide a little - the alternative is a 6 Hz leg buzz nobody can read.
 */
// Shorter stride keeps the feet under the body instead of trailing out behind
// it, which is the other half of the level, fingers-down carriage.
const STRIDE_MAX = 0.26;
/** Peak fingertip lift during the swing half of the cycle. */
const LEG_LIFT = 0.17;
/** Legs are offset by a third of a cycle each: a proper three-beat gait. */
const LEG_PHASE_OFFSET = [0, TAU / 3, (TAU * 2) / 3];

/** Speeds (m/s) between which the gait fades in, so a standing hand is still. */
const IDLE_SPEED = 0.25;
const RUN_SPEED = 2.4;

const BOB_AMP = 0.035;      // vertical body bob, metres (3 footfalls per cycle)
const CROUCH = 0.055;       // how far the body sinks at full speed
/**
 * Forward pitch at full speed, radians. Deliberately shallow: a real hand
 * walking on its fingers keeps the back of the hand roughly LEVEL and drops the
 * fingers straight down. At 0.24 the body reared with the wrist high and the
 * legs trailing, which read as an animal rather than a hand.
 */
const LEAN_MAX = 0.09;
const LUNGE = 0.055;        // metres the body shifts forward over its feet at speed
const AIR_PITCH = 0.20;     // nose-up pitch while airborne
const ROLL_AMP = 0.055;     // side-to-side body roll with the gait
const YAW_AMP = 0.045;      // body yaw wag with the gait
const CLAW_BOB = 0.030;     // claw bounce with each footfall
const CLAW_SWING = 0.045;   // claw reach oscillation over the stride
const IDLE_BOB = 0.012;     // slow claw breathing when standing still
const REACH_LERP = 9.0;     // how fast the body drops into the reaching pose
const REACH_PITCH = -0.15;  // radians of extra nose-down dip at full reach
const FIST_CROUCH = 0.10;   // metres the body settles as the fist closes

/** How fast the airborne pose blends in/out (per second). */
const AIR_LERP = 13.0;
/** Pinch easing: slams shut, releases lazily. That asymmetry is the whole feel. */
const PINCH_CLOSE = 30.0;
const PINCH_OPEN = 11.0;

/** Fear tremble. Faint by design - it should read as nerves, not a seizure. */
const TREMBLE_HZ = 27.0;
const TREMBLE_POS = 0.011;  // metres at dread 1
const TREMBLE_ROT = 0.024;  // radians at dread 1

/** Two-bone solver frames (see solveTwoBone). */
const MODE_DOWN = 0;        // limb hangs along -Y   (legs)
const MODE_FORWARD = 1;     // limb points along -Z  (thumb + index)

// ---------------------------------------------------------------- helpers --
function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/** Frame-rate independent exponential approach; see renderer.js for the why. */
function damp(current, target, rate, dt) {
  if (!(dt > 0)) return current;
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / (edge1 - edge0 || 1e-6));
  return t * t * (3 - 2 * t);
}

/**
 * Cheap deterministic jitter in roughly [-1, 1]. Two incommensurate sines, so
 * unlike Math.random() it is stable if a frame is repeated and costs nothing.
 */
function noise(t, seed) {
  return Math.sin(t * (1.0 + seed * 0.29) + seed * 2.13) *
         Math.sin(t * (0.41 + seed * 0.19) + seed * 4.77);
}

/**
 * Concatenates already-transformed indexed geometries that share the standard
 * position/normal/uv attribute set into one BufferGeometry. Build time only:
 * it collapses the eleven static body parts into two draw calls, which matters
 * a lot more on a mobile tiler than the triangles do.
 */
function mergeParts(T, parts) {
  let vTotal = 0;
  let iTotal = 0;
  for (let i = 0; i < parts.length; i++) {
    const g = parts[i];
    vTotal += g.attributes.position.count;
    iTotal += g.index ? g.index.count : g.attributes.position.count;
  }

  const position = new Float32Array(vTotal * 3);
  const normal = new Float32Array(vTotal * 3);
  const uv = new Float32Array(vTotal * 2);
  const index = vTotal > 65535 ? new Uint32Array(iTotal) : new Uint16Array(iTotal);

  let vo = 0;
  let io = 0;
  for (let i = 0; i < parts.length; i++) {
    const g = parts[i];
    const pos = g.attributes.position;
    position.set(pos.array, vo * 3);
    if (g.attributes.normal) normal.set(g.attributes.normal.array, vo * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);

    const src = g.index;
    if (src) {
      for (let k = 0; k < src.count; k++) index[io + k] = src.getX(k) + vo;
      io += src.count;
    } else {
      for (let k = 0; k < pos.count; k++) index[io + k] = k + vo;
      io += pos.count;
    }
    vo += pos.count;
  }

  const out = new T.BufferGeometry();
  out.setAttribute('position', new T.BufferAttribute(position, 3));
  out.setAttribute('normal', new T.BufferAttribute(normal, 3));
  out.setAttribute('uv', new T.BufferAttribute(uv, 2));
  out.setIndex(new T.BufferAttribute(index, 1));
  out.computeBoundingSphere();
  return out;
}

/**
 * Analytic two-bone IK. Places the chain root/knee so the tip of the second
 * bone lands exactly on `target` (or as close as the bones reach), with the
 * joint bulging to the side chosen by `bendSign`.
 *
 * The root orientation is built from axis-angle quaternions rather than an
 * Euler triple because the *frame* has to differ per limb type: a leg hangs
 * down and swings through straight-down every stride, a claw finger points
 * forward and never leaves the horizontal. A single Euler order is singular for
 * one of those two, and a singular frame makes the knee flip 180 degrees mid
 * stride - the classic procedural-walk twitch.
 *
 *   MODE_FORWARD:  R = Ry(a) * Rx(b) * Ry(roll) * Rx(bend)   (degenerate up/down)
 *   MODE_DOWN:     R = Ry(planeYaw) * Rz(c) * Rx(b)  (degenerate horizontal)
 *
 * Both put the bend axis on the root's local X, which is why the knee angle can
 * simply be folded into `b`: Rx(b) * Rx(a1) === Rx(b + a1).
 */
function solveTwoBone(rootObj, kneeObj, hip, target, l1, l2, bendSign, mode, planeYaw, bendRoll) {
  _dir.copy(target).sub(hip);
  let d = _dir.length();
  if (d < 1e-5) {
    _dir.set(0, -1, 0);
    d = 1e-5;
  } else {
    _dir.multiplyScalar(1 / d);
  }
  // Keep the triangle solvable: never fully folded, never hyper-extended.
  const minD = Math.abs(l1 - l2) + 1e-4;
  const maxD = (l1 + l2) * 0.999;
  d = clamp(d, minD, maxD);

  // Law of cosines: a1 is hip-to-target vs bone 1, a2 is the interior knee angle.
  const a1 = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const a2 = Math.acos(clamp((l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2), -1, 1));

  if (mode === MODE_FORWARD) {
    const b = Math.acos(clamp(-_dir.y, -1, 1));
    const a = Math.atan2(-_dir.x, -_dir.z);
    _qA.setFromAxisAngle(AXIS_Y, a);
    if (bendRoll) {
      // Ry(a)*Rx(b) aims the straight chain down its local -Y; rolling about
      // that same local Y therefore turns the plane the knuckle bulges into
      // WITHOUT disturbing the aim. This is what separates a thumb from a
      // finger: a finger's knuckle rises in the vertical plane of its reach, a
      // thumb's swings out sideways across the palm. With roll = 0 this reduces
      // exactly to Rx(b + bendSign*a1), so fingers are unaffected.
      _qB.setFromAxisAngle(AXIS_X, b);
      _qD.setFromAxisAngle(AXIS_Y, bendRoll);
      _qC.setFromAxisAngle(AXIS_X, bendSign * a1);
      rootObj.quaternion.copy(_qA).multiply(_qB).multiply(_qD).multiply(_qC);
    } else {
      _qC.setFromAxisAngle(AXIS_X, b + bendSign * a1);
      rootObj.quaternion.copy(_qA).multiply(_qC);
    }
  } else {
    // Express the aim direction in the limb's own (yawed) bend plane first.
    const cy = Math.cos(planeYaw);
    const sy = Math.sin(planeYaw);
    const dx = _dir.x * cy - _dir.z * sy;
    const dz = _dir.x * sy + _dir.z * cy;
    const b = Math.asin(clamp(-dz, -1, 1));
    const c = Math.atan2(dx, -_dir.y);
    _qA.setFromAxisAngle(AXIS_Y, planeYaw);
    _qB.setFromAxisAngle(AXIS_Z, c);
    _qC.setFromAxisAngle(AXIS_X, b + bendSign * a1);
    rootObj.quaternion.copy(_qA).multiply(_qB).multiply(_qC);
  }

  kneeObj.rotation.x = -bendSign * (Math.PI - a2);
}

// ---------------------------------------------------------------------------

/**
 * Builds the hand puppet.
 *
 * @param {object} threeArg  the THREE namespace (main.js injects it)
 * @param {object} configArg the CONFIG object (main.js injects it)
 * @returns {{ group: object, setPinch: Function, update: Function }}
 */
export function createHand(threeArg, configArg) {
  // Injected by contract, but the module imports are a working fallback so the
  // file can be built or unit-poked on its own.
  const T = threeArg || THREE;
  const C = configArg || DEFAULT_CONFIG;

  const P = C.palette;
  // Everything below is authored for radius 0.45 / height 1.5 and scaled from
  // there, so retuning the capsule in config.js retunes the character with it.
  const U = C.player.radius / 0.45;
  const STAND_Y = C.player.height * STAND_FRACTION;

  // ------------------------------------------------------------- materials
  // Medium roughness plus a whisper of emissive tinted to the skin colour is a
  // one-uniform fake for subsurface scatter: it keeps the shadowed side of the
  // fingers warm instead of letting them go grey and plasticky, and it costs
  // nothing on a mobile GPU compared with a real transmission material.
  const skinMat = new T.MeshStandardMaterial({
    color: P.hand,
    roughness: 0.58,
    metalness: 0.0,
  });
  skinMat.emissive = new T.Color(P.hand);
  skinMat.emissiveIntensity = 0.09;

  const shadowMat = new T.MeshStandardMaterial({
    color: P.handShadow,
    roughness: 0.82,
    metalness: 0.0,
  });

  // ------------------------------------------------------------ dimensions
  const PALM_W = 0.38 * U;   // half width  (x)
  const PALM_H = 0.135 * U;  // half thickness (y) - a palm is a slab
  const PALM_D = 0.42 * U;   // half depth  (z)

  // Hip heights: the palm's underside is domed, so the outer fingers hang from
  // a slightly lower point. It also buys the shorter fingers some slack.
  const HIP_MID = STAND_Y - 0.09 * U;
  const HIP_RING = STAND_Y - 0.11 * U;
  const HIP_PINKY = STAND_Y - 0.145 * U;

  // One canonical bone pair, derived from the stance height so the legs always
  // reach the floor with a comfortable ~70% extension at rest.
  // Floored: the IK divides by l1 and by l1*l2, so a config that drove HIP_MID
  // to zero would hand every joint a NaN quaternion and freeze the pose solid.
  const BONE_L1 = Math.max(0.02, HIP_MID * 0.77);
  const BONE_L2 = Math.max(0.02, HIP_MID * 0.69);
  const R_PROX = 0.078 * U;
  const R_DIST = 0.062 * U;

  // ------------------------------------------------------- shared geometry
  // All five fingers share exactly two geometries; per-finger proportions come
  // from a uniform group scale (skeleton) plus a mesh scale (thickness). Each
  // bone is one merged mesh - capsule plus its joint balls - so a whole finger
  // costs two draw calls instead of five.
  const proxParts = [
    new T.CapsuleGeometry(R_PROX, Math.max(0.01, BONE_L1 - 2 * R_PROX), 4, 10)
      .translate(0, -BONE_L1 * 0.5, 0),
    new T.SphereGeometry(R_PROX * 1.15, 8, 6),           // the palm knuckle
  ];
  const distParts = [
    new T.CapsuleGeometry(R_DIST, Math.max(0.01, BONE_L2 - 2 * R_DIST), 4, 10)
      .translate(0, -BONE_L2 * 0.5, 0),
    new T.SphereGeometry(R_DIST * 1.2, 8, 6),            // the mid knuckle
    new T.SphereGeometry(R_DIST * 1.25, 8, 6).translate(0, -BONE_L2, 0), // fingertip
  ];
  const proxGeo = mergeParts(T, proxParts);
  const distGeo = mergeParts(T, distParts);
  for (let i = 0; i < proxParts.length; i++) proxParts[i].dispose();
  for (let i = 0; i < distParts.length; i++) distParts[i].dispose();

  // ------------------------------------------------------------- the group
  const group = new T.Group();
  group.name = 'hand';

  // Everything the animation touches hangs off `rig`. player.js owns `group`'s
  // transform; this module never writes to it. Bob, lean, roll and tremble all
  // live here, which is also what makes the ground-space foot IK possible.
  const rig = new T.Group();
  rig.name = 'hand-rig';
  group.add(rig);

  // --------------------------------------------------------- palm and body
  // A squashed ellipsoid reads as a palm where a box reads as a crate, and the
  // chase camera sits close enough that the silhouette wants real segments. It gets tapered toward the wrist so the silhouette has a
  // wide knuckle edge and a narrow heel - that taper is most of the "hand".
  const palmGeo = new T.SphereGeometry(1, 20, 13);
  palmGeo.scale(PALM_W, PALM_H, PALM_D);
  {
    const pos = palmGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const t = clamp01((pos.getZ(i) / PALM_D + 1) * 0.5); // 0 knuckles -> 1 wrist
      pos.setX(i, pos.getX(i) * (1 - 0.30 * t));
      pos.setY(i, pos.getY(i) * (1 + 0.18 * t));           // the heel is fleshier
    }
    palmGeo.computeVertexNormals();
  }

  // Wrist stub, angled up and back like a stump planted in the ground behind
  // the palm. It balances the silhouette against the forward-reaching claw.
  const WRIST_TILT = 0.87;                 // radians from vertical, toward +Z
  const WRIST_LEN = 0.43 * U;
  const WRIST_R = 0.15 * U;
  const wristMidY = STAND_Y + 0.16 * U;
  const wristMidZ = PALM_D * 0.98;
  const wristEndY = wristMidY + WRIST_LEN * 0.5 * Math.cos(WRIST_TILT);
  const wristEndZ = wristMidZ + WRIST_LEN * 0.5 * Math.sin(WRIST_TILT);

  const skinParts = [
    palmGeo.clone().translate(0, STAND_Y, 0),
    // Thenar eminence: the fleshy mound at the base of the thumb. Anatomically
    // it is most of what distinguishes a hand's silhouette from a paw, and
    // without it the thumb looks stuck onto the side of the palm.
    new T.SphereGeometry(0.20 * U, 12, 9)
      .scale(0.85, 0.62, 1.15)
      .translate(-0.26 * U, STAND_Y - 0.03 * U, -0.02 * U),
    new T.CapsuleGeometry(WRIST_R, Math.max(0.01, WRIST_LEN - 2 * WRIST_R), 5, 12)
      .rotateX(WRIST_TILT)
      .translate(0, wristMidY, wristMidZ),
  ];
  const shadowParts = [
    // The palm pad: the darker underside you actually see when it runs at you.
    palmGeo.clone().scale(0.88, 0.6, 0.88).translate(0, STAND_Y - PALM_H * 0.62, 0),
    // A cuff at the end of the wrist stump. Pure Addams Family.
    new T.CylinderGeometry(WRIST_R * 1.32, WRIST_R * 1.22, 0.11 * U, 12, 1)
      .rotateX(WRIST_TILT)
      .translate(0, wristEndY, wristEndZ),
  ];

  // ----------------------------------------------------------- the fingers
  // hip:   attachment point on the palm, rig space
  // scale: uniform skeleton scale (bone length)
  // thick: extra mesh-only girth, so a thumb can be stubby without being short
  const KNUCKLE_X = [-0.26, -0.10, 0.13, 0.32];  // index, middle, ring, pinky

  const fingerSpecs = [
    {
      id: 'thumb',
      // A thumb is not a short finger in the finger row. It attaches low and
      // BACK, near the wrist, off the side of the palm.
      hip: new T.Vector3(-0.34 * U, STAND_Y - 0.05 * U, -0.02 * U),
      // Two phalanges against a finger's three: much shorter, much stubbier.
      scale: 0.72, thick: 1.62, darkTip: false,
      // Opposed: the knuckle swings out ACROSS the palm rather than bulging in
      // the vertical plane of its reach, which is what made it read as an
      // upside-down index finger.
      bendSign: -1, mode: MODE_FORWARD, planeYaw: 0, bendRoll: 1.15,
      openTip: new T.Vector3(-0.58 * U, 0.30 * U, -0.26 * U),
      closedTip: new T.Vector3(-0.40 * U, STAND_Y - 0.08 * U, -0.44 * U),
      airTip: new T.Vector3(-0.64 * U, 0.42 * U, -0.20 * U),
      // Reaching down for an emeem: the thumb drops below the index and sits
      // back from it, so the open gap is the diagonal pincer of a real pinch
      // rather than two fingers side by side.
      // Pinched, the thumb pad stops 0.10 m ABOVE the index pad - the same gap
      // the running pose closes to, so the two tip balls press together instead
      // of occupying the same point. Sharing one target between both fingers
      // made them interpenetrate completely at every catch (reach ~1, pinch ~1).
      reachOpenTip: new T.Vector3(-0.52 * U, 0.46 * U, -0.62 * U),
      reachShutTip: new T.Vector3(-0.40 * U, 0.39 * U, -0.74 * U),
      swayPhase: 0.0,
    },
    {
      id: 'index',
      hip: new T.Vector3(KNUCKLE_X[0] * U, STAND_Y + 0.02 * U, -0.36 * U),
      scale: 1.05, thick: 1.05, darkTip: false,
      // Top half of the claw: knuckle up (+1), tip curls down to meet the thumb.
      bendSign: 1, mode: MODE_FORWARD, planeYaw: 0,
      // Rests DOWN with the other fingers: when a hand walks on its fingers the
      // index is one of them, not an antenna held in the air. It only lifts to
      // meet the thumb when there is something to pinch, which is what the
      // reach targets below are for.
      openTip: new T.Vector3(-0.30 * U, 0.17 * U, -0.60 * U),
      closedTip: new T.Vector3(-0.40 * U, STAND_Y - 0.08 * U, -0.44 * U),
      airTip: new T.Vector3(-0.26 * U, 0.44 * U, -0.74 * U),
      // The index hangs furthest down and forward - it is the long half of the
      // pincer, and it is what closes up onto the thumb.
      // The index holds its height and pulls back; the thumb is what travels
      // down onto it. Kept 0.10 m below the thumb's shut target so neither tip
      // has to cross through the other on the way in.
      reachOpenTip: new T.Vector3(-0.30 * U, 0.30 * U, -0.86 * U),
      reachShutTip: new T.Vector3(-0.40 * U, 0.29 * U, -0.74 * U),
      swayPhase: 1.1,
    },
    {
      id: 'middle',
      hip: new T.Vector3(KNUCKLE_X[1] * U, HIP_MID, -0.32 * U),
      scale: 1.00, thick: 1.00, darkTip: true,
      bendSign: 1, mode: MODE_DOWN, planeYaw: 0.0,
      home: new T.Vector3(-0.14 * U, 0, -0.38 * U),
      tuck: new T.Vector3(-0.04 * U, -0.30 * U, 0.16 * U),
      // Curled tight under the palm for the grab. Pulled in close so the two
      // bones fold hard and the KNUCKLE juts down - the fist rests on its
      // knuckles the way a hand does when it braces to pick something up.
      fist: new T.Vector3(-0.06 * U, -0.20 * U, 0.20 * U),
    },
    {
      id: 'ring',
      hip: new T.Vector3(KNUCKLE_X[2] * U, HIP_RING, -0.26 * U),
      scale: 0.93, thick: 0.94, darkTip: true,
      bendSign: 1, mode: MODE_DOWN, planeYaw: -0.22,
      home: new T.Vector3(0.20 * U, 0, -0.28 * U),
      tuck: new T.Vector3(0.06 * U, -0.28 * U, 0.16 * U),
      fist: new T.Vector3(0.08 * U, -0.19 * U, 0.20 * U),
    },
    {
      id: 'pinky',
      hip: new T.Vector3(KNUCKLE_X[3] * U, HIP_PINKY, -0.10 * U),
      scale: 0.85, thick: 0.86, darkTip: true,
      bendSign: 1, mode: MODE_DOWN, planeYaw: -0.45,
      home: new T.Vector3(0.44 * U, 0, -0.06 * U),
      tuck: new T.Vector3(0.12 * U, -0.26 * U, 0.14 * U),
      fist: new T.Vector3(0.16 * U, -0.18 * U, 0.18 * U),
    },
  ];

  const legs = [];
  const claw = [];

  for (let i = 0; i < fingerSpecs.length; i++) {
    const spec = fingerSpecs[i];

    const root = new T.Group();
    root.name = 'finger-' + spec.id;
    root.position.copy(spec.hip);
    root.scale.setScalar(spec.scale);

    const prox = new T.Mesh(proxGeo, skinMat);
    // Non-uniform mesh scale only: fingers are flattened ovals in cross section,
    // and squashing the mesh (not the joint) keeps the skeleton uniform so the
    // IK bone lengths stay honest.
    prox.scale.set(spec.thick, 1, spec.thick * 0.88);
    prox.castShadow = true;
    root.add(prox);

    const knee = new T.Group();
    knee.position.set(0, -BONE_L1, 0);
    // The legs get dark distal segments: they read as worn, dirty toe pads and
    // they are the CONFIG.palette.handShadow accent without an extra material.
    const dist = new T.Mesh(distGeo, spec.darkTip ? shadowMat : skinMat);
    dist.scale.set(spec.thick * 0.95, 1, spec.thick * 0.85);
    dist.castShadow = true;
    knee.add(dist);
    root.add(knee);

    rig.add(root);

    const entry = {
      root,
      knee,
      hip: spec.hip,
      l1: BONE_L1 * spec.scale,
      l2: BONE_L2 * spec.scale,
      bendSign: spec.bendSign,
      mode: spec.mode,
      planeYaw: spec.planeYaw,
    };

    if (spec.mode === MODE_DOWN) {
      entry.home = spec.home;
      entry.tuck = spec.tuck;
      entry.fist = spec.fist;
      entry.strideScale = spec.scale;   // a short finger takes a short step
      entry.phase = LEG_PHASE_OFFSET[legs.length] || 0;
      legs.push(entry);
      // A darker pad on the palm where each leg attaches.
      shadowParts.push(
        new T.SphereGeometry(0.075 * U, 8, 6)
          .translate(spec.hip.x, spec.hip.y - 0.02 * U, spec.hip.z),
      );
    } else {
      entry.openTip = spec.openTip;
      entry.closedTip = spec.closedTip;
      entry.bendRoll = spec.bendRoll || 0;
      entry.reachOpenTip = spec.reachOpenTip;
      entry.reachShutTip = spec.reachShutTip;
      entry.airTip = spec.airTip;
      entry.swayPhase = spec.swayPhase;
      claw.push(entry);
    }

    // A knuckle bump on the back of the hand above each finger root. The chase
    // camera spends the whole game looking down at this surface, so the bumps
    // are both proud AND in the shadow tint: without them the back of the hand
    // is a bald dome from the only angle the player ever sees it.
    if (spec.id !== 'thumb') {
      shadowParts.push(
        new T.SphereGeometry(0.082 * U, 8, 6)
          .scale(1, 0.7, 1)
          .translate(spec.hip.x, STAND_Y + PALM_H * 0.42, spec.hip.z * 0.86),
      );
    }
  }

  // Two merged static meshes instead of nine separate ones.
  const bodySkin = new T.Mesh(mergeParts(T, skinParts), skinMat);
  bodySkin.castShadow = true;
  bodySkin.receiveShadow = true;
  rig.add(bodySkin);

  const bodyShadow = new T.Mesh(mergeParts(T, shadowParts), shadowMat);
  bodyShadow.castShadow = true;
  bodyShadow.receiveShadow = true;
  rig.add(bodyShadow);

  // The merge copied every vertex, so the sources are dead weight now.
  for (let i = 0; i < skinParts.length; i++) skinParts[i].dispose();
  for (let i = 0; i < shadowParts.length; i++) shadowParts[i].dispose();
  palmGeo.dispose();

  // ------------------------------------------------------- animation state
  let clock = 0;        // fallback clock when opts.time is not supplied
  let gaitPhase = 0;    // integrated, not derived from time: cadence varies
  let air = 0;          // 0 grounded .. 1 airborne, smoothed
  let pinch = 0;        // eased pinch actually applied
  let pinchTarget = 0;  // what setPinch() last asked for
  let reach = 0;        // eased reach actually applied
  let reachTarget = 0;  // what setReach() last asked for

  /**
   * @param {number} t 0 = claw wide open, 1 = thumb tip touching index tip.
   * The value is a *target*; update() eases toward it fast on the way closed
   * and slowly on the way open, which is what makes a catch feel like a snap.
   */
  function setPinch(t) {
    pinchTarget = clamp01(Number.isFinite(t) ? t : 0);
  }

  /**
   * @param {number} t 0 = normal running carriage, 1 = full reaching-down pose:
   * the body pitches nose-down and the thumb and index drop into a pincer aimed
   * at the ground, the way a hand actually poses to pick something up. The two
   * are independent: `reach` says WHERE the claw is, `pinch` says whether it is
   * open or shut, so a catch closes correctly at whatever height the reach put
   * the tips.
   */
  function setReach(t) {
    reachTarget = clamp01(Number.isFinite(t) ? t : 0);
  }

  /**
   * @param {number} dt   seconds since the last call
   * @param {object} opts { speed:number m/s, grounded:boolean, dread:0..1, time:seconds }
   */
  function update(dt, opts) {
    const o = opts || EMPTY_OPTS;
    let step = Number.isFinite(dt) ? dt : 0;
    if (step < 0) step = 0;
    else if (step > 0.05) step = 0.05;   // a hitch must not teleport the gait
    clock += step;

    const time = Number.isFinite(o.time) ? o.time : clock;
    const speed = Number.isFinite(o.speed) ? Math.max(0, o.speed) : 0;
    const dread = clamp01(Number.isFinite(o.dread) ? o.dread : 0);
    const grounded = o.grounded === undefined ? true : !!o.grounded;

    air = damp(air, grounded ? 0 : 1, AIR_LERP, step);
    if (air < 0.0005) air = 0;
    else if (air > 0.9995) air = 1;

    reach = damp(reach, reachTarget, REACH_LERP, step);
    if (reach < 0.0005) reach = 0;
    else if (reach > 0.9995) reach = 1;

    pinch = damp(pinch, pinchTarget, pinchTarget > pinch ? PINCH_CLOSE : PINCH_OPEN, step);
    // Quadratic ease-out on top of the exponential: most of the travel happens
    // in the first few frames, so the claw *snaps* instead of drifting shut.
    const inv = 1 - pinch;
    const pinchShaped = 1 - inv * inv;

    // How balled-up the three walking fingers are. Driven by the raw pinch and
    // squared, so they stay planted through the whole approach and only clench
    // in the last moment as the claw actually shuts.
    const fistAmt = pinch * pinch;

    // ------------------------------------------------------------- gait ---
    const speedF = clamp01(speed / (C.player.walkSpeed || 1));
    // `moving` gates every gait amplitude: standing still means planted feet,
    // not marching on the spot.
    const moving = smoothstep(IDLE_SPEED, RUN_SPEED, speed) * (1 - air);

    const cadence = Math.min(CADENCE_BASE + CADENCE_PER_SPEED * speed, CADENCE_MAX);
    // Legs all but stop cycling in mid-air; they are tucked, not running.
    gaitPhase += TAU * cadence * step * (1 - air * 0.85);
    if (gaitPhase >= TAU) gaitPhase -= TAU * Math.floor(gaitPhase / TAU);

    // No-slip stride, clamped so a leg never has to out-reach its bones.
    const strideHalf = Math.min(speed / (4 * cadence), STRIDE_MAX * U) * moving;
    const lift = LEG_LIFT * U * moving;

    // ------------------------------------------------------------- body ---
    const bobPhase = gaitPhase * 3;   // three legs, three footfalls per cycle
    const bob = BOB_AMP * U * moving * Math.sin(bobPhase) - CROUCH * U * speedF * (1 - air);
    const lean = -LEAN_MAX * speedF * (1 - air) + AIR_PITCH * air;
    const roll = ROLL_AMP * moving * Math.sin(gaitPhase + 0.8);
    const wag = YAW_AMP * moving * Math.sin(gaitPhase + 2.1);

    // Fear tremble: quadratic in dread so it is invisible early and unmistakable
    // once the Protector is close enough to matter.
    const fear = dread * dread;
    const nt = time * TREMBLE_HZ;
    const trPos = TREMBLE_POS * U * fear;
    const trRot = TREMBLE_ROT * fear;

    // Reaching tips the whole body nose-down. The rig pivots about the palm and
    // the foot targets are pulled back through its inverse, so the feet stay
    // planted while the front of the hand dips toward the ground.
    rig.rotation.set(
      lean + REACH_PITCH * reach + noise(nt, 3) * trRot,
      wag + noise(nt, 4) * trRot,
      roll + noise(nt, 5) * trRot,
    );

    // Pitch and roll about the PALM, not about the group origin down on the
    // floor: `position = p - R*p + t` rotates the body in place. With the naive
    // origin pivot a 14 degree lean swings the claw a third of a metre toward
    // the ground, because the claw is a metre out along the moment arm.
    _pivot.set(0, STAND_Y, 0).applyQuaternion(rig.quaternion);
    rig.position.set(
      -_pivot.x + noise(nt, 0) * trPos,
      // Drop onto the knuckles as the fist forms: a hand braced to pinch sits
      // lower than one standing on extended fingers.
      STAND_Y - _pivot.y + bob - FIST_CROUCH * U * pinch * pinch + noise(nt, 1) * trPos,
      // A little forward shift over the feet at speed; the lean alone reads as
      // tipping over rather than as driving forward.
      -_pivot.z - LUNGE * U * speedF * (1 - air) + noise(nt, 2) * trPos * 0.7,
    );

    // Foot targets are authored on the ground in GROUP space; pull them back
    // through the rig's transform so the body can bob and roll over feet that
    // stay planted. One matrix invert per frame for all three legs.
    rig.updateMatrix();
    _invRig.copy(rig.matrix).invert();

    // ------------------------------------------------------------- legs ---
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const ph = gaitPhase + leg.phase;
      const s = Math.sin(ph);
      const c = Math.cos(ph);
      const stride = strideHalf * leg.strideScale;

      // Stance (sin >= 0) plants the foot and slides it backwards at roughly
      // the travel speed; swing (sin < 0) lifts it and swings it forward again.
      _foot.set(
        leg.home.x,
        Math.max(0, -s) * lift,
        leg.home.z - c * stride,
      );
      _foot.applyMatrix4(_invRig);

      // Grab: the three walking fingers clench into a fist and the hand braces
      // on its knuckles while the thumb and index do the pinching. Blended on
      // the IK *target* like the air tuck, so it never fights the solver.
      if (fistAmt > 0 && leg.fist) {
        _tuck.copy(leg.hip).add(leg.fist);
        _foot.lerp(_tuck, fistAmt);
      }

      if (air > 0) {
        // Airborne: fold the legs up under the palm. Blending the *target*
        // rather than the angles means the tuck never fights the IK.
        _tuck.copy(leg.hip).add(leg.tuck);
        _foot.lerp(_tuck, air);
      }

      solveTwoBone(leg.root, leg.knee, leg.hip, _foot, leg.l1, leg.l2,
        leg.bendSign, MODE_DOWN, leg.planeYaw);
    }

    // ------------------------------------------------------------- claw ---
    for (let i = 0; i < claw.length; i++) {
      const f = claw[i];
      // Jump pose: throw the claw wide. It is the clearest airborne read there
      // is, because the two forward fingers own the silhouette. The splay is
      // applied to the OPEN pose and the pinch closes from there, so a catch
      // made in mid-air still shuts the claw properly.
      // Build the open and shut targets separately, each already moved into the
      // reaching pose, then interpolate between them by the pinch. Blending the
      // reach in afterwards would drag a closing claw back up to the running
      // carriage mid-catch.
      _tipOpen.copy(f.openTip);
      if (air > 0) _tipOpen.lerp(f.airTip, air);
      if (reach > 0) _tipOpen.lerp(f.reachOpenTip, reach);

      _tipShut.copy(f.closedTip);
      if (reach > 0) _tipShut.lerp(f.reachShutTip, reach);

      _tip.copy(_tipOpen).lerp(_tipShut, pinchShaped);

      // The claw rides the run: a bounce per footfall and a reach per stride.
      _tip.y += CLAW_BOB * U * moving * Math.sin(bobPhase + f.swayPhase);
      _tip.z += CLAW_SWING * U * moving * Math.sin(gaitPhase + f.swayPhase);
      // Slow breathing while idle, so a standing hand is never dead on screen.
      // It fades out as the claw closes: a pinch that keeps wobbling looks like
      // the catch never quite landed.
      _tip.y += IDLE_BOB * U * (1 - moving) * (1 - pinchShaped) *
                Math.sin(time * 1.7 + f.swayPhase);

      solveTwoBone(f.root, f.knee, f.hip, _tip, f.l1, f.l2,
        f.bendSign, MODE_FORWARD, 0, f.bendRoll);
    }
  }

  // Pose it once so the very first rendered frame is a hand and not a T-pose.
  update(0, EMPTY_OPTS);

  return { group, setPinch, setReach, update };
}
