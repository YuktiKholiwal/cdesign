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

/**
 * Manifest for a published design package (`design.json`). This is the
 * marketplace's equivalent of a skill's SKILL.md frontmatter — the metadata
 * the registry indexes and the CLI reads when installing.
 */
export type DesignManifest = {
  /** URL-safe identifier, e.g. "stripe". Matches the package folder name. */
  slug: string;
  /** Display name, e.g. "Stripe". */
  title: string;
  /** Who published it. */
  author: string;
  /** One-line summary shown on cards and in search. */
  description: string;
  /** Free-form tags used for topic browsing, e.g. ["saas", "fintech"]. */
  topics: string[];
  /** The site the spec was derived from, e.g. "https://stripe.com". */
  source: string;
  /** Semantic version of the package. */
  version: string;
  /** ISO timestamp the package was created. */
  createdAt: string;
};

/**
 * A registry listing: manifest plus the runtime install count. This is what the
 * marketplace grid renders. The heavy package contents (design.md, tokens,
 * preview HTML) are loaded separately on the detail page.
 */
export type DesignListing = DesignManifest & {
  installs: number;
};

/** The full contents of a design package, served to the CLI and detail page. */
export type DesignPackage = {
  manifest: DesignManifest;
  designMd: string;
  tokens: ExtractedDesign;
  installs: number;
};
