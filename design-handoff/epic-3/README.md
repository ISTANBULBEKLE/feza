# Epic 3 — `/asteroids` (Near-Earth Objects)

Implement the `/asteroids` route in the feza Next.js app following this spec.
Open `preview.standalone.html` for the visual reference.

---

## Files to create

```
src/app/asteroids/page.tsx                            (NEW)
src/app/asteroids/asteroids.module.scss               (NEW)
src/app/api/asteroids/route.ts                        (NEW — NeoWs proxy)

src/components/AsteroidCard/AsteroidCard.tsx          (NEW)
src/components/AsteroidCard/AsteroidCard.module.scss
src/components/AsteroidCard/AsteroidCard.test.tsx

src/components/HazardousPill/HazardousPill.tsx        (NEW)
src/components/HazardousPill/HazardousPill.module.scss
src/components/HazardousPill/HazardousPill.test.tsx

src/components/DateRangePicker/DateRangePicker.tsx    (NEW)
src/components/DateRangePicker/DateRangePicker.module.scss
src/components/DateRangePicker/DateRangePicker.test.tsx
```

Header nav also needs a third link: `Asteroids → /asteroids`.

---

## 1. `HazardousPill`

Static element. No props beyond `className?`.

- Text: `Potentially Hazardous`
- Background `var(--danger)`, color white
- 10px, weight 700, letter-spacing `.06em`, uppercase
- Padding `4px 10px`, `border-radius: 999px`
- `white-space: nowrap`

---

## 2. `DateRangePicker`

```ts
type DateRangePickerProps = {
  start: string; end: string;
  onStart: (v: string) => void;
  onEnd:   (v: string) => void;
  maxSpanDays?: number;   // default 7 (NeoWs API limit)
};
```

Behaviour:

- On `onStart` change: also clamp `end` to `start + maxSpanDays`
- On `onEnd` change: clamp to `start + maxSpanDays`
- Caption below the two inputs:
  - Default: "Max 7 days (NeoWs API limit)" — `color: var(--muted)`, 12px
  - When end was clamped: same text but `color: var(--danger)`

Layout: grid `1fr 1fr`, gap 12px, labels "Start" / "End" above each input.
Inputs reuse `DatePicker`'s styling (or compose `DatePicker` directly).

---

## 3. `AsteroidCard`

```ts
type AsteroidCardProps = {
  name: string;          // e.g. "Apophis (99942)"
  date: string;          // close-approach date (YYYY-MM-DD)
  diameter: string;      // pre-formatted, e.g. "50–110 m"
  missDistance: string;  // e.g. "3.2M km"
  velocity: string;      // e.g. "14.1 km/s"
  magnitude: string;     // e.g. "21.4"
  hazardous: boolean;
  jplUrl: string;
};
```

Layout:

- Card: `var(--surface)`, 1px `var(--border)`, `var(--radius-lg)`,
  padding 16px, `box-shadow: var(--shadow-md)`, `display: grid; gap: 10px`
- Head row: flex space-between — `<h3>{name}</h3>` + optional
  `<HazardousPill/>`. Name 15px, weight `var(--fz-weight-heading)`
- Meta line: formatted date + " · close approach" — 12px muted
- `<dl>` stats: grid `auto 1fr`, col-gap 12px, row-gap 6px, 13px;
  `dt` muted, `dd` foreground
- "View on JPL →" link: justify-self end, 12px, `color: var(--accent)`

Skeleton variant (`<AsteroidCard.Skeleton />` or sibling component): three
shimmering lines matching the same outer card shell.

---

## 4. `/asteroids` page

1. `<Header active="asteroids"/>`
2. `<main>` (max-width `var(--maxw)`)
3. Header block:
   - `<span className="fz-tag">Epic 3 · Near-Earth Objects</span>`
   - `<h1 className="fz-shine">Near-Earth Objects</h1>` — same scale as
     Explore's H1
   - `<p>` muted: "Asteroids passing close to Earth in your selected window.
     Source: NASA NeoWs feed."
4. Panel:
   - `<DateRangePicker>` with default range = today → today+6
   - Status row: "{N} asteroids found · {start} → {end}"
   - Grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));`
     gap 16px, populated with `<AsteroidCard>`s
   - While loading: 6 skeleton cards

---

## 5. API proxy

`src/app/api/asteroids/route.ts`:

```ts
// GET /api/asteroids?start=YYYY-MM-DD&end=YYYY-MM-DD
// Proxies https://api.nasa.gov/neo/rest/v1/feed
// Uses process.env.NASA_API_KEY
// Returns flat array of AsteroidCardProps (flatten by date, sort ascending)
```

Validate `end - start ≤ 7 days`. Return 400 with `{ error }` otherwise.

---

## 6. Verification

```bash
npm run lint
npm test
npm run dev   # smoke-test /asteroids
```

## Constraints

- All color/shadow/weight values via CSS custom properties — **no inline hex**
- No new dependencies
- Co-locate tests next to components
- Preserve existing component public APIs
- Header gets a third nav link `Asteroids` matching existing pattern
