/**
 * Stress battery for Emeem. Goes well past the smoke test: real touch input on
 * the on-screen controls, phone-shaped viewports down to the smallest one
 * anybody still uses, hostile input (interrupted presses, backgrounding), long
 * runs for leaks and drift, and rapid restarts.
 *
 * Usage: node tools/stress.mjs [--url http://localhost:4173]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:4173/';
const PINNED = '/opt/pw-browsers/chromium';

const fails = [];
const warns = [];
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ' -- ' + detail : ''}`);
  if (!cond) fails.push(`${label}${detail ? ': ' + detail : ''}`);
};
const note = (label, detail) => { console.log(`  INFO  ${label} -- ${detail}`); };

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});

/** Boot a page at a given device profile and start a run. */
async function boot(device) {
  const page = await browser.newPage({ ...device, hasTouch: true, isMobile: true });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/favicon|404/i.test(m.text())) errors.push(m.text()); });
  await page.goto(URL, { waitUntil: 'load', timeout: 45000 });
  await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 30000 });
  return { page, errors };
}
async function play(page) {
  const btn = page.locator('button', { hasText: /play/i }).first();
  if (await btn.count()) await btn.click({ timeout: 5000 }).catch(() => {});
  await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 10000 });
}

/**
 * Wait until the player is actually standing. The player spawns above the
 * ground and falls, and a jump while airborne is correctly refused - so any
 * jump assertion made before this lands is testing the fall, not the button.
 * Under software rasterisation the fall takes over a second of wall time,
 * which is exactly long enough to look like a broken jump button.
 */
async function grounded(page) {
  await page.waitForFunction(() => window.__EMEEM__.state.player.grounded === true, null, { timeout: 30000 });
}

// ===================================================================== 1. sizes
console.log('\n== phone viewports, landscape ==');
const DEVICES = [
  { name: 'Galaxy S25 Ultra', viewport: { width: 1040, height: 480 }, deviceScaleFactor: 3 },
  { name: 'iPhone 15 Pro Max', viewport: { width: 932, height: 430 }, deviceScaleFactor: 3 },
  { name: 'iPhone SE (smallest)', viewport: { width: 667, height: 375 }, deviceScaleFactor: 2 },
];
for (const d of DEVICES) {
  const { page, errors } = await boot(d);
  await play(page);
  await page.waitForTimeout(1200);
  const r = await page.evaluate(() => {
    const s = window.__EMEEM__.state;
    const c = document.getElementById('game-canvas');
    // The on-screen controls are divs (class prefix emtc-), not <button>
    // elements. Querying 'button' measured HUD chrome instead and reported a
    // 37px control that does not exist.
    const btns = Array.from(document.querySelectorAll('.emtc-btn, [class*="emtc-a-"], [class*="emtc-jump"]'));
    const vw = window.innerWidth, vh = window.innerHeight;
    // Every control must be fully on screen and big enough to hit with a thumb.
    let offscreen = 0, tiny = 0, smallest = 1e9;
    for (const b of btns) {
      const q = b.getBoundingClientRect();
      if (!q.width || !q.height) continue;
      if (q.left < -1 || q.top < -1 || q.right > vw + 1 || q.bottom > vh + 1) offscreen++;
      const min = Math.min(q.width, q.height);
      smallest = Math.min(smallest, min);
      if (min < 40) tiny++;             // 44px is Apple's guideline; 40 is generous
    }
    return {
      phase: s.phase, canvasW: c.width, canvasH: c.height,
      docScrollW: document.documentElement.scrollWidth, vw,
      offscreen, tiny, smallest: Math.round(smallest), buttons: btns.length,
    };
  });
  ok(`${d.name}: runs`, r.phase === 'playing');
  ok(`${d.name}: canvas fills viewport`, r.canvasW > 0 && r.canvasH > 0, `${r.canvasW}x${r.canvasH}`);
  ok(`${d.name}: no horizontal overflow`, r.docScrollW <= r.vw + 1, `${r.docScrollW} vs ${r.vw}`);
  ok(`${d.name}: all controls on screen`, r.offscreen === 0, `${r.offscreen} off screen`);
  ok(`${d.name}: controls thumb-sized`, r.tiny === 0, `smallest ${r.smallest}px of ${r.buttons} buttons`);
  ok(`${d.name}: no console errors`, errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}

// ============================================================== 2. real touch
console.log('\n== touch input (real touch events, not the keyboard) ==');
{
  const { page, errors } = await boot(DEVICES[1]);
  await play(page);
  // Find the controls by their accessible names rather than by position.
  const box = async (re) => {
    const el = page.locator('button', { hasText: re }).first();
    if (!(await el.count())) {
      const byLabel = page.locator(`[aria-label*="${re.source.replace(/[^a-z]/gi, '')}" i]`).first();
      if (await byLabel.count()) return byLabel.boundingBox();
      return null;
    }
    return el.boundingBox();
  };
  const ctrls = await page.evaluate(() => {
    const out = {};
    for (const el of document.querySelectorAll('button,[role=button],[data-dir],[class*=dpad],[class*=jump]')) {
      const t = ((el.getAttribute('aria-label') || '') + ' ' + (el.className || '') + ' ' + (el.dataset.dir || '')).toLowerCase();
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      if (/up|forward|north/.test(t) && !out.up) out.up = c;
      else if (/left|west/.test(t) && !out.left) out.left = c;
      else if (/jump/.test(t) && !out.jump) out.jump = c;
    }
    return out;
  });
  note('controls located', JSON.stringify(Object.keys(ctrls)));

  if (ctrls.up && ctrls.jump) {
    const before = await page.evaluate(() => ({ ...window.__EMEEM__.state.player.pos.toArray && {} , z: window.__EMEEM__.state.player.pos.z, jumps: window.__EMEEM__.state.stats.jumps }));
    // Hold UP with one finger and JUMP with a second: the exact two-thumb case.
    await grounded(page);
    await page.touchscreen.tap(ctrls.up.x, ctrls.up.y);      // warm the handler
    await page.evaluate(({ up, jump }) => {
      const fire = (el, type, id, x, y) => {
        el.dispatchEvent(new PointerEvent(type, {
          pointerId: id, pointerType: 'touch', isPrimary: id === 1,
          clientX: x, clientY: y, bubbles: true, cancelable: true,
        }));
      };
      const upEl = document.elementFromPoint(up.x, up.y);
      const jumpEl = document.elementFromPoint(jump.x, jump.y);
      window.__STRESS__ = { upEl, jumpEl, up, jump, fire };
      fire(upEl, 'pointerdown', 1, up.x, up.y);
      fire(jumpEl, 'pointerdown', 2, jump.x, jump.y);
    }, ctrls);
    await page.waitForTimeout(1400);
    await grounded(page);
    // Re-fire the jump now that the feet are down; the first press may have
    // landed mid-fall and been legitimately ignored.
    await page.evaluate(({ jump }) => {
      const S = window.__STRESS__;
      S.fire(S.jumpEl, 'pointerup', 2, jump.x, jump.y);
      S.fire(S.jumpEl, 'pointerdown', 2, jump.x, jump.y);
    }, ctrls);
    await page.waitForTimeout(900);
    const during = await page.evaluate(() => ({
      x: window.__EMEEM__.state.input.x, z: window.__EMEEM__.state.input.z,
      jump: window.__EMEEM__.state.input.jump, jumps: window.__EMEEM__.state.stats.jumps,
      posZ: window.__EMEEM__.state.player.pos.z,
    }));
    ok('holding UP moves forward', during.z > 0.5, `input.z=${during.z}`);
    ok('JUMP works while UP is held', during.jumps > before.jumps, `${before.jumps} -> ${during.jumps}`);

    // Now the nightmare: the pointers are LOST, not released - app switch,
    // notification shade, incoming call. Nothing must stay held down.
    await page.evaluate(() => {
      const S = window.__STRESS__;
      S.fire(S.upEl, 'pointercancel', 1, S.up.x, S.up.y);
      S.fire(S.jumpEl, 'pointercancel', 2, S.jump.x, S.jump.y);
      window.dispatchEvent(new Event('blur'));
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({ ...window.__EMEEM__.state.input }));
    ok('no stuck direction after an interrupted press', after.x === 0 && after.z === 0, `x=${after.x} z=${after.z}`);
    ok('no stuck jump after an interrupted press', after.jump === false, `jump=${after.jump}`);
  } else {
    fails.push('touch: could not locate the on-screen controls');
    console.log('  FAIL  could not locate controls');
  }
  ok('touch: no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
  await page.close();
}

// ========================================================== 3. hostile timing
console.log('\n== hostile timing and long runs ==');
{
  const { page, errors } = await boot(DEVICES[0]);
  await play(page);

  // Simulate the tab being backgrounded and restored: the loop sees one
  // enormous delta. maxDelta should absorb it without tunnelling or NaN.
  const jump = await page.evaluate(() => {
    const g = window.__EMEEM__;
    const before = { ...g.state.player.pos };
    // Drive one frame with a 4-second gap, the way a restored tab does.
    const t = performance.now;
    let fake = t.call(performance) + 4000;
    performance.now = () => fake;
    return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => {
      performance.now = t;
      const p = g.state.player.pos, v = g.state.player.vel;
      res({
        before, after: { x: p.x, y: p.y, z: p.z },
        finite: [p.x, p.y, p.z, v.x, v.y, v.z].every(Number.isFinite),
        underground: p.y < -2,
      });
    })));
  });
  ok('survives a 4s frame gap without NaN', jump.finite);
  ok('does not fall through the world on a long frame', !jump.underground, `y=${jump.after.y.toFixed(2)}`);

  // Long run: many minutes of simulated play, watching for drift and growth.
  const long = await page.evaluate(() => new Promise((res) => {
    const g = window.__EMEEM__;
    const listeners0 = g.bus ? undefined : undefined;
    const t0 = performance.now();
    let frames = 0;
    const startObjs = g.ctx.scene.children.length;
    const tick = () => {
      frames++;
      // Drive input so the world actually streams and emeems spawn/despawn.
      const s = g.state;
      s.input.z = 1;
      s.input.x = Math.sin(frames / 37);
      if (performance.now() - t0 < 25000) requestAnimationFrame(tick);
      else {
        const p = s.player.pos, m = s.monster.pos;
        res({
          frames,
          gameSeconds: +s.time.toFixed(1),
          score: s.score,
          finite: [p.x, p.y, p.z, m.x, m.y, m.z, s.dread, s.monster.speed].every(Number.isFinite),
          sceneChildren: g.ctx.scene.children.length,
          sceneGrowth: g.ctx.scene.children.length - startObjs,
          colliders: g.world.colliders.length,
          distance: +s.player.distanceRun.toFixed(0),
          heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null,
        });
      }
    };
    requestAnimationFrame(tick);
  }));
  note('long run', `${long.frames} frames, ${long.gameSeconds}s of game time, ${long.distance}m travelled, score ${long.score}`);
  ok('long run: no NaN anywhere', long.finite);
  ok('long run: scene graph does not grow unbounded', long.sceneGrowth <= 2, `+${long.sceneGrowth} objects`);
  ok('long run: collider count stays bounded', long.colliders > 0 && long.colliders < 4000, `${long.colliders}`);
  if (long.heap !== null) note('heap after long run', `${long.heap} MB`);
  ok('long run: no console errors', errors.length === 0, errors.slice(0, 3).join(' | '));

  // Rapid restarts: 25 runs back to back, which is what an angry player does.
  const restarts = await page.evaluate(() => {
    const g = window.__EMEEM__;
    const seen = [];
    for (let i = 0; i < 25; i++) {
      g.bus.emit('caught', { score: g.state.score });
      g.bus.emit('restart');
      seen.push({ score: g.state.score, tier: g.state.levelIndex, phase: g.state.phase });
    }
    const s = g.state;
    return {
      allReset: seen.every((x) => x.score === 0 && x.tier === 0 && x.phase === 'playing'),
      finite: [s.player.pos.x, s.player.pos.y, s.monster.pos.z, s.dread].every(Number.isFinite),
      sceneChildren: g.ctx.scene.children.length,
    };
  });
  ok('25 rapid restarts all reset cleanly', restarts.allReset);
  ok('25 rapid restarts leave no NaN', restarts.finite);
  ok('25 rapid restarts do not leak scene objects', restarts.sceneChildren <= long.sceneChildren + 2,
    `${long.sceneChildren} -> ${restarts.sceneChildren}`);
  await page.close();
}

console.log('');
if (warns.length) { console.log(`${warns.length} warning(s):`); warns.forEach((w) => console.log('  - ' + w)); }
if (fails.length) {
  console.log(`${fails.length} STRESS CHECK(S) FAILED:`);
  fails.forEach((f) => console.log('  - ' + f));
  await browser.close();
  process.exit(1);
}
console.log('All stress checks passed.\n');
await browser.close();
