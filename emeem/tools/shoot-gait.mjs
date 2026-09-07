/**
 * Captures one full stride of the hand's walk cycle as a filmstrip, so the
 * three-finger gait can be judged as motion rather than as a single pose.
 * Frames are grabbed straight off the WebGL canvas and composited in-page.
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
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
         '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 900, height: 620 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.stack || e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const FRAMES = 8;
const DT = 0.042; // ~1/3 second total: roughly one stride at full running speed

const frames = await page.evaluate(async ({ FRAMES, DT }) => {
  const p = window.__PREVIEW__;
  const canvas = document.getElementById('game-canvas');
  // Run up to full speed first so the gait is a run, not a standing start.
  p.setInput(0, 1);
  p.step(90);
  const out = [];
  for (let i = 0; i < FRAMES; i++) {
    p.step(1, DT);
    // Low, close, side-on: the angle that shows fingertips meeting the ground.
    p.orbit(2.5, 0.42, 90, 38);
    out.push(canvas.toDataURL('image/png'));
  }
  return out;
}, { FRAMES, DT });

console.log(`captured ${frames.length} frames of the stride`);

// Composite the strip in a throwaway page so it lands as a single image.
const strip = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:15px; margin:14px 16px 4px; color:#fff; letter-spacing:.01em; }
    p  { margin:0 16px 12px; font-weight:500; color:#93a0b3; }
    .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:0 16px 16px; }
    figure { margin:0; }
    img { width:100%; display:block; border-radius:7px; background:#000; }
    figcaption { padding-top:5px; font-size:12px; color:#8b98ab; }
  </style>
  <h1>Emeem &mdash; one stride of the hand's walk cycle</h1>
  <p>Side-on and low. Middle, ring and pinky each carry the body in turn; thumb and index stay out front as the claw.</p>
  <div class="grid">
    ${frames.map((src, i) => `<figure><img src="${src}"><figcaption>frame ${i + 1} &middot; t+${(i * DT * 1000).toFixed(0)}ms</figcaption></figure>`).join('')}
  </div>
`, { waitUntil: 'load' });
await strip.waitForTimeout(600);
await strip.screenshot({ path: `${OUT}/07-walk-cycle.png`, fullPage: true });
console.log(`  -> ${OUT}/07-walk-cycle.png`);

if (errs.length) { console.log('\nPAGE ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
