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
  // Pin the Protector's entrance side. It is a coin flip in the real game, and
  // the scripted bot below walks a FIXED path - so whether that path runs
  // toward the creature or away from it decides the result. Unpinned, the same
  // check passed at 18.8m and failed at 6.2m on consecutive runs of identical
  // code. The game keeps its coin; the suite does not get to be flaky.
  await page.evaluate(() => { window.__EMEEM__.CONFIG.monster.spawnSide = -1; });
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
      const r = el.getBoundingClientRect();
      if (!r.width) continue;
      const c = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      // EXACT identity first. The regex chain below is first-match/else-if over
      // document order, and "Move up and left" matches /up|forward|north/ before
      // it can ever reach /left|west/ - so with eight directions a diagonal
      // would silently bind to `up`, and the two-thumb test would pass anyway
      // because a diagonal also has z = 1. data-dir removes the whole class.
      if (el.dataset.dir) { out[el.dataset.dir] = c; continue; }
      const t = ((el.getAttribute('aria-label') || '') + ' ' + (el.className || '')).toLowerCase();
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

// ============================================================ 2b. eight-way pad
// The whole point of the diagonals: ONE finger, eight directions, and a slide
// around the ring that never drops to neutral. Every assertion here drives real
// PointerEvents at real coordinates - none of it goes through the keyboard.
console.log('\n== eight-way pad (one finger, eight directions) ==');
{
  const { page, errors } = await boot(DEVICES[1]);
  await play(page);
  await grounded(page);

  // Install the same synthetic-pointer helper the section above uses, plus a
  // reader for touch.snapshot() - state.input cannot tell a stuck LEFT from a
  // deliberate one, but a source id in two holder Sets is unambiguous.
  await page.evaluate(() => {
    window.__P__ = {
      fire(x, y, type, id) {
        const el = document.elementFromPoint(x, y) || document.body;
        el.dispatchEvent(new PointerEvent(type, {
          pointerId: id, pointerType: 'touch', isPrimary: id === 1,
          clientX: x, clientY: y, bubbles: true, cancelable: true,
        }));
      },
      // pointermove is bound on window, so it does not need the right element.
      move(x, y, id) {
        window.dispatchEvent(new PointerEvent('pointermove', {
          pointerId: id, pointerType: 'touch', isPrimary: id === 1,
          clientX: x, clientY: y, bubbles: true, cancelable: true,
        }));
      },
      centres() {
        const out = {};
        for (const el of document.querySelectorAll('[data-dir]')) {
          const r = el.getBoundingClientRect();
          out[el.dataset.dir] = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }
        return out;
      },
      input: () => ({ ...window.__EMEEM__.state.input }),
      snap: () => window.__EMEEM__.touch.snapshot(),
    };
  });

  const C = await page.evaluate(() => window.__P__.centres());
  const DIRS = ['up', 'left', 'right', 'down', 'upleft', 'upright', 'downleft', 'downright'];
  const WANT = {
    up: [0, 1], down: [0, -1], left: [-1, 0], right: [1, 0],
    upleft: [-1, 1], upright: [1, 1], downleft: [-1, -1], downright: [1, -1],
  };
  ok('all eight directions exist in the DOM',
    DIRS.every((d) => C[d]), `found ${Object.keys(C).length}: ${Object.keys(C).join(',')}`);

  if (DIRS.every((d) => C[d])) {
    // 1. every direction from ONE synthetic finger, and a clean release
    const bad = [];
    for (const d of DIRS) {
      const r = await page.evaluate(({ p, id }) => {
        window.__P__.fire(p.x, p.y, 'pointerdown', id);
        const held = window.__P__.input();
        window.__P__.fire(p.x, p.y, 'pointerup', id);
        return { held, freed: window.__P__.input() };
      }, { p: C[d], id: 9 });
      const [wx, wz] = WANT[d];
      if (r.held.x !== wx || r.held.z !== wz) bad.push(`${d} gave ${r.held.x},${r.held.z} want ${wx},${wz}`);
      if (r.freed.x !== 0 || r.freed.z !== 0) bad.push(`${d} did not release (${r.freed.x},${r.freed.z})`);
    }
    ok('one finger produces all eight directions', bad.length === 0, bad.slice(0, 3).join(' | ') || '8/8');

    // 2. INVARIANT A: eight fingers, no source id in two holder Sets
    const inv = await page.evaluate((C) => {
      const D = Object.keys(C);
      D.forEach((d, i) => window.__P__.fire(C[d].x, C[d].y, 'pointerdown', 11 + i));
      const snap = window.__P__.snap();
      const owner = new Map(); const dup = [];
      for (const [act, srcs] of Object.entries(snap.holders)) {
        for (const src of srcs) { if (owner.has(src)) dup.push(`${src} in ${owner.get(src)} and ${act}`); owner.set(src, act); }
      }
      const inp = { ...window.__EMEEM__.state.input };
      D.forEach((d, i) => window.__P__.fire(C[d].x, C[d].y, 'pointerup', 11 + i));
      const after = window.__P__.snap();
      const leftOver = Object.entries(after.holders).filter(([, v]) => v.length).map(([k]) => k);
      return { dup, inp, leftOver };
    }, C);
    ok('invariant A: no source id held by two directions', inv.dup.length === 0, inv.dup.slice(0, 2).join(' | ') || 'clean');
    ok('eight simultaneous holds stay in range',
      [-1, 0, 1].includes(inv.inp.x) && [-1, 0, 1].includes(inv.inp.z), `x=${inv.inp.x} z=${inv.inp.z}`);
    ok('all eight release leaves nothing held', inv.leftOver.length === 0, inv.leftOver.join(',') || 'empty');

    // 3. stacked overlapping holds must not sum (left + upleft would read x=-2,
    //    and player.js NORMALISES rather than clamps, so it would bend the
    //    movement angle from -45 to -63 degrees instead of failing loudly)
    const stack = await page.evaluate((C) => {
      window.__P__.fire(C.left.x, C.left.y, 'pointerdown', 31);
      window.__P__.fire(C.upleft.x, C.upleft.y, 'pointerdown', 32);
      window.__P__.fire(C.downleft.x, C.downleft.y, 'pointerdown', 33);
      const inp = { ...window.__EMEEM__.state.input };
      [31, 32, 33].forEach((id, i) => {
        const p = [C.left, C.upleft, C.downleft][i];
        window.__P__.fire(p.x, p.y, 'pointerup', id);
      });
      return inp;
    }, C);
    ok('overlapping holds do not sum',
      [-1, 0, 1].includes(stack.x) && [-1, 0, 1].includes(stack.z), `x=${stack.x} z=${stack.z}`);

    // 4. slide hand-over: up -> upleft -> up -> off the pad -> back on
    const slide = await page.evaluate((C) => {
      const seq = [];
      window.__P__.fire(C.up.x, C.up.y, 'pointerdown', 41);
      seq.push(window.__P__.input());
      window.__P__.move(C.upleft.x, C.upleft.y, 41); seq.push(window.__P__.input());
      window.__P__.move(C.up.x, C.up.y, 41);         seq.push(window.__P__.input());
      window.__P__.move(window.innerWidth * 0.7, window.innerHeight * 0.4, 41);
      seq.push(window.__P__.input());
      const stillTracked = window.__P__.snap().pointers.some(([id, act]) => id === 41 && act === null);
      window.__P__.move(C.up.x, C.up.y, 41);         seq.push(window.__P__.input());
      window.__P__.fire(C.up.x, C.up.y, 'pointerup', 41);
      return { seq, stillTracked, end: window.__P__.input() };
    }, C);
    const S = slide.seq;
    ok('slide up -> up-left hands over',
      S[0].z === 1 && S[0].x === 0 && S[1].x === -1 && S[1].z === 1,
      `${S[0].x},${S[0].z} -> ${S[1].x},${S[1].z}`);
    ok('slide back to up hands back', S[2].x === 0 && S[2].z === 1, `${S[2].x},${S[2].z}`);
    ok('sliding off the pad releases but keeps tracking',
      S[3].x === 0 && S[3].z === 0 && slide.stillTracked, `input ${S[3].x},${S[3].z} tracked=${slide.stillTracked}`);
    ok('sliding back on re-engages with no new touch', S[4].z === 1, `${S[4].x},${S[4].z}`);
    ok('slide sequence ends neutral', slide.end.x === 0 && slide.end.z === 0, `${slide.end.x},${slide.end.z}`);

    // 5. the headline: sweep the whole ring without ever dropping to neutral
    const ring = await page.evaluate((C) => {
      const order = ['up', 'upright', 'right', 'downright', 'down', 'downleft', 'left', 'upleft', 'up'];
      window.__P__.fire(C.up.x, C.up.y, 'pointerdown', 51);
      let neutral = 0; const seen = new Set();
      for (let i = 0; i < order.length - 1; i++) {
        const a = C[order[i]], b = C[order[i + 1]];
        const steps = Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 3);
        for (let t = 1; t <= steps; t++) {
          window.__P__.move(a.x + (b.x - a.x) * t / steps, a.y + (b.y - a.y) * t / steps, 51);
          const s = window.__P__.snap().pointers.find(([id]) => id === 51);
          if (s && s[1]) seen.add(s[1]);
          const inp = window.__EMEEM__.state.input;
          if (inp.x === 0 && inp.z === 0) neutral++;
        }
      }
      window.__P__.fire(C.up.x, C.up.y, 'pointerup', 51);
      return { neutral, seen: [...seen] };
    }, C);
    ok('a slide around the ring never drops to neutral', ring.neutral === 0, `${ring.neutral} neutral frames`);
    ok('a slide around the ring visits all eight', ring.seen.length === 8, `${ring.seen.length}/8: ${ring.seen.join(',')}`);

    // 6. a stationary thumb on a seam must not chatter
    const chatter = await page.evaluate((C) => {
      const seamX = (C.up.x + C.upleft.x) / 2, seamY = C.up.y;
      window.__P__.fire(seamX, seamY, 'pointerdown', 61);
      let prev = null, flips = 0;
      let seed = 7;
      const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
      for (let i = 0; i < 200; i++) {
        window.__P__.move(seamX + (rnd() - 0.5) * 2, seamY + (rnd() - 0.5) * 2, 61);
        const s = window.__P__.snap().pointers.find(([id]) => id === 61);
        const act = s ? s[1] : null;
        if (prev !== null && act !== prev) flips++;
        prev = act;
      }
      window.__P__.fire(seamX, seamY, 'pointerup', 61);
      return flips;
    }, C);
    ok('a stationary thumb on a seam does not chatter', chatter <= 2, `${chatter} direction changes in 200 moves`);

    // 7. THE discriminating test for the half-released-composite bug class:
    //    a reused pointerId jumping straight from one diagonal to its opposite.
    //    A composite implementation reads exactly 0,0 here.
    const reuse = await page.evaluate((C) => {
      window.__P__.fire(C.upleft.x, C.upleft.y, 'pointerdown', 1);
      window.__P__.fire(C.downright.x, C.downright.y, 'pointerdown', 1);  // no pointerup
      const inp = window.__P__.input();
      window.__P__.fire(C.downright.x, C.downright.y, 'pointerup', 1);
      return { inp, after: window.__P__.input() };
    }, C);
    ok('a reused pointerId across opposite diagonals is clean',
      reuse.inp.x === 1 && reuse.inp.z === -1, `x=${reuse.inp.x} z=${reuse.inp.z} (a half-released composite reads 0,0)`);
    ok('reused pointerId releases fully', reuse.after.x === 0 && reuse.after.z === 0, `${reuse.after.x},${reuse.after.z}`);

    // 8. a press in the dead centre tracks but holds nothing, then engages
    const hub = await page.evaluate((C) => {
      const cx = (C.left.x + C.right.x) / 2, cy = (C.up.y + C.down.y) / 2;
      window.__P__.fire(cx, cy, 'pointerdown', 71);
      const snap = window.__P__.snap();
      const held = Object.values(snap.holders).some((v) => v.length);
      const tracked = snap.pointers.some(([id, act]) => id === 71 && act === null);
      const inp = window.__P__.input();
      window.__P__.move(C.up.x, C.up.y, 71);
      const after = window.__P__.input();
      window.__P__.fire(C.up.x, C.up.y, 'pointerup', 71);
      return { held, tracked, inp, after };
    }, C);
    ok('a press in the dead centre holds nothing', !hub.held && hub.inp.x === 0 && hub.inp.z === 0, `held=${hub.held}`);
    ok('a press in the dead centre is still tracked', hub.tracked, `tracked=${hub.tracked}`);
    ok('sliding out of the dead centre engages', hub.after.z === 1, `${hub.after.x},${hub.after.z}`);

    // 9. interruption with a diagonal held - the existing nightmare sequence
    const inter = await page.evaluate((C) => {
      window.__P__.fire(C.downright.x, C.downright.y, 'pointerdown', 81);
      window.__P__.fire(C.downright.x, C.downright.y, 'pointercancel', 81);
      window.dispatchEvent(new Event('blur'));
      const snap = window.__P__.snap();
      return {
        inp: { ...window.__EMEEM__.state.input },
        leftOver: Object.entries(snap.holders).filter(([, v]) => v.length).map(([k]) => k),
      };
    }, C);
    ok('an interrupted diagonal leaves nothing stuck',
      inter.inp.x === 0 && inter.inp.z === 0 && inter.leftOver.length === 0,
      `x=${inter.inp.x} z=${inter.inp.z} held=[${inter.leftOver}]`);

    // 10. the layout breakpoint crossed while a diagonal is held
    await page.evaluate((C) => window.__P__.fire(C.upleft.x, C.upleft.y, 'pointerdown', 91), C);
    await page.setViewportSize({ width: 932, height: 380 });   // crosses max-height:400px
    await page.waitForTimeout(120);
    const bp = await page.evaluate(() => {
      const inp = { ...window.__EMEEM__.state.input };
      window.__P__.fire(10, 10, 'pointerup', 91);
      window.dispatchEvent(new Event('blur'));
      return { inp, after: { ...window.__EMEEM__.state.input } };
    });
    ok('a held diagonal survives the layout breakpoint',
      bp.inp.x === -1 && bp.inp.z === 1, `x=${bp.inp.x} z=${bp.inp.z}`);
    ok('and still releases afterwards', bp.after.x === 0 && bp.after.z === 0, `${bp.after.x},${bp.after.z}`);
    await page.setViewportSize({ width: 932, height: 430 });

    // 11. pressed feedback must survive the cascade. `.emtc-diag`'s quiet fill
    //     sits LATER in the stylesheet than `.emtc-down` at equal specificity,
    //     so unguarded it wins while the button is held: the chip stays dark
    //     while the glyph still inverts to near-black, and the arrow VANISHES
    //     under the thumb. Compare a diagonal against a cardinal, which is
    //     known good, rather than against a hard-coded colour.
    //
    //     THE WAITS ARE LOAD-BEARING. `.emtc-btn` transitions background-color
    //     and transform over 70ms, and getComputedStyle mid-transition returns
    //     the INTERPOLATED value - read immediately after pointerdown it hands
    //     back the REST colour for every button, and the assertion passes on a
    //     broken build because both sides are equally wrong. Everything below
    //     waits past the transition before reading.
    // Waiting out the transition does not work here: under software
    // rasterisation the page runs at ~5fps, so 180ms is about ONE frame and
    // background-color/transform are still at their start values. Finish the
    // transitions explicitly instead - deterministic, and independent of how
    // slowly the headless compositor happens to be ticking.
    const readStyle = (d) => page.evaluate((d) => {
      const el = document.querySelector(`[data-dir=${d}]`);
      if (el.getAnimations) for (const a of el.getAnimations()) { try { a.finish(); } catch { /* not finishable */ } }
      const cs = getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        fill: getComputedStyle(el.querySelector('svg')).fill,
        down: el.className.includes('emtc-down'),
        rect: +el.getBoundingClientRect().width.toFixed(2),
        layout: el.offsetWidth,
      };
    }, d);
    const holdRead = async (d) => {
      await page.evaluate(({ p }) => window.__P__.fire(p.x, p.y, 'pointerdown', 101), { p: C[d] });
      const st = await readStyle(d);
      await page.evaluate(({ p }) => { window.__P__.fire(p.x, p.y, 'pointerup', 101); window.dispatchEvent(new Event('blur')); }, { p: C[d] });
      return st;
    };
    const upRest = await readStyle('up');
    const ulRest = await readStyle('upleft');
    const upDown = await holdRead('up');
    const ulDown = await holdRead('upleft');
    ok('the press-feedback test is not vacuous',
      upDown.down && upDown.bg !== upRest.bg,
      `cardinal rest ${upRest.bg} -> down ${upDown.bg}`);
    ok('pressing a diagonal changes its chip too',
      ulDown.bg !== ulRest.bg, `rest ${ulRest.bg} -> down ${ulDown.bg}`);
    ok('a pressed diagonal looks like a pressed cardinal',
      ulDown.bg === upDown.bg && ulDown.fill === upDown.fill,
      `diag ${ulDown.bg}/${ulDown.fill} vs cardinal ${upDown.bg}/${upDown.fill}`);

    // 12. a re-measure taken WHILE a button is held must not cache its pressed
    //     transform:scale(.93). If it does, the zone is 2.66px tight on every
    //     side and stays that way (toggling the pressed class does not raise
    //     zonesDirty), so the outer edge of that collar goes dead to
    //     pointermove and the direction drops with the thumb still on it.
    // The baseline MUST be the button at rest. Test 11 released a button 
    // moments ago and its transform is still transitioning BACK over 70ms, so
    // a naive read here returns a top a pixel or so low - which moves the probe
    // out of the 2.66px dead band and makes this whole test pass on broken
    // code. Finish every animation first, then assert the read really is the
    // resting geometry before using it.
    const geo = await page.evaluate(() => {
      const el = document.querySelector('[data-dir=up]');
      if (el.getAnimations) for (const a of el.getAnimations()) { try { a.finish(); } catch { /* not finishable */ } }
      const r = el.getBoundingClientRect();
      return { cx: r.x + r.width / 2, top: r.top, w: +r.width.toFixed(2), layout: el.offsetWidth };
    });
    ok('the shrink test baseline is the button at rest',
      Math.abs(geo.w - geo.layout) < 0.01, `rect ${geo.w}px vs layout ${geo.layout}px`);
    const edgeY = geo.top - 12.5;              // inside the 14px collar, above the button
    await page.evaluate(({ x, y }) => window.__P__.fire(x, y, 'pointerdown', 111), { x: geo.cx, y: edgeY });
    const held = await readStyle('up');        // finishes the transform transition

    const shrink = await page.evaluate(({ x, y }) => {
      const before = { ...window.__EMEEM__.state.input };
      window.dispatchEvent(new Event('resize'));   // zonesDirty = true
      window.__P__.move(x + 0.5, y, 111);          // forces measure() while still held
      const after = { ...window.__EMEEM__.state.input };
      window.__P__.fire(x, y, 'pointerup', 111);
      window.dispatchEvent(new Event('blur'));
      return { before, after };
    }, { x: geo.cx, y: edgeY });
    ok('the shrink test is not vacuous -- the press transform really applied',
      held.down && held.rect < held.layout,
      `pressed rect ${held.rect}px vs layout ${held.layout}px`);
    ok('a press on the outer collar is grabbed', shrink.before.z === 1, `z=${shrink.before.z}`);
    ok('re-measuring while held does not shrink the hit zone',
      shrink.after.z === 1, `z=${shrink.after.z} after a re-measure with the button scaled`);

    // 13. destroy() with a diagonal held
    const destroyed = await page.evaluate((C) => {
      window.__P__.fire(C.upright.x, C.upright.y, 'pointerdown', 95);
      window.__EMEEM__.touch.destroy();
      return { ...window.__EMEEM__.state.input };
    }, C);
    ok('destroy() with a diagonal held leaves nothing stuck',
      destroyed.x === 0 && destroyed.z === 0 && destroyed.jump === false,
      `x=${destroyed.x} z=${destroyed.z} jump=${destroyed.jump}`);
  }

  ok('eight-way pad: no console errors', errors.length === 0, errors.slice(0, 2).join(' | '));
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
