import { NextResponse } from "next/server";
import { getDesign } from "@/lib/registry";

export const runtime = "nodejs";

/**
 * Serve a full design package to the CLI (`npx cdesign add <slug>`) and any
 * programmatic consumer. Returns the manifest, design.md, and tokens.json so
 * the CLI can write the files into the target project.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pkg = await getDesign(slug);

  if (!pkg) {
    return NextResponse.json({ error: "Design not found." }, { status: 404 });
  }

  return NextResponse.json({
    manifest: pkg.manifest,
    designMd: pkg.designMd,
    tokens: pkg.tokens,
    installs: pkg.installs,
  });
}
