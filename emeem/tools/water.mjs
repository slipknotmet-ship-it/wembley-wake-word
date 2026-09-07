/**
 * EMEEM - the lake, the boat and the swim, verified in the real game.
 *
 * Teleports the player to the near shore rather than walking 420m, which at
 * software-rendered frame rates would take ten minutes per case. Everything
 * after that is the real simulation.
 *
 * Usage: node tools/water.mjs [--url http://127.0.0.1:4199/]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:4199/';
const PINNED = '/opt/pw-browsers/chromium';
const fails = [];
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ' -- ' + detail : ''}`);
  if (!cond) fails.push(label + (detail ? ': ' + detail : ''));
};

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 40000 });
const play = page.locator('button', { hasText: /play/i }).first();
if (await play.count()) await play.click({ timeout: 5000 }).catch(() => {});
await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 20000 });

const gameWait = (sec) => page.waitForFunction((s) => window.__EMEEM__.state.time - window.__T0__ > s,
  sec, { timeout: 300000, polling: 50 }).catch(() => {});
const mark = () => page.evaluate(() => { window.__T0__ = window.__EMEEM__.state.time; });

console.log('\n== the lake ==');
const lake = await page.evaluate(() => {
  const E = window.__EMEEM__;
  const w = E.world;
  // sample a line across the first lake
  const pts = [];
  for (let z = -340; z >= -500; z -= 10) pts.push([z, +w.waterAt(0, z).toFixed(2)]);
  return { pts, dry: w.waterAt(0, -100), wet: w.waterAt(0, -420) };
});
ok('there is water where the lake is', lake.wet === 1, `waterAt(0,-420) = ${lake.wet}`);
ok('and none where there is not', lake.dry === 0, `waterAt(0,-100) = ${lake.dry}`);

// --- put the player on the near shore, next to the middle boat
await page.evaluate(() => {
  const E = window.__EMEEM__;
  E.state.player.pos.set(0, 0, -370);
  E.state.monster.pos.set(0, 0, -330);   // behind, on the shore
});
await mark(); await gameWait(1.5);

console.log('\n== no props or prizes stand in the water ==');
const clean = await page.evaluate(() => {
  const E = window.__EMEEM__, w = E.world;
  let inWater = 0;
  for (const c of w.colliders) {
    const cx = (c.min.x + c.max.x) / 2, cz = (c.min.z + c.max.z) / 2;
    if (w.waterAt(cx, cz) > 0) inWater++;
  }
  let prizesInWater = 0;
  E.ctx.scene.traverse((o) => {
    if (!o.userData || !o.userData.kind || o.isSprite) return;
    const p = o.getWorldPosition(new o.position.constructor());
    if (w.waterAt(p.x, p.z) > 0) prizesInWater++;
  });
  return { inWater, prizesInWater, colliders: w.colliders.length };
});
ok('no collider stands in the lake', clean.inWater === 0, `${clean.inWater} of ${clean.colliders}`);
ok('no emeem floats on the lake', clean.prizesInWater === 0, `${clean.prizesInWater}`);

console.log('\n== wading is slow, and the swimmer is faster than you ==');
const wade = await page.evaluate(() => {
  const E = window.__EMEEM__, s = E.state;
  s.player.pos.set(0, 0, -420);            // open water
  s.input.z = 1;
  return { wet: s.player.wet };
});
await mark(); await gameWait(2.0);
const waded = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  const v = Math.hypot(s.player.vel.x, s.player.vel.z);
  s.input.z = 0;
  return { wet: +s.player.wet.toFixed(2), speed: +v.toFixed(2), walk: window.__EMEEM__.ctx.CONFIG.player.walkSpeed };
});
ok('the player is wet in open water', waded.wet === 1, `wet = ${waded.wet}`);
ok('wading is much slower than walking', waded.speed < waded.walk * 0.55,
  `${waded.speed} m/s vs ${waded.walk} walking`);

// Put it in the lake but NOT on top of the player: at the same point it is
// inside the 1.35m catch radius, the run ends instantly, fixedUpdate stops and
// the speed freezes part-way down the ramp. The first version of this check
// read 3.70 m/s - which is not 4.6 x 0.72 = 3.31, it is a corpse caught
// mid-damp - and passed anyway. Hold them 26m apart and keep the player wet.
const swimHold = setInterval(() => {
  page.evaluate(() => {
    const s = window.__EMEEM__.state;
    if (s.phase !== 'playing') return;
    s.player.pos.set(0, 0, -408);
    s.monster.pos.set(0, 0, -434);
  }).catch(() => {});
}, 100);
await mark(); await gameWait(4.0);
clearInterval(swimHold);
const swam = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  const w = window.__EMEEM__.world;
  return { speed: +s.monster.speed.toFixed(2), tier: s.level.speed, wade: 7.2 * 0.40,
           phase: s.phase, wet: +w.waterAt(s.monster.pos.x, s.monster.pos.z).toFixed(2) };
});
ok('the swim check measured a LIVE game', swam.phase === 'playing', swam.phase);
ok('the Protector was actually in the water', swam.wet === 1, `wet = ${swam.wet}`);
ok('the Protector swims slower than it runs', swam.speed < swam.tier * 0.85,
  `${swam.speed} m/s vs ${swam.tier} on land (expected ${(swam.tier * 0.72).toFixed(2)})`);
ok('but still faster than a wader', swam.speed > swam.wade,
  `${swam.speed} m/s vs ${swam.wade.toFixed(2)} wading`);

console.log('\n== the boat ==');
const boarded = await page.evaluate(() => {
  const E = window.__EMEEM__;
  const d = E.boats.debug();
  const b = d.boats[1];
  E.state.player.pos.set(b.x, 0, b.z);      // walk into the middle boat
  E.state.monster.pos.set(b.x, 0, b.z + 60);
  return { spot: b };
});
await mark(); await gameWait(0.6);
const aboard = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { riding: E.boats.riding(), hull: +(E.state.player.hull || 0).toFixed(3), boat: E.state.player.boat };
});
ok('walking into a boat boards it', aboard.riding === true, `riding = ${aboard.riding}`);
// Not === 1: boarding happens the instant you are in range, and the check
// runs 0.6s of game time later, by which point the hull has honestly drained
// 0.6 * 0.075 = 0.045. Asserting equality was asserting that no time passed.
ok('the hull starts full', aboard.hull > 0.9, `${aboard.hull}`);

// steer up-screen across the lake
await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.z = 1; i.x = 0; });
await mark(); await gameWait(4.0);
const sailing = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { hull: +(E.state.player.hull || 0).toFixed(3), z: +E.state.player.pos.z.toFixed(1),
           riding: E.boats.riding(), speed: +E.boats.debug().speed.toFixed(2) };
});
ok('the boat moves up-screen under the pad', sailing.z < -400, `z = ${sailing.z} (started -386)`);
ok('the boat is faster than wading', sailing.speed > 5, `${sailing.speed} m/s`);
ok('the hull drains while aboard', sailing.hull < 1 && sailing.hull > 0.4, `${sailing.hull} left`);

// run the hull to nothing and check it swamps
await page.evaluate(() => { window.__EMEEM__.state.player.hull = 0.05; });
await mark(); await gameWait(1.5);
const swamped = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { riding: E.boats.riding(), hull: +(E.state.player.hull || 0).toFixed(3), boat: E.state.player.boat };
});
ok('an empty hull swamps the boat', swamped.riding === false, `riding = ${swamped.riding}`);
ok('and puts you back in the water', swamped.boat === 0, `boat = ${swamped.boat}`);
await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.z = 0; i.x = 0; });

const realErrors = errors.filter((e) => !/WebGL|SwiftShader|fallback|deprecated/i.test(e));
ok('no console errors', realErrors.length === 0, realErrors.slice(0, 2).join(' | '));
await browser.close();

if (fails.length) { console.log(`\n${fails.length} WATER CHECK(S) FAILED:`); for (const f of fails) console.log('  - ' + f); process.exitCode = 1; }
else console.log('\nAll water checks passed.');
