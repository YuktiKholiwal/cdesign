"use client";

import { useRef, useState } from "react";
import { ResultPanel } from "@/components/ResultPanel";
import {
  STREAM_ERROR_SENTINEL,
  type ExtractedDesign,
  type StreamMeta,
} from "@/lib/types";

type Meta = { host: string; rawTokens: ExtractedDesign };

export default function CreatePage() {
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
        if (newlineAt === -1) continue;
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

      const sentinelAt = buffer.indexOf(STREAM_ERROR_SENTINEL);
      if (sentinelAt !== -1) {
        markdown += buffer.slice(0, sentinelAt);
        const message = buffer.slice(sentinelAt + STREAM_ERROR_SENTINEL.length);
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
    <main className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Create a Design
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
          Paste a public website URL and generate a clean{" "}
          <span className="font-mono text-neutral-700">design.md</span> spec — the
          same package format the marketplace ships. Preview it live, then
          download the package to publish.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="h-12 flex-1 rounded-md border border-line bg-white px-3.5 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-900 px-5 text-[15px] font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {loading && !streaming && (
          <p className="mt-3 text-sm text-neutral-500">
            Fetching the page and extracting design tokens…
          </p>
        )}
        {streaming && (
          <p className="mt-3 text-sm text-brand">
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

      {showResult && (
        <section className="mx-auto mt-10 max-w-2xl rounded-xl border border-line bg-neutral-50 p-5 text-sm text-neutral-600">
          <h2 className="font-semibold tracking-tight text-neutral-900">
            Publish to the marketplace
          </h2>
          <p className="mt-2">
            Download the <span className="font-mono">design.md</span> and{" "}
            <span className="font-mono">tokens.json</span> above, then drop them
            into a folder under{" "}
            <span className="font-mono">content/designs/&lt;slug&gt;/</span>{" "}
            alongside a <span className="font-mono">design.json</span> manifest
            and an optional <span className="font-mono">preview.html</span>. It
            then appears in the grid and is installable via{" "}
            <span className="font-mono">npx cdesign-cli add &lt;slug&gt;</span>.
          </p>
          <p className="mt-2 text-neutral-500">
            (Hosted publishing — auth + one-click submit — is on the roadmap.)
          </p>
        </section>
      )}
    </main>
  );
}
