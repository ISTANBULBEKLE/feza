# CLAUDE_DESIGN_PROMPTS.md

Paste-ready prompts for **<https://claude.ai/design>**. Drop one fenced block at a time into your `feza` project's input box; claude.ai/design renders an editable HTML/CSS prototype; iterate from there.

Why claude.ai/design and not Canva: claude.ai/design renders real HTML/CSS that respects design tokens verbatim. Canva's MCP is also connected and usable for graphic mockups, but Canva's `generate-design` tool only honours brand palettes via the **Brand Kit** feature — which requires a paid Canva plan. Without it, generated designs revert to stock template colours that don't match feza tokens. So Canva remains a *secondary* path for marketing-style graphics; claude.ai/design is canonical for UI mockups. The prompts below assume you're already in the `feza` project that has Epic 1 / Epic 2 screens loaded for context (see your existing project: <https://claude.ai/design>).

## Global token snippet (used by every prompt)

The **light theme is canonical** for feza; dark applies via `prefers-color-scheme: dark`. Every prompt below references this palette:

```
LIGHT PALETTE (canonical)
  background      #F5F7FB
  foreground      #0A1124
  muted           #4A5468
  surface         #FFFFFF
  surface-2       #E9EEF7
  border          #C9D2E3
  accent          #2563EB
  accent-strong   #1D4ED8
  danger          #DC2626
  on-accent       #FFFFFF   (text on filled accent — Button primary, HazardousPill)

DARK PALETTE (override — @media prefers-color-scheme: dark)
  background      #0B0D12
  foreground      #E7EAF2
  muted           #8B93A7
  surface         #11151D
  surface-2       #1A2030
  border          #232A3A
  accent          #6CB4FF
  accent-strong   #9AD0FF
  danger          #FF7A7A
  on-accent       #06121F

TYPOGRAPHY (token-driven via CSS custom properties)
  family   Inter (regular 400 / body 500 / semibold 600 / bold 700 / heading 800 / display 900)
  display  44px / 1.1 / -0.025em      weight 900 (--fz-weight-display)
  h1       36px / 1.1 / -0.025em      weight 900
  h2 (card) 22px / 1.2                weight 800 (--fz-weight-heading)
  h3 (card) 15px / 1.3                weight 800
  body     14px / 1.5                 weight 500 (--fz-weight-body)
  body-sm  13px / 1.5                 weight 500
  body-xs  12px / 1.5                 weight 500
  label    12px uppercase / 0.06em
  eyebrow  13px uppercase / 0.08em
  tag      11px uppercase / 0.08em

RADII
  md  10px (buttons, inputs, selects)
  lg  16px (cards)
  pill 999px (chips, hazardous pill)

SHADOWS (light canonical, layered)
  card-rest    0 6px 20px rgba(10,17,36,0.08), 0 1px 2px rgba(10,17,36,0.04)
  card-hover   0 12px 32px rgba(37,99,235,0.18), 0 2px 4px rgba(10,17,36,0.06)

SHADOWS (dark override)
  card-rest    0 6px 24px rgba(0,0,0,0.35)
  card-hover   0 10px 28px rgba(0,0,0,0.40)

UTILITY
  .fz-shine — gradient text on hero H1s (linear-gradient 135deg from accent-strong → foreground → accent, background-clip: text)
```

If your `feza` project already has these tokens loaded (from when you imported `tokens.json`), each prompt below will pick them up automatically. If not, paste this block first as a "design system primer" message. **Render screens in the light theme by default unless the prompt explicitly asks for the dark variant.**

---

## Prompt 1 — Asteroids landing screen (Epic 3 / KAN-8)

**Use as:** primary screen for the `/asteroids` route. Mirror in style to your existing "Incoming screen (Epic 2)".

**Suggested screen name in claude.ai/design:** `Asteroids landing (Epic 3)`

```
Build a screen named "Asteroids landing (Epic 3)" in the feza light theme (canonical).

CONTEXT
  Epic 3 of the feza app. Lives at /asteroids. User picks a date range (max 7 days), sees a grid of asteroids passing near Earth.
  Reuses <PhotoGrid> from Epic 1. New atom: <DateRangePicker>. New molecule: <AsteroidCard>. New atom inside the card: <HazardousPill>.

LAYOUT (top to bottom, max-width 1100px, 20px horizontal padding)
  1. Header strip (52px tall, surface bg #FFFFFF with 12px backdrop blur, 1px bottom border #C9D2E3):
       Left: "✦ feza" wordmark (Inter heading-weight 800, 20px, color #0A1124).
       Right nav: ".explore", ".apod", ".asteroids" — link styling, 16px, ".asteroids" is the active one (color #2563EB, others #4A5468).
  2. Page intro (32px top padding, 16px gap):
       Eyebrow tag "EPIC 3 · NEAR-EARTH OBJECTS" — 11px uppercase, letter-spacing 0.08em, color #2563EB.
       H1 "Near-Earth Objects" — 36px / 1.1, weight 900 (--fz-weight-display), letter-spacing -0.025em, apply .fz-shine gradient (linear-gradient 135deg from #1D4ED8 → #0A1124 → #2563EB, background-clip text).
       Lead paragraph "Asteroids passing close to Earth in your selected window. Source: NASA NeoWs feed." — 13px, color #4A5468, max-width 65ch.
  3. Controls row (24px top margin, gap 12px, wraps on narrow viewports):
       <DateRangePicker> — two date inputs side by side, labeled "Start" and "End" above each. Inputs: surface-2 bg #E9EEF7, 1px border #C9D2E3, 10px radius, padding 10px 12px, color #0A1124.
       Below the picker, a 12px caption: "Max 7 days (NeoWs API limit)" — 12px, color #4A5468.
  4. Status row (16px top margin, 18px min-height): "12 asteroids found · 2026-05-10 → 2026-05-15" — 13px, color #4A5468. While loading, replace with "Loading…" + aria-busy.
  5. Card grid (24px top margin, CSS grid auto-fill minmax(240px, 1fr), 16px gap):
       Six <AsteroidCard> instances. Card bg #FFFFFF, 1px border #C9D2E3, 16px radius, shadow 0 6px 20px rgba(10,17,36,0.08) + 0 1px 2px rgba(10,17,36,0.04), padding 16px.
       Card body (10px gap):
         Top row: asteroid name (Inter heading-weight 800, 15px, color #0A1124) on left; if hazardous, a HazardousPill on the right.
         HazardousPill: red bg #DC2626, white #FFFFFF text "POTENTIALLY HAZARDOUS", 10px uppercase, letter-spacing 0.06em, pill radius 999px, padding 4px 10px.
         Meta line: close-approach date — 12px, #4A5468.
         Stats grid (2 columns, 6px row gap): "Diameter ~50–110 m", "Miss distance 3.2M km", "Velocity 14 km/s", "Magnitude 19.7" — labels muted #4A5468, values #0A1124.
         Bottom-right small link "View on JPL →" — 12px, color #2563EB.

SAMPLE DATA (use these names/values across the 6 cards; mark cards 2 and 5 as hazardous)
  1. (2024 BC1)        2026-05-09  50–110 m   3.2M km   14.1 km/s   not hazardous
  2. Apophis (99942)   2026-05-10  340 m      31,000 km 7.4 km/s    HAZARDOUS
  3. (2025 GH3)        2026-05-11  18–40 m    1.1M km   9.8 km/s    not hazardous
  4. (2026 KN5)        2026-05-12  120–270 m  4.7M km   12.3 km/s   not hazardous
  5. Bennu (101955)    2026-05-13  490 m      750,000 km 6.1 km/s   HAZARDOUS
  6. (2026 MM2)        2026-05-15  25–55 m    2.4M km   11.0 km/s   not hazardous

OUT OF SCOPE
  No orbit visualisation, no detail page link beyond "View on JPL →", no pagination.
```

---

## Prompt 2 — AsteroidCard component detail (Epic 3 / KAN-8)

**Use as:** isolated component spec — useful when iterating on the card alone.

**Suggested screen name:** `AsteroidCard component (Epic 3)`

```
Build a single-component spec sheet named "AsteroidCard component (Epic 3)" in the feza light theme (canonical).

CANVAS
  Centred 800px-wide section with feza light page bg #F5F7FB. Top eyebrow "COMPONENT · ASTEROIDCARD" — 11px uppercase #2563EB, letter-spacing 0.08em. H1 "AsteroidCard" — 36px #0A1124, weight 900, letter-spacing -0.025em, apply .fz-shine.

SHOW THREE VARIANTS, STACKED 24px APART
  1. Default (not hazardous) — name "(2024 BC1)", date 2026-05-10, diameter 50–110 m, miss distance 3.2M km, velocity 14.1 km/s, magnitude 21.4. No pill.
  2. Hazardous — name "Apophis (99942)", date 2026-05-11, diameter 340 m, miss distance 31,000 km, velocity 7.4 km/s, magnitude 19.7. Red HazardousPill in the top-right.
  3. Loading skeleton — three 12px-tall pill-shaped (radius 6px) shimmer placeholders: full-width, 60%-width, 40%-width. Bg #E9EEF7 with a subtle 1.4s linear shimmer.

CARD STYLE (all variants)
  Bg #FFFFFF, 1px border #C9D2E3, radius 16px, padding 16px, shadow 0 6px 20px rgba(10,17,36,0.08) + 0 1px 2px rgba(10,17,36,0.04).
  Body gap 10px. Stats grid 2 columns, 6px row gap, labels #4A5468, values #0A1124.
  Name: Inter heading-weight 800, 15px, color #0A1124. Date meta: 12px #4A5468.
  HazardousPill: bg #DC2626, text #FFFFFF, "POTENTIALLY HAZARDOUS" 10px uppercase, letter-spacing 0.06em, padding 4px 10px, radius 999px.
  "View on JPL →" link bottom-right, 12px, color #2563EB.

ANNOTATIONS (in muted #4A5468, 11px uppercase letter-spacing 0.08em, beneath each variant)
  "DEFAULT", "HAZARDOUS — POTENTIALLY HAZARDOUS PILL", "LOADING SKELETON".
```

---

## Prompt 3 — DateRangePicker component (Epic 3 / KAN-7)

**Use as:** focused atom spec for the component scaffolded by `/feza-component DateRangePicker`.

**Suggested screen name:** `DateRangePicker component (Epic 3)`

```
Build a single-component spec named "DateRangePicker component (Epic 3)" in the feza light theme (canonical).

CANVAS
  Centred 600px-wide section, feza light bg #F5F7FB. Top eyebrow "COMPONENT · DATERANGEPICKER" — 11px uppercase #2563EB, letter-spacing 0.08em. H1 "DateRangePicker" — 36px #0A1124, weight 900, letter-spacing -0.025em, apply .fz-shine.

SHOW THREE STATES, STACKED 24px APART
  1. Default — start input "2026-05-10", end input "2026-05-16". Caption "Max 7 days (NeoWs API limit)".
  2. Clamped — user picked end "2026-05-30", clamped to "2026-05-17". Caption replaced with "End clamped to start + 7 days." in #DC2626 (danger).
  3. Empty — both inputs unfilled, placeholder text "YYYY-MM-DD" in #4A5468. Caption muted.

STYLE
  Two date inputs side by side, gap 12px. Each input wrapped with a label "Start" / "End" — labels are 12px uppercase, letter-spacing 0.06em, color #4A5468, 6px above the input.
  Input box: bg #E9EEF7, 1px border #C9D2E3, radius 10px, padding 10px 12px, text color #0A1124, font Inter body-weight 500, 14px. Focus state: border becomes #2563EB.
  Caption below the inputs: 12px, color #4A5468 (or #DC2626 in clamped state).

ANNOTATIONS (in muted #4A5468, 11px uppercase letter-spacing 0.08em, beneath each variant)
  "DEFAULT", "CLAMPED — END > START + 7 DAYS", "EMPTY".
```

---

## Prompt 4 — DatePicker component (Epic 2 / KAN-4)

**Use as:** focused atom spec for the simpler single-date component scaffolded by `/feza-component DatePicker`. Useful as a sibling to the existing Epic 2 "Incoming screen" you already have.

**Suggested screen name:** `DatePicker component (Epic 2)`

```
Build a single-component spec named "DatePicker component (Epic 2)" in the feza light theme (canonical).

CANVAS
  Centred 480px-wide section, feza light bg #F5F7FB. Top eyebrow "COMPONENT · DATEPICKER" — 11px uppercase #2563EB, letter-spacing 0.08em. H1 "DatePicker" — 36px #0A1124, weight 900, letter-spacing -0.025em, apply .fz-shine.

SHOW THREE STATES, STACKED 24px APART
  1. Default — value "2026-05-10".
  2. Empty — placeholder "YYYY-MM-DD".
  3. Disabled — value "2026-05-10", input dimmed (opacity 0.5), label still visible.

STYLE
  Label "Date" above input — 12px uppercase, letter-spacing 0.06em, color #4A5468, 6px below the label, then the input.
  Input box: bg #E9EEF7, 1px border #C9D2E3, radius 10px, padding 10px 12px, text color #0A1124, font Inter body-weight 500, 14px. Min input width 200px. Focus state: border becomes #2563EB.

ANNOTATIONS (in muted #4A5468, 11px uppercase letter-spacing 0.08em, beneath each variant)
  "DEFAULT", "EMPTY", "DISABLED".

Mirror the visual language of your existing "Incoming screen (Epic 2)" so this feels like the same family of artefacts. If that screen is in the older dark palette, regenerate or update it to match the new light canonical theme.
```

---

## Workflow on stage

1. Open <https://claude.ai/design>, switch to the `feza` project (the one in your screenshot).
2. Paste **Prompt 1** (Asteroids landing) into the chat. Iterate twice — typical refinements: "make the hazardous pill more prominent", "tighten the stat-grid line-height".
3. Click **Hand off to Claude Code**. Copy the export bundle, paste into terminal as part of `/feza-from-jira KAN-8`.
4. Repeat for Prompts 2–4 only if the audience needs to see the focused-component view (often Prompt 1 is enough).

## Cross-reference

- `documents/EPIC_3_TICKETS.md` — links each Epic 3 ticket (KAN-7, KAN-8) to the relevant prompt above
- `documents/EPIC_2_TICKETS.md` — links KAN-4 to Prompt 4 above
- `documents/PART2_PLAN.md` — talk arc, minutes 22–28 is the Claude Design beat
- `tokens.json` — full source of truth if you want to expand the global snippet
