/**
 * EMEEM - the lake, the boat and the swim, verified in the real game.
 *
 * Teleports the player to the near shore rather than walking 420m, which at
 * software-rendered frame rates would take ten minutes per case. Everything
 * after that is the real simulation.
 *
 * Usage: node tools/water.mjs [--url http://127.0.0.1:4199/]
 */
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const _u = process.argv.indexOf('--url');
const URL = (_u >= 0 && process.argv[_u + 1]) || 'http://127.0.0.1:4199/';
const PINNED = '/opt/pw-browsers/chromium';
const fails = [];
const ok = (label, cond, detail = '') => {
  console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? ' -- ' + detail : ''}`);
  if (!cond) fails.push(label + (detail ? ': ' + detail : ''));
};

const browser = await chromium.launch({
  ...(existsSync(PINNED) ? { executablePath: PINNED } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1040, height: 480 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
await page.waitForFunction(() => !!window.__EMEEM__, null, { timeout: 40000 });
const play = page.locator('button', { hasText: /play/i }).first();
if (await play.count()) await play.click({ timeout: 5000 }).catch(() => {});
await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 20000 });

const gameWait = (sec) => page.waitForFunction((s) => window.__EMEEM__.state.time - window.__T0__ > s,
  sec, { timeout: 300000, polling: 50 }).catch(() => {});
const mark = () => page.evaluate(() => { window.__T0__ = window.__EMEEM__.state.time; });

console.log('\n== the lake ==');
const lake = await page.evaluate(() => {
  const E = window.__EMEEM__;
  const w = E.world;
  // sample a line across the first lake
  const pts = [];
  for (let z = -340; z >= -500; z -= 10) pts.push([z, +w.waterAt(0, z).toFixed(2)]);
  return { pts, dry: w.waterAt(0, -100), wet: w.waterAt(0, -420) };
});
ok('there is water where the lake is', lake.wet === 1, `waterAt(0,-420) = ${lake.wet}`);
ok('and none where there is not', lake.dry === 0, `waterAt(0,-100) = ${lake.dry}`);

// --- put the player on the near shore, next to the middle boat
await page.evaluate(() => {
  const E = window.__EMEEM__;
  E.state.player.pos.set(0, 0, -370);
  E.state.monster.pos.set(0, 0, -330);   // behind, on the shore
});
await mark(); await gameWait(1.5);

console.log('\n== no props or prizes stand in the water ==');
const clean = await page.evaluate(() => {
  const E = window.__EMEEM__, w = E.world;
  let inWater = 0;
  for (const c of w.colliders) {
    const cx = (c.min.x + c.max.x) / 2, cz = (c.min.z + c.max.z) / 2;
    if (w.waterAt(cx, cz) > 0) inWater++;
  }
  let prizesInWater = 0;
  E.ctx.scene.traverse((o) => {
    if (!o.userData || !o.userData.kind || o.isSprite) return;
    const p = o.getWorldPosition(new o.position.constructor());
    if (w.waterAt(p.x, p.z) > 0) prizesInWater++;
  });
  return { inWater, prizesInWater, colliders: w.colliders.length };
});
ok('no collider stands in the lake', clean.inWater === 0, `${clean.inWater} of ${clean.colliders}`);
ok('no emeem floats on the lake', clean.prizesInWater === 0, `${clean.prizesInWater}`);

console.log('\n== wading is slow, and the swimmer is faster than you ==');
const wade = await page.evaluate(() => {
  const E = window.__EMEEM__, s = E.state;
  s.player.pos.set(0, 0, -420);            // open water
  s.input.z = 1;
  return { wet: s.player.wet };
});
await mark(); await gameWait(2.0);
const waded = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  const v = Math.hypot(s.player.vel.x, s.player.vel.z);
  s.input.z = 0;
  return { wet: +s.player.wet.toFixed(2), speed: +v.toFixed(2),
           walk: window.__EMEEM__.ctx.CONFIG.player.walkSpeed,
           mul: window.__EMEEM__.ctx.CONFIG.world.waterSpeedMul };
});
ok('the player is wet in open water', waded.wet === 1, `wet = ${waded.wet}`);
// The bound comes from CONFIG, not from a number retyped here: a retune that
// made wading fast again would otherwise still pass this line. The 1.06 is
// slack for the velocity damping, nothing more.
ok('wading is a fraction of walking', waded.speed < waded.walk * waded.mul * 1.06,
  `${waded.speed} m/s vs ${waded.walk} walking (waterSpeedMul ${waded.mul})`);
ok('and it is a SEVERE fraction, not a nudge', waded.mul <= 0.30,
  `waterSpeedMul = ${waded.mul} -> ${(waded.walk * waded.mul).toFixed(2)} m/s`);

// Put it in the lake but NOT on top of the player: at the same point it is
// inside the 1.35m catch radius, the run ends instantly, fixedUpdate stops and
// the speed freezes part-way down the ramp. The first version of this check
// read 3.70 m/s - which is not the swim speed at all, it is a corpse caught
// mid-damp - and passed anyway. Hold them 26m apart and keep the player wet.
const swimHold = setInterval(() => {
  page.evaluate(() => {
    const s = window.__EMEEM__.state;
    if (s.phase !== 'playing') return;
    s.player.pos.set(0, 0, -408);
    s.monster.pos.set(0, 0, -434);
  }).catch(() => {});
}, 100);
await mark(); await gameWait(4.0);
clearInterval(swimHold);
const swam = await page.evaluate(() => {
  const s = window.__EMEEM__.state;
  const w = window.__EMEEM__.world;
  const C = window.__EMEEM__.ctx.CONFIG;
  return { speed: +s.monster.speed.toFixed(2), tier: s.level.speed, f: C.world.swimFactor,
           wade: C.player.walkSpeed * C.world.waterSpeedMul,
           phase: s.phase, wet: +w.waterAt(s.monster.pos.x, s.monster.pos.z).toFixed(2) };
});
ok('the swim check measured a LIVE game', swam.phase === 'playing', swam.phase);
ok('the Protector was actually in the water', swam.wet === 1, `wet = ${swam.wet}`);
ok('the Protector swims MUCH slower than it runs', swam.speed < swam.tier * 0.62,
  `${swam.speed} m/s vs ${swam.tier} on land (expected ${(swam.tier * swam.f).toFixed(2)})`);
ok('but still faster than a wader', swam.speed > swam.wade,
  `${swam.speed} m/s vs ${swam.wade.toFixed(2)} wading`);

/* --------------------------------------------------------------- the swim
 *
 * The creature's rig drops SWIM_SINK into the water and hauls itself along with
 * an overarm stroke. The drop is the observable part - the opaque ground plane
 * occludes everything below the feet line, which is what makes the legs vanish
 * under the surface for free - and it is published on the rig group because the
 * portrait camera frames one node above it and would otherwise keep aiming at a
 * chest that is no longer there.
 */
console.log('\n== the Protector swims rather than strolling along the bottom ==');
const rigDrop = () => page.evaluate(() => {
  let drop = null;
  window.__EMEEM__.ctx.scene.traverse((o) => {
    if (o.userData && typeof o.userData.portraitDrop === 'number') drop = o.userData.portraitDrop;
  });
  return { drop, wet: window.__EMEEM__.state.monster.wet };
});

const dryHold = setInterval(() => {
  page.evaluate(() => {
    const s = window.__EMEEM__.state;
    if (s.phase !== 'playing') return;
    s.player.pos.set(0, 0, -200);
    s.monster.pos.set(0, 0, -226);
  }).catch(() => {});
}, 100);
await mark(); await gameWait(1.6);
clearInterval(dryHold);
const onLand = await rigDrop();
ok('on land the rig stands at its full height', onLand.drop !== null && onLand.drop < 0.02,
  `drop = ${onLand.drop}, wet = ${onLand.wet}`);

const wetHold = setInterval(() => {
  page.evaluate(() => {
    const s = window.__EMEEM__.state;
    if (s.phase !== 'playing') return;
    s.player.pos.set(0, 0, -408);
    s.monster.pos.set(0, 0, -430);
  }).catch(() => {});
}, 100);
await mark(); await gameWait(2.4);
clearInterval(wetHold);
const inWater = await rigDrop();
ok('in open water it is IN the water, not on it', inWater.wet === 1 && inWater.drop > 0.9,
  `drop = ${inWater.drop}m of a 1.20m sink, wet = ${inWater.wet}`);
ok('and the drop is a real change, not a constant', inWater.drop - onLand.drop > 0.9,
  `${onLand.drop} on land -> ${inWater.drop} in the lake`);

/* ------------------------------------------------------------------- wakes
 *
 * The world is flat, so a wader cannot sink: the hand stands ON the water
 * plane. A ring that spreads and fades is the only thing saying "in the water"
 * rather than "walking on it", and it is the sort of cosmetic that rots
 * silently - so check it is there when it should be and gone when it should
 * not, and that the check can tell the difference.
 */
console.log('\n== wakes ==');
const readRings = () => page.evaluate(() => {
  const out = [];
  window.__EMEEM__.ctx.scene.traverse((o) => {
    if (o.isMesh && o.geometry && o.geometry.type === 'RingGeometry') {
      out.push({ visible: o.visible, opacity: +o.material.opacity.toFixed(3) });
    }
  });
  return out;
});

await page.evaluate(() => {
  const E = window.__EMEEM__;
  E.state.player.pos.set(0, 0, -420);     // open water
  E.state.monster.pos.set(3, 0, -414);    // in it too, and close
});
await mark(); await gameWait(0.8);
const wet = await readRings();
ok('there are two wake rings in the scene', wet.length === 2, `${wet.length} found`);
ok('both show while both are in the water',
  wet.length === 2 && wet.every((r) => r.visible && r.opacity > 0),
  wet.map((r) => `${r.visible}/${r.opacity}`).join(' '));

await page.evaluate(() => {
  const E = window.__EMEEM__;
  E.state.player.pos.set(0, 0, -200);     // dry forest, nowhere near a lake
  E.state.monster.pos.set(3, 0, -194);
});
await mark(); await gameWait(0.8);
const dry = await readRings();
ok('and neither shows on dry land', dry.every((r) => !r.visible),
  dry.map((r) => r.visible).join(' '));

console.log('\n== the boat ==');
const boarded = await page.evaluate(() => {
  const E = window.__EMEEM__;
  const d = E.boats.debug();
  const b = d.boats[1];
  E.state.player.pos.set(b.x, 0, b.z);      // walk into the middle boat
  E.state.monster.pos.set(b.x, 0, b.z + 60);
  return { spot: b };
});
await mark(); await gameWait(0.6);
const aboard = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { riding: E.boats.riding(), hull: +(E.state.player.hull || 0).toFixed(3), boat: E.state.player.boat };
});
ok('walking into a boat boards it', aboard.riding === true, `riding = ${aboard.riding}`);
// Not === 1: boarding happens the instant you are in range, and the check
// runs 0.6s of game time later, by which point the hull has honestly drained
// 0.6 * 0.075 = 0.045. Asserting equality was asserting that no time passed.
ok('the hull starts full', aboard.hull > 0.9, `${aboard.hull}`);

// steer up-screen across the lake
await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.z = 1; i.x = 0; });
await mark(); await gameWait(4.0);
const sailing = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { hull: +(E.state.player.hull || 0).toFixed(3), z: +E.state.player.pos.z.toFixed(1),
           riding: E.boats.riding(), speed: +E.boats.debug().speed.toFixed(2) };
});
ok('the boat moves up-screen under the pad', sailing.z < -400, `z = ${sailing.z} (started -386)`);
ok('the boat is faster than wading', sailing.speed > 5, `${sailing.speed} m/s`);
ok('the hull drains while aboard', sailing.hull < 1 && sailing.hull > 0.4, `${sailing.hull} left`);

// run the hull to nothing and check it swamps
await page.evaluate(() => { window.__EMEEM__.state.player.hull = 0.05; });
await mark(); await gameWait(1.5);
const swamped = await page.evaluate(() => {
  const E = window.__EMEEM__;
  return { riding: E.boats.riding(), hull: +(E.state.player.hull || 0).toFixed(3), boat: E.state.player.boat };
});
ok('an empty hull swamps the boat', swamped.riding === false, `riding = ${swamped.riding}`);
ok('and puts you back in the water', swamped.boat === 0, `boat = ${swamped.boat}`);
await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.z = 0; i.x = 0; });

/* --------------------------------------------------------- steering, all eight
 *
 * The boat's motion had a PLUS on its X term where the game's forward vector
 * (-sin h, -cos h) wants a minus, so the entire left-right axis was mirrored:
 * press right, sail left. It shipped, and every check in this file passed,
 * because every one of them sailed UP - and at heading 0, sin is 0 and the sign
 * of the X term cannot be observed at all.
 *
 * So: all eight, each from a fresh boat on a fresh heading, recentred in the
 * lake before the measurement so no direction can beach mid-window. The
 * expected direction falls out of the same identity the heading solve uses -
 * want = atan2(-ix, iz) makes forward exactly (ix, -iz) normalised - so this
 * checks the boat against the convention rather than against numbers copied
 * out of the implementation.
 *
 * EVERY WAIT IS IN GAME TIME. state.dt is clamped to render.maxDelta (0.05s),
 * so under software rasterisation at ~4fps the world advances at a fifth of
 * wall-clock. The first cut of this test slept in real milliseconds and gave
 * the boat 0.38s of game time to complete a 1.66s turn: eight directions all
 * still pointing roughly up, and eight failures that said nothing about the
 * boat.
 */
console.log('\n== the boat steers where you point it ==');
const DIRS = [
  ['up', 0, 1], ['upright', 1, 1], ['right', 1, 0], ['downright', 1, -1],
  ['down', 0, -1], ['downleft', -1, -1], ['left', -1, 0], ['upleft', -1, 1],
];
const LAKE0_CX = 0, LAKE0_CZ = -420;
for (const [name, ix, iz] of DIRS) {
  const res = await page.evaluate(async ([x, z, cx, cz]) => {
    const E = window.__EMEEM__;
    const gwait = (secs) => new Promise((done) => {
      const t0 = E.state.time;
      const tick = () => {
        if (E.state.time - t0 >= secs || E.state.phase !== 'playing') done();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    // Fresh boat, fresh heading: moorAll sets yaw 0 and board() copies it.
    E.boats.reset();
    E.state.input.x = 0; E.state.input.z = 0;
    E.state.player.pos.set(cx, 0, cz + 34);
    E.state.monster.pos.set(cx + 90, 0, cz + 90);   // nothing dies mid-measurement
    for (let i = 0; i < 20 && !E.boats.riding(); i++) await gwait(0.2);
    if (!E.boats.riding()) return { boarded: false };

    E.boats.placeRider(cx, cz);
    E.state.player.hull = 1;
    E.state.input.x = x; E.state.input.z = z;
    // 2.2s of GAME time covers the worst turn (pi at turnRate 1.9 rad/s = 1.66s)
    // and leaves the boat at full speed.
    await gwait(2.2);

    // Recentre before the window so no heading can reach a shore inside it.
    E.boats.placeRider(cx, cz);
    E.state.player.hull = 1;
    await gwait(0.05);
    const a = { x: E.state.player.pos.x, z: E.state.player.pos.z };
    await gwait(0.8);
    const b = { x: E.state.player.pos.x, z: E.state.player.pos.z };
    E.state.input.x = 0; E.state.input.z = 0;

    const dx = b.x - a.x, dz = b.z - a.z;
    const len = Math.hypot(dx, dz);
    const el = Math.hypot(x, z);
    const dot = len > 0.01 ? (dx * (x / el) + dz * (-z / el)) / len : 0;
    return { boarded: true, riding: E.boats.riding(), len: +len.toFixed(2),
             dot: +dot.toFixed(3), dx: +dx.toFixed(2), dz: +dz.toFixed(2),
             phase: E.state.phase };
  }, [ix, iz, LAKE0_CX, LAKE0_CZ]);

  ok(`${name}: still aboard and under way when measured`,
    res.boarded && res.riding && res.phase === 'playing' && res.len > 4,
    res.boarded ? `${res.len}m in 0.8s, riding=${res.riding}, ${res.phase}` : 'never boarded');
  ok(`${name}: and the boat went ${name}`, res.dot > 0.95,
    `agreement ${res.dot} (dx=${res.dx}, dz=${res.dz})`);
}

// Put everything back: still riding a spent boat here would snap the player
// out of every teleport the rest of this file does.
await page.evaluate(() => {
  const E = window.__EMEEM__;
  E.state.input.x = 0; E.state.input.z = 0;
  E.boats.reset();
  E.state.player.pos.set(0, 0, -330);
});
await mark(); await gameWait(0.5);

/* ------------------------------------------------- and does the canoe SAVE you?
 *
 * Everything above proves mechanisms: the boat is faster than a swimmer, a
 * crossing costs two thirds of a hull. None of it proves the thing a player
 * actually asks, which is whether going for the canoe instead of wading keeps
 * them alive.
 *
 * The two cells are deliberately asymmetric, because each is the STRONGEST
 * version of its claim:
 *
 *   wading at WATCHING  - the gentlest tier in the game, the Protector at its
 *                         slowest. Caught after 11.4s, eleven metres in. If the
 *                         lake is lethal on foot here it is lethal everywhere.
 *   the canoe at THE END - the harshest tier, the Protector at 9.2 m/s. Across
 *                         in 9.4s with 25m of clear water behind. If the canoe
 *                         saves you here it saves you everywhere.
 *
 * That pair is the whole feature and the first casualty of any retune of
 * waterSpeedMul, swimFactor or boat.speed, so it is pinned rather than left to
 * be rediscovered by someone drowning.
 */
console.log('\n== the canoe is the answer and wading is not ==');
const CZ0 = -420;
for (const useBoat of [false, true]) {
  // The gentlest tier for the wade, the harshest for the canoe.
  const tierIdx = useBoat ? 7 : 0;
  const r = await page.evaluate(async ([boat, cz, ti]) => {
    const E = window.__EMEEM__;
    const gwait = (s) => new Promise((d) => {
      const t0 = E.state.time;
      const tick = () => { if (E.state.time - t0 >= s || E.state.phase !== 'playing') d(); else requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    const holdTier = () => {
      // Re-applied every step. An amaam taken in passing costs 2 points and
      // drops the tier under the measurement - which is how an earlier version
      // of this reported a cell it had not run.
      E.state.levelIndex = ti;
      E.state.level = E.CONFIG.levels[ti];
      E.state.score = E.state.level.score;
      E.state.dread = E.state.level.dread;
    };
    E.bus.emit('restart');
    await gwait(0.2);
    E.boats.reset();
    holdTier();
    // Beside the middle mooring to board; 12m clear of it to be sure the wading
    // run cannot board by accident.
    E.state.player.pos.set(boat ? 0 : 12, 0, cz + 34);
    E.state.monster.pos.set(0, 0, cz + 52);        // 18m behind, either way
    E.state.monster.speed = E.state.level.speed;
    await gwait(0.3);
    if (boat) { for (let i = 0; i < 12 && !E.boats.riding(); i++) await gwait(0.15); }
    const boarded = E.boats.riding();

    E.state.input.x = 0; E.state.input.z = 1;      // hold UP and commit
    const t0 = E.state.time;
    let escaped = false;
    for (let i = 0; i < 300; i++) {
      await gwait(0.25);
      holdTier();
      if (E.state.phase !== 'playing') break;
      const p = E.state.player.pos;
      if (p.z < cz - 20 && E.world.waterAt(p.x, p.z) === 0) { escaped = true; break; }
      if (E.state.time - t0 > 40) break;
    }
    E.state.input.z = 0;
    return { boarded, escaped, died: E.state.phase !== 'playing',
             secs: +(E.state.time - t0).toFixed(1), z: +E.state.player.pos.z.toFixed(1),
             tier: E.state.level.name };
  }, [useBoat, CZ0, tierIdx]);

  if (useBoat) {
    ok('the canoe run actually boarded', r.boarded, `riding = ${r.boarded}`);
    ok('at the HARSHEST tier the canoe still gets you across alive', r.escaped && !r.died,
      `${r.tier}: ${r.escaped ? 'across' : 'stopped'} in ${r.secs}s at z=${r.z}`);
  } else {
    ok('the wading run stayed on foot', !r.boarded, `riding = ${r.boarded}`);
    ok('at the GENTLEST tier wading the same lake still gets you caught',
      r.died && !r.escaped,
      `${r.tier}: ${r.died ? 'caught' : 'survived'} after ${r.secs}s at z=${r.z}`);
  }
}
// Back to a clean, live run for whatever comes next.
await page.evaluate(() => {
  const E = window.__EMEEM__;
  E.state.input.x = 0; E.state.input.z = 0;
  E.bus.emit('restart');
});
await page.waitForFunction(() => window.__EMEEM__.state.phase === 'playing', null, { timeout: 20000 });
await page.evaluate(() => { window.__EMEEM__.boats.reset(); });

/* --------------------------------------------------------- the lakes AFTER the first
 *
 * Everything above tests lake 0 at z=-420, and for a while that was the whole
 * suite - which meant the repeating half of a repeating feature was unproven.
 * Lakes recur every LAKE_PERIOD and their centres WANDER in X (lakeCentreX is a
 * sine of the index), so lake 1 is at (23.0, -1444) and lake 2 at (-33.9,
 * -2468). A boat moored at x=0 or a water plane left on the first lake would
 * pass every check above and strand every player who got past the first
 * crossing.
 */
console.log('\n== the lakes after the first ==');

const lakeGeom = await page.evaluate(() => {
  const w = window.__EMEEM__.world;
  const out = [];
  for (let n = 0; n < 4; n++) {
    const cz = -(420 + n * 1024);
    const cx = Math.sin(n * 2.399) * 34;
    out.push({ n, cx: +cx.toFixed(2), cz, centre: w.waterAt(cx, cz), short: w.waterAt(cx, cz + 40) });
  }
  return out;
});
for (const g of lakeGeom) {
  ok(`lake ${g.n} is open water at its centre (${g.cx}, ${g.cz})`, g.centre === 1, `waterAt = ${g.centre}`);
  ok(`lake ${g.n} is dry 40m short of it`, g.short === 0, `waterAt = ${g.short}`);
}

// Sample the whole corridor. A lake that never appears and a lake that never
// ends both fail this; a single centre-point probe catches neither.
const profile = await page.evaluate(() => {
  const w = window.__EMEEM__.world;
  let wet = 0, dry = 0, runs = 0, was = false;
  for (let z = 0; z >= -3600; z -= 2) {
    const cx = Math.sin(Math.round((-z - 420) / 1024) * 2.399) * 34;
    const isWet = w.waterAt(cx, z) > 0;
    if (isWet && !was) runs++;
    was = isWet;
    if (isWet) wet++; else dry++;
  }
  return { wet, dry, runs };
});
// THE SHORELINE MUST NOT BE STRAIGHT. A rectangle seen from a camera that never
// rotates draws a dead horizontal line across the whole screen, and that is what
// the first build of this lake looked like. Walk the near waterline across the
// visible width and check it actually moves.
const shore = await page.evaluate(() => {
  const w = window.__EMEEM__.world;
  const zs = [];
  for (let x = -60; x <= 60; x += 4) {
    // bisect for the waterline on this column of the first lake
    let lo = -456, hi = -300;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      if (w.waterAt(x, mid) > 0) lo = mid; else hi = mid;
    }
    zs.push(lo);
  }
  return { min: Math.min(...zs), max: Math.max(...zs), n: zs.length };
});
ok('the shoreline bends instead of ruling a straight line',
  shore.max - shore.min > 4,
  `${(shore.max - shore.min).toFixed(1)}m of wander across 120m of shore`);
ok('but it stays a shoreline, not a fjord',
  shore.max - shore.min < 16,
  `${(shore.max - shore.min).toFixed(1)}m`);

ok('four lakes in the first 3.6km, one per 1024m', profile.runs === 4, `${profile.runs} stretches of water`);
ok('water stays a small fraction of the walk', profile.wet / (profile.wet + profile.dry) < 0.10,
  `${(100 * profile.wet / (profile.wet + profile.dry)).toFixed(1)}% wet`);

for (const n of [1, 2]) {
  const cz = -(420 + n * 1024);
  const cx = +(Math.sin(n * 2.399) * 34).toFixed(2);
  console.log(`\n-- lake ${n} at (${cx}, ${cz}) --`);

  await page.evaluate(([x, z]) => {
    const E = window.__EMEEM__;
    E.state.player.pos.set(x, 0, z + 50);   // walking in from the near shore
    E.state.player.hull = 1;
    E.state.monster.pos.set(x, 0, z + 90);  // well behind, so nothing dies mid-measurement
  }, [cx, cz]);
  await mark(); await gameWait(1.5);

  const here = await page.evaluate(([x, z]) => {
    const E = window.__EMEEM__, w = E.world;
    let inWater = 0, total = 0;
    for (const c of w.colliders) {
      const mx = (c.min.x + c.max.x) / 2, mz = (c.min.z + c.max.z) / 2;
      if (Math.abs(mz - z) > 200) continue;
      total++;
      if (w.waterAt(mx, mz) > 0) inWater++;
    }
    let water = null;
    const boats = [];
    E.ctx.scene.traverse((o) => {
      if (o.name === 'water') water = { visible: o.visible, x: +o.position.x.toFixed(1), z: +o.position.z.toFixed(1) };
      if (o.parent && o.parent.name === 'boats' && o.visible) boats.push({ x: +o.position.x.toFixed(1), z: +o.position.z.toFixed(1) });
    });
    return { inWater, total, water, boats };
  }, [cx, cz]);

  ok(`lake ${n}: the water plane moved to THIS lake`,
    !!here.water && here.water.visible && Math.abs(here.water.z - cz) < 1 && Math.abs(here.water.x - cx) < 1,
    here.water ? `visible=${here.water.visible} at (${here.water.x}, ${here.water.z})` : 'no water mesh');
  ok(`lake ${n}: three boats re-moored here`, here.boats.length === 3,
    here.boats.map((b) => `(${b.x},${b.z})`).join(' '));
  // Not a magic z. The shoreline bends with x (shoreWarp), so "34m from the
  // centre" stopped being true the moment the lake stopped being a rectangle -
  // and a test that pins a number the design deliberately varies fails for the
  // wrong reason. Assert the CONTRACT: every boat floats, and every boat has
  // dry land close behind it, which is what "moored on the near shore" means.
  const mooring = await page.evaluate((bs) => {
    const w = window.__EMEEM__.world;
    return bs.map((b) => ({ x: b.x, z: b.z, wet: +w.waterAt(b.x, b.z).toFixed(2), behind: +w.waterAt(b.x, b.z + 3).toFixed(2) }));
  }, here.boats);
  ok(`lake ${n}: every boat is afloat`, mooring.every((m) => m.wet > 0),
    mooring.map((m) => m.wet).join(', '));
  ok(`lake ${n}: and moored on the shore, not out in the middle`,
    mooring.every((m) => m.wet < 0.4 && m.behind === 0),
    mooring.map((m) => `${m.wet}/${m.behind}`).join(' '));
  ok(`lake ${n}: nothing stands in the water`, here.inWater === 0, `${here.inWater} of ${here.total} nearby colliders`);

  await page.evaluate(([x, z]) => { window.__EMEEM__.state.player.pos.set(x, 0, z + 35); }, [cx, cz]);
  await mark(); await gameWait(0.6);
  const rode = await page.evaluate(() => window.__EMEEM__.state.player.boat);
  ok(`lake ${n}: the middle boat boards`, rode === 1, `boat = ${rode}`);

  // Sail to the far shore and price the crossing in hull. The design rests on a
  // crossing costing well under a full hull but far more than nothing: a free
  // crossing makes the lake scenery, one that cannot be finished makes the boat
  // a trap. The loop also stops on a dead run, so this can never grade a corpse.
  await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.z = 1; i.x = 0; });
  const t0 = await page.evaluate(() => window.__EMEEM__.state.time);
  // "Past the far shore" is asked of the FIELD, not of a constant: the shore
  // bends, so the crossing on this line is not 72m and no fixed number is the
  // right one. Dry ground, moving away from the lake, is the whole condition.
  const reached = await page.waitForFunction((z) => {
    const E = window.__EMEEM__;
    const p = E.state.player.pos;
    return (p.z < z && E.world.waterAt(p.x, p.z) === 0)
      || E.state.player.hull <= 0 || E.state.phase !== 'playing';
  }, cz, { timeout: 300000, polling: 50 }).then(() => true).catch(() => false);
  const land = await page.evaluate(([z, t]) => {
    const E = window.__EMEEM__;
    const p = E.state.player.pos;
    return { z: p.z, hull: E.state.player.hull, secs: E.state.time - t,
             past: p.z < z && E.world.waterAt(p.x, p.z) === 0, phase: E.state.phase };
  }, [cz, t0]);
  await page.evaluate(() => { const i = window.__EMEEM__.state.input; i.z = 0; i.x = 0; });

  ok(`lake ${n}: the crossing measured a LIVE game`, land.phase === 'playing', land.phase);
  ok(`lake ${n}: the boat reaches the far shore`, reached && land.past,
    `dry land at z = ${land.z.toFixed(1)}, ${(Math.abs(land.z - cz)).toFixed(1)}m past the centre, took ${land.secs.toFixed(1)}s`);
  ok(`lake ${n}: the crossing costs most of a hull, not all of it`,
    land.hull > 0.05 && land.hull < 0.60,
    `${(100 * land.hull).toFixed(0)}% hull left`);

  // Leave the boat so the next lake starts from a walk, not a ride.
  await page.evaluate(() => { window.__EMEEM__.state.input.jumpPressed = true; });
  await mark(); await gameWait(0.4);
}

const realErrors = errors.filter((e) => !/WebGL|SwiftShader|fallback|deprecated/i.test(e));
ok('no console errors', realErrors.length === 0, realErrors.slice(0, 2).join(' | '));
await browser.close();

if (fails.length) { console.log(`\n${fails.length} WATER CHECK(S) FAILED:`); for (const f of fails) console.log('  - ' + f); process.exitCode = 1; }
else console.log('\nAll water checks passed.');
