import Link from "next/link";
import { DesignGrid } from "@/components/DesignGrid";
import { getCards, getTopics } from "@/lib/registry";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [cards, topics] = await Promise.all([getCards(), getTopics()]);
  const totalInstalls = cards.reduce((sum, c) => sum + c.installs, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          The design spec marketplace
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Browse design languages distilled from real websites. Install one with{" "}
          a single command and your AI agent builds on-brand UI that{" "}
          <span className="font-medium text-slate-800">follows the design</span>.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3 text-sm">
          <Link
            href="/create"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700"
          >
            Create a design
          </Link>
          <span className="text-slate-400">
            {cards.length} designs · {totalInstalls.toLocaleString()} installs
          </span>
        </div>
      </section>

      <div className="mt-12">
        <DesignGrid cards={cards} topics={topics.map((t) => t.topic)} />
      </div>
    </main>
  );
}
