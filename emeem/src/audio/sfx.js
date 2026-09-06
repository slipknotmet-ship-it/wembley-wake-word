/**
 * EMEEM - all game audio, synthesised live with the Web Audio API.
 *
 * There are zero asset files here by design: oscillators, one white-noise
 * buffer generated at startup, filters and envelopes. The whole game ships as
 * code and still sounds alive.
 *
 * Signal graph (built lazily on the FIRST resume(), never at import time,
 * because mobile browsers refuse to start an AudioContext outside a gesture):
 *
 *   one-shot voices  ->  sfxBus   --\
 *   drone + heartbeat ->  ambience --+-> duck --\
 *                                                +-> master -> compressor -> out
 *   caught() ------------------------------------/
 *
 * `duck` is what the death sound pulls down so the collapse owns the mix; the
 * death voice itself bypasses it and goes straight to master.
 *
 * Everything in this module is defensive: on a device with audio disabled, in
 * a headless smoke test, or behind a hostile autoplay policy, every method
 * degrades to a silent no-op rather than taking the game down.
 */
import { CONFIG } from '../core/config.js';

const AudioCtor =
  typeof window !== 'undefined'
    ? window.AudioContext || window.webkitAudioContext || null
    : null;

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
/** semitones -> frequency ratio */
const semi = (n) => Math.pow(2, n / 12);
/** exponentialRampToValueAtTime refuses zero, so every envelope floors here. */
const EPS = 0.0001;
/** How far ahead of the audio clock the heartbeat is scheduled, in seconds. */
const SCHED_AHEAD = 0.28;

/**
 * tanh soft-clip transfer curve. A sawtooth pushed through this picks up the
 * ragged upper harmonics that make the monster read as a creature rather than
 * as a synthesiser playing a low note.
 */
function makeDriveCurve(amount, n = 1024) {
  const curve = new Float32Array(n);
  const k = Math.tanh(amount) || 1;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * amount) / k;
  }
  return curve;
}

export function createAudio(ctx) {
  // Held from construction to shutdown. ctx.world/ctx.audio are still null at
  // this point, so nothing but ctx.state is touched here.
  const state0 = (ctx && ctx.state) || null;

  let ac = null;              // AudioContext - created on the first resume()
  let master = null;
  let comp = null;
  let duck = null;
  let sfxBus = null;
  let ambience = null;
  let deathBus = null;

  let noiseBuf = null;
  let driveSoft = null;
  let driveHard = null;

  let broken = false;         // audio permanently unavailable -> all no-ops
  let warned = false;
  let visHooked = false;
  let updateFails = 0;

  // --- adaptive layer state ------------------------------------------------
  let droneFilter = null;
  let droneGain = null;
  let droneGainTarget = -1;   // last value pushed at the AudioParam, so the
  let droneCutTarget = -1;    // per-frame update does not spam automation
  let heartGain = null;
  let nextBeat = 0;           // AudioContext-clock time of the next heartbeat

  // --- one-shot bookkeeping ------------------------------------------------
  let combo = 0;              // ascending pickup streak, decays after ~1s
  let lastCollectAt = -10;
  let lastRoarAt = -10;
  let lastLevelupAt = -10;
  let lastLandAt = -10;

  function fail(err) {
    broken = true;
    if (!warned && typeof console !== 'undefined' && console.warn) {
      warned = true;
      // console.warn, never console.error: the smoke test treats errors as
      // failures and silent gameplay is not a failure.
      console.warn('[emeem/audio] disabled:', err && err.message ? err.message : err);
    }
  }

  const live = () => !!ac && !broken;

  // ---------------------------------------------------------------- helpers

  /**
   * A gain node carrying a percussive envelope, already connected to `dest`.
   * attack/hold/dur are seconds; dur is measured from t0, not from the peak.
   */
  function gainEnv(t0, peak, attack, dur, dest, hold = 0) {
    const g = ac.createGain();
    const p = Math.max(peak, EPS * 2);
    g.gain.setValueAtTime(EPS, t0);
    g.gain.exponentialRampToValueAtTime(p, t0 + attack);
    if (hold > 0) g.gain.setValueAtTime(p, t0 + attack + hold);
    g.gain.exponentialRampToValueAtTime(EPS, t0 + dur);
    g.gain.setValueAtTime(0, t0 + dur + 0.005);
    g.connect(dest);
    return g;
  }

  /**
   * A looping slice of the shared noise buffer. The random start offset stops
   * repeated bursts from phase-matching into an audible pitch.
   */
  function noise(t0, dur, rate = 1) {
    const src = ac.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    src.playbackRate.value = rate;
    src.start(t0, Math.random() * (noiseBuf.duration - 0.25));
    src.stop(t0 + dur + 0.01);
    return src;
  }

  /** Stereo placement, or null on the handful of browsers without a panner. */
  function panNode(x) {
    if (!ac.createStereoPanner) return null;
    const p = ac.createStereoPanner();
    p.pan.value = clamp(x, -1, 1);
    return p;
  }

  /**
   * Screen-relative pan for a world position. The chase camera has a fixed
   * heading looking down -Z, so world X maps straight onto screen X and this
   * needs no camera maths at all.
   */
  function panFor(pos, spread = 0.55, range = 7) {
    if (!pos || !state0 || !state0.player) return 0;
    return clamp((pos.x - state0.player.pos.x) / range, -1, 1) * spread;
  }

  // ------------------------------------------------------------ graph build

  function buildGraph() {
    master = ac.createGain();
    master.gain.value = CONFIG.audio.masterVolume;

    // Compressor last so a pickup landing on top of a roar landing on top of
    // the heartbeat cannot clip the phone's tiny speaker into distortion.
    comp = ac.createDynamicsCompressor();
    comp.threshold.value = -15;
    comp.knee.value = 22;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.22;

    master.connect(comp);
    comp.connect(ac.destination);

    duck = ac.createGain();
    duck.gain.value = 1;
    duck.connect(master);

    sfxBus = ac.createGain();
    sfxBus.gain.value = 1;
    sfxBus.connect(duck);

    ambience = ac.createGain();
    ambience.gain.value = 1;
    ambience.connect(duck);

    // Death bypasses the duck: it is the thing doing the ducking.
    deathBus = ac.createGain();
    deathBus.gain.value = 1;
    deathBus.connect(master);

    // One 2.5s mono noise buffer, reused by every noise layer in the game.
    const len = Math.floor(ac.sampleRate * 2.5);
    noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    driveSoft = makeDriveCurve(2.2);
    driveHard = makeDriveCurve(5.5);

    buildDrone();

    heartGain = ac.createGain();
    heartGain.gain.value = 1;
    heartGain.connect(ambience);
  }

  /**
   * The dread bed: a low sustained voice that is nearly inaudible at calm and
   * opens into a wide growl as state.dread climbs. Runs forever once started;
   * update() only moves its gain and cutoff.
   */
  function buildDrone() {
    droneGain = ac.createGain();
    droneGain.gain.value = 0;
    droneGain.connect(ambience);

    droneFilter = ac.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = 110;
    droneFilter.Q.value = 3.0;
    droneFilter.connect(droneGain);

    // F1 and C2 (a fifth), plus a third voice ~0.3 Hz off the root. That slow
    // beat is the difference between "atmosphere" and "a held synth pad".
    const freqs = [43.65, 65.41, 43.95];
    const types = ['sawtooth', 'sawtooth', 'triangle'];
    const gains = [0.5, 0.26, 0.4];
    const roots = [];
    for (let i = 0; i < 3; i++) {
      const o = ac.createOscillator();
      o.type = types[i];
      o.frequency.value = freqs[i];
      const g = ac.createGain();
      g.gain.value = gains[i];
      o.connect(g);
      g.connect(droneFilter);
      o.start();
      roots.push(o);
    }

    // Very slow pitch drift so a two-minute run never settles into a texture
    // the ear can stop hearing.
    const lfo = ac.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.055;
    const depth = ac.createGain();
    depth.gain.value = 8; // cents
    lfo.connect(depth);
    depth.connect(roots[0].detune);
    lfo.start();
  }

  function installVisibilityHook() {
    if (visHooked || typeof document === 'undefined' || !document.addEventListener) return;
    visHooked = true;
    const wake = () => {
      if (!live()) return;
      try {
        if (ac.state !== 'running') {
          const p = ac.resume();
          if (p && typeof p.catch === 'function') p.catch(() => {});
        }
        // The audio clock ran on (or did not) while we were backgrounded;
        // re-park the heartbeat just ahead of now instead of firing a burst.
        nextBeat = ac.currentTime + 0.2;
      } catch { /* nothing useful to do */ }
    };
    // Android suspends the context on background; iOS/WebView variants only
    // reliably fire one of these three, so listen for all of them.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') wake();
    });
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('pageshow', wake);
      window.addEventListener('focus', wake);
    }
  }

  // ------------------------------------------------------------- lifecycle

  /**
   * Called from the PLAY / AGAIN button gesture. Creates the context on the
   * first call, and un-suspends it on every subsequent one.
   */
  function resume() {
    if (broken) return;
    try {
      if (!ac) {
        if (!AudioCtor) { broken = true; return; }
        try {
          ac = new AudioCtor({ latencyHint: 'interactive' });
        } catch {
          ac = new AudioCtor(); // older implementations reject the options bag
        }
        buildGraph();
        installVisibilityHook();
      }
      if (ac.state !== 'running') {
        const p = ac.resume();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      }
      // A fresh run: lift any death ducking and reset the streak/heart clock.
      const t = ac.currentTime;
      duck.gain.cancelScheduledValues(t);
      duck.gain.setValueAtTime(1, t);
      combo = 0;
      lastCollectAt = -10;
      nextBeat = t + 0.25;
      updateFails = 0;
    } catch (err) {
      fail(err);
    }
  }

  // ----------------------------------------------------------- one-shots

  /**
   * The pickup. This is the sound the player hears hundreds of times a run, so
   * it gets the most attention: a bright plink built from a glide, an octave
   * shimmer, a bell partial and a noise tick.
   *
   * The streak counter climbs a minor pentatonic scale, so grabbing a line of
   * emeems fast turns into an ascending arpeggio; it resets after ~1s without
   * a pickup so a slow scavenge stays on the root note.
   */
  function collect(e) {
    if (!live()) return;
    try {
      const t = ac.currentTime + 0.002;
      if (t - lastCollectAt < 0.02) return; // two pickups in one frame: one blip
      combo = t - lastCollectAt > 0.95 ? 0 : combo + 1;
      lastCollectAt = t;

      // Minor pentatonic, doubling back on itself past two octaves so a long
      // streak plateaus into a shimmer instead of climbing out of hearing.
      const STEPS = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24];
      const step = STEPS[Math.min(combo, STEPS.length - 1)];
      const f = 622.25 * semi(step); // D#5 root

      let dst = sfxBus;
      const pn = panNode(panFor(e && e.position));
      if (pn) { pn.connect(sfxBus); dst = pn; }

      // 1. Body. The 30ms glide up into the target pitch is what makes this
      //    read as a "plink" rather than a beep - a flat sine sounds like a
      //    lift arriving.
      const o1 = ac.createOscillator();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(f * 0.84, t);
      o1.frequency.exponentialRampToValueAtTime(f, t + 0.03);
      o1.connect(gainEnv(t, 0.3, 0.004, 0.22, dst));
      o1.start(t); o1.stop(t + 0.25);

      // 2. Octave shimmer, deliberately 7 cents sharp so it beats against the
      //    body instead of fusing into one duller tone.
      const o2 = ac.createOscillator();
      o2.type = 'triangle';
      o2.frequency.value = f * 2.008;
      o2.connect(gainEnv(t, 0.12, 0.003, 0.13, dst));
      o2.start(t); o2.stop(t + 0.16);

      // 3. Bell partial a twelfth up - very short, this is the candy "tink".
      const o3 = ac.createOscillator();
      o3.type = 'triangle';
      o3.frequency.value = f * 3.02;
      o3.connect(gainEnv(t, 0.055, 0.002, 0.08, dst));
      o3.start(t); o3.stop(t + 0.1);

      // 4. Attack transient. Rises through the streak so a climbing arpeggio
      //    also gets visibly brighter, not just higher.
      const nz = noise(t, 0.05);
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 4600 + Math.min(combo, 8) * 220;
      bp.Q.value = 1.1;
      nz.connect(bp);
      bp.connect(gainEnv(t, 0.085, 0.0015, 0.045, dst));
    } catch (err) {
      fail(err);
    }
  }

  /** Short upward swoop plus a breath of filtered noise. */
  function jump() {
    if (!live()) return;
    try {
      const t = ac.currentTime + 0.002;

      const o = ac.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(230, t);
      o.frequency.exponentialRampToValueAtTime(820, t + 0.16);
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1400, t);
      lp.frequency.exponentialRampToValueAtTime(3600, t + 0.16);
      o.connect(lp);
      lp.connect(gainEnv(t, 0.2, 0.006, 0.2, sfxBus));
      o.start(t); o.stop(t + 0.22);

      const nz = noise(t, 0.18);
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(700, t);
      bp.frequency.exponentialRampToValueAtTime(2800, t + 0.17);
      bp.Q.value = 0.9;
      nz.connect(bp);
      bp.connect(gainEnv(t, 0.075, 0.01, 0.18, sfxBus));
    } catch (err) {
      fail(err);
    }
  }

  /**
   * Soft thud. `impact` is accepted either normalised (0..1) or as a raw fall
   * speed in m/s - anything above 1.5 is treated as m/s and scaled against
   * CONFIG.player.maxFallSpeed, so this stays correct whichever the player
   * controller ends up sending.
   */
  function land(e) {
    if (!live()) return;
    try {
      const t = ac.currentTime + 0.002;
      if (t - lastLandAt < 0.05) return;
      lastLandAt = t;

      let imp = Math.abs(Number(e && e.impact != null ? e.impact : 0.5)) || 0;
      if (imp > 1.5) imp = imp / Math.abs(CONFIG.player.maxFallSpeed);
      imp = clamp(imp, 0, 1);

      let dst = sfxBus;
      const pn = panNode(panFor(e && e.position, 0.35));
      if (pn) { pn.connect(sfxBus); dst = pn; }

      const dur = 0.16 + 0.16 * imp;
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(150 + 70 * imp, t);
      o.frequency.exponentialRampToValueAtTime(46, t + dur * 0.8);
      o.connect(gainEnv(t, 0.1 + 0.34 * imp, 0.005, dur + 0.06, dst));
      o.start(t); o.stop(t + dur + 0.1);

      // Grit layer - the scuff of a palm hitting dirt.
      const nz = noise(t, 0.11);
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(700 + 900 * imp, t);
      lp.frequency.exponentialRampToValueAtTime(200, t + 0.1);
      nz.connect(lp);
      lp.connect(gainEnv(t, 0.05 + 0.13 * imp, 0.003, 0.1, dst));
    } catch (err) {
      fail(err);
    }
  }

  /**
   * The monster. Three detuned sawtooths bending downward through a tanh
   * clipper, a noise band sweeping down with them, and a slow amplitude growl
   * on top. Nothing here is a lion: the tuning target is "something with lungs
   * the size of a car, and something wrong with them".
   */
  function roar(e) {
    if (!live()) return;
    try {
      const t = ac.currentTime + 0.005;
      if (t - lastRoarAt < 0.3) return; // stacked roars would just mud up
      lastRoarAt = t;

      const i = clamp(
        Number(e && e.intensity != null ? e.intensity : (state0 ? state0.dread : 0)) || 0, 0, 1,
      );
      const dur = 1.15 + 0.8 * i;
      const peak = 0.24 + 0.4 * i;

      // Shared shaping chain: saws -> soft clip -> sweeping lowpass -> growl.
      const shaper = ac.createWaveShaper();
      shaper.curve = driveHard;
      shaper.oversample = '2x'; // short and rare enough to afford on mobile

      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(420 + 2600 * i, t);
      lp.frequency.exponentialRampToValueAtTime(170 + 420 * i, t + dur);
      lp.Q.value = 1.5;

      const g = ac.createGain();
      g.gain.setValueAtTime(EPS, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.11);
      g.gain.setValueAtTime(peak, t + dur * 0.5);
      g.gain.exponentialRampToValueAtTime(EPS, t + dur);
      g.gain.setValueAtTime(0, t + dur + 0.01);

      shaper.connect(lp);
      lp.connect(g);
      g.connect(sfxBus);

      // Amplitude growl. 27 Hz reads as a snarl; 14 Hz reads as something far
      // too large, so the flutter slows down as the tier climbs.
      const lfo = ac.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(27 - 13 * i, t);
      lfo.frequency.linearRampToValueAtTime(18 - 8 * i, t + dur);
      const lfoAmt = ac.createGain();
      lfoAmt.gain.value = peak * 0.4; // stays under the envelope peak
      lfo.connect(lfoAmt);
      lfoAmt.connect(g.gain);
      lfo.start(t); lfo.stop(t + dur + 0.05);

      // Slow, uneven pitch wobble on the sawtooths. Human and animal calls are
      // steady; this deliberately is not.
      const wob = ac.createOscillator();
      wob.type = 'sine';
      wob.frequency.value = 5.5 + 3.5 * i;
      const wobAmt = ac.createGain();
      wobAmt.gain.value = 20 + 34 * i; // cents
      wob.connect(wobAmt);
      wob.start(t); wob.stop(t + dur + 0.05);

      // Fundamental drops as the monster grows, so tier 7 is a full fifth
      // below tier 0 without any extra bookkeeping.
      const f0 = 58 - 13 * i;
      const mult = [1, 1.005, 0.5];
      const det = [0, 12, -18];
      const lvl = [0.45, 0.38, 0.6];
      for (let k = 0; k < 3; k++) {
        const o = ac.createOscillator();
        o.type = 'sawtooth';
        o.detune.value = det[k];
        wobAmt.connect(o.detune);
        const base = f0 * mult[k];
        o.frequency.setValueAtTime(base * 1.42, t);
        o.frequency.exponentialRampToValueAtTime(base * 0.6, t + dur);
        const og = ac.createGain();
        og.gain.value = lvl[k];
        o.connect(og);
        og.connect(shaper);
        o.start(t); o.stop(t + dur + 0.05);
      }

      // Breath: a noise band collapsing from a hiss to a rumble. Routed after
      // the clipper so it stays airy, but before the growl so it flutters too.
      const nz = noise(t, dur);
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1500 + 800 * i, t);
      bp.frequency.exponentialRampToValueAtTime(230, t + dur * 0.9);
      bp.Q.value = 2.2;
      nz.connect(bp);
      bp.connect(gainEnv(t, 0.1 + 0.17 * i, 0.14, dur, lp, dur * 0.35));

      // Chest hit on the onset so the roar has a front edge.
      const th = ac.createOscillator();
      th.type = 'sine';
      th.frequency.setValueAtTime(90, t);
      th.frequency.exponentialRampToValueAtTime(34, t + 0.22);
      th.connect(gainEnv(t, 0.16 + 0.2 * i, 0.008, 0.3, sfxBus));
      th.start(t); th.stop(t + 0.34);
    } catch (err) {
      fail(err);
    }
  }

  /** One note of the level-up stinger: a dark, slightly detuned stab. */
  function stinger(t, freq, peak, dur) {
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2200, t);
    lp.frequency.exponentialRampToValueAtTime(700, t + dur);
    lp.Q.value = 2.4;
    lp.connect(gainEnv(t, peak, 0.012, dur, sfxBus));

    // A saw for the bite and a triangle an octave under it for the weight,
    // detuned against each other so the stab never sounds like a clean note.
    const VOICES = [
      { type: 'sawtooth', mult: 1, detune: -7, level: 0.5 },
      { type: 'triangle', mult: 0.5, detune: 9, level: 0.42 },
    ];
    for (let k = 0; k < VOICES.length; k++) {
      const v = VOICES[k];
      const o = ac.createOscillator();
      o.type = v.type;
      o.frequency.value = freq * v.mult;
      o.detune.value = v.detune;
      const g = ac.createGain();
      g.gain.value = v.level;
      o.connect(g);
      g.connect(lp);
      o.start(t); o.stop(t + dur + 0.05);
    }
  }

  /**
   * Threat tier up. A rising minor sixth into a low hit: a fifth would sound
   * heroic and a tritone would sound comic, but a minor sixth just sounds like
   * bad news arriving. The root sags a semitone or so per tier.
   */
  function levelup(e) {
    if (!live()) return;
    try {
      const t = ac.currentTime + 0.005;
      // The debug/smoke path can push four tiers through in a single tick.
      if (t - lastLevelupAt < 0.15) return;
      lastLevelupAt = t;

      const tiers = Math.max(1, CONFIG.levels.length - 1);
      const idx = Number(e && e.index != null ? e.index : (state0 ? state0.levelIndex : 0)) || 0;
      const i = clamp(idx / tiers, 0, 1);

      const root = 146.83 * semi(-2 * i); // D3, dropping toward C3 at the top
      stinger(t, root, 0.3, 0.22);
      stinger(t + 0.15, root * semi(8), 0.28, 0.26);

      // The hit.
      const ht = t + 0.36;
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(96, ht);
      o.frequency.exponentialRampToValueAtTime(30, ht + 0.45);
      o.connect(gainEnv(ht, 0.38 + 0.14 * i, 0.006, 0.8, sfxBus));
      o.start(ht); o.stop(ht + 0.9);

      const nz = noise(ht, 0.3);
      const sh = ac.createWaveShaper();
      sh.curve = driveSoft;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1800, ht);
      lp.frequency.exponentialRampToValueAtTime(220, ht + 0.28);
      nz.connect(sh);
      sh.connect(lp);
      lp.connect(gainEnv(ht, 0.16, 0.004, 0.3, sfxBus));
    } catch (err) {
      fail(err);
    }
  }

  /**
   * Death. A crunch on top of a long descending collapse, with everything else
   * in the mix ducked underneath so the last thing the player hears is this.
   */
  function caught() {
    if (!live()) return;
    try {
      const t = ac.currentTime + 0.005;

      // Duck the world. It comes back over ~1.5s so the game-over screen is
      // not sitting in total silence if the player waits before restarting.
      duck.gain.cancelScheduledValues(t);
      duck.gain.setValueAtTime(duck.gain.value, t);
      duck.gain.linearRampToValueAtTime(0.1, t + 0.05);
      duck.gain.setValueAtTime(0.1, t + 1.1);
      duck.gain.linearRampToValueAtTime(1, t + 2.6);

      // Crunch: hard-clipped noise through a collapsing lowpass.
      const nz = noise(t, 0.5);
      const sh = ac.createWaveShaper();
      sh.curve = driveHard;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(3200, t);
      lp.frequency.exponentialRampToValueAtTime(260, t + 0.42);
      lp.Q.value = 1.2;
      nz.connect(sh);
      sh.connect(lp);
      lp.connect(gainEnv(t, 0.5, 0.003, 0.46, deathBus));

      // A short, hard snap right at the front - the bone note.
      const snap = noise(t, 0.07);
      const bpf = ac.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 1900;
      bpf.Q.value = 5.5;
      snap.connect(bpf);
      bpf.connect(gainEnv(t, 0.3, 0.001, 0.06, deathBus));

      // Collapse: a saw falling three and a half octaves into a sub thud.
      const o = ac.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(330, t + 0.03);
      o.frequency.exponentialRampToValueAtTime(27, t + 1.45);
      const osh = ac.createWaveShaper();
      osh.curve = driveSoft;
      const olp = ac.createBiquadFilter();
      olp.type = 'lowpass';
      olp.frequency.setValueAtTime(1700, t);
      olp.frequency.exponentialRampToValueAtTime(130, t + 1.4);
      o.connect(osh);
      osh.connect(olp);
      olp.connect(gainEnv(t + 0.03, 0.34, 0.02, 1.6, deathBus, 0.5));
      o.start(t + 0.03); o.stop(t + 1.7);

      // Sub underneath it, so it lands in the chest on headphones.
      const sub = ac.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, t);
      sub.frequency.exponentialRampToValueAtTime(22, t + 1.5);
      sub.connect(gainEnv(t, 0.42, 0.01, 1.7, deathBus, 0.3));
      sub.start(t); sub.stop(t + 1.8);

      // The heartbeat stops dead rather than fading with the phase change.
      nextBeat = t + 3;
    } catch (err) {
      fail(err);
    }
  }

  // ------------------------------------------------------- adaptive layer

  /**
   * One thump of the heartbeat: a low sine with a fast envelope.
   *
   * Mobile workaround - a phone speaker rolls off hard below ~400 Hz, so the
   * 60 Hz fundamental is felt on headphones and simply absent on the handset.
   * A quiet triangle two octaves up rides along to give the built-in speaker
   * something it can actually move, without turning the thump into a beep.
   */
  function thump(t0, amp, fHi, fLo, dur) {
    const o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(fHi, t0);
    o.frequency.exponentialRampToValueAtTime(fLo, t0 + dur * 0.7);
    const g = ac.createGain();
    g.gain.setValueAtTime(EPS, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(amp, EPS * 2), t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(EPS, t0 + dur);
    g.gain.setValueAtTime(0, t0 + dur + 0.005);
    o.connect(g);
    g.connect(heartGain);
    o.start(t0); o.stop(t0 + dur + 0.02);

    // Speaker-audible partial. Decays faster than the sub so it reads as the
    // knock of the beat, not as a pitched note.
    const o2 = ac.createOscillator();
    o2.type = 'triangle';
    o2.frequency.setValueAtTime(fHi * 2.7, t0);
    o2.frequency.exponentialRampToValueAtTime(fLo * 2.4, t0 + dur * 0.5);
    o2.connect(gainEnv(t0, amp * 0.3, 0.008, dur * 0.6, heartGain));
    o2.start(t0); o2.stop(t0 + dur);

    // Chest body. Only worth the extra nodes once it is loud enough to hear,
    // which keeps a distant heartbeat close to free.
    if (amp > 0.08) {
      const nz = noise(t0, 0.08);
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 380;
      nz.connect(lp);
      lp.connect(gainEnv(t0, amp * 0.34, 0.004, 0.08, heartGain));
    }
  }

  /** Lub-dub. The second thump is quieter, lower and lands on the off-beat. */
  function scheduleBeat(t0, amp, interval) {
    const gap = clamp(interval * 0.3, 0.13, 0.26);
    thump(t0, amp, 66, 33, 0.24);
    thump(t0 + gap, amp * 0.72, 56, 29, 0.2);
  }

  /**
   * Per-frame adaptive layer. Everything scheduled here rides the AudioContext
   * clock, never requestAnimationFrame, so a dropped frame does not stutter
   * the heartbeat and a 120Hz display does not double it.
   */
  function update(dt, c) {
    if (!live()) return;
    const st = (c && c.state) || state0;
    if (!st) return;
    try {
      const t = ac.currentTime;
      const playing = st.phase === 'playing';
      const dread = clamp(Number(st.dread) || 0, 0, 1);

      // Pickup streak expires on the audio clock, not on frames.
      if (combo > 0 && t - lastCollectAt > 0.95) combo = 0;

      // --- drone ---------------------------------------------------------
      // Cutoff is squared against dread so the low end stays muffled and
      // ignorable through the early tiers, then opens up fast near the top.
      const gTarget = playing ? 0.014 + dread * 0.2 : 0;
      const cTarget = 110 + dread * dread * 900;
      if (Math.abs(gTarget - droneGainTarget) > 0.004) {
        droneGainTarget = gTarget;
        // setTargetAtTime, not a ramp: this is called every frame and a time
        // constant is far cheaper than a scheduled ramp per frame.
        droneGain.gain.setTargetAtTime(gTarget, t, playing ? 0.5 : 0.1);
      }
      if (Math.abs(cTarget - droneCutTarget) > 12) {
        droneCutTarget = cTarget;
        droneFilter.frequency.setTargetAtTime(cTarget, t, 0.6);
      }

      // --- heartbeat -----------------------------------------------------
      const prox = playing ? clamp(Number(st.monster.proximity) || 0, 0, 1) : 0;
      // Squared: genuinely inaudible while the monster is still a rumour, then
      // it comes up hard over the last third of the approach.
      const amp = prox * prox * (0.28 + 0.22 * dread);
      const bpm = 52 + Math.pow(prox, 1.4) * 112; // 52 resting -> ~164 panicked
      const interval = 60 / bpm;

      if (!playing || amp < 0.004) {
        // Park the clock just ahead of now so the first audible beat lands
        // immediately rather than replaying a backlog.
        nextBeat = t + 0.12;
      } else {
        if (nextBeat < t) nextBeat = t + 0.05; // returned from a hidden tab
        while (nextBeat < t + SCHED_AHEAD) {
          scheduleBeat(nextBeat, amp, interval);
          nextBeat += interval;
        }
      }
      updateFails = 0;
    } catch (err) {
      // A transient automation error must not kill the frame loop, but a
      // persistent one means the context is gone for good.
      if (++updateFails > 10) fail(err);
    }
  }

  return { resume, update, collect, jump, land, roar, levelup, caught };
}
