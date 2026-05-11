---
description: Run ESLint over the feza repo or a specific path. (Distinct from /eslint-check, which produces a triaged report.)
argument-hint: "[path]"
allowed-tools:
  - Bash(npm run lint*)
  - Bash(npx eslint*)
---

Run ESLint.

- If `$ARGUMENTS` is empty, run `npm run lint`.
- If `$ARGUMENTS` is a path or glob, run `npx eslint $ARGUMENTS`.

Report counts (errors, warnings) and the top 3 rule violations by frequency. Do not auto-fix — `/feza-lint` is read-only; use `make lint-fix` to apply fixes.
