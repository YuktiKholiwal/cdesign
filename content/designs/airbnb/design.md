# Design Spec – Airbnb (www.airbnb.com)

## Brand & Layout
- Overall feel: Warm, approachable, and polished. The design balances a consumer-facing friendliness (soft neutrals, rounded corners, generous white space) with professional clarity. The brand conveys trust and ease through restrained use of accent color and clean typographic hierarchy.
- Layout: Primarily content-first, full-width page layouts with a sticky/fixed header. The main content area uses responsive CSS Grid and Flexbox for card-based listing grids. Search and filtering are prominently surfaced in the header. Cards dominate the homepage and search results. Modals and overlays are used for detailed interactions.

---

## Colors

- **Primary (Rausch):** `#FF385C` — Airbnb's signature coral-red. Used for primary CTAs, active states, logo, and key interactive highlights.
- **Primary dark variant:** `#E00B41` (`--palette-product-rausch`) — Used for hover/active states on primary buttons and links.
- **Accent (Arches):** `#C13515` / `#B32505` — A deeper terracotta red used for secondary accent treatments and warning-adjacent states.
- **Accent warm cream (Capiz/Hapuna):** `#F7F6F2` / `#F5F1EA` — Warm off-white used as subtle section backgrounds and card surfaces to convey warmth.
- **Plus tier:** `#92174D` — Deep magenta, used for Airbnb Plus branding.
- **Luxe tier:** `#460479` — Deep purple, used for Airbnb Luxe branding.
- **Link/informational blue:** `#428BFF` — Used for informational links and highlights.
- **Amber/warning:** `#E07912` — Used for warning states or badges.
- **Success/green:** `#008A05` — Used for success states and availability indicators.

### Backgrounds
| Token | Value | Usage |
|---|---|---|
| `--palette-bg-primary` | `#FFFFFF` | Default page and component background |
| `--palette-faint` | `#F7F7F7` | Hover states, disabled backgrounds, secondary sections |
| `--palette-capiz` | `#F7F6F2` | Warm neutral section backgrounds |
| `--palette-hapuna` | `#F5F1EA` | Warmer tinted backgrounds, banners |
| `--palette-arches12` | `#FFF8F6` | Very light tinted backgrounds near brand color |

### Text Colors
| Token | Value | Usage |
|---|---|---|
| `--palette-hof` | `#222222` | Primary body text, headings, strong labels |
| `--palette-foggy` | `#6A6A6A` | Muted/secondary text, captions, meta info |
| `--palette-bobo` | `#B0B0B0` | Placeholder text, disabled text |
| `--palette-white` | `#FFFFFF` | Inverted text on dark or brand-colored surfaces |

---

## Typography

- **Base font:** `Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif` — Airbnb Cereal is the proprietary variable typeface; Circular and system fonts serve as fallbacks.
- **Base size:** `14px`
- **Heading scale:** Heading sizes are not explicitly enumerated in extracted tokens. Based on typical Airbnb UI patterns, headings follow a modular scale — (assumed) H1 ~32–40px bold, H2 ~24–28px semibold, H3 ~18–22px medium — all set in Airbnb Cereal with tight to normal letter-spacing and no decorative embellishment.
- **Font weight:** (assumed) Regular (400), Medium (500), and Bold (700/800) are the primary weights used, reflecting the variable font range.
- **Monospace:** `monospace` appears in the stack, likely used only for code, debugging UI, or technical reference elements; not prominent in consumer-facing UI.
- **Special display font:** `var(--Font-Family-Special-Displays, 'Airbnb Cereal VF')` — used in hero/editorial display contexts, still resolves to Cereal.

---

## Spacing & Radius

- **Base spacing unit:** `4px` (multiples of 4 dominate the scale)
- **Spacing scale:**
  - Tight: `4px`, `8px` — icon gaps, internal component padding
  - Standard: `12px`, `16px`, `20px`, `24px` — component padding, form field spacing
  - Loose: `28px`, `32px`+ — section padding, card gutters
  - Fine increments (`1px–3px`) also present for border and shadow adjustments.

- **Border radius scale:**
  | Value | Usage |
  |---|---|
  | `0px` | Square-cropped images, some full-bleed containers |
  | `4px`, `6px`, `8px` | Subtle rounding on tags, badges, small chips |
  | `12px`, `16px` | Input fields, secondary cards |
  | `24px`, `32px` | Primary cards, modals, panels |
  | `50px` | Fully pill-shaped buttons (e.g., search bar, filter pills) |
  | `40px–48px` | Large rounded buttons and dialogs |

---

## Shadows & Borders

- **Cards/panels (standard):** `0 2px 16px rgba(0,0,0,0.12)` — A soft, medium-blur drop shadow for floating surfaces like popovers, dropdowns, and listing cards. Conveys gentle elevation without heaviness.
- **High elevation (modals/sheets):** `var(--elevation-high-box-shadow)` — Stronger shadow for modals and layered UI surfaces (assumed to be a larger spread/higher opacity).
- **Focus rings:** `0 0 0 2px #FFFFFF, 0 0 0 4px #222222` — Double-ring focus indicator: white inner ring + dark outer ring, ensuring visibility on any background. Accessibility-forward.
- **Inset borders (inputs, selected state):** `inset 0 0 0 2px #222222` — Used to indicate active/selected input fields or pressed states without changing layout.
- **Overlay scrim:** `rgba(0,0,0,0.3)` to `rgba(0,0,0,0.5)` — Used behind modals and bottom sheets.
- **Sharp-edge surface overlay:** `rgba(0,0,0,0.08)` — Subtle darkening layer for hover effects on images and cards.

- **Borders:** Typically expressed through `box-shadow: inset` rather than `border` property to avoid layout shifts. Common border equivalents use `1px` or `1.5px` strokes in `#DDDDDD` (`--palette-deco`) or `#EBEBEB` (`--palette-bebe`) for dividers and inactive input outlines.

---

## Components

### Buttons

- **Variants:**
  - *Primary:* Solid fill using `#FF385C` (Rausch), white text. Used for main CTAs (e.g., "Search", "Reserve").
  - *Secondary:* White or neutral background with dark (`#222222`) border/text. Used for supporting actions.
  - *Ghost/subtle:* No background, no border, text only — used for inline actions, navigation links.
  - *Destructive:* (assumed) Uses Rausch/Arches red tones for delete or cancel confirmation actions.

- **Shape & size:**
  - Pill shape (border-radius ~`50px`) for primary search and filter buttons.
  - Rounded rectangle (~`8px–12px` radius) for standard form and modal buttons.
  - Padding: (assumed) approximately `12px 20px` to `14px 24px` for standard buttons.
  - Font weight: semibold/bold (~600–700).

- **States:**
  - *Hover:* Slight background darkening or `#F7F7F7` fill shift; primary buttons darken toward `#E00B41`.
  - *Active/pressed:* Deeper color or inset shadow.
  - *Disabled:* Background `#F7F7F7`, text `#B0B0B0`, cursor not-allowed.
  - *Focus:* Double-ring focus outline — white `2px` ring + dark `2px` ring — applied consistently for accessibility.

- **Icon usage:** Icons appear inside buttons (e.g., search icon in the search button), centered with text, separated by approximately `8px`. Icon-only buttons use `aria-label` for accessibility.

---

### Cards / Panels

- **Layout:** Cards use `border-radius` of `12px–24px`, `box-shadow: 0 2px 16px rgba(0,0,0,0.12)` for elevation. Internal padding is approximately `16px–24px`.
- **Content structure:** Typically: hero image (top, full-width, rounded top corners), followed by title, location/meta line, rating + review count, price per night. Action elements (wishlist heart icon) overlay the image.
- **Variants:**
  - *Elevated:* Standard listing card with drop shadow, used in search results grid.
  - *Outlined:* (assumed) Used for less prominent information panels with a `1px #EBEBEB` border and no shadow.
  - *Minimal:* Flat, no shadow or border — used in editorial/category rows.
- **Image treatment:** Full-width image with `border-radius` matching card top corners; aspect ratio approximately 4:3 (assumed).

---

### Forms & Inputs

- **Input style:** Inputs use rounded corners (`8px–12px`), a white background, and an inset border expressed via `box-shadow: inset 0 0 0 1px #DDDDDD` at rest. On focus, the inset border thickens to `1.5px–2px` in `#222222`.
- **Labels:** Positioned above inputs (top-placed labels); floating label behavior is used in the search bar date/guest inputs where the label shrinks and floats on interaction.
- **Validation:** (assumed) Error states use `#C13515` (Arches) or `#FF385C` (Rausch) border highlight with an inline error message beneath the field in muted red text.
- **Success:** (assumed) `#008A05` (Spruce) used for success confirmation states.
- **Buttons in forms:** Match the primary button style — pill or rounded rectangle shape, full-width in modal/sheet forms or right-aligned inline.
- **Checkboxes/radios:** Custom styled; labels can reverse direction via flex `row-reverse` depending on context (RTL-aware).

---

### Navigation

- **Header:** Fixed/sticky at top of viewport. White background (`#FFFFFF`), with a subtle bottom shadow (`0 2px 16px rgba(0,0,0,0.12)`) that activates on scroll. Height approximately `80px` on desktop (assumed).
- **Logo:** Airbnb wordmark/icon in `#FF385C` (Rausch), positioned left. Clickable, links to homepage.
- **Search bar:** Prominent pill-shaped multi-segment search input centered in the header, containing location, dates, and guest count fields. Rounded pill shape (~`50px` radius). This is the dominant header element on desktop.
- **Right nav:** Contains "Airbnb your home" link (ghost button), globe/language picker, and user account menu (avatar + hamburger in a pill). All styled as ghost or subtle buttons.
- **Nav items:** Text in `#222222`, semibold. Hover state uses `#F7F7F7` background on the containing pill/button.
- **Mobile behavior:** (assumed) Search bar collapses to a compact pill. Full-screen overlay or bottom sheet used for navigation and filters. Hamburger menu reveals account/navigation options.
- **Transparent-to-solid transition:** On the homepage hero, the header may start semi-transparent and become solid on scroll (assumed based on common Airbnb homepage pattern).

---

## Layout Conventions

- **Breakpoints:** (assumed, inferred from responsive CSS patterns)
  - Small: `< 744px` (mobile)
  - Medium: `744px–1128px` (tablet)
  - Large: `> 1128px` (desktop)
  - Extra-large: `> 1440px` (wide desktop)

- **Grids:**
  - Listing card grids use CSS Grid with auto-fill columns, approximately 2 columns on tablet, 3–4 on desktop.
  - Cards maintain consistent gutter spacing of ~`24px`.
  - Flexbox used heavily for header layout, navigation items, and inline component arrangements.

- **Sections:** Homepage sections are stacked vertically with generous vertical padding (approximately `48px–64px` between sections, assumed). Section headings are left-aligned. Category filter strip appears below the main header as a horizontally scrollable row of icon+label pills.

---

## Usage Notes

**UI copy voice:**
- Use warm, direct, second-person language ("Find your next stay," "You're covered"). Avoid corporate jargon; be helpful and human.
- Keep CTAs short and action-oriented ("Search," "Reserve," "Learn more"). Avoid exclamation marks in UI chrome.
- For empty states or errors, be reassuring and solution-oriented rather than alarming.

**Visual feel when designing new components:**
- Default to generous white space, rounded corners, and soft shadows. Nothing should feel sharp or cluttered.
- Use `#FF385C` sparingly — reserve it for the single most important action per context. Let neutrals and warm off-whites carry most surfaces.
- Prioritize accessibility in interactive states: always use the double-ring focus style (white + dark), ensure text meets contrast ratios against neutral backgrounds, and keep touch targets comfortably large (~`44px` minimum height).