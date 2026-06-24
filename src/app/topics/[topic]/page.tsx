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
    <main className="mx-auto max-w-6xl px-5 py-12">
      <Link
        href="/topics"
        className="font-mono text-[13px] text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← All topics
      </Link>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        <span className="text-neutral-300">#</span>
        {decoded}
      </h1>
      <p className="mt-2 text-lg text-neutral-500">
        {inTopic.length} design{inTopic.length === 1 ? "" : "s"} in this topic.
      </p>

      <div className="mt-10">
        <DesignGrid
          cards={cards}
          topics={topics.map((t) => t.topic)}
          initialTopic={decoded}
        />
      </div>
    </main>
  );
}
