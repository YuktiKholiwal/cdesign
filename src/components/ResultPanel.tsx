"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { FOLLOWUP_PROMPT } from "@/lib/followupPrompt";
import { downloadTextFile } from "@/lib/download";
import type { ExtractedDesign, PreviewResponse } from "@/lib/types";

type ResultPanelProps = {
  designMd: string;
  host: string;
  rawTokens: ExtractedDesign;
  streaming: boolean;
};

type Tab = "spec" | "preview";

/** Combine the follow-up prompt template with the actual design.md content. */
function buildFollowupWithSpec(designMd: string): string {
  return FOLLOWUP_PROMPT.replace("[PASTE design.md HERE]", designMd);
}

/** A safe filename stem from the host, e.g. "stripe.com" -> "stripe-com". */
function fileStem(host: string): string {
  return host.replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "") || "site";
}

export function ResultPanel({
  designMd,
  host,
  rawTokens,
  streaming,
}: ResultPanelProps) {
  const [tab, setTab] = useState<Tab>("spec");
  const stem = fileStem(host);

  return (
    <section className="mt-10 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          design.md for <span className="font-mono text-slate-600">{host}</span>
          {streaming && (
            <span className="ml-2 animate-pulse text-sm font-normal text-indigo-500">
              writing…
            </span>
          )}
        </h2>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={designMd} label="Copy design.md" />
          <CopyButton
            value={() => buildFollowupWithSpec(designMd)}
            label="Copy prompt for Claude"
            copiedLabel="Prompt copied!"
          />
          <button
            type="button"
            onClick={() => downloadTextFile(`${stem}.design.md`, designMd, "text/markdown")}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
          >
            ↓ design.md
          </button>
          <button
            type="button"
            onClick={() =>
              downloadTextFile(
                `${stem}.tokens.json`,
                JSON.stringify(rawTokens, null, 2),
                "application/json",
              )
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
          >
            ↓ tokens.json
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        <TabButton active={tab === "spec"} onClick={() => setTab("spec")}>
          Spec
        </TabButton>
        <TabButton
          active={tab === "preview"}
          onClick={() => setTab("preview")}
          disabled={streaming}
          title={streaming ? "Available once the spec finishes" : undefined}
        >
          Live Preview
        </TabButton>
      </div>

      {tab === "spec" ? (
        <SpecView designMd={designMd} />
      ) : (
        <PreviewView designMd={designMd} />
      )}
    </section>
  );
}

function TabButton({
  active,
  children,
  ...rest
}: {
  active: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-indigo-600 text-indigo-700"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function SpecView({ designMd }: { designMd: string }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-slate-500">
          Raw Markdown
        </span>
        <textarea
          readOnly
          value={designMd}
          spellCheck={false}
          className="h-[28rem] w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs leading-relaxed text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-slate-500">Preview</span>
        <div className="md-preview h-[28rem] overflow-y-auto rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{designMd}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function PreviewView({ designMd }: { designMd: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ designMd }),
      });
      const data = (await res.json()) as PreviewResponse | { error: string };
      if (!res.ok || "error" in data) {
        setError("error" in data ? data.error : "Failed to generate preview.");
        return;
      }
      setHtml(data.html);
    } catch {
      setError("Network error while generating the preview.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Building component…"
            : html
              ? "Regenerate preview"
              : "Generate live preview"}
        </button>
        {html && (
          <button
            type="button"
            onClick={() => downloadTextFile("preview.html", html, "text/html")}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ↓ preview.html
          </button>
        )}
        <span className="text-sm text-slate-500">
          Claude builds a sample UI from the spec, rendered in a sandbox.
        </span>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-sm text-indigo-600">
          Asking Claude to build a header, hero, cards, and a form from the spec…
        </p>
      )}

      {html ? (
        <iframe
          title="Design system preview"
          sandbox="allow-scripts"
          srcDoc={html}
          className="h-[36rem] w-full rounded-lg border border-slate-300 bg-white shadow-sm"
        />
      ) : (
        !loading && (
          <div className="flex h-[20rem] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
            <p className="max-w-sm px-6">
              Generate a live component to see whether the spec actually
              reproduces this site&apos;s look. The result is rendered in a
              sandboxed iframe.
            </p>
          </div>
        )
      )}
    </div>
  );
}
