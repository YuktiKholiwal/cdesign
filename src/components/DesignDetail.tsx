"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { InstallCommand } from "./InstallCommand";
import { Button } from "./ui/Button";
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

/** Full design detail view: install, copy/download, spec, and live preview. */
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
    <section className="space-y-8">
      <div className="card p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">
          Install
        </p>
        <p className="mb-3 mt-1.5 text-sm text-neutral-500">
          Drops <span className="font-mono text-neutral-700">design.md</span>{" "}
          into{" "}
          <span className="font-mono text-neutral-700">
            ./.claude/designs/{manifest.slug}/
          </span>{" "}
          so your agent builds on-brand UI.
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

      <div>
        <div className="flex gap-6 border-b border-line">
          <TabButton active={tab === "preview"} onClick={() => setTab("preview")}>
            Live Preview
          </TabButton>
          <TabButton active={tab === "spec"} onClick={() => setTab("spec")}>
            Spec
          </TabButton>
        </div>

        <div className="pt-6">
          {tab === "spec" ? (
            <SpecView designMd={designMd} />
          ) : (
            <PreviewView
              designMd={designMd}
              initialHtml={initialPreviewHtml}
              slug={manifest.slug}
            />
          )}
        </div>
      </div>
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
    <Button type="button" variant="secondary" size="sm" onClick={onClick}>
      {children}
    </Button>
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
      className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
        active
          ? "border-neutral-900 text-neutral-900"
          : "border-transparent text-neutral-400 hover:text-neutral-900"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

function SpecView({ designMd }: { designMd: string }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="flex flex-col">
        <span className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400">
          Raw Markdown
        </span>
        <textarea
          readOnly
          value={designMd}
          spellCheck={false}
          className="h-[32rem] w-full resize-y rounded-xl border border-line bg-neutral-50 p-4 font-mono text-xs leading-relaxed text-neutral-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400">
          Rendered
        </span>
        <div className="md-preview card h-[32rem] overflow-y-auto p-6">
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={regenerate}
          disabled={loading}
        >
          {loading
            ? "Rebuilding…"
            : html
              ? "Regenerate Preview"
              : "Generate Live Preview"}
        </Button>
        {html && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={() =>
              downloadTextFile(`${slug}.preview.html`, html, "text/html")
            }
          >
            ↓ preview.html
          </Button>
        )}
        <span className="text-sm text-neutral-500">
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
          className="h-[40rem] w-full rounded-xl border border-line bg-white shadow-[0_2px_2px_rgba(0,0,0,0.04)]"
        />
      ) : (
        !loading && (
          <div className="flex h-[20rem] items-center justify-center rounded-xl border border-dashed border-line bg-neutral-50 text-center text-sm text-neutral-500">
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
