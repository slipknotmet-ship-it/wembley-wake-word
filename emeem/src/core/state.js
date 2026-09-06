import * as THREE from 'three';
import { CONFIG, levelForScore, levelIndexForScore } from './config.js';

/**
 * The single mutable game state object. Modules read and write this directly;
 * nothing here is ever reassigned, only mutated, so every module can hold a
 * reference from startup to shutdown.
 */
export const state = {
  phase: 'menu',        // 'menu' | 'playing' | 'dead'
  time: 0,              // seconds since the current run started
  dt: 0,                // last frame delta, already clamped
  score: 0,
  best: 0,
  levelIndex: 0,
  level: CONFIG.levels[0],
  dread: 0,             // 0..1, smoothed toward level.dread

  player: {
    pos: new THREE.Vector3(0, CONFIG.player.spawnHeight, 0),
    vel: new THREE.Vector3(0, 0, 0),
    yaw: 0,             // facing, radians
    grounded: false,
    groundY: 0,
    pinch: 0,           // 0..1 claw closure: 0 = neutral, 1 = thumb meets index
    reach: 0,           // 0..1 anticipation as an emeem comes into claw range
    /**
     * Nearest live emeem, written by entities/emeem.js every frame and read by
     * entities/player.js to drive the reach-and-grab. emeem.js owns the search
     * because it is already iterating the pool for the pickup test, so this
     * costs nothing extra.
     */
    nearestEmeem: new THREE.Vector3(),
    nearestEmeemDist: Infinity,
    hasNearestEmeem: false,
    distanceRun: 0,
  },

  monster: {
    pos: new THREE.Vector3(0, 0, -CONFIG.monster.spawnDistance),
    vel: new THREE.Vector3(0, 0, 0),
    yaw: 0,
    speed: CONFIG.monster.baseSpeed,
    scale: CONFIG.monster.baseScale,
    distanceToPlayer: CONFIG.monster.spawnDistance,
    proximity: 0,       // 0 = far away, 1 = right on top of you
  },

  /** Written by ui/touch.js every frame, read by entities/player.js. */
  input: {
    x: 0,               // -1 (left) .. 1 (right), camera-relative strafe
    z: 0,               // -1 (back)  .. 1 (forward)
    jump: false,        // held
    jumpPressed: false, // edge, cleared by the player controller each frame
  },

  camera: {
    yaw: 0,
    shake: 0,
  },

  stats: { emeems: 0, jumps: 0, runTime: 0 },
};

/** Resets everything for a fresh run. Called on start and on restart. */
export function resetState() {
  state.phase = 'playing';
  state.time = 0;
  state.score = 0;
  state.levelIndex = 0;
  state.level = CONFIG.levels[0];
  state.dread = 0;

  state.player.pos.set(0, CONFIG.player.spawnHeight, 0);
  state.player.vel.set(0, 0, 0);
  state.player.yaw = 0;
  state.player.grounded = false;
  state.player.groundY = 0;
  state.player.pinch = 0;
  state.player.reach = 0;
  state.player.nearestEmeem.set(0, 0, 0);
  state.player.nearestEmeemDist = Infinity;
  state.player.hasNearestEmeem = false;
  state.player.distanceRun = 0;

  state.monster.pos.set(0, 0, -CONFIG.monster.spawnDistance);
  state.monster.vel.set(0, 0, 0);
  state.monster.yaw = 0;
  state.monster.speed = CONFIG.monster.baseSpeed;
  state.monster.scale = CONFIG.monster.baseScale;
  state.monster.distanceToPlayer = CONFIG.monster.spawnDistance;
  state.monster.proximity = 0;

  state.input.x = 0;
  state.input.z = 0;
  state.input.jump = false;
  state.input.jumpPressed = false;

  state.camera.yaw = 0;
  state.camera.shake = 0;

  state.stats.emeems = 0;
  state.stats.jumps = 0;
  state.stats.runTime = 0;
}

/**
 * Adds to the score and promotes the threat level if a threshold was crossed.
 * Emits 'levelup' on the bus when the tier changes.
 */
export function addScore(bus, amount = 1) {
  state.score += amount;
  const idx = levelIndexForScore(state.score);
  if (idx !== state.levelIndex) {
    state.levelIndex = idx;
    state.level = levelForScore(state.score);
    bus.emit('levelup', { index: idx, level: state.level });
  }
}
