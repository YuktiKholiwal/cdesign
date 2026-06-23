"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { InstallCommand } from "./InstallCommand";
import { FOLLOWUP_PROMPT } from "@/lib/followupPrompt";
import { downloadTextFile } from "@/lib/download";
import type {
  DesignManifest,
  ExtractedDesign,
  PreviewResponse,
} from "@/lib/types";

type Tab = "spec" | "preview";

function buildFollowupWithSpec(designMd: string): string {
  return FOLLOWUP_PROMPT.replace("[PASTE design.md HERE]", designMd);
}

/**
 * The full design detail view: install command, copy/download actions, the
 * design.md spec (raw + rendered), and a live preview. Reuses the same
 * primitives as the generator's ResultPanel.
 */
export function DesignDetail({
  manifest,
  designMd,
  tokens,
  initialPreviewHtml,
}: {
  manifest: DesignManifest;
  designMd: string;
  tokens: ExtractedDesign;
  initialPreviewHtml: string;
}) {
  const [tab, setTab] = useState<Tab>("preview");

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-indigo-600">Install this design</p>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Drops <span className="font-mono text-slate-700">design.md</span> into
          your project (<span className="font-mono">./.claude/designs/{manifest.slug}/</span>
          ) so your agent builds on-brand UI.
        </p>
        <InstallCommand slug={manifest.slug} />

        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton value={designMd} label="Copy design.md" />
          <CopyButton
            value={() => buildFollowupWithSpec(designMd)}
            label="Copy prompt for Claude"
            copiedLabel="Prompt copied!"
          />
          <ActionButton
            onClick={() =>
              downloadTextFile(
                `${manifest.slug}.design.md`,
                designMd,
                "text/markdown",
              )
            }
          >
            ↓ design.md
          </ActionButton>
          <ActionButton
            onClick={() =>
              downloadTextFile(
                `${manifest.slug}.tokens.json`,
                JSON.stringify(tokens, null, 2),
                "application/json",
              )
            }
          >
            ↓ tokens.json
          </ActionButton>
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
          Live Preview
        </TabButton>
        <TabButton active={tab === "spec"} onClick={() => setTab("spec")}>
          Spec
        </TabButton>
      </div>

      {tab === "spec" ? (
        <SpecView designMd={designMd} />
      ) : (
        <PreviewView
          designMd={designMd}
          initialHtml={initialPreviewHtml}
          slug={manifest.slug}
        />
      )}
    </section>
  );
}

function ActionButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
    >
      {children}
    </button>
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
      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
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
          className="h-[32rem] w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-xs leading-relaxed text-slate-800 shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-2 text-sm font-medium text-slate-500">Rendered</span>
        <div className="md-preview h-[32rem] overflow-y-auto rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{designMd}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

function PreviewView({
  designMd,
  initialHtml,
  slug,
}: {
  designMd: string;
  initialHtml: string;
  slug: string;
}) {
  const [html, setHtml] = useState<string>(initialHtml);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function regenerate() {
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
          onClick={regenerate}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Rebuilding…"
            : html
              ? "Regenerate preview"
              : "Generate live preview"}
        </button>
        {html && (
          <button
            type="button"
            onClick={() =>
              downloadTextFile(`${slug}.preview.html`, html, "text/html")
            }
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ↓ preview.html
          </button>
        )}
        <span className="text-sm text-slate-500">
          A sample UI built purely from this spec, rendered in a sandbox.
        </span>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {html ? (
        <iframe
          title={`${slug} design preview`}
          sandbox="allow-scripts"
          srcDoc={html}
          className="h-[40rem] w-full rounded-lg border border-slate-300 bg-white shadow-sm"
        />
      ) : (
        !loading && (
          <div className="flex h-[20rem] items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
            <p className="max-w-sm px-6">
              No preview shipped with this design yet. Generate one to see the
              spec rendered as a live component.
            </p>
          </div>
        )
      )}
    </div>
  );
}
