# EPICS — feza

Two epics. **Epic 1 ships before the talk.** **Epic 2 is live-coded on stage.**

Each ticket is sized to be one commit / one small PR. Acceptance criteria are intentionally tight so the demo doesn't drift mid-stream.

---

## Epic 1 — `/explore` · NASA Image Library search (PRE-BUILT)

**Goal:** A user can pick a topic preset, narrow by media type and year range, and see a card grid of NASA images.

**Data source:** `https://images-api.nasa.gov/search` (no API key, fully working).

### E1-T1 — Constants & types
- Files: `src/constants/nasa.ts`, `src/lib/nasa.ts` (types)
- AC: `IMAGE_LIBRARY_BASE`, `TOPIC_PRESETS`, `MEDIA_TYPES`, `YEAR_OPTIONS` exported. `NasaSearchItem`, `NasaSearchResult` typed.

### E1-T2 — Library wrapper
- File: `src/lib/nasa.ts`
- AC: `searchImages({ q, mediaType, yearStart, yearEnd, pageSize, signal })` resolves to `{ items, totalHits }`. Maps the gnarly `collection.items[].data[0]` shape to a flat `NasaSearchItem`.

### E1-T3 — Route Handler
- File: `src/app/api/nasa-search/route.ts`
- AC: `GET` validates `q`, optional `mediaType`, `yearStart`, `yearEnd`. 400 on missing `q`, 502 on upstream failure, 200 with `Cache-Control: public, s-maxage=300, stale-while-revalidate=900` on success.

### E1-T4 — `Select` and `Button` atoms
- Files: `src/components/Select/{Select.tsx,.module.scss,.test.tsx}` and `src/components/Button/...`
- AC: `Select<V extends string>` is generic, supports placeholder, fires `onChange(value)`. `Button` supports `primary`/`ghost`. Both have unit tests.

### E1-T5 — `PhotoCard` and `PhotoGrid`
- Files: `src/components/PhotoCard/...`, `src/components/PhotoGrid/...`
- AC: `PhotoCard` renders thumbnail (or fallback), title, center, formatted date, clamped description. `PhotoGrid` is a responsive `auto-fill, minmax(240px, 1fr)` grid with empty-state.

### E1-T6 — `useDebounce` and `useNasaSearch` hooks
- Files: `src/hooks/useDebounce.ts`, `src/hooks/useNasaSearch.ts`
- AC: `useDebounce(value, ms)` returns the trailing value. `useNasaSearch(filters)` debounces, aborts in-flight requests on filter change, returns `{ items, totalHits, loading, error }`.

### E1-T7 — `/explore` page
- Files: `src/app/explore/page.tsx` (server) + `src/app/explore/ExplorePanel.tsx` (client) + `.module.scss`
- AC: Server page renders client `<ExplorePanel>`. Panel has 4 selects + reset button + status row + grid. `aria-busy` while loading.

### E1-T8 — Tests
- AC: `make test` reports ≥ 11 passing tests across Select / Button / PhotoCard / PhotoGrid / ExplorePanel. Fetch mocked via `vi.spyOn(globalThis, 'fetch')`.

### E1-T9 — Polish
- AC: Empty state, error state, loading state all reachable. All form fields keyboard-navigable. Hover/focus rings visible. Links from `/` to `/explore` and back.

**Status: ✅ shipped before stage. `make test` → 11 passing.**

---

## Epic 2 — `/apod` · Astronomy Picture of the Day browser (LIVE-CODED)

**Goal:** A user can pick a date OR ask for N random APODs and see a card list with title, date, image/video, and explanation.

**Data source:** `https://api.nasa.gov/planetary/apod` — requires the `NASA_API_KEY` from `.env.local`. The Route Handler attaches the key server-side.

### E2-T1 — Figma hand-off
- Tool: Claude Desktop + Figma Dev Mode MCP.
- Action: Open the Epic 2 frame in Figma. Ask Claude Desktop *"get the current selection's structure and primary tokens, then scaffold a Next.js page from it into `src/app/apod/page.tsx`."*
- AC: Claude writes a draft `page.tsx` matching the Figma layout's regions (header, controls, list).

### E2-T2 — Scaffold via skill
- Tool: `/feza-route apod`.
- Files written: `src/app/apod/page.tsx` (server) + `src/app/apod/ApodPanel.tsx` (client) + `.module.scss` + `src/app/api/apod/route.ts` (real implementation).
- AC: All four files exist, page renders, `/api/apod` responds 400 on missing params.

### E2-T3 — Library wrapper
- File: `src/lib/nasa.ts`
- AC: `getApod({ apiKey, date?, count?, signal? })` calls APOD with exactly one of `date` or `count`. Returns `ApodItem | ApodItem[]`. The signature already exists in the file as a hint; the live demo fills in the validation.

### E2-T4 — Route Handler
- File: `src/app/api/apod/route.ts`
- AC: `GET` reads `date` or `count` query params, calls `getApod` with `nasaApiKey()`, returns 200/400/502. **Never includes the API key in the response.**

### E2-T5 — DatePicker component
- Tool: `/feza-component DatePicker`.
- Files written: `src/components/DatePicker/{DatePicker.tsx,.module.scss,.test.tsx}`.
- AC: Wraps `<input type="date">` styled to match other atoms. Supports `min`, `max`, `onChange(YYYY-MM-DD)`. Test covers value emission.

### E2-T6 — Wire ApodPanel
- File: `src/app/apod/ApodPanel.tsx`
- AC: Toggle between "single date" and "random N" mode (mutually exclusive). Reuses `<PhotoGrid>` (single mode renders an array of one).

### E2-T7 — Video handling
- File: `src/components/PhotoCard/PhotoCard.tsx` (extended) or new `MediaCard`
- AC: When the APOD `media_type === "video"`, render an `<iframe>` instead of `<img>`. Detect YouTube/Vimeo and use thumbnail when available.

### E2-T8 — Tests
- AC: `make test` is still green. New tests: DatePicker emission test, APOD route test (mock `getApod`), ApodPanel render test.

### E2-T9 — PR review on GitHub
- Action: `git checkout -b feature/apod`, push, `gh pr create`.
- AC: `.github/workflows/claude-pr-review.yml` triggers; review comments appear within ~2 min. Address one comment, push fix, merge.
