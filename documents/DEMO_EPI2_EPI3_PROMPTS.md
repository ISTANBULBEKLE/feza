# DEMO_EPI2_EPI3_PROMPTS.md

Stage prompts for the live-coded beats of Parts 1 and 2. Paste each fenced block into Claude Code at the **root of the `feza` repo** when you're ready to live-code that epic. Both assume:

- Atlassian MCP is authenticated (`claude mcp list` shows `plugin:atlassian:atlassian: ✓ Connected`)
- The Jira project `KAN` (`feza 1`) on `ekipkalir.atlassian.net` has the pre-staged Epics and child tickets (KAN-1 + KAN-3/4/5 and KAN-2 + KAN-6/7/8)
- `make build` and `make test` are green from the design-system update; `/apod` and `/asteroids` are placeholders waiting to be filled in
- Skills `/feza-route`, `/feza-component`, `/feza-from-jira`, `/eslint-check`, `/atlassian:search-company-knowledge` are loaded

If anything in those preconditions is red, fix it before pasting — the prompts assume they hold.

---

## Prompt 1 — Epic 2 · `/apod` (Part 1, ~10 min on stage)

Paste this block. Claude will fetch the tickets, then build them in order. No design hand-off needed for Part 1 — your existing `claude.ai/design` "Incoming screen (Epic 2)" already covers the visual brief.

```
Build Epic 2 — the /apod (Astronomy Picture of the Day) feature for the feza talk Part 1 demo.

SOURCE OF TRUTH
Jira project KAN on ekipkalir.atlassian.net. Parent Epic KAN-1 with three child tickets: KAN-3, KAN-4, KAN-5. The full 9-ticket spec lives in documents/EPICS.md § Epic 2; documents/EPIC_2_TICKETS.md is the demo runbook. Read those if anything in Jira is ambiguous.

STEP 0 — SEED THE DESIGN CONTRACT
Read design-handoff/epic-2/README.md and design-handoff/tokens.css. These are the visual + token contract for Epic 2. Treat them as authoritative — globals.scss must match tokens.css, not the other way around. Use them as the spec when building KAN-3/4/5 in Step 2.

STEP 1 — FETCH
Run /atlassian:search-company-knowledge KAN-1
Read the Epic description aloud. Then list the three children (KAN-3, KAN-4, KAN-5) with their summaries and acceptance criteria — the audience needs to see what we're about to build.

STEP 2 — BUILD IN ORDER
Create branch: git checkout -b feature/apod

KAN-3 — Scaffold /apod page + /api/apod route
  /feza-from-jira KAN-3
  make test    (must stay green)

KAN-4 — Add DatePicker component
  /feza-from-jira KAN-4
  make test    (new tests included)

KAN-5 — Wire ApodPanel with the date-vs-random toggle
  /feza-from-jira KAN-5
  make test
  Reuse <PhotoGrid> from src/components/PhotoGrid/. Do NOT create a new grid — that's the audience-facing "skills compose" beat.

STEP 3 — VERIFY
  make build                                            (Turbopack catches type errors npm run dev hides)
  curl http://localhost:3000/api/apod?date=2026-05-10   (expect 200 + JSON)

CONSTRAINTS
- Follow CLAUDE.md conventions verbatim. Light theme is canonical. SCSS modules only.
- Reference colours, weights, and shadows via CSS custom properties (--accent, --foreground, --fz-weight-heading, --shadow-md, etc.) — no inline hex values.
- Apply .fz-shine to the /apod page H1 to match the rest of the app.
- After each ticket, report make test results before moving on. If something fails, stop and ask before continuing.
- Do NOT push or open a PR. Stage everything on feature/apod. The "git push -u origin feature/apod && gh pr create --fill" beat is a separate command we'll run together at the end.
```

---

## Prompt 2 — Epic 3 · `/asteroids` (Part 2, ~12 min on stage)

The design hand-off lives in `design-handoff/epic-3/` (already exported). The prompt seeds it in Step 0, so paste-and-send works without touching the browser. (If you want to show lineage during §1.3's tab tour, that's the moment for claude.ai/design — not here.)

```
Build Epic 3 — the /asteroids (Near-Earth Objects) feature for the feza talk Part 2 demo.

This is the headline live-coded beat: Confluence-or-Jira spec → Claude Design hand-off → Claude Code → green tests → PR.

SOURCE OF TRUTH
Jira project KAN on ekipkalir.atlassian.net. Parent Epic KAN-2 with three child tickets: KAN-6 (lib body, no scaffold), KAN-7 (DateRangePicker atom), KAN-8 (page wiring + the design hand-off seeded in Step 0). Full 9-ticket spec in documents/EPICS_E3.md; demo runbook in documents/EPIC_3_TICKETS.md.

STEP 0 — SEED THE DESIGN CONTRACT
Read design-handoff/epic-3/README.md and design-handoff/tokens.css. These are the visual + token contract for Epic 3 — AsteroidCard, HazardousPill, DateRangePicker, AsteroidsPanel, and the /asteroids page layout. Treat them as authoritative — globals.scss must match tokens.css, not the other way around. Use them as the spec when building KAN-7/6/8 in Step 2.

STEP 1 — FETCH
Run /atlassian:search-company-knowledge KAN-2
Read the Epic description aloud. Then list KAN-6, KAN-7, KAN-8 with their acceptance criteria.

STEP 2 — BUILD IN DEPENDENCY ORDER
Create branch: git checkout -b feature/asteroids

KAN-7 — Add DateRangePicker component (atom must exist before the page consumes it)
  /feza-from-jira KAN-7
  make test
  Two date inputs side by side, max 7-day span, clamp end to start + 7 days. Tests cover value emission AND the clamp behaviour.

KAN-6 — Implement getAsteroids body in src/lib/nasa.ts
  This is the no-scaffold ticket. /feza-from-jira recognises that the function signature, NEO_BASE constant, and stub are already pre-shipped — it should NOT scaffold a new file, just open an Edit on the existing src/lib/nasa.ts.
  /feza-from-jira KAN-6
  make test
  Map the raw NeoWs near_earth_objects[date][] response into a flat AsteroidItem[]. Default endDate to startDate when omitted.

KAN-8 — Wire /asteroids page with AsteroidsPanel
  Use the Claude Design hand-off pasted at the bottom of this message as the structural reference for the panel.
  /feza-from-jira KAN-8
  make test
  Reuse <PhotoGrid> from src/components/PhotoGrid/. The HazardousPill atom doesn't have its own ticket — create it inline in AsteroidsPanel using bg var(--danger), color var(--on-accent), pill radius. If there's time, scaffold it via /feza-component HazardousPill instead.

STEP 3 — VERIFY
  make build
  curl 'http://localhost:3000/api/asteroids?start_date=2026-05-10&end_date=2026-05-15'   (expect 200 + JSON, hazardous items mapped through correctly)

CONSTRAINTS
- Follow CLAUDE.md verbatim. Light theme is canonical. SCSS modules only. CSS custom properties for every colour / weight / shadow — no inline hex.
- Apply .fz-shine to the /asteroids page H1.
- After each ticket, report make test results before moving on.
- The placeholder src/app/asteroids/page.tsx + src/app/api/asteroids/route.ts pre-shipped in the repo are the starting point — replace, don't duplicate.
- Do NOT push or open a PR. Stage on feature/asteroids. We'll run "git push -u origin feature/asteroids && gh pr create --fill" together as the closing flourish.

REFERENCES
- documents/EPIC_3_TICKETS.md — per-ticket runbook
- documents/EPICS_E3.md — full 9-ticket spec
- documents/CLAUDE_DESIGN_PROMPTS.md — the prompts that produced the screens in claude.ai/design
- design-handoff/epic-3/ — the exported design contract (already seeded in Step 0)
```

---

## Stage choreography

| Time | Beat | Action |
|---|---|---|
| Just before Prompt 1 | "Here's the spec, in Jira." | Show the KAN board on the projector — KAN-1 + 3 children, label `feza-demo`. |
| Prompt 1 | Build Epic 2 | Paste Prompt 1. ~10 min: seed → fetch → 3 tickets → green tests. |
| After Prompt 1 | Push, CI, follow-up tests, merge | Per FEZA_DEMO_INSTRUCTIONS §3.5–§3.7. |
| Prompt 2 | Build Epic 3 | Paste Prompt 2. ~12 min: seed (local design hand-off) → fetch → 3 tickets → green tests. |
| After Prompt 2 | Push, CI, follow-up tests, merge | Per FEZA_DEMO_INSTRUCTIONS §4.5–§4.7. |
| Closing | "And the report." | `/atlassian:generate-status-report` (optional; drop if time is tight). |

## Backup if something stalls

- **Atlassian MCP fails to fetch** → read straight from `documents/EPIC_2_TICKETS.md` / `documents/EPIC_3_TICKETS.md`; the per-ticket descriptions mirror the Jira bodies.
- **`claude.ai/design` won't open or auth lapses** → only affects §1.3's tab tour. Build still runs (it uses `design-handoff/` locally). Point at `design-handoff/epic-N/preview.standalone.html` in the browser as the visual reference.
- **A ticket's `/feza-from-jira` produces wrong-shaped code** → bail out, drop to manual `/feza-route` or `/feza-component` invocation per the runbook.
- **`make test` red** → narrate the failure, fix in front of the audience (this is good content; quality gates are entertainment, not blockers).
