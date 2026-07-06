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
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Link
        href="/"
        className="font-mono text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← All designs
      </Link>

      <header className="mt-5 border-b border-line pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
          {manifest.title}
        </h1>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-neutral-500">
          {manifest.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[13px] text-neutral-500">
          <span>
            by <span className="text-neutral-700">{manifest.author}</span>
          </span>
          <span className="text-neutral-300">·</span>
          <a
            href={manifest.source}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 transition-colors hover:text-brand hover:underline"
          >
            {host} ↗
          </a>
          <span className="text-neutral-300">·</span>
          <span>↓ {pkg.installs.toLocaleString()} installs</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {manifest.topics.map((topic) => (
            <Link
              key={topic}
              href={`/topics/${encodeURIComponent(topic)}`}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-900"
            >
              {topic}
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-10">
        <DesignDetail
          manifest={manifest}
          designMd={pkg.designMd}
          tokens={pkg.tokens}
        />
      </div>
    </main>
  );
}
