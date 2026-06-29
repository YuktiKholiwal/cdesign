# Design Spec – Loom (www.loom.com)

## Brand & Layout
- Overall feel: Clean, modern, and professional with a friendly undertone. The design favors generous whitespace, soft rounded elements, and a restrained blue-centric palette that feels approachable but enterprise-ready.
- Layout: Primarily single-column full-width sections with centered max-width content containers (`max-w-screen-3xl`). Cards, feature grids, and scroll-card layouts provide structured visual rhythm. Heavy use of Flexbox and fluid/responsive spacing via `clamp()`.

---

## Colors

- **Primary:** Loom Blue – `#1868db` (`--thd-color-blue-70`) — used for interactive elements, links, focus rings, and key CTAs.
- **Accent:** Coral/Orange – `#dc684d` — used sparingly for highlight callouts or decorative accents.
- **Backgrounds:**
  - White `#ffffff` — primary page and card background.
  - Light Grey `#f8f8f8` (`--thd-color-grey-10`) — subtle section backgrounds.
  - Near-white Grey `#f0f1f2` (`--thd-color-grey-20`) — secondary surface backgrounds.
  - Light Blue `#e9f2fe` (`--thd-color-blue-10`) — used on icon containers and highlighted interactive areas (e.g., the mobile toggle button background).
  - Indigo tint `#eff0ff` — soft accent surface, likely used in feature highlights.
- **Text colors:**
  - Main text: `#292a2e` (`--thd-color-grey-100`) — near-black for body copy.
  - Muted text: `#8c8f97` (`--thd-color-grey-50`) — secondary/supporting text, captions.
  - Subtle text: `#6c6f77` (`--thd-color-grey-70`) — metadata, labels.
  - Input placeholder: `#9ca3af` — standard Tailwind grey used for form placeholders.
  - Inverted/on-dark: `#ffffff` — (assumed) used on dark backgrounds or filled primary buttons.

---

## Typography

- **Base font:** `Charlie Text, sans-serif` — the primary brand typeface used for body and UI text. Falls back to a standard system sans-serif stack (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif`).
- **Display font:** `Charlie Display, sans-serif` — used for large headings and hero/display text.
- **Base size:** Not directly declared in tokens; assumed `16px` as standard browser default with Tailwind baseline.
- **Heading scale:**
  - H2: `28px` — section-level headings, likely semi-bold to bold.
  - H3: `21px` — sub-section or card headings.
  - H4: `18px` — minor headings.
  - H5/H6: `13px` — small labels, captions, or meta headings.
  - H1 size not directly observable; (assumed) significantly larger, likely 40–64px fluid for hero contexts using `clamp()`.
  - Headings use `Charlie Display` for large sizes and likely medium-to-bold weight.
- **Other:**
  - Monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace`) — (assumed) used for code snippets or technical callouts if any appear.
  - Caption/label text: `0.6875rem` (~11px) used in floating label forms.

---

## Spacing & Radius

- **Base spacing unit:** `8px` — inferred from the `--lns-unit: 8px` CSS variable referenced in icon sizing (`calc(3 * var(--lns-unit, 8px))`).
- **Spacing scale:** `4px, 6px, 8px, 10px, 12px, 14px, 16px, 18px, 20px, 24px, 32px, 36px, 40px, 48px, 60px, 64px, 72px, 90px, 96px, 100px` — directly observed. Fluid spacing via `clamp()` is heavily used for section and card padding (e.g., `clamp(2rem, 1.36rem + 1vw, 3rem)` for cards).
- **Border radius:**
  - `9999px` — full pill shape; used for circular icon containers (e.g., the nav toggle button is explicitly `rounded-full`).
  - `24px`, `32px` — large rounded corners on cards and panels.
  - `12px`, `16px` — standard card/modal radius.
  - `6px`, `8px` — button and input radius.
  - `4px` — small radius for tags, badges, or minor UI elements.
  - `2px`, `3px` — minimal radius for subtle borders or inline elements.

---

## Shadows & Borders

- **Shadows:**
  - Medium card shadow: `0 0.25em 0.4em 0 rgba(0,0,0,.03), 0 0.1875em 0.6em 0 rgba(0,0,0,.05), 0 0.5em 2em 0 rgba(0,0,0,.07), 0 2em 6em 0 rgba(0,0,0,.1)` — a layered, soft multi-level shadow for elevated panels.
  - Strong feature shadow: `0 0.9375rem 3.125rem 0 rgba(0,0,0,.25)` — used for prominent floating cards or hero UI elements.
  - Decorative shadow with glow: `0 0 0 0.3125rem hsla(0,0%,100%,.4), 0 2.85rem 5.43rem 0 rgba(0,0,0,.17), ...` — layered depth shadow with a white outer glow, likely on featured media or product screenshots.
  - Small subtle shadow: `0 0.2025rem 0.2025rem 0 rgba(0,0,0,.25)` — light drop shadow for minor components.
  - Focus ring shadow: `inset 0 0 0 0.375rem var(--lns-color-blueLight), inset 0 0 0 0.5rem var(--thd-color-blue-70)` — double inset ring for focused form fields using brand blue.
  - Tailwind utility shadows (`shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-2xl`) are also in use throughout.
- **Borders:**
  - Light border color: `#e4e2e7` (`--thd-color-grey-light-border`) — used on card outlines and input field borders.
  - Mid-grey border: `#dddee1` (`--thd-color-grey-30`) — (assumed) used for dividers and secondary borders.
  - Border thickness: (assumed) `1px` standard throughout.

---

## Components

### Buttons

- **Variants:**
  - *Primary:* Solid filled blue (`#1868db`) with white text — main CTA usage.
  - *Secondary/Outlined:* (assumed) Blue border with blue text, transparent background.
  - *Ghost/Subtle:* (assumed) No border, minimal background, blue or grey text.
  - *Destructive:* Not directly observed; (assumed) uses a red or coral tone if present.
- **Shape & size:** Rounded corners of approximately `6px`–`8px` for standard buttons; `9999px` for pill-style CTA variants. Font inherits from parent; weight likely medium to semi-bold. Padding (assumed) approximately `10px 20px` for standard, `8px 16px` for compact.
- **States:**
  - *Hover:* Slight darkening of background or border color; (assumed) subtle transition.
  - *Active:* Inset box shadow applied via `--button-color-bx-ac` variable.
  - *Focus:* Visible outline ring using `--thd-color-blue-70` with a secondary lighter blue ring — clearly styled for accessibility.
  - *Disabled:* (assumed) Reduced opacity with `cursor: not-allowed`.
- **Icon usage:** Icons sized at `calc(3 * 8px) = 24px` within icon-button containers. Icons are centered within circular backgrounds; (assumed) inline icons in text buttons are vertically centered with ~`8px` gap.

### Cards / Panels

- **Layout:**
  - *Float cards* (`.thd-card-float`): Elevated, `z-index: 10`, negative margins to break out of parent grid, fluid padding `clamp(3rem, 1.72rem + 3vw, 5rem)`. White background.
  - *Flat cards* (`.thd-card-flat`): Contained within grid, generous fluid padding. First child gets extra top/bottom padding for visual anchoring.
  - *Scroll cards* (`.thd-scroll-card`): Fixed width (`flex-shrink: 0`), used in horizontal scroll carousels.
- **Content structure:** (assumed) Title, supporting text, optional media or icon, and a CTA link or button at the bottom.
- **Variants:**
  - *Elevated:* Float cards with shadow and white background on tinted surface.
  - *Flat/Minimal:* Flat cards with padding only, no visible border or shadow.
  - *Outlined:* (assumed) Available using `#e4e2e7` border at `1px`.

### Forms & Inputs

- **Input style:** Standard bordered inputs. Border color `#e4e2e7`; (assumed) `1px solid` with `6px`–`8px` radius. Background white. Focus state uses a double inset ring in blue (`--thd-color-blue-70`). Placeholder text at `#9ca3af`.
- **Labels:** Floating label pattern (`.thd-label-float`) — labels begin in-field position (`top: 1em, left: 1.5em`) and animate upward on focus or when filled, becoming caption-sized (`0.6875rem`). Transition is smooth at `0.2s` on position and color properties.
- **Validation:** Error/success colors not directly observed; (assumed) error uses a red tone and success uses a green tone, consistent with the blue focus pattern.
- **Buttons in forms:** (assumed) Full-width or right-aligned primary buttons, consistent with standalone button styles.

### Navigation

- **Header:** Fixed height defined by `--thd-nav-h` CSS variable. Contains Loom/Atlassian logo on the left and nav items on the right. Uses `z-index: 10–20` layering. Background (assumed) white with a subtle bottom shadow on scroll.
- **Nav items:** (assumed) Medium-weight text using `Charlie Text`; horizontal spacing approximately `12px`–`16px` between items. Active/hover states likely use `#1868db` blue text or underline.
- **Mobile behavior:** A hamburger toggle button (`.thd-toggle`) appears at smaller breakpoints; it features a circular `48×48px` blue-tinted (`#e9f2fe`) container with a centered icon. Likely triggers a full-overlay or slide-down menu. The toggle has `sr-only` text for accessibility.

---

## Layout Conventions

- **Breakpoints:** Tailwind-based. Standard breakpoints inferred: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px` (where desktop nav becomes visible: `hidden xl:block`), `3xl` and `4xl` custom breakpoints used for max-width container capping (`max-w-screen-3xl`, `4xl:px-0`).
- **Grids:** Flexbox for header/nav layout (`flex items-center justify-between`). Card sections use both CSS Grid and Flexbox for column arrangements. Scroll-card rows use `flex` with `flex-shrink: 0` children.
- **Sections:** Page sections separated by generous fluid vertical spacing (`clamp(3rem–7rem)`). Float cards use negative margins to visually interlock adjacent sections. Max content width enforced by `max-w-screen-3xl mx-auto`.

---

## Usage Notes

- **How to "sound like" this brand in UI copy:**
  - Use clear, concise action-oriented language ("Record a video", "Share instantly") — functional and benefit-led, not overly playful.
  - Avoid jargon; keep copy inclusive and direct, appropriate for a professional B2B SaaS context.
  - CTAs should be specific and confident ("Get Loom free", "See how it works") rather than vague ("Learn more").

- **How to "feel like" this site visually when designing new components:**
  - Lean into fluid spacing and generous padding — components should breathe; avoid cramped layouts.
  - Use layered, soft multi-stop shadows for elevated elements rather than a single hard drop shadow; depth should feel gentle and refined.
  - Round corners generously (pill shapes for primary CTAs, `12px`–`16px` for containers) and anchor interactive elements with the primary blue `#1868db` for immediate visual hierarchy clarity.