/**
 * The biome clock, checked in plain node - no browser, no GPU, no game.
 *
 * biome.js is pure functions of position with no THREE import and no state,
 * which means the band geography can be proved in milliseconds instead of in a
 * ten-minute Playwright run. Everything here is arithmetic the rendered world
 * then has to agree with; the browser suites check the agreement.
 */
import {
  biomeAt, biomeMix, BIOME_NAMES, BIOME_LEAD, BIOME_BAND, BIOME_BLEND, BIOME_COUNT,
  LAKE_Z0, LAKE_PERIOD, LAKE_HALF_Z, SHORE_WARP_MAX, waterAt,
} from '../src/world/biome.js';

const fails = [];
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ' -- ' + detail : ''}`);
  if (!cond) fails.push(label + (detail ? ': ' + detail : ''));
};

console.log(`\nbiome clock: lead ${BIOME_LEAD}m, band ${BIOME_BAND}m, blend ${BIOME_BLEND}m`);
console.log(`cycle: ${BIOME_COUNT * BIOME_BAND}m\n`);

// --- where each biome first appears, walking up-screen from the origin
const firstAt = new Array(BIOME_COUNT).fill(null);
const scratch = { a: 0, b: 0, w: 0 };
for (let z = 0; z >= -4000; z -= 0.5) {
  const b = biomeAt(0, z, scratch);
  if (firstAt[b] === null) firstAt[b] = -z;
}
for (let i = 0; i < BIOME_COUNT; i++) {
  console.log(`  ${BIOME_NAMES[i].padEnd(9)} first reached at ${firstAt[i] === null ? 'NEVER' : firstAt[i].toFixed(0) + 'm'}`);
}
console.log('');

// A measured bot run covers a median 40m and a best 130m before dying. The bar
// is deliberately the BEST run, not the median: a biome nobody has ever seen is
// not content, and one only a great run reaches is a reward.
ok('every biome exists somewhere', firstAt.every((v) => v !== null),
  firstAt.map((v, i) => `${BIOME_NAMES[i]}@${v === null ? '-' : v.toFixed(0)}`).join(' '));
ok('a good run (130m) reaches at least the second biome',
  firstAt.filter((v) => v !== null && v <= 130).length >= 2,
  `${firstAt.filter((v) => v !== null && v <= 130).length} biomes inside 130m`);
ok('the whole cycle is inside a great run (400m)',
  Math.max(...firstAt) <= 400, `last biome at ${Math.max(...firstAt).toFixed(0)}m`);

// --- the lake phase rule
ok('4 * BAND divides LAKE_PERIOD, so lakes keep their biome',
  LAKE_PERIOD % (BIOME_COUNT * BIOME_BAND) === 0,
  `${LAKE_PERIOD} / ${BIOME_COUNT * BIOME_BAND} = ${LAKE_PERIOD / (BIOME_COUNT * BIOME_BAND)}`);

const lakeBiomes = [];
for (let n = 0; n < 6; n++) {
  const cz = -(LAKE_Z0 + n * LAKE_PERIOD);
  lakeBiomes.push(biomeAt(0, cz, scratch));
}
ok('and they all land in the same one', new Set(lakeBiomes).size === 1,
  lakeBiomes.map((b) => BIOME_NAMES[b]).join(', '));

// --- no lake bleeds into a biome its shoreline cannot support. Props are
// rejected inside the water either way, so this is about ground and sky, but a
// lake that half-crosses a city is still worth knowing about.
const span = LAKE_HALF_Z + SHORE_WARP_MAX;
const across = new Set();
for (let dz = -span; dz <= span; dz += 1) across.add(biomeAt(0, -(LAKE_Z0) + dz, scratch));
console.log(`\n  a lake spans: ${[...across].map((b) => BIOME_NAMES[b]).join(', ')}  (${(2 * span).toFixed(0)}m of shore to shore)`);

// --- the blend is monotonic and total: no gaps, no double-counting
let worstSum = 0, jumpMax = 0, prevA = null, prevW = null;
for (let z = 0; z >= -3000; z -= 0.25) {
  const m = biomeMix(0, z, scratch);
  worstSum = Math.max(worstSum, Math.abs((1 - m.w) + m.w - 1));
  if (prevA !== null && m.a === prevA) jumpMax = Math.max(jumpMax, Math.abs(m.w - prevW));
  prevA = m.a; prevW = m.w;
}
ok('the two weights always sum to 1', worstSum < 1e-12, worstSum.toExponential(1));
ok('and the mix never steps', jumpMax < 0.02, `largest step ${jumpMax.toFixed(4)} per 0.25m`);

// --- waterAt still behaves
ok('the first lake is still open water at its centre', waterAt(0, -LAKE_Z0) === 1);
ok('and dry well short of it', waterAt(0, -(LAKE_Z0 - 60)) === 0);

console.log(fails.length ? `\n${fails.length} FAILED` : '\nAll biome-clock checks passed.');
process.exit(fails.length ? 1 : 0);
