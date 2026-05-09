# INTEGRATION_STEPS_PLAN.md

Wiring **Figma**, **GitHub**, and **Canva** into Claude Code (terminal) and Claude Desktop. Run these once before stage; the demo just *uses* them.

CI wiring (SonarCloud + Chromatic + secrets) is in `documents/SETUP.md`.

## Step 0 — Prerequisites

| Tool | Where | Used by |
|---|---|---|
| `claude` CLI signed in | <https://claude.com/claude-code> | Everything |
| Claude Desktop signed in | <https://claude.com/desktop> | Figma MCP, "Cowork" beats |
| GitHub admin on the demo repo | github.com | GitHub MCP, PR review action |
| Figma desktop with **Dev Mode enabled** | figma.com → Account → Dev Mode | Figma MCP |
| Canva (free tier OK) | canva.com | Canva manual export |
| **NASA API key** (free, instant) | <https://api.nasa.gov/> | APOD route handler |

```bash
echo 'NASA_API_KEY=PASTE_YOUR_KEY_HERE' > .env.local
```

The Image Library API needs no key; `/apod` throws loudly without one (by design — see `src/lib/env.ts`).

## Step 1 — Figma + Claude Desktop (Dev Mode MCP)

The Figma Dev Mode MCP exposes the selected frame's structure, code, variables, and exports to Claude. This drives the live-coded Epic 2.

### 1.1 Enable in Figma desktop

Open Figma **desktop** (not the web app — the MCP is a local HTTP server bound to `127.0.0.1`). **Figma menu → Preferences → Enable local MCP Server**. Verify with `curl http://127.0.0.1:3845/sse`.

### 1.2 Register with Claude

```bash
claude mcp add --transport sse figma-dev http://127.0.0.1:3845/sse
claude mcp list   # confirm "figma-dev" is registered
```

### 1.3 Demo flow (Epic 2)

1. Select the **APOD page** frame in Figma.
2. In Claude Desktop: *"Get the current selection's structure and primary tokens, then scaffold a Next.js 16 server component from it at `src/app/apod/page.tsx`. SCSS modules. Reuse `<PhotoGrid>`."*
3. Review the diff, accept, switch back to terminal.
4. `make test` — still green.

### 1.4 Troubleshooting

| Symptom | Fix |
|---|---|
| `curl 127.0.0.1:3845/sse` empty | Toggle MCP off/on in Figma; restart Figma desktop |
| MCP missing in `/mcp` | `claude mcp list`; restart `claude` session if registered but not loaded |
| "No selection" | Focus must be in Figma desktop and a frame selected (not hovered) |

## Step 2 — GitHub MCP + PR review action

### 2.1 Register the GitHub MCP

```bash
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer $(gh auth token)"
claude mcp list   # confirm "github"
```

(For tighter scope, generate a fine-grained PAT scoped to `feza` only with Contents:read, Issues:r/w, PRs:r/w, Metadata:read.)

### 2.2 Repo + secrets

```bash
gh repo create feza --public --source . --push
gh secret set ANTHROPIC_API_KEY    # for claude-code-action
gh secret set SONAR_TOKEN          # for sonarcloud.yml
gh secret set CHROMATIC_PROJECT_TOKEN   # for chromatic.yml
```

`SETUP.md` covers the SonarCloud and Chromatic project imports those tokens come from.

### 2.3 Install the Claude GitHub App (optional, cleaner)

```
/install-github-app
```

So the workflow posts review comments under the "Claude" identity instead of `github-actions[bot]`.

### 2.4 Demo flow

1. `git checkout -b feature/apod` (during Epic 2).
2. After `make test` is green: `git push -u origin feature/apod`, `gh pr create --fill`.
3. Switch the projector to the PR page. Within ~2 min, four status checks land (lint / sonarcloud / chromatic / Claude review). Address one comment, push, watch the review re-run, `gh pr merge --squash`.

## Step 3 — Canva (secondary, billing-limited)

**Status:** the Canva MCP **is** available now via the `claude.ai Canva` connector — already authenticated for the talk. Verify with:

```bash
claude mcp list   # expect: claude.ai Canva: https://mcp.canva.com/mcp - ✓ Connected
```

The MCP exposes `generate-design`, `create-design-from-candidate`, folder management (`search-folders`, `move-item-to-folder`), editing transactions, and brand-kit listing. Use cases on stage: graphic mockups, hero PNGs, social-post variants.

### 3.1 Hero asset workflow

In Canva, open the *feza hero* design (1200×630). **Share → Download → PNG**. Save to `public/hero.png`. Optionally render `<img src="/hero.png" />` from `src/app/page.tsx`. (Could also be done via `mcp__claude_ai_Canva__export-design` directly into the repo, skipping the manual step.)

### 3.2 Why Canva is *not* the design path for Epic 3

`generate-design` produces stock-template colours unless you pass a `brand_kit_id` referencing a Canva **Brand Kit** — and Brand Kits are a **paid** Canva feature. Without it, mockups won't match `tokens.json`. The talk uses `claude.ai/design` (`documents/CLAUDE_DESIGN_PROMPTS.md`) as the canonical UI design path; Canva is a secondary graphic tool. Recipe for the eventual paid path lives in `documents/CANVA_BRAND_KIT.md`.

### 3.3 Stage talking point

> "Canva's MCP is here — connected, authenticated, ready. But on-palette generation needs a paid Brand Kit. So this talk uses claude.ai/design for UI, and Canva for graphic assets. Same MCP discipline, different tool for the right job — *Claude is the constant; the integrations are the variable.*"

## Step 4 — Atlassian Remote MCP (Jira + Confluence)

Used by Part 2 (`documents/PART2_PLAN.md`). Full playbook lives in `documents/ATLASSIAN_SETUP.md` — short version below.

### 4.1 Register the MCP

The talk uses the **bundled Atlassian plugin** that ships with Claude Code (registered as `plugin:atlassian:atlassian`, **HTTP transport**, endpoint `https://mcp.atlassian.com/v1/mcp`). Verify with:

```bash
claude mcp list
# Expect: plugin:atlassian:atlassian: https://mcp.atlassian.com/v1/mcp (HTTP) - ✓ Connected
```

If the plugin isn't installed (e.g., a fresh `claude` install), register the MCP via CLI on the same HTTP endpoint:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
claude mcp list   # confirm "atlassian"
```

> **Don't use `--transport sse`** with `https://mcp.atlassian.com/v1/sse` — that endpoint is deprecated after 2026-06-30. Stick to the HTTP `/v1/mcp` endpoint above for both the plugin and CLI paths.

OAuth 2.1 with dynamic client registration — no `client_id`/`secret` to provision; the first tool call opens a browser auth window. Atlassian admin must approve the `Claude` MCP client once via Atlassian admin → Security → MCP clients.

### 4.2 Demo flow (Part 2)

1. **Discover** with `/atlassian:search-company-knowledge` (cited Confluence/Jira answers).
2. **Decompose** with `/atlassian:spec-to-backlog` (Confluence page → Jira Epic + tickets).
3. **Build** with `/feza-from-jira <KEY>` — the custom skill at `.claude/skills/feza-from-jira/` that dispatches to existing scaffold skills.
4. **Report** with `/atlassian:generate-status-report` (Jira board → Confluence summary).

### 4.3 Troubleshooting

See `documents/ATLASSIAN_SETUP.md` § 5.

## Step 5 — Bonus MCP: Playwright

```bash
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest
```

Use case: *"take a screenshot of localhost:3000/apod and tell me if the layout matches the Figma frame."*

## Step 6 — Verification

```bash
make init          # clean install + dev server
make test          # green
make build         # green
claude mcp list    # figma-dev, github, atlassian, playwright

curl 'http://localhost:3000/api/nasa-search?q=mars+rover'   # 200 + JSON
curl 'http://localhost:3000/api/apod'                       # 501 (intentional — live-coded Part 1)
curl 'http://localhost:3000/api/asteroids'                  # 501 (intentional — live-coded Part 2)
```

If all green, you're stage-ready. CI gates verified separately by opening a small PR — see `documents/SETUP.md` § 3.
