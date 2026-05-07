# feza — Design System & Tokens

Token reference for recreating feza's visual system in Figma.

**Source of truth in code:**
- Color, radii, shadow, layout tokens → `src/app/globals.scss` (`:root` + `prefers-color-scheme: light`)
- Per-component styles → `src/components/<Name>/<Name>.module.scss`
- Page styles → `src/app/{page,layout,explore/ExplorePanel,apod/placeholder}.module.scss`
- Machine-readable companion → `tokens.json` at repo root (DTCG / W3C Design Tokens format)

When a token changes, update SCSS + `tokens.json` + this file in the same PR. The `review-pr` skill flags drift between them as a CLAUDE.md violation.

## 1 · Brand

| | |
|---|---|
| Voice | Calm, technical, slightly cosmic. *"NASA archive viewer, not Disney space."* |
| Density | Roomy. Default gap 12–16px, hero spacing 24–32px. |
| Mood | Dark-first; precise light theme. Dark is canonical for the Figma master. |
| Brand mark | `✦` (U+2726) in `--accent`, paired with lowercase `feza` at 16px / 700. |
| Sparkle ratio | Exactly one ✦ per page (Header). No animation, no glow. |

## 2 · Color tokens

### 2.1 Dark theme (default · canonical)

| Token | Hex | Role |
|---|---|---|
| `--background` | `#0B0D12` | Page background |
| `--foreground` | `#E7EAF2` | Primary text |
| `--muted` | `#8B93A7` | Secondary text, labels, meta, placeholders |
| `--surface` | `#11151D` | Cards, footer fill, input/select fill, header fill (85% + blur) |
| `--surface-2` | `#1A2030` | Elevated surfaces — chips, pills, code spans, fallback panels |
| `--border` | `#232A3A` | All hairlines |
| `--accent` | `#6CB4FF` | Primary action, focus ring, brand mark, hover-border, links |
| `--accent-strong` | `#9AD0FF` | Hover-state of `--accent` |
| `--danger` | `#FF7A7A` | Inline form error text |
| `#06121F` (literal) | `#06121F` | Text on filled accent (`Button --primary`, active `Chip`). Treat as fixed primitive. |

### 2.2 Light theme (overrides)

Only the surface/text/border family changes. Accent and danger inherit.

| Token | Hex (light) |
|---|---|
| `--background` | `#F7F8FB` |
| `--foreground` | `#0B0D12` |
| `--muted` | `#5B6478` |
| `--surface` | `#FFFFFF` |
| `--surface-2` | `#EEF1F6` |
| `--border` | `#D8DDE7` |

**Figma:** create a `feza/color` collection with `dark` (default) and `light` modes. Pin `#06121F` as a fixed primitive `accent/on-fill`.

### 2.3 Color usage map

| Where | Background | Border | Text |
|---|---|---|---|
| Page body | `--background` | — | `--foreground` |
| Header (sticky) | `--background` @ 85% + 12px blur | bottom: `--border` | brand `--foreground` (mark `--accent`), nav `--muted` |
| Footer | `--surface` | top: `--border` | `--muted`, brand `--foreground` |
| `Button --primary` | `--accent` → `--accent-strong` (hover) | — | `#06121F` |
| `Button --ghost` | transparent → `--surface-2` (hover) | `--border` | `--foreground` |
| `Select`, `SearchBox` input | `--surface` | `--border` → `--accent` (focus) | `--foreground`, placeholder `--muted` |
| `Chip` (rest / active) | `--surface-2` / `--accent` | `--border` → `--accent` / `--accent` | `--foreground` / `#06121F` |
| `PhotoCard` | `--surface` | `--border` → `--accent` (hover) | title `--foreground`, meta/desc `--muted` |
| `SkeletonCard` shimmer | `linear-gradient(90deg, --surface-2 → --border → --surface-2)` | — | — |
| Inline error | — | — | `--danger` |
| `<code>` inline | `--surface-2` | — | `--foreground` |

## 3 · Spacing scale

2px steps in the small range, 4px steps in the large range.

| Name | Value | Used by |
|---|---|---|
| `space-0.5` | 4px | Header nav gap; brand mark↔text |
| `space-1` | 6px | Field row gap; chip gap; meta inline gap |
| `space-1.5` | 8px | Button content gap; card body gap |
| `space-2` | 10px | Button vertical padding; input vertical padding |
| `space-2.5` | 12px | Header padding-y; chip padding-x; control gap |
| `space-3` | 14px | ExplorePanel main gap; PhotoCard body padding-top |
| `space-3.5` | 16px | Section gap; button padding-x; card body padding-x |
| `space-4` | 18px | PhotoCard body padding-bottom |
| `space-4.5` | 20px | Page horizontal padding; landing card padding |
| `space-6` | 24px | Hero margin-top; status block padding-y |
| `space-8` | 32px | Page top padding |
| `space-12` | 48px | Landing footer top margin |
| `space-20` | 80px | Page bottom padding |

## 4 · Radii

| Token | Value | Used by |
|---|---|---|
| `--radius-sm` | 6px | Clear-icon button, small fallbacks |
| `--radius-md` | 10px | Buttons, selects, inputs, nav links |
| `--radius-lg` | 16px | Cards (Photo, Skeleton, landing), panels |
| `radius-pill` (literal `999px`) | 999px | Chips |
| `radius-xs` (literal `4px`) | 4px | Inline `<code>` background |

## 5 · Shadows

| Token | Value | Used by |
|---|---|---|
| `--shadow-md` | `0 6px 24px rgba(0,0,0,0.35)` | Default card resting elevation |
| `shadow-card-hover` (literal) | `0 10px 28px rgba(0,0,0,0.4)` | `PhotoCard:hover` |

## 6 · Typography

System stack only — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`. No web fonts. In Figma use **Inter** as the closest system-stack proxy.

| Style | Size | Line | Letter | Weight | Where |
|---|---|---|---|---|---|
| Display | `clamp(28px, 5vw, 44px)` | 1.1 | -0.01em | 400 | Landing `<h1>`, APOD title |
| Heading L | `clamp(24px, 4vw, 36px)` | 1.1 | 0 | 400 | Explore `<h1>` |
| Heading M | 22px | 1.2 | 0 | 400 | Landing card `<h2>` |
| Heading S | 15px | 1.3 | 0 | 400 | PhotoCard `<h3>` |
| Brand wordmark | 16px | 1 | -0.01em | 700 | Header brand text |
| Body | 14px | 1.5 | 0 | 400 | Forms, default |
| Body-sm | 13px | 1.5 | 0 | 400 | Footer, status row, lead |
| Body-xs | 12px | 1.5 | varies | 400/600 | Form labels, chip text, meta |
| Eyebrow | 13px | 1 | 0.08em uppercase | 400 | Landing eyebrow |
| Tag | 11px | 1 | 0.08em uppercase | 400 | Landing card tag, APOD tag |

Color × type: Display/Heading/Brand → `--foreground`. Body-sm/xs (meta) → `--muted`. Eyebrow → `--muted`. Tag → `--accent`. Form label (uppercase) → `--muted`. Inline error → `--danger`. Link → `--accent` → `--accent-strong` hover, underlined.

## 7 · Motion

Two timings; that's the whole vocabulary.

| Token | Curve | Where |
|---|---|---|
| `motion-fast` | `0.06s ease` | Button `:active` press (`translateY(1px)`) |
| `motion-base` | `0.12s ease` | Hover/focus border-color, color, background, card `translateY(-2px)` |
| `motion-shimmer` | `1.4s linear infinite` | `SkeletonCard` shimmer |

`@media (prefers-reduced-motion: reduce)` disables shimmer. Card hover transforms not yet gated — future iteration.

## 8 · Layout & breakpoints

| Token | Value | Note |
|---|---|---|
| `--maxw` | 1100px | `<main>`, `Header.inner`, `Footer.inner` |
| `<main>` padding | 32px 20px 80px | (top, x, bottom) |
| Sticky header offset | top:0, z-index:10, blur 12px | |
| Min app height | `min-height: 100dvh` (with `100vh` fallback) | `.shell` flex column |

### Grid templates

| Surface | `grid-template-columns` | Gap |
|---|---|---|
| `PhotoGrid` | `repeat(auto-fill, minmax(240px, 1fr))` | 16px |
| Landing cards | `repeat(auto-fit, minmax(260px, 1fr))` | 16px |
| Explore controls | `repeat(auto-fit, minmax(160px, 1fr))` | 12px |

No `@media` queries except the color-scheme switch — grids are intrinsically responsive. Recommended Figma frames: 1440 (desktop), 1024 (medium), 768 (tablet), 390 (mobile).

## 9 · Iconography

Inline Unicode glyphs only. No icon font, no SVG sprite.

| Glyph | Code | Used as |
|---|---|---|
| `✦` | U+2726 | Brand mark |
| `⌕` | U+2315 | Search box icon |
| `×` | U+00D7 | Clear-search button |
| `→` | U+2192 | Inline copy |
| `·` | U+00B7 | Separator (meta rows / footer) |

One SVG asset: `src/app/icon.svg` — favicon / Apple-touch icon, `currentColor`-driven so it inverts in dark vs light. Use this file as the Figma `Brand mark · favicon` asset.

## 10 · Components

The `.module.scss` files are the source of truth for state details. The list below maps each component to where to look:

| Component | Source SCSS | Notable behaviour |
|---|---|---|
| `Header` | `src/components/Header/Header.module.scss` | Sticky, backdrop-blur, brand left + nav right with active `aria-current` styling |
| `Footer` | `src/components/Footer/Footer.module.scss` | Pinned by `.shell` flex column; top border; tag (brand+description) left, meta (©+links) right |
| `Button` | `src/components/Button/Button.module.scss` | `primary` and `ghost` variants. `:disabled` opacity 0.5, `:active` press 1px down |
| `Select` | `src/components/Select/Select.module.scss` | Native `<select>` with custom 5×5 chevron via gradient pseudo-elements. 36px right padding for the chevron. |
| `SearchBox` | `src/components/SearchBox/SearchBox.module.scss` | `⌕` left icon, `×` clear button visible only when value present. `::-webkit-search-cancel-button` hidden. |
| `PresetChips` | `src/components/PresetChips/PresetChips.module.scss` | Pill chips, `aria-pressed` for active state. 6 canonical presets: Mars Rover · Apollo Missions · Hubble · James Webb · ISS · Earth from Orbit |
| `PhotoCard` | `src/components/PhotoCard/PhotoCard.module.scss` | Wrapping `<a>` for full-card click. `aspect-ratio: 16:10` media. Description `-webkit-line-clamp: 3`. Hover: lift 2px + accent border + deeper shadow. |
| `PhotoGrid` | `src/components/PhotoGrid/PhotoGrid.module.scss` | `auto-fill, minmax(240px, 1fr)`, `role="list"` with `role="listitem"` children. Empty state: muted centered text. |
| `SkeletonCard` | `src/components/SkeletonCard/SkeletonCard.module.scss` | Shimmer keyframes (`-400px → 400px` over 800px-wide gradient). Dimensions match `PhotoCard` exactly so layout doesn't shift on load. |

All components have a `<Name>.stories.tsx` co-located. Storybook is the visual contract — Chromatic baselines the diff in CI.

## 11 · Page templates

### Landing — `/` (`src/app/page.tsx`)
`<main>` 1100/32-20-80 → `.hero` (eyebrow + clamp display + lead) → `.cards` (auto-fit minmax(260, 1fr), 2 cards: `/explore`, `/apod`) → text-only `.footer`.

### Explore — `/explore` (`src/app/explore/`)
Server `page.tsx` reads `searchParams` (`q`, `mediaType`, `yearStart`, `yearEnd`) and hydrates `<ExplorePanel initial={...}>`. Panel = `SearchBox` + `PresetChips` + 4-col `auto-fit` controls + status row + grid (skeletons while loading). URL sync via `router.replace('/explore?...', { scroll: false })`. Year-from > year-to shows inline error and skips the upstream call.

### APOD — `/apod` (`src/app/apod/`)
Pre-stage placeholder: tag + clamp title + lead + 5-step `<ol>` describing the live demo. Live-coded into a real `<ApodPanel>` (date picker + count slider, `<PhotoCard>` + `<PhotoGrid>` reuse).

## 12 · Recommended Figma file structure

```
feza/
├── 0 · Cover
├── 1 · Foundations
│   ├── Color (dark + light modes — local variables)
│   ├── Spacing (number variables space-0.5 … space-20)
│   ├── Radii / Shadows (effect styles)
│   ├── Type ramp (text styles)
│   └── Iconography (✦ ⌕ × → · + favicon SVG)
├── 2 · Components (each with state variants)
│   Header / Footer / Button / Select / SearchBox / PresetChip /
│   PhotoCard / SkeletonCard / PhotoGrid
├── 3 · Pages — desktop 1440 (Landing, Explore states, APOD placeholder + target)
├── 4 · Pages — tablet 768
└── 5 · Pages — mobile 390
```

Bind every fill / stroke / text fill / corner radius to Foundations variables. Pages reference components — never style locally.

## 13 · Loading `tokens.json` into Figma

`tokens.json` is in **W3C Design Tokens format (DTCG)**.

**Recommended:** install the *Tokens Studio for Figma* community plugin → **Tools → Import → JSON** (paste contents) → **Push to Figma → Variables** to create the collections / modes from § 12.

Native Figma Variables doesn't have a built-in DTCG importer; the Figma REST API (`POST /v1/files/:key/variables`) accepts a translated payload, but copying values manually using §§ 2–5 of this doc is faster.

## 14 · Accessibility & contrast

- All focus states use a **2px `--accent` outline with 2px offset** — never `outline: none`.
- Form labels are visible (uppercase eyebrow above each control), not just `aria-label`.
- `aria-pressed` on `PresetChips`, `aria-current="page"` on the active nav link, `aria-live="polite"` on the Explore status row.
- `prefers-reduced-motion: reduce` disables shimmer. Card hover transforms not yet gated — future iteration.

Contrast ratios at canonical dark theme:
- `--foreground` on `--background` ≈ **15.0 : 1** (AAA)
- `--muted` on `--background` ≈ **5.4 : 1** (AA, body 14px+)
- `--accent` on `--background` ≈ **8.0 : 1** (AAA non-text decoration; AA large)
- `#06121F` on `--accent` ≈ **9.5 : 1** (filled buttons, active chips — AAA)

## 15 · Out of scope

Tooltips, modals, toasts. Multi-step forms. Tabs. Avatars / auth UI. Charts. Animation beyond hover/focus/shimmer. Monospace font. Logo lockup beyond `✦ feza`. If a live-demo step needs one of these, build it on stage from primitives — don't pre-add it to the system.
