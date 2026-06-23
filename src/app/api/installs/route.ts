import { NextResponse } from "next/server";
import {
  getDesign,
  incrementInstall,
  readInstallCounts,
} from "@/lib/registry";

export const runtime = "nodejs";

/** GET /api/installs → the full `{ slug: count }` map (powers the leaderboard). */
export async function GET() {
  const counts = await readInstallCounts();
  return NextResponse.json({ counts });
}

/**
 * POST /api/installs { slug } → increment a design's install count.
 *
 * This is the anonymous install telemetry the CLI pings, mirroring how
 * skills.sh surfaces popular skills. No personal data is recorded — only which
 * slug was installed.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const slug =
    body && typeof body === "object" && "slug" in body
      ? String((body as { slug: unknown }).slug ?? "").trim()
      : "";

  if (!slug) {
    return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  }

  // Only count installs for designs that actually exist.
  const pkg = await getDesign(slug);
  if (!pkg) {
    return NextResponse.json({ error: "Design not found." }, { status: 404 });
  }

  const installs = await incrementInstall(slug);
  return NextResponse.json({ slug, installs });
}
