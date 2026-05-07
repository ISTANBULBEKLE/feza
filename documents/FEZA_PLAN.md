# FEZA_PLAN.md — Project & Talk-Narrative Plan

> Why this app exists, who it's for, what success looks like, and the 90-day roadmap that turns it from "demo" into "asset."

## 1. Vision

**feza** is a deliberately tiny Next.js 16 app whose purpose is to give engineers a *concrete, runnable* mental model of how Claude Code, CLAUDE.md, Skills, MCP, and Claude Desktop fit into everyday product work — not slideware, not a toy, an actual repo they could fork on the spot.

The destination isn't "ship a NASA viewer." It's: by the end of the talk, an audience member should be able to answer "how would I introduce this in my team next Monday?"

## 2. Audience

| Segment | What they care about | What feza shows them |
|---|---|---|
| **Senior product engineers** | "Will this make my Tuesday faster, or is it more ceremony?" | One-command run, real tests, real PR review — same day-to-day rhythm, with Claude doing the boring parts |
| **Tech leads / staff engineers** | "Can I make this consistent across my team?" | CLAUDE.md as durable conventions, skills as packaged workflows, GitHub Action as the shared review baseline |
| **Engineering managers** | "Where does this save time, and where does it drift?" | The arc from Figma → code → PR review is a single demo arc — they can map it to their team's pipeline |
| **AI-curious devs** | "Show me, don't tell me" | Live coding Epic 2 from a Figma design, with the audience watching every keypress |

## 3. Value proposition

Three deliberate beats:
1. **Memory you can read** — `CLAUDE.md` is not a black box. The audience can see exactly what the model knows about the repo, edit it, commit it, and watch behavior change.
2. **Workflows you can package** — `/feza-component`, `/feza-route`, `/review-pr`. A skill is a reusable team asset, not a personal incantation.
3. **Tools that talk to each other** — Figma → Claude Desktop → repo → PR → Claude review on GitHub. Same engineer, same brain, same hour.

## 4. Talk narrative (45 minutes)

| Min | Beat | What's on screen |
|---|---|---|
| 0–5 | Hook: "I'll build a NASA browser feature, end-to-end, in front of you" | Landing page on `localhost:3000` |
| 5–10 | Tour Epic 1 (`/explore`) — the *already-shipped* journey | Code + browser side-by-side |
| 10–15 | CLAUDE.md walkthrough — show how it shapes Claude's choices | `cat CLAUDE.md`, `claude` REPL |
| 15–25 | Live-code Epic 2 (`/apod`) — Figma frame → `/feza-route` skill → green tests | Claude Desktop + terminal split |
| 25–32 | Push branch, open PR, watch GitHub Action review it | GitHub PR view |
| 32–40 | MCP show-and-tell — Figma, GitHub, Playwright | `claude mcp list`, screenshots |
| 40–45 | Q&A + "what to try Monday morning" | Slide w/ links to repo + skills |

## 5. Success metrics (talk-as-product)

| Metric | Target | How measured |
|---|---|---|
| Hands-on after the talk | 30%+ of attendees clone the repo within 24h | GitHub clone counter |
| "I'm trying this Monday" signal | 5+ verbatim audience quotes | Post-talk Slack/feedback form |
| Skill-reuse | At least one viewer opens a PR using `/feza-component` or `/review-pr` adapted to their repo | Inbound stars/forks from talk attendees |
| Demo reliability | Zero on-stage failures across both epics | Pre-flight checklist below |

## 6. Pre-flight checklist (the night before)

- [ ] `make init` runs clean on a fresh clone in <60s
- [ ] `make test` green
- [ ] `make build` green
- [ ] `NASA_API_KEY` set in `.env.local` (verified by hitting `/api/apod?date=YYYY-MM-DD`)
- [ ] GitHub repo public, `ANTHROPIC_API_KEY` secret set
- [ ] `claude mcp list` shows GitHub + Figma Dev Mode + Playwright
- [ ] Figma file open on second screen with both Epic frames
- [ ] Canva hero asset exported to `public/hero.png`
- [ ] Backup terminal recording in case Wi-Fi dies
- [ ] Phone hotspot tested

## 7. Monetization paths (if feza becomes more than a demo)

Mostly aspirational — the goal is the talk, not the SaaS. But possible directions:

| Path | Who pays | What it'd take |
|---|---|---|
| **Workshop kit** — feza + facilitator notes sold as a one-day team workshop | Eng leaders, dev-rel teams | Polish the script, add 6–8 follow-on exercises, package as a private repo |
| **Open-source starter** — the skill-set + folder layout as a `create-feza` CLI | Free, attention-driven | Extract skills into a separate repo, add a CLI wrapper |
| **Internal-use template** — feza-shaped repo template for a specific org's stack | One-off contract | Fork-and-customize per org; not a product |

## 8. 90-day roadmap (post-talk)

| Week | Focus |
|---|---|
| 1 | Land the talk. Capture audience questions verbatim |
| 2 | Open-source the repo (already public for talk; now add a tagline + GIF demo) |
| 3 | Write a companion blog post: "feza in 30 minutes" |
| 4 | Add a third epic (NEO feed) as community-contribution surface |
| 5–6 | `create-feza` CLI prototype |
| 7–8 | Integrate Canva MCP if it ships in the official registry |
| 9–10 | Workshop facilitator deck v1 |
| 11–12 | Run the workshop with one friendly team; iterate |

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **NASA API down on stage** (Mars Photos service has been flaky) | Epic 1 uses Image Library which is rock-solid; Epic 2's APOD has been stable for years; backup recording captures the demo if both fail |
| **Claude API latency** during PR review | Workflow has `--max-turns 5`; skill is scoped tightly; backup is to read the review out loud from the recording |
| **Figma MCP auth fails** at the venue | Pre-fetch the design as PNGs to `/tmp/figma-cache/`; the live-coding step still works without the MCP — Claude reads the PNG instead |
| **Audience attention drops during scaffolding** | Use skills (`/feza-component`) to keep scaffolding to one keystroke each; never type boilerplate live |
| **Live coding produces a bug Claude can't fix** | Keep a `/feature/apod-fallback` branch with the working implementation pre-staged |

## 10. Out of scope

- Authentication. NASA APIs are public — adding auth would burn time without buying narrative.
- Mobile-first design. Desktop is the natural medium for a developer audience.
- Multi-language i18n. English only, on purpose.
- Animation polish. Subtle hover transitions only — no scroll choreography.
