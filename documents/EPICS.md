# EPICS — feza

Two epics. Each ticket sized to one commit / one small PR.

## Epic 1 — `/explore` · NASA Image Library search · ✅ shipped

User picks a topic preset, narrows by media type and year range, sees a card grid of NASA images. Data source: `https://images-api.nasa.gov/search` (no API key).

| ID | Title | Files | Acceptance |
|---|---|---|---|
| E1-T1 | Constants & types | `src/constants/nasa.ts`, `src/lib/nasa.ts` | `IMAGE_LIBRARY_BASE`, `TOPIC_PRESETS`, `MEDIA_TYPES`, `YEAR_OPTIONS` exported. `NasaSearchItem`, `NasaSearchResult` typed. |
| E1-T2 | Library wrapper | `src/lib/nasa.ts` | `searchImages({ q, mediaType, yearStart, yearEnd, pageSize, signal })` → `{ items, totalHits }`. Maps `collection.items[].data[0]` to flat `NasaSearchItem`. |
| E1-T3 | Route Handler | `src/app/api/nasa-search/route.ts` | 400 on missing `q`, 502 on upstream failure, 200 with `Cache-Control: public, s-maxage=300, stale-while-revalidate=900`. |
| E1-T4 | `Select` + `Button` atoms | `src/components/{Select,Button}/...` | `Select<V>` generic with placeholder + `onChange(value)`. `Button` supports `primary`/`ghost`. Tests for both. |
| E1-T5 | `PhotoCard` + `PhotoGrid` | `src/components/{PhotoCard,PhotoGrid}/...` | `PhotoCard` renders thumbnail (or fallback) + title + center + date + clamped description. `PhotoGrid` is `auto-fill, minmax(240px, 1fr)` with empty-state. |
| E1-T6 | Hooks | `src/hooks/{useDebounce,useNasaSearch}.ts` | `useDebounce(value, ms)` returns trailing value. `useNasaSearch(filters)` debounces, aborts in-flight requests, returns `{ items, totalHits, loading, error }`. |
| E1-T7 | `/explore` page | `src/app/explore/{page.tsx,ExplorePanel.tsx,*.module.scss}` | Server page renders client panel. 4 selects + reset + status row + grid. `aria-busy` while loading. |
| E1-T8 | Tests | — | `make test` ≥ 11 passing across atoms / molecules / panel. Fetch mocked via `vi.spyOn`. |
| E1-T9 | Polish | — | Empty / error / loading states reachable. Keyboard-navigable. Hover/focus rings. |

## Epic 2 — `/apod` · Astronomy Picture of the Day · live-coded on stage

User picks a date OR asks for N random APODs and sees a card list. Data source: `https://api.nasa.gov/planetary/apod` — `NASA_API_KEY` attached server-side in the Route Handler, never reaches the client.

Pre-stage: only commit a placeholder `src/app/apod/page.tsx`. Everything below runs live.

| ID | Title | Tool / Files | Acceptance |
|---|---|---|---|
| E2-T1 | Figma hand-off | Claude Desktop + Figma Dev Mode MCP | Claude writes draft `page.tsx` matching the Figma layout's header / controls / list regions. |
| E2-T2 | Scaffold via skill | `/feza-route apod` | `src/app/apod/{page.tsx,ApodPanel.tsx,*.module.scss}` + `src/app/api/apod/route.ts` exist, page renders, `/api/apod` returns 400 on missing params. |
| E2-T3 | Library wrapper | `src/lib/nasa.ts` | `getApod({ apiKey, date?, count?, signal? })` calls APOD with exactly one of `date` or `count`. Returns `ApodItem | ApodItem[]`. Signature pre-shipped. |
| E2-T4 | Route Handler | `src/app/api/apod/route.ts` | `GET` reads `date`/`count`, calls `getApod` with `nasaApiKey()`. Never embeds the key in the response. 200/400/502. |
| E2-T5 | DatePicker | `/feza-component DatePicker` | Wraps `<input type="date">` styled to match other atoms. `min`, `max`, `onChange(YYYY-MM-DD)`. Test covers value emission. |
| E2-T6 | Wire ApodPanel | `src/app/apod/ApodPanel.tsx` | Toggle "single date" vs "random N" (mutually exclusive). Reuses `<PhotoGrid>`. |
| E2-T7 | Video handling | extend `PhotoCard` or new `MediaCard` | When `media_type === "video"`, render `<iframe>` instead of `<img>`. Use YouTube/Vimeo thumbnail if available. |
| E2-T8 | Tests | — | `make test` still green. New tests: DatePicker emission, APOD route (mock `getApod`), ApodPanel render. |
| E2-T9 | PR + CI | `gh pr create` | All 4 GH workflows post status checks within ~2 min: lint / sonarcloud / chromatic / Claude PR review. Address one comment, push, merge. |
