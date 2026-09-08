/**
 * EMEEM - the biomes, verified in the rendered world.
 *
 * tools/biome-node.mjs proves the clock in plain arithmetic. This one proves
 * the PICTURE agrees with it: that the ground shader's GLSL twin of biomeMix
 * lands the colour change where the JS says it should, that the sky and fog
 * follow, and - the check that makes the rest mean anything - that a screenshot
 * of the beach is actually a different colour from a screenshot of the forest.
 *
 * The vacuous version of this file samples uniforms and calls it a day. A
 * uniform can hold the right value while the shader ignores it: every check
 * below that can be answered by a pixel is answered by a pixel.
 *
 * Usage: node tools/biome.mjs [--url http://127.0.0.1:4199/]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:4199/';
const PINNED = '/opt/pw-browsers/chromium';
const fails = [];
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ' -- ' + detail : ''}`);
  if (!cond) fails.push(label + (detail ? ': ' + detail : ''));
};

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 480, height: 240 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 40000 });
const play = page.locator('button', { hasText: /play/i }).first();
if (await play.count()) await play.click({ timeout: 5000 }).catch(() => {});
await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 20000 });

const mark = () => page.evaluate(() => { window.__T0__ = window.__EMEEM__.state.time; });
const gameWait = (s) => page.waitForFunction((n) => window.__EMEEM__.state.time - window.__T0__ > n,
  s, { timeout: 200000, polling: 50 }).catch(() => {});

const geom = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { lead: E.world.biomeLead, band: E.world.biomeBand };
});

/**
 * Hide everything except the ground plane while measuring.
 *
 * The first version of this sampled the lower middle of the frame as-is and got
 * a largest single step LARGER than the total change across the crossing -
 * because that box is full of rocks, ferns and the hand, which change from
 * chunk to chunk and swamp the tint being measured. The biome ground is a
 * property of the ground, so measure the ground.
 */
const isolateGround = (on) => page.evaluate((v) => {
  const E = window.__EMEEM__;
  E.ctx.scene.traverse((o) => {
    if (!o.isMesh && !o.isSprite && !o.isPoints) return;
    if (o.name === 'ground') return;
    if (v) {
      if (o.userData.__wasVisible === undefined) o.userData.__wasVisible = o.visible;
      o.visible = false;
    } else if (o.userData.__wasVisible !== undefined) {
      o.visible = o.userData.__wasVisible;
      delete o.userData.__wasVisible;
    }
  });
}, on);

/**
 * Average colour of a patch of the frame. The ground fills the lower middle of
 * the screen and the sky the upper middle, so two fixed boxes are enough and
 * neither ever contains a HUD control.
 */
async function patches() {
  const buf = await page.screenshot({ type: 'png' });
  const { PNG } = await import('pngjs');
  const png = PNG.sync.read(buf);
  const box = (x0, y0, x1, y1) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (png.width * y + x) << 2;
        r += png.data[i]; g += png.data[i + 1]; b += png.data[i + 2]; n++;
      }
    }
    return [r / n, g / n, b / n];
  };
  const W = png.width, H = png.height;
  return {
    ground: box(W * 0.34 | 0, H * 0.78 | 0, W * 0.66 | 0, H * 0.96 | 0),
    sky: box(W * 0.34 | 0, H * 0.04 | 0, W * 0.66 | 0, H * 0.16 | 0),
  };
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const show = (c) => `rgb(${c.map((v) => Math.round(v)).join(',')})`;

// Band centres, derived from the exported geography rather than typed, so the
// whole file survives a retune of LEAD or BAND without an edit.
const at = (i) => geom.lead + (i + 0.5) * geom.band;
const NAMES = ['forest', 'mountain', 'beach', 'city'];

console.log(`\n== the four biomes, at the centre of each band ==`);
console.log(`   (lead ${geom.lead}m, band ${geom.band}m)\n`);
const seen = [];
for (let i = 0; i < 4; i++) {
  const z = at(i);
  await page.evaluate((d) => {
    const E = window.__EMEEM__;
    E.state.player.pos.set(0, 0, -d);
    E.state.monster.pos.set(40, 0, -d + 60);   // out of the sampled boxes
    E.state.dread = 0;
  }, z);
  await mark(); await gameWait(1.2);
  await isolateGround(true);
  const p = await patches();
  await isolateGround(false);
  const named = await page.evaluate((d) => window.__EMEEM__.world.biomeNameAt(0, -d), z);
  seen.push({ i, z, named, ...p });
  console.log(`  ${NAMES[i].padEnd(9)} at ${z.toFixed(0).padStart(4)}m  ground ${show(p.ground)}  sky ${show(p.sky)}`);
  ok(`${NAMES[i]}: the world agrees this is the ${NAMES[i]} band`, named === NAMES[i], named);
}

console.log('');
// The check the rest rests on. If every biome rendered the same pixels, every
// assertion above would still pass and nothing would have changed on screen.
for (let i = 1; i < 4; i++) {
  ok(`${NAMES[i]}: its ground is visibly not the forest's`,
    dist(seen[i].ground, seen[0].ground) > 18,
    `distance ${dist(seen[i].ground, seen[0].ground).toFixed(1)} from ${show(seen[0].ground)}`);
  ok(`${NAMES[i]}: its sky is visibly not the forest's`,
    dist(seen[i].sky, seen[0].sky) > 8,
    `distance ${dist(seen[i].sky, seen[0].sky).toFixed(1)} from ${show(seen[0].sky)}`);
}
// ...and that they are not all the same as EACH OTHER either.
let worstPair = 1e9, worstName = '';
for (let i = 0; i < 4; i++) {
  for (let j = i + 1; j < 4; j++) {
    const d = dist(seen[i].ground, seen[j].ground);
    if (d < worstPair) { worstPair = d; worstName = `${NAMES[i]} vs ${NAMES[j]}`; }
  }
}
ok('no two biomes share a ground colour', worstPair > 18,
  `closest pair ${worstName} at ${worstPair.toFixed(1)}`);

console.log('\n== the boundary is a fade, not a step ==');
// Walk the forest->mountain boundary and watch the ground move. A per-chunk
// switch would show up as one big jump; a per-fragment blend should not.
const z0 = geom.lead + geom.band * 0.5;
const z1 = geom.lead + geom.band * 1.5;
const walk = [];
for (let k = 0; k <= 6; k++) {
  const z = z0 + (z1 - z0) * (k / 6);
  await page.evaluate((d) => {
    const E = window.__EMEEM__;
    E.state.player.pos.set(0, 0, -d);
    E.state.monster.pos.set(40, 0, -d + 60);
    E.state.dread = 0;
  }, z);
  await mark(); await gameWait(0.9);
  await isolateGround(true);
  walk.push((await patches()).ground);
  await isolateGround(false);
}
let biggest = 0;
for (let k = 1; k < walk.length; k++) biggest = Math.max(biggest, dist(walk[k], walk[k - 1]));
const total = dist(walk[walk.length - 1], walk[0]);
ok('the crossing actually changes the ground', total > 18, `total ${total.toFixed(1)}`);
ok('and no single step is most of the change', biggest < total * 0.62,
  `largest step ${biggest.toFixed(1)} of ${total.toFixed(1)} total`);

console.log('');
const real = errors.filter((e) => !/WebGL|SwiftShader|fallback|deprecated/i.test(e));
ok('no console errors', real.length === 0, real.slice(0, 2).join(' | '));
await browser.close();
if (fails.length) { console.log(`\n${fails.length} BIOME CHECK(S) FAILED:`); for (const f of fails) console.log('  - ' + f); process.exitCode = 1; }
else console.log('\nAll biome checks passed.');
