"use client";

import { useCallback, useState } from "react";

type CopyButtonProps = {
  /** Text to copy, or a getter that returns it lazily. */
  value: string | (() => string);
  label: string;
  copiedLabel?: string;
  className?: string;
};

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied!",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = typeof value === "function" ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail (e.g. insecure context); fall back to a prompt.
      window.prompt("Copy manually:", text);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
