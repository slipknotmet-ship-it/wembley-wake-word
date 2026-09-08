/**
 * EMEEM - the boat.
 *
 * Three canoes sit moored in the shallows on the near shore of every lake. Walk
 * into one and you are aboard; the 8-way pad steers instead of walking, JUMP
 * gets you off, and a hull meter drains the whole time you are on the water.
 * The paddle strokes while you move and stands stowed upright while you do not.
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

/**
 * A CANOE, and a paddle to drive it with.
 *
 * Hand-rolled triangles rather than boxes, because a canoe is the one shape a
 * box cannot fake: it is pointed at BOTH ends, its beam swells amidships, and
 * its keel and gunwale both rise toward the stems. Nine stations along the
 * length carry those three curves, and the skin is stitched between them.
 *
 * It is a hollow shell - outer skin, inner skin, and a rim capping the two -
 * because the material is FrontSide and a single-sided hull is invisible from
 * above, which would show the lake straight through the boat you are sitting in.
 *
 * COLOUR IS THE VISIBILITY MARKER. The first version carried a 3.2m mast and a
 * pennant purely so a boat could be found at ninety metres through fog. A canoe
 * with a mast is not a canoe, so the job moves to the hull: a vermilion shell on
 * teal water is the loudest thing on the lake, and at 4.4m long it subtends more
 * of the screen at that range than the mast ever did.
 */
const HULL_LEN = 4.4;
const HULL_BEAM = 1.12;
/** Gunwale height amidships, and how much higher the stems ride. */
const SHEER_MID = 0.44;
const SHEER_END = 0.32;
/** Rocker: how far the keel lifts clear of the water at the ends. */
const KEEL_END = 0.17;
const STATIONS = 9;

/** Half-beam at station t in [-1, 1]. Zero at both stems, fullest amidships. */
const halfBeam = (t) => (HULL_BEAM / 2) * Math.pow(Math.max(0, 1 - t * t), 0.62);
const gunwaleY = (t) => SHEER_MID + SHEER_END * t * t;
const keelY = (t) => KEEL_END * t * t;

/** Accumulates flat-shaded triangles with a baked vertex colour. */
function makeSink() {
  const pos = [], nor = [], col = [];
  const push = (ax, ay, az, bx, by, bz, cx, cy, cz, r, g, b) => {
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    col.push(r, g, b, r, g, b, r, g, b);
  };
  return {
    tri: push,
    /** Two triangles, wound a-b-c-d. */
    quad(a, b, c, d, r, g, b2) {
      push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2], r, g, b2);
      push(a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2], r, g, b2);
    },
    /** An axis-aligned box, given centre and half-extents. */
    box(cx, cy, cz, hx, hy, hz, r, g, b2) {
      const x0 = cx - hx, x1 = cx + hx, y0 = cy - hy, y1 = cy + hy, z0 = cz - hz, z1 = cz + hz;
      const P = [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];
      const F = [[4,5,6,7],[1,0,3,2],[0,4,7,3],[5,1,2,6],[3,7,6,2],[0,1,5,4]];
      for (const f of F) this.quad(P[f[0]], P[f[1]], P[f[2]], P[f[3]], r, g, b2);
    },
    build() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3));
      // barkMaterial has vertexColors: true, and a geometry with no colour
      // attribute reads the constant (0,0,0) and renders PURE BLACK. This is
      // the whole reason every part below carries one.
      g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
      g.computeBoundingSphere();
      return g;
    },
  };
}

/**
 * Vertex colours MULTIPLY the material colour, which is bark (0x6b5240) lerped
 * toward its dread tone. So these are gains, not RGB: anything over 1 on a
 * channel is pushing that channel past the bark it is painted onto.
 */
const C_HULL = [3.85, 1.32, 0.52];   // vermilion, and loud on teal
const C_IN = [1.95, 1.55, 1.15];     // bare wood inside, so the shell has two tones
const C_RIM = [2.60, 2.35, 2.05];    // pale rail, which is what draws the sheer line
const C_SEAT = [1.70, 1.35, 1.00];
const C_SHAFT = [2.05, 1.80, 1.42];
const C_BLADE = [3.20, 2.65, 1.45];  // near-white gold: stowed upright, this is
                                     // the thing that finds a boat through fog

function buildHullGeometry() {
  const S = makeSink();
  // Inner skin sits inside the outer one, so the rim between them has width.
  const INSET = 0.86, LIFT = 0.055;
  const st = [];
  for (let i = 0; i < STATIONS; i++) {
    const t = -1 + (2 * i) / (STATIONS - 1);
    st.push({ t, z: (t * HULL_LEN) / 2, w: halfBeam(t), gy: gunwaleY(t), ky: keelY(t) });
  }
  for (let i = 0; i < STATIONS - 1; i++) {
    const a = st[i], b = st[i + 1];
    for (const side of [1, -1]) {
      // Outer skin: gunwale down to the keel line at x = 0. Wound so the face
      // points away from the hull on each side.
      const g0 = [side * a.w, a.gy, a.z], g1 = [side * b.w, b.gy, b.z];
      const k0 = [0, a.ky, a.z], k1 = [0, b.ky, b.z];
      if (side > 0) S.quad(g0, g1, k1, k0, ...C_HULL);
      else S.quad(k0, k1, g1, g0, ...C_HULL);

      // Inner skin, reversed, so the inside of the boat is visible from above.
      const h0 = [side * a.w * INSET, a.gy, a.z], h1 = [side * b.w * INSET, b.gy, b.z];
      const j0 = [0, a.ky + LIFT, a.z], j1 = [0, b.ky + LIFT, b.z];
      if (side > 0) S.quad(j0, j1, h1, h0, ...C_IN);
      else S.quad(h0, h1, j1, j0, ...C_IN);

      // The rim capping the two skins along the gunwale.
      if (side > 0) S.quad(h0, h1, g1, g0, ...C_RIM);
      else S.quad(g0, g1, h1, h0, ...C_RIM);
    }
  }
  // Two thwarts, which is what stops a canoe reading as a bathtub.
  for (const tz of [-0.85, 0.95]) {
    const w = halfBeam(tz / (HULL_LEN / 2)) * 0.96;
    S.box(0, gunwaleY(tz / (HULL_LEN / 2)) - 0.05, tz, w, 0.035, 0.075, ...C_SEAT);
  }
  return S.build();
}

/**
 * A single-blade paddle, grip at the origin and blade straight down -Y, so the
 * whole stroke is two rotations of the mesh and no vertex ever moves.
 */
function buildPaddleGeometry() {
  const S = makeSink();
  // 1.55m overall, which is a real single-blade canoe paddle. The first cut was
  // 2.0m and read as a punt pole sticking half a boat-length out to one side.
  const SHAFT = 1.02;
  S.box(0, 0.055, 0, 0.115, 0.05, 0.045, ...C_SHAFT);            // T-grip
  S.box(0, -SHAFT / 2, 0, 0.032, SHAFT / 2, 0.032, ...C_SHAFT);  // shaft
  S.box(0, -SHAFT - 0.26, 0, 0.145, 0.27, 0.016, ...C_BLADE);    // blade
  return S.build();
}

export function createBoats(ctx, material) {
  const { state } = ctx;
  const group = new THREE.Group();
  group.name = 'boats';
  const hullGeo = buildHullGeometry();
  const paddleGeo = buildPaddleGeometry();

  /**
   * One hull per mooring, each with its paddle as a CHILD so the paddle
   * inherits the boat's position and yaw for free and its own rotation is
   * nothing but the stroke. Six meshes in total, and the two boats you are not
   * near are frustum-culled, so the usual cost is two draw calls.
   */
  const boats = [];
  for (let i = 0; i < BOATS_PER_LAKE; i++) {
    const mesh = new THREE.Mesh(hullGeo, material);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.visible = false;
    const paddle = new THREE.Mesh(paddleGeo, material);
    paddle.castShadow = false;
    paddle.receiveShadow = false;
    mesh.add(paddle);
    group.add(mesh);
    boats.push({ mesh, paddle, x: 0, z: 0, yaw: 0, taken: false, lake: -1 });
  }

  /**
   * THE STROKE.
   *
   * Stowed, the paddle stands upright in the boat, blade in the air - which is
   * how a moored canoe is actually left, and doubles as the tall bright thing
   * that finds it through fog now that the mast is gone.
   *
   * Under way it is one cycle: catch at the bow, sweep to the stern, lift, swing
   * forward, and change sides at the top of every other recovery. Nothing is
   * skinned and no vertex moves - the mesh is built with the grip at its origin
   * and the blade straight down, so a pitch and a roll are the whole animation.
   */
  const STROKE_TIME = 0.78;
  /** Fraction of the cycle spent in the water. The rest is the recovery. */
  const CATCH = 0.62;
  let strokeT = 0;
  let strokeSide = 1;

  /** Upright in the boat, blade up, resting against the forward thwart. */
  function stowPaddle(b) {
    b.paddle.position.set(0.20, gunwaleY(0) - 0.02, 0.35);
    b.paddle.rotation.set(Math.PI - 0.20, 0, 0.16);
  }

  function strokePaddle(b, dt, moving) {
    if (!moving) { strokeT = 0; stowPaddle(b); return; }
    strokeT += dt / STROKE_TIME;
    while (strokeT >= 1) { strokeT -= 1; strokeSide = -strokeSide; }

    let sweep;   // + is toward the bow (-Z), - is toward the stern
    let lift;    // radians of extra out-lean while the blade is clear
    if (strokeT < CATCH) {
      const u = strokeT / CATCH;                 // power: bow -> stern
      sweep = 0.62 - 1.16 * u;
      lift = 0;
    } else {
      const u = (strokeT - CATCH) / (1 - CATCH); // recovery: stern -> bow, clear
      sweep = -0.54 + 1.16 * u;
      lift = Math.sin(u * Math.PI) * 0.42;
    }
    // Hands at the gunwale on the working side; the shaft leans out over it.
    b.paddle.position.set(strokeSide * 0.30, gunwaleY(0) + 0.30, 0.15);
    b.paddle.rotation.set(sweep, 0, strokeSide * (0.62 + lift));
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
      stowPaddle(b);
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

        // MINUS on both. Forward is (-sin h, -cos h) - the same convention the
        // heading solve above is written against - and this line had a plus on
        // the X term, which mirrored the boat's whole left-right axis: press
        // right, sail left. It survived because every test only ever sailed UP,
        // where sin(0) is 0 and the sign cannot be observed. There is now a
        // check for each of the eight directions.
        b.x -= Math.sin(heading) * speed * dt;
        b.z -= Math.cos(heading) * speed * dt;
        b.yaw = heading;
        // Stroke whenever it is actually making way. The threshold is above the
        // decel tail so the paddle stops the moment the boat is coasting to a
        // halt rather than miming a stroke that is doing nothing.
        strokePaddle(b, dt, speed > 0.8);
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

    for (let i = 0; i < boats.length; i++) {
      if (i !== riding) stowPaddle(boats[i]);
      place(boats[i]);
    }
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
    /**
     * Test seam: drop the boat you are riding at a given spot. The suites need
     * it to check steering from the middle of the lake - every direction tried
     * from the mooring beaches instantly on the three that point at the shore
     * two metres away, which is exactly how a mirrored X axis went unnoticed.
     */
    placeRider: (x, z) => { if (riding >= 0) { boats[riding].x = x; boats[riding].z = z; } },
    /** Diagnostics for the suites. */
    debug: () => ({ riding, lake: lakeShown, hull: state.player.hull || 0, speed,
                    boats: boats.map((b) => ({ x: +b.x.toFixed(2), z: +b.z.toFixed(2), taken: b.taken })) }),
  };
}
