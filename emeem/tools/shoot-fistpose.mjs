/**
 * Static A/B of the hand open vs fully clenched, from three angles on a clean
 * backdrop. Purely for judging the curl itself against a reference photo.
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
const page = await browser.newPage({ viewport: { width: 620, height: 520 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const frames = await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  const canvas = document.getElementById('game-canvas');
  P.hideEmeem();
  P.ctx.world.group.visible = false;   // nothing to occlude the hand
  const out = [];

  const ANGLES = [
    { a: -150, label: 'front' },
    { a: -95,  label: 'side' },
    { a: -45,  label: 'back three-quarter' },
  ];
  const capture = (state, aimY = 0.30, dist = 1.9) => {
    for (const A of ANGLES) {
      const p = s.player.pos;
      P.orbitAt(p.x, p.y + aimY, p.z - 0.10, dist, 0.72, A.a, 40);
      out.push({ img: canvas.toDataURL('image/png'), caption: `${state} - ${A.label}` });
    }
  };

  // Walking: five fingertips on the ground, nothing in range.
  P.hideEmeem(); P.setInput(0, 1); P.step(140);
  // The five-finger splay has a much wider footprint than the old three-leg
  // stance, so it needs more room in frame.
  capture('WALKING', 0.34, 2.6);

  // Reaching: an emeem in close, so the hand lifts into the pincer.
  P.setInput(0, 0); P.step(10);
  for (let i = 0; i < 90; i++) { P.showEmeem(1.3, 0.0); P.step(1, 1 / 60); }
  // Aim higher and stand further back: the body has risen out of the walking
  // frame, which is the entire point of the pose.
  capture('REACHING - lifted', 0.62, 2.4);
  return out;
});

const strip = await browser.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 2 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:15px; margin:14px 16px 4px; color:#fff; }
    p { margin:0 16px 12px; font-weight:500; color:#93a0b3; }
    .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:0 16px 16px; }
    figure { margin:0; } img { width:100%; display:block; border-radius:7px; background:#000; }
    figcaption { padding-top:5px; font-size:12px; color:#8b98ab; }
  </style>
  <h1>Emeem &mdash; walking vs reaching</h1>
  <p>Walking on all five fingertips; lifting up into the pincer when an emeem is in range. Same three angles for each.</p>
  <div class="grid">
    ${frames.map(f => `<figure><img src="${f.img}"><figcaption>${f.caption}</figcaption></figure>`).join('')}
  </div>
`, { waitUntil: 'load' });
await strip.waitForTimeout(600);
await strip.screenshot({ path: `${OUT}/15-fist-ab.png`, fullPage: true });
console.log(`  -> ${OUT}/15-fist-ab.png  (${frames.length} frames)`);
if (errs.length) { console.log('ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
