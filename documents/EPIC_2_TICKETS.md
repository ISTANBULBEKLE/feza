# EPIC 2 — `/apod` · Demo runbook (Part 1)

> Mirrors Jira project **`KAN`** (`feza 1`) on `ekipkalir.atlassian.net`.
> Parent Epic: **KAN-1** "NASA /apod api — Astronomy Picture of the Day"
> Companion: `documents/EPICS.md` § Epic 2 (full 9-ticket breakdown).

This file is the on-stage script for Part 1 of the talk. The audience watches Claude fetch each ticket via the Atlassian MCP, then build it via the feza scaffold skills.

> **For the demo itself, paste Prompt 1 from `documents/DEMO_EPI2_EPI3_PROMPTS.md` into Claude Code.** That prompt drives the full flow below in one step. This runbook is the human-readable mirror — read from it if Atlassian is unreachable.

## How the Part 1 demo flows

1. **Discover.** Show Jira board on the projector — KAN-1 + 3 children, all `To Do`, label `feza-demo`.
2. **Fetch.** In terminal: `/atlassian:search-company-knowledge KAN-1` — Claude reads the Epic and lists its children with summaries.
3. **For each ticket below:** type the **Fetch** command, then the **Build** command. Watch tests stay green between tickets.
4. **Ship.** `git push -u origin feature/apod && gh pr create --fill` — the 4 GitHub workflows post checks.

Backup: if Jira is unreachable, read straight from this file. The text mirrors the Jira description verbatim.

---

## KAN-3 · Scaffold /apod page + /api/apod route

**Source:** E2-T2 · **Skill:** `/feza-route apod` · **Parent:** KAN-1 · **Jira:** https://ekipkalir.atlassian.net/browse/KAN-3

### What

Scaffold the App Router page and paired Route Handler for `/apod`, following feza's three-file component pattern.

### Why this on stage

First live ticket of Part 1. Demonstrates that a custom skill (`/feza-route`) replaces ~5 minutes of typing boilerplate with one command. The audience watches Claude generate `page.tsx`, `ApodPanel.tsx`, the SCSS module, and `route.ts` — all matching the conventions in `CLAUDE.md`.

### Acceptance

- `src/app/apod/page.tsx` exists, server component, awaits `searchParams`
- `src/app/apod/ApodPanel.tsx` exists with `"use client"`
- `src/app/apod/apod.module.scss` exists
- `src/app/api/apod/route.ts` exists; returns 400 on missing params (placeholder body OK)
- `make build` green; `make test` green

### Demo commands

```bash
/atlassian:search-company-knowledge KAN-3      # fetch — read the ticket aloud
/feza-from-jira KAN-3                          # build — dispatches /feza-route apod
make test                                      # green = punctuation
```

### Claude Design reference

Existing screen: **"Incoming screen (Epic 2)"** in your `claude.ai/design` "feza" project. No design hand-off needed for this ticket — it's pure scaffolding.

---

## KAN-4 · Add DatePicker component

**Source:** E2-T5 · **Skill:** `/feza-component DatePicker` · **Parent:** KAN-1 · **Jira:** https://ekipkalir.atlassian.net/browse/KAN-4

### What

Scaffold a `DatePicker` atom that wraps `<input type="date">`, styled to match the existing `Select` and `Button` atoms.

### Why this on stage

Second live ticket. Shows the **component-scaffold skill chain** — one command produces three co-located files in `src/components/DatePicker/` (the `.tsx`, the `.module.scss`, the `.test.tsx`). The audience sees feza's "one folder per component" convention enforced by the skill, not by discipline.

### Acceptance

- `src/components/DatePicker/DatePicker.tsx` — `"use client"`, props `{ min?, max?, value?, onChange(YYYY-MM-DD) }`
- `src/components/DatePicker/DatePicker.module.scss` — matches token system in `tokens.json`
- `src/components/DatePicker/DatePicker.test.tsx` — covers value emission on change
- `make test` green (new test passes)

### Demo commands

```bash
/feza-from-jira KAN-4                          # dispatches /feza-component DatePicker
make test
```

### Claude Design reference

- **Primary:** existing "Incoming screen (Epic 2)" in your `claude.ai/design` `feza` project already shows the date input in context.
- **Optional component spec:** if you want a focused isolated DatePicker view, paste **Prompt 4** from `documents/CLAUDE_DESIGN_PROMPTS.md`. Suggested screen name: `DatePicker component (Epic 2)`.

---

## KAN-5 · Wire ApodPanel — single-date vs random-N toggle

**Source:** E2-T6 · **Files:** `src/app/apod/ApodPanel.tsx` · **Parent:** KAN-1 · **Jira:** https://ekipkalir.atlassian.net/browse/KAN-5

### What

Wire the `ApodPanel` client component: a mutually-exclusive toggle between "single date" (uses `<DatePicker>` from KAN-4) and "random N" (uses a numeric slider). On submit, fetches `/api/apod?date=...` or `/api/apod?count=N`, then renders results in `<PhotoGrid>` (reused from Epic 1).

### Why this on stage

Third live ticket. Demonstrates **component reuse** — `<PhotoGrid>` is already in `src/components/PhotoGrid/`, no scaffold needed. The audience sees Claude recognise the existing component and import it directly. This is the moment to highlight the "skills compose; CLAUDE.md remembers what's already built" beat.

### Acceptance

- `<ApodPanel>` renders both modes (toggle visible, mutually exclusive)
- On submit: calls `/api/apod` with the right query string
- Reuses `<PhotoGrid>` from `src/components/PhotoGrid/` — does NOT create a new grid
- Loading state visible (`aria-busy`), error state visible
- `make test` green (new ApodPanel render test)

### Demo commands

```bash
/feza-from-jira KAN-5                          # no scaffold; dispatches an Edit on ApodPanel.tsx
make test
git push -u origin feature/apod
gh pr create --fill                            # 4 workflows fire; merge after Claude review
```

### Claude Design reference

Existing "Incoming screen (Epic 2)" already shows the toggle layout — match it.

---

## Talk-arc cross-reference

These three tickets cover the **Build** beat of Part 1's 45-min arc (`documents/FEZA_PLAN.md` minutes 15–32). The other 6 Epic 2 tickets in `documents/EPICS.md` (E2-T1, T3, T4, T7, T8, T9) are not live-coded — they're the surrounding "we built this before stage" context.
