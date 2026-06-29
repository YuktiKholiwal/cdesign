# Design Spec – tailwindcss.com

## Brand & Layout
- Overall feel: Clean, technical, and developer-focused with a minimal aesthetic. The UI is confident and precise, using tight typographic control, subtle transparency effects, and careful dark-mode support throughout.
- Layout: Content is organized in structured sections with sidebars (for documentation navigation), cards, and multi-column grids. Headers are fixed or sticky. Ample whitespace and a strong grid underpin every view.

## Colors
- Primary: Sky/Blue — `#316ff6` — used for interactive highlights, links, and key CTA accents.
- Accent: Cyan — `#00d2efff` — used sparingly as a secondary highlight or decorative accent.
- Backgrounds:
  - Page background (light): near-white, approximately `#f9fafb` (inferred from `#f9fafbe6` with opacity).
  - Page background (dark): deep near-black — `#0f1116` (dark mode base) and `#1b1b1c` (slightly elevated surfaces).
  - Subtle overlay / tinted panel: `#0307120d` (very light tinted glass in light mode), `#ffffff1a` (faint white glass in dark mode).
  - Code/mono block backgrounds: `#00000006` to `#0000000d` (near-invisible tint on light backgrounds).
- Text colors:
  - Main text (dark mode): `#ffffff` / white family.
  - Main text (light mode): `#000c` / `#000000d9` — very dark near-black with slight transparency.
  - Muted text: `#00000080` (50% opacity black in light), `#99a1af` family (assumed muted gray).
  - Inverted/on-dark: white or white at reduced opacity (`#ffffff1a` backgrounds, full white text).

## Typography
- Base font: `Inter, system-ui, sans-serif` (via `--font-inter`).
- Base size: Not directly observable — **(assumed) 16px**.
- Heading scale:
  - H1: **(assumed)** Large, bold, tight tracking — likely 36–48px, font-weight 700–800.
  - H2: **(assumed)** 24–32px, font-weight 700, moderate letter spacing.
  - H3: **(assumed)** 18–22px, font-weight 600, normal spacing.
  - General style: Headings are set in Inter with strong weight contrast against body text; no decorative serifs in headings.
- Monospace / special fonts:
  - `IBM Plex Mono` (`--font-plex-mono`) — used for code blocks and inline code samples.
  - `Ubuntu Mono` (`--font-ubuntu-mono`) — used in select code/terminal preview contexts.
  - `Source Sans Pro` (`--font-source-sans-pro`) — used in certain demo/example panels.
  - `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas` — system monospace fallback stack for code.
  - A serif stack (`--font-serif`) is present but used only in specific demonstration content **(assumed)**.

## Spacing & Radius
- Base spacing unit: **4px** (Tailwind's default `1 = 4px` scale).
- Spacing scale: 4px, 8px, 12px, 16px, 24px, 32px — standard Tailwind scale; 32px confirmed in tokens.
- Border radius:
  - `2px` — micro rounding, e.g., inline badges or tiny chips.
  - `4px` — inputs, small buttons.
  - `6px–8px` — standard buttons, form controls, small cards.
  - `12px–16px` — larger cards and panels.
  - `24px` — pill-adjacent buttons (e.g., the version selector button uses `rounded-2xl` = 16px).
  - `9999px` — full pill shape for tags, badges, and certain toggle controls.

## Shadows & Borders
- Shadows: Tailwind's standard shadow scale is available (`shadow-sm` through `shadow-2xl`). Cards and elevated panels use light to medium shadows (`shadow-sm` or `shadow-md`); heavy shadows are uncommon — the aesthetic favors subtle depth **(assumed from typical tailwindcss.com style)**.
- Borders: Typically 1px solid borders at low opacity (e.g., `#6a728240` or `#99a1af1a`) for panel outlines and dividers. Borders are understated — color-tinted and semi-transparent rather than solid gray. Dark mode borders shift to white at low opacity.

## Components

### Buttons
- Variants:
  - **Primary**: Solid fill (likely sky-blue or brand blue), white text, medium border radius.
  - **Secondary / Subtle**: Translucent background — `gray-950/5` in light, `white/10` in dark — with matching text color. Seen in the version selector snippet.
  - **Ghost / Icon**: Icon-only or paired icon+text with no background unless hovered.
  - **Destructive**: Red scale present (`--color-red-500: #fb2c36`) **(assumed)** for danger actions.
- Shape & size: Rounded corners (typically `rounded-lg` to `rounded-2xl`). Small buttons use `py-0.5 px-2.5` (2px / 10px); standard buttons **(assumed)** use approximately `py-2 px-4`. Font weight is `medium` (500).
- States:
  - Hover: background opacity increases (e.g., `gray-950/5` → `gray-950/7.5`; `white/10` → `white/12.5`).
  - Active (`data-active`): same style as hover — no further color change, just persistence.
  - Focus: ring-based focus indicator (Tailwind ring utilities), offset white `#fff`.
  - Disabled: **(assumed)** reduced opacity.
- Icon usage: Icons sit inline with text using `gap-0.5` (2px) to `gap-1` (4px), vertically centered via flex. Icon fills use muted color (e.g., `fill-gray-400`).

### Cards / Panels
- Layout: **(assumed)** Padding of `16px–24px`, border radius of `12px–16px`, light shadow or subtle border. Built with flex or grid internally.
- Content structure: **(assumed)** Title (semibold), optional subtitle or meta in muted text, body content, optional action row at bottom.
- Variants:
  - **Elevated**: white background with soft shadow (light mode); dark surface `#1b1b1c` with subtle border (dark mode).
  - **Outlined**: 1px semi-transparent border, no shadow.
  - **Minimal/glass**: near-transparent background tint (`#0307120d`), used for inline panels and overlays.

### Forms & Inputs
- Input style: **(assumed)** 1px border, `rounded-md` (6–8px radius), light background, `py-2 px-3` padding. Borders are low-contrast in rest state, more defined on focus.
- Labels: **(assumed)** top-placed, small text, medium weight, in muted color.
- Validation: Red scale (`#fb2c36` / `--color-red-500`) for error states; **(assumed)** green for success.
- Buttons in forms: Visually consistent with standalone buttons; primary submit buttons use filled style. `field-sizing: content` is available for auto-sizing textareas.

### Navigation
- Header: **(assumed)** Fixed or sticky at top; dark (`#0f1116`) or blurred glass background in dark mode, white/translucent in light mode. Moderate height (~56–64px assumed).
- Nav items: Set in Inter, medium weight, muted text color at rest, full-opacity or accent-colored on hover/active. Spacing between items is generous (likely `gap-6` or `gap-8`).
- Mobile behavior: **(assumed)** Hamburger menu collapses nav links into an overlay or slide-in drawer at small breakpoints.

## Layout Conventions
- Breakpoints: Tailwind's standard — `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px **(directly inferred from Tailwind usage)**.
- Grids: CSS Grid and Flexbox used throughout. Documentation uses a sidebar (nav) + main content two-column layout. Marketing/landing sections use responsive multi-column card grids (2–3 columns on desktop, single column on mobile).
- Sections: Clearly delineated page sections with vertical padding of **(assumed)** `64px–96px`. Section boundaries use background color changes or subtle dividers rather than heavy visual separators.

## Usage Notes
- **UI copy tone**: Be direct and technical without being terse. Use concise, developer-friendly language. Avoid marketing fluff — prefer "Build fast" over "Revolutionize your workflow."
- **UI copy precision**: Prefer specific labels (e.g., "Copy class names", "View source") over generic ones ("Click here", "Learn more").
- **Visual feel**: Use semi-transparent backgrounds and low-opacity borders instead of solid fills for secondary surfaces. Let whitespace do the heavy lifting — avoid decorative elements that don't carry information.
- **Dark mode parity**: Every component should have a first-class dark mode treatment. Use opacity-based color variants (e.g., `white/10`) rather than hardcoded dark grays for overlays.
- **Consistency with Tailwind's own scale**: Stick to the 4px base grid, use the defined border-radius steps, and prefer system/Inter type over decorative fonts for all UI chrome.