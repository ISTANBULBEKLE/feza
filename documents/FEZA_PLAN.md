# FEZA_PLAN.md — Talk Narrative

The "why" behind feza. Used as scaffolding for the 45-min talk; not load-bearing for the code.

## Vision

`feza` is a tiny Next.js 16 app whose purpose is a **runnable mental model** of how Claude Code, CLAUDE.md, Skills, MCP, and Claude Desktop fit into everyday product work — not slideware.

By the end of the talk, an audience member should be able to answer: *"how would I introduce this in my team next Monday?"*

## Three deliberate beats

1. **Memory you can read** — `CLAUDE.md` is not a black box. The audience sees what the model knows, edits it, commits it, and watches behavior change.
2. **Workflows you can package** — `/feza-component`, `/feza-route`, `/feza-story`, `/eslint-check`, `/sonar-scan`, `/review-pr`. A skill is a reusable team asset, not a personal incantation.
3. **Tools that talk to each other** — Figma → Claude Desktop → repo → PR → Claude review on GitHub, with SonarCloud and Chromatic gating the merge. Same engineer, same hour.

## 45-minute arc

| Min | Beat | On screen |
|---|---|---|
| 0–5 | Hook: "I'll build this NASA browser feature end-to-end, live" | Landing page on `localhost:3000` |
| 5–10 | Tour Epic 1 (`/explore`) — the already-shipped journey | Code + browser side-by-side |
| 10–15 | CLAUDE.md walkthrough — how it shapes Claude's choices | `cat CLAUDE.md`, `claude` REPL |
| 15–25 | Live-code Epic 2 (`/apod`) — Figma → `/feza-route` → green tests | Claude Desktop + terminal split |
| 25–32 | Push branch, watch all 4 GH workflows post checks (lint / sonar / chromatic / Claude review) | GitHub PR view |
| 32–40 | MCP show-and-tell — Figma, GitHub, Playwright | `claude mcp list`, screenshots |
| 40–45 | Q&A + "what to try Monday morning" | Slide with repo + skill links |

## Pre-flight checklist (night before)

- [ ] `make init` runs clean on a fresh clone in < 60 s
- [ ] `make test` green
- [ ] `make build` green
- [ ] `npm run build-storybook` succeeds
- [ ] `NASA_API_KEY` set in `.env.local` (verify with `/api/apod?date=YYYY-MM-DD`)
- [ ] GitHub repo public; `ANTHROPIC_API_KEY`, `SONAR_TOKEN`, `CHROMATIC_PROJECT_TOKEN` secrets set
- [ ] SonarCloud project imported, Automatic Analysis off, New Code definition set
- [ ] Chromatic project linked, GitHub App approved, baseline accepted
- [ ] `claude mcp list` shows GitHub + Figma Dev Mode + Playwright
- [ ] Figma file open on second screen with both Epic frames
- [ ] Canva hero asset exported to `public/hero.png`
- [ ] Backup terminal recording in case Wi-Fi dies
- [ ] Phone hotspot tested

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| NASA API outage on stage | Epic 1 uses Image Library (rock-solid); Epic 2's APOD has been stable for years; backup recording captures both. |
| Claude API latency during PR review | Workflow has `--max-turns 6`; skill is scoped tightly; fall back to reading the review out loud. |
| Figma MCP auth fails at the venue | Pre-fetch designs as PNGs; live-coding still works — Claude reads the PNG. |
| Audience attention drops during scaffolding | Use skills to keep scaffolding to one command each. Never type boilerplate live. |
| Live coding produces a bug Claude can't fix | Keep `feature/apod-fallback` branch pre-staged with the working implementation. |
| SonarCloud / Chromatic gate fails on the demo PR | Quality-gate fails are entertainment, not blockers. Continue narrating. |

## Out of scope

Auth. Mobile-first design. i18n. Animation polish. The Mars Rover Photos API (degraded; replaced by Image Library).

## Success metrics

| Metric | Target | How measured |
|---|---|---|
| Hands-on after the talk | 30%+ clone the repo within 24h | GitHub traffic |
| "I'm trying this Monday" | 5+ verbatim audience quotes | Post-talk feedback |
| Skill reuse | At least one viewer opens a PR using a feza skill adapted to their repo | Inbound forks |
| Demo reliability | Zero on-stage failures | Pre-flight above |
