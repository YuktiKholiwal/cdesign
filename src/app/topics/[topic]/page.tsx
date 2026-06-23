import Link from "next/link";
import { DesignGrid } from "@/components/DesignGrid";
import { getCards, getTopics } from "@/lib/registry";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const decoded = decodeURIComponent(topic);
  return {
    title: `${decoded} designs — cdesign`,
    description: `Design languages tagged "${decoded}".`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const decoded = decodeURIComponent(topic);

  const [cards, topics] = await Promise.all([getCards(), getTopics()]);
  const inTopic = cards.filter((c) => c.topics.includes(decoded));

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/topics"
        className="text-sm font-medium text-slate-500 transition hover:text-slate-800"
      >
        ← All topics
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        <span className="text-slate-400">#</span>
        {decoded}
      </h1>
      <p className="mt-1 text-slate-600">
        {inTopic.length} design{inTopic.length === 1 ? "" : "s"} in this topic.
      </p>

      <div className="mt-8">
        <DesignGrid
          cards={cards}
          topics={topics.map((t) => t.topic)}
          initialTopic={decoded}
        />
      </div>
    </main>
  );
}
