"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { InstallCommand } from "./InstallCommand";
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
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          design.md for <span className="font-mono text-neutral-600 dark:text-neutral-300">{host}</span>
          {streaming && (
            <span className="ml-2 animate-pulse text-sm font-normal text-brand">
              writing…
            </span>
          )}
        </h2>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={designMd} label="Copy design.md" />
          <CopyButton
            value={() => buildFollowupWithSpec(designMd)}
            label="Copy agent prompt"
            copiedLabel="Prompt copied!"
          />
          <button
            type="button"
            onClick={() => downloadTextFile(`${stem}.design.md`, designMd, "text/markdown")}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-800"
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
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-50 dark:hover:bg-neutral-800 active:bg-neutral-100 dark:active:bg-neutral-800"
          >
            ↓ tokens.json
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-neutral-200 dark:border-neutral-700">
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

      <PublishBar
        designMd={designMd}
        host={host}
        rawTokens={rawTokens}
        streaming={streaming}
      />
    </section>
  );
}

/**
 * Publish the generated spec as a shareable, id-addressed package so it can be
 * installed with `npx cdesign-cli add <slug>`. Anonymous — not added to the
 * marketplace grid. Disabled until the spec finishes streaming.
 */
function PublishBar({
  designMd,
  host,
  rawTokens,
  streaming,
}: ResultPanelProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function publish() {
    if (publishing) return;
    setPublishing(true);
    setError(null);
    try {
      // A host like "stripe.com" becomes a real source URL; a remix label
      // like "Stripe × Linear" has no single origin, so leave it blank.
      const isHostname = /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host);
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          designMd,
          tokens: rawTokens,
          title: host,
          source: isHostname ? `https://${host}` : "",
        }),
      });
      const data = (await res.json()) as { slug?: string; error?: string };
      if (!res.ok || !data.slug) {
        setError(data.error ?? "Could not publish. Please try again.");
        return;
      }
      setSlug(data.slug);
    } catch {
      setError("Network error while publishing.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-neutral-50 dark:bg-neutral-900 p-5">
      <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Install this design
      </h3>
      {slug ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            Published. Anyone can add it to their project:
          </p>
          <InstallCommand slug={slug} size="sm" />
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Shareable link — not listed in the marketplace grid.
          </p>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={publish}
            disabled={streaming || publishing}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 transition hover:bg-neutral-700 dark:hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {publishing ? "Publishing…" : "Publish & get install command"}
          </button>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {streaming
              ? "Available once the spec finishes."
              : "Get an npx command to install this exact spec."}
          </span>
        </div>
      )}
      {error && (
        <p className="mt-3 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
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
          ? "border-brand text-brand-hover"
          : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100"
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
        <span className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Raw Markdown
        </span>
        <textarea
          readOnly
          value={designMd}
          spellCheck={false}
          className="h-[28rem] w-full resize-y rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 font-mono text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">Preview</span>
        <div className="md-preview h-[28rem] overflow-y-auto rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5 shadow-sm">
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
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            ↓ preview.html
          </button>
        )}
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          A sample UI is built from the spec, rendered in a sandbox.
        </span>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}

      {loading && (
        <p className="text-sm text-brand">
          Building a header, hero, cards, and a form from the spec…
        </p>
      )}

      {html ? (
        <iframe
          title="Design system preview"
          sandbox="allow-scripts"
          srcDoc={html}
          className="h-[36rem] w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm"
        />
      ) : (
        !loading && (
          <div className="flex h-[20rem] items-center justify-center rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-center text-sm text-neutral-500 dark:text-neutral-400">
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
