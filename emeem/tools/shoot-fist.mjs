/**
 * Close-up of the grab itself: the three walking fingers clenching into a fist
 * while the thumb and index pinch the emeem. Frames are captured around a REAL
 * pickup, one simulation step apart, because the whole beat lasts about a third
 * of a second and is easy to miss.
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
const page = await browser.newPage({ viewport: { width: 760, height: 560 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const frames = await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  const canvas = document.getElementById('game-canvas');
  P.hideEmeem();
  // World stays visible: without the ground the hand reads as floating in sky.
  const out = [];

  const shot = (caption) => {
    const p = s.player.pos;
    // Above and to the front quarter, looking down: from below, the palm hides
    // both the curled knuckles and whatever is between the finger tips.
    P.orbitAt(p.x, p.y + 0.30, p.z - 0.70, 3.10, 1.30, -48, 40);
    out.push({
      img: canvas.toDataURL('image/png'),
      caption,
      reach: +s.player.reach.toFixed(2),
      pinch: +s.player.pinch.toFixed(2),
    });
  };

  // Run until an emeem is deep in reach, then capture every step through the
  // catch so the clench is not skipped over.
  // Capture the approach as well as the catch: the emeem is consumed the instant
  // the pickup fires, so the only frames that show one actually between the
  // finger tips are the ones just BEFORE it.
  P.setInput(0, 1);
  let armed = 0;
  const start = s.score;
  for (let i = 0; i < 2500; i++) {
    P.step(1, 1 / 60);
    if (s.player.reach > 0.80 && armed < 3 && i % 3 === 0) {
      armed++;
      shot(`approach - emeem in the pincer (${armed})`);
    }
    if (s.score > start) {
      for (let k = 0; k < 4; k++) {
        shot(k === 0 ? 'PINCH - fist clenches' : `fist held, +${k}`);
        P.step(1, 1 / 60);
      }
      P.step(12); shot('released, back to the walk');
      break;
    }
  }
  return out;
});

console.log(`captured ${frames.length} frames`);
frames.forEach(f => console.log(`  reach ${String(f.reach).padEnd(5)} pinch ${String(f.pinch).padEnd(5)} ${f.caption}`));

const strip = await browser.newPage({ viewport: { width: 1500, height: 1050 }, deviceScaleFactor: 2 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:15px; margin:14px 16px 4px; color:#fff; }
    p { margin:0 16px 12px; font-weight:500; color:#93a0b3; }
    .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:0 16px 16px; }
    figure { margin:0; } img { width:100%; display:block; border-radius:7px; background:#000; }
    figcaption { padding-top:5px; font-size:12px; color:#8b98ab; }
    b { color:#e8eef6; }
  </style>
  <h1>Emeem &mdash; the pinch, frame by frame</h1>
  <p>Middle, ring and pinky clench into a fist and the hand braces on its knuckles; thumb and index do the pinching.</p>
  <div class="grid">
    ${frames.map(f => `<figure><img src="${f.img}"><figcaption><b>${f.caption}</b><br>reach ${f.reach} &middot; pinch ${f.pinch}</figcaption></figure>`).join('')}
  </div>
`, { waitUntil: 'load' });
await strip.waitForTimeout(700);
await strip.screenshot({ path: `${OUT}/14-fist-pinch.png`, fullPage: true });
console.log(`  -> ${OUT}/14-fist-pinch.png`);
if (errs.length) { console.log('ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
