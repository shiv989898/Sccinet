---
name: Technical Clay
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#434655'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an architectural, tactile aesthetic engineered for precision platforms that require both extreme clarity and soft ergonomic presence. Rooted in true claymorphism, the visual identity rejects both skeuomorphic plastic hyper-realism and flat, clinical abstraction. Instead, it treats the interface as a physical slate molded from fine-grain composite porcelain or matte technical clay.

The experience evokes calm assurance, tactile reliability, and effortless restraint. Surfaces do not float high in arbitrary space; they emerge smoothly from the structural foundation with physical continuity, soft ambient dual-directional light, and quiet internal geometry. Every element feels machined yet soft to the touch, devoid of decorative noise, cartoon inflation, or theatrical translucency.

## Colors

The palette operates on calibrated low-saturation tonality to produce soft, non-fatiguing contrast.

- **Background (`#EEF2F6`):** The structural base layer. A balanced neutral infused with a low-wavelength blue-slate cast, preventing the clinical sterile glare of pure cold grey.
- **Surface Tier 1 (`#F7FAFD`):** Elevated parent card containers and soft molded panels, providing gentle separation above the background canvas.
- **Surface Tier 0 / Floating Surface (`#FFFFFF`):** High-priority focus areas, floating pill segments, or interactive toggles requiring crisp separation.
- **Primary Text (`#111827`):** High-density slate-900 offering AAA accessibility against both `#EEF2F6` and `#FFFFFF` without the harshness of `#000000`.
- **Secondary Text (`#64748B`):** Supporting metadata, quiet indicators, and structural descriptors.
- **Accent (`#2563EB`):** Refined technical cobalt. Reserved strictly for primary state confirmations, targeted focus indicators, active selection fills, and primary action affordance. Never deployed as broad atmospheric gradient fills.
- **Shadow Tone (`#0F172A` at variable low opacities):** Used for ambient occlusion and directional drop values.
- **Light Rim Tone (`#FFFFFF` at variable medium-high opacities):** Used for top-left incident diffuse illumination.

## Typography

The typographic pairing contrasts Geist's neutral, geometric structural cadence for headings and data labels with Inter's optimized textual legibility for continuous reading and form controls.

- **Headlines:** Formed in Geist with tight tracking (`-0.015em` to `-0.025em`) and deliberate weights (500/600), delivering a compact architectural presence.
- **Body:** Inter provides balanced horizontal proportions and large counters, maintaining comfortable legibility over soft clay surfaces.
- **Micro-labels (`label-caps`):** Strictly set in Geist uppercase with positive letter spacing (`0.06em`). Used for field headers, status markers, metadata rows, and category tags to build crisp structural contrast against organic clay forms.

## Layout & Spacing

A mobile-first philosophy governs this layout engine. Because clay surfaces rely on ambient light diffusion and soft depth to indicate hierarchy, layout elements require deliberate negative space to prevent shadow overlap and visual muddiness.

- **Mobile (< 768px):** 4-column layout. Margin: `1rem` (16px), Gutter: `1rem` (16px). Containers span 4 columns to maximize tap surface areas.
- **Tablet (768px - 1023px):** 8-column layout. Margin: `2rem` (32px), Gutter: `1.5rem` (24px).
- **Desktop (>= 1024px):** 12-column layout. Margin: `3rem` (48px), Gutter: `2rem` (32px). Maximum container width is locked at 1280px to preserve comfortable scan lengths.
- **Rhythm:** Spacing follows an absolute 4px/8px modular scale. Component internal padding never drops below `0.75rem` for touch affordances.

## Elevation & Depth

Visual hierarchy is constructed entirely through physical extrusion and recessed debossing. No translucent backdrops, glass blurs, or sharp high-contrast strokes are permitted.

### The Clay Light Model
Light arrives consistently from the top-left at an angle of 315° (top-left incident light), casting two simultaneous shadow manifestations:
1. **The Negative Ambient Shadow (Bottom-Right):** Tinted slate (`rgba(15, 23, 42, 0.05)` to `rgba(15, 23, 42, 0.08)`), softened over wide radiuses to suggest natural material thickness rather than a razor-thin paper card.
2. **The Incident Matte Rim (Top-Left):** Pure diffuse white (`rgba(255, 255, 255, 0.95)` to `rgba(255, 255, 255, 1.0)`), establishing the lightward chamfer edge.

### Elevation Levels

- **Depressed / Inset (Level -1 - Inputs, Well Containers, Trough Controls):**
  - Outer: None.
  - Inset Top-Left: `inset 3px 3px 6px rgba(15, 23, 42, 0.06)`
  - Inset Bottom-Right: `inset -3px -3px 6px rgba(255, 255, 255, 0.9)`
  - Fill: `#EEF2F6` (matching or slightly lower than canvas value).

- **Flat / Ground (Level 0 - Structural Canvas):**
  - Background fill: `#EEF2F6`. No shadow.

- **Extruded Card / Panel (Level 1 - Primary Containers):**
  - Fill: `#F7FAFD` or `#FFFFFF`.
  - Directional Shadow: `8px 12px 24px -4px rgba(15, 23, 42, 0.05), 2px 4px 8px -2px rgba(15, 23, 42, 0.03)`
  - Lightward Highlight: `-6px -6px 16px 0px rgba(255, 255, 255, 0.95)`
  - Border: 1px solid `rgba(255, 255, 255, 0.8)` (a structural hairline to preserve micro-contrast).

- **Floating Interactive (Level 2 - Primary Buttons, Floating Controls, Active Modals):**
  - Fill: `#FFFFFF` or `#2563EB`.
  - Directional Shadow: `12px 18px 30px -4px rgba(15, 23, 42, 0.08), 4px 6px 12px -2px rgba(15, 23, 42, 0.04)`
  - Lightward Highlight: `-8px -8px 20px 0px rgba(255, 255, 255, 1.0)`
  - When filled with `#2563EB`, the directional shadow shifts to `0 10px 24px -4px rgba(37, 99, 235, 0.35)`.

## Shapes

Shapes emulate solid, CNC-milled physical slabs. Corners are rounded with disciplined restraint to maintain a clean technical profile and avoid cartoonish blob geometry.

- **Standard Base Radii (`rounded-xl` / 16px):** Form inputs, buttons, chips, nested list items, and standard panels.
- **Large Container Radii (`rounded-2xl` / 24px):** Primary content cards, layout modules, modals, and section wrappers.
- **Micro Radii (8px):** Checkboxes, radio inner indicators, and precision badges.
- **Fully Rounded / Pill:** Restricted strictly to floating segment toggles, search bars, and floating utility bars where the pill shape communicates complete encapsulation.

## Components

### Buttons
- **Primary Button:** Milled cobalt `#2563EB` surface. Text: `#FFFFFF`, weight 500. Box shadow: `6px 8px 18px -2px rgba(37, 99, 235, 0.32), inset 1px 1px 1px rgba(255, 255, 255, 0.3)`. Active state compresses downward: shadow drops to `2px 3px 6px rgba(37, 99, 235, 0.25)`, transform `translateY(1px)`.
- **Secondary / Soft Button:** `#F7FAFD` surface with `#111827` text. Level 1 shadow combination (`4px 6px 12px rgba(15, 23, 42, 0.04), -4px -4px 10px #FFFFFF`). Hover brings gentle forward extrusion; active state compresses flush.

### Input Fields & Search Bars
- Recessed design (Level -1). Background `#EEF2F6`.
- Dual inner shadows: `inset 2px 2px 5px rgba(15, 23, 42, 0.06), inset -2px -2px 5px rgba(255, 255, 255, 0.85)`.
- Border: 1px solid `rgba(226, 232, 240, 0.6)`.
- Focus state: Subtle cobalt glow ring (`0 0 0 3px rgba(37, 99, 235, 0.15)`), border turns `#2563EB`.

### Cards & Panels
- Surface: `#FFFFFF` or `#F7FAFD`. Border-radius: `24px` (`rounded-2xl`).
- Padding: `1.5rem` (mobile), `2rem` (desktop).
- Ambient clay elevation: `10px 16px 28px -4px rgba(15, 23, 42, 0.04), -8px -8px 20px #FFFFFF`.

### Segmented Controls & Chips
- **Container Trough:** Inset recessed well (`#E8EDF3`), border-radius `16px`, padding `4px`.
- **Active Segment:** Extruded soft white `#FFFFFF` pill, Level 1 shadow (`2px 4px 8px rgba(15, 23, 42, 0.05), -2px -2px 6px #FFFFFF`). Text: `#111827`.
- **Inactive Segment:** Flush, text `#64748B`.

### Checkboxes & Radios
- Box/Circle: Recessed bevel well (20px size).
- Checked State: Accent fill `#2563EB` with an extruded white checkmark or dot, accompanied by a small outer glow `0 2px 8px rgba(37, 99, 235, 0.3)`.

### Lists
- Container uses flat or inset framing.
- List items feature generous vertical rhythm (`14px` padding), separated by soft inset division grooves (`1px solid rgba(226, 232, 240, 0.7)`). Interactive rows slightly elevate on tap/hover.