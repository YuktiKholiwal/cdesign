# Design Spec – Linear (linear.app)

## Brand & Layout
- Overall feel: Dark, high-contrast, and precise — a fast, keyboard-first product aesthetic. Glassy surfaces, subtle gradients, and exacting alignment.
- Layout: Centered max-width content over a near-black canvas; feature sections with large headings, product screenshots, and tight grids.

## Colors
- Primary: Near-black `#08090A` — page background and deep surfaces.
- Accent: Electric Indigo `#5E6AD2` — primary actions, highlights, and focus.
- Backgrounds: Elevated panels `#15171A`; subtle borders `#23262B`.
- Text colors: Near-white `#F7F8F8` for headings, gray `#8A8F98` for body/secondary.

## Typography
- Base font: `"Inter Variable", Inter, -apple-system, sans-serif`.
- Base size: 16px.
- Heading scale: H1 ~56px / weight 600 with tight `-0.02em` tracking, H2 ~36px, H3 ~20px. Line-height ~1.1 on display.
- Other: Small-caps / uppercase micro-labels (`11–12px`, letter-spacing `0.08em`) for eyebrows and section tags.

## Spacing & Radius
- Base spacing unit: 4px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80px.
- Border radius: 8px on buttons/inputs, 12–16px on cards, 12px on modal/glass panels.

## Shadows & Borders
- Shadows: Deep, diffuse glows on dark — `0 8px 40px rgba(0,0,0,0.5)`; accent glow `0 0 0 1px rgba(94,106,210,0.4)` on focus.
- Borders: 1px hairlines in `#23262B`; frequently 1px translucent white (`rgba(255,255,255,0.08)`) on glass panels.

## Components

### Buttons
- Variants: primary (indigo fill, white text), secondary (translucent white surface, light text), ghost (text-only).
- Shape & size: ~8–10px vertical / 14–16px horizontal padding, 8px radius, weight 500.
- States: hover brightens by ~8%; focus shows an indigo ring/glow; disabled ~40% opacity.
- Icon usage: leading 16px icons common, 6–8px gap.

### Cards / Panels
- Layout: 24px padding, 12–16px radius, hairline border + soft glow rather than hard shadow.
- Content structure: icon, title, one-line description; often arranged in 3-up grids.
- Variants: glass (translucent + blur), solid elevated, minimal outlined.

### Forms & Inputs
- Input style: dark surface `#15171A`, 1px `#23262B` border, 8px radius, light text.
- Labels: small uppercase or sentence-case, gray, above the field.
- Validation: indigo focus ring; red `#EB5757` for errors (assumed).
- Buttons in forms: primary indigo, often full-width on compact forms.

### Navigation
- Header: sticky, translucent dark with blur, ~56px tall, hairline bottom border.
- Nav items: 14px gray links, ~20px gap, brighten to near-white on hover; primary CTA right-aligned.
- Mobile behavior: hamburger overlay menu (assumed).

## Layout Conventions
- Breakpoints: ~640 / 768 / 1024 / 1280px; grids collapse to single column below 768px.
- Grids: CSS grid for feature/card rows; flex for nav and toolbars.
- Sections: generous 64–80px vertical padding, occasional radial/linear gradient backdrops.

## Usage Notes
- Sound like this brand: crisp, fast, opinionated, made-for-builders. Short declarative sentences.
- Feel like this site: dark canvas, one electric accent, glass and glow over flat fills, exacting spacing and alignment.
