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

/**
 * THE BAND GEOGRAPHY, AND WHY IT IS THIS SIZE.
 *
 * The first cut was LEAD 192 / BAND 256, which put the mountain's centre 576m
 * out and the city's 1088m. Then somebody measured how far a run actually gets.
 * A bot that flees up-screen AND diverts for prizes - so that it scores, climbs
 * the threat ladder and eventually dies, which is what a player does - covered
 * a median of 40m and a best of 130m over five runs, dying between 3 and 39
 * seconds in. At that geography three of the four biomes were unreachable: four
 * biomes built, one ever played.
 *
 * So the bands are a quarter of the size. The mountain takes over at 128m, the
 * beach at 192m and the city at 256m, and the cycle repeats every 256m. The
 * median run still spends its whole life in the forest, which is right - that
 * is the home ground - but a good one now crosses two or three biomes.
 *
 * BAND IS NOT A FREE PARAMETER. Lakes recur every LAKE_PERIOD (1024m), and a
 * lake keeps the same biome only if BIOME_COUNT * BAND divides that. 4 * 64 is
 * 256 and 1024 is 4 * 256, so every lake lands at the same phase forever. A
 * "nicer" 96 would put lakes in a different biome each time.
 */
const LEAD = 64;
/** Metres per biome band. See above: 4 * BAND must divide LAKE_PERIOD. */
const BAND = 64;
/**
 * Metres of cross-fade, centred on each boundary. A chunk is 32m, so this is
 * one chunk row of mixed obstacle species - and that would be a wall if the
 * species were the only thing that changed. It is not: the ground tint is
 * per-fragment and the scatter tint per-position, so both cross the boundary
 * continuously, and the chunk row that does flip is dithered by weight rather
 * than switched. Half the band is deliberate; at BAND 64 there is not room for
 * both a long blend and a long pure stretch, and a soft edge matters more here
 * than another few metres of unmixed ground.
 */
const BLEND = 32;
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
/**
 * The boundary warp, exported so the ground shader can compute the SAME band
 * coordinate this file does. Two copies of a number that must agree is how a
 * ground tint ends up a metre out of step with the props standing on it.
 */
export const BIOME_WARP_A = WARP_A;
export const BIOME_WARP_K = WARP_K;
export const BIOME_BAND = BAND;
export const BIOME_BLEND = BLEND;

/* ------------------------------------------------------------------ water */

/**
 * THE LAKE.
 *
 * Water is a horizontal SCALAR FIELD - 0 on land, 1 in open water - and it
 * never touches Y. That is the decision the whole feature rests on, and it was
 * reached by working out what lowering the ground would actually cost:
 *
 *   - the ground is one opaque plane, so a lake bed below it would be hidden,
 *     and so would the player standing in it;
 *   - player.js resolves vertically against ground-anchored boxes, so a descent
 *     goes ballistic and re-lands dozens of times across a shoreline;
 *   - past about 1.5m of depth the horizontal collision box stops overlapping
 *     colliders at all, so a wader would walk straight THROUGH trees;
 *   - the emeem placement test would drop below every collider and start
 *     reporting "clear" unconditionally;
 *   - the Protector's stride floor collapses at the shoreline, wedging it
 *     exactly where it is also slowed.
 *
 * Every one of those disappears by not moving the ground. Water changes speed,
 * spawning and pixels. Nothing else.
 */

/** |z| of the first lake centre. */
export const LAKE_Z0 = 420;
/** Metres between lake centres. */
export const LAKE_PERIOD = 1024;
/**
 * MEAN half-depth along the travel axis: a 72m crossing, plus or minus the
 * shore warp below, so between 60m and 84m depending where you enter.
 *
 * Not deeper. At full dread the fog far plane closes to 112 * 0.68 = 76m, so a
 * wider lake would be deeper than the entire visible world at the top tiers -
 * no far shore, no landmark, nothing to tell you the crossing is finite.
 */
export const LAKE_HALF_Z = 36;
/**
 * Half-width across the travel axis. FINITE, and that is load-bearing: an
 * endless band would let a player hold one direction forever with no far shore
 * in that axis, which is a one-input escape from the whole game.
 */
export const LAKE_HALF_X = 120;
/** Metres of taper at every edge, so the shoreline is a ramp not a cliff. */
const LAKE_FEATHER = 10;

/**
 * THE SHORE WARP.
 *
 * Without this the lake is a rectangle, and a rectangle seen from a camera that
 * never rotates puts a dead straight horizontal line across the entire screen -
 * the single most computer-generated thing in the game. Screenshots of the
 * finished lake made that unmissable: not a lake, a swimming pool.
 *
 * Two sines of incommensurate period, so the shore is a long bay with smaller
 * scallops inside it and never visibly repeats across the 240m width. The phase
 * offset on the second stops both from crossing zero at the lake centre, which
 * would put a symmetry axis exactly where the player enters.
 *
 * It is a function of the offset from the lake CENTRE, not of world x, so every
 * lake has the same shore shape and the water mesh can be built once.
 */
const SHORE_A1 = 4.0, SHORE_K1 = 1 / 19;
const SHORE_A2 = 2.0, SHORE_K2 = 1 / 7;
/** Worst case |shoreWarp|. Every conservative test has to inflate by this. */
export const SHORE_WARP_MAX = SHORE_A1 + SHORE_A2;

export function shoreWarp(dx) {
  return Math.sin(dx * SHORE_K1) * SHORE_A1 + Math.sin(dx * SHORE_K2 + 1.7) * SHORE_A2;
}

export function lakeIndex(z) {
  return Math.round((-z - LAKE_Z0) / LAKE_PERIOD);
}
export function lakeCentreZ(n) {
  return -(LAKE_Z0 + n * LAKE_PERIOD);
}
/** Lakes wander across the travel axis so they are not a repeating stripe. */
export function lakeCentreX(n) {
  return Math.sin(n * 2.399) * 34;
}

/** 0 on land, 1 in open water, ramped over LAKE_FEATHER at the edges. */
export function waterAt(x, z) {
  const n = lakeIndex(z);
  if (n < 0) return 0;
  const ox = x - lakeCentreX(n);
  // The waterline bends with x. Both shores bend the SAME way, so the lake is a
  // bay that wanders rather than one that gets fatter and thinner.
  const halfZ = LAKE_HALF_Z + shoreWarp(ox);
  const dz = Math.abs(z - lakeCentreZ(n));
  if (dz >= halfZ) return 0;
  const dx = Math.abs(ox);
  if (dx >= LAKE_HALF_X) return 0;
  const fz = (halfZ - dz) / LAKE_FEATHER;
  const fx = (LAKE_HALF_X - dx) / LAKE_FEATHER;
  const f = fz < fx ? fz : fx;
  return f >= 1 ? 1 : f;
}

/**
 * Conservative: true if a disc of radius r touches water at all.
 *
 * Prop rejection MUST use this rather than testing the centre point. A slab can
 * be 1.75m in radius, so one whose centre sits just outside the shoreline would
 * still put most of its collider into the lake - a boulder standing in the
 * water that the boat then hits.
 */
export function waterNear(x, z, r) {
  const n = lakeIndex(z);
  if (n < 0) return false;
  // SHORE_WARP_MAX, not shoreWarp(ox): this test has to be conservative in the
  // same direction everywhere, and paying 6m of extra keep-out on the shallow
  // half of the shore is far cheaper than a boulder standing in the water on
  // the deep half.
  return Math.abs(z - lakeCentreZ(n)) < LAKE_HALF_Z + SHORE_WARP_MAX + r
      && Math.abs(x - lakeCentreX(n)) < LAKE_HALF_X + r;
}

/* ------------------------------------------------------------------- boat */

/** Boats per lake, spread along the near shore. */
export const BOATS_PER_LAKE = 3;
/** Metres between them: wide enough to matter, close enough that one is visible. */
const BOAT_SPACING = 56;

/**
 * Deterministic boat moorings on the NEAR (+Z) shore of lake `n`.
 *
 * Three, 56m apart across a 240m shore. The visible ground is about 72m wide at
 * 30m out on the narrowest phone the suite tests, so at least one is on screen
 * from anywhere on the approach - a boat you have to go hunting for is a boat
 * you drown looking for.
 */
export function boatSpot(n, i, out) {
  const ox = (i - 1) * BOAT_SPACING;
  out.x = lakeCentreX(n) + ox;
  // 2m inside the waterline AT THIS X. A fixed dz would beach a boat wherever
  // the shore warp bends the water away from it, and a beached boat is one the
  // player walks past on dry land wondering why it does nothing.
  out.z = lakeCentreZ(n) + LAKE_HALF_Z + shoreWarp(ox) - 2;
  return out;
}
