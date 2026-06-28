#!/usr/bin/env node
/**
 * cdesign — install a design language into your project.
 *
 * Usage:
 *   npx cdesign-cli add <slug> [options]
 *
 * Options:
 *   -g, --global           Install into ~/<agent>/designs/ instead of ./<agent>/designs/
 *   -a, --agent <name>     Target agent dir: claude-code (default), cursor, opencode, windsurf
 *       --host <url>       Registry host (default: $CDESIGN_HOST or https://cdesign-orpin.vercel.app)
 *       --no-telemetry     Don't report the anonymous install
 *   -h, --help             Show this help
 *
 * It fetches the design package from the registry's /api/designs/<slug>
 * endpoint and writes design.md (+ tokens.json) into the agent's designs
 * directory, then pings /api/installs so the leaderboard reflects the install.
 */
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const DEFAULT_HOST =
  process.env.CDESIGN_HOST || "https://cdesign-orpin.vercel.app";

// Where each supported agent keeps project-scoped config. Mirrors skills.sh.
const AGENT_DIRS = {
  "claude-code": ".claude",
  cursor: ".cursor",
  opencode: ".opencode",
  windsurf: ".windsurf",
};

function parseArgs(argv) {
  const opts = {
    command: null,
    slug: null,
    global: false,
    agent: "claude-code",
    host: DEFAULT_HOST,
    telemetry: true,
    help: false,
  };
  const rest = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (a === "-g" || a === "--global") opts.global = true;
    else if (a === "--no-telemetry") opts.telemetry = false;
    else if (a === "-a" || a === "--agent") opts.agent = argv[++i];
    else if (a === "--host") opts.host = argv[++i];
    else if (!a.startsWith("-")) rest.push(a);
  }

  opts.command = rest[0] ?? null;
  opts.slug = rest[1] ?? null;
  return opts;
}

const HELP = `cdesign — install a design language into your project

Usage:
  npx cdesign-cli add <slug> [options]

Options:
  -g, --global         Install globally (~/<agent>/designs/)
  -a, --agent <name>   Target agent: ${Object.keys(AGENT_DIRS).join(", ")}
      --host <url>     Registry host (default: ${DEFAULT_HOST})
      --no-telemetry   Don't report the anonymous install
  -h, --help           Show this help

Example:
  npx cdesign-cli add stripe
`;

function fail(msg) {
  console.error(`\x1b[31m✗\x1b[0m ${msg}`);
  process.exit(1);
}

async function add(opts) {
  if (!opts.slug) fail("Missing design slug. Try: npx cdesign-cli add stripe");

  const agentDir = AGENT_DIRS[opts.agent];
  if (!agentDir) {
    fail(
      `Unknown agent "${opts.agent}". Supported: ${Object.keys(AGENT_DIRS).join(", ")}`,
    );
  }

  const base = opts.global ? os.homedir() : process.cwd();
  const targetDir = path.join(base, agentDir, "designs", opts.slug);
  const host = opts.host.replace(/\/$/, "");

  console.log(`Fetching "${opts.slug}" from ${host} …`);

  let pkg;
  try {
    const res = await fetch(`${host}/api/designs/${encodeURIComponent(opts.slug)}`);
    if (res.status === 404) fail(`Design "${opts.slug}" not found in the registry.`);
    if (!res.ok) fail(`Registry returned HTTP ${res.status}.`);
    pkg = await res.json();
  } catch (err) {
    fail(
      `Could not reach the registry at ${host} (${err.message}).\n` +
        `  Set a reachable host with: CDESIGN_HOST=https://your-host npx cdesign-cli add ${opts.slug}\n` +
        `  or pass --host <url>.`,
    );
  }

  await fs.mkdir(targetDir, { recursive: true });

  const writes = [
    fs.writeFile(path.join(targetDir, "design.md"), pkg.designMd ?? ""),
    fs.writeFile(
      path.join(targetDir, "design.json"),
      `${JSON.stringify(pkg.manifest ?? {}, null, 2)}\n`,
    ),
  ];
  if (pkg.tokens) {
    writes.push(
      fs.writeFile(
        path.join(targetDir, "tokens.json"),
        `${JSON.stringify(pkg.tokens, null, 2)}\n`,
      ),
    );
  }
  await Promise.all(writes);

  // Anonymous install telemetry — only the slug is sent (mirrors skills.sh).
  if (opts.telemetry) {
    try {
      await fetch(`${host}/api/installs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: opts.slug }),
      });
    } catch {
      // Telemetry is best-effort; never block an install on it.
    }
  }

  const rel = path.relative(process.cwd(), targetDir) || targetDir;
  const title = pkg.manifest?.title ?? opts.slug;
  console.log(`\x1b[32m✓\x1b[0m Installed ${title} → ${rel}/design.md`);
  console.log(
    `  Ask your agent to "follow the ${title} design in ${rel}/design.md".`,
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help || !opts.command) {
    console.log(HELP);
    process.exit(opts.command ? 0 : 1);
  }

  if (opts.command === "add") {
    await add(opts);
  } else {
    fail(`Unknown command "${opts.command}". Try: npx cdesign-cli add <slug>`);
  }
}

main();
