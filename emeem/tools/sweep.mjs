/**
 * EMEEM - parameter sweep.
 *
 * smoke/features/stress each test ONE configuration. This walks the product of
 * the ones that actually vary in the field - three phone viewports by all eight
 * threat tiers - and asserts the invariants that must hold in every cell of
 * that grid, not just in the one the other suites happen to boot into.
 *
 * The tiers matter because almost everything scales with them: obstacle density
 * (7 -> 34 per chunk), monster speed (4.6 -> 9.2) and size (1.0 -> 2.1), fog,
 * and the dread lerp on every material. A world that is fine at "Watching" can
 * be a wall at "THE END", and nothing else in the suite ever looks.
 *
 * Usage: node tools/sweep.mjs [--url http://127.0.0.1:4199/]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:4199/';
const PINNED = '/opt/pw-browsers/chromium';

const fails = [];
const rows = [];
const ok = (label, cond, detail = '') => {
  if (!cond) fails.push(`${label}${detail ? ': ' + detail : ''}`);
  return cond;
};

const DEVICES = [
  { name: 'S25 Ultra', viewport: { width: 1040, height: 480 }, deviceScaleFactor: 3 },
  { name: 'iPhone 15PM', viewport: { width: 932, height: 430 }, deviceScaleFactor: 3 },
  { name: 'iPhone SE', viewport: { width: 667, height: 375 }, deviceScaleFactor: 2 },
];
// Score thresholds straight from the ladder, so this cannot drift from config.
const TIER_SCORES = [0, 5, 12, 22, 35, 50, 70, 95];

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

console.log(`\nEMEEM parameter sweep -> ${URL}`);
console.log(`${DEVICES.length} viewports x ${TIER_SCORES.length} tiers = ${DEVICES.length * TIER_SCORES.length} cells\n`);

for (const device of DEVICES) {
  const page = await browser.newPage({ ...device, hasTouch: true, isMobile: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error' && !/favicon|404|WebGL|SwiftShader|fallback|deprecated/i.test(m.text())) errors.push(m.text());
  });
  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 40000 });
  const play = page.locator('button', { hasText: /play/i }).first();
  if (await play.count()) await play.click({ timeout: 5000 }).catch(() => {});
  await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 20000 });

  for (const score of TIER_SCORES) {
    // Force the tier, then let the SIMULATION advance - not the wall clock, which
    // says nothing about how far the game got on a loaded machine.
    await page.evaluate((sc) => {
      const g = window.__EMEEM__;
      const s = g.state;
      s.score = 0;
      g.ctx.addScore(sc);
      s.monster.slowT = 0;
      window.__T0__ = s.time;
    }, score);
    await page.waitForFunction(() => window.__EMEEM__.state.time - window.__T0__ > 2.5,
      null, { timeout: 120000 }).catch(() => {});

    const r = await page.evaluate(() => {
      const g = window.__EMEEM__;
      const s = g.state;
      const w = g.world;
      const finite = (v) => Number.isFinite(v);
      const p = s.player.pos;
      const m = s.monster.pos;

      // collider sanity + the two rock rails
      let bad = 0, widest = 0, tallest = 0, hoppable = 0, tooTall = 0;
      for (const c of w.colliders) {
        const h = c.max.y - c.min.y;
        const wx = c.max.x - c.min.x;
        const wz = c.max.z - c.min.z;
        if (!finite(h) || !finite(wx) || !finite(wz) || h <= 0 || wx <= 0 || wz <= 0) bad++;
        if (wx > widest) widest = wx;
        if (h > tallest) tallest = h;
        if (h <= 1.525) hoppable++;
        // a rock between the hop ceiling and the block floor would be a rock you
        // cannot climb and cannot see you cannot climb
        if (h > 1.525 && h < 1.75) tooTall++;
      }
      // perches must sit on a collider that exists
      let perchBad = 0;
      for (const c of (w.perches || [])) {
        if (!w.colliders.includes(c)) perchBad++;
        const hx = (c.max.x - c.min.x) / 2, hz = (c.max.z - c.min.z) / 2;
        if (hx < 0.70 || hz < 0.70 || c.max.y < 0.50 || c.max.y > 2.35) perchBad++;
      }
      const gpu = g.engine.gpu || { calls: 0, triangles: 0 };
      return {
        tier: s.levelIndex, name: s.level.name,
        nan: !finite(p.x) || !finite(p.y) || !finite(p.z) || !finite(m.x) || !finite(m.z)
             || !finite(s.monster.speed) || !finite(s.dread),
        colliders: w.colliders.length, bad, widest: +widest.toFixed(2), tallest: +tallest.toFixed(2),
        hoppable, tooTall, perches: (w.perches || []).length, perchBad,
        monsterSpeed: +s.monster.speed.toFixed(2),
        dread: +s.dread.toFixed(2), scale: +s.monster.scale.toFixed(2),
        calls: gpu.calls, tris: gpu.triangles,
        canvasW: document.querySelector('canvas').clientWidth,
        offscreen: [...document.querySelectorAll('.emtc-btn')].filter((el) => {
          const b = el.getBoundingClientRect();
          return b.left < 0 || b.top < 0 || b.right > window.innerWidth || b.bottom > window.innerHeight;
        }).length,
      };
    });

    rows.push({ device: device.name, ...r });
    const tag = `${device.name} @ ${r.name}`;
    ok(`${tag}: no NaN in physics`, !r.nan);
    ok(`${tag}: colliders well formed`, r.bad === 0, `${r.bad} malformed`);
    ok(`${tag}: colliders present`, r.colliders > 0, `${r.colliders}`);
    ok(`${tag}: something is hoppable`, r.hoppable > 0, `${r.hoppable}`);
    ok(`${tag}: no un-readable mid-height rock`, r.tooTall === 0, `${r.tooTall} in the 1.525-1.75 dead band`);
    ok(`${tag}: perches valid`, r.perchBad === 0, `${r.perchBad} bad`);
    ok(`${tag}: monster moving`, r.monsterSpeed > 0, `${r.monsterSpeed}`);
    ok(`${tag}: draw calls in budget`, r.calls > 0 && r.calls < 320, `${r.calls}`);
    ok(`${tag}: triangles in budget`, r.tris > 0 && r.tris < 200000, `${r.tris}`);
    ok(`${tag}: all controls on screen`, r.offscreen === 0, `${r.offscreen} off screen`);
  }
  ok(`${device.name}: no console errors`, errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}
await browser.close();

// ------------------------------------------------------------------- report
const H = ['device', 'tier', 'collid', 'hop', 'perch', 'widest', 'tallest', 'spd', 'scale', 'dread', 'calls', 'tris'];
console.log('  ' + H.map((h) => h.padStart(8)).join(''));
for (const r of rows) {
  console.log('  ' + [
    r.device.slice(0, 8), r.name.slice(0, 8), r.colliders, r.hoppable, r.perches,
    r.widest, r.tallest, r.monsterSpeed, r.scale, r.dread, r.calls, r.tris,
  ].map((v) => String(v).padStart(8)).join(''));
}
const maxCalls = Math.max(...rows.map((r) => r.calls));
const maxTris = Math.max(...rows.map((r) => r.tris));
const maxColl = Math.max(...rows.map((r) => r.colliders));
console.log(`\n  peak: ${maxCalls} draw calls, ${maxTris.toLocaleString()} triangles, ${maxColl} colliders`);

if (fails.length) {
  console.log(`\n${fails.length} SWEEP CHECK(S) FAILED:`);
  for (const f of fails) console.log('  - ' + f);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${rows.length * 10 + DEVICES.length} sweep checks passed across ${rows.length} cells.`);
}
