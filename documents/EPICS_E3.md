# EPICS — feza · Part 2 (Epic 3)

Epic 3 lives in its own file because it's the live-coded build of the Part 2 demo. Same shape as the two epics in `documents/EPICS.md`: each ticket sized to one commit / one small PR. The parent Epic and three demo-time children are mirrored in Jira project `KAN` (`feza 1`) on `ekipkalir.atlassian.net` — the talk demonstrates Claude reading the Jira version on stage. See `documents/EPIC_3_TICKETS.md` for the demo-time runbook with real KAN-N keys.

## Epic 3 — `/asteroids` · Near-Earth Objects Browser · 🎬 live-coded in Part 2

User picks a date (or a date range up to 7 days) and sees a card list of asteroids passing near Earth, with size, miss-distance, velocity, and a red pill if `is_potentially_hazardous_asteroid` is true. Data source: `https://api.nasa.gov/neo/rest/v1/feed` — `NASA_API_KEY` attached server-side in the Route Handler, never reaches the client.

Pre-stage: only commit the placeholder `src/app/asteroids/page.tsx`, the placeholder `src/app/api/asteroids/route.ts` (returns 501), the `NEO_BASE` constant, and the `getAsteroids` signature in `src/lib/nasa.ts` that throws "not implemented." Everything below runs live.

| ID | Title | Tool / Files | Acceptance |
|---|---|---|---|
| E3-T1 | Confluence spec → Jira Epic + tickets | `/atlassian:spec-to-backlog` | The Confluence "Epic 3 — `/asteroids` — Specification" page produces a Jira Epic and child tickets E3-T2 through E3-T9 with titles, descriptions, and acceptance copied from the spec. |
| E3-T2 | Library wrapper body | `src/lib/nasa.ts` | `getAsteroids({ apiKey, startDate, endDate?, signal? })` calls `${NEO_BASE}/feed`, maps `near_earth_objects[date][]` → flat `AsteroidItem`. Returns `{ items, elementCount }`. Defaults `endDate` to `startDate`. |
| E3-T3 | Constants & types | `src/constants/nasa.ts` (already shipped: `NEO_BASE`); `src/lib/nasa.ts` | `AsteroidItem`, `AsteroidsResult`, `GetAsteroidsParams` exported. (Pre-shipped — confirm on stage.) |
| E3-T4 | Route Handler body | `src/app/api/asteroids/route.ts` | `GET` reads `start_date`/`end_date`, calls `getAsteroids` with `nasaApiKey()`. Never embeds the key. 200 with `Cache-Control: public, s-maxage=300, stale-while-revalidate=900`, 400 on missing `start_date`, 502 on upstream failure. |
| E3-T5 | DateRangePicker | `/feza-component DateRangePicker` | Two `<input type="date">` styled to match other atoms, max 7-day span, `onChange({ start, end })`. Test covers value emission and clamping. |
| E3-T6 | HazardousPill | `/feza-component HazardousPill` | Renders a red pill when `hazardous` prop is true; nothing when false. Storybook story for both states. |
| E3-T7 | `/asteroids` page | `/feza-from-jira KAN-8` → `/feza-route asteroids` then claude.ai/design hand-off | Server page renders client `<AsteroidsPanel>`. Date-range picker + status row + grid of `<AsteroidCard>` (extends `<PhotoCard>` shape). Reuses `<PhotoGrid>` for the layout. `aria-busy` while loading. |
| E3-T8 | Tests | — | `make test` ≥ 14 passing across atoms / molecules / panel. NeoWs fetch mocked via `vi.spyOn`. |
| E3-T9 | PR + CI | `gh pr create` | All 4 GH workflows post status checks within ~2 min: lint / sonarcloud / chromatic / Claude PR review. Address one comment, push, merge. Status report posted to Confluence via `/atlassian:generate-status-report`. |

## Why this shape

E3 mirrors E2 deliberately: same number of tickets, same general flow (constants → lib → route → atom → cards → page → tests → PR). The novelty is upstream (Atlassian + Claude Design) and the two new components (DateRangePicker for ranges, HazardousPill for the visual flair). If the upstream beats fall apart on stage, the live build still works because it's the same shape Claude has done twice already.

## Out of scope (Epic 3)

Orbital trajectory plots. Asteroid detail pages. Pagination beyond 7 days. Browse-mode (start/end-date-less feed). The other three NeoWs endpoints (`/lookup`, `/browse`, `/stats`).
