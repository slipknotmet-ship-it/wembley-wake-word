/** Shows the Emeem collectible: close-up, a field of them, and a real catch. */
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
const page = await browser.newPage({ viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const errs = [];
page.on('pageerror', e => errs.push(e.message));
page.on('console', m => { if (m.type() === 'error' && !/favicon/i.test(m.text())) errs.push(m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const shot = async (n, note) => { await page.waitForTimeout(250); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(`  ${n.padEnd(26)} ${note}`); };

// Field of emeems, real chase camera - what you actually play against.
const info = await page.evaluate(() => {
  const P = window.__PREVIEW__, s = P.state;
  P.hideEmeem(); P.releaseCamera(); P.setInput(0, 1); P.step(220);
  let live = 0; P.emeems.group.traverse(o => { if (o.isMesh && o.visible) live++; });
  P.say(`Emeems in the field - six tones, ~80 live across the streamed world`);
  return { live, score: s.score, nearest: s.player.nearestEmeemDist, has: s.player.hasNearestEmeem };
});
console.log(`  live meshes: ${info.live}, collected while running: ${info.score}, nearest: ${info.has ? info.nearest.toFixed(2) + 'm' : 'none'}`);
await shot('09-emeem-field', 'field of emeems, real camera');

// Close-up on an actual emeem, not on the hand.
const near = await page.evaluate(() => {
  const P = window.__PREVIEW__;
  P.setInput(0, 0); P.step(40);
  const e = P.nearestEmeemPos();
  if (!e) return null;
  // Eye level with the disc so its dome and thickness are both readable.
  // Three-quarters from above: the angle where the raised tip actually reads.
  // Eye-level catches them edge-on and the tip disappears behind the base.
  P.orbitAt(e.x, e.y, e.z, 1.25, 0.78, -35, 40);
  P.say('Emeem close-up - a flattened circular base with a raised darker tip');
  return { x: +e.x.toFixed(2), y: +e.y.toFixed(2), z: +e.z.toFixed(2) };
});
console.log('  nearest emeem at', near ? JSON.stringify(near) : 'none in range');
await shot('10-emeem-closeup', 'single emeem, close');
if (errs.length) { console.log('\nERRORS:'); errs.slice(0, 6).forEach(e => console.log('  ' + e)); }
else console.log('\nno page errors');
await browser.close();
