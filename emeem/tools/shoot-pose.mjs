/**
 * Side-on comparison of the hand's two carriages: running (fingers as legs) and
 * reaching (pincer down). Shot flat from the side against a clean backdrop so
 * the silhouette can be compared against a reference photo.
 */
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
const page = await browser.newPage({ viewport: { width: 820, height: 560 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const frames = await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  const canvas = document.getElementById('game-canvas');
  P.ctx.world.group.visible = false;   // clean backdrop for silhouette reading
  const out = [];
  const grab = (caption, angle) => {
    const p = s.player.pos;
    P.orbitAt(p.x, p.y + 0.34, p.z, 2.7, 0.30, angle, 34);
    out.push({ img: canvas.toDataURL('image/png'), caption });
  };

  // Running carriage.
  P.hideEmeem(); P.setInput(0, 1); P.step(140);
  grab('RUNNING - side', 92);
  grab('RUNNING - three-quarter', 46);

  // Reaching carriage: emeem in close, claw open and down.
  P.setInput(0, 0); P.step(20);
  P.showEmeem(1.0, 0.0); P.step(40);
  grab('REACHING - side', 92);
  grab('REACHING - three-quarter', 46);

  // Closed on the catch.
  P.ctx.bus.emit('collect', { position: s.player.nearestEmeem, color: 0, score: 1 });
  P.step(3);
  grab('PINCH SHUT - side', 92);
  grab('PINCH SHUT - three-quarter', 46);
  return out;
});

const strip = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:15px; margin:14px 16px 4px; color:#fff; }
    p { margin:0 16px 12px; font-weight:500; color:#93a0b3; }
    .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:0 16px 16px; }
    figure { margin:0; } img { width:100%; display:block; border-radius:7px; background:#000; }
    figcaption { padding-top:5px; font-size:12px; color:#8b98ab; }
  </style>
  <h1>Emeem &mdash; the two carriages</h1>
  <p>Running: fingers as legs. Reaching: body pitches nose-down, thumb and index drop into a pincer.</p>
  <div class="grid">
    ${frames.map(f => `<figure><img src="${f.img}"><figcaption>${f.caption}</figcaption></figure>`).join('')}
  </div>
`, { waitUntil: 'load' });
await strip.waitForTimeout(600);
await strip.screenshot({ path: `${OUT}/12-poses.png`, fullPage: true });
console.log(`  -> ${OUT}/12-poses.png  (${frames.length} frames)`);
if (errs.length) { console.log('ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
