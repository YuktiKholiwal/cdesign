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
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Topics
      </h1>
      <p className="mt-2 text-slate-600">
        Browse design languages by category.
      </p>

      {topics.length === 0 ? (
        <p className="mt-8 text-sm text-slate-500">No topics yet.</p>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          {topics.map(({ topic, count }) => (
            <Link
              key={topic}
              href={`/topics/${encodeURIComponent(topic)}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              {topic}
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
