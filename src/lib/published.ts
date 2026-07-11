import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { DesignManifest, DesignPackage, ExtractedDesign } from "./types";

/**
 * Store for user-published designs — the ones created in /create or /remix and
 * shared via `npx cdesign-cli add <slug>`. These are NOT the curated packages
 * under content/designs/ (those are read from the filesystem by registry.ts);
 * they're anonymous, id-addressed "gists" that don't appear in the grid.
 *
 * On Vercel the filesystem is read-only, so published packages live in Vercel
 * KV (a Redis string per slug). In local dev, where KV isn't configured, they
 * fall back to gitignored JSON files under content/published/ so the flow is
 * testable end-to-end without any cloud credentials.
 */

const PUBLISHED_DIR = path.join(process.cwd(), "content", "published");

/** KV key for a published package. */
const kvKey = (slug: string) => `cdesign:published:${slug}`;

function kvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function kvClient() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

/** Lowercase, hyphenated, ascii-only stem from a title, e.g. "Stripe × Linear" → "stripe-linear". */
function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "design"
  );
}

/** A short, URL-safe random suffix so slugs don't collide. */
function shortId(): string {
  return randomBytes(4).toString("hex"); // 8 hex chars
}

export type PublishInput = {
  designMd: string;
  tokens: ExtractedDesign;
  /** Display title, e.g. a host or "Stripe × Linear". */
  title: string;
  /** Origin URL(s) this was derived from; free-form, may be empty. */
  source?: string;
};

/**
 * Persist a generated package under a fresh slug and return that slug. The
 * caller turns it into `npx cdesign-cli add <slug>`.
 */
export async function publishDesign(
  input: PublishInput,
): Promise<{ slug: string }> {
  const slug = `${slugifyTitle(input.title)}-${shortId()}`;

  const manifest: DesignManifest = {
    slug,
    title: input.title,
    author: "community",
    description: `Published design — ${input.title}.`,
    topics: [],
    source: input.source ?? "",
    version: "1.0.0",
    createdAt: new Date().toISOString(),
  };

  const pkg: DesignPackage = {
    manifest,
    designMd: input.designMd,
    tokens: input.tokens,
    installs: 0,
  };

  if (kvConfigured()) {
    const kv = await kvClient();
    await kv.set(kvKey(slug), pkg);
  } else {
    await fs.mkdir(PUBLISHED_DIR, { recursive: true });
    await fs.writeFile(
      path.join(PUBLISHED_DIR, `${slug}.json`),
      `${JSON.stringify(pkg, null, 2)}\n`,
    );
  }

  return { slug };
}

/** Load a published package by slug, or null if there isn't one. */
export async function getPublished(slug: string): Promise<DesignPackage | null> {
  if (kvConfigured()) {
    try {
      const kv = await kvClient();
      const pkg = await kv.get<DesignPackage>(kvKey(slug));
      return pkg ?? null;
    } catch {
      return null;
    }
  }

  try {
    const raw = await fs.readFile(
      path.join(PUBLISHED_DIR, `${slug}.json`),
      "utf8",
    );
    return JSON.parse(raw) as DesignPackage;
  } catch {
    return null;
  }
}
