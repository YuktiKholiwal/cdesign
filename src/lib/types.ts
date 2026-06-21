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

/** Successful (non-streaming) API response shape from /api/generate. */
export type GenerateResponse = {
  designMd: string;
  rawTokens: ExtractedDesign;
  host: string;
};

/**
 * First line of the streamed /api/generate response (JSON + "\n"), sent before
 * any markdown so the client knows the host and tokens up front.
 */
export type StreamMeta = {
  host: string;
  rawTokens: ExtractedDesign;
};

/** Successful response from /api/preview. */
export type PreviewResponse = {
  html: string;
};

/** Error API response shape (shared). */
export type GenerateErrorResponse = {
  error: string;
};

/** Sentinel marking a mid-stream failure after the 200/meta were already sent. */
export const STREAM_ERROR_SENTINEL = "<<<CDESIGN_ERROR>>>";
