import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (compatible; cdesign-bot/1.0; +https://example.com/cdesign)";

const FETCH_TIMEOUT_MS = 12_000;
const MAX_HTML_BYTES = 2_000_000; // 2MB
const MAX_CSS_BYTES_PER_FILE = 300_000; // 300KB per spec
const MAX_CSS_FILES = 3;

export type FetchedSite = {
  host: string;
  html: string;
  /** Concatenated CSS from inline <style> blocks and external stylesheets. */
  css: string;
};

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,text/css,*/*",
        ...(init?.headers ?? {}),
      },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timeout);
  }
}

/** Read a response body but stop once we exceed `maxBytes`. */
async function readCapped(res: Response, maxBytes: number): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) {
    const text = await res.text();
    return text.slice(0, maxBytes);
  }

  const decoder = new TextDecoder();
  let result = "";
  let received = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    result += decoder.decode(value, { stream: true });
    if (received >= maxBytes) {
      await reader.cancel();
      break;
    }
  }
  result += decoder.decode();
  return result;
}

/**
 * Fetch the page HTML and its main CSS.
 *
 * - Collects inline <style> blocks.
 * - Resolves up to MAX_CSS_FILES external stylesheets from <head>, capping
 *   each file's size to avoid huge payloads.
 */
export async function fetchSite(target: URL): Promise<FetchedSite> {
  const res = await fetchWithTimeout(target.toString());

  if (!res.ok) {
    throw new Error(
      `The site responded with HTTP ${res.status}. It may block bots or be unavailable.`,
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType && !contentType.includes("html")) {
    throw new Error(
      "That URL didn't return an HTML page. Point it at a normal web page.",
    );
  }

  const html = await readCapped(res, MAX_HTML_BYTES);
  const $ = cheerio.load(html);

  // Inline styles first — these often hold the most relevant tokens.
  const inlineCss: string[] = [];
  $("style").each((_i, el) => {
    const text = $(el).text();
    if (text.trim()) inlineCss.push(text);
  });

  // Resolve external stylesheet links from <head>.
  const cssHrefs: string[] = [];
  $('head link[rel="stylesheet"], head link[rel~="stylesheet"]').each(
    (_i, el) => {
      const href = $(el).attr("href");
      if (href) cssHrefs.push(href);
    },
  );

  const externalCss = await fetchExternalCss(cssHrefs, target);

  const css = [...inlineCss, ...externalCss].join("\n\n");

  return { host: target.hostname, html, css };
}

async function fetchExternalCss(
  hrefs: string[],
  base: URL,
): Promise<string[]> {
  const absolute: string[] = [];
  const seen = new Set<string>();

  for (const href of hrefs) {
    try {
      const resolved = new URL(href, base).toString();
      if (!seen.has(resolved)) {
        seen.add(resolved);
        absolute.push(resolved);
      }
    } catch {
      // Skip unparseable hrefs (e.g. data: URLs we don't care about).
    }
    if (absolute.length >= MAX_CSS_FILES) break;
  }

  const results = await Promise.allSettled(
    absolute.map(async (cssUrl) => {
      const res = await fetchWithTimeout(cssUrl);
      if (!res.ok) return "";
      return readCapped(res, MAX_CSS_BYTES_PER_FILE);
    }),
  );

  return results
    .map((r) => (r.status === "fulfilled" ? r.value : ""))
    .filter((s) => s.trim().length > 0);
}
