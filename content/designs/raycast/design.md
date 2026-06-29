# Design Spec – Raycast (raycast.com)

## Brand & Layout
- Overall feel: Raycast presents a dark, polished, Mac-native aesthetic — premium developer tooling with a sleek, almost cinematic quality. The design is dense with subtle detail (layered shadows, glass-like surfaces, fine inset borders) while remaining uncluttered and purposeful.
- Layout: Full-width dark-background page sections, centered content columns, card grids, and heavily art-directed "app window" showcase panels. Cards and feature walls dominate the product marketing pages.

---

## Colors

- **Primary:** Near-black `#111214` — main background surface for the app and page shell.
- **Accent (Green):** `#59d499` — success states, highlights, positive indicators; used with a 15% opacity tint (`rgba(89,212,153,.15)`) for backgrounds.
- **Accent (Red/Pink):** `#ff6363` — error/destructive states; similarly paired with `rgba(255,99,99,.15)` for soft backgrounds.
- **Accent (Purple):** `#d8acff` — AI features, premium/highlighted content; tint variant `rgba(216,172,255,.15)`.
- **Backgrounds:**
  - Page background: `#111214` (darkest surface)
  - Card/panel backgrounds: dark gradient `linear-gradient(138deg, rgba(32,35,91,0.70), rgba(7,9,33,0.70))` or `rgba(17,18,20,.88)` with backdrop blur
  - Deep red-tinted surface: `#130d0e` / `#2c1617` / `#452324` — used for destructive/alert dialog surfaces
  - Subtle frosted overlay: `rgba(255,255,255,.03)` — barely-there layering on dark panels
- **Text colors:**
  - Primary text (on dark): `#fff` / `rgb(255 255 255/80%)` — near-white for body and headings
  - Muted text: `rgba(255,255,255,.7)` / `rgba(255,255,255,.5)` — secondary descriptions and meta
  - Dimmed/placeholder: `rgba(255,255,255,.03)` – (assumed for ghost elements)
  - Inverted (light surfaces): `rgba(0,0,0,.8)` — dark text for any light-mode contexts (assumed rare)

---

## Typography

- **Base font:** `var(--font-inter)` / `var(--main-font)` → Inter, system-ui, sans-serif (assumed system fallback)
- **Base size:** Not directly extracted; 14–16px inferred from component-level rules (e.g., card descriptions at `14px`, card titles at `16px`)
- **Heading scale:**
  - H1: 44px, heavy weight, tight — primary hero/section titles
  - H2: 18px, semibold — section sub-headings
  - H5: 20px, semibold — (assumed) feature card headings
  - Card title (`p`-based): 16px, weight 600, line-height 1.6
  - Card description: 14px, normal weight, line-height 1.6
- **Monospace:** `var(--font-geist-mono)` / `var(--monospace-font)` — used in search/command UI mockups, code references, and terminal-style components

---

## Spacing & Radius

- **Base spacing unit:** 4px (CSS variable `--spacing-1` = 4px inferred from scale)
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40px — with notable usage at 4px (gaps between inline elements), 12px (button top margin), 16px (panel padding), 24–32px (section internal gaps)
- **Border radius:**
  - Small interactive elements (tags, badges): 4–6px
  - Buttons and inputs: 8–10px
  - Cards and panels: 8–12px
  - Modals/dialogs: 12–16px
  - Pills (full-round): 9999px or 99999px
  - Extreme-round decorative elements: 86px, 1000px, 9999999px — used for glows and blob shapes

---

## Shadows & Borders

- **Shadows:**
  - Cards: layered, e.g. `0 0 0 1px rgba(255,255,255,0.06) inset, 0px 0px 20px 3px rgba(7,13,79,0.05), 0 0 40px 20px rgba(7,13,79,0.05)` — deep, soft colored outer glows combined with hairline inset borders
  - Buttons (primary): `inset 0 -1px .4px rgba(0,0,0,.2), inset 0 1px .4px #fff, 0 0 0 2px rgba(0,0,0,.5), 0 0 14px 0 rgba(255,255,255,.19)` — inner top/bottom edge lighting for a 3D "keycap" effect
  - Focus rings: `0 0 0 2px rgba(255,255,255,.5)` — bright white outer ring
  - Panels: `0 0 40px 20px rgba(255,255,255,.03), inset 0 .5px 0 0 rgba(255,255,255,.3)` — very soft ambient glow with a bright top edge line
  - Alert/destructive: `0 0 0 1px #833637` + `inset 0 1px 0 0 rgba(255,127,127,.11)` — red-tinted ring with subtle warm inner highlight
- **Borders:**
  - Universal hairline: `1px solid rgba(255,255,255,0.06)` to `rgba(255,255,255,0.10)` — all cards and panels use a near-invisible white border
  - Inset ring alternative: `box-shadow: inset 0 0 0 1px rgb(255 255 255/10%)` — used instead of `border` to avoid layout shifts
  - Stronger emphasis: `0 0 0 1px rgba(255,255,255,.25)` — hover or selected state borders

---

## Components

### Buttons

- **Variants:**
  - *Primary:* bright (white or accent-colored), keycap-style 3D shadow, `border-radius: 8–10px`
  - *Secondary/Outlined:* `inset 0 0 0 1px rgba(255,255,255,.25)` ring border on dark background, subtle inner top highlight
  - *Ghost/Subtle:* no border, low-opacity background, used for nav or inline actions
  - *Destructive:* red-tinted ring (`#833637`), dark red background surface
- **Shape & size:** Padding approximately 8–12px vertical, 16–20px horizontal (assumed from spacing scale); border-radius 8px; font-weight 600
- **States:**
  - Hover: border brightens (opacity increases toward `.5`), subtle background shift
  - Active: shadow compresses inward, top-edge highlight dims
  - Focus: `0 0 0 2px rgba(255,255,255,.5)` white glow ring
  - Disabled: (assumed) reduced opacity ~40%, no shadow
- **Icon usage:** Icons appear left-aligned with text, gap approximately 6–8px (assumed from spacing scale)

### Cards / Panels

- **Layout:** Padding `var(--spacing-3)` (~12px) on compact cards, larger on feature panels. Border-radius 8–12px. Always bordered with an inset white hairline shadow.
- **Content structure:** Optional logo/icon at top → title (16px, semibold) → description (14px, muted) → CTA button at bottom (margin-top 12px). Graphic or illustration may be positioned absolutely at right or bottom.
- **Variants:**
  - *Elevated:* dark gradient background + soft colored glow shadow (used for extension cards, feature walls)
  - *Outlined:* flat dark fill + `inset 0 0 0 1px rgb(255 255 255/10%)` only
  - *Frosted/Glass:* `background: rgba(255,255,255,.1)` + `backdrop-filter: blur(36px)` — used for popovers, overlays, and floating UI panels

### Forms & Inputs

- No form-specific tokens were directly extracted.
- **Input style (assumed):** Dark background matching card surfaces, `border-radius: 8px`, `border: 1px solid rgba(255,255,255,.1)`, 12–16px horizontal padding, 10–12px vertical padding
- **Labels:** Top-aligned, 12–14px, muted white color (assumed)
- **Validation:** Green (`#59d499`) for success, red (`#ff6363`) for error — matching accent system
- **Buttons in forms:** Visually identical to standalone primary buttons; full-width variant available (`.cta-card_fullWidth`)

### Navigation

- **Header:** (assumed fixed) dark background `#111214` or `rgba(17,18,20,.88)` with `backdrop-filter: blur` for frosted scroll behavior; subtle bottom border `1px solid rgba(255,255,255,.06)`
- **Nav items:** Small (~14px), normal or medium weight, white with reduced opacity for inactive items; full white on hover/active
- **Mobile behavior:** (assumed) hamburger icon triggers full-screen or slide-in dark overlay menu

---

## Layout Conventions

- **Breakpoints:** (assumed) ~768px (tablet) and ~1280px (desktop); window showcase components reference fixed widths of 750px and 1048px, suggesting desktop-first design with responsive adaptations below those widths
- **Grids:** CSS Grid and Flexbox both used. Cards in horizontal grids with `gap: var(--spacing-1)` to `var(--spacing-3)`. Feature sections use single or two-column flex layouts.
- **Sections:** Full-width dark sections, vertically separated by approximately 80–120px (assumed). Each section typically contains a centered heading block above a showcase or card grid.

---

## Usage Notes

- **UI copy tone:** Be terse, confident, and precise — describe capability directly ("Install via Homebrew", not "Get started by installing…"). Favor action verbs. Avoid filler.
- **Visual feel when designing new components:**
  - Every surface should feel like it exists in a dark room with a single directional light — use inset top-edge highlights and bottom-edge shadows to imply depth on buttons and cards.
  - Layering is key: stack a background, a subtle hairline border, a soft outer glow, and a barely-visible inner highlight to make flat dark elements feel tactile.
  - Reserve color accents (green, purple, red) sparingly for semantic meaning; the default palette is near-monochrome dark grey and white.