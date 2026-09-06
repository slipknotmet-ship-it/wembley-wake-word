# Emeem

A 3D chase-and-collect game for Android. You play a **hand** that runs around on
its three back fingers, pinching up **Emeems** — glossy candy-button discs
scattered across an endless procedural world — while the **Protector of Emeem
Land** hunts you down. Every score threshold you cross makes him faster, bigger
and scarier, and packs the world with more obstacles to weave through.

Built for a **Galaxy S25 Ultra in landscape**: four arrows under the left thumb,
one big jump button under the right.

---

## Play it in 30 seconds

```bash
cd emeem
npm install
npm run dev -- --host
```

Open the printed `http://<your-ip>:5173` on the phone, turn it sideways, tap
PLAY. That is the whole dev loop — no rebuild, no cable, no Android Studio.
Add it to the home screen and it runs fullscreen like an app.

On a desktop browser the same build is playable with **WASD / arrow keys** and
**space** to jump.

---

## Get it on the phone as a real APK

The sandbox this was authored in cannot reach `dl.google.com`, so the APK is
built in CI instead:

1. Push the branch, open the repo's **Actions** tab.
2. Run **Build Emeem APK**.
3. Download `emeem-debug-apk` from the finished run, open it on the phone, and
   allow "install from unknown sources" when Android asks.

Or build it locally, if you have Android Studio / the SDK:

```bash
cd emeem
npm run android:sync     # vite build + cap sync
npm run android:open     # opens the project in Android Studio
# ...or straight to an APK:
cd android && ./gradlew assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

The Android shell is already configured for a game rather than a web view:
landscape-locked (`sensorLandscape`), immersive-sticky fullscreen so the system
bars never sit under your thumbs, drawing behind the camera cutout
(`shortEdges`, with the controls kept clear via CSS `env(safe-area-inset-*)`),
and `FLAG_KEEP_SCREEN_ON` so the display never dims during a long run.

---

## Why this stack

| Decision | Why |
| --- | --- |
| **Three.js + WebGL2** | The S25 Ultra's Adreno 830 runs this at 120fps without breaking a sweat, and you playtest by refreshing a URL on the phone instead of reinstalling an APK. |
| **Capacitor** | Wraps the same bundle into a genuine installable APK. One codebase, both targets. |
| **Custom kinematic physics** | Capsule-vs-AABB, axis-separated resolution, fixed 120Hz step. A physics engine would be ~1MB of download to solve a problem that is 200 lines here. |
| **Zero art assets** | Every mesh is procedural geometry and every sound is synthesised in the Web Audio API. The whole game is code, so it stays diffable and there is no pipeline to maintain. |
| **Vite** | Instant HMR while tuning, and a single small bundle out the other end. |

---

## How it fits together

```
src/
  main.js              boot, the ctx object, the fixed-step game loop
  core/
    config.js          EVERY tunable number in the game. Start here.
    state.js           the one shared mutable state object
    bus.js             synchronous event bus
  engine/
    renderer.js        renderer, lights, fog, the chase camera, dread visuals
  world/
    world.js           deterministic chunk streaming, merged-geometry obstacles,
                       spatially-indexed AABB collision queries
  entities/
    hand.js            the hand puppet: pinch claw + three-finger running gait
    player.js          movement, jump, collision resolution
    emeem.js           pooled collectibles, magnet pickup
    monster.js         chase AI with obstacle avoidance, escalation, roars
  ui/
    touch.js           multi-touch D-pad + jump, keyboard fallback
    hud.js             score, threat meter, danger vignette, overlays
  audio/
    sfx.js             synthesised SFX + an adaptive heartbeat that tracks fear
tools/
  smoke.mjs            headless playtest: boots the game, drives it, asserts
  inline.mjs           collapses the build into one self-contained .html
```

Every module is a factory that takes `ctx` and returns `{ update(dt, ctx), ... }`.
`main.js` fixed-steps the things that can tunnel through walls (player, monster)
at 120Hz and variable-steps everything cosmetic.

### The bits worth knowing

**The camera never rotates.** It sits behind the player looking down −Z and only
follows. With a 4-way D-pad, a camera that swings around while you steer is
genuinely nauseating; a fixed heading means "up" is always up. Since the world
is infinite in every direction, nothing is lost.

**Obstacles are one draw call per chunk.** Each chunk merges its boxes into a
single `BufferGeometry`. Naively that would be ~1,000 draw calls across the 49
live chunks, which is exactly how a mobile game ends up at 20fps.

**Chunks are deterministic.** Content is seeded from a hash of the chunk
coordinates, so walking back into an area finds it unchanged — but the obstacle
*density* is sampled from your threat level at generation time, so the world
visibly thickens as the monster escalates.

**The monster steers, it doesn't cheat.** It fans out candidate headings, probes
them against the collision world, and banks toward the clearest one at a capped
turn rate. Weaving through tight obstacles genuinely loses it ground. It only
rubber-bands when it falls more than ~55m behind, and never when it is close.

**Fear is a rendering parameter.** `state.dread` (0→1) drives fog colour and
density, sun colour and intensity, the monster's scale, the HUD vignette, and
the audio drone from one number. The world literally closes in on you.

---

## Tuning it

Almost everything you would want to change lives in `src/core/config.js`.

The escalation ladder is `CONFIG.levels` — score threshold, monster speed,
monster scale, dread, and the name shown on the HUD:

```js
{ score: 12,  speed: 6.1, scale: 1.22, dread: 0.28, name: 'Hunting' },
```

Add a tier, move a threshold, or change how hard the difficulty bites, and
nothing else needs to know.

Too hard? Raise `player.walkSpeed` or the `score` thresholds. Too easy? Lower
`monster.roarIntervalMin` and raise the `speed` column. Catching feels fiddly?
`emeem.pickupRadius` and `emeem.magnetRadius` are the two dials that matter.

---

## Verifying a change

```bash
npm run build
npm run preview &
npm run smoke
```

`tools/smoke.mjs` boots the real build in headless Chromium with software
WebGL, drives it with the keyboard, and asserts that the game actually
simulates: the player moves in the right direction, jumps fire, obstacles
stream in, the monster closes, the score rises, the tier ladder escalates,
getting caught ends the run, restarting fully resets it, and nothing goes NaN.
It writes screenshots to `shots/`. CI runs it on every push.

---

## What's next

- Power-ups: a brief speed burst, a decoy Emeem pile that distracts him.
- A second monster at the top tier, flanking from the other side.
- Haptics on catch and near-miss (`navigator.vibrate`, or the Capacitor Haptics plugin).
- Height-mapped terrain — `world.sampleGroundY()` is already the single source
  of truth, so the player controller will not need to change.
- Online high scores.
