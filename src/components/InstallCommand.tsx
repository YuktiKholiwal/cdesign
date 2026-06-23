"use client";

import { CopyButton } from "./CopyButton";

/**
 * The marketplace's install affordance — the `npx cdesign add <slug>` command
 * with a copy button, mirroring skills.sh's one-line install.
 */
export function InstallCommand({
  slug,
  size = "lg",
}: {
  slug: string;
  size?: "lg" | "sm";
}) {
  const command = `npx cdesign add ${slug}`;
  const isLarge = size === "lg";

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-slate-900 font-mono text-slate-100 ${
        isLarge ? "px-4 py-3 text-sm" : "px-3 py-2 text-xs"
      }`}
    >
      <code className="truncate">
        <span className="select-none text-slate-500">$ </span>
        {command}
      </code>
      <CopyButton
        value={command}
        label="Copy"
        copiedLabel="Copied!"
        className="shrink-0 rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
      />
    </div>
  );
}
