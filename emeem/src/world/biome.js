/**
 * EMEEM - where you are in the world.
 *
 * Pure functions. No THREE import, no state, no allocation on the hot paths.
 * This is the single source of truth for "which place is this?" and it is
 * imported by world.js, renderer.js, player.js, monster.js and emeem.js.
 *
 * WHY A MODULE AND NOT A FIELD ON `state`. main.js runs engine.update() BEFORE
 * ctx.world.update(), and world.update() only runs while phase === 'playing'.
 * Routing the biome through shared state would therefore be one frame stale
 * during play, undefined on the first frame, and frozen on the start screen and
 * after a death - which is exactly when the sky is on screen and doing nothing.
 * A pure function of position has none of those problems and needs no ordering
 * contract at all.
 *
 * WHY POSITION AND NOT SCORE. Chunks are seeded by coordinate and rebuilt as
 * you move; streamAround's only rebuild trigger is a rising threat level. A
 * biome keyed to anything that changes while a chunk is alive would make the
 * same coordinate produce different worlds on a rebuild - you would watch a
 * forest turn into a beach behind you. A pure function of (x, z) cannot.
 *
 * WHY PER CHUNK AND NOT PER PROP. In buildChunk the species is rolled BEFORE
 * the position is drawn (findSpot's arguments derive from size draws that come
 * after the species choice), so a prop does not know where it is when it is
 * being chosen. Per-chunk evaluation at the chunk centre is not a simplification
 * - it is the only order the generator allows.
 */

export const FOREST = 0;
export const MOUNTAIN = 1;
export const BEACH = 2;
export const CITY = 3;
export const BIOME_COUNT = 4;

export const BIOME_NAMES = ['forest', 'mountain', 'beach', 'city'];

/** Metres of pure forest before the first transition begins. */
const LEAD = 192;
/** Metres per biome band. */
const BAND = 256;
/**
 * Metres of cross-fade, centred on each boundary. A chunk is 32m, so this is
 * 8 chunks of blend: one chunk line moves the mix by 0.25, not by a visible
 * step. A 40m blend would move it 0.80 in a single chunk line - a wall.
 */
const BLEND = 128;
/** Blend half-width, in band units. */
const HALF = BLEND / (2 * BAND);
/** Full blend span in band units, so the ramps below are a simple divide. */
const BLEND_SPAN = 2 * HALF;

/** Metres the boundary wanders with X, so it is never a straight line. */
const WARP_A = 12;
const WARP_K = 1 / 97;

export function bandWarp(x) {
  return Math.sin(x * WARP_K) * WARP_A;
}

/**
 * Continuous band coordinate: 0 at the end of the lead, +1 per band.
 * Travel is toward -Z, so -z is distance travelled.
 */
export function bandCoord(x, z) {
  const d = -z - LEAD + bandWarp(x);
  return d <= 0 ? 0 : d / BAND;
}

const wrap = (i) => ((i % BIOME_COUNT) + BIOME_COUNT) % BIOME_COUNT;

/**
 * Fills `out` with { a, b, w }: biome `a` at weight (1 - w), biome `b` at `w`.
 * Inside a band both are the same and w is 0, so callers need no special case.
 */
export function biomeMix(x, z, out) {
  const u = bandCoord(x, z);
  if (u <= HALF) { out.a = FOREST; out.b = FOREST; out.w = 0; return out; }
  const i = Math.floor(u);
  const f = u - i;
  if (f < HALF) {
    out.a = wrap(i - 1); out.b = wrap(i); out.w = 0.5 + f / BLEND_SPAN;
  } else if (f > 1 - HALF) {
    out.a = wrap(i); out.b = wrap(i + 1); out.w = (f - (1 - HALF)) / BLEND_SPAN;
  } else {
    out.a = wrap(i); out.b = wrap(i); out.w = 0;
  }
  return out;
}

/** The single biome that best describes a point, for tests and diagnostics. */
export function biomeAt(x, z, scratch) {
  const m = biomeMix(x, z, scratch || { a: 0, b: 0, w: 0 });
  return m.w < 0.5 ? m.a : m.b;
}

export const BIOME_LEAD = LEAD;
export const BIOME_BAND = BAND;
export const BIOME_BLEND = BLEND;
