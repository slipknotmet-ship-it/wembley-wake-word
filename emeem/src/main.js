import * as THREE from 'three';
import { CONFIG } from './core/config.js';
import { state, resetState, addScore } from './core/state.js';
import { createBus } from './core/bus.js';
import { createRenderer } from './engine/renderer.js';
import { createWorld } from './world/world.js';
import { createPlayer } from './entities/player.js';
import { createEmeems } from './entities/emeem.js';
import { createMonster } from './entities/monster.js';
import { createTouchControls } from './ui/touch.js';
import { createHUD } from './ui/hud.js';
import { createAudio } from './audio/sfx.js';

const canvas = document.getElementById('game-canvas');
const uiRoot = document.getElementById('ui-root');

// ---------------------------------------------------------------- bootstrap
const bus = createBus();
const engine = createRenderer(canvas);

/**
 * The context object handed to every module. Modules must not replace any of
 * these references, only read them and mutate `state`.
 */
const ctx = {
  THREE,
  CONFIG,
  state,
  bus,
  scene: engine.scene,
  camera: engine.camera,
  renderer: engine.renderer,
  engine,
  world: null,
  audio: null,
  addScore: (n) => addScore(bus, n),
};

ctx.audio = createAudio(ctx);
ctx.world = createWorld(ctx);
const player = createPlayer(ctx);
const emeems = createEmeems(ctx);
const monster = createMonster(ctx);
const hud = createHUD(uiRoot, ctx);
const touch = createTouchControls(uiRoot, ctx);

// ------------------------------------------------------------------- events
bus.on('collect', (e) => { ctx.audio.collect(e); state.stats.emeems++; });
bus.on('jump', (e) => { ctx.audio.jump(e); state.stats.jumps++; });
bus.on('land', (e) => ctx.audio.land(e));
bus.on('roar', (e) => ctx.audio.roar(e));
bus.on('levelup', (e) => { ctx.audio.levelup(e); bus.emit('shake', { amount: 0.7 }); });
bus.on('shake', (e) => { state.camera.shake = Math.min(1.6, state.camera.shake + (e?.amount ?? 0.4)); });

bus.on('caught', () => {
  if (state.phase !== 'playing') return;
  state.phase = 'dead';
  state.best = Math.max(state.best, state.score);
  try { localStorage.setItem('emeem.best', String(state.best)); } catch { /* private mode */ }
  ctx.audio.caught();
  bus.emit('shake', { amount: 1.6 });
  hud.showGameOver(state.score, state.best);
});

function startRun() {
  resetState();
  ctx.audio.resume();
  ctx.world.reset();
  player.reset();
  emeems.reset();
  monster.reset();
  engine.reset();
  hud.hideOverlays();
}
bus.on('start', startRun);
bus.on('restart', startRun);

try { state.best = Number(localStorage.getItem('emeem.best')) || 0; } catch { /* ignore */ }

// --------------------------------------------------------------- main loop
let last = performance.now();
let acc = 0;
const FIXED = 1 / 120; // fixed-step physics so collisions stay stable

function frame(now) {
  requestAnimationFrame(frame);

  let dt = (now - last) / 1000;
  last = now;
  if (!Number.isFinite(dt) || dt < 0) dt = 0;
  dt = Math.min(dt, CONFIG.render.maxDelta);
  state.dt = dt;

  if (state.phase === 'playing') {
    state.time += dt;
    state.stats.runTime = state.time;

    // Fixed-step the things that can tunnel; variable-step the cosmetics.
    acc = Math.min(acc + dt, 0.25);
    while (acc >= FIXED) {
      player.fixedUpdate(FIXED, ctx);
      monster.fixedUpdate(FIXED, ctx);
      acc -= FIXED;
    }
    ctx.world.update(dt, ctx);
    emeems.update(dt, ctx);
  }

  player.update(dt, ctx);
  monster.update(dt, ctx);
  engine.update(dt, ctx);
  hud.update(dt, ctx);
  ctx.audio.update(dt, ctx);

  engine.render();
}

window.addEventListener('resize', () => engine.resize());
engine.resize();
hud.showStart();
requestAnimationFrame(frame);

// Expose a tiny handle for the automated smoke test / manual debugging.
window.__EMEEM__ = { ctx, state, bus, startRun, engine, world: ctx.world, player, monster, emeems };
