"use client";

import { useState } from "react";
import { screenshotUrl } from "@/lib/screenshot";

/**
 * Card thumbnail: a server-rendered screenshot of the design's real `source`
 * site (see `@/lib/screenshot`). The screenshot service can occasionally fail
 * or rate-limit a given URL, which would otherwise leave a broken-image icon;
 * on error we fall back to a neutral placeholder. Client component so it can
 * react to the `<img>` onError event.
 */
export function Thumbnail({ source, title }: { source: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (!source || failed) {
    return (
      <div className="grid h-full place-items-center font-mono text-xs text-neutral-400 dark:text-neutral-500">
        no preview
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      alt={`${title} preview`}
      src={screenshotUrl(source)}
      loading="lazy"
      aria-hidden
      onError={() => setFailed(true)}
      className="pointer-events-none h-full w-full border-0 object-cover object-top"
    />
  );
}
