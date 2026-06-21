import * as cheerio from "cheerio";
import type { DesignSnippets, ExtractedDesign } from "./types";

const BASE_FONT_PX = 16;
const MAX_LIST = 24; // cap list sizes so the LLM payload stays lean

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
}

function uniqNumbers(values: number[]): number[] {
  return Array.from(new Set(values))
    .filter((n) => Number.isFinite(n) && n >= 0)
    .sort((a, b) => a - b);
}

function looksLikeColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  return (
    /^#[0-9a-f]{3,8}\b/.test(v) ||
    v.startsWith("rgb(") ||
    v.startsWith("rgba(") ||
    v.startsWith("hsl(") ||
    v.startsWith("hsla(")
  );
}

/** Convert a CSS length (px/rem/em) to px using a 16px base. Returns null otherwise. */
function lengthToPx(raw: string): number | null {
  const m = raw.trim().match(/^(-?\d*\.?\d+)(px|rem|em)?$/);
  if (!m) return null;
  const num = parseFloat(m[1]);
  if (!Number.isFinite(num)) return null;
  const unit = m[2] ?? "px";
  if (unit === "px") return Math.round(num);
  return Math.round(num * BASE_FONT_PX); // rem/em -> px at 16px base
}

/** Extract the first declaration value for `prop` inside a rule body. */
function declValue(body: string, prop: string): string | null {
  const re = new RegExp(`(?:^|;|{)\\s*${prop}\\s*:\\s*([^;}]+)`, "i");
  const m = body.match(re);
  return m ? m[1].trim() : null;
}

// ---------------------------------------------------------------------------
// CSS rule tokenizer (lightweight, regex-based — robust enough for heuristics)
// ---------------------------------------------------------------------------

type CssRule = { selector: string; body: string };

/** Strip comments and split top-level `selector { body }` rules. */
function parseRules(css: string): CssRule[] {
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const rules: CssRule[] = [];
  // Match `selector { ... }`, ignoring nested at-rules' inner braces loosely.
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(cleaned)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();
    if (selector && body && !selector.startsWith("@")) {
      rules.push({ selector, body });
    }
  }
  return rules;
}

// ---------------------------------------------------------------------------
// Extractors
// ---------------------------------------------------------------------------

function extractColors(css: string, rules: CssRule[]): ExtractedDesign["colors"] {
  const fromCssVariables: Record<string, string> = {};

  // CSS custom properties that look like colors, e.g. `--brand: #0a7;`
  const varRe = /(--[\w-]+)\s*:\s*([^;}]+)/g;
  let vm: RegExpExecArray | null;
  while ((vm = varRe.exec(css)) !== null) {
    const name = vm[1].trim();
    const value = vm[2].trim();
    if (looksLikeColor(value) && !(name in fromCssVariables)) {
      fromCssVariables[name] = value;
    }
    if (Object.keys(fromCssVariables).length >= MAX_LIST) break;
  }

  // Distinct color values from color / background / background-color decls.
  const colorValues: string[] = [];
  const colorPropRe =
    /(?:^|;|{)\s*(?:color|background-color|background)\s*:\s*([^;}]+)/gi;
  const haystack = rules.map((r) => r.body).join(";");
  let cm: RegExpExecArray | null;
  while ((cm = colorPropRe.exec(haystack)) !== null) {
    const value = cm[1].trim();
    // `background` can hold gradients/urls — only keep the color-ish part.
    const colorToken = value.match(
      /#[0-9a-fA-F]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)/,
    );
    if (colorToken) {
      colorValues.push(colorToken[0]);
    }
  }

  return {
    fromCssVariables,
    fromColorProps: uniq(colorValues).slice(0, MAX_LIST),
  };
}

function extractTypography(
  rules: CssRule[],
): ExtractedDesign["typography"] {
  const fontFamilies: string[] = [];
  let baseFontSizePx: number | null = null;
  const headingSizesPx: Record<string, number | null> = {
    h1: null,
    h2: null,
    h3: null,
    h4: null,
    h5: null,
    h6: null,
  };

  for (const { selector, body } of rules) {
    const fam = declValue(body, "font-family");
    if (fam) fontFamilies.push(fam.replace(/\s+/g, " "));

    const sel = selector.toLowerCase();

    // Base font size from html/body.
    if (baseFontSizePx === null && /(^|,|\s)(html|body)(\s|,|$)/.test(sel)) {
      const size = declValue(body, "font-size");
      if (size) baseFontSizePx = lengthToPx(size);
    }

    // Heading sizes h1–h6 (first occurrence wins).
    for (const h of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      if (headingSizesPx[h] === null && new RegExp(`(^|,|\\s)${h}(\\s|,|$|:)`).test(sel)) {
        const size = declValue(body, "font-size");
        if (size) headingSizesPx[h] = lengthToPx(size);
      }
    }
  }

  return {
    fontFamilies: uniq(fontFamilies).slice(0, MAX_LIST),
    baseFontSizePx,
    headingSizesPx,
  };
}

function extractSpacingAndRadius(
  css: string,
  rules: CssRule[],
): ExtractedDesign["spacingAndRadius"] {
  const spacing: number[] = [];
  const radii: number[] = [];

  const spacingProps = ["margin", "padding", "gap", "row-gap", "column-gap"];
  for (const { body } of rules) {
    for (const prop of spacingProps) {
      const val = declValue(body, prop);
      if (!val) continue;
      for (const token of val.split(/\s+/)) {
        const px = lengthToPx(token);
        if (px !== null && px > 0) spacing.push(px);
      }
    }
    const radius = declValue(body, "border-radius");
    if (radius) {
      for (const token of radius.split(/\s+/)) {
        const px = lengthToPx(token);
        if (px !== null) radii.push(px);
      }
    }
  }

  // Tailwind-ish utility hints in raw class strings (rounded-lg etc.)
  const radiusScale: Record<string, number> = {
    "rounded-none": 0,
    "rounded-sm": 2,
    rounded: 4,
    "rounded-md": 6,
    "rounded-lg": 8,
    "rounded-xl": 12,
    "rounded-2xl": 16,
    "rounded-3xl": 24,
    "rounded-full": 9999,
  };
  for (const [cls, px] of Object.entries(radiusScale)) {
    if (new RegExp(`\\b${cls}\\b`).test(css)) radii.push(px);
  }

  return {
    spacingValuesPx: uniqNumbers(spacing).slice(0, MAX_LIST),
    borderRadiiPx: uniqNumbers(radii).slice(0, MAX_LIST),
  };
}

function extractShadows(css: string, rules: CssRule[]): string[] {
  const shadows: string[] = [];
  for (const { body } of rules) {
    const val = declValue(body, "box-shadow");
    if (val && val.toLowerCase() !== "none") {
      shadows.push(val.replace(/\s+/g, " "));
    }
  }
  // Tailwind shadow utilities.
  for (const cls of ["shadow-sm", "shadow", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"]) {
    if (new RegExp(`\\b${cls}\\b`).test(css)) shadows.push(`utility:${cls}`);
  }
  return uniq(shadows).slice(0, MAX_LIST);
}

function ruleSnippet(rule: CssRule, maxLen = 240): string {
  const text = `${rule.selector} { ${rule.body} }`.replace(/\s+/g, " ");
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

function extractComponents(
  rules: CssRule[],
): ExtractedDesign["components"] {
  const buttons: string[] = [];
  const cards: string[] = [];
  const forms: string[] = [];

  for (const rule of rules) {
    const sel = rule.selector.toLowerCase();
    const body = rule.body.toLowerCase();

    if (
      /(^|[\s,>.#:])(button|btn)\b/.test(sel) ||
      /\.(primary|secondary|cta|ghost)\b/.test(sel)
    ) {
      buttons.push(ruleSnippet(rule));
    }

    // A real border declaration (not just the "border" inside "border-radius"),
    // plus a radius and a shadow, reads like a card/panel.
    const hasBorder = /(?:^|;|{)\s*border(?:-(?:width|style|color|top|right|bottom|left))?\s*:/.test(
      body,
    );
    const hasCardSignals =
      hasBorder && /border-radius\s*:/.test(body) && /box-shadow\s*:/.test(body);
    if (/\bcard\b|\bpanel\b/.test(sel) || hasCardSignals) {
      cards.push(ruleSnippet(rule));
    }

    if (
      /(^|[\s,>.#:])(input|textarea|select|label|form)\b/.test(sel) ||
      /\.(form|field|input)\b/.test(sel)
    ) {
      forms.push(ruleSnippet(rule));
    }
  }

  return {
    buttons: uniq(buttons).slice(0, 12),
    cards: uniq(cards).slice(0, 12),
    forms: uniq(forms).slice(0, 12),
  };
}

function extractLayoutNotes(
  classList: string[],
): ExtractedDesign["layoutNotes"] {
  const classes = classList.join(" ");

  const tailwindHits = [
    /\bflex\b/,
    /\bgrid\b/,
    /\bgap-\d/,
    /\bpx-\d/,
    /\bpy-\d/,
    /\brounded(-|\b)/,
    /\btext-(xs|sm|base|lg|xl)\b/,
    /\bbg-\w+-\d{2,3}\b/,
  ].filter((re) => re.test(classes)).length;

  const usesTailwind = tailwindHits >= 3;

  let usesCssFrameworkGuess: string | null = null;
  if (usesTailwind) {
    usesCssFrameworkGuess = "Tailwind";
  } else if (/\bcontainer\b/.test(classes) && /\b(row|col(-[\w-]+)?)\b/.test(classes)) {
    usesCssFrameworkGuess = "Bootstrap";
  } else if (/\bmui-|\bMui[A-Z]/.test(classes)) {
    usesCssFrameworkGuess = "Material UI";
  } else if (/\bchakra-/.test(classes)) {
    usesCssFrameworkGuess = "Chakra UI";
  }

  return { usesTailwind, usesCssFrameworkGuess };
}

// ---------------------------------------------------------------------------
// HTML snippets for additional model context
// ---------------------------------------------------------------------------

function collectClassNames($: cheerio.CheerioAPI): string[] {
  const classes: string[] = [];
  $("[class]").each((_i, el) => {
    const cls = $(el).attr("class");
    if (cls) classes.push(cls);
  });
  return classes;
}

function trimHtml(html: string, maxLen = 600): string {
  const collapsed = html.replace(/\s+/g, " ").trim();
  return collapsed.length > maxLen
    ? `${collapsed.slice(0, maxLen)}…`
    : collapsed;
}

function extractHtmlSnippets($: cheerio.CheerioAPI): string[] {
  const snippets: string[] = [];

  const header = $("header").first();
  if (header.length) snippets.push(trimHtml($.html(header)));

  const button = $("button, .btn, a.button, [class*='btn']").first();
  if (button.length) snippets.push(trimHtml($.html(button)));

  const card = $("[class*='card'], article, .panel").first();
  if (card.length) snippets.push(trimHtml($.html(card)));

  return snippets.filter(Boolean).slice(0, 3);
}

function extractCssSnippet(components: ExtractedDesign["components"]): string | null {
  const lines = [
    ...components.buttons.slice(0, 4),
    ...components.cards.slice(0, 3),
    ...components.forms.slice(0, 4),
  ];
  if (lines.length === 0) return null;
  const joined = lines.join("\n");
  return joined.length > 4000 ? `${joined.slice(0, 4000)}…` : joined;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function extractDesign(
  html: string,
  css: string,
): { design: ExtractedDesign; snippets: DesignSnippets } {
  const $ = cheerio.load(html);
  const rules = parseRules(css);
  const classList = collectClassNames($);

  const components = extractComponents(rules);

  const design: ExtractedDesign = {
    colors: extractColors(css, rules),
    typography: extractTypography(rules),
    spacingAndRadius: extractSpacingAndRadius(css, rules),
    shadows: extractShadows(css, rules),
    components,
    layoutNotes: extractLayoutNotes(classList),
  };

  const snippets: DesignSnippets = {
    htmlSnippets: extractHtmlSnippets($),
    cssSnippet: extractCssSnippet(components),
  };

  return { design, snippets };
}
