import Link from "next/link";
import { getTopics } from "@/lib/registry";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Topics — cdesign",
  description: "Browse design languages by topic.",
};

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <main className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        Topics
      </h1>
      <p className="mt-2 text-lg text-neutral-500">
        Browse design languages by category.
      </p>

      {topics.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No topics yet.</p>
      ) : (
        <div className="mt-10 flex flex-wrap gap-3">
          {topics.map(({ topic, count }) => (
            <Link
              key={topic}
              href={`/topics/${encodeURIComponent(topic)}`}
              className="card inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-all hover:-translate-y-0.5"
            >
              <span className="font-mono text-neutral-400">#</span>
              {topic}
              <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-500">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
