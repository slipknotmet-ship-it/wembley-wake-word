import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CONFIG } from '../core/config.js';

/**
 * EMEEM - the collectibles. THREE KINDS, ONE POOL.
 *
 *   emeem   +1   a glossy domed disc with a raised darker tip. The bread and
 *                butter, and visually untouched from the day it shipped.
 *   runner  +3   small, rare, and it MOVES. Drifts when it has not noticed you,
 *                bolts away when you close, turns at a finite rate so it can be
 *                cornered and cut off rather than merely outrun.
 *   amaam   -2   the hazard. Big, cold, faceted, dead-centred, ringed by a sick
 *                teal halo. Taking one costs you two points.
 *
 * THE READ IS THE WHOLE DESIGN OF THE AMAAM. At forty metres through dread fog
 * a 0.8m disc is about twelve pixels wide, so its silhouette tells you nothing
 * in time - by the time SIZE reads you have already steered into it. What
 * carries at that range is the halo, so the three kinds are separated first and
 * foremost by what their halo IS:
 *
 *   emeem   a soft filled blob in its own warm body tone, breathing gently.
 *   runner  the same filled blob, hot and pale, twinkling fast - motion plus
 *           sparkle, the two things peripheral vision is actually good at.
 *   amaam   a RING. A different texture entirely: hollow in the middle, one
 *           fixed cold teal that appears nowhere else in the game, pulsing slow
 *           and heavy. A bright pip inside a warm blob means take it; a dead
 *           dark centre inside a cold ring means do not.
 *
 * Closer in, silhouette takes over and says the same thing again: the amaam is
 * a wide low faceted slab (nine-sided, flat-shaded) wearing a broad dark lid
 * instead of a cheerful pip, it hangs lower, it lolls further off vertical, it
 * precesses with a lurch, and it heaves on a slow asymmetric bob that spends
 * most of its time sitting low. Everything about it is heavy and wrong.
 *
 * THE OTHER THREE THINGS THAT DRIVE THIS FILE, unchanged from the day it
 * shipped:
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
 *     therefore always the greedy move - and now also the risky one, because
 *     amaams spawn in the same forward cone as everything else.
 *
 *  3. THE MAGNET IS THE GAME FEEL. On a phone, with a 4-way D-pad and a thumb
 *     covering a third of the screen, "walk exactly onto a 0.22m disc" is
 *     miserable. Inside magnetRadius a PRIZE comes to you and rises to the
 *     hand's grab height, so a near miss reads as a catch. An amaam never
 *     magnets: a hazard that reached for you would be unsteerable, and the
 *     whole point of the amaam is that avoiding it is a decision you get to
 *     make.
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
const AXIS_Z = new THREE.Vector3(0, 0, 1);

/** Shortest signed angle into (-PI, PI]. Used by every steering decision. */
function wrapPi(a) {
  a %= TAU;
  if (a > Math.PI) a -= TAU;
  else if (a < -Math.PI) a += TAU;
  return a;
}

/** Config numbers are the spec, but a bad edit must not take the module down. */
function num(v, d) {
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
}

const E = CONFIG.emeem;
const PAL = CONFIG.palette;
const KC = (E && E.kinds) || {};

// ------------------------------------------------------------------- kinds

/**
 * The one halo colour an amaam ever wears. Fixed, not sampled from its body
 * tones, because the halo is the SIGNAL: "cold teal ring means it takes points
 * off you" is a rule a player learns in exactly one death, and a rule you can
 * only learn if the colour never varies. It is also a hue that appears nowhere
 * else - the prizes are warm, the ground is yellow-green, the fog goes from
 * pale blue to dried blood - so nothing on screen can be confused for it.
 */
const AMAAM_HALO = 0x6fd3c8;

/**
 * ...and the cold light it gives off. The body tones from palette.amaams are
 * olive, which sits uncomfortably close to the forest floor at low dread, so
 * the emissive is pushed hard toward teal instead of tinting the body colour.
 * That is what stops an amaam from disappearing into the ground it lies on.
 */
const AMAAM_EMISSIVE = 0x2f5f59;

/**
 * Builds one kind's static description: the numbers from config, the geometry
 * recipe, and everything derived from them. Everything here is frozen at module
 * load; the GPU-side assets are per-factory and live in `art` below.
 */
function defineKind(id, raw, look) {
  const radius = num(raw.radius, E.radius);
  const pickupRadius = num(raw.pickupRadius, E.pickupRadius);
  const bobHeight = look.bobHeight;
  const hoverY = look.hoverY;
  return {
    id,
    points: num(raw.points, 1),
    weight: Math.max(0, num(raw.weight, 0)),
    /**
     * Something the hand should reach for and the player should want. Normally
     * that is just "worth points", but the golden emeem is worth NOTHING on the
     * scoreboard and is still the most valuable thing on the field, so a kind
     * may say so outright.
     */
    prize: look.prize !== undefined ? !!look.prize : num(raw.points, 1) > 0,

    radius,
    pickupRadius,
    pickR2: pickupRadius * pickupRadius,

    /** Halo size straight from config: radius * kind.glow. */
    glowScale: radius * num(raw.glow, 7.5),

    // --- pose -------------------------------------------------------------
    hoverY,
    bobHeight,
    bobSpeed: look.bobSpeed,
    spinSpeed: look.spinSpeed,
    lurch: look.lurch || 0,
    heavyBob: !!look.heavyBob,
    tiltQ: new THREE.Quaternion().setFromAxisAngle(AXIS_Z, look.tilt),

    // --- halo -------------------------------------------------------------
    ring: !!look.ring,
    haloFixed: look.haloFixed || 0,     // 0 => wear the body tone
    haloPulse: look.haloPulse,          // amplitude of the scale breathe
    haloRate: look.haloRate,            // rad/s of that breathe
    haloBase: look.haloBase,
    haloGain: look.haloGain,
    /** Wears a halo at all. An amaam does not: its size is its warning. */
    hasHalo: look.hasHalo !== false,
    /** rad/s of the brightness flash; 0 (the default) means no flash. */
    flashRate: num(look.flashRate, 0),
    /** Amplitude of that flash on halo opacity, as a fraction of the base. */
    flashHalo: num(look.flashHalo, 0),
    /** ...and on the body's emissive, so the thing itself blinks, not just its glow. */
    flashEmissive: num(look.flashEmissive, 0),

    // --- surface ----------------------------------------------------------
    colors: look.colors,
    tipShade: look.tipShade,
    roughness: look.roughness,
    flat: !!look.flat,
    emissiveHex: look.emissiveHex || 0, // 0 => emit in the body tone
    emissiveBase: look.emissiveBase,
    emissiveGain: look.emissiveGain,
    geo: look.geo,                      // geometry recipe, built per factory

    // --- gameplay ---------------------------------------------------------
    /** Prizes come to the pincer; hazards never move toward you. */
    magnetic: num(raw.points, 1) > 0,
    /**
     * Vertical grab window, relative to the player's FEET. A collectible hovers
     * hoverY above whatever ground it sits on, so on flat ground the gap is
     * exactly hoverY. Reaching DOWN as far as hoverY + player.radius keeps one
     * beside a low kerb grabbable; reaching UP as far as player.height + hoverY
     * lets you snatch one at the apex of a jump (apex = jumpVelocity^2 /
     * 2|gravity| = 1.47m) while still refusing to vacuum the ground from the
     * roof of a 4m block. It is also why you can JUMP AN AMAAM: an amaam hangs
     * low, so it leaves the window well before the apex of a hop.
     */
    pickYMin: -(hoverY + CONFIG.player.radius),
    pickYMax: CONFIG.player.height + hoverY,

    /** Clearance box tested against world colliders before a spawn is accepted. */
    clearXZ: radius + 0.55,
    clearY: hoverY + bobHeight + radius,

    // --- runner motion (ignored by the still kinds) ------------------------
    moves: !!look.moves,
    speed: num(raw.speed, 4.2),
    wanderSpeed: num(raw.wanderSpeed, 1.1),
    fleeRadius: num(raw.fleeRadius, 7.0),
    fleeR2: num(raw.fleeRadius, 7.0) ** 2,
    turnRate: num(raw.turnRate, 3.4),

    // --- collect reaction --------------------------------------------------
    popTime: look.popTime,
    burstTime: look.burstTime,
  };
}

/**
 * An emeem is a flattened circular base with a small raised tip at its centre.
 * Its numbers are reproduced here EXACTLY as they shipped - this kind is not
 * being redesigned, only joined by two others.
 */
const EMEEM = defineKind('emeem', KC.emeem || {}, {
  colors: PAL.emeems,
  tipShade: num(PAL.emeemTipShade, 0.78),
  roughness: 0.62,
  emissiveBase: 0.38,
  emissiveGain: 0.72,
  haloBase: 0.42,
  haloGain: 0.36,
  haloPulse: 0.07,
  haloRate: num(E.bobSpeed, 2.1) * 1.7,
  hoverY: num(E.hoverY, 0.34),
  bobHeight: num(E.bobHeight, 0.28),
  bobSpeed: num(E.bobSpeed, 2.1),
  spinSpeed: num(E.spinSpeed, 1.4),
  tilt: 0.42,
  popTime: 0.24,
  burstTime: 0.38,
  geo: { segW: 20, segH: 12, squash: 0.30, tipR: 0.30, tipSegW: 14, tipSegH: 10, tipSquash: 1.25, tipLift: 0.72 },
});

/**
 * A runner is an emeem's little brother: the same family shape at two thirds
 * the size, rounder, hotter, with a taller pip. It is deliberately NOT a new
 * silhouette, because it has to read as treasure instantly; what marks it out
 * is that it is pale, that it sparkles, and above all that it MOVES.
 *
 * Its halo multiplier (9.5) is larger than an emeem's but its radius is
 * smaller, so at rest its halo is slightly the smaller of the two. The twinkle
 * is what settles that: at the top of its pulse the halo is 24% wider than
 * nominal, which puts its peak comfortably above an emeem's steady state, and a
 * pulsing light is far easier to catch out of the corner of an eye than a
 * larger steady one.
 */
const RUNNER = defineKind('runner', KC.runner || {}, {
  colors: PAL.runners,
  tipShade: 0.86,       // barely darker: a runner reads as one hot bead, not two-tone
  roughness: 0.44,      // glossier than an emeem so it catches the sun harder
  emissiveBase: 0.55,
  emissiveGain: 0.85,
  haloBase: 0.58,
  haloGain: 0.34,
  haloPulse: 0.24,      // the twinkle
  haloRate: 7.4,
  hoverY: num(E.hoverY, 0.34) * 1.06,
  bobHeight: num(E.bobHeight, 0.28) * 0.62,
  bobSpeed: num(E.bobSpeed, 2.1) * 1.55,
  spinSpeed: num(E.spinSpeed, 1.4) * 2.1,
  tilt: 0.34,
  popTime: 0.24,
  burstTime: 0.42,
  moves: true,
  geo: { segW: 16, segH: 10, squash: 0.38, tipR: 0.34, tipSegW: 12, tipSegH: 8, tipSquash: 1.35, tipLift: 0.78 },
});

/**
 * An amaam is the full form an emeem is a small bright piece of: a wide
 * shallow DOME, a proud AREOLA, and a small NIPPLE standing off it. Three
 * parts, one merged geometry, one draw call.
 *
 * Seating, in millimetres, all measured on the built geometry rather than
 * intended: the dome is 400 across and 232 high; the areola is a 232 disc
 * lifted to 176.32 so its apex stands 13.92 proud, with its rim buried 12.671
 * inside the dome surface, so it grows out of the body instead of resting on
 * it. The two surfaces cross at 226.669, giving a 453.34 dark disc - 32.1% of
 * the plan area against the old flat lid's 29.6%. The nipple is 62 across,
 * stretched 1.55, its base buried 112.13 inside the areola, its apex 323.46.
 *
 * IT MUST STILL READ AS A HAZARD AT FORTY METRES, which is the whole reason it
 * used to be a flat angular ring. The silhouette does not move toward the
 * emeem: projected aspect at 40m is 0.448-0.536 for an emeem, 0.559-0.656 for
 * the old amaam, 0.721-0.776 for this one - further away, not closer. What the
 * old shape bought and this one has to buy back is shape-FAMILY separation,
 * worst during the ~45% of the 9.97s precession when the crown faces away and
 * you see a bare dome. bellyShade is the mitigation for exactly that phase: it
 * darkens the underside so a dome seen edge-on still reads as heavy and wrong.
 * The cold fixed halo, the colder body tones and nearly twice the radius carry
 * the rest.
 *
 * 744 triangles against an emeem's 692 - the biggest thing in the field, and
 * now the most expensive, at about +5% of the main pass with ~9 alive.
 */
const AMAAM = defineKind('amaam', KC.amaam || {}, {
  colors: PAL.amaams,
  tipShade: num(PAL.amaamTipShade, 0.62),
  roughness: 0.88,      // chalky and dead; no highlight to catch the eye warmly
  flat: true,
  emissiveHex: AMAAM_EMISSIVE,
  emissiveBase: 0.30,
  emissiveGain: 0.52,
  ring: true,
  /**
   * NO AURA. Every other collectible wears one; this one is now told apart by
   * being obviously, unmissably BIGGER instead.
   *
   * That is a real trade and it has to be paid for. The halo was the amaam's
   * long-range signal - a cold ring visible through dread fog after the body
   * itself had faded - so removing it costs the read at distance and hands the
   * whole job to silhouette. Which is why the radius goes up in the same
   * change, and by enough to be unmistakable rather than merely measurable:
   * 0.52 against an emeem's 0.22 is 2.36x the width and 5.6x the plan area, so
   * the size difference survives fog, glance and a 6.9" screen.
   * Halo fields stay defined below and simply go unused, so restoring the aura
   * is one flag rather than an archaeology exercise.
   */
  hasHalo: false,
  haloFixed: AMAAM_HALO,
  haloBase: 0.50,
  haloGain: 0.40,
  haloPulse: 0.18,
  haloRate: 1.5,
  hoverY: 0.27,         // hangs low: heavy, and easier to hop over
  bobHeight: 0.15,
  bobSpeed: num(E.bobSpeed, 2.1) * 0.42,
  spinSpeed: num(E.spinSpeed, 1.4) * 0.45,
  lurch: 0.34,          // the precession stumbles instead of gliding
  heavyBob: true,
  tilt: 0.62,           // lolls much further off vertical than a prize
  popTime: 0.34,        // a slower death than a prize: it deflates, not pops
  burstTime: 0.46,
  geo: {
    // DOME: 18 x 12, squashed to 0.58 - a 400mm-radius, 232mm-high cap.
    segW: 18, segH: 12, squash: 0.58,
    // AREOLA: a 232mm disc lifted so its apex stands 13.92mm proud of the dome
    // while its rim stays 12.671mm buried inside it.
    tipR: 0.58, tipSegW: 18, tipSegH: 6, tipSquash: 0.30, tipLift: 0.76,
    // NIPPLE: 62mm, stretched, its base buried 112.13mm inside the areola.
    capR: 0.155, capSegW: 12, capSegH: 8, capSquash: 1.55, capLift: 0.98,
    capShade: 0.46,
    // BELLY: a shade ramp in METRES in the squashed geometry's own space. The
    // band keeps everything from the equator UP at a full 1.0, so the pale rim
    // the bullseye reads against survives; a wider band painted the equator
    // 0.76 and put a ring within 0.6% of the areola's own 0.62, which would
    // have merged the two tones at distance.
    bellyShade: 0.52, bellySplit: -0.06, bellyFeather: 0.05,
  },
});

/**
 * GOLDEN. Worth nothing. Slows the Protector for six seconds, and a second one
 * RESTARTS those six rather than adding to them.
 *
 * IT FLASHES, and that is the point of the look rather than decoration. Every
 * other collectible glows steadily, so the field reads as a constant field. A
 * golden emeem is the only thing out there whose worth is time-limited and
 * situational - it is worth nothing at all unless you are being chased - so it
 * has to announce itself from across the forest and keep announcing it. The
 * blink is rectified (|sin|), which lingers at the bright end and snaps through
 * the dark, so it reads as a beacon rather than a slow breathe, and the trough
 * never reaches zero: an emeem that vanished mid-cycle could be run straight
 * past.
 *
 * Its halo is the biggest of any kind (glow 11.0 against an emeem's 7.5) and
 * flashes with the body, so at range you see the pulse before you can resolve
 * the shape.
 */
const GOLDEN = defineKind('golden', KC.golden || {}, {
  colors: PAL.goldens,
  tipShade: 0.72,
  roughness: 0.28,      // the only polished thing in the field: it catches light
  metalness: 0.0,
  prize: true,          // worth 0 points and still the thing you want most
  emissiveBase: 0.62,
  emissiveGain: 0.85,
  haloBase: 0.60,
  haloGain: 0.40,
  haloPulse: 0.16,
  haloRate: 4.2,
  // The flash itself: ~1.1 blinks a second, deep on both the halo and the body.
  flashRate: 7.0,
  flashHalo: 0.42,
  flashEmissive: 0.34,
  hoverY: num(E.hoverY, 0.34) + 0.06,   // rides a touch proud of the ordinary field
  bobHeight: num(E.bobHeight, 0.28) * 1.15,
  bobSpeed: num(E.bobSpeed, 2.1) * 1.25,
  spinSpeed: num(E.spinSpeed, 1.4) * 1.6,
  tilt: 0.30,
  popTime: 0.26,
  burstTime: 0.42,
  geo: { segW: 20, segH: 12, squash: 0.34, tipR: 0.32, tipSegW: 14, tipSegH: 10, tipSquash: 1.30, tipLift: 0.74 },
});

const KIND_LIST = [EMEEM, RUNNER, AMAAM, GOLDEN];
const KIND_WEIGHT_TOTAL = KIND_LIST.reduce((a, k) => a + k.weight, 0) || 1;

// ------------------------------------------------------------- field sizing

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
 * a collectible never pops into existence inside your field of view; the far
 * edge sits where calm fog still leaves it readable (fogFar * 0.3 == 45m).
 */
const RING_MIN = 12;
const RING_MAX = Math.max(RING_MIN + 8, CONFIG.world.fogFar * 0.3);
const RING_MIN2 = RING_MIN * RING_MIN;
const RING_MAX2 = RING_MAX * RING_MAX;
/** First seed of a run pulls in closer so there is something to grab at once. */
const SEED_RING_MIN = 5;
const SEED_RING_MIN2 = SEED_RING_MIN * SEED_RING_MIN;

/**
 * ...but never an AMAAM that close. Being handed a penalty inside the first
 * stride, before the player has even seen one, teaches nothing. Inside this
 * radius the weighted draw falls back to a plain emeem.
 */
const AMAAM_MIN_SPAWN_R = 11;

/**
 * Recycle radius. Comfortably past the ring so a collectible you sprinted past
 * lingers behind you for a few seconds instead of blinking out on screen.
 */
const DESPAWN_R = RING_MAX + 25;

/**
 * Fraction of ordinary emeems that spawn on top of a prop. Runners are excluded
 * because they move, and amaams because a hazard you have to climb to reach is
 * a hazard you will never take by accident.
 */
const PERCH_SHARE = num(E.perchShare, 0.22);
/** Scratch for world.pickPerch, so a spawn attempt allocates nothing. */
const _perch = { x: 0, y: 0, z: 0 };
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

const MAGNET_R = E.magnetRadius;
const MAGNET_R2 = MAGNET_R * MAGNET_R;

/**
 * Nothing may spawn inside an amaam's kill radius. Without this a prize can
 * land in the one place you cannot reach it from, which reads as the game
 * cheating rather than as a decision you got wrong. The keep-out is the amaam's
 * pickup radius plus the candidate's own, so the two circles never touch.
 */
function amaamKeepOut(kind) {
  return AMAAM.pickupRadius + (kind.prize ? kind.pickupRadius : 0.7);
}

// -------------------------------------------------------------- runner rules

/**
 * How far a runner may get from where it spawned before it is pulled back.
 * Without a tether it would simply flee down the -Z corridor forever, cross
 * DESPAWN_R and evaporate the moment you noticed it - so the rarest, most
 * valuable thing in the game would be the one thing you could never catch.
 * Tethered, a cornered runner curls back across your path, which is exactly the
 * moment you want: cut the corner instead of chasing the tail.
 */
const TETHER_R = 8.0;
const TETHER_SPAN = 5.0;

/** Look-ahead for the obstacle probe, on top of the runner's own clearance box. */
const PROBE_AHEAD = 1.15;
/** How hard it swerves when the way ahead is blocked. */
const PROBE_TURN = 0.9;
/** Seconds a swerve is committed to, so it cannot dither in a doorway. */
const AVOID_HOLD = 0.32;
/** Runners give amaams a wide berth; a prize parked on a hazard is uncatchable. */
const AMAAM_AVOID_R = 2.8;
const AMAAM_AVOID_R2 = AMAAM_AVOID_R * AMAAM_AVOID_R;
/** Probe intervals. Fast enough that it can never step past its own look-ahead. */
const PROBE_FLEE = 0.12;
const PROBE_CALM = 0.30;

/** Additive one-shot particles fired on pickup. */
const BURSTS = 10;
/** Two flavours: a bright expanding flash, and a dull inward collapse. */
const BURST_POP = 0;
const BURST_COLLAPSE = 1;

// ------------------------------------------------------------------- glow maps
let _glowTexture = null;
let _ringTexture = null;

/**
 * Builds a 64x64 RGBA alpha map as a DataTexture rather than via a 2D canvas:
 * no DOM, so it works identically under the headless smoke test, and it is
 * 16KB of upload once.
 *
 * @param {(r:number) => number} falloff alpha as a function of radius 0..1
 */
function buildAlphaTexture(falloff) {
  const S = 64;
  const data = new Uint8Array(S * S * 4);
  const c = (S - 1) * 0.5;
  const inv = 1 / c;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = (x - c) * inv;
      const dy = (y - c) * inv;
      const r = Math.sqrt(dx * dx + dy * dy);
      const a = r < 1 ? Math.min(1, Math.max(0, falloff(r))) : 0;
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
  return tex;
}

/**
 * The prize halo: a wide quadratic shoulder plus a tight hot core, which gives
 * a bloom-ish look without any post-processing (we cannot afford a bloom pass
 * on a mobile GPU that also has to draw shadows).
 */
function getGlowTexture() {
  if (!_glowTexture) {
    _glowTexture = buildAlphaTexture((r) => {
      const shoulder = (1 - r) ** 2.2 * 0.7;
      const core = Math.max(0, 1 - r * 2.6) ** 3 * 0.55;
      return shoulder + core;
    });
  }
  return _glowTexture;
}

/**
 * The hazard halo: an ANNULUS. This is the single most important texel in the
 * game. A prize is a bright blob with a bright middle; an amaam is a cold ring
 * around a dead centre. That difference survives being six pixels wide, being
 * seen out of the corner of an eye, and being seen through fog - which size,
 * shape and shading all do not.
 *
 * A whisper of haze is left in the middle so the ring reads as something
 * sitting there rather than as a hole punched in the world.
 */
function getRingTexture() {
  if (!_ringTexture) {
    _ringTexture = buildAlphaTexture((r) => {
      const band = (r - 0.60) / 0.19;
      const ring = Math.exp(-band * band) * 0.95;
      const haze = (1 - r) ** 3 * 0.10;
      // Force it to zero before the sprite's edge, or the band clips square.
      return (ring + haze) * Math.min(1, (1 - r) * 6);
    });
  }
  return _ringTexture;
}

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

/**
 * Same, but ramped in Y: `shade` below `split - feather`, 1 above
 * `split + feather`, linear between. Both bounds are METRES in the geometry's
 * own already-squashed space, not ratios - which is why they are the only two
 * fields in a `geo` block that are not fractions.
 */
function paintVertexRamp(geo, shade, split, feather) {
  const p = geo.attributes.position;
  const n = p.count;
  const arr = new Float32Array(n * 3);
  const lo = split - feather;
  const inv = 1 / (2 * feather);
  for (let i = 0; i < n; i++) {
    let t = (p.getY(i) - lo) * inv;
    if (t < 0) t = 0; else if (t > 1) t = 1;
    const sh = shade + (1 - shade) * t;
    arr[i * 3] = sh; arr[i * 3 + 1] = sh; arr[i * 3 + 2] = sh;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
}

/**
 * A collectible is a flattened base with a raised centrepiece and - if the
 * recipe asks for one - a third, smaller part on top of that.
 *
 * Every part merges into ONE geometry and they are told apart by a baked vertex
 * colour. The material's own colour multiplies through it, so a single material
 * and a single draw call still give a multi-tone object, and every tone of a
 * kind shares one geometry. With ~54 of these live, a second draw call each
 * would not be free.
 *
 * The extra parts are STRICTLY ADDITIVE. `g.capR` and `g.bellyShade` are
 * undefined for the emeem and the runner, so both guards below are dead for
 * them and their merged buffers come out byte-identical to before this existed
 * - same positions, normals, uvs, colours, index and attribute order.
 */
function buildKindGeometry(kind) {
  const g = kind.geo;
  const baseGeo = new THREE.SphereGeometry(kind.radius, g.segW, g.segH);
  // Bake the squash into the vertices instead of using mesh.scale, so mesh.scale
  // stays free for the pickup animation.
  baseGeo.scale(1, g.squash, 1);

  const tipGeo = new THREE.SphereGeometry(kind.radius * g.tipR, g.tipSegW, g.tipSegH);
  tipGeo.scale(1, g.tipSquash, 1);
  // Sunk slightly so the centrepiece grows out of the base rather than
  // balancing on it.
  tipGeo.translate(0, kind.radius * g.squash * g.tipLift, 0);

  if (g.bellyShade > 0) paintVertexRamp(baseGeo, g.bellyShade, g.bellySplit, g.bellyFeather);
  else paintVertexColor(baseGeo, 1);
  paintVertexColor(tipGeo, kind.tipShade);

  const parts = [baseGeo, tipGeo];
  if (g.capR > 0) {
    const capGeo = new THREE.SphereGeometry(kind.radius * g.capR, g.capSegW, g.capSegH);
    capGeo.scale(1, g.capSquash, 1);
    capGeo.translate(0, kind.radius * g.squash * g.capLift, 0);
    paintVertexColor(capGeo, g.capShade);
    parts.push(capGeo);
  }

  const merged = mergeGeometries(parts, false);
  for (let i = 0; i < parts.length; i++) parts[i].dispose();
  merged.computeBoundingSphere();
  return merged;
}

/**
 * Builds the collectible field.
 *
 * @param {object} ctx - { THREE, CONFIG, state, bus, scene, camera, renderer,
 *                         engine, world, audio, addScore }. `ctx.world` and
 *                         `ctx.audio` are null at construction time, so nothing
 *                         below dereferences them until update()/reset().
 * @returns {{group: THREE.Group, update: Function, reset: Function}}
 */
export function createEmeems(ctx) {
  const group = new THREE.Group();
  group.name = 'emeems';

  // ------------------------------------------------------------- shared assets
  // One geometry per kind, two textures, one material per (kind, tone). Every
  // pooled mesh points at these; activating an entry just swaps which geometry
  // and materials it references, so a respawn as a different kind costs three
  // property writes and no allocation.
  const glowTex = getGlowTexture();
  const ringTex = getRingTexture();

  /** @type {Record<string, {geo:THREE.BufferGeometry, disc:THREE.Material[], halo:THREE.SpriteMaterial[]}>} */
  const art = {};
  for (let i = 0; i < KIND_LIST.length; i++) {
    const k = KIND_LIST[i];
    /**
     * Soft and matte rather than candy-glossy. A little emissive is kept purely
     * for findability: at high dread the fog far plane closes to ~51m and a
     * fully matte object at that range is indistinguishable from the ground.
     */
    const disc = k.colors.map((hex) => new THREE.MeshStandardMaterial({
      color: hex,
      vertexColors: true,
      roughness: k.roughness,
      metalness: 0.0,
      emissive: k.emissiveHex || hex,
      emissiveIntensity: k.emissiveBase,
      flatShading: k.flat,
    }));

    /**
     * The halo deliberately has `fog: false`. The disc itself is fogged - it is
     * a physical object in the world and should recede - but the halo is
     * allowed to punch through, so at max dread (fog far plane closes to 51m)
     * a collectible at 45m is still a coloured pinprick in the murk instead of
     * nothing at all. depthTest stays on so the halo is correctly hidden behind
     * obstacles.
     */
    const halo = k.colors.map((hex) => new THREE.SpriteMaterial({
      map: k.ring ? ringTex : glowTex,
      color: k.haloFixed || hex,
      transparent: true,
      opacity: k.haloBase,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    }));

    art[k.id] = { geo: buildKindGeometry(k), disc, halo };
  }

  // ------------------------------------------------------------------- pooling
  /**
   * @type {Array<{mesh:THREE.Mesh, glow:THREE.Sprite, active:boolean, kind:object,
   *               art:object, basePos:THREE.Vector3, phase:number,
   *               colorIndex:number, respawnAt:number, pop:number,
   *               listIdx:number, homeX:number, homeZ:number, heading:number,
   *               wanderBase:number, speed:number, probe:number,
   *               avoidT:number, avoidAng:number}>}
   */
  const pool = new Array(POOL_SIZE);
  for (let i = 0; i < POOL_SIZE; i++) {
    const k = EMEEM;
    const a = art[k.id];
    const ci = i % k.colors.length;
    const mesh = new THREE.Mesh(a.geo, a.disc[ci]);
    // No shadow casting: 20+ extra casters would eat a meaningful slice of a
    // single 1024 shadow map that is really there for the player and monster.
    // The halo is what visually plants them on the ground.
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.visible = false;

    const glow = new THREE.Sprite(a.halo[ci]);
    glow.visible = false;
    glow.renderOrder = 2;

    group.add(mesh);
    group.add(glow);

    pool[i] = {
      mesh,
      glow,
      active: false,
      kind: k,
      art: a,
      basePos: new THREE.Vector3(),
      phase: 0,
      colorIndex: ci,
      respawnAt: 0,
      // Height of the prop top this one sits on, or 0 for an ordinary ground
      // spawn. Set on every activate path so a recycled entry can never keep a
      // stale perch and hover over open grass.
      perchY: 0,
      pop: 0,          // > 0 while playing the collect animation: drawn, not collectable
      listIdx: -1,     // slot in amaamList, or -1
      // runner-only state, inert for the still kinds
      homeX: 0,
      homeZ: 0,
      heading: 0,
      wanderBase: 0,
      speed: 0,
      probe: 0,
      avoidT: 0,
      avoidAng: 0,
    };
  }

  /**
   * Live amaams, kept as a compacted list so the spawn keep-out test and the
   * runners' hazard-avoidance are O(amaams) rather than O(pool). Removal is
   * swap-with-last using the index stored on the entry, so it never allocates
   * and never walks the list.
   */
  const amaamList = [];

  function amaamAdd(e) {
    e.listIdx = amaamList.length;
    amaamList.push(e);
  }

  function amaamRemove(e) {
    const i = e.listIdx;
    if (i < 0) return;
    e.listIdx = -1;
    const last = amaamList.pop();
    if (last !== e) {
      amaamList[i] = last;
      last.listIdx = i;
    }
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
    bursts[i] = { sprite, mat, life: 0, time: 0.38, from: 0, to: 1, mode: BURST_POP, map: glowTex };
  }

  let activeCount = 0;
  let cursor = 0;        // round-robins the pool so respawns spread over slots
  let burstCursor = 0;
  let burstsAlive = 0;
  let seeded = false;
  let lastDread = -1;    // forces the first dread write

  // ------------------------------------------------------------------ helpers

  /**
   * Weighted draw over CONFIG.emeem.kinds. `r` is the candidate's distance from
   * the player, which is the one thing that can veto the draw: no amaam ever
   * appears close enough to be unavoidable.
   */
  function pickKind(r) {
    let roll = Math.random() * KIND_WEIGHT_TOTAL;
    for (let i = 0; i < KIND_LIST.length; i++) {
      roll -= KIND_LIST[i].weight;
      if (roll <= 0) {
        const k = KIND_LIST[i];
        if (k === AMAAM && r < AMAAM_MIN_SPAWN_R) return EMEEM;
        return k;
      }
    }
    return EMEEM;
  }

  function activate(e, kind, x, groundY, z) {
    const a = art[kind.id];
    e.kind = kind;
    e.art = a;
    // Tag the mesh with its kind. Nothing in the game reads this - it exists so
    // the field is inspectable from outside, which is what lets the feature
    // tests assert that all three kinds actually spawn, that runners actually
    // move, and that the hand's reach target is never an amaam. Without it those
    // rules can only be checked by reading the code that implements them.
    e.mesh.userData.kind = kind.id;
    e.glow.userData.kind = kind.id;
    e.colorIndex = (Math.random() * kind.colors.length) | 0;
    e.mesh.geometry = a.geo;
    e.mesh.material = a.disc[e.colorIndex];
    e.glow.material = a.halo[e.colorIndex];
    e.basePos.set(x, groundY + kind.hoverY, z);
    e.phase = Math.random() * TAU; // per-entry so the field never bobs in lockstep
    e.active = true;
    e.pop = 0;
    e.mesh.scale.setScalar(1);
    e.mesh.position.copy(e.basePos);
    e.mesh.visible = true;
    e.glow.position.copy(e.basePos);
    e.glow.scale.setScalar(kind.glowScale);
    // An amaam wears no aura at all: its SIZE is the warning now, so a halo
    // would only soften the one cue it has left.
    e.glow.visible = kind.hasHalo;

    // Runner state. Tethered to where it was born; heading and meander seeded
    // per entry so a pair spawned in the same frame do not move as one.
    e.homeX = x;
    e.homeZ = z;
    e.heading = Math.random() * TAU;
    e.wanderBase = e.heading;
    e.speed = kind.wanderSpeed;
    e.probe = Math.random() * PROBE_CALM; // stagger the probes across the pool
    e.avoidT = 0;
    e.avoidAng = 0;

    if (kind === AMAAM) amaamAdd(e);
    activeCount++;
  }

  /** Drops an entry out of the live set without touching its visuals. */
  function deactivate(e) {
    if (e.active) activeCount--;
    e.active = false;
    e.perchY = 0;
    amaamRemove(e);
  }

  /**
   * Is a live prize already sitting within a metre of this spot? Two prizes on
   * the same rock top would be collected by one pass of the hand, which reads
   * as one of them evaporating - and emeem.js has no prize-vs-prize keep-out
   * anywhere else, because on open ground the ring sampling makes a collision
   * vanishingly unlikely. A perch is a handful of square metres, so it does not.
   */
  function prizeTaken(x, z) {
    for (let i = 0; i < pool.length; i++) {
      const o = pool[i];
      if (!o.active || !o.kind.prize) continue;
      const dx = o.basePos.x - x;
      const dz = o.basePos.z - z;
      if (dx * dx + dz * dz < 1.0) return true;
    }
    return false;
  }

  /** Returns an entry to the pool immediately (out of range, or reset). */
  function retire(e) {
    deactivate(e);
    e.pop = 0;
    e.mesh.visible = false;
    e.glow.visible = false;
    e.mesh.scale.setScalar(1);
  }

  /** True if a hovering collectible of this kind would be embedded in a prop. */
  function blockedAt(world, x, z, kind) {
    if (!world) return false;
    const gy = world.sampleGroundY(x, z);
    _min.set(x - kind.clearXZ, gy + 0.05, z - kind.clearXZ);
    _max.set(x + kind.clearXZ, gy + kind.clearY, z + kind.clearXZ);
    return world.queryAABB(_min, _max, _hits).length > 0;
  }

  /**
   * True if a runner heading in `ang` would hit something within `reach`.
   *
   * TWO samples, not one. A single box centred at the reach point spans roughly
   * 0.95m to 2.35m ahead at flee speed and leaves the first metre unexamined,
   * so a prop entering that near band as the runner turned was never seen at
   * all. The mid-point sample closes the gap, and two point tests stay far
   * tighter than one union box would be - a swept AABB down a diagonal path
   * covers a wedge of empty ground either side and would have runners shying
   * away from trees they were never going to touch.
   */
  function pathBlocked(world, x, z, ang, reach, kind) {
    if (!world) return false;
    const sx = Math.sin(ang);
    const sz = Math.cos(ang);
    if (blockedAt(world, x + sx * reach, z + sz * reach, kind)) return true;
    return blockedAt(world, x + sx * reach * 0.45, z + sz * reach * 0.45, kind);
  }

  /** True if (x, z) falls inside the keep-out circle of any live amaam. */
  function nearAmaam(x, z, kind) {
    const r = amaamKeepOut(kind);
    const r2 = r * r;
    for (let i = 0; i < amaamList.length; i++) {
      const b = amaamList[i].basePos;
      const dx = x - b.x;
      const dz = z - b.z;
      if (dx * dx + dz * dz < r2) return true;
    }
    return false;
  }

  /**
   * Picks a ground point on the ring around (px, pz), rejects it if it is
   * inside an obstacle, sitting on the monster, or inside an amaam's kill
   * radius, and activates `e` there. Tries a handful of candidates and gives
   * up - a congested frame simply spawns fewer collectibles, it never stalls
   * the loop.
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
      // behind. That is the whole "keep running forward" incentive - and, now,
      // the whole reason running forward is also dangerous.
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

      const kind = pickKind(r);
      if (nearAmaam(x, z, kind)) continue;
      // Nothing to collect on open water. Without this the lake is a fishing
      // spot rather than a hazard, and the whole point of crossing it is that
      // it costs you scoring time.
      if (world && world.waterAt && world.waterAt(x, z) > 0) continue;
      // Nor in the strip past the first lake's lip, which is dressed to look
      // like the edge of the world. A row of glowing prizes on it says the
      // ground continues, which is the one thing it must not say.
      if (world && world.inFallsVoid && world.inFallsVoid(x, z, 1.0)) continue;

      // --- perched: sit this one on top of a rock instead of on the ground.
      //
      // activate()'s third argument is already documented as "the surface this
      // thing sits on", not "the ground", so handing it a collider top is all a
      // perch needs - no signature changes anywhere.
      //
      // blockedAt MUST be skipped on this path, and that is the single gate
      // between the old code and this feature: it is a 0.77m XZ keep-out around
      // every collider whose Y range always overlaps a ground-anchored box, so
      // it is effectively a 2-D test and would reject every perch by
      // construction - the prize is meant to be ON the prop.
      if (kind === EMEEM && world && world.pickPerch && Math.random() < PERCH_SHARE) {
        if (world.pickPerch(px, pz, RING_MIN, RING_MAX, prizeTaken, _perch)) {
          const pdx = _perch.x - mx;
          const pdz = _perch.z - mz;
          if (pdx * pdx + pdz * pdz >= monsterKeepOut2 && !nearAmaam(_perch.x, _perch.z, kind)) {
            activate(e, kind, _perch.x, _perch.y, _perch.z);
            e.perchY = _perch.y;
            return true;
          }
        }
      }

      // Swept volume of the hovering, bobbing collectible. Anything overlapping
      // it means this one would be embedded in a prop and unreachable.
      if (blockedAt(world, x, z, kind)) continue;

      const gy = world ? world.sampleGroundY(x, z) : CONFIG.world.groundY;
      activate(e, kind, x, gy, z);
      e.perchY = 0;
      return true;
    }
    return false;
  }

  function spawnBurst(x, y, z, color, kind) {
    const b = bursts[burstCursor];
    burstCursor = (burstCursor + 1) % BURSTS;
    if (b.life <= 0) burstsAlive++;

    const collapse = !kind.prize;
    const map = collapse ? ringTex : glowTex;
    if (b.map !== map) {
      b.map = map;
      b.mat.map = map;
      // Same texture format and the same MAP define either way, so this is a
      // program-cache hit, not a recompile. It happens once per pickup.
      b.mat.needsUpdate = true;
    }

    b.mode = collapse ? BURST_COLLAPSE : BURST_POP;
    b.time = kind.burstTime;
    b.life = b.time;
    b.mat.color.setHex(color);
    if (collapse) {
      // Starts as a ring wider than the amaam's own halo and crushes inward:
      // the hazard closing over you, not a prize blooming out of you.
      b.from = kind.glowScale * 1.35;
      b.to = kind.radius * 0.8;
      b.mat.opacity = 0.5;
    } else {
      b.from = kind.radius * 2.4;
      b.to = kind.radius * 9.0;
      b.mat.opacity = 0.95;
    }
    b.sprite.position.set(x, y, z);
    b.sprite.scale.setScalar(b.from);
    b.sprite.visible = true;
  }

  function collect(e, s) {
    const k = e.kind;
    const p = e.mesh.position;
    const color = k.colors[e.colorIndex];
    spawnBurst(p.x, p.y, p.z, k.prize ? color : (k.haloFixed || color), k);

    // Uncollectable from here on, but still drawn for popTime.
    deactivate(e);
    e.pop = k.popTime;
    e.respawnAt = s.time + Math.max(E.respawnDelay, k.popTime + 0.05);

    if (typeof ctx.addScore === 'function') ctx.addScore(k.points);
    if (ctx.bus) {
      // Fresh Vector3 on purpose: listeners (audio, HUD, future VFX) may keep
      // it. `kind` and `points` are what let the HUD and the audio react to a
      // penalty differently from a prize - they must never have to infer it.
      ctx.bus.emit('collect', {
        position: new THREE.Vector3(p.x, p.y, p.z),
        color,
        score: s.score,
        kind: k.id,
        points: k.points,
      });
      // A jolt on a penalty and nothing on a prize. Half the job of telling the
      // player they just made a mistake is done before they have looked down.
      if (!k.prize) ctx.bus.emit('shake', { amount: 0.42 });
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
   * Collectibles have to stay findable as the world darkens, so their emissive
   * and their halo both ride `dread`. Both are plain uniform writes - no
   * needsUpdate, no shader recompile - but they still only run when dread has
   * actually moved.
   */
  function applyDread(d) {
    if (Math.abs(d - lastDread) < 0.01) return;
    lastDread = d;
    for (let i = 0; i < KIND_LIST.length; i++) {
      const k = KIND_LIST[i];
      const a = art[k.id];
      const emissive = k.emissiveBase + k.emissiveGain * d;
      const halo = k.haloBase + k.haloGain * d;
      // Remembered so applyFlash can ride ON these rather than fighting them -
      // a flashing kind still has to get brighter as the world darkens.
      a.baseEmissive = emissive;
      a.baseHalo = halo;
      for (let j = 0; j < a.disc.length; j++) {
        a.disc[j].emissiveIntensity = emissive;
        a.halo[j].opacity = halo;
      }
    }
  }

  /**
   * Blinks the flashing kinds. Runs every frame, but only for kinds that ask
   * for it, and writes ONE uniform per colour rather than per instance - the
   * materials are shared across every emeem of a kind, so a golden emeem
   * anywhere on the field flashes in step with every other one, which is what
   * makes it read as a signal rather than as scattered noise.
   *
   * Rectified sine, not a plain one: |sin| spends most of its time near the
   * bright end and snaps through the dark, so it reads as a BLINK rather than
   * a slow breathe. The halo never goes fully dark, or a golden emeem would
   * vanish for part of every cycle and you could run past one mid-blink.
   */
  function applyFlash(t) {
    for (let i = 0; i < KIND_LIST.length; i++) {
      const k = KIND_LIST[i];
      if (k.flashRate <= 0) continue;
      const a = art[k.id];
      if (a.baseHalo === undefined) continue;
      const w = Math.abs(Math.sin(t * k.flashRate));
      const halo = a.baseHalo * (1 - k.flashHalo + k.flashHalo * 2 * w);
      const emis = a.baseEmissive * (1 - k.flashEmissive + k.flashEmissive * 2 * w);
      for (let j = 0; j < a.disc.length; j++) {
        a.disc[j].emissiveIntensity = emis;
        a.halo[j].opacity = halo;
      }
    }
  }

  // ----------------------------------------------------------- runner motion

  /**
   * Chooses a heading for a blocked runner and commits to it for AVOID_HOLD
   * seconds, so it swerves once instead of stuttering left-right in a gap. The
   * side is chosen by testing both, which costs at most two extra queryAABB
   * calls and only on the frames where it is actually about to hit something.
   */
  function probeSteer(e, k, want, world, px, pz) {
    const bp = e.basePos;
    e.avoidT = 0;

    // PROPS FIRST, ALWAYS. A prop is geometry the runner cannot pass through;
    // an amaam is only somewhere it would rather not sit. Checking the hazard
    // first and returning on it - which is what this did originally - meant a
    // runner near an amaam never looked at the tree it was about to bolt into,
    // and 1.2% of sampled fleeing runners were found inside a trunk's footprint.
    const reach = PROBE_AHEAD + k.speed * 0.12;
    const blocked = pathBlocked(world, bp.x, bp.z, want, reach, k);

    if (!blocked) {
      // The way ahead is clear, so the hazard gets its say: a runner parked on
      // an amaam is a prize you cannot take without paying for it.
      for (let i = 0; i < amaamList.length; i++) {
        const b = amaamList[i].basePos;
        const dx = bp.x - b.x;
        const dz = bp.z - b.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < AMAAM_AVOID_R2 && d2 > 1e-6) {
          const away = Math.atan2(dx, dz); // straight away from it
          // ...but never into a prop. If the escape is blocked, stay put and
          // let the next probe find a way out.
          if (!pathBlocked(world, bp.x, bp.z, away, reach, k)) {
            e.avoidAng = away;
            e.avoidT = AVOID_HOLD;
          }
          return;
        }
      }
      return;
    }

    // Blocked. Prefer the side that also keeps it away from the player, so a
    // cornered runner breaks past you rather than into you - that is the moment
    // that makes cutting one off feel earned.
    const toPlayer = Math.atan2(px - bp.x, pz - bp.z);
    const first = wrapPi(want + PROBE_TURN - toPlayer);
    const second = wrapPi(want - PROBE_TURN - toPlayer);
    const a1 = Math.abs(first) >= Math.abs(second) ? want + PROBE_TURN : want - PROBE_TURN;
    const a2 = a1 === want + PROBE_TURN ? want - PROBE_TURN : want + PROBE_TURN;

    if (!pathBlocked(world, bp.x, bp.z, a1, reach, k)) {
      e.avoidAng = a1;
      e.avoidT = AVOID_HOLD;
      return;
    }
    // Both flanks shut: turn round. Cornered against a trunk with the player
    // closing is exactly the situation the runner is supposed to lose.
    e.avoidAng = pathBlocked(world, bp.x, bp.z, a2, reach, k) ? want + Math.PI : a2;
    e.avoidT = AVOID_HOLD;
  }

  /**
   * One runner, one step. Drifts when calm, bolts when you close, turns no
   * faster than turnRate, stays inside its tether, stays out of props, and
   * stays flat on the ground plane.
   *
   * `d2` is its squared horizontal distance to the player, already computed by
   * the caller for the despawn test.
   */
  function stepRunner(e, k, dt, t, px, pz, d2, world) {
    const bp = e.basePos;
    const alarmed = d2 < k.fleeR2;

    // 1. What it would like to do.
    let want;
    if (alarmed) {
      want = Math.atan2(bp.x - px, bp.z - pz);      // directly away from you
    } else {
      // A slow sinusoidal meander around the heading it was born with. Cheap,
      // deterministic per entry, and it never wanders off in a straight line.
      want = e.wanderBase + Math.sin(t * 0.37 + e.phase) * 1.7;
    }

    // 2. An in-flight swerve overrides that, then decays.
    e.probe -= dt;
    if (e.probe <= 0) {
      e.probe = alarmed ? PROBE_FLEE : PROBE_CALM;
      probeSteer(e, k, want, world, px, pz);
    }
    let swerving = false;
    if (e.avoidT > 0) {
      e.avoidT -= dt;
      want = e.avoidAng;
      swerving = true;
    }

    // 3. The tether gets the last word, so it can never leave the field - but
    //    only ever most of it. At full authority a runner far from home and
    //    pressed against a trunk would be steered straight back into the trunk
    //    it had just decided to go around, and "does not run through props" has
    //    to hold even in the corner case. Capped like this the swerve wins the
    //    AVOID_HOLD (0.32s) it lasts and the tether wins everything after it.
    const hx = e.homeX - bp.x;
    const hz = e.homeZ - bp.z;
    const hd2 = hx * hx + hz * hz;
    if (hd2 > TETHER_R * TETHER_R) {
      const hd = Math.sqrt(hd2);
      let w = Math.min(1, (hd - TETHER_R) / TETHER_SPAN);
      if (swerving && w > 0.35) w = 0.35;
      want += wrapPi(Math.atan2(hx, hz) - want) * w;
    }

    // 4. Turn toward it at a finite rate. THIS is what makes a runner catchable:
    //    it cannot reverse on the spot, so a player who reads the arc and cuts
    //    across it beats a player who chases the tail.
    const turn = wrapPi(want - e.heading);
    const maxTurn = k.turnRate * dt;
    e.heading = wrapPi(e.heading + (turn > maxTurn ? maxTurn : (turn < -maxTurn ? -maxTurn : turn)));

    // 5. Ease into the bolt rather than snapping to it, so the moment it
    //    notices you is legible.
    const target = alarmed ? k.speed : k.wanderSpeed;
    e.speed += (target - e.speed) * (1 - Math.exp(-6 * dt));

    // Inside the magnet it goes limp, and the closer it gets the limper, so the
    // pincer wins the tug-of-war instead of fighting the flee for a full second.
    let damp = 1;
    if (d2 < MAGNET_R2) damp = Math.sqrt(d2) / MAGNET_R;

    const step = e.speed * dt * damp;
    const nx = bp.x + Math.sin(e.heading) * step;
    const nz = bp.z + Math.cos(e.heading) * step;
    // RUNNERS DO NOT SWIM. Nothing else stops them: a fleeing runner steers by
    // heading alone, with no collider on open water to cut its arc - so it
    // would wander onto the lake and sit there as the highest-value prize in
    // the game (+3), reachable by boat at 8.6 m/s and by nothing else. A lake
    // is meant to cost you scoring time, not be the best place to farm.
    // Turning it back is enough; a reflection is not needed, because the
    // heading is re-planned every frame anyway.
    if (world && world.waterAt && world.waterAt(nx, nz) > 0) {
      e.heading += Math.PI;
      e.avoidT = Math.max(e.avoidT || 0, 0.35);
    } else {
      bp.x = nx;
      bp.z = nz;
    }
    // Pinned to the ground plane. Skipped inside the magnet radius, where the
    // magnet owns the height and is lifting it into the claw.
    if (d2 >= MAGNET_R2) {
      bp.y = (world ? world.sampleGroundY(bp.x, bp.z) : CONFIG.world.groundY) + k.hoverY;
    }
  }

  // ------------------------------------------------------------------- update

  function update(dt, c) {
    const s = (c && c.state) || ctx.state;
    const world = (c && c.world) || ctx.world;

    if (!seeded) seed(s, world);
    applyDread(s.dread);
    applyFlash(s.time);

    const px = s.player.pos.x;
    const py = s.player.pos.y; // FEET
    const pz = s.player.pos.z;
    const t = s.time;
    // Runners freeze the moment the run is over. main.js keeps calling update()
    // after a death so the pickup you dived for finishes its animation; a field
    // of prizes scattering behind the game-over card is not part of that.
    const simulate = s.phase === 'playing';

    const gp = s.player.grabPoint;
    const gx = gp ? gp.x : px;
    const gy = gp ? gp.y : py + E.hoverY;
    const gz = gp ? gp.z : pz;

    // Nearest reachable PRIZE, for the hand's reach-and-grab. We are already
    // walking the whole pool and computing each horizontal distance for the
    // magnet and pickup, so tracking the minimum costs one compare per entry
    // and saves player.js from doing the same sweep a second time.
    //
    // Amaams are excluded on purpose and it is not a detail: player.js opens
    // the claw at whatever this points to, and a hand reaching lovingly for the
    // thing that costs you two points would be teaching the exact opposite of
    // what the amaam exists to teach.
    let nearD2 = Infinity;
    let nearE = null;

    for (let i = 0; i < POOL_SIZE; i++) {
      const e = pool[i];
      const k = e.kind;

      // --- collect animation ------------------------------------------------
      if (e.pop > 0) {
        e.pop -= dt;
        if (e.pop <= 0) {
          e.pop = 0;
          e.mesh.visible = false;
          e.glow.visible = false;
          e.mesh.scale.setScalar(1);
          continue;
        }
        const p = 1 - e.pop / k.popTime;
        if (k.prize) {
          // A small flare, then crushed out of existence - NOT a bloom-and-float.
          // It was just pinched; it should die in the claw.
          e.mesh.scale.setScalar((1 + 0.5 * p) * (1 - p * p));
          // Ride the pincer while it is being crushed, so the catch reads as the
          // hand taking it rather than the prize escaping upward.
          if (gp) {
            const kk = 1 - Math.exp(-20 * dt);
            e.mesh.position.x += (gx - e.mesh.position.x) * kk;
            e.mesh.position.y += (gy - e.mesh.position.y) * kk;
            e.mesh.position.z += (gz - e.mesh.position.z) * kk;
          } else {
            e.mesh.position.y += dt * 1.6;
          }
          e.mesh.quaternion.setFromAxisAngle(AXIS_Y, t * k.spinSpeed * 4 + e.phase).multiply(k.tiltQ);
          e.glow.position.copy(e.mesh.position);
          e.glow.scale.setScalar(k.glowScale * (1 + 1.6 * p) * (1 - p * p * p));
        } else {
          // A DULL COLLAPSE. No flare, no flight, no ride into the claw: the
          // amaam is not taken, it burst on you. It spreads, flattens to a
          // smear and sinks into the ground while its ring shuts inward. The
          // difference from a prize is legible in the first two frames, which
          // is all the time a fleeing player has to notice it.
          e.mesh.scale.set(1 + 0.62 * p, Math.max(0.03, 1 - p * 1.7), 1 + 0.62 * p);
          e.mesh.position.set(
            e.basePos.x,
            e.basePos.y - k.hoverY * 1.25 * p * p,
            e.basePos.z,
          );
          // Keeps lolling as it goes down, slower and slower - it deflates.
          e.mesh.quaternion
            .setFromAxisAngle(AXIS_Y, t * k.spinSpeed + e.phase)
            .multiply(k.tiltQ);
          e.glow.position.copy(e.mesh.position);
          e.glow.scale.setScalar(k.glowScale * (1 - p) * (1 - 0.5 * p));
        }
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

      // --- the runner decides where it is going ------------------------------
      if (k.moves && simulate) {
        stepRunner(e, k, dt, t, px, pz, d2, world);
        dx = px - bp.x;
        dz = pz - bp.z;
        d2 = dx * dx + dz * dz;
      }

      // Vertical eligibility gates the magnet, the pickup AND the reach, so a
      // collectible on the ground is neither dragged up to, nor taken by, a
      // player standing on a tall block.
      const rel = bp.y - py;
      const reachable = rel > k.pickYMin && rel < k.pickYMax;

      // `simulate` gates BOTH the magnet and the pickup below. main.js keeps
      // calling update() after a death purely so the pop and the burst finish
      // playing - that is not a licence to keep scoring. Without the gate a
      // prize sitting between pickR (1.25m) and magnetR (2.4m) at the instant
      // you were caught is quietly vacuumed into the dead hand over the next
      // few frames and taken: AFTER hud.showGameOver() captured the run total
      // and AFTER main.js wrote state.best to localStorage. The card then
      // disagrees with the live HUD counter still ticking behind it, the point
      // is lost from `best`, stats.emeems overcounts the run, and a tier
      // crossed on that phantom point fires a levelup banner and a camera
      // shake across the game-over scrim. The nearest-prize publish below is
      // deliberately left ungated, so the hand keeps reaching for whatever it
      // died next to instead of relaxing the moment you are caught.
      if (simulate && k.magnetic && reachable && d2 < MAGNET_R2) {
        const d = Math.sqrt(d2);
        // Pull toward the PINCER, not the player origin: a prize drawn to the
        // body centre ends up hovering over the palm, which looks like it is
        // being absorbed rather than picked up. The pickup test below still uses
        // distance to the player, so this changes only what the eye sees.
        // Ease strengthens toward the centre so the pull snaps rather than
        // creeping. exp() form is frame-rate independent: same feel at 60 and
        // 120fps, which matters because this phone can run either.
        const ease = 1 - d / MAGNET_R;
        const kk = 1 - Math.exp(-E.magnetStrength * ease * dt);
        bp.x += (gx - bp.x) * kk;
        bp.z += (gz - bp.z) * kk;
        // Rise to the pincer's height, so a mid-jump catch flies up into the
        // pinch instead of clipping through the wrist.
        bp.y += (gy - bp.y) * kk;
        dx = px - bp.x;
        dz = pz - bp.z;
        d2 = dx * dx + dz * dz;
      }

      // Post-magnet distance, so the claw tracks where the prize is being
      // pulled to rather than where it started the frame.
      if (k.prize && reachable && d2 < nearD2) { nearD2 = d2; nearE = e; }

      // --- caught it (or walked into it) ------------------------------------
      // Gated on `simulate` for the reason spelled out at the magnet above: the
      // run is over, so nothing may still be scored, shaken or tiered up.
      if (simulate && reachable && d2 < k.pickR2) {
        // Commit this frame's motion first: collect() reads the mesh position
        // for the burst and for the 'collect' payload, and a stale one would
        // put the flash a frame behind the thing you just touched.
        let w = Math.sin(t * k.bobSpeed + e.phase);
        if (k.heavyBob) w = 0.62 * w + 0.38 * (w * w - 0.5);
        e.mesh.position.set(bp.x, bp.y + w * k.bobHeight, bp.z);
        collect(e, s);
        continue;
      }

      // --- idle: bob, precess, halo pulse ----------------------------------
      // Asymmetric for an amaam: the squared term makes it hang low and heave
      // up briefly, where a prize rides an even sine. Heavier, and out of step
      // with everything else on the field.
      let w = Math.sin(t * k.bobSpeed + e.phase);
      if (k.heavyBob) w = 0.62 * w + 0.38 * (w * w - 0.5);
      // A fleeing runner bounces higher. Amplitude only - the bob RATE is a
      // constant per kind, because changing it would move sin(t * rate) by
      // whole radians once `t` is minutes deep.
      const amp = k.moves ? k.bobHeight * (0.8 + 0.85 * (e.speed / k.speed)) : k.bobHeight;
      const y = bp.y + w * amp;
      e.mesh.position.set(bp.x, y, bp.z);

      /**
       * The disc is rotationally symmetric about its own axis, so spinning it
       * about that axis is invisible. Instead each kind is tilted off vertical
       * by its own angle and the tilted disc spins about WORLD Y: the face
       * precesses, sweeping toward and away from the camera and catching the
       * sun's specular once per revolution. That flash is what makes a prize
       * findable in peripheral vision - and the amaam's lurching, half-speed,
       * steeply-lolled version of it is what makes the amaam look ill.
       */
      let ang = t * k.spinSpeed + e.phase;
      if (k.lurch) ang += k.lurch * Math.sin(t * 1.3 + e.phase);
      e.mesh.quaternion.setFromAxisAngle(AXIS_Y, ang).multiply(k.tiltQ);

      e.glow.position.set(bp.x, y, bp.z);
      // Halo breathes out of phase with the bob: cheap life, no cost. The rate
      // and depth are the kind's signature - a gentle emeem breath, a fast
      // runner twinkle, a slow heavy amaam warning.
      e.glow.scale.setScalar(
        k.glowScale * (1 + k.haloPulse * Math.sin(t * k.haloRate + e.phase)),
      );
    }

    // --- publish the nearest PRIZE for the claw ---------------------------
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
        const p = 1 - b.life / b.time;
        if (b.mode === BURST_COLLAPSE) {
          // Hangs, then crushes: p*p starts slow and finishes fast, which is
          // what a thing caving in looks like. It sinks, and it never gets
          // brighter than half - a prize flashes, a mistake smothers.
          b.sprite.scale.setScalar(b.from + (b.to - b.from) * p * p);
          b.sprite.position.y -= dt * 0.55;
          b.mat.opacity = (1 - p) * 0.5;
        } else {
          // sqrt(p) expands fast then settles; (1-p)^2 fades slow then fast.
          b.sprite.scale.setScalar(b.from + (b.to - b.from) * Math.sqrt(p));
          b.sprite.position.y += dt * 0.9;
          b.mat.opacity = (1 - p) * (1 - p) * 0.95;
        }
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
    activeCount = 0;      // retire() already decremented, but never trust drift
    amaamList.length = 0; // ...and neither does the hazard list
    for (let i = 0; i < POOL_SIZE; i++) pool[i].listIdx = -1;
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
