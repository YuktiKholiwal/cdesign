# cdesign-cli

Install a **design language** into your project with one command. The CLI for the
[cdesign](https://github.com/YuktiKholiwal/cdesign) design-spec marketplace —
think `skills.sh`, but for design.

A *design* is a small package (`design.md` + `tokens.json`) distilled from a real
product's UI. Installing one drops `design.md` into your project so your AI agent
(Claude Code, Cursor, …) builds on-brand UI that follows the spec.

## Usage

```bash
npx cdesign-cli add <slug>
```

For example:

```bash
npx cdesign-cli add vercel
```

This writes the package into `./.claude/designs/vercel/` (for Claude Code) and
records an anonymous install. Then ask your agent to *"follow the Vercel design in
.claude/designs/vercel/design.md."*

## Options

| Flag | Description |
| --- | --- |
| `-g, --global` | Install into `~/<agent>/designs/` instead of the project. |
| `-a, --agent <name>` | Target agent dir: `claude-code` (default), `cursor`, `opencode`, `windsurf`. |
| `--host <url>` | Registry host. Defaults to `$CDESIGN_HOST`, then the public registry. |
| `--no-telemetry` | Don't report the anonymous install. |
| `-h, --help` | Show help. |

## Configuration

By default the CLI fetches from the public cdesign registry, so `npx cdesign-cli
add vercel` works out of the box. To point it at your own deployment, set the
`CDESIGN_HOST` environment variable (or pass `--host`):

```bash
CDESIGN_HOST=https://your-cdesign-host npx cdesign-cli add vercel
```

## Requirements

Node.js >= 18 (uses the built-in `fetch`). No dependencies.

## License

MIT
