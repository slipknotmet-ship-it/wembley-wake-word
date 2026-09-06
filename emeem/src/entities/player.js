import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { createHand } from './hand.js';

/**
 * EMEEM - the player controller.
 *
 * The player is a kinematic AABB, not a rigid body: half-extent
 * CONFIG.player.radius in X/Z, CONFIG.player.height tall, with state.player.pos
 * at the FEET. Physics runs at a fixed 120Hz from main.js so a frame hitch can
 * never change how a jump feels or tunnel us through a wall; everything
 * cosmetic (facing, pinch, the hand puppet's own animation) runs on the
 * variable frame delta.
 *
 * Collision is resolved one axis at a time - X, then Z, then Y. That ordering
 * is the whole trick behind sliding along a wall instead of sticking to it: a
 * blocked X move only kills X velocity, so the Z component survives and you
 * keep moving along the face.
 *
 * The camera has a FIXED heading (behind the player on +Z, looking toward -Z),
 * so D-pad input maps straight onto world axes with no camera-relative
 * rotation: input.z = +1 ("up the screen") means -Z in world space.
 */

const TAU = Math.PI * 2;

/**
 * Skin width used to shrink collision query boxes.
 *
 * Vertically: while resolving X/Z we lift the box bottom by SKIN so the very
 * box we are standing ON (whose top is exactly at our feet) is not reported as
 * a horizontal blocker - otherwise standing on a platform would shove you off
 * it sideways.
 * Horizontally: while resolving Y we inset X/Z by SKIN so a wall we are flush
 * against is not mistaken for a floor or a ceiling.
 */
const SKIN = 0.02;

/** Extra separation left after a push-out so we are not exactly touching. */
const EPS = 0.0015;

/**
 * Free step-up height. The world's lowest designed platforms are 0.45m and the
 * jump apex is ~1.47m, so this deliberately sits below 0.45: it exists to stop
 * us snagging on future low geometry, never to trivialise a platform.
 */
const STEP_HEIGHT = 0.35;

/** How far above a collider's top we still count a descent as "landing on it". */
const LAND_TOL = 0.06;

/** Below this horizontal speed we hold the previous facing instead of snapping. */
const YAW_MIN_SPEED = 0.4;

/**
 * Which way the hand puppet is modelled. true = its fingers point down its own
 * -Z, which is Three's forward (what lookAt orients) and means yaw 0 already
 * faces away from the fixed chase camera. If the hand ever ships pointing at
 * the camera instead, this single flag is the fix - nothing else changes.
 */
const HAND_FACES_NEG_Z = true;

/** Pinch relaxes back open at this exponential rate (1 -> ~0.05 in 0.37s). */
const PINCH_DECAY = 8;

/**
 * Resting closure of the claw while nothing is within reach. Not fully open:
 * a hand that runs around with its fingers splayed all game has nowhere to go
 * when it actually reaches for something.
 */
const CLAW_NEUTRAL = 0.30;

/**
 * How far the hand turns toward an emeem it is reaching for, as a fraction of
 * the angle between its heading and the emeem. Kept low deliberately - the
 * hand should glance toward the catch, not stop running to face it.
 */
const REACH_YAW_BIAS = 0.45;

/** Landings harder than this shake the camera. A jump apex lands at 8.4 m/s. */
const LAND_SHAKE_SPEED = 12;

// Module-scope scratch. There is exactly one player, and these are only ever
// live inside a single synchronous call, so sharing them costs nothing and
// keeps the 120Hz step allocation-free.
const _min = new THREE.Vector3();
const _max = new THREE.Vector3();
const _stepMin = new THREE.Vector3();
const _stepMax = new THREE.Vector3();
const _hits = [];
const _stepHits = [];

/** Wraps an angle into -PI..PI so turning always takes the shortest path. */
/** Clamp to 0..1. */
function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * Frame-rate independent exponential damping toward a target.
 * `1 - e^(-rate*dt)` is the correct blend factor for "approach with a time
 * constant of 1/rate seconds"; a raw `rate * dt` lerp changes feel with the
 * frame rate and overshoots past dt = 1/rate.
 */
function dampTo(current, target, rate, dt) {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

function wrapPi(a) {
  let x = (a + Math.PI) % TAU;
  if (x < 0) x += TAU;
  return x - Math.PI;
}

/**
 * @param {object} ctx game context - { THREE, CONFIG, state, bus, scene, ... }
 * @returns {{object3D: THREE.Object3D, fixedUpdate: Function, update: Function,
 *            reset: Function}}
 */
export function createPlayer(ctx) {
  const state = ctx.state;
  const bus = ctx.bus;
  const P = CONFIG.player;
  const R = P.radius;
  const H = P.height;

  // ------------------------------------------------------------------- rig
  // ctx.world / ctx.audio are still null here, so nothing below may touch them
  // until update()/fixedUpdate().
  const hand = createHand(ctx.THREE || THREE, ctx.CONFIG || CONFIG);
  const group = (hand && hand.group) || new THREE.Group();
  group.name = 'player';
  const handHasUpdate = !!(hand && typeof hand.update === 'function');
  const handHasPinch = !!(hand && typeof hand.setPinch === 'function');
  const handHasReach = !!(hand && typeof hand.setReach === 'function');
  if (ctx.scene) ctx.scene.add(group);

  // Reused every frame - hand.update() must not keep a reference to it.
  const handOpts = { speed: 0, grounded: false, dread: 0, time: 0 };

  // ---------------------------------------------------------------- timers
  let coyote = 0;        // >0 = a jump is still legal after walking off an edge
  let jumpBuf = 0;       // >0 = a press is waiting for us to touch down
  let prevJumpHeld = false;
  let prevGrounded = false;
  // Always-advancing cosmetic clock: state.time freezes outside 'playing', but
  // the hand should still idle-breathe on the start and game-over screens.
  let clock = 0;
  // Seconds left of the post-catch clamp. While this is running the claw is
  // driven shut; when it expires the claw relaxes back toward neutral.
  let grabHold = 0;

  // Working copies for the collision helpers, so they can mutate position and
  // velocity without out-params or per-step object churn.
  let wx = 0;
  let wy = 0;
  let wz = 0;
  let wvx = 0;
  let wvy = 0;
  let wvz = 0;
  let wGrounded = false;
  let wSupport = 0;

  // ------------------------------------------------------------- collision

  /** Query box for horizontal resolution: full X/Z, vertically inset by SKIN. */
  function fillHorizontalBox() {
    _min.set(wx - R, wy + SKIN, wz - R);
    _max.set(wx + R, wy + H - SKIN, wz + R);
  }

  /**
   * Tries to climb onto everything currently overlapping us. Only succeeds if
   * the rise is small AND the raised box is completely clear, so we never pop
   * up inside geometry.
   */
  function tryStepUp(world, hits) {
    let top = -Infinity;
    for (let i = 0; i < hits.length; i++) {
      if (hits[i].max.y > top) top = hits[i].max.y;
    }
    const rise = top - wy;
    if (!(rise > 1e-4) || rise > STEP_HEIGHT) return false;

    _stepMin.set(wx - R, top + SKIN, wz - R);
    _stepMax.set(wx + R, top + H - SKIN, wz + R);
    if (world.queryAABB(_stepMin, _stepMax, _stepHits).length > 0) return false;

    wy = top;
    if (wvy < 0) wvy = 0;
    wGrounded = true;
    if (top > wSupport) wSupport = top;
    return true;
  }

  /**
   * Resolves one horizontal axis after it has already been integrated.
   * @param {object} world ctx.world
   * @param {boolean} isX true for X, false for Z
   * @param {number} delta the movement just applied on this axis
   * @param {boolean} allowStep whether a step-up is legal right now
   */
  function resolveHorizontal(world, isX, delta, allowStep) {
    fillHorizontalBox();
    const hits = world.queryAABB(_min, _max, _hits);
    if (hits.length === 0) return;

    if (allowStep && tryStepUp(world, hits)) return;

    if (delta > 0) {
      // Moving +: stop at the nearest near-face among everything we hit.
      let lim = Infinity;
      for (let i = 0; i < hits.length; i++) {
        const c = hits[i];
        const face = (isX ? c.min.x : c.min.z) - R - EPS;
        if (face < lim) lim = face;
      }
      if (isX) { if (wx > lim) { wx = lim; if (wvx > 0) wvx = 0; } }
      else if (wz > lim) { wz = lim; if (wvz > 0) wvz = 0; }
    } else if (delta < 0) {
      let lim = -Infinity;
      for (let i = 0; i < hits.length; i++) {
        const c = hits[i];
        const face = (isX ? c.max.x : c.max.z) + R + EPS;
        if (face > lim) lim = face;
      }
      if (isX) { if (wx < lim) { wx = lim; if (wvx < 0) wvx = 0; } }
      else if (wz < lim) { wz = lim; if (wvz < 0) wvz = 0; }
    } else {
      // No motion on this axis but we are overlapping anyway - we were spawned
      // inside a box, or a chunk streamed in around us. Push out along the
      // shortest escape so the player can never be sealed in.
      for (let i = 0; i < hits.length; i++) {
        const c = hits[i];
        const p = isX ? wx : wz;
        const outPos = (isX ? c.max.x : c.max.z) + R + EPS - p; // move + to clear
        const outNeg = p - ((isX ? c.min.x : c.min.z) - R - EPS); // move - to clear
        const push = outPos < outNeg ? outPos : -outNeg;
        if (isX) wx += push; else wz += push;
      }
    }
  }

  /**
   * Resolves the vertical axis after it has been integrated.
   * @param {object} world ctx.world
   * @param {number} prevY feet height before this step's vertical move
   */
  function resolveVertical(world, prevY) {
    _min.set(wx - R + SKIN, wy, wz - R + SKIN);
    _max.set(wx + R - SKIN, wy + H, wz + R - SKIN);
    const hits = world.queryAABB(_min, _max, _hits);
    if (hits.length === 0) return;

    if (wvy <= 0) {
      // Falling: land on the highest top we were legitimately above.
      let top = -Infinity;
      for (let i = 0; i < hits.length; i++) {
        const t = hits[i].max.y;
        if (prevY >= t - LAND_TOL && t > top) top = t;
      }
      if (top === -Infinity) {
        // Already buried in something. Pop to the top if that is a short hop;
        // deeper burial is left to the horizontal push-out, which will squeeze
        // us out of the side of the box instead of launching us over it.
        let deep = -Infinity;
        for (let i = 0; i < hits.length; i++) {
          if (hits[i].max.y > deep) deep = hits[i].max.y;
        }
        if (deep - wy > 0 && deep - wy <= H * 0.75) top = deep;
      }
      if (top > -Infinity) {
        wy = top;
        wvy = 0;
        wGrounded = true;
        if (top > wSupport) wSupport = top;
      }
    } else {
      // Rising: bump our head on the lowest underside we were legitimately below.
      let bottom = Infinity;
      for (let i = 0; i < hits.length; i++) {
        const b = hits[i].min.y;
        if (prevY + H <= b + LAND_TOL && b < bottom) bottom = b;
      }
      if (bottom < Infinity) {
        wy = bottom - H - EPS;
        wvy = 0;
      }
    }
  }

  // ------------------------------------------------------------- physics
  /**
   * Fixed-step physics. Called at 120Hz while state.phase === 'playing'.
   * @param {number} dtFixed fixed timestep in seconds
   * @param {object} c the game context
   */
  function fixedUpdate(dtFixed, c) {
    const world = (c && c.world) || ctx.world;
    const p = state.player;
    const inp = state.input;
    if (!(dtFixed > 0)) return;
    const dt = dtFixed;

    // -- desired direction ------------------------------------------------
    // Fixed camera heading: input maps straight onto world axes, and "forward"
    // (input.z = +1) is -Z.
    let dx = inp.x || 0;
    let dz = -(inp.z || 0);
    const inLen = Math.hypot(dx, dz);
    if (inLen > 1) { dx /= inLen; dz /= inLen; } // diagonals must not be faster
    const wantMove = inLen > 1e-3;

    const grounded0 = p.grounded;

    wx = p.pos.x; wy = p.pos.y; wz = p.pos.z;
    wvx = p.vel.x; wvy = p.vel.y; wvz = p.vel.z;
    wGrounded = false;
    // Highest surface found under our feet this step; -Infinity until something
    // (a box top, a step-up, or the ground plane) claims it.
    wSupport = -Infinity;

    // -- horizontal acceleration -----------------------------------------
    if (wantMove) {
      // Accelerate toward the target velocity at a capped rate; air control
      // trims how much authority you keep once your feet leave the ground.
      const accel = P.accel * (grounded0 ? 1 : P.airControl);
      const ddx = dx * P.walkSpeed - wvx;
      const ddz = dz * P.walkSpeed - wvz;
      const need = Math.hypot(ddx, ddz);
      if (need > 1e-6) {
        const maxStep = accel * dt;
        const k = need > maxStep ? maxStep / need : 1;
        wvx += ddx * k;
        wvz += ddz * k;
      }
    } else if (grounded0) {
      // Hands off, feet down: exponential friction. Frame-rate independent,
      // and airborne momentum is deliberately left untouched.
      const damp = Math.exp(-P.friction * dt);
      wvx *= damp;
      wvz *= damp;
      if (Math.abs(wvx) < 0.01) wvx = 0;
      if (Math.abs(wvz) < 0.01) wvz = 0;
    }

    // -- gravity -----------------------------------------------------------
    wvy += P.gravity * dt;
    if (wvy < P.maxFallSpeed) wvy = P.maxFallSpeed;

    // -- jump, with both grace windows ------------------------------------
    // Coyote time forgives a press just after you run off a ledge; the jump
    // buffer forgives a press just before you touch down. On a touchscreen,
    // where the tap lands whenever the thumb decides, both are mandatory.
    coyote = grounded0 ? P.coyoteTime : Math.max(0, coyote - dt);

    const held = inp.jump === true;
    // jumpPressed is the intended edge flag and we own clearing it; the rising
    // edge of the held flag is a fallback so the jump still fires if a control
    // surface only reports "held".
    const pressed = inp.jumpPressed === true || (held && !prevJumpHeld);
    prevJumpHeld = held;
    inp.jumpPressed = false;

    jumpBuf = pressed ? P.jumpBuffer : Math.max(0, jumpBuf - dt);

    let jumped = false;
    if (jumpBuf > 0 && coyote > 0) {
      wvy = P.jumpVelocity;
      jumpBuf = 0;
      coyote = 0;
      jumped = true;
    }

    // -- integrate + resolve, one axis at a time ---------------------------
    const startX = wx;
    const startZ = wz;
    // A step-up is a grounded move; mid-air it would look like climbing air.
    const allowStep = (grounded0 || coyote > 0) && wvy <= 0.01;

    const mvx = wvx * dt;
    wx += mvx;
    if (world) resolveHorizontal(world, true, mvx, allowStep);

    const mvz = wvz * dt;
    wz += mvz;
    if (world) resolveHorizontal(world, false, mvz, allowStep);

    const prevY = wy;
    const approachVy = wvy; // speed we are about to make contact at
    wy += wvy * dt;

    const gy = world ? world.sampleGroundY(wx, wz) : CONFIG.world.groundY;
    if (world) resolveVertical(world, prevY);

    // The ground plane itself is not a collider, so clamp to it last.
    if (wy <= gy) {
      wy = gy;
      if (wvy < 0) wvy = 0;
      wGrounded = true;
      if (gy > wSupport) wSupport = gy;
    }
    if (!Number.isFinite(wSupport)) wSupport = gy; // airborne: report the terrain

    // Paranoia: one NaN anywhere would poison pos, the camera and the world
    // streamer for the rest of the run. Recover to the spawn point instead.
    if (!Number.isFinite(wx) || !Number.isFinite(wy) || !Number.isFinite(wz)) {
      wx = 0; wy = gy + P.spawnHeight; wz = 0;
      wvx = 0; wvy = 0; wvz = 0;
      wGrounded = false;
    }

    // -- publish ------------------------------------------------------------
    p.pos.set(wx, wy, wz);
    p.vel.set(wvx, wvy, wvz);
    p.grounded = wGrounded;
    p.groundY = wSupport; // height of the surface actually under our feet
    p.distanceRun += Math.hypot(wx - startX, wz - startZ);

    // -- events (rare, so cloning the position is fine) --------------------
    if (jumped && bus) bus.emit('jump', { position: p.pos.clone() });

    if (wGrounded && !prevGrounded) {
      const impact = approachVy < 0 ? -approachVy : 0;
      if (bus) {
        bus.emit('land', { position: p.pos.clone(), impact });
        if (impact > LAND_SHAKE_SPEED) {
          // Only genuinely heavy drops rattle the camera.
          const amt = Math.min(0.45, (impact - LAND_SHAKE_SPEED) / 26);
          bus.emit('shake', { amount: amt });
        }
      }
    }
    prevGrounded = wGrounded;
  }

  // -------------------------------------------------------------- visuals
  /**
   * Cosmetics only, on the variable frame delta. Called every frame, including
   * on the menu and game-over screens.
   * @param {number} dt frame delta in seconds
   * @param {object} c the game context
   */
  function update(dt, c) {
    const p = state.player;
    const step = dt > 0 ? dt : 0;
    clock += step;

    const speed = Math.hypot(p.vel.x, p.vel.z);
    if (speed > YAW_MIN_SPEED) {
      // Yaw that points the model's forward axis along the velocity. Damp
      // along the SHORTEST path or it unwinds the long way at the +/-PI seam.
      const target = HAND_FACES_NEG_Z
        ? Math.atan2(-p.vel.x, -p.vel.z)
        : Math.atan2(p.vel.x, p.vel.z);
      const diff = wrapPi(target - p.yaw);
      p.yaw = wrapPi(p.yaw + diff * (1 - Math.exp(-P.turnLerp * step)));
    }
    // Below the threshold we simply hold the last yaw: snapping to 0 whenever
    // you stop would spin the hand on every step you take.

    // ------------------------------------------------------- reach and grab
    // The catch is a two-beat animation and both beats matter:
    //   1. REACH  - as an emeem comes inside reachRadius the claw spreads open,
    //               wider the closer it gets. This is the anticipation; without
    //               it emeems just silently evaporate as you run past them.
    //   2. GRAB   - the pickup fires, the claw slams shut, holds a moment, then
    //               relaxes. Snap is ~5x faster than the open, because a grab
    //               that closes as slowly as it opens reads as a yawn.
    const EM = CONFIG.emeem;
    let reachTarget = 0;
    if (p.hasNearestEmeem && Number.isFinite(p.nearestEmeemDist)) {
      const span = Math.max(0.001, EM.reachRadius - EM.pickupRadius);
      reachTarget = clamp01((EM.reachRadius - p.nearestEmeemDist) / span);
    }
    p.reach = dampTo(p.reach, reachTarget, P.reachOpenRate, step);
    if (p.reach < 0.001) p.reach = 0;

    if (grabHold > 0) {
      grabHold -= step;
      p.pinch = dampTo(p.pinch, 1, P.pinchSnapRate, step);
    } else {
      p.pinch = dampTo(p.pinch, 0, P.pinchReleaseRate, step);
      if (p.pinch < 0.002) p.pinch = 0;
    }

    // Glance toward the emeem being reached for, so the claw arrives pointing
    // at it rather than catching it out of the side of the hand.
    if (p.reach > 0.01 && p.hasNearestEmeem) {
      const dx = p.nearestEmeem.x - p.pos.x;
      const dz = p.nearestEmeem.z - p.pos.z;
      if (dx * dx + dz * dz > 1e-4) {
        const toEmeem = HAND_FACES_NEG_Z ? Math.atan2(-dx, -dz) : Math.atan2(dx, dz);
        p.yaw = wrapPi(p.yaw + wrapPi(toEmeem - p.yaw) * REACH_YAW_BIAS * p.reach);
      }
    }

    group.position.copy(p.pos);
    group.rotation.y = p.yaw;

    // Neutral relaxes toward wide open as the reach builds; the grab overrides
    // it outright, so a catch always closes no matter where the reach was.
    // Two separate signals to the puppet: setReach drops it into the
    // pincer-down posture, setPinch opens or shuts that pincer.
    if (handHasReach) hand.setReach(p.reach);
    if (handHasPinch) hand.setPinch(Math.max(CLAW_NEUTRAL * (1 - p.reach), p.pinch));

    if (handHasUpdate) {
      handOpts.speed = speed;
      handOpts.grounded = p.grounded;
      handOpts.dread = state.dread;
      handOpts.time = clock;
      hand.update(step, handOpts);
    }
  }

  // ---------------------------------------------------------------- reset
  function reset() {
    const world = ctx.world;
    const p = state.player;
    const gy = world ? world.sampleGroundY(0, 0) : CONFIG.world.groundY;

    p.pos.set(0, gy + P.spawnHeight, 0);
    p.vel.set(0, 0, 0);
    p.yaw = 0;
    p.grounded = false;
    p.groundY = gy;
    p.pinch = 0;
    p.distanceRun = 0;

    state.input.jumpPressed = false;

    coyote = 0;
    jumpBuf = 0;
    // Seed from the live button so a thumb already resting on JUMP when the
    // run restarts is not read as a fresh press.
    prevJumpHeld = state.input.jump === true;
    prevGrounded = false;

    grabHold = 0;
    if (handHasReach) hand.setReach(0);
    group.position.copy(p.pos);
    group.rotation.set(0, 0, 0);
    if (handHasPinch) hand.setPinch(CLAW_NEUTRAL);
  }

  // emeem.js owns the pickup test and fires 'collect'. All we do here is start
  // the clamp; the claw drive in update() plays it out over the next frames.
  if (bus) bus.on('collect', () => { grabHold = CONFIG.player.pinchHoldTime; });

  reset();

  return { object3D: group, fixedUpdate, update, reset };
}
