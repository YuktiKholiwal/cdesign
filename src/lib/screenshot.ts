/**
 * Card thumbnails used to live-embed each design's real `source` site in an
 * iframe. That fails for any site sending `X-Frame-Options` or a CSP
 * `frame-ancestors` header — roughly half of real sites — leaving a blank
 * frame. Instead we point the thumbnail at a server-rendered screenshot of the
 * site, which is captured browser-side by the service and returned as an
 * image, so framing headers don't apply.
 *
 * Default service is WordPress's free mShots endpoint (no API key, purpose-built
 * for site thumbnails, caches after first generation). Override the base with
 * `NEXT_PUBLIC_SHOT_BASE` to swap in another provider, e.g. thum.io:
 *   NEXT_PUBLIC_SHOT_BASE="https://image.thum.io/get/width/{w}/crop/{h}/{url}"
 *
 * Placeholders in the template: `{url}` (raw source URL), `{eurl}`
 * (encodeURIComponent of it), `{w}`, `{h}`.
 */

const DEFAULT_SHOT_BASE = "https://s0.wp.com/mshots/v1/{eurl}?w={w}&h={h}";

/** Build the screenshot image URL for a source site at a given pixel size. */
export function screenshotUrl(
  source: string,
  width = 1400,
  height = 900,
): string {
  if (!source) return "";
  const template = process.env.NEXT_PUBLIC_SHOT_BASE || DEFAULT_SHOT_BASE;
  return template
    .replaceAll("{eurl}", encodeURIComponent(source))
    .replaceAll("{url}", source)
    .replaceAll("{w}", String(width))
    .replaceAll("{h}", String(height));
}
