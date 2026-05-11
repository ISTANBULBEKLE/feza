---
description: Run feza Vitest unit tests, optionally filtered by a name pattern.
argument-hint: "[pattern]"
allowed-tools:
  - Bash(npm run test*)
  - Bash(make test)
---

Run the feza Vitest suite.

- If `$ARGUMENTS` is empty, run `npm run test`.
- If `$ARGUMENTS` is non-empty, run `npm run test -- $ARGUMENTS` so Vitest filters by the pattern (e.g. `/feza-unit-test PhotoCard` runs only PhotoCard tests).

Report the final summary line (pass/fail counts). Do not modify any files.
