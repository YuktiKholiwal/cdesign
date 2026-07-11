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
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Remix two designs
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
          Pick two sources, then choose which one each part comes from — the
          palette from one, the type from another, the components from a third
          idea. Claude writes a single{" "}
          <span className="font-mono text-neutral-700">design.md</span> from the
          blend.
        </p>
      </header>

      <RemixStudio designs={designs} />
    </main>
  );
}
