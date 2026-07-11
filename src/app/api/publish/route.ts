import { NextResponse } from "next/server";
import { publishDesign } from "@/lib/published";
import type { ExtractedDesign } from "@/lib/types";

export const runtime = "nodejs";

const MAX_MD_LEN = 100_000;
const MAX_TITLE_LEN = 120;

/**
 * Publish a generated design (/create or /remix) as an id-addressed package so
 * it becomes installable via `npx cdesign-cli add <slug>`. Anonymous and not
 * shown in the marketplace grid — a shareable link, not a submission.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = body as Record<string, unknown> | null;
  const designMd = typeof b?.designMd === "string" ? b.designMd : "";
  const title = typeof b?.title === "string" ? b.title.trim() : "";
  const source = typeof b?.source === "string" ? b.source : "";
  const tokens = b?.tokens as ExtractedDesign | undefined;

  if (!designMd.trim() || designMd.length > MAX_MD_LEN) {
    return NextResponse.json(
      { error: "A non-empty design.md (under 100k chars) is required." },
      { status: 400 },
    );
  }
  if (!title || title.length > MAX_TITLE_LEN) {
    return NextResponse.json({ error: "A short title is required." }, { status: 400 });
  }
  if (!tokens || typeof tokens !== "object") {
    return NextResponse.json({ error: "Tokens are required." }, { status: 400 });
  }

  try {
    const { slug } = await publishDesign({ designMd, tokens, title, source });
    return NextResponse.json({ slug });
  } catch {
    return NextResponse.json(
      { error: "Could not publish right now. Please try again." },
      { status: 500 },
    );
  }
}
