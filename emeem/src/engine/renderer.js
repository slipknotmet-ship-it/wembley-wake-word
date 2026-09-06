import * as THREE from 'three';
import { CONFIG } from '../core/config.js';
import { state as globalState } from '../core/state.js';

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
const SUN_DIR = new THREE.Vector3(14, 30, -18).normalize();
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

  sun.shadow.mapSize.set(CONFIG.render.shadowMapSize, CONFIG.render.shadowMapSize);
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
   * Paints the whole atmosphere for a given dread value.
   * Sky, fog colour, sun colour/intensity and fog distances all move together:
   * at dread 1 the sky is near-black, the sun is a blood-orange ember and the
   * fog has closed to roughly a third of its calm range, so the monster comes
   * out of nowhere.
   */
  function setDread(t) {
    const d = clamp01(t);
    if (Math.abs(d - lastDread) < 0.0005) return; // nothing visible changed
    lastDread = d;

    if (scene.background && scene.background.isColor) {
      scene.background.copy(skyCalmC).lerp(skyDreadC, d);
    }
    if (scene.fog) {
      scene.fog.color.copy(fogCalmC).lerp(fogDreadC, d);
      // Squeeze the fog band as dread rises: the far plane closes faster than
      // the near one, so visibility collapses rather than just greying out.
      scene.fog.near = lerp(CONFIG.world.fogNear, CONFIG.world.fogNear * 0.42, d);
      scene.fog.far = lerp(CONFIG.world.fogFar, CONFIG.world.fogFar * 0.34, d);
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

    // Quantise the anchor to a coarse world grid. The shadow texel footprint at
    // this ortho size is ~40/mapSize metres; snapping the anchor stops the depth
    // map sliding under static geometry, which otherwise crawls along every edge
    // as the camera glides. The grid is world-aligned rather than light-aligned,
    // so it is an approximation - but it removes most of the visible shimmer for
    // one multiply per axis.
    const step = (SHADOW_EXTENT * 2) / CONFIG.render.shadowMapSize * 8;
    const ax = Math.round(playerPos.x / step) * step;
    const az = Math.round(playerPos.z / step) * step;

    // Bias the box a little ahead of the player (toward -Z, the running
    // direction) so obstacles you are about to reach are already shadowed.
    _sunAnchor.set(ax, 0, az - 4);
    _sunOffset.copy(SUN_DIR).multiplyScalar(SUN_DISTANCE);

    sun.target.position.copy(_sunAnchor);
    sun.position.copy(_sunAnchor).add(_sunOffset);
    sun.target.updateMatrixWorld();
  }

  // -------------------------------------------------------------- resize
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
    renderer.setPixelRatio(dpr);
    // updateStyle = false: index.html already sizes the canvas with fixed inset
    // + 100%/100%, and letting three write inline px sizes fights the safe-area
    // layout on notched devices.
    renderer.setSize(w, h, false);

    camera.aspect = w / h;
    camera.updateProjectionMatrix();
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
    setDread(S.dread);

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

    if (step > 0) {
      const posA = 1 - Math.exp(-CONFIG.camera.followLerp * step);
      const lookA = 1 - Math.exp(-CONFIG.camera.lookLerp * step);
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
  function render() {
    renderer.render(scene, camera);
  }

  // --------------------------------------------------------------- reset
  /** Returns the atmosphere and the camera rig to their level-0 values. */
  function reset() {
    lastDread = -1;
    setDread(0);

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
  setDread(0);
  snapTo(globalState.player.pos);
  followShadowCamera(globalState.player.pos);
  resize();

  return { renderer, scene, camera, sun, hemi, resize, render, reset, update, setDread };
}
