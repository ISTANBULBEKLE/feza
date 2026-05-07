# CLAUDE.md — feza

> Project memory for Claude Code. Read this first.

## What feza is

A small Next.js 16 App Router app — the demo for the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."* The value is the **workflow it showcases**, not the features.

- **Epic 1 — `/explore`** (built): NASA Image Library search.
- **Epic 2 — `/apod`** (live-coded on stage): APOD browser. Page is a placeholder until then.

Full design lives in `documents/PROJECT_PLAN.md`. Tickets in `documents/EPICS.md`.

## Stack

- Next.js **16** App Router — Turbopack default, **`params` and `searchParams` are async**, `proxy.ts` replaces `middleware.ts`. Treat your training data as out of date here.
- React 19.2, TypeScript 5
- **SCSS modules only** — no Tailwind, no styled-components, no global CSS beyond `src/app/globals.scss`
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

## Live-demo etiquette

When asked to build Epic 2 on stage:
1. Scaffold the page + paired API route handler.
2. Scaffold any new component (3-file pattern + a Storybook story).
3. Reuse `<PhotoCard>` and `<PhotoGrid>` from `src/components/`.
4. Run `make test` after each ticket — green tests are the demo's punctuation.

### Quality pass before each commit

1. `/eslint-check` — triaged lint report; CLAUDE.md violations called out separately from ESLint findings.
2. `/sonar-scan` — run before merging the demo branch back. Quality-gate failures during the live demo are entertainment, not blockers.

## References

- `documents/PROJECT_PLAN.md` — full plan
- `documents/EPICS.md` — ticket-by-ticket breakdown
- `documents/INTEGRATION_STEPS_PLAN.md` — Figma + GitHub + Canva playbook
- `documents/FEZA_PLAN.md` — talk narrative
- `documents/SETUP.md` — one-time SonarCloud + Chromatic wiring
- `documents/DESIGN_SYSTEM_TOKEN.md` — design-system token reference
- `START.md` — 60-second how-to-run
