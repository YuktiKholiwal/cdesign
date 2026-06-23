import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DesignDetail } from "@/components/DesignDetail";
import { getDesign } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getDesign(slug);
  if (!pkg) return { title: "Design not found — cdesign" };
  return {
    title: `${pkg.manifest.title} — cdesign`,
    description: pkg.manifest.description,
  };
}

export default async function DesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getDesign(slug);
  if (!pkg) notFound();

  const { manifest } = pkg;
  const host = manifest.source.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link
        href="/"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        ← All designs
      </Link>

      <header className="mt-4 flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {manifest.title}
          </h1>
          <p className="mt-1 max-w-2xl text-slate-600">{manifest.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span>
              by{" "}
              <span className="font-medium text-slate-700">
                {manifest.author}
              </span>
            </span>
            <a
              href={manifest.source}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-slate-500 underline-offset-2 hover:text-indigo-600 hover:underline"
            >
              {host} ↗
            </a>
            <span>↓ {pkg.installs.toLocaleString()} installs</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {manifest.topics.map((topic) => (
              <Link
                key={topic}
                href={`/topics/${encodeURIComponent(topic)}`}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="mt-8">
        <DesignDetail
          manifest={manifest}
          designMd={pkg.designMd}
          tokens={pkg.tokens}
          initialPreviewHtml={pkg.previewHtml}
        />
      </div>
    </main>
  );
}
