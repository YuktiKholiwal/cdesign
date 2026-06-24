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
        "inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-white px-3 text-[13px] font-medium text-neutral-700 transition-colors hover:border-black/20 hover:bg-neutral-50"
      }
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
