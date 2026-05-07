# feza

[![lint](https://github.com/ISTANBULBEKLE/feza/actions/workflows/lint.yml/badge.svg?branch=main)](https://github.com/ISTANBULBEKLE/feza/actions/workflows/lint.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=ISTANBULBEKLE_feza&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ISTANBULBEKLE_feza)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ISTANBULBEKLE_feza&metric=coverage)](https://sonarcloud.io/component_measures?id=ISTANBULBEKLE_feza&metric=coverage)
[![Chromatic](https://img.shields.io/badge/Chromatic-visual%20tests-ff4785?logo=chromatic&logoColor=white)](https://www.chromatic.com/builds?appId=YOUR_APP_ID)

A small Next.js 16 demo app — the centerpiece of the talk *"Your AI Dev Partner in the Terminal: Claude Code, CLAUDE.md, Skills, Cowork, MCP for everyday dev work."*

Two epics:
- **`/explore`** — search the NASA Image Library (pre-built)
- **`/apod`** — Astronomy Picture of the Day (live-coded on stage)

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

`feza-component` + `feza-story` is the build pair. `eslint-check` + `sonar-scan` + `review-pr` is the ship pipeline.

## Run it

```bash
cp .env.example .env.local   # paste a free NASA_API_KEY from https://api.nasa.gov/
make init                    # clean install + dev server on :3000
```

See `START.md` for the 60-second tour, `PROJECT_PLAN.md` for the full plan, `INTEGRATION_STEPS_PLAN.md` for wiring Figma / GitHub / Canva into Claude Code, and `SETUP.md` for the one-time SonarCloud + Chromatic checklist.
