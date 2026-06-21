/**
 * The template copied by the "Copy prompt for Claude" button. Users paste this
 * into Claude along with the generated design.md.
 */
export const FOLLOWUP_PROMPT = `You are a UI engineer using an existing design system spec.

I will paste a Markdown file called design.md that describes a website's visual language (colors, typography, spacing, components, and layout conventions).

Your job is to:
- Follow the design.md spec exactly when choosing colors, radii, spacing, and typography.
- When you output component code (e.g., React + Tailwind or CSS), make sure it adheres to the described system.
- If you need to improvise, stay within the design.md's tone and constraints.

First, acknowledge that you understand the design spec and summarize the key characteristics in 3–5 bullet points. Then wait for my actual task (e.g., "build a hero section", "design a pricing page", etc.).

Here is the design.md spec:
[PASTE design.md HERE]`;
