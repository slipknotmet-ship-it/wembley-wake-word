import * as THREE from 'three';
import { buildFace } from './monsterFace.js';
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

/** Speed multiplier while swimming. See the derivation at its use site. */
const SWIM_FACTOR = (() => {
  const v = CONFIG.world && CONFIG.world.swimFactor;
  return Number.isFinite(v) ? v : 0.55;
})();

/** Speed multiplier while a golden emeem's slow is running. */
const SLOW_FACTOR = (() => {
  const g = CONFIG.emeem.kinds && CONFIG.emeem.kinds.golden;
  const v = g && g.slowFactor;
  return Number.isFinite(v) ? v : 0.55;
})();

// ---------------------------------------------------------------- physique

/** Half-extent in X/Z at scale 1. The rig is ~2.2m across the shoulders; the
 *  collision box is deliberately narrower so it does not snag on corners it
 *  visually clears. */
const BODY_RADIUS = 0.85;

/**
 * Escape hatches for an entrance spot that lands inside a tree, ordered so the
 * framing can only get SAFER, never worse.
 *
 * RADII FIRST, because on-screen X is a BEARING, not a distance: sliding from
 * 30m to 42m along the SAME ray moves the silhouette from 0.582 to 0.616 of
 * half-width on a 667x375 frame - three points. That axis is nearly free, so
 * exhaust it before touching the bearing. Radii never SHRINK either: pulling
 * the spawn in is the one fallback that costs reaction time.
 *
 * Only when every radius is blocked do we bend the bearing, and every bend is
 * INWARD. That is the whole safety argument: no hatch can push the creature off
 * the narrowest phone, because every one moves it further IN.
 *
 * The symmetric sweep this replaces mapped [0, +0.20, -0.20, ... +1.0, -1.0]
 * onto the heading, so half its hatches bent OUTWARD: bearing 1.12 projects to
 * ndc.x 1.245 - off the side of a 667x375 screen - and bearing 1.70 lands 15.4
 * half-widths out and level with the player rather than ahead of him. One tree
 * on the ideal spot silently cost the entire feature.
 */
const SPAWN_RADII  = [1, 1.2, 1.4];   // multiples of spawnDistance, never < 1
const SPAWN_INWARD = [0, 0.10, 0.20]; // radians, always toward straight ahead
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
// Stride length, bob, lean, jaw and eye-glow tunables all moved into
// entities/monsterFace.js when the creature's body did. This file no longer
// knows anything about what the Protector looks like - only where it is going.

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
 * @param {object} ctx game context - { THREE, CONFIG, state, bus, scene, ... }
 * @returns {{group: THREE.Group, fixedUpdate: Function, update: Function,
 *            reset: Function}}
 */
export function createMonster(ctx) {
  const state = ctx.state;
  const bus = ctx.bus;
  const M = CONFIG.monster;

  // The body is entirely owned by entities/monsterFace.js: a walking torso whose
  // face is made from itself - sunglasses across the chest for eyes, the navel
  // for a nose, the belly fold as a frown that deepens as it escalates. It owns
  // its own gait, breathing and expression; everything below is the CHASE, which
  // knows nothing about what the creature looks like.
  const face = buildFace(THREE, CONFIG);
  const group = new THREE.Group();
  group.name = 'monster';
  group.add(face.group);

  // Opt every part of the creature into the portrait layer, IN ADDITION to
  // layer 0 rather than instead of it: the main camera still draws it normally,
  // and the portrait camera - which sees only this layer - skips the entire
  // rest of the world for free. Lights stay on layer 0 and still light it,
  // because three.js tests the light's layers against the OBJECT's, and the
  // object is on both.
  const PORTRAIT_LAYER = (ctx.engine && ctx.engine.PORTRAIT_LAYER) || 1;
  face.group.traverse((o) => o.layers.enable(PORTRAIT_LAYER));
  if (ctx.engine && ctx.engine.setPortraitSubject) {
    // Aim at the sunglasses, which sit at chest height and ARE its eyes.
    ctx.engine.setPortraitSubject(face.group, { height: 2.46, dist: 4.35, lift: 0.15 });
  }
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
  let roarPulse = 0;   // 1 on a roar, decays back to 0
  let mawOpen = 0;     // eased maw aperture actually sent to the rig

  // ------------------------------------------------------- animation state
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
  /** True while the golden slow is running, so its onset can be detected. */
  let slowActive = false;

  /**
   * Duty cycle of obstacleSlowdown: how often the creature is actually braked
   * to 55% by the world it is running through.
   *
   * This is not a curiosity. It sets the CEILING on any water "slow": open
   * water has no colliders at all, so the creature there runs a perfectly
   * straight line at its full target speed, while on land it pays this tax with
   * probability p. A swim multiplier above (1 - 0.45p) would therefore make it
   * FASTER in the lake than out of it, inverting the whole feature. Measured
   * per tier by tools/scrape.mjs.
   */
  let scrapeSteps = 0;
  let scrapeHits = 0;

  // Rolled once per run. The construction-time placement and the FIRST run
  // deliberately share a roll, so pressing PLAY never pops the Protector from
  // one shoulder to the other; every restart re-rolls.
  let entranceSide = Math.random() < 0.5 ? -1 : 1;
  let firstRun = true;
  function rollEntranceSide() {
    if (firstRun) firstRun = false;
    else entranceSide = Math.random() < 0.5 ? -1 : 1;
    state.monster.entranceSide = M.spawnSide || entranceSide;
  }

  /**
   * Places the Protector spawnDistance away, spawnAngle off straight-ahead, on
   * a randomly chosen side - so it walks into frame from one of the two top
   * corners with its face toward you.
   *
   * Ahead is -Z: the camera looks down -Z and you run that way. Putting it at
   * +Z, as this did before, hid it entirely - the camera sits 5.4m behind you
   * and the creature 34m behind that, so it spawned off-screen and could only
   * ever enter frame from the bottom, facing the same way the camera looks.
   * You saw its back for the whole run.
   *
   * If the ideal spot is inside a rock we sweep around the heading rather than
   * spawning it embedded, never closer than minSpawnDistance.
   */
  function placeForEntrance(world) {
    const p = state.player.pos;
    const m = state.monster;

    // Angles are measured in the XZ plane from +Z, which is straight BEHIND
    // the player - that is the convention sin/cos are used with below. Pi is
    // therefore straight ahead, up the screen, and we swing spawnAngle off it
    // to the side rolled for this run by rollEntranceSide().
    const side = M.spawnSide || entranceSide;
    const BASE_A = Math.PI - M.spawnAngle * side;
    const r = BODY_RADIUS * Math.max(1, m.scale);

    let bx = p.x + Math.sin(BASE_A) * M.spawnDistance;
    let bz = p.z + Math.cos(BASE_A) * M.spawnDistance;
    if (world && typeof world.queryAABB === 'function') {
      let placed = false;
      // Distance first, bearing second, and every bend inward - see the
      // SPAWN_RADII / SPAWN_INWARD comment. The outer loop is the bearing so
      // that all three distances are exhausted on the ideal bearing before it
      // is given up at all.
      for (let ni = 0; ni < SPAWN_INWARD.length && !placed; ni++) {
        // + side * inward bends TOWARD the screen centre for either shoulder.
        const a = BASE_A + side * SPAWN_INWARD[ni];
        for (let ri = 0; ri < SPAWN_RADII.length; ri++) {
          const d = Math.max(M.minSpawnDistance, M.spawnDistance * SPAWN_RADII[ri]);
          const x = p.x + Math.sin(a) * d;
          const z = p.z + Math.cos(a) * d;
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

  // Place it immediately, so the start screen is not staring at a monster
  // sitting wherever the state object happened to seed it. No world yet, so
  // the obstacle sweep is skipped and the ideal heading is taken as-is.
  rollEntranceSide();
  placeForEntrance(null);

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

    // --- water: it swims, and slower.
    //
    // THE CEILING IS MEASURED, NOT CHOSEN. On land the creature is braked to
    // obstacleSlowdown (0.55) whenever its probe finds geometry close ahead;
    // open water has NO colliders, so there it runs a straight line at full
    // target speed. That makes the largest honest swim multiplier
    // 1 - 0.45p, where p is how often it is actually braked - and p is not a
    // guess: tools/scrape.mjs measures it per tier. It rises from 0.049 at
    // Watching to 0.495 at THE END, because by then the world is dense enough
    // to brake it on half of all steps. The tightest ceiling is therefore
    // 0.777, and the design's original 0.82 would have made it FASTER in the
    // lake than out of it at the top two tiers - the exact inverse of a lake.
    //
    // There is a FLOOR too: it has to catch a wader at every tier, or water is
    // a free escape and the canoe is decoration. At walkSpeed 7.2 and
    // waterSpeedMul 0.25 a wader makes 1.80 m/s, so f > 1.80/4.6 = 0.391.
    //
    // 0.72 sat right under the ceiling, which satisfied the rule and, in play,
    // did not read as a slow at all. 0.55 sits near the middle of the window:
    // 2.53 m/s at Watching against 4.6 on land, 5.06 at THE END against 9.2,
    // and still 1.4x a wader at the gentlest tier.
    const wet = (world && world.waterAt) ? world.waterAt(m.pos.x, m.pos.z) : 0;
    // The visual pass poses the rig from this rather than sampling the field a
    // second time, so what you SEE swimming and what is actually slowed can
    // never disagree.
    m.wet = wet;
    const swimF = 1 - wet * (1 - SWIM_FACTOR);

    // --- golden emeem: the slow.
    //
    // The multiplier is applied AFTER the rubber band on purpose, so a slowed
    // Protector cannot buy its speed back by falling behind. 0.55 puts every
    // tier under the player's 7.2 m/s, and keeps it there at full stretch:
    // 9.2 * 0.55 * 1.35 = 6.83.
    const wasSlow = slowActive;
    slowActive = state.monster.slowT > 0;
    if (slowActive) state.monster.slowT = Math.max(0, state.monster.slowT - dt);
    // The two slows COMBINE AS A MINIMUM, never as a product. Multiplying them
    // would hand a player who takes a golden emeem and then swims 0.55 * 0.72 =
    // 0.396 - a creature crawling at 3.6 m/s at the top tier, five metres a
    // second slower than the player, for free. The worst slow wins; they do not
    // stack.
    const f = Math.min(swimF, slowActive ? SLOW_FACTOR : 1);
    if (f < 1) target *= f;
    if (slowActive && !wasSlow) {
      // INSTANT on the way in. m.speed damps toward its target at SPEED_LERP
      // 1.6, so easing into the slow would take 1.44s to reach 90% - a quarter
      // of the six seconds spent ramping, and a quarter of the effect lost
      // (measured: +10.3m of gap instead of +12.8m at the top tier). The player
      // has to SEE it falter the moment they take the thing.
      m.speed = target;
    } else {
      // Easing OUT is deliberate, though: a snap back to full speed at t=6.0
      // would be unreadable, and the ramp is the warning that your time is up.
      m.speed = damp(m.speed, target, SPEED_LERP, dt);
    }

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
    scrapeSteps++;
    if (scraping || directClear < scrapeDist || clearAhead < scrapeDist) {
      speed *= M.obstacleSlowdown;
      scrapeHits++;
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
      // Open the maw on the roar. update() decays it; this is the only place
      // the chase reaches into the creature's expression.
      roarPulse = 1;
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

    // The rig owns its own gait, breathing and expression. All the chase has to
    // say is how fast it is moving and how angry it should look; everything
    // from the stride cadence to the depth of the frown falls out of that.
    const moving = state.phase === 'playing' ? Math.hypot(m.vel.x, m.vel.z) : 0;
    animSpeed = damp(animSpeed, moving, 6, step);

    // Anger layers two things. Dread is the tier ladder - the baseline mood it
    // settles into as your score climbs - and proximity is the immediate one,
    // so it visibly loses its temper as it closes on you and calms again if you
    // get away. Clamped, because both can be near 1 at the top tiers.
    const anger = clamp01(dread * 0.72 + prox * 0.46);

    // The maw opens on a roar and again on the final lunge, and eases shut in
    // between. Roars are punchy; the lunge is a sustained gape.
    roarPulse = roarPulse > 0 ? Math.max(0, roarPulse - step * 1.6) : 0;
    const lunge = prox > 0.55 ? (prox - 0.55) / 0.45 : 0;
    mawOpen = damp(mawOpen, clamp01(Math.max(roarPulse, lunge)), 8, step);

    face.setAnger(anger);
    face.setMouthOpen(mawOpen);
    face.update(step, {
      anger, proximity: prox, speed: animSpeed, time: clock,
      // Deep water only. The shallows are a wade, and a creature doing an
      // overarm stroke through ankle-deep water is a comedy, not a threat.
      swim: m.wet > 0.55 ? 1 : 0,
    });
  }

  /** Fresh run: back behind the player, back to base speed and size. */
  function reset() {
    const m = state.monster;
    m.speed = M.baseSpeed;
    m.scale = M.baseScale;
    m.slowT = 0;
    slowActive = false;
    rollEntranceSide();
    placeForEntrance(ctx.world);

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

    animSpeed = 0;
    roarPulse = 0;
    mawOpen = 0;
    // Snap the creature back to its placid face; easing it down from a scowl
    // across the start of a fresh run would look like it was still angry about
    // the last one.
    face.setAnger(0);
    face.setMouthOpen(0);
    face.update(0, { anger: 0, proximity: 0, speed: 0, time: clock });
    group.position.copy(m.pos);
    group.rotation.y = m.yaw;
    group.scale.setScalar(m.scale);
  }

  return {
    group, fixedUpdate, update, reset,
    /** Diagnostics: obstacleSlowdown duty cycle since the last read. */
    scrapeStats(reset) {
      const out = { steps: scrapeSteps, hits: scrapeHits, p: scrapeSteps ? scrapeHits / scrapeSteps : 0 };
      if (reset) { scrapeSteps = 0; scrapeHits = 0; }
      return out;
    },
  };
}
