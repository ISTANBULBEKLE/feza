# feza — Design handoff (Epic 2 & Epic 3)

This folder is the visual + spec source of truth for Epic 2 (`/apod`) and
Epic 3 (`/asteroids`). It is **self-contained** — drop the whole folder into
your `feza` repo (e.g. at `feza/design-handoff/`) and point Claude Code at
the relevant subfolder.

## Contents

```
design-handoff/
├── README.md                 — this file
├── tokens.css                — canonical design tokens (paste into globals.scss)
├── epic-2/
│   ├── README.md             — Claude Code prompt for /apod
│   ├── preview.standalone.html — open in browser; visual reference
│   └── screenshots/          — flat PNGs of the screen + component states
└── epic-3/
    ├── README.md             — Claude Code prompt for /asteroids
    ├── preview.standalone.html
    └── screenshots/
```

## How to use with Claude Code

From the repo root:

```bash
# Epic 2
claude "Read design-handoff/epic-2/README.md and implement it. Use design-handoff/tokens.css as the single source of truth for color, weight, and shadow tokens."

# Epic 3
claude "Read design-handoff/epic-3/README.md and implement it. Use design-handoff/tokens.css as the single source of truth for color, weight, and shadow tokens."
```

Open `epic-X/preview.standalone.html` in a browser side-by-side with Claude
Code so you can visually verify each component as it lands.

## Token contract

`tokens.css` is the **authoritative** token set. If any value in
`src/app/globals.scss` differs, update globals.scss to match — do NOT alter
`tokens.css` to match the existing repo.
