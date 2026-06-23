"use client";

import { useMemo, useState } from "react";
import { DesignCard } from "./DesignCard";
import type { DesignCardData } from "@/lib/registry";

type Sort = "top" | "new" | "az";

const SORTS: { key: Sort; label: string }[] = [
  { key: "top", label: "Top" },
  { key: "new", label: "New" },
  { key: "az", label: "A–Z" },
];

/**
 * Client-side marketplace browser: search box, sort tabs, and topic chips that
 * filter the grid in-browser. Data is loaded server-side and passed in, so
 * there's no client fetching.
 */
export function DesignGrid({
  cards,
  topics,
  initialTopic = null,
}: {
  cards: DesignCardData[];
  topics: string[];
  initialTopic?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("top");
  const [topic, setTopic] = useState<string | null>(initialTopic);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = cards.filter((c) => {
      const matchesTopic = !topic || c.topics.includes(topic);
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });

    result = [...result].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "new")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return b.installs - a.installs;
    });

    return result;
  }, [cards, query, sort, topic]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search designs…"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 sm:max-w-xs"
        />
        <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                sort === s.key
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip active={topic === null} onClick={() => setTopic(null)}>
            All
          </Chip>
          {topics.map((t) => (
            <Chip key={t} active={topic === t} onClick={() => setTopic(t)}>
              {t}
            </Chip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-slate-500">
          No designs match your search.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <DesignCard key={c.slug} design={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
