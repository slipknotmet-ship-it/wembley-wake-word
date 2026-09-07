/**
 * EMEEM - heads-up display.
 *
 * Owns everything the player reads: score, best, the threat meter, the danger
 * vignette, the level-up banner and the start / game-over cards.
 *
 * Performance contract: update() runs on every single frame, so this file is
 * written to touch the DOM as little as physically possible.
 *   - every text node has a cached last-written value and is only assigned
 *     when the value actually changes;
 *   - every animated property is `opacity` or `transform` (composited), never
 *     width/height/top/left, so nothing here can trigger layout;
 *   - numeric writes are quantised before the compare, so a value that drifts
 *     by 0.0001 per frame does not produce 60 pointless CSSOM writes a second.
 *
 * The style sheet is injected once with a unique `emhud-` class prefix so it
 * cannot collide with ui/touch.js, which shares #ui-root.
 */

const STYLE_ID = 'emhud-style';
const TAU = Math.PI * 2;

/** Sub-headline for each threat tier, indexed to CONFIG.levels. */
const LEVEL_TAGLINES = [
  'IT IS WATCHING',
  'IT HAS NOTICED YOU',
  'IT IS HUNTING NOW',
  'FASTER. ANGRIER.',
  'IT IS STARVING',
  'DO NOT LOOK BACK',
  'IT IS ALMOST ON YOU',
  'RUN.',
];

const FALLBACK_CANDY = [0xff4d5a, 0xffb43d, 0x3ddc84, 0x4da3ff, 0xc46bff, 0xfff06b];

/**
 * Clamp to 0..1. Written so a NaN lands on 0 rather than propagating: this is
 * the funnel every proximity, opacity and smoothstep value passes through, and
 * one NaN reaching `smoothProx` would poison the damped accumulator for the
 * rest of the run (and write an invalid opacity every frame forever).
 */
function clamp01(v) { return v > 0 ? (v < 1 ? v : 1) : 0; }

/** Hermite ramp: 0 below `a`, 1 above `b`, smooth in between. */
function smoothstep(a, b, v) {
  if (b === a) return v < a ? 0 : 1;
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}

function hexCss(n) {
  return '#' + ((n >>> 0) & 0xffffff).toString(16).padStart(6, '0');
}

const CSS = `
.emhud-root{
  position:absolute; inset:0; overflow:hidden;
  font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  color:#fff; z-index:60;
}
/* #ui-root > * forces pointer-events:auto with id specificity - out-specify it
   so the HUD never eats a tap meant for the D-pad underneath. */
#ui-root > .emhud-root{ pointer-events:none; }

/* ------------------------------------------------------------- vignette -- */
.emhud-vig{
  position:absolute; inset:-2px; opacity:0; pointer-events:none;
  will-change:opacity; contain:paint;
}
.emhud-vig-a{
  background:radial-gradient(ellipse 76% 64% at 50% 54%,
    rgba(120,0,14,0) 34%, rgba(126,2,16,.50) 74%, rgba(48,0,6,.94) 100%);
}
.emhud-vig-b{
  background:radial-gradient(ellipse 60% 50% at 50% 54%,
    rgba(255,26,26,0) 16%, rgba(255,30,26,.40) 66%, rgba(150,0,0,.96) 100%);
}

/* ----------------------------------------------------------- hud layer --- */
.emhud-layer{
  position:absolute; inset:0; pointer-events:none;
  transition:opacity .28s ease;
}
.emhud-layer.emhud-off{ opacity:0; }

.emhud-score{
  position:absolute;
  top:calc(var(--safe-t,0px) + 10px);
  left:calc(var(--safe-l,0px) + 16px);
  display:flex; align-items:center; gap:9px;
  transform-origin:left center; will-change:transform;
}
.emhud-chip{
  position:relative; flex:none;
  width:clamp(15px,3.6vh,22px); height:clamp(15px,3.6vh,22px);
  border-radius:50%;
  /* Glossy candy button: hot specular top-left, saturated body, dark rim. */
  background:radial-gradient(circle at 33% 27%,
    #ffffff 0%, rgba(255,255,255,.9) 7%, #ffa24d 30%, #ff4152 74%, #c11d38 100%);
  box-shadow:0 1px 3px rgba(0,0,0,.55), inset 0 -2px 4px rgba(110,0,20,.55);
}
.emhud-scorewrap{ position:relative; display:flex; align-items:baseline; }
.emhud-scoreglow{
  position:absolute; inset:-14% -22%; border-radius:40%; opacity:0;
  background:radial-gradient(ellipse at center, rgba(255,214,120,.85) 0%, rgba(255,150,60,0) 70%);
  will-change:opacity; pointer-events:none;
}
.emhud-scorenum{
  position:relative;
  font-size:clamp(28px,8vh,46px); font-weight:800; line-height:1;
  letter-spacing:-.02em; font-variant-numeric:tabular-nums;
  text-shadow:0 2px 0 rgba(0,0,0,.45), 0 0 14px rgba(255,180,90,.35);
}

.emhud-best{
  position:absolute;
  top:calc(var(--safe-t,0px) + 13px);
  right:calc(var(--safe-r,0px) + 16px);
  font-size:clamp(10px,2.6vh,14px); font-weight:700;
  letter-spacing:.16em; text-transform:uppercase;
  color:rgba(255,255,255,.62); font-variant-numeric:tabular-nums;
  text-shadow:0 1px 2px rgba(0,0,0,.6);
}
.emhud-best b{ color:rgba(255,255,255,.92); font-weight:800; letter-spacing:.06em; }

/* ----------------------------------------------------- golden slow timer -- */
/* Hung UNDER the threat meter on purpose: the two are about the same thing -
   how much trouble the Protector is - so they read as one column. It shares the
   meter's width, so nothing here can collide with the score (top-left), BEST
   and the portrait (top-right), the 244x244 arrow pad (bottom-left) or the JUMP
   disc (bottom-right). It is display:none when idle, so it costs no layout at
   all during an ordinary run. */
.emhud-slow{
  display:none; width:100%; flex-direction:column; align-items:center; gap:3px;
}
.emhud-slow.emhud-on{ display:flex; }
.emhud-slowname{
  font-size:clamp(9px,2.3vh,12px); font-weight:800;
  letter-spacing:.24em; text-transform:uppercase; white-space:nowrap;
  color:#ffe9a8; text-shadow:0 1px 3px rgba(0,0,0,.8);
}
.emhud-slowbar{
  position:relative; width:78%; height:clamp(5px,1.2vh,7px);
  border-radius:99px; overflow:hidden;
  background:rgba(10,4,10,.55);
  box-shadow:inset 0 0 0 1px rgba(255,220,120,.28);
}
.emhud-slowfill{
  position:absolute; inset:0; transform-origin:left center;
  background:linear-gradient(90deg,#ffe07a,#ffc21f);
}
/* The last second flashes, matching the emeem that bought it, so the warning
   that your time is nearly up uses the same language as the pickup. */
.emhud-slow.emhud-ending .emhud-slowname,
.emhud-slow.emhud-ending .emhud-slowfill{ animation:emhud-slowblink .32s steps(2,end) infinite; }
@keyframes emhud-slowblink{ 0%{opacity:1} 50%{opacity:.35} 100%{opacity:1} }

/* --------------------------------------------------------- threat meter -- */
.emhud-threat{
  position:absolute;
  top:calc(var(--safe-t,0px) + 9px);
  left:50%; transform:translateX(-50%);
  width:min(320px,38vw); min-width:168px;
  display:flex; flex-direction:column; align-items:center; gap:5px;
}
.emhud-tname{
  font-size:clamp(10px,2.7vh,14px); font-weight:800;
  letter-spacing:.28em; text-transform:uppercase; white-space:nowrap;
  color:rgba(255,236,236,.9); text-shadow:0 1px 3px rgba(0,0,0,.75);
}
.emhud-bar{
  position:relative; width:100%; height:clamp(7px,1.7vh,10px);
  border-radius:99px; overflow:hidden;
  background:rgba(10,4,10,.55);
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.14), 0 2px 6px rgba(0,0,0,.45);
}
.emhud-fill{
  position:absolute; inset:0; border-radius:99px;
  transform:scaleX(0); transform-origin:left center;
  will-change:transform;
}
.emhud-fill-warm{ position:absolute; inset:0; background:linear-gradient(90deg,#ffe066,#ffa72e); }
.emhud-fill-hot{ position:absolute; inset:0; opacity:0; background:linear-gradient(90deg,#ff7a2e,#ff1f2e); will-change:opacity; }
.emhud-barglow{
  position:absolute; inset:-4px; border-radius:99px; opacity:0; pointer-events:none;
  box-shadow:0 0 14px 3px rgba(255,40,40,.9); will-change:opacity;
}

/* -------------------------------------------------------- levelup banner - */
.emhud-banner{
  position:absolute; left:50%; top:34%; transform:translate(-50%,-50%);
  text-align:center; pointer-events:none; visibility:hidden; opacity:0;
  width:max-content; max-width:90vw;
}
.emhud-banner-in{ will-change:transform; }
.emhud-banner-name{
  font-size:clamp(26px,9vh,54px); font-weight:900; line-height:1;
  letter-spacing:.06em; text-transform:uppercase;
  color:#fff; text-shadow:0 0 24px rgba(255,40,40,.85), 0 3px 0 rgba(90,0,10,.7);
}
.emhud-banner-sub{
  margin-top:6px;
  font-size:clamp(10px,2.8vh,15px); font-weight:700;
  letter-spacing:.3em; text-transform:uppercase; color:#ffb3ae;
  text-shadow:0 1px 6px rgba(0,0,0,.8);
}

/* ---------------------------------------------------------- overlays ----- */
.emhud-ov{
  position:absolute; inset:0; pointer-events:auto;
  display:flex; align-items:center; justify-content:center;
  padding:calc(var(--safe-t,0px) + 10px) calc(var(--safe-r,0px) + 20px)
          calc(var(--safe-b,0px) + 10px) calc(var(--safe-l,0px) + 20px);
  opacity:1; visibility:visible;
  transition:opacity .26s ease, visibility 0s linear 0s;
  overflow:hidden;
}
.emhud-ov.emhud-off{
  opacity:0; visibility:hidden; pointer-events:none;
  transition:opacity .26s ease, visibility 0s linear .26s;
}
.emhud-ov.emhud-off .emhud-card{ transform:translateY(14px) scale(.97); }
.emhud-ov.emhud-off .emhud-btn{ animation-play-state:paused; }
.emhud-scrim{
  position:absolute; inset:0;
  background:
    radial-gradient(ellipse 70% 90% at 50% 42%, rgba(52,10,58,.62) 0%, rgba(8,3,14,.9) 68%, rgba(4,1,8,.97) 100%);
  backdrop-filter:blur(2px); -webkit-backdrop-filter:blur(2px);
}
.emhud-card{
  position:relative; text-align:center; max-width:640px;
  transform:translateY(0) scale(1);
  transition:transform .3s cubic-bezier(.2,.9,.28,1.1);
}

.emhud-title{
  font-size:clamp(38px,15vh,92px); font-weight:900; line-height:.92;
  letter-spacing:.02em; margin:0;
  filter:drop-shadow(0 4px 0 rgba(0,0,0,.45)) drop-shadow(0 0 26px rgba(255,120,60,.35));
}
.emhud-title span{ display:inline-block; }
.emhud-hook{
  margin:clamp(8px,2vh,14px) 0 0;
  font-size:clamp(12px,3.1vh,18px); font-weight:600; color:rgba(255,255,255,.9);
  text-shadow:0 1px 4px rgba(0,0,0,.7);
}
.emhud-hint{
  margin:clamp(5px,1.4vh,10px) 0 0;
  font-size:clamp(9px,2.2vh,12px); font-weight:600;
  letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.5);
}
.emhud-startbest{
  margin:clamp(5px,1.4vh,10px) 0 0;
  font-size:clamp(9px,2.2vh,12px); font-weight:800;
  letter-spacing:.18em; text-transform:uppercase; color:rgba(255,214,120,.85);
}

.emhud-dead{
  font-size:clamp(30px,12vh,72px); font-weight:900; line-height:1; margin:0;
  letter-spacing:.14em; color:#ff3b39;
  text-shadow:0 0 30px rgba(255,30,30,.6), 0 3px 0 rgba(70,0,6,.8);
}
.emhud-tomb{ margin-top:clamp(4px,1.2vh,9px); font-size:clamp(9px,2.2vh,12px);
  letter-spacing:.24em; text-transform:uppercase; color:rgba(255,180,180,.6); font-weight:700; }
/* --- the Protector's portrait, left edge ------------------------------- */
.emhud-port{
  /* Top-RIGHT, under the best score. The left side belongs to the D-pad, and
     the jump button owns the bottom right, so this corner is the one piece of
     the screen no thumb ever covers. */
  position:absolute; right:calc(var(--safe-r, 0px) + 10px);
  top:calc(var(--safe-t, 0px) + 52px);
  display:flex; flex-direction:column; align-items:center; gap:5px;
  pointer-events:none;
}
.emhud-portframe{
  position:relative; width:104px; height:104px; border-radius:14px;
  /* The border is the threat readout: it heats up as he closes. */
  border:2px solid rgba(255,255,255,.22);
  box-shadow:0 4px 18px rgba(0,0,0,.45);
  /* No fill. The renderer scissors the live portrait into this exact rectangle
     of the canvas UNDERNEATH, so any background here paints over it - which is
     precisely what made the panel render as a black square. */
  background:transparent;
  transition:border-color .25s linear, box-shadow .25s linear;
}
/* The hole is genuinely empty - the renderer scissors the live portrait into
   exactly this rectangle, so nothing may be painted over it. */
.emhud-porthole{ position:absolute; inset:0; border-radius:12px; overflow:hidden; }
.emhud-portring{
  position:absolute; inset:-13px; border-radius:20px; pointer-events:none;
}
/* A needle on the ring, pointing where he is relative to the way you face.
   Straight up means dead ahead; straight down means directly behind you. */
.emhud-needle{
  position:absolute; left:50%; top:50%; width:0; height:0;
  transform-origin:0 0; will-change:transform;
  /* An explicit resting colour: the needle is tinted from JS only when
     proximity MOVES, so at the start of a run it would otherwise inherit
     whatever currentColor happened to be. */
  color:#fff;
}
.emhud-needle::before{
  content:''; position:absolute; left:-7px; top:-72px;
  border-left:7px solid transparent; border-right:7px solid transparent;
  border-bottom:13px solid currentColor;
  filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));
}
.emhud-portdist{
  font:700 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
  letter-spacing:.06em; color:#fff; opacity:.78;
  text-shadow:0 1px 3px rgba(0,0,0,.7); font-variant-numeric:tabular-nums;
}
@media (max-height:400px){
  .emhud-portframe{ width:82px; height:82px; }
  .emhud-needle::before{ top:-60px; }
}

.emhud-delta{
  position:absolute; left:100%; top:-2px; margin-left:6px;
  font:800 20px/1 system-ui,-apple-system,sans-serif;
  letter-spacing:-.01em; white-space:nowrap; opacity:0;
  text-shadow:0 2px 6px rgba(0,0,0,.65); pointer-events:none;
  font-variant-numeric:tabular-nums;
}
.emhud-score{ position:relative; }

.emhud-scores{
  display:flex; align-items:flex-end; justify-content:center;
  gap:clamp(18px,6vw,44px); margin-top:clamp(8px,2.4vh,18px);
}
.emhud-stat{ display:flex; flex-direction:column; align-items:center; gap:2px; }
.emhud-stat-k{
  font-size:clamp(8px,2vh,11px); font-weight:800; letter-spacing:.22em;
  text-transform:uppercase; color:rgba(255,255,255,.45);
}
.emhud-stat-v{
  font-size:clamp(26px,8.5vh,52px); font-weight:900; line-height:1;
  font-variant-numeric:tabular-nums; text-shadow:0 2px 0 rgba(0,0,0,.5);
}
.emhud-stat-v.is-best{ color:rgba(255,255,255,.6); font-size:clamp(20px,6.4vh,38px); }
.emhud-newbest{
  display:inline-block; margin-top:clamp(6px,1.8vh,12px);
  padding:4px 14px; border-radius:99px;
  font-size:clamp(9px,2.2vh,12px); font-weight:900; letter-spacing:.2em;
  color:#2a1400; background:linear-gradient(90deg,#ffe066,#ffa72e);
  box-shadow:0 3px 12px rgba(255,170,40,.45);
  animation:emhud-flourish 1.1s ease-in-out infinite;
}
.emhud-newbest[hidden]{ display:none; }
@keyframes emhud-flourish{
  0%,100%{ transform:scale(1) rotate(-1.4deg); }
  50%{ transform:scale(1.07) rotate(1.4deg); }
}

.emhud-btn{
  -webkit-appearance:none; appearance:none; border:0; cursor:pointer;
  margin-top:clamp(10px,3vh,22px);
  padding:clamp(10px,2.6vh,17px) clamp(30px,8vw,62px);
  border-radius:99px; touch-action:manipulation; pointer-events:auto;
  font-family:inherit; font-size:clamp(15px,4vh,24px); font-weight:900;
  letter-spacing:.14em; text-transform:uppercase; color:#2a0d00;
  background:linear-gradient(180deg,#fff0b8 0%,#ffc63d 42%,#ff8a2e 100%);
  box-shadow:0 5px 0 #b3500f, 0 10px 26px rgba(255,140,40,.4),
             inset 0 2px 0 rgba(255,255,255,.75);
  transform:translateY(0);
  transition:transform .07s ease, box-shadow .07s ease;
  animation:emhud-breathe 2.4s ease-in-out infinite;
}
.emhud-btn:active{
  transform:translateY(4px);
  box-shadow:0 1px 0 #b3500f, 0 4px 12px rgba(255,140,40,.35),
             inset 0 2px 0 rgba(255,255,255,.6);
}
@keyframes emhud-breathe{
  0%,100%{ filter:brightness(1); }
  50%{ filter:brightness(1.12); }
}

@media (prefers-reduced-motion: reduce){
  .emhud-btn, .emhud-newbest{ animation:none; }
}
`;

/**
 * Builds the HUD inside `uiRootEl`.
 * @returns {{update:Function, showStart:Function, showGameOver:Function, hideOverlays:Function}}
 */
export function createHUD(uiRootEl, ctx) {
  const noop = () => {};
  // Headless smoke test: no document, no HUD, but still a valid API surface.
  if (typeof document === 'undefined' || !uiRootEl || typeof uiRootEl.appendChild !== 'function') {
    return { update: noop, showStart: noop, showGameOver: noop, hideOverlays: noop };
  }

  const CONFIG = (ctx && ctx.CONFIG) || {};
  /**
   * Full duration of the golden slow, so the bar knows what "full" means.
   * Computed HERE and not at module scope: this file takes CONFIG off ctx
   * rather than importing it, so a module-scope reference is a ReferenceError
   * at load - which takes the whole game down, since main.js builds the HUD
   * before anything renders.
   */
  const SLOW_FULL = (() => {
    const g = CONFIG.emeem && CONFIG.emeem.kinds && CONFIG.emeem.kinds.golden;
    const v = g && g.slowTime;
    return Number.isFinite(v) && v > 0 ? v : 6;
  })();
  const bus = (ctx && ctx.bus) || null;
  const stateRef = (ctx && ctx.state) || null;
  const candy = (CONFIG.palette && CONFIG.palette.emeems) || FALLBACK_CANDY;

  let reduceMotion = false;
  try {
    reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch { /* matchMedia missing under test harnesses */ }

  // -------------------------------------------------------------- styles --
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  const el = (tag, cls, parent, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  };

  // ---------------------------------------------------------------- tree --
  const root = el('div', 'emhud-root', uiRootEl);

  // Two stacked vignettes so the colour shift is an opacity cross-fade rather
  // than a per-frame gradient rebuild (which would repaint the whole screen).
  const vigA = el('div', 'emhud-vig emhud-vig-a', root);
  const vigB = el('div', 'emhud-vig emhud-vig-b', root);

  const layer = el('div', 'emhud-layer emhud-off', root);

  // score, top-left
  const scoreBox = el('div', 'emhud-score', layer);
  el('div', 'emhud-chip', scoreBox);
  const scoreWrap = el('div', 'emhud-scorewrap', scoreBox);
  const scoreGlow = el('div', 'emhud-scoreglow', scoreWrap);
  const scoreNum = el('div', 'emhud-scorenum', scoreWrap, '0');
  // Floats off the score on every pickup: what just happened, and whether it
  // helped. The score number alone is not enough - it changes silently, and a
  // player sprinting away from something does not audit an integer.
  const scoreDelta = el('div', 'emhud-delta', scoreBox, '');

  /**
   * The Protector's portrait, left edge.
   *
   * Two jobs, because they are the same question. The frame is an empty hole
   * that the renderer draws a live head-and-shoulders of the creature into, so
   * you can watch his face escalate without turning round - which the
   * fixed-heading camera does not let you do. Around it, a needle points at
   * where he actually IS, so you know which way to run.
   */
  const port = el('div', 'emhud-port', layer);
  const portFrame = el('div', 'emhud-portframe', port);
  const portHole = el('div', 'emhud-porthole', portFrame);   // the WebGL inset
  const portRing = el('div', 'emhud-portring', portFrame);
  const portNeedle = el('div', 'emhud-needle', portRing);
  const portDist = el('div', 'emhud-portdist', port, '--m');

  // best, top-right
  const bestBox = el('div', 'emhud-best', layer);
  bestBox.appendChild(document.createTextNode('Best '));
  const bestNum = el('b', null, bestBox, '0');

  // threat meter, top-centre
  const threat = el('div', 'emhud-threat', layer);
  const threatName = el('div', 'emhud-tname', threat, 'Watching');
  const bar = el('div', 'emhud-bar', threat);
  const fill = el('div', 'emhud-fill', bar);
  el('div', 'emhud-fill-warm', fill);
  const fillHot = el('div', 'emhud-fill-hot', fill);
  const barGlow = el('div', 'emhud-barglow', bar);

  // The golden slow readout, inside the threat column.
  const slowBox = el('div', 'emhud-slow', threat);
  el('div', 'emhud-slowname', slowBox, 'SLOWED');
  const slowBar = el('div', 'emhud-slowbar', slowBox);
  const slowFill = el('div', 'emhud-slowfill', slowBar);
  let slowShown = false;
  let slowEnding = false;

  // levelup banner
  const banner = el('div', 'emhud-banner', root);
  const bannerIn = el('div', 'emhud-banner-in', banner);
  const bannerName = el('div', 'emhud-banner-name', bannerIn, '');
  const bannerSub = el('div', 'emhud-banner-sub', bannerIn, '');

  // ------------------------------------------------------- start overlay --
  const startOv = el('div', 'emhud-ov emhud-off', root);
  el('div', 'emhud-scrim', startOv);
  const startCard = el('div', 'emhud-card', startOv);
  const title = el('h1', 'emhud-title', startCard);
  // Each letter takes a different candy-button colour.
  const word = 'EMEEM';
  for (let i = 0; i < word.length; i++) {
    const s = el('span', null, title, word[i]);
    s.style.color = hexCss(candy[i % candy.length]);
  }
  el('p', 'emhud-hook', startCard, 'Catch the emeems. Do not let him catch you.');
  el('p', 'emhud-hint', startCard, 'Pad to run · tap JUMP to hop · run into an emeem to pinch it');
  const startBest = el('p', 'emhud-startbest', startCard, '');
  const playBtn = el('button', 'emhud-btn', startCard, 'Play');
  playBtn.type = 'button';
  playBtn.setAttribute('aria-label', 'Play Emeem');

  // ---------------------------------------------------- game-over overlay -
  const overOv = el('div', 'emhud-ov emhud-off', root);
  el('div', 'emhud-scrim', overOv);
  const overCard = el('div', 'emhud-card', overOv);
  el('h1', 'emhud-dead', overCard, 'Caught');
  el('div', 'emhud-tomb', overCard, 'The Protector got you');
  const scores = el('div', 'emhud-scores', overCard);
  const statRun = el('div', 'emhud-stat', scores);
  el('div', 'emhud-stat-k', statRun, 'Emeems');
  const runVal = el('div', 'emhud-stat-v', statRun, '0');
  const statBest = el('div', 'emhud-stat', scores);
  el('div', 'emhud-stat-k', statBest, 'Best');
  const bestVal = el('div', 'emhud-stat-v is-best', statBest, '0');
  const newBest = el('div', 'emhud-newbest', overCard, 'New best!');
  newBest.hidden = true;
  const againBtn = el('button', 'emhud-btn', overCard, 'Run again');
  againBtn.type = 'button';
  againBtn.setAttribute('aria-label', 'Run again');

  // ------------------------------------------------------------- buttons --
  // `click` keeps the emit inside the user-gesture call stack, which is what
  // lets audio/sfx.js resume its AudioContext on mobile Safari and Chrome.
  const fireOnce = (fn) => {
    let armed = true;
    return (ev) => {
      if (ev && ev.preventDefault) ev.preventDefault();
      if (!armed) return;
      armed = false;
      // Re-arm next frame so a stray double-tap cannot start two runs.
      setTimeout(() => { armed = true; }, 350);
      fn();
    };
  };
  playBtn.addEventListener('click', fireOnce(() => { hideOverlays(); if (bus) bus.emit('start'); }));
  againBtn.addEventListener('click', fireOnce(() => { hideOverlays(); if (bus) bus.emit('restart'); }));

  // -------------------------------------------------------- write caches --
  const textSetter = (node) => {
    let last = null;
    return (v) => { if (v !== last) { last = v; node.textContent = v; } };
  };
  /** Quantised opacity writer: ignores sub-perceptual drift. */
  const opacitySetter = (node) => {
    let last = -1;
    return (v) => {
      const q = Math.round(clamp01(v) * 200) / 200;
      if (q !== last) { last = q; node.style.opacity = q; }
    };
  };

  const setScoreText = textSetter(scoreNum);
  const setBestText = textSetter(bestNum);
  const setThreatName = textSetter(threatName);
  const setBannerName = textSetter(bannerName);
  const setBannerSub = textSetter(bannerSub);
  const setVigA = opacitySetter(vigA);
  const setVigB = opacitySetter(vigB);
  const setHot = opacitySetter(fillHot);
  const setBarGlow = opacitySetter(barGlow);
  const setScoreGlow = opacitySetter(scoreGlow);
  const setBannerAlpha = opacitySetter(banner);

  let lastFill = -1;
  let lastScoreScale = -1;
  let lastBannerXf = '';
  let bannerShown = false;
  let hudOn = false;

  // --------------------------------------------------------- run-time fx --
  let prevScore = -1;
  let prevBest = -1;
  let pop = 0;              // 1 -> 0 score punch
  let pulse = 0;            // vignette heartbeat phase, radians
  let smoothProx = 0;       // proximity, damped so a teleporting monster
                            // (respawn, unstick) cannot strobe the screen
  let bannerT = 0;
  const BANNER_TIME = 2.2;
  const POP_TIME = 0.3;

  function showBanner(name, sub) {
    setBannerName(String(name || 'Danger').toUpperCase());
    setBannerSub(String(sub || 'The monster is faster').toUpperCase());
    bannerT = BANNER_TIME;
  }

  if (bus) {
    /**
     * Pickup feedback. A prize floats UP in its own colour; a penalty drops and
     * shakes in red, and punches the score itself, because losing points has to
     * feel like something going wrong rather than a number quietly getting
     * smaller.
     *
     * Driven by the Web Animations API rather than CSS classes: re-triggering a
     * CSS animation needs a class removal plus a forced reflow, and this fires
     * several times a second during a good streak.
     */
    bus.on('collect', (e) => {
      const pts = e && typeof e.points === 'number' ? e.points : 1;
      const bad = pts < 0;
      scoreDelta.textContent = (pts > 0 ? '+' : '') + pts;
      scoreDelta.style.color = bad ? '#ff5a48' : (e && e.kind === 'runner' ? '#ffd15c' : '#eaf5ea');
      try {
        scoreDelta.animate(
          bad
            ? [
                { opacity: 1, transform: 'translate(0,0) scale(1.15)' },
                { opacity: 1, transform: 'translate(3px,7px) scale(1)' },
                { opacity: 0, transform: 'translate(-2px,18px) scale(.95)' },
              ]
            : [
                { opacity: 1, transform: 'translate(0,4px) scale(.85)' },
                { opacity: 1, transform: 'translate(0,-6px) scale(1.2)' },
                { opacity: 0, transform: 'translate(0,-20px) scale(1)' },
              ],
          { duration: bad ? 900 : 700, easing: 'cubic-bezier(.2,.8,.3,1)' },
        );
        if (bad) {
          scoreNum.animate([
            { transform: 'translateX(0)', color: '#ff5a48' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)', color: '#fff' },
          ], { duration: 380, easing: 'ease-out' });
        }
      } catch { /* no Web Animations: the score still updates, just plainly */ }
    });

    bus.on('levelup', (e) => {
      const lvl = (e && e.level) || (stateRef && stateRef.level) || null;
      const idx = (e && typeof e.index === 'number')
        ? e.index
        : (stateRef ? stateRef.levelIndex : 0);
      showBanner(lvl && lvl.name ? lvl.name : 'Danger', LEVEL_TAGLINES[idx]);
    });
  }

  // ----------------------------------------------------------- overlays ---
  function showStart() {
    overOv.classList.add('emhud-off');
    const best = stateRef ? (stateRef.best | 0) : 0;
    startBest.textContent = best > 0 ? 'Best ' + best : '';
    startOv.classList.remove('emhud-off');
  }

  function showGameOver(score, best) {
    const s = Number.isFinite(score) ? score | 0 : 0;
    const b = Number.isFinite(best) ? best | 0 : 0;
    runVal.textContent = String(s);
    bestVal.textContent = String(b);
    // main.js folds the run into `best` before calling us, so a record run
    // arrives as score === best. Only celebrate a run that actually scored.
    newBest.hidden = !(s > 0 && s >= b);
    // Dying inside 2.2s of a tier-up is common (the tier-up is what speeds him
    // up); without this the banner ghosts through the card's scrim.
    bannerT = 0;
    startOv.classList.add('emhud-off');
    overOv.classList.remove('emhud-off');
  }

  function hideOverlays() {
    startOv.classList.add('emhud-off');
    overOv.classList.add('emhud-off');
    // Clear a banner left over from the previous run.
    bannerT = 0;
    // update() only writes the score transform while pop > 0, so zeroing pop
    // on its own would freeze the score box wherever the punch had got to.
    // Restarting mid-punch is reachable: collect, get caught, tap RUN AGAIN.
    pop = 0;
    if (lastScoreScale !== 1) { lastScoreScale = 1; scoreBox.style.transform = 'scale(1)'; }
    setScoreGlow(0);
  }

  // ------------------------------------------------------------- update ---
  // Portrait/bearing memos, so the DOM is only touched when a value moves.
  let prevBearing = 1e9;
  let prevDist = -1;
  let prevProx = -1;
  let portTick = 0;

  function update(dt, c) {
    const s = (c && c.state) || stateRef;
    if (!s) return;
    const step = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), 0.1) : 0;

    const playing = s.phase === 'playing';

    // --- golden slow readout ---------------------------------------------
    // scaleX rather than width: a transform stays on the compositor, where a
    // width animation would relayout the bar every frame of the six seconds.
    const slowT = playing ? (s.monster.slowT || 0) : 0;
    const on = slowT > 0;
    if (on !== slowShown) {
      slowShown = on;
      slowBox.classList.toggle('emhud-on', on);
    }
    if (on) {
      slowFill.style.transform = `scaleX(${Math.max(0, Math.min(1, slowT / SLOW_FULL))})`;
      const ending = slowT <= 1;
      if (ending !== slowEnding) {
        slowEnding = ending;
        slowBox.classList.toggle('emhud-ending', ending);
      }
    } else if (slowEnding) {
      slowEnding = false;
      slowBox.classList.remove('emhud-ending');
    }

    // --- the Protector's portrait and bearing -----------------------------
    // Hand the renderer the hole's rectangle in CSS pixels. Measured rather
    // than assumed, so the inset tracks the safe-area insets and the shorter
    // layout on a small screen without the two ever disagreeing.
    portTick -= step;
    if (portTick <= 0) {
      portTick = 0.25;
      const eng = c && c.engine;
      if (eng && eng.setPortraitRect) {
        if (playing) {
          const r = portHole.getBoundingClientRect();
          eng.setPortraitRect({ x: r.left, y: r.top, w: r.width, h: r.height });
        } else {
          eng.setPortraitRect(null);   // no inset over the menu or the game-over card
        }
      }
    }

    if (playing) {
      const dx = s.monster.pos.x - s.player.pos.x;
      const dz = s.monster.pos.z - s.player.pos.z;
      // Bearing relative to the way the player faces, which with a fixed-heading
      // camera is always screen-up = -Z. 0 is dead ahead, +90 is off to the
      // right, 180 is directly behind you.
      const bearing = Math.atan2(dx, -dz) * 180 / Math.PI;
      if (Math.abs(bearing - prevBearing) > 0.8) {
        prevBearing = bearing;
        portNeedle.style.transform = `rotate(${bearing.toFixed(1)}deg)`;
      }

      const dist = Math.hypot(dx, dz);
      const shown = dist < 100 ? Math.round(dist) : 99;
      if (shown !== prevDist) {
        prevDist = shown;
        portDist.textContent = `${shown}m`;
      }

      // Frame and needle heat together with proximity: white and calm when he
      // is far, hot and glowing when he is on you. Colour is the cheap channel
      // that survives being small.
      const prox = clamp01(s.monster.proximity);
      if (Math.abs(prox - prevProx) > 0.02) {
        prevProx = prox;
        const heat = Math.round(24 + 231 * prox);
        const cool = Math.round(255 - 210 * prox);
        const col = `rgb(${heat > 255 ? 255 : 255},${cool},${cool})`;
        portFrame.style.borderColor = prox > 0.02
          ? `rgba(${255},${cool},${cool},${(0.24 + 0.66 * prox).toFixed(2)})`
          : 'rgba(255,255,255,.22)';
        portFrame.style.boxShadow = `0 4px 18px rgba(0,0,0,.45), 0 0 ${Math.round(26 * prox)}px rgba(255,60,40,${(0.55 * prox).toFixed(2)})`;
        portNeedle.style.color = col;
      }
    }

    // --- score punch ------------------------------------------------------
    const score = s.score | 0;
    if (score !== prevScore) {
      if (prevScore >= 0 && score > prevScore) pop = 1;
      prevScore = score;
      setScoreText(String(score));
    }
    const best = s.best | 0;
    if (best !== prevBest) { prevBest = best; setBestText(String(best)); }

    if (pop > 0) {
      pop = Math.max(0, pop - step / POP_TIME);
      // easeOut on the way back down: instant punch, soft settle.
      const e = pop * (2 - pop);
      const scale = 1 + 0.34 * e;
      const q = Math.round(scale * 400) / 400;
      if (q !== lastScoreScale) {
        lastScoreScale = q;
        scoreBox.style.transform = 'scale(' + q + ')';
      }
      setScoreGlow(e * 0.9);
    }

    // --- threat readout ---------------------------------------------------
    const lvl = s.level || null;
    setThreatName(lvl && lvl.name ? lvl.name : 'Watching');

    // Damp toward the real proximity. 12/s reaches ~99% in a quarter second,
    // fast enough to feel live, slow enough to swallow a respawn jump.
    const target = playing ? clamp01(s.monster ? s.monster.proximity : 0) : 0;
    // k is 0 when step is 0, so a zero-length frame holds the current value
    // instead of snapping straight onto the target (which would defeat the
    // whole point of the damping the first time two rAFs share a timestamp).
    const k = 1 - Math.exp(-12 * step);
    smoothProx += (target - smoothProx) * k;
    const p = clamp01(smoothProx);

    // A bar pinned at zero reads as "broken", so it never fully empties.
    const fillAmt = 0.04 + p * 0.96;
    const fq = Math.round(fillAmt * 400) / 400;
    if (fq !== lastFill) {
      lastFill = fq;
      fill.style.transform = 'scaleX(' + fq + ')';
    }
    // Yellow -> red cross-fade; red starts creeping in around half range.
    setHot(smoothstep(0.32, 0.92, p));

    // --- heartbeat --------------------------------------------------------
    // Pulse rate climbs from ~0.9Hz at a comfortable distance to ~4Hz when it
    // is breathing on your neck. Squaring the positive half of the sine gives
    // a thump rather than a hum.
    if (!reduceMotion) {
      pulse += step * TAU * (0.9 + p * 3.1);
      if (pulse > TAU) pulse -= TAU;
    }
    const sn = Math.sin(pulse);
    const beat = reduceMotion ? 0.5 : (sn > 0 ? sn * sn : 0);

    // --- vignette ---------------------------------------------------------
    // Nothing at all until the monster is genuinely a threat, then it ramps
    // hard. This is the cheapest scare in the game; keep it stingy so the
    // moments it does fire actually land.
    const dread = smoothstep(0.18, 1, p);
    setVigA(dread * (0.55 + 0.45 * beat));
    setVigB(smoothstep(0.62, 1, p) * (0.25 + 0.75 * beat));
    setBarGlow(smoothstep(0.55, 1, p) * (0.2 + 0.8 * beat));

    // --- levelup banner ---------------------------------------------------
    if (bannerT > 0) {
      bannerT -= step;
      const t = Math.max(0, bannerT);
      const inA = smoothstep(0, 0.18, BANNER_TIME - t);   // slam in
      const outA = smoothstep(0, 0.55, t);                // drift out
      if (!bannerShown) { bannerShown = true; banner.style.visibility = 'visible'; }
      setBannerAlpha(inA * outA);
      // Overshoot on entry, float upward on exit.
      const scale = 0.82 + 0.18 * inA + 0.06 * (1 - outA);
      const y = (1 - inA) * 22 - (1 - outA) * 16;
      const xf = 'translateY(' + (Math.round(y * 10) / 10) + 'px) scale(' +
        (Math.round(scale * 200) / 200) + ')';
      if (xf !== lastBannerXf) { lastBannerXf = xf; bannerIn.style.transform = xf; }
      if (bannerT <= 0) { bannerShown = false; banner.style.visibility = 'hidden'; }
    } else if (bannerShown) {
      bannerShown = false;
      setBannerAlpha(0);
      banner.style.visibility = 'hidden';
    }

    // --- layer visibility -------------------------------------------------
    if (playing !== hudOn) {
      hudOn = playing;
      layer.classList.toggle('emhud-off', !playing);
    }
  }

  return { update, showStart, showGameOver, hideOverlays };
}
