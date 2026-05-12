# EPIC 3 — `/asteroids` · Demo runbook (Part 2)

> Mirrors Jira project **`KAN`** (`feza 1`) on `ekipkalir.atlassian.net`.
> Parent Epic: **KAN-2** "/asteroids — Near-Earth Objects browser"
> Companions: `documents/EPICS_E3.md` (full breakdown), `documents/PART2_PLAN.md` (talk arc), `documents/ATLASSIAN_SETUP.md` (MCP wiring).

This file is the on-stage script for Part 2. Where Part 1 is "Claude Code can build a feature," Part 2 is **"Claude Code can carry a feature from spec → design → PR without the human breaking flow."**

> **For the demo itself, paste Prompt 2 from `documents/DEMO_EPI2_EPI3_PROMPTS.md` into Claude Code** (with the claude.ai/design hand-off bundle inserted at the bottom of the prompt). That prompt drives the full flow below in one step. This runbook is the human-readable mirror — read from it if Atlassian or claude.ai/design is unreachable.

## How Part 2 differs from Part 1

| Beat | Part 1 (Epic 2) | Part 2 (Epic 3) |
|---|---|---|
| Discover | (skipped — repo-only context) | `/atlassian:search-company-knowledge KAN-2` reads from real Jira |
| Design | Existing claude.ai/design "Incoming screen (Epic 2)" | New claude.ai/design Epic 3 frames + **Canva backup mockups** |
| Build | `/feza-route apod` × 1 + `/feza-component DatePicker` × 1 + edit | Same scaffold pattern, plus the no-scaffold lib-body case (KAN-6) |

The headline takeaway: **`/feza-from-jira` is the same skill in both parts** — what changes is the upstream half (Atlassian + Claude Design), not the build half.

## How the Part 2 demo flows

1. **Discover.** `/atlassian:search-company-knowledge KAN-2` — Claude reads Epic 3 and lists KAN-6/7/8.
2. **Design.** Open `claude.ai/design`, paste KAN-8's body + `tokens.json`, iterate twice ("make the hazardous flag a red pill"), click **Hand off to Claude Code**. Backup: Canva mockups linked per ticket below.
3. **Build.** Three `/feza-from-jira KAN-N` commands, in dependency order: KAN-7 (atom) → KAN-6 (lib body) → KAN-8 (page wiring).
4. **Ship.** `gh pr create --fill`. 4 GH workflows post checks. Merge.

---

## KAN-6 · Implement getAsteroids body in src/lib/nasa.ts

**Source:** E3-T2 · **Files:** `src/lib/nasa.ts` · **Parent:** KAN-2 · **Jira:** https://ekipkalir.atlassian.net/browse/KAN-6

### What

Fill in the `getAsteroids({ apiKey, startDate, endDate?, signal? })` function body. The signature and `NEO_BASE` constant are already pre-shipped in the repo as placeholders that throw "not implemented".

Calls `${NEO_BASE}/feed?start_date=...&end_date=...&api_key=...`, then maps the raw `near_earth_objects[date][]` arrays into a flat `AsteroidItem[]`. Returns `{ items, elementCount }`. Defaults `endDate` to `startDate` when omitted.

### Why this on stage — the no-scaffold case

This is **the ticket that proves `/feza-from-jira` is smart, not a one-trick scaffolder.** Claude reads the Jira description, recognises there's no skill to dispatch (the file already exists, the signature is already there), and just opens an `Edit` on `src/lib/nasa.ts`. Show the audience the skill's decision tree from `.claude/skills/feza-from-jira/SKILL.md` — Step 2's "no-scaffold" row.

### Acceptance

- `getAsteroids` body fills the existing stub at `src/lib/nasa.ts`
- Returns `{ items: AsteroidItem[], elementCount: number }`
- Maps raw NeoWs `near_earth_objects[date][]` → flat `AsteroidItem` (no nested-by-date shape leaks out)
- Defaults `endDate` to `startDate` when omitted
- Throws on non-200 with status code in message
- `make build` green; `make test` green (new test mocks fetch via `vi.spyOn`)

### Demo commands

```bash
/atlassian:search-company-knowledge KAN-6      # fetch — read aloud
/feza-from-jira KAN-6                          # build — no scaffold; just Edit
make test
```

### Claude Design reference

Not applicable — this is a pure backend lib edit. Skip the design beat for this ticket.

---

## KAN-7 · Add DateRangePicker component

**Source:** E3-T5 · **Skill:** `/feza-component DateRangePicker` · **Parent:** KAN-2 · **Jira:** https://ekipkalir.atlassian.net/browse/KAN-7

### What

Scaffold a `DateRangePicker` atom: two `<input type="date">` controls styled to match other feza atoms, with a max 7-day span constraint (NeoWs API limit) and `onChange({ start, end })`.

### Why this on stage

First "new component" ticket of Part 2. Comparable to KAN-4 (`DatePicker`) but with a clamping rule. Demonstrates that the same `/feza-component` skill works for any new atom, regardless of complexity — the **uniformity of the workflow**, not the cleverness of the skill.

### Acceptance

- `src/components/DateRangePicker/DateRangePicker.tsx` — `"use client"`, props `{ start?, end?, max? = 7, onChange({ start, end }) }`
- Selecting an `end` more than 7 days after `start` clamps to `start + 7`
- `src/components/DateRangePicker/DateRangePicker.module.scss` — matches token system
- `src/components/DateRangePicker/DateRangePicker.test.tsx` — covers value emission AND the clamp behaviour
- Storybook story for both default and clamped states
- `make test` green

### Demo commands

```bash
/atlassian:search-company-knowledge KAN-7
/feza-from-jira KAN-7                          # dispatches /feza-component DateRangePicker
make test
```

### Claude Design reference

- **Primary:** paste **Prompt 3** from `documents/CLAUDE_DESIGN_PROMPTS.md` into your `claude.ai/design` `feza` project. Suggested screen name: `DateRangePicker component (Epic 3)`.
- **Secondary (Canva):** the Canva MCP is connected and can generate graphic mockups (an earlier attempt sits in your [feza folder](https://www.canva.com/folder/FAHJNmcIUKM)). Not preferred for UI design work — on-palette generation needs Canva's Brand Kit feature, which requires a paid Canva plan.

---

## KAN-8 · Wire /asteroids page with AsteroidsPanel + Claude Design hand-off

**Source:** E3-T7 · **Files:** `src/app/asteroids/page.tsx`, `AsteroidsPanel.tsx`, `asteroids.module.scss` · **Parent:** KAN-2 · **Jira:** https://ekipkalir.atlassian.net/browse/KAN-8

### What

Replace the placeholder at `src/app/asteroids/page.tsx` with a server component that renders a client `AsteroidsPanel`. The panel: date-range picker (KAN-7) at the top, status row, then a grid of `AsteroidCard` instances inside `<PhotoGrid>` (reused from Epic 1). Each card shows name, close-approach date, diameter, miss distance, velocity, and a red `HazardousPill` if `is_potentially_hazardous_asteroid` is true.

### Why this on stage — the design hand-off ticket

The headline ticket of Part 2. Open `claude.ai/design` in a browser tab, paste the full ticket body and `tokens.json`, iterate twice with the audience watching the prototype refine in real time. Click **Hand off to Claude Code** — the export bundle becomes the prompt. Paste into terminal. The pattern: **design becomes a prompt, not a file format**.

### Acceptance

- `src/app/asteroids/page.tsx` is a server component (no `"use client"`), awaits `searchParams`
- `src/app/asteroids/AsteroidsPanel.tsx` is `"use client"`, uses `<DateRangePicker>` from KAN-7
- Reuses `<PhotoGrid>` from `src/components/PhotoGrid/`
- `AsteroidCard` shows name, close-approach date, diameter range, miss distance, velocity
- `HazardousPill` (red, ALL CAPS, "POTENTIALLY HAZARDOUS") visible on hazardous items only
- Loading state visible (`aria-busy`), error state visible
- `make build` green; `make test` green

### Demo commands

```bash
/atlassian:search-company-knowledge KAN-8      # fetch
# → switch to claude.ai/design, paste KAN-8 body + tokens.json, iterate, "Hand off to Claude Code"
/feza-from-jira KAN-8                          # build — dispatches /feza-route asteroids
# → paste the Claude Design hand-off into AsteroidsPanel.tsx
make test
git push -u origin feature/asteroids
gh pr create \
  --title "feat(asteroids): Near-Earth Objects" \
  --body "Built from KAN-6, KAN-7, KAN-8 via /feza-from-jira + design-handoff/epic-3/."
                                               # 4 workflows fire
```

### Claude Design reference

- **Primary (landing):** paste **Prompt 1** from `documents/CLAUDE_DESIGN_PROMPTS.md` into your `claude.ai/design` `feza` project. Suggested screen name: `Asteroids landing (Epic 3)`.
- **Primary (component spec):** paste **Prompt 2** from the same file for the isolated `<AsteroidCard>` spec sheet (default + hazardous + skeleton variants).
- **Secondary (Canva):** the Canva MCP is connected; earlier graphic mockups live in your [feza folder](https://www.canva.com/folder/FAHJNmcIUKM). Not preferred for UI mockups because the Canva editing API can't recolour shape fills after the fact, and on-palette generation via `brand_kit_id` requires Canva's paid Brand Kit feature. See `documents/CANVA_BRAND_KIT.md` for the recipe if you ever want to enable that path.

---

## Talk-arc cross-reference

These three tickets cover Part 2's Build beat (`documents/PART2_PLAN.md` minutes 28–38). The Discover (9–15) and Design (22–28) beats happen *before* you fire `/feza-from-jira`, then everything else in `documents/EPICS_E3.md` (E3-T1, T3, T4, T6, T8, T9) is either pre-staged or follow-up.
