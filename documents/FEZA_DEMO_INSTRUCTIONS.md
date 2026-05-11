# feza — Live Demo Runbook (Epic 2 + Epic 3)

> One-page execution guide for the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*
>
> Companions:
> - [PART2_PLAN.md](PART2_PLAN.md) — talk narrative.
> - [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md) — per-ticket detail; **also serve as offline backup** if Atlassian is unreachable.
> - [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) — one-prompt shortcuts for Part 1 and Part 2 if you're short on time.
> - [ATLASSIAN_SETUP.md](ATLASSIAN_SETUP.md) — Atlassian Remote MCP wiring.

You will run the demo with **Claude Code inside the VS Code IDE extension** (split-pane: editor + Claude Code panel), the dev server (`make dev`) in one terminal, and a browser tab on the second monitor for Jira / Confluence / Anthropic Labs Design (claude.ai/design) and the running app.

---

## 0. Day-of pre-flight (morning of the talk)

Run through this list while your coffee brews — most failure modes are caught here, not on stage.

```bash
# Repo is clean and current
git checkout main && git pull
npm install
make build                                  # Turbopack catches type errors `make dev` ignores
make test                                   # all green

# Claude Code + MCP are healthy
claude --version
claude mcp list                             # expect: plugin:atlassian:atlassian … ✓ Connected
                                            # if "Needs authentication" → re-auth NOW, not on stage
```

Environment:

```bash
# .env.local must exist and contain a real NASA key.
# Do NOT fall back to DEMO_KEY — its 30 req/hr cap will brick the live demo.
cat .env.local
# NASA_API_KEY=<your-key>
```

External systems:

- **Jira `KAN` project** on `ekipkalir.atlassian.net`: KAN-1..KAN-8 all in `To Do`, label `feza-demo`. Spot-check KAN-3, KAN-6, KAN-8.
- **Anthropic Labs Design** (claude.ai/design) signed in, "feza" project open with **Epic 2** and **Epic 3** frames visible. These are your prototypes for the live demo.
- **[tokens.json](../tokens.json)** open in a VS Code tab (you'll paste it into Anthropic Labs Design during Part 2 for on-palette output).
- Any prior demo PR closed, branch deleted: `gh pr list` then `git branch -D demo/live-coding` if it exists from a rehearsal.
- Backup screencast queued for the Atlassian + Design beats (in case the network bites).

---

## 1. Stage setup (VS Code IDE)

1. Open the project folder in VS Code.
2. Open the Claude Code panel: **Cmd+Esc** (macOS) or Command Palette → *"Claude Code: Open"*.
3. Screen layout for the audience:
   - **Left half of the laptop screen:** VS Code editor — keep the file you're discussing visible (the extension auto-shares the open tab + VS Code diagnostics with Claude).
   - **Right half of the laptop screen:** Claude Code panel.
   - **Second monitor (or projector):** browser with three pinned tabs — `http://localhost:3000`, Jira board, Anthropic Labs Design.
4. Start the dev server in a side terminal: `make dev`. Leave it running for the whole talk.

```bash
git checkout -b demo/live-coding
```

---

## 2. Add the hook — live, on-stage (teaching moment)

This is the "and one more thing" beat between Skills and the build. Insert it just before Part 1.

> **Script:** *"We've seen the rules — that's CLAUDE.md. We've seen the verbs — that's skills. Hooks are the enforcement layer: shell commands the harness runs on tool events. Watch what happens if I add a `PostToolUse` hook that lints every file Claude writes."*

Open [`.claude/settings.json`](../.claude/settings.json) in VS Code and add the `hooks` block (already wired in this repo — show it; if you've checked it out fresh, paste it):

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

After saving, the next `Edit` or `Write` Claude performs on a `.tsx` / `.ts` / `.scss` file fires ESLint on that single file. Audience reaction is loudest when ESLint flags a CLAUDE.md violation (global CSS, unused import, missing dependency) and Claude **self-corrects on the next turn without you typing anything**.

---

## 3. PART 1 — Epic 2 (`/apod`)

> Build the Astronomy Picture of the Day page from three Jira tickets (KAN-3, KAN-4, KAN-5) in one continuous Claude Code session.
> **Time budget:** ~20 min. Shortcut: paste **Prompt 1** from [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) to drive Steps 3.2–3.5 in one go.

### Step 3.1 — Fetch the Epic and ticket details from Jira

In the Claude Code panel:

```
/atlassian:search-company-knowledge KAN-1
```

> Read the Epic body + the three child summaries aloud. **Backup:** if the MCP times out, read straight from [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) — it mirrors Jira verbatim.

### Step 3.2 — Scaffold the /apod page and API route handler

```
/feza-from-jira KAN-3
```

> Dispatches to `/feza-route`. Creates `src/app/apod/page.tsx`, `src/app/api/apod/route.ts`, typed `getApod()` in `src/lib/nasa.ts`.
> Watch the hook (Step 2) fire ESLint on each write — that's your enforcement layer in action.

### Step 3.3 — Scaffold the DatePicker component

```
/feza-from-jira KAN-4
```

> Dispatches to `/feza-component` (3-file pattern), then `/feza-story` for the Storybook baseline:
> - `src/components/DatePicker/DatePicker.tsx`
> - `src/components/DatePicker/DatePicker.module.scss`
> - `src/components/DatePicker/DatePicker.test.tsx`
> - `src/components/DatePicker/DatePicker.stories.tsx`

### Step 3.4 — Wire the ApodPanel and reuse PhotoGrid

```
/feza-from-jira KAN-5
```

> Creates `<ApodPanel>` composing `<DatePicker>` and **reusing `<PhotoGrid>` from Epic 1** — call that reuse out loud, it's the demo's biggest "ah-ha".

### Step 3.5 — Run tests **and** the build

```
/feza-unit-test
make build
```

> Both. CLAUDE.md is explicit: always `make build` before claiming a feature is done — Turbopack catches type errors `make dev` happily ignores. Green tests + green build = the demo's punctuation.

### Step 3.6 — Verify in the browser

Open `http://localhost:3000/apod`. Pick a date, watch the photo render. Walk the audience through the component tree (`<ApodPanel>` → `<DatePicker>` + `<PhotoGrid>`).

### Step 3.7 — Push and open a Pull Request

In a side terminal (or from Claude):

```bash
git add .
git commit -m "feat(apod): build /apod page from KAN-1 epic"
git push -u origin demo/live-coding
gh pr create --title "feat(apod): Astronomy Picture of the Day" --body "Built from KAN-3, KAN-4, KAN-5 via /feza-from-jira"
```

> **4 CI gates fire in parallel** — call them out as they go green:
> 1. `lint.yml` — ESLint flat config
> 2. `sonarcloud.yml` — SonarCloud quality threshold
> 3. `chromatic.yml` — Storybook visual regression
> 4. `claude-pr-review.yml` — Claude runs `/review-pr` and posts comments

### Step 3.8 — Run PR review locally (rehearsal + CI insurance)

While the GH workflows run:

```bash
make pr-review PR=<PR_NUMBER>
```

> Same `/review-pr` skill the CI fires. Running it locally proves you've rehearsed the review — and if a GH Action flakes mid-talk, you can paste the local review output and never miss a beat.

---

## 4. PART 2 — Epic 3 (`/asteroids`)

> Full Atlassian + Claude Design chain — Confluence spec → Jira → Anthropic Labs Design → Code → PR.
> **Time budget:** ~20 min. Shortcut: paste **Prompt 2** from [DEMO_EPI2_EPI3_PROMPTS.md](DEMO_EPI2_EPI3_PROMPTS.md) with the Design hand-off appended.

### Step 4.1 — Fetch Epic 3 from Jira

```
/atlassian:search-company-knowledge KAN-2
```

> Reads Epic 3 and lists KAN-6 / KAN-7 / KAN-8.
> **Backup:** read from [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md) if MCP times out.

### Step 4.2 — Design the page in Anthropic Labs Design

Switch to the browser tab on `claude.ai/design`.

1. Open the existing **"feza"** project → **Epic 3** frame.
2. Paste the KAN-8 ticket description (you can copy it from the panel output of Step 4.1).
3. Paste the contents of [`tokens.json`](../tokens.json) (the canonical token source — not `DESIGN_SYSTEM_TOKEN.md`).
4. Iterate twice — narrate one prompt aloud, e.g. *"make the hazardous flag a red pill."*
5. Click **"Hand off to Claude Code"**. Copy the hand-off bundle — you'll paste it in Step 4.5.

### Step 4.3 — Scaffold the DateRangePicker (atom first)

```
/feza-from-jira KAN-7
```

> Build atoms before composites. Creates the 3-file `DateRangePicker` component + Storybook story.

### Step 4.4 — Fill in the getAsteroids lib body (no-scaffold case)

```
/feza-from-jira KAN-6
```

> **This is the ticket that proves `/feza-from-jira` is smart, not just a scaffolder.** The signature for `getAsteroids` already exists in `src/lib/nasa.ts`. Claude reads the ticket, sees there's no skill to dispatch, and just opens an `Edit`. Show the audience the skill's decision table at [.claude/skills/feza-from-jira/SKILL.md](../.claude/skills/feza-from-jira/SKILL.md) — Step 2's "no-scaffold" row.

### Step 4.5 — Wire the /asteroids page with the Design hand-off

```
/feza-from-jira KAN-8
```

> When Claude asks for the design, paste the Anthropic Labs Design hand-off from Step 4.2.
> Creates `src/app/asteroids/page.tsx`, `<AsteroidsPanel>`, `<HazardousPill>` and their `.module.scss` / `.test.tsx` / `.stories.tsx`.

### Step 4.6 — Tests **and** build

```
/feza-unit-test
make build
```

### Step 4.7 — Verify in the browser

`http://localhost:3000/asteroids`. Pick a date range. Show the hazardous pill rendering for at least one NEO.

### Step 4.8 — Push, open PR, publish status report

```bash
git add .
git commit -m "feat(asteroids): build /asteroids page from KAN-2 epic"
git push origin demo/live-coding
gh pr create --title "feat(asteroids): Near-Earth Objects" --body "Built from KAN-6, KAN-7, KAN-8 via /feza-from-jira + Anthropic Labs Design hand-off"
```

Then back in Claude Code:

```
/atlassian:generate-status-report
```

> Auto-publishes a Confluence summary with the PR link, ticket statuses, and build state. **The "Monday morning, you can run this end-to-end" closing slide.**

---

## 5. Failure-recovery cheats

| If… | Then… |
|---|---|
| Atlassian MCP timeouts or OAuth expires | Read straight from [EPIC_2_TICKETS.md](EPIC_2_TICKETS.md) / [EPIC_3_TICKETS.md](EPIC_3_TICKETS.md). They mirror the Jira bodies verbatim. |
| Anthropic Labs Design is slow / unreachable | Use the pre-rendered Canva mockups per [CANVA_BRAND_KIT.md](CANVA_BRAND_KIT.md). |
| GitHub Actions queue is slow on stage | Run `make pr-review PR=<n>` locally — same `/review-pr` skill. |
| `/atlassian:generate-status-report` fails | Skip it. [PART2_PLAN.md](PART2_PLAN.md) flags it as the most expendable beat. |
| Dev server stuck | Kill the background `make dev`, run `/feza-dev` to restart. |
| You typed the wrong KAN key | `git reset --soft HEAD` (no destructive flag) is allowed; then re-run `/feza-from-jira <correct-key>`. |

---

## 6. Quick Reference — All Commands

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

## 7. Tips for the Live Demo

1. **One terminal, one session.** The whole demo runs in a single Claude Code session — this shows the agentic memory across steps.
2. **Talk while Claude works.** Each scaffold takes a few seconds. Narrate: *"It's reading the ticket, detecting it needs a component, dispatching to feza-component…"*
3. **Show the files.** After each step, open the created files in the VS Code editor pane — the three-file pattern is your visual proof.
4. **Tests are your punctuation.** Green tests after each section give the audience confidence.
5. **The PR is the finale.** Four CI gates running in parallel is a strong visual ending.
6. **Anthropic Labs Design = claude.ai/design.** If you slip and say one or the other on stage, they're the same surface.
