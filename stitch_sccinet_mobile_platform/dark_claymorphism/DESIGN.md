---
name: Dark Claymorphism
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353943'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c2029'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2ef'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#c1c6d7'
  on-secondary: '#2a303d'
  secondary-container: '#434957'
  on-secondary-container: '#b3b8c8'
  tertiary: '#c2c6d8'
  on-tertiary: '#2b303e'
  tertiary-container: '#8c90a1'
  on-tertiary-container: '#252937'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#dde2f3'
  secondary-fixed-dim: '#c1c6d7'
  on-secondary-fixed: '#161c28'
  on-secondary-fixed-variant: '#414754'
  tertiary-fixed: '#dee2f5'
  tertiary-fixed-dim: '#c2c6d8'
  on-tertiary-fixed: '#161b29'
  on-tertiary-fixed-variant: '#424655'
  background: '#0f131c'
  on-background: '#dfe2ef'
  surface-variant: '#31353f'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system manifests a tactile, calm, and deeply sophisticated interface engineered around matte dark surfaces, modeled relief, and disciplined mechanical tactility. Moving away from neon glows, glossy glassmorphism, or playful cartoon blobbiness, this aesthetic relies on real physical presence: velvety slate materials, muted soft-directional lighting, extruded elevations, and recessed control cavities.

The target audience comprises technical professionals, power users, and system operators who require prolonged visual focus without cognitive fatigue. The visual tone remains understated, reliable, and grounded—evoking industrial instrumentation crafted from machined, matte-treated composites. Every element respects high visual contrast for data density while maintaining sculptural depth.

## Colors
The palette leverages a dark architectural scale rooted in deep slate values:
- **Canvas Base (`#0D111A`):** The foundational void upon which all sculpted surfaces rest.
- **Surface Elevation (`#161C28`):** The default elevated body for cards, panels, and floating controls.
- **Surface Recessed / Substrate (`#101522`):** The carved basin used for wells, input slots, toggled troughs, and secondary panels.
- **Accent Primary (`#3B82F6`):** Precision cobalt indicator for active states, key focus rings, and primary action affordances.
- **Text & Content Primary (`#F8FAFC`):** Crisp off-white ensuring WCAG AAA legibility against all slate planes.
- **Text & Content Secondary (`#94A3B8`):** Muted cool slate for supporting metadata, passive icons, and structural boundaries.

Surfaces do not use pure chromatic tints or high-saturation specular highlights; highlights remain soft off-white or sky washes with extremely high diffusion and low opacity.

## Typography
Typographic scale combines the geometric rigor of Geist for structure, headings, and functional metadata with the neutral legibility of Inter for continuous body copy. Line heights are spaced generously to match the physical volume of claymorphic architecture, preventing crowded blocks on darker tones. Tight negative letter spacing is applied to large headlines to keep wordforms visually cohesive alongside chunky, molded components.

## Layout & Spacing
Built mobile-first, layouts transition from a 4-column structure (margins: `1rem`, gutters: `1rem`) on mobile viewport tiers, to an 8-column setup at `768px`, and a 12-column system at `1024px` and above (max-width `1280px`, margins: `2.5rem`, gutters: `1.5rem`).

Because tactile depth requires physical breathing room to distinguish extrusions from recesses, components employ generous internal clearance. Dense layouts are avoided; vertical flow preserves clear separation through the regular application of `space-md` (`1rem`) and `space-lg` (`1.5rem`) gaps.

## Elevation & Depth
Claymorphism relies on dual-opposed directional light simulating a light source placed at top-left (`-45deg`). Elements appear extruded from or pressed into the `#0D111A` matte base. 

1. **Elevated Surfaces (Cards, Floating Controls, Badges):**
   - Background: `#161C28`
   - Cast Shadow: `4px 8px 20px rgba(0, 0, 0, 0.45)`
   - Outer Under-Gaze Softening: `-2px -2px 10px rgba(255, 255, 255, 0.03)`
   - Inner Rim Highlight: `inset 1px 1px 2px rgba(255, 255, 255, 0.08)`
   - Inner Bottom Lip: `inset -2px -2px 4px rgba(0, 0, 0, 0.35)`

2. **Recessed Wells (Inputs, Unchecked Track Slots, Sunk Surfaces):**
   - Background: `#101522`
   - Inner Shadow (Upper Left): `inset 3px 3px 6px rgba(0, 0, 0, 0.55)`
   - Inner Highlight (Lower Right): `inset -2px -2px 4px rgba(255, 255, 255, 0.03)`
   - External Outline: None; depth is formed purely by interior shadow values.

3. **Accentuated Clay (Active Blue Buttons & Knobs):**
   - Background: `#3B82F6`
   - Cast Shadow: `0px 6px 16px rgba(59, 130, 246, 0.25), 2px 4px 12px rgba(0, 0, 0, 0.4)`
   - Inner Top Bevel: `inset 1px 1px 2px rgba(255, 255, 255, 0.35)`
   - Inner Bottom Shadow: `inset -2px -2px 4px rgba(0, 0, 0, 0.3)`

## Shapes
Surfaces feature unified 16px (`rounded-2xl` / 1rem) corner rounding across all primary structural cards, modals, buttons, and interaction surfaces. This geometry preserves structural integrity and precision without degenerating into amorphous liquid forms. Compact sub-elements (chips, indicators, tags) scale down to 8px (`rounded-lg`), while small toggles and sliders utilize full pill rounding (`9999px`) to maintain mechanical clarity.

## Components

### Buttons
- **Primary:** Molded `#3B82F6` pill or `rounded-2xl` container. Inner top-left edge highlight (`inset 1px 1px 2px rgba(255, 255, 255, 0.35)`), bottom-right inner shadow (`inset -2px -2px 4px rgba(0, 0, 0, 0.3)`), and soft tinted ambient drop shadow. Font is Geist 14px medium `#F8FAFC`.
- **Secondary (Elevated Slate):** Background `#161C28`. Dual ambient shadows (dark lower-right, faint white upper-left). Active states collapse the drop shadow and trigger an inner well effect (`inset 2px 2px 4px rgba(0, 0, 0, 0.5)`).

### Input Fields
- Built as recessed control cavities directly pressed into `#0D111A`.
- Background `#101522`, `16px` border-radius, height `48px`.
- Inset shadow: `inset 2px 2px 6px rgba(0, 0, 0, 0.55), inset -1px -1px 2px rgba(255, 255, 255, 0.03)`.
- Text `#F8FAFC`, placeholder `#94A3B8`.
- Focus state: A subtle outer perimeter trace of `#3B82F6` with 0.15 opacity, avoiding sharp neon halos.

### Cards & Containers
- Surface `#161C28`, radius `16px`, generous internal padding (`space-lg` / `1.5rem`).
- Tactile outer ambient shadow (`4px 8px 24px rgba(0,0,0,0.5)`), paired with dual internal rim lighting (top highlight `rgba(255,255,255,0.06)`, bottom occlusion `rgba(0,0,0,0.3)`).

### Chips & Badges
- Small tactile badges (`height: 28px`, radius `8px`).
- Inactive: `#101522` recessed or neutral flat with slate text (`#94A3B8`).
- Selected: Molded `#161C28` with subtle accent border or bold blue fill (`#3B82F6`) with white text (`#F8FAFC`).

### Checkboxes & Radios
- **Checkboxes:** `20px x 20px` square with `6px` radius. Recessed `#101522` cavity when unselected; extruded `#3B82F6` block with sculpted check mark when active.
- **Radio Buttons:** Sunk `#101522` circle cavity (`20px`). Checked state renders an elevated, floating `#3B82F6` bead inside the well with its own soft top-left highlight.

### Toggles / Switches
- Well: Carved track `#101522`, width `48px`, height `26px`, pill-shaped, inner shadow `inset 2px 2px 5px rgba(0,0,0,0.6)`.
- Thumb: Extruded `#161C28` (or `#F8FAFC` on active) disc `20px x 20px`, pill-shaped, casting drop shadow onto the recessed channel.