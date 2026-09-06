import * as THREE from 'three';
import { CONFIG } from '../core/config.js';

/**
 * EMEEM - the Protector of Emeem Land.
 *
 * One job: make you afraid to stop moving.
 *
 * The monster is a kinematic AABB brute glued to the ground plane. It never
 * jumps and never climbs, which is deliberate - hopping onto a tall box it has
 * to walk around is a legitimate player advantage and nothing in here defeats
 * it. What it *does* do is steer: every plan tick it fans a spread of candidate
 * headings out from its nose, probes them against the world's colliders and
 * banks toward the clearest one that still points roughly at you. That is what
 * makes weaving through the obstacle field an actual strategy instead of a
 * cosmetic detail, and it is why the thing reads as hunting rather than
 * homing.
 *
 * ORIENTATION. The model is built facing -Z, matching the hand and matching
 * what THREE.Object3D.lookAt() considers forward, so yaw follows the same
 * convention as the player: yaw = atan2(-dx, -dz) and the forward vector for a
 * given yaw is (-sin yaw, 0, -cos yaw). The chase camera sits on +Z looking
 * toward -Z and the player flees toward -Z, so "behind the player" is +Z.
 * state.js seeds the monster at -Z, which would put it on screen ahead of you
 * at the whistle; reset() (and construction) corrects that.
 *
 * BUDGET. Steering costs one world.queryAABB per plan tick (12Hz) and movement
 * costs one more per fixed step; the whole candidate fan is scored analytically
 * against that single cached collider list, so the 120Hz step never queries
 * more than once. Every scratch vector is module scope. The rig is 28 meshes
 * over 4 shared geometries and 7 shared materials - about 2k triangles, with
 * the spikes and both rows of teeth instanced. A rounding error next to the
 * streamed world, which is the point: this thing has to stay on screen while
 * everything else is happening.
 */

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- steering

/** Plan tick. Sensing at 12Hz instead of 120Hz costs nothing visible and
 *  divides the collider queries by ten on a phone GPU-bound frame. */
const PLAN_INTERVAL = 1 / 12;

/**
 * Candidate heading offsets in radians, fanned around the CURRENT heading -
 * roughly 0, +/-17, 34, 54, 77 and 100 degrees either side.
 *
 * Fanning around the current heading rather than around the line to the player
 * is the difference between a monster that follows a wall and one that ping-
 * pongs along it. Once it is running along a face, "keep going" is always
 * candidate zero; if the fan were centred on the player instead, the heading
 * that follows the wall would drop out of range the moment it slid past your
 * bearing, and it would turn back into the bricks. Hysteresis then comes free
 * from the geometry instead of from a fudge factor.
 */
const FAN = [0, 0.30, -0.30, 0.60, -0.60, 0.95, -0.95, 1.35, -1.35, 1.75, -1.75];

/**
 * Scoring weights, in a normalised currency: clearance is divided by the probe
 * length (0 = nose against something, 1 = the whole lookahead open) so the
 * tuning does not drift as the probe stretches with speed, and alignment is the
 * cosine of the angle to the player (1 = straight at you, -1 = away).
 *
 * W_ALIGN is deliberately well under W_CLEAR: it wants your throat, but not
 * enough to keep walking into a wall to get at it.
 */
const W_CLEAR = 1.0;
const W_ALIGN = 0.55;
/** Tiny cost per radian of steering, purely to break ties toward straight. */
const W_TURN = 0.06;

/** Distance at which a probe counts the monster as already touching a box. */
const CONTACT_SKIN = 0.25;
/** dot(heading, outward normal) above this is sliding along a surface we are
 *  already against, which is free; below it we are driving into it. */
const SLIDE_DOT = -0.25;

/** Probe length = speed * this, clamped. ~1.4s of lookahead: far enough to
 *  commit to a side of an obstacle, short enough not to swerve at scenery. */
const PROBE_PER_SPEED = 1.4;
const PROBE_MIN = 5;
const PROBE_MAX = 13;

/** Below this much clearance ahead we count as scraping and take the config
 *  slowdown. Expressed in body radii so it scales with the monster. */
const SCRAPE_RADII = 2.5;

// ------------------------------------------------------------- persistence

/** Fraction of the intended step distance below which we call it "not moving". */
const STUCK_RATIO = 0.35;
/** Seconds of not-moving before the unstick kicks in. */
const STUCK_TRIGGER = 0.7;
/** How long an unstick shove lasts. */
const UNSTICK_TIME = 0.8;
/** Extra heading bias applied while unsticking, radians. */
const UNSTICK_TURN = 1.1;

// --------------------------------------------------------- rubber banding

/** Mild, one-directional catch-up: it may never be rubber-banded while close.
 *  Falling 55m back is a good run; 100m back is a lost monster. */
const RUBBER_START = 55;
const RUBBER_RANGE = 45;
const RUBBER_MAX = 1.35;

// ---------------------------------------------------------------- physique

/** Half-extent in X/Z at scale 1. The rig is ~2.2m across the shoulders; the
 *  collision box is deliberately narrower so it does not snag on corners it
 *  visually clears. */
const BODY_RADIUS = 0.85;
/** Rig height at scale 1, used only to bound the collider query in Y. */
const BODY_HEIGHT = 3.4;
/** Kerb height it simply tramples rather than paths around, at scale 1. The
 *  world's lowest platforms are 0.45m and stopping a three-metre horror dead
 *  at one would look ridiculous. */
const STEP_OVER = 0.7;
/** How high it can reach at scale 1. Player feet above this are out of reach,
 *  which is the whole point of climbing. */
const REACH_HEIGHT = 2.4;

/** Separation left after a push-out so we are never exactly touching. */
const EPS = 0.002;

/** Exponential rates: speed surges over ~1s on a level-up, size over ~1.5s. */
const SPEED_LERP = 1.6;
const SCALE_LERP = 2.2;

// --------------------------------------------------------------- animation

/** Metres of ground covered per stride at scale 1. Sets the gait frequency. */
const STRIDE_LENGTH = 2.3;
/** Strides per second while standing still, so it never freezes mid-pose. */
const IDLE_STRIDE_RATE = 0.32;
const BOB_HEIGHT = 0.14;
const LEAN_BASE = 0.10;
const LEAN_DREAD = 0.30;
const JAW_BASE = 0.05;
const JAW_DREAD = 0.32;
const EYE_EMISSIVE_MIN = 1.1;
const EYE_EMISSIVE_MAX = 4.2;

/** Bone white for teeth. Not a tunable in config.js - it is not something the
 *  dread ramp touches, it just has to be the lightest thing on the model so
 *  the open jaw reads as a gap at forty metres. */
const TOOTH_COLOR = 0xd8cdba;
/** Wet interior of the mouth: near-black, faintly lit by the same red as the
 *  eyes so a wide jaw glows instead of reading as a hole. */
const MAW_COLOR = 0x18060a;

// ----------------------------------------------------------------- scratch
// One monster, one thread, one synchronous call at a time: sharing these costs
// nothing and keeps the 120Hz step allocation-free.
const _qMin = new THREE.Vector3();
const _qMax = new THREE.Vector3();
const _plan = [];  // colliders around the probe fan, refilled each plan tick
const _near = [];  // colliders overlapping this step's swept box

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, t) => a + (b - a) * t;
/** Frame-rate independent exponential approach. */
const damp = (a, b, rate, dt) => a + (b - a) * (1 - Math.exp(-rate * dt));

/** Wraps an angle into -PI..PI so turning always takes the shortest path. */
function wrapPi(a) {
  let x = (a + Math.PI) % TAU;
  if (x < 0) x += TAU;
  return x - Math.PI;
}

/** Direction (x,z) -> yaw, for a model whose forward axis is -Z. */
const dirToHeading = (dx, dz) => Math.atan2(-dx, -dz);

/**
 * Distance along a ray before it enters any of `list`, capped at maxT.
 *
 * A 2D slab test in XZ against boxes inflated by the body radius - the standard
 * Minkowski trick, which turns "will this fat monster fit past that box" into
 * "does this thin ray hit that fatter box".
 *
 * The contact case is the one that matters and the one a naive slab test gets
 * catastrophically wrong. A monster resting against a wall is sitting ON the
 * inflated surface, so EVERY heading with the faintest component into the wall
 * reports ~0 clearance, the whole fan ties at zero, the direct heading wins on
 * tie-break and the thing grinds into the bricks forever. So: if the origin is
 * already within CONTACT_SKIN of a box, that box only blocks headings that
 * actually drive into its face. Sliding along it is free, which is exactly how
 * a real animal gets around a wall.
 *
 * @param {number} floorY colliders whose top is below this are trampled, not avoided
 */
function clearanceAlong(ox, oz, dx, dz, maxT, r, floorY, list) {
  let best = maxT;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c.max.y <= floorY) continue;

    const minX = c.min.x - r;
    const maxX = c.max.x + r;
    const minZ = c.min.z - r;
    const maxZ = c.max.z + r;

    // Closest point on the inflated box, and the gap to it.
    const px = ox < minX ? minX : ox > maxX ? maxX : ox;
    const pz = oz < minZ ? minZ : oz > maxZ ? maxZ : oz;
    let nx = ox - px;
    let nz = oz - pz;
    const gap = Math.sqrt(nx * nx + nz * nz);

    if (gap <= CONTACT_SKIN) {
      if (gap < 1e-4) {
        // On the face, or embedded: the shallowest side is the way out.
        let m = ox - minX; nx = -1; nz = 0;
        if (maxX - ox < m) { m = maxX - ox; nx = 1; nz = 0; }
        if (oz - minZ < m) { m = oz - minZ; nx = 0; nz = -1; }
        if (maxZ - oz < m) { nx = 0; nz = 1; }
      } else {
        nx /= gap; nz /= gap;
      }
      if (dx * nx + dz * nz > SLIDE_DOT) continue; // sliding clear of it
      return 0;                                    // driving straight into it
    }

    let t0 = 0;
    let t1 = best; // no point testing past the closest hit we already have

    if (dx > -1e-6 && dx < 1e-6) {
      if (ox < minX || ox > maxX) continue;
    } else {
      const inv = 1 / dx;
      let a = (minX - ox) * inv;
      let b = (maxX - ox) * inv;
      if (a > b) { const s = a; a = b; b = s; }
      if (a > t0) t0 = a;
      if (b < t1) t1 = b;
      if (t0 > t1) continue;
    }

    if (dz > -1e-6 && dz < 1e-6) {
      if (oz < minZ || oz > maxZ) continue;
    } else {
      const inv = 1 / dz;
      let a = (minZ - oz) * inv;
      let b = (maxZ - oz) * inv;
      if (a > b) { const s = a; a = b; b = s; }
      if (a > t0) t0 = a;
      if (b < t1) t1 = b;
      if (t0 > t1) continue;
    }

    if (t0 < best) best = t0;
  }
  return best;
}

/**
 * Builds the rig. Deliberately more suggested than detailed: at forty metres
 * through fog you get a hunched mass, a ragged spine, two red coals and a jaw.
 * Everything below is sized in metres at scale 1 with the feet on y = 0 and
 * the model facing -Z.
 */
function buildRig() {
  const P = CONFIG.palette;

  // Deterministic raggedness - the spine must look the same every run.
  let seed = 0x9e3779b9;
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  // --------------------------------------------------------- shared assets
  // One faceted blob geometry does the torso, hump, skull, jaw, fists and feet;
  // one tapered cylinder does every limb segment. Flat shading turns cheap
  // low-poly primitives into something that reads as carved rock.
  const geoBlob = new THREE.IcosahedronGeometry(1, 1);
  const geoLimb = new THREE.CylinderGeometry(0.5, 0.38, 1, 6);
  const geoSpike = new THREE.ConeGeometry(0.5, 1, 4);
  const geoEye = new THREE.SphereGeometry(1, 10, 8);

  const matBody = new THREE.MeshStandardMaterial({
    color: P.monster, roughness: 0.95, metalness: 0.02, flatShading: true,
  });
  const matLimb = new THREE.MeshStandardMaterial({
    color: P.monster, roughness: 1.0, metalness: 0.0, flatShading: true,
  });
  matLimb.color.multiplyScalar(0.78); // limbs read darker than the mass
  const matSpike = new THREE.MeshStandardMaterial({
    color: P.monster, roughness: 0.85, metalness: 0.05, flatShading: true,
  });
  matSpike.color.multiplyScalar(1.35); // spikes catch the sun so the ridge reads
  const matTooth = new THREE.MeshStandardMaterial({
    color: TOOTH_COLOR, roughness: 0.55, metalness: 0.0, flatShading: true,
  });
  const matMaw = new THREE.MeshStandardMaterial({
    color: MAW_COLOR, emissive: P.monsterEye, emissiveIntensity: 0.35, roughness: 1.0,
  });
  const matEye = new THREE.MeshStandardMaterial({
    color: P.monsterEye, emissive: P.monsterEye,
    emissiveIntensity: EYE_EMISSIVE_MIN, roughness: 0.3, metalness: 0.0,
  });
  // Additive halo, fog-exempt so the eyes stay two hot points no matter how
  // thick the dread fog gets. This is the single most legible thing about the
  // monster at distance.
  const matEyeGlow = new THREE.MeshBasicMaterial({
    color: P.monsterEye, transparent: true, opacity: 0.3, depthWrite: false,
    blending: THREE.AdditiveBlending, fog: false,
  });

  const shadows = !!CONFIG.render.shadows;

  /** Positioned, non-uniformly scaled blob. */
  const blob = (mat, sx, sy, sz, x, y, z) => {
    const m = new THREE.Mesh(geoBlob, mat);
    m.scale.set(sx, sy, sz);
    m.position.set(x, y, z);
    m.castShadow = shadows;
    return m;
  };
  /** Limb segment hanging down from its parent's origin. */
  const limb = (radius, length) => {
    const m = new THREE.Mesh(geoLimb, matLimb);
    m.scale.set(radius * 2, length, radius * 2);
    m.position.y = -length * 0.5;
    m.castShadow = shadows;
    return m;
  };

  const group = new THREE.Group();
  group.name = 'monster';

  // rig carries the lurch (bob in Y, roll in Z) for the whole body including
  // the legs. Keeping it separate from `group` means state.monster.pos stays
  // the authoritative ground truth and the animation never feeds back into the
  // physics.
  const rig = new THREE.Group();
  group.add(rig);

  // trunk is everything above the hips, and it is a separate pivot for one
  // reason: the forward lean has to happen at the HIPS. Leaning the whole model
  // about its feet tips the leading foot underground - a couple of centimetres
  // at rest, a third of a metre by the time it is at full dread and full size.
  const TRUNK_Y = 1.60;
  const trunk = new THREE.Group();
  trunk.position.y = TRUNK_Y;
  rig.add(trunk);

  // ------------------------------------------------------------------ mass
  trunk.add(blob(matBody, 1.10, 0.92, 1.20, 0, 0.60, 0));    // barrel chest
  trunk.add(blob(matBody, 1.00, 0.60, 0.80, 0, 1.12, 0.34)); // hunched hump
  trunk.add(blob(matBody, 0.80, 0.62, 0.72, 0, 0.02, 0.10)); // gut / hips

  // ------------------------------------------------------------------ head
  const head = new THREE.Group();
  head.position.set(0, 1.02, -0.72);
  trunk.add(head);
  head.add(blob(matBody, 0.60, 0.50, 0.75, 0, 0, -0.10));    // skull
  head.add(blob(matBody, 0.66, 0.17, 0.34, 0, 0.30, -0.42)); // brow ridge
  // Throat, sitting BEHIND the teeth rather than filling the whole mouth: it
  // only has to be the black you see past the fangs when the jaw drops.
  head.add(blob(matMaw, 0.38, 0.20, 0.30, 0, -0.12, -0.30));

  // Eyes sit just PROUD of the skull. The skull is an ellipsoid of radii
  // (0.60, 0.50, 0.75) centred at z = -0.10, so its surface out at x = 0.26 is
  // near z = -0.76: an eye centred any shallower than about -0.70 is simply
  // buried inside the head and never renders at all.
  const eyeL = new THREE.Mesh(geoEye, matEye);
  eyeL.scale.setScalar(0.115);
  eyeL.position.set(-0.26, 0.10, -0.70);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.26;
  head.add(eyeL, eyeR);

  const glowL = new THREE.Mesh(geoEye, matEyeGlow);
  glowL.scale.setScalar(0.28);
  glowL.position.copy(eyeL.position);
  const glowR = glowL.clone();
  glowR.position.x = 0.26;
  head.add(glowL, glowR);

  // Jaw pivots at the back of the mouth. The model faces -Z, so a NEGATIVE
  // rotation about X drops the chin: R_x(t) maps the front of the jaw (0,0,-1)
  // to (0, sin t, -cos t), which rises for positive t.
  const jaw = new THREE.Group();
  jaw.position.set(0, -0.20, -0.02);
  head.add(jaw);
  jaw.add(blob(matBody, 0.50, 0.20, 0.60, 0, -0.04, -0.44));

  // ----------------------------------------------------------------- teeth
  // Two instanced rows around the mouth OPENING - three a side, converging
  // toward the snout. Individually invisible at range; collectively they are
  // the pale line that tells you the mouth is open. When the jaw is shut the
  // upper row is swallowed by the jaw blob, so the mouth closes cleanly.
  const TOOTH_Z = [-0.45, -0.62, -0.78];
  const TOOTH_X = [0.24, 0.19, 0.11];
  const TOOTH_LEN = [0.20, 0.17, 0.14];
  const TEETH = 6;
  const mtx = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3();

  const toothRow = (parent, y, pointUp) => {
    const inst = new THREE.InstancedMesh(geoSpike, matTooth, TEETH);
    inst.castShadow = false;
    for (let i = 0; i < TEETH; i++) {
      const side = i < 3 ? -1 : 1;
      const k = i % 3;
      const len = TOOTH_LEN[k];
      // The cone is centred, so half a length of lift plants its base on the
      // gum line and points the tip into the mouth.
      pos.set(side * TOOTH_X[k], y + (pointUp ? len * 0.5 : -len * 0.5), TOOTH_Z[k]);
      eul.set(pointUp ? 0 : Math.PI, 0, side * 0.08);
      quat.setFromEuler(eul);
      scl.set(0.17, len, 0.17);
      mtx.compose(pos, quat, scl);
      inst.setMatrixAt(i, mtx);
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.computeBoundingSphere();
    parent.add(inst);
    return inst;
  };
  toothRow(head, -0.20, false); // upper fangs, hanging from the lip line
  toothRow(jaw, 0.02, true);    // lower fangs, standing up out of the jaw

  // ---------------------------------------------------------------- spikes
  // Ragged dorsal ridge, largest at the shoulders and shrinking down the back.
  // This is the silhouette cue that survives fog: a lumpy outline is scenery,
  // a spined outline is a predator.
  const SPIKES = 10;
  const spikeMesh = new THREE.InstancedMesh(geoSpike, matSpike, SPIKES);
  spikeMesh.castShadow = shadows;
  trunk.add(spikeMesh);

  // Per-spike rest pose. Kept so the ridge can bristle with dread by rebuilding
  // its ten matrices - scaling the mesh or its parent in Y would drag every
  // spike's POSITION up with its length and float the ridge off the back.
  const spikeBase = new Float32Array(SPIKES * 6); // x, baseY, z, width, height, tiltX
  const spikeRoll = new Float32Array(SPIKES);
  for (let i = 0; i < SPIKES; i++) {
    const t = i / (SPIKES - 1);
    const o = i * 6;
    spikeBase[o] = (rnd() - 0.5) * 0.22;
    spikeBase[o + 1] = lerp(1.40, 0.35, t);              // where it leaves the back
    spikeBase[o + 2] = lerp(-0.20, 1.20, t);             // nape -> tail
    spikeBase[o + 3] = 0.30 + rnd() * 0.12;              // width
    spikeBase[o + 4] = 0.85 * (1 - 0.5 * t) * (0.7 + rnd() * 0.65);
    // Cones point +Y; rotating about +X tips them toward +Z, i.e. swept back.
    spikeBase[o + 5] = 0.30 + 0.55 * t + (rnd() - 0.5) * 0.2;
    spikeRoll[i] = (rnd() - 0.5) * 0.5;
  }

  /** Rewrites the ridge at a given bristle factor. Ten matrices; only called
   *  when dread actually moves, which is a handful of times per run. */
  const setBristle = (bristle) => {
    for (let i = 0; i < SPIKES; i++) {
      const o = i * 6;
      const h = spikeBase[o + 4] * bristle;
      eul.set(spikeBase[o + 5], 0, spikeRoll[i]);
      quat.setFromEuler(eul);
      // The cone geometry is centred, so lift it by half its length to keep the
      // base pinned to the spine however long it grows.
      pos.set(spikeBase[o], spikeBase[o + 1] + h * 0.5, spikeBase[o + 2]);
      scl.set(spikeBase[o + 3], h, spikeBase[o + 3]);
      mtx.compose(pos, quat, scl);
      spikeMesh.setMatrixAt(i, mtx);
    }
    spikeMesh.instanceMatrix.needsUpdate = true;
    spikeMesh.computeBoundingSphere();
  };
  setBristle(1);

  // ------------------------------------------------------------------ arms
  // Long and knuckle-dragging: the fists hang at 0.35m, which reads as ape
  // rather than man and makes the forward swing enormous.
  const makeArm = (side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 1.02, 0.92, 0.02);
    shoulder.add(blob(matBody, 0.42, 0.42, 0.42, 0, 0.04, 0));
    shoulder.add(limb(0.30, 0.95));
    const elbow = new THREE.Group();
    elbow.position.y = -0.95;
    elbow.add(limb(0.26, 0.90));
    const fist = blob(matLimb, 0.34, 0.30, 0.34, 0, -0.92, -0.04);
    elbow.add(fist);
    shoulder.add(elbow);
    trunk.add(shoulder);
    return { shoulder, elbow };
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // ------------------------------------------------------------------ legs
  const makeLeg = (side) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.50, 1.62, 0.05);
    hip.add(limb(0.34, 0.78));
    const knee = new THREE.Group();
    knee.position.y = -0.78;
    knee.add(limb(0.27, 0.66));
    knee.add(blob(matLimb, 0.34, 0.17, 0.55, 0, -0.68, -0.10)); // foot
    hip.add(knee);
    rig.add(hip);
    return { hip, knee };
  };
  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  return {
    group, body: rig, trunk, head, jaw, setBristle,
    armL, armR, legL, legR,
    matBody, matEye, matEyeGlow, matMaw,
    glowL, glowR,
  };
}

/**
 * @param {object} ctx game context - { THREE, CONFIG, state, bus, scene, ... }
 * @returns {{group: THREE.Group, fixedUpdate: Function, update: Function,
 *            reset: Function}}
 */
export function createMonster(ctx) {
  const state = ctx.state;
  const bus = ctx.bus;
  const M = CONFIG.monster;

  const parts = buildRig();
  const group = parts.group;
  // `body` carries the bob and roll (legs included); `trunk` is everything
  // above the hips and carries the forward lean. `group` itself stays a clean
  // transform of state.monster.pos / yaw / scale.
  const body = parts.body;
  const trunk = parts.trunk;
  // main.js never adds entity groups itself. ctx.scene is live at construction
  // time; ctx.world and ctx.audio are NOT, so nothing below may touch them
  // outside update()/fixedUpdate()/reset().
  if (ctx.scene) ctx.scene.add(group);

  // ------------------------------------------------------------ ai memory
  let heading = 0;          // rate-limited actual heading (== state.monster.yaw)
  let desiredHeading = 0;   // what the last plan tick asked for
  let planTimer = 0;
  let clearAhead = PROBE_MAX; // clearance along the chosen heading, metres
  let directClear = PROBE_MAX; // clearance along the straight line to the player
  // The probe length those two were measured against. It shrinks to the range
  // of the player (see planHeading), so the scrape test below has to be read
  // against it rather than against a fixed distance.
  let probeLen = PROBE_MAX;
  let scraping = false;     // in contact this step -> config slowdown applies
  let stuckTimer = 0;
  let unstickTimer = 0;
  let unstickSign = 1;
  let caught = false;
  let roarTimer = M.roarInterval;

  // ------------------------------------------------------- animation state
  let gaitPhase = 0;
  // Gait speed, damped from the achieved velocity. state.monster.vel freezes at
  // whatever it last was the moment main.js stops stepping the physics, which
  // it does on the game-over screen - so reading vel directly leaves the thing
  // standing over your corpse sprinting on the spot for as long as you look at
  // it. Damping toward zero whenever we are not playing lets it settle into the
  // idle breathing stride instead, and costs nothing during the chase.
  let animSpeed = 0;
  // Own clock: state.time freezes on the menu and after you are caught, but the
  // thing standing over your corpse should still breathe.
  let clock = 0;
  let lastDreadWritten = -1;

  /**
   * Places the monster spawnDistance behind the player. Behind is +Z: the
   * camera looks down -Z and you run that way, so anything at +Z is at your
   * back. If that spot is inside a rock we sweep around the arc rather than
   * spawning it embedded, never closer than minSpawnDistance.
   */
  function placeBehindPlayer(world) {
    const p = state.player.pos;
    const m = state.monster;

    // Angle measured in the XZ plane from +Z (directly behind the player).
    const OFFSETS = [0, 0.26, -0.26, 0.52, -0.52, 0.85, -0.85, 1.3, -1.3];
    const radii = [M.spawnDistance, Math.max(M.minSpawnDistance, M.spawnDistance * 0.8)];
    const r = BODY_RADIUS * Math.max(1, m.scale);

    let bx = p.x;
    let bz = p.z + M.spawnDistance;
    if (world && typeof world.queryAABB === 'function') {
      let placed = false;
      for (let ri = 0; ri < radii.length && !placed; ri++) {
        for (let i = 0; i < OFFSETS.length; i++) {
          const a = OFFSETS[i];
          const x = p.x + Math.sin(a) * radii[ri];
          const z = p.z + Math.cos(a) * radii[ri];
          const floorY = CONFIG.world.groundY + STEP_OVER * m.scale;
          _qMin.set(x - r, floorY, z - r);
          _qMax.set(x + r, floorY + BODY_HEIGHT * m.scale, z + r);
          if (world.queryAABB(_qMin, _qMax, _near).length === 0) {
            bx = x; bz = z; placed = true; break;
          }
        }
      }
    }

    const groundY = (world && typeof world.sampleGroundY === 'function')
      ? world.sampleGroundY(bx, bz)
      : CONFIG.world.groundY;
    m.pos.set(bx, groundY + M.heightOffset, bz);
    m.vel.set(0, 0, 0);

    // Face the player from the off, so the first thing you see when you glance
    // back is not its shoulder.
    heading = dirToHeading(p.x - bx, p.z - bz);
    desiredHeading = heading;
    m.yaw = heading;
    m.distanceToPlayer = Math.hypot(p.x - bx, p.z - bz);
    m.proximity = clamp01(1 - m.distanceToPlayer / 30);
  }

  // Correct the seeded -Z position immediately, so the start screen is not
  // staring at a monster loitering in front of the player. No world yet.
  placeBehindPlayer(null);

  /**
   * Picks a heading. One queryAABB fetches every collider within probe range,
   * then the whole fan plus the direct line is scored analytically against that
   * single list - no further queries, no allocation:
   *
   *   score = clearance/probe * W_CLEAR + cos(angle to player) * W_ALIGN
   *                                     - |turn| * W_TURN
   *
   * Open ground: every clearance saturates, so alignment decides and it runs
   * straight at you. Obstructed: clearance dominates, so it peels off around
   * the box and the alignment term reels it back in the moment the line opens
   * up again. That is the whole behaviour - no path graph, no waypoints, and it
   * fits in one query per plan tick on a phone.
   */
  function planHeading(world, toPlayerHeading, dist) {
    const m = state.monster;
    const scale = m.scale;
    const r = BODY_RADIUS * scale;
    const floorY = m.pos.y + STEP_OVER * scale;

    let probe = m.speed * PROBE_PER_SPEED;
    if (probe < PROBE_MIN) probe = PROBE_MIN;
    if (probe > PROBE_MAX) probe = PROBE_MAX;
    // Never probe past the player: swerving around a box that is behind your
    // prey is how a chase stops looking like a chase.
    if (dist > 1 && probe > dist) probe = dist;
    probeLen = probe;

    const reach = probe + r;
    _qMin.set(m.pos.x - reach, floorY, m.pos.z - reach);
    _qMax.set(m.pos.x + reach, floorY + BODY_HEIGHT * scale, m.pos.z + reach);
    world.queryAABB(_qMin, _qMax, _plan);

    if (_plan.length === 0) {
      // Open ground: no reason to burn cycles on the fan.
      desiredHeading = toPlayerHeading;
      clearAhead = probe;
      directClear = probe;
      return;
    }

    const invProbe = 1 / probe;

    // The straight line is scored separately from the fan: it may well be
    // outside it while the monster is running along a wall, and it doubles as
    // the "can it see you" test that the obstacle slowdown keys off.
    directClear = clearanceAlong(
      m.pos.x, m.pos.z, -Math.sin(toPlayerHeading), -Math.cos(toPlayerHeading),
      probe, r, floorY, _plan,
    );
    let bestScore = directClear * invProbe * W_CLEAR + W_ALIGN
      - Math.abs(wrapPi(toPlayerHeading - heading)) * W_TURN;
    let bestHeading = toPlayerHeading;
    let bestClear = directClear;
    let leftClear = 0;
    let rightClear = 0;

    for (let i = 0; i < FAN.length; i++) {
      const off = FAN[i];
      const h = heading + off;
      const dx = -Math.sin(h);
      const dz = -Math.cos(h);
      const clear = clearanceAlong(m.pos.x, m.pos.z, dx, dz, probe, r, floorY, _plan);

      // Remember which flank is more open; the unstick uses it to pick a side.
      if (off > 0.5) { if (clear > leftClear) leftClear = clear; }
      else if (off < -0.5) { if (clear > rightClear) rightClear = clear; }

      const score = clear * invProbe * W_CLEAR
        + Math.cos(wrapPi(h - toPlayerHeading)) * W_ALIGN
        - Math.abs(off) * W_TURN;

      if (score > bestScore) {
        bestScore = score;
        bestHeading = h;
        bestClear = clear;
      }
    }

    // Latch the flank only between shoves. Re-picking it mid-unstick is how a
    // wedged monster ends up vibrating in place: each plan tick sees a slightly
    // different pair of clearances and reverses the shove it just started.
    if (unstickTimer <= 0) unstickSign = leftClear >= rightClear ? 1 : -1;
    desiredHeading = wrapPi(bestHeading);
    clearAhead = bestClear;
  }

  /**
   * The chase. Fixed 120Hz step from main.js, so collision response and the
   * speed ramp are frame-rate independent.
   */
  function fixedUpdate(dtFixed, ctx2) {
    const dt = dtFixed;
    if (!(dt > 0)) return;
    const world = (ctx2 && ctx2.world) || ctx.world;
    if (!world) return;

    const m = state.monster;
    const p = state.player.pos;

    // ------------------------------------------------------- size and pace
    m.scale = damp(m.scale, state.level.scale || M.baseScale, SCALE_LERP, dt);

    let dx = p.x - m.pos.x;
    let dz = p.z - m.pos.z;
    let dist = Math.hypot(dx, dz);

    // Mild, one-way rubber banding. It may catch up when it has been left for
    // dead; it may never be given free speed while it is breathing on you,
    // because that reads as the game cheating rather than the monster hunting.
    let target = state.level.speed || M.baseSpeed;
    if (dist > RUBBER_START) {
      target *= 1 + Math.min(1, (dist - RUBBER_START) / RUBBER_RANGE) * (RUBBER_MAX - 1);
    }
    m.speed = damp(m.speed, target, SPEED_LERP, dt);

    // ------------------------------------------------------------ steering
    const toPlayer = dist > 0.001 ? dirToHeading(dx, dz) : heading;
    planTimer -= dt;
    if (planTimer <= 0) {
      planTimer += PLAN_INTERVAL;
      planHeading(world, toPlayer, dist);
    }

    // Inside grabbing range the fan is irrelevant - go straight at the player.
    let wanted = dist < 4 ? toPlayer : desiredHeading;
    if (unstickTimer > 0) {
      // Committed sidestep: aim across the obstruction rather than into it.
      wanted = wrapPi(wanted + unstickSign * UNSTICK_TURN * (unstickTimer / UNSTICK_TIME));
    }

    // Rate-limited turn. This is what makes it bank around a corner instead of
    // snapping onto the new heading like a turret.
    const turn = wrapPi(wanted - heading);
    const maxTurn = M.turnRate * dt;
    heading = wrapPi(heading + (turn > maxTurn ? maxTurn : turn < -maxTurn ? -maxTurn : turn));

    // -------------------------------------------------------------- motion
    const scale = m.scale;
    const r = BODY_RADIUS * scale;
    const stepOver = STEP_OVER * scale;
    const floorY = m.pos.y + stepOver;

    let speed = m.speed;
    // The slowdown is the whole reason weaving works: it is paid whenever the
    // monster is in contact with something OR cannot see a straight line to
    // you, so every box you put between the two of you costs it ground.
    // The clearances are capped at the probe, and the probe is capped at the
    // range of the player, so a bare threshold of r * SCRAPE_RADII would read
    // "the player is two metres away" as "there is a wall two metres away" and
    // brake the monster to 55% for the last stride of every catch in open
    // ground - wider still as it grows, since the threshold scales with r.
    // Clamping the threshold to the probe means an unobstructed line always
    // scores exactly at it, so only a real hit can come in under.
    const scrapeDist = Math.min(r * SCRAPE_RADII, probeLen);
    if (scraping || directClear < scrapeDist || clearAhead < scrapeDist) {
      speed *= M.obstacleSlowdown;
    }

    const fx = -Math.sin(heading);
    const fz = -Math.cos(heading);
    let vx = fx * speed;
    let vz = fz * speed;

    if (unstickTimer > 0) {
      // Shove it sideways out of the corner it wedged itself into. The
      // perpendicular of (fx,fz) is (fz,-fx); sign picks the open flank.
      const w = (unstickTimer / UNSTICK_TIME) * M.stuckUnstickForce * unstickSign;
      vx += fz * w;
      vz += -fx * w;
      // Never let the shove outrun the chase itself.
      const sp = Math.hypot(vx, vz);
      const cap = m.speed * 1.5;
      if (sp > cap && sp > 0.0001) { const k = cap / sp; vx *= k; vz *= k; }
      unstickTimer -= dt;
    }

    const ox = m.pos.x;
    const oz = m.pos.z;
    let nx = ox + vx * dt;
    let nz = oz + vz * dt;

    // One query covering the whole swept box, reused for both axis passes.
    const sMinX = Math.min(ox, nx) - r;
    const sMaxX = Math.max(ox, nx) + r;
    const sMinZ = Math.min(oz, nz) - r;
    const sMaxZ = Math.max(oz, nz) + r;
    _qMin.set(sMinX, floorY, sMinZ);
    _qMax.set(sMaxX, floorY + BODY_HEIGHT * scale, sMaxZ);
    world.queryAABB(_qMin, _qMax, _near);

    let blocked = false;
    if (_near.length > 0) {
      // X first, then Z with the corrected X. Resolving one axis at a time is
      // what lets it slide along a wall instead of gluing itself to the face.
      for (let i = 0; i < _near.length; i++) {
        const c = _near[i];
        if (c.max.y <= floorY) continue;
        if (nx + r <= c.min.x || nx - r >= c.max.x) continue;
        if (oz + r <= c.min.z || oz - r >= c.max.z) continue;
        if (vx > 0) nx = Math.min(nx, c.min.x - r - EPS);
        else if (vx < 0) nx = Math.max(nx, c.max.x + r + EPS);
        blocked = true;
      }
      for (let i = 0; i < _near.length; i++) {
        const c = _near[i];
        if (c.max.y <= floorY) continue;
        if (nx + r <= c.min.x || nx - r >= c.max.x) continue;
        if (nz + r <= c.min.z || nz - r >= c.max.z) continue;
        if (vz > 0) nz = Math.min(nz, c.min.z - r - EPS);
        else if (vz < 0) nz = Math.max(nz, c.max.z + r + EPS);
        blocked = true;
      }
    }
    scraping = blocked;

    m.pos.x = nx;
    m.pos.z = nz;
    m.pos.y = world.sampleGroundY(nx, nz) + M.heightOffset;
    // Report what it ACTUALLY achieved, not what it intended: the gait, the
    // audio and any HUD threat meter should all reflect a monster that just
    // walked into a wall.
    m.vel.set((nx - ox) / dt, 0, (nz - oz) / dt);
    m.yaw = heading;

    // ------------------------------------------------------------- unstick
    const moved = Math.hypot(nx - ox, nz - oz);
    const expected = speed * dt;
    if (unstickTimer <= 0 && moved < expected * STUCK_RATIO) {
      stuckTimer += dt;
      if (stuckTimer > STUCK_TRIGGER) {
        stuckTimer = 0;
        unstickTimer = UNSTICK_TIME;
        planTimer = 0; // re-sense immediately on the way out
      }
    } else if (stuckTimer > 0) {
      stuckTimer = Math.max(0, stuckTimer - dt * 2);
    }

    // ------------------------------------------------- distance and threat
    dx = p.x - m.pos.x;
    dz = p.z - m.pos.z;
    dist = Math.hypot(dx, dz);
    m.distanceToPlayer = dist;
    m.proximity = clamp01(1 - dist / 30);

    // ---------------------------------------------------------------- roar
    // Roars close up as dread rises: nine seconds of silence at level 0, three
    // at THE END, jittered so the rhythm never becomes predictable.
    roarTimer -= dt;
    if (roarTimer <= 0) {
      const interval = lerp(M.roarInterval, M.roarIntervalMin, clamp01(state.dread));
      roarTimer = interval * (0.85 + Math.random() * 0.3);
      bus.emit('roar', { intensity: clamp01(0.18 + 0.82 * m.proximity) });
    }

    // --------------------------------------------------------------- catch
    // Vertical reach scales with the monster, so climbing a box that is taller
    // than it can reach is a real escape - and stops being one as it grows.
    const verticalGap = state.player.pos.y - m.pos.y;
    const canReach = verticalGap <= REACH_HEIGHT * scale;
    if (!caught && state.phase === 'playing' && dist < M.catchRadius && canReach) {
      caught = true; // exactly once per run; main.js also guards, but do not spam
      bus.emit('caught', { score: state.score });
    }
  }

  /**
   * Cosmetics on the variable frame delta. Called every frame, including on the
   * menu and the game-over screen (where the monster is standing over you and
   * must keep breathing).
   */
  function update(dt, ctx2) {
    void ctx2; // the closure already holds every reference this needs
    const step = dt > 0 ? dt : 0;
    clock += step;

    const m = state.monster;
    const dread = clamp01(state.dread);
    const prox = clamp01(m.proximity);

    group.position.copy(m.pos);
    group.rotation.y = m.yaw;
    // m.scale is already eased toward state.level.scale in fixedUpdate, so this
    // is smooth without a second filter - and it correctly freezes on the menu.
    group.scale.setScalar(m.scale);

    // ------------------------------------------------------------ the gait
    // Stride frequency falls out of the physics: metres per second divided by
    // metres per stride. Big monster, long stride, slower and heavier cadence.
    const moving = state.phase === 'playing' ? Math.hypot(m.vel.x, m.vel.z) : 0;
    animSpeed = damp(animSpeed, moving, 6, step);
    const sp = animSpeed;
    const speedNorm = clamp01(sp / Math.max(0.5, m.speed));
    const strideRate = IDLE_STRIDE_RATE + sp / (STRIDE_LENGTH * Math.max(0.5, m.scale));
    gaitPhase += TAU * strideRate * step;
    if (gaitPhase > TAU) gaitPhase -= TAU * Math.floor(gaitPhase / TAU);

    const swing = Math.sin(gaitPhase);
    const swingOpp = -swing;
    const legAmp = 0.42 + 0.20 * speedNorm;
    const armAmp = 0.34 + 0.30 * speedNorm;

    // Legs extend down -Y; a positive rotation about X swings them toward -Z,
    // which is forward for this model.
    parts.legL.hip.rotation.x = swing * legAmp;
    parts.legR.hip.rotation.x = swingOpp * legAmp;
    // Knees bend on the recovery half of each stride so the foot clears ground.
    parts.legL.knee.rotation.x = 0.22 + Math.max(0, -swing) * 0.85;
    parts.legR.knee.rotation.x = 0.22 + Math.max(0, -swingOpp) * 0.85;

    // Arms counter-swing, then abandon the swing entirely and reach when it is
    // nearly on top of you: a lunge you can read in your peripheral vision.
    const reach = clamp01((prox - 0.45) / 0.4);
    parts.armL.shoulder.rotation.x = lerp(swingOpp * armAmp, 1.25, reach);
    parts.armR.shoulder.rotation.x = lerp(swing * armAmp, 1.25, reach);
    parts.armL.shoulder.rotation.z = lerp(0.10, -0.28, reach);
    parts.armR.shoulder.rotation.z = lerp(-0.10, 0.28, reach);
    parts.armL.elbow.rotation.x = lerp(0.25 + Math.max(0, swingOpp) * 0.35, -0.75, reach);
    parts.armR.elbow.rotation.x = lerp(0.25 + Math.max(0, swing) * 0.35, -0.75, reach);

    // The hips DROP twice per stride, and the phase matters: they are highest
    // at mid-stance, when the legs are together and vertically under the mass,
    // and lowest when the legs are at full spread. That is both what a real
    // heavy walk does and, with no IK anywhere in this rig, the only version
    // that keeps the feet on the deck - a leg swung out by legAmp lifts its own
    // foot by about leg * (1 - cos legAmp), which is what BOB_HEIGHT is sized
    // to cancel. Bobbing UP instead would float the whole animal off the
    // ground, a third of a metre of it once it has doubled in size.
    const heavy = 0.3 + 0.7 * speedNorm;
    // `body` is inside `group`, which already carries m.scale, so the bob is
    // authored in local metres and scales with the monster for free.
    body.position.y = -(0.5 - 0.5 * Math.cos(gaitPhase * 2)) * BOB_HEIGHT * heavy;
    body.rotation.z = swing * 0.09 * heavy;
    // Lean: negative X tips the trunk's up-axis toward -Z, i.e. forward over
    // its own feet. Deeper as dread rises, so it is visibly stalking you by the
    // end of a run.
    trunk.rotation.x = -(LEAN_BASE + LEAN_DREAD * dread + 0.10 * speedNorm);

    // --------------------------------------------------------------- head
    // Counter-rotate so the head stays level under the lean, then let it track
    // the player: as it banks around an obstacle the eyes stay on you.
    parts.head.rotation.x = (LEAN_BASE + LEAN_DREAD * dread) * 0.6 + Math.sin(gaitPhase * 2 + 0.6) * 0.05;
    const dxp = state.player.pos.x - m.pos.x;
    const dzp = state.player.pos.z - m.pos.z;
    if (dxp * dxp + dzp * dzp > 0.04) {
      const off = wrapPi(dirToHeading(dxp, dzp) - m.yaw);
      const clamped = off > 0.7 ? 0.7 : off < -0.7 ? -0.7 : off;
      parts.head.rotation.y = damp(parts.head.rotation.y, clamped, 8, step);
    }

    // ---------------------------------------------------------------- jaw
    // Idles slightly parted, gapes with dread, and chews the air when close.
    const chomp = prox * 0.16 * (0.5 + 0.5 * Math.sin(clock * 9));
    const open = JAW_BASE + JAW_DREAD * dread + 0.34 * prox + chomp;
    parts.jaw.rotation.x = -open; // negative drops the chin, see buildRig()

    // --------------------------------------------------------------- eyes
    // Heartbeat: slow smoulder far away, hard fast pulse when it has you.
    const pulse = 1 + 0.2 * Math.sin(clock * (3 + 9 * prox)) * (0.25 + 0.75 * prox);
    parts.matEye.emissiveIntensity = lerp(EYE_EMISSIVE_MIN, EYE_EMISSIVE_MAX, dread) * (1 + 0.55 * prox) * pulse;
    parts.matEyeGlow.opacity = clamp01(0.16 + 0.42 * dread + 0.34 * prox) * (0.85 + 0.15 * pulse);
    const glowScale = 0.28 * (1 + 0.35 * dread + 0.5 * prox);
    parts.glowL.scale.setScalar(glowScale);
    parts.glowR.scale.setScalar(glowScale);

    // Uniform uploads and instance rebuilds are the only per-frame costs worth
    // avoiding here, so both are gated on dread actually having moved. The hide
    // picks up a dull ember glow and the dorsal ridge bristles as the thing
    // grows into its final form.
    if (Math.abs(dread - lastDreadWritten) > 0.01) {
      lastDreadWritten = dread;
      parts.matBody.emissive.setRGB(0.16 * dread, 0.012 * dread, 0.02 * dread);
      parts.matMaw.emissiveIntensity = 0.35 + 1.5 * dread;
      parts.setBristle(1 + 0.30 * dread);
    }
  }

  /** Fresh run: back behind the player, back to base speed and size. */
  function reset() {
    const m = state.monster;
    m.speed = M.baseSpeed;
    m.scale = M.baseScale;
    placeBehindPlayer(ctx.world);

    caught = false;
    scraping = false;
    stuckTimer = 0;
    unstickTimer = 0;
    unstickSign = 1;
    planTimer = 0;
    clearAhead = PROBE_MAX;
    directClear = PROBE_MAX;
    probeLen = PROBE_MAX;
    // A little over half an interval: the first roar lands early enough to tell
    // you something is back there before you have wandered off exploring.
    roarTimer = M.roarInterval * 0.6;

    gaitPhase = 0;
    animSpeed = 0;
    lastDreadWritten = -1;
    body.position.set(0, 0, 0);
    body.rotation.set(0, 0, 0);
    trunk.rotation.set(0, 0, 0);
    parts.head.rotation.set(0, 0, 0);
    group.position.copy(m.pos);
    group.rotation.y = m.yaw;
    group.scale.setScalar(m.scale);
  }

  return { group, fixedUpdate, update, reset };
}
