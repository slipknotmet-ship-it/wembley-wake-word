/**
 * Feature tests for the forest and the three collectible kinds.
 *
 * Separate from the smoke suite because these assert GAME RULES rather than
 * "does it boot": that a runner actually runs, that an amaam actually costs
 * you, that the score cannot go negative, that the hand never reaches for a
 * hazard, and that the forest's colliders match what the forest looks like.
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
const note = (l, d) => console.log(`  INFO  ${l} -- ${d}`);

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|404/i.test(m.text())) errors.push(m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 30000 });

// Pin the Protector's entrance side. It is a coin flip in the real game, and
// the scripted bot below walks a FIXED path - so whether that path runs toward
// the creature or away from it decides the result. Unpinned, the same check
// passed at 18.8m and failed at 6.2m on consecutive runs of identical code.
// The game keeps its coin; the suite does not get to be flaky.
await page.evaluate(() => { window.__EMEEM__.CONFIG.monster.spawnSide = -1; });
const play = page.locator('button', { hasText: /play/i }).first();
if (await play.count()) await play.click({ timeout: 5000 }).catch(() => {});
await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 10000 });
await page.waitForFunction(() => window.__EMEEM__.state.player.grounded === true, null, { timeout: 30000 });

console.log('\n== the three kinds ==');
const kinds = await page.evaluate(() => new Promise((res) => {
  const g = window.__EMEEM__;
  const seen = new Set();
  let n = 0;
  const tick = () => {
    g.emeems.group.traverse((o) => {
      const k = o.userData && o.userData.kind;
      if (k && o.visible) seen.add(k);
    });
    g.state.input.z = 1;
    if (++n < 300 && seen.size < 4) requestAnimationFrame(tick);
    else res({ kinds: [...seen], frames: n });
  };
  requestAnimationFrame(tick);
}));
note('kinds observed', kinds.kinds.length ? kinds.kinds.join(', ') : '(none tagged with userData.kind)');
// FOUR kinds now: the golden emeem joined emeem/runner/amaam. Asserting the
// exact set rather than a count, because a count passes when a kind is missing
// and a different one has been added twice, which is precisely the mistake that
// would hide a kind failing to spawn at all.
const WANT_KINDS = ['emeem', 'runner', 'amaam', 'golden'];
const missing = WANT_KINDS.filter((k) => !kinds.kinds.includes(k));
ok('all four kinds spawn', missing.length === 0,
  missing.length ? `missing: ${missing.join(', ')}` : kinds.kinds.join(', '));

console.log('\n== scoring rules ==');
const rules = await page.evaluate(() => {
  const g = window.__EMEEM__, s = g.state, out = {};
  s.score = 10;
  g.ctx.addScore(1);  out.emeem = s.score;
  g.ctx.addScore(3);  out.runner = s.score;
  g.ctx.addScore(-2); out.amaam = s.score;
  s.score = 1;
  g.ctx.addScore(-2); out.clamped = s.score;
  return out;
});
ok('an emeem is worth +1', rules.emeem === 11, `10 -> ${rules.emeem}`);
ok('a runner is worth +3', rules.runner === 14, `11 -> ${rules.runner}`);
ok('an amaam costs 2', rules.amaam === 12, `14 -> ${rules.amaam}`);
ok('score cannot go negative', rules.clamped === 0, `1 - 2 -> ${rules.clamped}`);

console.log('\n== runners move ==');
const ran = await page.evaluate(() => new Promise((res) => {
  const g = window.__EMEEM__;
  const runners = [];
  g.emeems.group.traverse((o) => {
    if (o.userData && o.userData.kind === 'runner' && o.visible) runners.push(o);
  });
  if (!runners.length) return res({ found: 0 });
  const r = runners[0];
  const from = r.position.clone();
  let n = 0;
  const tick = () => (++n < 120 ? requestAnimationFrame(tick)
    : res({ found: runners.length, moved: +r.position.distanceTo(from).toFixed(2) }));
  requestAnimationFrame(tick);
}));
if (ran.found) {
  ok('a runner changes position over time', ran.moved > 0.15, `${ran.moved}m over 120 frames`);
  note('runners on the field', ran.found);
} else {
  ok('at least one runner exists to test', false, 'none found');
}

console.log('\n== the hand does not reach for hazards ==');
const target = await page.evaluate(() => new Promise((res) => {
  const g = window.__EMEEM__, s = g.state;
  let sawAmaam = false, samples = 0, n = 0;
  const tick = () => {
    if (s.player.hasNearestEmeem) {
      samples++;
      g.emeems.group.traverse((o) => {
        if (o.visible && o.userData && o.userData.kind === 'amaam'
            && o.position.distanceTo(s.player.nearestEmeem) < 0.06) sawAmaam = true;
      });
    }
    s.input.z = 1;
    if (++n < 300) requestAnimationFrame(tick);
    else res({ sawAmaam, samples });
  };
  requestAnimationFrame(tick);
}));
ok('the reach target is never an amaam', !target.sawAmaam, `${target.samples} samples`);

console.log('\n== forest colliders ==');
const forest = await page.evaluate(() => {
  const cs = window.__EMEEM__.world.colliders;
  let tallest = 0, widest = 0, hoppable = 0, sane = true;
  for (const c of cs) {
    const w = Math.max(c.max.x - c.min.x, c.max.z - c.min.z);
    const h = c.max.y - c.min.y;
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) sane = false;
    if (h > tallest) tallest = h;
    if (w > widest) widest = w;
    if (h <= 1.6) hoppable++;
  }
  return { count: cs.length, tallest: +tallest.toFixed(2), widest: +widest.toFixed(2), hoppable, sane };
});
ok('colliders exist and are well formed', forest.count > 20 && forest.sane, `${forest.count} colliders`);
ok('no canopy-sized walls between trees', forest.widest < 6.5, `widest ${forest.widest}m`);
ok('some props are low enough to jump onto', forest.hoppable > 0, `${forest.hoppable} under 1.6m`);
note('tallest collider', `${forest.tallest}m`);

ok('no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));

console.log('');
if (fails.length) {
  console.log(`${fails.length} FEATURE CHECK(S) FAILED:`);
  fails.forEach((f) => console.log('  - ' + f));
  await browser.close();
  process.exit(1);
}
console.log('All feature checks passed.\n');
await browser.close();
