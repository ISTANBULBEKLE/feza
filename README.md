# feza

A small Next.js 16 demo app — the centerpiece of the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*

Two epics:
- **`/explore`** — search the NASA Image Library (pre-built)
- **`/apod`** — Astronomy Picture of the Day (live-coded on stage)

## Run it

```bash
cp .env.example .env.local   # paste a free NASA_API_KEY from https://api.nasa.gov/
make init                    # clean install + dev server on :3000
```

See `START.md` for the 60-second tour, `PROJECT_PLAN.md` for the full plan, and `INTEGRATION_STEPS_PLAN.md` for wiring Figma / GitHub / Canva into Claude Code.
