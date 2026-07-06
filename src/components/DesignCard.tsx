import Link from "next/link";
import type { DesignCardData } from "@/lib/registry";
import { screenshotUrl } from "@/lib/screenshot";

/** Format an install count compactly, e.g. 1284 → "1.3k". */
function formatInstalls(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

/**
 * A marketplace listing card, Geist-styled: hairline border, subtle tonal
 * elevation that lifts on hover, and a thumbnail that is a server-rendered
 * screenshot of the design's own source site. We use a screenshot rather than
 * a live iframe because roughly half of real sites forbid framing
 * (X-Frame-Options / CSP `frame-ancestors`) and would render blank; a
 * screenshot is captured server-side and returned as an image, so those
 * headers don't apply. See `@/lib/screenshot`.
 */
export function DesignCard({ design }: { design: DesignCardData }) {
  return (
    <Link
      href={`/designs/${design.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_2px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_1px_rgba(0,0,0,0.02),0_8px_16px_-4px_rgba(0,0,0,0.04),0_24px_32px_-8px_rgba(0,0,0,0.06)]"
    >
      <div className="relative h-44 overflow-hidden bg-neutral-50">
        {design.source ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            alt={`${design.title} preview`}
            src={screenshotUrl(design.source)}
            loading="lazy"
            aria-hidden
            className="pointer-events-none h-full w-full border-0 object-cover object-top"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs text-neutral-400">
            no preview
          </div>
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[var(--line)]" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
            {design.title}
          </h3>
          <span className="shrink-0 font-mono text-xs text-neutral-400">
            ↓{formatInstalls(design.installs)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-500">
          {design.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {design.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-neutral-500"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
