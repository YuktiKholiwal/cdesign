# Design Spec – Apple (apple.com)

## Brand & Layout
- Overall feel: Clean, minimal, and premium. The design communicates quiet confidence through generous whitespace, precise typography, and a near-monochromatic palette punctuated by selective use of blue links and deep blacks. Nothing competes with the product.
- Layout: Full-width sections stack vertically with generous vertical rhythm. Content is centered in a constrained max-width column. No persistent sidebars; layouts use flex and grid for multi-column product grids and navigation rows. Cards are used sparingly for product display.

---

## Colors

- **Primary:** Near-black `#1d1d1f` — used for main body text, headlines, and primary UI elements.
- **Accent:** Apple Blue `#06c` (light mode) / `#2997ff` (dark mode) — used for links, interactive labels, and calls to action.
- **Backgrounds:**
  - Page default: `#f5f5f7` (light gray) — used as section and page background.
  - Global nav (default): `rgba(250, 250, 252, 0.92)` — frosted/translucent white nav bar.
  - Global nav (opened): `#fafafc` — solid near-white when menu is expanded.
  - Dark nav (opened): `#161617` — near-black variant for dark contexts.
  - Global message bar: `rgb(250, 250, 252)` — very light, almost white.
  - Pure white `#fff` — used for content panels and card surfaces (assumed).
- **Text colors:**
  - Main text: `rgba(0, 0, 0, 0.8)` / `#1d1d1f` — primary readable text.
  - Muted/secondary text: `#6e6e73` and `#86868b` — captions, footnotes, submenu headers, placeholder text.
  - Dark secondary: `#333336` — slightly lighter than black, used for secondary interactive text and search input values.
  - Inverted/on-dark: `rgba(255, 255, 255, 0.8)` and `rgba(255, 255, 255, 0.92)` — text on dark backgrounds.
  - Badge text: `rgb(255, 255, 255)` on `rgb(0, 0, 0)` background — notification/count badges in nav.

---

## Typography

- **Base font:** `SF Pro Text, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif` — Apple's proprietary San Francisco typeface with broad system/web fallbacks. `-webkit-font-smoothing: antialiased` is applied globally for crisp sub-pixel rendering.
- **Display font:** `SF Pro Display, SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif` — used for large headlines and hero text.
- **Base size:** Not directly specified in tokens. (assumed) ~17px for body text, consistent with Apple's standard body copy.
- **Heading scale:**
  - H1–H3 sizes appear as 6px token entries (likely a parser artifact — actual visual sizes are large). Hero headings are visually very large (assumed 48px–96px+ for hero H1), tapering down through section headings.
  - Headings use SF Pro Display at heavy or bold weight, with tight letter-spacing and no text decoration.
  - H1 hero type is typically rendered at high contrast against the background, often centered.
- **Other:** Localized font stacks provided for Japanese (Hiragino/Meiryo), Korean (Apple Gothic/Malgun), Arabic (SF Pro AR), Simplified Chinese (PingFang SC), Traditional Chinese (PingFang TC/HK), and Thai (SF Pro TH). No monospace font stack is evident in the extracted data.

---

## Spacing & Radius

- **Base spacing unit:** 4px (inferred from smallest non-1px spacing value in scale).
- **Spacing scale:** `1px, 2px, 3px, 4px, 6px, 8px, 9px, 11px, 12px, 14px, 16px, 17px, 22px, 27px, 37px` — a fine-grained, custom scale rather than a strict power-of-2 system. Common practical steps are 4, 8, 12, 16, 22.
- **Border radius:**
  - `0px` — no radius on full-width section containers and some UI chrome.
  - `1px` — hairline / near-flat (assumed for thin borders or minimal rounding).
  - `5px` / `6px` — standard component radius (inputs, small buttons, tags).
  - `21px` — pill/capsule radius for rounded buttons and badges (e.g., nav badge).

---

## Shadows & Borders

- **Shadows:** No shadow tokens were extracted. Apple's design relies on layering and background color contrast rather than drop shadows. Elevation is implied through background color changes (e.g., white panel on light-gray page background). (assumed) Subtle shadows may appear on modal overlays or floating menus.
- **Borders:**
  - Hairline dividers using `rgba(0, 0, 0, 0.48)` or `#e8e8ed` — used for section separators and message bar borders.
  - `rgba(232, 232, 237, 0.4)` — very subtle, near-invisible border for layered light surfaces.
  - Border thickness is consistently `1px`. No thick or decorative borders.

---

## Components

### Buttons

- **Variants:**
  - *Primary:* Filled pill-shaped button, likely dark (`#1d1d1f`) or blue (`#06c`) background with white text (assumed from brand conventions).
  - *Secondary/Ghost:* Outlined pill with transparent background, border matching text color (assumed).
  - *Subtle:* Plain text link styled in `#06c` with no visible border or background — common for in-content actions.
  - *Icon-only:* Used in the global nav (e.g., menu back button with SVG chevron); no visible background or border.
- **Shape & size:** Pill shape (`border-radius: ~21px` for rounded buttons) or lightly rounded (`5–6px`) for smaller contextual buttons. Padding approximately `8–12px` vertical, `16–22px` horizontal (assumed). Medium font weight.
- **States:**
  - Hover: Text color deepens toward `#000000`; background may shift slightly.
  - Active: Similar to hover with slight depression (assumed).
  - Disabled: `cursor: default`; reduced opacity (assumed).
  - Focus: System default or custom outline (not directly specified).
- **Icon usage:** Icons appear inline with navigation buttons (SVG, left-aligned with text or centered in icon-only buttons). Spacing between icon and label approximately 6–8px (assumed).

### Cards / Panels

- **Layout:** Minimal visible structure. Padding approximately 16–22px (assumed). Border radius `5–6px` for product tiles; larger sections have no radius.
- **Content structure:** Typically: product image (top, full-width of card), category label (muted), product name (bold headline), brief descriptor, price or CTA link below.
- **Variants:**
  - *Minimal:* Product tiles on a `#f5f5f7` page background with white card surface — elevation implied by color difference, no explicit shadow.
  - *Elevated:* (assumed) Modal panels and overlay menus may use a white background with subtle shadow.
  - *Outlined:* Not prominently used; thin `1px` `#e8e8ed` border appears on some content segments.

### Forms & Inputs

- **Input style:** Clean, low-decoration. Likely a `1px` border with `rgba(0,0,0,0.48)` color, `5–6px` radius, light background. (assumed) Padding approximately 8–12px.
- **Labels:** Top-aligned or placeholder-as-label pattern common in Apple's minimal aesthetic (assumed).
- **Validation:** No explicit validation color tokens extracted. (assumed) Error states would use a muted red; success states would use green, consistent with Apple HIG conventions.
- **Buttons in forms:** Visually identical to standalone pill or rounded buttons; inherit font and color from form context via `font: inherit; color: inherit`.

### Navigation

- **Header (Global Nav):**
  - Position: Fixed/sticky at top of viewport.
  - Height: Approximately 44–48px (inferred from SVG viewBox `height="48"` on nav icons).
  - Background: `rgba(250, 250, 252, 0.92)` — translucent frosted glass effect in default state; becomes `#fafafc` (fully opaque) when menu is open.
  - No visible bottom shadow by default; separation achieved by the translucency.
  - Dark mode background: `rgba(22, 22, 23, 0.88)` closed / `#161617` opened.
- **Nav items:** Set in SF Pro Text, small size (~14px assumed), color `rgba(0, 0, 0, 0.8)`. On hover, text shifts to full `#000000`. Apple logo and nav icons use SVG fills that follow the same color variables.
- **Submenu:** Dropdown with header labels in muted `rgb(110, 110, 115)` and item links in `#333336`, hover background `rgb(245, 245, 247)`.
- **Search:** Inline search within nav. Placeholder and icon in `rgb(110, 110, 115)`; active/entered text in `#333336`.
- **Mobile behavior:** Hamburger-style menu button (`.globalnav-menuback-button`) triggers a full overlay navigation with a back-chevron for sub-menu navigation. Overlay background transitions to the fully opaque nav background color.
- **Local nav (sub-brand):** A secondary sticky nav (`#ac-localnav`) appears below the global nav for product sub-sites (e.g., iPhone, Mac). Same font and reset conventions, product name on the left, section links centered or right-aligned (assumed).
- **Footer:** Set in `SF Pro Text / Myriad Set Pro` fallback stack, antialiased, `ltr` direction enforced. Typography is small (~12px assumed), text in muted gray. Section headings in footer use `var(--footer-directory-title-color)` (not resolved in tokens — assumed to be `#1d1d1f` or `#6e6e73`).

---

## Layout Conventions

- **Breakpoints:** Not explicitly defined in tokens. (assumed) Apple uses approximately:
  - Small/mobile: < 768px
  - Medium/tablet: 768px–1068px
  - Large/desktop: > 1068px
  - XL: > 1440px for hero visuals
- **Grids:** Flex and CSS Grid used for product grids (typically 2–4 columns on desktop, 1–2 on mobile). No external CSS framework (confirmed: `usesTailwind: false`, no framework detected).
- **Sections:** Full-width `<section>` blocks stack vertically. Each section is visually self-contained with its own background (alternating white and `#f5f5f7`). Vertical padding between sections is large — approximately 80–120px (assumed) — creating the signature airy, unhurried scroll experience.

---

## Usage Notes

**UI copy voice:**
- Write short, declarative, product-forward headlines. Let the product name lead. ("iPhone 16 Pro. Built for Apple Intelligence.")
- Use sentence case for most labels and CTAs. Avoid imperative all-caps.
- CTAs are brief and confident: "Learn more", "Buy", "Shop iPhone" — never generic "Click here".

**Visual feel when designing new components:**
- Default to more whitespace than feels comfortable; Apple layouts breathe intentionally.
- Restrain color use — the palette is nearly monochrome with blue reserved strictly for interactive/link elements. Avoid decorative color fills.
- Typography does the heavy lifting: scale, weight contrast, and tight leading on large type create visual hierarchy without requiring borders, backgrounds, or shadows.