/**
 * The only view that matters: the real chase camera. Captures a walk cycle and
 * a full grab from the exact framing the player sees, so foot contact and the
 * pinch pose can be judged where they are actually judged.
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
// Phone landscape, so the framing is exactly the S25 Ultra's.
const page = await browser.newPage({ viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const shots = await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  const canvas = document.getElementById('game-canvas');
  P.releaseCamera();               // the real chase camera, no override
  P.hideEmeem();
  const out = [];

  // Crop to the lower-middle of the frame where the character actually is, so
  // the fingertips are big enough to judge without leaving the game framing.
  const grab = (caption) => out.push({ img: canvas.toDataURL('image/png'), caption });

  P.setInput(0, 1); P.step(160);
  for (let i = 0; i < 3; i++) { P.step(7); grab('walking, stride ' + (i + 1)); }

  // Catch a REAL emeem: run until one comes into reach, photographing the pose
  // at the moment the reach crosses each threshold, then the frame after the
  // pickup actually fires. Nothing is staged - this is the shipping code path.
  P.hideEmeem();
  const want = [
    { at: 0.25, caption: 'real emeem in range - claw opens' },
    { at: 0.60, caption: 'closing in - body dips toward it' },
    { at: 0.93, caption: 'pincer down over the emeem' },
  ];
  let wi = 0;
  const startScore = s.score;
  for (let i = 0; i < 900 && (wi < want.length || s.score === startScore); i++) {
    P.setInput(0, 1);
    P.step(1, 1 / 60);
    if (wi < want.length && s.player.reach >= want[wi].at) { grab(want[wi].caption); wi++; }
    if (s.score > startScore) { P.step(2); grab('GRABBED - claw shut, +1'); break; }
  }
  return out;
});

const strip = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 2 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:15px; margin:14px 16px 4px; color:#fff; }
    p { margin:0 16px 12px; font-weight:500; color:#93a0b3; }
    .grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; padding:0 16px 16px; }
    figure { margin:0; overflow:hidden; border-radius:7px; background:#000; }
    /* Zoom on the character: the game frame is wide, the hand is small in it. */
    .crop { width:100%; aspect-ratio:13/6; overflow:hidden; position:relative; }
    .crop img { position:absolute; width:220%; left:-60%; top:-108%; display:block; }
    figcaption { padding:5px 8px 7px; font-size:12px; color:#8b98ab; }
  </style>
  <h1>Emeem &mdash; walk and grab, seen through the real chase camera</h1>
  <p>Exact in-game framing on a phone-landscape viewport, zoomed on the character.</p>
  <div class="grid">
    ${shots.map(f => `<figure><div class="crop"><img src="${f.img}"></div><figcaption>${f.caption}</figcaption></figure>`).join('')}
  </div>
`, { waitUntil: 'load' });
await strip.waitForTimeout(700);
await strip.screenshot({ path: `${OUT}/13-gamecam.png`, fullPage: true });
console.log(`  -> ${OUT}/13-gamecam.png  (${shots.length} frames)`);
if (errs.length) { console.log('ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
