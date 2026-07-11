"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { InstallCommand } from "./InstallCommand";
import { Button } from "./ui/Button";
import { FOLLOWUP_PROMPT } from "@/lib/followupPrompt";
import { downloadTextFile } from "@/lib/download";
import { screenshotUrl } from "@/lib/screenshot";
import type { DesignManifest, ExtractedDesign } from "@/lib/types";

type Tab = "spec" | "preview";

function buildFollowupWithSpec(designMd: string): string {
  return FOLLOWUP_PROMPT.replace("[PASTE design.md HERE]", designMd);
}

/** Full design detail view: install, copy/download, spec, and live preview. */
export function DesignDetail({
  manifest,
  designMd,
  tokens,
}: {
  manifest: DesignManifest;
  designMd: string;
  tokens: ExtractedDesign;
}) {
  const [tab, setTab] = useState<Tab>("preview");

  return (
    <section className="space-y-8">
      <div className="card p-5">
        <p className="font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Install
        </p>
        <p className="mb-3 mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          Drops <span className="font-mono text-neutral-700 dark:text-neutral-200">design.md</span>{" "}
          into{" "}
          <span className="font-mono text-neutral-700 dark:text-neutral-200">
            ./.claude/designs/{manifest.slug}/
          </span>{" "}
          so your agent builds on-brand UI.
        </p>
        <InstallCommand slug={manifest.slug} />

        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton value={designMd} label="Copy design.md" />
          <CopyButton
            value={() => buildFollowupWithSpec(designMd)}
            label="Copy agent prompt"
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
            <PreviewView source={manifest.source} title={manifest.title} />
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
          ? "border-neutral-900 text-neutral-900 dark:text-neutral-100"
          : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
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
        <span className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Raw Markdown
        </span>
        <textarea
          readOnly
          value={designMd}
          spellCheck={false}
          className="h-[32rem] w-full resize-y rounded-xl border border-line bg-neutral-50 dark:bg-neutral-900 p-4 font-mono text-xs leading-relaxed text-neutral-700 dark:text-neutral-200 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
      <div className="flex flex-col">
        <span className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Rendered
        </span>
        <div className="md-preview card h-[32rem] overflow-y-auto p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{designMd}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

/**
 * Preview of the design's real source site. We show a server-rendered
 * screenshot rather than a live iframe: most real sites send `X-Frame-Options`
 * / CSP `frame-ancestors` headers that refuse framing and would render as a
 * blank white box. The screenshot always renders; the real, interactive page
 * is one click away via "Open site".
 */
function PreviewView({ source, title }: { source: string; title: string }) {
  const host = source.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const [shotFailed, setShotFailed] = useState(false);

  if (!source) {
    return (
      <div className="flex h-[20rem] items-center justify-center rounded-xl border border-dashed border-line bg-neutral-50 dark:bg-neutral-900 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p className="max-w-sm px-6">
          No source site is recorded for this design.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Screenshot of{" "}
          <span className="font-mono text-neutral-700 dark:text-neutral-200">{host}</span>. Open the
          live site for the real, interactive page.
        </span>
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto"
        >
          <Button type="button" variant="secondary" size="sm">
            Open site ↗
          </Button>
        </a>
      </div>

      {shotFailed ? (
        <div className="flex h-[20rem] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-neutral-50 dark:bg-neutral-900 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p className="max-w-sm px-6">
            Couldn&apos;t load a screenshot of{" "}
            <span className="font-mono text-neutral-700 dark:text-neutral-200">{host}</span>.
          </p>
          <a href={source} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="secondary" size="sm">
              Open site ↗
            </Button>
          </a>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          alt={`${title} screenshot`}
          src={screenshotUrl(source, 1600, 1000)}
          onError={() => setShotFailed(true)}
          className="w-full rounded-xl border border-line bg-white dark:bg-neutral-900 shadow-[0_2px_2px_rgba(0,0,0,0.04)]"
        />
      )}
    </div>
  );
}
