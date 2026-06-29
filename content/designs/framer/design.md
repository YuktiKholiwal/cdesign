# Design Spec – Framer (www.framer.com)

## Brand & Layout
- Overall feel: Framer presents a modern, premium, dark-first design aesthetic — confident, minimal, and technical. The tone is crisp and forward-looking, leaning into AI and creativity with high contrast and bold typography.
- Layout: The site uses full-width sections with centered content columns. Content is organized into clearly delineated hero, feature, and CTA sections stacked vertically. Flex and grid-based layouts handle multi-column feature groupings and button clusters.

---

## Colors

- **Primary:** Black — `#000000` / `#141414` / `#1a1a1a` — used for page backgrounds and primary surface areas.
- **Accent:** Electric Lime — `#cbff00` — used for key CTAs, highlights, and branded accent moments.
- **Secondary Accents:** Cyan `#09f`, Blue `#05f`, Purple `#60f` / `#90f`, Pink `#f06`, Orange `#fd7702` / `#fb0` — used as supporting palette pops in illustrations, gradients, or feature callouts.
- **Backgrounds:**
  - Deep black `#050505` / `#080808` — primary page background.
  - Dark surface `#111` / `#121212` / `#141414` / `#171717` — card and panel backgrounds.
  - Mid-dark `#1c1c1c` / `#1f1f1f` / `#242424` / `#2b2b2b` — secondary surfaces, borders, and hover states.
  - White-alpha overlays `#ffffff1a`, `#ffffff12`, `#ffffff14` — subtle layering on dark backgrounds.
- **Text colors:**
  - Primary text: White `#ffffff` — headings and body copy on dark backgrounds.
  - High-opacity white `#ffffffcc` — slightly muted body text.
  - Mid-opacity white `#ffffff99` — captions, labels, secondary descriptions.
  - Low-opacity white `#ffffff66` — placeholder and disabled text.
  - Muted gray `#878787` / `#999` — secondary or placeholder text on dark surfaces.
  - Inverted (on light): Black `#000000` — text on light/accent elements.

---

## Typography

- **Base font:** Inter, Inter Placeholder, sans-serif (via `--framer-font-family`)
- **Base size:** 12px (system default baseline; marketing headings are significantly larger in practice)
- **Heading scale:**
  - H1: Very large display size (assumed 48–80px+), bold weight, tight letter-spacing, used for hero statements.
  - H2: Large section titles (assumed 32–48px), bold, moderate tracking.
  - H3: Medium subheadings (assumed 20–28px), semi-bold.
  - General style: Headings are set in Inter with high font-weight, clean and geometric, with minimal line-height for impact.
- **Other:** A code/monospace variant references `--framer-code-font-family` falling back to Inter — suggesting inline code or technical labels are rendered in Inter at small sizes. No distinct monospace family is specified explicitly.

---

## Spacing & Radius

- **Base spacing unit:** 4px (inferred from the presence of 4, 8, 12, 16, 24 in the scale)
- **Spacing scale:** 4px, 8px, 12px, 16px, 20px, 24px, 28px, 40px — used for padding, gap, and margin throughout components and sections.
- **Fine-grained values:** 1px, 2px, 3px, 5px, 6px, 7px, 10px — used for borders, micro-gaps, and icon nudges.
- **Border radius:**
  - Small: `3px`, `4px`, `5px` — used on inline elements, tags, badges.
  - Medium: `8px`, `10px` — used on inputs, buttons, smaller cards.
  - Large: `14px`, `15px`, `20px`, `21px` — used on panels and larger cards.
  - Pill: `25px`, `50px` — used on rounded/pill-style buttons or chips.

---

## Shadows & Borders

- **Shadows:**
  - Blue-tinted glow: `0 1px 2px #0099ff26, 0 2px 4px #09f3` — used on interactive elements with a Framer-blue accent, giving a subtle glowing effect.
  - Soft lift: `0 10px 20px #0000000d` — light, diffuse shadow for elevated cards.
  - Minimal: `0 1px 2px #0000001a` — hairline shadow for subtle depth separation.
  - Medium: `0 2px 4px #00000040` — used on dropdowns or floating UI panels.
- **Borders:**
  - Translucent white borders `#ffffff1a` / `#ffffff12` — 1px borders on dark cards and panels to create separation without harshness.
  - Translucent black borders `#0000001a` — used on lighter overlapping surfaces.
  - Generally 1px, very subtle, consistent with a dark glass-morphism aesthetic.

---

## Components

### Buttons

- **Variants:**
  - *Primary*: High-contrast fill — likely black background with white text, or lime `#cbff00` fill with black text for maximum emphasis.
  - *Secondary*: Dark surface with white-alpha border and white text — outlined/ghost style on dark backgrounds.
  - *Ghost/Subtle*: Transparent background with low-opacity white border; used for less prominent actions.
- **Shape & size:** Rounded corners (8–15px radius typical), medium padding (~12px vertical, ~20–24px horizontal), semi-bold to bold font weight.
- **States:**
  - Hover: Surface brightens slightly or border intensifies; lime accent may pulse or shift.
  - Active: Slight scale-down or deeper background fill (assumed).
  - Disabled: Reduced opacity (assumed).
  - Focus: Likely a blue glow ring matching the `#0099ff` shadow token.
- **Icon usage:** Icons appear centered inside icon-only buttons (e.g., search icon). Icon-text combinations (assumed) align icon left of label with ~8px gap.

### Cards / Panels

- **Layout:** Rounded corners (14–21px), dark background (`#111`–`#1f1f1f`), 1px translucent white border, subtle box-shadow for lift.
- **Content structure:** Typically contains a heading, supporting description text in muted white, and optionally a CTA or visual asset (image/animation).
- **Variants:**
  - *Elevated*: With `0 10px 20px` soft shadow.
  - *Outlined*: 1px `#ffffff1a` border on dark background with no heavy shadow.
  - *Minimal*: Dark flat surface, no border or shadow — used in tight grid layouts.

### Forms & Inputs

- **Input style:** Borderless or minimal-border inputs on dark backgrounds; radius ~8–10px; dark fill (`#1a1a1a` or similar); padding ~10–12px vertical.
- **Placeholder:** Color `#999` at full opacity — clearly muted but legible.
- **Labels:** (assumed) Top-aligned, small size, muted white color.
- **Focus state:** Subtle animation (`__framer-blink-input`) on focus — input border or outline brightens (assumed blue `#09f` or white).
- **Validation:** Colors not directly specified; green `#4cd963` token is present and likely used for success states. Error state (assumed) would use red `#f02` or `#f06`.
- **Buttons in forms:** Styled consistently with standalone primary buttons; placed inline or below the input field.

### Navigation

- **Header:** Fixed or sticky positioning (assumed); dark background (`#000` or `#111`), minimal height (~50–64px assumed); uses a translucent or fully opaque dark fill.
- **Nav items:** Set in Inter, small-to-medium size (~14px assumed), white text with reduced opacity for non-active items; active/hover items shift to full white or lime accent.
- **Mobile behavior:** (assumed) Hamburger menu triggering a full-screen or slide-in overlay panel, consistent with the dark aesthetic.

---

## Layout Conventions

- **Breakpoints:** (assumed) ~768px (tablet), ~1024px (desktop), ~1280px+ (wide); layout collapses from multi-column to single-column at tablet.
- **Grids:** Flex-based horizontal groupings for button clusters and nav items; CSS Grid (assumed) for feature card arrays (2–3 columns on desktop, 1 on mobile).
- **Sections:** Full-width sections with generous vertical padding (40–80px+ assumed between sections). Hero section is typically viewport-height or near it. Section content is constrained to a centered max-width column (~1100–1280px assumed).

---

## Usage Notes

- **UI copy style:** Write in short, declarative statements — confident and benefit-first ("Build faster. Ship today."). Avoid filler words. Use present tense and active voice. The brand favors clarity over cleverness.
- **Visual approach:** Always start from a dark background. Use white and white-alpha for hierarchy rather than grayscale. Reserve the lime `#cbff00` accent sparingly for the single most important action or label per view.
- **New components:** Match the glass-dark aesthetic — dark surfaces, 1px translucent white borders, soft shadow lift, and Inter at varied weights. Avoid hard white backgrounds unless creating explicit contrast moments.