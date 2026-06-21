import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import type { DesignSnippets, ExtractedDesign } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 4096;

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

/** Generate the design.md markdown via Claude from extracted signals. */
export async function generateDesignMd(args: {
  host: string;
  design: ExtractedDesign;
  snippets: DesignSnippets;
}): Promise<string> {
  const anthropic = getClient();
  const model = process.env.CLAUDE_MODEL || DEFAULT_MODEL;

  const userPrompt = buildUserPrompt(args);

  let message: Anthropic.Message;
  try {
    message = await anthropic.messages.create({
      model,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      throw new ClaudeError(
        `Claude API error (${err.status ?? "unknown"}). Check your API key and model name.`,
      );
    }
    throw new ClaudeError("Failed to reach the Claude API. Please try again.");
  }

  const text = message.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  if (!text) {
    throw new ClaudeError("Claude returned an empty response.");
  }

  return text;
}
