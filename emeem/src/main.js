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

/**
 * Three.js needs WebGL2. Every phone that matters has it - Android since 2017,
 * iOS since 15 in 2021 - but a device without it would otherwise render a black
 * screen and an error only a developer would ever see. Say so in words instead.
 */
function hasWebGL2() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}
if (!hasWebGL2()) {
  uiRoot.innerHTML =
    '<div style="position:fixed;inset:0;display:grid;place-content:center;gap:10px;' +
    'text-align:center;padding:28px;background:#0b0510;color:#f2c4b3;' +
    'font:600 17px/1.5 system-ui,-apple-system,sans-serif">' +
    '<div style="font-size:34px">\u{1F90F}</div>' +
    '<div>Emeem needs WebGL2, which this browser does not support.</div>' +
    '<div style="opacity:.62;font-weight:500;font-size:14px">' +
    'On iPhone that means iOS 15 or newer; on Android, Chrome or Firefox.</div></div>';
  throw new Error('WebGL2 unavailable');
}

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
bus.on('collect', (e) => {
  ctx.audio.collect(e);
  // Count what you CAUGHT, not what you touched. An amaam is a penalty and a
  // golden is worth nothing; neither must inflate the run summary. A golden
  // falls out for free here - its points are 0, so `points > 0` is false.
  if (!e || typeof e.points !== 'number' || e.points > 0) state.stats.emeems++;

  // A golden emeem RESTARTS the slow rather than extending it: taking one with
  // 5.9s still on the clock gives 6.0s, never 11.9s. That is the whole rule,
  // and an assignment rather than a `+=` is the whole implementation.
  if (e && e.kind === 'golden') {
    const was = state.monster.slowT;
    state.monster.slowT = CONFIG.emeem.kinds.golden.slowTime;
    state.stats.goldens = (state.stats.goldens || 0) + 1;
    bus.emit('slow', { seconds: state.monster.slowT, refreshed: was > 0 });
  }
});
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
  // monster.reset() BEFORE emeems.reset(). resetState() parks the monster at
  // -spawnDistance, but reset() is what actually puts it BEHIND the player at
  // +spawnDistance - so seeding the field first tested the "no bait in its
  // jaws" keep-out against a mirror image of where it really is, punching a
  // dead zone ahead of the player and occasionally seeding an emeem directly
  // underneath the Protector.
  monster.reset();
  emeems.reset();
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

  // Exactly ONCE per frame, before the phase branch. It owns the smoothing of
  // state.dread and both the world and the emeems tint themselves from that,
  // so it must lead them - and an earlier arrangement called it inside the
  // branch AND again below, which on the frame you died ran it twice: two
  // camera lerp steps, two dread steps, and the death shake decayed before it
  // was ever drawn.
  engine.update(dt, ctx);

  if (state.phase === 'playing') {
    state.time += dt;
    state.stats.runTime = state.time;

    // Fixed-step the things that can tunnel; variable-step the cosmetics.
    acc = Math.min(acc + dt, 0.25);
    while (acc >= FIXED) {
      player.fixedUpdate(FIXED, ctx);
      monster.fixedUpdate(FIXED, ctx);
      acc -= FIXED;
      // The Protector can catch you INSIDE this loop. Stop the moment it does,
      // or the rest of the frame keeps simulating a run that is already over:
      // you could take an emeem on the frame you died, arriving after the death
      // card had been built from the old score - so the point you died for was
      // dropped from the card and from the best written to localStorage, and a
      // level-up banner could ghost across the game-over scrim.
      if (state.phase !== 'playing') break;
    }
    ctx.world.update(dt, ctx);
    emeems.update(dt, ctx);
  }

  player.update(dt, ctx);
  monster.update(dt, ctx);
  // Pickup flashes and the crush animation have to keep playing after a death,
  // or the last emeem you dived for hangs frozen mid-burst behind the game-over
  // card until you restart.
  if (state.phase !== 'playing') emeems.update(dt, ctx);
  hud.update(dt, ctx);
  ctx.audio.update(dt, ctx);

  engine.render();
}

window.addEventListener('resize', () => engine.resize());
engine.resize();
hud.showStart();
requestAnimationFrame(frame);

// Expose a tiny handle for the automated smoke test / manual debugging.
window.__EMEEM__ = { ctx, state, bus, startRun, engine, world: ctx.world, player, monster, emeems, touch, CONFIG };
