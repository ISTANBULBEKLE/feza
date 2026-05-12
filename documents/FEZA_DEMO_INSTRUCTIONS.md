# feza — Live Demo Runbook (Epic 2 + Epic 3)

> One-page execution guide for the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*
>
> Companions:
> - [PART2_PLAN.md](PART2_PLAN.md) / [FEZA_PLAN.md](FEZA_PLAN.md) — talk narrative.
> - [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md) — per-ticket detail; **also serve as offline backup** if Atlassian is unreachable.
> - [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) — one-prompt shortcuts for Part 1 and Part 2.
> - [ATLASSIAN_SETUP.md](ATLASSIAN_SETUP.md) — Atlassian Remote MCP wiring.
> - [../design-handoff/](../design-handoff/) — the **canonical** design contract for the live demo. `tokens.css`, per-epic READMEs with Claude Code prompts, and `preview.standalone.html` visual references all live here.
> - [CLAUDE_DESIGN_PROMPTS.md](CLAUDE_DESIGN_PROMPTS.md) — *historical.* The original briefs sent to `claude.ai/design`; the rendered output now lives in `design-handoff/`. Don't pull design from here during the demo.

**You run the demo from Claude Code inside VS Code's integrated terminal.** One window, three split panes + one browser:

- **Pane A** (left, large) — `claude` REPL at repo root. Audience-facing.
- **Pane B** (right top) — empty; `/feza-dev` will run here.
- **Pane C** (right bottom) — empty; `git` / `gh` commands at the end of each part.
- **Browser** (second monitor) — three pinned tabs: `http://localhost:3000`, Jira `KAN` board on `ekipkalir.atlassian.net`, `claude.ai/design` "feza" project.

> VS Code shortcut: `Cmd+\`` opens an integrated terminal; click the **split** icon (or `Cmd+\`) twice to get three panes. The Claude Code VS Code extension panel (Cmd+Esc) is optional — skip it for minimal screen real-estate.

---

## 0. Day-of pre-flight (morning of the talk)

Run through this while your coffee brews. Most failure modes are caught here, not on stage.

```bash
# Repo is clean and current
git checkout main && git pull
git branch -D feature/apod feature/asteroids feature/kan-3-apod-scaffold 2>/dev/null

# Worktrees from rehearsals can spoil a clean `git status` screen on stage
rm -rf .claude/worktrees/*

git status                                # expect: working tree clean

# Close any rehearsal PRs (Sonar-red rehearsal PRs left open are fine to close)
gh pr list --state open --author @me
# gh pr close <N> --delete-branch         # for each rehearsal PR

# Build + tests green on main
npm install
make build
make test

# Claude Code + MCP are healthy
claude --version
claude mcp list                           # expect: plugin:atlassian:atlassian … ✓ Connected
                                          #         claude.ai Canva … ✓
                                          #         claude.ai Figma … ✓
                                          # any "Needs authentication" → re-auth NOW, not on stage

# Smoke the dev server (boot + APOD route)
make dev &
sleep 4
curl -s http://localhost:3000/ | grep -q 'feza' && echo "dev OK"
# Pre-stage the route is the 501 placeholder stub (`{"error":"not implemented …"}`).
# After Part 1's build flow, the same curl returns the real NASA payload.
curl -s "http://localhost:3000/api/apod?date=2026-05-10" | head -c 200
make stop

# design-handoff is intact
ls design-handoff/epic-2/preview.standalone.html design-handoff/epic-3/preview.standalone.html
```

Environment:

```bash
# .env.local must exist and contain a real NASA key.
# Do NOT fall back to DEMO_KEY — its 30 req/hr cap will brick the live demo.
grep '^NASA_API_KEY=' .env.local
```

External systems checklist:

- **Jira `KAN` project** on `ekipkalir.atlassian.net`: KAN-1..KAN-8 all in `To Do`, label `feza-demo`. Spot-check inside Claude Code:
  ```
  /atlassian:search-company-knowledge KAN-3
  /atlassian:search-company-knowledge KAN-6
  ```
- **`claude.ai/design`** signed in, **"feza"** project open. Confirm the prototype screens are visible:
  - **"Incoming screen (Epic 2)"** — /apod brief.
  - **"Asteroids landing (Epic 3)"** — /asteroids brief.
  - **"AsteroidCard component (Epic 3)"** — atom spec.
  - **"DateRangePicker component (Epic 3)"** — atom spec.
  - **"DatePicker component (Epic 2)"** — optional supporting view.
- **`design-handoff/tokens.css`** is the **authoritative** token source for tomorrow's build. Spot-check that `src/app/globals.scss` matches its values (run `diff` if unsure).
- **Backup screencast** queued for the Atlassian beat (in case the network bites).
- **Claude Cowork** desktop app installed and logged in (used for the 60s parity beat in §1.2).

---

## 1. Stage opening — initial walkthrough (~6 min)

Before any coding. This is where the audience meets Claude Code, sees its surfaces, and learns where the design contract and the project constitution live.

### 1.1 Open Claude Code, show the surfaces

In **Pane A**:

```bash
cd ~/Projects/Personal/feza
claude
```

Run these in order — narrate one line each. Total ~2 min:

```
/context        # token budget + model — sets expectation for context window
/login          # account; mention "/logout exists for shared machines"
/memory         # opens CLAUDE.md — the project constitution (slide 6)
/skills         # lists the 10 project skills + plugin skills (slide 4 — Skills)
/mcp            # Atlassian ✓, Canva ✓, Figma ✓ (slide 4 — MCP Servers)
```

> Narration beat after `/skills`: *"Each of these is a SKILL.md playbook. Claude reads them when the task matches — or when I invoke them as a slash command. Slide 4 calls these the verbs Claude can use."*

### 1.2 Cowork parity beat (~60s)

Switch to **Claude Cowork** desktop app. Run:

```
/context
```

Narrate: *"Same session model, different surface. Cowork is the desktop sibling for non-coding work — file org, research, reports. The engine is the same; the affordances are tuned for knowledge workers, not developers."* Close Cowork. Back to VS Code.

### 1.3 claude.ai/design tab tour (~90s)

Browser → claude.ai/design → **"feza"** project. Flip through, narrating each:

- **"Incoming screen (Epic 2)"** — the /apod brief.
- **"Asteroids landing (Epic 3)"** — the /asteroids brief.
- **"AsteroidCard component (Epic 3)"** — atom spec.
- **"DateRangePicker component (Epic 3)"** — atom spec.
- Briefly show `design-handoff/tokens.css` in VS Code — *"these tokens are the contract. `claude.ai/design` produced them, the repo holds the export, and `globals.scss` consumes them. Single source of truth, locally available."*

Land the handover: *"I've already exported these prototypes into the repo at `design-handoff/`. That's our design contract — Claude Code reads it locally during the build. No tab-switching required mid-flow."*

### 1.4 VS Code folder walk (~90s)

In VS Code Explorer, open and narrate each:

- `CLAUDE.md` — *"slide 11's constraints, in writing. SCSS modules only, server components by default, await `params` / `searchParams`, NASA_API_KEY server-only."*
- `.claude/skills/` — open `feza-from-jira/SKILL.md` briefly. *"This is the skill that reads a Jira ticket and dispatches to the right scaffold skill."*
- `.claude/settings.json` — show the **PostToolUse ESLint hook** (preview of §2).
- `src/app/` — *"routes plus route-specific client panels — `page.tsx`, `route.ts`, `proxy.ts`, and a colocated `<Segment>Panel.tsx` (Client Component) where the page needs interactivity. Epic 1's `/explore` already shows this pattern with `ExplorePanel.tsx`."*
- `src/components/PhotoGrid/` — the three-file pattern (`.tsx` + `.module.scss` + `.test.tsx`). This is the component we'll reuse in both epics.
- `design-handoff/epic-2/README.md` and `design-handoff/epic-3/README.md` — *"the design hand-off, written as markdown prompts. Claude reads these the same way it reads any other input."*
- `.github/workflows/` — the four CI gates (slide 12): `lint.yml`, `chromatic.yml`, `sonarcloud.yml`, `claude-pr-review.yml`.

---

## 2. The hook — live, on-stage (teaching moment)

The "and one more thing" beat between Skills and the build. Insert it just before Part 1.

> **Script:** *"We've seen the rules — that's CLAUDE.md. We've seen the verbs — that's skills. Hooks are the enforcement layer: shell commands the harness runs on tool events. Watch what happens if I add a `PostToolUse` hook that lints every file Claude writes."*

The hook is already wired in [`.claude/settings.json`](../.claude/settings.json) — show it in VS Code:

```jsonc
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [
        {
          "type": "command",
          "command": "f=$(jq -r '.tool_input.file_path // empty'); case \"$f\" in *.tsx|*.ts|*.scss) npx --no-install eslint --max-warnings 0 --no-warn-ignored \"$f\" 2>&1 ;; esac; true",
          "timeout": 30,
          "statusMessage": "Linting changed file"
        }
      ]
    }
  ]
}
```

The next `Edit` or `Write` Claude performs on `.tsx` / `.ts` / `.scss` fires ESLint on that one file. The audience reaction is loudest when ESLint flags a CLAUDE.md violation and Claude **self-corrects on the next turn without you typing anything**.

---

## 3. PART 1 — Epic 2 (`/apod`)

> Build the Astronomy Picture of the Day page from three Jira tickets (KAN-3, KAN-4, KAN-5) on **one branch, one PR**. ~15 min build + ~3 min follow-up tests + merge.
> **Shortcut:** paste **Prompt 1** from [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) to drive §3.2–§3.4 in one go.

### 3.1 — Cut the branch, start the dev server, fetch the Epic

In **Pane C**:

```bash
git checkout -b feature/apod
```

In **Pane A** (Claude Code):

```
/feza-dev                                  # starts Next.js + Turbopack on :3000 in Pane B
/atlassian:search-company-knowledge KAN-1  # reads Epic body + KAN-3/4/5 summaries aloud
```

> **Backup:** if the MCP times out, read straight from [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) — it mirrors Jira verbatim.

### 3.2 — Seed Claude Code with the design hand-off

```
Read design-handoff/epic-2/README.md and design-handoff/tokens.css. These are the visual + token contract for Epic 2. Treat them as authoritative — globals.scss must match tokens.css, not the other way around. Use them as the spec when building KAN-3/4/5 next.
```

Optional: `open design-handoff/epic-2/preview.standalone.html` (second monitor) for the audience to see the visual reference.

> Narration: *"This is the design hand-off. In a previous session I prototyped these screens on claude.ai/design and exported them here. Claude Code reads them locally — no live browser-design beat needed during the build."*

### 3.3 — Build in order

```
/feza-from-jira KAN-3      # scaffolds page + API route handler; watch the hook lint each write
make test

/feza-from-jira KAN-4      # scaffolds DatePicker (.tsx + .module.scss + .test.tsx + stories)
make test

/feza-from-jira KAN-5      # wires ApodPanel, reuses <PhotoGrid> — call this out loud
make test
```

> KAN-3 dispatches `/feza-route apod` → `src/app/apod/page.tsx` (async, awaits `searchParams`), `ApodPanel.tsx` (`"use client"`, empty stub), `ApodPanel.module.scss`, `/api/apod/route.ts` (stub returning `{ ok: true }`). The skill also cleans up the staged `placeholder.module.scss`.
> KAN-4 dispatches `/feza-component DatePicker` + `/feza-story`. The bare component is `{ className, children }` — Claude then live-codes it into the KAN-4 shape (`{ id, label, value?, min?, max?, onChange }`, `<input type="date">`).
> KAN-5 has no scaffold — Claude reads the ticket, recognises the panel already exists from KAN-3, and opens an `Edit` to wire the toggle, fetch, and `<PhotoGrid>` reuse. **Beat to call out:** *"Claude knows from CLAUDE.md and the file tree that PhotoGrid already exists. Component reuse is enforced, not encouraged."* KAN-5 also typically includes wiring `/api/apod/route.ts` to call `getApod()` (already shipped in `src/lib/nasa.ts`) — otherwise the panel renders the empty state.

### 3.4 — Type-safe build + browser smoke

```bash
make build                                          # Turbopack hides type errors; this catches them
curl http://localhost:3000/api/apod?date=2026-05-10 # expect 200 + JSON
```

Open `http://localhost:3000/apod` in browser. Pick a date. Watch the photo render. Walk the audience through the component tree (`<ApodPanel>` → `<DatePicker>` + `<PhotoGrid>`).

### 3.5 — Push and open the Pull Request

In **Pane C**:

```bash
git add .
git commit -m "feat(apod): build /apod from KAN-1 (KAN-3/4/5)"
git push -u origin feature/apod
gh pr create \
  --title "feat(apod): Astronomy Picture of the Day" \
  --body "Built from KAN-3, KAN-4, KAN-5 via /feza-from-jira. Design hand-off from design-handoff/epic-2/."
```

### 3.6 — Watch the four CI gates + summon Claude on demand

Three workflows fire automatically:

| # | Workflow | Expected on this commit |
|---|---|---|
| 1 | `lint.yml` (ESLint flat config) | **green** |
| 2 | `chromatic.yml` (Storybook visual baseline) | **green** |
| 3 | `sonarcloud.yml` (Quality Gate) | **red on "Coverage on New Code"** — scaffolds are placeholders. We fix this in §3.7. |

Then summon the Claude review by posting an `@claude` PR comment — the action only fires on mention, so accidental pushes don't burn your free-tier Claude Code quota:

```bash
gh pr comment <PR_NUMBER> --body "@claude please review this PR"
```

> Narration beat: *"Claude reviews when you summon it — like a senior reviewer you @mention, not a watcher on every push."* The `claude-pr-review.yml` action runs the `/review-pr` skill once and posts findings as a single PR comment. Read the posted review aloud once it lands.

While CI runs, fire the local rehearsal:

```bash
make pr-review PR=<N>       # same /review-pr skill — your insurance if CI flakes
```

### 3.7 — Follow-up tests commit → Sonar green → merge

Sonar's red because the scaffolds have no test bodies. We ship the follow-up in front of the audience.

**Step 1 — ask Claude to fill in the test bodies.** In **Pane A**, paste:

```
Fill in the test bodies for Epic 2 so SonarCloud's "Coverage on New Code" gate flips green. New-code coverage target is ≥80%.

Target test files (already scaffolded — fill the bodies, don't recreate):
- src/components/DatePicker/DatePicker.test.tsx
    → renders with value, fires onChange on change, respects disabled, clamps to max
- src/app/apod/ApodPanel.test.tsx (create if missing — same folder, "use client" component)
    → renders both modes, toggling switches inputs, submit calls /api/apod with date OR count,
      loading state sets aria-busy, error state renders message, clicking a card swaps featured
- src/app/api/apod/route.test.ts (create if missing — colocated with route.ts)
    → 400 on missing date AND count, 200 + JSON on valid date, 200 + JSON on valid count,
      surfaces the upstream error as 502 when fetch fails

Constraints:
- Use Vitest + @testing-library/react. jsdom is already configured.
- Mock fetch via vi.spyOn(globalThis, "fetch") — no MSW.
- Keep scaffolds untouched; only add/fill test files.
- Run `make test` after each file to confirm green. If a render needs a wrapper, add it minimally.

When done, run `make coverage` and report the "Coverage on New Code" percentage so I can confirm we're above 80% before pushing.
```

**Step 2 — verify locally before pushing.** In **Pane C**:

```bash
make test                                                # all tests green
make coverage                                            # produces coverage/lcov.info; prints summary
# Optional belt-and-braces:
# /sonar-scan                                            # runs the local Sonar scan; quality-gate verdict
```

> If `make coverage` reports < 80% on the new files, ask Claude to add the missing assertions before pushing — cheaper than a third commit.

**Step 3 — commit, push, watch CI.** In **Pane C**:

```bash
git add src/components/DatePicker/DatePicker.test.tsx \
        src/app/apod/ApodPanel.test.tsx \
        src/app/api/apod/route.test.ts
git commit -m "test(apod): cover DatePicker, ApodPanel, /api/apod route"
git push                                                 # CI re-runs all 4 workflows

gh pr checks <PR_NUMBER> --watch                         # blocks until every gate resolves
```

**Step 4 — merge once green.** In **Pane C**:

```bash
gh pr merge <PR_NUMBER> --squash --delete-branch
git checkout main && git pull                            # main now contains /apod
```

> Narration: *"That's the real loop. Scaffold, push, see the gate red, ship the follow-up, see the gate green, merge. The first PR doesn't always pass on the first run — and that's fine, because every gate is a signal, not a wall."*

---

## 4. PART 2 — Epic 3 (`/asteroids`)

> Confluence-or-Jira spec → design-handoff → Code → PR → merge. ~15 min build + ~3 min follow-up tests + merge on a **fresh branch from `main`**.
> **Shortcut:** paste **Prompt 2** from [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) to drive §4.2–§4.4.

### 4.1 — Cut a fresh branch, fetch Epic 3

In **Pane C**:

```bash
git checkout -b feature/asteroids
```

In **Pane A**:

```
/atlassian:search-company-knowledge KAN-2
```

> Reads Epic 3 and lists KAN-6 / KAN-7 / KAN-8.
> **Backup:** read from [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md) if MCP times out.

### 4.2 — Seed Claude Code with the design hand-off

```
Read design-handoff/epic-3/README.md and design-handoff/tokens.css. These are the visual + token contract for Epic 3 — AsteroidCard, HazardousPill, DateRangePicker, AsteroidsPanel. Use them as the spec when building KAN-7/6/8 next.
```

Optional: `open design-handoff/epic-3/preview.standalone.html` on the second monitor.

### 4.3 — Build in dependency order

Atoms before composites. The order is **KAN-7 (atom) → KAN-6 (lib body) → KAN-8 (page + design)**.

```
/feza-from-jira KAN-7      # /feza-component DateRangePicker + clamp behaviour + story
make test

/feza-from-jira KAN-6      # NO-SCAFFOLD case — opens Edit on src/lib/nasa.ts
make test

/feza-from-jira KAN-8      # /feza-route asteroids, wires AsteroidsPanel + HazardousPill
make test
```

> **KAN-6 is the audience-favourite beat.** The `getAsteroids` signature, `NEO_BASE` constant, and stub are already pre-shipped. `/feza-from-jira` reads the ticket, sees there's no skill to dispatch, and just opens an `Edit`. Show the decision table in [.claude/skills/feza-from-jira/SKILL.md](../.claude/skills/feza-from-jira/SKILL.md) — Step 2's "no-scaffold" row.
>
> **KAN-8** wires the page using the design hand-off you seeded at §4.2. If `HazardousPill` doesn't get its own ticket-driven scaffold, drop to `/feza-component HazardousPill` inline before continuing.

### 4.4 — Type-safe build + browser smoke

```bash
make build
curl "http://localhost:3000/api/asteroids?start_date=2026-05-10&end_date=2026-05-15" | head -c 200
```

Open `http://localhost:3000/asteroids`. Pick a date range. Show the hazardous pill rendering for at least one NEO.

### 4.5 — Push and open the PR

In **Pane C**:

```bash
git add .
git commit -m "feat(asteroids): build /asteroids from KAN-2 (KAN-6/7/8)"
git push -u origin feature/asteroids
gh pr create \
  --title "feat(asteroids): Near-Earth Objects" \
  --body "Built from KAN-6, KAN-7, KAN-8 via /feza-from-jira + design-handoff/epic-3/."
```

### 4.6 — Watch CI + summon Claude review

Same four workflows. Expect Sonar red on coverage (same script as §3.6).

```bash
gh pr comment <PR_NUMBER> --body "@claude please review this PR"
make pr-review PR=<N>       # local insurance
```

### 4.7 — Follow-up tests commit → Sonar green → merge

Same loop as §3.7 — different test surface.

**Step 1 — ask Claude to fill in the test bodies.** In **Pane A**, paste:

```
Fill in the test bodies for Epic 3 so SonarCloud's "Coverage on New Code" gate flips green. New-code coverage target is ≥80%.

Target test files (already scaffolded — fill the bodies, don't recreate):
- src/components/DateRangePicker/DateRangePicker.test.tsx
    → renders both inputs with labels, emits onChange({start,end}) on each change,
      clamps end to start+7 (NeoWs limit), shows the danger caption when clamped
- src/components/HazardousPill/HazardousPill.test.tsx (create if missing)
    → renders the "Potentially Hazardous" label with the danger style
- src/components/AsteroidCard/AsteroidCard.test.tsx (create if missing)
    → renders name, date, diameter, miss distance, velocity, magnitude;
      shows <HazardousPill> only when hazardous; jplUrl is a link
- src/app/asteroids/AsteroidsPanel.test.tsx (create if missing — "use client" composite)
    → renders DateRangePicker + grid, on submit calls /api/asteroids with start/end,
      loading sets aria-busy, error renders message, 6 skeletons during fetch
- src/lib/nasa.test.ts — add getAsteroids cases (extend existing file if present)
    → maps near_earth_objects[date][] → flat AsteroidItem[]; defaults endDate=startDate;
      throws on non-200 with status code in message
- src/app/api/asteroids/route.test.ts (create if missing)
    → 400 on missing start, 400 on span > 7 days, 200 + JSON on valid range,
      502 when getAsteroids throws

Constraints:
- Use Vitest + @testing-library/react. jsdom is already configured.
- Mock fetch via vi.spyOn(globalThis, "fetch") — no MSW.
- Keep scaffolds untouched; only add/fill test files.
- Run `make test` after each file to confirm green.

When done, run `make coverage` and report the "Coverage on New Code" percentage so I can confirm we're above 80% before pushing.
```

**Step 2 — verify locally before pushing.** In **Pane C**:

```bash
make test
make coverage                                            # confirm ≥ 80% on new files
# Optional:
# /sonar-scan
```

**Step 3 — commit, push, watch CI.** In **Pane C**:

```bash
git add src/components/DateRangePicker/DateRangePicker.test.tsx \
        src/components/HazardousPill/HazardousPill.test.tsx \
        src/components/AsteroidCard/AsteroidCard.test.tsx \
        src/app/asteroids/AsteroidsPanel.test.tsx \
        src/lib/nasa.test.ts \
        src/app/api/asteroids/route.test.ts
git commit -m "test(asteroids): cover panel + atoms + lib + route"
git push

gh pr checks <PR_NUMBER> --watch
```

**Step 4 — merge once green.** In **Pane C**:

```bash
gh pr merge <PR_NUMBER> --squash --delete-branch
git checkout main && git pull
```

### 4.8 — Optional: status report

```
/atlassian:generate-status-report
```

> Auto-publishes a Confluence summary linking both PRs and ticket statuses. **Most expendable beat** — drop it if time is tight.

---

## 5. CI behaviour during the demo (what to say when)

| What you see | Verbatim line |
|---|---|
| `lint.yml` green | *"Skill output matches our flat config — that's CLAUDE.md memory at work."* |
| `chromatic.yml` green | *"Storybook visual baseline accepted — the design system is stable."* |
| You post `@claude please review this PR` | *"Same `/review-pr` skill from `.claude/skills/`, running in CI on demand. Same file the humans use locally — fires only when summoned, so it doesn't drown the PR on every push."* |
| `claude-pr-review.yml` posts the review comment | *"There's the review — cited file:line, flagged the TODOs, checked CLAUDE.md conventions."* |
| `sonarcloud.yml` red on coverage (first push) | *"Quality Gate is doing its job — ≥80% coverage on new code, we scaffolded with placeholders. Watch the follow-up commit flip it."* |
| Follow-up tests commit pushed | *"Same PR, second commit. Tests fill in the scaffolds. CI re-runs."* |
| `sonarcloud.yml` green (second push) | *"That's the gate flipping. Now we merge."* |
| `gh pr merge --squash` | *"One PR per epic, squashed onto main. Clean history."* |

The demo's strength is the **honest loop**: red gate → follow-up commit → green gate → merge. Real engineering work has follow-ups; the talk shows the first commit and the squash.

---

## 6. Failure-recovery cheats

| If… | Then… |
|---|---|
| Atlassian MCP timeouts or OAuth expires | Read straight from [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md). They mirror the Jira bodies verbatim. |
| `claude.ai/design` is slow / unreachable | You're already using the local `design-handoff/` folder for the build — the only thing this affects is §1.3 (the tab tour). Skip it, point at `design-handoff/epic-2/preview.standalone.html` in the browser instead. |
| GitHub Actions queue is slow on stage | `make pr-review PR=<n>` locally — same `/review-pr` skill the CI fires. |
| `/atlassian:generate-status-report` fails | Skip §4.8. Most expendable beat. |
| Dev server stuck | Pane B: `make stop && /feza-dev` to restart. |
| You typed the wrong KAN key | `git reset --soft HEAD` (no destructive flag); re-run `/feza-from-jira <correct-key>`. |
| `/feza-from-jira` produces wrong-shaped code | Bail out, drop to manual `/feza-route` or `/feza-component` invocation per [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md). |
| Sonar still red after follow-up commit | Skip the merge, narrate: *"In a real PR I'd ship a third commit — for the talk, we'll fix this after."* Don't break flow chasing 80%. |
| Cowork won't open (§1.2) | Skip the parity beat. Mention it on the slide instead: *"Cowork is the desktop sibling — same engine, different surface, tuned for non-coding work."* |
| `make build` errors after scaffold | Read the error aloud, ask Claude to fix it in front of the audience. This is good content. |
| `gh pr merge` blocked by required reviews | Use `--admin` flag (you have the permission). Narrate: *"Skipping the human-reviewer requirement because I'm the only reviewer in this org."* |

---

## 7. Quick reference — all commands

| Command | What it does |
|---|---|
| `/context` | Token budget + model |
| `/login` / `/logout` | Account management |
| `/memory` | Opens CLAUDE.md |
| `/skills` | Lists loaded skills |
| `/mcp` | Lists connected MCP servers |
| `/atlassian:search-company-knowledge KAN-N` | Fetch Jira ticket details (Epic or child) |
| `/atlassian:spec-to-backlog` | Confluence spec → Jira Epic + tickets |
| `/atlassian:generate-status-report` | Auto-publish Confluence summary |
| `/feza-from-jira KAN-N` | Read ticket, dispatch to right scaffold skill |
| `/feza-route <segment>` | Scaffold async page + colocated `<Segment>Panel` client stub + SCSS + API route (auto-cleans `placeholder.module.scss`) |
| `/feza-component <Name>` | Three-file component (`.tsx` + `.scss` + `.test`) |
| `/feza-story <Name>` | Storybook CSF3 story |
| `/nasa-fetch <endpoint>` | Typed NASA wrapper in `src/lib/` |
| `/feza-dev` | Start Next.js dev server (Turbopack, port 3000) |
| `/feza-build` | Production build |
| `/feza-lint [path]` | ESLint over repo or path |
| `/feza-unit-test [pattern]` | Vitest, optionally filtered |
| `/eslint-check` | Triaged lint report (CLAUDE.md violations separate) |
| `/sonar-scan` | Local SonarCloud scan |
| `/review-pr <N>` | PR validation against CLAUDE.md |
| `make dev` / `make stop` | Dev server (without slash command) |
| `make build` / `make test` | Type-safe build + Vitest one-shot |
| `make pr-review PR=<N>` | Local mirror of CI's `/review-pr` |

---

## 8. Tips for the live demo

1. **VS Code one window, three panes.** Pane A = Claude Code (audience-facing). Pane B = dev server. Pane C = git/gh. The browser stays on a second monitor.
2. **One branch per epic.** `feature/apod` for Part 1, `feature/asteroids` for Part 2. Both cut from `main`. Both merged on stage.
3. **Talk while Claude works.** Each scaffold takes a few seconds. Narrate: *"It's reading the ticket, detecting it needs a component, dispatching to /feza-component…"*
4. **Show the files.** After each step, open the created files in VS Code — the three-file pattern is your visual proof.
5. **Tests are punctuation.** Green tests after each ticket; green CI before each merge.
6. **The follow-up tests commit is the script.** Audiences trust the loop more than green-on-the-first-push. *"Scaffold, push, see the gate, ship the follow-up, merge."*
7. **`claude.ai/design` = Anthropic Labs Design.** If you slip and say one or the other on stage, they're the same surface.
8. **`design-handoff/` is the contract.** When in doubt during the build, point at `design-handoff/epic-N/README.md` — the audience sees the design is in plain markdown, not behind a tool.
