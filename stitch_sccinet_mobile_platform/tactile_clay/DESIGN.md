---
name: Tactile Clay
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
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-lg:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.005em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.02em
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
This design system pairs the tactile materiality of light claymorphism with the exacting rigor of high-performance product interfaces. It targets professionals who value structural clarity, ergonomic precision, and deliberate, understated polish over visual noise. 

The aesthetic avoids exaggerated plastic gloss, gummy blobs, and neon saturations. Instead, it relies on soft-molded, matte-finished surfaces, directional ambient light, sculpted recessed basins, and gently elevated planes. The atmosphere is calm, physical, modern, and spacious. Surfaces feel milled, cast, and refined under neutral ambient light, creating intuitive physical affordances optimized from small touchscreens upward.

## Colors
The color architecture establishes subtle depth through low-contrast matte shifts rather than sharp structural lines:

- **Canvas Background (`#EEF2F6`)**: The global base plane onto which all tactile forms are molded.
- **Surface Elevated (`#FFFFFF`)**: Reserved for raised tactile cards, dialogs, and protruding interactive buttons.
- **Surface Molded / Midground (`#F7FAFD`)**: Used for secondary grouping surfaces, segmented track housings, and subtle card backings.
- **Primary Text (`#111827`)**: Deep slate-black providing crisp contrast against light surfaces.
- **Secondary Text (`#64748B`)**: Muted slate for metadata, supporting descriptions, and inactive icons.
- **Primary Accent (`#2563EB`)**: Technical royal blue for focused states, active toggles, brand highlights, and key affordances. Applied as a solid tactile matte, avoiding saturated specular highlights.
- **Recessed Surface Base (`#E2E8F0`)**: Subtle tone used to indicate hollows, pressed states, and trough tracks.

## Typography
Typographic treatment is engineered for extreme clarity and technical restraint. Geist is the primary family (with Inter as the immediate system fallback), delivering neutral grotesque proportioning that balances the soft volume of clay components.

- **Headlines**: Semi-bold (`600`) with tightened tracking (`-0.01em` to `-0.03em`) to anchor floating clay containers with solid vertical weight.
- **Body**: Regular (`400`) set with generous line heights (`1.5` to `1.625`) to preserve negative space against structural surface shadows.
- **Labels & Captions**: Medium (`500`) and Semi-bold (`600`) for high scan-efficiency on sculpted, elevated surfaces.

## Layout & Spacing
A fluid-first responsive grid system scaled dynamically across screen breakpoints:
- **Mobile (< 768px)**: 4-column layout, 16px margins, 16px gutters. Edge-to-edge component padding prioritizes thumb accessibility with minimum target regions of 48px.
- **Tablet (768px - 1023px)**: 8-column layout, 32px margins, 24px gutters.
- **Desktop (1024px+)**: 12-column layout, max-width bounded at 1280px, 48px margins, 32px gutters.

The spacing rhythm is spacious and breathable (`space-md` through `space-xl`). Because claymorphic elements occupy volumetric space via inner and outer shadows, components require larger ambient buffers (`space-lg` to `space-xl`) between neighboring modules to prevent visual crowding.

## Elevation & Depth
Claymorphic depth is generated strictly by simulated top-left directional illumination (135° key light) hitting matte, non-glossy materials. Every visual state must be explicitly extruded or carved:

### Elevated / Raised Plane (Cards, Modals, Action Buttons)
Combines two directional drop shadows with a subtle soft interior top-left edge highlight:
- Outer Light Catch: `-6px -6px 14px rgba(255, 255, 255, 0.95)`
- Outer Ambient Drop: `8px 10px 20px rgba(166, 178, 196, 0.35)`
- Inner Bevel Highlight: `inset 1px 1px 2px rgba(255, 255, 255, 0.8), inset -1px -1px 2px rgba(166, 178, 196, 0.15)`

### Recessed / Carved Plane (Input Fields, Search Basins, Inset Toggles)
Inverts the depth so the surface appears stamped directly into the `#EEF2F6` canvas:
- Inner Top-Left Shade: `inset 3px 3px 6px rgba(166, 178, 196, 0.4)`
- Inner Bottom-Right Bounce: `inset -3px -3px 6px rgba(255, 255, 255, 0.9)`
- Outer Shadow: `none`

### Active / Pressed State
Switches instantly from elevated to recessed, compressing the Z-axis to deliver clear tactile feedback. No glossy sheen, pure matte deformation.

## Shapes
Surfaces adhere consistently to a rounded, ergonomic geometry anchored at `16px` (`rounded-2xl`). 

- Standard Cards, Modals, Panels, and Containers: Fixed `16px` radius.
- Buttons, Input Fields, and Chips: Fixed `16px` radius (`rounded-2xl`) to ensure identical curvature across interaction tiers.
- Micro-Indicators & Sliders: Maintained at `16px` or full circular form (`rounded-full`) when aspect ratio is 1:1.

Avoid sharp corners (`0px` to `4px`) which break the illusion of cast clay, and avoid exaggerated jelly/blob silhouettes which degrade professional authority.

## Components

### Buttons
- **Primary Elevated**: `#2563EB` solid fill, white text (`#FFFFFF`), `16px` radius, inner highlight `inset 1px 1px 2px rgba(255, 255, 255, 0.35)`, outer soft shadow `4px 6px 14px rgba(37, 99, 235, 0.25)`. Pressed state transitions to flat/slight inset with darkened fill.
- **Secondary Neutral**: `#FFFFFF` or `#F7FAFD` fill, `#111827` text, standard elevated clay shadow pair. On press: collapses to recessed inset shadow pair.
- **Height & Padding**: Minimum touch height 48px, horizontal padding `1.25rem` (`space-lg`).

### Form Inputs & Search Fields
- Always recessed into the canvas.
- Background: `#EEF2F6`.
- Shadow: `inset 2px 2px 5px rgba(166, 178, 196, 0.35), inset -2px -2px 5px rgba(255, 255, 255, 0.95)`.
- Border: `none` or `1px solid transparent`.
- Focus State: Smooth inner glow accent (`inset 0 0 0 2px #2563EB`).
- Typography: `#111827` active, `#64748B` placeholder.

### Cards & Modules
- Background: `#FFFFFF` or `#F7FAFD`.
- Corner Radius: `16px`.
- Elevation: Standard raised dual-shadow with ambient clay dispersion.
- Structure: Clear hierarchy using generous internal padding (`space-lg`), separating sections with whitespace rather than harsh separator lines.

### Chips & Filters
- **Default/Unselected**: Elevated `#FFFFFF` surface with low-elevation clay shadow.
- **Active/Selected**: Recessed basin with `#EEF2F6` base, `#2563EB` text and active pill indicator, or filled `#2563EB` with tactile drop shadow.

### Checkboxes & Radio Controls
- **Unchecked**: 22px × 22px recessed clay well, `#EEF2F6` interior.
- **Checked**: Houses an elevated `#2563EB` inner clay core with a crisp white tick or pip.

### Segmented Controls & Toggles
- Housing: Recessed track molded into `#EEF2F6`.
- Active Thumb: Elevated `#FFFFFF` pill that physically "floats" within the track via soft directional shadows.