export const EFFECTS = [
  {
    id: 'glitch',
    name: 'RGB Glitch',
    icon: '⚡',
    color: '#ff2d55',
    params: [
      { key: 'intensity', label: 'Intensity', type: 'range', min: 1, max: 40, value: 12, unit: 'px' },
      { key: 'slices',    label: 'Slices',    type: 'range', min: 2, max: 20, value: 8, unit: '' },
      { key: 'speed',     label: 'Animate',   type: 'toggle', value: false },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const sCtx = src.getContext('2d');
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);

      const numSlices = p.slices;
      for (let i = 0; i < numSlices; i++) {
        const y = Math.floor(Math.random() * h);
        const sliceH = Math.floor(2 + Math.random() * (h / numSlices));
        const shift = (Math.random() - 0.5) * p.intensity * 2;

        dCtx.save();
        dCtx.globalCompositeOperation = 'source-over';
        dCtx.globalAlpha = 0.6;
        const imgData = sCtx.getImageData(0, y, w, sliceH);
        for (let j = 0; j < imgData.data.length; j += 4) {
          imgData.data[j + 1] = 0; imgData.data[j + 2] = 0;
        }
        const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = sliceH;
        tmp.getContext('2d').putImageData(imgData, 0, 0);
        dCtx.drawImage(tmp, shift, y);
        dCtx.restore();

        dCtx.save();
        dCtx.globalAlpha = 0.5;
        const imgData2 = sCtx.getImageData(0, y, w, sliceH);
        for (let j = 0; j < imgData2.data.length; j += 4) {
          imgData2.data[j] = 0; imgData2.data[j + 1] = 0;
        }
        const tmp2 = document.createElement('canvas'); tmp2.width = w; tmp2.height = sliceH;
        tmp2.getContext('2d').putImageData(imgData2, 0, 0);
        dCtx.drawImage(tmp2, -shift * 0.7, y);
        dCtx.restore();
      }
    },
  },

  {
    id: 'scanlines',
    name: 'Scanlines',
    icon: '▤',
    color: '#00e5ff',
    params: [
      { key: 'spacing', label: 'Spacing',   type: 'range', min: 2, max: 12, value: 4, unit: 'px' },
      { key: 'opacity', label: 'Opacity',   type: 'range', min: 5, max: 80, value: 30, unit: '%' },
      { key: 'color',   label: 'Line Color', type: 'color', value: '#000000' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);
      const col = p.color || '#000000';
      const r = parseInt(col.slice(1, 3), 16);
      const g = parseInt(col.slice(3, 5), 16);
      const b = parseInt(col.slice(5, 7), 16);
      dCtx.fillStyle = `rgba(${r},${g},${b},${p.opacity / 100})`;
      for (let y = 0; y < h; y += p.spacing) {
        dCtx.fillRect(0, y, w, 1);
      }
    },
  },

  {
    id: 'vhs',
    name: 'VHS Noise',
    icon: '📼',
    color: '#ff9500',
    params: [
      { key: 'noise',    label: 'Noise',    type: 'range', min: 5, max: 80, value: 25, unit: '%' },
      { key: 'tracking', label: 'Tracking', type: 'range', min: 0, max: 30, value: 8, unit: 'px' },
      { key: 'fade',     label: 'Fade',     type: 'range', min: 0, max: 60, value: 20, unit: '%' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);

      const noiseData = dCtx.createImageData(w, h);
      for (let i = 0; i < noiseData.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        noiseData.data[i] = noiseData.data[i + 1] = noiseData.data[i + 2] = v;
        noiseData.data[i + 3] = (p.noise / 100 * 180) | 0;
      }
      const noiseCv = document.createElement('canvas'); noiseCv.width = w; noiseCv.height = h;
      noiseCv.getContext('2d').putImageData(noiseData, 0, 0);
      dCtx.save();
      dCtx.globalCompositeOperation = 'overlay';
      dCtx.globalAlpha = 0.5;
      dCtx.drawImage(noiseCv, 0, 0);
      dCtx.restore();

      if (p.tracking > 0) {
        const sCtx = src.getContext('2d');
        const numLines = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numLines; i++) {
          const y = Math.floor(Math.random() * h);
          const lh = 1 + Math.floor(Math.random() * 4);
          const sh = Math.floor((Math.random() - 0.5) * p.tracking * 2);
          const slice = sCtx.getImageData(0, y, w, lh);
          const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = lh;
          tmp.getContext('2d').putImageData(slice, 0, 0);
          dCtx.drawImage(tmp, sh, y);
        }
      }

      if (p.fade > 0) {
        const fadeH = Math.floor(h * p.fade / 100);
        const grd = dCtx.createLinearGradient(0, h - fadeH, 0, h);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,10,0,0.8)');
        dCtx.fillStyle = grd;
        dCtx.fillRect(0, h - fadeH, w, fadeH);
      }
    },
  },

  {
    id: 'vignette',
    name: 'Vignette',
    icon: '◉',
    color: '#5e5ce6',
    params: [
      { key: 'intensity', label: 'Intensity', type: 'range', min: 10, max: 100, value: 60, unit: '%' },
      { key: 'radius',    label: 'Radius',    type: 'range', min: 20, max: 90, value: 55, unit: '%' },
      { key: 'color',     label: 'Color',     type: 'color', value: '#000000' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);
      const col = p.color || '#000000';
      const r = parseInt(col.slice(1, 3), 16);
      const g = parseInt(col.slice(3, 5), 16);
      const b = parseInt(col.slice(5, 7), 16);
      const grd = dCtx.createRadialGradient(w / 2, h / 2, (Math.min(w, h) * p.radius / 100) * 0.5, w / 2, h / 2, Math.max(w, h) * 0.75);
      grd.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grd.addColorStop(1, `rgba(${r},${g},${b},${p.intensity / 100})`);
      dCtx.fillStyle = grd;
      dCtx.fillRect(0, 0, w, h);
    },
  },

  {
    id: 'grain',
    name: 'Film Grain',
    icon: '◫',
    color: '#a0a0a0',
    params: [
      { key: 'amount', label: 'Amount', type: 'range', min: 5, max: 100, value: 30, unit: '%' },
      { key: 'size',   label: 'Size',   type: 'range', min: 1, max: 4, value: 1, unit: 'px' },
      { key: 'mono',   label: 'Mono',   type: 'toggle', value: true },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);
      const alpha = p.amount / 100;
      const data = dCtx.createImageData(w, h);
      for (let i = 0; i < data.data.length; i += 4) {
        if (p.mono) {
          const v = ((Math.random() * 2 - 1) * 255 * alpha) | 0;
          data.data[i] = data.data[i + 1] = data.data[i + 2] = 128 + v;
        } else {
          data.data[i]     = 128 + ((Math.random() * 2 - 1) * 255 * alpha) | 0;
          data.data[i + 1] = 128 + ((Math.random() * 2 - 1) * 255 * alpha) | 0;
          data.data[i + 2] = 128 + ((Math.random() * 2 - 1) * 255 * alpha) | 0;
        }
        data.data[i + 3] = (alpha * 200) | 0;
      }
      const noiseCv = document.createElement('canvas'); noiseCv.width = w; noiseCv.height = h;
      noiseCv.getContext('2d').putImageData(data, 0, 0);
      dCtx.save();
      dCtx.globalCompositeOperation = 'overlay';
      dCtx.globalAlpha = 0.7;
      dCtx.drawImage(noiseCv, 0, 0);
      dCtx.restore();
    },
  },

  {
    id: 'color',
    name: 'Color Grade',
    icon: '🎨',
    color: '#30d158',
    params: [
      { key: 'hue',        label: 'Hue Shift',  type: 'range', min: -180, max: 180, value: 0, unit: '°' },
      { key: 'saturation', label: 'Saturation', type: 'range', min: 0, max: 300, value: 100, unit: '%' },
      { key: 'brightness', label: 'Brightness', type: 'range', min: 0, max: 300, value: 100, unit: '%' },
      { key: 'contrast',   label: 'Contrast',   type: 'range', min: 0, max: 300, value: 100, unit: '%' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.filter = `hue-rotate(${p.hue}deg) saturate(${p.saturation}%) brightness(${p.brightness}%) contrast(${p.contrast}%)`;
      dCtx.drawImage(src, 0, 0);
      dCtx.filter = 'none';
    },
  },

  {
    id: 'duotone',
    name: 'Duotone',
    icon: '⬒',
    color: '#bf5af2',
    params: [
      { key: 'shadow',    label: 'Shadow Color',   type: 'color', value: '#1a0033' },
      { key: 'highlight', label: 'Highlight Color', type: 'color', value: '#e8ff00' },
      { key: 'intensity', label: 'Intensity',       type: 'range', min: 0, max: 100, value: 80, unit: '%' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.filter = 'grayscale(1)';
      dCtx.drawImage(src, 0, 0);
      dCtx.filter = 'none';
      const gray = dCtx.getImageData(0, 0, w, h);

      const sc = p.shadow || '#1a0033';
      const hc = p.highlight || '#e8ff00';
      const sr = parseInt(sc.slice(1, 3), 16) / 255;
      const sg = parseInt(sc.slice(3, 5), 16) / 255;
      const sb = parseInt(sc.slice(5, 7), 16) / 255;
      const hr = parseInt(hc.slice(1, 3), 16) / 255;
      const hg = parseInt(hc.slice(3, 5), 16) / 255;
      const hb = parseInt(hc.slice(5, 7), 16) / 255;
      const mix = p.intensity / 100;

      const out = new ImageData(w, h);
      for (let i = 0; i < gray.data.length; i += 4) {
        const lum = gray.data[i] / 255;
        const nr = ((sr + (hr - sr) * lum) * 255) | 0;
        const ng = ((sg + (hg - sg) * lum) * 255) | 0;
        const nb = ((sb + (hb - sb) * lum) * 255) | 0;
        out.data[i]     = gray.data[i]     * (1 - mix) + nr * mix;
        out.data[i + 1] = gray.data[i + 1] * (1 - mix) + ng * mix;
        out.data[i + 2] = gray.data[i + 2] * (1 - mix) + nb * mix;
        out.data[i + 3] = gray.data[i + 3];
      }
      dCtx.putImageData(out, 0, 0);
    },
  },

  {
    id: 'pixelate',
    name: 'Pixelate',
    icon: '⬛',
    color: '#ffd60a',
    params: [
      { key: 'size', label: 'Pixel Size', type: 'range', min: 2, max: 64, value: 12, unit: 'px' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      const sz = Math.max(1, p.size | 0);
      const tmp = document.createElement('canvas');
      tmp.width = Math.ceil(w / sz); tmp.height = Math.ceil(h / sz);
      const tCtx = tmp.getContext('2d');
      tCtx.imageSmoothingEnabled = false;
      tCtx.drawImage(src, 0, 0, tmp.width, tmp.height);
      dCtx.imageSmoothingEnabled = false;
      dCtx.drawImage(tmp, 0, 0, w, h);
    },
  },

  {
    id: 'halftone',
    name: 'Halftone',
    icon: '⠿',
    color: '#ff6b35',
    params: [
      { key: 'size',  label: 'Dot Size',  type: 'range', min: 3, max: 30, value: 8, unit: 'px' },
      { key: 'color', label: 'Dot Color', type: 'color', value: '#000000' },
      { key: 'bg',    label: 'BG Color',  type: 'color', value: '#ffffff' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
      const tCtx = tmp.getContext('2d');
      tCtx.filter = 'grayscale(1)'; tCtx.drawImage(src, 0, 0); tCtx.filter = 'none';
      const gd = tCtx.getImageData(0, 0, w, h);
      dCtx.fillStyle = p.bg || '#ffffff';
      dCtx.fillRect(0, 0, w, h);
      const sz = Math.max(2, p.size | 0);
      dCtx.fillStyle = p.color || '#000000';
      for (let y = 0; y < h; y += sz) {
        for (let x = 0; x < w; x += sz) {
          const idx = (y * w + x) * 4;
          const lum = gd.data[idx] / 255;
          const r = (sz / 2) * (1 - lum) * 0.9;
          if (r > 0.5) {
            dCtx.beginPath();
            dCtx.arc(x + sz / 2, y + sz / 2, r, 0, Math.PI * 2);
            dCtx.fill();
          }
        }
      }
    },
  },

  {
    id: 'blur',
    name: 'Blur',
    icon: '◌',
    color: '#64d2ff',
    params: [
      { key: 'radius', label: 'Radius', type: 'range', min: 1, max: 30, value: 5, unit: 'px' },
      { key: 'type',   label: 'Motion', type: 'toggle', value: false },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      if (p.type) {
        dCtx.clearRect(0, 0, w, h);
        const steps = Math.min(p.radius, 12);
        for (let i = 0; i < steps; i++) {
          const off = ((i / steps) - 0.5) * p.radius;
          dCtx.save();
          dCtx.globalAlpha = 1 / steps;
          dCtx.drawImage(src, off, 0);
          dCtx.restore();
        }
      } else {
        dCtx.filter = `blur(${p.radius}px)`;
        dCtx.drawImage(src, 0, 0);
        dCtx.filter = 'none';
      }
    },
  },

  {
    id: 'neon',
    name: 'Neon Glow',
    icon: '✦',
    color: '#ff375f',
    params: [
      { key: 'color',  label: 'Glow Color', type: 'color', value: '#e8ff00' },
      { key: 'radius', label: 'Radius',     type: 'range', min: 2, max: 40, value: 12, unit: 'px' },
      { key: 'amount', label: 'Amount',     type: 'range', min: 10, max: 200, value: 80, unit: '%' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);
      const col = p.color || '#e8ff00';
      for (let i = 0; i < 4; i++) {
        dCtx.save();
        dCtx.filter = `blur(${p.radius * (i + 1) * 0.5}px)`;
        dCtx.globalCompositeOperation = 'screen';
        dCtx.globalAlpha = (p.amount / 100) * (1 / (i + 1)) * 0.6;
        const tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
        const tc = tmp.getContext('2d');
        tc.drawImage(src, 0, 0);
        tc.fillStyle = col; tc.globalCompositeOperation = 'multiply';
        tc.fillRect(0, 0, w, h);
        dCtx.drawImage(tmp, 0, 0);
        dCtx.restore();
      }
    },
  },

  {
    id: 'chromatic',
    name: 'Chromatic',
    icon: '🔴',
    color: '#ff2d55',
    params: [
      { key: 'amount', label: 'Separation', type: 'range', min: 1, max: 30, value: 6, unit: 'px' },
      { key: 'angle',  label: 'Angle',      type: 'range', min: 0, max: 360, value: 0, unit: '°' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      const ang = (p.angle * Math.PI) / 180;
      const dx = Math.cos(ang) * p.amount;
      const dy = Math.sin(ang) * p.amount;

      const tmpR = document.createElement('canvas'); tmpR.width = w; tmpR.height = h;
      const trCtx = tmpR.getContext('2d');
      trCtx.drawImage(src, 0, 0);
      const rd = trCtx.getImageData(0, 0, w, h);
      for (let i = 0; i < rd.data.length; i += 4) { rd.data[i + 1] = 0; rd.data[i + 2] = 0; }
      trCtx.putImageData(rd, 0, 0);

      const tmpB = document.createElement('canvas'); tmpB.width = w; tmpB.height = h;
      const tbCtx = tmpB.getContext('2d');
      tbCtx.drawImage(src, 0, 0);
      const bd = tbCtx.getImageData(0, 0, w, h);
      for (let i = 0; i < bd.data.length; i += 4) { bd.data[i] = 0; bd.data[i + 1] = 0; }
      tbCtx.putImageData(bd, 0, 0);

      const tmpG = document.createElement('canvas'); tmpG.width = w; tmpG.height = h;
      const tgCtx = tmpG.getContext('2d');
      tgCtx.drawImage(src, 0, 0);
      const gd = tgCtx.getImageData(0, 0, w, h);
      for (let i = 0; i < gd.data.length; i += 4) { gd.data[i] = 0; gd.data[i + 2] = 0; }
      tgCtx.putImageData(gd, 0, 0);

      dCtx.save(); dCtx.globalCompositeOperation = 'screen';
      dCtx.drawImage(tmpR, -dx, -dy);
      dCtx.drawImage(tmpG, 0, 0);
      dCtx.drawImage(tmpB, dx, dy);
      dCtx.restore();
    },
  },

  {
    id: 'invert',
    name: 'Invert',
    icon: '⊘',
    color: '#8e8e93',
    params: [
      { key: 'amount', label: 'Amount', type: 'range', min: 0, max: 100, value: 100, unit: '%' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.filter = `invert(${p.amount}%)`;
      dCtx.drawImage(src, 0, 0);
      dCtx.filter = 'none';
    },
  },

  {
    id: 'grid',
    name: 'Grid Overlay',
    icon: '⊞',
    color: '#30d158',
    params: [
      { key: 'size',    label: 'Grid Size', type: 'range', min: 10, max: 200, value: 40, unit: 'px' },
      { key: 'opacity', label: 'Opacity',   type: 'range', min: 5, max: 80, value: 20, unit: '%' },
      { key: 'color',   label: 'Color',     type: 'color', value: '#e8ff00' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);
      const col = p.color || '#e8ff00';
      const r = parseInt(col.slice(1, 3), 16);
      const g = parseInt(col.slice(3, 5), 16);
      const b = parseInt(col.slice(5, 7), 16);
      dCtx.strokeStyle = `rgba(${r},${g},${b},${p.opacity / 100})`;
      dCtx.lineWidth = 1;
      for (let x = 0; x < w; x += p.size) { dCtx.beginPath(); dCtx.moveTo(x, 0); dCtx.lineTo(x, h); dCtx.stroke(); }
      for (let y = 0; y < h; y += p.size) { dCtx.beginPath(); dCtx.moveTo(0, y); dCtx.lineTo(w, y); dCtx.stroke(); }
    },
  },

  {
    id: 'tint',
    name: 'Color Tint',
    icon: '◐',
    color: '#ffd60a',
    params: [
      { key: 'color',  label: 'Tint Color', type: 'color', value: '#ff2d55' },
      { key: 'amount', label: 'Amount',     type: 'range', min: 0, max: 100, value: 40, unit: '%' },
      { key: 'blend',  label: 'Multiply',   type: 'toggle', value: false },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const dCtx = dst.getContext('2d');
      dCtx.drawImage(src, 0, 0);
      const col = p.color || '#ff2d55';
      const r = parseInt(col.slice(1, 3), 16);
      const g = parseInt(col.slice(3, 5), 16);
      const b = parseInt(col.slice(5, 7), 16);
      dCtx.save();
      dCtx.globalCompositeOperation = p.blend ? 'multiply' : 'overlay';
      dCtx.globalAlpha = p.amount / 100;
      dCtx.fillStyle = `rgb(${r},${g},${b})`;
      dCtx.fillRect(0, 0, w, h);
      dCtx.restore();
    },
  },

  {
    id: 'threshold',
    name: 'Threshold',
    icon: '◨',
    color: '#ff6b35',
    params: [
      { key: 'level',    label: 'Level',    type: 'range', min: 0, max: 255, value: 128, unit: '' },
      { key: 'softness', label: 'Softness', type: 'range', min: 0, max: 60, value: 0, unit: '' },
    ],
    apply(src, dst, p) {
      const { width: w, height: h } = src;
      const sCtx = src.getContext('2d');
      const dCtx = dst.getContext('2d');
      const srcData = sCtx.getImageData(0, 0, w, h);
      const out = new ImageData(w, h);
      for (let i = 0; i < srcData.data.length; i += 4) {
        const lum = srcData.data[i] * 0.299 + srcData.data[i + 1] * 0.587 + srcData.data[i + 2] * 0.114;
        let v;
        if (p.softness > 0) {
          v = Math.min(255, Math.max(0, ((lum - p.level) / p.softness + 0.5) * 255)) | 0;
        } else {
          v = lum >= p.level ? 255 : 0;
        }
        out.data[i] = out.data[i + 1] = out.data[i + 2] = v;
        out.data[i + 3] = srcData.data[i + 3];
      }
      dCtx.putImageData(out, 0, 0);
    },
  },
];
