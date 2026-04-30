---
name: review-pr
description: Review a pull request in this feza repo against CLAUDE.md conventions, plus general code-quality, security, and accessibility checks. Use when the user runs /review-pr or asks for a PR review by number.
disable-model-invocation: true
arguments: [prNumber]
allowed-tools: Bash(gh *)
---

Review pull request **#$prNumber**.

## Step 1 — Pull context

Run, in order:

- `!gh pr view $prNumber`
- `!gh pr diff $prNumber`
- `!gh pr view $prNumber --comments`

## Step 2 — Read the project conventions

Read `CLAUDE.md` in the project root. Use it as the canonical source of "how feza wants code to look." If the diff violates a CLAUDE.md rule, that's a high-priority finding.

## Step 3 — Review

Produce a review with these sections, in this order:

1. **Summary** — one paragraph: what the PR does, biggest risk, recommended action (approve / request changes / comment).
2. **Blocking issues** — only true blockers (broken builds, security holes, breaking API changes, CLAUDE.md violations). Skip if none.
3. **Suggestions** — quality, naming, missing tests, accessibility. Cite file:line.
4. **Nits** — formatting, comments, minor wording. Skip the section if there are none.

## Conventions to enforce (from `CLAUDE.md`)

- Server Components by default; `"use client"` only when needed
- `params` and `searchParams` are awaited
- Three-file component pattern (tsx + .module.scss + .test.tsx)
- No Tailwind, no global CSS beyond `globals.scss`
- `NASA_API_KEY` never reaches the client; clients hit `/api/*` only
- New components must include a Vitest test
- Plain `<img>` is fine for NASA thumbnails (per CLAUDE.md exception)

## Tone

Be specific. Cite paths and line numbers. Don't write generic "consider adding tests" — point at the file that needs them. Skip praise; the value is the diff feedback.

When invoked from GitHub Actions, post the review as a single PR comment via `gh pr review`. When invoked locally (`/review-pr 123`), print the review to the terminal.
