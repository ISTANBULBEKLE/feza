# CLAUDE.md — feza

> Project memory for Claude Code. Read this first.

## What feza is

A small Next.js 16 App Router app built as the demo for the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."* The app's value is the **workflow it showcases**, not its features.

- **Epic 1 — `/explore`** (already built): NASA Image Library search.
- **Epic 2 — `/apod`** (live-coded on stage): APOD browser. The page is a placeholder until then.

Full design lives in `PROJECT_PLAN.md`. Tickets live in `EPICS.md`.

## Stack

- Next.js **16** (App Router, **Turbopack default**, **`params`/`searchParams` are async**)
- React 19.2
- TypeScript 5
- **SCSS modules only** — no Tailwind, no styled-components
- Vitest + Testing Library + jsdom
- ESLint (flat config)
- Node ≥ 20.9 (project uses 22.x)

## Folder conventions

```
src/
  app/                 routes only (page.tsx, layout.tsx, loading.tsx, route.ts, proxy.ts)
  components/<Name>/   <Name>.tsx + <Name>.module.scss + <Name>.test.tsx (3 files per component)
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
| `make stop` | Kill process on :3000 |
| `make build` | Production build |
| `make test` | Vitest one-shot run |
| `make test-watch` | Vitest watch mode |
| `make lint` | ESLint |
| `make clean` | Remove `.next` + `node_modules` |
| `make init` | Fresh demo: clean + install + dev |
| `PR=123 make pr-review` | Local invocation of `/review-pr` skill |

Always run `make build` before claiming a feature is done — Turbopack catches type errors that `npm run dev` happily ignores.

## Do

- **Server Components by default.** Only add `"use client"` when the file genuinely needs hooks, browser APIs, or event handlers.
- **Await `params` and `searchParams`** in pages and Route Handlers (Next.js 16 made these async).
- **Keep `proxy.ts` in `src/`** — `middleware.ts` is deprecated in v16. Export a function named `proxy`.
- **Read `NASA_API_KEY` only on the server** via `nasaApiKey()` in `src/lib/env.ts`. Never embed it in a client bundle.
- **Use the Route Handlers in `src/app/api/*`** as the only path between the browser and NASA — clients should never hit `images-api.nasa.gov` directly.
- **One folder per component**, three files (tsx + .module.scss + .test.tsx). Use the `/feza-component` skill to scaffold.
- **Plain `<img>` for NASA thumbnails.** Their CDN serves rotating S3 URLs, and configuring `next/image` `remotePatterns` for `*.nasa.gov` adds noise to the live demo. (We disable `@next/next/no-img-element` per-line where needed.)

## Don't

- Don't add Tailwind, CSS-in-JS, or global CSS beyond `globals.scss`.
- Don't create a folder under `src/app/` that isn't a route — colocated helpers belong in `src/`.
- Don't fall back to `DEMO_KEY` for NASA APOD — its 30 req/hr cap will brick the live demo. Throw if `NASA_API_KEY` is unset.
- Don't commit `.env.local`. Use `.env.example` as the contract.
- Don't pre-build Epic 2 (`/apod`) — it stays as a placeholder until the live demo. The lib/route signatures are pre-shipped so the demo flow is "fill in the body, not invent it."

## Live-demo etiquette

When asked to build Epic 2 on stage:
1. Use `/feza-route apod` to scaffold page + route handler.
2. Use `/feza-component DatePicker` for the new component.
3. Reuse `<PhotoCard>` and `<PhotoGrid>` from `src/components/`.
4. Run `make test` after each ticket — green tests are the demo's punctuation.

## References

- `PROJECT_PLAN.md` — full plan
- `EPICS.md` — ticket-by-ticket breakdown
- `INTEGRATION_STEPS_PLAN.md` — Figma + GitHub + Canva playbook
- `FEZA_PLAN.md` — business / talk-narrative plan
- `START.md` — 60-second how-to-run
