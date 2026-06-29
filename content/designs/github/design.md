# Design Spec – GitHub (github.com)

## Brand & Layout
- Overall feel: GitHub's marketing and product UI is clean, professional, and developer-focused. It favors high contrast, functional clarity, and a light default theme with strong semantic color use. The tone is authoritative but approachable, prioritizing information density without feeling cluttered.
- Layout: Content is organized in a responsive multi-column flex/row layout at large breakpoints, collapsing to a single column on mobile. The header spans full width with horizontally spaced nav items. Page sections use generous horizontal padding that scales with breakpoint (e.g., `px-3` → `px-4` → `px-5`).

---

## Colors

- **Primary (Blue):** `#0969da` — Used as the primary accent for links, active states, and emphasis backgrounds (e.g., badges, highlights).
- **Accent (Green / Success):** `#1f883d` — Used for success-emphasis states, primary action buttons (e.g., "Sign up", "Create"), and positive status indicators.
- **Attention (Yellow):** `#9a6700` (text/emphasis) / `#fff8c5` (muted background) — Used for warning states, attention banners, and caution labels.
- **Danger (Red):** `#cf222e` (emphasis) / `#ffebe9` (muted background) / `#d1242f` (foreground danger text) — Used for destructive actions, error states, and danger indicators.
- **Done/Purple:** `#8250df` (emphasis) / `#fbefff` (muted) — Used for "done" or "merged" status indicators (e.g., pull request merged state).
- **Emphasis Dark:** `#25292e` — Used for high-contrast emphasis backgrounds, such as dark badges or inverted elements.

**Backgrounds:**
- Default page background: white / near-white (assumed light)
- Muted accent background: `#ddf4ff` — used for informational highlights
- Muted danger background: `#ffebe9`
- Muted attention background: `#fff8c5`
- Disabled background: `#eff2f5`

**Text colors:**
- Main text: dark near-black (assumed `#1f2328` or similar system default)
- Muted text: medium gray (assumed)
- Danger/error text: `#d1242f`
- Inverted/on-dark: white (assumed)

---

## Typography

- **Base font:** System UI / GitHub's Primer design system uses `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif` (assumed based on GitHub Primer conventions; not directly observed in token data)
- **Base size:** Not directly captured; assumed `16px` per GitHub Primer defaults
- **Heading scale:**
  - H1: Large and bold, used for hero sections; exact px not captured (assumed ~32–48px on marketing pages)
  - H2: Section headings; assumed ~24–32px, semibold
  - H3: Sub-section headings; assumed ~18–20px, semibold
  - All headings use tight letter-spacing and medium-to-heavy weight
- **Monospace:** `"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace` (assumed based on GitHub Primer conventions) — used for code blocks, inline code, terminal output, and diff views

---

## Spacing & Radius

- **Base spacing unit:** `4px` (GitHub Primer uses a 4px base grid; assumed)
- **Spacing scale:** `4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px` (assumed Primer scale); horizontal page padding scales as approximately `12px (mobile) → 16px (md) → 24–40px (lg)` based on the `tmp-px-3 / tmp-px-md-4 / tmp-px-lg-5` utility classes observed
- **Border radius:**
  - Buttons and inputs: assumed `6px` (Primer standard)
  - Cards/panels: assumed `6px–12px`
  - Avatars: `50%` (circular) for user avatars, `6px` for org/app avatars (assumed)
  - Small badges/labels: assumed `2px–4px`

---

## Shadows & Borders

- **Shadows:** A single `utility:shadow` token is referenced, indicating a standard low-elevation box shadow is used. Assumed to be a subtle shadow (e.g., `0 1px 3px rgba(0,0,0,0.12), 0 8px 24px rgba(149,157,165,0.2)`) consistent with GitHub Primer's card elevation style. Shadows are used sparingly — primarily on dropdowns, modals, and raised cards.
- **Borders:** Thin `1px` borders in a light gray (assumed `#d0d7de` per Primer) are used on inputs, cards, panels, and table rows. The header and nav elements use border-bottom separators. Buttons have borders matching or complementing their background color.

---

## Components

### Buttons

- **Variants:**
  - **Primary (green):** Background `#1f883d`, hover `#1c8139`, active `#197935`, disabled `#95d8a6`. Used for main CTAs like "Sign up" or "Create."
  - **Outline/Secondary (blue):** Active state `#0757ba`. Used for secondary actions.
  - **Destructive:** Danger colors (`#cf222e`) applied to buttons for delete/remove actions.
  - **Ghost/Subtle:** (assumed) Low-contrast variant for tertiary actions.
- **Shape & size:** Rounded corners (assumed `6px`), moderate padding (assumed `8px 16px` for default, `5px 12px` for small), medium font weight (semibold, assumed `500–600`)
- **States:** Hover darkens the background slightly; active state is noticeably darker; disabled state uses washed-out/muted background with reduced opacity text; focus shows a visible keyboard focus ring (assumed blue outline per accessibility standards)
- **Icon usage:** Octicons (GitHub's icon set, 16×16px SVGs) appear inline with button or nav text, left-aligned, with approximately `4–8px` gap between icon and label

### Cards / Panels

- **Layout:** Assumed `12–16px` internal padding, `6px` border radius, `1px` border in light gray, subtle box shadow for elevated variants
- **Content structure:** Typically contains a title (semibold), optional subtitle or metadata line (muted smaller text), body content, and optional footer actions
- **Variants:**
  - *Outlined:* border + no shadow (common for list items, feature panels)
  - *Elevated:* border + shadow (dropdowns, modals, popovers)
  - *Minimal:* no border, no shadow (inline sections)

### Forms & Inputs

- **Input style:** Bordered (`1px`, light gray), rounded corners (assumed `6px`), white background, comfortable padding (assumed `6px 12px`). No underline-only style.
- **Labels:** Placed above the input, left-aligned, in regular or semibold weight
- **Validation:**
  - Error: red border + `#d1242f` error text below field; muted red background (`#ffebe9`) may be used contextually
  - Success: green indicator using `#1f883d`
- **Buttons in forms:** Primary submit buttons match the standard primary green button; visually consistent with standalone buttons

### Navigation

- **Header:** Full-width marketing header (`HeaderMktg`), static at top, switches to fixed behavior or sticky on scroll (assumed). Light background in light mode. Contains logo, nav links, and CTA buttons. Height moderate (assumed ~60–64px).
- **Nav items:** Rendered as flex row at large breakpoints (`flex-lg-row`), collapsed to a hidden/toggle menu on mobile (`d-lg-none` pattern). Typography is approximately `f4` (GitHub Primer scale, ~16px), regular weight, with hover states indicating the active item.
- **Mobile behavior:** A full-screen or overlay drawer pattern is used. A backdrop button (`HeaderMktg-backdrop`) covers the screen as a tap-to-dismiss overlay when the mobile nav is open. Toggle is triggered by a hamburger-style button.

---

## Layout Conventions

- **Breakpoints:** Based on utility class suffixes (`-lg-`, `-md-`):
  - Small (default): single-column, compressed padding
  - Medium (`md`): slightly wider padding, some layout adjustments
  - Large (`lg`): multi-column flex layout, full nav displayed, expanded spacing
- **Grids:** Flexbox is the primary layout mechanism (`d-flex`, `flex-column`, `flex-lg-row`, `flex-items-center`). CSS Grid may be used for marketing feature grids (assumed). Tailwind utility classes are also in use alongside Primer classes.
- **Sections:** Marketing pages use clearly delineated full-width horizontal sections with substantial vertical padding (assumed `48–96px` per section). Z-index layering (`z-1`) is used to manage header and overlay stacking.

---

## Usage Notes

**How to "sound like" this brand in UI copy:**
- Use concise, action-oriented language ("Create a repository," "Start building," "Explore features") — functional and confident, never flowery
- Prefer second-person direct address ("Your projects," "Build what you want") over passive or abstract phrasing
- Lean into developer vocabulary naturally without being exclusionary — technical terms are used plainly, not shown off

**How to "feel like" this site visually when designing new components:**
- Default to light backgrounds with strong typographic hierarchy and minimal decorative elements; let function drive visual decisions
- Use semantic color intentionally — green means go/success, red means danger, blue means information/interaction; never use these interchangeably
- Keep components compact and information-dense; use subtle borders and restrained shadows rather than heavy visual treatments to separate content regions