import type { Config } from "tailwindcss";

/**
 * Theme tokens mapped from the active Geist design spec
 * (.claude/designs/active/design.md). Geist's neutral gray scale lines up with
 * Tailwind's `neutral` palette (neutral-900 = #171717 = gray-1000), so the app
 * uses `neutral-*` for surfaces/text and the tokens below for the blue accent,
 * Geist fonts, tonal elevation, and the focus ring.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // blue-700/800 — reserved for state and the single key action per spec
        brand: {
          DEFAULT: "#006bff",
          hover: "#0059ec",
          subtle: "#f0f7ff", // blue-100
        },
        danger: "#ea001d", // red-800
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Geist light-theme elevation (Elevation & Depth section)
        sm: "0 2px 2px rgba(0,0,0,0.04)",
        DEFAULT:
          "0 1px 1px rgba(0,0,0,0.02), 0 4px 8px -4px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.06)",
        md: "0 1px 1px rgba(0,0,0,0.02), 0 4px 8px -4px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.06)",
        lg: "0 1px 1px rgba(0,0,0,0.02), 0 8px 16px -4px rgba(0,0,0,0.04), 0 24px 32px -8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
