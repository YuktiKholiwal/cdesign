# Design Spec – Clerk (clerk.com)

## Brand & Layout
- Overall feel: Clerk presents a clean, modern developer-focused aesthetic — dark-leaning surfaces with sharp typographic hierarchy, minimal ornamentation, and a sense of technical precision balanced with approachability.
- Layout: Full-width sections with centered max-width content containers; sticky header with layered backdrop blur; heavy use of flexible grid and flex-based layouts for feature cards and documentation panels.

## Colors

- **Primary:** Near-black `#0a0a0b` — used for primary text and high-contrast UI elements on light surfaces.
- **Accent:** Indigo-violet `#4d4ad9` — used for interactive highlights, links, and active states (inferred from color props).
- **Backgrounds:**
  - Page background (dark): `#0f0f12` to `#1a1a1f` — deep near-black used for primary dark surfaces.
  - Surface / card background: `#1c1c22` / `#2a2b31` — slightly elevated panels and cards.
  - Subtle overlay/divider: `#2b2b3108` — near-transparent wash for hover states or panel borders.
  - Navy accent panel: `#0c1630` — used in feature or hero sections for contrast (assumed marketing use).
- **Text colors:**
  - Main text: `#0a0a0b` (on light) / near-white (assumed on dark).
  - Muted text: `#0a0a0b66` (40% opacity black) — secondary or descriptive text.
  - Subdued: `#0a0a0bcc` (80% opacity black) — body copy at medium emphasis.
  - On-dark inverted text: white or near-white (assumed).

## Typography

- **Base font:** `Inter, Inter Fallback` / `var(--font-sans)` which maps to Suisse or system-ui fallbacks; effectively `suisse, suisse Fallback, ui-sans-serif, system-ui, sans-serif`.
- **Base size:** Not directly observed; (assumed) 16px based on standard Tailwind defaults and label scale ratios.
- **Heading scale:**
  - H2 / H3: 22px, medium-to-semibold weight, moderately tight line-height.
  - H4: 18px, medium weight.
  - H5: 16px, medium weight.
  - H1: Not directly observed; (assumed) 36–56px for hero headings, bold weight, tight tracking.
  - General style: headings use `var(--font-sans)` (Suisse or Inter), with medium–semibold weight and controlled line-heights (155–160% at body scale, tighter at display scale).
- **Label scale (form/UI labels):**
  - `.label-1`: 18px / 500 weight / 155.6% line-height
  - `.label-2`: 15px / 500 weight / 160% line-height
  - `.label-3`: 13px / 500 weight / 153.8% line-height
  - `.label-4`: 11px / 500 weight / 163.6% line-height
  - `.label-5`: 10px / 500 weight / 150% line-height
- **Monospace:** `var(--font-mono)` / `soehneMono` / `geistMono` — used for code blocks, inline code, and technical content throughout docs.

## Spacing & Radius

- **Base spacing unit:** 4px (Tailwind default).
- **Spacing scale:** 4, 8, 12, 14, 16, 18, 22, 24, 26, 27, 34, 54, 58, 114px — a broadly standard 4px-base scale with some non-standard values at larger sizes suggesting custom section padding.
- **Border radius:**
  - Small (inputs, badges, chips): 4–6px
  - Medium (buttons, cards): 8–12px
  - Large (modals, panels): 16–24px
  - Extra large / pill (decorative elements): 32–38px
  - Full square / flush: 0px (reset on base elements)

## Shadows & Borders

- **Shadows:**
  - Utility classes `shadow-sm`, `shadow`, `shadow-md`, `shadow-2xl` are in use — ranging from a subtle 1px diffuse lift (sm) for inputs and small cards, to a strong multi-layer drop shadow (2xl) for modals and floating panels.
  - Backdrop blur (`blur(1px)` layered with gradient masks) is used on the sticky header for a frosted-glass effect.
- **Borders:**
  - Light mode: 1px solid `var(--color-gray-200)` (assumed ~`#e5e7eb`) for inputs and dividers.
  - Dark mode: 1px solid `var(--color-gray-700)` (assumed ~`#374151`).
  - Cards and panels use subtle borders at low-opacity dark tones (`#2b2b3108` range) rather than heavy strokes.

## Components

### Buttons

- **Variants:**
  - *Primary:* Solid filled, high contrast (dark fill on light / accent fill on dark — assumed indigo or near-black).
  - *Secondary:* Outlined or lightly filled, border visible.
  - *Ghost/subtle:* Transparent background, inherits text color, hover shows a light background wash.
  - *Destructive:* Red family (`#dc2626` / `#ef4444`) — used for delete/dangerous actions.
- **Shape & size:** Padding (assumed) ~8–12px vertical, 16–24px horizontal; border-radius 8–12px; font-weight 500; font inherits from parent (Suisse/Inter).
- **States:**
  - Hover: Smooth color/background transition at 200ms with a custom ease (`cubic-bezier(0.33,1,0.68,1)`); slightly lighter or darker fill.
  - Active: Slight depression visual (assumed).
  - Disabled: Reduced opacity (`opacity` inherited, can be suppressed); no pointer cursor.
  - Focus: Ring offset in white (`#fff`) with a visible focus ring (Tailwind `ring` utility).
- **Icon usage:** Icons appear inline with text, (assumed) left-aligned with ~6–8px gap.

### Cards / Panels

- **Layout:** Padding (assumed) 16–24px; border-radius 12–16px; subtle border + low shadow.
- **Content structure:** Typically: icon or label at top, heading, supporting body text, optional CTA link or button at bottom.
- **Variants:**
  - *Elevated:* Dark surface with `shadow-md` or `shadow-2xl`, used for modals and feature highlights.
  - *Outlined:* 1px border, minimal shadow, used for grouped content sections.
  - *Minimal:* No border or shadow, background-only differentiation, used in documentation or list contexts.

### Forms & Inputs

- **Input style:** 1px solid border (color adapts to light/dark mode); border-radius 4–8px; transparent or lightly tinted background; padding (assumed) ~8–10px vertical, 12–14px horizontal.
- **Labels:** Placed above the input, `label-2` or `label-3` scale (13–15px, weight 500).
- **Validation:**
  - Error: Red family — `#ef4444` border and text, `#fef2f2` background wash on the field.
  - Success: Green `#1f883d` for confirmed states.
- **Checkboxes:** Custom `appearance:none` checkboxes with explicit border and background; checked state uses near-black fill (`var(--color-gray-950)` / white in dark mode) with a SVG checkmark background-image.
- **Buttons in forms:** Styled consistently with standalone buttons; (assumed) full-width primary variant at form bottom in narrow/modal contexts.

### Navigation

- **Header:** Sticky (`sticky top-2`), `z-index: 50`, with a layered backdrop-blur frosted-glass background using gradient masks for smooth top-edge fade. Height approximately 50px.
- **Nav items:** Sans-serif, (assumed) ~14px, weight 500; spacing via padding (horizontal ~8px); hover transitions use 450ms ease-out, returning to 200ms on hover-out (snappy feel). Dropdown triggers use a `before:` pseudo-element to extend the hit area vertically by ~12px above and below.
- **Dropdowns:** Radix UI-powered (`data-state="open/closed"`); on open, an `after:` pseudo-element bridges the gap between trigger and panel to prevent accidental close.
- **Mobile behavior:** (assumed) Hamburger menu opens a full-width overlay or slide-in drawer; primary nav hidden below `md` breakpoint.

## Layout Conventions

- **Breakpoints:** Tailwind standard — `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px (assumed). The header switches `mt` behavior at `md`. Content layout becomes single-column below `md`.
- **Grids:** CSS Grid and Flexbox both used; feature cards typically 2–3 column grid at desktop, stacking to 1 column on mobile. Navigation bar uses flex with `gap` spacing.
- **Sections:** Alternating content sections with generous vertical padding (assumed 64–96px between major page sections); section backgrounds shift between `#0f0f12`, `#1a1a1f`, and `#0c1630` for visual rhythm on marketing pages.

## Usage Notes

- **Voice in UI copy:** Use concise, confident, developer-friendly language — no fluff. Lead with the benefit or action ("Add authentication in minutes"), not the product feature.
- Be direct and slightly technical without being jargon-heavy; trust that users are developers who prefer precision over hand-holding.
- Use active voice for CTAs and headings; reserve softer phrasing for supporting descriptions.

- **Visual feel when designing new components:**
  - Lean into dark surfaces with carefully controlled elevation: subtle borders, low-key shadows, and slightly lighter background tones to distinguish layers — avoid heavy drop shadows on every element.
  - Use the 450ms → 200ms dual-speed transition pattern (ease-out entry, quick hover response) to give interactions a polished, physical feel.
  - Maintain strong typographic hierarchy using the label scale; let type and spacing do the structural work rather than decorative elements.