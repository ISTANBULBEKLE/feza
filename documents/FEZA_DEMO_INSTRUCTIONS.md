
## Prerequisites

Before starting the demo, make sure:

```bash
# 1. Clone the repo and enter the directory
git clone https://github.com/IstanbulBekle/feza.git
cd feza

# 2. Install dependencies
npm install

# 3. Verify Claude Code is installed and authenticated
claude --version

# 4. Verify MCP servers are configured
claude mcp list
# Should show: atlassian (remote MCP)

# 5. Verify the dev server works
npm run dev
# Open http://localhost:3000/explore — should load the shipped Epic 1

# 6. Create a clean branch for the demo
git checkout -b demo/live-coding
```

---

## PART 1 — Epic 2: Building `/apod` from KAN-1

> **Goal:** Build the Astronomy Picture of the Day page from three Jira tickets in one continuous Claude Code session.

### Step 1 — Launch Claude Code

```bash
claude
```

### Step 2 — Fetch the Epic and ticket details from Jira

Type in the Claude Code terminal:

```
/atlassian:search-company-knowledge KAN-1
```

> This fetches the ticket bodies for Epic KAN-1 and its children: KAN-3, KAN-4, KAN-5.
> Review the output to confirm all three child tickets are loaded.

### Step 3 — Scaffold the /apod page and API route handler

```
/feza-from-jira KAN-3
```

> **What happens:** The `/feza-from-jira` skill reads KAN-3, detects it needs a route + API handler, and dispatches to `/feza-route`. This creates:
> - `src/app/apod/page.tsx` — the /apod page (Server Component)
> - `src/app/api/apod/route.ts` — the API route handler that calls api.nasa.gov/planetary/apod
> - Typed response interfaces in `src/lib/nasa.ts`

### Step 4 — Scaffold the DatePicker component

```
/feza-from-jira KAN-4
```

> **What happens:** Dispatches to `/feza-component`. Creates:
> - `src/components/DatePicker/DatePicker.tsx`
> - `src/components/DatePicker/DatePicker.module.scss`
> - `src/components/DatePicker/DatePicker.test.tsx`
>
> Then auto-dispatches to `/feza-story`:
> - `src/components/DatePicker/DatePicker.stories.tsx`

### Step 5 — Wire the ApodPanel and reuse PhotoGrid from Epic 1

```
/feza-from-jira KAN-5
```

> **What happens:** Creates `ApodPanel` component that composes `DatePicker` + reuses `PhotoGrid` from Epic 1. Wires everything into the /apod page.

### Step 6 — Run tests

```
/feza-unit-test
```

> Or use the make command directly:
> ```
> make test
> ```
> Confirm all tests pass (green). This is the demo's punctuation mark.

### Step 7 — Start dev server and verify visually

```
/feza-dev
```

> Open http://localhost:3000/apod in the browser. Walk the audience through the working page.

### Step 8 — Push and create a Pull Request

Exit Claude Code (or use a separate terminal):

```bash
git add .
git commit -m "feat(apod): build /apod page from KAN-1 epic"
git push origin demo/live-coding
gh pr create --title "feat(apod): Astronomy Picture of the Day" --body "Built from KAN-3, KAN-4, KAN-5 via /feza-from-jira"
```

> **4 CI gates fire in parallel:**
> 1. `lint.yml` — ESLint flat configuration
> 2. `sonarcloud.yml` — SonarCloud quality threshold
> 3. `chromatic.yml` — Visual regression (Storybook)
> 4. `claude-pr-review.yml` — Claude runs `/review-pr` and posts comments

### Step 9 (Optional) — Run PR review locally

```bash
make pr-review PR=<PR_NUMBER>
```

---

## PART 2 — Epic 3: Building `/asteroids` from KAN-2

> **Goal:** Full Atlassian + Claude Design chain — Confluence spec → Jira → Design → Code → PR.

### Step 1 — Convert Confluence spec to Jira tickets

In Claude Code:

```
/atlassian:spec-to-backlog
```

> **What happens:** Reads the Confluence spec for Near-Earth Objects, creates Jira Epic KAN-2 with children:
> - KAN-6: Add `getAsteroids` function to `src/lib/nasa.ts`
> - KAN-7: Create `<DateRangePicker>` component
> - KAN-8: Create `/asteroids` page with `<AsteroidsPanel>` + `<HazardousPill>`

### Step 2 — Design the page in Claude Design

Open a browser and navigate to:

```
https://claude.ai/design
```

**In Claude Design:**

1. Paste the KAN-8 ticket description
2. Upload or paste `DESIGN_SYSTEM_TOKEN.md` from the repo's `documents/` folder
3. Iterate on the design (adjust layout, colors, spacing)
4. Click **"Hand off to Claude Code"** — this generates a code bundle

> Copy the hand-off output. You will paste it in Step 6.

### Step 3 — Add the getAsteroids NASA API function

Back in Claude Code:

```
/feza-from-jira KAN-6
```

> **What happens:** Edits `src/lib/nasa.ts` to add the `getAsteroids()` function. No scaffold needed — just adds to the existing file. Also creates/updates the `/api/asteroids/route.ts` handler.

### Step 4 — Scaffold the DateRangePicker component

```
/feza-from-jira KAN-7
```

> **What happens:** Dispatches to `/feza-component`. Creates:
> - `src/components/DateRangePicker/DateRangePicker.tsx`
> - `src/components/DateRangePicker/DateRangePicker.module.scss`
> - `src/components/DateRangePicker/DateRangePicker.test.tsx`
> - `src/components/DateRangePicker/DateRangePicker.stories.tsx`

### Step 5 — Scaffold the /asteroids page with Claude Design hand-off

```
/feza-from-jira KAN-8
```

> When prompted or during the build, paste the Claude Design hand-off code from Step 2.
>
> **What happens:** Creates:
> - `src/app/asteroids/page.tsx`
> - `src/components/AsteroidsPanel/AsteroidsPanel.tsx` (using the design hand-off)
> - `src/components/HazardousPill/HazardousPill.tsx`
> - Associated `.module.scss`, `.test.tsx`, and `.stories.tsx` files

### Step 6 — Run tests and verify

```
/feza-unit-test
```

> Then start the dev server:
> ```
> /feza-dev
> ```
> Open http://localhost:3000/asteroids and walk through the page.

### Step 7 — Push, create PR, and generate status report

```bash
git add .
git commit -m "feat(asteroids): build /asteroids page from KAN-2 epic"
git push origin demo/live-coding
gh pr create --title "feat(asteroids): Near-Earth Objects" --body "Built from KAN-6, KAN-7, KAN-8 via /feza-from-jira + Claude Design hand-off"
```

Then back in Claude Code:

```
/atlassian:generate-status-report
```

> **What happens:**
> - 4 CI gates fire in parallel on the PR
> - `/review-pr` posts review comments
> - Confluence summary is auto-published with build status

---

## Quick Reference — All Commands Used

| Command | What It Does |
|---|---|
| `/atlassian:search-company-knowledge KAN-N` | Fetch Jira ticket details |
| `/atlassian:spec-to-backlog` | Confluence spec → Jira epic + tickets |
| `/atlassian:generate-status-report` | Auto-publish Confluence summary |
| `/feza-from-jira KAN-N` | Read ticket, dispatch to right scaffold skill |
| `/feza-route` | Scaffold App Router page + paired API handler |
| `/feza-component` | Three-file component (.tsx + .scss + .test) |
| `/feza-story` | Storybook CSF3 story |
| `/nasa-fetch` | Typed NASA wrapper in lib/ |
| `/feza-dev [port]` | Start Next.js dev server (Turbopack) |
| `/feza-build` | Production build |
| `/feza-lint [path]` | ESLint over repo or path |
| `/feza-unit-test [pattern]` | Vitest, optionally filtered |
| `/eslint-check` | Triaged lint report |
| `/sonar-scan` | Local SonarCloud scan |
| `/review-pr` | PR validation against CLAUDE.md |

---

## Tips for the Live Demo

1. **Keep one terminal, one session.** The whole demo runs in a single Claude Code session — this shows the agentic memory across steps.
2. **Talk while Claude works.** Claude takes a few seconds per scaffold. Narrate what it's doing: "It's reading the ticket, detecting it needs a component, dispatching to feza-component..."
3. **Show the files.** After each step, quickly `ls` the created files or open them in the IDE to show the three-file pattern.
4. **Tests are your punctuation.** Green tests after each section give the audience confidence.
5. **The PR is the finale.** Four CI gates running in parallel is a strong visual ending.
