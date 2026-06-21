import { NextResponse } from "next/server";
import { validateUrl } from "@/lib/validateUrl";
import { fetchSite } from "@/lib/fetchSite";
import { extractDesign } from "@/lib/extract";
import { ClaudeError, generateDesignMd } from "@/lib/claude";
import type { GenerateResponse } from "@/lib/types";

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

  // 2. Extract design signals.
  const { design, snippets } = extractDesign(site.html, site.css);

  // 3. Ask Claude to synthesize design.md.
  let designMd: string;
  try {
    designMd = await generateDesignMd({
      host: site.host,
      design,
      snippets,
    });
  } catch (err) {
    if (err instanceof ClaudeError) {
      return errorResponse(err.message, 502);
    }
    return errorResponse(
      "Something went wrong while generating the design spec.",
      500,
    );
  }

  const payload: GenerateResponse = {
    designMd,
    rawTokens: design,
    host: site.host,
  };
  return NextResponse.json(payload);
}
