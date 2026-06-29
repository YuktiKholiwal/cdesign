# Design Spec – Arc (arc.net)

## Brand & Layout
- Overall feel: Arc presents a polished, modern product aesthetic with a warm-cool color tension — a vivid coral/red primary palette offset by soft lavender and indigo accents. The feel is confident and slightly playful, aimed at a technical but design-conscious audience.
- Layout: The site uses card-based layouts with clear vertical section rhythm, centered content columns, and a combination of CSS Flexbox/Grid for component arrangement. No external CSS framework is used; styles are bespoke and component-scoped.

---

## Colors

- **Primary – Coral Red:** `#FA4531` (approx `rgb(250,69,49)` = `--colors-primary6`). Used for key CTAs, highlights, and brand accents. The full primary scale runs from near-white blush (`rgb(255,234,231)`) to near-black deep red (`rgb(9,2,1)`).
- **Accent – Indigo/Lavender:** `#2702C2` (deep indigo) and `#c6c8f9` (soft lavender). Used for interactive elements, icon backgrounds, link highlights, and decorative card fills.
- **Accent – Teal/Cyan (secondary scale):** `rgb(0,234,231)` through `rgb(0,2,1)` via `--colors-secondary*`. Likely used sparingly for secondary status indicators or supplementary highlights.
- **Backgrounds:**
  - Page/section background: `#ffffff` (white) and `#FFFCEA` / `#FFFADD` (warm cream-yellow), used for highlighted or featured sections.
  - Subtle tinted background: `rgb(224,224,247)` (light lavender), used behind cards or panels.
- **Text colors:**
  - Main body text: `rgba(0,0,0,0.85)` — near-black with slight transparency for softness.
  - Muted/secondary text: `rgba(0,0,0,0.65)` and `rgb(105,105,105)` / `#6A6A6A`.
  - Inverted (on dark): `#ffffff` / `rgba(255,255,255,1)`.
  - Emphasis/link: `#2702C2` (deep indigo), `rgba(23,3,148,0.5)` (muted indigo for states).

---

## Typography

- **Base font:** `var(--fonts-sans)` / `var(--font-sans)` → resolves to `-apple-system, BlinkMacSystemFont, sans-serif`. In practice, the site likely uses a custom sans-serif loaded via `--fonts-body` or `--fonts-softSans` (assumed to be a humanist grotesque such as Inter or a proprietary face).
- **Base size:** Not directly extracted; (assumed) `16px`.
- **Heading scale:**
  - H1: `30px`, bold weight, tight letter-spacing (assumed).
  - H2: `28px`, bold weight.
  - H3: `20px`, semi-bold or bold.
  - H4: `16px`, medium or semi-bold, likely matching body size but differentiated by weight.
- **Special fonts:**
  - `--fonts-exposure`: (assumed) a display/editorial typeface used in hero headlines.
  - `--fonts-oracle`: (assumed) a stylized or serif-adjacent face for pull quotes or feature callouts.
  - `--fonts-referralSans`: (assumed) a variant sans used in referral/marketing modules.
  - `--fonts-mono` / `Monaco`: Monospace, used in code snippets, keyboard shortcut indicators, or developer-facing UI.

---

## Spacing & Radius

- **Base spacing unit:** `4px`.
- **Spacing scale:** `4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 32, 36, 40, 48, 60, 64, 72, 80, 100, 128, 150px`. Key practical steps are `8, 12, 16, 24, 32, 48, 64px` for padding and gaps; larger values (`80–150px`) used for section vertical spacing.
- **Border radius:**
  - `4px`: Small elements — tags, badges, small inputs.
  - `8px`: Cards, icon containers, standard buttons (confirmed on card component).
  - `10px`: Medium panels or modals (assumed).
  - `16px`: Large cards or feature panels.
  - `22px`: Pill-shaped buttons or heavily rounded containers.

---

## Shadows & Borders

- **Shadows:**
  - Subtle lift (default cards/inputs): `0 2px 2px rgba(0,0,0,0.1)` — very light, barely perceptible.
  - Soft card elevation: `0 2px 5px rgba(0,0,0,0.2)` — used on icon cards and small panels.
  - Medium elevation: `0px 2px 8px 0px rgba(0,0,0,0.25)` — modals or hover-state cards.
  - Floating panels: `0 7px 15px rgba(0,0,0,0.2)` — dropdowns or overlays.
  - All shadows are short-range (small Y offsets, moderate blur), giving a crisp, grounded feel rather than heavy diffusion.
- **Borders:**
  - Cards use `4px solid #fff` (white border inside a shadow) to create a lifted, layered effect — confirmed on `.c-iRWeVN` icon card.
  - (Assumed) Subtle `1px solid` dividers in `rgba(0,0,0,0.1)` for internal section separators.
  - Focus rings: `2px solid var(--colors-gray7)` with `outline-offset: 2px` — clean, accessible, no glow.

---

## Components

### Buttons

- **Variants:** (assumed based on palette) Primary (coral red fill), Secondary (indigo or lavender fill/outline), Ghost/subtle (transparent background, border or text only), Destructive (red, using primary scale).
- **Shape & size:** Reset base — no default border, no background, zero padding/margin. Styled variants add padding (assumed `8–16px` vertical, `16–24px` horizontal), `border-radius` likely `8px` or `22px` for pill shapes. Font weight bold or semi-bold. Font family inherits `--font-sans`.
- **States:**
  - **Focus:** `2px solid` gray outline with `2px` offset — no box-shadow glow, keyboard accessible.
  - **Hover/Active:** (assumed) slight darkening or scale transform; primary buttons likely shift one step down the primary color scale.
  - **Disabled:** (assumed) reduced opacity (~40–50%), cursor `not-allowed`.
- **Icon usage:** Navigation menu button uses a 24×24 SVG icon with `stroke-width: 2` and `stroke-linecap: round`. Icons sit inline; (assumed) icon-only buttons use `aria-label` for accessibility.

### Cards / Panels

- **Layout:** Confirmed icon card: `53×53px`, `border-radius: 8px`, `4px solid #fff` border, `box-shadow: 0 2px 5px rgba(0,0,0,0.2)`, centered content, `background: #c6c8f9` (lavender). Larger content cards (assumed) use `16px` radius, `16–24px` padding, soft shadow.
- **Content structure:** Icon or image at top/center, followed by title (bold), optional subtitle or description in muted color, optional action link or button at bottom.
- **Variants:**
  - **Elevated:** White background + shadow — primary card style.
  - **Tinted:** Lavender (`#c6c8f9` or `rgb(224,224,247)`) or cream (`#FFFCEA`) backgrounds for feature or callout cards.
  - **Outlined:** (assumed) `1px` border with minimal shadow for lower-emphasis panels.

### Forms & Inputs

- **Input style:** Base reset — `background: none`, `border: 0`, zero margin/padding. Visual styling (assumed) is layered on top via component classes: likely a `1px` bottom border or full border in a light gray, with `border-radius: 4–8px`. Clean, minimal, borderline editorial in style.
- **Labels:** (assumed) top-aligned, small text, muted color (`rgba(0,0,0,0.65)`), with modest bottom margin before the input.
- **Validation:** Error color `#E84B58` (vivid red-pink) and `#9f484d` (muted dark red) for error text. Success state (assumed) uses a teal from the secondary scale. Warning uses amber `#F0B167` / `#E39A44`.
- **Buttons in forms:** Inherit the same base button reset; (assumed) primary submit buttons match standalone primary CTA style — same radius, same coral red, same font weight.

### Navigation

- **Header:** (assumed) fixed or sticky at top; light background (white or semi-transparent). The hamburger/mobile menu button is rendered as a bare `<button>` with an SVG icon (three horizontal strokes, 24×24), no visible border or background.
- **Nav items:** (assumed) sans-serif, medium weight (~500), spaced with `16–24px` horizontal gaps. Active or hover state likely uses the primary coral or indigo underline/color shift.
- **Mobile behavior:** Hamburger icon confirmed (`aria-label="Open navigation menu"`). (assumed) tapping opens a full-width overlay or slide-in drawer with vertically stacked nav links.

---

## Layout Conventions

- **Breakpoints:** (assumed) standard: small ~`480px`, medium ~`768px`, large ~`1024px`, xl ~`1280px`.
- **Grids:** Cards and feature sections use CSS Grid or Flexbox with wrapping, `gap` values drawn from the spacing scale (`16–32px`). Multi-column layouts (assumed 2–3 columns on desktop, single column on mobile).
- **Sections:** Generous vertical rhythm between page sections — estimated `60–100px` top/bottom padding per section. Hero sections likely use `128–150px` vertical space. Inner section gaps typically `48–64px`.

---

## Usage Notes

- **How to "sound like" this brand in UI copy:**
  - Write directly and confidently — short sentences, no filler words, product-forward language.
  - Use second-person ("your browser," "you control") to feel personal and empowering.
  - Avoid jargon overload; speak to a design-savvy technical user who appreciates wit but not hype.

- **How to "feel like" this site visually when designing new components:**
  - Lead with white space and restraint — let elements breathe; never crowd the layout.
  - Use the coral-red primary for a single, unmistakable action per screen; use lavender/indigo for everything supportive.
  - Keep shadows short and grounded (never large diffuse glows); use white borders over shadows on colored cards to create a clean, layered depth effect.