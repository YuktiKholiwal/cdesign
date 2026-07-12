import { getListings } from "@/lib/registry";
import { RemixStudio } from "@/components/RemixStudio";

export const metadata = {
  title: "Remix · cdesign",
  description:
    "Mix two sites into one design system — take the palette from one and the type from another.",
};

/** Server component: load the pickable designs, hand them to the client studio. */
export default async function RemixPage() {
  const designs = (await getListings()).map((l) => ({
    slug: l.slug,
    title: l.title,
  }));

  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-2.5">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
            Remix two designs
          </h1>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-brand">
            Beta
          </span>
        </div>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
          Pick two sources, then choose which one each part comes from — the
          palette from one, the type from another, the components from a third
          idea. Get a single{" "}
          <span className="font-mono text-neutral-700 dark:text-neutral-200">design.md</span> from the
          blend.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-500 dark:text-neutral-400">
          Remix is in beta — blends can be rough while we tune how the pieces
          fit together. Treat results as a strong starting point, not a finished
          spec.
        </p>
      </header>

      <RemixStudio designs={designs} />
    </main>
  );
}
