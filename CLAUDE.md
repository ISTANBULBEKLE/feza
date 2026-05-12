# CLAUDE.md — feza

> Project memory for Claude Code. Read this first.

## What feza is

A small Next.js 16 App Router app — the demo for the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."* The value is the **workflow it showcases**, not the features.

- **Epic 1 — `/explore`** (built): NASA Image Library search.
- **Epic 2 — `/apod`** (live-coded on stage, Part 1): APOD browser. Page is a placeholder until then.
- **Epic 3 — `/asteroids`** (live-coded on stage, Part 2): Near-Earth Objects browser, built from Confluence spec → Jira → Claude Design → Claude Code. Placeholder until then.

**Finished design lives in `design-handoff/`** — it is the single source of truth for tomorrow's live demo. `design-handoff/tokens.css` is the authoritative token set; `design-handoff/epic-2/README.md` and `design-handoff/epic-3/README.md` are the Claude Code prompts for each screen; `preview.standalone.html` in each is the visual reference. Do NOT pull design from `claude.ai/design`, `documents/CLAUDE_DESIGN_PROMPTS.md`, or `documents/DESIGN_SYSTEM_TOKEN.md` during the demo — those informed the handoff and are now historical.

Tickets in `documents/EPICS.md` (Epic 1 & 2) and `documents/EPICS_E3.md` (Epic 3). Part 1 narrative in `documents/FEZA_PLAN.md`; Part 2 narrative in `documents/PART2_PLAN.md`; full plan in `documents/PROJECT_PLAN.md`.

## Stack

- Next.js **16** App Router — Turbopack default, **`params` and `searchParams` are async**, `proxy.ts` replaces `middleware.ts`. Treat your training data as out of date here.
- React 19.2, TypeScript 5
- **SCSS modules only** — no Tailwind, no styled-components, no global CSS beyond `src/app/globals.scss`
- **Light theme is canonical**; dark applies via `@media (prefers-color-scheme: dark)`. Type weights are token-driven via CSS custom properties: `--fz-weight-display: 900` (h1/.display), `--fz-weight-heading: 800` (h2/h3, brand wordmarks), `--fz-weight-body: 500` (body). Tighter display tracking via `--fz-tracking-tight: -0.025em`. Apply `.fz-shine` (a global utility class in `globals.scss`) to hero H1s for the gradient gilding effect — reserve it for hero/page-title elements only.

## Design tooling

- **`design-handoff/` is the canonical design source for the live demo.** Claude Design produced the screens; they're exported there as frozen tokens (`tokens.css`), per-epic READMEs with Claude Code prompts, and `preview.standalone.html` visual references. During the demo, Claude Code reads from `design-handoff/`, not from `claude.ai/design`.
- **The Canva MCP is connected but not used during the demo.** Recipe for the eventual paid Brand Kit path lives in `documents/CANVA_BRAND_KIT.md`.
- Vitest + Testing Library + jsdom
- ESLint flat config
- Storybook 10 (`@storybook/nextjs-vite`) for component stories
- SonarCloud + Chromatic for CI quality + visual regression
- Node ≥ 20.9 (project uses 22.x)

## Folder conventions

```
src/
  app/                 routes only (page.tsx, layout.tsx, loading.tsx, route.ts, proxy.ts)
  components/<Name>/   <Name>.tsx + <Name>.module.scss + <Name>.test.tsx + <Name>.stories.tsx
  hooks/               useThing.ts (each starts with "use client" if it uses React hooks)
  helpers/             pure functions, no React
  lib/                 server-aware modules (NASA wrappers, env accessors)
  constants/           static config (URLs, presets, route paths)
```

`src/components`, `src/hooks`, `src/helpers`, `src/lib`, `src/constants` are **siblings** of `src/app/` — never inside `app/`.

## Commands

| Command | What it does |
|---|---|
| `make dev` | Dev server on :3000 (Turbopack) |
| `make build` | Production build — always run before claiming a feature is done |
| `make test` | Vitest one-shot |
| `make lint` | ESLint |
| `make storybook` | Storybook on :6006 |
| `make help` | List all targets (storybook-build, lint-fix, lint-check, coverage, sonar, pr-review, …) |

Always run `make build` before claiming a feature is done — Turbopack catches type errors that `npm run dev` happily ignores.

## CI gates

Four workflows in `.github/workflows/`. One-time setup in `documents/SETUP.md`.

- `lint.yml` — `lint`, `typecheck`, `test` jobs on every PR + push to main.
- `sonarcloud.yml` — SonarCloud analysis. Project key `ISTANBULBEKLE_feza`. Config in `sonar-project.properties` at repo root.
- `chromatic.yml` — Storybook visual regression via `chromaui/action` (pinned to commit SHA).
- `claude-pr-review.yml` — Claude PR review using the local `/review-pr` skill.

Skills live in `.claude/skills/`. Claude Code auto-discovers them — the README has the human-facing list.

## Do

- **Server Components by default.** Only add `"use client"` when the file genuinely needs hooks, browser APIs, or event handlers.
- **Await `params` and `searchParams`** in pages and Route Handlers (Next.js 16 made these async).
- **Keep `proxy.ts` in `src/`** — `middleware.ts` is deprecated in v16. Export a function named `proxy`.
- **Read `NASA_API_KEY` only on the server** via `nasaApiKey()` in `src/lib/env.ts`. Never embed it in a client bundle.
- **Use the Route Handlers in `src/app/api/*`** as the only path between the browser and NASA — clients should never hit `images-api.nasa.gov` directly.
- **Co-locate one folder per component** with `.tsx` + `.module.scss` + `.test.tsx` (+ `.stories.tsx` when there's something visual to baseline).
- **Plain `<img>` for NASA thumbnails.** Their CDN serves rotating S3 URLs, and configuring `next/image` `remotePatterns` for `*.nasa.gov` adds noise to the live demo. Disable `@next/next/no-img-element` per-line where needed.

## Don't

- Don't add Tailwind, CSS-in-JS, or global CSS beyond `globals.scss`.
- Don't create a folder under `src/app/` that isn't a route — colocated helpers belong in `src/`.
- Don't fall back to `DEMO_KEY` for NASA APOD — its 30 req/hr cap will brick the live demo. Throw if `NASA_API_KEY` is unset.
- Don't commit `.env.local`. Use `.env.example` as the contract.
- Don't pre-build Epic 2 (`/apod`) — it stays as a placeholder until the live demo. The lib/route signatures are pre-shipped so the demo flow is "fill in the body, not invent it."
- Don't pre-build Epic 3 (`/asteroids`) either — same convention as Epic 2. `getAsteroids` signature, `NEO_BASE` constant, and the placeholder page/route are pre-shipped; the bodies are filled in live during Part 2. The Part 2 demo subset is mirrored in Jira project `KAN` (`feza 1`) on `ekipkalir.atlassian.net`: parent **KAN-2** with children **KAN-6** (lib body), **KAN-7** (DateRangePicker), **KAN-8** (page wiring + Claude Design hand-off). Part 1's Epic 2 lives at **KAN-1** with **KAN-3 / KAN-4 / KAN-5**.

## Live-demo etiquette

When asked to build Epic 2 or Epic 3 on stage:
1. **Read design from `design-handoff/epic-2/README.md` (or `epic-3/README.md`).** Tokens come from `design-handoff/tokens.css` only — never re-derive from `claude.ai/design` or `documents/CLAUDE_DESIGN_PROMPTS.md`.
2. Scaffold the page + paired API route handler.
3. Scaffold any new component (3-file pattern + a Storybook story).
4. Reuse `<PhotoCard>` and `<PhotoGrid>` from `src/components/`.
5. Run `make test` after each ticket — green tests are the demo's punctuation.

### Quality pass before each commit

1. `/eslint-check` — triaged lint report; CLAUDE.md violations called out separately from ESLint findings.
2. `/sonar-scan` — run before merging the demo branch back. Quality-gate failures during the live demo are entertainment, not blockers.

## References

**Design (only source for the live demo):**
- `design-handoff/README.md` — handoff overview + token contract
- `design-handoff/tokens.css` — authoritative tokens (color, weight, shadow)
- `design-handoff/epic-2/README.md` — Claude Code prompt + preview for `/apod`
- `design-handoff/epic-3/README.md` — Claude Code prompt + preview for `/asteroids`

**Plan & narrative:**
- `documents/PROJECT_PLAN.md` — full plan
- `documents/EPICS.md` — Epic 1 & 2 ticket-by-ticket breakdown
- `documents/EPICS_E3.md` — Epic 3 (`/asteroids`) ticket breakdown — Part 2
- `documents/EPIC_2_TICKETS.md` — Part 1 demo runbook (KAN-1 + KAN-3/4/5)
- `documents/EPIC_3_TICKETS.md` — Part 2 demo runbook (KAN-2 + KAN-6/7/8)
- `documents/DEMO_EPI2_EPI3_PROMPTS.md` — stage prompts for the live-coded beats (drives `/feza-from-jira KAN-3..8`)
- `documents/FEZA_PLAN.md` — talk narrative (Part 1)
- `documents/PART2_PLAN.md` — talk narrative (Part 2: Atlassian + Claude Design)

**Setup / integrations:**
- `documents/INTEGRATION_STEPS_PLAN.md` — Figma + GitHub + Canva playbook
- `documents/ATLASSIAN_SETUP.md` — Atlassian Remote MCP wiring + Jira/Confluence pre-stage — Part 2
- `documents/SETUP.md` — one-time SonarCloud + Chromatic wiring
- `START.md` — 60-second how-to-run

**Historical (do not use during the demo — superseded by `design-handoff/`):**
- `documents/CLAUDE_DESIGN_PROMPTS.md` — original briefs sent to claude.ai/design
- `documents/DESIGN_SYSTEM_TOKEN.md` — pre-handoff token notes
