/**
 * EMEEM - the waterfall at the first lake.
 *
 * WHY THIS IS A CUTSCENE AND NOT TERRAIN.
 *
 * The world is flat by construction. sampleGroundY returns a constant,
 * pushCollider hard-codes min.y = groundY, and the lake exists only because
 * water was made a horizontal SCALAR FIELD that never touches Y - see the long
 * note above LAKE_Z0 in world/biome.js for what lowering the ground would cost.
 * A waterfall is a forty-metre drop. There is no way to put one in this world.
 *
 * So it is not in the world. Going over the lip stops the simulation, hides the
 * world entirely, and shows a purpose-built diorama instead: a cliff, a curtain
 * of water, two flanking walls, mist, and a basin far below. The camera orbits
 * it in slow motion while the hand falls past. Then the set is put away, the
 * world comes back, and the player is standing thirty metres further on - in
 * the city band, because the first lake sits at a beach centre and the far
 * shore is the boundary.
 *
 * Nothing about the world moved. The player did not move in Y in any frame the
 * physics was running. Every invariant the collision system rests on is intact,
 * because for those three seconds there is no collision system.
 *
 * ONE LAKE, ONCE. It fires at lake 0 and nowhere else, and only on the first
 * crossing of a run. A set piece you see every 1152 metres is not a set piece,
 * it is a toll booth.
 */
import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import {
  lakeIndex, lakeCentreZ, lakeCentreX, shoreWarp, LAKE_HALF_Z, waterAt, fallsLipZ,
} from '../world/biome.js';

/** Metres the hand falls. Deep enough that the far wall is out of reach. */
const DROP = 46;
/** Seconds the fall takes, in wall time. It is slow on purpose. */
const FALL_TIME = 3.4;
/** Seconds after the landing before control comes back. */
const SETTLE_TIME = 0.55;
/** Metres past the lip the hand is standing when it all comes back. */
const LAND_AHEAD = 30;

const _v = new THREE.Vector3();
const _camPos = new THREE.Vector3();
const _camLook = new THREE.Vector3();

/** Vertex colours multiply the material, so these are gains, not RGB. */
// The gorge walls face INWARD, across the sun rather than into it, so a Lambert
// surface there receives almost nothing and renders black. These gains are what
// keeps them readable rock instead of a black rectangle beside the water.
const C_ROCK_DARK = [1.95, 1.86, 2.05];
const C_ROCK_LIP = [1.15, 1.12, 1.10];
const C_MIST = [1.00, 1.00, 1.00];

/** Source blob for the cloud bank, non-indexed so its triangles can be read
 *  straight out and re-emitted at any size. */
const ICO = (() => {
  const g = new THREE.IcosahedronGeometry(1, 1).toNonIndexed();
  g.deleteAttribute('uv');
  g.deleteAttribute('normal');
  return g;
})();

/** Accumulates flat-shaded triangles with a baked vertex colour. */
function makeSink() {
  const pos = [], nor = [], col = [];
  const tri = (ax, ay, az, bx, by, bz, cx, cy, cz, r, g, b) => {
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
    tri,
    quad(a, b, c, d, r, g, bl) {
      tri(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2], r, g, bl);
      tri(a[0], a[1], a[2], c[0], c[1], c[2], d[0], d[1], d[2], r, g, bl);
    },
    /** One transformed icosahedron. Clouds are not made of boxes. */
    blob(cx, cy, cz, rx, ry, rz, r, g, bl) {
      const src = ICO.attributes.position.array;
      for (let i = 0; i < src.length; i += 9) {
        tri(
          cx + src[i] * rx, cy + src[i + 1] * ry, cz + src[i + 2] * rz,
          cx + src[i + 3] * rx, cy + src[i + 4] * ry, cz + src[i + 5] * rz,
          cx + src[i + 6] * rx, cy + src[i + 7] * ry, cz + src[i + 8] * rz,
          r, g, bl,
        );
      }
    },
    box(cx, cy, cz, hx, hy, hz, r, g, bl) {
      const x0 = cx - hx, x1 = cx + hx, y0 = cy - hy, y1 = cy + hy, z0 = cz - hz, z1 = cz + hz;
      const P = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
                 [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
      const F = [[4, 5, 6, 7], [1, 0, 3, 2], [0, 4, 7, 3], [5, 1, 2, 6], [3, 7, 6, 2], [0, 1, 5, 4]];
      for (const f of F) this.quad(P[f[0]], P[f[1]], P[f[2]], P[f[3]], r, g, bl);
    },
    build() {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
      g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(nor), 3));
      // Every mergeable prop in this game carries a colour attribute, because
      // the shared materials have vertexColors: true and a geometry without one
      // reads the constant (0,0,0) and renders pure black.
      g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(col), 3));
      g.computeBoundingSphere();
      return g;
    },
  };
}

/**
 * @param {object} ctx
 * @param {THREE.Material} stoneMaterial  shared, so the cliff costs no material
 */
export function createFalls(ctx, stoneMaterial) {
  const { state, bus } = ctx;
  const group = new THREE.Group();
  group.name = 'falls';
  group.visible = false;

  const GY = CONFIG.world.groundY;
  const GORGE_HALF = 19;     // half-width of the gap the water comes through
  const WALL_OUT = 26;       // how far the flanking walls run to either side
  /**
   * Half-width of the WATER, which is much narrower than the gorge.
   *
   * A curtain spanning the whole gorge is not a waterfall, it is a dam: from
   * the thirty metres the closing shot stands back, 38m of water subtends 64
   * degrees and fills a 68-degree lens edge to edge, with nothing either side
   * to say how big it is. 14m of water inside a 38m gorge leaves rock on both
   * shoulders, and the rock is what gives the water its scale.
   */
  const FALL_HALF = 7;

  // ------------------------------------------------------------- the rock
  const S = makeSink();
  // The lip you came off: a shelf running back toward the lake, with the gorge
  // cut out of the middle of it.
  // +Z is upstream, where the lake is. -Z is downstream, where you land. The
  // walls run BOTH ways: upstream they are the channel that feeds the lip,
  // downstream they are the gorge the camera ends up inside, and the first cut
  // built only the upstream half - which left the closing shot looking at a
  // waterfall standing in an empty sky.
  const Z_UP = 44;
  const Z_DOWN = -46;
  for (const side of [-1, 1]) {
    const x0 = side * GORGE_HALF;
    const x1 = side * (GORGE_HALF + WALL_OUT);
    // the shelf you walked off, upstream of the lip only
    S.quad([x0, 0, 0], [x1, 0, 0], [x1, 0, Z_UP], [x0, 0, Z_UP], ...C_ROCK_LIP);
    // the wall face, its whole length
    S.quad([x0, 0, Z_DOWN], [x0, 0, Z_UP], [x0, -DROP - 8, Z_UP], [x0, -DROP - 8, Z_DOWN], ...C_ROCK_DARK);
    // the downstream end cap, so the gorge does not open into nothing
    S.quad([x1, 0, Z_DOWN], [x0, 0, Z_DOWN], [x0, -DROP - 8, Z_DOWN], [x1, -DROP - 8, Z_DOWN], ...C_ROCK_DARK);
    // and the top of the wall downstream of the lip, seen from the air
    S.quad([x1, 0, Z_DOWN], [x1, 0, 0], [x0, 0, 0], [x0, 0, Z_DOWN], ...C_ROCK_LIP);
  }
  // The back wall of the plunge, behind the curtain: this is what the water is
  // drawn against, and without it the curtain hangs in an empty sky.
  S.quad([-GORGE_HALF, 0, 1.6], [GORGE_HALF, 0, 1.6],
         [GORGE_HALF, -DROP - 8, 1.6], [-GORGE_HALF, -DROP - 8, 1.6], ...C_ROCK_DARK);
  // Boulders in the plunge pool, for scale. Without something of known size
  // down there a forty-metre drop reads as a four-metre one.
  const seedRock = (x, z, r) => S.box(x, -DROP + r * 0.4, z, r, r * 0.7, r * 0.9, ...C_ROCK_LIP);
  // Clustered under the fall, where the water would actually have put them.
  seedRock(-5.5, -6, 2.1); seedRock(3.2, -11, 2.8); seedRock(7.6, -3.5, 1.7);
  seedRock(-2.0, -17, 2.3); seedRock(-9.5, -13, 1.5); seedRock(11.0, -19, 2.0);
  const rock = new THREE.Mesh(S.build(), stoneMaterial);
  rock.name = 'falls-rock';
  rock.castShadow = false;
  rock.receiveShadow = false;
  group.add(rock);

  // ------------------------------------------------------------ the water
  const waterMat = new THREE.MeshBasicMaterial({
    color: 0xcfe8f2, transparent: true, opacity: 0.82, side: THREE.DoubleSide, depthWrite: false,
  });
  // The curtain. Two sheets a little apart and a little different in width,
  // which at this scale reads as depth for the price of one extra quad each.
  const curtain = new THREE.Group();
  // Three sheets rather than one. A single quad at high opacity is a white
  // rectangle; stacking narrower, fainter sheets a little in front gives the
  // falling water an edge and a middle, which is all it needs at this distance.
  for (const [w, dz, op] of [
    [FALL_HALF * 2, 1.30, 0.62],
    [FALL_HALF * 2 - 2.6, 0.85, 0.42],
    [FALL_HALF * 2 - 5.0, 0.45, 0.34],
  ]) {
    const g = new THREE.PlaneGeometry(w, DROP + 4);
    const m = waterMat.clone();
    m.opacity = op;
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(0, -(DROP + 4) * 0.5 + 1.0, dz);
    curtain.add(mesh);
  }
  group.add(curtain);

  // The river above it, flowing to the lip.
  // Narrowing to the lip: the river is the gorge's width upstream and the
  // fall's width at the edge, which is what makes the water look funnelled
  // rather than sliced off.
  const river = new THREE.Mesh(new THREE.PlaneGeometry(GORGE_HALF * 2, 44), waterMat.clone());
  river.material.opacity = 0.72;
  river.rotation.x = -Math.PI / 2;
  river.position.set(0, 0.05, 23);
  group.add(river);

  // The basin at the bottom.
  const basin = new THREE.Mesh(new THREE.PlaneGeometry(GORGE_HALF * 2 + WALL_OUT, 90), waterMat.clone());
  basin.material.opacity = 0.9;
  basin.material.color.setHex(0x2f6f8f);
  basin.rotation.x = -Math.PI / 2;
  basin.position.set(0, -DROP, -22);
  group.add(basin);

  // -------------------------------------------------------------- the mist
  // Foliage blobs are the wrong shape for a leaf and exactly the right shape
  // for a cloud of spray, and reusing the material keeps this to one draw call.
  const M = makeSink();
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const r = 3.2 + (i % 3) * 2.0;
    M.box(Math.cos(a) * r, -DROP + 2.2 + (i % 4) * 1.4, -3 + Math.sin(a) * r * 0.55,
      3.0 + (i % 3), 1.5 + (i % 2) * 0.9, 2.4 + (i % 3) * 0.6, ...C_MIST);
  }
  // Its OWN material, not a clone of the foliage one. Cloning that reused a
  // forest-green base and painted the spray at the foot of the waterfall bright
  // green; the vertex gains could not pull it back, because they multiply. One
  // extra material for one mesh in a cutscene is a fair price for white water.
  const mistMat = new THREE.MeshBasicMaterial({
    color: 0xe8f4f8, transparent: true, opacity: 0.26, depthWrite: false,
    vertexColors: true,
  });
  const mist = new THREE.Mesh(M.build(), mistMat);
  mist.name = 'falls-mist';
  group.add(mist);

  // --------------------------------------------------------- the cloud bank
  /**
   * WHAT YOU SEE INSTEAD OF THE CITY.
   *
   * Standing on the far shore of the first lake you could see the city waiting
   * across the drop, which announced the landing before the fall had started
   * and made forty-six metres look like a step onto the next block. Reported
   * from play, and right: the edge of a waterfall should show you sky.
   *
   * So a bank of cloud sits ten metres past the lip. It is not a backdrop - it
   * is opaque geometry twenty-four metres tall and a hundred and eighty wide,
   * and it OCCLUDES. A nine-metre pylon a hundred metres beyond it is behind
   * four metres of cloud from the player's eye line; nothing gets through. The
   * strip in front of it is kept empty by inFallsVoid, so nothing pokes out.
   *
   * It lives in its own group rather than in the cutscene's, because it has to
   * be visible for the whole approach - the cutscene's group is hidden until
   * you are already falling.
   */
  /**
   * Built from a handful of very large, heavily overlapping blobs rather than a
   * row of similar ones, and drawn UNLIT.
   *
   * The first cut was Lambert with a mid grey and fifty medium blobs, and it
   * came out as a scree slope: distinct lumps, each with a lit face and a dark
   * one. Shading is exactly what a cloud does not have. A basic material with
   * the form baked into the vertex colours - bright at the top, greyer
   * underneath - reads as cloud at any distance, and the scene fog then blends
   * its far edge into the sky for free.
   *
   * The bottom row sinks BELOW the ground plane so there is no seam where the
   * bank meets the land, and the whole thing is opaque, because its job is to
   * occlude: a transparent cloud shows you the city through it.
   */
  const bankGroup = new THREE.Group();
  bankGroup.name = 'falls-cloud';
  bankGroup.visible = false;
  {
    const B = makeSink();
    // A cheap deterministic wobble, so the silhouette is ragged without a rng.
    const w = (i, k) => {
      const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    // Rows from the lip backwards. Nearer rows are lower and denser; far ones
    // taller and paler, so the bank builds up into the sky as it recedes.
    // SMALLER AND MORE OF THEM. Nine blobs of radius 17 across the view is not
    // a cloud bank, it is one white field with no top edge and no sky above it,
    // which is what the second cut of this looked like. The bank has to reach
    // about ten metres - enough to hide a pylon standing just past the keep-out
    // - and no higher, or it stops being weather and becomes a ceiling.
    const rows = [
      { z: -6, n: 15, rx: 11, ry: 6.0, y: 1.5, tone: 0.84 },
      { z: -18, n: 13, rx: 13, ry: 7.5, y: 4.0, tone: 0.90 },
      { z: -34, n: 11, rx: 15, ry: 9.0, y: 8.0, tone: 0.97 },
      { z: -54, n: 9, rx: 17, ry: 10.5, y: 12.0, tone: 1.03 },
    ];
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let i = 0; i < row.n; i++) {
        const f = (i / (row.n - 1)) * 2 - 1;
        const a = w(i, r), b2 = w(i + 31, r), c2 = w(i + 57, r);
        const rx = row.rx * (0.78 + a * 0.55);
        const ry = row.ry * (0.70 + b2 * 0.62);
        // The vertical gain is what gives a cloud its form without a light:
        // the crown catches, the belly does not.
        const top = row.tone * (0.98 + c2 * 0.10);
        const bot = row.tone * 0.74;
        // Two stacked blobs per position, the lower one duller, which is a
        // gradient for the price of one more blob.
        B.blob(f * 108 + (a - 0.5) * 22, row.y + ry * 0.55, row.z + (b2 - 0.5) * 14,
          rx, ry, rx * 0.82, top, top * 1.005, top * 1.02);
        B.blob(f * 108 + (b2 - 0.5) * 20, row.y - ry * 0.30, row.z + (c2 - 0.5) * 12,
          rx * 0.92, ry * 0.72, rx * 0.78, bot, bot * 1.01, bot * 1.05);
      }
    }
    // A sill sunk below the ground plane, so the bank never shows a seam or a
    // strip of land underneath it.
    for (let i = 0; i < 13; i++) {
      const f = (i / 12) * 2 - 1;
      const j = w(i, 9);
      B.blob(f * 108, -3.2 + j * 2.2, -2 - j * 5, 13, 4.5 + j * 2, 7, 0.80, 0.81, 0.85);
    }
    // UNLIT. See the note above: shading is what made the first version rock.
    const bankMat = new THREE.MeshBasicMaterial({ color: 0xfdfefe, vertexColors: true });
    const bank = new THREE.Mesh(B.build(), bankMat);
    bank.name = 'falls-cloud-mesh';
    bank.castShadow = false;
    bank.receiveShadow = false;
    bank.frustumCulled = false;
    bankGroup.add(bank);
  }

  // ------------------------------------------------------------------ state
  /** 'off' | 'falling' | 'settling' */
  let mode = 'off';
  let t = 0;
  let usedThisRun = false;
  let lipX = 0, lipZ = 0;
  let worldWasVisible = true;
  let entryYaw = 0;

  /** Where the far waterline of lake 0 sits on this column of x. */
  function lipZAt(x) {
    const cz = lakeCentreZ(0);
    return cz - (LAKE_HALF_Z + shoreWarp(x - lakeCentreX(0)));
  }

  // poseCamera is declared below this and called from it. That is fine - it is
  // a function declaration, so it is hoisted - and worth saying out loud.
  function begin() {
    const p = state.player.pos;
    mode = 'falling';
    t = 0;
    usedThisRun = true;
    lipX = p.x;
    lipZ = lipZAt(p.x);
    entryYaw = state.player.yaw || 0;

    group.position.set(lipX, GY, lipZ);
    group.visible = true;

    // The world goes away. It has to: the ground plane is opaque and single
    // sided, so from below it vanishes and leaves every tree in the district
    // hanging in an empty sky. For three seconds the scene is the diorama.
    if (ctx.world && ctx.world.group) {
      worldWasVisible = ctx.world.group.visible;
      ctx.world.group.visible = false;
    }
    state.phase = 'falling';
    state.player.vel.set(0, 0, 0);
    bankGroup.visible = false;
    // Pose the camera on THIS frame, not the next one. begin() used to return
    // before poseCamera ever ran, which left one frame of chase camera aimed at
    // a hand that had just been teleported onto the lip - a visible hitch at
    // the exact moment the cut is supposed to be invisible.
    poseCamera(0, 0);
    bus.emit('falls', { x: lipX, z: lipZ });
  }

  function end() {
    mode = 'off';
    group.visible = false;
    if (ctx.world && ctx.world.group) ctx.world.group.visible = worldWasVisible;
    if (ctx.engine && ctx.engine.setCinematic) ctx.engine.setCinematic(null, null);

    const p = state.player.pos;
    p.set(lipX, GY, lipZ - LAND_AHEAD);
    state.player.vel.set(0, 0, 0);
    state.player.grounded = true;
    state.player.boat = 0;
    state.player.hull = 0;

    // The Protector went over too, and comes back up the beach behind you. Put
    // it at its spawn distance rather than calling monster.reset(), which would
    // also hand back its base speed and size and undo the whole run's ladder.
    const m = state.monster;
    m.pos.set(lipX + 3, m.pos.y, lipZ - LAND_AHEAD + CONFIG.monster.spawnDistance);
    m.vel.set(0, 0, 0);
    m.distanceToPlayer = CONFIG.monster.spawnDistance;
    m.proximity = 0;

    // Snap the chase rig onto its target before anything is drawn. Easing back
    // from the bottom of the gorge would spend the first second of the city
    // below its own ground plane, looking up at nothing.
    if (ctx.engine && ctx.engine.snapCamera) ctx.engine.snapCamera(p);

    state.phase = 'playing';
    if (ctx.world && ctx.world.primeAround) {
      ctx.world.primeAround(p.x, p.z, state.levelIndex | 0);
    }
    bus.emit('shake', { amount: 0.9 });
    bus.emit('land', { hard: true });
  }

  /**
   * The camera path.
   *
   * It starts where the chase camera already is - behind and above - so the
   * cut is not a cut, and swings a hundred and ten degrees round to the side
   * over the fall, pulling back and dropping as it goes. The look target rides
   * DOWN the curtain rather than following the hand exactly, so the frame keeps
   * the whole drop in it instead of tracking one small thing.
   */
  function poseCamera(u, py) {
    const ease = u * u * (3 - 2 * u);          // smoothstep: no snap at either end
    // NOT AN ORBIT. An orbit round the lip passes through the PLANE of the
    // falls at ninety degrees, where the camera ends up level with a thirty
    // metre curtain from eleven metres away: two flat slabs filling the frame
    // and nothing to read. Two earlier cuts of this shot failed that way.
    //
    // So Z travels monotonically from behind the lip to well downstream, and X
    // makes a single excursion out and back that peaks halfway - the camera
    // passes the falling hand on one side and comes back onto the centre line
    // to open out on the whole drop. It never crosses |x| = GORGE_HALF, so it
    // is never inside the cliff.
    const camZ = 6 - ease * 46;
    const camX = Math.sin(ease * Math.PI) * 10;
    // Rises relative to the hand as it goes, so the shot opens out from a close
    // follow into the whole waterfall. It starts at the chase camera's own
    // height and distance, which is what makes the cut into it invisible.
    const camY = py + 3.0 + ease * 15;
    _camPos.set(lipX + camX, GY + camY, lipZ + camZ);
    // Aim rides DOWN the curtain rather than tracking the hand exactly, so the
    // frame keeps the fall in it instead of chasing one small thing.
    const aimY = py * (1 - 0.55 * ease) - ease * 10;
    _camLook.set(lipX, GY + aimY, lipZ - 1.5);
    if (ctx.engine && ctx.engine.setCinematic) ctx.engine.setCinematic(_camPos, _camLook);
  }

  /**
   * The bank sits at the lip and is shown for the whole approach - from the far
   * side of the lake, across it, and up to the moment you go over. It is hidden
   * once the fall starts (the cutscene has its own sky) and stays hidden after
   * you land, because by then it is a hundred metres behind you and the only
   * way to see it again would be to walk back into the gorge.
   */
  function placeBank(s) {
    const p = s.player.pos;
    // Only near the first lake, and only while the fall is still ahead of you.
    if (usedThisRun || mode !== 'off' || lakeIndex(p.z) !== 0) {
      bankGroup.visible = false;
      return;
    }
    const lip = fallsLipZ(p.x);
    // Behind you, or far enough back that fog has it anyway.
    if (p.z < lip - 4 || p.z > lip + CONFIG.world.fogFar + 40) {
      bankGroup.visible = false;
      return;
    }
    bankGroup.position.set(0, GY, lip);
    bankGroup.visible = true;
  }

  function update(dt, c) {
    const s = (c && c.state) || state;
    placeBank(s);

    if (mode === 'off') {
      if (s.phase !== 'playing' || usedThisRun) return 1;
      const p = s.player.pos;
      // Lake 0 only, and only going forwards over its far lip.
      if (lakeIndex(p.z) !== 0) return 1;
      const lip = lipZAt(p.x);
      if (p.z >= lip) return 1;
      // Just over, not miles past: a teleport in a test should not fire this.
      if (p.z < lip - 12) return 1;
      // And genuinely at the water's edge, not walking round the end of it.
      if (waterAt(p.x, p.z + 4) <= 0) return 1;
      begin();
      return 0.35;
    }

    // SLOW MOTION is returned to the caller as a time scale rather than applied
    // here, because everything else in the frame - the hand's own animation,
    // the mist, the camera easing - has to slow with it or the fall is the only
    // thing that looks slow.
    const scale = mode === 'falling' ? 0.35 : 1;
    t += dt;

    if (mode === 'falling') {
      const u = Math.min(1, t / FALL_TIME);
      // Accelerating, but nothing like real gravity: at 1g this drop is 3.1s of
      // which the last second covers half the distance, and the point of the
      // shot is the middle of the fall.
      const fall = u * u * 0.72 + u * 0.28;
      const py = -DROP * fall;
      const p = s.player.pos;
      p.set(lipX, GY + py, lipZ - 1.0 - u * 2.0);
      // Turning slowly as it goes, so the hand is not a rigid prop.
      s.player.yaw = entryYaw + u * 2.4;
      poseCamera(u, py);
      // Mist rolls while you fall.
      mist.rotation.y += dt * 0.20;
      if (u >= 1) { mode = 'settling'; t = 0; }
      return scale;
    }

    // settling: hold the shot on the basin for a beat, then hand it all back.
    poseCamera(1, -DROP);
    if (t >= SETTLE_TIME) end();
    return 1;
  }

  function reset() {
    if (mode !== 'off') {
      group.visible = false;
      if (ctx.world && ctx.world.group) ctx.world.group.visible = worldWasVisible;
      if (ctx.engine && ctx.engine.setCinematic) ctx.engine.setCinematic(null, null);
    }
    mode = 'off';
    t = 0;
    usedThisRun = false;
    bankGroup.visible = false;
  }

  return {
    group,
    /** The cloud bank. Lives in the scene beside `group`, not inside it. */
    bankGroup,
    update,
    reset,
    /** True while the cutscene owns the screen. */
    active: () => mode !== 'off',
    /** Diagnostics for the suites. */
    debug: () => ({ mode, t: +t.toFixed(2), used: usedThisRun, lipZ, drop: DROP }),
  };
}
