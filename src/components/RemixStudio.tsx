"use client";

import { useRef, useState } from "react";
import { ResultPanel } from "./ResultPanel";
import { Button } from "./ui/Button";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DEFAULT_SELECTION,
  type Dimension,
  type Pick,
  type Selection,
} from "@/lib/remix";
import {
  STREAM_ERROR_SENTINEL,
  type SourceRef,
  type StreamMeta,
} from "@/lib/types";

type DesignOption = { slug: string; title: string };

type SourceState = {
  mode: "design" | "url";
  slug: string;
  url: string;
};

/** Resolve a side's UI state into the SourceRef the API expects. */
function toRef(s: SourceState): SourceRef {
  return s.mode === "design"
    ? { kind: "design", slug: s.slug }
    : { kind: "url", url: s.url.trim() };
}

/** A short display label for a side, used in the picker matrix headers. */
function labelOf(s: SourceState, designs: DesignOption[]): string {
  if (s.mode === "design") {
    return designs.find((d) => d.slug === s.slug)?.title ?? "Design A";
  }
  const url = s.url.trim();
  if (!url) return "Site B";
  return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

function isReady(s: SourceState): boolean {
  return s.mode === "design" ? Boolean(s.slug) : Boolean(s.url.trim());
}

export function RemixStudio({ designs }: { designs: DesignOption[] }) {
  const [a, setA] = useState<SourceState>({
    mode: "design",
    slug: designs[0]?.slug ?? "",
    url: "",
  });
  const [b, setB] = useState<SourceState>({
    mode: "design",
    slug: designs[1]?.slug ?? designs[0]?.slug ?? "",
    url: "",
  });
  const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);

  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<StreamMeta | null>(null);
  const [designMd, setDesignMd] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const labelA = labelOf(a, designs);
  const labelB = labelOf(b, designs);
  const canGenerate = isReady(a) && isReady(b) && !loading;

  async function handleGenerate() {
    if (!canGenerate) return;
    setError(null);
    setMeta(null);
    setDesignMd("");
    setLoading(true);
    setStreaming(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/remix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          a: toRef(a),
          b: toRef(b),
          selection,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
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
          setMeta(JSON.parse(metaLine) as StreamMeta);
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
        setDesignMd(markdown);
        setError(
          buffer.slice(sentinelAt + STREAM_ERROR_SENTINEL.length).trim() ||
            "Generation failed partway through.",
        );
        return;
      }

      markdown += buffer;
      buffer = "";
      setDesignMd(markdown);
    }
  }

  const showResult = meta && designMd.trim().length > 0;

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <SourceCard
          heading="Source A"
          state={a}
          onChange={setA}
          designs={designs}
        />
        <SourceCard
          heading="Source B"
          state={b}
          onChange={setB}
          designs={designs}
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white dark:bg-neutral-900">
        <div className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-line bg-neutral-50 dark:bg-neutral-900 px-4 py-2.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span>Take each part from…</span>
          <SegmentHeader labelA={labelA} labelB={labelB} />
        </div>
        {DIMENSIONS.map((dim) => (
          <DimensionRow
            key={dim}
            dimension={dim}
            value={selection[dim]}
            onChange={(pick) =>
              setSelection((prev) => ({ ...prev, [dim]: pick }))
            }
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {labelA} <span className="text-neutral-300 dark:text-neutral-600">×</span> {labelB}
        </p>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={handleGenerate}
          disabled={!canGenerate}
        >
          {loading ? "Remixing…" : "Remix"}
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      {loading && !streaming && (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Resolving sources and merging tokens…
        </p>
      )}
      {streaming && (
        <p className="mt-4 text-sm text-brand">
          Writing the blended spec — streaming live below…
        </p>
      )}

      {showResult && meta && (
        <ResultPanel
          designMd={designMd}
          host={meta.host}
          rawTokens={meta.rawTokens}
          streaming={streaming}
        />
      )}
    </div>
  );
}

function SourceCard({
  heading,
  state,
  onChange,
  designs,
}: {
  heading: string;
  state: SourceState;
  onChange: (s: SourceState) => void;
  designs: DesignOption[];
}) {
  return (
    <div className="rounded-xl border border-line bg-white dark:bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{heading}</span>
        <div className="flex rounded-md border border-line p-0.5 text-xs">
          <ModeTab
            active={state.mode === "design"}
            onClick={() => onChange({ ...state, mode: "design" })}
          >
            Design
          </ModeTab>
          <ModeTab
            active={state.mode === "url"}
            onClick={() => onChange({ ...state, mode: "url" })}
          >
            URL
          </ModeTab>
        </div>
      </div>

      <div className="mt-3">
        {state.mode === "design" ? (
          <select
            value={state.slug}
            onChange={(e) => onChange({ ...state, slug: e.target.value })}
            className="h-10 w-full rounded-md border border-line bg-white dark:bg-neutral-900 px-3 text-sm text-neutral-900 dark:text-neutral-100 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            {designs.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.title}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            value={state.url}
            onChange={(e) => onChange({ ...state, url: e.target.value })}
            className="h-10 w-full rounded-md border border-line bg-white dark:bg-neutral-900 px-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        )}
      </div>
    </div>
  );
}

function ModeTab({
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
      className={`rounded px-2 py-0.5 font-medium transition-colors ${
        active
          ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900"
          : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

function SegmentHeader({ labelA, labelB }: { labelA: string; labelB: string }) {
  return (
    <span className="grid w-40 grid-cols-2 gap-1 text-center sm:w-56">
      <span className="truncate" title={labelA}>
        {labelA}
      </span>
      <span className="truncate" title={labelB}>
        {labelB}
      </span>
    </span>
  );
}

function DimensionRow({
  dimension,
  value,
  onChange,
}: {
  dimension: Dimension;
  value: Pick;
  onChange: (pick: Pick) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-line px-4 py-3 last:border-b-0">
      <span className="text-sm text-neutral-800 dark:text-neutral-200">
        {DIMENSION_LABELS[dimension]}
      </span>
      <div className="grid w-40 grid-cols-2 gap-1 sm:w-56">
        <PickButton active={value === "a"} onClick={() => onChange("a")}>
          A
        </PickButton>
        <PickButton active={value === "b"} onClick={() => onChange("b")}>
          B
        </PickButton>
      </div>
    </div>
  );
}

function PickButton({
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
      aria-pressed={active}
      className={`rounded-md border py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-brand bg-brand/10 dark:bg-brand/20 text-brand-hover"
          : "border-line text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}
