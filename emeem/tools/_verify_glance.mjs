import * as THREE from 'three';
import { CONFIG } from '../src/core/config.js';
import { state, resetState, addScore } from '../src/core/state.js';
import { createBus } from '../src/core/bus.js';
import { createWorld } from '../src/world/world.js';
import { createPlayer } from '../src/entities/player.js';

const bus = createBus();
const scene = new THREE.Scene();
const ctx = { THREE, CONFIG, state, bus, scene, world: null, audio: null, addScore: (n) => addScore(bus, n) };
ctx.world = createWorld(ctx);
const player = createPlayer(ctx);
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function run(fps) {
  resetState(); ctx.world.reset(); player.reset();
  const dt = 1 / fps;
  const stepPhysics = () => { let acc = dt; while (acc >= 1/120) { player.fixedUpdate(1/120, ctx); acc -= 1/120; } };
  for (let i = 0; i < fps * 3; i++) { state.input.x = 0; state.input.z = 1; stepPhysics(); state.player.hasNearestEmeem = false; player.update(dt, ctx); }
  const travel = player.object3D.rotation.y;
  let maxDev = 0;
  for (let i = 0; i < fps * 2; i++) {
    state.input.x = 0; state.input.z = 1; stepPhysics();
    const p = state.player;
    p.hasNearestEmeem = true; p.nearestEmeemDist = 1.5;
    p.nearestEmeem.set(p.pos.x + 1.5, 0.34, p.pos.z);
    player.update(dt, ctx);
    maxDev = Math.max(maxDev, Math.abs(wrap(player.object3D.rotation.y - state.player.yaw)));
  }
  const held = wrap(player.object3D.rotation.y - state.player.yaw);
  // now drop the emeem and watch the release for a snap
  let biggestStep = 0, prev = player.object3D.rotation.y;
  for (let i = 0; i < fps; i++) {
    state.input.x = 0; state.input.z = 1; stepPhysics();
    state.player.hasNearestEmeem = false; state.player.nearestEmeemDist = Infinity;
    player.update(dt, ctx);
    biggestStep = Math.max(biggestStep, Math.abs(wrap(player.object3D.rotation.y - prev)));
    prev = player.object3D.rotation.y;
  }
  // grab point must sit GRAB_FORWARD ahead of the feet along the rendered facing
  const p = state.player;
  const gd = Math.hypot(p.grabPoint.x - p.pos.x, p.grabPoint.z - p.pos.z);
  const gAng = wrap(Math.atan2(-(p.grabPoint.x - p.pos.x), -(p.grabPoint.z - p.pos.z)) - player.object3D.rotation.y);
  return {
    fps,
    heldGlanceDeg: +(held * 180 / Math.PI).toFixed(2),
    maxGlanceDeg: +(maxDev * 180 / Math.PI).toFixed(2),
    capDeg: +(0.30 * 180 / Math.PI).toFixed(2),
    maxReleaseStepDeg: +(biggestStep * 180 / Math.PI).toFixed(2),
    grabDist: +gd.toFixed(3),
    grabAngleErrDeg: +(gAng * 180 / Math.PI).toFixed(4),
    grabY: +(p.grabPoint.y - p.pos.y).toFixed(3),
  };
}
for (const f of [30, 60, 120]) console.log(run(f));
