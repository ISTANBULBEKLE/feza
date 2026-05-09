# PART2_PLAN.md — Talk Narrative (Part 2)

The "why" behind feza's Part 2. Companion to `FEZA_PLAN.md`. The original demo answers *"how does Claude Code build a feature?"* — Part 2 answers *"how does Claude Code carry a feature from spec to PR without the human breaking flow?"*

## Vision

Same `feza` repo, same engineer, same hour. Add the upstream half of the SDLC the original talk skipped: **Confluence spec → Jira backlog → Claude Design prototype → Claude Code → PR → Confluence status report**. The audience leaves with a runnable mental model of how Atlassian, Claude Design, and Claude Code compose without a single context switch out of the terminal (except for the design step, which is intentionally a browser tab).

The Part 2 live-coded epic is **Epic 3 — `/asteroids`** (NASA NeoWs Near-Earth Objects feed). It reuses Epic 2's date-driven shape with two new wrinkles: a date-range picker and a "potentially hazardous" pill — small enough to ship live, novel enough to need design.

## Three deliberate beats (Part 2 edition)

1. **Tools talk to your tracker, not just your repo.** The Atlassian Remote MCP is the same MCP pattern the audience already saw with Figma + GitHub — just pointed at Jira/Confluence. The mental model transfers.
2. **Skills compose.** `/atlassian:spec-to-backlog` (bundled) hands off to `/feza-from-jira` (custom) which hands off to `/feza-route` (existing). Three skills, one command each, zero glue code.
3. **Design is a conversation, not a tool.** `claude.ai/design` produces a prototype from a Jira ticket body in two iterations, then exports a packaged hand-off prompt straight into Claude Code. No Figma file, no PNG export, no token mismatch.

## 45-minute arc (Part 2)

| Min | Beat | On screen | Tools |
|---|---|---|---|
| 0–4 | Hook + Epic 1 tour (`/explore` already shipped) | Browser + code split | — |
| 4–9 | `CLAUDE.md` walkthrough | Terminal | — |
| 9–15 | **Discover.** `/atlassian:search-company-knowledge "asteroids feature spec"` returns the Confluence page with citations. Open in browser. | Terminal + Confluence | Atlassian MCP, `atlassian:search-company-knowledge` |
| 15–22 | **Decompose.** `/atlassian:spec-to-backlog <confluence-page-url>` drafts an Epic + 9 implementation tickets, asks for confirmation, creates them in Jira. Open the Jira board. | Terminal + Jira board | `atlassian:spec-to-backlog` |
| 22–28 | **Design.** Open `claude.ai/design`. Paste Jira ticket KAN-8 body + paste `tokens.json`. Iterate twice ("make the hazardous flag a red pill"). Click **Hand off to Claude Code**. | Browser → terminal | Claude Design |
| 28–38 | **Build.** `/feza-from-jira KAN-8` → dispatches `/feza-route asteroids`. Paste the Claude Design hand-off into the panel component. `make test`. Live-code lib (KAN-6) and the route handler. Address one Sonar finding. | Terminal | `/feza-from-jira`, `/feza-route`, `/feza-component`, `/eslint-check` |
| 38–42 | **Ship.** `git push -u origin feature/asteroids`, `gh pr create --fill`. 4 GH workflows post checks within ~2 min. | GitHub PR view | GitHub MCP |
| 42–45 | **Report.** Update Jira tickets to Done via MCP, then `/atlassian:generate-status-report` posts a Confluence summary. End slide: "you can run all of this Monday morning." | Terminal + Confluence | Atlassian MCP, `atlassian:generate-status-report` |

Time-budget contingency: if Atlassian OAuth re-prompts on stage, drop the `/atlassian:generate-status-report` beat — it's the most expendable.

## Pre-flight checklist (additions to FEZA_PLAN.md)

- [ ] `claude mcp list` shows `atlassian` (in addition to `figma-dev`, `github`, `playwright`)
- [ ] Demo runbooks `documents/EPIC_2_TICKETS.md` and `documents/EPIC_3_TICKETS.md` are open in a buffer for paste-on-stage
- [ ] Jira project `KAN` (`feza 1`) on `ekipkalir.atlassian.net` has 2 Epics (KAN-1, KAN-2) and 6 child tickets (KAN-3…KAN-8) in `To Do`, label `feza-demo`
- [ ] Atlassian admin has approved the `Claude` MCP client in admin settings (one-time)
- [ ] OAuth re-auth tested at the venue (cookies sometimes expire mid-day)
- [ ] `claude.ai/design` signed in on the demo browser
- [ ] `tokens.json` opened in a buffer ready to paste into Claude Design
- [ ] Backup screencast covers the Atlassian + Claude Design beats
- [ ] `NASA_API_KEY` covers NeoWs (same key works for APOD and NeoWs — both `api.nasa.gov`)
- [ ] `curl http://localhost:3000/api/asteroids` returns 501 (intentional placeholder)

## Risks & mitigations (additions)

| Risk | Mitigation |
|---|---|
| Atlassian OAuth prompts mid-demo | Re-authenticate the morning of; backup recording covers spec-to-backlog |
| `atlassian:spec-to-backlog` produces wrong-shaped tickets on stage | Pre-write the Confluence spec carefully (mirror `documents/EPICS_E3.md`); confirm step shows the human-in-the-loop |
| `claude.ai/design` rate-limits or auth-fails | Have one prototype iteration screenshotted as fallback |
| MCP tool ambiguity ("which Jira tool is Claude calling?") | `/mcp` shows the active tool name; narrate it as it happens — turns a risk into pedagogy |
| Two MCPs (Atlassian + GitHub) compete for OAuth tokens | Independent OAuth flows; `claude mcp list` shows two `connected` rows |

## Out of scope (Part 2)

JSM (Jira Service Management) intake. Confluence whiteboards. Compass. Atlassian admin governance. Atlassian apps marketplace. These are mentioned in passing — never live-coded.

## Success metrics (Part 2)

| Metric | Target | How measured |
|---|---|---|
| "I'll wire Atlassian MCP this week" | 5+ verbatim audience quotes | Post-talk feedback |
| Repo clones with `documents/ATLASSIAN_SETUP.md` referenced | 20%+ of clones in 24h read it | GitHub traffic |
| Cross-tool composition reuse | 1+ viewer ships a `/spec-to-backlog → custom-skill → existing-scaffold` chain in their own repo | Inbound mentions |

## References

- `documents/ATLASSIAN_SETUP.md` — wiring the Atlassian Remote MCP into Claude Code
- `documents/EPICS_E3.md` — Epic 3 ticket-by-ticket breakdown
- `documents/EPIC_2_TICKETS.md`, `documents/EPIC_3_TICKETS.md` — demo runbooks (the on-stage script)
- `documents/CLAUDE_DESIGN_PROMPTS.md` — paste-ready prompts for the claude.ai/design screens
- `documents/INTEGRATION_STEPS_PLAN.md` § Step 4 — Atlassian MCP (short version)
- `.claude/skills/feza-from-jira/SKILL.md` — the orchestration skill
