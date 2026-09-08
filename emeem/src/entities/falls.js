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
/**
 * Seconds the fall takes, in WALL time - main.js applies the slow-motion scale
 * after this module has already advanced its own clock, so this is real
 * seconds and not game seconds.
 *
 * Five is a long time to hold a player still, and it is the right length
 * anyway: the shot has three beats in it - the hang at the lip, the drop past
 * the curtain, and the pull-back onto the whole waterfall - and at 3.4s the
 * first and last were a blur either side of the middle one.
 */
const FALL_TIME = 5.2;
/** Seconds the finished frame is held before control comes back. */
const SETTLE_TIME = 1.2;
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
  /** Same, but each vertex carries its own colour. */
  const triC = (ax, ay, az, bx, by, bz, cx, cy, cz, ca, cb, cc) => {
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    pos.push(ax, ay, az, bx, by, bz, cx, cy, cz);
    nor.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
    col.push(ca[0], ca[1], ca[2], cb[0], cb[1], cb[2], cc[0], cc[1], cc[2]);
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
    /**
     * A blob with a vertical gradient baked in PER VERTEX: `top` at its crown,
     * `bot` at its underside, eased between.
     *
     * This is the whole difference between cloud and cotton wool. The material
     * is unlit - it has to be, because a lit one makes every puff a rock - so
     * the only place form can come from is the colour, and a flat tone per blob
     * gives a flat blob. A bright warm crown over a cool blue-grey belly is
     * what the eye reads as a lit cumulus, and it costs nothing: the same
     * triangles, with three colours instead of one.
     * @param {number[]} top  crown colour
     * @param {number[]} bot  underside colour
     * @param {number[]} out  scratch, reused per vertex
     */
    gradBlob(cx, cy, cz, rx, ry, rz, top, bot) {
      const src = ICO.attributes.position.array;
      const c = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      for (let i = 0; i < src.length; i += 9) {
        for (let v = 0; v < 3; v++) {
          const ly = src[i + v * 3 + 1];          // -1 .. 1 within the blob
          let t = (ly + 1) * 0.5;
          t = t * t * (3 - 2 * t);                // smoothstep, so no banding
          // Biased toward the shaded end. Large overlapping blobs show mostly
          // their UPPER hemispheres, so an even ramp puts almost every visible
          // pixel in the bright half and the bank comes out flat white.
          t = t * t * (2 - t);
          for (let k = 0; k < 3; k++) c[v][k] = bot[k] + (top[k] - bot[k]) * t;
        }
        triC(
          cx + src[i] * rx, cy + src[i + 1] * ry, cz + src[i + 2] * rz,
          cx + src[i + 3] * rx, cy + src[i + 4] * ry, cz + src[i + 5] * rz,
          cx + src[i + 6] * rx, cy + src[i + 7] * ry, cz + src[i + 8] * rz,
          c[0], c[1], c[2],
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
   * So a bank of cloud sits ON the lip. It is not a backdrop - it
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
    /**
     * The two ends of every puff's gradient.
     *
     * TOP is barely off white and slightly warm - sun on the crown. BOT is a
     * cool blue-grey, which is the part that actually sells it: a cloud's
     * underside is lit by the sky, not the sun, so it goes blue rather than
     * simply dark. Cotton wool is what you get when both ends are white.
     */
    const CLOUD_TOP = [1.00, 0.995, 0.965];
    const CLOUD_BOT = [0.52, 0.575, 0.715];
    const scale = (c, k) => [c[0] * k, c[1] * k, c[2] * k];

    // Rows from the lip backwards: nearer rows lower and denser, far ones
    // taller and paler, so the bank builds into the sky as it recedes.
    // Heights are set by COMPOSITION, not by how big a cloud ought to be. From
    // the middle of the lake the top of frame is about 33m up; a bank topping
    // 36m therefore fills the screen and leaves a sliver of blue in the
    // corners, which is a ceiling, not weather. The near row tops out around
    // 10m - just enough to hide a pylon standing past the keep-out - and the
    // far rows are taller but further, so their apparent height matches and the
    // whole bank sits at a bit over a third of the frame with sky above it.
    const rows = [
      { z: -1, n: 17, rx: 9.5, ry: 3.6, y: 3.2, tone: 0.92 },
      { z: -13, n: 15, rx: 11.0, ry: 4.4, y: 4.2, tone: 0.96 },
      { z: -31, n: 13, rx: 13.0, ry: 5.2, y: 5.4, tone: 1.00 },
      { z: -50, n: 11, rx: 15.0, ry: 6.0, y: 6.8, tone: 1.03 },
      { z: -76, n: 9, rx: 18.0, ry: 7.0, y: 8.2, tone: 1.05 },
    ];
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      const top = scale(CLOUD_TOP, row.tone);
      const bot = scale(CLOUD_BOT, row.tone);
      for (let i = 0; i < row.n; i++) {
        const f = (i / (row.n - 1)) * 2 - 1;
        const a = w(i, r), b2 = w(i + 31, r), c2 = w(i + 57, r);
        const rx = row.rx * (0.72 + a * 0.62);
        const ry = row.ry * (0.66 + b2 * 0.70);
        const bx = f * 108 + (a - 0.5) * 20;
        const by = row.y + ry * 0.42;
        const bz = row.z + (b2 - 0.5) * 12;
        B.gradBlob(bx, by, bz, rx, ry, rx * 0.80, top, bot);
        // A smaller puff riding the crown of the big one. Cumulus is lumpy;
        // one ellipsoid per position is a hillock, two is weather.
        B.gradBlob(
          bx + (c2 - 0.5) * rx * 0.9, by + ry * 0.62, bz + (a - 0.5) * 8,
          rx * (0.38 + c2 * 0.26), ry * (0.40 + a * 0.26), rx * 0.34,
          top, scale(CLOUD_BOT, row.tone * 1.10),
        );
      }
    }
    /**
     * THE SILL: the part that is actually load-bearing.
     *
     * The decorative rows above are jittered in position and size, which is
     * what stops them reading as a row of identical hills - and also what lets
     * two small neighbours drift far enough apart to leave a gap. Five-metre
     * props twenty metres past the lip were showing through exactly such gaps.
     *
     * So occlusion is not left to them. This row has NO x jitter, a spacing of
     * nine metres against a radius of twelve, and a top around ten - so it is
     * continuous by arithmetic rather than by luck, and ten metres is what it
     * takes to hide a pylon standing past the keep-out. It also sinks below the
     * ground plane, so there is never a seam where the bank meets the water.
     */
    const SILL_N = 25;
    for (let i = 0; i < SILL_N; i++) {
      const f = (i / (SILL_N - 1)) * 2 - 1;
      const j = w(i, 9);
      B.gradBlob(f * 108, -1.0 + j * 3.4, 1.5 - j * 5, 12, 5.6 + j * 1.6, 8,
        scale(CLOUD_BOT, 1.30), scale(CLOUD_BOT, 0.84));
    }
    // UNLIT, and white: every bit of form above is in the vertex colours, so a
    // light here would only flatten it back out again.
    const bankMat = new THREE.MeshBasicMaterial({ color: 0xffffff, vertexColors: true });
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
  /** Everything the cutscene hid, so end() can put exactly it back. */
  const hidden = [];
  const engineScene = () => (ctx.engine && ctx.engine.scene) || ctx.scene;
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

    // EVERYTHING ELSE GOES AWAY, not just the world.
    //
    // The ground plane is opaque and single sided, so from below the gorge it
    // vanishes and leaves every tree in the district hanging in an empty sky.
    // Hiding world.group fixes the trees - and misses the emeems, the monster
    // and the boats, which are their own groups in the scene. The first version
    // of this shot had a bush and a row of prizes floating over the waterfall.
    //
    // So it hides by exclusion rather than by a list: everything at the top of
    // the scene except the diorama, the hand and the lights. A group added
    // later cannot be forgotten, because nothing has to remember it.
    hidden.length = 0;
    for (const child of engineScene().children) {
      if (child === group || child === bankGroup) continue;
      if (child.name === 'player') continue;
      if (child.isLight || child.type === 'Object3D') continue;   // lights and their targets
      if (!child.visible) continue;
      child.visible = false;
      hidden.push(child);
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
    for (const child of hidden) child.visible = true;
    hidden.length = 0;
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
  let cineFov = 62;

  function poseCamera(u, py) {
    const ease = u * u * (3 - 2 * u);          // smoothstep: no snap at either end
    // A CUT, then a move. Three versions tried to EASE out of the chase
    // camera's own pose, and all three opened on a soup of pale triangles -
    // because from behind and above the lip, the curtain is edge-on, the river
    // is a grazing translucent sheet, and the basin is another one behind it.
    // The set is built to be seen from below and to one side; there is no path
    // from the chase pose to that which passes through a good frame.
    //
    // So it cuts. The shot opens already over the edge, level with the top of
    // the curtain and fourteen metres to one side, looking slightly UP at the
    // water coming over - which is the whole reason to have a waterfall - and
    // then sinks and pulls back with the hand until the last frame holds all
    // forty-six metres of it. Cutting to a better angle is what cutting is for.
    const camX = 14 * Math.cos(ease * Math.PI * 0.5);
    const camY = py - 6 + ease * 24;
    const camZ = -14 - ease * 30;
    _camPos.set(lipX + camX, GY + camY, lipZ + camZ);
    // THE LENS OPENS. 62 degrees at the lip is tighter than the game's own 68,
    // so the first beat is close on the hand; 82 at the bottom is wide enough
    // that the whole forty-six metres fits with the gorge either side of it.
    // Widening a lens while pulling back is the oldest trick there is and it
    // still works: the fall feels like it is getting further away from you.
    cineFov = 62 + ease * 20;
    // Aim rides DOWN the curtain rather than tracking the hand exactly, so the
    // frame keeps the fall in it instead of chasing one small thing.
    // The aim rides down the curtain rather than tracking the hand exactly, so
    // the frame keeps the waterfall in it instead of chasing one small thing.
    // It starts just under the lip, which puts the hand near the top of frame
    // with the drop opening below it.
    const aimY = py * (1 - 0.55 * ease) - 4.0 - ease * 6.0;
    _camLook.set(lipX, GY + aimY, lipZ - 1.5);
    if (ctx.engine && ctx.engine.setCinematic) ctx.engine.setCinematic(_camPos, _camLook, cineFov);
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
    const scale = mode === 'falling' ? 0.30 : 1;
    t += dt;

    if (mode === 'falling') {
      const u = Math.min(1, t / FALL_TIME);
      // Accelerating, but nothing like real gravity: at 1g this drop is 3.1s of
      // which the last second covers half the distance, and the point of the
      // shot is the middle of the fall. The cubic term is the HANG - the first
      // half second barely moves, so the hand steps off the lip and floats
      // before it goes, which is the beat that makes it read as a fall rather
      // than as a drop through a trapdoor.
      const fall = u * u * u * 0.30 + u * u * 0.56 + u * 0.14;
      const py = -DROP * fall;
      const p = s.player.pos;
      p.set(lipX, GY + py, lipZ - 1.0 - u * 2.0);
      // Turning slowly as it goes, so the hand is not a rigid prop.
      // A slow turn, not a spin: 1.5 radians over five seconds.
      s.player.yaw = entryYaw + u * 1.5;
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
      for (const child of hidden) child.visible = true;
      hidden.length = 0;
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
