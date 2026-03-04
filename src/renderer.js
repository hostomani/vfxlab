import { state } from './state.js';

const preview = document.getElementById('preview');

let _rafId = null;

export function startRenderLoop() {
  if (_rafId) return;
  function loop() {
    render();
    _rafId = requestAnimationFrame(loop);
  }
  _rafId = requestAnimationFrame(loop);
}

export function stopRenderLoop() {
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
}

export function cloneCanvas(src) {
  const c = document.createElement('canvas');
  c.width = src.width;
  c.height = src.height;
  c.getContext('2d').drawImage(src, 0, 0);
  return c;
}

export function renderToCanvas() {
  const base = cloneCanvas(state.sourceCanvas);
  for (const ae of state.activeEffects) {
    const out = cloneCanvas(base);
    try { ae.def.apply(base, out, ae.params); } catch (e) { console.warn(e); }
    base.getContext('2d').clearRect(0, 0, base.width, base.height);
    base.getContext('2d').drawImage(out, 0, 0);
  }
  return base;
}

export function drawToPreview(canvas) {
  preview.width = canvas.width;
  preview.height = canvas.height;
  preview.getContext('2d').drawImage(canvas, 0, 0);
}

export function render() {
  if (!state.sourceImg) return;
  const result = renderToCanvas();
  drawToPreview(result);
  document.getElementById('seffects').textContent =
    `${state.activeEffects.length} effect${state.activeEffects.length !== 1 ? 's' : ''}`;
}

export function previewEffect(ef) {
  if (!state.sourceImg) return;
  const base = renderToCanvas();
  const out = cloneCanvas(base);
  const params = {};
  ef.params.forEach(p => { params[p.key] = p.value; });
  try { ef.apply(base, out, params); } catch (e) { console.warn(e); }
  drawToPreview(out);
}
