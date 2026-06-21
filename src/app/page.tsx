"use client";

import { useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import type { GenerateResponse } from "@/lib/types";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await res.json()) as
        | GenerateResponse
        | { error: string };

      if (!res.ok || "error" in data) {
        setError(
          "error" in data ? data.error : "Something went wrong. Please try again.",
        );
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          design.md generator
        </h1>
        <p className="mt-3 text-slate-600">
          Paste a public website URL and get a clean, human-readable{" "}
          <span className="font-mono text-slate-800">design.md</span> spec of its
          design system — colors, typography, spacing, and components — ready to
          feed back to Claude.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-8 max-w-2xl"
      >
        <label
          htmlFor="url"
          className="block text-sm font-medium text-slate-700"
        >
          Website URL
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate design.md"}
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && (
          <p className="mt-3 text-sm text-slate-500">
            Fetching the page, extracting design tokens, and asking Claude to
            write the spec. This can take 10–30 seconds…
          </p>
        )}
      </form>

      {result && (
        <ResultPanel designMd={result.designMd} host={result.host} />
      )}
    </main>
  );
}
