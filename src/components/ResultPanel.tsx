"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";
import { FOLLOWUP_PROMPT } from "@/lib/followupPrompt";

type ResultPanelProps = {
  designMd: string;
  host: string;
};

/** Combine the follow-up prompt template with the actual design.md content. */
function buildFollowupWithSpec(designMd: string): string {
  return FOLLOWUP_PROMPT.replace("[PASTE design.md HERE]", designMd);
}

export function ResultPanel({ designMd, host }: ResultPanelProps) {
  return (
    <section className="mt-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          design.md for <span className="font-mono text-slate-600">{host}</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={designMd} label="Copy design.md" />
          <CopyButton
            value={() => buildFollowupWithSpec(designMd)}
            label="Copy prompt for Claude"
            copiedLabel="Prompt copied!"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Raw markdown — select-all friendly */}
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

        {/* Rendered preview */}
        <div className="flex flex-col">
          <span className="mb-2 text-sm font-medium text-slate-500">
            Preview
          </span>
          <div className="md-preview h-[28rem] overflow-y-auto rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {designMd}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  );
}
