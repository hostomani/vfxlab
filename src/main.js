import { state } from './state.js';
import { EFFECTS } from './effects.js';
import { render, previewEffect, renderToCanvas, startRenderLoop, stopRenderLoop } from './renderer.js';
import { snapshot, undo, redo, canUndo, canRedo, clear as clearHistory } from './history.js';
import { getPresets, savePreset, deletePreset, resolvePreset, exportPresetAsJSON, parsePresetJSON } from './presets.js';

// ── DOM refs ──────────────────────────────────────────────────
const dropzone      = document.getElementById('dropzone');
const fileInput     = document.getElementById('file-input');
const thumb         = document.getElementById('thumb');
const canvasWrap    = document.getElementById('canvas-wrap');
const placeholder   = document.getElementById('placeholder');
const effectList    = document.getElementById('effect-list');
const effectCount   = document.getElementById('effect-count');
const paramsSection = document.getElementById('params-section');
const paramsTitle   = document.getElementById('params-title');
const paramsBody    = document.getElementById('params-body');
const presetList    = document.getElementById('preset-list');
const sStatus       = document.getElementById('sstatus');
const sDims         = document.getElementById('sdims');
const sdot          = document.getElementById('sdot');
const btnUndo       = document.getElementById('btn-undo');
const btnRedo       = document.getElementById('btn-redo');

// ── Effect grid ───────────────────────────────────────────────
const grid = document.getElementById('effect-grid');
EFFECTS.forEach(ef => {
  const card = document.createElement('div');
  card.className = 'effect-card';
  card.innerHTML = `<div class="ec-icon">${ef.icon}</div><div class="ec-name">${ef.name}</div>`;
  card.addEventListener('click', () => openParams(ef));
  grid.appendChild(card);
});

// ── Upload ────────────────────────────────────────────────────
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});
fileInput.addEventListener('change', () => { if (fileInput.files[0]) loadFile(fileInput.files[0]); });

function loadFile(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    state.sourceImg = img;
    state.sourceCanvas = document.createElement('canvas');
    state.sourceCanvas.width = img.naturalWidth;
    state.sourceCanvas.height = img.naturalHeight;
    state.sourceCanvas.getContext('2d').drawImage(img, 0, 0);

    thumb.src = url;
    thumb.style.display = 'block';

    canvasWrap.style.display = 'block';
    placeholder.style.display = 'none';

    sdot.classList.add('active');
    sStatus.textContent = file.name;
    sDims.textContent = `${img.naturalWidth} × ${img.naturalHeight}`;

    document.getElementById('btn-export').disabled = false;
    document.getElementById('btn-record').disabled = false;
    render();
  };
  img.src = url;
}

// ── Params panel ──────────────────────────────────────────────
function openParams(ef) {
  state.selectedEffect = ef;
  paramsTitle.textContent = `${ef.icon} ${ef.name}`;
  paramsSection.style.display = 'block';
  paramsBody.innerHTML = '';

  ef.params.forEach(param => {
    const row = document.createElement('div');
    if (param.type === 'range') {
      row.className = 'param-row';
      row.innerHTML = `
        <span class="param-name">${param.label}</span>
        <input type="range" min="${param.min}" max="${param.max}" value="${param.value}"
          data-key="${param.key}" step="${param.max >= 100 ? 1 : 0.5}">
        <span class="param-val" data-val="${param.key}">${param.value}${param.unit}</span>
      `;
      const slider = row.querySelector('input');
      const valEl  = row.querySelector('[data-val]');
      slider.addEventListener('input', () => {
        param.value = parseFloat(slider.value);
        valEl.textContent = param.value + param.unit;
        if (state.sourceImg) previewEffect(ef);
      });
    } else if (param.type === 'toggle') {
      row.className = 'toggle-row';
      row.innerHTML = `
        <span class="toggle-label">${param.label}</span>
        <div class="toggle ${param.value ? 'on' : ''}" data-key="${param.key}"></div>
      `;
      const tog = row.querySelector('.toggle');
      tog.addEventListener('click', () => {
        param.value = !param.value;
        tog.classList.toggle('on', param.value);
        if (state.sourceImg) previewEffect(ef);
      });
    } else if (param.type === 'color') {
      row.className = 'color-row';
      row.innerHTML = `
        <span class="param-name">${param.label}</span>
        <input type="color" value="${param.value}" data-key="${param.key}">
      `;
      const inp = row.querySelector('input');
      inp.addEventListener('input', () => {
        param.value = inp.value;
        if (state.sourceImg) previewEffect(ef);
      });
    }
    paramsBody.appendChild(row);
  });
}

document.getElementById('close-params').addEventListener('click', () => {
  paramsSection.style.display = 'none';
  state.selectedEffect = null;
  render();
});

document.getElementById('btn-apply').addEventListener('click', () => {
  if (!state.selectedEffect) return;
  const ef = state.selectedEffect;
  const params = {};
  ef.params.forEach(p => { params[p.key] = p.value; });
  snapshot();
  state.activeEffects.push({ id: ef.id, name: ef.name, icon: ef.icon, color: ef.color, params, def: ef });
  state.selectedEffect = null;
  paramsSection.style.display = 'none';
  updateEffectList();
  updateHistoryButtons();
  render();
});

// ── Effect list with drag-to-reorder ─────────────────────────
function updateEffectList() {
  effectCount.textContent = state.activeEffects.length;
  if (state.activeEffects.length === 0) {
    effectList.innerHTML = '<div class="no-effects">No effects applied</div>';
    return;
  }
  effectList.innerHTML = '';
  let dragSrcIdx = null;

  state.activeEffects.forEach((ae, idx) => {
    const chip = document.createElement('div');
    chip.className = 'effect-chip';
    chip.draggable = true;
    chip.dataset.idx = idx;
    chip.innerHTML = `
      <div class="chip-drag" title="Drag to reorder">⣿</div>
      <div class="chip-dot" style="background:${ae.color}"></div>
      <span class="chip-name">${ae.icon} ${ae.name}</span>
      <span class="chip-remove" data-idx="${idx}">✕</span>
    `;

    chip.addEventListener('dragstart', e => {
      dragSrcIdx = idx;
      chip.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    chip.addEventListener('dragend', () => {
      chip.classList.remove('dragging');
      dragSrcIdx = null;
    });
    chip.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      chip.classList.add('drag-over-chip');
    });
    chip.addEventListener('dragleave', () => chip.classList.remove('drag-over-chip'));
    chip.addEventListener('drop', e => {
      e.preventDefault();
      chip.classList.remove('drag-over-chip');
      if (dragSrcIdx === null || dragSrcIdx === idx) return;
      snapshot();
      const moved = state.activeEffects.splice(dragSrcIdx, 1)[0];
      state.activeEffects.splice(idx, 0, moved);
      updateEffectList();
      updateHistoryButtons();
      render();
    });

    chip.querySelector('.chip-remove').addEventListener('click', () => {
      snapshot();
      state.activeEffects.splice(idx, 1);
      updateEffectList();
      updateHistoryButtons();
      render();
    });

    effectList.appendChild(chip);
  });
}

// ── History buttons ───────────────────────────────────────────
function updateHistoryButtons() {
  btnUndo.disabled = !canUndo();
  btnRedo.disabled = !canRedo();
}

btnUndo.addEventListener('click', () => {
  if (undo()) { updateEffectList(); updateHistoryButtons(); render(); }
});
btnRedo.addEventListener('click', () => {
  if (redo()) { updateEffectList(); updateHistoryButtons(); render(); }
});

document.addEventListener('keydown', e => {
  const mod = e.ctrlKey || e.metaKey;
  if (mod && e.key === 'z' && !e.shiftKey) {
    e.preventDefault();
    if (undo()) { updateEffectList(); updateHistoryButtons(); render(); }
  }
  if (mod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault();
    if (redo()) { updateEffectList(); updateHistoryButtons(); render(); }
  }
});

// ── Presets ───────────────────────────────────────────────────
function updatePresetsPanel() {
  const presets = getPresets();
  if (presets.length === 0) {
    presetList.innerHTML = '<div class="no-effects">No saved presets</div>';
    return;
  }
  presetList.innerHTML = '';
  presets.forEach(preset => {
    const item = document.createElement('div');
    item.className = 'preset-item';
    item.innerHTML = `
      <span class="preset-name">${preset.name}</span>
      <span class="preset-count">${preset.effects.length} fx</span>
      <span class="preset-remove" title="Delete preset">✕</span>
    `;
    item.querySelector('.preset-name').addEventListener('click', () => {
      snapshot();
      state.activeEffects = resolvePreset(preset);
      updateEffectList();
      updateHistoryButtons();
      if (state.sourceImg) render();
    });
    item.querySelector('.preset-remove').addEventListener('click', e => {
      e.stopPropagation();
      deletePreset(preset.name);
      updatePresetsPanel();
    });
    presetList.appendChild(item);
  });
}

document.getElementById('btn-save-preset').addEventListener('click', () => {
  if (state.activeEffects.length === 0) return;
  const name = prompt('Preset name:');
  if (!name?.trim()) return;
  savePreset(name.trim(), state.activeEffects);
  updatePresetsPanel();
});

// ── Paste JSON modal ──────────────────────────────────────────
const pasteModal     = document.getElementById('paste-modal');
const pasteInput     = document.getElementById('paste-json-input');
const pasteError     = document.getElementById('paste-error');

function openPasteModal() {
  pasteInput.value = '';
  pasteError.style.display = 'none';
  pasteModal.style.display = 'flex';
  setTimeout(() => pasteInput.focus(), 50);
}
function closePasteModal() {
  pasteModal.style.display = 'none';
}
function applyPastedJSON() {
  try {
    const preset = parsePresetJSON(pasteInput.value);
    const resolved = resolvePreset(preset);
    if (resolved.length === 0) throw new Error('No recognised effects found.');
    snapshot();
    state.activeEffects = resolved;
    updateEffectList();
    updateHistoryButtons();
    if (state.sourceImg) render();
    if (preset.name) { savePreset(preset.name, state.activeEffects); updatePresetsPanel(); }
    closePasteModal();
  } catch (err) {
    pasteError.textContent = err.message;
    pasteError.style.display = 'block';
  }
}

document.getElementById('btn-paste-preset').addEventListener('click', openPasteModal);
document.getElementById('paste-modal-close').addEventListener('click', closePasteModal);
document.getElementById('paste-cancel').addEventListener('click', closePasteModal);
document.getElementById('paste-apply').addEventListener('click', applyPastedJSON);
pasteModal.addEventListener('click', e => { if (e.target === pasteModal) closePasteModal(); });
pasteInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) applyPastedJSON();
  if (e.key === 'Escape') closePasteModal();
});

document.getElementById('btn-export-preset').addEventListener('click', () => {
  if (state.activeEffects.length === 0) return;
  const name = prompt('Preset name for file:', 'my-preset');
  if (!name?.trim()) return;
  exportPresetAsJSON(name.trim(), state.activeEffects);
});

document.getElementById('import-preset-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = evt => {
    try {
      const preset = parsePresetJSON(evt.target.result);
      const resolved = resolvePreset(preset);
      if (resolved.length === 0) { alert('No recognised effects found in preset.'); return; }
      snapshot();
      state.activeEffects = resolved;
      updateEffectList();
      updateHistoryButtons();
      if (state.sourceImg) render();
      // optionally save to local presets panel
      if (preset.name) { savePreset(preset.name, state.activeEffects); updatePresetsPanel(); }
    } catch (err) {
      alert(`Invalid preset file: ${err.message}`);
    }
    e.target.value = ''; // reset so same file can be re-imported
  };
  reader.readAsText(file);
});

// ── Reset ─────────────────────────────────────────────────────
document.getElementById('btn-reset').addEventListener('click', () => {
  snapshot();
  state.activeEffects = [];
  state.selectedEffect = null;
  paramsSection.style.display = 'none';
  updateEffectList();
  updateHistoryButtons();
  render();
});

// ── Export PNG ────────────────────────────────────────────────
document.getElementById('btn-export').addEventListener('click', () => {
  if (!state.sourceImg) return;
  const result = renderToCanvas();
  const link = document.createElement('a');
  link.download = 'vfxlab-export.png';
  link.href = result.toDataURL('image/png');
  link.click();
});

// ── Record WebM ───────────────────────────────────────────────
const RECORD_DURATION = 3000; // ms
const RECORD_FPS = 30;

const btnRecord = document.getElementById('btn-record');
btnRecord.addEventListener('click', () => {
  if (!state.sourceImg) return;

  const previewCanvas = document.getElementById('preview');
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';

  const stream = previewCanvas.captureStream(RECORD_FPS);
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks = [];

  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
  recorder.onstop = () => {
    stopRenderLoop();
    render(); // restore static frame
    btnRecord.disabled = false;
    btnRecord.textContent = '⏺ Record WebM';
    document.getElementById('btn-export').disabled = false;

    const blob = new Blob(chunks, { type: 'video/webm' });
    const blobUrl = URL.createObjectURL(blob);

    const modal       = document.getElementById('record-modal');
    const videoEl     = document.getElementById('record-preview');
    const btnDownload = document.getElementById('modal-download');
    const btnDiscard  = document.getElementById('modal-discard');
    const btnClose    = document.getElementById('modal-close');

    videoEl.src = blobUrl;
    modal.style.display = 'flex';

    function closeModal() {
      modal.style.display = 'none';
      videoEl.src = '';
      URL.revokeObjectURL(blobUrl);
    }

    btnDownload.onclick = () => {
      const link = document.createElement('a');
      link.download = 'vfxlab-export.webm';
      link.href = blobUrl;
      link.click();
      closeModal();
    };
    btnDiscard.onclick  = closeModal;
    btnClose.onclick    = closeModal;
    modal.onclick = e => { if (e.target === modal) closeModal(); };
  };

  // countdown in button label
  btnRecord.disabled = true;
  document.getElementById('btn-export').disabled = true;
  const secs = RECORD_DURATION / 1000;
  let remaining = secs;
  btnRecord.textContent = `⏺ ${remaining}s…`;
  const tick = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) btnRecord.textContent = `⏺ ${remaining}s…`;
  }, 1000);

  startRenderLoop();
  recorder.start();
  setTimeout(() => { clearInterval(tick); recorder.stop(); }, RECORD_DURATION);
});

// ── Init ──────────────────────────────────────────────────────
updateEffectList();
updateHistoryButtons();
updatePresetsPanel();
