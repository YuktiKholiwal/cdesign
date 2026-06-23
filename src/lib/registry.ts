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
 * Install counts live in `content/installs.json` (`{ [slug]: number }`) and are
 * bumped by the CLI via /api/installs — mirroring skills.sh's anonymous
 * install telemetry. We read the filesystem directly so pages can be React
 * Server Components with no database.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");
const DESIGNS_DIR = path.join(CONTENT_ROOT, "designs");
const INSTALLS_FILE = path.join(CONTENT_ROOT, "installs.json");

async function readJson<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Read the install-count map, tolerating a missing/corrupt file. */
export async function readInstallCounts(): Promise<Record<string, number>> {
  return (await readJson<Record<string, number>>(INSTALLS_FILE)) ?? {};
}

/** Persist the install-count map (used by the installs API route). */
export async function writeInstallCounts(
  counts: Record<string, number>,
): Promise<void> {
  await fs.mkdir(CONTENT_ROOT, { recursive: true });
  await fs.writeFile(INSTALLS_FILE, `${JSON.stringify(counts, null, 2)}\n`);
}

/** Increment a slug's install count and return the new value. */
export async function incrementInstall(slug: string): Promise<number> {
  const counts = await readInstallCounts();
  const next = (counts[slug] ?? 0) + 1;
  counts[slug] = next;
  await writeInstallCounts(counts);
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
