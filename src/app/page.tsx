import { DesignGrid } from "@/components/DesignGrid";
import { ButtonLink } from "@/components/ui/Button";
import { getCards, getTopics } from "@/lib/registry";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cards, topics] = await Promise.all([getCards(), getTopics()]);
  const totalInstalls = cards.reduce((sum, c) => sum + c.installs, 0);

  return (
    <main className="mx-auto max-w-6xl px-5">
      {/* Hero */}
      <section className="mx-auto max-w-3xl pt-20 pb-14 text-center sm:pt-28">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 font-mono text-xs text-neutral-500 dark:text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          {cards.length} designs · {totalInstalls.toLocaleString()} installs
        </span>
        <h1 className="display mt-6 text-[clamp(2.5rem,7vw,4.5rem)] font-semibold text-neutral-900 dark:text-neutral-100">
          Install a design
          <br />
          language in one line
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
          Browse design systems distilled from real products. Add one to your
          project and your AI agent builds on-brand UI that follows the spec —
          colors, type, spacing, and components.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <ButtonLink href="/create" variant="primary" size="lg">
            Create a Design
          </ButtonLink>
          <ButtonLink href="#browse" variant="secondary" size="lg">
            Browse
          </ButtonLink>
        </div>
      </section>

      {/* Grid */}
      <section id="browse" className="border-t border-line py-12">
        <DesignGrid cards={cards} topics={topics.map((t) => t.topic)} />
      </section>
    </main>
  );
}
