/**
 * EMEEM - the boat.
 *
 * Three sit moored in the shallows on the near shore of every lake. Walk into
 * one and you are aboard; the 8-way pad steers instead of walking, JUMP gets you
 * off, and a hull meter drains the whole time you are on the water.
 *
 * WHY A FINITE HULL AND NOT A CLEVER TURN RADIUS. On open water the Protector's
 * steering degenerates to pure pursuit, so a boat holding a minimum-radius
 * circle settles at a steady separation of about 2.2m at the top tier - outside
 * its 1.35m reach. A boat that can circle is therefore uncatchable at EVERY
 * tier, and no turn rate fixes it: pulling the separation inside the catch
 * radius at 8.6 m/s would need a 5.4 rad/s turn, which is not a boat, it is a
 * spinning top. So the bound is a resource, not a geometry: 13.3 seconds of
 * water, ever, and a crossing costs 0.68 of it.
 *
 * NO COLLIDER, EVER. Colliders in this game live in immutable per-chunk buckets
 * and are all anchored to the ground plane; a moving one has nowhere to live,
 * and a raised one would wake a ceiling branch in player.js that has never
 * executed in this game's history. The boat is a mesh and a trigger radius.
 */
import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { waterAt, lakeIndex, lakeCentreZ, boatSpot, BOATS_PER_LAKE, LAKE_HALF_Z, SHORE_WARP_MAX } from '../world/biome.js';

const B = CONFIG.world.boat;
const TAU = Math.PI * 2;
const _spot = { x: 0, z: 0 };

/** A little punt: flat deck, raked bow, a mast tall enough to see through fog. */
function buildBoatGeometry() {
  const parts = [];
  const hull = new THREE.BoxGeometry(1.5, 0.34, 3.2);
  hull.translate(0, 0.17, 0);
  parts.push(hull);
  const bow = new THREE.ConeGeometry(0.75, 1.1, 4);
  bow.rotateX(-Math.PI / 2);
  bow.rotateY(Math.PI / 4);
  bow.translate(0, 0.17, -2.05);
  parts.push(bow);
  const mast = new THREE.CylinderGeometry(0.06, 0.08, 3.2, 5);
  mast.translate(0, 1.6, 0.2);
  parts.push(mast);
  const flag = new THREE.BoxGeometry(0.9, 0.42, 0.04);
  flag.translate(0.45, 2.9, 0.2);
  parts.push(flag);

  const merged = mergeParts(parts);
  for (const p of parts) p.dispose();
  return merged;
}

function mergeParts(parts) {
  // Hand-rolled merge so this file does not need BufferGeometryUtils: every
  // part is non-indexed position+normal, and the boat is one small mesh.
  let total = 0;
  const nonIndexed = parts.map((g) => {
    const ni = g.index ? g.toNonIndexed() : g.clone();
    ni.deleteAttribute('uv');
    total += ni.attributes.position.count;
    return ni;
  });
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  // barkMaterial has vertexColors: true, and a geometry with no colour
  // attribute reads the constant (0,0,0) and renders PURE BLACK. This is the
  // whole reason the boat needs one.
  const col = new Float32Array(total * 3);
  let o = 0;
  for (let i = 0; i < nonIndexed.length; i++) {
    const g = nonIndexed[i];
    const p = g.attributes.position.array;
    const n = g.attributes.normal.array;
    // the flag is the last part: paint it bright so it reads at 90m
    const bright = i === nonIndexed.length - 1;
    for (let v = 0; v < g.attributes.position.count; v++) {
      pos[(o + v) * 3] = p[v * 3];
      pos[(o + v) * 3 + 1] = p[v * 3 + 1];
      pos[(o + v) * 3 + 2] = p[v * 3 + 2];
      nor[(o + v) * 3] = n[v * 3];
      nor[(o + v) * 3 + 1] = n[v * 3 + 1];
      nor[(o + v) * 3 + 2] = n[v * 3 + 2];
      col[(o + v) * 3] = bright ? 2.6 : 1.0;
      col[(o + v) * 3 + 1] = bright ? 1.5 : 0.86;
      col[(o + v) * 3 + 2] = bright ? 0.5 : 0.66;
    }
    o += g.attributes.position.count;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.computeBoundingSphere();
  return out;
}

export function createBoats(ctx, material) {
  const { state } = ctx;
  const group = new THREE.Group();
  group.name = 'boats';
  const geo = buildBoatGeometry();

  /** One mesh per mooring of the nearest lake. Three meshes, three draw calls. */
  const boats = [];
  for (let i = 0; i < BOATS_PER_LAKE; i++) {
    const mesh = new THREE.Mesh(geo, material);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.visible = false;
    group.add(mesh);
    boats.push({ mesh, x: 0, z: 0, yaw: 0, taken: false, lake: -1 });
  }

  let lakeShown = -1;
  /** Index into `boats` of the one being ridden, or -1. */
  let riding = -1;
  let heading = 0;            // 0 is up-screen, the way you arrive
  let speed = 0;

  function moorAll(n) {
    lakeShown = n;
    for (let i = 0; i < boats.length; i++) {
      const b = boats[i];
      boatSpot(n, i, _spot);
      b.x = _spot.x; b.z = _spot.z; b.yaw = 0; b.taken = false; b.lake = n;
      b.mesh.visible = true;
    }
    riding = -1;
    speed = 0;
  }

  function place(b) {
    b.mesh.position.set(b.x, CONFIG.world.groundY + 0.06, b.z);
    b.mesh.rotation.y = b.yaw;
  }

  function board(i) {
    riding = i;
    heading = boats[i].yaw;
    speed = 0;
    state.player.boat = 1;
    state.player.hull = 1;
    ctx.bus.emit('board', {});
  }

  /** Leaves the boat where it is; it is spent either way. */
  function leave(swamped) {
    if (riding < 0) return;
    const b = boats[riding];
    b.taken = true;
    if (swamped) b.mesh.visible = false;
    riding = -1;
    speed = 0;
    state.player.boat = 0;
    ctx.bus.emit('unboard', { swamped: !!swamped });
  }

  function update(dt, c) {
    const s = (c && c.state) || state;
    const p = s.player.pos;
    const n = lakeIndex(p.z);

    // Re-moor when a different lake becomes the near one. Anything ridden or
    // spent at the old lake is gone: crossing is one-way by construction.
    if (n >= 0 && n !== lakeShown && Math.abs(p.z - lakeCentreZ(n)) < CONFIG.world.fogFar + LAKE_HALF_Z + SHORE_WARP_MAX) {
      moorAll(n);
    }
    if (lakeShown < 0) return;

    if (s.phase !== 'playing') { if (riding >= 0) leave(false); return; }

    if (riding < 0) {
      // Board on proximity. One button in this game and it stays JUMP.
      const r2 = B.boardRadius * B.boardRadius;
      for (let i = 0; i < boats.length; i++) {
        const b = boats[i];
        if (b.taken) continue;
        const dx = p.x - b.x;
        const dz = p.z - b.z;
        if (dx * dx + dz * dz < r2) { board(i); break; }
      }
    }

    if (riding >= 0) {
      const b = boats[riding];
      // JUMP is the only control that is not steering: it puts you overboard.
      if (s.input.jumpPressed) {
        s.input.jumpPressed = false;
        p.x = b.x - Math.sin(heading) * B.hopOut;
        p.z = b.z - Math.cos(heading) * B.hopOut;
        leave(false);
      } else {
        // The pad sets a desired heading; the boat swings toward it. Walking
        // turns instantly, a boat does not, and that difference is most of what
        // makes it feel like a boat rather than a faster hand.
        const ix = s.input.x || 0;
        const iz = s.input.z || 0;
        // atan2(-ix, iz), NOT atan2(ix, -iz). This game's forward vector is
        // (-sin h, -cos h), so heading 0 points up-screen at -Z. Getting it
        // backwards sailed the boat AWAY from the lake on an UP input, which
        // beached it after 1.4s and read as "the boat does not move".
        const want = (ix || iz) ? Math.atan2(-ix, iz) : heading;
        let d = want - heading;
        while (d > Math.PI) d -= TAU;
        while (d < -Math.PI) d += TAU;
        const step = B.turnRate * dt;
        heading += d > step ? step : (d < -step ? -step : d);
        const throttle = (ix || iz) ? 1 : 0;
        const rate = throttle ? B.accel : -B.decel;
        speed = Math.max(0, Math.min(B.speed, speed + rate * dt));

        b.x += Math.sin(heading) * speed * dt;
        b.z -= Math.cos(heading) * speed * dt;
        b.yaw = heading;
        p.x = b.x;
        p.z = b.z;

        // ONE flat drain rate from the moment you board. No spool-up, no
        // boarding charge: a crossing is 9.09s and costs 0.68 of the hull,
        // leaving 32% for a fumbled heading, and 13.3s is all the water time
        // that exists. Crossing and returning needs 1.36 and cannot happen.
        s.player.hull = Math.max(0, (s.player.hull || 0) - B.drain * dt);
        if (s.player.hull <= 0) leave(true);
        // Beaching: the far shore takes the boat back.
        else if (waterAt(b.x, b.z) <= 0) leave(false);
      }
    }

    for (let i = 0; i < boats.length; i++) place(boats[i]);
  }

  function reset() {
    lakeShown = -1;
    riding = -1;
    speed = 0;
    state.player.boat = 0;
    state.player.hull = 0;
    for (const b of boats) { b.taken = false; b.mesh.visible = false; }
  }

  return {
    group,
    update,
    reset,
    /** True while the player is aboard - player.js hands over its controls. */
    riding: () => riding >= 0,
    /** Diagnostics for the suites. */
    debug: () => ({ riding, lake: lakeShown, hull: state.player.hull || 0, speed,
                    boats: boats.map((b) => ({ x: +b.x.toFixed(2), z: +b.z.toFixed(2), taken: b.taken })) }),
  };
}
