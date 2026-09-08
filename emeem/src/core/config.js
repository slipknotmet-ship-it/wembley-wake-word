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
    // The COLLIDER-BEARING budget. Raised because the near field was measurably
    // empty: the visible ground inside 15m of the player is 131 m^2, and at the
    // old density of 7 props per 32m chunk (0.006836/m^2) that is 0.90 props
    // TOTAL - less than one object. That is the "lawn" complaint, quantified.
    // Raising this alone cannot fix it (8 objects in 131 m^2 needs 63 props per
    // chunk, which would be a maze), so the fill comes from the collider-free
    // scatter pass below and this budget only has to stop the near field being
    // literally bare.
    obstaclesPerChunkBase: 11,
    obstaclesPerChunkPerLevel: 3.0,
    obstaclesPerChunkMax: 34,
    /**
     * Relative mix of forest props. Trees are the tall things you must go
     * around, rocks the low things you can hop, bushes the soft clutter that
     * breaks up sightlines without ever blocking a route.
     */
    propMix: { tree: 0.30, rock: 0.42, bush: 0.28 },
    /**
     * Collider-free clutter, per chunk, level-independent. Pebbles and ferns
     * merged into the SAME stone/foliage buffers as everything else, so they
     * cost triangles and no draw calls. This is what actually fills the near
     * field: 36 per chunk is 0.035/m^2, about 4.6 in the visible 131 m^2,
     * against 0.90 before.
     */
    scatterPerChunk: 36,

    /**
     * WHAT GROWS WHERE.
     *
     * One bundle per biome, indexed the same way palette.biomes is. A chunk
     * picks ONE of these - it is not a blend - because the species is rolled
     * before the position is drawn, because two of these introduce prop classes
     * the forest has no meaning for (a dune, a pylon), and because the
     * build-time guards below have to run over a finite set. The blend is
     * carried by the things that CAN be continuous: the ground tint is per
     * fragment, the scatter tint per position, and the chunk that flips is
     * chosen by a weighted coin rather than a threshold, so a boundary row is a
     * mix of chunks rather than a line.
     *
     * `mix` shares are normalised, so they need not sum to 1.
     * `tint` multiplies the baked vertex colours per material, which is how a
     * biome recolours its props without a fifth material.
     */
    biomes: [
      {
        // FOREST - the shipped world. Every number here reproduces it exactly.
        name: 'forest',
        mix: { tree: 0.44, rock: 0.26, bush: 0.30, fallen: 0, dune: 0, pylon: 0 },
        treeH: [8.0, 11.0], bareTrees: 0,
        rock: { cobble: 0.30, slab: 0.46, block: 0.24 },
        bushScale: 1, scatterMul: 1, pebbleShare: 0.45,
        tint: { bark: [1, 1, 1], leaf: [1, 1, 1], stone: [1, 1, 1] },
      },
      {
        // MOUNTAIN - rocks, bushes and fallen trees, and what trees are left
        // are stunted. Nothing grows tall at altitude.
        name: 'mountain',
        mix: { tree: 0.12, rock: 0.46, bush: 0.18, fallen: 0.24, dune: 0, pylon: 0 },
        treeH: [5.2, 7.4], bareTrees: 0.35,
        // Slabs and blocks over cobbles: this is scree and outcrop, not shingle.
        rock: { cobble: 0.22, slab: 0.44, block: 0.34 },
        bushScale: 0.85, scatterMul: 1.25, pebbleShare: 0.72,
        tint: { bark: [0.92, 0.90, 0.95], leaf: [0.78, 0.88, 0.80], stone: [1.06, 1.04, 1.02] },
      },
      {
        // BEACH - dunes, and little else standing. Everything bleached.
        name: 'beach',
        mix: { tree: 0.04, rock: 0.07, bush: 0.13, fallen: 0.08, dune: 0.68, pylon: 0 },
        treeH: [6.0, 8.5], bareTrees: 0.55,
        rock: { cobble: 0.62, slab: 0.30, block: 0.08 },
        // Marram grass: low, and there is a lot of it.
        bushScale: 0.62, scatterMul: 1.5, pebbleShare: 0.55,
        // The stone tint is what paints the DUNES, and it has to sit clearly
        // ABOVE the sand ground rather than beside it: the first cut landed on
        // rgb(196,182,141) against a ground of rgb(201,180,140), and a dune the
        // same colour as the beach is not a dune, it is nothing.
        // The foliage tint is marram grass, and it has to be VIOLENT on red.
        // It multiplies foliageCalm, whose green channel is four times its red
        // in linear space, so a gentle nudge just makes a slightly yellow
        // forest bush. Getting olive out of that needs a 4x on red alone.
        tint: { bark: [1.42, 1.30, 1.05], leaf: [4.20, 1.50, 2.20], stone: [1.62, 1.50, 1.18] },
      },
      {
        // CITY - standing slabs and rubble, with the odd dead pole still up.
        name: 'city',
        mix: { tree: 0.10, rock: 0.22, bush: 0.08, fallen: 0.05, dune: 0, pylon: 0.55 },
        treeH: [5.5, 8.0], bareTrees: 0.85,
        rock: { cobble: 0.52, slab: 0.36, block: 0.12 },
        bushScale: 0.7, scatterMul: 0.85, pebbleShare: 0.80,
        tint: { bark: [0.86, 0.86, 0.92], leaf: [0.70, 0.76, 0.72], stone: [1.02, 1.02, 1.10] },
      },
    ],

    /**
     * A FALLEN TREE. Length along its own axis, and trunk radius; the collider
     * is the log's AABB with its top at 2 * radius, which keeps every log under
     * rockHopCeiling and therefore hoppable by construction.
     */
    fallen: { len: [4.0, 9.0], radius: [0.22, 0.46] },
    /**
     * A DUNE. Wide and low: a ridge you hop rather than a wall you go round.
     * `top` stays clear of rockHopCeiling with the same margin the slabs use.
     */
    dune: { halfX: [3.6, 7.6], top: [0.62, 1.34] },
    /**
     * A CITY PYLON. Tall enough that it is never hoppable and never mistaken
     * for a rock, and spaced hard so a street is always walkable.
     */
    pylon: { half: [1.1, 2.4], height: [4.5, 9.5], spacing: 3.6 },
    /**
     * Rocks come in three jobs and a rock's SIZE tells you which.
     *
     * COBBLE   - clutter, and NO collider: every height under the player's
     *            0.35m STEP_HEIGHT makes step-up teleport the hand up to 32cm
     *            in a single 8.3ms frame while the camera lags at followLerp
     *            6.5. That is the bob-up-and-over placeBush already refuses.
     * SLAB     - the platform. Landable from flat ground.
     * BLOCK    - the climb. NEVER landable from the ground (see rockHopCeiling),
     *            only from a slab, and wide enough that the landing is forgiving.
     */
    rock: {
      cobble: { share: 0.30, h: [0.16, 0.32], r: [0.34, 0.92] },
      slab:   { share: 0.46, h: [0.55, 1.40], r: [1.05, 1.75] },
      block:  { share: 0.24, h: [1.75, 2.30], r: [1.22, 1.60] },
    },
    /**
     * THE REAL HOP CEILING, and it is not JUMP_APEX.
     *
     * The 120Hz step integrates velocity first, so the discrete apex overshoots
     * the continuous v^2/2g by exactly v0*dt/2 = 8.4/240 = 0.035m: 1.505m, not
     * 1.470m, reached at step 42. Verified by running the real integrator.
     *
     * What actually decides whether you land ON a ledge rather than bump into
     * it is the horizontal query's SKIN: fillHorizontalBox sets min.y = wy +
     * 0.02, and queryAABB drops a box whose max.y is below that. So a ledge of
     * top T goes transparent - you sail over it - exactly when T < wy + 0.02,
     * and the largest wy a horizontal pass ever sees is the apex. Hence:
     *
     *     T < 1.505 + 0.02 = 1.525m
     *
     * A slab tops out at 1.40 (0.125 of margin), a block starts at 1.75 (0.225
     * of margin) so no floating-point edge can ever make one hoppable off flat
     * ground.
     */
    rockHopCeiling: 1.525,
    /**
     * Exponent of a symmetric U-shaped draw inside a class band. Below 1 pushes
     * rolls to the ENDS, so a rock is decidedly small or decidedly big and the
     * middling ones you cannot read at a glance are rare.
     * P(middle third) = 3^(-1/spread) = 13.6% against a uniform 33.3%.
     */
    rockSizeSpread: 0.55,
    /** Fraction of slabs that get a bush growing out of the top. */
    hummockShare: 0.30,
    /** Fraction of slabs that emit a deliberate block partner to climb onto. */
    stackShare: 0.34,
    obstacleMinSize: 1.1,
    obstacleMaxSize: 4.2,
    obstacleMaxHeight: 6.0,
    /**
     * Trees get their own height band, separate from obstacleMaxSize, because
     * the crown radius is now derived from the TREE's height rather than from
     * the generic prop half-size. Sharing one key pegged every crown above
     * ~7.5m to the same ceiling, which is what made 9.4% of trees wear an
     * identically-clamped canopy.
     */
    treeHeightMin: 8.0,
    treeHeightMax: 11.0,
    // Keeps the immediate spawn area clear so you never start inside a rock.
    spawnClearRadius: 7,
    /**
     * Fraction of walking speed kept while wading. 0.25 -> 1.80 m/s.
     *
     * The floor is pinned by the swim multiplier: the Protector must catch a
     * wader at EVERY tier, or water is a free escape and the canoe is
     * decoration. At the lowest tier it swims 4.6 * 0.72 = 3.31 m/s, so a wader
     * has to be slower than that. 0.45 (3.24 m/s) left 0.07 m/s of margin and
     * 0.40 (2.88) left 0.43 - enough to satisfy the rule and, in play, not
     * enough to FEEL it. At 0.40 the lake was survivable on foot at the bottom
     * two tiers: 23s of wading, and you came out 11.6m ahead.
     *
     * 0.25 makes deep water a place you do not go without a boat at any tier -
     * the Protector swims between 1.8x and 3.7x a wader's pace, so a crossing
     * on foot is not a slow escape, it is a death. The shallows are barely
     * touched (the slow scales with depth, and a mooring sits at 0.2 wet, which
     * is 6.2 m/s), so walking the shore to reach a canoe stays quick. That is
     * the decision the lake is meant to pose: find a boat, or go around.
     */
    waterSpeedMul: 0.25,
    /**
     * The Protector's speed multiplier while swimming.
     *
     * Bounded from ABOVE and BELOW, and both bounds are real.
     *
     * The ceiling is 1 - 0.45p. Open water has no obstacles, so the creature
     * runs a clean line there while on land it is braked to obstacleSlowdown
     * (0.55) for a measured fraction p of the time - 0.049 at Watching rising
     * to 0.495 at THE END. Anything above 0.777 would make it FASTER in the
     * water than out of it at the top tiers, which is the opposite of the rule.
     *
     * The floor is the wader. It has to catch someone on foot at every tier or
     * water is a free escape and the canoe is decoration: 4.6 * f > 1.80 gives
     * f > 0.391.
     *
     * 0.72 sat right under the ceiling, so the water barely slowed it. 0.55 is
     * near the middle of (0.391, 0.777): it swims at 2.53 m/s at Watching and
     * 5.06 at THE END, visibly labouring against its own land speed, and still
     * 1.4x a wader at the gentlest tier.
     */
    swimFactor: 0.55,
    /**
     * THE BOAT.
     *
     * It cannot be balanced by geometry, and that is the whole design. On open
     * water the Protector's steering degenerates to pure pursuit, so a boat
     * holding a minimum-radius circle settles at a steady separation of about
     * 2.2m at the top tier - outside its 1.35m reach. A boat that can circle is
     * therefore uncatchable at EVERY tier, and no turn rate fixes it: forcing
     * the separation inside the catch radius at 8.6 m/s would need a 5.4 rad/s
     * turn, which is not a boat.
     *
     * So the bound is a FINITE RESOURCE. The hull drains at one flat rate the
     * moment you board. A crossing takes 8.9s including acceleration, costing
     * 0.67 of the hull - 33% of margin for a fumbled heading - and the hull is
     * gone after 13.3s no matter what you do with it. Crossing and returning
     * needs 1.34 and is impossible by construction, so a lake is one-way.
     *
     * When it swamps you are ejected into open water wading at 2.88 m/s with a
     * swimmer closing at 3.31 to 6.62. That is the actual danger; the boat is
     * only ever a 12-25m head start, and honestly not more.
     */
    boat: {
      speed: 8.6,
      accel: 6.0,
      decel: 4.0,
      turnRate: 1.9,      // rad/s. Walking turns instantly; a boat does not.
      boardRadius: 2.2,
      drain: 0.075,       // hull per second aboard -> 13.3s of water, ever
      deckLift: 0.45,     // visual only: the hand rides above the waterline
      hopOut: 1.2,        // metres of hop when you jump off
    },
    fogNear: 26,
    /**
     * 112, down from 150. viewChunks 3 guarantees only 96m of streamed ground
     * (3 * 32); past that a chunk may or may not exist yet, and an 11m tree
     * materialising at that seam is far more visible than a 6m one was. At 150
     * the pop showed at 43.5% contrast; at 112 the fog factor at 96m is
     * (96-26)/(112-26) = 0.814, so the same pop shows at 18.6%.
     * Raise this ONLY together with viewChunks: fogFar <= viewChunks * chunkSize * 1.17.
     */
    fogFar: 112,
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
    // 18, not 14: perChunk is a DENSITY (per chunkSize^2), and the live count
    // is that density times the ring area - which fogFar 112 shrank from
    // PI*(45^2-12^2) = 5909 m^2 to PI*(33.6^2-12^2) = 3094 m^2. Holding 14
    // would have left 42 emeems alive against today's 81. 18 gives 54, which
    // keeps the SCREEN as full as it is now inside the shorter draw distance.
    perChunk: 18,          // target emeems alive per streamed chunk
    bobHeight: 0.28,
    bobSpeed: 2.1,
    spinSpeed: 1.4,
    // Low enough that the hand dips its pincer DOWN to take one, the way you
    // would actually pick something up. At 0.95 they floated above the palm
    // (which stands at 0.615m) and the claw had to reach upward, which read as
    // swatting rather than pinching.
    hoverY: 0.34,
    /**
     * Fraction of ordinary emeems that spawn ON TOP of a prop instead of on the
     * ground. Slabs and blocks only - a cobble carries no collider and a trunk
     * collider runs the tree's whole 8-11m, so both are excluded for free by
     * the perch height test rather than by a special case.
     */
    perchShare: 0.22,
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
        // 0.52, up from 0.40. The amaam no longer wears an aura, so SIZE is the
        // whole warning and it has to carry the read on its own: 2.36x an
        // emeem's width and 5.6x its plan area, which is unmistakable at a
        // glance rather than merely measurable with a ruler.
        radius: 0.52,
        weight: 0.17,
        // Deliberately larger than its own body: an amaam should feel like
        // something you have to actively steer AROUND, not something you brush.
        // Grown with the body so the margin past the visible edge is preserved
        // (1.45 - 0.40 = 1.05 of reach beyond the rim; 1.57 - 0.52 keeps it).
        pickupRadius: 1.57,
        glow: 5.0,
      },
      /**
       * GOLDEN. Worth NOTHING on the scoreboard - it slows the Protector for six
       * seconds instead, and taking a second one restarts that six rather than
       * adding to it.
       *
       * It flashes. Every other collectible sits there and glows steadily; this
       * one blinks, because it is the only thing in the field whose value is
       * time-limited and situational, and you have to be able to spot one
       * mid-chase without hunting for it.
       */
      golden: {
        points: 0,
        // Between an emeem's 0.22 and an amaam's 0.52: clearly a prize, clearly
        // not an ordinary one, and never mistakable for the hazard.
        radius: 0.30,
        // Rare. Its only pull is the effect, so too common and the Protector is
        // permanently neutered; too rare and nobody learns the mechanic exists.
        weight: 0.055,
        pickupRadius: 1.35,
        glow: 11.0,
        /** Seconds of slow, RESTARTED (not extended) by a second pickup. */
        slowTime: 6.0,
        /**
         * The Protector's speed multiplier while slowed. 0.55 puts every tier
         * below the player's 7.2 m/s - including the top tier's 9.2 - and keeps
         * it there even when the long-range rubber band is at full stretch
         * (9.2 * 0.55 * 1.35 = 6.83). So "you are faster than it" is a property
         * of the numbers rather than something to re-check whenever the threat
         * ladder is retuned.
         */
        slowFactor: 0.55,
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
    // Forest floor: leaf litter and moss, not lawn. This pair is also the BASE
    // the per-biome grounds below are expressed as ratios of, so moving it
    // moves the whole world.
    groundCalm: 0x4a6b3f,
    groundDread: 0x2a1c22,
    /**
     * THE FOUR GROUNDS, indexed by biome (forest, mountain, beach, city).
     *
     * The ground is ONE plane that follows the player and spans several bands
     * at once, so its colour cannot be a material property - it is computed per
     * fragment in the injected grid shader. What the CPU hands the shader is a
     * RATIO against the forest ground at the current dread, which is why the
     * forest entry is exactly the forest pair: its ratio is 1, an exact no-op,
     * so nothing about the shipped forest changes by a single bit.
     *
     * Expressing them as ratios rather than absolute colours also keeps the
     * whole calm-to-dread lerp in ONE place (applyDread, where the base
     * material colour already does it) instead of duplicating the ramp into
     * GLSL, where it would immediately drift from hemi.groundColor.
     */
    biomes: [
      {
        // FOREST - the base. The ground pair must equal groundCalm/groundDread
        // exactly, so its ratio is 1 and the shipped forest is untouched.
        groundCalm: 0x4a6b3f, groundDread: 0x2a1c22,
        skyCalm: 0x8ec5ff, skyDread: 0x1a0508,
        fogCalm: 0xbfe0ff, fogDread: 0x2a0409,
        sunCalm: 0xfff4d6, sunDread: 0xff5a3c,
      },
      {
        // MOUNTAIN - dry scree and lichen. Thin cold air: the sky loses its
        // warmth and the haze goes white rather than blue.
        groundCalm: 0x6e6a5e, groundDread: 0x332a2f,
        skyCalm: 0xa8c8e8, skyDread: 0x140611,
        fogCalm: 0xd6e4ee, fogDread: 0x24060f,
        sunCalm: 0xffeedd, sunDread: 0xff6a44,
      },
      {
        // BEACH - pale damp sand, and the loudest ground of the four on
        // purpose: it is the one biome whose ground IS the whole read. Hot
        // sand-coloured haze, so the horizon goes gold instead of blue.
        groundCalm: 0xc9b48c, groundDread: 0x5c4638,
        skyCalm: 0x7fc6e8, skyDread: 0x1b0709,
        fogCalm: 0xe8dfc0, fogDread: 0x33110c,
        sunCalm: 0xfff0c0, sunDread: 0xff7a3a,
      },
      {
        // CITY - asphalt, slightly blue so it reads as made rather than dug.
        // Smog: the sky desaturates toward grey and the sun goes wan.
        groundCalm: 0x5b5a62, groundDread: 0x2b2632,
        skyCalm: 0x9fb0bd, skyDread: 0x120810,
        fogCalm: 0xc8ccd0, fogDread: 0x201820,
        sunCalm: 0xffe8c8, sunDread: 0xff5030,
      },
    ],
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
    /**
     * Gold, and only gold. Every other kind draws from a spread of natural
     * tones because variety is the point; this one is a signal, so all three
     * entries are the same metal at different temperatures. A golden emeem must
     * never be mistaken for a lucky-coloured ordinary one.
     */
    goldens: [0xffd24a, 0xffc21f, 0xffe07a],
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
