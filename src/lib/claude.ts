import Anthropic from "@anthropic-ai/sdk";
import {
  PREVIEW_SYSTEM_PROMPT,
  SYSTEM_PROMPT,
  buildPreviewPrompt,
  buildUserPrompt,
} from "./prompt";
import type { DesignSnippets, ExtractedDesign } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4096;
const PREVIEW_MAX_TOKENS = 8192;

/** Thrown for configuration/runtime problems we want to surface cleanly. */
export class ClaudeError extends Error {}

let client: Anthropic | null = null;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new ClaudeError(
      "Server is missing ANTHROPIC_API_KEY. Add it to .env.local.",
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

function modelName(): string {
  return process.env.CLAUDE_MODEL || DEFAULT_MODEL;
}

/**
 * Throw a ClaudeError if the server isn't configured. Call this BEFORE opening
 * a streaming response so misconfiguration returns a clean HTTP error instead
 * of a 200 with an error baked into the stream.
 */
export function ensureClaudeReady(): void {
  getClient();
}

function toClaudeError(err: unknown): ClaudeError {
  if (err instanceof ClaudeError) return err;
  if (err instanceof Anthropic.APIError) {
    return new ClaudeError(
      `Claude API error (${err.status ?? "unknown"}). Check your API key and model name.`,
    );
  }
  return new ClaudeError("Failed to reach the Claude API. Please try again.");
}

/**
 * Stream the design.md markdown via Claude from extracted signals.
 * Yields text deltas as they arrive. Throws ClaudeError on failure.
 */
export async function* streamDesignMd(args: {
  host: string;
  design: ExtractedDesign;
  snippets: DesignSnippets;
}): AsyncGenerator<string> {
  const anthropic = getClient();
  const userPrompt = buildUserPrompt(args);

  let stream: Awaited<ReturnType<typeof anthropic.messages.create>>;
  try {
    stream = await anthropic.messages.create({
      model: modelName(),
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
      stream: true,
    });
  } catch (err) {
    throw toClaudeError(err);
  }

  try {
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  } catch (err) {
    throw toClaudeError(err);
  }
}

/**
 * Generate a single self-contained HTML page that demonstrates the design
 * system described by `designMd`, for the live preview. Returns raw HTML.
 */
export async function generatePreviewHtml(designMd: string): Promise<string> {
  const anthropic = getClient();

  let message: Anthropic.Message;
  try {
    message = await anthropic.messages.create({
      model: modelName(),
      max_tokens: PREVIEW_MAX_TOKENS,
      system: PREVIEW_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPreviewPrompt(designMd) }],
    });
  } catch (err) {
    throw toClaudeError(err);
  }

  const raw = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!raw) {
    throw new ClaudeError("Claude returned an empty preview.");
  }

  return stripCodeFences(raw);
}

/** Strip a wrapping ```html ... ``` fence if the model added one anyway. */
function stripCodeFences(text: string): string {
  const fenced = text.match(/^```(?:html)?\s*\n([\s\S]*?)\n```$/i);
  return fenced ? fenced[1].trim() : text;
}
