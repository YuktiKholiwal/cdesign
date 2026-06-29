# Design Spec – Figma (www.figma.com)

## Brand & Layout
- Overall feel: Clean, modern, and minimal with a high-contrast black-and-white base occasionally punctuated by vivid brand accent colors. The aesthetic is professional yet approachable, reflecting a design-tool brand that values clarity and precision.
- Layout: Structured with a fixed top navigation header, followed by full-width content sections. Page content uses flexbox and card-based grid layouts. Marketing pages feature large hero sections, feature cards in multi-column grids, and well-defined vertical section spacing.

---

## Colors

- **Primary – Black:** `#000000` — Used for primary button backgrounds, main text, and the global page background in dark-mode contexts.
- **Primary – White:** `#FFFFFF` — Used for page backgrounds (`--fig-theme-bg`), primary button foreground text (`--fig-theme-btn-primary-fg`), and text on dark backgrounds (`--f-text-color`).
- **Accent – Electric Blue:** `#00B6FF` — Used sparingly as a vivid brand accent; visible in the Figma logo mark and highlight elements.
- **Accent – Lime/Chartreuse:** `#E4FF97` — Used as a secondary accent, likely for highlight badges or callout labels (inferred from color props).
- **Error/Destructive:** `#972121` — Used as form error background (`--fig-theme-form-error-bg`) with white text on top.
- **Backgrounds:**
  - Page default: `#FFFFFF` (light mode)
  - Dark surface (e.g., footer or dark-themed sections): `#000000` (`--f-bg-color`)
  - Subtle overlay/scrim: `rgba(0, 0, 0, 0.08)`
- **Text colors:**
  - Main text: `#000000` on light backgrounds
  - Inverted/on-dark: `#FFFFFF` (`--f-text-color`)
  - Muted on-dark: `rgba(255, 255, 255, 0.6)` (used for list headers/secondary labels, `--f-list-header-color`)
  - Badge text on dark: `#FFFFFF` with background `rgba(255, 255, 255, 0.16)`

---

## Typography

- **Base font:** `'figmaSans', 'figmaSans Fallback', SF Pro Display, system-ui, helvetica, sans-serif` — Figma's proprietary sans-serif, with robust system-font fallbacks.
- **Base size:** Not directly observed; (assumed) `16px` as a standard browser default, consistent with `font-size: 100%` on form elements.
- **Heading scale:**
  - H1: `32px`, weight likely bold or semibold (assumed); uppercase or sentence case (assumed sentence case).
  - H2–H6: Sizes not directly observed; (assumed) a modular scale descending from 32px (e.g., 24px, 20px, 18px, 16px).
  - Headings generally use the `figmaSans` sans-serif stack with tight letter-spacing and high contrast against the background.
- **Monospace font:** `'figmaMono', 'figmaMono Fallback', SF Mono, menlo, monospace` — Used for code snippets, technical labels, or inline code elements where a monospace font is appropriate.

---

## Spacing & Radius

- **Base spacing unit:** `4px`
- **Spacing scale:** `4px, 5px, 6px, 8px, 10px, 11px, 12px, 16px, 24px, 28px, 32px, 34px, 46px, 70px`
  - Common practical increments: 4, 8, 12, 16, 24, 32px for component padding and gaps.
  - Larger values (46px, 70px) used for section-level vertical padding and hero spacing (assumed).
- **Border radius:**
  - `2px` — Very subtle rounding, likely for small tags or inline badges.
  - `4px` — Default rounding for inputs and small components.
  - `6px` — Medium rounding for cards or panels.
  - `8px` — Larger rounding for prominent cards, modals, or feature panels.
  - Buttons use small radius values consistent with a squared-off, geometric aesthetic (assumed `4px–6px`).

---

## Shadows & Borders

- **Shadows:**
  - Subtle bottom border-style shadow: `0 1px 0 color-mix(in oklch, #000000, transparent 84%)` — Used to separate header from content; very low-intensity.
  - Inset border shadow (default): `inset 0 0 0 1px color-mix(in oklch, #000000, transparent 84%)` — Used to render borders on interactive elements such as buttons and inputs without affecting layout.
  - Inset border shadow (hover): `inset 0 0 0 1px color-mix(in oklch, #000000, transparent 60%)` — Slightly darker inset border on hover state.
  - Elevated card shadow: Referenced as `utility:shadow` — specific values not captured, (assumed) a soft multi-layer drop shadow for raised card components.
- **Borders:**
  - Primarily `1px` solid lines rendered via box-shadow insets (not CSS `border` properties) to avoid layout shift.
  - Color: semi-transparent black (~16% opacity on default, ~40% opacity on hover), giving a refined, low-contrast border treatment.
  - Buttons, inputs, and cards use this consistent inset-shadow border pattern.

---

## Components

### Buttons

- **Variants:**
  - **Primary:** Black background (`#000000`), white text (`#FFFFFF`). High-contrast, most prominent CTA.
  - **Secondary:** Transparent background, black text (`--fig-theme-btn-secondary-fg: #000000`), bordered via inset shadow.
  - **Ghost/Transparent:** No background, no border, black text (`--fig-theme-btn-transparent-fg: #000000`); used for subtle actions.
  - **Destructive:** (assumed) Uses error colors (`#972121` background) for destructive confirmations.
- **Shape & size:**
  - Border radius: (assumed) `6px` based on spacing tokens.
  - Padding: (assumed) `8px 16px` for standard size, `5px 12px` for compact.
  - Font weight: (assumed) medium to semibold, matching the `figmaSans` sans-serif.
- **States:**
  - Hover: background and box-shadow transition smoothly (`180ms ease-out`). Border becomes slightly darker (opacity increases).
  - Active: (assumed) slightly depressed feel, possibly a darker background.
  - Disabled: `pointer-events: none` when `aria-disabled="true"`; visually reduced opacity (assumed).
  - Focus: Dashed outline `2px` using `--f-text-color` (black or white depending on theme), offset `4px` — accessible and clearly visible.
- **Icon usage:** Icons within buttons align center with text using flexbox and a `0.25rem` (4px) gap. A "built-in icon" can appear alongside label text and fades in on interaction (`opacity` transitions from 0 to 1 at `180ms ease-out`). Icon-only buttons have vertical margins pulled inward (`-1.25rem`) to maintain consistent button height.

---

### Cards / Panels

- **Layout:** Displayed using `inline-flex` or `flex`, centered content alignment. Transitions on background and box-shadow (`180ms ease-out`) suggest hover interactivity.
- **Content structure:**
  - Typical children: circular avatar/icon at top, followed by heading (`<h3>`), body paragraph text, and optionally a badge or action.
  - Example: icon → title → description (as seen in Snippet 3).
- **Variants:**
  - **Elevated:** Uses `utility:shadow` drop shadow; (assumed) white background with radius `6px–8px`.
  - **Outlined:** Inset `1px` box-shadow border in lieu of `border` property.
  - **Minimal/flat:** Background-less cards used in navigation dropdown contexts.

---

### Forms & Inputs

- **Input style:**
  - Borders rendered as inset box-shadows (`1px` semi-transparent black) rather than CSS borders.
  - Border radius: (assumed) `4px–6px` consistent with button and card tokens.
  - Background: (assumed) white (`#FFFFFF`) on light theme; inherits theme background.
  - Padding: (assumed) `8px 12px` based on spacing scale.
- **Labels:** (assumed) placed above the input field in sentence case, using the primary sans-serif at base size.
- **Validation:**
  - Error state: Background `#972121` (dark red), text `#FFFFFF` — strongly visible, used for error messaging panels or inline validation.
  - Success state: Not directly observed; (assumed) a green-toned treatment consistent with the brand's green accent from the logo.
- **Buttons in forms:** Visually identical to standalone primary buttons; aligned to the right of or below the form field (assumed). Same `180ms` transition behavior applies.

---

### Navigation

- **Header:**
  - Position: Likely fixed or sticky at the top (assumed based on typical Figma.com pattern); not explicitly confirmed in tokens.
  - Background: White (`#FFFFFF`) in light theme.
  - Separator: A subtle `1px` bottom shadow (`0 1px 0` semi-transparent black) divides the header from the page body.
  - Height: Not explicitly observed; (assumed) ~64px.
- **Nav items:**
  - Typography: `figmaSans` sans-serif, base size, medium weight.
  - Dropdown triggers use a chevron SVG icon (`24×24`) that rotates (`transform: rotate()`) to indicate open/closed state.
  - Hover/active: Text items use a `.nav-highlight` class, suggesting a background highlight or underline on hover (assumed subtle background tint).
  - Spacing: Items laid out horizontally with consistent gap (assumed `16–24px`).
- **Mobile behavior:** (assumed) A hamburger/overlay drawer pattern collapses the full nav; dropdown items become accordion-style stacked lists. Not directly evidenced in the provided snippets.

---

## Layout Conventions

- **Breakpoints:** Not directly captured in tokens; (assumed) standard breakpoints: ~`640px` (sm), ~`1024px` (md), ~`1280px` (lg), aligning with common modern web practice.
- **Grids:** Flexbox is the primary layout mechanism across components and cards. Multi-column card grids (assumed 3–4 columns on desktop, 1–2 on mobile) are used in feature/marketing sections.
- **Sections:** Page sections have generous vertical padding (based on `46px` and `70px` spacing tokens). Sections are visually separated by spacing alone rather than dividers in most cases. Dark and light alternating sections (assumed) are used to create visual rhythm.

---

## Usage Notes

**Voice & UI Copy:**
- Write in a confident, direct tone — short, punchy headlines with action-oriented language ("Design anything you can imagine," "Turn your ideas into apps").
- Avoid jargon overload; the copy should feel accessible to both designers and non-designers.
- Use sentence case for most labels and headings; reserve all-caps sparingly for badges or category labels.

**Visual Design Guidance:**
- Embrace high contrast: default to black-on-white or white-on-black pairings; use accent colors (`#00B6FF`, `#E4FF97`) sparingly as highlights, never as large fills.
- Keep interactions subtle and fast: transitions should be `180ms ease-out` — noticeable but never sluggish.
- Maintain geometric precision: prefer tight border radii (`4px–8px`) and inset-shadow borders over heavy drop shadows; the overall aesthetic should feel engineered and intentional rather than soft or decorative.