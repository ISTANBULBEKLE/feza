# CANVA_BRAND_KIT.md

Paste-ready recipe for creating a **feza** Brand Kit in Canva, so future `generate-design` calls (via the Canva MCP) produce on-palette mockups instead of stock-template colours.

> **Heads up: Brand Kits are a paid Canva feature.** Without a paid plan, the steps below won't work and `generate-design` will keep producing designs in Canva's default template palette. For free, claude.ai/design (`documents/CLAUDE_DESIGN_PROMPTS.md`) is the canonical design path — Canva Brand Kits are an *optional* alternative if you happen to have a paid Canva plan.

Source of truth: `tokens.json` at the repo root and `documents/DESIGN_SYSTEM_TOKEN.md`. This file is the Canva-specific projection.

## Why this exists

Canva's editing API can only change text content, text colours, and image asset swaps — **not shape fills, divider colours, or page backgrounds**. So re-skinning an existing AI-generated Canva design after the fact won't work. The supported path is: create a Brand Kit once in Canva's UI, then re-call `generate-design` with `brand_kit_id` set so Canva builds the design with the right palette from the ground up.

The Canva MCP doesn't expose `create-brand-kit` — Brand Kit creation is manual in Canva (≈ 3 minutes one time). Everything below tells you exactly what to paste.

## Step 1 — Open Brand Kit in Canva

1. Sign in to <https://www.canva.com>
2. Left sidebar → **Brand** → **Brand Kits** → **+ Add new**
3. Name it: **`feza`**

## Step 2 — Paste the dark palette

Under **Brand colors → + Add new palette**, name the palette **`feza dark`**. Add these swatches (click the colour chip → paste hex → name it):

| Swatch name | Hex | Role |
|---|---|---|
| Background | `#0B0D12` | Page background |
| Surface | `#11151D` | Card / panel background |
| Surface 2 | `#1A2030` | Inset / hover layer |
| Border | `#232A3A` | 1 px hairlines |
| Foreground | `#E7EAF2` | Primary text |
| Muted | `#8B93A7` | Secondary text |
| Accent | `#6CB4FF` | Links, focused inputs |
| Accent strong | `#9AD0FF` | Hover state of Accent |
| Danger | `#FF7A7A` | Hazardous pill, error text |
| On accent | `#06121F` | Text on filled Accent buttons |

## Step 3 — (Optional) Paste the light palette

If you also want light-mode mockups, add a second palette **`feza light`** with these — the *only* differences from dark are background/surface/text/border:

| Swatch name | Hex |
|---|---|
| Background | `#F7F8FB` |
| Surface | `#FFFFFF` |
| Surface 2 | `#EEF1F6` |
| Border | `#D8DDE7` |
| Foreground | `#0B0D12` |
| Muted | `#5B6478` |

(Accent / Accent strong / Danger / On accent stay identical to dark — they're theme-invariant per `tokens.json`.)

## Step 4 — Brand fonts

Under **Brand fonts**:

| Slot | Family | Weight |
|---|---|---|
| Heading | **Inter** | Bold (700) |
| Subheading | **Inter** | Semibold (600) |
| Body | **Inter** | Regular (400) |

Inter is the canonical Figma family per `tokens.json` (`font.family.sans.$description: "Use Inter in Figma master library"`). Canva ships Inter; if it's missing from the picker, install via **Brand fonts → Upload a font** (Google Fonts → Inter → Download family).

## Step 5 — Logo (optional, ≤ 1 min)

The feza brand mark is the Unicode `✦` glyph (U+2726) — see `tokens.json → icon.brand-mark` and the wordmark spec in `tokens.typography.wordmark`.

If you want a logo in the brand kit:
- Quick: take a screenshot of `✦ feza` rendered in Inter Bold from the dev server (`http://localhost:3000`), crop, transparent PNG, upload as the brand logo.
- Skip: most generated mockups don't need a logo; Canva will fall back to no logo.

## Step 6 — Brand voice (optional)

Paste this into Brand voice → Description:

> Calm, technical, minimal. Feza is a developer-tool demo app — copy is concrete and concise (no marketing adjectives, no exclamation marks). Lean on data labels and verbs over adjectives. Audience is engineers.

## Step 7 — Tell Claude you're done

When the brand kit exists, prompt me with:

> "Regenerate the Canva Epic 3 mockups using the new feza brand kit."

I'll re-run `list-brand-kits` to fetch the new ID, then re-call `generate-design` with `brand_kit_id` set for both the landing screen and the AsteroidCard. New candidates will use the feza palette + Inter from the ground up.

## What this still won't fix

- Canva's design templates are marketing-flavoured. Even with the right palette, generated outputs will look like *graphic designs in feza colours*, not like a literal UI screenshot. For pixel-faithful UI mockups, use **claude.ai/design** (it renders real HTML/CSS using `tokens.json` directly) — see `documents/EPIC_3_TICKETS.md`. The Brand Kit makes Canva better-but-imperfect; claude.ai/design is the actual UI-prototyping path.

## Cross-reference

- `tokens.json` — single source of truth for all values above
- `documents/DESIGN_SYSTEM_TOKEN.md` — full token reference
- `documents/EPIC_3_TICKETS.md` — where the regenerated Canva mockups will be linked
- `documents/ATLASSIAN_SETUP.md` § 7 — demo runbook list
