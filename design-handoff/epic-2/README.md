# Epic 2 — `/apod` (Astronomy Picture of the Day)

Implement the `/apod` route in the feza Next.js app following this spec.
Open `preview.standalone.html` in a browser for the visual reference.

---

## Files to create

```
src/app/apod/page.tsx                     (REPLACE the existing placeholder)
src/app/apod/apod.module.scss             (NEW)
src/components/DatePicker/DatePicker.tsx       (NEW)
src/components/DatePicker/DatePicker.module.scss
src/components/DatePicker/DatePicker.test.tsx
```

Existing files used: `Header`, `Footer`, `Button`, `PhotoCard`, `PhotoGrid`,
`SkeletonCard`. **Do not duplicate** these.

API route `src/app/api/apod/route.ts` already exists — call it from the page.

---

## 1. `DatePicker` component

```ts
type DatePickerProps = {
  label?: string;        // default "Date"
  value: string;         // YYYY-MM-DD
  onChange: (v: string) => void;
  disabled?: boolean;
  min?: string;
  max?: string;          // default = today
};
```

Style — mirrors `SearchBox` field pattern:

- Wrapper: `display: grid; gap: 6px;`
- Label: 12px, letter-spacing `.06em`, `text-transform: uppercase`,
  `color: var(--muted)`
- `<input type="date">`: `background: var(--surface)`,
  `1px solid var(--border)`, `border-radius: var(--radius-md)`,
  padding `10px 12px`, font-size 14px
- Focus: `outline: 2px solid var(--accent); border-color: var(--accent);`
- Disabled: `opacity: 0.5`

Test coverage: renders with value, fires `onChange`, respects `disabled`,
clamps to `max`.

---

## 2. `/apod` page layout

Order top → bottom:

1. `<Header active="apod" />`
2. `<main>` (max-width `var(--maxw)`, padding `32px 20px 80px`)
3. **Header block** (`.apod-header`)
   - `<span className="fz-tag">Epic 2 · Astronomy Picture of the Day</span>`
   - `<h1 className="fz-shine">{featured.title}</h1>` —
     `clamp(28px, 5vw, 40px)`, weight `var(--fz-weight-display)`,
     letter-spacing `var(--fz-tracking-tight)`
   - `<p>` formatted date + `© {copyright}` — 13px muted
4. **Feature card** (`.apod-feature`)
   - Grid `1.4fr 1fr`, gap 24px, on mobile `1fr`
   - Media pane: aspect-ratio 4/3, `var(--surface-2)` bg,
     `object-fit: cover`
   - Body pane: padding `20px 24px`, `align-self: center`, 14px line-height 1.6
5. **Panel** (`.apod-panel`)
   - Mode segmented control: "By date" | "Random count" —
     `var(--surface)` background, 1px border, padding 4px, inner buttons
     6×14 with `border-radius: 8px`. Active = `var(--surface-2)`.
   - If date mode: `<DatePicker>` with `max={today}`
   - If random mode: `<input type="range" min={1} max={10}>` —
     `accent-color: var(--accent)`
   - Primary `<Button>Fetch</Button>`
   - Status row "Showing N of M" — 13px muted
   - `<PhotoGrid>` of `<PhotoCard>` items — clicking a card swaps
     `featured`

---

## 3. Data flow

```ts
"use client";
// state: mode ("date" | "random"), date (string), count (number), items (Apod[]), featured (Apod)
// on mount: fetch /api/apod?date=today
// on submit: fetch /api/apod?date=… OR /api/apod?count=…
// on card click: setFeatured(item)
```

Cache: rely on Next.js fetch defaults (no manual revalidate config).

---

## 4. Verification

```bash
npm run lint
npm test
npm run dev   # smoke-test /apod
```

## Constraints

- All color/shadow/weight values via CSS custom properties — **no inline hex**
- No new dependencies
- Co-locate test next to component (`Foo.test.tsx`)
- Preserve existing component public APIs
