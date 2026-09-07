/**
 * Close-up of the Protector's face at calm and full anger, so the emeem eyes
 * can be judged at a size where they are actually legible. The contact-sheet
 * comparison renders them about 30px across, which is not enough to review.
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
const page = await browser.newPage({ viewport: { width: 900, height: 480 }, deviceScaleFactor: 2 });
const errs = [];
page.on('pageerror', e => errs.push(e.message));

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });

const shots = await page.evaluate(() => {
  const M = window.__MONSTER__;
  M.mount('final');
  const c = document.getElementById('game-canvas');
  const out = [];
  for (const st of [{ a: 0, l: 'calm' }, { a: 0.55, l: 'angry' }, { a: 1, l: 'furious' }]) {
    M.setAnger(st.a); M.setMouth(0);
    M.step(45, 1 / 60, { anger: st.a, proximity: st.a, speed: 4.6 });
    // The chest swells forward as it rages, so a fixed close-up camera ends up
    // INSIDE the body at full anger. Back off in proportion to the swell.
    M.camera.position.set(0, 2.95, -1.55 - 1.25 * st.a);
    M.camera.lookAt(0, 2.92, 0);
    M.camera.fov = 34; M.camera.updateProjectionMatrix();
    M.render();
    out.push({ img: c.toDataURL('image/png'), label: st.l });
  }
  return out;
});

const strip = await browser.newPage({ viewport: { width: 1600, height: 420 }, deviceScaleFactor: 1.5 });
await strip.setContent(`<style>
  body{margin:0;background:#12151a;font:600 13px system-ui,sans-serif;color:#cfd6e0}
  h1{font-size:15px;margin:12px 14px 8px;color:#fff}
  .g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 14px 14px}
  figure{margin:0}img{width:100%;display:block;border-radius:6px}
  figcaption{padding-top:4px;color:#8b98ab}</style>
  <h1>Emeem &mdash; the Protector's emeem eyes, close up</h1>
  <div class="g">${shots.map(s => `<figure><img src="${s.img}"><figcaption>${s.label}</figcaption></figure>`).join('')}</div>`,
  { waitUntil: 'load' });
await strip.waitForTimeout(500);
await strip.screenshot({ path: `${OUT}/face-closeup.png`, fullPage: true });
console.log(`  -> ${OUT}/face-closeup.png`);
if (errs.length) { console.log('PAGE ERRORS:'); errs.slice(0, 5).forEach(e => console.log('  ' + e)); }
await browser.close();
