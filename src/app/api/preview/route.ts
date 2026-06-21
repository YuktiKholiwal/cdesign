import { NextResponse } from "next/server";
import { ClaudeError, generatePreviewHtml } from "@/lib/claude";
import type { PreviewResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_SPEC_LENGTH = 40_000;

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

  const designMd =
    body && typeof body === "object" && "designMd" in body
      ? String((body as { designMd: unknown }).designMd ?? "")
      : "";

  if (!designMd.trim()) {
    return errorResponse("No design spec provided.", 400);
  }
  if (designMd.length > MAX_SPEC_LENGTH) {
    return errorResponse("That design spec is too long to preview.", 400);
  }

  try {
    const html = await generatePreviewHtml(designMd);
    const payload: PreviewResponse = { html };
    return NextResponse.json(payload);
  } catch (err) {
    if (err instanceof ClaudeError) {
      return errorResponse(err.message, 502);
    }
    return errorResponse("Failed to generate the preview.", 500);
  }
}
