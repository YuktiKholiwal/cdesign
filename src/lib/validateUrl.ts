const MAX_URL_LENGTH = 2048;

export type UrlValidation =
  | { ok: true; url: URL }
  | { ok: false; error: string };

/**
 * Validate a user-supplied website URL.
 * Must be non-empty, a reasonable length, and use the http/https protocol.
 */
export function validateUrl(raw: string): UrlValidation {
  const trimmed = (raw ?? "").trim();

  if (!trimmed) {
    return { ok: false, error: "Please enter a website URL." };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return { ok: false, error: "That URL is too long." };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return {
      ok: false,
      error: "That doesn't look like a valid URL. Try including https://",
    };
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are supported." };
  }

  if (!url.hostname || !url.hostname.includes(".")) {
    return { ok: false, error: "That URL is missing a valid hostname." };
  }

  return { ok: true, url };
}
