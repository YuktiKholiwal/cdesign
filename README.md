<div align="center">

# 🎨 cdesign

### Turn any website into a `design.md` spec — in one click.

Paste a public URL. Get a clean, human-readable design system spec that you can
feed straight back into Claude to build on-brand UI.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-API-D97757?style=flat&logo=anthropic&logoColor=white)

</div>

---

## ✨ What it does

```
┌────────────────────┐     ┌───────────────────┐     ┌────────────────────┐
│  Paste a URL       │ ──▶ │  Extract design   │ ──▶ │  Claude writes a   │
│  https://stripe.com│     │  tokens (HTML+CSS)│     │  structured        │
│                    │     │                   │     │  design.md         │
└────────────────────┘     └───────────────────┘     └────────────────────┘
```

`cdesign` fetches a page's HTML and main CSS, derives **design tokens** with
deterministic heuristics (colors, typography, spacing, radius, shadows, and
component patterns), then asks **Claude** to synthesize a polished
[`design.md`](#-example-output) — a description of the site's design language
clear enough that an LLM can "follow this design" and produce consistent UI.

The result **streams in live** as Claude writes it, shown as raw Markdown + a
rendered preview, with copy and download actions:

| Action | What it does |
| --- | --- |
| **Copy design.md** | Copies the spec itself. |
| **Copy prompt for Claude** | Copies a ready-to-paste prompt with the spec inlined — drop it into Claude, then ask it to "build a hero section", "design a pricing page", etc. |
| **↓ design.md** | Downloads the spec as a Markdown file. |
| **↓ tokens.json** | Downloads the raw extracted tokens as JSON. |

### 🔴 Live Preview — does the spec actually work?

Switch to the **Live Preview** tab and Claude builds a self-contained sample
page (nav, hero, buttons, cards, a form) **purely from the `design.md`**,
rendered in a sandboxed `<iframe>`. It's the round-trip test built in: if the
generated component looks like it belongs on the original site, the spec is
faithful. You can download the result as `preview.html`.

---

## 🚀 Quick start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.local.example .env.local      # then paste your Anthropic API key

# 3. Run
npm run dev                           # → http://localhost:3000
```

Open **http://localhost:3000**, paste a URL, and hit **Generate design.md**.

### 🔑 Environment variables

| Variable | Required | Default | Description |
| --- | :---: | --- | --- |
| `ANTHROPIC_API_KEY` | ✅ | — | Your key from [console.anthropic.com](https://console.anthropic.com/). |
| `CLAUDE_MODEL` | — | `claude-sonnet-4-6` | Model used to write the spec. Try `claude-opus-4-8` for richer output. |

> **Note:** the Anthropic API is separate from a Claude.ai / Claude Code
> subscription and is billed per token. Each generation is a single Sonnet call
> — typically well under a cent.

---

## 🧠 How it works

```
        src/app/api/generate/route.ts
        ─────────────────────────────
  validate ─▶ fetch ─▶ extract ─▶ Claude ─▶ respond
     │          │         │          │         │
     │          │         │          │         └─ { designMd, rawTokens, host }
     │          │         │          └─ fixed system prompt + token JSON + snippets
     │          │         └─ deterministic heuristics → ExtractedDesign
     │          └─ HTML + main CSS (12s timeout · 300KB/file · ≤3 files)
     └─ http/https · length · hostname
```

1. **Validate** — `http`/`https` only, reasonable length, real hostname.
2. **Fetch** — page HTML plus inline `<style>` and the first few
   `<link rel="stylesheet">` files (each capped at 300 KB).
3. **Extract** — `src/lib/extract.ts` parses CSS rules and class usage into a
   structured `ExtractedDesign`:
   - **Colors** — CSS custom properties + deduped `color` / `background` values
   - **Typography** — font stacks, base size, `h1`–`h6` sizes (`rem`/`em` → px)
   - **Spacing & radius** — normalized to px, sorted into a scale
   - **Shadows** — `box-shadow` values + Tailwind `shadow-*` utilities
   - **Components** — button / card / form CSS snippets via heuristics
   - **Framework guess** — Tailwind, Bootstrap, MUI, Chakra
4. **Synthesize (streaming)** — tokens + representative HTML/CSS snippets go to
   Claude with a fixed, opinionated system prompt that enforces a consistent
   section structure and marks anything inferred as `(assumed)`. The response is
   **streamed** to the browser token-by-token (a JSON meta line, then markdown).
5. **Render** — raw Markdown + live preview, copy/download actions, and a
   **Live Preview** tab that round-trips the spec back through Claude into a
   sandboxed sample page.

---

## 📄 Example output

A trimmed `design.md` generated from `stripe.com`:

```markdown
# Design Spec – Stripe (stripe.com)

## Brand & Layout
- Overall feel: Clean, technical, and polished — projects trustworthiness
  through tight spacing, restrained color, and refined typography.
- Layout: Full-width, section-based structure with centered containers,
  bento grids, and a 12-column CSS Grid underlying most areas.

## Colors
- Primary: Deep Navy #031323 — wordmark and primary text on light backgrounds
- Accent: Brand Purple #6d2bf0 — interactive highlights and gradients
  ...
```

---

## 🗂️ Project structure

```
src/
├── app/
│   ├── api/generate/route.ts   # validate → fetch → extract → STREAM design.md
│   ├── api/preview/route.ts    # design.md → sample HTML page (live preview)
│   ├── layout.tsx
│   ├── page.tsx                # URL form, stream consumer, results
│   └── globals.css             # Tailwind + minimal markdown-preview styles
├── components/
│   ├── CopyButton.tsx          # clipboard with insecure-context fallback
│   └── ResultPanel.tsx         # tabs: Spec (md + copy/download) + Live Preview
└── lib/
    ├── validateUrl.ts          # http/https + length + hostname checks
    ├── fetchSite.ts            # HTML + main CSS fetch (size/time capped)
    ├── extract.ts              # design-token extraction heuristics
    ├── prompt.ts               # system prompts + user-prompt builders
    ├── claude.ts               # Anthropic SDK wrapper (stream + preview)
    ├── followupPrompt.ts       # "Copy prompt for Claude" template
    ├── download.ts             # client-side file download helper
    └── types.ts                # shared types (ExtractedDesign, responses)
```

---

## 🛠️ Tech stack

- **[Next.js 15](https://nextjs.org/)** (App Router) + **React 19** + **TypeScript**
- **[Tailwind CSS](https://tailwindcss.com/)** for a minimal, clean UI
- **[cheerio](https://cheerio.js.org/)** for HTML parsing; regex-based CSS heuristics
- **[@anthropic-ai/sdk](https://github.com/anthropics/anthropic-sdk-typescript)** for the Claude call
- **[react-markdown](https://github.com/remarkjs/react-markdown)** + **remark-gfm** for the preview

---

## ⚠️ Limitations

- Extraction is **heuristic**, not a full CSS engine — it favors clean, useful
  signals over completeness.
- Some sites block bots or render entirely client-side; with little CSS to
  analyze, Claude will mark more fields as `(assumed)`.
- Fetches are capped (12 s timeout, 300 KB per CSS file, ≤ 3 files) to keep
  latency and payloads reasonable.

---

## ☁️ Deploying

Runs on any Node host that supports Next.js (e.g. **Vercel**). Set
`ANTHROPIC_API_KEY` (and optionally `CLAUDE_MODEL`) in the host's environment.
The `/api/generate` route uses the Node.js runtime.

```bash
npm run build
npm run start
```

---

<div align="center">
<sub>Built with Next.js, Tailwind, and Claude.</sub>
</div>
