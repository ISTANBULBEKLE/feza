# feza — Design System & Tokens

> Snapshot of every token, component, and layout decision currently shipped in the feza repo. Use this to recreate the system in Figma 1:1.
>
> Source of truth in code:
> - **Color, radii, shadow, layout tokens** → `src/app/globals.scss` (`:root` + `prefers-color-scheme: light`)
> - **Per-component styles** → `src/components/<Name>/<Name>.module.scss`
> - **Page-level styles** → `src/app/page.module.scss`, `src/app/layout.module.scss`, `src/app/explore/ExplorePanel.module.scss`, `src/app/apod/placeholder.module.scss`
>
> A machine-readable companion lives in **`tokens.json`** (DTCG / W3C Design Tokens format). Import it into Figma with the *Tokens Studio for Figma* plugin → `Tools → Import → JSON`.

---

## 1 · Brand & philosophy

| | |
|---|---|
| **Voice** | Calm, technical, slightly cosmic. *"NASA archive viewer, not Disney space."* |
| **Density** | Roomy. Default gap is 12–16px, hero spacing is 24–32px. Never crowd. |
| **Mood** | Dark-first, with a precise light theme. The dark theme is the canonical one — Figma master library should use dark. |
| **Brand mark** | `✦` (U+2726 — "four-pointed black star") in `--accent`, paired with the lowercase wordmark "feza" at 16px / 700. |
| **Sparkle ratio** | Exactly one ✦ per page (in the Header). No animation, no glow. |

---

## 2 · Color tokens

All colors are exposed as CSS custom properties on `:root` in `src/app/globals.scss`. The dark palette is the default; the light palette overrides a subset under `@media (prefers-color-scheme: light)`. **Accent and danger are theme-invariant** — they look right on both backgrounds.

### 2.1 Dark theme (default · canonical)

| Token | Hex | Role |
|---|---|---|
| `--background` | `#0B0D12` | Page background. Deep blue-black. |
| `--foreground` | `#E7EAF2` | Primary text. Off-white with cool tint. |
| `--muted` | `#8B93A7` | Secondary text, labels, meta, placeholders. |
| `--surface` | `#11151D` | Cards, footer fill, input/select fill, header fill (with 85% opacity + backdrop blur). |
| `--surface-2` | `#1A2030` | Elevated surfaces — chips, pill backgrounds, code spans, fallback panels. |
| `--border` | `#232A3A` | All hairlines (cards, inputs, header bottom-rule, footer top-rule). |
| `--accent` | `#6CB4FF` | Primary action, focus ring, brand mark, hover-border, links. |
| `--accent-strong` | `#9AD0FF` | Hover-state of `--accent` (button hover, link hover). |
| `--danger` | `#FF7A7A` | Inline form error text. Used at body weight, never as fill. |
| `#06121F` (literal) | `#06121F` | Text-on-accent — only ever used on filled `.btn--primary` and active `.chip--active`. Not a CSS variable in code; treat as a fixed brand pair. |

### 2.2 Light theme

Only the surface/text/border family is overridden. Accent and danger inherit.

| Token | Hex (light) | Notes |
|---|---|---|
| `--background` | `#F7F8FB` | Cool paper. |
| `--foreground` | `#0B0D12` | Inverts to dark theme's background — intentional symmetry. |
| `--muted` | `#5B6478` | Slightly bluer than a true gray. |
| `--surface` | `#FFFFFF` | True white card. |
| `--surface-2` | `#EEF1F6` | Chip / elevated fill. |
| `--border` | `#D8DDE7` | Hairline. |
| `--accent` | `#6CB4FF` | (inherited) |
| `--accent-strong` | `#9AD0FF` | (inherited) |
| `--danger` | `#FF7A7A` | (inherited) |

> **Figma setup:** create a **collection** called `feza/color` with two **modes** — `dark` (default) and `light`. The 9 variables above sit in this collection. The literal `#06121F` is *not* a variable — call it `accent/on-fill` and pin it as a fixed primitive.

### 2.3 Color usage map

| Where | Background | Border | Text |
|---|---|---|---|
| Page body | `--background` | — | `--foreground` |
| Header (sticky) | `--background` @ 85% + 12px blur | bottom: `--border` | brand `--foreground` (mark `--accent`), nav `--muted` |
| Footer | `--surface` | top: `--border` | `--muted`, brand `--foreground`, link `--muted`→`--accent` on hover |
| `Button --primary` | `--accent` → `--accent-strong` (hover) | — | `#06121F` |
| `Button --ghost` | transparent → `--surface-2` (hover) | `--border` | `--foreground` |
| `Select`, `SearchBox` input | `--surface` | `--border` → `--accent` (focus) | `--foreground`, placeholder `--muted` |
| `Chip` (rest) | `--surface-2` | `--border` → `--accent` (hover) | `--foreground` |
| `Chip` (active) | `--accent` → `--accent-strong` (hover) | `--accent` | `#06121F` |
| `PhotoCard` | `--surface` | `--border` → `--accent` (hover) | title `--foreground`, meta/desc `--muted` |
| `SkeletonCard` shimmer | linear-gradient(90deg, `--surface-2` → `--border` → `--surface-2`) | — | — |
| Inline error | — | — | `--danger` |
| Code spans (in copy) | `--surface-2` | — | `--foreground` |

---

## 3 · Spacing scale

Pulled from every `gap`, `padding`, and `margin` in the SCSS modules. The system is informal but consistent — a 2px-step scale in the small range, then 4px steps.

| Name | Value | Used by |
|---|---|---|
| `space-0.5` | **4px** | Header nav gap; brand mark↔text |
| `space-1` | **6px** | Field row gap; chip gap; meta inline gap; PhotoCard body gap |
| `space-1.5` | **8px** | Button content gap; card body gap; meta gap |
| `space-2` | **10px** | Button vertical padding; input vertical padding |
| `space-2.5` | **12px** | Header padding-y; chip padding-x; control gap |
| `space-3` | **14px** | APOD placeholder wrap gap; ExplorePanel main gap; PhotoCard body padding-top |
| `space-3.5` | **16px** | Section gap (PhotoGrid, landing cards); button padding-x; card body padding-x |
| `space-4` | **18px** | PhotoCard body padding-bottom |
| `space-4.5` | **20px** | Page horizontal padding; landing card padding; footer padding |
| `space-5` | **22px** | Steps list `padding-left` |
| `space-6` | **24px** | Hero/cards margin-top; status block padding-y; APOD placeholder padding-y |
| `space-8` | **32px** | Page top padding |
| `space-12` | **48px** | Landing footer top margin |
| `space-20` | **80px** | Page bottom padding |

> **Figma setup:** create a `feza/space` variable collection with the 14 entries above as number variables. Reuse them for **Auto-Layout gap, padding,** and any `margin` you choose to model.

---

## 4 · Radii

| Token | Value | Used by |
|---|---|---|
| `--radius-sm` | **6px** | Clear-icon button hit area (SearchBox), code span fallback in apod placeholder |
| `--radius-md` | **10px** | Buttons, selects, inputs, nav links |
| `--radius-lg` | **16px** | Cards (Photo, Skeleton, landing), section panels |
| `radius-pill` *(literal `999px`)* | **999px** | Chips |
| `radius-xs` *(literal `4px`)* | **4px** | Inline `<code>` background |

---

## 5 · Shadows

| Token | Value | Used by |
|---|---|---|
| `--shadow-md` | `0 6px 24px rgba(0, 0, 0, 0.35)` | Default card resting elevation |
| `shadow-card-hover` *(literal)* | `0 10px 28px rgba(0, 0, 0, 0.4)` | `PhotoCard:hover` |

> Light theme: shadows are visually subtle but the same tokens are reused; consider a Figma effect-style alternate at `0 6px 24px rgba(15, 23, 42, 0.10)` for the light mode if needed. Code does not currently override.

---

## 6 · Typography

### 6.1 Family

```
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

System stack on purpose — zero-weight web-font cost, looks native everywhere. **No display font, no monospace.** `<code>` uses `font: inherit` and gets a `--surface-2` background.

In Figma, set the master text style family to **Inter** (closest pan-platform render of the system stack on Mac/Windows mixed audiences).

### 6.2 Type ramp

| Style | Size | Line | Letter | Weight | Where |
|---|---|---|---|---|---|
| Display (Hero) | `clamp(28px, 5vw, 44px)` | 1.1 | -0.01em | 400 | Landing `<h1>`, APOD title (max 40px) |
| Heading L | `clamp(24px, 4vw, 36px)` | 1.1 | 0 | 400 | Explore `<h1>` |
| Heading M | 22px | 1.2 (default) | 0 | 400 | Landing card `<h2>` |
| Heading S | 15px | 1.3 | 0 | 400 | PhotoCard `<h3>` |
| Brand wordmark | 16px | 1 | -0.01em | 700 | Header brand text |
| Body | 14px | 1.5 | 0 | 400 | Forms, default |
| Body-sm | 13px | 1.5 | 0 | 400 | Footer, status row, back-link, lead text |
| Body-xs | 12px | 1.5 | 0.06em (uppercase label) / 0 (chip) | 400/600 | Form labels (uppercase), chip text, meta, code in lead |
| Eyebrow | 13px | 1 | 0.08em (uppercase) | 400 | Landing eyebrow |
| Tag | 11px | 1 | 0.08em (uppercase) | 400 | Landing card tag, APOD tag |

### 6.3 Color × type cheat sheet

| Style | Color token |
|---|---|
| Display, Heading L/M/S, Brand | `--foreground` |
| Body | `--foreground` |
| Body-sm, Body-xs (when meta) | `--muted` |
| Eyebrow, Tag | `--muted` (Landing eyebrow) / `--accent` (Tag) |
| Form label (uppercase) | `--muted` |
| Inline error | `--danger` |
| Link | `--accent` → `--accent-strong` (hover) + underline |

---

## 7 · Motion

Every transition uses one of two timings; that's the whole vocabulary.

| Token | Curve | Where |
|---|---|---|
| `motion-fast` | `0.06s ease` | Button `:active` press (`translateY(1px)`) |
| `motion-base` | `0.12s ease` | All hover/focus border-color, color, background, and `translateY(-2px)` on cards |
| `motion-shimmer` | `1.4s linear infinite` | `SkeletonCard` shimmer (background-position over 800px) |

`@media (prefers-reduced-motion: reduce)` — `SkeletonCard` shimmer is disabled. Card hover transforms are not currently disabled (could be tightened).

---

## 8 · Layout & breakpoints

| Token | Value | Note |
|---|---|---|
| `--maxw` (content max-width) | **1100px** | Wraps `<main>`, `Header.inner`, `Footer.inner` |
| `<main>` padding | **32px 20px 80px** | (top, x, bottom) |
| Sticky header offset | **top: 0**, **z-index: 10** | Backdrop blur 12px |
| Min app height | `min-height: 100dvh` (with `100vh` fallback) | `.shell` flex column → footer pinned |

### 8.1 Grid templates

| Surface | `grid-template-columns` | Gap |
|---|---|---|
| `PhotoGrid` (results) | `repeat(auto-fill, minmax(240px, 1fr))` | 16px |
| Landing `.cards` | `repeat(auto-fit, minmax(260px, 1fr))` | 16px (24px top margin) |
| Explore `.controls` | `repeat(auto-fit, minmax(160px, 1fr))` | 12px (`align-items: end`) |

### 8.2 Effective breakpoints (implicit)

The grids are intrinsically responsive — no `@media` queries except the color-scheme switch. Practical breakpoints derived from the auto-fit math (assuming 20px page padding):

| Layout | Single col under | Two cols up to | Three cols at |
|---|---|---|---|
| PhotoGrid (240px min) | ~290px | ~530px | ~780px |
| Landing cards (260px min) | ~310px | ~570px | ~830px |
| Explore controls (160px min) | ~210px | ~370px | ~530px |

> **Figma frames to ship**: 1440 (desktop canonical), 1024 (medium), 768 (tablet), 390 (mobile). All 4 sizes use the same components — only the grid columns reshuffle.

---

## 9 · Iconography

All icons are inline Unicode glyphs (no icon font, no SVG sprite). Pick the same glyph list in Figma to keep parity.

| Glyph | Code | Used as |
|---|---|---|
| `✦` | U+2726 | Brand mark |
| `⌕` | U+2315 | Search box icon (left, inside input) |
| `×` | U+00D7 | Clear-search button (right of input, when value present) |
| `→` | U+2192 | Inline copy ("Date picker or random count → image/video card list") |
| `·` | U+00B7 | Separator in meta rows / footer |

One actual SVG asset: **`src/app/icon.svg`** — the favicon / Apple-touch icon. A stylized lowercase "f" with an eye-dot, 64×64, `currentColor`-driven so it inverts in dark vs light. **Use this file as the `feza/Brand mark · favicon` Figma asset.**

---

## 10 · Component specifications

Each block below is a Figma-ready spec. Sizes are at the canonical 1440-wide breakpoint. Hover/focus states are explicit because they're load-bearing for the demo's "Claude PR-reviewer caught the missing focus ring" beat.

### 10.1 Header (`src/components/Header/`)

```
position:        sticky · top: 0 · z-index: 10
height:          ~52px (12px padding-y + 28px content + 1px border-bottom)
background:      color-mix(in srgb, var(--background) 85%, transparent)
backdrop-filter: blur(12px)
border-bottom:   1px solid var(--border)

inner:           max-width 1100px, padding 12px 20px,
                 flex row, space-between, align-items center, gap 16px

brand:
  display: inline-flex, gap 8px
  ✦ mark — 18px, color var(--accent)
  "feza" wordmark — 16px / 700, color var(--foreground)
  hover: color var(--accent), no underline

nav (right side):
  flex row, gap 4px, align-items center
  link: padding 6px 12px, radius var(--radius-md), font 14px,
        color var(--muted), border 1px solid transparent
    hover: color var(--foreground), bg var(--surface-2)
    focus-visible: outline 2px solid var(--accent), offset 2px
    active (aria-current="page"):
      color var(--foreground), bg var(--surface-2), border-color var(--border)
```

### 10.2 Footer (`src/components/Footer/`)

```
border-top:    1px solid var(--border)
background:    var(--surface)
margin-top:    auto  (pinned by .shell flex column)

inner:         max-width 1100px, padding 20px,
               flex row wrap, space-between, align-items center, gap 12px,
               color var(--muted), font 13px

left "tag":    flex inline, gap 6px wrap
  brand wordmark "feza" — 13px / 700, color var(--foreground)
  separator "·"
  text "NASA explorer demo · Next.js 16 · SCSS modules · Vitest"

right "meta":  flex inline, gap 6px wrap
  © {year}
  separator "·"
  link "NASA Image Library" → https://images.nasa.gov/    (target=_blank)
  separator "·"
  link "api.nasa.gov" → https://api.nasa.gov/             (target=_blank)
  link color: var(--muted), hover var(--accent)
```

### 10.3 Button (`src/components/Button/`)

```
shared:
  display: inline-flex, gap 8px
  height ~ 38px (10 padding-y + 14 text + 1 border + 1 line-height)
  padding: 10px 16px
  font: 14px / 600
  radius: var(--radius-md) = 10px
  border: 1px solid transparent
  transition: transform .06s ease, background .12s ease

  :disabled — opacity 0.5, cursor not-allowed
  :active   — transform translateY(1px)

variant=primary:
  bg     var(--accent)         text #06121F
  hover  bg var(--accent-strong)

variant=ghost:
  bg     transparent           text var(--foreground)   border var(--border)
  hover  bg var(--surface-2)
```

### 10.4 Select (`src/components/Select/`)

```
field (label wrapper):
  display: grid, gap 6px, min-width 0

label (uppercase eyebrow):
  font 12px, letter-spacing 0.06em, uppercase, color var(--muted)

select (native):
  appearance: none
  bg var(--surface), color var(--foreground)
  border 1px solid var(--border), radius var(--radius-md)
  padding 10px 36px 10px 12px            (36px right reserved for the chevron)
  font 14px
  custom chevron: two diagonal gradient pseudo-elements forming a downward chevron,
                  positioned 18px / 13px from right, 5x5px each
  focus: outline 2px solid var(--accent), offset 2px, border-color var(--accent)
  transition: border-color 0.12s ease
```

### 10.5 SearchBox (`src/components/SearchBox/`)

```
field (label wrapper): same as Select (grid, gap 6px, min-width 0)
label:                 same as Select label

inputWrap: position relative, flex centered
  ⌕ icon         absolute left 12px, font 16px, color var(--muted), aria-hidden
  input          width 100%, type=search
                 padding 10px 36px 10px 34px   (left 34 for icon, right 36 for clear)
                 bg var(--surface), color var(--foreground)
                 border 1px solid var(--border), radius var(--radius-md)
                 font 14px
                 placeholder color var(--muted)
                 :focus -> outline 2px var(--accent), offset 2px, border var(--accent)
                 ::-webkit-search-cancel-button: appearance none

  clear "×" btn  shown only when value.length > 0
                 absolute right 8px, 24x24, radius var(--radius-sm),
                 transparent, color var(--muted)
                 hover: color var(--foreground), bg var(--surface-2)
                 aria-label "Clear search"
```

### 10.6 PresetChips (`src/components/PresetChips/`)

```
row: flex row wrap, gap 6px, role="group", aria-label="Topic presets"

chip (resting):
  bg var(--surface-2), color var(--foreground), border 1px solid var(--border)
  radius 999px (pill), padding 6px 12px, font 12px
  cursor pointer
  transition: bg / border-color / color 0.12s ease
  hover: border-color var(--accent)
  focus-visible: outline 2px solid var(--accent), offset 2px

chip (aria-pressed=true · active):
  bg var(--accent), color #06121F, border-color var(--accent)
  hover: bg var(--accent-strong)
```

The 6 canonical presets (in order):
> Mars Rover · Apollo Missions · Hubble · James Webb (JWST) · ISS · Earth from Orbit

### 10.7 PhotoCard (`src/components/PhotoCard/`)

The PhotoCard is wrapped in an `<a>` so the entire surface is clickable to the NASA detail page. The visual layout sits in `.inner`.

```
.card (the <a>):
  display block, color inherit, no underline
  bg var(--surface)
  border 1px solid var(--border), radius var(--radius-lg) = 16px
  overflow hidden
  shadow var(--shadow-md)  =  0 6px 24px rgba(0,0,0,0.35)
  transition transform / border-color / box-shadow .12s ease
  hover:   translateY(-2px), border-color var(--accent),
           shadow 0 10px 28px rgba(0,0,0,0.4)
  focus-visible: outline 2px solid var(--accent), offset 2px

.inner: grid rows auto / 1fr

.media:
  aspect-ratio 16:10, bg var(--surface-2)
  <img>: width 100%, height 100%, object-fit cover, lazy-loaded
  fallback (no thumbnail):
    centered, color var(--muted), font-weight 700, letter-spacing 0.1em,
    text = the mediaType uppercased ("IMAGE" | "VIDEO" | "AUDIO")

.body: padding 14px 16px 18px, grid gap 6px
  .title — h3, 15px / 1.3, color var(--foreground)
  .meta  — 12px, color var(--muted)
           "{center || NASA} · {formatted dateCreated}"
  .desc  — 13px, color var(--muted)
           3-line clamp (-webkit-line-clamp: 3)
```

### 10.8 PhotoGrid (`src/components/PhotoGrid/`)

```
.grid: display grid,
       grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))
       gap 16px
       role list (each child role listitem)

.empty: color var(--muted), font 14px, padding 24px 0, center-aligned text
        Default copy: "No results yet."
```

### 10.9 SkeletonCard (`src/components/SkeletonCard/`)

A loading placeholder that mirrors PhotoCard's external dimensions exactly so layout doesn't shift when results land.

```
@keyframes shimmer (1.4s linear infinite)
  0%:   background-position: -400px 0
  100%: background-position:  400px 0

.card: same outer dimensions as PhotoCard (radius 16, border, shadow, surface)
       grid rows auto / 1fr
.media: aspect 16:10
        background = linear-gradient(90deg, surface-2, border, surface-2),
        background-size 800px 100%, animation shimmer
.body: padding 14px 16px 18px, grid gap 8px
.line: height 12, radius 6, same shimmer linear-gradient + animation
.title:  width 80%, height 14
.meta:   width 40%, height 10
.desc:   width 100%, height 10

@media (prefers-reduced-motion: reduce): animation: none
```

Default usage: 8 skeletons rendered while the first results page is in flight.

### 10.10 Code spans (inline)

Used inside copy on the Explore header, APOD placeholder, and CLAUDE.md hand-off prose. **Not** a component — a styled `<code>` selector inside parent `.module.scss`.

```
font-size: 0.92em (relative to surrounding text)
background: var(--surface-2)
padding: 0 6px
border-radius: 4px
```

---

## 11 · Page templates

### 11.1 Landing — `/` (`src/app/page.tsx`)

```
<main>                                    width 1100, padding 32 20 80
  .hero                                   grid, gap 12, padding 24 0 32
    .eyebrow                              13px uppercase, --muted
    .title                                clamp(28,5vw,44) / 1.1 / -0.01em, --foreground
    .subtitle                             body, --muted, max-width 60ch
  .cards                                  grid auto-fit minmax(260,1fr), gap 16, mt 24
    Card (x2: /explore, /apod) — see § 11.1.1 below
  .footer  (text — not the global Footer component)
                                          mt 48, font 13, --muted
```

#### 11.1.1 Landing card (anchor, not the PhotoCard component)

```
<a class=card>
  bg --surface, border --border, radius --radius-lg=16, shadow --shadow-md,
  padding 20, display block,
  transition transform / border-color .12s ease,
  hover: translateY(-2px), border-color --accent, no underline

  .cardTag   — 11px uppercase --accent, mb 10
  .cardTitle — h2 22px --foreground, mb 8
  .cardBody  — 14px --muted
```

### 11.2 Explore — `/explore` (`src/app/explore/`)

Server `page.tsx` reads `searchParams` (`q`, `mediaType`, `yearStart`, `yearEnd`) and hydrates the client `<ExplorePanel initial={...}>`.

```
<main>
  <header class=header>
    h1 "Explore the NASA Image Library" — clamp(24,4vw,36) / 1.1
    p   lead — body, --muted, max-width 70ch, with inline <code> chip

  <section class=panel> (ExplorePanel)
    .searchRow:    SearchBox (autoFocus, placeholder
                              "e.g. saturn rings, perseverance landing, helix nebula…")
    .chips:        PresetChips (6 presets, pressed=current topic)
    .controls:     grid auto-fit minmax(160,1fr), gap 12, align-items end
                   - Select "Media type"
                   - Select "Year from"  (filtered to years <= yearEnd)
                   - Select "Year to"    (filtered to years >= yearStart)
                   - .actions wrapper with [Reset] (variant=ghost)
    .statusRow:    13px --muted, min-height 18, aria-live="polite"
                   states: yearError | empty | searching | error | "{n} of {total} results"
    Results:
      - Loading + empty results  -> 8x SkeletonCard in .grid
      - Otherwise                -> PhotoGrid
```

URL sync: every filter change (after first render) calls `router.replace('/explore?...', { scroll: false })`. Year-from-greater-than-year-to shows an inline error and skips the upstream search.

### 11.3 APOD placeholder — `/apod` (`src/app/apod/`)

The placeholder layout that ships before the live demo.

```
<main>
  .wrap                          grid gap 14, padding 24 0, max-width 70ch
    .tag                         11px uppercase --accent — "Epic 2 · live demo target"
    .title                       clamp(28,5vw,40) / 1.1, --foreground —
                                 "Astronomy Picture of the Day"
    .lead                        body, --muted (with inline <code> spans)
    .steps                       <ol>, padding-left 22, gap 8, --foreground
                                 5 numbered steps describing the live-demo plan
```

When live-coded, this page becomes a real `<ApodPanel>` with a date picker + count slider, reusing `<PhotoCard>` and `<PhotoGrid>`.

---

## 12 · Recommended Figma file structure

```
feza/                                 (Figma file)
├── 0 · Cover                         file thumbnail + intro
├── 1 · Foundations
│   ├── Color (dark) — local variables
│   ├── Color (light) — local variables (mode)
│   ├── Spacing — number variables (space-0.5 ... space-20)
│   ├── Radii — radius-sm/md/lg/pill/xs
│   ├── Shadows — effect styles (shadow-md, shadow-card-hover)
│   ├── Type ramp — text styles (Display, Heading L/M/S, Brand, Body, Body-sm,
│   │               Body-xs, Eyebrow, Tag)
│   └── Iconography — ✦ ⌕ × → ·  + favicon SVG
├── 2 · Components (each with default + states variants)
│   ├── Header
│   ├── Footer
│   ├── Button — primary, ghost   (default · hover · active · disabled · focus)
│   ├── Select — default · focus  (label + chevron baked in)
│   ├── SearchBox — empty · with-value · focus
│   ├── PresetChip — rest · hover · pressed/active · focus
│   ├── PhotoCard — image · video-fallback · hover · focus
│   ├── SkeletonCard
│   └── PhotoGrid (3-up at 1440, 2-up at 768, 1-up at 390)
├── 3 · Pages — desktop 1440
│   ├── Landing /
│   ├── Explore /explore — empty · loading · loaded · year-error
│   └── APOD /apod — placeholder · live-coded (target)
├── 4 · Pages — tablet 768
└── 5 · Pages — mobile 390
```

> Bind every fill / stroke / text fill / corner radius to the variables in Foundations. The component variants in §2 should be the *only* source for §3–5 — pages reference components, never style locally.

---

## 13 · How to use `tokens.json` in Figma

`tokens.json` (committed alongside this file) is in **W3C Design Tokens format (DTCG)**. Two ways to load it:

### Option A — Tokens Studio for Figma (most common)

1. Install the *Tokens Studio for Figma* community plugin.
2. In the plugin: **Tools → Import → JSON**, paste the contents of `tokens.json`.
3. **Push to Figma → Variables** (the plugin's right-rail action). This creates the same collections / modes described in §12.

### Option B — Native Figma Variables (no plugin)

DTCG → Figma Variables doesn't have a built-in importer, but the Figma REST API (`POST /v1/files/:key/variables`) accepts a translated payload. Easiest path: copy the values out of `tokens.json` and create the variables manually using §2 / §3 / §4 / §5 of this doc as the contract.

---

## 14 · Accessibility & contrast notes

- All focus states use a **2px outline of `--accent` with 2px offset** — never `outline: none`.
- Form labels are visible (uppercase eyebrow above each control), not just `aria-label`.
- `aria-pressed` is wired on `PresetChips`, `aria-current="page"` on the active nav link.
- The status row of `ExplorePanel` is `aria-live="polite"`.
- The shimmer animation is disabled under `prefers-reduced-motion: reduce`.
- Card hover transforms (`translateY(-2px)`) are *not* yet gated by reduced-motion — flag for a future iteration.
- Contrast ratios at canonical dark theme:
  - `--foreground` on `--background` ≈ **15.0 : 1** (AAA)
  - `--muted` on `--background` ≈ **5.4 : 1** (AA for body 14px+)
  - `--accent` on `--background` ≈ **8.0 : 1** (AAA for non-text decoration; AA large)
  - `#06121F` on `--accent` ≈ **9.5 : 1** (used on filled buttons / active chips — AAA)

---

## 15 · Things deliberately not in the system

To prevent scope creep on the live demo, the following are **explicitly excluded**:

- Tooltips, modals, toasts.
- Multi-step forms, wizards.
- Tab components.
- Avatars, user UI (no auth).
- Charts, data viz.
- Any motion beyond hover / focus / shimmer.
- A monospace font.
- A logo lockup beyond `✦ feza`.

If a live-demo step needs one of these, build it on stage from primitives — don't pre-add it to the system.

---

## 16 · Versioning

Tokens above match repo state at the commit referenced in `git log`. When a token changes, update both this file and `tokens.json` in the same PR — the existing `review-pr` skill flags drift between SCSS and these files as a CLAUDE.md violation.
