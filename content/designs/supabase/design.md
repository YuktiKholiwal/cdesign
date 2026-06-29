# Design Spec – Supabase

## Brand & Layout
- Overall feel: Supabase presents as a modern, developer-focused product with a dark-mode-first aesthetic. The UI is clean and technical, balancing utility with polish — comfortable for engineers but approachable enough for broader audiences.
- Layout: Content is organized in full-width sections with a centered max-width container. Card grids, feature panels, and code-adjacent UI are prominent. Sidebars appear in documentation contexts; marketing pages lean on alternating two-column sections and card grids.

## Colors
- Primary (Brand Green): `hsl(var(--brand-default))` / `hsl(var(--brand-600))` — used for primary CTAs, active states, links, and key highlights. The brand green is Supabase's signature color.
- Accent (Blue): `#79c0ff` / `#3794ff` / `#569cd6` — used in code syntax highlighting and interactive UI accents.
- Accent (Purple): `#bda4ff` — used in code highlighting for certain token types.
- Backgrounds:
  - `#010409` / `#161b22` — deepest dark backgrounds (page base, code blocks)
  - `#1e1e1e` / `#252526` — editor/panel dark backgrounds (VS Code-like code panes)
  - `hsl(var(--background-surface-75))` / `hsl(var(--background-surface-100))` / `hsl(var(--background-surface-200))` — layered surface backgrounds for cards, panels, and modals, progressing from subtle to more prominent
  - `hsl(var(--background-overlay-default))` — modal/overlay backdrops
  - `#fafafa` / `#ffffff` — light-mode backgrounds (assumed secondary support)
- Text colors:
  - Main: `hsl(var(--foreground-default))` — primary readable text, near-white on dark backgrounds
  - Muted: `hsl(var(--foreground-muted))` — secondary/descriptive text
  - Light/Lighter: `hsl(var(--foreground-light))` / `hsl(var(--foreground-lighter))` — tertiary, captions, metadata
  - Code comments: `#8b949e` / `#6e7681` — muted gray used in syntax
  - Error/danger: `#ffa198` / `#f78166` — error state text and syntax

## Typography
- Base font: `Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif` via `var(--font-custom)` — a geometric sans-serif giving a clean, rounded feel
- Monospace font: `Source Code Pro, Office Code Pro, Menlo, monospace` via `var(--font-source-code-pro)` — used throughout code blocks, SQL snippets, and terminal-style UI
- Secondary sans stack (UI internals): `ui-sans-serif, system-ui, sans-serif` with emoji fallbacks via Tailwind default
- Base size: Not directly observed in tokens; (assumed) `16px` based on web convention and Tailwind defaults
- Heading scale:
  - Specific pixel values not extracted; (assumed) H1 ~48–60px, bold weight, tight tracking
  - H2 ~32–40px, semibold, used for section headings
  - H3 ~22–28px, medium-to-semibold, used for card titles and feature callouts
  - General style: geometric, relatively tight letter-spacing, mostly white/near-white on dark backgrounds
- Other: `Ubuntu, Droid Sans, -apple-system, BlinkMacSystemFont, sans-serif` appears in embedded editor/code-hike components. Monospace fonts are prominent throughout, reinforcing the developer identity.

## Spacing & Radius
- Base spacing unit: `4px` (Tailwind default `--spacing` unit)
- Spacing scale: `4px, 8px, 12px, 16px, 24px, 48px` — directly observed. Also `1px, 2px, 3px, 6px, 10px, 13px, 18px` for fine-grained adjustments
- Border radius:
  - `4px` — small/subtle (badges, tags)
  - `6px` / `8px` — standard buttons, inputs
  - `12px` — cards and panels (`rounded-2xl` observed on tweet/testimonial cards)
  - `16px` / `20px` / `24px` — larger content cards and image containers
  - `9999px` / `300px` — pill/fully-rounded elements (avatars, toggle switches, pill badges)

## Shadows & Borders
- Shadows:
  - Cards use a light `drop-shadow-xs` (very subtle, low intensity) as seen on testimonial cards
  - Elevated components use: `0 13px 27px -5px rgba(50,50,93,.25), 0 8px 16px -8px rgba(0,0,0,.3)` — a multi-layer shadow with moderate spread for lifted panels
  - Focus rings use `0 0 0 1px` outline-style shadows on interactive elements
  - Tailwind shadow utilities (`shadow-sm` through `shadow-2xl`) are available and used contextually
- Borders:
  - `1px solid hsl(var(--border-strong))` — primary border on cards, inputs, and panels
  - `hsl(var(--foreground-muted))` border on hover for interactive cards (e.g., tweet cards)
  - `#30363d` / `#22363d` — dark border colors in code/editor contexts
  - Borders are consistently `1px`, thin and restrained — visual weight comes from background contrast, not thick strokes

## Components

### Buttons
- Variants:
  - **Primary**: brand-colored background, used for main CTAs
  - **Secondary / Default**: transparent background with `border`, foreground text, hover lifts to `bg-surface-300` — as seen in the extracted button snippet
  - **Ghost/Subtle**: no border, no background, text-only with hover state
  - **Destructive**: (assumed) uses error red tones (`#ffa198`, `#f78166`)
- Shape & size: `rounded-md` (6–8px radius), inline-flex with `space-x-2` between icon and label, `font-regular` weight, `duration-200 ease-out` transitions
- States:
  - Hover: background shifts to `surface-300`
  - Active/Open: `data-[state=open]` applies `bg-surface-300` and an outline matching `border-strong`
  - Focus-visible: `outline-solid`, `outline-4`, `outline-offset-1` in `border-strong` color — clear keyboard focus ring
  - Disabled: (assumed) reduced opacity ~50%
- Icon usage: Icons align inline-left of label text with `space-x-2` (8px) gap

### Cards / Panels
- Layout: `p-6` (24px) padding standard on content cards; `var(--card-padding-x)` CSS variable for flexible card padding. `rounded-2xl` (12–16px) radius. Subtle drop shadow and `1px` border.
- Content structure: Avatar/media at top, heading, supporting body text, optional metadata or action link below
- Variants:
  - **Outlined**: `bg-surface-75` with a visible border, border color transitions on hover — standard card style
  - **Elevated**: stronger shadow, used for feature/product highlight panels
  - **Panel**: hover-driven translation animations (`translate-x-6`, `-translate-y-6`) for interactive feature showcase panels suggesting depth and interactivity
  - Testimonial/tweet cards use `rounded-2xl`, border-on-hover, and `drop-shadow-xs`

### Forms & Inputs
- Input style: `1px solid` border, `rounded` corners (6–8px assumed), background from surface tokens, inherits font family and color from parent — consistent with the overall token-driven system
- Placeholder text: `color: var(--color-gray-500)` at full opacity — muted but visible
- Labels: Placement not directly observed; (assumed) top-aligned with small font size and muted color
- Validation: Error states use red tones (`#ffa198`, `#490202` background, `#f78166` text) — inferred from color tokens; success uses green brand color (assumed)
- Buttons in forms: Visually consistent with standalone buttons; may be inset or attached to input fields using negative margin adjustments (`mr-[-0.4rem]`, `ml-[-0.45rem]`) for grouped input+button patterns
- Number inputs: Spinner UI hidden (custom styled)

### Navigation
- Header: (assumed) fixed or sticky at top, dark background matching page surface, with the Supabase logo left-aligned and nav links centered or right-aligned
- Nav items: Regular weight sans-serif, moderate size, spaced with comfortable horizontal padding, hover state shifts text to full foreground from muted
- Active/open states use `data-[state=open]` class with `bg-surface-300` and border highlight — consistent with button behavior
- Mobile behavior: (assumed) hamburger menu triggering a slide-in or dropdown overlay panel, consistent with Radix UI primitives observed in component markup

## Layout Conventions
- Breakpoints: Tailwind defaults — (assumed) `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`
- Grids: Tailwind flex and grid utilities used throughout. Feature sections use 2-column or 3-column grids on desktop, collapsing to single column on mobile. Card rows use `gap-4` to `gap-6` (16–24px) gutters.
- Sections: Full-width sections with constrained inner content (~1200–1280px max-width assumed). Generous vertical padding between sections (`py-12` to `py-24`, 48–96px assumed). Section dividers are implied by background color changes between surface layers rather than explicit `<hr>` lines.

## Usage Notes
- **UI copy tone**: Write like a developer talking to a developer — precise, confident, and minimal. Avoid marketing fluff; favor concrete capability statements ("Connect your database in 2 minutes") over vague promises.
- **Visual feel when designing new components**: Default to dark backgrounds with layered surface tokens; use brand green sparingly as a true accent for the most important interactive element on the screen. Let whitespace and subtle borders do the structural work.
- **Component behavior**: Lean into Radix UI patterns (accessible, state-driven via `data-*` attributes). Micro-animations should be short (`200ms ease-out`) and purposeful — translate or fade, not bounce. Code and terminal UI should feel native, not decorative.