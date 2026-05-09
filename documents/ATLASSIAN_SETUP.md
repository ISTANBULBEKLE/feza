# ATLASSIAN_SETUP.md

Wiring the **Atlassian Remote MCP** (Jira + Confluence) into Claude Code, plus the existing Jira content the Part 2 demo expects. Run these once before stage; the demo just *uses* them.

Companion to `documents/INTEGRATION_STEPS_PLAN.md` (Figma + GitHub + Canva).

## Step 0 — Prerequisites

| Thing | Where | Used by |
|---|---|---|
| Atlassian Cloud site (Jira Software + optionally Confluence) | `<your-org>.atlassian.net` | Atlassian MCP |
| Atlassian admin opt-in for the `Claude` MCP client | `<your-org>.atlassian.net/admin` → Security → MCP clients | One-time approval |
| Modern browser for the OAuth flow | any | First MCP connect |
| `claude` CLI signed in | <https://claude.com/claude-code> | Everything |
| `claude.ai/design` access | <https://claude.ai/design> | Part 2 design beat |

OAuth 2.1 with dynamic client registration — no `client_id`/`secret` to provision. Auth happens in the browser the first time you connect.

## Step 1 — Register the Atlassian MCP

The talk uses the **Atlassian plugin** that ships with Claude Code (registered as `plugin:atlassian:atlassian`, HTTP transport, endpoint `https://mcp.atlassian.com/v1/mcp`). Verify with:

```bash
claude mcp list
# Expect: plugin:atlassian:atlassian: https://mcp.atlassian.com/v1/mcp (HTTP) - ✓ Connected
```

If the line shows `! Needs authentication`, trigger the auth handshake from inside `claude`:

> "Authenticate the Atlassian MCP."

Claude prints an `https://mcp.atlassian.com/v1/authorize?...` URL — open it, approve, and the redirect lands at `localhost:<port>/callback?code=...`. Even if the page itself shows a "connection error," the URL in the address bar is what matters; paste it back and the tools load automatically.

### Alternative — CLI registration (no plugin)

If you don't have the bundled plugin (e.g., a fresh `claude` install without it), register the MCP directly:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v1/mcp
claude mcp list
```

(The older `--transport sse https://mcp.atlassian.com/v1/sse` endpoint also works but is deprecated after 2026-06-30.)

### Verify

```bash
claude --print "Use the atlassian search tool: list issues in the KAN project"
# Expect: KAN-1 through KAN-8 returned (after Step 2)
```

## Step 2 — Use the existing Jira project `KAN` (`feza 1`)

The talk uses an existing software (next-gen Kanban) project on `ekipkalir.atlassian.net`:

| Field | Value |
|---|---|
| Site | `ekipkalir.atlassian.net` |
| Project name | `feza 1` |
| Project key | **`KAN`** |
| Type | Software / next-gen / Kanban |
| Demo label | `feza-demo` (filter by this on the board) |

Pre-staged ticket structure:

```
KAN-1 (Epic)  NASA /apod api — Astronomy Picture of the Day
├── KAN-3    Scaffold /apod page + /api/apod route via /feza-route apod
├── KAN-4    Add DatePicker component via /feza-component DatePicker
└── KAN-5    Wire ApodPanel — single-date vs random-N toggle

KAN-2 (Epic)  /asteroids — Near-Earth Objects browser
├── KAN-6    Implement getAsteroids body in src/lib/nasa.ts
├── KAN-7    Add DateRangePicker component via /feza-component DateRangePicker
└── KAN-8    Wire /asteroids page with AsteroidsPanel + Claude Design hand-off
```

If you re-create from scratch in another Atlassian site, mirror this shape; the demo runbooks (`documents/EPIC_2_TICKETS.md`, `documents/EPIC_3_TICKETS.md`) reference the keys above directly.

## Step 3 — (Optional) Confluence space

The current demo ships **without** a Confluence dependency — `documents/EPICS.md` and `documents/EPICS_E3.md` play the role of the spec page. If you want to add the Confluence beat back:

1. Create or reuse a space (e.g., `FEZA`).
2. Add a page *"Epic 3 — `/asteroids` — Specification"* with: user story, data source, acceptance, design tokens (paste from `tokens.json`), out-of-scope.
3. Use `/atlassian:spec-to-backlog <confluence-url>` to regenerate the Jira children — this replaces the manually-created KAN-6/7/8 with skill-generated equivalents.

## Step 4 — Demo flow (Part 2)

| Beat | Skill | Effect |
|---|---|---|
| Discover | `/atlassian:search-company-knowledge "asteroids feature"` or `/atlassian:search-company-knowledge KAN-2` | Cited answer linking the Epic and tickets |
| Decompose | (skipped — pre-staged) | KAN-6, KAN-7, KAN-8 already exist as children of KAN-2 |
| Build | `/feza-from-jira KAN-8` | Reads ticket via MCP, dispatches to `/feza-route asteroids` and the Claude Design hand-off |
| Ship | `gh pr create --fill` | 4 GH workflows; PR auto-links to Jira if Atlassian's GitHub app is installed |
| Report | `/atlassian:generate-status-report` (optional) | Posts a Confluence summary if a space is wired in Step 3 |

## Step 5 — Troubleshooting

| Symptom | Fix |
|---|---|
| `claude mcp list` shows `plugin:atlassian:atlassian: ! Needs authentication` | Re-run the auth flow (Step 1); paste the callback URL even if the redirect page errors |
| OAuth redirect loops | Sign out of Atlassian in the browser, retry |
| Tickets created in wrong project | First message: include the project key in your prompt: *"create them in project KAN"* |
| "Tool not found: searchJiraIssuesUsingJql" | MCP isn't authenticated yet; full toolbelt only loads after Step 1 succeeds |
| Demo Atlassian site asks for 2FA mid-demo | Pre-authenticate the morning of; if it triggers anyway, the Discover beat falls back to `documents/EPIC_3_TICKETS.md` |
| Atlassian-Cloud rate limit on `createJiraIssue` | Space ticket creation by ~1s; the demo only reads/edits, doesn't create |

## Step 6 — Sample queries (memorise 2–3)

```
/atlassian:search-company-knowledge KAN-2
/atlassian:search-company-knowledge "asteroids feature"
/feza-from-jira KAN-8
```

(With a Confluence spec page also wired:)

```
/atlassian:spec-to-backlog https://ekipkalir.atlassian.net/wiki/spaces/FEZA/pages/<id>
/atlassian:generate-status-report board=KAN period=today
```

## Step 7 — Demo runbooks

The two demo runbooks turn this MCP wiring into a stage-time script:

- `documents/EPIC_2_TICKETS.md` — Part 1 (Epic 2, KAN-1 + KAN-3/4/5)
- `documents/EPIC_3_TICKETS.md` — Part 2 (Epic 3, KAN-2 + KAN-6/7/8)

Each lists the exact `/feza-from-jira KAN-N` commands per ticket and points at the design references (claude.ai/design primary + Canva backup).

For the design beat itself, see `documents/CLAUDE_DESIGN_PROMPTS.md` — 4 paste-ready prompts (one per screen) for `claude.ai/design`. This is the **canonical** design path for Part 2.

The Canva MCP is also connected and usable as a secondary graphic-mockup tool (`documents/CANVA_BRAND_KIT.md` has the recipe for on-palette generation). Not preferred — Canva's Brand Kit feature requires a paid plan, so without it generated designs ship in stock template colours.

## Step 8 — Verification (run the morning of)

```bash
claude mcp list                                       # plugin:atlassian:atlassian: Connected
make build                                            # green
curl http://localhost:3000/api/asteroids              # 501 (intentional)
claude --print "/atlassian:search-company-knowledge KAN-2"   # cites KAN-2 + children
```

If all green, you're stage-ready for Part 2.
