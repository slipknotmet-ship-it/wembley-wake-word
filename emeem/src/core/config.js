/**
 * EMEEM - central tuning file.
 * Every magic number in the game lives here so the whole feel can be tuned
 * from one place. Units are metres and seconds.
 */
export const CONFIG = {
  // ---------------------------------------------------------------- player
  player: {
    radius: 0.45,          // horizontal collision capsule radius
    height: 1.5,           // capsule height (feet -> top of hand)
    walkSpeed: 7.2,        // m/s on the ground
    airControl: 0.55,      // fraction of ground accel usable mid-air
    accel: 55,             // m/s^2 toward the desired velocity
    friction: 12,          // ground damping when no input
    jumpVelocity: 8.4,     // m/s launched on jump
    gravity: -24,          // m/s^2
    maxFallSpeed: -38,
    coyoteTime: 0.12,      // grace period to jump after leaving ground
    jumpBuffer: 0.15,      // grace period to buffer a jump before landing
    /**
     * Fraction of walking speed shed at full reach. The hand slows as it
     * commits to a grab, which is what buys the reach enough time to read
     * without widening the trigger radius.
     *
     * This is a GAMEPLAY change, not just an animation one: stopping to take an
     * emeem now costs you ground on the Protector, so a greedy grab in front of
     * him is a real decision rather than a free one.
     */
    reachSlowdown: 0.38,
    turnLerp: 14,          // how fast the hand swings to face travel direction
    spawnHeight: 2.0,
    // Claw animation. The open is a slow deliberate reach; the snap is fast,
    // because a grab that closes as slowly as it opens reads as a yawn.
    // Measured across eight real catches, the reach lasted 183ms to 1900ms
    // (mean 667). The short ones read as a twitch rather than a reach. Eased
    // from 13 to 7 so the pose comes in deliberately; the time to complete it
    // comes from reachSlowdown below, not from a wider trigger radius, because
    // widening the radius would leave the hand permanently lifted and the
    // five-finger walk would never be seen.
    reachOpenRate: 7.0,    // how fast the claw spreads as an emeem nears
    pinchSnapRate: 34.0,   // how fast it slams shut on the catch
    pinchHoldTime: 0.26,   // seconds the claw stays clamped after a catch
    // Height of the pincer above the feet once the hand has lifted. The grab
    // point tracks from emeem.hoverY up to this as the reach builds, so an
    // emeem is drawn up into the raised claw instead of to the ground.
    pinchHeight: 0.96,
    // Snap shut fast, hold, then release SLOWLY. Equal rates in both
    // directions read as a twitch rather than as a grab.
    pinchReleaseRate: 3.4, // how fast it relaxes back to neutral afterwards
  },

  // ---------------------------------------------------------------- camera
  camera: {
    fov: 68,
    near: 0.1,
    far: 260,
    // Pulled in from 8.5/4.2 after looking at a real render: at ~9.5m out the
    // hand was 4% of screen height, which is a speck on a 6.9" phone. ~6m out
    // puts it near 15% and still shows enough road ahead to dodge.
    distance: 5.4,         // metres behind the player
    height: 2.9,           // metres above the player
    lookAhead: 3.4,        // metres in front of the player to aim at
    followLerp: 6.5,       // positional smoothing
    lookLerp: 9.0,         // aim smoothing
    shakeDecay: 5.0,
  },

  // ----------------------------------------------------------------- world
  world: {
    chunkSize: 32,         // metres per square chunk
    viewChunks: 3,         // chunk radius streamed around the player
    groundY: 0,
    // Obstacle density ramps with the threat level (see levels below).
    obstaclesPerChunkBase: 7,
    obstaclesPerChunkPerLevel: 2.6,
    obstaclesPerChunkMax: 26,
    /**
     * Relative mix of forest props. Trees are the tall things you must go
     * around, rocks the low things you can hop, bushes the soft clutter that
     * breaks up sightlines without ever blocking a route.
     */
    propMix: { tree: 0.44, rock: 0.26, bush: 0.30 },
    obstacleMinSize: 1.1,
    obstacleMaxSize: 4.2,
    obstacleMaxHeight: 6.0,
    // Keeps the immediate spawn area clear so you never start inside a rock.
    spawnClearRadius: 7,
    fogNear: 26,
    fogFar: 150,
  },

  // ---------------------------------------------------------------- emeems
  emeem: {
    // 0.42 made an 84cm disc - nearly as wide as the hand itself, which only
    // became obvious once they sat on the ground beside the character rather
    // than floating above it. This is a thing you pick up, so it is small.
    // Gameplay is unaffected: pickupRadius is what you actually catch with.
    radius: 0.22,
    pickupRadius: 1.25,    // generous: this is a phone, not a mouse
    // Density, as emeems per chunkSize^2 of ground. At 4 this worked out to one
    // emeem every 16 metres, which for a game about catching as many as you can
    // meant an almost empty field - two visible in a whole screenshot. 14 puts
    // roughly 80 in the streamed ring, one every ~8.5m, so there is always one
    // worth breaking your line for without them carpeting the ground.
    perChunk: 14,          // target emeems alive per streamed chunk
    bobHeight: 0.28,
    bobSpeed: 2.1,
    spinSpeed: 1.4,
    // Low enough that the hand dips its pincer DOWN to take one, the way you
    // would actually pick something up. At 0.95 they floated above the palm
    // (which stands at 0.615m) and the claw had to reach upward, which read as
    // swatting rather than pinching.
    hoverY: 0.34,
    magnetRadius: 2.4,     // emeems drift toward you inside this radius
    magnetStrength: 7.0,
    respawnDelay: 0.6,
    // The claw starts opening this far out, so the hand visibly reaches for an
    // emeem before it takes it. Must be comfortably wider than magnetRadius or
    // the anticipation has no room to play before the pickup fires.
    reachRadius: 5.2,

    /**
     * The three things you can pick up. `weight` is the relative spawn chance,
     * `points` what taking one does to your score.
     *
     * The whole risk of the game lives in this table: an amaam is BIG, which
     * makes it the easiest thing on the field to hit by accident, and it is the
     * only thing that can take points off you. A runner is small, fast and
     * rare, so it is the only thing worth breaking your line for while
     * something is chasing you.
     */
    kinds: {
      emeem: {
        points: 1,
        radius: 0.22,
        weight: 0.72,
        pickupRadius: 1.25,
        glow: 7.5,
      },
      runner: {
        points: 3,
        radius: 0.15,
        weight: 0.11,
        // Smaller AND faster, so the generous pickup radius is what keeps it
        // catchable at all on a phone.
        pickupRadius: 1.15,
        glow: 9.5,
        speed: 4.2,          // m/s when it bolts
        wanderSpeed: 1.1,    // m/s drifting when it has not seen you
        fleeRadius: 7.0,     // starts running at this distance
        turnRate: 3.4,       // rad/s - it cannot turn instantly, so it can be cornered
      },
      amaam: {
        points: -2,
        radius: 0.40,
        weight: 0.17,
        // Deliberately larger than its own body: an amaam should feel like
        // something you have to actively steer AROUND, not something you brush.
        pickupRadius: 1.45,
        glow: 5.0,
      },
    },
  },

  // --------------------------------------------------------------- monster
  monster: {
    // Where the Protector comes from at the whistle. It used to start 34m
    // BEHIND you - and the camera sits only 5.4m behind, so it began off-screen
    // and then entered frame from the bottom facing away up the screen, which
    // meant you only ever saw its back. It now arrives from a top corner,
    // walking at you, so the first thing you see is its face.
    spawnDistance: 30,     // metres from the player at game start
    minSpawnDistance: 24,  // closest the obstacle sweep may place it instead
    /**
     * Radians off straight-ahead (-Z, up the screen), swung to a randomly
     * chosen side each run. 0.70 rad = 40 degrees.
     *
     * Chosen by projecting it: the camera's horizontal half-angle is
     * atan(tan(fov/2) * aspect) = 55.6 degrees at 1040x480 and 50.2 at the
     * iPhone SE's 667x375. At 30m and 40 degrees the creature lands 47% of the
     * way to the frame edge on the S25 Ultra and 57% on the SE - upper corner
     * on every screen the suite runs, and comfortably inside the frustum on
     * the widest one rather than clipped off the side of the narrowest.
     */
    spawnAngle: 0.70,
    /**
     * Which side it comes from: 0 rolls a coin every run, -1 or +1 forces it.
     * Forcing exists for the test suite. A random side makes every
     * monster-distance assertion non-deterministic - the scripted bot walks a
     * fixed path, so whether it walks toward the Protector or away from it
     * decides the result, and the same check passed at 18.8m and failed at
     * 6.2m on consecutive runs of identical code. Tests pin the side; the game
     * never does.
     */
    spawnSide: 0,
    catchRadius: 1.35,
    baseSpeed: 4.6,        // m/s at level 0 (slower than the player)
    turnRate: 3.2,         // rad/s steering
    baseScale: 1.0,
    heightOffset: 0.0,
    // Monster loses a little ground when it clips an obstacle, which is what
    // makes weaving through the world an actual strategy.
    obstacleSlowdown: 0.55,
    stuckUnstickForce: 6.0,
    roarInterval: 9.0,     // seconds between roars at level 0
    roarIntervalMin: 3.0,
  },

  /**
   * Threat levels. The monster steps up a tier every time your score crosses
   * a threshold: faster, bigger, redder, and the world gets more cluttered.
   * `dread` (0..1) drives fog colour, lighting and audio intensity.
   */
  levels: [
    { score: 0,   speed: 4.6, scale: 1.00, dread: 0.00, name: 'Watching' },
    { score: 5,   speed: 5.4, scale: 1.10, dread: 0.14, name: 'Stirring' },
    { score: 12,  speed: 6.1, scale: 1.22, dread: 0.28, name: 'Hunting' },
    { score: 22,  speed: 6.7, scale: 1.36, dread: 0.42, name: 'Furious' },
    { score: 35,  speed: 7.3, scale: 1.52, dread: 0.56, name: 'Ravenous' },
    { score: 50,  speed: 7.9, scale: 1.70, dread: 0.70, name: 'Nightmare' },
    { score: 70,  speed: 8.5, scale: 1.90, dread: 0.84, name: 'Devourer' },
    { score: 95,  speed: 9.2, scale: 2.10, dread: 1.00, name: 'THE END' },
  ],

  // ------------------------------------------------------------------ look
  palette: {
    // Calm -> dread. renderer.js lerps between these by `dread`.
    skyCalm: 0x8ec5ff,
    skyDread: 0x1a0508,
    fogCalm: 0xbfe0ff,
    fogDread: 0x2a0409,
    // Forest floor: leaf litter and moss, not lawn.
    groundCalm: 0x4a6b3f,
    groundDread: 0x2a1c22,
    // Bark.
    obstacleCalm: 0x6b5240,
    obstacleDread: 0x3a2830,
    // Foliage - canopies and bushes. Darkens harder than the ground so the
    // forest closes in visibly as the Protector escalates.
    foliageCalm: 0x3f7a3a,
    foliageDread: 0x241a24,
    // Stone.
    rockCalm: 0x8a8a86,
    rockDread: 0x453a42,
    sunCalm: 0xfff4d6,
    sunDread: 0xff5a3c,
    /**
     * Emeem tones, spanning the natural range from very pale pink through rose
     * and tan to deep brown. A tone is picked at random each time an emeem
     * spawns, so a field always shows the whole spread rather than a run of
     * near-identical ones.
     *
     * Each tone tints the whole collectible; the raised tip is the same tone
     * darkened by emeemTipShade, baked into the mesh as a vertex colour so the
     * two-tone read costs no extra draw call. The shade is deliberately mild -
     * at the dark end of this list a heavier one crushes the tip to black.
     */
    emeems: [
      0xf2c4b3, // pale pink
      0xe8a894, // pale rose
      0xd98c76, // rose
      0xc4705a, // warm tan
      0xa85e48, // light brown
      0x8a4835, // medium brown
      0x6b3527, // deep brown
      0x4a241a, // darkest brown
    ],
    emeemTipShade: 0.78,

    /**
     * Runner tones: paler and hotter than a normal emeem so a moving speck
     * still reads as treasure at forty metres through fog.
     */
    runners: [0xfff0d8, 0xffe0b0, 0xffd28f],
    /**
     * Amaam tones: sickly, desaturated and cold against a warm palette. The
     * point is that you can tell one from an emeem in peripheral vision while
     * sprinting, so the difference is HUE, not size - size only tells you once
     * it is already too close to avoid.
     */
    amaams: [0x6f7a52, 0x5c6b48, 0x7d8352],
    amaamTipShade: 0.62,
    hand: 0xf6c9a8,
    handShadow: 0xd9a483,
    monster: 0x2b1220,
    monsterEye: 0xff2b1a,
  },

  // --------------------------------------------------------------- feature
  render: {
    maxPixelRatio: 2,      // S25U is 3.0+ DPR; cap it or we burn fill rate
    shadows: true,
    shadowMapSize: 1024,
    targetFps: 60,
    maxDelta: 0.05,        // clamp dt so a hitch can't tunnel us through walls
  },

  audio: { masterVolume: 0.55 },
};

/** Returns the level object for a given score. */
export function levelForScore(score) {
  const L = CONFIG.levels;
  let out = L[0];
  for (let i = 0; i < L.length; i++) if (score >= L[i].score) out = L[i];
  return out;
}

/** Returns the level index (0-based tier) for a given score. */
export function levelIndexForScore(score) {
  const L = CONFIG.levels;
  let idx = 0;
  for (let i = 0; i < L.length; i++) if (score >= L[i].score) idx = i;
  return idx;
}
