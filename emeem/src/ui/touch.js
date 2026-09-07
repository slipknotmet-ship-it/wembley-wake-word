/**
 * EMEEM - on-screen controls.
 *
 * Target device: a Samsung Galaxy S25 Ultra held in LANDSCAPE with two thumbs.
 * Left thumb rests on an EIGHT-way arrow pad in the bottom-left corner, right
 * thumb on a big JUMP disc in the bottom-right. Everything below follows from
 * that: sizes are thumb-sized, hit areas are bigger than the art, and every
 * code path assumes several fingers are down at once.
 *
 * Axis contract (see main.js / player.js - the chase camera never rotates):
 *   UP    -> state.input.z = +1  (player travels toward -Z, "up" the screen)
 *   DOWN  -> state.input.z = -1
 *   RIGHT -> state.input.x = +1
 *   LEFT  -> state.input.x = -1
 * Opposing buttons cancel to 0.
 *
 * A DIAGONAL IS ITS OWN ACTION, not two cardinals pressed together. That is
 * the single most important decision in this file. The tempting alternative -
 * one corner button calling press('up', src) and press('left', src) - puts the
 * same source id in two Sets, and `pointers` maps a pointerId to ONE scalar
 * action, so onPointerMove's `if (prev) release(prev, src)` would release half
 * of what it pressed and strand 'p3' in holders.left with no code path left in
 * this file that could ever clear it. A stuck arrow runs the hand into the
 * monster on its own. Atomic actions make that arithmetically impossible:
 *
 *   INVARIANT A: for any source id, the number of Sets in `holders` that
 *   contain it is 0 or 1. Held by there being no function anywhere that adds
 *   one source to two Sets.
 *
 * Two fingers on two cardinals still combine, because apply() ORs the axis
 * bits rather than tracking which button produced them.
 */

/** Class prefix, unique enough that no other module can collide with it. */
const PRE = 'emtc';

/**
 * Invisible hit padding, in CSS px, grown around each button. Declared here
 * and interpolated into both the stylesheet (::before overlay, so the browser
 * hit-tests the same area) and the JS rect test, so the two can never drift.
 * Jump gets more slack than the arrows: a missed arrow costs you a step, a
 * missed jump costs you the run.
 */
const ARROW_PAD = 14;
const JUMP_PAD = 20;

/**
 * Hysteresis, in CSS px, granted to the direction a pointer ALREADY holds when
 * deciding what it holds next.
 *
 * The four-way cross touched only at its corners, so a resting thumb almost
 * never sat on a seam. A filled 3x3 block has twelve full-length seams and a
 * thumb rests on one constantly. A seam is the perpendicular bisector of two
 * cell centres - x=80 between UP (cx 122) and UP-LEFT (cx 38) - and a thumb
 * parked there with nothing but capacitive noise flips direction on almost
 * every move event: a release/press/apply cycle at pointermove rate, which
 * reads as the hand juddering while the thumb is completely still.
 *
 * Measured, 600 move events on a stationary thumb, by jitter amplitude
 * (peak-to-peak px) - hand-overs, of which the correct answer is 0:
 *
 *          0.6px  1.2px   2px   3px   4px   6px   8px
 *   stick 0   278    278   278   278   278   278   278
 *   stick 2     0      0     0    85   132   186   210
 *   stick 4     0      0     0     0     0    85   132
 *   stick 6     0      0     0     0     0     0    69
 *
 * 2 would pass a sub-pixel test and fail a real thumb. 6 absorbs +/-3px of
 * noise while shifting each seam by only DIR_STICK/2 = 3px - 3.6% of the 84px
 * centre pitch, and 15% of the 20px band where two collars already overlap.
 * Every one of the 56 centre-to-centre slides still lands on the right button
 * at both cell sizes, so nothing is made unreachable.
 *
 * It is a BIAS, never a lock: the bounds test runs first, so leaving a padded
 * rect always drops the direction.
 */
const DIR_STICK = 6;

/**
 * The eight pad buttons, in DOM order - grid-area does the visual placement, so
 * DOM order is free to differ, and CARDINALS MUST COME FIRST for two reasons:
 *
 *   1. tools/stress.mjs classifies controls by walking document order with a
 *      first-match else-if chain, and "Move up and left" matches /up|forward|
 *      north/. The exact data-dir branch added there in this same change is the
 *      real fix; cardinals-first is the second belt and costs nothing.
 *   2. `els` insertion order IS `zones` order, and hitTest breaks a distance
 *      tie with a strict `<`. At the one exact 3-way tie point per corner,
 *      cardinals-first makes the cardinal win - i.e. the genuinely ambiguous
 *      points keep behaving the way they do today.
 *
 * `cls` deliberately carries no "up"/"down"/"left"/"right" substring, again
 * for (1): the class name is part of the string that classifier matches on.
 */
const ARROWS = [
  { act: 'up',        cls: 'n',  label: 'Move up',            area: '1 / 2 / 2 / 3', rot: 0 },
  { act: 'left',      cls: 'w',  label: 'Move left',          area: '2 / 1 / 3 / 2', rot: -90 },
  { act: 'right',     cls: 'e',  label: 'Move right',         area: '2 / 3 / 3 / 4', rot: 90 },
  { act: 'down',      cls: 's',  label: 'Move down',          area: '3 / 2 / 4 / 3', rot: 180 },
  { act: 'upleft',    cls: 'nw', label: 'Move up and left',   area: '1 / 1 / 2 / 2', rot: -45,  diag: true },
  { act: 'upright',   cls: 'ne', label: 'Move up and right',  area: '1 / 3 / 2 / 4', rot: 45,   diag: true },
  { act: 'downleft',  cls: 'sw', label: 'Move down and left', area: '3 / 1 / 4 / 2', rot: -135, diag: true },
  { act: 'downright', cls: 'se', label: 'Move down and right',area: '3 / 3 / 4 / 4', rot: 135,  diag: true },
];

/**
 * Every movement action and the axis vector it contributes. `holders` is BUILT
 * from this and apply() ITERATES it, so an action cannot exist in one and be
 * missing from the other - which is exactly what the old hard-coded apply()
 * risked, reading four fixed Sets while press/release/releaseKeys walked
 * Object.keys(holders). 'jump' is deliberately absent: it is not a direction.
 */
const AXIS = Object.assign(Object.create(null), {
  up:        { x:  0, z:  1 },
  left:      { x: -1, z:  0 },
  right:     { x:  1, z:  0 },
  down:      { x:  0, z: -1 },
  upleft:    { x: -1, z:  1 },
  upright:   { x:  1, z:  1 },
  downleft:  { x: -1, z: -1 },
  downright: { x:  1, z: -1 },
});
const AXIS_KEYS = Object.keys(AXIS);

// A button whose action has no AXIS entry would press a Set that apply() never
// reads: an arrow that lights up and does nothing. Deterministic at module
// load, so it can only ever fire on the first load after someone edits one of
// these two tables and not the other.
for (const a of ARROWS) {
  if (!AXIS[a.act]) throw new Error(`${PRE}: ARROWS has "${a.act}" with no AXIS entry`);
}

/**
 * Grid placement and glyph rotation, generated from ARROWS so the table stays
 * the single source of truth. A ninth button cannot be added without also
 * getting its placement.
 */
const ARROW_CSS = ARROWS.map((a) =>
  `.${PRE}-a-${a.cls}{ grid-area:${a.area}; }` +
  (a.rot ? `\n.${PRE}-a-${a.cls} .${PRE}-ico{ transform:rotate(${a.rot}deg); }` : '')
).join('\n');

/**
 * One chunky chevron-triangle, pointing up; the other three directions are the
 * same node rotated by CSS, so the browser uploads a single path.
 */
const ARROW_SVG =
  '<svg class="' + PRE + '-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 4.2 L20.4 18.6 Q20.8 19.6 19.8 19.3 L12 16.4 L4.2 19.3 Q3.2 19.6 3.6 18.6 Z"/></svg>';

/**
 * The diagonals get their OWN glyph, and it is a STEMMED arrow rather than the
 * chevron above at 45deg.
 *
 * Rotating the chevron was the obvious move and it does not read. Eight
 * candidate shapes were rendered at all four diagonal angles and looked at:
 * the chevron, a plain triangle, a narrow triangle, a very narrow triangle and
 * a rounded triangle ALL read as pointing at a wing rather than at the apex -
 * an up-left triangle reads as pointing right. A bare triangle at 45deg simply
 * does not carry an axis; the eye picks the longest edge and follows it.
 *
 * A stem fixes it outright, because the shaft states the axis and the head only
 * has to say which end. Same 45deg steps, so one shape still covers all four
 * corners. It differs from the cardinals' chevron on purpose: the two tiers of
 * button should not be mistaken for each other anyway.
 */
const DIAG_SVG =
  '<svg class="' + PRE + '-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 3 L20.5 11.5 L17.9 14.1 L13.8 10 L13.8 21 L10.2 21 L10.2 10 L6.1 14.1 L3.5 11.5 Z"/></svg>';

/**
 * NOTE ON MOBILE COST: no backdrop-filter and no box-shadow animation here.
 * Blurring a translucent panel over a live WebGL canvas forces the compositor
 * to read the framebuffer back every single frame, which on an Adreno costs
 * more than the game does. Flat rgba fills plus transform/opacity transitions
 * stay entirely on the compositor.
 */
const CSS = `
.${PRE}-layer{
  position:absolute; inset:0; z-index:2;
  --${PRE}-a:76px;            /* arrow button edge  */
  --${PRE}-g:8px;             /* gap inside the cross */
  --${PRE}-j:104px;           /* jump disc diameter */
  --${PRE}-edge:18px;         /* inset from the safe-area edges */
  --${PRE}-bw:2px;            /* button border - the hit-collar maths needs it */
  opacity:1; visibility:visible;
  transition:opacity 170ms ease;
  touch-action:none;
  -webkit-user-select:none; user-select:none;
  -webkit-touch-callout:none;
  font:600 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
}
/* Hidden with visibility+opacity rather than display, so the buttons keep
   their boxes and the cached hit rects stay valid across a hide/show. */
.${PRE}-layer.${PRE}-off{ opacity:0; visibility:hidden; }
.${PRE}-layer.${PRE}-off .${PRE}-btn{ pointer-events:none; }
/* Mandatory companion to the pointer-events:auto on .${PRE}-pad below: without
   it a hidden pad still swallows every tap in the bottom-left 244x244 of the
   menu and the game-over card. */
.${PRE}-layer.${PRE}-off .${PRE}-pad{ pointer-events:none; }

.${PRE}-pad{
  position:absolute;
  left:calc(var(--safe-l,0px) + var(--${PRE}-edge));
  bottom:calc(var(--safe-b,0px) + var(--${PRE}-edge));
  display:grid;
  grid-template-columns:repeat(3,var(--${PRE}-a));
  grid-template-rows:repeat(3,var(--${PRE}-a));
  gap:var(--${PRE}-g);
  /* The pad itself is a target, so a press landing on the 64x64 hole in the
     middle of the block (50x50 shrunk) or in an 8px gutter is still TRACKED.
     It presses nothing - it enters the pointers map as null, the same state a slide
     off the pad already produces - but it means a thumb that lands dead centre
     and slides onto an arrow engages, instead of falling through to the canvas
     and doing nothing at all until it is lifted and put down again. */
  pointer-events:auto;
}

.${PRE}-btn{
  position:relative;
  display:flex; align-items:center; justify-content:center;
  pointer-events:auto; touch-action:none;
  color:#fff;
  /* Declared on the BASE class, not once per direction. A variant that forgot
     it would make calc(-1 * var(--${PRE}-pad)) invalid at computed-value time:
     the inset falls back to auto, the collar silently becomes 0x0, and
     measure() carries on adding ARROW_PAD to a rect nothing can hit. Four new
     variants would have been four new chances to forget; a variant can now
     only override it, never omit it. */
  --${PRE}-pad:${ARROW_PAD}px;
  /* Dark translucent, not light: the world behind runs from a bright blue sky
     at level 0 to near-black at THE END, and a dark chip with a white rim is
     the only fill that stays legible across both ends of that ramp. */
  background:rgba(16,10,24,.32);
  border:var(--${PRE}-bw) solid rgba(255,255,255,.5);
  border-radius:20px;
  /* Static shadow, never animated: it lifts the chip off the bright level-0
     grass, where a flat translucent square otherwise dissolves into the world. */
  box-shadow:0 2px 10px rgba(0,0,0,.32);
  transition:background-color 70ms linear,border-color 70ms linear,transform 70ms ease;
  will-change:transform;
}
/* The real thumb target: a transparent overlay wider than the art. Thumbs are
   imprecise and the visual button is only the part you can see.
   The border width has to be ADDED BACK. An absolutely positioned child is laid
   out against its containing block's PADDING box, and index.html sets
   * { box-sizing: border-box }, so the padding box is the 76px cell MINUS the
   2px border on each side. A plain inset:-14px therefore spans 72+28 = 100px
   while measure() grows the 76px border box to 104px - a 2px band all the way
   round where the JS rect test says "hit" but no element is there to receive
   the pointerdown. That band exists today; nine buttons have 2.25x more
   perimeter to hide it in. */
.${PRE}-btn::before{
  content:""; position:absolute;
  inset:calc(-1 * (var(--${PRE}-pad) + var(--${PRE}-bw)));
}
.${PRE}-btn.${PRE}-down{
  background:rgba(255,255,255,.9);
  border-color:#fff;
  transform:scale(.93);
}
/* Pressed inverts the glyph too - a fill change alone is easy to miss under a
   thumb, and the press has to be unmistakable at arm's length in daylight. */
.${PRE}-btn.${PRE}-down .${PRE}-ico{ fill:#140c1e; opacity:1; }
/* No drop-shadow/backdrop filter on the glyph on purpose: the button scales on
   press, and a filtered child forces a re-raster on every step of that tween. */
.${PRE}-ico{ width:46%; height:46%; fill:#fff; opacity:.95; }

${ARROW_CSS}

/* The diagonals are helpers, not the primary cross: identical box, identical
   collar, identical press feedback, just a quieter resting fill so the
   four-arm silhouette still reads at a glance and the pad does not turn into an
   anonymous 3x3 slab. Flat rgba only - no filter, no shadow, nothing animated.
   NO RESTING TRANSFORM: scale(.85) would look right and would shrink
   getBoundingClientRect() to 64.6px (52.7px shrunk), which breaks both the
   62px floor the stress suite asserts and every cached zone in measure(). */
.${PRE}-btn.${PRE}-diag:not(.${PRE}-down){
  background:rgba(16,10,24,.24);
  border-color:rgba(255,255,255,.34);
}
.${PRE}-btn.${PRE}-diag .${PRE}-ico{ width:42%; height:42%; }
.${PRE}-btn.${PRE}-diag:not(.${PRE}-down) .${PRE}-ico{ opacity:.9; }

.${PRE}-jump{
  position:absolute;
  right:calc(var(--safe-r,0px) + var(--${PRE}-edge));
  bottom:calc(var(--safe-b,0px) + var(--${PRE}-edge) + 4px);
  width:var(--${PRE}-j); height:var(--${PRE}-j);
  border-radius:50%;
  flex-direction:column; gap:3px;
  --${PRE}-pad:${JUMP_PAD}px;
  background:rgba(38,20,4,.38);
  border-color:rgba(255,206,110,.72);
  color:#ffd88a;
}
.${PRE}-jump .${PRE}-ico{ width:30%; height:30%; fill:#ffd88a; }
.${PRE}-jump .${PRE}-lbl{ font-weight:800; font-size:14px; letter-spacing:.14em; }
.${PRE}-jump.${PRE}-down{
  background:rgba(255,205,90,.95);
  border-color:#fff3d0;
  color:#1a1004;
  transform:scale(.94);
}
.${PRE}-jump.${PRE}-down .${PRE}-ico{ fill:#1a1004; }

/* Very short viewports (small landscape phones) would otherwise have the cross
   eating half the screen. The S25U is ~480 CSS px tall and stays full size. */
@media (max-height:400px){
  .${PRE}-layer{ --${PRE}-a:62px; --${PRE}-j:86px; --${PRE}-edge:12px; }
  .${PRE}-jump .${PRE}-lbl{ font-size:12px; }
}
`;

/**
 * Keyboard fallback so the game is playable and automatable on a desktop
 * browser. Keyed on event.code (layout independent) with an event.key fallback
 * for engines that omit code. W/A/S/D drive movement, Space jumps - W is NOT
 * bound to jump because it is the forward key of WASD.
 */
const KEY_MAP = Object.assign(Object.create(null), {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  Space: 'jump',
});
const KEY_FALLBACK = Object.assign(Object.create(null), {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', W: 'up', s: 'down', S: 'down', a: 'left', A: 'left', d: 'right', D: 'right',
  ' ': 'jump', Spacebar: 'jump',
});

export function createTouchControls(uiRootEl, ctx) {
  const { state, bus } = ctx;
  const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';

  /**
   * action -> set of source ids currently holding it. Refcounting by source
   * (one id per pointer, one per key) is what makes multi-touch, two fingers
   * on the same button, and "keyboard + touch at once" all behave.
   */
  // Null-prototype so a stray action name can never resolve to an inherited
  // Object member and blow up the guard clauses in press()/release().
  // BUILT from AXIS rather than hand-listed, so the set of directions that can
  // be held and the set apply() reads are the same set by construction.
  const holders = Object.create(null);
  for (const act of AXIS_KEYS) holders[act] = new Set();
  holders.jump = new Set();
  /** pointerId -> action currently engaged by that pointer (null = slid off). */
  const pointers = new Map();
  /** action -> element, for the pressed-state class. */
  const els = Object.create(null);
  /** Cached hit rectangles, rebuilt lazily after any layout-changing event. */
  const zones = [];

  let zonesDirty = true;
  let destroyed = false;
  const cleanups = [];

  function listen(target, type, fn, opts) {
    if (!target || typeof target.addEventListener !== 'function') return;
    target.addEventListener(type, fn, opts);
    cleanups.push(() => target.removeEventListener(type, fn, opts));
  }

  // ------------------------------------------------------------- input state
  /** Pushes the held set into state.input. Called only when something changes. */
  function apply() {
    if (destroyed) return;
    // Each axis is the DIFFERENCE OF TWO BOOLEANS, so state.input.x/z stay
    // inside {-1,0,1} no matter how many directions are held at once.
    //
    // Summing the AXIS vectors instead would let LEFT + UP-LEFT read x = -2,
    // and that would NOT fail loudly: player.js:362 does
    //     if (inLen > 1) { dx /= inLen; dz /= inLen; }
    // which NORMALISES rather than clamps, so an out-of-range x silently bends
    // the movement angle from -45 to -63 degrees and the hand walks somewhere
    // the player did not point.
    //
    // Opposing still cancels, including across kinds: UP-LEFT + DOWN-RIGHT is
    // x = 1-1 = 0, z = 1-1 = 0. Two fingers on two cardinals still combine into
    // a diagonal, because this ORs the bits and never asks which button set
    // them - which is what keeps the keyboard (W+A) bit-identical to before.
    let xp = 0, xn = 0, zp = 0, zn = 0;
    for (let i = 0; i < AXIS_KEYS.length; i++) {
      const act = AXIS_KEYS[i];
      if (holders[act].size === 0) continue;
      const v = AXIS[act];
      if (v.x > 0) xp = 1; else if (v.x < 0) xn = 1;
      if (v.z > 0) zp = 1; else if (v.z < 0) zn = 1;
    }
    state.input.x = xp - xn;
    state.input.z = zp - zn;
    state.input.jump = holders.jump.size > 0;
  }

  function press(act, src) {
    const set = holders[act];
    if (!set || set.has(src)) return;
    const edge = set.size === 0;
    set.add(src);
    if (edge) {
      if (els[act]) els[act].classList.add(`${PRE}-down`);
      // jumpPressed is an EDGE flag consumed and cleared by player.js. Only the
      // first source to take the button raises it, and only while a run is
      // live, so a press on the menu can never leak into the next run.
      if (act === 'jump' && state.phase === 'playing') state.input.jumpPressed = true;
    }
    apply();
  }

  function release(act, src) {
    const set = holders[act];
    if (!set || !set.delete(src)) return;
    if (set.size === 0 && els[act]) els[act].classList.remove(`${PRE}-down`);
    apply();
  }

  /** Drops every finger. Buttons vanishing under a thumb must not stick down. */
  function releasePointers() {
    if (pointers.size === 0) return;
    for (const [id, act] of pointers) if (act) release(act, 'p' + id);
    pointers.clear();
  }

  /** Drops every key. Used when we stop being able to observe keyup. */
  function releaseKeys() {
    for (const act of Object.keys(holders)) {
      // Source ids are tagged: 'k' + code for keys, 'p' + id for pointers.
      for (const src of Array.from(holders[act])) {
        if (src[0] === 'k') release(act, src);
      }
    }
  }

  function releaseAll() {
    releasePointers();
    releaseKeys();
    // Unconditional backstop, on the three paths where we have stopped being
    // able to observe an "up" at all: blur, visibilitychange and destroy().
    // Nine Set clears make a stuck direction structurally impossible here,
    // however the pointer and key bookkeeping got into its current state.
    // Deliberately NOT inside releasePointers(): onRunEnd() calls that one and
    // must leave a physically-held key alone, because it will still send keyup.
    for (const act of Object.keys(holders)) {
      if (holders[act].size) {
        holders[act].clear();
        if (els[act]) els[act].classList.remove(`${PRE}-down`);
      }
    }
    apply();
  }

  // ------------------------------------------------------------- hit testing
  function measure() {
    zones.length = 0;
    for (const act of Object.keys(els)) {
      const el = els[act];
      if (!el || typeof el.getBoundingClientRect !== 'function') continue;
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) continue; // never laid out (hidden container)
      const pad = act === 'jump' ? JUMP_PAD : ARROW_PAD;
      // getBoundingClientRect returns the TRANSFORMED box, and a button held at
      // the moment we measure carries `${PRE}-down`, i.e. transform:scale(.93).
      // Caching that would store the zone 2.66px tight on EVERY side (3.12px
      // for jump at .94) and keep it that way, because toggling the pressed
      // class does not raise zonesDirty - so the outer edge of that button's
      // collar goes dead to pointermove for the rest of the run, and the
      // direction is dropped with the thumb still physically on the button.
      // Exactly the failure the `${PRE}-diag` rule refuses a resting transform
      // to avoid; the press transform does it too, just intermittently.
      //
      // offsetWidth/offsetHeight are LAYOUT sizes and ignore transforms, and
      // the default transform-origin is the centre, so a scale leaves the
      // centre exactly where it is. Centre + layout size therefore rebuilds the
      // untransformed border box exactly, pressed or not. (Fractional layouts
      // round offsetWidth to an integer - at most half a pixel, against 2.66.)
      const cx = (r.left + r.right) * 0.5;
      const cy = (r.top + r.bottom) * 0.5;
      const hw = (el.offsetWidth || r.width) * 0.5;
      const hh = (el.offsetHeight || r.height) * 0.5;
      zones.push({
        act,
        x0: cx - hw - pad, y0: cy - hh - pad,
        x1: cx + hw + pad, y1: cy + hh + pad,
        cx, cy,
      });
    }
    zonesDirty = false;
  }

  /**
   * Which button is under (x,y)? The padded rects overlap along every seam of
   * the 3x3 block, so ties go to the nearest centre - the button the thumb is
   * actually closest to. The nine centres sit on a uniform lattice of pitch
   * a + g, so those boundaries fall exactly down the middle of each 8px gutter
   * at both cell sizes, with nothing to tune and no slivers.
   *
   * `prev` is the direction this pointer already holds, and it gets a DIR_STICK
   * head start. That is a BIAS, NEVER A LOCK:
   *   - the bounds test runs FIRST, so leaving the padded rect always drops the
   *     direction, and sliding off the pad still returns null;
   *   - it is a per-call argument, not stored state, so no stale geometry can
   *     outlive a re-measure after a rotation;
   *   - called as hitTest(x, y), `prev` is undefined and this is byte-for-byte
   *     the old unbiased behaviour.
   */
  function hitTest(x, y, prev) {
    if (zonesDirty) measure();
    let best = null;
    let bestD = Infinity;
    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      if (x < z.x0 || x > z.x1 || y < z.y0 || y > z.y1) continue;
      const dx = x - z.cx;
      const dy = y - z.cy;
      // Real distance, not squared: DIR_STICK is in px and has to subtract at
      // the same scale. Nine square roots per pointermove, at 240Hz at worst.
      let d = Math.sqrt(dx * dx + dy * dy);
      if (prev && z.act === prev) d -= DIR_STICK;
      if (d < bestD) { bestD = d; best = z.act; }
    }
    return best;
  }

  // --------------------------------------------------------------------- DOM
  let layer = null;
  /** The 3x3 block itself. It listens too - see .${PRE}-pad's pointer-events. */
  let padEl = null;
  let styleEl = null;
  let ownsStyle = false;

  if (hasDOM && uiRootEl && typeof uiRootEl.appendChild === 'function') {
    const styleId = `${PRE}-style`;
    styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = CSS;
      (document.head || document.documentElement).appendChild(styleEl);
      ownsStyle = true;
    }

    layer = document.createElement('div');
    layer.className = `${PRE}-layer`;
    // Inline, not stylesheet: index.html has `#ui-root > * { pointer-events:auto }`
    // and an ID selector outranks any class rule we could write. The layer must
    // stay click-through or it would swallow taps meant for the HUD overlays.
    layer.style.pointerEvents = 'none';

    const pad = document.createElement('div');
    pad.className = `${PRE}-pad`;
    padEl = pad;

    for (const { act, cls, label, diag } of ARROWS) {
      const b = document.createElement('div');
      b.className = `${PRE}-btn ${PRE}-a-${cls}` + (diag ? ` ${PRE}-diag` : '');
      b.setAttribute('role', 'button');
      b.setAttribute('aria-label', label);
      // Exact, machine-readable identity. tools/stress.mjs reads this instead
      // of pattern-matching an aria-label, where "Move up and left" matches a
      // /up|forward|north/ branch before it ever reaches /left|west/.
      b.dataset.dir = act;
      b.innerHTML = diag ? DIAG_SVG : ARROW_SVG;
      els[act] = b;
      pad.appendChild(b);
    }

    const jump = document.createElement('div');
    jump.className = `${PRE}-btn ${PRE}-jump`;
    jump.setAttribute('role', 'button');
    jump.setAttribute('aria-label', 'Jump');
    jump.innerHTML = ARROW_SVG + `<span class="${PRE}-lbl">JUMP</span>`;
    els.jump = jump;

    layer.appendChild(pad);
    layer.appendChild(jump);
    uiRootEl.appendChild(layer);
  }

  // ---------------------------------------------------------- pointer events
  function actForElement(el) {
    return el && el.dataset ? el.dataset[`${PRE}Act`] || null : null;
  }

  function onPointerDown(e) {
    const el = e.currentTarget;
    // The pad listens as well (the hole in its middle is inside it), and a
    // press on a BUTTON bubbles up to the pad too. Handle the bubbled copy
    // exactly once, on the node the browser actually hit. Pseudo-elements are
    // not event targets, so a press on a button's ::before collar still reports
    // the button itself as e.target.
    if (el === padEl && e.target !== padEl) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Stops Android synthesising mouse events, text selection and the
    // long-press callout on top of the press we are already handling.
    if (e.cancelable) e.preventDefault();
    // Capture keeps the stream flowing even if the layer is restyled mid-press;
    // events still bubble to window, where the move/up handlers live. It may
    // land on the pad rather than a button, which is harmless: capture only
    // retargets the stream, and lostpointercapture is bound above both.
    try { el.setPointerCapture(e.pointerId); } catch { /* unsupported */ }
    if (zonesDirty) measure();
    // ONE function decides what a coordinate means, and down and move both use
    // it. CSS resolves an overlap to the LAST sibling in DOM order; hitTest
    // resolves it to the NEAREST centre. Those already disagree inside the
    // overlap bands, so taking the action from the element would let a press
    // land on one direction and the very next move release it and press
    // another, without the thumb having travelled anywhere. With nine buttons
    // that seam runs the whole perimeter of every one of them. The element is
    // a fallback only, for a synthetic event carrying no coordinates.
    // No `prev` here: a fresh press must not inherit anyone's hysteresis.
    const act = hitTest(e.clientX, e.clientY, null) || actForElement(el);
    const src = 'p' + e.pointerId;
    // A fresh down for an id we still believe is held means its up never
    // arrived (released outside the window, event swallowed by the browser, a
    // mouse whose pointerId is reused for every click). Drop the old hold or
    // that button stays down for the rest of the run - the exact stuck-arrow
    // failure everything else in this file guards against.
    const stale = pointers.get(e.pointerId);
    if (stale) release(stale, src);
    // Track the pointer even when nothing is under it. That is precisely the
    // state a slide off the pad already produces, every end path already
    // handles it (`if (act) release(...)` skips null) and it adds no holder, so
    // it adds no stuck-input path. It is what lets a press starting in the dead
    // centre engage the moment the thumb reaches an arrow.
    pointers.set(e.pointerId, act || null);
    if (act) press(act, src);
  }

  /**
   * Thumbs roll. A pointer that started on LEFT and drifts onto UP has to hand
   * the press over, and one that drifts off the pad entirely has to let go -
   * while staying tracked, so sliding back re-engages without a new touch.
   */
  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    if (e.cancelable) e.preventDefault();
    const prev = pointers.get(e.pointerId);
    const next = hitTest(e.clientX, e.clientY, prev);
    if (next === prev) return;
    const src = 'p' + e.pointerId;
    if (prev) release(prev, src);
    if (next) press(next, src);
    pointers.set(e.pointerId, next);
  }

  function onPointerEnd(e) {
    if (!pointers.has(e.pointerId)) return;
    const act = pointers.get(e.pointerId);
    pointers.delete(e.pointerId);
    if (act) release(act, 'p' + e.pointerId);
  }

  function onContextMenu(e) {
    if (e.cancelable) e.preventDefault();
  }

  function onTouchStatic(e) {
    // Belt and braces alongside touch-action:none - some Android WebViews still
    // start a scroll/long-press gesture from a touch on a positioned element.
    if (e.cancelable) e.preventDefault();
  }

  if (layer) {
    for (const act of Object.keys(els)) {
      const el = els[act];
      el.dataset[`${PRE}Act`] = act;
      listen(el, 'pointerdown', onPointerDown);
      listen(el, 'touchstart', onTouchStatic, { passive: false });
      listen(el, 'touchmove', onTouchStatic, { passive: false });
      listen(el, 'contextmenu', onContextMenu);
      listen(el, 'dragstart', onContextMenu);
    }
    // The pad gets the same five, so a press in the dead centre or a gutter is
    // tracked rather than falling through to the canvas.
    listen(padEl, 'pointerdown', onPointerDown);
    listen(padEl, 'touchstart', onTouchStatic, { passive: false });
    listen(padEl, 'touchmove', onTouchStatic, { passive: false });
    listen(padEl, 'contextmenu', onContextMenu);
    listen(padEl, 'dragstart', onContextMenu);
    listen(layer, 'selectstart', onContextMenu);
    // lostpointercapture covers the case where the browser revokes the capture
    // (element removed, gesture stolen) without ever sending pointerup.
    listen(layer, 'lostpointercapture', onPointerEnd);
  }

  if (hasDOM) {
    listen(window, 'pointermove', onPointerMove, { passive: false });
    listen(window, 'pointerup', onPointerEnd);
    listen(window, 'pointercancel', onPointerEnd);
    // A pointer that leaves the window (desktop drag-out) never reports up.
    listen(window, 'pointerleave', onPointerEnd);
  }

  // --------------------------------------------------------- keyboard events
  function actForKey(e) {
    return KEY_MAP[e.code] || KEY_FALLBACK[e.key] || null;
  }

  function typingInAField(e) {
    const t = e.target;
    if (!t || !t.tagName) return false;
    const tag = t.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable === true;
  }

  function onKeyDown(e) {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || typingInAField(e)) return;
    const act = actForKey(e);
    if (!act) return;
    // Space scrolls the page and arrows scroll/focus-navigate by default.
    if (e.cancelable) e.preventDefault();
    press(act, 'k' + (e.code || e.key));
  }

  function onKeyUp(e) {
    const act = actForKey(e);
    if (!act) return;
    if (e.cancelable) e.preventDefault();
    release(act, 'k' + (e.code || e.key));
  }

  if (hasDOM) {
    listen(window, 'keydown', onKeyDown, { passive: false });
    listen(window, 'keyup', onKeyUp, { passive: false });
  }

  // ------------------------------------------------------- loss-of-focus etc
  /**
   * Pulling down the notification shade, taking a call or alt-tabbing all stop
   * the up events. Without this the last-held arrow stays down forever and the
   * hand runs into the monster on its own - the single worst bug this file can
   * ship, so it is handled from four different directions.
   */
  function onBlur() { releaseAll(); }
  function onVisibility() {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') releaseAll();
  }
  function invalidate() { zonesDirty = true; }

  if (hasDOM) {
    listen(window, 'blur', onBlur);
    listen(document, 'visibilitychange', onVisibility);
    listen(window, 'resize', invalidate);
    listen(window, 'orientationchange', invalidate);
    if (window.visualViewport) {
      listen(window.visualViewport, 'resize', invalidate);
      listen(window.visualViewport, 'scroll', invalidate);
    }
  }

  // ------------------------------------------------------------- visibility
  /**
   * The pad only exists during a run. This is driven by bus events rather than
   * a per-frame phase check so the main loop stays free of UI work.
   * NB: these handlers run BEFORE main.js's own 'start'/'caught' handlers
   * (registration order), so state.phase is still the OLD value in here - the
   * event itself is the truth, never state.phase.
   */
  function setVisible(on) {
    if (!layer) return;
    layer.classList.toggle(`${PRE}-off`, !on);
  }

  function onRunStart() {
    setVisible(true);
    zonesDirty = true;
    releasePointers(); // stale fingers from the game-over screen
    // main.js's resetState() zeroes state.input right after this handler
    // returns, so re-assert anything still physically held one frame later.
    if (hasDOM && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => { if (!destroyed) apply(); });
    }
  }

  function onRunEnd() {
    setVisible(false);
    // Only the fingers: a physically-held key will still send its own keyup.
    releasePointers();
    apply();
  }

  setVisible(state.phase === 'playing');

  cleanups.push(bus.on('start', onRunStart));
  cleanups.push(bus.on('restart', onRunStart));
  cleanups.push(bus.on('caught', onRunEnd));

  // ------------------------------------------------------------------ public
  return {
    /**
     * Read-only diagnostics for tools/stress.mjs. The game never calls this.
     * It exists so INVARIANT A can be asserted directly: state.input cannot
     * tell a stuck LEFT apart from a deliberate one, but a source id sitting
     * in two holder Sets is unambiguous.
     */
    snapshot() {
      const out = { pointers: [], holders: Object.create(null) };
      for (const [id, act] of pointers) out.pointers.push([id, act]);
      for (const act of Object.keys(holders)) out.holders[act] = Array.from(holders[act]);
      return out;
    },

    destroy() {
      if (destroyed) return;
      // Release BEFORE raising the flag: apply() no-ops once `destroyed` is
      // set, so flipping it first would leave a held arrow frozen into
      // state.input with nothing left alive to ever clear it.
      releaseAll();
      destroyed = true;
      for (const fn of cleanups) { try { fn(); } catch { /* already gone */ } }
      cleanups.length = 0;
      if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
      if (ownsStyle && styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
      layer = null;
      padEl = null;
      styleEl = null;
      zones.length = 0;
      pointers.clear();
      for (const act of Object.keys(holders)) holders[act].clear();
      for (const act of Object.keys(els)) delete els[act];
    },
  };
}
