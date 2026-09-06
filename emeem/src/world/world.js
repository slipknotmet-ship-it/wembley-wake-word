import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * EMEEM - infinite streaming world.
 *
 * The world is an endless flat plane (y = CONFIG.world.groundY) littered with
 * axis-aligned boxes. It is diced into `chunkSize` metre squares; the chunks
 * inside `viewChunks` of the player exist, everything else is thrown away.
 *
 * Three things matter here and they all pull in the same direction:
 *
 *  1. DETERMINISM. A chunk's layout comes from mulberry32 seeded by a hash of
 *     (cx, cz), never Math.random, so walking back into a chunk you unloaded
 *     five seconds ago gives you the identical rocks in the identical places.
 *
 *  2. DRAW CALLS. Every box in a chunk is merged into a single BufferGeometry
 *     sharing one material, so 49 live chunks cost 49 draw calls instead of
 *     the ~1000 that one-mesh-per-box would cost. That difference is the whole
 *     ballgame on a phone.
 *
 *  3. NO PER-FRAME ALLOCATION. queryAABB is called twice per fixed step (120Hz)
 *     by the player and the monster. It buckets colliders by chunk and refills
 *     a caller-owned array, so the hot path allocates nothing at all.
 */

// ---------------------------------------------------------------- constants

/** Chunks built per frame while streaming. Two merges is ~1ms; a hitch is worse. */
const MAX_BUILDS_PER_FRAME = 2;

/** Radius (in chunks) built synchronously on reset so the first frame isn't bare. */
const PRIME_RADIUS = 2;

/** Boxes sink this far below the ground plane so their bottom face never z-fights it. */
const BOX_SINK = 0.08;

/** Vertical shading baked into vertex colours: dark at the base, full at the top. */
const SHADE_BOTTOM = 0.74;
const SHADE_TOP = 1.06;

/** Minimum gap enforced between two boxes in a chunk so clutter doesn't interpenetrate. */
const OBSTACLE_GAP = 0.35;

/** Attempts to find a legal spot for one obstacle before giving up on it. */
const PLACE_ATTEMPTS = 6;

/**
 * Integer chunk keys. A `${cx},${cz}` string would allocate on every bucket
 * lookup inside queryAABB; this packs the pair into one SMI instead.
 * Range is +/-16383 chunks = +/-524km, which no run will ever reach.
 */
const KEY_OFFSET = 16384;
const KEY_STRIDE = 32768;

// ------------------------------------------------------------------ scratch
// Hoisted so nothing in the per-frame or per-chunk path allocates.

const _mat4 = new THREE.Matrix4();
const _colA = new THREE.Color();
const _colB = new THREE.Color();
const _geoms = [];

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

// ------------------------------------------------------------ base geometry

/**
 * One unit cube, origin at the centre of its BOTTOM face, built once and cloned
 * per obstacle. `uv` is deleted (no maps anywhere in this game) and a `color`
 * attribute is added so each merged box can carry its own tint and fake AO.
 */
const BASE_BOX = new THREE.BoxGeometry(1, 1, 1);
BASE_BOX.deleteAttribute('uv');
BASE_BOX.translate(0, 0.5, 0);
BASE_BOX.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(BASE_BOX.attributes.position.count * 3).fill(1), 3),
);

/**
 * Local height of every base-box vertex (0 at the base, 1 at the top), cached
 * so the per-obstacle shading loop is a straight array read.
 */
const BASE_LOCAL_Y = (() => {
  const pos = BASE_BOX.attributes.position;
  const out = new Float32Array(pos.count);
  for (let i = 0; i < pos.count; i++) out[i] = pos.array[i * 3 + 1];
  return out;
})();

// -------------------------------------------------------------- ground grid

/**
 * Injects a world-space grid + chunk checker into a Lambert material.
 * World-space (not UV-space) means the pattern is nailed to the world and does
 * not swim when the ground mesh teleports to follow the player. It fades out
 * with distance, otherwise the lines alias into a grey soup at the horizon.
 */
function applyGridShader(material, cellSize, chunkSize) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uCell = { value: cellSize };
    shader.uniforms.uChunk = { value: chunkSize };

    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPos;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\n\tvWorldPos = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;',
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        '#include <common>\nvarying vec3 vWorldPos;\nuniform float uCell;\nuniform float uChunk;',
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
		diffuseColor.rgb *= ( 1.0 + ( checker - 0.5 ) * 0.055 ) * ( 1.0 - line * 0.22 * fade );
	}`,
      );
  };
  // Without this two Lambert materials could share a compiled program and one
  // would silently lose the injection.
  material.customProgramCacheKey = () => 'emeem-ground-grid';
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
  const CS = W.chunkSize;
  const VIEW = W.viewChunks;

  const group = new THREE.Group();
  group.name = 'world';
  group.matrixAutoUpdate = false;

  // -------------------------------------------------------------- materials
  // One material for every obstacle in the world; its colour is lerped toward
  // the dread palette in update(), which recolours all 49 chunks for free.
  const obstacleMaterial = new THREE.MeshLambertMaterial({
    color: P.obstacleCalm,
    vertexColors: true,
    dithering: true,
  });

  const groundMaterial = new THREE.MeshLambertMaterial({
    color: P.groundCalm,
    dithering: true,
  });
  applyGridShader(groundMaterial, CS / 8, CS);

  // ----------------------------------------------------------------- ground
  // A single plane that follows the player, snapped to whole chunks. It is
  // wide enough to reach past fogFar in every direction, so the player never
  // sees an edge and we never pay for per-chunk ground meshes.
  const GROUND_SIZE = (VIEW * 2 + 5) * CS;
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

  // ----------------------------------------------------------------- chunks
  /** @type {Map<number, {cx:number,cz:number,id:string,mesh:THREE.Mesh|null,colliders:Array,builtLevel:number}>} */
  const chunks = new Map();

  /** Flat live list of every world-space AABB. Rebuilt when chunks come and go. */
  const colliders = [];
  let collidersDirty = false;

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

  // ------------------------------------------------------------ obstacles

  /**
   * Obstacles per chunk = clamp(base + level * perLevel, base, max).
   * The fractional part is carried probabilistically (deterministically, from
   * the chunk's own rng) so density ramps smoothly instead of stepping.
   */
  function obstacleCountFor(level, rng) {
    const raw = W.obstaclesPerChunkBase + level * W.obstaclesPerChunkPerLevel;
    const clamped = Math.min(Math.max(raw, W.obstaclesPerChunkBase), W.obstaclesPerChunkMax);
    const whole = Math.floor(clamped);
    return whole + (rng() < clamped - whole ? 1 : 0);
  }

  /**
   * True if the box centred at (px, pz) with the given half-extents reaches
   * into the spawn keep-out circle at the world origin.
   */
  function hitsSpawnClear(px, pz, halfX, halfZ) {
    const dx = Math.max(0, Math.abs(px) - halfX);
    const dz = Math.max(0, Math.abs(pz) - halfZ);
    return dx * dx + dz * dz < W.spawnClearRadius * W.spawnClearRadius;
  }

  /** True if the footprint overlaps anything already placed in this chunk. */
  function overlapsPlaced(list, px, pz, halfX, halfZ) {
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (px + halfX + OBSTACLE_GAP < c.min.x || px - halfX - OBSTACLE_GAP > c.max.x) continue;
      if (pz + halfZ + OBSTACLE_GAP < c.min.z || pz - halfZ - OBSTACLE_GAP > c.max.z) continue;
      return true;
    }
    return false;
  }

  /**
   * Builds one chunk: merged obstacle mesh + its collider bucket.
   * The layout depends only on (cx, cz) and `level`, and because the rng draw
   * order per obstacle is independent of the total count, raising the level
   * only ADDS boxes - the ones already there keep their exact places.
   */
  function buildChunk(cx, cz, level) {
    const rng = mulberry32(hashChunk(cx, cz));
    const count = obstacleCountFor(level, rng);
    const originX = cx * CS;
    const originZ = cz * CS;

    const bucket = [];
    _geoms.length = 0;

    for (let i = 0; i < count; i++) {
      // Three silhouettes, and the mix is the point: low steps are hop-on
      // platforms (jump apex is ~1.47m), blocks and pillars must be run around.
      const kind = rng();
      let sx;
      let sz;
      let h;
      if (kind < 0.45) {
        sx = range(rng, 2.0, W.obstacleMaxSize);
        sz = range(rng, 2.0, W.obstacleMaxSize);
        h = range(rng, 0.45, 1.15);
      } else if (kind < 0.78) {
        sx = range(rng, 1.6, 3.4);
        sz = range(rng, 1.6, 3.4);
        h = range(rng, 1.7, 3.2);
      } else {
        sx = range(rng, W.obstacleMinSize, 2.0);
        sz = range(rng, W.obstacleMinSize, 2.0);
        h = range(rng, 3.4, W.obstacleMaxHeight);
      }
      sx = Math.min(Math.max(sx, W.obstacleMinSize), W.obstacleMaxSize);
      sz = Math.min(Math.max(sz, W.obstacleMinSize), W.obstacleMaxSize);
      h = Math.min(h, W.obstacleMaxHeight);

      const halfX = sx * 0.5;
      const halfZ = sz * 0.5;

      // Placement is inset so every box lies WHOLLY inside its own chunk. That
      // invariant is what lets queryAABB test only the buckets the query box
      // touches - a collider can never leak into a neighbour's cell.
      let px = 0;
      let pz = 0;
      let placed = false;
      for (let attempt = 0; attempt < PLACE_ATTEMPTS; attempt++) {
        px = originX + halfX + rng() * (CS - sx);
        pz = originZ + halfZ + rng() * (CS - sz);
        if (hitsSpawnClear(px, pz, halfX, halfZ)) continue;
        if (overlapsPlaced(bucket, px, pz, halfX, halfZ)) continue;
        placed = true;
        break;
      }
      if (!placed) continue;

      // Collider sits exactly on the ground; the visible box is sunk slightly
      // deeper so its bottom face never co-plane-fights the ground plane.
      bucket.push({
        min: new THREE.Vector3(px - halfX, W.groundY, pz - halfZ),
        max: new THREE.Vector3(px + halfX, W.groundY + h, pz + halfZ),
      });

      const g = BASE_BOX.clone();

      // Per-box tint + a vertical gradient standing in for ambient occlusion.
      // These multiply the shared material colour, so dread recolouring still
      // works while the merged mass stops reading as one flat slab.
      const tint = range(rng, 0.86, 1.12);
      const warm = range(rng, 0.96, 1.05);
      const cool = range(rng, 0.94, 1.03);
      const carr = g.attributes.color.array;
      for (let v = 0; v < BASE_LOCAL_Y.length; v++) {
        const shade = tint * (SHADE_BOTTOM + (SHADE_TOP - SHADE_BOTTOM) * BASE_LOCAL_Y[v]);
        carr[v * 3] = shade * warm;
        carr[v * 3 + 1] = shade;
        carr[v * 3 + 2] = shade * cool;
      }

      _mat4.makeScale(sx, h + BOX_SINK, sz);
      _mat4.setPosition(px, W.groundY - BOX_SINK, pz);
      g.applyMatrix4(_mat4);
      _geoms.push(g);
    }

    let mesh = null;
    if (_geoms.length > 0) {
      // World coordinates are baked into the vertices, so the mesh itself stays
      // at identity: no per-frame matrix work, and the bounding sphere is
      // already in world space for correct frustum culling.
      const merged = mergeGeometries(_geoms, false);
      for (let i = 0; i < _geoms.length; i++) _geoms[i].dispose();
      _geoms.length = 0;

      if (merged) {
        merged.computeBoundingSphere();
        mesh = new THREE.Mesh(merged, obstacleMaterial);
        mesh.name = `chunk ${cx},${cz}`;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add(mesh);
      }
    }

    const chunk = {
      cx,
      cz,
      id: `${cx},${cz}`,
      mesh,
      colliders: bucket,
      builtLevel: level,
    };
    chunks.set(chunkKey(cx, cz), chunk);
    collidersDirty = true;
    return chunk;
  }

  /** Frees a chunk's GPU memory and drops its colliders. */
  function disposeChunk(chunk) {
    if (chunk.mesh) {
      group.remove(chunk.mesh);
      chunk.mesh.geometry.dispose(); // material is shared - never dispose it here
      chunk.mesh = null;
    }
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

  /** Refreshes the flat collider list after chunks appeared or vanished. */
  function rebuildColliderList() {
    colliders.length = 0;
    for (const chunk of chunks.values()) {
      const bucket = chunk.colliders;
      for (let i = 0; i < bucket.length; i++) colliders.push(bucket[i]);
    }
    collidersDirty = false;
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
    // additive across levels, an upgrade only ever makes new boxes appear -
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

  /** Drives the calm -> dread colour ramp on the two shared materials. */
  function applyDread(dread) {
    const t = Math.min(Math.max(dread || 0, 0), 1);
    if (Math.abs(t - lastDread) < 0.002) return;
    lastDread = t;
    obstacleMaterial.color.copy(_colA.setHex(P.obstacleCalm).lerp(_colB.setHex(P.obstacleDread), t));
    groundMaterial.color.copy(_colA.setHex(P.groundCalm).lerp(_colB.setHex(P.groundDread), t));
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
    // Defensive clamp: a degenerate/huge query box must not spin the loop.
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

  function update(dt, c) {
    const s = (c && c.state) || ctx.state;
    const pos = s.player.pos;
    streamAround(pos.x, pos.z, MAX_BUILDS_PER_FRAME, s.levelIndex | 0);
    followGround(pos.x, pos.z);
    applyDread(s.dread);
  }

  function reset() {
    disposeAll();
    lastDread = -1;
    lastGroundX = NaN;
    lastGroundZ = NaN;
    const s = ctx.state;
    applyDread(s.dread);
    primeAround(s.player.pos.x, s.player.pos.z, s.levelIndex | 0);
  }

  // main.js never adds the world group itself, so we do it here. ctx.scene is
  // live at construction time (the renderer is built first); ctx.world and
  // ctx.audio are not, which is why nothing above touches them.
  if (ctx.scene) ctx.scene.add(group);

  applyDread(ctx.state.dread);
  primeAround(ctx.state.player.pos.x, ctx.state.player.pos.z, ctx.state.levelIndex | 0);

  return { group, colliders, queryAABB, sampleGroundY, update, reset };
}
