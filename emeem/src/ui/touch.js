/**
 * EMEEM - on-screen controls.
 *
 * Target device: a Samsung Galaxy S25 Ultra held in LANDSCAPE with two thumbs.
 * Left thumb rests on a four-way arrow cross in the bottom-left corner, right
 * thumb on a big JUMP disc in the bottom-right. Everything below follows from
 * that: sizes are thumb-sized, hit areas are bigger than the art, and every
 * code path assumes several fingers are down at once.
 *
 * Axis contract (see main.js / player.js - the chase camera never rotates):
 *   UP    -> state.input.z = +1  (player travels toward -Z, "up" the screen)
 *   DOWN  -> state.input.z = -1
 *   RIGHT -> state.input.x = +1
 *   LEFT  -> state.input.x = -1
 * Opposing buttons cancel to 0, adjacent ones combine into a diagonal.
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

/** Ordered so grid placement below reads like the physical cross. */
const ARROWS = [
  { act: 'up', label: 'Move up' },
  { act: 'left', label: 'Move left' },
  { act: 'right', label: 'Move right' },
  { act: 'down', label: 'Move down' },
];

/**
 * One chunky chevron-triangle, pointing up; the other three directions are the
 * same node rotated by CSS, so the browser uploads a single path.
 */
const ARROW_SVG =
  '<svg class="' + PRE + '-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 4.2 L20.4 18.6 Q20.8 19.6 19.8 19.3 L12 16.4 L4.2 19.3 Q3.2 19.6 3.6 18.6 Z"/></svg>';

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

.${PRE}-pad{
  position:absolute;
  left:calc(var(--safe-l,0px) + var(--${PRE}-edge));
  bottom:calc(var(--safe-b,0px) + var(--${PRE}-edge));
  display:grid;
  grid-template-columns:repeat(3,var(--${PRE}-a));
  grid-template-rows:repeat(3,var(--${PRE}-a));
  gap:var(--${PRE}-g);
}

.${PRE}-btn{
  position:relative;
  display:flex; align-items:center; justify-content:center;
  pointer-events:auto; touch-action:none;
  color:#fff;
  /* Dark translucent, not light: the world behind runs from a bright blue sky
     at level 0 to near-black at THE END, and a dark chip with a white rim is
     the only fill that stays legible across both ends of that ramp. */
  background:rgba(16,10,24,.32);
  border:2px solid rgba(255,255,255,.5);
  border-radius:20px;
  /* Static shadow, never animated: it lifts the chip off the bright level-0
     grass, where a flat translucent square otherwise dissolves into the world. */
  box-shadow:0 2px 10px rgba(0,0,0,.32);
  transition:background-color 70ms linear,border-color 70ms linear,transform 70ms ease;
  will-change:transform;
}
/* The real thumb target: a transparent overlay wider than the art. Thumbs are
   imprecise and the visual button is only the part you can see. */
.${PRE}-btn::before{
  content:""; position:absolute; inset:calc(-1 * var(--${PRE}-pad));
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

.${PRE}-a-up   { grid-area:1 / 2 / 2 / 3; --${PRE}-pad:${ARROW_PAD}px; }
.${PRE}-a-left { grid-area:2 / 1 / 3 / 2; --${PRE}-pad:${ARROW_PAD}px; }
.${PRE}-a-right{ grid-area:2 / 3 / 3 / 4; --${PRE}-pad:${ARROW_PAD}px; }
.${PRE}-a-down { grid-area:3 / 2 / 4 / 3; --${PRE}-pad:${ARROW_PAD}px; }
.${PRE}-a-down  .${PRE}-ico{ transform:rotate(180deg); }
.${PRE}-a-left  .${PRE}-ico{ transform:rotate(-90deg); }
.${PRE}-a-right .${PRE}-ico{ transform:rotate(90deg); }

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
  const holders = Object.assign(Object.create(null), {
    up: new Set(), down: new Set(), left: new Set(), right: new Set(), jump: new Set(),
  });
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
    // Opposing directions cancel; a held pair reads as neutral, not as a jitter.
    state.input.x = (holders.right.size ? 1 : 0) - (holders.left.size ? 1 : 0);
    state.input.z = (holders.up.size ? 1 : 0) - (holders.down.size ? 1 : 0);
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
      zones.push({
        act,
        x0: r.left - pad, y0: r.top - pad,
        x1: r.right + pad, y1: r.bottom + pad,
        cx: (r.left + r.right) * 0.5, cy: (r.top + r.bottom) * 0.5,
      });
    }
    zonesDirty = false;
  }

  /**
   * Which button is under (x,y)? The padded rects overlap at the diagonal
   * corners of the cross, so ties go to the nearest centre - that is the button
   * the thumb is actually closest to.
   */
  function hitTest(x, y) {
    if (zonesDirty) measure();
    let best = null;
    let bestD = Infinity;
    for (let i = 0; i < zones.length; i++) {
      const z = zones[i];
      if (x < z.x0 || x > z.x1 || y < z.y0 || y > z.y1) continue;
      const dx = x - z.cx;
      const dy = y - z.cy;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = z.act; }
    }
    return best;
  }

  // --------------------------------------------------------------------- DOM
  let layer = null;
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

    for (const { act, label } of ARROWS) {
      const b = document.createElement('div');
      b.className = `${PRE}-btn ${PRE}-a-${act}`;
      b.setAttribute('role', 'button');
      b.setAttribute('aria-label', label);
      b.innerHTML = ARROW_SVG;
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
  function onPointerDown(e) {
    const act = e.currentTarget && e.currentTarget.dataset
      ? e.currentTarget.dataset[`${PRE}Act`]
      : null;
    if (!act) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // Stops Android synthesising mouse events, text selection and the
    // long-press callout on top of the press we are already handling.
    if (e.cancelable) e.preventDefault();
    // Capture keeps the stream flowing even if the layer is restyled mid-press;
    // events still bubble to window, where the move/up handlers live.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* unsupported */ }
    if (zonesDirty) measure();
    // A fresh down for an id we still believe is held means its up never
    // arrived (released outside the window, event swallowed by the browser, a
    // mouse whose pointerId is reused for every click). Drop the old hold or
    // that button stays down for the rest of the run - the exact stuck-arrow
    // failure everything else in this file guards against.
    const stale = pointers.get(e.pointerId);
    if (stale) release(stale, 'p' + e.pointerId);
    pointers.set(e.pointerId, act);
    press(act, 'p' + e.pointerId);
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
    const next = hitTest(e.clientX, e.clientY);
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
      styleEl = null;
      zones.length = 0;
      pointers.clear();
      for (const act of Object.keys(holders)) holders[act].clear();
      for (const act of Object.keys(els)) delete els[act];
    },
  };
}
