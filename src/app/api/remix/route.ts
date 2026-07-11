import { NextResponse } from "next/server";
import { validateUrl } from "@/lib/validateUrl";
import { fetchSite } from "@/lib/fetchSite";
import { extractDesign, extractCssSnippet } from "@/lib/extract";
import { ClaudeError, ensureClaudeReady, streamRemixMd } from "@/lib/claude";
import { getTokens } from "@/lib/registry";
import { mergeDesigns, isSelection } from "@/lib/remix";
import {
  STREAM_ERROR_SENTINEL,
  type DesignSnippets,
  type ExtractedDesign,
  type SourceRef,
  type StreamMeta,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type ResolvedSource = {
  label: string;
  design: ExtractedDesign;
  snippets: DesignSnippets;
};

/** A resolution error carrying the HTTP status we should surface. */
class ResolveError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseSourceRef(value: unknown): SourceRef | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (v.kind === "design" && typeof v.slug === "string" && v.slug) {
    return { kind: "design", slug: v.slug };
  }
  if (v.kind === "url" && typeof v.url === "string") {
    return { kind: "url", url: v.url };
  }
  return null;
}

/**
 * Resolve one side of the remix into extracted tokens + snippets. Existing
 * designs come straight from the registry (no fetch); their snippets aren't
 * stored, so we rebuild the CSS snippet from the components we do have.
 */
async function resolveSource(ref: SourceRef): Promise<ResolvedSource> {
  if (ref.kind === "design") {
    const found = await getTokens(ref.slug);
    if (!found) {
      throw new ResolveError(`Unknown design: "${ref.slug}".`, 400);
    }
    return {
      label: found.manifest.title,
      design: found.tokens,
      snippets: {
        htmlSnippets: [],
        cssSnippet: extractCssSnippet(found.tokens.components),
      },
    };
  }

  const validation = validateUrl(ref.url);
  if (!validation.ok) {
    throw new ResolveError(validation.error, 400);
  }
  let site;
  try {
    site = await fetchSite(validation.url);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Could not fetch that website. It may be down or blocking requests.";
    throw new ResolveError(message, 502);
  }
  const { design, snippets } = extractDesign(site.html, site.css);
  return { label: site.host, design, snippets };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const raw = body as Record<string, unknown> | null;
  const refA = parseSourceRef(raw?.a);
  const refB = parseSourceRef(raw?.b);
  const selection = raw?.selection;

  if (!refA || !refB) {
    return errorResponse("Both sources (a, b) are required.", 400);
  }
  if (!isSelection(selection)) {
    return errorResponse("Invalid or missing dimension selection.", 400);
  }

  try {
    ensureClaudeReady();
  } catch (err) {
    return errorResponse(
      err instanceof ClaudeError ? err.message : "Server is not configured.",
      500,
    );
  }

  // Resolve both sides (registry lookup and/or live fetch).
  let a: ResolvedSource;
  let b: ResolvedSource;
  try {
    [a, b] = await Promise.all([resolveSource(refA), resolveSource(refB)]);
  } catch (err) {
    if (err instanceof ResolveError) return errorResponse(err.message, err.status);
    return errorResponse("Failed to resolve one of the sources.", 502);
  }

  // Merge deterministically; components-side snippets guide re-skinning.
  const merged = mergeDesigns(a.design, b.design, selection);
  const snippets = selection.components === "a" ? a.snippets : b.snippets;

  const encoder = new TextEncoder();
  const meta: StreamMeta = {
    host: `${a.label} × ${b.label}`,
    rawTokens: merged,
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(`${JSON.stringify(meta)}\n`));
      try {
        for await (const chunk of streamRemixMd({
          labelA: a.label,
          labelB: b.label,
          selection,
          merged,
          snippets,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const message =
          err instanceof ClaudeError
            ? err.message
            : "Generation failed partway through.";
        controller.enqueue(encoder.encode(`\n${STREAM_ERROR_SENTINEL}${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
