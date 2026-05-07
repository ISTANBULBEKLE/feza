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

## Step 3 — Canva

**Status (2026-05-07):** No officially-published Canva MCP server in Anthropic's registry. Manual export today; flag the upgrade path on stage.

### 3.1 Manual export

In Canva, open the *feza hero* design (1200×630). **Share → Download → PNG**. Save to `public/hero.png`. Optionally render `<img src="/hero.png" />` from `src/app/page.tsx`.

### 3.2 Stage talking point

> "Today this is a manual export. Tomorrow, when Canva ships an official MCP, this becomes a one-line Claude prompt — *and the rest of the workflow doesn't change.* That's the bet of the MCP ecosystem: **Claude is the constant; the integrations are the variable.**"

### 3.3 When Canva ships an MCP

```bash
claude mcp add --transport http canva <official-url> --header "Authorization: Bearer $CANVA_TOKEN"
```

Pattern (export → `public/`) stays the same.

## Step 4 — Bonus MCP: Playwright

```bash
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest
```

Use case: *"take a screenshot of localhost:3000/apod and tell me if the layout matches the Figma frame."*

## Step 5 — Verification

```bash
make init          # clean install + dev server
make test          # green
make build         # green
claude mcp list    # figma-dev, github, playwright

curl 'http://localhost:3000/api/nasa-search?q=mars+rover'   # 200 + JSON
curl 'http://localhost:3000/api/apod'                       # 501 (intentional — live-coded)
```

If all green, you're stage-ready. CI gates verified separately by opening a small PR — see `documents/SETUP.md` § 3.
