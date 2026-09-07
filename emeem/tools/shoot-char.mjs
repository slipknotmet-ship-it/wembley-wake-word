/**
 * Screenshots the hand character: a close-up so the thumb/index catching claw
 * is readable, plus the actual in-game chase-camera framing.
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
const page = await browser.newPage({
  viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true,
});
const errs = [];
page.on('pageerror', e => errs.push(e.stack || e.message));
page.on('console', m => { if (m.type() === 'error' && !/favicon/i.test(m.text())) errs.push(m.text()); });

await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
await page.waitForFunction(() => window.__READY__ === true, null, { timeout: 30000 });
await page.evaluate(() => { window.__AUTOPLAY__ = false; });

const shot = async (name, note) => {
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`  ${name.padEnd(28)} ${note}`);
};

// 1. Close-up, standing still, claw open.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.setInput(0, 0); p.step(30);
  p.say('The hand character - thumb + index are the catching claw, the other three fingers are its legs');
  p.orbit(3.2, 1.3, 35, 42);
});
await shot('01-hand-closeup', 'claw open, standing');

// 2. Close-up mid-pinch: this is the catch animation.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.state.player.pinch = 1;         // snap the claw shut, as a catch does
  p.player.update(0.016, p.ctx); p.renderFrame();
  p.say('Pinch closed - what you see every time the hand catches an emeem');
});
await shot('02-hand-pinch', 'claw closed on a catch');

// 3. Running, seen from the side, so the three-finger gait is visible.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.state.player.pinch = 0;
  p.setInput(0, 1); p.step(120);
  p.orbit(4.2, 1.1, 95, 46);
  p.say('Running - it moves on its middle, ring and pinky fingers');
});
await shot('03-hand-running', 'side view, running gait');

// 4. Mid-air, so the jump pose is visible.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.setInput(0, 1, true); p.step(6);
  p.setInput(0, 1, false); p.step(14);
  p.orbit(4.0, 1.0, 60, 46);
  p.say('Mid-jump - legs tuck, claw splays');
});
await shot('04-hand-jump', 'airborne pose');

// 5. THE REAL FRAMING: the actual in-game chase camera, no override.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.releaseCamera();
  p.setInput(0, 1); p.step(150);
  p.say('The actual in-game camera - fixed heading, follows the player, never rotates');
});
await shot('05-gameplay-framing', 'real chase camera, tier 0');

// 6. Same framing at a high tier, to check the character still reads in the dark.
await page.evaluate(() => {
  const p = window.__PREVIEW__;
  p.setTier(5); p.setInput(0, 1); p.step(150);
  p.say('Tier 5 - Nightmare. Can you still see the hand and the obstacles?');
});
await shot('06-gameplay-tier5', 'real camera, high dread');

if (errs.length) { console.log('\nPAGE ERRORS:'); errs.slice(0, 8).forEach(e => console.log('  ' + e)); }
else console.log('\nno page errors');
await browser.close();
