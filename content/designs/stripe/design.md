# Design Spec – Stripe (stripe.com)

## Brand & Layout
- Overall feel: Clean, technical, and polished — projects trustworthiness through tight spacing, restrained color, and refined typography. Confident but never loud.
- Layout: Full-width, section-based structure with centered containers, bento-style grids, and a 12-column grid underlying most areas. Generous vertical rhythm between sections.

## Colors
- Primary: Deep Navy `#0A2540` — primary text on light backgrounds and dark section fills.
- Accent: Brand Purple `#635BFF` — interactive highlights, links, and gradients.
- Backgrounds: White `#FFFFFF` for content, soft gray `#F6F9FC` for alternating sections.
- Text colors: Navy `#0A2540` for headings, slate `#425466` for body, muted `#697386` for secondary text; white on dark sections.

## Typography
- Base font: `"Söhne", -apple-system, "Helvetica Neue", Arial, sans-serif` (system-ui fallback acceptable).
- Base size: 16px.
- Heading scale: H1 ~48–56px / weight 600, H2 ~32px, H3 ~22px. Tight letter-spacing on large headings; line-height ~1.1 for display, ~1.5 for body.
- Other: Monospace (`Menlo`/`ui-monospace`) used for code samples and API snippets.

## Spacing & Radius
- Base spacing unit: 4px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px.
- Border radius: 8px on buttons and inputs, 16px on cards/panels, pill (`9999px`) on tags and small badges.

## Shadows & Borders
- Shadows: Soft, low-opacity elevation — e.g. `0 15px 35px rgba(0,0,0,0.1)` on raised cards; subtle `0 2px 5px rgba(0,0,0,0.08)` on buttons.
- Borders: 1px hairline borders in `#E3E8EE` on inputs and outlined cards.

## Components

### Buttons
- Variants: primary (purple fill, white text), secondary (white fill, navy text, hairline border), subtle/ghost (text-only with purple label).
- Shape & size: ~10–12px vertical / 16–20px horizontal padding, 8px radius, weight 500–600.
- States: hover lightens/raises slightly with a soft shadow; focus shows a 2px purple ring; disabled drops to ~60% opacity.
- Icon usage: trailing chevron on "learn more" style links, 8px gap, vertically centered.

### Cards / Panels
- Layout: 24–32px padding, 16px radius, soft shadow or hairline border (rarely both).
- Content structure: eyebrow label, title, supporting copy, and an optional link/CTA.
- Variants: elevated (shadow on white), outlined (hairline on gray), minimal (no chrome).

### Forms & Inputs
- Input style: white background, 1px `#E3E8EE` border, 8px radius, 10–12px padding.
- Labels: top-aligned, small, medium weight, slate color.
- Validation: red `#DF1B41` borders + helper text for errors.
- Buttons in forms: full-width primary on compact forms; matches standalone primary styling.

### Navigation
- Header: sticky, translucent white with blur, ~64px tall, hairline bottom border on scroll.
- Nav items: 15px medium-weight slate links, ~24px gap, purple on hover; primary CTA button right-aligned.
- Mobile behavior: collapses to a hamburger overlay (assumed) with full-height menu.

## Layout Conventions
- Breakpoints: ~640 / 768 / 1024 / 1280px; multi-column grids collapse to single column below 768px.
- Grids: CSS grid for bento feature layouts and 3-up card rows; flex for nav and button groups.
- Sections: alternating white / `#F6F9FC` bands with 64–96px vertical padding.

## Usage Notes
- Sound like this brand: precise, developer-credible, reassuring. Lead with capability, avoid hype.
- Feel like this site: lots of whitespace, one confident accent, crisp type, gradients used sparingly as punctuation rather than decoration.
