import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import {
  waterAt, waterNear, lakeIndex, lakeCentreX, lakeCentreZ,
  LAKE_HALF_X, LAKE_HALF_Z, LAKE_Z0, LAKE_PERIOD, shoreWarp, SHORE_WARP_MAX,
  BIOME_LEAD, BIOME_BAND, BIOME_BLEND, BIOME_COUNT, BIOME_WARP_A, BIOME_WARP_K,
  biomeAt, biomeMix, BIOME_NAMES,
} from './biome.js';

/**
 * EMEEM - infinite streaming FOREST.
 *
 * The world is an endless flat plane (y = CONFIG.world.groundY) planted with
 * three kinds of prop, mixed by CONFIG.world.propMix:
 *
 *   TREE  - a leaning trunk under a clump of canopy blobs. The tall thing you
 *           run AROUND. Blocks you at the trunk only (see COLLISION below).
 *   ROCK  - a low, jitter-faceted boulder you can hop onto with the jump
 *           button. Its collider top is exactly its visible top.
 *   BUSH  - a low clump of foliage. Soft clutter that breaks sightlines and
 *           never, ever stops you. It has NO collider at all.
 *
 * It is diced into `chunkSize` metre squares; the chunks inside `viewChunks`
 * of the player exist, everything else is thrown away.
 *
 * Four things matter here and they all pull in the same direction:
 *
 *  1. DETERMINISM. A chunk's layout comes from mulberry32 seeded by a hash of
 *     (cx, cz), never Math.random, so walking back into a chunk you unloaded
 *     five seconds ago gives you the identical forest in the identical places.
 *     Every prop's rng draws depend only on its own rolls, and the obstacle
 *     COUNT is drawn first and always costs exactly one draw, so raising the
 *     threat level can only ADD props - the ones already there never move.
 *
 *  2. DRAW CALLS. A chunk's props are merged into at most THREE geometries -
 *     one per shared material (bark, foliage, stone) - so 49 live chunks cost
 *     ~147 draw calls instead of the several thousand that one-mesh-per-prop
 *     would cost. That difference is the whole ballgame on a phone.
 *
 *  3. NO PER-FRAME ALLOCATION. queryAABB is called several times per fixed
 *     step (120Hz) by the player and the monster. It buckets colliders by
 *     chunk and refills a caller-owned array, so the hot path allocates
 *     nothing at all. Every scratch object here is hoisted to module scope.
 *
 *  4. COLLISION THAT MATCHES THE SILHOUETTE. See placeTree/placeRock/placeBush.
 *     The single worst thing a forest can do to a chase game is put invisible
 *     walls between the trees, so a tree blocks you at its TRUNK and a canopy
 *     four metres wide costs you nothing but shade.
 */

// ---------------------------------------------------------------- constants

/** Chunks built per frame while streaming. Two merges is ~1ms; a hitch is worse. */
const MAX_BUILDS_PER_FRAME = 2;

/** Radius (in chunks) built synchronously on reset so the first frame isn't bare. */
const PRIME_RADIUS = 2;

/** Trunks sink this far below the ground plane so their open base never shows. */
const TRUNK_SINK = 0.12;

/** Vertical shading baked into vertex colours: dark at the base, full at the top. */
const SHADE_BOTTOM = 0.74;
const SHADE_TOP = 1.06;

/** Minimum gap enforced between two props' footprint circles in a chunk. */
const OBSTACLE_GAP = 0.35;

/** Attempts to find a legal spot for one prop before giving up on it. */
const PLACE_ATTEMPTS = 6;

/**
 * A boulder's collider is the axis-aligned box of its actual (jittered,
 * squashed, rotated) geometry, pulled in horizontally by this much. A boulder
 * is round: the full AABB would leave you standing on thin air out at the
 * corners, where the visible stone has already sloped away.
 */
const ROCK_COLLIDER_SHRINK = 0.82;

/**
 * Trunk collider half-width = trunk bottom radius * this + pad. Slightly wider
 * than the bark, and still only ~a third of the canopy it holds up.
 *
 * The box is vertical while the trunk leans, so it contains the bark only up to
 * the height where the lean has eaten the pad. Measured over a trees-only
 * forest at TREE_LEAN_MAX, the tightest gap between bark and collider face
 * anywhere below the player's 1.5m is 0.106m, i.e. the trunk is wholly inside
 * its own collider everywhere the player can touch it. Higher up a leaning
 * trunk does drift outside - up to ~0.48m at the crown, which costs nothing,
 * since nothing collides up there. That margin, not this spread, is what
 * bounds TREE_LEAN_MAX: raise the lean far enough and the hand starts passing
 * through bark at head height.
 */
const TRUNK_COLLIDER_SPREAD = 1.25;
const TRUNK_COLLIDER_PAD = 0.05;

/**
 * Integer chunk keys. A `${cx},${cz}` string would allocate on every bucket
 * lookup inside queryAABB; this packs the pair into one SMI instead.
 * Range is +/-16383 chunks = +/-524km, which no run will ever reach.
 */
const KEY_OFFSET = 16384;
const KEY_STRIDE = 32768;

const TAU = Math.PI * 2;

// ------------------------------------------------------------------ scratch
// Hoisted so nothing in the per-frame or per-chunk path allocates.

const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _quatB = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scl = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _off = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const _colA = new THREE.Color();
const _colB = new THREE.Color();
const _colC = new THREE.Color();

/**
 * Smallest linear channel the per-biome ground ratio will divide by. The forest
 * ground at full dread is 0.023 linear at its darkest channel, so this is never
 * reached in practice - it is here so that a future palette edit cannot hand
 * the shader an Infinity and paint the whole world white.
 */
const GROUND_RATIO_FLOOR = 0.0025;
const _bscratch = { a: 0, b: 0, w: 0 };

/** Per-chunk geometry lists, one per shared material. Reused, never reallocated. */
const _bark = [];
const _leaf = [];
const _stone = [];

/** World-space extents of the last geometry paint() walked: minXYZ then maxXYZ. */
const _ext = new Float64Array(6);

// --------------------------------------------------------------- primitives

/**
 * mulberry32 - 32-bit PRNG, ~10 ops, excellent distribution for our purposes.
 * Seeded per chunk so chunk content is a pure function of (cx, cz).
 */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer hash of a chunk coordinate pair -> PRNG seed. */
function hashChunk(cx, cz) {
  let h = Math.imul(cx | 0, 0x27d4eb2d) ^ Math.imul(cz | 0, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x2545f491);
  h ^= h >>> 13;
  h = Math.imul(h, 0x27d4eb2d);
  return (h ^ (h >>> 16)) >>> 0;
}

function chunkKey(cx, cz) {
  return (cx + KEY_OFFSET) * KEY_STRIDE + (cz + KEY_OFFSET);
}

/** Uniform sample in [a, b) from a seeded rng. */
function range(rng, a, b) {
  return a + (b - a) * rng();
}

/** Deterministic index into a pool of variants. */
function pick(rng, n) {
  const i = (rng() * n) | 0;
  return i < 0 ? 0 : i >= n ? n - 1 : i;
}

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
/** Config reader: falls back when a key is missing or not a finite number. */
const num = (v, dflt) => (Number.isFinite(v) ? v : dflt);

/**
 * True only for a usable streaming centre. A non-finite player coordinate is
 * unrecoverable here: Math.floor(NaN) keys a chunk by NaN, every NaN comparison
 * in the unload test is false so that chunk can never be evicted, and its NaN
 * colliders sit in the shared list poisoning every queryAABB for the rest of
 * the run. Cheaper to refuse the coordinate at the door and keep streaming
 * around the last good one.
 */
function usableCoord(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

// ------------------------------------------------------------ base geometry

/**
 * Position-keyed hash. An icosahedron from PolyhedronGeometry is NON-indexed,
 * so each of its twelve corners appears in five triangles as five separate but
 * bitwise-identical vertices. Keying the jitter off the position means those
 * five copies always move together - jittering per-vertex instead would tear
 * the solid open along every shared edge.
 */
function cornerNoise(x, y, z, salt) {
  let h = Math.imul((Math.round(x * 4096) | 0) ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (Math.round(y * 4096) | 0), 0xc2b2ae35);
  h = Math.imul(h ^ (Math.round(z * 4096) | 0), 0x27d4eb2d);
  h = Math.imul(h ^ (salt | 0) ^ (h >>> 13), 0x165667b1);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Adds the white `color` attribute every mergeable prop geometry must carry. */
function withColor(g) {
  g.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(1), 3),
  );
  return g;
}

/** Unit icosahedron, 20 faces, no uv (there are no maps anywhere in this game). */
const BLOB_SOURCE = new THREE.IcosahedronGeometry(1, 0);
BLOB_SOURCE.deleteAttribute('uv');

/**
 * A pool of pre-jittered blobs, built ONCE at module load. Per prop we clone
 * one and hit it with a scale/rotate/translate matrix, which is far cheaper
 * than re-jittering and re-normalising 60 vertices for every rock in a chunk,
 * and - crossed with random squash, yaw and size - still means no two boulders
 * in a run look alike.
 *
 * `minY`/`maxY`/`maxR` are the variant's own local extents, cached so a prop
 * can be seated on the ground to an exact visible height without measuring.
 */
function makeBlobPool(count, jitter, salt0) {
  const geoms = [];
  const minY = new Float64Array(count);
  const maxY = new Float64Array(count);
  const absY = new Float64Array(count);
  const maxR = new Float64Array(count);

  for (let v = 0; v < count; v++) {
    const g = BLOB_SOURCE.clone();
    const pos = g.attributes.position.array;
    let lo = Infinity;
    let hi = -Infinity;
    let rr = 0;
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const y = pos[i + 1];
      const z = pos[i + 2];
      const s = 1 + (cornerNoise(x, y, z, salt0 + v * 9973) - 0.5) * 2 * jitter;
      const nx = x * s;
      const ny = y * s;
      const nz = z * s;
      pos[i] = nx;
      pos[i + 1] = ny;
      pos[i + 2] = nz;
      if (ny < lo) lo = ny;
      if (ny > hi) hi = ny;
      const r2 = nx * nx + nz * nz;
      if (r2 > rr) rr = r2;
    }
    // Non-indexed + recomputed normals = flat facets, which is what makes a
    // 20-triangle lump read as stone or as a leaf clump rather than as a ball.
    g.computeVertexNormals();
    withColor(g);
    geoms.push(g);
    minY[v] = lo;
    maxY[v] = hi;
    // The jitter is not symmetric, so a blob reaches further below its centre
    // than above it (or the other way about). Vertical scaling normalises by
    // the LARGER of the two, which is what lets a canopy promise that no leaf
    // hangs below its stated underside.
    absY[v] = Math.max(Math.abs(lo), Math.abs(hi)) || 1;
    maxR[v] = Math.sqrt(rr) || 1;
  }
  return { geoms, minY, maxY, absY, maxR, count };
}

/** Canopies and bushes: gently irregular. */
const FOLIAGE_BLOBS = makeBlobPool(5, 0.17, 0x51ed);
/** Boulders: hard, angular jitter so the facets catch the sun. */
const ROCK_BLOBS = makeBlobPool(5, 0.31, 0x2b9f);

/**
 * Symmetric U-shaped roll on [0,1]. v is uniform on [-1,1]; raising |v| to a
 * power BELOW one pushes it toward the ends of the band, so a rock comes out
 * decidedly small or decidedly big and the middling ones - the ones you cannot
 * read at a glance - are rare. P(middle third) = 3^(-1/spread).
 */
function sizeRoll(rng, spread) {
  const v = rng() * 2 - 1;
  return 0.5 + 0.5 * Math.sign(v) * Math.pow(Math.abs(v), spread);
}
const bandRoll = (rng, band, spread) => band[0] + (band[1] - band[0]) * sizeRoll(rng, spread);

/**
 * A unit trunk: six-sided, tapered, open-ended, origin at the centre of its
 * BOTTOM face so a lean rotates about where it meets the ground. Open-ended
 * halves the vertex count; the base is buried by TRUNK_SINK and the top always
 * sits inside the first canopy blob, so neither cap is ever visible.
 */
function makeTrunk(taper) {
  const src = new THREE.CylinderGeometry(taper, 1, 1, 6, 1, true);
  src.deleteAttribute('uv');
  src.translate(0, 0.5, 0);
  const g = src.toNonIndexed(); // keeps every merge group homogeneous
  src.dispose();
  g.computeVertexNormals();
  return withColor(g);
}

const TRUNKS = [makeTrunk(0.56), makeTrunk(0.74)];

/**
 * Unit box for city pylons, non-indexed so it merges with everything else and
 * carrying the white colour attribute every mergeable prop must have. Centred
 * on its own base so a scale in Y raises the top and leaves the foot on the
 * ground, exactly like the trunks.
 */
const BOX_SOURCE = (() => {
  const g = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
  g.deleteAttribute('uv');
  g.translate(0, 0.5, 0);
  return withColor(g);
})();

/**
 * Bakes a prop's tint and a vertical fake-AO gradient into its vertex colours,
 * and records the geometry's world-space extents in `_ext` on the way past.
 * The colours MULTIPLY the shared material colour, so the dread recolouring in
 * update() still works while the merged mass stops reading as one flat slab.
 */
function paint(geo, baseY, spanY, cr, cg, cb) {
  const pos = geo.attributes.position.array;
  const col = geo.attributes.color.array;
  const inv = spanY > 1e-4 ? 1 / spanY : 0;
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i];
    const y = pos[i + 1];
    const z = pos[i + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;

    let t = (y - baseY) * inv;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;
    const sh = SHADE_BOTTOM + (SHADE_TOP - SHADE_BOTTOM) * t;
    col[i] = sh * cr;
    col[i + 1] = sh * cg;
    col[i + 2] = sh * cb;
  }

  _ext[0] = minX;
  _ext[1] = minY;
  _ext[2] = minZ;
  _ext[3] = maxX;
  _ext[4] = maxY;
  _ext[5] = maxZ;
}

/**
 * Composes a free-floating blob. The half-extents are metres and they are a
 * PROMISE: no vertex ends up further than halfX/halfY/halfZ from the centre,
 * which is what the canopy floor guarantee in placeTree rests on.
 */
function composeBlob(pool, vi, halfX, halfY, halfZ, yaw, x, y, z) {
  const mr = pool.maxR[vi];
  const my = pool.absY[vi];
  _pos.set(x, y, z);
  _quat.setFromAxisAngle(_up, yaw);
  _scl.set(halfX / mr, halfY / my, halfZ / mr);
  _mat4.compose(_pos, _quat, _scl);
}

/**
 * Composes a blob SEATED on the ground: its top lands exactly at
 * groundY + topH, and `buryFrac` of that height is sunk below the plane so the
 * thing looks settled into the leaf litter instead of dropped on it.
 * Solving for the scale from the variant's own extents is what lets a rock's
 * collider top be its visible top rather than an estimate of it.
 */
function composeSeated(pool, vi, radius, aspect, topH, buryFrac, yaw, x, z, groundY) {
  const mr = pool.maxR[vi];
  const lo = pool.minY[vi];
  const hi = pool.maxY[vi];
  const span = hi - lo || 1;
  const sy = (topH * (1 + buryFrac)) / span;
  _pos.set(x, groundY + topH - sy * hi, z);
  _quat.setFromAxisAngle(_up, yaw);
  _scl.set(radius / mr, sy, (radius * aspect) / mr);
  _mat4.compose(_pos, _quat, _scl);
}

// -------------------------------------------------------------- ground grid

/**
 * Injects a world-space grid + chunk checker into a Lambert material.
 * World-space (not UV-space) means the pattern is nailed to the world and does
 * not swim when the ground mesh teleports to follow the player. It fades out
 * with distance, otherwise the lines alias into a grey soup at the horizon.
 */
/**
 * @param {THREE.Material} material
 * @param {number} cellSize
 * @param {number} chunkSize
 * @param {object} biome  { lead, band, half, warpA, warpK } and a `ratios`
 *   array of four THREE.Color multipliers, one per biome, FOREST exactly white.
 *   Hoisted out of onBeforeCompile so the caller can keep writing to them after
 *   the program is compiled - a uniform object created inside the callback is
 *   unreachable from anywhere else.
 * @returns {object} the live uniform objects, for applyDread to write into.
 */
function applyGridShader(material, cellSize, chunkSize, biome) {
  const uniforms = {
    uCell: { value: cellSize },
    uChunk: { value: chunkSize },
    uBiomeG: { value: biome.ratios },
    uLead: { value: biome.lead },
    uBand: { value: biome.band },
    uHalf: { value: biome.half },
    uWarpA: { value: biome.warpA },
    uWarpK: { value: biome.warpK },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n\tvWorldPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;',
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vWorldPos;\nuniform float uCell;\nuniform float uChunk;\n'
        + 'uniform vec3 uBiomeG[ 4 ];\nuniform float uLead;\nuniform float uBand;\n'
        + 'uniform float uHalf;\nuniform float uWarpA;\nuniform float uWarpK;',
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
	{
		// Analytic anti-aliased grid: distance to the nearest cell line measured
		// in pixels via screen-space derivatives.
		vec2 p = vWorldPos.xz / uCell;
		vec2 w = max( fwidth( p ), vec2( 1e-5 ) );
		vec2 g = abs( fract( p - 0.5 ) - 0.5 ) / w;
		float line = 1.0 - min( min( g.x, g.y ), 1.0 );
		// Kill the grid before it turns into moire in the distance; fog takes over.
		float fade = 1.0 - smoothstep( 25.0, 80.0, distance( vWorldPos, cameraPosition ) );
		// Chunk-sized checker gives the eye a sense of speed and scale.
		vec2 cc = floor( vWorldPos.xz / uChunk );
		float checker = mod( cc.x + cc.y, 2.0 );

		// THE BIOME, per fragment.
		//
		// The exact twin of biomeMix() in biome.js, and it has to be exact: the
		// ground is ONE plane that follows the player and spans several bands at
		// once, so the CPU cannot tell it which biome it is in - only where it
		// is. The indexed form below resolves all four in one block, and is
		// algebraically identical to the branchy JS version at half = blend /
		// ( 2 * band ). tools/biome-node.mjs checks the JS; tools/biome.mjs
		// checks that this agrees with it.
		//
		// Dynamic indexing of a uniform array is GLSL ES 3.00, which is fine
		// here: main.js refuses to start without WebGL2, so three.js always
		// compiles #version 300 es.
		float bu = max( ( -vWorldPos.z - uLead + sin( vWorldPos.x * uWarpK ) * uWarpA ) / uBand, 0.0 );
		float bi = floor( bu + uHalf );
		float bw = clamp( ( bu - bi + uHalf ) / ( 2.0 * uHalf ), 0.0, 1.0 );
		// The lead is pure forest, and without this the band BEFORE the first one
		// wraps round to the last biome and bleeds it over the start of the world.
		bw = bi < 1.0 ? 1.0 : bw;
		vec3 tint = mix( uBiomeG[ int( mod( bi - 1.0, 4.0 ) ) ], uBiomeG[ int( mod( bi, 4.0 ) ) ], bw );

		diffuseColor.rgb *= tint * ( 1.0 + ( checker - 0.5 ) * 0.055 ) * ( 1.0 - line * 0.22 * fade );
	}`,
      );
  };
  // Without this two Lambert materials could share a compiled program and one
  // would silently lose the injection. Bumped when the injected source changes,
  // or a cached program from the old source is reused with the new uniforms.
  material.customProgramCacheKey = () => 'emeem-ground-grid-biome';
  return uniforms;
}

// ================================================================== factory

/**
 * @param {object} ctx - { THREE, CONFIG, state, bus, scene, camera, ... }
 * @returns {{group: THREE.Group, colliders: Array, queryAABB: Function,
 *            sampleGroundY: Function, update: Function, reset: Function}}
 */
export function createWorld(ctx) {
  const CONFIG = ctx.CONFIG;
  const W = CONFIG.world;
  const P = CONFIG.palette;
  /** Four ground pairs, indexed by biome. Entry 0 must equal the base pair. */
  const BIOME_PALETTES = (P.biomes && P.biomes.length === BIOME_COUNT)
    ? P.biomes
    : new Array(BIOME_COUNT).fill({ groundCalm: P.groundCalm, groundDread: P.groundDread });
  const CS = W.chunkSize;
  const VIEW = W.viewChunks;

  const group = new THREE.Group();
  group.name = 'world';
  group.matrixAutoUpdate = false;

  // ------------------------------------------------------------- prop sizes
  // Derived from the config so retuning obstacleMaxSize/Height, the jump or the
  // camera actually changes the forest instead of silently disagreeing with it.

  const HALF_MIN = W.obstacleMinSize * 0.5;
  const HALF_MAX = W.obstacleMaxSize * 0.5;

  /** Apex of a jump, in metres above the feet: v^2 / 2g. */
  const JUMP_APEX =
    (CONFIG.player.jumpVelocity * CONFIG.player.jumpVelocity) /
    (2 * Math.abs(CONFIG.player.gravity));

  /**
   * Lowest a canopy may ever hang. The chase camera rides at camera.height
   * above the player's feet, so keeping every leaf above that means a tree can
   * shade you but can never swallow the camera - the one thing a forest can do
   * to a fixed-heading chase cam that would be unforgivable. The 15cm on top is
   * headroom the geometry is not allowed to spend.
   */
  const CANOPY_FLOOR = CONFIG.camera.height + 0.15;

  const TREE_H_MIN = W.treeHeightMin;   // 8.0
  const TREE_H_MAX = W.treeHeightMax;   // 11.0
  /** Crown radius ceiling as a fraction of the TREE's own height, so a tall
   *  tree gets a proportionate canopy instead of the generic prop half-size. */
  const CROWN_R_PER_H = 0.42;
  const CROWN_R_MIN = 1.2;
  /** Trunk bottom radius as a fraction of tree height: slenderness 7.2 to 11.1.
   *  Thickness follows the TREE, not the crown - a 9m tree on the old
   *  0.19-0.39m trunk is a broom handle. */
  const TRUNK_R_PER_H_MIN = 0.045;
  const TRUNK_R_PER_H_MAX = 0.069;
  const TREE_LEAN_MAX = 0.18; // radians, ~10 degrees. Breaks the warehouse look.
  /** Metres the trunk TOP may wander off its base. The lean has to be capped by
   *  DISPLACEMENT rather than by angle now: a fixed 0.18 rad on an 11m trunk
   *  drags the canopy 1.97m sideways, which reads as a fallen tree rather than
   *  a leaning one - and drags the bark that far outside its vertical collider. */
  const TREE_LEAN_XZ_MAX = 1.1;
  /** Worst-case height a leaning trunk gives up, now bounded by that displacement. */
  const LEAN_LOSS = TREE_H_MAX - Math.sqrt(TREE_H_MAX * TREE_H_MAX - TREE_LEAN_XZ_MAX * TREE_LEAN_XZ_MAX);
  /** How far below the trunk top the lowest leaf may reach, as a fraction of crown height. */
  const CANOPY_DROP = 0.2;
  /** Shortest crown worth drawing. 1.0 was fine on a 5m tree; on a 9.5m one it
   *  is a flagpole. */
  const MIN_CROWN_H = 1.8;
  /** Trunk height the canopy floor demands of a tree of total height h. */
  const minTrunkFor = (h) => (CANOPY_FLOOR + LEAN_LOSS + CANOPY_DROP * h) / (1 + CANOPY_DROP);
  /**
   * Shortest a tree can be and still hold a real crown above CANOPY_FLOOR.
   * Solving minTrunkFor(h) <= h - MIN_CROWN_H gives exactly this, so no config
   * edit can produce a tree whose canopy has to be squashed into nothing to
   * stay above the camera.
   */
  const MIN_TREE_H = CANOPY_FLOOR + LEAN_LOSS + MIN_CROWN_H * (1 + CANOPY_DROP);

  /**
   * Tall enough to jump onto and no taller. Tie it to the actual jump so a
   * change to jumpVelocity can never quietly produce un-hoppable boulders.
   */
  /**
   * The three rock jobs, from config. Their bands are absolute metres rather
   * than fractions of a generic prop size, because what makes a rock a platform
   * or a wall is its height against the PLAYER's jump, not against other props.
   *
   * Note JUMP_APEX above is the CONTINUOUS v^2/2g and is 3.5cm low: the 120Hz
   * integrator takes velocity first, so the discrete apex is v0*dt/2 higher.
   * Nothing here uses JUMP_APEX any more - CONFIG.world.rockHopCeiling carries
   * the measured 1.525 instead, and the bands are checked against it below.
   */
  const ROCK = W.rock;
  const ROCK_SPREAD = num(W.rockSizeSpread, 0.55);
  const HUMMOCK_SHARE = num(W.hummockShare, 0.30);
  const STACK_SHARE = num(W.stackShare, 0.34);
  /**
   * Edge-to-edge gap of a deliberate slab/block pair, and the largest rise the
   * pair may have. 2.15m is wide enough that you cannot fall between them by
   * accident and short enough that the hop is one clear input.
   * The rise stops 0.175m under the 1.525m ceiling so a mistimed launch still
   * gets up; its lower bound (0.55, in placeRock) sits 0.20m clear of the 0.35m
   * step-up window, so the climb is always a jump and never a teleport.
   */
  const STACK_GAP = 2.15;
  const STACK_RISE_MAX = 1.35;
  const SCATTER_PER_CHUNK = Math.max(0, Math.round(num(W.scatterPerChunk, 36)));
  /**
   * Deepest water that still gets scattered gravel, as a waterAt value. The
   * shore feather is 10m wide, so 0.35 is the outer 3.5m of it - a shoreline
   * band, not a lake bed. See the keep-out in the SCATTER pass.
   */
  const SHALLOW_MAX = 0.35;

  /**
   * Collider tops an emeem may sit on, rebuilt beside the flat collider list.
   * Eligibility is tested on the AABB alone, so nothing needs new metadata:
   *   top in [0.50, 2.35]  - excludes tree trunks, whose collider runs the
   *                          tree's whole 8-11m, and anything at ground level
   *   min(halfX, halfZ) >= 0.70 - excludes anything too narrow to stand on
   * Cobbles and bushes never appear because they push no collider at all.
   * What is left is exactly the slabs and the blocks.
   */
  const PERCH_TOP_MIN = 0.50;
  const PERCH_TOP_MAX = 2.35;
  const PERCH_HALF_MIN = 0.70;
  /** Keeps a perched emeem's disc clear of the lip: its radius plus a margin. */
  const PERCH_INSET = num(CONFIG.emeem.radius, 0.22) + 0.30;
  const HOP_CEIL = num(W.rockHopCeiling, 1.525);
  const rockShares = [
    ['cobble', num(ROCK.cobble.share, 0.30)],
    ['slab', num(ROCK.slab.share, 0.46)],
    ['block', num(ROCK.block.share, 0.24)],
  ];
  const rockShareTotal = rockShares.reduce((a, r) => a + r[1], 0) || 1;

  // Build-time guards. These are the two rules the whole rock design rests on,
  // so they fail loudly at load rather than quietly in the field.
  if (ROCK.slab.h[1] >= HOP_CEIL) {
    throw new Error(`world: slab top ${ROCK.slab.h[1]} must stay under the hop ceiling ${HOP_CEIL}`);
  }
  if (ROCK.block.h[0] <= HOP_CEIL) {
    throw new Error(`world: block base ${ROCK.block.h[0]} must clear the hop ceiling ${HOP_CEIL}`);
  }

  /**
   * THE BUNDLES: config's per-biome rules, pre-chewed into the form buildChunk
   * wants. Cumulative thresholds so one rng draw picks a species, a total to
   * scale that draw by, and every band pre-clamped against the same build-time
   * guards the forest's own numbers are held to.
   */
  const RAW_BUNDLES = (W.biomes && W.biomes.length === BIOME_COUNT) ? W.biomes : null;
  const BUNDLES = [];
  for (let i = 0; i < BIOME_COUNT; i++) {
    const raw = RAW_BUNDLES ? RAW_BUNDLES[i] : null;
    // Read propMix directly rather than the mTree/mRock/mBush consts below:
    // those are declared after this block and would be in their temporal
    // dead zone here.
    const pm = W.propMix || {};
    const mix = (raw && raw.mix) || { tree: pm.tree, rock: pm.rock, bush: pm.bush };
    const order = ['tree', 'rock', 'bush', 'fallen', 'dune', 'pylon'];
    const cum = [];
    let acc = 0;
    for (const k of order) { acc += Math.max(0, Number(mix[k]) || 0); cum.push(acc); }
    const t = (raw && raw.tint) || {};
    BUNDLES.push({
      name: (raw && raw.name) || 'forest',
      cum,
      total: acc || 1,
      treeH: (raw && raw.treeH) || [TREE_H_MIN, TREE_H_MAX],
      bareTrees: num(raw && raw.bareTrees, 0),
      rock: (raw && raw.rock) || null,
      bushScale: num(raw && raw.bushScale, 1),
      scatterMul: num(raw && raw.scatterMul, 1),
      pebbleShare: num(raw && raw.pebbleShare, 0.45),
      tint: {
        bark: t.bark || [1, 1, 1],
        leaf: t.leaf || [1, 1, 1],
        stone: t.stone || [1, 1, 1],
      },
    });
  }
  // Per-biome rock shares, resolved the same way the forest's are.
  for (const b of BUNDLES) {
    const r = b.rock || { cobble: ROCK.cobble.share, slab: ROCK.slab.share, block: ROCK.block.share };
    const list = [['cobble', num(r.cobble, 0)], ['slab', num(r.slab, 0)], ['block', num(r.block, 0)]];
    const tot = list.reduce((a, x) => a + x[1], 0) || 1;
    b.rockShares = list;
    b.rockTotal = tot;
  }

  const FALLEN = W.fallen || { len: [4, 9], radius: [0.22, 0.46] };
  const DUNE = W.dune || { halfX: [2.2, 4.4], top: [0.55, 1.30] };
  const PYLON = W.pylon || { half: [1.1, 2.4], height: [4.5, 9.5], spacing: 3.6 };
  // The same rule the slabs are held to: a log or a dune is a thing you HOP,
  // so its top must clear neither more nor less than the measured ceiling.
  if (DUNE.top[1] >= HOP_CEIL) {
    throw new Error(`world: dune top ${DUNE.top[1]} must stay under the hop ceiling ${HOP_CEIL}`);
  }
  if (FALLEN.radius[1] * 2 >= HOP_CEIL) {
    throw new Error(`world: a log of radius ${FALLEN.radius[1]} is ${FALLEN.radius[1] * 2} tall, over the hop ceiling ${HOP_CEIL}`);
  }
  // And the opposite rule for a pylon: never hoppable, never a rock.
  if (PYLON.height[0] <= HOP_CEIL) {
    throw new Error(`world: pylon base height ${PYLON.height[0]} must clear the hop ceiling ${HOP_CEIL}`);
  }

  const BUSH_R_MIN = HALF_MIN;
  const BUSH_R_MAX = HALF_MAX * 0.62;
  const BUSH_H_MIN = 0.4;
  const BUSH_H_MAX = 1.3;

  // Normalised propMix -> cumulative thresholds for one rng draw.
  const MIX = W.propMix || {};
  const mTree = Math.max(0, Number(MIX.tree) || 0);
  const mRock = Math.max(0, Number(MIX.rock) || 0);
  const mBush = Math.max(0, Number(MIX.bush) || 0);
  const mSum = mTree + mRock + mBush;
  const MIX_TREE = mSum > 0 ? mTree / mSum : 0.44;
  const MIX_ROCK_END = mSum > 0 ? (mTree + mRock) / mSum : 0.7;

  // -------------------------------------------------------------- materials
  // Three materials for the whole world. Their colours are lerped toward the
  // dread palette in update(), which recolours all 49 chunks for free.
  const barkMaterial = new THREE.MeshLambertMaterial({
    color: P.obstacleCalm,
    vertexColors: true,
    dithering: true,
  });
  const foliageMaterial = new THREE.MeshLambertMaterial({
    color: P.foliageCalm,
    vertexColors: true,
    dithering: true,
  });
  const stoneMaterial = new THREE.MeshLambertMaterial({
    color: P.rockCalm,
    vertexColors: true,
    dithering: true,
  });

  const groundMaterial = new THREE.MeshLambertMaterial({
    color: P.groundCalm,
    dithering: true,
  });
  /**
   * One ratio per biome, live: applyDread writes into these and the ground
   * shader reads them the same frame. The FOREST entry is pinned to (1,1,1) and
   * never written, so the shipped forest is bit-identical to before the biomes
   * existed.
   */
  const biomeRatios = [];
  for (let i = 0; i < BIOME_COUNT; i++) biomeRatios.push(new THREE.Color(1, 1, 1));
  const groundUniforms = applyGridShader(groundMaterial, CS / 8, CS, {
    ratios: biomeRatios,
    lead: BIOME_LEAD,
    band: BIOME_BAND,
    // The blend half-width in band units - the same HALF the JS biomeMix uses.
    half: BIOME_BLEND / (2 * BIOME_BAND),
    warpA: BIOME_WARP_A,
    warpK: BIOME_WARP_K,
  });

  // ----------------------------------------------------------------- ground
  // A single plane that follows the player, snapped to whole chunks, instead of
  // per-chunk ground meshes. Half of it must still clear fogFar after
  // followGround() snaps it, which can leave the player up to CS/2 off centre.
  // Deriving the floor from fogFar means raising the fog distance widens the
  // plane instead of silently hanging its edge where the player can see it.
  const GROUND_SIZE = Math.max(
    (VIEW * 2 + 5) * CS,
    Math.ceil(((W.fogFar + CS) * 2) / CS) * CS,
  );
  const groundGeometry = new THREE.PlaneGeometry(GROUND_SIZE, GROUND_SIZE, 1, 1);
  groundGeometry.rotateX(-Math.PI / 2);
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.name = 'ground';
  groundMesh.receiveShadow = true;
  groundMesh.castShadow = false;
  groundMesh.matrixAutoUpdate = false;
  // The player is always over the middle of it, so culling it is never right.
  groundMesh.frustumCulled = false;
  groundMesh.position.set(0, W.groundY, 0);
  groundMesh.updateMatrix();
  group.add(groundMesh);

  /**
   * THE WATER SURFACE. One plane, one material, one draw call, moved to
   * whichever lake is nearest rather than one mesh per lake - only ever one is
   * within the 112m fog anyway.
   *
   * It sits 2cm above the ground rather than below it, because the ground is
   * opaque and the world is flat: there is no basin to look into. What sells it
   * is that it is TRANSPARENT and the lake bed keeps its scattered pebbles, so
   * you see ground through water rather than a blue lid on a green field.
   * depthWrite is off so nothing sorts behind it wrongly.
   */
  const waterMaterial = new THREE.MeshLambertMaterial({
    color: 0x2f6f8f,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  /**
   * The surface has to agree with waterAt() exactly, warped shoreline and all,
   * or there is water you can see and not swim in, or swim in and not see. So
   * the plane is segmented along X and its two edge rows are displaced by the
   * same shoreWarp the field uses.
   *
   * The geometry is built ONCE, in lake-local coordinates, which is the whole
   * reason shoreWarp takes an offset from the lake centre rather than a world
   * x: every lake has the same shore shape, so moving the mesh is still a
   * position assignment and not a rebuild.
   *
   * 2m per segment, 240 triangles for the whole lake. A quarter of one tree.
   */
  const WATER_SEGS = Math.round((LAKE_HALF_X * 2) / 2);
  const waterGeometry = new THREE.PlaneGeometry(LAKE_HALF_X * 2, LAKE_HALF_Z * 2, WATER_SEGS, 1);
  {
    // rotation.x = -PI/2 maps local +y to world -z, so the +y row is the FAR
    // shore and the -y row is the near one. Pushing each outward means adding
    // the warp to |y| and keeping the sign - one line that bends both shores
    // the same way, which is what makes it a bay rather than a bulge.
    const pos = waterGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      pos.setY(i, y + Math.sign(y) * shoreWarp(pos.getX(i)));
    }
    pos.needsUpdate = true;
    waterGeometry.computeVertexNormals();
  }
  const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
  waterMesh.name = 'water';
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.receiveShadow = false;
  waterMesh.castShadow = false;
  waterMesh.renderOrder = 1;
  waterMesh.visible = false;
  group.add(waterMesh);

  /**
   * WAKES.
   *
   * The world is flat and nothing may move in Y, so a wader cannot sink: the
   * hand stands ON the water plane looking like it is walking on the lake. The
   * speed drop says you are wading and the picture says you are not, and the
   * picture wins.
   *
   * A wake fixes it without touching Y - a ring on the surface that expands and
   * fades on a loop, exactly the horizontal-only trick the water field itself
   * is built on. Two singleton meshes, two draw calls, and only while something
   * is actually in the water.
   *
   * The rings deliberately do NOT track speed. A wake that stops when you stop
   * would need a velocity the world does not have to hand, and a ring that is
   * always spreading reads as water lapping at whatever is standing in it -
   * which is what a wader looks like anyway.
   */
  const WAKE_PERIOD = 1.15;      // seconds per ripple
  const WAKE_R0 = 0.55;          // ring radius at birth, in body radii
  const WAKE_R1 = 2.30;          // and at death
  const wakeGeometry = new THREE.RingGeometry(0.82, 1.0, 28);
  wakeGeometry.rotateX(-Math.PI / 2);

  function makeWake(scale) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd8f0f6,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(wakeGeometry, mat);
    mesh.rotation.set(0, 0, 0);
    mesh.renderOrder = 2;          // after the water, which is renderOrder 1
    mesh.visible = false;
    mesh.frustumCulled = false;    // it is always within a few metres of the camera target
    mesh.userData.baseScale = scale;
    group.add(mesh);
    return mesh;
  }
  const playerWake = makeWake(0.62);
  const monsterWake = makeWake(1.35);
  let wakePhase = 0;

  /**
   * @param {THREE.Mesh} mesh   the ring
   * @param {object} pos        something with x and z
   * @param {number} phase      0..1 through this ring's ripple
   * @param {number} scale      extra size multiplier (the Protector grows)
   */
  function placeWake(mesh, pos, phase, scale) {
    if (!pos) { mesh.visible = false; return; }
    const wet = waterAt(pos.x, pos.z);
    // 0.15 rather than 0: the outermost centimetres of the feather are damp
    // ground, and a ring blinking on there would strobe along the whole shore.
    if (wet <= 0.15) { mesh.visible = false; return; }
    const r = (WAKE_R0 + (WAKE_R1 - WAKE_R0) * phase) * mesh.userData.baseScale * scale;
    mesh.position.set(pos.x, W.groundY + 0.035, pos.z);
    mesh.scale.set(r, 1, r);
    // Fade in fast, out slowly: a ring that appears at full strength pops.
    const fade = phase < 0.15 ? phase / 0.15 : 1 - (phase - 0.15) / 0.85;
    mesh.material.opacity = 0.42 * fade * Math.min(1, wet / 0.4);
    mesh.visible = mesh.material.opacity > 0.01;
  }

  function updateWakes(dt, s) {
    wakePhase += dt / WAKE_PERIOD;
    if (wakePhase >= 1) wakePhase -= Math.floor(wakePhase);
    placeWake(playerWake, s.player && s.player.pos, wakePhase, 1);
    // Half a period out of step, so the two are never a matching pair of
    // circles pulsing in lockstep across the lake.
    const mp = wakePhase >= 0.5 ? wakePhase - 0.5 : wakePhase + 0.5;
    placeWake(monsterWake, s.monster && s.monster.pos, mp,
      Math.max(1, (s.monster && s.monster.scale) || 1));
  }

  /** Puts the water plane on the nearest lake, or hides it if none is close. */
  function placeWater(px, pz) {
    const n = lakeIndex(pz);
    if (n < 0) { waterMesh.visible = false; return; }
    const cz = lakeCentreZ(n);
    // Only bother when it could be on screen at all: fogFar plus the lake's own
    // half-depth, so it is never popped in while visible.
    if (Math.abs(pz - cz) > W.fogFar + LAKE_HALF_Z + SHORE_WARP_MAX) { waterMesh.visible = false; return; }
    waterMesh.position.set(lakeCentreX(n), W.groundY + 0.02, cz);
    waterMesh.visible = true;
  }

  // ----------------------------------------------------------------- chunks
  /** @type {Map<number, {cx:number,cz:number,id:string,meshes:Array,colliders:Array,builtLevel:number}>} */
  const chunks = new Map();

  /** Flat live list of every world-space AABB. Rebuilt when chunks come and go. */
  const colliders = [];
  /** Subset of `colliders` whose tops an emeem may sit on. See PERCH_TOP_MIN. */
  const perches = [];
  let collidersDirty = false;

  /**
   * Footprint circles (x, z, radius) of the props already placed in the chunk
   * being built. A flat preallocated array, so spacing costs no garbage - and a
   * circle rather than a box because rocks and canopies are rotated.
   */
  const FOOT_CAP = Math.max(8, Math.ceil(W.obstaclesPerChunkMax) + 2);
  const _foot = new Float64Array(FOOT_CAP * 3);
  let footCount = 0;
  let spotX = 0;
  let spotZ = 0;

  /**
   * Offsets from the player's chunk, pre-sorted nearest-first. Streaming walks
   * this in order so the chunk you are about to run into is built first.
   */
  const ORDER = [];
  for (let dx = -VIEW; dx <= VIEW; dx++) {
    for (let dz = -VIEW; dz <= VIEW; dz++) {
      ORDER.push({ dx, dz, d2: dx * dx + dz * dz, ring: Math.max(Math.abs(dx), Math.abs(dz)) });
    }
  }
  ORDER.sort((a, b) => a.d2 - b.d2);

  let lastDread = -1;
  let lastGroundX = NaN;
  let lastGroundZ = NaN;

  // The streaming centre. Follows the player, but only ever through
  // recentre(), so one bad frame of physics cannot wedge the world.
  let centreX = 0;
  let centreZ = 0;

  /**
   * Moves the streaming centre to a position, ignoring unusable coordinates.
   * The range limit is the one the packed chunk key can address without two
   * chunks aliasing onto the same Map entry - ~524km, or 20 hours of running.
   */
  const CENTRE_LIMIT = (KEY_OFFSET - 2) * CS;
  function recentre(pos) {
    if (!pos) return;
    if (usableCoord(pos.x) && Math.abs(pos.x) < CENTRE_LIMIT) centreX = pos.x;
    if (usableCoord(pos.z) && Math.abs(pos.z) < CENTRE_LIMIT) centreZ = pos.z;
  }

  // ---------------------------------------------------------------- props

  /**
   * Props per chunk = clamp(base + level * perLevel, base, max).
   * The fractional part is carried probabilistically (deterministically, from
   * the chunk's own rng) so density ramps smoothly instead of stepping. It
   * always costs EXACTLY one rng draw, which is what keeps every prop after it
   * identical across levels.
   */
  function obstacleCountFor(level, rng) {
    const raw = W.obstaclesPerChunkBase + level * W.obstaclesPerChunkPerLevel;
    const clamped = Math.min(Math.max(raw, W.obstaclesPerChunkBase), W.obstaclesPerChunkMax);
    const whole = Math.floor(clamped);
    const n = whole + (rng() < clamped - whole ? 1 : 0);
    return Math.min(n, FOOT_CAP);
  }

  function addFoot(x, z, r) {
    if (footCount >= FOOT_CAP) return;
    const i = footCount * 3;
    _foot[i] = x;
    _foot[i + 1] = z;
    _foot[i + 2] = r;
    footCount++;
  }

  /** True if a footprint circle overlaps anything already placed in this chunk. */
  function overlapsPlaced(px, pz, r) {
    for (let i = 0, n = footCount * 3; i < n; i += 3) {
      const dx = px - _foot[i];
      const dz = pz - _foot[i + 1];
      const rr = r + _foot[i + 2] + OBSTACLE_GAP;
      if (dx * dx + dz * dz < rr * rr) return true;
    }
    return false;
  }

  /**
   * Is an exact spot legal? Same three rules findSpot applies - inside its own
   * chunk by `inset`, outside the spawn keep-out, clear of everything already
   * placed - but for a position we have already chosen rather than one we are
   * searching for. The stack partner needs this: its position is DERIVED from
   * the slab's, so it cannot be drawn at random, but it must still pass every
   * check, or 11.3% of partners end up outside their own chunk, where
   * queryAABB never looks and the player walks straight through them.
   */
  function spotIsFree(px, pz, inset, spacing) {
    const originX = Math.floor(px / CS) * CS;
    const originZ = Math.floor(pz / CS) * CS;
    if (px < originX + inset || px > originX + CS - inset) return false;
    if (pz < originZ + inset || pz > originZ + CS - inset) return false;
    const clearR = W.spawnClearRadius + inset;
    if (px * px + pz * pz < clearR * clearR) return false;
    return !overlapsPlaced(px, pz, spacing);
  }

  /**
   * Finds a legal spot for one prop, writing it to spotX/spotZ.
   *
   * `inset` keeps the prop's COLLIDER wholly inside its own chunk, which is the
   * invariant that lets queryAABB test only the buckets a query box touches.
   * Canopies and bushes are allowed to overhang the chunk line - they carry no
   * collider out there, and a forest that stopped dead at every 32m boundary
   * would read as a grid of hedges.
   *
   * Both coordinates are drawn on every attempt, before any rejection, so an
   * attempt always costs exactly two rng values.
   */
  function findSpot(rng, originX, originZ, inset, spacing, visualR) {
    const span = CS - inset * 2;
    if (!(span > 0)) return false;
    const clearR = W.spawnClearRadius + visualR;
    for (let a = 0; a < PLACE_ATTEMPTS; a++) {
      const px = originX + inset + rng() * span;
      const pz = originZ + inset + rng() * span;
      // Nothing at all - not even a leaf - inside the spawn keep-out circle.
      if (px * px + pz * pz < clearR * clearR) continue;
      // Nothing standing in the lake. The INFLATED test, not a centre-point
      // one: a slab can be 1.75m in radius, so a centre just outside the
      // shoreline still puts most of its collider in the water - a boulder in
      // the lake for the boat to hit.
      if (waterNear(px, pz, visualR)) continue;
      if (overlapsPlaced(px, pz, spacing)) continue;
      spotX = px;
      spotZ = pz;
      return true;
    }
    return false;
  }

  /**
   * Guaranteed DIAGONAL gate between any two colliders placed in one chunk.
   * The player is 0.90m across, so 1.20 leaves 30cm of squeeze. Two boxes
   * offset at 45 degrees leave hypot(dx,dz) = D - sqrt(2)*(halfA+halfB), so
   * demanding this spacing from every collider-bearing prop makes the gate a
   * CONSTRUCTION rather than an accident. It matters far more now that trunk
   * colliders are up to 2m wide instead of 1.06m.
   */
  const PASS_GAP = 1.20;
  const spacingFor = (half) => half * Math.SQRT2 + (PASS_GAP - OBSTACLE_GAP) * 0.5;

  function pushCollider(bucket, cx, cz, halfX, halfZ, top) {
    bucket.push({
      min: new THREE.Vector3(cx - halfX, W.groundY, cz - halfZ),
      max: new THREE.Vector3(cx + halfX, W.groundY + top, cz + halfZ),
    });
  }

  /**
   * TREE. A tapered, leaning trunk under two or three canopy blobs.
   *
   * COLLISION: the collider is the TRUNK and nothing else - roughly 0.7-1.1m
   * across under a canopy that can be 4.2m wide. Boxing the canopy instead
   * would hang an invisible wall between every pair of trees, turning a forest
   * you weave through into a maze you bounce off, and at 7.2 m/s that is the
   * difference between the game working and the game being unplayable. You run
   * UNDER the leaves; you go AROUND the trunk. The collider runs the full
   * height of the tree so the Protector - who tramples anything shorter than
   * its stride - can never step over one.
   */
  function placeTree(rng, originX, originZ, bucket, B) {
    const band = (B && B.treeH) || [TREE_H_MIN, TREE_H_MAX];
    const h = Math.max(range(rng, band[0], band[1]), MIN_TREE_H);
    // A BARE tree: trunk, no crown. Standing deadwood on a mountain, a
    // bleached snag on a beach, a pole in a city. Same trunk, same collider,
    // and the whole foliage half below is skipped.
    const bare = rng() < ((B && B.bareTrees) || 0);
    const trunkFrac = range(rng, 0.62, 0.75);
    // Keep the lowest leaf above the chase camera: with the canopy reaching
    // CANOPY_DROP * crownH below the trunk top, that solves to this floor.
    const trunkH = clamp(h * trunkFrac, minTrunkFor(h), h - MIN_CROWN_H);
    const crownH = h - trunkH;
    // Crown WIDTH follows crown HEIGHT. Rolling the two independently gave
    // short trees a full-width canopy, which reads as a parasol on a pole
    // rather than as a tree.
    const crownR = clamp(crownH * range(rng, 0.78, 1.18), CROWN_R_MIN, h * CROWN_R_PER_H);
    const trunkR = h * range(rng, TRUNK_R_PER_H_MIN, TRUNK_R_PER_H_MAX);
    // Cap the lean by displacement, not angle - see TREE_LEAN_XZ_MAX.
    const leanMax = Math.min(TREE_LEAN_MAX, Math.asin(Math.min(1, TREE_LEAN_XZ_MAX / trunkH)));
    const lean = range(rng, 0, leanMax);
    const leanDir = rng() * TAU;
    const leanXZ = Math.sin(lean) * trunkH;

    const colliderHalf = trunkR * TRUNK_COLLIDER_SPREAD + TRUNK_COLLIDER_PAD;
    const visualR = crownR * 1.3 + leanXZ;
    // Spacing is measured trunk-to-trunk, not canopy-to-canopy: canopies are
    // meant to knit together overhead, but two trunks must always leave a gap
    // a running hand (and, for as long as it fits, the Protector) can take.
    const spacing = Math.max(crownR * 0.72, spacingFor(colliderHalf));

    if (!findSpot(rng, originX, originZ, colliderHalf + 0.02, spacing, visualR)) return;
    const px = spotX;
    const pz = spotZ;
    addFoot(px, pz, spacing);
    pushCollider(bucket, px, pz, colliderHalf, colliderHalf, h);

    // Bark tint: warm, and varied enough that a stand of trees is not a stand
    // of clones.
    const bt = range(rng, 0.82, 1.1);
    const br = bt * range(rng, 0.97, 1.07);
    const bg = bt;
    const bb = bt * range(rng, 0.88, 1.0);

    // --- trunk
    _axis.set(Math.cos(leanDir), 0, Math.sin(leanDir));
    _quat.setFromAxisAngle(_axis, lean);
    _pos.set(px, W.groundY - TRUNK_SINK, pz);
    _scl.set(trunkR, trunkH + TRUNK_SINK, trunkR);
    _mat4.compose(_pos, _quat, _scl);

    const tg = TRUNKS[pick(rng, TRUNKS.length)].clone();
    tg.applyMatrix4(_mat4);
    paint(tg, W.groundY, h, br, bg, bb);
    _bark.push(tg);

    // A bare tree stops here: the collider, the spacing and the trunk are the
    // same, so it is still a thing you run around, but nothing green goes on
    // top of it. That is the whole difference, and it is why it is a share of
    // placeTree rather than a species of its own.
    if (bare) return;

    // Where the leaning trunk actually ends up.
    _off.set(0, trunkH + TRUNK_SINK, 0).applyQuaternion(_quat);
    const topX = px + _off.x;
    const topY = W.groundY - TRUNK_SINK + _off.y;
    const topZ = pz + _off.z;
    const floorY = topY - CANOPY_DROP * crownH;

    // Foliage tint: the whole olive-to-deep-green spread, so no two crowns in a
    // stand are the same green.
    const ft = range(rng, 0.8, 1.12);
    const fr = ft * range(rng, 0.86, 1.1);
    const fg = ft * range(rng, 0.96, 1.08);
    const fb = ft * range(rng, 0.8, 1.02);

    // --- main canopy: sits on the trunk top, its underside just below it.
    const crownRy = crownH * 0.58;
    const cy0 = topY + crownH - crownRy;
    const v0 = pick(rng, FOLIAGE_BLOBS.count);
    composeBlob(
      FOLIAGE_BLOBS, v0,
      crownR, crownRy, crownR * range(rng, 0.78, 1.0), rng() * TAU,
      topX, cy0, topZ,
    );
    const cg0 = FOLIAGE_BLOBS.geoms[v0].clone();
    cg0.applyMatrix4(_mat4);
    paint(cg0, W.groundY, h, fr, fg, fb);
    _leaf.push(cg0);

    // --- one or two secondary lobes, so the crown is a clump and not a ball.
    const lobes = rng() < 0.62 ? 2 : 1;
    for (let b = 0; b < lobes; b++) {
      const lr = crownR * range(rng, 0.5, 0.8);
      const ly = lr * range(rng, 0.72, 1.02);
      const ang = rng() * TAU;
      const dist = crownR * range(rng, 0.18, 0.42);
      const dy = crownH * range(rng, -0.22, 0.3);
      const vi = pick(rng, FOLIAGE_BLOBS.count);
      composeBlob(
        FOLIAGE_BLOBS, vi,
        lr, ly, lr * range(rng, 0.8, 1.0), rng() * TAU,
        topX + Math.cos(ang) * dist,
        // Never let a lobe hang below the canopy floor the camera relies on.
        Math.max(cy0 + dy, floorY + ly),
        topZ + Math.sin(ang) * dist,
      );
      const lg = FOLIAGE_BLOBS.geoms[vi].clone();
      lg.applyMatrix4(_mat4);
      paint(lg, W.groundY, h, fr, fg, fb);
      _leaf.push(lg);
    }
  }

  /**
   * ROCK. A squashed, yaw-turned, vertex-jittered icosahedron, seated in the
   * ground so a third of it is buried.
   *
   * COLLISION: capped at ROCK_H_MAX, which is tied to the actual jump apex, so
   * every boulder in the world can be hopped onto. The collider TOP is the
   * geometry's own measured top, so you stand on the stone and not in the air
   * above it; the sides are pulled in by ROCK_COLLIDER_SHRINK because the AABB
   * of a round thing sticks out past it at the corners, where the visible
   * surface has already fallen away.
   *
   * A happy consequence of the height cap: the Protector's stride
   * (monster STEP_OVER, which scales with its size) passes over boulders from
   * about tier 4 on. Early on you both have to go around them; later it walks
   * straight through the ones you still have to jump.
   */
  /** Emits one stone: mesh, optional collider, optional perch. Returns its top. */
  function emitStone(rng, px, pz, radius, h, wantCollider, bucket) {
    const aspect = range(rng, 0.66, 1.0);
    const yaw = rng() * TAU;
    const vi = pick(rng, ROCK_BLOBS.count);
    const st = range(rng, 0.82, 1.12);

    composeSeated(ROCK_BLOBS, vi, radius, aspect, h, 0.4, yaw, px, pz, W.groundY);
    const g = ROCK_BLOBS.geoms[vi].clone();
    g.applyMatrix4(_mat4);
    paint(g, W.groundY, h, st * range(rng, 0.97, 1.04), st, st * range(rng, 0.98, 1.08));
    _stone.push(g);

    if (!wantCollider) return h;
    // paint() left the real world-space extents in _ext: use them, so the
    // collider is the stone that is actually there rather than the nominal
    // radius, which the seat/paint path loses up to a third of.
    const cx = (_ext[0] + _ext[3]) * 0.5;
    const cz = (_ext[2] + _ext[5]) * 0.5;
    const halfX = (_ext[3] - _ext[0]) * 0.5 * ROCK_COLLIDER_SHRINK;
    const halfZ = (_ext[5] - _ext[2]) * 0.5 * ROCK_COLLIDER_SHRINK;
    pushCollider(bucket, cx, cz, halfX, halfZ, h);
    return h;
  }

  /** Two or three foliage lobes growing out of the top of a stone. */
  function addHummock(rng, px, pz, radius, top) {
    const lobes = 2 + (rng() < 0.5 ? 1 : 0);
    for (let b = 0; b < lobes; b++) {
      const lr = radius * range(rng, 0.55, 0.85);
      const ly = range(rng, 0.30, 0.55);
      const ang = rng() * TAU;
      const dist = radius * range(rng, 0.0, 0.30);
      const vi = pick(rng, FOLIAGE_BLOBS.count);
      composeBlob(
        FOLIAGE_BLOBS, vi, lr, ly, lr * range(rng, 0.8, 1.0), rng() * TAU,
        px + Math.cos(ang) * dist, W.groundY + top + ly * 0.35, pz + Math.sin(ang) * dist,
      );
      const lg = FOLIAGE_BLOBS.geoms[vi].clone();
      lg.applyMatrix4(_mat4);
      paint(lg, W.groundY, top + ly, 0.92, 1.0, 0.92);
      _leaf.push(lg);
    }
  }

  /**
   * ROCK. Three jobs, and the size tells you which.
   *
   * COBBLE gets NO collider. Every height under the player's 0.35m STEP_HEIGHT
   * would make tryStepUp set wy = top with no interpolation - up to 32cm in one
   * 8.3ms frame while the camera lags at followLerp 6.5. That is the same
   * bob-up-and-over placeBush's docstring already refuses to ship.
   *
   * SLAB is the platform: 0.55 to 1.40, landable from flat ground with 12.5cm
   * of margin under the 1.525m hop ceiling.
   *
   * BLOCK is the climb: 1.75 to 2.30, so it can NEVER be hopped from the ground
   * (22.5cm of margin the other way), only from a slab. It is deliberately WIDE
   * - the width buys a forgiving landing window, not the possibility of the
   * jump, which a narrow pillar has too.
   *
   * A slab may emit a block partner outright (see below). Emergent adjacency
   * cannot do this job: two rocks that merely land near each other have
   * uncorrelated heights, so the step between them is as likely to be 5cm - a
   * step-up teleport - as 80cm. A readable staircase has to be built.
   *
   * The collider TOP is the geometry's own measured top, so you stand on the
   * stone and not in the air above it; the sides are pulled in by
   * ROCK_COLLIDER_SHRINK because the AABB of a round thing sticks out past it
   * at the corners, where the visible surface has already fallen away.
   */
  function placeRock(rng, originX, originZ, bucket, B) {
    // Pick the job first, then the size inside that job's band. The shares are
    // the biome's: a mountain is outcrop and scree, a beach is shingle, and the
    // same three rock classes cover both by weighting them differently.
    const shares = (B && B.rockShares) || rockShares;
    const shareTotal = (B && B.rockTotal) || rockShareTotal;
    let roll = rng() * shareTotal;
    let job = 'cobble';
    for (let i = 0; i < shares.length; i++) {
      if (roll < shares[i][1]) { job = shares[i][0]; break; }
      roll -= shares[i][1];
    }
    const band = ROCK[job];
    const radius = bandRoll(rng, band.r, ROCK_SPREAD);
    const h = bandRoll(rng, band.h, ROCK_SPREAD);
    const solid = job !== 'cobble';

    // SPACING BUG, fixed here. This passed `radius` as the spacing argument,
    // so two rocks only had to clear centre-to-centre >= rA + rB + OBSTACLE_GAP
    // while their colliders reach 0.82*r each way. Measured over 80 sites at
    // level 7: 7.8% of rock-rock pairs left a diagonal corridor under the 1.20m
    // PASS_GAP this file promises, and 4.5% under the player's own 0.90m width.
    // Those are pinches you cannot walk through, not platforms.
    const half = radius * ROCK_COLLIDER_SHRINK;
    const spacing = solid ? Math.max(radius, spacingFor(half)) : radius;
    if (!findSpot(rng, originX, originZ, radius, spacing, radius)) return;
    const px = spotX;
    const pz = spotZ;
    addFoot(px, pz, spacing);

    const top = emitStone(rng, px, pz, radius, h, solid, bucket);
    if (job === 'slab' && rng() < HUMMOCK_SHARE) addHummock(rng, px, pz, radius, top);

    // --- the deliberate climb: a slab, then a block one hop above it.
    if (job !== 'slab' || rng() >= STACK_SHARE) return;
    // The rise is clamped at BOTH ends and neither bound is cosmetic. The raw
    // bands allow a rise of exactly 0.35 - precisely STEP_HEIGHT, which would
    // teleport the player up 35cm with no jump and no input, the cobble bug
    // relocated to head height - and up to 1.75, which is above the 1.525
    // ceiling and therefore not climbable at all.
    const blockTop = clamp(
      range(rng, top + 0.55, top + 1.35),
      ROCK.block.h[0],
      ROCK.block.h[1],
    );
    if (blockTop < top + 0.55 || blockTop > top + STACK_RISE_MAX) return;
    const blockR = bandRoll(rng, ROCK.block.r, ROCK_SPREAD);
    const blockHalf = blockR * ROCK_COLLIDER_SHRINK;
    const blockSpacing = Math.max(blockR, spacingFor(blockHalf));
    // Cardinal offsets only: an angled offset makes the realised axis-aligned
    // face gap land anywhere in 0.55-2.30 against a designed 0.90-1.60, and
    // only about half fall in band. On an axis the gap is exactly what we set.
    const dir = (rng() * 4) | 0;
    const d = half + STACK_GAP + blockHalf;
    const bx = px + (dir === 0 ? d : dir === 1 ? -d : 0);
    const bz = pz + (dir === 2 ? d : dir === 3 ? -d : 0);
    // Back through findSpot, NOT emitted blind: 11.3% of blind partners left
    // their own chunk by up to 0.97m, and queryAABB never visits a neighbouring
    // chunk's bucket, so that is stone the player would walk straight through.
    if (!spotIsFree(bx, bz, blockR, blockSpacing)) return;
    addFoot(bx, bz, blockSpacing);
    emitStone(rng, bx, bz, blockR, blockTop, true, bucket);
  }

  /**
   * BUSH. Two or three small foliage blobs sunk into the ground.
   *
   * COLLISION: NONE, deliberately. A bush is knee-to-waist high, so any
   * collider it could carry would be under the player's 0.35m step height -
   * meaning the hand would climb onto every shrub it touched and bob back down
   * off the far side, which looks broken - or above it, meaning a shrub could
   * stop a player fleeing at 7.2 m/s dead in front of the Protector. Neither is
   * a trade worth making for clutter whose entire job is to break up
   * sightlines. So you run straight through the leaves, the Protector does too,
   * and bushes cost the 120Hz collision path exactly nothing: they never enter
   * a collider bucket at all. They still take a spacing footprint, so they
   * cannot grow out of the middle of a boulder.
   */
  /**
   * A FALLEN TREE. A trunk on its side, and the one prop in the world whose
   * collider is not a single box.
   *
   * An axis-aligned box around a 9m log lying at 20 degrees is 8.9m by 3.5m -
   * two and a half metres of invisible wall on either side of something 0.9m
   * thick. So the log is bucketed in THREE segments along its own length, each
   * with its own tight AABB: the same hop, without the moat.
   */
  function placeFallen(rng, originX, originZ, bucket, B) {
    const len = range(rng, FALLEN.len[0], FALLEN.len[1]);
    const r = range(rng, FALLEN.radius[0], FALLEN.radius[1]);
    // Near-axis-aligned, with a little jitter: a free yaw would put the segment
    // boxes back on the diagonal this exists to avoid.
    const yaw = (rng() < 0.5 ? 0 : Math.PI / 2) + range(rng, -0.30, 0.30);
    const ax = Math.cos(yaw);
    const az = Math.sin(yaw);
    const half = len * 0.5;
    // Same reasoning as the dune: a 9m log inset by its own half-length would
    // be looking for a spot in a 14m box, and mostly not finding one. It may
    // overhang a chunk edge; it is thin, and what it must not do is overlap
    // something else, which is what the spacing is for.
    if (!findSpot(rng, originX, originZ, 0.6, spacingFor(r * 2), half)) return;
    const px = spotX;
    const pz = spotZ;
    addFoot(px, pz, Math.max(r * 2, 1.2));

    const SEGS = 3;
    const segHalf = half / SEGS;
    for (let i = 0; i < SEGS; i++) {
      const t = -half + segHalf * (2 * i + 1);
      const hx = Math.abs(ax) * segHalf + Math.abs(az) * r;
      const hz = Math.abs(az) * segHalf + Math.abs(ax) * r;
      pushCollider(bucket, px + ax * t, pz + az * t, hx, hz, r * 2);
    }

    // The trunk mesh is authored standing up along +Y, so lay it down first and
    // then swing it round: -X so the taper runs along the log, then the yaw.
    _quat.setFromAxisAngle(_axis.set(1, 0, 0), Math.PI / 2);
    _quatB.setFromAxisAngle(_axis.set(0, 1, 0), -yaw);
    _quat.premultiply(_quatB);
    _pos.set(px - ax * half, W.groundY + r, pz - az * half);
    _scl.set(r, len, r);
    _mat4.compose(_pos, _quat, _scl);

    const g = TRUNKS[pick(rng, TRUNKS.length)].clone();
    g.applyMatrix4(_mat4);
    // Dead wood: greyer and more varied than a standing trunk.
    const bt = range(rng, 0.70, 1.02);
    paint(g, W.groundY, r * 2, bt * range(rng, 0.96, 1.06), bt, bt * range(rng, 0.94, 1.06));
    _bark.push(g);
  }

  /**
   * A DUNE. A low sand ridge: two to four flattened blobs strung along one
   * axis, under one collider, with its top held under the hop ceiling so it is
   * always something you clear rather than something you walk around.
   *
   * It is built from ROCK blobs into the STONE buffer rather than the foliage
   * one, so the beach's stone tint carries it - a dune is sand, not a shrub.
   */
  function placeDune(rng, originX, originZ, bucket, B) {
    const hx = range(rng, DUNE.halfX[0], DUNE.halfX[1]);
    const top = range(rng, DUNE.top[0], DUNE.top[1]);
    const yaw = rng() * TAU;
    const ax = Math.cos(yaw);
    const az = Math.sin(yaw);
    const hz = hx * range(rng, 0.42, 0.66);
    const reach = Math.max(hx, hz);
    // A SMALL inset and a SMALL spacing, both deliberate.
    //
    // findSpot insets the placement box by its `inset` on every side, so a 15m
    // dune asking for its own half-length left a 17m box inside a 32m chunk and
    // almost every dune was rejected before it was drawn - which is why the
    // first beach had no dunes on it at all. A dune may overhang a chunk edge
    // exactly as a tree canopy does; only the collider has to be inside, and it
    // is, because pushCollider clamps nothing and the chunk owns it either way.
    //
    // The spacing is the ridge's WIDTH, not its length, so dunes lie alongside
    // each other and run together into a field. A dune field is continuous;
    // spacing them like boulders gives you nine separate molehills.
    if (!findSpot(rng, originX, originZ, 0.6, Math.max(hz, 1.6), reach)) return;
    const px = spotX;
    const pz = spotZ;
    addFoot(px, pz, hz * 0.85);
    // One box, sized from the ridge's own extent rather than from a circle:
    // a dune is much longer than it is wide and a square collider round it
    // would eat the walkable sand either side.
    pushCollider(bucket,
      px, pz,
      Math.abs(ax) * hx + Math.abs(az) * hz,
      Math.abs(az) * hx + Math.abs(ax) * hz,
      top);

    const lobes = 2 + (rng() < 0.6 ? 1 : 0) + (rng() < 0.3 ? 1 : 0);
    for (let i = 0; i < lobes; i++) {
      const t = lobes > 1 ? (i / (lobes - 1) - 0.5) * 2 : 0;
      // Tallest in the middle, tapering to the horns: a ridge, not a row.
      const f = 1 - 0.42 * Math.abs(t);
      const lr = hx * range(rng, 0.42, 0.62) * f;
      const ly = top * f;
      const vi = pick(rng, ROCK_BLOBS.count);
      composeSeated(
        ROCK_BLOBS, vi, lr, range(rng, 0.34, 0.52), ly, 0.55, rng() * TAU,
        px + ax * hx * t * 0.78, pz + az * hx * t * 0.78, W.groundY,
      );
      const g = ROCK_BLOBS.geoms[vi].clone();
      g.applyMatrix4(_mat4);
      const st = range(rng, 0.92, 1.10);
      paint(g, W.groundY, top, st * range(rng, 0.99, 1.05), st, st * range(rng, 0.93, 1.01));
      _stone.push(g);
    }
  }

  /**
   * A CITY PYLON. A standing slab of concrete, too tall to hop and too square
   * to be a rock.
   *
   * The spacing is the whole safety argument. It is set from config rather than
   * from the pylon's own size, and it is large: the Protector has no
   * pathfinding beyond an obstacle slowdown, so a field of building-sized boxes
   * with rock-sized gaps is how you get a wedged creature and a trapped player.
   * Every pylon keeps a clear corridor around it, and the street is whatever is
   * left over.
   */
  function placePylon(rng, originX, originZ, bucket, B) {
    const hxr = range(rng, PYLON.half[0], PYLON.half[1]);
    const hzr = hxr * range(rng, 0.55, 1.0);
    const h = range(rng, PYLON.height[0], PYLON.height[1]);
    const reach = Math.max(hxr, hzr);
    if (!findSpot(rng, originX, originZ, reach + 0.05, reach + PYLON.spacing, reach)) return;
    const px = spotX;
    const pz = spotZ;
    addFoot(px, pz, reach + PYLON.spacing * 0.5);
    pushCollider(bucket, px, pz, hxr, hzr, h);

    // Square to the world, not to itself: a city reads as a grid even when the
    // things in it are not on one, and a randomly-yawed box just looks fallen.
    _quat.setFromAxisAngle(_axis.set(0, 1, 0), (rng() < 0.5 ? 0 : Math.PI / 2) + range(rng, -0.05, 0.05));
    _pos.set(px, W.groundY, pz);
    _scl.set(hxr * 2, h, hzr * 2);
    _mat4.compose(_pos, _quat, _scl);
    const g = BOX_SOURCE.clone();
    g.applyMatrix4(_mat4);
    // Concrete: pale, and banded up its height by paint()'s vertical ramp so a
    // nine-metre slab is not one flat rectangle of grey.
    const ct = range(rng, 0.86, 1.14);
    paint(g, W.groundY, h, ct, ct * range(rng, 0.98, 1.02), ct * range(rng, 1.0, 1.06));
    _stone.push(g);
  }

  function placeBush(rng, originX, originZ, B) {
    // Marram on a dune is not a forest shrub: the biome scales the whole plant
    // rather than getting a species of its own.
    const bs = (B && B.bushScale) || 1;
    const radius = range(rng, BUSH_R_MIN, BUSH_R_MAX) * bs;
    // Wider than it is tall, always. A bush as tall as it is wide is a shrub
    // sculpture; undergrowth spreads.
    const h = clamp(range(rng, radius * 0.5, radius * 0.92), BUSH_H_MIN, BUSH_H_MAX);
    const lobes = 3 + (rng() < 0.45 ? 1 : 0);

    // Soft clutter nestles: half spacing, so bushes gather under canopies and
    // against boulders the way undergrowth actually does.
    if (!findSpot(rng, originX, originZ, 0.2, radius * 0.5, radius)) return;
    const px = spotX;
    const pz = spotZ;
    addFoot(px, pz, radius * 0.5);

    // Undergrowth sits in the shade of everything above it, so it runs darker
    // and duller than a canopy - which also stops a knee-high shrub competing
    // with an emeem for the eye.
    const ft = range(rng, 0.62, 0.9);
    const fr = ft * range(rng, 0.86, 1.06);
    const fg = ft * range(rng, 0.94, 1.06);
    const fb = ft * range(rng, 0.76, 0.98);

    for (let b = 0; b < lobes; b++) {
      // Fat, overlapping lobes kept well inside the footprint: separate lobes
      // read as a handful of pebbles, overlapping ones as one clump of leaves.
      const lr = radius * range(rng, 0.58, 0.92);
      const lh = h * range(rng, 0.66, 1.0);
      const ang = rng() * TAU;
      const dist = Math.max(0, radius - lr) * range(rng, 0.25, 1.0);
      const vi = pick(rng, FOLIAGE_BLOBS.count);
      composeSeated(
        FOLIAGE_BLOBS, vi,
        lr, range(rng, 0.66, 1.0), lh, 0.5, rng() * TAU,
        px + Math.cos(ang) * dist, pz + Math.sin(ang) * dist, W.groundY,
      );
      const g = FOLIAGE_BLOBS.geoms[vi].clone();
      g.applyMatrix4(_mat4);
      paint(g, W.groundY, h, fr, fg, fb);
      _leaf.push(g);
    }
  }

  /**
   * Merges one material's worth of a chunk into a single mesh. World
   * coordinates are baked into the vertices, so the mesh itself stays at
   * identity: no per-frame matrix work, and the bounding sphere is already in
   * world space for correct frustum culling.
   */
  /**
   * @param {Array} list       geometries to merge, emptied and disposed here
   * @param {THREE.Material} material
   * @param {string} label
   * @param {Array} meshes     output
   * @param {number[]} [tint]  per-biome multiplier on the baked vertex colours
   *
   * THE BIOME TINT LANDS HERE, and nowhere else. Every prop in a chunk already
   * bakes its own colour variation into a vertex-colour attribute; a biome just
   * scales all of it. Doing that at merge time is one pass over one buffer per
   * material per chunk, instead of an edit at each of the nine paint() call
   * sites - and it cannot be forgotten by a placer added later.
   */
  function mergeInto(list, material, label, meshes, tint) {
    if (list.length === 0) return;
    const merged = mergeGeometries(list, false);
    for (let i = 0; i < list.length; i++) list[i].dispose();
    list.length = 0;
    if (!merged) return;

    if (tint && (tint[0] !== 1 || tint[1] !== 1 || tint[2] !== 1)) {
      const col = merged.getAttribute('color');
      if (col) {
        const a = col.array;
        for (let i = 0; i < a.length; i += 3) {
          a[i] *= tint[0]; a[i + 1] *= tint[1]; a[i + 2] *= tint[2];
        }
        col.needsUpdate = true;
      }
    }

    merged.computeBoundingSphere();
    const mesh = new THREE.Mesh(merged, material);
    mesh.name = label;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();
    group.add(mesh);
    meshes.push(mesh);
  }

  /**
   * Builds one chunk: up to three merged meshes + its collider bucket.
   * The layout depends only on (cx, cz) and `level`, and because the rng draw
   * order per prop is independent of the total count, raising the level only
   * ADDS props - the ones already there keep their exact places.
   */
  /**
   * Which biome's rules this chunk is built by.
   *
   * A WEIGHTED COIN, not a threshold. Inside a blend the mix says "0.3 of the
   * mountain"; there is no such thing as 0.3 of a pylon, so the chunk commits
   * to one - but it commits with probability w, so a boundary row comes out a
   * MIX of chunks rather than a line ruled across the world. The draw is the
   * chunk's own deterministic rng, so a chunk rebuilt at a higher threat level
   * lands on the same biome it had before.
   *
   * Evaluated at the chunk CENTRE because buildChunk rolls the species before
   * it draws the position - a prop does not know where it is when it is chosen.
   */
  function chunkBiome(cx, cz, rng) {
    const m = biomeMix(cx * CS + CS * 0.5, cz * CS + CS * 0.5, _bscratch);
    return rng() < m.w ? m.b : m.a;
  }

  function buildChunk(cx, cz, level) {
    const rng = mulberry32(hashChunk(cx, cz));
    const bi = chunkBiome(cx, cz, rng);
    const B = BUNDLES[bi];
    const count = obstacleCountFor(level, rng);
    const originX = cx * CS;
    const originZ = cz * CS;

    const bucket = [];
    footCount = 0;
    _bark.length = 0;
    _leaf.length = 0;
    _stone.length = 0;

    for (let i = 0; i < count; i++) {
      const roll = rng() * B.total;
      const c = B.cum;
      if (roll < c[0]) placeTree(rng, originX, originZ, bucket, B);
      else if (roll < c[1]) placeRock(rng, originX, originZ, bucket, B);
      else if (roll < c[2]) placeBush(rng, originX, originZ, B);
      else if (roll < c[3]) placeFallen(rng, originX, originZ, bucket, B);
      else if (roll < c[4]) placeDune(rng, originX, originZ, bucket, B);
      else placePylon(rng, originX, originZ, bucket, B);
    }

    // SCATTER. A second, unconditional pass of collider-free clutter: pebbles
    // and ferns, no findSpot, no footprint, no collider, no bucket entry. It
    // exists because the obstacle budget cannot fix an empty near field on its
    // own - the visible ground inside 15m is 131 m^2, and putting eight objects
    // in that needs 63 props per chunk, which would be a maze rather than a
    // forest. These merge into the SAME _stone and _leaf buffers as everything
    // else, so they cost triangles and not a single extra draw call, and
    // nothing about them can ever block, trip or snag anything.
    const scatterN = Math.round(SCATTER_PER_CHUNK * B.scatterMul);
    for (let i = 0; i < scatterN; i++) {
      const px = originX + rng() * CS;
      const pz = originZ + rng() * CS;
      // The spawn keep-out still applies: no clutter under the player's feet.
      if (px * px + pz * pz < W.spawnClearRadius * W.spawnClearRadius) continue;
      // OPEN WATER GETS NOTHING, AND THE SHALLOWS GET GRAVEL.
      //
      // This started life as "pebbles on the BED are fine and wanted - they
      // are what makes the transparent surface read as water over ground
      // rather than as a blue lid", and that reasoning was simply wrong about
      // the geometry. The world is flat, so the water plane sits 2cm above the
      // ground, while a scatter pebble stands 9 to 30cm tall: nine tenths of
      // every one of them was ABOVE the waterline. Screenshots of the finished
      // lake showed hundreds of stones floating on it. It read as a gravel tip,
      // not a lake.
      //
      // The keep-out is on OPEN water only. The outer 3.5m of the feather still
      // gets its pebbles, and there they do a better job than they ever did on
      // the bed: a rectangle's shoreline is a dead straight line, and a band of
      // gravel is what stops that line reading as the edge of a swimming pool.
      // Ferns still grow nowhere near it.
      const wet = waterAt(px, pz);
      if (wet > SHALLOW_MAX) continue;
      if (wet > 0 || rng() < B.pebbleShare) {
        const r = range(rng, 0.20, 0.62);
        const h = range(rng, 0.09, 0.30);
        const vi = pick(rng, ROCK_BLOBS.count);
        const st = range(rng, 0.80, 1.10);
        composeSeated(ROCK_BLOBS, vi, r, range(rng, 0.7, 1.0), h, 0.45, rng() * TAU, px, pz, W.groundY);
        const g = ROCK_BLOBS.geoms[vi].clone();
        g.applyMatrix4(_mat4);
        paint(g, W.groundY, h, st * range(rng, 0.97, 1.04), st, st * range(rng, 0.98, 1.08));
        _stone.push(g);
      } else {
        const lobes = 1 + (rng() < 0.45 ? 1 : 0);
        for (let b = 0; b < lobes; b++) {
          const lr = range(rng, 0.30, 0.78);
          const ly = lr * range(rng, 0.45, 0.85);
          const vi = pick(rng, FOLIAGE_BLOBS.count);
          composeSeated(FOLIAGE_BLOBS, vi, lr, range(rng, 0.8, 1.0), ly, 0.35, rng() * TAU,
            px + range(rng, -0.3, 0.3), pz + range(rng, -0.3, 0.3), W.groundY);
          const lg = FOLIAGE_BLOBS.geoms[vi].clone();
          lg.applyMatrix4(_mat4);
          paint(lg, W.groundY, ly, 0.9, 1.0, 0.9);
          _leaf.push(lg);
        }
      }
    }

    const meshes = [];
    mergeInto(_bark, barkMaterial, `bark ${cx},${cz}`, meshes, B.tint.bark);
    mergeInto(_leaf, foliageMaterial, `foliage ${cx},${cz}`, meshes, B.tint.leaf);
    mergeInto(_stone, stoneMaterial, `stone ${cx},${cz}`, meshes, B.tint.stone);

    const chunk = {
      cx,
      cz,
      id: `${cx},${cz}`,
      meshes,
      colliders: bucket,
      builtLevel: level,
      biome: bi,
    };
    chunks.set(chunkKey(cx, cz), chunk);
    collidersDirty = true;
    return chunk;
  }

  /** Frees a chunk's GPU memory and drops its colliders. */
  function disposeChunk(chunk) {
    const meshes = chunk.meshes;
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      group.remove(mesh);
      mesh.geometry.dispose(); // materials are shared - never dispose them here
    }
    meshes.length = 0;
    chunk.colliders.length = 0;
    chunks.delete(chunkKey(chunk.cx, chunk.cz));
    collidersDirty = true;
  }

  function disposeAll() {
    for (const chunk of chunks.values()) disposeChunk(chunk);
    chunks.clear();
    colliders.length = 0;
    collidersDirty = false;
  }

  /**
   * Refreshes the flat collider list after chunks appeared or vanished, and the
   * parallel list of tops an emeem may sit on. One pass, same loop: a perch
   * list that could ever disagree with the collider list would put a prize in
   * mid-air over a chunk that had already been freed.
   */
  function rebuildColliderList() {
    colliders.length = 0;
    perches.length = 0;
    for (const chunk of chunks.values()) {
      const bucket = chunk.colliders;
      for (let i = 0; i < bucket.length; i++) {
        const c = bucket[i];
        colliders.push(c);
        const top = c.max.y;
        if (top < PERCH_TOP_MIN || top > PERCH_TOP_MAX) continue;
        const hx = (c.max.x - c.min.x) * 0.5;
        const hz = (c.max.z - c.min.z) * 0.5;
        if (hx < PERCH_HALF_MIN || hz < PERCH_HALF_MIN) continue;
        perches.push(c);
      }
    }
    collidersDirty = false;
  }

  /**
   * Picks a perch inside the ring band and writes (x, top, z) to `out`.
   *
   * The jitter is bounded so the emeem's own disc always lands on real stone
   * rather than over the lip. Returns false rather than searching hard: a
   * failed pick just falls through to an ordinary ground spawn, and this is
   * called up to three times a frame.
   */
  function pickPerch(px, pz, rMin, rMax, isTaken, out) {
    if (collidersDirty) rebuildColliderList();
    const n = perches.length;
    if (n === 0) return false;
    const r2min = rMin * rMin;
    const r2max = rMax * rMax;
    // Ten tries, not four. The band test is the binding constraint - only the
    // perches inside [rMin, rMax] of the player qualify, and they are a small
    // slice of the streamed set - so too few tries silently converts most
    // perched spawns into ordinary ground ones and the mechanic quietly
    // disappears. Measured at four tries the realised share was ~5% against an
    // intended 22%. This still allocates nothing and still gives up rather than
    // searching hard.
    for (let t = 0; t < 10; t++) {
      const c = perches[(Math.random() * n) | 0];
      const cx = (c.min.x + c.max.x) * 0.5;
      const cz = (c.min.z + c.max.z) * 0.5;
      const dx = cx - px;
      const dz = cz - pz;
      const d2 = dx * dx + dz * dz;
      if (d2 < r2min || d2 > r2max) continue;
      const hx = (c.max.x - c.min.x) * 0.5;
      const hz = (c.max.z - c.min.z) * 0.5;
      const j = Math.max(0, Math.min(hx, hz) - PERCH_INSET);
      const x = cx + (Math.random() * 2 - 1) * j;
      const z = cz + (Math.random() * 2 - 1) * j;
      if (isTaken && isTaken(x, z)) continue;
      out.x = x; out.y = c.max.y; out.z = z;
      return true;
    }
    return false;
  }

  // ------------------------------------------------------------- streaming

  /**
   * Keeps the live set of chunks centred on (px, pz). Unloads first (free
   * memory before allocating), then builds at most `budget` chunks so a burst
   * of new terrain can never stall a frame.
   */
  function streamAround(px, pz, budget, level) {
    const pcx = Math.floor(px / CS);
    const pcz = Math.floor(pz / CS);

    // Unload anything outside the square view radius. Deleting the current
    // entry during Map iteration is well defined.
    for (const chunk of chunks.values()) {
      if (Math.abs(chunk.cx - pcx) > VIEW || Math.abs(chunk.cz - pcz) > VIEW) disposeChunk(chunk);
    }

    // Build missing chunks, nearest first.
    let built = 0;
    for (let i = 0; i < ORDER.length && built < budget; i++) {
      const o = ORDER[i];
      const cx = pcx + o.dx;
      const cz = pcz + o.dz;
      if (chunks.has(chunkKey(cx, cz))) continue;
      buildChunk(cx, cz, level);
      built++;
    }

    // Spare budget goes to re-rolling stale chunks: the world is meant to get
    // more cluttered as the monster escalates, but regenerating terrain near
    // the player would pop in front of their face, so only the outermost ring
    // (deep in fog) is ever upgraded, farthest first. Because generation is
    // additive across levels, an upgrade only ever makes new props appear -
    // nothing the player has already seen moves or vanishes.
    for (let i = ORDER.length - 1; i >= 0 && built < budget; i--) {
      const o = ORDER[i];
      if (o.ring < VIEW) continue; // outermost ring only
      const chunk = chunks.get(chunkKey(pcx + o.dx, pcz + o.dz));
      if (!chunk || chunk.builtLevel >= level) continue;
      const cx = chunk.cx;
      const cz = chunk.cz;
      disposeChunk(chunk);
      buildChunk(cx, cz, level);
      built++;
    }

    if (collidersDirty) rebuildColliderList();
  }

  /** Snaps the ground plane to whole chunk coordinates under the player. */
  function followGround(px, pz) {
    const gx = Math.round(px / CS) * CS;
    const gz = Math.round(pz / CS) * CS;
    if (gx === lastGroundX && gz === lastGroundZ) return;
    lastGroundX = gx;
    lastGroundZ = gz;
    groundMesh.position.set(gx, W.groundY, gz);
    groundMesh.updateMatrix();
  }

  /** Drives the calm -> dread colour ramp on the four shared materials. */
  function applyDread(dread) {
    const t = Math.min(Math.max(dread || 0, 0), 1);
    if (Math.abs(t - lastDread) < 0.002) return;
    lastDread = t;
    barkMaterial.color.copy(_colA.setHex(P.obstacleCalm).lerp(_colB.setHex(P.obstacleDread), t));
    foliageMaterial.color.copy(_colA.setHex(P.foliageCalm).lerp(_colB.setHex(P.foliageDread), t));
    stoneMaterial.color.copy(_colA.setHex(P.rockCalm).lerp(_colB.setHex(P.rockDread), t));
    groundMaterial.color.copy(_colA.setHex(P.groundCalm).lerp(_colB.setHex(P.groundDread), t));

    // The per-biome grounds, as RATIOS against the forest at this same dread.
    // Doing the calm->dread lerp here and handing the shader a plain multiplier
    // keeps the ramp in one place; putting it in GLSL would immediately drift
    // from hemi.groundColor, which is lerped in renderer.js from the same pair.
    const base = _colA;   // still holds the forest ground at t, from the line above
    // A dread ground is dark - the forest's is 0.023 linear at its darkest - so
    // the divide needs a floor or a palette edit could hand the shader an
    // Infinity and paint the world white.
    const br = Math.max(base.r, GROUND_RATIO_FLOOR);
    const bg = Math.max(base.g, GROUND_RATIO_FLOOR);
    const bb = Math.max(base.b, GROUND_RATIO_FLOOR);
    for (let i = 1; i < BIOME_COUNT; i++) {
      const pal = BIOME_PALETTES[i];
      _colB.setHex(pal.groundCalm).lerp(_colC.setHex(pal.groundDread), t);
      biomeRatios[i].setRGB(_colB.r / br, _colB.g / bg, _colB.b / bb);
    }
    if (groundUniforms) groundUniforms.uBiomeG.value = biomeRatios;
  }

  /** Builds the inner chunks immediately so the first rendered frame is populated. */
  function primeAround(px, pz, level) {
    const pcx = Math.floor(px / CS);
    const pcz = Math.floor(pz / CS);
    const r = Math.min(PRIME_RADIUS, VIEW);
    for (let i = 0; i < ORDER.length; i++) {
      const o = ORDER[i];
      if (o.ring > r) continue;
      const cx = pcx + o.dx;
      const cz = pcz + o.dz;
      if (!chunks.has(chunkKey(cx, cz))) buildChunk(cx, cz, level);
    }
    rebuildColliderList();
    followGround(px, pz);
  }

  // ------------------------------------------------------------- public API

  /**
   * Returns every collider overlapping the given world-space box.
   * Spatially indexed: only the chunk buckets the box actually touches are
   * tested, and `out` is cleared and refilled so nothing is allocated.
   *
   * @param {{x:number,y:number,z:number}} min
   * @param {{x:number,y:number,z:number}} max
   * @param {Array} [out]
   * @returns {Array<{min:THREE.Vector3, max:THREE.Vector3}>}
   */
  function queryAABB(min, max, out = []) {
    out.length = 0;
    const cx0 = Math.floor(min.x / CS);
    const cz0 = Math.floor(min.z / CS);
    // A NaN corner is already harmless - every comparison below is false, so
    // the loop runs zero times. An INFINITE one is not: `cx++` never advances
    // past +/-Infinity and `cx <= cx1` stays true, so the 120Hz path would spin
    // forever with no exception and no way back. Refuse the box at the door,
    // exactly as recentre() refuses an unusable streaming centre.
    if (!Number.isFinite(cx0) || !Number.isFinite(cz0)) return out;
    // Defensive clamp: a degenerate/huge query box must not spin the loop.
    // With cx0/cz0 finite these are finite too, so both loops always terminate.
    const cx1 = Math.min(Math.floor(max.x / CS), cx0 + 8);
    const cz1 = Math.min(Math.floor(max.z / CS), cz0 + 8);

    for (let cx = cx0; cx <= cx1; cx++) {
      for (let cz = cz0; cz <= cz1; cz++) {
        const chunk = chunks.get(chunkKey(cx, cz));
        if (chunk === undefined) continue;
        const bucket = chunk.colliders;
        for (let i = 0; i < bucket.length; i++) {
          const c = bucket[i];
          if (c.max.x < min.x || c.min.x > max.x) continue;
          if (c.max.y < min.y || c.min.y > max.y) continue;
          if (c.max.z < min.z || c.min.z > max.z) continue;
          out.push(c);
        }
      }
    }
    return out;
  }

  /**
   * Ground height under a point. Flat today, but this is the single source of
   * truth: a heightmap can be dropped in here without the player controller,
   * the monster or the emeems ever knowing.
   */
  function sampleGroundY(x, z) { // eslint-disable-line no-unused-vars
    return W.groundY;
  }

  /** Diagnostics for the suites: which biome is a point in, by name. */
  function biomeNameAt(x, z) { return BIOME_NAMES[biomeAt(x, z, _bscratch)]; }

  function update(dt, c) {
    const s = (c && c.state) || ctx.state;
    recentre(s.player && s.player.pos);
    if (s.player && s.player.pos) placeWater(s.player.pos.x, s.player.pos.z);
    updateWakes(dt, s);
    streamAround(centreX, centreZ, MAX_BUILDS_PER_FRAME, s.levelIndex | 0);
    followGround(centreX, centreZ);
    applyDread(s.dread);
  }

  function reset() {
    disposeAll();
    lastDread = -1;
    lastGroundX = NaN;
    lastGroundZ = NaN;
    const s = ctx.state;
    recentre(s.player && s.player.pos);
    applyDread(s.dread);
    primeAround(centreX, centreZ, s.levelIndex | 0);
  }

  // main.js never adds the world group itself, so we do it here. ctx.scene is
  // live at construction time (the renderer is built first); ctx.world and
  // ctx.audio are not, which is why nothing above touches them.
  if (ctx.scene) ctx.scene.add(group);

  applyDread(ctx.state.dread);
  recentre(ctx.state.player && ctx.state.player.pos);
  primeAround(centreX, centreZ, ctx.state.levelIndex | 0);

  return {
    group, colliders, perches, pickPerch, queryAABB, sampleGroundY, update, reset,
    /** Shared so the boat costs no new material and no new draw call class. */
    barkMaterial,
    /** 0 on land, 1 in open water. The single source of truth for wetness. */
    waterAt,
    /** Diagnostics for the suites. */
    biomeNameAt,
    biomeLead: BIOME_LEAD,
    biomeBand: BIOME_BAND,
    lakeZ0: LAKE_Z0,
    lakePeriod: LAKE_PERIOD,
    lakeHalfZ: LAKE_HALF_Z,
  };
}
