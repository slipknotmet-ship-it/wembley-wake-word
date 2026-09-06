/**
 * Screenshots the world at every threat tier so the escalation can be eyeballed
 * without a phone. Boots preview.html (renderer + world only).
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const _i = process.argv.indexOf('--url');
const URL = (_i >= 0 && process.argv[_i + 1]) || 'http://127.0.0.1:5173/preview.html';
const OUT = resolve('shots/world');
mkdirSync(OUT, { recursive: true });

const PINNED = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
         '--ignore-gpu-blocklist', '--no-sandbox'],
});
// Galaxy S25 Ultra, landscape.
const page = await browser.newPage({
  viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true,
});

const errs = [];
page.on('pageerror', e => errs.push(e.stack || e.message));
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const TIERS = [0, 2, 4, 7];
for (const t of TIERS) {
  const info = await page.evaluate((i) => window.__PREVIEW__.setTier(i), t);
  await page.waitForTimeout(400);
  const name = String(info.name).toLowerCase().replace(/\s+/g, '-');
  const file = `${OUT}/tier-${t}-${name}.png`;
  await page.screenshot({ path: file });
  console.log(`tier ${t}  ${String(info.name).padEnd(10)}  ${String(info.colliders).padStart(4)} colliders  ->  ${file}`);
}

// One shot from up high, to show the streamed extent of the world.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.setTier(3);
  p.engine.camera.position.set(0, 95, 70);
  p.engine.camera.lookAt(0, 0, -10);
  p.engine.render();
});
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/overview-streamed-extent.png` });
console.log(`overview -> ${OUT}/overview-streamed-extent.png`);

if (errs.length) { console.log('\nPAGE ERRORS:'); errs.slice(0, 8).forEach(e => console.log('  ' + e)); }
await browser.close();
