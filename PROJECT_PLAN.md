# feza — Live Demo Build Plan

> Canonical, version-controlled plan for the **feza** project — a Next.js v16 demo app built to showcase Claude Code, CLAUDE.md, Skills, MCP, and Claude Desktop in everyday dev work.

## Context

**Goal:** Build `feza`, a small Next.js v16 App Router demo app, as the centerpiece of a live presentation titled **"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."**

The app itself is intentionally simple — the *real* product is the workflow it showcases:
- Generating, testing, and reviewing code with Claude Code (terminal) and Claude Desktop
- CLAUDE.md as durable project memory
- `.claude/skills/` as reusable, team-shared workflows
- MCP servers wiring Claude into Figma, GitHub, and Canva
- GitHub Actions invoking Claude for automated PR review

**Two user journeys (Epics):**
- **Epic 1 — `/explore` (pre-built before the talk):** NASA Image Library search. Inputs: topic preset select, media type select, year range select. Output: card grid of NASA images.
- **Epic 2 — `/apod` (live-coded on stage):** Astronomy Picture of the Day browser. Inputs: date picker, "count" slider for random picks. Output: card list with title, date, image/video, explanation.

**Live-demo arc (the story for the audience):**
1. `cd feza && claude` → CLAUDE.md auto-loads, Claude understands the codebase
2. Open Figma in Claude Desktop via MCP → pull Epic 2 screen → ask Claude Code to scaffold from it
3. Build the page using `/feza-component` and `/feza-route` skills → green tests via `make test`
4. Push branch → GitHub Action (`anthropics/claude-code-action@v1`) auto-reviews the PR
5. Export a hero asset from Canva (manual, MCP not yet official) → drop into `public/`, ship

## Decisions locked with the user

| Question | Decision |
|---|---|
| Epic 1 data source | **NASA Image Library** (`https://images-api.nasa.gov/search`, no API key, fully live) — Mars Rover Photos API is currently degraded |
| Epic 2 user journey | **APOD browser** (verified-live, symmetric to Epic 1 — perfect "I just learned this pattern, watch me apply it" demo) |
| Styling | **SCSS modules only** — no Tailwind |
| Folder layout | `src/components/`, `src/hooks/`, `src/lib/`, `src/helpers/`, `src/constants/` as **siblings of `src/app/`** (idiomatic Next.js) |

## Tech stack & gaps identified

| Tool | Status | Notes |
|---|---|---|
| Node 22.15.1 | OK | Next.js 16 needs >=20.9 |
| npm 10.9.2 | OK | |
| git 2.50.1 | OK | Repo not yet initialized — `make init` will do it |
| gh 2.81.0 | OK | For PR demo |
| Next.js v16 | will install | Turbopack default, `params` async, `middleware.ts` -> `proxy.ts` |
| sass | will install (`-D sass`) | Built-in Next.js support, no extra config |
| Vitest + @testing-library | will install | Pairs cleanly with App Router; faster than Jest for live demo |
| NASA API key | needs registration | APOD must use a real key (not `DEMO_KEY`). Free, instant: https://api.nasa.gov/. Image Library API needs no key. |
| Figma desktop + Dev Mode MCP | user must enable | Required for Figma -> code handoff demo |
| GitHub `ANTHROPIC_API_KEY` secret | needs setup | Required for `anthropics/claude-code-action@v1` |
| Canva MCP | not officially confirmed in registry as of 2026-04-30 | Plan a manual Canva export step in the demo |

## Final repo layout

```
feza/
├── .claude/
│   ├── skills/
│   │   ├── feza-component/SKILL.md        # scaffold tsx + .module.scss + .test.tsx
│   │   ├── feza-route/SKILL.md            # scaffold app/<seg>/page.tsx + route handler
│   │   ├── nasa-fetch/SKILL.md            # wrap a NASA endpoint as a Route Handler
│   │   └── review-pr/SKILL.md             # local PR review (mirrors GitHub Action)
│   └── settings.json                      # project-level allowed tools (gh, npm, make)
├── .github/
│   └── workflows/
│       └── claude-pr-review.yml           # anthropics/claude-code-action@v1 on PRs
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                       # landing — links to /explore and /apod
│   │   ├── globals.scss
│   │   ├── explore/                       # EPIC 1 (pre-built)
│   │   ├── apod/                          # EPIC 2 (live-coded — placeholder stub committed)
│   │   └── api/
│   │       ├── nasa-search/route.ts
│   │       └── apod/route.ts
│   ├── components/
│   │   ├── Select/             Select.tsx + .module.scss + .test.tsx
│   │   ├── Button/             Button.tsx + .module.scss + .test.tsx
│   │   ├── DatePicker/         (live-coded on stage)
│   │   ├── PhotoCard/          PhotoCard.tsx + .module.scss + .test.tsx
│   │   └── PhotoGrid/          PhotoGrid.tsx + .module.scss + .test.tsx
│   ├── hooks/                  useDebounce.ts, useNasaSearch.ts
│   ├── helpers/                formatDate.ts, classNames.ts
│   ├── lib/                    nasa.ts, env.ts
│   ├── constants/              nasa.ts, routes.ts
│   └── proxy.ts                # Next.js 16 (was middleware.ts) — request logging
├── .env.local                  # NASA_API_KEY=... (gitignored)
├── .env.example
├── .gitignore
├── CLAUDE.md
├── EPICS.md
├── FEZA_PLAN.md
├── INTEGRATION_STEPS_PLAN.md
├── Makefile
├── PROJECT_PLAN.md             # this file
├── README.md
├── START.md
├── next.config.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── vitest.setup.ts
```

## Build sequence

### Phase 0 — Scaffold
- 0.0 Write `feza/PROJECT_PLAN.md` (this file)
- 0.1 `npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --skip-install --yes`
- 0.2 `npm install` then `-D sass vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
- 0.3 `git init && git branch -m main && git add -A && git commit -m "chore: scaffold Next.js 16 app"`
- 0.4 Create sibling dirs `src/{components,hooks,helpers,lib,constants}`
- 0.5 Move `src/middleware.ts` -> `src/proxy.ts` (rename export to `proxy`)
- 0.6 Drop in `vitest.config.ts`, `vitest.setup.ts`
- 0.7 Write Makefile, .env.example, .gitignore additions, CLAUDE.md, README.md, START.md, EPICS.md, FEZA_PLAN.md, INTEGRATION_STEPS_PLAN.md
- 0.8 Sanity: `make dev` -> http://localhost:3000

### Phase 1 — Epic 1 `/explore` (pre-built) — NASA Image Library

- **E1-T1** — Constants & types in `src/constants/nasa.ts` and `src/lib/nasa.ts`
- **E1-T2** — `searchImages({ q, mediaType, yearStart, yearEnd })` in `src/lib/nasa.ts`
- **E1-T3** — `src/app/api/nasa-search/route.ts` Route Handler
- **E1-T4** — `Select`, `Button` atoms with `.module.scss` + tests
- **E1-T5** — `PhotoCard`, `PhotoGrid` molecules with `.module.scss` + tests
- **E1-T6** — `useNasaSearch` client hook (debounced)
- **E1-T7** — `src/app/explore/page.tsx` (server) + `<ExplorePanel>` (client)
- **E1-T8** — Vitest unit tests
- **E1-T9** — Polish: empty / error / no-results states, accessibility

### Phase 2 — Epic 2 `/apod` (LIVE-CODED on stage) — APOD browser

Pre-stage: only commit a placeholder `src/app/apod/page.tsx` so the route resolves.

Live-demo script:
- **E2-T1** — Open Figma in Claude Desktop, "get selection" via Figma MCP
- **E2-T2** — `/feza-route apod` skill -> scaffold page + route handler
- **E2-T3** — Append `getApod({ date?, count? })` to `src/lib/nasa.ts`
- **E2-T4** — `src/app/api/apod/route.ts` (uses `NASA_API_KEY`, never leaks to client)
- **E2-T5** — `/feza-component DatePicker` skill -> component + .module.scss + test
- **E2-T6** — Wire page (date OR count, mutually exclusive)
- **E2-T7** — Handle `media_type === 'video'`
- **E2-T8** — Tests
- **E2-T9** — Push branch, open PR, watch Claude review on GitHub

### Phase 3 — Skills + CLAUDE.md + MCP

- CLAUDE.md (<=200 lines): project intent, conventions, commands, do/don't
- `.claude/skills/feza-component/SKILL.md` — scaffolds three-file component
- `.claude/skills/feza-route/SKILL.md` — scaffolds page + route handler
- `.claude/skills/nasa-fetch/SKILL.md` — wraps a NASA endpoint
- `.claude/skills/review-pr/SKILL.md` — `disable-model-invocation: true`, `allowed-tools: Bash(gh *)`
- `.claude/settings.json` — pre-approves `Bash(make *)`, `Bash(npm *)`, `Bash(gh *)`
- `claude mcp add` for GitHub, Figma Dev Mode, Playwright (commands in INTEGRATION_STEPS_PLAN.md)

### Phase 4 — GitHub PR review automation

- `.github/workflows/claude-pr-review.yml` — `anthropics/claude-code-action@v1` on PRs and `@claude` mentions, invokes `review-pr` skill
- Repo secret `ANTHROPIC_API_KEY` set via `gh secret set`
- Optional: `claude /install-github-app`

### Phase 5 — Figma & Canva integrations

- **Figma:** Both Epic screens in a shared file; Dev Mode MCP exposes selection / code / image / variables. Demo: select frame -> ask Claude Desktop to scaffold layout into `src/app/apod/page.tsx`.
- **Canva:** Manual export PNG -> `public/hero.png`. Talking point: "manual today, automated tomorrow — same workflow."

## Verification

After Phase 0:
- `make dev` -> http://localhost:3000 shows landing page with two link cards
- `make test` -> green
- `make build` -> succeeds with Turbopack

After Phase 1:
- `/explore` filters work; cards render; loading/empty/error reachable
- All Vitest unit tests green

After Phase 2 (live):
- `/apod` works with date picker OR count slider
- PR opened on GitHub triggers Claude review within ~2 min

## Key references

- Next.js 16 release notes: https://nextjs.org/blog/next-16
- NASA Image Library: https://images-api.nasa.gov/search?q=mars+rover (no key)
- NASA APOD: https://api.nasa.gov/planetary/apod (free key required)
- Claude Code skills: https://code.claude.com/docs/en/custom-skills.md
- Claude Code GitHub Action: `anthropics/claude-code-action@v1`
- Figma Dev Mode MCP: enabled inside Figma desktop
