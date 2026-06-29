# Design Spec – Pitch (pitch.com)

## Brand & Layout
- Overall feel: Pitch presents a polished, modern SaaS aesthetic with a deep purple/violet palette that feels premium and creative. The tone is confident and minimal — clean surfaces, generous white space, and purposeful use of accent color create a product-forward impression.
- Layout: Pages are structured with full-width hero sections, centered content columns, and card-based feature grids. Sections are stacked vertically with generous vertical rhythm. No persistent sidebars are evident on marketing pages.

## Colors
- **Primary – Deep Violet:** `#280F62` — used for primary text on light backgrounds, headings, and strong UI elements on pale purple surfaces.
- **Primary – Electric Purple:** `#5318EB` — used for interactive elements, key CTAs, links, and brand-forward highlights.
- **Accent – Soft Lavender:** `#C6A5FF` — used for decorative accents, borders (`#C6A5FF` at ~40% opacity for border color), and secondary UI highlights.
- **Accent – Lime Green:** `#C4EE87` — used sparingly as a vivid complementary accent, likely for callout labels or feature tags.
- **Backgrounds:**
  - `#FFFFFF` — primary page background (white sections, cards, and nav).
  - `#EBE3FE` — soft lavender tint used for subtle surface backgrounds (e.g., icon button fills, section washes).
  - `#0C021C` — near-black deep purple for dark section backgrounds.
  - `#FFFFFF29` — white at ~16% opacity for frosted/glass overlays on dark backgrounds.
- **Text colors:**
  - Main text: `#0C021C` (near-black) or `#280F62` (deep violet) on light backgrounds.
  - Muted/secondary text: `#363636` (dark gray).
  - Inverted/on-dark: `#FFFFFF` (white).

## Typography
- **Base font:** `Inter, Inter Placeholder, sans-serif` — a clean, geometric sans-serif used across all UI.
- **Base size:** 12px (set on `body`, `input`, `textarea`, `select`, `button`).
- **Heading scale:** Heading sizes are not directly observed in the token data, but the scale likely spans from approximately 36px (H3) up to 72–80px or larger (H1) given the spacing scale present. Headings are (assumed) to use heavy weight (700–800), tight letter-spacing, and the primary deep violet or near-black color. H1 and H2 are (assumed) to be set in `#280F62` or `#0C021C` on light backgrounds and `#FFFFFF` on dark sections.
- **Other:** No monospace or display font variants are directly observed. A bold variant is referenced via Framer's font-family-bold token (assumed to be Inter Bold).

## Spacing & Radius
- **Base spacing unit:** 4px.
- **Spacing scale:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 72px, 80px, 120px, 180px — a broad scale used to control component padding, section gaps, and layout gutters.
- **Border radius:**
  - `10px` — used on cards, panels, and form inputs (assumed).
  - `20px` — used on pill-like tags, chips, or highlighted callouts (assumed).
  - `24px` — used on larger card surfaces or modal-style containers (assumed).
  - `100px` — used on circular/pill icon buttons (directly observed on the `+` button snippet).

## Shadows & Borders
- **Shadows:** No explicit shadow tokens were extracted. Elevation (assumed) is handled through background color contrast (e.g., white cards on tinted section backgrounds) rather than drop shadows, keeping the aesthetic flat and modern.
- **Borders:** A standard border style uses `#C6A5FF` at approximately 40% opacity (`#C6A5FF66`), creating a soft lavender divider. Borders are thin (assumed 1px) and used on containers, input fields, and section dividers.

## Components

### Buttons
- **Variants:**
  - *Primary:* Filled with `#5318EB` (electric purple), white text — main CTA style.
  - *Secondary:* Filled with `#EBE3FE` (pale lavender), `#280F62` text — observed directly on the icon button; used for lower-emphasis actions.
  - *Ghost/subtle:* (assumed) Transparent background with `#5318EB` border and text, for tertiary actions.
- **Shape & size:** Pill-shaped (`border-radius: 100px`) for icon buttons; 32×32px for compact icon-only buttons. Text buttons (assumed) use 40–48px height with horizontal padding of ~20–24px and medium-bold font weight (assumed 500–600).
- **States:** Hover (assumed) lightens or slightly scales the fill; active darkens it; focus shows a lavender outline ring; disabled reduces opacity.
- **Icon usage:** Icons are centered within circular buttons. In text+icon buttons (assumed), icons align left of text with ~8px gap.

### Cards / Panels
- **Layout:** Padding of approximately 24–32px; border-radius of 10–24px; borders use the soft lavender style described above.
- **Content structure:** Typically: an icon or illustration, a heading, a short descriptive line, and optionally an action or badge.
- **Variants:** Outlined (lavender border on white) and tinted (pale lavender `#EBE3FE` fill) variants are inferred. A dark variant on `#0C021C` is likely used for hero or feature showcase panels.

### Forms & Inputs
- **Input style:** (assumed) Rounded corners (~10px radius), 1px border using the lavender border color, white background, 12–14px font size, ~12–16px vertical padding.
- **Labels:** (assumed) Positioned above the input field, in muted `#363636` or `#280F62` at small size.
- **Validation:** (assumed) Error states use a red tone (not observed); success states may use the lime accent `#C4EE87`.
- **Buttons in forms:** Visually consistent with standalone primary buttons — same pill shape and purple fill.

### Navigation
- **Header:** (assumed) Fixed or sticky at top, white or translucent white background, moderate height (~52–64px based on spacing scale).
- **Nav items:** Small–medium text (~14px assumed), `#280F62` or `#0C021C` color, with hover indication via underline or color shift to `#5318EB`.
- **Mobile behavior:** (assumed) Collapses into a hamburger menu triggering a full-width overlay drawer.

## Layout Conventions
- **Breakpoints:** (assumed) Standard three-tier: mobile (<768px), tablet (768–1024px), desktop (>1024px). Content columns constrain to a max-width of approximately 1200–1440px centered on large screens.
- **Grids:** Feature sections use CSS Flexbox or Grid for two- to four-column card layouts. Hero sections are single-column centered. Multi-column grids collapse to single-column on mobile.
- **Sections:** Vertical spacing between page sections is generous — approximately 80–120px on desktop, with inner section padding around 48–72px. A clear alternating rhythm of dark and light section backgrounds creates visual structure.

## Usage Notes
- **UI copy tone:** Write copy that is confident and direct — short punchy headlines, action-oriented CTAs ("Start free", "Get started"). Avoid filler adjectives; let the product speak. Use sentence case for most labels and title case only for primary headings.
- **Visual feel:** Lead with the deep violet and electric purple palette; use the lime accent `#C4EE87` very sparingly for maximum pop. Keep surfaces clean and minimal — whitespace is intentional, not empty.
- **New components:** Default to pill-shaped (`border-radius: 100px`) for any interactive control (buttons, toggles, tags). Use the soft lavender (`#EBE3FE`) surface as the go-to "subtle" background state rather than gray. Prefer color-contrast-based depth over drop shadows.