# feza

[![lint](https://github.com/ISTANBULBEKLE/feza/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/ISTANBULBEKLE/feza/actions/workflows/lint.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=ISTANBULBEKLE_feza&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ISTANBULBEKLE_feza)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ISTANBULBEKLE_feza&metric=coverage)](https://sonarcloud.io/component_measures?id=ISTANBULBEKLE_feza&metric=coverage)
[![Chromatic](https://img.shields.io/badge/Chromatic-visual%20tests-ff4785?logo=chromatic&logoColor=white)](https://www.chromatic.com/builds?appId=YOUR_APP_ID)

A small Next.js 16 demo app — the centerpiece of the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*

Three epics:
- **`/explore`** — search the NASA Image Library (pre-built)
- **`/apod`** — Astronomy Picture of the Day (live-coded in Part 1)
- **`/asteroids`** — Near-Earth Objects browser (live-coded in Part 2 — Atlassian → Claude Design → Claude Code)

## Skills

| Skill | When to use |
|---|---|
| `/feza-component <Name>` | Scaffold a new component (3-file pattern: `.tsx` + `.module.scss` + `.test.tsx`) |
| `/feza-route <segment>` | Scaffold a new App Router page + paired `/api` route handler |
| `/feza-story <Name>` | Add a Storybook CSF3 stories file alongside an existing component |
| `/nasa-fetch <endpoint> <baseUrl>` | Wrap a NASA API endpoint into `src/lib/nasa.ts` + a Route Handler |
| `/eslint-check [path]` | Triaged lint report — errors, warnings, auto-fixable, CLAUDE.md violations |
| `/sonar-scan` | Local SonarCloud pass — quality gate, new issues, coverage, hotspots |
| `/review-pr <#>` | PR review against CLAUDE.md conventions |
| `/feza-from-jira <KEY>` | Read a Jira ticket via the Atlassian MCP and dispatch to the right scaffold skill (Part 2) |

`feza-component` + `feza-story` is the build pair. `eslint-check` + `sonar-scan` + `review-pr` is the ship pipeline. `feza-from-jira` is the Part 2 entry point — it composes the bundled `atlassian:*` skills with the scaffold skills above.

### Bundled Atlassian skills used in Part 2

These ship with Claude Code; no setup beyond registering the Atlassian MCP (see `documents/ATLASSIAN_SETUP.md`):

- `/atlassian:search-company-knowledge` — cited Confluence/Jira answers
- `/atlassian:spec-to-backlog` — Confluence spec → Jira Epic + implementation tickets
- `/atlassian:generate-status-report` — Jira board → Confluence status page
- `/atlassian:capture-tasks-from-meeting-notes` — meeting notes → Jira tasks
- `/atlassian:triage-issue` — bug triage with duplicate detection

## Run it

```bash
cp .env.example .env.local   # paste a free NASA_API_KEY from https://api.nasa.gov/
make init                    # clean install + dev server on :3000
```

See `START.md` for the 60-second tour, `documents/PROJECT_PLAN.md` for the full plan, `documents/INTEGRATION_STEPS_PLAN.md` for wiring Figma / GitHub / Canva into Claude Code, and `documents/SETUP.md` for the one-time SonarCloud + Chromatic checklist.

For Part 2 (Atlassian + Claude Design): `documents/PART2_PLAN.md` (talk narrative), `documents/ATLASSIAN_SETUP.md` (MCP wiring), `documents/EPICS_E3.md` (Epic 3 ticket breakdown), `documents/CLAUDE_DESIGN_PROMPTS.md` (paste-ready prompts for the canonical design tool).

**Design tooling:** `claude.ai/design` is the canonical design + prototyping path (free, renders real HTML/CSS that respects `tokens.json`). The Canva MCP is also connected and usable for graphic mockups, but is **not preferred** — Canva's Brand Kit feature (which would force on-palette generation) requires a paid Canva plan; recipe in `documents/CANVA_BRAND_KIT.md`.
