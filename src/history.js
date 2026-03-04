import { state } from './state.js';

const past = [];
const future = [];

function deepClone(effects) {
  return effects.map(ae => ({
    id: ae.id,
    name: ae.name,
    icon: ae.icon,
    color: ae.color,
    params: { ...ae.params },
    def: ae.def,
  }));
}

export function snapshot() {
  past.push(deepClone(state.activeEffects));
  future.length = 0;
}

export function undo() {
  if (!past.length) return false;
  future.push(deepClone(state.activeEffects));
  state.activeEffects = past.pop();
  return true;
}

export function redo() {
  if (!future.length) return false;
  past.push(deepClone(state.activeEffects));
  state.activeEffects = future.pop();
  return true;
}

export function canUndo() { return past.length > 0; }
export function canRedo() { return future.length > 0; }

export function clear() {
  past.length = 0;
  future.length = 0;
}
