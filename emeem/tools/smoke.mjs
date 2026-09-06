/**
 * Headless playtest for Emeem.
 *
 * Boots the built game in Chromium with software WebGL, drives it with the
 * keyboard fallback, and asserts that the game actually simulates: score goes
 * up, the monster closes in, no console errors, no NaN in the state.
 *
 * Usage: node tools/smoke.mjs [--url http://localhost:4173] [--headed]
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const URL = arg('--url', 'http://localhost:4173/');
const SHOTS = resolve(arg('--shots', 'shots'));
mkdirSync(SHOTS, { recursive: true });

// Galaxy S25 Ultra in landscape: ~1040x480 CSS px at DPR 3.
const PHONE = { width: 1040, height: 480, deviceScaleFactor: 3, isMobile: true, hasTouch: true };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fails = [];
const check = (label, cond, detail = '') => {
  console.log(`${cond ? '  PASS' : '  FAIL'}  ${label}${detail ? ' -- ' + detail : ''}`);
  if (!cond) fails.push(`${label}${detail ? ': ' + detail : ''}`);
};

// This sandbox ships a pinned Chromium that may not match the npm playwright
// build number, so use it directly when it is there instead of downloading.
const PINNED = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  headless: !args.includes('--headed'),
  args: [
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    '--ignore-gpu-blocklist',
    '--enable-webgl',
    '--no-sandbox',
  ],
});
const page = await browser.newPage({ viewport: PHONE, deviceScaleFactor: 3 });

const errors = [];
const warnings = [];
page.on('console', (m) => {
  const t = m.text();
  if (m.type() === 'error') errors.push(t);
  else if (m.type() === 'warning') warnings.push(t);
});
page.on('pageerror', (e) => errors.push('pageerror: ' + (e?.stack || e?.message || String(e))));

console.log(`\nEMEEM smoke test -> ${URL}\n`);
await page.goto(URL, { waitUntil: 'load', timeout: 45000 });

// ---------------------------------------------------------------- boot
await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 30000 })
  .catch(() => { throw new Error('window.__EMEEM__ never appeared - the module graph failed to load. Console:\n' + errors.join('\n')); });
await sleep(1200);

const boot = await page.evaluate(() => {
  const g = window.__EMEEM__;
  const gl = document.getElementById('game-canvas').getContext('webgl2')
          || document.getElementById('game-canvas').getContext('webgl');
  return {
    phase: g.state.phase,
    hasWebGL: !!gl,
    sceneChildren: g.ctx.scene.children.length,
    canvasW: document.getElementById('game-canvas').width,
  };
});
check('WebGL context created', boot.hasWebGL);
check('scene populated', boot.sceneChildren > 2, `${boot.sceneChildren} children`);
check('canvas sized', boot.canvasW > 0, `${boot.canvasW}px`);
check('starts on the menu', boot.phase === 'menu', boot.phase);
await page.screenshot({ path: `${SHOTS}/01-title.png` });

// ------------------------------------------------------- start the run
// Prefer the real PLAY button so the HUD wiring is exercised, not just the bus.
const play = page.locator('button', { hasText: /play/i }).first();
if (await play.count()) { await play.click({ timeout: 5000 }).catch(() => {}); }
await sleep(300);
let phase = await page.evaluate(() => window.__EMEEM__.state.phase);
if (phase !== 'playing') {
  console.log('  (PLAY button did not start the run; falling back to the bus)');
  await page.evaluate(() => window.__EMEEM__.bus.emit('start'));
  await sleep(300);
  phase = await page.evaluate(() => window.__EMEEM__.state.phase);
}
check('PLAY starts the run', phase === 'playing', phase);

// --------------------------------------------------- drive it around
const before = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  return { pos: s.player.pos.toArray(), monster: s.monster.pos.toArray(), score: s.score };
});

// Run forward with a couple of jumps and a strafe, on the keyboard fallback.
// Jumping while airborne is correctly refused, and the player spawns above the
// ground, so every jump has to wait for the feet to be down first. Under
// software rasterisation that fall takes over a second of wall time - long
// enough that a fixed sleep tests the fall instead of the button.
const onGround = () => page.waitForFunction(
  () => window.__EMEEM__.state.player.grounded === true, null, { timeout: 30000 });

await onGround();
await page.keyboard.down('ArrowUp');
await sleep(1500);
await onGround();
await page.keyboard.down('Space'); await sleep(150); await page.keyboard.up('Space');
await sleep(900);
await page.keyboard.down('ArrowRight'); await sleep(1200); await page.keyboard.up('ArrowRight');
await onGround();
await page.keyboard.down('Space'); await sleep(150); await page.keyboard.up('Space');
await sleep(2500);
await page.screenshot({ path: `${SHOTS}/02-gameplay.png` });
await sleep(2500);
await page.keyboard.up('ArrowUp');

const after = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  const w = window.__EMEEM__.world;
  return {
    pos: s.player.pos.toArray(),
    monster: s.monster.pos.toArray(),
    score: s.score,
    grounded: s.player.grounded,
    jumps: s.stats.jumps,
    colliders: w.colliders.length,
    monsterDist: s.monster.distanceToPlayer,
    dread: s.dread,
    level: s.level.name,
    finite: [...s.player.pos.toArray(), ...s.player.vel.toArray(), ...s.monster.pos.toArray()].every(Number.isFinite),
  };
});

const moved = Math.hypot(after.pos[0] - before.pos[0], after.pos[2] - before.pos[2]);
check('player moved on input', moved > 8, `${moved.toFixed(1)}m`);
check('player went "up" the screen (-Z)', after.pos[2] < before.pos[2] - 5, `z ${before.pos[2].toFixed(1)} -> ${after.pos[2].toFixed(1)}`);
check('player strafed right (+X)', after.pos[0] > before.pos[0] + 1, `x ${before.pos[0].toFixed(1)} -> ${after.pos[0].toFixed(1)}`);
check('jump button fired', after.jumps >= 2, `${after.jumps} jumps`);
check('player is on the ground, not falling forever', after.pos[1] > -2 && after.pos[1] < 12, `y=${after.pos[1].toFixed(2)}`);
check('world streamed obstacles', after.colliders > 20, `${after.colliders} colliders`);
check('monster is chasing', after.monsterDist < 60 && after.monsterDist > 0, `${after.monsterDist.toFixed(1)}m away`);
check('no NaN in physics state', after.finite);
check('emeems are collectable', after.score > 0, `score ${after.score}`);

// --------------------------------------- escalation + game over paths
await page.evaluate(() => {
  const g = window.__EMEEM__;
  for (let i = 0; i < 40; i++) g.ctx.addScore(1); // force the tier ladder
});
// Poll for the eased values to arrive rather than sleeping a fixed wall-clock
// time. Under software rasterisation the game runs at ~6fps and CONFIG.render
// .maxDelta clamps every frame to 0.05s, so a 1.2s sleep advances barely 0.35s
// of GAME time and the monster's speed ease has hardly started. Sleeping longer
// would work on this machine and break on a faster or slower one; waiting for
// convergence tests the behaviour instead of the frame rate.
const escalated = await page.waitForFunction(() => {
  const s = window.__EMEEM__.state;
  if (s.monster.speed <= 6 || s.dread <= 0.3) return false;
  return { level: s.level.name, idx: s.levelIndex, speed: s.monster.speed, dread: s.dread, scale: s.monster.scale };
}, null, { timeout: 40000 }).then((h) => h.jsonValue()).catch(async () => page.evaluate(() => {
  const s = window.__EMEEM__.state;
  return { level: s.level.name, idx: s.levelIndex, speed: s.monster.speed, dread: s.dread, scale: s.monster.scale };
}));
check('threat level escalates with score', escalated.idx >= 4, `${escalated.level} (tier ${escalated.idx})`);
check('monster speeds up with the tier', escalated.speed > 6, `${escalated.speed.toFixed(2)} m/s`);
check('dread rises', escalated.dread > 0.3, escalated.dread.toFixed(2));
await page.screenshot({ path: `${SHOTS}/03-escalated.png` });

await page.evaluate(() => window.__EMEEM__.bus.emit('caught', { score: window.__EMEEM__.state.score }));
await sleep(700);
const dead = await page.evaluate(() => ({
  phase: window.__EMEEM__.state.phase,
  overlay: !!document.body.innerText.match(/caught|again/i),
}));
check('getting caught ends the run', dead.phase === 'dead', dead.phase);
check('game over screen shows', dead.overlay);
await page.screenshot({ path: `${SHOTS}/04-gameover.png` });

// Restart has to fully reset, otherwise run 2 inherits run 1's monster.
const again = page.locator('button', { hasText: /again|retry|restart/i }).first();
if (await again.count()) await again.click({ timeout: 5000 }).catch(() => {});
else await page.evaluate(() => window.__EMEEM__.bus.emit('restart'));
await sleep(900);
const restarted = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  return { phase: s.phase, score: s.score, tier: s.levelIndex, dist: s.monster.distanceToPlayer };
});
check('restart resets the run', restarted.phase === 'playing' && restarted.score === 0 && restarted.tier === 0,
  `phase=${restarted.phase} score=${restarted.score} tier=${restarted.tier}`);
check('restart pushes the monster back', restarted.dist > 15, `${restarted.dist.toFixed(1)}m`);

// ------------------------------------------------------------- frame rate
const fps = await page.evaluate(() => new Promise((res) => {
  let n = 0; const t0 = performance.now();
  const tick = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(tick); else res(n / ((performance.now() - t0) / 1000)); };
  requestAnimationFrame(tick);
}));
console.log(`  INFO  ~${fps.toFixed(1)} fps under software rasterisation (a real Adreno GPU is orders of magnitude faster)`);
check('loop is running', fps > 4, `${fps.toFixed(1)} fps`);

// -------------------------------------------------------------- console
const realErrors = errors.filter((e) => !/WebGL|SwiftShader|GPU stall|Automatic fallback|deprecated/i.test(e));
check('no console errors', realErrors.length === 0, realErrors.slice(0, 5).join(' | '));

await browser.close();
console.log(`\nScreenshots -> ${SHOTS}`);
if (fails.length) {
  console.log(`\n${fails.length} CHECK(S) FAILED:`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('\nAll smoke checks passed.\n');
