/**
 * EMEEM - measures p, the obstacleSlowdown duty cycle, per threat tier.
 *
 * WHY THIS EXISTS. The Protector is braked to CONFIG.monster.obstacleSlowdown
 * (0.55) on any fixed step where its probe finds geometry close ahead. Open
 * water has NO colliders, so in a lake it runs a straight line at its full
 * target speed while on land it pays that tax with probability p.
 *
 * That sets a hard CEILING on any water "slow" multiplier:
 *
 *     mu <= 1 - (1 - obstacleSlowdown) * p  =  1 - 0.45p
 *
 * Above that, a nominally slower swimmer is actually FASTER in the water than
 * out of it, and the lake becomes a place you must never enter - the exact
 * inverse of the feature. p cannot be guessed: it depends on obstacle density,
 * which triples across the tier ladder.
 *
 * Usage: node tools/scrape.mjs [--url http://127.0.0.1:4199/]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:4199/';
const PINNED = '/opt/pw-browsers/chromium';
const TIERS = [0, 5, 12, 22, 35, 50, 70, 95];

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 40000 });
const play = page.locator('button', { hasText: /play/i }).first();
if (await play.count()) await play.click({ timeout: 5000 }).catch(() => {});
await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 20000 });

console.log('\nobstacleSlowdown duty cycle, by tier');
console.log('  (mu_max is the largest swim multiplier that still leaves the');
console.log('   creature genuinely slower in water than on land)\n');
console.log('  tier          p     mu_max   colliders');

const rows = [];
for (const score of TIERS) {
  // Drive the player so the creature is actually chasing through the world,
  // not standing still in an empty clearing - a stationary chase measures
  // nothing about how often it hits things.
  await page.evaluate((sc) => {
    const g = window.__EMEEM__;
    if (g.state.phase !== 'playing') g.startRun();
    g.state.score = 0;
    g.ctx.addScore(sc);
    g.state.monster.slowT = 0;
    g.monster.scrapeStats(true);          // reset the counters
    window.__T0__ = g.state.time;
  }, score);
  // A wandering player, so the creature crosses varied ground rather than
  // tracking one straight corridor.
  const drive = setInterval(() => {
    page.evaluate(() => {
      const s = window.__EMEEM__.state;
      if (s.phase !== 'playing') { window.__EMEEM__.startRun(); return; }
      const t = s.time;
      s.input.z = Math.sin(t * 0.7) > -0.3 ? 1 : 0;
      s.input.x = Math.sin(t * 0.31) > 0.2 ? 1 : (Math.sin(t * 0.31) < -0.2 ? -1 : 0);
    }).catch(() => {});
  }, 120);
  await page.waitForFunction(() => window.__EMEEM__.state.time - window.__T0__ > 12,
    null, { timeout: 300000, polling: 100 }).catch(() => {});
  clearInterval(drive);
  const r = await page.evaluate(() => {
    const g = window.__EMEEM__;
    const st = g.monster.scrapeStats(false);
    return { ...st, name: g.state.level.name, colliders: g.world.colliders.length };
  });
  const muMax = 1 - 0.45 * r.p;
  rows.push({ ...r, muMax });
  console.log(`  ${r.name.padEnd(10)} ${r.p.toFixed(4)}   ${muMax.toFixed(4)}   ${r.colliders}`);
  await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.x = 0; i.z = 0; });
}
await browser.close();

const worst = rows.reduce((a, b) => (b.muMax < a.muMax ? b : a));
console.log(`\n  tightest ceiling: mu <= ${worst.muMax.toFixed(4)} at ${worst.name} (p = ${worst.p.toFixed(4)})`);
console.log(`  a swim multiplier above that makes the creature FASTER in water than on land.`);
