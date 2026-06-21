import { NextResponse } from "next/server";
import { validateUrl } from "@/lib/validateUrl";
import { fetchSite } from "@/lib/fetchSite";
import { extractDesign } from "@/lib/extract";
import { ClaudeError, ensureClaudeReady, streamDesignMd } from "@/lib/claude";
import { STREAM_ERROR_SENTINEL, type StreamMeta } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid request body.", 400);
  }

  const rawUrl =
    body && typeof body === "object" && "url" in body
      ? String((body as { url: unknown }).url ?? "")
      : "";

  const validation = validateUrl(rawUrl);
  if (!validation.ok) {
    return errorResponse(validation.error, 400);
  }

  // Fail fast on misconfiguration so we can return a clean HTTP error rather
  // than a 200 with the error baked into the stream.
  try {
    ensureClaudeReady();
  } catch (err) {
    return errorResponse(
      err instanceof ClaudeError ? err.message : "Server is not configured.",
      500,
    );
  }

  // 1. Fetch HTML + main CSS.
  let site;
  try {
    site = await fetchSite(validation.url);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Could not fetch that website. It may be down or blocking requests.";
    return errorResponse(message, 502);
  }

  // 2. Extract design signals (deterministic, fast).
  const { design, snippets } = extractDesign(site.html, site.css);

  // 3. Stream the design.md from Claude.
  //    Wire format: one JSON meta line ("\n"-terminated), then raw markdown.
  const encoder = new TextEncoder();
  const meta: StreamMeta = { host: site.host, rawTokens: design };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(`${JSON.stringify(meta)}\n`));
      try {
        for await (const chunk of streamDesignMd({
          host: site.host,
          design,
          snippets,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        const message =
          err instanceof ClaudeError
            ? err.message
            : "Generation failed partway through.";
        controller.enqueue(
          encoder.encode(`\n${STREAM_ERROR_SENTINEL}${message}`),
        );
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
