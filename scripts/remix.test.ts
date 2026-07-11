/**
 * Deterministic checks for the remix merge — the honest, no-model half of the
 * feature. Run with: npx tsx scripts/remix.test.ts
 */
import { mergeDesigns, isSelection, DEFAULT_SELECTION } from "../src/lib/remix";
import type { ExtractedDesign } from "../src/lib/types";

function make(tag: string): ExtractedDesign {
  return {
    colors: { fromCssVariables: { "--x": `#${tag}` }, fromColorProps: [tag] },
    typography: { fontFamilies: [tag], baseFontSizePx: 16, headingSizesPx: {} },
    spacingAndRadius: { spacingValuesPx: [Number(tag.length)], borderRadiiPx: [] },
    shadows: [tag],
    components: { buttons: [tag], cards: [], forms: [] },
    layoutNotes: { usesTailwind: tag === "aaa", usesCssFrameworkGuess: tag },
  };
}

let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) {
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.error(`  FAIL ${name}`);
  }
}

const A = make("aaa");
const B = make("bbb");

// 1. Each dimension comes from the chosen side.
const m = mergeDesigns(A, B, {
  colors: "a",
  typography: "b",
  spacingAndRadius: "a",
  shadows: "b",
  components: "a",
});
check("colors from A", m.colors.fromColorProps[0] === "aaa");
check("typography from B", m.typography.fontFamilies[0] === "bbb");
check("spacing from A", m.spacingAndRadius.spacingValuesPx[0] === 3);
check("shadows from B", m.shadows[0] === "bbb");
check("components from A", m.components.buttons[0] === "aaa");

// 2. layoutNotes follows the components pick, not any other dimension.
check("layoutNotes follows components (A)", m.layoutNotes.usesCssFrameworkGuess === "aaa");
const m2 = mergeDesigns(A, B, { ...DEFAULT_SELECTION, components: "b" });
check("layoutNotes follows components (B)", m2.layoutNotes.usesCssFrameworkGuess === "bbb");

// 3. All-A is identical to A; all-B identical to B.
const allA = mergeDesigns(A, B, { colors: "a", typography: "a", spacingAndRadius: "a", shadows: "a", components: "a" });
check("all-A equals A", JSON.stringify(allA) === JSON.stringify(A));
const allB = mergeDesigns(A, B, { colors: "b", typography: "b", spacingAndRadius: "b", shadows: "b", components: "b" });
check("all-B equals B", JSON.stringify(allB) === JSON.stringify(B));

// 4. Merge is pure — inputs untouched.
check("input A untouched", A.colors.fromColorProps[0] === "aaa");

// 5. isSelection guard.
check("valid selection accepted", isSelection(DEFAULT_SELECTION));
check("missing key rejected", !isSelection({ colors: "a" }));
check("bad value rejected", !isSelection({ ...DEFAULT_SELECTION, colors: "c" }));
check("non-object rejected", !isSelection(null));

console.log(failures === 0 ? "\nAll remix checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
