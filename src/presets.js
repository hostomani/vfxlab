import { EFFECTS } from './effects.js';

const STORAGE_KEY = 'vfxlab_presets';

export function getPresets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function savePreset(name, activeEffects) {
  const presets = getPresets();
  const preset = {
    name,
    date: Date.now(),
    effects: activeEffects.map(ae => ({
      id: ae.id,
      name: ae.name,
      icon: ae.icon,
      color: ae.color,
      params: { ...ae.params },
    })),
  };
  const idx = presets.findIndex(p => p.name === name);
  if (idx >= 0) presets[idx] = preset;
  else presets.push(preset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

export function deletePreset(name) {
  const presets = getPresets().filter(p => p.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  return presets;
}

export function resolvePreset(preset) {
  return preset.effects
    .map(pe => {
      const def = EFFECTS.find(e => e.id === pe.id);
      if (!def) return null;
      return { id: pe.id, name: def.name, icon: def.icon, color: def.color, params: { ...pe.params }, def };
    })
    .filter(Boolean);
}

export function exportPresetAsJSON(name, activeEffects) {
  const data = {
    name,
    effects: activeEffects.map(ae => ({
      id: ae.id,
      params: { ...ae.params },
    })),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.download = `${name.replace(/\s+/g, '-').toLowerCase()}.json`;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parsePresetJSON(text) {
  const data = JSON.parse(text); // throws on invalid JSON
  if (!Array.isArray(data.effects)) throw new Error('Missing "effects" array');
  return data;
}
