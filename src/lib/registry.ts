import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  DesignListing,
  DesignManifest,
  DesignPackage,
  ExtractedDesign,
} from "./types";

/**
 * File-based design registry — the marketplace's "thin index".
 *
 * Each published design lives in `content/designs/<slug>/` as four files:
 *   - design.json   (DesignManifest)
 *   - design.md     (the spec)
 *   - tokens.json   (ExtractedDesign)
 *   - preview.html  (sample page used as a thumbnail; optional)
 *
 * Install counts have two layers:
 *   - A committed baseline in `content/installs.json` (`{ [slug]: number }`) —
 *     the seeded popularity numbers, read-only at runtime.
 *   - Live deltas accumulated since deploy. On a writable filesystem (local
 *     dev) these are folded back into the file; on Vercel — where the FS is
 *     read-only and ephemeral — they live in Vercel KV (a Redis hash) so they
 *     persist across cold starts and deploys. Displayed count = baseline + KV
 *     delta.
 *
 * The CLI bumps a slug via /api/installs — mirroring skills.sh's anonymous
 * install telemetry. Designs themselves are still read straight off the
 * filesystem so pages can be React Server Components with no database.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");
const DESIGNS_DIR = path.join(CONTENT_ROOT, "designs");
const INSTALLS_FILE = path.join(CONTENT_ROOT, "installs.json");

/** Redis hash holding per-slug install deltas accumulated since deploy. */
const KV_INSTALLS_KEY = "cdesign:install-deltas";

/** KV is "configured" only when Vercel injected its REST credentials. */
function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

/** Lazily load the KV client so local dev never needs the dependency wired. */
async function kvClient() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** The committed, read-only baseline counts. */
async function readBaseline(): Promise<Record<string, number>> {
  return (await readJson<Record<string, number>>(INSTALLS_FILE)) ?? {};
}

/**
 * Read the displayed install-count map: baseline plus any KV deltas.
 * Storage failures never break reads — we degrade to the baseline.
 */
export async function readInstallCounts(): Promise<Record<string, number>> {
  const counts = await readBaseline();
  if (!kvConfigured()) return counts;

  try {
    const kv = await kvClient();
    const deltas =
      (await kv.hgetall<Record<string, number>>(KV_INSTALLS_KEY)) ?? {};
    for (const [slug, delta] of Object.entries(deltas)) {
      counts[slug] = (counts[slug] ?? 0) + Number(delta ?? 0);
    }
  } catch {
    // Telemetry storage is best-effort; fall back to the baseline.
  }
  return counts;
}

/** Increment a slug's install count and return the new displayed value. */
export async function incrementInstall(slug: string): Promise<number> {
  const baseline = await readBaseline();
  const base = baseline[slug] ?? 0;

  if (kvConfigured()) {
    const kv = await kvClient();
    const delta = await kv.hincrby(KV_INSTALLS_KEY, slug, 1);
    return base + delta;
  }

  // Local dev: persist the bumped count straight back to the file.
  const next = base + 1;
  baseline[slug] = next;
  await fs.mkdir(CONTENT_ROOT, { recursive: true });
  await fs.writeFile(INSTALLS_FILE, `${JSON.stringify(baseline, null, 2)}\n`);
  return next;
}

async function listSlugs(): Promise<string[]> {
  try {
    const entries = await fs.readdir(DESIGNS_DIR, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

function isManifest(value: unknown): value is DesignManifest {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as DesignManifest).slug === "string" &&
    typeof (value as DesignManifest).title === "string"
  );
}

/** Load every design's manifest + install count for the marketplace grid. */
export async function getListings(): Promise<DesignListing[]> {
  const slugs = await listSlugs();
  const counts = await readInstallCounts();

  const listings = await Promise.all(
    slugs.map(async (slug) => {
      const manifest = await readJson<DesignManifest>(
        path.join(DESIGNS_DIR, slug, "design.json"),
      );
      if (!isManifest(manifest)) return null;
      return { ...manifest, installs: counts[manifest.slug] ?? 0 };
    }),
  );

  return listings
    .filter((l): l is DesignListing => l !== null)
    .sort((a, b) => b.installs - a.installs);
}

/** Load a single full design package (manifest + spec + tokens + preview). */
export async function getDesign(slug: string): Promise<DesignPackage | null> {
  const dir = path.join(DESIGNS_DIR, slug);
  const manifest = await readJson<DesignManifest>(
    path.join(dir, "design.json"),
  );
  if (!isManifest(manifest)) return null;

  const [designMd, tokens, previewHtml, counts] = await Promise.all([
    fs.readFile(path.join(dir, "design.md"), "utf8").catch(() => ""),
    readJson<ExtractedDesign>(path.join(dir, "tokens.json")),
    fs.readFile(path.join(dir, "preview.html"), "utf8").catch(() => ""),
    readInstallCounts(),
  ]);

  return {
    manifest,
    designMd,
    tokens: tokens ?? emptyTokens(),
    previewHtml,
    installs: counts[manifest.slug] ?? 0,
  };
}

/** A grid card: listing metadata plus the preview HTML used as a thumbnail. */
export type DesignCardData = DesignListing & { previewHtml: string };

/**
 * Load listings together with their preview HTML, for the marketplace grid.
 * Serializable, so it can be handed straight to a client component.
 */
export async function getCards(): Promise<DesignCardData[]> {
  const listings = await getListings();
  return Promise.all(
    listings.map(async (listing) => {
      const previewHtml = await fs
        .readFile(path.join(DESIGNS_DIR, listing.slug, "preview.html"), "utf8")
        .catch(() => "");
      return { ...listing, previewHtml };
    }),
  );
}

/** The set of distinct topics across all designs, sorted by frequency. */
export async function getTopics(): Promise<{ topic: string; count: number }[]> {
  const listings = await getListings();
  const counts = new Map<string, number>();
  for (const l of listings) {
    for (const t of l.topics ?? []) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

/** A blank ExtractedDesign, so a package missing tokens.json still renders. */
function emptyTokens(): ExtractedDesign {
  return {
    colors: { fromCssVariables: {}, fromColorProps: [] },
    typography: { fontFamilies: [], baseFontSizePx: null, headingSizesPx: {} },
    spacingAndRadius: { spacingValuesPx: [], borderRadiiPx: [] },
    shadows: [],
    components: { buttons: [], cards: [], forms: [] },
    layoutNotes: { usesTailwind: false, usesCssFrameworkGuess: null },
  };
}
