# feza — Live Demo Runbook (Epic 2 + Epic 3)

> One-page execution guide for the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*
>
> Companions:
> - [PART2_PLAN.md](PART2_PLAN.md) / [FEZA_PLAN.md](FEZA_PLAN.md) — talk narrative.
> - [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md) — per-ticket detail; **also serve as offline backup** if Atlassian is unreachable.
> - [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) — one-prompt shortcuts for Part 1 and Part 2.
> - [CLAUDE_DESIGN_PROMPTS.md](CLAUDE_DESIGN_PROMPTS.md) — the prompts that produced the screens already in your `claude.ai/design` "feza" project.
> - [ATLASSIAN_SETUP.md](ATLASSIAN_SETUP.md) — Atlassian Remote MCP wiring.

**You run the demo from Claude Code in a terminal.** Three terminal windows + one browser:
- **Terminal A** — `claude` REPL at the repo root. This is the only window the audience reads from.
- **Terminal B** — `make dev` (Next.js + Turbopack on :3000). Leave running.
- **Terminal C** — spare for `git push` / `gh pr create` at the end of each part.
- **Browser** (second monitor) — three pinned tabs: `http://localhost:3000`, Jira `KAN` board, `claude.ai/design` "feza" project.

> Optional: the Claude Code VS Code extension panel works for the same flow if you want diffs visible as Claude writes — open with **Cmd+Esc**. Skip it for minimal screen real-estate.

---

## 0. Day-of pre-flight (morning of the talk)

Run through this while your coffee brews. Most failure modes are caught here, not on stage.

```bash
# Repo is clean and current
git checkout main && git pull
git branch -D feature/apod feature/asteroids feature/kan-3-apod-scaffold 2>/dev/null

# Close any rehearsal PRs (Sonar-red rehearsal PRs left open are fine to close)
gh pr list --state open --author @me
# gh pr close <N> --delete-branch       # for each rehearsal PR

# Build + tests green on main
npm install
make build
make test

# Claude Code + MCP are healthy
claude --version
claude mcp list                           # expect: plugin:atlassian:atlassian … ✓ Connected
                                          # if "Needs authentication" → re-auth NOW, not on stage
```

Environment:

```bash
# .env.local must exist and contain a real NASA key.
# Do NOT fall back to DEMO_KEY — its 30 req/hr cap will brick the live demo.
cat .env.local
# NASA_API_KEY=<your-key>
```

External systems checklist:

- **Jira `KAN` project** on `ekipkalir.atlassian.net`: KAN-1..KAN-8 all in `To Do`, label `feza-demo`. Spot-check KAN-3, KAN-6, KAN-8.
- **`claude.ai/design`** signed in, **"feza"** project open. Confirm the prototype screens you've pre-built are visible:
  - **"Incoming screen (Epic 2)"** — covers /apod (no live design beat in Part 1; used as the visual reference).
  - **"Asteroids landing (Epic 3)"** — primary screen for Part 2, the hand-off target at Step 4.2.
  - **"AsteroidCard component (Epic 3)"** — optional supporting view if you want to spend longer on the design beat.
  - **"DateRangePicker component (Epic 3)"** — optional supporting view for KAN-7.
  - **"DatePicker component (Epic 2)"** — optional supporting view for KAN-4.
- **[tokens.json](../tokens.json)** open in a buffer (already loaded into your Claude Design project; have it ready in case you need to re-paste).
- **Backup screencast** queued for the Atlassian + Design beats (in case the network bites).

---

## 1. Stage setup

In **Terminal A**, start Claude Code:

```bash
cd ~/Projects/Personal/feza
claude
```

In **Terminal B**:

```bash
make dev
```

In **Terminal C**: leave empty — you'll paste git commands at the end of each part.

No branch yet. Each part cuts its own from `main`.

---

## 2. Add the hook — live, on-stage (teaching moment)

The "and one more thing" beat between Skills and the build. Insert it just before Part 1.

> **Script:** *"We've seen the rules — that's CLAUDE.md. We've seen the verbs — that's skills. Hooks are the enforcement layer: shell commands the harness runs on tool events. Watch what happens if I add a `PostToolUse` hook that lints every file Claude writes."*

The hook is already wired in [`.claude/settings.json`](../.claude/settings.json) — show it:

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

Next `Edit` or `Write` Claude performs on a `.tsx` / `.ts` / `.scss` fires ESLint on that single file. Audience reaction is loudest when ESLint flags a CLAUDE.md violation and Claude **self-corrects on the next turn without you typing anything**.

---

## 3. PART 1 — Epic 2 (`/apod`)

> Build the Astronomy Picture of the Day page from three Jira tickets (KAN-3, KAN-4, KAN-5) on **one branch, one PR**. ~20 min.
> **Shortcut:** paste **Prompt 1** from [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) to drive Steps 3.2–3.5 in one go.

### 3.1 — Cut the branch + fetch the Epic

In **Terminal C**:

```bash
git checkout -b feature/apod
```

In **Terminal A** (Claude Code):

```
/atlassian:search-company-knowledge KAN-1
```

> Read the Epic body + the three child summaries aloud. **Backup:** if the MCP times out, read straight from [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) — it mirrors Jira verbatim.

### 3.2 — Scaffold the /apod page and API route (KAN-3)

```
/feza-from-jira KAN-3
```

> Dispatches `/feza-route apod`. Creates `src/app/apod/page.tsx` (server, awaits `searchParams`), `src/app/apod/ApodPanel.tsx` (`"use client"`), `src/app/apod/apod.module.scss`, `src/app/api/apod/route.ts` (400 on missing params).
> Watch the hook (Step 2) fire ESLint on each write — that's your enforcement layer in action.

### 3.3 — Scaffold the DatePicker component (KAN-4)

```
/feza-from-jira KAN-4
```

> Dispatches `/feza-component DatePicker` + `/feza-story`. Three-file component in `src/components/DatePicker/` plus a Storybook story.
> Design reference: **"Incoming screen (Epic 2)"** in your `claude.ai/design` "feza" project — the date input already appears there, so no live design beat for Part 1.

### 3.4 — Wire the ApodPanel and reuse PhotoGrid (KAN-5)

```
/feza-from-jira KAN-5
```

> Creates `<ApodPanel>` composing `<DatePicker>` and **reusing `<PhotoGrid>` from Epic 1** — call that reuse out loud, it's the demo's biggest "ah-ha".

### 3.5 — Run tests **and** the build

```
make test
make build
```

> Both. CLAUDE.md is explicit: always `make build` before claiming a feature is done — Turbopack catches type errors `make dev` happily ignores. Green tests + green build = the demo's punctuation.

### 3.6 — Verify in the browser

Open `http://localhost:3000/apod`. Pick a date, watch the photo render. Walk the audience through the component tree (`<ApodPanel>` → `<DatePicker>` + `<PhotoGrid>`).

### 3.7 — Push and open the Pull Request

In **Terminal C**:

```bash
git add .
git commit -m "feat(apod): build /apod from KAN-1 epic (KAN-3/4/5)"
git push -u origin feature/apod
gh pr create \
  --title "feat(apod): Astronomy Picture of the Day" \
  --body "Built from KAN-3, KAN-4, KAN-5 via /feza-from-jira"
```

### 3.8 — The four CI gates (expect SonarCloud red — that's the script)

Four GH workflows fire in parallel:

| # | Workflow | Expected |
|---|---|---|
| 1 | `lint.yml` (ESLint flat config) | **green** |
| 2 | `chromatic.yml` (Storybook visual baseline) | **green** |
| 3 | `claude-pr-review.yml` (Claude posts review comments) | **green** (the action always finishes; it just reports findings) |
| 4 | `sonarcloud.yml` (Quality Gate) | **red on "Coverage on New Code" + TODO annotations** |

**The Sonar red is the script.** Verbatim line for the audience:

> *"This is the Quality Gate doing its job. Sonar wants ≥80% coverage on new code, and we've just scaffolded — the bodies are placeholders with `// TODO: live-demo` markers. In a real PR I'd ship a follow-up commit with the tests for `ApodPanel` and the route handler, and the gate would flip green. For the talk, the red is the demo: honest gates are honest gates. We're not merging this PR right now — we're moving to Part 2."*

Do **not** merge this PR before Part 2 — Part 2 cuts a fresh branch from `main`, so the red gate doesn't block anything.

### 3.9 — Local PR review (rehearsal punctuation + CI insurance)

While the GH workflows run:

```bash
make pr-review PR=<N>
```

> Same `/review-pr` skill the CI fires. Running it locally proves you've rehearsed it — and if `claude-pr-review.yml` flakes mid-talk, paste the local output and never miss a beat.

---

## 4. PART 2 — Epic 3 (`/asteroids`)

> Confluence spec → Jira → `claude.ai/design` hand-off → Code → PR. ~20 min on a **fresh branch from `main`**.
> **Shortcut:** paste **Prompt 2** from [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) with the design hand-off appended.

### 4.1 — Back to main, cut a fresh branch, fetch Epic 3

In **Terminal C**:

```bash
git checkout main
git checkout -b feature/asteroids
```

(Part 1's PR stays open with Sonar red — that's fine. Mention it on stage: *"PR for /apod is still open, the follow-up commit lands after the talk. Different branch from here."*)

In **Terminal A**:

```
/atlassian:search-company-knowledge KAN-2
```

> Reads Epic 3 and lists KAN-6 / KAN-7 / KAN-8.
> **Backup:** read from [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md) if MCP times out.

### 4.2 — Design the page in `claude.ai/design`

Switch to the browser tab.

1. Open the **"feza"** project → **"Asteroids landing (Epic 3)"** screen (already built — the prompt that produced it lives at [CLAUDE_DESIGN_PROMPTS.md § Prompt 1](CLAUDE_DESIGN_PROMPTS.md)).
2. Iterate **twice** with the audience watching. Suggested live prompts:
   - *"make the hazardous flag a red pill"*
   - *"tighten the stat-grid line-height"*
3. Click **"Hand off to Claude Code"**. Copy the export bundle — you'll paste it at Step 4.5.

> If you want the supporting views on the projector for context, **"AsteroidCard component (Epic 3)"** and **"DateRangePicker component (Epic 3)"** are already in the same project. They're optional — the landing screen alone is the hand-off.

### 4.3 — Scaffold the DateRangePicker (atom first, KAN-7)

```
/feza-from-jira KAN-7
```

> Build atoms before composites. Creates the 3-file `DateRangePicker` component + Storybook story.

### 4.4 — Fill in the getAsteroids lib body (no-scaffold case, KAN-6)

```
/feza-from-jira KAN-6
```

> **This is the ticket that proves `/feza-from-jira` is smart, not a one-trick scaffolder.** The `getAsteroids` signature and `NEO_BASE` constant are already pre-shipped in `src/lib/nasa.ts`. Claude reads the ticket, sees there's no skill to dispatch, and just opens an `Edit`. Show the audience the skill's decision table at [.claude/skills/feza-from-jira/SKILL.md](../.claude/skills/feza-from-jira/SKILL.md) — Step 2's "no-scaffold" row.

### 4.5 — Wire the /asteroids page with the Design hand-off (KAN-8)

```
/feza-from-jira KAN-8
```

> When Claude asks for the design reference, paste the hand-off bundle you copied at Step 4.2.
> Creates `src/app/asteroids/page.tsx`, `<AsteroidsPanel>`, `<HazardousPill>` and their `.module.scss` / `.test.tsx` / `.stories.tsx`.

### 4.6 — Tests **and** build

```
make test
make build
```

### 4.7 — Verify in the browser

`http://localhost:3000/asteroids`. Pick a date range. Show the hazardous pill rendering for at least one NEO.

### 4.8 — Push and open the PR

In **Terminal C**:

```bash
git add .
git commit -m "feat(asteroids): build /asteroids from KAN-2 epic (KAN-6/7/8)"
git push -u origin feature/asteroids
gh pr create \
  --title "feat(asteroids): Near-Earth Objects" \
  --body "Built from KAN-6, KAN-7, KAN-8 via /feza-from-jira + claude.ai/design hand-off"
```

> Sonar will again post red on new-code coverage — same script as 3.8. *"Same gate behaviour as before — honest gates are honest gates."*

### 4.9 — Optional: status report

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
| `claude-pr-review.yml` posts comments | *"Same `/review-pr` skill from `.claude/skills/`, running in CI. The skill is the same file the humans use."* |
| `sonarcloud.yml` red on coverage | *"Quality Gate is doing its job — ≥80% coverage on new code, we scaffolded with placeholders. Follow-up commit ships the tests."* |
| `sonarcloud.yml` red on TODOs | *"Sonar flags every `// TODO:` — those are the scaffold's `live-demo` markers. Fixed by the follow-up."* |

The demo's strength is not pretending the gates pass. Real engineering work has follow-ups; the talk shows the first commit, not the squash.

---

## 6. Failure-recovery cheats

| If… | Then… |
|---|---|
| Atlassian MCP timeouts or OAuth expires | Read straight from [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md). They mirror the Jira bodies verbatim. |
| `claude.ai/design` is slow / unreachable | Skip the live iteration. Your **"Asteroids landing (Epic 3)"** screen is already built — talk through it and paste the prompt body from [CLAUDE_DESIGN_PROMPTS.md § Prompt 1](CLAUDE_DESIGN_PROMPTS.md) as the design brief directly into Claude Code. |
| GitHub Actions queue is slow on stage | `make pr-review PR=<n>` locally — same `/review-pr` skill the CI fires. |
| `/atlassian:generate-status-report` fails | Skip it. Most expendable beat. |
| Dev server stuck | Kill `make dev`, run `/feza-dev` to restart. |
| You typed the wrong KAN key | `git reset --soft HEAD` (no destructive flag); re-run `/feza-from-jira <correct-key>`. |
| `/feza-from-jira` produces wrong-shaped code | Bail out, drop to manual `/feza-route` or `/feza-component` invocation per [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md). |

---

## 7. Quick reference — all commands

| Command | What it does |
|---|---|
| `/atlassian:search-company-knowledge KAN-N` | Fetch Jira ticket details (Epic or child) |
| `/atlassian:spec-to-backlog` | Confluence spec → Jira Epic + tickets |
| `/atlassian:generate-status-report` | Auto-publish Confluence summary |
| `/feza-from-jira KAN-N` | Read ticket, dispatch to right scaffold skill |
| `/feza-route <segment>` | Scaffold App Router page + paired API route |
| `/feza-component <Name>` | Three-file component (`.tsx` + `.scss` + `.test`) |
| `/feza-story <Name>` | Storybook CSF3 story |
| `/nasa-fetch <endpoint>` | Typed NASA wrapper in `src/lib/` |
| `/feza-dev` | Start Next.js dev server (Turbopack, port 3000) |
| `/feza-build` | Production build |
| `/feza-lint [path]` | ESLint over repo or path |
| `/feza-unit-test [pattern]` | Vitest, optionally filtered |
| `/eslint-check` | Triaged lint report |
| `/sonar-scan` | Local SonarCloud scan |
| `/review-pr <N>` | PR validation against CLAUDE.md |

---

## 8. Tips for the live demo

1. **One terminal, one session.** Each part runs in a single Claude Code session — that's the agentic-memory beat.
2. **One branch per epic.** `feature/apod` for Part 1, `feature/asteroids` for Part 2, both cut from `main`. One PR each. Don't try to chain or stack.
3. **Talk while Claude works.** Each scaffold takes a few seconds. Narrate: *"It's reading the ticket, detecting it needs a component, dispatching to /feza-component…"*
4. **Show the files.** After each step, `cat` the created files or open them in your editor — the three-file pattern is your visual proof.
5. **Tests are punctuation.** Green tests after each section give the audience confidence.
6. **Embrace the red Sonar.** Audiences trust honesty more than green checks. The "follow-up commit ships the tests" line is rehearsed, not improvised.
7. **`claude.ai/design` = Anthropic Labs Design.** If you slip and say one or the other on stage, they're the same surface.
