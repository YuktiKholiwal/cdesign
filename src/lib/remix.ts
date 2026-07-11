import type { ExtractedDesign } from "./types";

/**
 * The design dimensions a user can independently source from one of two sites.
 * These map 1:1 onto the top-level keys of `ExtractedDesign` (see `extract.ts`),
 * which is what makes a clean per-dimension "remix" possible: each choice just
 * copies that whole section from side A or side B. `layoutNotes` is not a
 * user-facing dimension — it's structural, so it follows the `components` pick.
 */
export type Dimension =
  | "colors"
  | "typography"
  | "spacingAndRadius"
  | "shadows"
  | "components";

export type Pick = "a" | "b";

export type Selection = Record<Dimension, Pick>;

export const DIMENSIONS: Dimension[] = [
  "colors",
  "typography",
  "spacingAndRadius",
  "shadows",
  "components",
];

/** Human labels for the picker UI and the prompt's provenance note. */
export const DIMENSION_LABELS: Record<Dimension, string> = {
  colors: "Colors",
  typography: "Typography",
  spacingAndRadius: "Spacing & radius",
  shadows: "Shadows",
  components: "Components",
};

/**
 * A sensible default: take the palette and layout structure from A, the
 * typography from B — the most common "keep the bones, swap the voice" remix.
 */
export const DEFAULT_SELECTION: Selection = {
  colors: "a",
  typography: "b",
  spacingAndRadius: "a",
  shadows: "a",
  components: "a",
};

/** True if `value` is a well-formed Selection over exactly the known dimensions. */
export function isSelection(value: unknown): value is Selection {
  if (!value || typeof value !== "object") return false;
  const obj = value as Record<string, unknown>;
  return DIMENSIONS.every((d) => obj[d] === "a" || obj[d] === "b");
}

/**
 * Build a merged `ExtractedDesign` by copying each dimension wholesale from the
 * chosen side. Deterministic and pure — no network, no model. `layoutNotes`
 * follows the `components` pick so structural framework hints stay consistent
 * with the component snippets they describe.
 */
export function mergeDesigns(
  a: ExtractedDesign,
  b: ExtractedDesign,
  sel: Selection,
): ExtractedDesign {
  const pick = (d: Dimension) => (sel[d] === "a" ? a : b);
  return {
    colors: pick("colors").colors,
    typography: pick("typography").typography,
    spacingAndRadius: pick("spacingAndRadius").spacingAndRadius,
    shadows: pick("shadows").shadows,
    components: pick("components").components,
    layoutNotes: pick("components").layoutNotes,
  };
}
