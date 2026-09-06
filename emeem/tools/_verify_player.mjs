import * as THREE from 'three';
import { CONFIG } from '../src/core/config.js';
import { state, resetState, addScore } from '../src/core/state.js';
import { createBus } from '../src/core/bus.js';
import { createWorld } from '../src/world/world.js';
import { createPlayer } from '../src/entities/player.js';

const bus = createBus();
const scene = new THREE.Scene();
const ctx = { THREE, CONFIG, state, bus, scene, camera: null, renderer: null, engine: null, world: null, audio: null, addScore: (n) => addScore(bus, n) };
ctx.world = createWorld(ctx);
const player = createPlayer(ctx);

const evts = { jump: 0, land: 0, shake: 0 };
bus.on('jump', () => evts.jump++);
bus.on('land', () => evts.land++);
bus.on('shake', () => evts.shake++);

resetState();
ctx.world.reset();
player.reset();

const FIXED = 1 / 120;
let bad = { nan: 0, belowGround: 0, penetrate: 0, stalled: 0 };
let maxY = -Infinity, maxSpeed = 0;

function stepFrame(dt, inp) {
  Object.assign(state.input, inp);
  state.time += dt;
  let acc = dt;
  while (acc >= FIXED) { player.fixedUpdate(FIXED, ctx); acc -= FIXED; }
  ctx.world.update(dt, ctx);
  player.update(dt, ctx);
  const p = state.player;
  if (!Number.isFinite(p.pos.x) || !Number.isFinite(p.pos.y) || !Number.isFinite(p.pos.z) || !Number.isFinite(p.yaw) || !Number.isFinite(p.groundY) || !Number.isFinite(p.reach) || !Number.isFinite(p.pinch) || !Number.isFinite(p.grabPoint.x)) bad.nan++;
  if (p.pos.y < -0.001) bad.belowGround++;
  maxY = Math.max(maxY, p.pos.y);
  maxSpeed = Math.max(maxSpeed, Math.hypot(p.vel.x, p.vel.z));
  // penetration test
  const out = [];
  const R = CONFIG.player.radius, H = CONFIG.player.height;
  ctx.world.queryAABB({x:p.pos.x-R+0.05,y:p.pos.y+0.05,z:p.pos.z-R+0.05},{x:p.pos.x+R-0.05,y:p.pos.y+H-0.05,z:p.pos.z+R-0.05}, out);
  if (out.length) bad.penetrate++;
}

// 1) straight-line top speed
for (let i = 0; i < 600; i++) stepFrame(1/60, { x: 0, z: 1, jump: false, jumpPressed: false });
console.log('straight speed', Math.hypot(state.player.vel.x, state.player.vel.z).toFixed(4), 'grounded', state.player.grounded, 'groundY', state.player.groundY);
// 2) diagonal
for (let i = 0; i < 600; i++) stepFrame(1/60, { x: 1, z: 1, jump: false, jumpPressed: false });
console.log('diag speed', Math.hypot(state.player.vel.x, state.player.vel.z).toFixed(4), 'yaw', state.player.yaw.toFixed(4));
// 3) jump apex
resetState(); player.reset(); ctx.world.reset();
for (let i = 0; i < 120; i++) stepFrame(1/60, { x: 0, z: 0, jump: false, jumpPressed: false });
const gY = state.player.pos.y;
stepFrame(1/60, { x: 0, z: 0, jump: true, jumpPressed: true });
let apex = -Infinity;
for (let i = 0; i < 200; i++) { stepFrame(1/60, { x: 0, z: 0, jump: false, jumpPressed: false }); apex = Math.max(apex, state.player.pos.y); }
console.log('jump apex', (apex - gY).toFixed(4), 'events', JSON.stringify(evts));
// 4) long randomised run
resetState(); player.reset(); ctx.world.reset();
let seed = 12345; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const t0 = process.hrtime.bigint();
let ix = 0, iz = 1;
for (let i = 0; i < 60 * 90; i++) {
  if (i % 37 === 0) { ix = Math.round(rnd() * 2 - 1); iz = Math.round(rnd() * 2 - 1); }
  const jp = rnd() < 0.02;
  state.player.hasNearestEmeem = rnd() < 0.5;
  state.player.nearestEmeemDist = rnd() * 5;
  state.player.nearestEmeem.set(state.player.pos.x + rnd()*4-2, 0.34, state.player.pos.z + rnd()*4-2);
  if (rnd() < 0.01) bus.emit('collect', {});
  stepFrame(1/60, { x: ix, z: iz, jump: jp, jumpPressed: jp });
}
const t1 = process.hrtime.bigint();
console.log('90s run:', JSON.stringify(bad), 'cpu(ms)', Number(t1 - t0) / 1e6 | 0);
console.log('pos', state.player.pos.toArray().map(n=>n.toFixed(2)).join(','), 'distanceRun', state.player.distanceRun.toFixed(1));
console.log('colliders', ctx.world.colliders.length, 'reach', state.player.reach.toFixed(3), 'pinch', state.player.pinch.toFixed(3));
// 5) update() outside playing must not throw
state.phase = 'menu';
for (let i = 0; i < 120; i++) player.update(1/60, ctx);
console.log('menu update ok, yaw', state.player.yaw.toFixed(4));

// 6) allocation / listener growth over a long run
resetState(); ctx.world.reset(); player.reset();
if (global.gc) global.gc();
const h0 = process.memoryUsage().heapUsed;
for (let i = 0; i < 60 * 300; i++) {
  state.input.x = 1; state.input.z = 1; state.input.jump = false; state.input.jumpPressed = (i % 91 === 0);
  let acc = 1/60; while (acc >= FIXED) { player.fixedUpdate(FIXED, ctx); acc -= FIXED; }
  ctx.world.update(1/60, ctx);
  state.player.hasNearestEmeem = (i % 3) !== 0;
  state.player.nearestEmeemDist = 1 + (i % 40) / 10;
  state.player.nearestEmeem.set(state.player.pos.x + 1, 0.34, state.player.pos.z - 1);
  player.update(1/60, ctx);
}
if (global.gc) global.gc();
const h1 = process.memoryUsage().heapUsed;
console.log('300s run heap delta (KB)', ((h1 - h0) / 1024) | 0, 'nan', bad.nan, 'below', bad.belowGround, 'pen', bad.penetrate);
console.log('final', state.player.pos.toArray().map(n=>n.toFixed(2)).join(','), 'grabPoint', state.player.grabPoint.toArray().map(n=>n.toFixed(2)).join(','));
