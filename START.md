# START.md — run feza in 60 seconds

```bash
git clone <this-repo>
cd feza
cp .env.example .env.local      # then paste your free NASA_API_KEY
make init                       # clean install + dev server on :3000
```

Open http://localhost:3000 — you'll see two cards. Click **Explore** to use the pre-built Epic 1, or **APOD** to see the live-demo placeholder.

## All commands

```bash
make             # list targets (default)
make dev         # dev server on :3000 (Turbopack)
make stop        # kill anything on :3000
make test        # vitest one-shot
make test-watch  # vitest watch mode
make build       # production build
make lint        # eslint
make storybook   # Storybook on :6006
make clean       # remove .next + node_modules
make init        # fresh demo: clean + install + dev
```

`make help` lists every target, including the quality-pass ones (`lint-fix`, `lint-check`, `coverage`, `sonar`, `pr-review`, …).

## What to read next

| File | When to read |
|---|---|
| `CLAUDE.md` | You're using Claude Code in this repo |
| `documents/PROJECT_PLAN.md` | You want the full plan |
| `documents/EPICS.md` | You want the ticket-by-ticket breakdown |
| `documents/SETUP.md` | You're setting up CI (SonarCloud + Chromatic) |
| `documents/INTEGRATION_STEPS_PLAN.md` | You're wiring Figma/GitHub/Canva |
| `documents/FEZA_PLAN.md` | You're giving the talk and want the narrative |
