# Design Spec – Vercel (vercel.com)

## Brand & Layout
- Overall feel: Stark, geometric, and developer-focused — pure black-and-white monochrome with extreme contrast and confident negative space. Minimal to the point of austere.
- Layout: Centered max-width content, generous whitespace, crisp 1px dividing lines, and tidy grids of feature cards.

## Colors
- Primary: Pure Black `#000000` — primary surfaces and text.
- Accent: Pure White `#FFFFFF` — inverted surfaces, primary button fills on dark.
- Backgrounds: White `#FFFFFF` content; near-black `#0A0A0A` for dark sections.
- Text colors: Black `#000000` / gray `#666666` for secondary; inverted white on dark.

## Typography
- Base font: `"Geist", -apple-system, "SF Pro", "Segoe UI", sans-serif`.
- Base size: 16px.
- Heading scale: H1 ~64px / weight 600 with tight `-0.04em` tracking, H2 ~40px, H3 ~24px. Very tight display tracking.
- Other: `"Geist Mono"` for code, CLI snippets, and metrics.

## Spacing & Radius
- Base spacing unit: 4px.
- Spacing scale: 4, 8, 16, 24, 32, 48, 64, 96, 128px.
- Border radius: 6–8px on buttons/inputs, 12px on cards. Some elements fully square for a sharper feel.

## Shadows & Borders
- Shadows: Minimal — flat design relies on 1px borders over elevation. Occasional `0 4px 12px rgba(0,0,0,0.08)` on hover.
- Borders: 1px solid `#EAEAEA` (light) / `#333333` (dark) define nearly every surface boundary.

## Components

### Buttons
- Variants: primary (black fill, white text — inverts to white fill on dark), secondary (white fill, black text, 1px border).
- Shape & size: ~10px vertical / 16px horizontal padding, 8px radius, weight 500.
- States: hover inverts or shifts to ~80% lightness; focus shows a 1px offset ring; disabled ~40% opacity.
- Icon usage: leading/trailing 16px monochrome icons, 8px gap.

### Cards / Panels
- Layout: 24–32px padding, 12px radius, 1px border, no shadow at rest.
- Content structure: title, description, optional code block or metric; arranged in 2–4 column grids.
- Variants: bordered (default), inverted (dark fill), bare.

### Forms & Inputs
- Input style: white background, 1px `#EAEAEA` border, 8px radius, 10px padding, black text.
- Labels: top-aligned, small, medium weight, black.
- Validation: red `#EE0000` border + helper text for errors.
- Buttons in forms: black primary, often full-width.

### Navigation
- Header: sticky, white (or translucent) with a 1px bottom border, ~64px tall.
- Nav items: 14px gray links, ~24px gap, black on hover; triangle logo at left, CTA pair at right.
- Mobile behavior: hamburger overlay (assumed).

## Layout Conventions
- Breakpoints: ~640 / 768 / 1024 / 1280px; multi-column grids collapse below 768px.
- Grids: CSS grid for feature cards; flex for nav and button rows. Strong reliance on alignment lines.
- Sections: 96–128px vertical padding; alternating white / near-black bands.

## Usage Notes
- Sound like this brand: confident, technical, terse. Let the product and metrics speak.
- Feel like this site: monochrome, maximal whitespace, hairline borders instead of shadows, tight geometric type, sharp contrast.
