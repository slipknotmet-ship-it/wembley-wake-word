/** Photographs one emeem of every available tone, straight from the live pool. */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const _i = process.argv.indexOf('--url');
const URL = (_i >= 0 && process.argv[_i + 1]) || 'http://127.0.0.1:5173/preview-char.html';
const OUT = resolve('shots/char');
mkdirSync(OUT, { recursive: true });

const PINNED = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1240, height: 460 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const n = await page.evaluate(() => {
  const P = window.__PREVIEW__;
  P.setInput(0, 1); P.step(200);   // let the field fill so every tone is in play
  P.setInput(0, 0); P.step(20);
  const count = P.toneBoard();
  P.say(`All ${count} emeem tones, one of each, straight from the live pool`);
  return count;
});
console.log(`tones on the board: ${n}`);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/11-emeem-tones.png` });
console.log(`  -> ${OUT}/11-emeem-tones.png`);
if (errs.length) { console.log('ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
