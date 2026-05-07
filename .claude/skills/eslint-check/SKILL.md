---
name: eslint-check
description: Run ESLint against the feza project (or a path) and produce a triaged report — errors, warnings, auto-fixable rules, and CLAUDE.md-specific concerns. Use when the user runs /eslint-check or asks for a lint pass before committing.
disable-model-invocation: true
arguments: [path]
allowed-tools: Bash(npm run lint*), Bash(npx eslint*)
---

Triage a lint pass over the feza project (or `$path` when supplied).

## Step 1 — Run ESLint as JSON

If `$path` is empty, run `!npx eslint . --format json`. Otherwise run `!npx eslint $path --format json`. Capture the JSON, do not print it raw — the output is large.

For each file entry in the JSON: severity `2` is an error, severity `1` is a warning. A `messages[].fix` field means the rule is auto-fixable.

## Step 2 — Read the project conventions

Read `CLAUDE.md` at the repo root. Use it as the source of "feza-specific rules ESLint can't catch." Walk the diff (or `$path`) and flag any of:

- `"use client"` at the top of a file that has no hooks, no event handlers, and touches no browser APIs
- Tailwind class strings (`className="bg-…"` etc.) — feza is SCSS modules only
- `import "…/global*.css"` or any global CSS beyond `src/app/globals.scss`
- `params` or `searchParams` used inside a page or Route Handler without `await`
- Plain `<img>` without an adjacent `// eslint-disable-next-line @next/next/no-img-element` comment (the per-line disable is the documented exception)
- Component folders missing one of the three required files (`.tsx` + `.module.scss` + `.test.tsx`)

## Step 3 — Print the report

Sections, in order, skipping any that are empty:

1. **Summary** — `<errors> errors, <warnings> warnings across <files> files. Verdict: <pass|fix-required>`.
2. **Errors** — grouped by rule, sorted by frequency, each finding cited as `file:line — <verbatim ESLint message>`.
3. **Warnings** — same shape as Errors.
4. **Auto-fixable** — list of rules that ESLint can resolve, ending with the literal command `npm run lint:fix` (or `npx eslint $path --fix`).
5. **CLAUDE.md violations** — convention findings from Step 2, each as `file:line — <one-line explanation>`.

## Tone

Cite `file:line` for every finding. Quote ESLint messages verbatim — do not paraphrase. No praise, no recap of what the project does. If everything is clean, print only the Summary.
