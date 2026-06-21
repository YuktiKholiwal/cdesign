import type { DesignSnippets, ExtractedDesign } from "./types";

/** Fixed, opinionated system prompt for the design-system documenter. */
export const SYSTEM_PROMPT = `You are a design system documenter. Given raw extracted design tokens and HTML/CSS snippets from a real website, you must infer a concise but high-quality design spec in Markdown called design.md.

Goals:
- Describe the design so that another engineer can ask you (or another LLM) to "follow this design" and get consistent UI.
- Prefer clear descriptions over raw CSS.
- Do NOT invent a brand identity; infer only what's reasonably suggested by the data.

When something is not directly observable in the provided data, explicitly mark it as "(assumed)". When it is directly supported by the tokens/snippets, you may state it plainly.

Output ONLY the Markdown document — no preamble, no code fences around the whole thing, no closing commentary.`;

const OUTPUT_TEMPLATE = `# Design Spec – {{siteNameOrHost}}

## Brand & Layout
- Overall feel: (1–3 sentences on tone and character)
- Layout: (common layout patterns, use of grids, sidebars, cards, etc.)

## Colors
- Primary: name + hex + usage
- Accent: name + hex + usage
- Backgrounds: key background colors and where they're used
- Text colors: main text, muted text, inverted/on-dark

## Typography
- Base font: family stack, example: "Inter, system-ui, sans-serif"
- Base size: in px
- Heading scale: describe H1–H3 sizes and general style (weight, spacing)
- Other: any monospace or special fonts and where they appear

## Spacing & Radius
- Base spacing unit: inferred in px
- Spacing scale: examples (e.g., 4px, 8px, 12px, 16px, 24px, 32px)
- Border radius: common values and how they're applied (buttons, cards, inputs)

## Shadows & Borders
- Shadows: typical card/button shadows (describe intensity and blur)
- Borders: common border styles (thickness, color, where used)

## Components

### Buttons
- Variants: primary, secondary, subtle/ghost, destructive (if inferable)
- Shape & size: padding, radius, font weight
- States: hover, active, disabled, focus (describe behavior, not raw CSS)
- Icon usage: if icons appear with text, describe alignment and spacing

### Cards / Panels
- Layout: padding, radius, shadow/border usage
- Content structure: typical children (title, subtitle, meta, actions)
- Variants: elevated, outlined, minimal (if present)

### Forms & Inputs
- Input style: borders vs underlines, radius, background, padding
- Labels: placement (top, left, floating) and style
- Validation: colors and patterns for errors/success
- Buttons in forms: how they relate visually to standalone buttons

### Navigation
- Header: position (fixed/static), height, background, shadow
- Nav items: typography, spacing, hover/active indications
- Mobile behavior: describe hamburger/overlay patterns if evident

## Layout Conventions
- Breakpoints: inferred small/medium/large breakpoints and layout changes
- Grids: use of grid/flex for cards, multi-column layouts
- Sections: common page sections and vertical spacing between them

## Usage Notes
- How to "sound like" this brand in UI copy (1–3 bullet points)
- How to "feel like" this site visually when designing new components (1–3 bullet points)`;

/** System prompt for the live-preview generator (spec -> sample HTML page). */
export const PREVIEW_SYSTEM_PROMPT = `You are a senior frontend engineer. Given a design.md spec that describes a website's visual language, you build a single self-contained HTML page that DEMONSTRATES the design system so a human can judge whether the spec is faithful.

Rules:
- Output ONE complete HTML document only — starting with <!doctype html>. No markdown, no code fences, no commentary.
- Inline all CSS in a single <style> tag. Do not use external CSS or JS frameworks. You MAY load fonts via a Google Fonts <link> if the spec names a web font.
- Follow the spec EXACTLY for colors (use the given hex values), typography, spacing, border radius, and shadows.
- Render a representative sample, in this order: a top navigation/header, a hero section with a heading + subtext + primary and secondary buttons, a row of 3 cards, and a simple form (one labeled input + a submit button).
- Keep it accessible and responsive. No external images — use solid colors, gradients, or simple inline SVG only.
- Do not include analytics, tracking, or network calls.`;

/** Build the user message for the preview generator. */
export function buildPreviewPrompt(designMd: string): string {
  return `Here is the design.md spec. Build the demonstration page described in your instructions, following it exactly.

${designMd}`;
}

/** Build the user message containing the extracted signals + the required template. */
export function buildUserPrompt(args: {
  host: string;
  design: ExtractedDesign;
  snippets: DesignSnippets;
}): string {
  const { host, design, snippets } = args;

  const htmlSnippetBlock =
    snippets.htmlSnippets.length > 0
      ? snippets.htmlSnippets
          .map((s, i) => `Snippet ${i + 1}:\n${s}`)
          .join("\n\n")
      : "(none captured)";

  const cssSnippetBlock = snippets.cssSnippet ?? "(none captured)";

  return `Site host: ${host}

Below is structured design data extracted from the site, followed by representative HTML and CSS snippets. Use them to fill in the template that follows.

## Extracted design tokens (JSON)
\`\`\`json
${JSON.stringify(design, null, 2)}
\`\`\`

## Representative HTML snippets
${htmlSnippetBlock}

## Representative CSS (button / card / form rules)
\`\`\`css
${cssSnippetBlock}
\`\`\`

---

Produce a design.md document following EXACTLY this structure and section order. Replace {{siteNameOrHost}} with the site's name (if obvious) or its host. Fill every section using the data above; mark anything not directly supported as "(assumed)".

${OUTPUT_TEMPLATE}`;
}
