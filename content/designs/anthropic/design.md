# Design Spec – Anthropic (www.anthropic.com)

## Brand & Layout
- Overall feel: Calm, intellectual, and considered — the design evokes scientific seriousness balanced with warm, organic tones. Typography-led layouts and muted earth tones signal trustworthiness and thoughtfulness rather than tech hype.
- Layout: Container-constrained full-width sections with internal CSS Grid and Flexbox layouts. A 7-column home hero grid is evidenced; cards appear in multi-column grid rows. Sections stack vertically with deliberate breathing room between them.

## Colors
- Primary: **Clay** – `#d97757` – Used as the signature brand color; appears in toggle active states, key interactive highlights, and accent elements throughout.
- Accent: **Accent/Burnt Orange** – `#c6613f` – A slightly deeper variant of Clay used for interactive accent states and hover treatments.
- Backgrounds:
  - **Ivory Light** `#faf9f5` – Primary page background; clean, warm off-white.
  - **Ivory Medium** `#f0eee6` – Secondary surfaces, nav dropdown backgrounds.
  - **Ivory Dark** `#e8e6dc` – Dividers, card backgrounds, subtle section contrast.
  - **Slate Dark** `#141413` – Dark-mode or inverted section backgrounds.
  - **Slate Medium** `#3d3d3a` – Dark secondary backgrounds (assumed: footers, dark panels).
- Text colors:
  - Main text: **Slate Dark** `#141413` – Near-black, warm-tinted.
  - Muted text: **Cloud Dark** `#87867f` / **Slate Light** `#5e5d59` – Labels, meta, secondary copy.
  - Inverted/on-dark: **Ivory Light** `#faf9f5` or white, used over slate dark backgrounds.

## Typography
- Base font: `var(--sans)` — resolves to a system/brand sans-serif stack. A fallback of `Helvetica Neue, Helvetica, Ubuntu, Segoe UI, Verdana, sans-serif` is present; `Arial, sans-serif` also appears as a last resort.
- Serif font: `var(--serif)` / `Tiempos Text` — used for editorial, display, and article body contexts.
- Mono font: `var(--_typography---font--mono)` — (assumed: code snippets, technical documentation sections).
- Display fonts: `var(--_typography---font--display-sans)` and `var(--_typography---font--display-serif-family)` — used for large hero headings.
- Base size: **14px**
- Heading scale:
  - H1: 32px – Large display weight, likely bold or semibold, used in heroes (a separate `u-display-xl` class exists for oversized hero headings, implying a scale beyond 32px at large breakpoints).
  - H2: 32px – Section headings, same size as H1 at base; likely differentiated by weight or spacing.
  - H3: 24px – Sub-section or card headings.
  - H4: 18px – Tertiary headings, component labels.
  - H5: 14px – Small labels, category tags.
  - H6: 12px – Fine print, metadata.
  - All heading elements reset margin to 0 and inherit family/weight from context, meaning styling is applied via utility classes rather than raw element defaults.
- Other: `Tiempos Text` appears explicitly as a serif for long-form reading. Monospace is used in technical contexts (assumed: Claude API/docs areas).

## Spacing & Radius
- Base spacing unit: **4px** (scale begins at 1px and increments suggest a 4px base grid)
- Spacing scale: 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px, 48px, 64px — mapped to CSS variables (`--size--1rem`, `--size--2rem`, `--_spacing---space--6`, etc.)
- Border radius:
  - **2px / 3px / 4px** – Small, tight radius for inline elements, badges, or tags.
  - **8px** – Input fields and smaller UI components.
  - **12px** – Standard card radius (`var(--radius--main)` likely maps here).
  - **24px** – Large radius for prominent cards and panels (`var(--radius--large)`).
  - **1600px** – Fully pill-shaped radius for buttons and toggle elements.

## Shadows & Borders
- Shadows:
  - **Subtle card elevation**: `0 2px 2px rgba(0,0,0,0.01), 0 4px 4px rgba(0,0,0,0.02), 0 16px 24px rgba(0,0,0,0.04)` — soft layered shadow for lifted cards, very low-contrast.
  - **Deep elevation**: A multi-layered shadow reaching 150px blur at 0.07 opacity — used for modals or overlapping panels.
  - **Inset glass-style**: `inset 0 6px 12px rgba(255,255,255,0.12), inset 0 1px 1px rgba(255,255,255,0.19)` — used on buttons or dark-surface interactive elements for a subtle dimensional quality.
  - **Focus ring**: `0 0 3px 1px #3898ec` — accessibility outline on keyboard focus.
  - Overall intensity is very low; shadows are barely visible, emphasizing flatness with a whisper of depth.
- Borders:
  - `1px solid var(--swatch--ivory-medium)` — nav dropdowns, panels, card outlines on light backgrounds.
  - `1px solid var(--_color-theme---border)` — inputs and form fields using a theme-aware border token.
  - Borders are thin and low-contrast, favoring harmony over definition.

## Components

### Buttons
- Variants:
  - **Primary** (`btn_main`): Filled with Clay (`#d97757`) or dark slate; pill-shaped (radius ~1600px). Used in the navbar ("Try Claude").
  - **Secondary** (assumed): Outlined or softer fill, lower visual weight for auxiliary actions.
  - **Ghost/Subtle** (assumed): Text-only or transparent background for tertiary actions.
- Shape & size: Pill radius (very rounded). Padding derived from spacing scale — likely 12–16px vertical, 24–32px horizontal. Text appears to be set in the sans-serif at medium weight.
- States:
  - **Hover**: Color shift on text/background; card images within clickable cards scale to 1.05 over 0.2s ease.
  - **Focus**: Visible outline using theme focus color with an outer offset; a blue ring (`#3898ec`) appears on keyboard focus.
  - **Disabled**: `cursor: default`; reduced opacity (0.5 seen on toggle disabled state).
- Icon usage: (assumed) Icons appear to the left of or alongside button text, with ~8px gap; inline-block alignment.

### Cards / Panels
- Layout: Padding uses `var(--_spacing---space--6)` (~24px); border radius `var(--radius--large)` (~24px). Minimum width of 250px; height fills available row space (`height: 100%`). `overflow: hidden` is set, meaning content is clipped to card bounds.
- Content structure: (assumed) Typically contains an image/visual block at top, followed by a heading, short body text, and optionally a CTA link or tag.
- Hover behavior: Contained images scale to 1.05× over 0.2s ease — smooth, non-disruptive zoom.
- Variants:
  - **Default elevated card**: Background `var(--_color-theme---card)`, subtle shadow.
  - **Faded card** (`.card.is-faded`): Uses `--card-faded` background, transitions to `--card-faded-hover` on hover — a softened, lower-contrast surface.
  - **Dark card** (`.card.u-bg-dark`): Background `--background-secondary`, used in dark-themed sections.
  - **Minimal/transparent** (variant): No padding, no radius, transparent background — used for image-forward or centered content blocks.
  - **Nav dropdown panel**: Ivory light background, `1px` ivory-medium border, `1rem` radius, two-column flex layout with `2rem` gap.

### Forms & Inputs
- Input style: Bordered inputs using `var(--_color-theme---border)` — thin 1px border. Radius matches `var(--radius--main)` (~12px). Padding is `1rem` horizontal. Background matches the theme surface.
- Labels: (assumed) Top-aligned labels in small sans-serif, muted text color (`--slate-light` or `--cloud-dark`).
- Toggle switches: Custom toggle with hidden native input. Active state uses Clay (`#d97757`) as fill. Transition slides the knob 12px. Disabled toggles have `opacity: 0.5` and `cursor: not-allowed`.
- Validation: Error color (assumed) uses a warm red; `#ffdede` (coral tint) appears in color tokens and likely indicates error backgrounds. Success (assumed) may use Olive (`#788c5d`).
- Buttons in forms: Match the primary button style; visually consistent with standalone buttons (same radius, same color tokens).

### Navigation
- Header: (assumed static or sticky) Contains a logo, primary nav links, and a CTA button combo ("Try Claude"). Background is ivory light or semi-transparent on scroll.
- Nav items: Sans-serif, medium weight, spaced with comfortable padding. Dropdown panels appear on hover (`data-hover="true"`, 50ms delay).
- Dropdown: Grid-based with `2rem` gaps, ivory light background, `1rem` border radius, `1px` ivory-medium border — feels like an elevated card panel.
- Mobile behavior: (assumed) A hamburger/overlay pattern for small screens; the `u-grid-tablet` class on the hero grid implies a tablet breakpoint where layout collapses.
- Focus: All interactive nav elements participate in the site-wide focus-visible outline system.

## Layout Conventions
- Breakpoints: A tablet breakpoint is directly evidenced (`u-grid-tablet`). Small/mobile and large/desktop breakpoints are (assumed) present — likely at ~768px and ~1280px.
- Grids: CSS Grid is used for hero and content layouts (e.g., 7-column hero grid). Flexbox is used within components (nav, card rows, dropdown panels). Cards use `flex: 1` to fill equal-width columns.
- Sections: Each section is wrapped in `g_section_space` with a `--section-space` token controlling vertical padding. Content is constrained by a `u-container` class providing max-width and horizontal centering. Spacing between sections is generous — likely 64px+ (assumed) at desktop.
- Column system: A named column-width system (`--column-width--4`) exists, suggesting a token-based column sizing approach rather than a traditional 12-column grid.

## Usage Notes
- **UI copy voice**: Write in plain, precise language — avoid marketing superlatives. Prefer clear, calm statements ("AI research and products") over hype. Sentence case throughout; links within body copy are acceptable and signal intellectual depth.
- **Visual character**: Ground every new component in the ivory/clay/slate palette. Warm off-whites as backgrounds, clay as the single energetic accent, near-blacks with warm undertones rather than pure `#000`. Avoid cool greys entirely.
- **Motion and interaction**: Keep transitions subtle and purposeful — 0.2s ease is the standard. Scale transforms (1.05×) on hover rather than color floods. The design should feel unhurried.