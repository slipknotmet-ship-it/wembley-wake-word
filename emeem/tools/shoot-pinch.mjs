/**
 * Filmstrip of the reach-and-grab: the claw opening as an emeem comes into
 * range, then snapping shut on the catch.
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
const page = await browser.newPage({ viewport: { width: 900, height: 620 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const frames = await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  const canvas = document.getElementById('game-canvas');
  const out = [];
  const grab = (caption) => {
    // A shallow front-quarter view: the angle the claw is most readable from.
    P.orbit(2.4, 0.72, -38, 40);
    out.push({ img: canvas.toDataURL('image/png'), caption,
               reach: +s.player.reach.toFixed(2), pinch: +s.player.pinch.toFixed(2) });
  };

  P.setInput(0, 1); P.hideEmeem(); P.step(70);
  grab('out of range - claw at rest');

  // Hold the player still and walk the emeem in, so the pose is comparable.
  P.setInput(0, 0); P.step(20);
  for (const d of [3.6, 2.6, 1.7, 1.15]) {
    P.showEmeem(d); P.step(14);
    grab(`emeem ${d.toFixed(1)}m out - reaching`);
  }

  P.ctx.bus.emit('collect', { position: s.player.nearestEmeem, color: 0, score: 1 });
  P.step(3);  grab('CATCH - claw slams shut');
  P.hideEmeem();
  P.step(18); grab('released, relaxing back');
  return out;
});

console.log(`captured ${frames.length} frames`);
frames.forEach(f => console.log(`  reach ${String(f.reach).padEnd(5)} pinch ${String(f.pinch).padEnd(5)} ${f.caption}`));

const strip = await browser.newPage({ viewport: { width: 1500, height: 820 }, deviceScaleFactor: 2 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:15px; margin:14px 16px 4px; color:#fff; }
    p  { margin:0 16px 12px; font-weight:500; color:#93a0b3; }
    .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:0 16px 16px; }
    figure { margin:0; } img { width:100%; display:block; border-radius:7px; background:#000; }
    figcaption { padding-top:5px; font-size:12px; color:#8b98ab; }
    b { color:#e8eef6; }
  </style>
  <h1>Emeem &mdash; the reach and grab</h1>
  <p>The claw opens as an emeem comes inside 4.2m, then snaps shut on the catch and relaxes back.</p>
  <div class="grid">
    ${frames.map(f => `<figure><img src="${f.img}"><figcaption><b>${f.caption}</b><br>reach ${f.reach} &middot; pinch ${f.pinch}</figcaption></figure>`).join('')}
  </div>
`, { waitUntil: 'load' });
await strip.waitForTimeout(600);
await strip.screenshot({ path: `${OUT}/08-reach-and-grab.png`, fullPage: true });
console.log(`  -> ${OUT}/08-reach-and-grab.png`);
if (errs.length) { console.log('\nERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
