# INTEGRATION_STEPS_PLAN.md

> Step-by-step playbook for wiring **Figma**, **GitHub**, and **Canva** into Claude Code (terminal) and Claude Desktop. Run these once before stage; the demo itself just *uses* them.

---

## Step 0 — Prerequisites

| What | Where to get it | Used by |
|---|---|---|
| `claude` CLI installed and signed in | https://claude.com/claude-code | Everything |
| Claude Desktop installed and signed in | https://claude.com/desktop | Figma MCP, "Cowork" beats |
| GitHub account with admin access to the demo repo | github.com | GitHub MCP, PR review action |
| Figma desktop app **with Dev Mode enabled** | figma.com → Account → Dev Mode | Figma MCP |
| Canva account (free tier OK) | canva.com | Canva manual export |
| **NASA API key** (free, instant) | https://api.nasa.gov/ | APOD route handler |

### Set the NASA key

```bash
echo 'NASA_API_KEY=PASTE_YOUR_KEY_HERE' > .env.local
```

The Image Library API used by `/explore` needs **no key**, but `/apod` will throw loudly without one — by design (see `src/lib/env.ts`).

---

## Step 1 — Figma + Claude Desktop (Dev Mode MCP)

The Figma Dev Mode MCP exposes the currently selected frame's structure, code, variables, and exported images to Claude. We use it to drive the live-coded Epic 2.

### 1.1 Enable the local MCP server in Figma desktop

1. Open Figma desktop (not the web app — the MCP is a *local* HTTP server bound to `127.0.0.1`).
2. **Figma menu → Preferences → Enable local MCP Server**.
3. Confirm it's running: `curl http://127.0.0.1:3845/sse` (you should see SSE headers).

### 1.2 Add it to Claude

```bash
claude mcp add --transport sse figma-dev http://127.0.0.1:3845/sse
claude mcp list   # confirm "figma-dev" is registered
```

### 1.3 Verify in a session

```bash
cd /Users/ekip.kalir/Projects/Personal/feza
claude
> /mcp                    # list MCPs available in this session
> Pull the Figma selection's structure and main tokens.
```

Claude should respond with a JSON-ish description of whichever frame is selected in Figma.

### 1.4 Demo flow (Epic 2)

1. Audience: "Watch as Claude Desktop reads the design."
2. Select the **APOD page** frame in Figma.
3. In Claude Desktop, ask: *"Get the current selection's structure and primary tokens, then scaffold a Next.js 16 server component from it at `src/app/apod/page.tsx`. Use SCSS modules. Reuse `<PhotoGrid>` from `src/components/PhotoGrid/`."*
4. Review the diff in Claude Desktop, accept, switch back to terminal.
5. `make test` — should still be green.

### 1.5 Troubleshooting

| Symptom | Fix |
|---|---|
| `curl http://127.0.0.1:3845/sse` returns nothing | Toggle "Enable local MCP Server" off/on; restart Figma desktop |
| MCP missing in `/mcp` list | `claude mcp list`; if registered but not loaded, restart `claude` session |
| Claude says "no selection" | Make sure the focus is in Figma desktop and a frame is selected (not just hovered) |

---

## Step 2 — GitHub MCP + PR review GitHub Action

### 2.1 Add the GitHub MCP server

The Anthropic-recommended GitHub MCP lives at `https://api.githubcopilot.com/mcp/` and uses a Personal Access Token.

```bash
# Use a fine-grained PAT scoped to this single repo (Repository access → Only select repos → feza)
# Required permissions: Contents: read, Issues: read/write, Pull requests: read/write, Metadata: read
gh auth token  # if you want to use the gh CLI's token (broad scope — fine for a demo)

claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer $(gh auth token)"

claude mcp list  # confirm "github" is registered
```

### 2.2 Verify

```bash
claude
> List my open PRs in the feza repo.
```

### 2.3 Set up the GitHub repo

```bash
# from inside feza/
gh repo create feza --public --source . --push
gh secret set ANTHROPIC_API_KEY  # paste your Anthropic API key when prompted
```

### 2.4 Install the Claude GitHub App (optional but cleaner)

From inside a `claude` session:

```
/install-github-app
```

This walks you through GitHub App installation so the workflow can post review comments under the "Claude" identity.

### 2.5 The workflow itself

`.github/workflows/claude-pr-review.yml` is committed in this repo. It:
- Triggers on `pull_request: [opened, synchronize]` and `issue_comment` containing `@claude`.
- Uses `anthropics/claude-code-action@v1`.
- Invokes the local `review-pr` skill (so review behavior lives in `.claude/skills/review-pr/SKILL.md`, not in the workflow).

### 2.6 Demo flow

1. `git checkout -b feature/apod` (during Epic 2)
2. After `make test` is green, `git push -u origin feature/apod`
3. `gh pr create --fill`
4. Switch the projector to the PR page. Claude posts review comments within ~2 minutes.
5. Address one comment with a follow-up commit; push; show the review re-running.
6. `gh pr merge --squash`.

---

## Step 3 — Canva

> **Status (2026-04-30):** Canva does not yet have an officially-published MCP server in Anthropic's registry. We use a **manual export** workflow today and call out the upgrade path on stage.

### 3.1 Manual export (the live-demo path)

1. In Canva, open the *feza hero* design (1200×630 social card).
2. **Share → Download → PNG → Download**.
3. Save to `public/hero.png` in the repo.
4. The landing page (`src/app/page.tsx`) can be extended to render `<img src="/hero.png" />` if desired.

### 3.2 Talking point on stage

> "Today this is a manual export. Tomorrow, when Canva ships an official MCP, this same step becomes a one-line Claude prompt — *and the rest of the workflow doesn't change.* That's the bet of the MCP ecosystem: *Claude is the constant; the integrations are the variable.*"

### 3.3 If/when Canva ships an MCP

```bash
# placeholder — actual command will be in https://api.anthropic.com/mcp-registry/docs
claude mcp add --transport http canva <official-url> --header "Authorization: Bearer $CANVA_TOKEN"
```

The pattern (asset export → drop into `public/`) stays the same.

---

## Step 4 — Bonus MCP: Playwright (for visual checks)

```bash
claude mcp add --transport stdio playwright -- npx -y @playwright/mcp@latest
```

Use case during the talk: ask Claude *"take a screenshot of localhost:3000/apod and tell me if the layout matches the Figma frame."*

---

## Step 5 — Verification checklist

```bash
make init          # clean install + dev server
# in another terminal
make test          # green
make build         # green

claude mcp list    # figma-dev, github, playwright (and canva when it ships)

curl 'http://localhost:3000/api/nasa-search?q=mars+rover'  # 200 + JSON
curl 'http://localhost:3000/api/apod'                      # 501 (intentional — live-coded on stage)
```

If all of the above are green, you're stage-ready.
