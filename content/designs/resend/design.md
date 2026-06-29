# Design Spec – Resend (resend.com)

## Brand & Layout
- Overall feel: Resend projects a sleek, modern developer-tool aesthetic — dark-first, minimal, and precise. The visual language is technical yet refined, combining editorial typography with stark contrast and subtle texture.
- Layout: Full-width sections with centered max-width content columns. Cards, code panels, and feature grids are common. Sticky top navigation. Heavy use of flexbox and Tailwind utility classes; multi-column grid layouts for feature showcases.

---

## Colors

- **Primary:** Near-black `#1a1a1a` — used as the dominant background and surface color across the dark UI.
- **Accent:** Bright green `#22c55e` — used for positive states, highlights, badges, and branded call-to-action signals. Also expressed as `#00c758` and `#32a871` in softer variants.
- **Secondary accent:** Electric blue `#3080ff` / `#00a3ff` / `#00b2ff` — used for links, interactive highlights, and gradient effects.
- **Backgrounds:**
  - Page background: `#1a1a1a` (deep dark near-black)
  - Elevated surfaces / cards: `#2a2a2a` to `#3e3e3e`
  - Nav card hover: `#373737`
  - Overlays: `#000000b3` (dark semi-transparent), `black/60` via Tailwind
  - Subtle success tint: `#22ff991c` (very faint green wash)
- **Text colors:**
  - Primary text: white or near-white (assumed, on dark backgrounds)
  - Muted text: `#4b4b4b` to `#3e3e3e` range (assumed for secondary labels)
  - On-dark inverted: white (assumed)
  - Error/destructive: `#fb2c36` (`--color-red-500`), `#e40014` (`--color-red-600`)
  - Success: `#00c758` (`--color-green-500`), `#22c55e`

---

## Typography

- **Base font (sans):** `Inter` → `var(--font-sans, var(--font-inter))` → `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"` — used for body copy and UI text.
- **Display font:** `ABC Favorit` → `var(--font-display, var(--font-abc-favorit))` — used for headings and prominent marketing text. Falls back to `ui-sans-serif, system-ui, sans-serif`.
- **Editorial/serif accent:** `Domaine` → `var(--font-domaine, var(--font-domaine-src))` — used selectively for editorial or hero display moments (assumed for large pull-quote–style text).
- **Extended sans:** `Univers` → `var(--font-univers, var(--font-univers-src))` — used for specific label or tracking-heavy UI text (assumed).
- **Monospace:** `Commit Mono` → `var(--font-mono, var(--font-commit-mono))` → falls back to `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace` — used in code blocks, API snippets, and inline code.
- **Base size:** Not directly extractable; (assumed) `16px`.
- **Heading scale:**
  - H1: Large display size, set in ABC Favorit or Domaine, (assumed) `48px–80px`, heavy weight, tight letter-spacing.
  - H2: (assumed) `32px–48px`, ABC Favorit, semibold, slightly tracked.
  - H3: (assumed) `20px–28px`, ABC Favorit or Inter, medium–semibold weight.
  - General style: headings are dark-background-optimized — white or near-white, minimal decoration.

---

## Spacing & Radius

- **Base spacing unit:** `4px` (Tailwind default, assumed).
- **Spacing scale (observed values):** `1px, 2px, 4px (base), 6px, 8px (assumed common), 10px, 14px, 16px (assumed), 18px, 24px, 32px (assumed)`.
- **Border radius — common values and usage:**
  - `0px` — flush/square elements, some input resets.
  - `2px–4px` — very subtle rounding on small tags or inline elements.
  - `6px–8px` — standard buttons and input fields.
  - `10px–12px` — cards, panels, dropdowns.
  - `14px–16px` — larger containers, modals (assumed).
  - `20px–32px` — pill-adjacent components, feature badges.
  - `9999px` — fully pill-shaped elements (e.g., status badges, toggle buttons).
  - `160px` — very large decorative or image containers (assumed hero visuals).
  - `64px` — large rounded image frames or avatar containers (assumed).

---

## Shadows & Borders

- **Shadows:**
  - Subtle ambient: `0 -2px 40px #00000010` — used as a soft lift for elevated sections (light upward glow effect).
  - Standard card: `0 0.25rem 1.25rem 0.125rem #0000002e` — mid-depth card shadow.
  - Dark overlay: `20px 20px 20px #0003`, `0 20px 20px #0003` — directional depth for floating panels.
  - Glow effect: `0 0 4rem 0.5rem #ffffff0b, 0 0 1rem 0.375rem #ffffff03` — subtle white inner glow on dark surfaces, used for interactive or highlighted elements.
  - Inset/bevel: complex inset shadows with `#00000040`, `#ffffff1a`, `#ffffff59` — used on button surfaces to simulate depth and glass-like texture.
  - Ring offset: `#fff` (default Tailwind ring offset, assumed for focus rings on light surfaces).
- **Borders:**
  - Hairline inner border: `inset 0 0 0 0.0625rem #ffffff1a` (1px white at 10% opacity) — used on cards and buttons to define edges on dark backgrounds without hard contrast.
  - General: borders are sparse and subtle; the design prefers shadow-based depth over thick visible strokes.

---

## Components

### Buttons

- **Variants:**
  - *Primary:* Dark solid surface with inset bevel shadow and subtle white border glow; likely white text. Used for main CTAs.
  - *Secondary:* Outlined or muted dark surface (assumed), lower visual weight.
  - *Ghost/subtle:* Transparent background, relies on text color and hover state only (assumed).
  - *Destructive:* Red-tinted, using `#fb2c36` / `#e40014` (assumed for dangerous actions).
- **Shape & size:** `border-radius: 6px–10px` for standard buttons; pill shape (`border-radius: 9999px`) for badge-style or toggle buttons. Padding (assumed) `8px 16px` to `10px 20px`. Font weight: medium to semibold.
- **States:**
  - Hover: Background color shifts (e.g., nav card hover to `#373737`); inset shadows change intensity.
  - Active: Deeper inset shadow, slightly darker surface.
  - Disabled: Reduced opacity (assumed).
  - Focus: Ring outline using Tailwind ring utilities; offset color `#fff` on dark surfaces.
- **Icon usage:** Icons align inline with text, (assumed) `4px–8px` gap, vertically centered.

### Cards / Panels

- **Layout:** Padding (assumed) `16px–24px`. Border radius `10px–16px`. Elevated cards use the standard card shadow; panels may use inset hairline border (`#ffffff1a`) on dark backgrounds.
- **Content structure:** Typically: icon or label → title → supporting text → optional action link or button. Compact, left-aligned hierarchy.
- **Variants:**
  - *Elevated:* Dark surface (`#2a2a2a`–`#3e3e3e`) with box shadow.
  - *Outlined:* Hairline white inner glow border on dark background.
  - *Minimal:* Flat section with no shadow, separated by spacing alone.
- **Accordion/Collapsible panels:** Height driven by CSS custom property `--accordion-panel-height` / `--collapsible-panel-height`; rotation states (0° and 90°) used for chevron/icon indicators.

### Forms & Inputs

- **Input style:** Background transparent or dark-tinted; `border-radius: 0` reset at base, then overridden to ~`6px–8px` for styled inputs (assumed). Borders: subtle `1px` lines, likely `#3e3e3e` or white at low opacity on dark surfaces.
- **Labels:** Top-placement, small size, muted color (assumed).
- **Validation:**
  - Error: `#fb2c36` (`--color-red-500`) — border tint and/or helper text.
  - Success: `#00c758` / `#22c55e` — green indicator.
- **Buttons in forms:** Visually match standalone primary buttons; typically full-width or right-aligned within the form container (assumed).
- **Text areas:** `resize: vertical` only.
- **User-select:** `select-none` used on non-interactive labels; `select-all` on code/token fields for easy copying.

### Navigation

- **Header:** Sticky (`position: sticky; top: 0`), `z-index: 40`. On scroll, a frosted-glass backdrop appears: `backdrop-blur-md` with `bg-black/60` and a texture overlay (`/static/texture-btn.png`). Before/after pseudo-elements handle blur and mask effects for a polished blended edge.
- **Height:** (assumed) `56px–64px`.
- **Background:** Transparent or very dark at rest; transitions to blurred dark (`black/60` + backdrop blur) when scrolled. Transitions are `200ms ease-in-out`.
- **Nav items:** Set in Inter or ABC Favorit; medium weight; white or near-white text; hover states use background fills (e.g., `#373737` for nav card hover). Spacing between items (assumed) `16px–24px`.
- **Mobile behavior:** (assumed) hamburger icon triggering a full-screen or slide-in overlay menu; consistent with the dark glass aesthetic.

---

## Layout Conventions

- **Breakpoints (assumed, Tailwind defaults):**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px
- **Grids:** Tailwind grid and flex utilities throughout. Feature sections use 2–4 column grids collapsing to single column on mobile. Cards are laid out in flex-wrap or CSS grid with consistent gaps.
- **Sections:** Clearly delineated by large vertical padding (assumed `64px–120px` between sections). Alternating visual weight via background shade differences. Content max-width constrained (assumed `1200px–1440px`) and centered.

---

## Usage Notes

**To "sound like" Resend in UI copy:**
- Be direct and developer-friendly — short, confident labels. Prefer "Send your first email" over "Get started with our platform today."
- Use technical precision without jargon overload; copy respects the reader's intelligence.
- Action labels are imperative and brief: "Deploy", "Copy", "View docs", "Try it free."

**To "feel like" Resend visually when designing new components:**
- Default to dark backgrounds (`#1a1a1a`–`#2a2a2a`) with white or very light text; use bright green and electric blue only as punctuation, not fill colors.
- Embrace subtle texture, frosted glass, and inset glow effects over flat design — surfaces should feel slightly physical without being skeuomorphic.
- Keep spacing generous and typography hierarchically clean; let whitespace (dark space) do the heavy lifting rather than decorative elements.