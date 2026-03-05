# Intro Generator — Template Reference

Canvas size: **1280 × 720 px**. All templates auto-fade out 600 ms before the end.
Colors are driven by the global **Accent** and **Background** color pickers.

---

## Global Settings

| Setting | Range / Type | Default | Notes |
|---|---|---|---|
| Title | text | — | Displayed by all templates |
| Tagline | text | — | Smaller subtitle line |
| Duration | 2–10 s | 4 s | Total animation length |
| FPS | 24 / 30 / 60 | 30 | Export frame rate |
| Background Color | color | `#000000` | Base fill for all templates |
| Accent Color | color | `#e8ff00` | Primary highlight color |

---

## Built-in Templates

### ⚡ Glitch

Glitchy logo reveal with chromatic aberration, wipe title, and particle burst.

| Param | Range | Default | Unit |
|---|---|---|---|
| Logo Width | 20–600 | 260 | px |
| Logo Height | 20–500 | 220 | px |
| Glitch Intensity | 0–100 | 50 | — |
| Chromatic Aberr. | 0–30 | 12 | px |
| Grain | 0–100 | 20 | — |
| Scanlines | toggle | on | — |
| Brackets | toggle | on | — |
| Particles | toggle | on | — |

**Timeline:** grain static → logo glitch in (600 ms) → chromatic logo (1200 ms) → title wipe (1000 ms) → tagline (1400 ms) → brackets (1600 ms)

---

### ◌ Minimal

Clean expanding rings, logo fade-in, accent divider, and corner marks.

| Param | Range | Default | Unit |
|---|---|---|---|
| Ring Count | 1–4 | 2 | — |
| Logo Width | 20–600 | 220 | px |
| Logo Height | 20–500 | 220 | px |
| Title Size | 40–100 | 68 | px |
| Brackets | toggle | on | — |
| Corner Marks | toggle | on | — |
| Vignette | 0–100 | 40 | — |

**Timeline:** rings expand → logo fade (400 ms) → title slide (900 ms) → divider (1200 ms) → tagline (1400 ms) → brackets (1600 ms) → corner marks (1800 ms)

---

### ⬒ Retro

Retrowave aesthetic: gradient sky, retro sun, perspective grid, chromatic logo.

| Param | Range | Default | Unit |
|---|---|---|---|
| Sun Size | 60–200 | 120 | px |
| Logo Width | 20–600 | 200 | px |
| Logo Height | 20–500 | 200 | px |
| Grid Density | 8–20 | 14 | columns |
| Grid Rows | 6–16 | 12 | rows |
| Neon Glow | 0–60 | 30 | px blur |
| Scanlines | toggle | on | — |
| Chromatic Aberr. | 0–30 | 14 | px |

**Timeline:** sun rise (100 ms) → grid sweep (300 ms) → chromatic logo (700 ms) → glowing title (1100 ms) → tagline (1700 ms)

---

### 🔷 Cyberpunk

Hex grid, data streams, chromatic logo, wipe title reveal, bracket frame.

| Param | Range | Default | Unit |
|---|---|---|---|
| Hex Grid Size | 20–120 | 60 | px |
| Hex Grid Alpha | 0–100 | 30 | — |
| Logo Width | 20–600 | 240 | px |
| Logo Height | 20–500 | 240 | px |
| Data Streams | 0–40 | 20 | count |
| Stream Opacity | 0–100 | 40 | — |
| Chromatic Aberr. | 0–30 | 10 | px |
| Scanlines | toggle | on | — |

**Timeline:** hex grid (100 ms) → data streams (300 ms) → chromatic logo (600 ms) → ring burst (800 ms) → title wipe (1100 ms) → brackets + tagline (1500 ms) → particle burst (1400 ms)

---

### 🎬 Cinematic

Film-like: warm/cool grade, letterbox bars, grain, clean logo and title.

| Param | Range | Default | Unit |
|---|---|---|---|
| Letterbox | 0–15 | 8 | % of height |
| Film Grain | 0–100 | 60 | — |
| Warm Grade | −50–50 | 15 | negative = cool |
| Title Size | 40–100 | 80 | px |
| Logo Width | 20–600 | 240 | px |
| Logo Height | 20–500 | 200 | px |
| Vignette | 0–100 | 70 | — |

**Timeline:** letterbox animate in (0–600 ms) → logo fade (200 ms) → title (1000 ms) → divider (1400 ms) → tagline (1600 ms)

---

### ✦ Neon Noir

Rain, neon light streaks, glowing logo and title.

| Param | Range | Default | Unit |
|---|---|---|---|
| Rain | toggle | on | — |
| Logo Width | 20–600 | 220 | px |
| Logo Height | 20–500 | 220 | px |
| Rain Density | 20–200 | 80 | drops |
| Rain Opacity | 0–100 | 50 | — |
| Fog Intensity | 0–100 | 50 | — |
| Light Streaks | 0–20 | 8 | count |
| Neon Glow | 0–60 | 40 | px blur |

**Timeline:** streaks (200 ms) → rain (300 ms) → logo fade (600 ms) → glow logo (1000 ms) → glowing title (1100 ms) → tagline (1500 ms)

---

## Custom Template — Layer Types

Layers render top-to-bottom. **Timed layers** have two extra params prepended:

| Param | Range | Default | Notes |
|---|---|---|---|
| Trigger (0→1) | 0–1 | 0 | Fraction of total duration when layer starts |
| Fade In (ms) | 100–2000 | 500 | Ease-in duration |

All layers fade out automatically in the last 600 ms.

---

### ▪ Solid BG
Fills the entire canvas with a flat color.

| Param | Type | Default |
|---|---|---|
| Color | color | `#000000` |

---

### ◈ Gradient BG
Three-stop vertical linear gradient.

| Param | Type | Default |
|---|---|---|
| Top Color | color | `#06001a` |
| Mid Color | color | `#110033` |
| Bottom Color | color | `#000000` |
| Mid Position | 0.1–0.9 | 0.5 |

---

### ⬡ Logo *(timed)*
Draws the uploaded logo with three render styles.

| Param | Range | Default | Notes |
|---|---|---|---|
| Width | 20–900 | 220 | px |
| Height | 20–700 | 220 | px |
| Y Offset | −300–300 | −60 | px from center |
| Style | select | Normal | Normal / Chromatic / Glitch |
| CA Amount | 0–30 | 12 | px — chromatic aberration offset |
| Glitch Int. | 0–100 | 50 | glitch slice displacement |

> Auto-set when a logo file is loaded, preserving aspect ratio at ~260 px max.

---

### T Title *(timed)*
Draws the title text with optional glow and three entrance animations.

| Param | Range | Default | Notes |
|---|---|---|---|
| Size | 30–120 | 72 | px |
| Color | color | `#e8ff00` | — |
| Y Offset | −300–300 | 110 | px from center |
| Letter Spacing | 0–20 | 8 | px |
| Animation | select | Fade | Fade / Slide Up / Wipe L→R |
| Neon Glow | toggle | off | Adds shadow blur behind text |

---

### — Tagline *(timed)*
Smaller subtitle line below the title.

| Param | Range | Default | Unit |
|---|---|---|---|
| Size | 10–30 | 17 | px |
| Color | color | `#888888` | — |
| Y Offset | −300–300 | 160 | px from center |

---

### ⸺ Divider *(timed)*
Horizontal accent line.

| Param | Range | Default | Unit |
|---|---|---|---|
| Y Offset | −300–300 | 85 | px from center |
| Width % | 5–100 | 50 | % of canvas width |
| Color | color | `#e8ff00` | — |
| Thickness | 0.5–5 | 1 | px |

---

### ⌐ Brackets *(timed)*
Corner bracket frame around the composition.

| Param | Range | Default | Unit |
|---|---|---|---|
| Width | 100–700 | 400 | px |
| Height | 60–500 | 280 | px |
| Y Offset | −300–300 | 30 | px from center |
| Color | color | `#e8ff00` | — |
| Arm Length | 10–80 | 36 | px |
| Expand In | toggle | on | Animates from narrow to full width |

---

### ◉ Vignette
Dark radial fade toward edges. Always-on (no timing).

| Param | Range | Default |
|---|---|---|
| Strength | 0–100 | 60 |

---

### ≡ Scanlines
Horizontal line overlay. Always-on.

| Param | Range | Default |
|---|---|---|
| Opacity | 0–100 | 6 |

---

### ∷ Film Grain
Animated noise over the canvas. Always-on.

| Param | Range | Default |
|---|---|---|
| Intensity | 0–100 | 30 |

---

### ⊟ Letterbox *(timed)*
Black bars at top and bottom (cinematic crop).

| Param | Range | Default | Unit |
|---|---|---|---|
| Bar Height % | 2–20 | 8 | % of canvas height |

---

### ⬡ Hex Grid *(timed)*
Honeycomb pattern overlay.

| Param | Range | Default | Unit |
|---|---|---|---|
| Hex Size | 20–120 | 60 | px |
| Opacity | 0–100 | 30 | — |
| Color | color | `#e8ff00` | — |

---

### ⊞ Persp. Grid *(timed)*
Perspective ground grid (retrowave style).

| Param | Range | Default | Unit |
|---|---|---|---|
| Columns | 4–20 | 14 | — |
| Rows | 4–16 | 12 | — |
| Horizon Y % | 20–80 | 52 | % of canvas height |
| Opacity | 0–100 | 50 | — |
| Color | color | `#e8ff00` | — |

---

### ☀ Retro Sun *(timed)*
Striped retrowave sun with radial glow.

| Param | Range | Default | Unit |
|---|---|---|---|
| Sun Size | 40–200 | 120 | px radius |
| Y Position % | 20–80 | 52 | % of canvas height |
| Color | color | `#e8ff00` | — |

---

### ↓ Data Streams *(timed)*
Falling matrix-style characters.

| Param | Range | Default |
|---|---|---|
| Count | 5–50 | 20 |
| Opacity | 0–100 | 40 |
| Color | color | `#e8ff00` |

---

### 🌧 Rain *(timed)*
Diagonal rain streaks.

| Param | Range | Default |
|---|---|---|
| Drop Count | 20–200 | 80 |
| Opacity | 0–100 | 50 |
| Color | color | `#e8ff00` |

---

### ◎ Ring Burst *(timed)*
One-shot expanding ring(s) from the canvas center.

| Param | Range | Default | Unit |
|---|---|---|---|
| Count | 1–5 | 1 | rings |
| Max Radius | 50–600 | 300 | px |
| Line Width | 0.5–4 | 1.5 | px |
| Color | color | `#e8ff00` | — |

> One-shot: fires once at the trigger point, then rings expand and fade.

---

### ✦ Particles *(timed)*
One-shot burst of particles from the canvas center.

| Param | Range | Default | Unit |
|---|---|---|---|
| Count | 5–100 | 30 | — |
| Speed | 1–12 | 5 | px/frame |
| Size | 0.5–6 | 2 | px |
| Color | color | `#e8ff00` | — |

> One-shot: fires once at the trigger point.

---

### ⚡ Flash *(timed)*
Single-frame white (or colored) flash.

| Param | Range | Default | Unit |
|---|---|---|---|
| Color | color | `#ffffff` | — |
| Hold (ms) | 20–300 | 80 | ms |

---

### ✧ Neon Glow
Soft radial color bloom over the whole canvas. Always-on.

| Param | Range | Default | Unit |
|---|---|---|---|
| Blur | 0–60 | 20 | px |
| Color | color | `#e8ff00` | — |
| Opacity | 0–100 | 30 | — |

---

## Export / Import

| Action | How |
|---|---|
| **↑ Export** | Downloads current custom layer stack as `intro-layers.json` |
| **↓ Import** | Loads a `intro-layers.json` file and replaces the current layer stack |
| **+ Save** | Saves the current layer stack to browser localStorage with a name |

Exported files are plain JSON arrays — each object has `type`, `params`, and can be edited by hand.
