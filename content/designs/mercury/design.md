# Design Spec – Mercury (mercury.com)

## Brand & Layout
- Overall feel: Clean, modern, and professional — a refined fintech aesthetic that balances trust and approachability. The palette leans cool and understated, with a signature indigo/periwinkle accent providing personality without aggression.
- Layout: Primarily a full-width multi-column grid system (12-column Tailwind grid). Content is organized into card-based layouts, with clear section groupings. Marketing pages use centered content with generous whitespace, while app-like sections use dense card grids.

---

## Colors

- **Primary:** Indigo `#5266eb` — used for primary buttons, active/emphasized surfaces, and interactive highlights. Hover darkens to `#4354c8`, active to `#3442a6`.
- **Accent:** Soft periwinkle/blue-purple range — e.g., `#b4c9f8` and `#c5c1e8` used for decorative highlights and tinted surfaces. Muted gold-brown `#767165` appears as a secondary accent in some contexts.
- **Backgrounds:**
  - Page default: `#fbfcfd` — near-white with a faint cool tint, used as the main page background.
  - Secondary background: `#f4f5f9` — slightly more saturated cool gray, used for section fills or content panels.
  - Elevated surfaces (cards, modals): `#ffffff`.
  - Surface default (cards, chips): `#ededf3` — light gray-purple.
  - Frosted/translucent: `#7073930d` and similar low-opacity variants used for glassmorphism-style overlays.
- **Text colors:**
  - Primary text: `#10101a` — near-black with a cool undertone.
  - Secondary/muted text: `#535461` — dark gray-purple.
  - Subtle/tertiary: `#707393` — muted lavender-gray.
  - Inverted (on dark): `#fbfcfd` / `#fff`.
  - Disabled: `#70707d` (used for disabled button surfaces and text).

---

## Typography

- **Base font:** `arcadia, arcadia Fallback` — a custom sans-serif; fallback to `ui-sans-serif, system-ui, sans-serif`. Referenced via CSS variable `--font-arcadia`.
- **Base size:** Not directly extractable from tokens — (assumed) approximately 16px, following standard Tailwind defaults.
- **Heading scale:**
  - Display/large headings: `arcadiaDisplay` or `tiemposHeadline` families — elegant serif or refined display sans for hero sections.
  - Body headings: `arcadia` (custom sans-serif), likely semibold or medium weight.
  - General style: Headings use either the display sans (`arcadiaDisplay`) or the editorial serif (`tiemposHeadline`) depending on context — display serif is used for large hero/marketing headlines, giving a premium editorial feel. Specific sizes not extractable — (assumed) H1 ~40–56px, H2 ~28–36px, H3 ~20–24px.
- **Other:**
  - `tiemposHeadline` and `tiemposHeadline Fallback` — an editorial serif used for marketing display text.
  - `var(--font-ibm-plex-mono)` / `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` — monospace stack used for code snippets, numerical data, or developer-facing content.

---

## Spacing & Radius

- **Base spacing unit:** (assumed) 4px, consistent with Tailwind's default 4px scale.
- **Spacing scale:** Tailwind-based; token values of 1px and 2px appear at the micro level. Common practical values include (assumed from Tailwind + class name hints like `p-gap-md`, `px-s20`): 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px.
- **Border radius:**
  - `2px` — minimal rounding, inputs or subtle elements.
  - `4px` / `6px` — small interactive elements, badges, tags.
  - `8px` — standard card inner elements (e.g., image containers `rounded-lg`).
  - `12px` — card containers (`rounded-xl`).
  - `16px` / `24px` — large panels or modals.
  - `9999px` (`rounded-5xl` / `rounded-full`) — pill buttons and fully rounded controls (e.g., text-variant buttons).
  - `36px` — large rounded decorative containers.

---

## Shadows & Borders

- **Shadows:** Tailwind `shadow` and `shadow-lg` utility classes are present. Cards use moderate box shadows — (assumed) soft, low-opacity dark drop shadows for elevation. The `--surface-elevated: #fff` token suggests elevated components (modals, dropdowns) are visually lifted via shadow rather than color contrast alone.
- **Borders:** Not heavily border-reliant; the design prefers background fill changes over explicit borders for separation. Surface colors (`#ededf3`, `#afb2ce14`) create soft implied borders. Focused elements use `outline-border-focus` (a CSS variable) at `2px` offset for accessibility. (assumed) 1px borders in `#afb2ce` family for subtle dividers.

---

## Components

### Buttons

- **Variants:**
  - **Primary:** Filled with `--surface-primary` (`#5266eb`); white text. Hover `#4354c8`, active `#3442a6`, disabled `#70707d`.
  - **Subtle/Ghost (text variant):** `data-button-variant="text"` — transparent background, uses `--surface-emphasized` fill states (`#5266eb1a` hover, `#5266eb38` active).
  - **Frosted:** Uses `--surface-frosted` variants for translucent context buttons.
  - **Magic:** Same surface as primary (`#5266eb`) — likely differentiated by icon or gradient decoration.
- **Shape & size:** Pill-shaped (`rounded-full` / `rounded-5xl`). Height 40px (`h-40` in Tailwind = 160px — likely this is a custom scale; (assumed) 40px tall). Horizontal padding `px-s20` (approximately 20px). Font via `arcadia-ui-1` — likely a defined UI text style.
- **States:** Smooth `transition-colors duration-300 ease-out`. Focus visible: `outline-2` with `outline-offset-4` using `--border-focus` color. Disabled: text goes to disabled color, cursor becomes `default`. Busy (loading): same style as active, cursor `default`.
- **Icon usage:** (assumed) Icons aligned left or right of label with consistent 8px gap, centered vertically within the button.

---

### Cards / Panels

- **Layout:** Padding uses `p-gap-md` (assumed ~16px). Rounded corners `rounded-xl` (12px). Background `--surface-default` (`#ededf3`) or `--surface-elevated` (`#fff`). Flex column layout with gap based on `gap-gap-md`.
- **Content structure:** Typically image/media at top (16:9 or 3:2 aspect ratio, `rounded-lg` inner rounding), followed by title, optional subtitle/meta text, and optional action/link. A full-card link overlay pattern is used (`#link-overlay` anchor with `z-index` layering).
- **Variants:**
  - Elevated: `--surface-elevated` white, with shadow.
  - Default filled: `--surface-default` (`#ededf3`) muted gray.
  - Transparent/frosted: `--surface-frosted` for overlay contexts.

---

### Forms & Inputs

- **Input style:** (assumed) Rounded corners (~6–8px), background in `--background-secondary` (`#f4f5f9`) or `--surface-default`, no visible heavy border — relies on background fill for input affordance. Placeholder text color uses `--text-default`.
- **Labels:** (assumed) Top-aligned labels, set in `arcadia` sans-serif, small/medium size, muted color.
- **Validation:** (assumed) Success uses green (`#77c599`), error uses a pink-red (`#a4546f`), consistent with the color tokens extracted.
- **Buttons in forms:** Same button system as standalone — primary filled button for submit actions, text/ghost variant for secondary actions like "cancel."

---

### Navigation

- **Header:** (assumed) Fixed or sticky at top, with a frosted/translucent background (`--background-frosted: #70739305`) giving a glass-like effect on scroll. Height (assumed) ~60–72px.
- **Nav items:** Set in `arcadia` UI font. Text-variant buttons used for nav links — transparent background with hover fill `--surface-emphasized-hover`. Spacing via consistent horizontal padding (`px-s20`).
- **Mobile behavior:** (assumed) Collapses to a hamburger/overlay drawer pattern. Radix UI primitives are used (seen in class names with `data-state=open/closed`), suggesting an accessible dropdown or sheet navigation.

---

## Layout Conventions

- **Breakpoints:** Tailwind standard — `sm` (~640px), `lg` (~1024px) are directly referenced in snippets. `md` (~768px) assumed present.
- **Grids:** 12-column CSS grid (`col-span-full`, `lg:col-span-12`, `lg:col-start-3`). Cards arrange in a single column on mobile (`flex-col`), shifting to `flex-row` at `sm`. Multi-card listings use `gap-column-gap-listings` (a custom token gap).
- **Sections:** Marketing pages use large full-width sections with centered 10–12-column content insets. Vertical rhythm relies on Tailwind spacing scale — (assumed) ~64–96px between major sections.

---

## Usage Notes

- **Writing style:** Keep UI copy direct, confident, and low-friction — Mercury speaks to busy founders and operators. Avoid jargon; prefer clarity over cleverness.
- **Tone:** Professional but not cold; warm inflections of editorial typography (the Tiempos serif) suggest that trustworthiness is communicated through quality and restraint, not flashy language.
- **When designing new components:** Default to the cool near-white backgrounds, use `#5266eb` indigo sparingly as a true accent, rely on layered surface grays (`#ededf3`, `#f4f5f9`, `#fff`) for depth, and use pill shapes for interactive controls to maintain the refined, modern feel.
- **Consistency rule:** Prefer background-fill state changes over borders or underlines for hover/active feedback. All transitions should be smooth (`300ms ease-out`) and subtle — nothing abrupt or loud.