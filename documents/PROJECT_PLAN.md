# feza — Live Demo Build Plan

The canonical plan for the **feza** demo app — a Next.js 16 App Router project built around the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*

The app is intentionally simple — the product is the **workflow** it showcases:

- Claude Code in the terminal + Claude Desktop
- `CLAUDE.md` as durable project memory
- `.claude/skills/` as reusable, team-shared workflows
- MCP servers wiring Claude into Figma, GitHub, Canva
- GitHub Actions invoking Claude for automated PR review
- SonarCloud + Chromatic for CI quality gates

## Two epics

| Epic | Route | State | Why |
|---|---|---|---|
| **Epic 1** | `/explore` | Built ✅ | NASA Image Library search. Shows "what Claude built before the talk." |
| **Epic 2** | `/apod` | Placeholder | Live-coded on stage. APOD browser. Symmetric to Epic 1 — perfect "I just learned this pattern, watch me apply it." |

## Live-demo arc (the story)

1. `cd feza && claude` → CLAUDE.md auto-loads, Claude understands the codebase.
2. Open Figma in Claude Desktop via MCP → pull Epic 2 screen → ask Claude Code to scaffold from it.
3. Build the page using `/feza-route` and `/feza-component` skills → green tests via `make test`.
4. Add a Storybook story with `/feza-story` → Chromatic baselines the diff.
5. Push branch → GitHub Actions run lint / SonarCloud / Chromatic / Claude PR review in parallel.
6. Export a hero asset from Canva (manual; MCP not yet official) → `public/`, ship.

## Locked decisions

| Question | Decision |
|---|---|
| Epic 1 data source | NASA Image Library (`https://images-api.nasa.gov/search`, no key) |
| Epic 2 user journey | APOD browser — date picker OR count slider |
| Styling | SCSS modules only |
| Folder layout | `src/components|hooks|lib|helpers|constants/` are siblings of `src/app/` |
| Stories | Co-located: `<Name>.stories.tsx` next to `<Name>.tsx` |
| CI gates | lint + sonarcloud + chromatic + claude-pr-review (see `documents/SETUP.md`) |

## Repo layout (target)

```
feza/
├── .claude/skills/             feza-component, feza-route, feza-story,
│                                nasa-fetch, eslint-check, sonar-scan, review-pr
├── .github/workflows/          lint, sonarcloud, chromatic, claude-pr-review
├── .storybook/                 main.ts + preview.ts (nextjs-vite framework)
├── documents/                  PROJECT_PLAN, EPICS, FEZA_PLAN, INTEGRATION_STEPS_PLAN, SETUP, DESIGN_SYSTEM_TOKEN
├── public/
├── src/
│   ├── app/                    routes only (page.tsx, layout.tsx, route.ts, proxy.ts, api/*/route.ts)
│   ├── components/<Name>/      .tsx + .module.scss + .test.tsx + .stories.tsx
│   ├── hooks/                  useDebounce, useNasaSearch
│   ├── helpers/                pure functions
│   ├── lib/                    nasa.ts, env.ts (server-only)
│   └── constants/              static config
├── CLAUDE.md, README.md, START.md
├── Makefile, package.json, sonar-project.properties
└── eslint.config.mjs, vitest.config.ts, vitest.setup.ts
```

## Build sequence

### Phase 0 — Scaffold
`create-next-app` (TypeScript + ESLint + App Router + src dir + Turbopack), `npm install`, init git, create sibling dirs, rename `middleware.ts` → `proxy.ts`, drop in vitest config + Makefile + docs. Sanity-check with `make dev`.

### Phase 1 — Epic 1 `/explore` (built)
NASA Image Library wrapper in `src/lib/nasa.ts`, Route Handler in `src/app/api/nasa-search/route.ts`, atoms (`Select`, `Button`), molecules (`PhotoCard`, `PhotoGrid`), debounced `useNasaSearch` hook, server `/explore` page + client `<ExplorePanel>`, polish (empty/error/loading), Vitest unit tests, Storybook seed stories. Tickets in `documents/EPICS.md`.

### Phase 2 — Epic 2 `/apod` (live)
Pre-stage: only commit a placeholder `src/app/apod/page.tsx`. On stage, scaffold via skills, append `getApod({ date?, count? })` to `nasa.ts`, build `<DatePicker>`, handle `media_type === "video"`, push branch, watch all four CI workflows post their status checks.

### Phase 3 — Skills + CLAUDE.md + MCP
Seven skills under `.claude/skills/`: scaffolders (`feza-component`, `feza-route`, `feza-story`, `nasa-fetch`) and quality skills (`eslint-check`, `sonar-scan`, `review-pr`). CLAUDE.md keeps project memory under ~100 lines. `claude mcp add` wires Figma Dev Mode, GitHub, and Playwright (commands in `documents/INTEGRATION_STEPS_PLAN.md`).

### Phase 4 — CI gates
Four GitHub workflows on every PR:
- `lint.yml` — `lint` + `typecheck` + `test` jobs.
- `sonarcloud.yml` — SonarCloud analysis (project key `ISTANBULBEKLE_feza`).
- `chromatic.yml` — Storybook visual regression via `chromaui/action` (commit-SHA pinned).
- `claude-pr-review.yml` — Claude PR review using the local `/review-pr` skill.

One-time setup (secrets, project import, app installs) lives in `documents/SETUP.md`.

### Phase 5 — Figma & Canva
**Figma:** both epic screens in a shared file; Dev Mode MCP exposes selection / code / variables. **Canva:** manual export PNG → `public/hero.png`. Talking point: "manual today, automated tomorrow — same workflow."

## References

- Next.js 16 release notes: <https://nextjs.org/blog/next-16>
- NASA Image Library: <https://images-api.nasa.gov/search>
- NASA APOD: <https://api.nasa.gov/planetary/apod>
- Claude Code skills: <https://code.claude.com/docs/en/custom-skills.md>
- Claude Code GitHub Action: `anthropics/claude-code-action@v1`
- SonarCloud project: <https://sonarcloud.io/summary/new_code?id=ISTANBULBEKLE_feza>
