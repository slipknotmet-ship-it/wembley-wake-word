/**
 * Records the pinch as an animation rather than stills.
 *
 * One screenshot per simulation step (1/60s of game time), played back at 20fps
 * for a ~3x slow-motion read of a beat that lasts about a third of a second.
 * The camera follows the hand at a fixed offset so the pose, not the travel,
 * is what moves in frame.
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import gifenc from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = gifenc;  // CJS module

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:5173/preview-char.html';
const OUT = resolve('shots/anim');
const TMP = resolve('shots/anim/_frames');
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const PINNED = '/opt/pw-browsers/chromium';

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 1 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

// Run until an emeem is genuinely closing, so the recording starts just before
// the claw begins to open rather than in the middle of nothing.
await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  P.hideEmeem(); P.setInput(0, 1);
  for (let i = 0; i < 3000; i++) {
    P.step(1, 1 / 60);
    if (s.player.reach > 0.12) break;
  }
});

// Capture a long run, then keep only a window centred on the catch: the beat is
// short and the interesting part is easy to record past.
const TOTAL = 220;
const LEAD = 30;    // frames kept before the catch
const TAIL = 55;    // frames kept after it
let caughtAt = -1;
for (let i = 0; i < TOTAL; i++) {
  const st = await page.evaluate(() => {
    const P = window.__PREVIEW__, s = P.state;
    const before = s.score;
    P.setInput(0, 1);
    P.step(1, 1 / 60);
    // Follow cam placed AHEAD of the hand (it travels toward -Z), so the
    // pincer and the emeem coming into it both face the lens. From behind, the
    // palm eclipses the whole mechanism.
    const p = s.player.pos;
    P.orbitAt(p.x, p.y + 0.26, p.z - 0.60, 2.5, 1.05, -148, 42);
    return { caught: s.score > before, reach: +s.player.reach.toFixed(2), pinch: +s.player.pinch.toFixed(2) };
  });
  if (st.caught && caughtAt < 0) caughtAt = i;
  await page.screenshot({ path: `${TMP}/f${String(i).padStart(3, '0')}.png` });
  if (caughtAt >= 0 && i >= caughtAt + TAIL) break;
}
console.log(`catch fired on frame ${caughtAt}`);
if (errs.length) { console.log('ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();

// Encoded in pure JS: the bundled ffmpeg is Playwright's stripped build, which
// has no PNG decoder, no GIF muxer and no x264 - only WebM/VP8.
let files = readdirSync(TMP).filter(f => f.endsWith('.png')).sort();
if (caughtAt >= 0) {
  const from = Math.max(0, caughtAt - LEAD);
  files = files.slice(from, caughtAt + TAIL + 1);
  console.log(`keeping frames ${from}..${caughtAt + TAIL} (catch at index ${caughtAt - from} of the clip)`);
}
const first = PNG.sync.read(readFileSync(`${TMP}/${files[0]}`));
const { width, height } = first;

// One palette built from a frame mid-catch and reused for every frame: a
// per-frame palette makes the skin tone crawl between frames.
const key = PNG.sync.read(readFileSync(`${TMP}/${files[Math.floor(files.length * 0.6)]}`));
const palette = quantize(key.data, 255, { format: 'rgba4444' });

const enc = GIFEncoder();
for (const f of files) {
  const png = f === files[0] ? first : PNG.sync.read(readFileSync(`${TMP}/${f}`));
  enc.writeFrame(applyPalette(png.data, palette, 'rgba4444'), width, height, {
    palette, delay: 50, // 20fps => ~3x slow motion on a 60fps simulation
  });
}
enc.finish();
const gif = `${OUT}/pinch.gif`;
writeFileSync(gif, Buffer.from(enc.bytes()));
rmSync(TMP, { recursive: true, force: true });
console.log(`  -> ${gif}  ${(Buffer.from(enc.bytes()).length / 1024 / 1024).toFixed(2)} MB, ${files.length} frames, ${width}x${height}`);
