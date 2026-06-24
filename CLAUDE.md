# cdesign

> **READ FIRST — before any UI change.** This project has an active design spec at
> **`./.claude/designs/active/design.md`**. Whenever a task touches UI
> (`src/app/**`, `src/components/**`, `globals.css`, styling, layout, colors,
> components), **open and read that file first**, then follow it exactly — its
> colors (use the literal values), typography, spacing, radius, shadows, and
> component rules. Do not restyle from memory or guess; the file is the source
> of truth. See "Active design" below.

A skills.sh-style **marketplace for design specs**. A "design" is a package
(`design.md` + `tokens.json` + `design.json` manifest) that users browse,
preview, and install with `npx cdesign add <slug>`. The URL→design.md generator
(`/create`) is the authoring engine. Registry is file-based under
`content/designs/` (see `src/lib/registry.ts`).

## Active design (follow this for UI work)

The visual source of truth for **this app's own UI** lives at:

```
./.claude/designs/active/design.md
```

**Before changing any UI in this project** (pages in `src/app/`, components in
`src/components/`, `globals.css`), first read that `design.md` and follow its
colors, typography, spacing, radius, shadow, and component rules. Use the exact
hex values and font stacks it specifies. `tokens.json` in the same folder has
the raw values. If a needed detail isn't in the spec, choose something
consistent with its overall feel and note it.

To switch the project to a different design language, replace the files in
`.claude/designs/active/` (e.g. `cp content/designs/<slug>/* .claude/designs/active/`
or `npx cdesign add <slug>` then point this path at it).

> Current active design: **Geist** (Vercel, Light theme) — minimal and
> high-contrast: near-neutral surfaces, a tonal gray scale (`gray-1000` #171717
> primary text), a blue accent (`blue-700` #006bff) reserved for state and the
> single key action, Geist Sans/Mono, tight 6px radii, and subtle tonal
> elevation. (The app's current UI still uses an indigo accent and has not yet
> been restyled to match.)

## Conventions
- Next.js 15 App Router + React 19 + TypeScript + Tailwind 3.
- Server Components read the registry directly via `fs`; client components
  receive serializable data as props (no client-side data fetching for the grid).
- Reuse existing primitives: `CopyButton`, `downloadTextFile`, `InstallCommand`.
