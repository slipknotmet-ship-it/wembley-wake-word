import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CONFIG } from '../core/config.js';

/**
 * EMEEM - the collectibles.
 *
 * An Emeem is a candy button: a glossy coloured disc with a domed top, hovering
 * and slowly precessing just above the ground, wrapped in a soft additive halo
 * so it still reads as a target once the dread fog closes in.
 *
 * THREE THINGS DRIVE THE DESIGN HERE:
 *
 *  1. NO ALLOCATION DURING PLAY. Every mesh, sprite, material, geometry and
 *     vector is built once at construction. The per-frame loop writes into
 *     existing objects and reuses module-scope scratch vectors. The only
 *     allocation left is one Vector3 per 'collect' event, and that is on
 *     purpose: bus listeners may hold onto the payload, so handing them a
 *     shared scratch vector would be a genuine aliasing bug. Pickups happen
 *     once or twice a second, not once a frame.
 *
 *  2. STREAMING, NOT A FIXED FIELD. The pool is big enough for the whole
 *     streamed area, but only TARGET_ACTIVE are live at once and they live in
 *     a ring around the player, biased AHEAD of them (toward -Z, the direction
 *     the camera faces and the direction you flee). Running forward is
 *     therefore always the greedy move, which is exactly the pressure the
 *     monster is supposed to create.
 *
 *  3. THE MAGNET IS THE GAME FEEL. On a phone, with a 4-way D-pad and a thumb
 *     covering a third of the screen, "walk exactly onto a 0.42m disc" is
 *     miserable. Inside magnetRadius the Emeem comes to you and rises to the
 *     hand's grab height, so a near miss reads as a catch.
 *
 * World orientation is the project-wide fixed one: the camera sits on +Z
 * looking toward -Z, ground is y = 0, and state.player.pos is at the FEET.
 */

const TAU = Math.PI * 2;

// -------------------------------------------------------------- scratch
// Hoisted so the per-frame loop never allocates. queryAABB() clears and
// refills _hits, so one shared array is safe.
const _min = new THREE.Vector3();
const _max = new THREE.Vector3();
const _hits = [];

const AXIS_Y = new THREE.Vector3(0, 1, 0);
/**
 * The disc is rotationally symmetric about its own axis, so spinning it about
 * that axis is invisible. Instead we tilt it off vertical by TILT and then spin
 * the tilted disc about WORLD Y: the face precesses, sweeping toward and away
 * from the camera and catching the sun's specular once per revolution. That
 * flash is what makes them findable in peripheral vision.
 */
const TILT_Q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.42);

// ------------------------------------------------------------- geometry sizing
const COLORS = CONFIG.palette.emeems;
const E = CONFIG.emeem;

/**
 * Pool size covers the whole streamed area (perChunk per chunk across the
 * (2*viewChunks+1)^2 grid) so the density tunables in config.js can be raised
 * without touching this file, capped at 120 because that is already far more
 * than the spawn ring will ever ask for. Spare entries are invisible Object3Ds;
 * three.js's projectObject() early-outs on `visible === false`, so an idle
 * spare costs one branch per frame and zero GPU.
 */
const POOL_SIZE = Math.max(
  32,
  Math.min(120, CONFIG.emeem.perChunk * (CONFIG.world.viewChunks * 2 + 1) ** 2),
);

/**
 * Spawn ring, in metres from the player. The near edge is far enough out that
 * an Emeem never pops into existence inside your field of view; the far edge
 * sits where calm fog still leaves it readable (fogFar * 0.3 == 45m shipped).
 */
const RING_MIN = 12;
const RING_MAX = Math.max(RING_MIN + 8, CONFIG.world.fogFar * 0.3);
const RING_MIN2 = RING_MIN * RING_MIN;
const RING_MAX2 = RING_MAX * RING_MAX;
/** First seed of a run pulls in closer so there is something to grab at once. */
const SEED_RING_MIN = 5;
const SEED_RING_MIN2 = SEED_RING_MIN * SEED_RING_MIN;

/**
 * Recycle radius. Comfortably past the ring so an Emeem you sprinted past
 * lingers behind you for a few seconds instead of blinking out on screen.
 */
const DESPAWN_R = RING_MAX + 25;
const DESPAWN_R2 = DESPAWN_R * DESPAWN_R;

/**
 * How many to keep alive: the config density (perChunk per chunkSize^2) applied
 * to the area of the spawn annulus. Deriving it instead of hardcoding a count
 * means bumping `perChunk` in config.js actually changes the game.
 */
const RING_AREA = Math.PI * (RING_MAX2 - RING_MIN2);
const DENSITY = CONFIG.emeem.perChunk / (CONFIG.world.chunkSize * CONFIG.world.chunkSize);
const TARGET_ACTIVE = Math.max(12, Math.min(POOL_SIZE - 8, Math.round(DENSITY * RING_AREA)));

/** Work caps: bounded cost per frame, never "loop until success". */
const SPAWNS_PER_FRAME = 3;
const SPAWN_TRIES = 5;
const SEED_TRIES = 12;

/** Clearance box tested against world colliders before a spawn is accepted. */
const CLEAR_XZ = E.radius + 0.55;
const CLEAR_Y = E.hoverY + E.bobHeight + E.radius;

/**
 * Vertical grab window, relative to the player's FEET. An Emeem hovers hoverY
 * above whatever ground it sits on, so on flat ground the gap is exactly
 * hoverY. Reaching DOWN as far as hoverY + player.radius keeps an Emeem beside
 * a low kerb grabbable; reaching UP as far as player.height + hoverY lets you
 * snatch one at the apex of a jump (apex = jumpVelocity^2 / 2|gravity| = 1.47m)
 * while still refusing to vacuum the ground from the roof of a 4m block.
 */
const PICK_Y_MIN = -(E.hoverY + CONFIG.player.radius);
const PICK_Y_MAX = CONFIG.player.height + E.hoverY;
const PICK_R2 = E.pickupRadius * E.pickupRadius;
const MAGNET_R = E.magnetRadius;
const MAGNET_R2 = MAGNET_R * MAGNET_R;

/** Halo billboard size, and the pop animation the disc plays when collected. */
// Deliberately a larger multiple than it was: the disc got much smaller, and
// the halo is what makes an emeem findable at 40m through fog. It carries the
// visibility now, so it does not scale down one-for-one with the disc.
const GLOW_SCALE = E.radius * 7.5;
const POP_TIME = 0.24;

/** Additive one-shot particles fired on pickup. */
const BURSTS = 8;
const BURST_TIME = 0.38;
const BURST_MIN = E.radius * 2.4;
const BURST_MAX = E.radius * 9.0;

// ------------------------------------------------------------------- glow map
let _glowTexture = null;

/**
 * Soft radial falloff for the halo and the pickup burst, built as a DataTexture
 * rather than a 2D canvas: no DOM, so it works identically under the headless
 * smoke test, and 64x64 RGBA is 16KB of upload once.
 *
 * The alpha is a wide quadratic shoulder plus a tight hot core, which gives a
 * bloom-ish look without any post-processing (we cannot afford a bloom pass on
 * a mobile GPU that also has to draw shadows).
 */
function getGlowTexture() {
  if (_glowTexture) return _glowTexture;
  const S = 64;
  const data = new Uint8Array(S * S * 4);
  const c = (S - 1) * 0.5;
  const inv = 1 / c;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x - c) * inv;
      const dy = (y - c) * inv;
      const r = Math.sqrt(dx * dx + dy * dy);
      let a = 0;
      if (r < 1) {
        const shoulder = (1 - r) ** 2.2 * 0.7;
        const core = Math.max(0, 1 - r * 2.6) ** 3 * 0.55;
        a = Math.min(1, shoulder + core);
      }
      const i = (y * S + x) * 4;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = (a * 255) | 0;
    }
  }
  const tex = new THREE.DataTexture(data, S, S, THREE.RGBAFormat);
  // DataTexture defaults to NearestFilter and no mipmaps; a nearest-sampled
  // halo blocks up horribly when it is only ~30px on screen.
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  _glowTexture = tex;
  return tex;
}

/**
 * Builds the Emeem field.
 *
 * @param {object} ctx - { THREE, CONFIG, state, bus, scene, camera, renderer,
 *                         engine, world, audio, addScore }. `ctx.world` and
 *                         `ctx.audio` are null at construction time, so nothing
 *                         below dereferences them until update()/reset().
 * @returns {{group: THREE.Group, update: Function, reset: Function}}
 */
/**
 * Bakes a flat greyscale multiplier into a geometry's vertex colours, so parts
 * merged into one buffer can still be shaded differently under one material.
 */
function paintVertexColor(geo, shade) {
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  arr.fill(shade);
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
}

export function createEmeems(ctx) {
  const group = new THREE.Group();
  group.name = 'emeems';

  // ------------------------------------------------------------- shared assets
  // One geometry, one texture, one material per palette colour. Every pooled
  // mesh points at these; activating an Emeem just swaps which material it
  // references, and all six compile to the same shader program so there is no
  // recompile hitch mid-run.
  /**
   * An Emeem is a flattened circular base with a small raised tip at its centre.
   *
   * The two parts are merged into ONE geometry and told apart by a baked vertex
   * colour: white on the base, `emeemTipShade` grey on the tip. The material's
   * own colour multiplies through it, so a single material and a single draw
   * call still give a two-tone object, and all six tones share one geometry.
   * With ~80 of these live, a second draw call each would not be free.
   */
  const baseGeo = new THREE.SphereGeometry(E.radius, 20, 12);
  // Bake the squash into the vertices instead of using mesh.scale, so mesh.scale
  // stays free (and uniform) for the pickup pop animation.
  baseGeo.scale(1, 0.30, 1);

  const TIP_R = E.radius * 0.30;
  const tipGeo = new THREE.SphereGeometry(TIP_R, 14, 10);
  tipGeo.scale(1, 1.25, 1);
  // Sunk slightly so the tip grows out of the base rather than balancing on it.
  tipGeo.translate(0, E.radius * 0.30 * 0.72, 0);

  paintVertexColor(baseGeo, 1);
  paintVertexColor(tipGeo, CONFIG.palette.emeemTipShade);

  const discGeo = mergeGeometries([baseGeo, tipGeo], false);
  baseGeo.dispose();
  tipGeo.dispose();
  discGeo.computeBoundingSphere();

  const glowTex = getGlowTexture();

  /**
   * Soft and matte rather than candy-glossy. A little emissive is kept purely
   * for findability: at high dread the fog far plane closes to ~51m and a fully
   * matte object at that range is indistinguishable from the ground.
   */
  const discMats = COLORS.map((hex) => new THREE.MeshStandardMaterial({
    color: hex,
    vertexColors: true,
    roughness: 0.62,
    metalness: 0.0,
    emissive: hex,
    emissiveIntensity: 0.16,
  }));

  /**
   * The halo deliberately has `fog: false`. The disc itself is fogged - it is a
   * physical object in the world and should recede - but the halo is allowed to
   * punch through, so at max dread (fog far plane closes to 51m) an Emeem at
   * 45m is still a coloured pinprick in the murk instead of nothing at all.
   * depthTest stays on so the halo is correctly hidden behind obstacles.
   */
  const glowMats = COLORS.map((hex) => new THREE.SpriteMaterial({
    map: glowTex,
    color: hex,
    transparent: true,
    opacity: 0.30,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  }));

  // ------------------------------------------------------------------- pooling
  /**
   * @type {Array<{mesh:THREE.Mesh, glow:THREE.Sprite, active:boolean,
   *               basePos:THREE.Vector3, phase:number, colorIndex:number,
   *               respawnAt:number, pop:number}>}
   */
  const pool = new Array(POOL_SIZE);
  for (let i = 0; i < POOL_SIZE; i++) {
    const ci = i % COLORS.length;
    const mesh = new THREE.Mesh(discGeo, discMats[ci]);
    // No shadow casting: 20+ extra casters would eat a meaningful slice of a
    // single 1024 shadow map that is really there for the player and monster.
    // The halo is what visually plants them on the ground.
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.visible = false;

    const glow = new THREE.Sprite(glowMats[ci]);
    glow.visible = false;
    glow.renderOrder = 2;

    group.add(mesh);
    group.add(glow);

    pool[i] = {
      mesh,
      glow,
      active: false,
      basePos: new THREE.Vector3(),
      phase: 0,
      colorIndex: ci,
      respawnAt: 0,
      pop: 0, // > 0 while playing the collect animation: rendered, not collectable
    };
  }

  // Pickup bursts get their own materials because they each need an independent
  // opacity fade, which shared materials cannot give us.
  const bursts = new Array(BURSTS);
  for (let i = 0; i < BURSTS; i++) {
    const mat = new THREE.SpriteMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.visible = false;
    sprite.renderOrder = 3;
    group.add(sprite);
    bursts[i] = { sprite, mat, life: 0 };
  }

  let activeCount = 0;
  let cursor = 0;        // round-robins the pool so respawns spread over slots
  let burstCursor = 0;
  let burstsAlive = 0;
  let seeded = false;
  let lastDread = -1;    // forces the first dread write

  // ------------------------------------------------------------------ helpers

  function activate(e, x, groundY, z) {
    e.colorIndex = (Math.random() * COLORS.length) | 0;
    e.mesh.material = discMats[e.colorIndex];
    e.glow.material = glowMats[e.colorIndex];
    e.basePos.set(x, groundY + E.hoverY, z);
    e.phase = Math.random() * TAU; // per-entry so the field never bobs in lockstep
    e.active = true;
    e.pop = 0;
    e.mesh.scale.setScalar(1);
    e.mesh.position.copy(e.basePos);
    e.mesh.visible = true;
    e.glow.position.copy(e.basePos);
    e.glow.scale.setScalar(GLOW_SCALE);
    e.glow.visible = true;
    activeCount++;
  }

  /** Returns an entry to the pool immediately (out of range, or reset). */
  function retire(e) {
    if (e.active) activeCount--;
    e.active = false;
    e.pop = 0;
    e.mesh.visible = false;
    e.glow.visible = false;
    e.mesh.scale.setScalar(1);
  }

  /**
   * Picks a ground point on the ring around (px, pz), rejects it if it is
   * inside an obstacle or sitting on the monster, and activates `e` there.
   * Tries a handful of candidates and gives up - a congested frame simply
   * spawns fewer Emeems, it never stalls the loop.
   */
  function trySpawn(e, px, pz, s, world, minR2, tries) {
    const mx = s.monster.pos.x;
    const mz = s.monster.pos.z;
    const monsterKeepOut = CONFIG.monster.catchRadius * 4;
    const monsterKeepOut2 = monsterKeepOut * monsterKeepOut;

    for (let a = 0; a < tries; a++) {
      // Triangular distribution on [-1,1] peaked at 0: two cheap randoms, no
      // trig-heavy sampling. angle 0 == straight ahead (-Z), so roughly 55% of
      // spawns land in the forward 120 degree cone and almost none directly
      // behind. That is the whole "keep running forward" incentive.
      const tri = Math.random() + Math.random() - 1;
      const ang = tri * Math.PI;
      // sqrt-lerp of the squared radii gives a uniform area distribution;
      // sampling the radius linearly would crowd everything at the inner edge.
      const r = Math.sqrt(minR2 + Math.random() * (RING_MAX2 - minR2));
      const x = px + Math.sin(ang) * r;
      const z = pz - Math.cos(ang) * r;

      const ddx = x - mx;
      const ddz = z - mz;
      if (ddx * ddx + ddz * ddz < monsterKeepOut2) continue; // no bait in its jaws

      const gy = world ? world.sampleGroundY(x, z) : CONFIG.world.groundY;

      if (world) {
        // Swept volume of the hovering, bobbing disc. Anything overlapping it
        // means the Emeem would be embedded in a rock and unreachable.
        _min.set(x - CLEAR_XZ, gy + 0.05, z - CLEAR_XZ);
        _max.set(x + CLEAR_XZ, gy + CLEAR_Y, z + CLEAR_XZ);
        if (world.queryAABB(_min, _max, _hits).length > 0) continue;
      }

      activate(e, x, gy, z);
      return true;
    }
    return false;
  }

  function spawnBurst(x, y, z, color) {
    const b = bursts[burstCursor];
    burstCursor = (burstCursor + 1) % BURSTS;
    if (b.life <= 0) burstsAlive++;
    b.life = BURST_TIME;
    b.mat.color.setHex(color);
    b.mat.opacity = 0.95;
    b.sprite.position.set(x, y, z);
    b.sprite.scale.setScalar(BURST_MIN);
    b.sprite.visible = true;
  }

  function collect(e, s) {
    const p = e.mesh.position;
    const color = COLORS[e.colorIndex];
    spawnBurst(p.x, p.y, p.z, color);

    // Uncollectable from here on, but still drawn for POP_TIME.
    activeCount--;
    e.active = false;
    e.pop = POP_TIME;
    e.respawnAt = s.time + Math.max(E.respawnDelay, POP_TIME + 0.05);

    if (typeof ctx.addScore === 'function') ctx.addScore(1);
    if (ctx.bus) {
      // Fresh Vector3 on purpose: listeners (audio, future VFX) may keep it.
      ctx.bus.emit('collect', {
        position: new THREE.Vector3(p.x, p.y, p.z),
        color,
        score: s.score,
      });
    }
  }

  /** Fills the field from empty. Used by reset() and as a lazy first-frame seed. */
  function seed(s, world) {
    seeded = true;
    for (let i = 0; i < POOL_SIZE && activeCount < TARGET_ACTIVE; i++) {
      const e = pool[cursor];
      cursor = (cursor + 1) % POOL_SIZE;
      if (e.active || e.pop > 0) continue;
      e.respawnAt = 0;
      trySpawn(e, s.player.pos.x, s.player.pos.z, s, world, SEED_RING_MIN2, SEED_TRIES);
    }
  }

  /**
   * Emeems have to stay findable as the world darkens, so their own emissive
   * and their halo both ride `dread`. Both are plain uniform writes - no
   * needsUpdate, no shader recompile - but they still only run when dread has
   * actually moved.
   */
  function applyDread(d) {
    if (Math.abs(d - lastDread) < 0.01) return;
    lastDread = d;
    const emissive = 0.38 + 0.72 * d;
    const halo = 0.42 + 0.36 * d;
    for (let i = 0; i < discMats.length; i++) {
      discMats[i].emissiveIntensity = emissive;
      glowMats[i].opacity = halo;
    }
  }

  // ------------------------------------------------------------------- update

  function update(dt, c) {
    const s = (c && c.state) || ctx.state;
    const world = (c && c.world) || ctx.world;

    if (!seeded) seed(s, world);
    applyDread(s.dread);

    const px = s.player.pos.x;
    const py = s.player.pos.y; // FEET
    const pz = s.player.pos.z;
    const t = s.time;

    // Nearest reachable Emeem, for the hand's reach-and-grab. We are already
    // walking the whole pool and computing each horizontal distance for the
    // magnet and pickup, so tracking the minimum costs one compare per entry
    // and saves player.js from doing the same sweep a second time.
    let nearD2 = Infinity;
    let nearE = null;

    for (let i = 0; i < POOL_SIZE; i++) {
      const e = pool[i];

      // --- collect animation: expand, spin up, snap out of existence --------
      if (e.pop > 0) {
        e.pop -= dt;
        if (e.pop <= 0) {
          e.pop = 0;
          e.mesh.visible = false;
          e.glow.visible = false;
          e.mesh.scale.setScalar(1);
          continue;
        }
        const p = 1 - e.pop / POP_TIME;
        // A small flare, then crushed out of existence - NOT a bloom-and-float.
        // The emeem was just pinched; it should die in the claw.
        e.mesh.scale.setScalar((1 + 0.5 * p) * (1 - p * p));
        // Ride the pincer while it is being crushed, so the catch reads as the
        // hand taking it rather than the emeem escaping upward.
        if (s.player.grabPoint) {
          const kk = 1 - Math.exp(-20 * dt);
          e.mesh.position.x += (s.player.grabPoint.x - e.mesh.position.x) * kk;
          e.mesh.position.y += (s.player.grabPoint.y - e.mesh.position.y) * kk;
          e.mesh.position.z += (s.player.grabPoint.z - e.mesh.position.z) * kk;
        } else {
          e.mesh.position.y += dt * 1.6;
        }
        e.mesh.quaternion.setFromAxisAngle(AXIS_Y, t * E.spinSpeed * 4 + e.phase).multiply(TILT_Q);
        e.glow.position.copy(e.mesh.position);
        e.glow.scale.setScalar(GLOW_SCALE * (1 + 1.6 * p) * (1 - p * p * p));
        continue;
      }

      if (!e.active) continue;

      const bp = e.basePos;
      let dx = px - bp.x;
      let dz = pz - bp.z;
      let d2 = dx * dx + dz * dz;

      // --- recycle anything the player has left far behind ------------------
      if (d2 > DESPAWN_R2) {
        retire(e);
        e.respawnAt = 0;
        continue;
      }

      // Vertical eligibility gates BOTH the magnet and the pickup, so an Emeem
      // on the ground is not dragged up to a player standing on a tall block.
      const rel = bp.y - py;
      const reachable = rel > PICK_Y_MIN && rel < PICK_Y_MAX;

      if (reachable && d2 < MAGNET_R2) {
        const d = Math.sqrt(d2);
        // Pull toward the PINCER, not the player origin: an emeem drawn to the
        // body centre ends up hovering over the palm, which looks like it is
        // being absorbed rather than picked up. The pickup test below still uses
        // distance to the player, so this changes only what the eye sees.
        const gx = s.player.grabPoint ? s.player.grabPoint.x : px;
        const gz = s.player.grabPoint ? s.player.grabPoint.z : pz;
        const gy = s.player.grabPoint ? s.player.grabPoint.y : py + E.hoverY;
        // Ease strengthens toward the centre so the pull snaps rather than
        // creeping. exp() form is frame-rate independent: same feel at 60 and
        // 120fps, which matters because this phone can run either.
        const ease = 1 - d / MAGNET_R;
        const k = 1 - Math.exp(-E.magnetStrength * ease * dt);
        bp.x += (gx - bp.x) * k;
        bp.z += (gz - bp.z) * k;
        // Rise to the pincer's height, so a mid-jump catch flies up into the
        // pinch instead of clipping through the wrist.
        bp.y += (gy - bp.y) * k;
        dx = px - bp.x;
        dz = pz - bp.z;
        d2 = dx * dx + dz * dz;
      }

      // Post-magnet distance, so the claw tracks where the Emeem is being
      // pulled to rather than where it started the frame.
      if (reachable && d2 < nearD2) { nearD2 = d2; nearE = e; }

      // --- caught it --------------------------------------------------------
      if (reachable && d2 < PICK_R2) {
        // Commit this frame's magnet motion first: collect() reads the mesh
        // position for the burst and for the 'collect' payload, and a stale
        // one would put the flash a frame behind the disc you just grabbed.
        e.mesh.position.set(bp.x, bp.y + Math.sin(t * E.bobSpeed + e.phase) * E.bobHeight, bp.z);
        collect(e, s);
        continue;
      }

      // --- idle: bob, precess, halo pulse ----------------------------------
      const y = bp.y + Math.sin(t * E.bobSpeed + e.phase) * E.bobHeight;
      e.mesh.position.set(bp.x, y, bp.z);
      e.mesh.quaternion.setFromAxisAngle(AXIS_Y, t * E.spinSpeed + e.phase).multiply(TILT_Q);
      e.glow.position.set(bp.x, y, bp.z);
      // Halo breathes slightly out of phase with the bob: cheap life, no cost.
      e.glow.scale.setScalar(GLOW_SCALE * (1 + 0.07 * Math.sin(t * E.bobSpeed * 1.7 + e.phase)));
    }

    // --- publish the nearest Emeem for the claw ---------------------------
    // entities/player.js reads these three every frame to drive the reach and
    // the glance-toward. Distance is horizontal, matching pickupRadius.
    if (nearE) {
      s.player.hasNearestEmeem = true;
      s.player.nearestEmeemDist = Math.sqrt(nearD2);
      s.player.nearestEmeem.copy(nearE.mesh.position);
    } else {
      s.player.hasNearestEmeem = false;
      s.player.nearestEmeemDist = Infinity;
    }

    // --- top the field back up -------------------------------------------
    // Bounded: at most SPAWNS_PER_FRAME successes, one sweep of the pool, and
    // a bail-out the moment a full candidate batch is rejected (which means the
    // ring is congested and retrying this frame would just burn queryAABB).
    let budget = SPAWNS_PER_FRAME;
    for (let i = 0; i < POOL_SIZE && activeCount < TARGET_ACTIVE && budget > 0; i++) {
      const e = pool[cursor];
      cursor = (cursor + 1) % POOL_SIZE;
      if (e.active || e.pop > 0 || t < e.respawnAt) continue;
      if (trySpawn(e, px, pz, s, world, RING_MIN2, SPAWN_TRIES)) budget--;
      else break;
    }

    // --- pickup bursts ----------------------------------------------------
    if (burstsAlive > 0) {
      for (let i = 0; i < BURSTS; i++) {
        const b = bursts[i];
        if (b.life <= 0) continue;
        b.life -= dt;
        if (b.life <= 0) {
          b.life = 0;
          b.mat.opacity = 0;
          b.sprite.visible = false;
          burstsAlive--;
          continue;
        }
        const p = 1 - b.life / BURST_TIME;
        // sqrt(p) expands fast then settles; (1-p)^2 fades slow then fast.
        b.sprite.scale.setScalar(BURST_MIN + (BURST_MAX - BURST_MIN) * Math.sqrt(p));
        b.sprite.position.y += dt * 0.9;
        b.mat.opacity = (1 - p) * (1 - p) * 0.95;
      }
    }
  }

  // -------------------------------------------------------------------- reset

  function reset() {
    for (let i = 0; i < POOL_SIZE; i++) {
      const e = pool[i];
      retire(e);
      e.respawnAt = 0;
    }
    activeCount = 0; // retire() already decremented, but never trust drift
    cursor = 0;

    for (let i = 0; i < BURSTS; i++) {
      const b = bursts[i];
      b.life = 0;
      b.mat.opacity = 0;
      b.sprite.visible = false;
    }
    burstsAlive = 0;
    burstCursor = 0;

    lastDread = -1;
    seeded = false;
    // main.js calls world.reset() before us, so the colliders we test against
    // are the freshly regenerated ones.
    seed(ctx.state, ctx.world);
    applyDread(ctx.state.dread);
  }

  // main.js never adds module groups to the scene; each module adds its own.
  // ctx.scene is live at construction (the renderer is built first).
  if (ctx.scene) ctx.scene.add(group);

  return { group, update, reset };
}
