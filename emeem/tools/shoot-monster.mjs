/**
 * Photographs every candidate monster rig at matched anger levels and camera
 * framing, so they can be judged against each other rather than one at a time.
 */
import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const _i = process.argv.indexOf('--url');
const URL = (_i >= 0 && process.argv[_i + 1]) || 'http://127.0.0.1:5173/preview-monster.html';
const OUT = resolve('shots/monster');
mkdirSync(OUT, { recursive: true });

const PINNED = '/opt/pw-browsers/chromium';
const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 560, height: 620 }, deviceScaleFactor: 1.6 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));
page.on('console', m => { if (m.type() === 'error' && !/favicon/i.test(m.text())) errs.push(m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });

const available = await page.evaluate(() => window.__MONSTER__.available);
console.log('candidates built:', available.length ? available.join(', ') : '(none)');
if (!available.length) { await browser.close(); process.exit(1); }

// Matched anger levels across every candidate: calm, mid, furious, and roaring.
const STATES = [
  { anger: 0.0, mouth: 0.0, label: 'calm' },
  { anger: 0.5, mouth: 0.0, label: 'angry' },
  { anger: 1.0, mouth: 0.0, label: 'furious' },
  { anger: 1.0, mouth: 1.0, label: 'roaring' },
];

const rows = [];
for (const key of available) {
  const shots = [];
  await page.evaluate((k) => window.__MONSTER__.mount(k), key);
  for (const st of STATES) {
    const img = await page.evaluate(({ anger, mouth }) => {
      const M = window.__MONSTER__;
      M.frameIt(0, 1.55);
      M.setAnger(anger); M.setMouth(mouth);
      M.step(45, 1 / 60, { anger, proximity: anger, speed: 4.6 + 4 * anger });
      M.render();
      return document.getElementById('game-canvas').toDataURL('image/png');
    }, st);
    shots.push({ img, label: st.label });
  }
  rows.push({ key, shots });
  console.log(`  candidate ${key}: ${shots.length} states`);
}

const strip = await browser.newPage({ viewport: { width: 1420, height: 1500 }, deviceScaleFactor: 1.5 });
await strip.setContent(`
  <style>
    body { margin:0; background:#12151a; font:600 13px system-ui,sans-serif; color:#cfd6e0; }
    h1 { font-size:16px; margin:14px 16px 4px; color:#fff; }
    p { margin:0 16px 14px; font-weight:500; color:#93a0b3; }
    h2 { font-size:14px; margin:10px 16px 6px; color:#e8eef6; }
    .row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:0 16px 14px; }
    figure { margin:0; } img { width:100%; display:block; border-radius:7px; background:#000; }
    figcaption { padding-top:5px; font-size:12px; color:#8b98ab; }
  </style>
  <h1>Emeem &mdash; the Protector, three candidate rigs</h1>
  <p>Matched anger levels and identical camera framing for every candidate.</p>
  ${rows.map(r => `
    <h2>Candidate ${r.key.toUpperCase()}</h2>
    <div class="row">
      ${r.shots.map(s => `<figure><img src="${s.img}"><figcaption>${s.label}</figcaption></figure>`).join('')}
    </div>`).join('')}
`, { waitUntil: 'load' });
await strip.waitForTimeout(800);
await strip.screenshot({ path: `${OUT}/candidates.png`, fullPage: true });
console.log(`  -> ${OUT}/candidates.png`);
if (errs.length) { console.log('\nPAGE ERRORS:'); errs.slice(0, 8).forEach(e => console.log('  ' + e)); }
await browser.close();
