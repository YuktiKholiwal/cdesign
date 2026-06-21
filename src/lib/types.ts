/**
 * Structured design signals extracted from a website's HTML + CSS.
 * The shape is intentionally flat and JSON-serializable so it can be passed
 * straight to the LLM and (optionally) returned to the client as `rawTokens`.
 */
export type ExtractedDesign = {
  colors: {
    /** CSS custom properties whose value looks like a color, e.g. "--brand": "#0a7". */
    fromCssVariables: Record<string, string>;
    /** Distinct color values found in `color` / `background` / `background-color`. */
    fromColorProps: string[];
  };
  typography: {
    fontFamilies: string[];
    baseFontSizePx: number | null;
    /** Font sizes (px) for h1–h6 where they could be inferred. */
    headingSizesPx: Record<string, number | null>;
  };
  spacingAndRadius: {
    spacingValuesPx: number[];
    borderRadiiPx: number[];
  };
  shadows: string[];
  components: {
    /** Relevant CSS rules / classnames / snippets, lightly trimmed. */
    buttons: string[];
    cards: string[];
    forms: string[];
  };
  layoutNotes: {
    usesTailwind: boolean;
    /** Best guess at a CSS framework, e.g. "Tailwind", "Bootstrap", or null. */
    usesCssFrameworkGuess: string | null;
  };
};

/** Representative HTML/CSS snippets passed to the model for extra context. */
export type DesignSnippets = {
  htmlSnippets: string[];
  cssSnippet: string | null;
};

/** Successful API response from /api/generate. */
export type GenerateResponse = {
  designMd: string;
  rawTokens: ExtractedDesign;
  host: string;
};

/** Error API response from /api/generate. */
export type GenerateErrorResponse = {
  error: string;
};
