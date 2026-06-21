"use client";

import { useRef, useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import {
  STREAM_ERROR_SENTINEL,
  type ExtractedDesign,
  type StreamMeta,
} from "@/lib/types";

type Meta = { host: string; rawTokens: ExtractedDesign };

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [designMd, setDesignMd] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setMeta(null);
    setDesignMd("");
    setLoading(true);
    setStreaming(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      // Pre-flight failures (validation, config, fetch) come back as JSON.
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (!res.body) {
        setError("No response stream received.");
        return;
      }

      await consumeStream(res.body);
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
      setStreaming(false);
      abortRef.current = null;
    }
  }

  /** Parse the meta line, then append streamed markdown as it arrives. */
  async function consumeStream(body: ReadableStream<Uint8Array>) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let sawMeta = false;
    let markdown = "";

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      if (!sawMeta) {
        const newlineAt = buffer.indexOf("\n");
        if (newlineAt === -1) continue; // wait for the full meta line
        const metaLine = buffer.slice(0, newlineAt);
        buffer = buffer.slice(newlineAt + 1);
        try {
          const parsed = JSON.parse(metaLine) as StreamMeta;
          setMeta(parsed);
        } catch {
          setError("Received a malformed response.");
          return;
        }
        sawMeta = true;
        setStreaming(true);
      }

      // Everything after the meta line is markdown (until an error sentinel).
      const sentinelAt = buffer.indexOf(STREAM_ERROR_SENTINEL);
      if (sentinelAt !== -1) {
        markdown += buffer.slice(0, sentinelAt);
        const message = buffer.slice(
          sentinelAt + STREAM_ERROR_SENTINEL.length,
        );
        setDesignMd(markdown);
        setError(message.trim() || "Generation failed partway through.");
        return;
      }

      markdown += buffer;
      buffer = "";
      setDesignMd(markdown);
    }
  }

  const showResult = meta && designMd.trim().length > 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          design.md generator
        </h1>
        <p className="mt-3 text-slate-600">
          Paste a public website URL and get a clean, human-readable{" "}
          <span className="font-mono text-slate-800">design.md</span> spec of its
          design system — colors, typography, spacing, and components — then
          preview a live component built from it.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl">
        <label htmlFor="url" className="block text-sm font-medium text-slate-700">
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

        {loading && !streaming && (
          <p className="mt-3 text-sm text-slate-500">
            Fetching the page and extracting design tokens…
          </p>
        )}
        {streaming && (
          <p className="mt-3 text-sm text-indigo-600">
            Claude is writing the spec — streaming live below…
          </p>
        )}
      </form>

      {showResult && meta && (
        <ResultPanel
          designMd={designMd}
          host={meta.host}
          rawTokens={meta.rawTokens}
          streaming={streaming}
        />
      )}
    </main>
  );
}
