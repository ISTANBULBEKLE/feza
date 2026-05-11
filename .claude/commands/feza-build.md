---
description: Run the feza production build (Next.js). Catches type errors that the Turbopack dev server ignores.
allowed-tools:
  - Bash(make build)
  - Bash(npm run build)
---

Run `make build` (foreground). If it fails, summarise the first error with file:line and suggest a fix. If it succeeds, print the final `✓ Compiled successfully` line and the route summary.
