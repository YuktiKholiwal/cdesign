import Link from "next/link";
import type { DesignCardData } from "@/lib/registry";

/** Format an install count compactly, e.g. 1284 → "1.3k". */
function formatInstalls(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

/**
 * A marketplace listing card. The thumbnail is the design's own preview.html
 * rendered in a sandboxed, non-interactive iframe — so each card literally
 * shows the design language it ships.
 */
export function DesignCard({ design }: { design: DesignCardData }) {
  return (
    <Link
      href={`/designs/${design.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden border-b border-slate-100 bg-slate-50">
        {design.previewHtml ? (
          <iframe
            title={`${design.title} preview`}
            sandbox=""
            srcDoc={design.previewHtml}
            aria-hidden
            tabIndex={-1}
            scrolling="no"
            className="pointer-events-none h-[700px] w-[1400px] origin-top-left scale-[0.357] border-0"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-slate-400">
            no preview
          </div>
        )}
        <span className="pointer-events-none absolute inset-0 ring-0 transition group-hover:ring-2 group-hover:ring-indigo-400/40" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold tracking-tight text-slate-900">
            {design.title}
          </h3>
          <span className="shrink-0 text-xs font-medium text-slate-400">
            ↓ {formatInstalls(design.installs)}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500">
          {design.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {design.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
