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
 * Client-side marketplace browser: Geist search field, segmented sort, and
 * topic chips that filter the grid in-browser. Data is loaded server-side.
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
    const result = cards.filter((c) => {
      const matchesTopic = !topic || c.topics.includes(topic);
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });

    return [...result].sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      if (sort === "new")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      return b.installs - a.installs;
    });
  }, [cards, query, sort, topic]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="m11 11 3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search designs…"
            className="h-10 w-full rounded-md border border-line bg-white pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex h-10 items-center gap-0.5 rounded-md border border-line bg-neutral-50 p-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`h-full rounded px-3 text-[13px] font-medium transition-colors ${
                sort === s.key
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {topics.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
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
        <p className="mt-16 text-center text-sm text-neutral-500">
          No designs match your search.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-line text-neutral-600 hover:border-black/20 hover:text-neutral-900"
      }`}
    >
      {children}
    </button>
  );
}
