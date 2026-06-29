# Design Spec – Stripe Press

## Brand & Layout
- Overall feel: Stripe Press is a literary, editorial product — dark, refined, and serious in tone. The design leans into book-publishing aesthetics: serif typography, high contrast dark backgrounds, and restrained whitespace that signals intellectual weight rather than consumer urgency.
- Layout: Pages are predominantly single-column or centered editorial layouts. Content is organized into clearly delineated sections (product lists, headers, taglines) without heavy use of card grids or sidebars. The hierarchy is typographic rather than structural.

## Colors
- Primary: Near-black — `#201819` — used as the global page background, establishing a dark, immersive reading environment.
- Accent: Dark charcoal — `#222` — used as a close secondary surface or text-adjacent dark tone, likely for subtle distinctions between layered elements.
- Backgrounds: `#201819` is the dominant background across the full page. No light-mode background is evident from the data.
- Text colors: White (`#fff`) is the primary text color on dark backgrounds. Muted text and secondary text colors are not directly observable (assumed to be a reduced-opacity or lighter gray variant of white, e.g., `rgba(255,255,255,0.6)`).

## Typography
- Base font: `Ivar Text, Georgia` — a classical serif stack used for body copy, captions, and editorial prose.
- Base size: Not directly specified in extracted tokens; heading elements are recorded at 16px, suggesting a compact, text-forward scale. Base body size assumed to be approximately 16–18px.
- Heading scale:
  - H1–H6 appear visually at 16px in extracted tokens, suggesting the heading hierarchy is more about weight and spacing than dramatic size jumps. In the site header, H1 carries the brand name ("Stripe Press") and H2 carries the tagline ("Ideas for progress") — both likely styled close in size but differentiated by weight or tracking.
  - Headings use `Ivar Headline` — a display-weight serif — at `font-weight: 600`, with `letter-spacing: 0.32px` applied globally to interactive elements.
- Other: `Ivar Headline` appears specifically for interactive elements (buttons) and display headings, distinguishing functional UI from prose copy. No monospace font is evident in the data.

## Spacing & Radius
- Base spacing unit: 6px is the only directly observed spacing value; the base unit is likely 6px or a multiple thereof.
- Spacing scale: Only 6px is directly observed. A scale of 6px, 12px, 18px, 24px, 36px is consistent with a 6px base (assumed). Standard padding and section gaps are not directly extractable from the provided tokens.
- Border radius: 0px — no rounding is applied to any component. All elements (buttons, panels, inputs) use sharp, square corners, reinforcing the austere editorial aesthetic.

## Shadows & Borders
- Shadows: No shadow values are present in the extracted data. The design relies on color contrast rather than elevation or depth cues (assumed consistent with the flat, editorial aesthetic).
- Borders: No specific border styles are recorded in the tokens. Any borders used are assumed to be subtle, likely `1px solid` at a muted white or dark tone, used sparingly for section separation.

## Components

### Buttons
- Variants: Only one base button style is directly evidenced — a bare, text-style button reset. No filled/outlined variants are directly observable. A ghost or text-only variant is the default; filled variants (assumed) likely exist for primary CTAs.
- Shape & size: No padding on base button (`padding: 0`). Font size is 17px, using `Ivar Headline` at `font-weight: 600`. Border radius is 0 (sharp corners throughout).
- States: Background is explicitly `none` and border is `none` by default. Hover, active, disabled, and focus states are not directly observable (assumed to involve color shifts or underline treatment consistent with editorial link conventions).
- Icon usage: The chat CTA button (`UniversalChatCtaButton`) pairs SVG icons with the button — icons appear inline, left-aligned, with the icon rendered at 20×20px. A two-bubble icon layout is used for the chat UI specifically.

### Cards / Panels
- Layout: No card-specific CSS or structural tokens are present. Cards, if used, are assumed to be flat and borderless, relying on spacing and typography for grouping rather than elevated surfaces or outlines.
- Content structure: Inferred from the product list header pattern: a name/title element paired with a tagline or subtitle. (assumed)
- Variants: No elevated or outlined card styles are directly observable; minimal/flat is the inferred default.

### Forms & Inputs
- Input style: No form tokens are present in the data. Style is not directly observable; assumed to follow the overall sharp-cornered, minimal aesthetic with flat borders or underlines.
- Labels: Not observable. Assumed to be top-placed, serif-styled, consistent with the editorial tone.
- Validation: Not observable (assumed).
- Buttons in forms: Would follow the same base button reset described above; any submit action likely uses the same 17px `Ivar Headline` weight-600 style.

### Navigation
- Header: The page uses a branded header (`PressHomepageProductListHeader`) with an H1 for the site name and an H2 tagline. Position (fixed vs. static) is not directly extractable (assumed static for an editorial/publishing context).
- Nav items: Typography follows the global `letter-spacing: 0.32px` rule. Navigation link styling uses `Ivar Text` or `Ivar Headline` (assumed), white text on the dark background.
- Mobile behavior: Not directly observable (assumed to collapse to a minimal or hidden navigation pattern).

## Layout Conventions
- Breakpoints: Not directly observable. Standard responsive breakpoints at approximately 600px, 960px, and 1280px are assumed.
- Grids: No CSS grid or flexbox framework tokens are present. Layout appears to be single-column or centered editorial columns rather than dense grid systems.
- Sections: Page sections are separated by typographic hierarchy and whitespace. The homepage pattern shows a product list header section with name and tagline as distinct stacked elements. Vertical rhythm is driven by the 6px base unit (assumed multiples for inter-section gaps).

## Usage Notes
- **UI copy tone:** Write sparingly and seriously — short declarative phrases ("Ideas for progress") over marketing superlatives. Favor nouns over adjectives. Let the content carry weight without exclamation or urgency.
- **Visual consistency:** Always default to 0 border radius. Avoid shadows, gradients, or any depth illusions. Trust contrast and whitespace to do structural work.
- **New components:** Introduce new elements using `Ivar Headline` for interactive/display text and `Ivar Text` for prose. Keep the dark background as the assumed canvas; any new surface should sit within `#201819`–`#222` range unless a specific light context is established.