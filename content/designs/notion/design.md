# Design Spec – Notion (www.notion.so)

## Brand & Layout
- Overall feel: Clean, minimal, and modern with a warm off-white palette. The design feels calm and professional yet approachable, leaning on subtle neutrals rather than saturated colors. Typography-driven hero sections give the site a confident, editorial quality.
- Layout: Full-width sections stack vertically with generous vertical spacing. Cards, compact content tiles, and icon+text pairings appear in flexbox rows and wrapping grid layouts. Content is center-aligned on hero sections; card grids shift from horizontal rows to wrapped columns at smaller breakpoints.

---

## Colors

- **Primary:** Near-black `#191918` (`--color-gray-900`) — used for primary text and high-emphasis headings
- **Accent:** Red `#f64932` (`--color-red-500`) — used for primary interactive accents and call-to-action highlights; lighter tint `#fef3f1` (`--color-red-100`) for backgrounds on red-accented elements
- **Backgrounds:**
  - Page background: `#f9f9f8` (`--color-gray-100`) — primary off-white/warm light background
  - Secondary surface: `#f6f5f4` (`--color-gray-200`) — used for cards, panels, and subtle section separations
  - Mid-surface / dividers: `#dfdcd9` (`--color-gray-300`) — borders and separators between sections or components
- **Text colors:**
  - Default text: `rgb(4 4 4)` (`--text-color-regular`) — near-black, used for body copy
  - Dark text: `rgb(17 17 17)` (`--text-color-dark`) — headings and high-emphasis labels
  - Medium text: `rgba(0,0,0,0.60)` (`--text-color-medium`) — secondary/supporting text
  - Light text: `rgba(0,0,0,0.40)` (`--text-color-light`) — de-emphasized captions, placeholders
  - Extra-light text: `rgba(0,0,0,0.20)` (`--text-color-extra-light`) — very subtle labels, disabled states
- **Borders:** `rgba(0,0,0,0.08)` (`--border-color-regular`) — light 8% black overlay used for all standard dividers and borders

---

## Typography

- **Base font:** Custom sans-serif loaded as `--font-family-sans`; falls back to system `sans-serif`. Monospace is available as a secondary stack (`monospace`) for code-adjacent UI.
- **Base size:** 16px
- **Heading scale:**
  - H1: 32px, heavy weight, tight tracking — used for hero "big statement" titles (e.g., "Meet the night shift.")
  - H2–H6: Not directly extracted; (assumed) progressively smaller, semibold to bold weights in the same sans-serif, with moderate line-height
  - Headings generally use `--text-color-dark` and feel editorial — sparse punctuation, sentence case or title case
- **Body text:** Uses a `--typography-sans-100-medium-font` token for UI labels and navigation items — indicating a medium-weight small sans at roughly 14–16px
- **Letter spacing:** Controlled via `--typography-sans-100-medium-letter-spacing` — (assumed) near-zero or very slightly tracked for small UI labels
- **Monospace:** Available for code blocks or technical content; not prominently featured in marketing UI

---

## Spacing & Radius

- **Base spacing unit:** 4px (inferred from the scale starting at 2, 4, 6…)
- **Spacing scale:** 2px, 4px, 6px, 10px, 11px, 12px, 14px, 16px, 20px, 40px — used for gaps, padding, and margin across components. Key practical values: 16px (standard component padding), 24–28px (hero element gaps), 40px (section-level spacing)
- **Border radius:** No explicit pixel values extracted from tokens. (Assumed) Notion uses small-to-medium radii — approximately 4–8px for inputs and cards, and larger pill radii (20px+) for primary CTA buttons, consistent with common Notion UI patterns.

---

## Shadows & Borders

- **Shadows:** Referenced via a utility token (`utility:shadow`); no raw values extracted. (Assumed) Shadows are subtle — low-opacity, soft-blurred drop shadows (e.g., `0 2px 8px rgba(0,0,0,0.08)`) consistent with the overall minimal, flat-leaning aesthetic. Cards are more likely to use borders than heavy shadows.
- **Borders:** Standard dividers and component outlines use `rgba(0,0,0,0.08)` — a very light 1px border. This keeps separators barely visible, reinforcing the clean, breathable aesthetic. Thicker or more saturated borders are not evident in the data.

---

## Components

### Buttons

- **Variants:**
  - *Primary:* (assumed) Solid fill using `--color-red-500` (`#f64932`) or near-black `--color-gray-900`, white label — used for main CTAs ("Get Notion free", etc.)
  - *Secondary:* (assumed) Outlined or lightly filled using gray tones — for less prominent actions
  - *Ghost/Subtle:* (assumed) Transparent background with text label — used in navigation and inline actions
  - *Destructive:* Red scale available (`--color-red-600` / `--color-red-700`) for destructive confirmations
- **Shape & size:** (assumed) Pill or high-radius rectangle shape; medium padding (~10–16px vertical, 20–24px horizontal); medium-weight label text (~14–15px)
- **States:**
  - Hover: (assumed) darkened fill or slightly elevated appearance
  - Focus: Focus ring using `--color-interaction-focus-ring` with a fade-in transition — visible outline, accessible
  - Disabled: Cursor changes to `default`; reduced opacity (assumed)
  - Active: (assumed) slightly pressed/darkened
- **Icon usage:** Icons appear alongside button/nav labels; (assumed) inline at ~16–20px, vertically centered, with ~6–8px gap between icon and text. Chevrons in nav dropdowns use a small SVG at 10px width.

---

### Cards / Panels

- **Layout:** Compact card pattern observed (`cardCompact`). Cards use flexbox row layout on large screens, wrapping to a column on smaller viewports. Internal gap of ~16px between elements. (assumed) Padding of ~16–20px inside the card surface.
- **Content structure:** Typical children include a graphic/icon element, a title (linked anchor), optional subtitle or descriptor. Icon size scales responsively (28px default → 40px at `md` breakpoint).
- **Variants:**
  - *Compact card:* Icon + text side-by-side; minimal visual border; suitable for feature lists and use-case grids
  - *Elevated:* (assumed) Slightly raised with subtle shadow for feature highlight panels
  - *Outlined:* (assumed) 1px `rgba(0,0,0,0.08)` border on a `--color-gray-200` background

---

### Forms & Inputs

- **Input style:** (assumed) Rounded rectangle inputs; 1px border using `--border-color-regular`; background `--color-gray-100` or white; standard padding (~10–12px vertical, 14–16px horizontal); no underline-only style evident
- **Labels:** (assumed) Top-aligned labels in medium-weight sans-serif, ~14px, `--text-color-medium` color
- **Validation:** Error states would use the red scale — `--color-red-500` for border highlight, `--color-red-100` for background tint, `--color-red-600`/`700` for error message text (assumed)
- **Buttons in forms:** Visually consistent with standalone primary buttons; (assumed) full-width within narrow form containers, standard pill/rounded shape

---

### Navigation

- **Header:** (assumed) Fixed or sticky at top; white or `--color-gray-100` background; thin bottom border using `--border-color-regular`; no heavy shadow
- **Nav items:** Rendered with `--typography-sans-100-medium-font` — medium-weight, ~14px sans-serif. Spacing between nav items uses the standard spacing scale (~16–20px gaps). Dropdown triggers include a small chevron SVG (10px) to the right of the label.
- **Dropdowns:** `aria-haspopup` / `aria-expanded` pattern; (assumed) open as a floating panel below the trigger with a subtle shadow and `--color-gray-100` background
- **Mobile behavior:** (assumed) Collapses into a hamburger/overlay menu; nav links stacked vertically in a full-width drawer

---

## Layout Conventions

- **Breakpoints:** Inferred from class prefixes: `sm` (≈640px), `md` (≈768px), `lg` (≈1024px). Layout shifts observed: cards move from horizontal rows to wrapped/stacked at `lg`, heading gaps increase from 24px to 28px at `md`.
- **Grids:** Flexbox is the primary layout mechanism — `flex-row`, `flex-wrap`, `gap-*` utility classes. Cards and feature grids wrap naturally. No CSS Grid tokens extracted directly; (assumed) CSS Grid may be used for structured marketing section layouts.
- **Sections:** Hero sections have the largest vertical presence with big H1 typography. Feature/card sections follow with ~40px vertical padding between them (inferred from `40px` in spacing scale). Sections are full-width with content constrained to a centered max-width container (assumed ~1200–1280px max).

---

## Usage Notes

**How to "sound like" Notion in UI copy:**
- Use short, confident, present-tense phrases — "Meet the night shift." not "Introducing our new AI agents"
- Address outcomes, not features — "keep work moving 24/7" rather than "runs automated tasks"
- Casual and human, but never gimmicky — avoid exclamation marks and superlatives

**How to "feel like" Notion visually when designing new components:**
- Stay warm and neutral: prefer `#f9f9f8` and `#f6f5f4` over pure white; use `rgba(0,0,0,0.08)` for any border rather than hard gray lines
- Prioritize typographic hierarchy over decorative elements — let size and weight do the work before reaching for color
- Keep components low-contrast and calm at rest; reserve the red accent (`#f64932`) sparingly for the single most important action on a screen