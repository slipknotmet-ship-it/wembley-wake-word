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
    turnLerp: 14,          // how fast the hand swings to face travel direction
    spawnHeight: 2.0,
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
    obstaclesPerChunkBase: 5,
    obstaclesPerChunkPerLevel: 2.2,
    obstaclesPerChunkMax: 22,
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
    radius: 0.42,
    pickupRadius: 1.25,    // generous: this is a phone, not a mouse
    perChunk: 4,           // target emeems alive per streamed chunk
    bobHeight: 0.28,
    bobSpeed: 2.1,
    spinSpeed: 1.4,
    hoverY: 0.95,
    magnetRadius: 2.4,     // emeems drift toward you inside this radius
    magnetStrength: 7.0,
    respawnDelay: 0.6,
  },

  // --------------------------------------------------------------- monster
  monster: {
    spawnDistance: 34,     // metres behind the player at game start
    minSpawnDistance: 22,
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
    groundCalm: 0x6fbf73,
    groundDread: 0x3a2430,
    obstacleCalm: 0x8d7b68,
    obstacleDread: 0x4a3340,
    sunCalm: 0xfff4d6,
    sunDread: 0xff5a3c,
    // Emeems come in candy-button colours.
    emeems: [0xff4d5a, 0xffb43d, 0x3ddc84, 0x4da3ff, 0xc46bff, 0xfff06b],
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
