import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { state as globalState } from '../core/state.js';
import { biomeMix, BIOME_COUNT } from '../world/biome.js';

/**
 * engine/renderer.js
 *
 * Owns the WebGL renderer, the scene graph root, the atmosphere (fog + sky),
 * the two lights and the fixed-heading chase camera.
 *
 * Two things in here are load-bearing for the whole game's look:
 *   1. `dread` (0..1) drives every colour in the scene from a bright afternoon
 *      to a red-black nightmare. This module owns the *smoothing* of it; the
 *      level system only publishes the target.
 *   2. The camera never rotates. It sits on +Z behind the player and looks
 *      toward -Z, forever. A D-pad plus a rotating camera is motion sickness
 *      on a phone, so the heading is nailed down and only the position eases.
 */

// ---------------------------------------------------------------------------
// Module-scope scratch. Nothing in the per-frame path is allowed to allocate:
// on a mobile GPU/JS heap a Vector3 per frame is a guaranteed GC hitch every
// few seconds, which reads as a stutter in a game that is all about running.
// ---------------------------------------------------------------------------
const _desiredPos = new THREE.Vector3();
const _desiredLook = new THREE.Vector3();
const _shakeOffset = new THREE.Vector3();
const _sunOffset = new THREE.Vector3();
const _sunAnchor = new THREE.Vector3();

/** Direction from the shadow-casting anchor back to the sun, in world space. */
/**
 * Sun direction. It sits BEHIND and above the camera, not in front of it.
 *
 * At (14, 30, -18) the sun was past the scene on -Z while the fixed camera
 * looks down -Z from +Z, so every surface turned toward the player was
 * backlit and read as a black silhouette. Moving it to +Z lights the faces
 * you actually see; the off-axis x keeps enough raking shadow for the boxes
 * to have form rather than looking flat.
 */
const SUN_DIR = new THREE.Vector3(-16, 30, 22).normalize();
/** How far up the sun sits. Must stay well inside the shadow camera's far plane. */
const SUN_DISTANCE = 42;
/** Half-width of the sun's orthographic shadow box: a ~40 unit cube of coverage. */
const SHADOW_EXTENT = 20;

/** Base light intensities at dread 0; both are dimmed as dread rises. */
const SUN_INTENSITY = 2.7;
const HEMI_INTENSITY = 1.15;

/** Height above the player's origin that the camera aims at (chest of the hand). */
const LOOK_HEIGHT = 0.8;

/** Peak positional jitter in metres at shake = 1. */
const SHAKE_XY = 0.22;
const SHAKE_Z = 0.11;

/** Extra degrees of FOV when the monster is right on top of you. */
const FOV_PROXIMITY_PUSH = 5.0;
/** How fast the FOV eases toward its target (per second). */
const FOV_LERP = 4.0;
/** Rate that state.dread chases level.dread (per second). Deliberately slow -
 *  the world should curdle over a couple of seconds, not snap. */
const DREAD_LERP = 0.6;

/**
 * Frame-rate independent exponential damping.
 * `1 - e^(-rate*dt)` is the correct blend factor for "approach the target with
 * a time constant of 1/rate seconds"; a raw `rate * dt` lerp changes its feel
 * with the frame rate and explodes past dt = 1/rate.
 */
function damp(current, target, rate, dt) {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/**
 * Cheap deterministic jitter in [-1, 1]. A product of two incommensurate sines
 * looks random enough for camera shake, costs two sin() calls, and - unlike
 * Math.random() - is stable across a paused frame so the shake never pops.
 */
function noise(t, seed) {
  return Math.sin(t * (1.0 + seed * 0.31) + seed * 2.399) *
         Math.sin(t * (0.37 + seed * 0.17) + seed * 5.113);
}

export function createRenderer(canvasEl) {
  const P = CONFIG.palette;

  // ------------------------------------------------------------- renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasEl || undefined,
    antialias: true,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
    depth: true,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.autoClear = true;

  if (CONFIG.render.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  } else {
    renderer.shadowMap.enabled = false;
  }

  // ---------------------------------------------------------------- scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(P.skyCalm);
  scene.fog = new THREE.Fog(P.fogCalm, CONFIG.world.fogNear, CONFIG.world.fogFar);

  // --------------------------------------------------------------- lights
  // Hemisphere light does all the ambient bounce work (sky above, grass below)
  // for the cost of a single uniform - far cheaper than an extra directional.
  const hemi = new THREE.HemisphereLight(P.skyCalm, P.groundCalm, HEMI_INTENSITY);
  hemi.position.set(0, 50, 0);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(P.sunCalm, SUN_INTENSITY);
  sun.position.copy(SUN_DIR).multiplyScalar(SUN_DISTANCE);
  sun.castShadow = !!CONFIG.render.shadows;

  const sc = sun.shadow.camera;
  sc.left = -SHADOW_EXTENT;
  sc.right = SHADOW_EXTENT;
  sc.top = SHADOW_EXTENT;
  sc.bottom = -SHADOW_EXTENT;
  sc.near = 1;
  sc.far = SUN_DISTANCE * 2.2;
  sc.updateProjectionMatrix();

  // Shadow map resolution, sanitised once. A zero/garbage value here would
  // divide by zero in the anchor quantisation below and put NaN into the sun's
  // position, which silently blacks out every shadow in the game.
  const shadowMapSize = (Number.isFinite(CONFIG.render.shadowMapSize) && CONFIG.render.shadowMapSize > 0)
    ? CONFIG.render.shadowMapSize
    : 1024;
  /** World-space grid the shadow anchor is snapped to (8 shadow texels). */
  const SHADOW_GRID = ((SHADOW_EXTENT * 2) / shadowMapSize) * 8;

  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  // Peter-panning vs acne: a small negative bias plus a normalBias handles the
  // steep sun angle on big obstacle boxes without detaching contact shadows.
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = 1.5;

  scene.add(sun);
  // The target must live in the graph for its matrixWorld to be refreshed.
  scene.add(sun.target);

  // --------------------------------------------------------------- camera
  const camera = new THREE.PerspectiveCamera(
    CONFIG.camera.fov,
    (typeof window !== 'undefined' && window.innerHeight > 0)
      ? window.innerWidth / window.innerHeight
      : 16 / 9,
    CONFIG.camera.near,
    CONFIG.camera.far,
  );
  scene.add(camera);

  /**
   * THE DEATH CAMERA.
   *
   * The chase camera never rotates - that is the single rule the whole game is
   * framed around, and it is why you can read the world at speed. But the one
   * moment it costs you something is the moment you are caught: the creature is
   * on top of you, filling the frame from behind, and the face that has been
   * building all run is the one thing you cannot see.
   *
   * So the fixed heading is abandoned exactly once, after the run is over, when
   * there is nothing left to read. The camera swings to the far side of the
   * hand and looks back along the line the creature came in on, which puts the
   * hand in the foreground and the face over it.
   *
   * It is armed by main.js on 'caught' and cleared by reset(), so it can never
   * be running during play.
   */
  const DEATH_DIST = 6.0;      // metres back from the hand, along the kill line
  const DEATH_HEIGHT = 2.4;    // metres up. Low enough to look UP at the face.
  const DEATH_LERP = 3.2;      // deliberate, not a snap
  /** Rig-local height of the face, so the aim tracks the creature's growth. */
  const FACE_Y = 2.75;
  let deathCam = false;
  const _kill = new THREE.Vector3();

  /**
   * A CINEMATIC OVERRIDE, for the waterfall.
   *
   * When set, the chase rig is bypassed entirely and the camera is put exactly
   * where it is told, with no easing: the cutscene computes its own smooth path
   * and a second smoothing on top of it would drag the camera behind its own
   * choreography. Cleared by reset() and by the cutscene itself, so it can
   * never survive into play.
   */
  let cinePos = null;
  let cineLook = null;
  /** Cutscene field of view, or 0 to leave the chase camera's own alone. */
  let cineFov = 0;

  // Camera state kept outside camera.position so shake can be layered on top
  // without feeding back into the smoothing.
  const camBase = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  let currentFov = CONFIG.camera.fov;
  let appliedFov = CONFIG.camera.fov;
  // Own clock: state.time freezes while dead/menu but shake and dread must
  // keep animating (the death shake happens *after* phase flips to 'dead').
  let elapsed = 0;
  let lastDread = -1; // forces the first setDread() to actually write
  let lastAtmoX = 1e9;  // ditto for the position the atmosphere was sampled at
  let lastAtmoZ = 1e9;

  // -------------------------------------------------- cached dread colours
  // Endpoints are built once; every frame lerps *into* the live Color objects
  // that the scene already owns, so no Color is ever allocated at runtime.
  const skyCalmC = new THREE.Color(P.skyCalm);
  const skyDreadC = new THREE.Color(P.skyDread);
  const fogCalmC = new THREE.Color(P.fogCalm);
  const fogDreadC = new THREE.Color(P.fogDread);
  const sunCalmC = new THREE.Color(P.sunCalm);
  const sunDreadC = new THREE.Color(P.sunDread);
  const groundCalmC = new THREE.Color(P.groundCalm);
  const groundDreadC = new THREE.Color(P.groundDread);

  /**
   * THE ATMOSPHERE FOLLOWS THE BIOME.
   *
   * The eight endpoints above are the forest's. Every biome carries its own
   * set, and the eight live objects are rebuilt each frame from the blend at
   * the player's position rather than being constants - so a boundary is a
   * cross-fade of the whole sky, not a switch.
   *
   * WHY THE SKY IS SAMPLED SLIGHTLY AHEAD OF THE GROUND. The sky is what you
   * are walking into, and letting it turn a beat before the ground does makes
   * a boundary feel anticipated rather than announced.
   *
   * ONLY SLIGHTLY, THOUGH. The first cut was 48m, chosen against the 112m fog
   * on the reasoning that most of the visible sky is far away. At a 64m band
   * that is three quarters of a biome: measured at the city's centre, the sky
   * was sampling the FOREST band beyond it and came back bluer than the
   * forest's own. 12m is a quarter of the blend - about 1.7 seconds at walking
   * speed - and every band centre still samples its own biome with margin.
   */
  const SKY_LOOKAHEAD = 12;
  const BP = (P.biomes && P.biomes.length === BIOME_COUNT) ? P.biomes : null;
  const _bmix = { a: 0, b: 0, w: 0 };
  const _mixTmp = new THREE.Color();

  /**
   * Fills `out` with key `k` of the biome blend at (x, z), which is two hex
   * lookups and a lerp. Falls back to the forest constant if no per-biome
   * palette is configured, so a stripped config still renders a forest rather
   * than a black world.
   * @param {THREE.Color} out
   * @param {string} k  palette key, e.g. 'skyCalm'
   * @param {THREE.Color} dflt
   */
  function biomeColor(out, k, dflt, x, z) {
    if (!BP) return out.copy(dflt);
    biomeMix(x, z, _bmix);
    out.setHex(BP[_bmix.a][k]);
    // lerp() with an undefined alpha yields NaN channels and a black scene, so
    // _bmix.w is guarded rather than trusted - biomeMix always writes it, but
    // this is the one place a NaN would be invisible until the whole sky went.
    const w = Number.isFinite(_bmix.w) ? _bmix.w : 0;
    return w > 0 ? out.lerp(_mixTmp.setHex(BP[_bmix.b][k]), w) : out;
  }

  /** Rebuilds all eight endpoints for a position. */
  function biomeEndpoints(x, z) {
    const sz = z - SKY_LOOKAHEAD;   // travel is toward -Z, so ahead is smaller z
    biomeColor(skyCalmC, 'skyCalm', skyCalmC, x, sz);
    biomeColor(skyDreadC, 'skyDread', skyDreadC, x, sz);
    biomeColor(fogCalmC, 'fogCalm', fogCalmC, x, sz);
    biomeColor(fogDreadC, 'fogDread', fogDreadC, x, sz);
    biomeColor(sunCalmC, 'sunCalm', sunCalmC, x, sz);
    biomeColor(sunDreadC, 'sunDread', sunDreadC, x, sz);
    // The hemisphere's ground half is bounce off the floor you are standing on,
    // so it takes the position you are standing at, not the one ahead.
    biomeColor(groundCalmC, 'groundCalm', groundCalmC, x, z);
    biomeColor(groundDreadC, 'groundDread', groundDreadC, x, z);
  }

  /**
   * Paints the whole atmosphere for a given dread value.
   * Sky, fog colour, sun colour/intensity and fog distances all move together:
   * at dread 1 the sky is near-black, the sun is a blood-orange ember and the
   * fog has closed to roughly a third of its calm range, so the monster comes
   * out of nowhere.
   */
  /**
   * @param {number} t     dread, 0..1
   * @param {number} [x]   world position the atmosphere is sampled at
   * @param {number} [z]
   */
  function setDread(t, x, z) {
    const d = clamp01(t);
    const px = Number.isFinite(x) ? x : lastAtmoX;
    const pz = Number.isFinite(z) ? z : lastAtmoZ;
    // The early-out has to watch the POSITION as well as the dread now: a
    // player walking a boundary at a constant tier moves the sky without
    // moving `d` at all, and the old test would have frozen it.
    if (Math.abs(d - lastDread) < 0.0005
      && Math.abs(px - lastAtmoX) < 0.5 && Math.abs(pz - lastAtmoZ) < 0.5) return;
    lastDread = d;
    lastAtmoX = px;
    lastAtmoZ = pz;
    biomeEndpoints(px, pz);

    if (scene.background && scene.background.isColor) {
      // The sky is lerped on a curve, not linearly. Ground and obstacles carry
      // their own dread tint AND lose light to the dimming sun, so they darken
      // roughly quadratically while a linear sky stays stubbornly blue - at
      // mid-dread the world had gone blood-red under a cheerful afternoon.
      scene.background.copy(skyCalmC).lerp(skyDreadC, Math.pow(d, 0.68));
    }
    if (scene.fog) {
      scene.fog.color.copy(fogCalmC).lerp(fogDreadC, d);
      // Squeeze the fog band as dread rises: the far plane closes faster than
      // the near one, so visibility collapses rather than just greying out.
      // Visibility floor. At 0.34 the far plane closed to ~51m, and at the top
      // tiers the monster moves at 9.2 m/s through a world that is 22 obstacles
      // per chunk thick - about five seconds of warning, most of it spent
      // unable to see what you are about to run into. Atmospheric, unplayable.
      // 0.68, not the 0.50 this carried while fogFar was 150. The multiplier is
      // calibrated against an ABSOLUTE visibility floor, not a ratio: 150*0.50
      // gave 75m at dread 1, and 112*0.50 would give 56m - a whisker above the
      // ~51m measured unplayable above. 112*0.68 = 76.2m restores it.
      // Re-derive this if fogFar moves again.
      scene.fog.near = lerp(CONFIG.world.fogNear, CONFIG.world.fogNear * 0.42, d);
      scene.fog.far = lerp(CONFIG.world.fogFar, CONFIG.world.fogFar * 0.68, d);
    }

    sun.color.copy(sunCalmC).lerp(sunDreadC, d);
    sun.intensity = SUN_INTENSITY * lerp(1, 0.42, d);

    hemi.color.copy(skyCalmC).lerp(skyDreadC, d);
    hemi.groundColor.copy(groundCalmC).lerp(groundDreadC, d);
    hemi.intensity = HEMI_INTENSITY * lerp(1, 0.5, d);

    // Slightly hotter exposure at full dread keeps the red rim readable once
    // the ambient has been pulled out from under everything.
    renderer.toneMappingExposure = lerp(1.05, 1.18, d);
  }

  // ------------------------------------------------------------- helpers
  /** Snaps the camera rig onto a player position with no easing. */
  function snapTo(playerPos) {
    camBase.set(
      playerPos.x,
      playerPos.y + CONFIG.camera.height,
      playerPos.z + CONFIG.camera.distance,
    );
    lookTarget.set(
      playerPos.x,
      playerPos.y + LOOK_HEIGHT,
      playerPos.z - CONFIG.camera.lookAhead,
    );
    camera.position.copy(camBase);
    camera.lookAt(lookTarget);
  }

  /**
   * Keeps the sun's tight shadow box centred on the action. A 40-unit ortho box
   * pinned at the origin loses every shadow about five seconds into a run, so
   * the light and its target ride along with the player.
   */
  function followShadowCamera(playerPos) {
    if (!sun.castShadow) return;

    // Quantise the anchor to a coarse world grid (SHADOW_GRID, computed once
    // from the sanitised map size). The shadow texel footprint at this ortho
    // size is ~40/mapSize metres; snapping the anchor stops the depth map
    // sliding under static geometry, which otherwise crawls along every edge as
    // the camera glides. The grid is world-aligned rather than light-aligned, so
    // it is an approximation - but it removes most of the visible shimmer for
    // one multiply per axis.
    const ax = Math.round(playerPos.x / SHADOW_GRID) * SHADOW_GRID;
    const az = Math.round(playerPos.z / SHADOW_GRID) * SHADOW_GRID;

    // Bias the box a little ahead of the player (toward -Z, the running
    // direction) so obstacles you are about to reach are already shadowed.
    _sunAnchor.set(ax, 0, az - 4);
    _sunOffset.copy(SUN_DIR).multiplyScalar(SUN_DISTANCE);

    sun.target.position.copy(_sunAnchor);
    sun.position.copy(_sunAnchor).add(_sunOffset);
    sun.target.updateMatrixWorld();
  }

  // -------------------------------------------------------------- resize
  // Last applied backbuffer geometry. Assigning canvas.width/height reallocates
  // the drawing buffer even when the value is unchanged, and Android Chrome
  // fires 'resize' repeatedly while the URL bar animates - so a resize that
  // changes nothing has to be a genuine no-op, not a per-event realloc.
  let lastW = -1;
  let lastH = -1;
  let lastDpr = -1;

  function resize() {
    if (typeof window === 'undefined') return;
    const w = Math.max(1, window.innerWidth | 0);
    const h = Math.max(1, window.innerHeight | 0);

    // The single biggest mobile win in the whole renderer. An S25 Ultra reports
    // devicePixelRatio ~3.0+; at 3x we would be shading ~2.25x the fragments of
    // a 2x buffer for a difference nobody can see at arm's length. Re-read on
    // every resize because DPR changes on rotation and on external displays.
    const dpr = Math.min(
      (typeof window.devicePixelRatio === 'number' && window.devicePixelRatio > 0)
        ? window.devicePixelRatio
        : 1,
      CONFIG.render.maxPixelRatio,
    );

    if (w === lastW && h === lastH && dpr === lastDpr) return;
    lastW = w;
    lastH = h;
    lastDpr = dpr;

    renderer.setPixelRatio(dpr);
    // updateStyle = false: index.html already sizes the canvas with fixed inset
    // + 100%/100%, and letting three write inline px sizes fights the safe-area
    // layout on notched devices.
    renderer.setSize(w, h, false);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  /**
   * main.js already wires window 'resize'. On Android Chrome and inside the
   * Capacitor WebView the height change when the URL bar hides - and sometimes
   * a rotation - only surfaces as an orientationchange or a visualViewport
   * event, which would otherwise leave the backbuffer letterboxed until the
   * next real window resize. Registered once per renderer (createRenderer is
   * called exactly once per page), and resize() above is a no-op when nothing
   * actually changed, so the extra sources cost nothing.
   */
  function watchViewport() {
    if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
    const onViewportChange = () => resize();
    try {
      window.addEventListener('orientationchange', onViewportChange);
      const vv = window.visualViewport;
      if (vv && typeof vv.addEventListener === 'function') {
        vv.addEventListener('resize', onViewportChange);
      }
    } catch { /* non-DOM host: nothing to listen to */ }
  }

  // -------------------------------------------------------------- update
  function update(dt, ctx) {
    const S = (ctx && ctx.state) || globalState;
    const step = Number.isFinite(dt) && dt > 0 ? Math.min(dt, CONFIG.render.maxDelta) : 0;
    elapsed += step;

    // 1. Dread smoothing. This module is the sole owner of state.dread; the
    //    level table only ever publishes the target value.
    const targetDread = clamp01((S.level && S.level.dread) || 0);
    S.dread = step > 0 ? damp(S.dread || 0, targetDread, DREAD_LERP, step) : (S.dread || 0);
    if (Math.abs(S.dread - targetDread) < 0.001) S.dread = targetDread;

    // 2. Atmosphere.
    setDread(S.dread, S.player.pos.x, S.player.pos.z);

    const pp = S.player.pos;

    // 3. Chase camera - fixed heading, position only. Desired rig position is
    //    straight behind the player on +Z and above it; there is no yaw term
    //    anywhere in here on purpose (see the header note).
    _desiredPos.set(
      pp.x,
      pp.y + CONFIG.camera.height,
      pp.z + CONFIG.camera.distance,
    );
    _desiredLook.set(
      pp.x,
      pp.y + LOOK_HEIGHT,
      pp.z - CONFIG.camera.lookAhead,
    );

    // 3a. A cutscene owns the camera outright while it is running.
    if (cinePos && cineLook) {
      camBase.copy(cinePos);
      lookTarget.copy(cineLook);
      // The cutscene owns the lens too. Written straight through rather than
      // damped: the path already eases, and a second smoothing here would drag
      // the zoom behind the move it is supposed to be part of.
      if (cineFov && Math.abs(cineFov - appliedFov) > 0.01) {
        appliedFov = cineFov;
        currentFov = cineFov;
        camera.fov = cineFov;
        camera.updateProjectionMatrix();
      }
      camera.position.copy(camBase);
      camera.lookAt(lookTarget);
      followShadowCamera(pp);
      return;
    }

    // 3b. ...unless the run just ended, in which case go and look at it.
    let lerpRate = 0;
    if (deathCam && S.monster && S.monster.pos) {
      const mp = S.monster.pos;
      let ux = mp.x - pp.x;
      let uz = mp.z - pp.z;
      const len = Math.hypot(ux, uz);
      if (len > 0.05) { ux /= len; uz /= len; }
      // Caught dead-centre, there is no line to swing along. Fall back to the
      // heading the chase camera already has, which at least keeps the move
      // small instead of throwing the camera at a random azimuth.
      else { ux = 0; uz = 1; }

      // Behind the hand, looking back down the line the creature came in on.
      _desiredPos.set(pp.x - ux * DEATH_DIST, pp.y + DEATH_HEIGHT, pp.z - uz * DEATH_DIST);

      // Aim halfway between the top of the hand and the creature's face, so
      // both are in frame however big it has grown - at 2.1x the face is 5.8m
      // up and a shot centred on it would leave the hand off the bottom.
      const scl = (S.monster.scale) || 1;
      const faceY = mp.y + FACE_Y * scl;
      _kill.set((pp.x + mp.x) * 0.5, (pp.y + 0.5 + faceY) * 0.5, (pp.z + mp.z) * 0.5);
      _desiredLook.copy(_kill);
      lerpRate = DEATH_LERP;
    }

    if (step > 0) {
      const posA = 1 - Math.exp(-(lerpRate || CONFIG.camera.followLerp) * step);
      const lookA = 1 - Math.exp(-(lerpRate || CONFIG.camera.lookLerp) * step);
      camBase.lerp(_desiredPos, posA);
      lookTarget.lerp(_desiredLook, lookA);
    }

    // 5. FOV push (applied before lookAt, it only affects projection). A wider
    //    lens as the monster closes stretches the world outward and sells the
    //    "it's right behind you" panic without touching the rig.
    const prox = clamp01((S.monster && S.monster.proximity) || 0);
    const targetFov = CONFIG.camera.fov + FOV_PROXIMITY_PUSH * prox * prox;
    currentFov = step > 0 ? damp(currentFov, targetFov, FOV_LERP, step) : targetFov;
    if (Math.abs(currentFov - appliedFov) > 0.01) {
      appliedFov = currentFov;
      camera.fov = currentFov;
      camera.updateProjectionMatrix();
    }

    camera.position.copy(camBase);
    camera.lookAt(lookTarget);

    // 4. Shake. Applied *after* lookAt so the aim direction stays rock steady
    //    and only the eye point rattles - shaking the look target instead makes
    //    the whole horizon swim and is unplayable on a small screen.
    let shake = S.camera.shake || 0;
    if (shake > 0.0005) {
      const amt = Math.min(shake, 1.6);
      // Squared response: small bumps stay subtle, a death-shake really hits.
      const mag = amt * amt;
      const t = elapsed * 46;
      _shakeOffset.set(
        noise(t, 0) * SHAKE_XY * mag,
        noise(t, 1) * SHAKE_XY * mag,
        noise(t, 2) * SHAKE_Z * mag,
      );
      camera.position.add(_shakeOffset);

      if (step > 0) {
        // Exponential decay at shakeDecay per second: never overshoots into a
        // negative amount the way a linear subtract does on a long frame.
        shake *= Math.exp(-CONFIG.camera.shakeDecay * step);
        S.camera.shake = shake < 0.002 ? 0 : shake;
      }
    } else if (shake !== 0) {
      S.camera.shake = 0;
    }

    // Shadow box rides with the player, every frame, cheap.
    followShadowCamera(pp);
  }

  // -------------------------------------------------------------- render
  // ------------------------------------------------------------- portrait
  /**
   * A live head-and-shoulders render of the Protector, drawn as a small inset
   * over the main frame so the player can watch his face escalate without
   * turning round - which the fixed-heading camera does not let them do.
   *
   * It is a second pass over the SAME scene rather than a second scene, so the
   * subject is lit by the same sun and carries the same expression it has in
   * the world. The cost is kept low by rendering only layer PORTRAIT_LAYER:
   * the monster enables that layer on itself, everything else stays on layer 0
   * and is skipped entirely, so the pass draws one creature into a ~110px box.
   */
  const PORTRAIT_LAYER = 1;
  /** Radians off dead-on, so the portrait catches the key light. */
  const PORTRAIT_AZIMUTH = -0.34;
  const PORTRAIT_KEY = 3.1;
  const PORTRAIT_FILL = 1.5;
  const portraitCam = new THREE.PerspectiveCamera(30, 1, 0.05, 40);
  portraitCam.layers.set(PORTRAIT_LAYER);
  const portraitBg = new THREE.Color(0x140a12);

  /**
   * A key light that exists only for the portrait.
   *
   * Boosting the sun does nothing here: the creature's face is on its CHEST and
   * its chest faces the player, while the sun deliberately sits behind the
   * player so the world is front-lit. The portrait is therefore looking at the
   * one surface the sun never reaches, and a brighter sun just brightens its
   * back.
   *
   * Its layers are set to the portrait layer, so it can only ever touch the
   * creature. It stays in the scene permanently at ZERO intensity and is only
   * turned up for the pass - toggling `visible` would change the light count
   * and make three.js recompile every material in the scene, every frame.
   */
  const portraitKey = new THREE.DirectionalLight(0xfff1e2, 0);
  portraitKey.layers.set(PORTRAIT_LAYER);
  scene.add(portraitKey);
  scene.add(portraitKey.target);
  const portraitFill = new THREE.HemisphereLight(0xd8e6ff, 0x40202c, 0);
  portraitFill.layers.set(PORTRAIT_LAYER);
  scene.add(portraitFill);
  let portraitSubject = null;
  let portraitRect = null;      // { x, y, w, h } in CSS pixels, top-left origin
  const _pSubject = new THREE.Vector3();
  const _pOffset = new THREE.Vector3();
  const _keepClear = new THREE.Color();

  /**
   * @param {THREE.Object3D|null} obj the thing to frame
   * @param {object} [opts] { height } metres above the subject origin to aim at
   */
  /**
   * @param {THREE.Object3D|null} obj  the thing to frame
   * @param {{height?:number, dist?:number, lift?:number}} [opts]
   *   height - metres above the subject's own origin to aim at
   *   dist   - metres to stand back. Bigger fits more in.
   *   lift   - metres the camera rides above the aim point.
   * All three are in the subject's UNSCALED space and are multiplied by the
   * rig's scale at render time, so the framing holds as the creature grows.
   */
  function setPortraitSubject(obj, opts) {
    portraitSubject = obj ? {
      obj,
      height: (opts && opts.height) || 2.9,
      dist: (opts && opts.dist) || 3.1,
      lift: (opts && opts.lift !== undefined) ? opts.lift : 0.30,
    } : null;
  }

  /** @param {object|null} rect { x, y, w, h } in CSS pixels, or null to hide. */
  function setPortraitRect(rect) {
    portraitRect = rect && rect.w > 0 && rect.h > 0 ? rect : null;
  }

  function renderPortrait() {
    if (!portraitRect || !portraitSubject || !portraitSubject.obj) return;
    const s = portraitSubject.obj;
    if (!s.parent) return;                       // not in the scene right now

    s.updateWorldMatrix(true, false);
    _pSubject.setFromMatrixPosition(s.matrixWorld);
    const rig = s.parent;
    const scl = rig.scale ? rig.scale.y : 1;
    const yaw = rig.rotation ? rig.rotation.y : 0;
    // Its face is on its chest, so aim at chest height and stand in FRONT of
    // it - the creature faces -Z in its own frame, rotated by its yaw.
    // A subject can sink below its own origin - the Protector drops into the
    // water without its root moving - and the portrait has no way to see that
    // from a world matrix one node too high. It publishes the drop instead.
    const drop = (s.userData && s.userData.portraitDrop) || 0;
    _pSubject.y += (portraitSubject.height - drop) * scl;
    const dist = portraitSubject.dist * scl;
    // Stand three-quarters rather than dead-on, biased toward the side the sun
    // comes from. Straight in front of its face is straight into its shadow -
    // the sun is behind the player, so a head-on portrait is backlit and the
    // whole face reads as a black rectangle with two eyes floating in it.
    const az = yaw + PORTRAIT_AZIMUTH;
    _pOffset.set(-Math.sin(az) * dist, portraitSubject.lift * scl, -Math.cos(az) * dist);
    portraitCam.position.copy(_pSubject).add(_pOffset);
    portraitCam.lookAt(_pSubject);

    // setViewport/setScissor take CSS pixels and apply the pixel ratio
    // themselves. Passing device pixels here scales the rectangle twice, which
    // renders the inset at several times its size in the wrong corner and
    // leaves the main view drawn into a fraction of the canvas.
    const w = renderer.domElement.width / renderer.getPixelRatio();
    const h = renderer.domElement.height / renderer.getPixelRatio();
    const px = Math.round(portraitRect.x);
    // The rect is authored top-left like the DOM; WebGL's origin is bottom-left.
    const py = Math.round(h - portraitRect.y - portraitRect.h);
    const pw = Math.round(portraitRect.w);
    const ph = Math.round(portraitRect.h);
    if (pw < 2 || ph < 2 || px + pw < 0 || py + ph < 0) return;

    portraitCam.aspect = pw / ph;
    portraitCam.updateProjectionMatrix();

    // Three things have to be borrowed and put back, or the pass leaks into the
    // next frame: fog would grey the portrait out exactly when it matters, the
    // scene background would repaint the sky over the whole inset, and
    // autoClear plus the clear colour would follow us into the main render.
    const keepFog = scene.fog;
    const keepBg = scene.background;
    const keepAuto = renderer.autoClear;
    // Do NOT rebuild the shadow map for this pass. renderer.render() refreshes
    // it on every call, and a second full 1024x1024 shadow render for a 100px
    // inset is by far the most expensive thing about the portrait - it cost
    // nearly half the frame rate. The map the main pass just built is still
    // valid; the portrait only needs to sample it.
    const keepShadowAuto = renderer.shadowMap.autoUpdate;
    renderer.shadowMap.autoUpdate = false;
    // Light it from where the portrait camera stands, so the face it is looking
    // at is the face that is lit. Slightly above and to one side of the lens,
    // which is where a key light goes.
    portraitKey.position.copy(portraitCam.position);
    portraitKey.position.y += 1.4 * scl;
    portraitKey.target.position.copy(_pSubject);
    portraitKey.target.updateMatrixWorld();
    portraitKey.intensity = PORTRAIT_KEY;
    portraitFill.intensity = PORTRAIT_FILL;
    renderer.getClearColor(_keepClear);
    const keepAlpha = renderer.getClearAlpha();

    scene.fog = null;
    scene.background = null;
    renderer.autoClear = false;

    renderer.setScissorTest(true);
    renderer.setViewport(px, py, pw, ph);
    renderer.setScissor(px, py, pw, ph);
    renderer.setClearColor(portraitBg, 1);
    renderer.clear(true, true, false);
    renderer.render(scene, portraitCam);
    renderer.setScissorTest(false);

    renderer.setViewport(0, 0, w, h);
    renderer.setScissor(0, 0, w, h);
    renderer.setClearColor(_keepClear, keepAlpha);
    renderer.autoClear = keepAuto;
    renderer.shadowMap.autoUpdate = keepShadowAuto;
    portraitKey.intensity = 0;
    portraitFill.intensity = 0;
    scene.fog = keepFog;
    scene.background = keepBg;
  }

  /**
   * Draw-call/triangle counts for the MAIN pass, captured before the portrait
   * pass overwrites them.
   *
   * renderer.info.autoReset is true, so every renderer.render() call clears
   * info.render and refills it with just that pass. render() draws the world
   * and THEN the 100px monster portrait, so anything reading renderer.info
   * afterwards is reading the PORTRAIT: a steady 20 calls and 5,530 triangles
   * that never moves when the world changes, because it is not measuring the
   * world. The smoke suite asserted on that number for a long time, and it was
   * reported as the game's cost. The main pass is really ~186 calls and
   * ~47,500 triangles. Snapshot it here, the one point where it is still true.
   */
  const gpu = { calls: 0, triangles: 0, points: 0, lines: 0 };

  function render() {
    renderer.render(scene, camera);
    const ri = renderer.info.render;
    gpu.calls = ri.calls;
    gpu.triangles = ri.triangles;
    gpu.points = ri.points;
    gpu.lines = ri.lines;
    renderPortrait();
  }

  // --------------------------------------------------------------- reset
  /** Returns the atmosphere and the camera rig to their level-0 values. */
  function reset() {
    lastDread = -1;
    lastAtmoX = 1e9;
    lastAtmoZ = 1e9;
    cinePos = null;
    cineLook = null;
    // A real position, not a default: setDread's fallbacks are the sentinels
    // above, and lerping toward a sentinel is how a sky ends up NaN and black.
    setDread(0, globalState.player.pos.x, globalState.player.pos.z);
    deathCam = false;

    currentFov = CONFIG.camera.fov;
    appliedFov = CONFIG.camera.fov;
    camera.fov = CONFIG.camera.fov;
    camera.updateProjectionMatrix();

    globalState.camera.shake = 0;
    // Snap rather than ease, so a restart doesn't fly the camera across the map.
    snapTo(globalState.player.pos);
    followShadowCamera(globalState.player.pos);
  }

  // Initial pose so the very first frame is already framed on the spawn point.
  // A real position for the same reason reset() passes one: the atmosphere is
  // sampled from it, and the no-argument fallbacks are sentinels.
  setDread(0, globalState.player.pos.x, globalState.player.pos.z);
  snapTo(globalState.player.pos);
  followShadowCamera(globalState.player.pos);
  resize();
  watchViewport();

  return {
    renderer, scene, camera, sun, hemi, resize, render, reset, update, setDread,
    setPortraitSubject, setPortraitRect, PORTRAIT_LAYER,
    /**
     * Abandon the fixed heading and swing round onto the kill. Armed by
     * main.js on 'caught' and cleared by reset(), so it is structurally
     * impossible for it to be running while the game is playable.
     */
    deathCamera: () => { deathCam = true; },
    /**
     * Put the camera exactly here, looking exactly there, until called again
     * with nulls. Vectors are COPIED, so the caller may reuse its scratch.
     */
    setCinematic: (pos, look, fov) => {
      if (pos && look) {
        cinePos = (cinePos || new THREE.Vector3()).copy(pos);
        cineLook = (cineLook || new THREE.Vector3()).copy(look);
        cineFov = Number.isFinite(fov) && fov > 1 ? fov : 0;
      } else {
        cinePos = null;
        cineLook = null;
        cineFov = 0;
      }
    },
    isCinematic: () => !!cinePos,
    /**
     * Put the chase rig exactly on its target for a position, with no easing.
     * A cutscene leaves the camera forty metres down a gorge; letting the
     * normal follow-lerp crawl back from there spends the first seconds of the
     * next scene looking up at the world from underneath its own ground plane,
     * which - the plane being single-sided - is a city floating in an empty sky.
     */
    snapCamera: (pos) => { snapTo(pos || globalState.player.pos); },
    /** For the suites: is the camera off its fixed heading right now? */
    isDeathCamera: () => deathCam,
    /** Main-pass draw stats. See the comment on `gpu` above before trusting
     *  renderer.info directly - it holds the portrait's numbers, not these. */
    gpu,
  };
}
