/** Dead-simple synchronous event bus shared by every module. */
export function createBus() {
  const listeners = new Map();
  return {
    on(evt, fn) {
      if (!listeners.has(evt)) listeners.set(evt, new Set());
      listeners.get(evt).add(fn);
      return () => listeners.get(evt)?.delete(fn);
    },
    off(evt, fn) { listeners.get(evt)?.delete(fn); },
    emit(evt, payload) {
      const set = listeners.get(evt);
      if (!set) return;
      for (const fn of Array.from(set)) {
        try { fn(payload); } catch (err) { console.error(`[bus:${evt}]`, err); }
      }
    },
    clear() { listeners.clear(); },
  };
}

/**
 * Events emitted by the game, for reference:
 *   'collect'   { position:Vector3, color:number, score:number }
 *   'levelup'   { index:number, level:object }
 *   'jump'      { position:Vector3 }
 *   'land'      { position:Vector3, impact:number }
 *   'roar'      { intensity:number }
 *   'caught'    { score:number }
 *   'start'     {}
 *   'restart'   {}
 *   'shake'     { amount:number }
 */
