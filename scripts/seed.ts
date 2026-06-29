/**
 * Seed the design registry by running the live generator pipeline against a
 * list of real sites and writing each result as a package under
 * `content/designs/<slug>/`.
 *
 * This reuses the exact same library code the web app uses:
 *   fetchSite → extractDesign → streamDesignMd → generatePreviewHtml
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/seed.ts            # all targets
 *   ANTHROPIC_API_KEY=sk-... npx tsx scripts/seed.ts linear     # one slug
 *
 * If ANTHROPIC_API_KEY is unset it is read from .env.local. Existing packages
 * are skipped unless you pass --force.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fetchSite } from "../src/lib/fetchSite";
import { extractDesign } from "../src/lib/extract";
import { streamDesignMd, generatePreviewHtml } from "../src/lib/claude";
import type { DesignManifest } from "../src/lib/types";

type Target = {
  slug: string;
  title: string;
  url: string;
  topics: string[];
  description?: string;
};

/** Edit this list to seed more designs. */
const TARGETS: Target[] = [
  {
    slug: "tailwind",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    topics: ["developer-tools", "marketing", "colorful"],
  },
  {
    slug: "notion",
    title: "Notion",
    url: "https://www.notion.so",
    topics: ["saas", "productivity", "minimal"],
  },
  {
    slug: "github",
    title: "GitHub",
    url: "https://github.com",
    topics: ["developer-tools", "dark", "product"],
  },
  {
    slug: "apple",
    title: "Apple",
    url: "https://www.apple.com",
    topics: ["consumer", "premium", "minimal"],
  },
  {
    slug: "figma",
    title: "Figma",
    url: "https://www.figma.com",
    topics: ["design-tools", "colorful", "playful"],
  },
  {
    slug: "airbnb",
    title: "Airbnb",
    url: "https://www.airbnb.com",
    topics: ["consumer", "travel", "friendly"],
  },
  {
    slug: "anthropic",
    title: "Anthropic",
    url: "https://www.anthropic.com",
    topics: ["ai", "editorial", "warm"],
  },
  {
    slug: "openai",
    title: "OpenAI",
    url: "https://openai.com",
    topics: ["ai", "minimal", "product"],
  },
  {
    slug: "framer",
    title: "Framer",
    url: "https://www.framer.com",
    topics: ["design-tools", "dark", "bold"],
  },
  {
    slug: "raycast",
    title: "Raycast",
    url: "https://www.raycast.com",
    topics: ["developer-tools", "dark", "refined"],
  },
  {
    slug: "supabase",
    title: "Supabase",
    url: "https://supabase.com",
    topics: ["developer-tools", "dark", "database"],
  },
  {
    slug: "resend",
    title: "Resend",
    url: "https://resend.com",
    topics: ["developer-tools", "minimal", "email"],
  },
  {
    slug: "mercury",
    title: "Mercury",
    url: "https://mercury.com",
    topics: ["fintech", "refined", "saas"],
  },
  {
    slug: "clerk",
    title: "Clerk",
    url: "https://clerk.com",
    topics: ["developer-tools", "auth", "purple"],
  },
  {
    slug: "arc",
    title: "Arc",
    url: "https://arc.net",
    topics: ["consumer", "browser", "gradient"],
  },
  {
    slug: "loom",
    title: "Loom",
    url: "https://www.loom.com",
    topics: ["saas", "video", "friendly"],
  },
  {
    slug: "pitch",
    title: "Pitch",
    url: "https://pitch.com",
    topics: ["saas", "presentations", "bold"],
  },
  {
    slug: "stripe-press",
    title: "Stripe Press",
    url: "https://press.stripe.com",
    topics: ["editorial", "books", "premium"],
  },
];

const DESIGNS_DIR = path.join(process.cwd(), "content", "designs");

async function loadEnvLocal() {
  if (process.env.ANTHROPIC_API_KEY) return;
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), ".env.local"),
      "utf8",
    );
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local — rely on the ambient environment
  }
}

/** Pull a one-line description from the spec's "Overall feel" bullet. */
function deriveDescription(designMd: string, fallback: string): string {
  const m = designMd.match(/Overall feel:\s*(.+)/i);
  if (!m) return fallback;
  return m[1].replace(/\(assumed\)/gi, "").trim().slice(0, 200);
}

async function seedOne(target: Target, force: boolean): Promise<void> {
  const dir = path.join(DESIGNS_DIR, target.slug);
  if (!force) {
    try {
      await fs.access(path.join(dir, "design.json"));
      console.log(`• ${target.slug}: already exists, skipping (use --force)`);
      return;
    } catch {
      // not present — generate it
    }
  }

  console.log(`• ${target.slug}: fetching ${target.url} …`);
  const site = await fetchSite(new URL(target.url));
  const { design, snippets } = extractDesign(site.html, site.css);

  console.log(`• ${target.slug}: writing design.md …`);
  let designMd = "";
  for await (const chunk of streamDesignMd({
    host: site.host,
    design,
    snippets,
  })) {
    designMd += chunk;
  }

  console.log(`• ${target.slug}: rendering preview …`);
  let previewHtml = "";
  try {
    previewHtml = await generatePreviewHtml(designMd);
  } catch (err) {
    console.warn(`  ! preview failed: ${(err as Error).message}`);
  }

  const manifest: DesignManifest = {
    slug: target.slug,
    title: target.title,
    author: "cdesign",
    description:
      target.description ??
      deriveDescription(designMd, `A design spec derived from ${site.host}.`),
    topics: target.topics,
    source: target.url,
    version: "1.0.0",
    createdAt: new Date().toISOString(),
  };

  await fs.mkdir(dir, { recursive: true });
  await Promise.all([
    fs.writeFile(
      path.join(dir, "design.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
    ),
    fs.writeFile(path.join(dir, "design.md"), designMd),
    fs.writeFile(
      path.join(dir, "tokens.json"),
      `${JSON.stringify(design, null, 2)}\n`,
    ),
    fs.writeFile(path.join(dir, "preview.html"), previewHtml),
  ]);
  console.log(`✓ ${target.slug}: done`);
}

async function main() {
  await loadEnvLocal();
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "ANTHROPIC_API_KEY is not set (env or .env.local). Cannot generate specs.",
    );
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const onlySlugs = args.filter((a) => !a.startsWith("--"));
  const targets = onlySlugs.length
    ? TARGETS.filter((t) => onlySlugs.includes(t.slug))
    : TARGETS;

  if (targets.length === 0) {
    console.error(`No matching targets for: ${onlySlugs.join(", ")}`);
    process.exit(1);
  }

  for (const target of targets) {
    try {
      await seedOne(target, force);
    } catch (err) {
      console.error(`✗ ${target.slug}: ${(err as Error).message}`);
    }
  }
}

main();
