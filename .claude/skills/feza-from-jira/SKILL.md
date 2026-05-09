---
name: feza-from-jira
description: Read a Jira ticket via the Atlassian MCP and dispatch the work to the right feza scaffold skill (feza-route, feza-component, feza-story, nasa-fetch). Use when the user names a Jira key (e.g. "implement KAN-8") or says "build the next ticket".
arguments: [jiraKey]
---

Implement Jira ticket `$jiraKey` end-to-end inside `feza`. The Atlassian Remote MCP must be registered first — see `documents/ATLASSIAN_SETUP.md`.

## Step 1 — Read the ticket

Use the Atlassian MCP to fetch `$jiraKey`. Extract:

- **Title** (becomes the commit subject + branch name)
- **Description / Acceptance** (drives what to scaffold)
- **Epic link** (e.g. `KAN-2` → tells you which file group to touch — Epic 3 / `/asteroids`)
- **Files-touched hints** (any `src/...` paths in the description)

If the ticket is missing acceptance criteria or files-touched hints, stop and ask the user before scaffolding — half-shaped Jira tickets generate wrong-shaped code.

## Step 2 — Decide which scaffold skill to dispatch

Use this lookup. Pick exactly one as the primary; subsequent steps may invoke others.

| Description mentions… | Primary skill |
|---|---|
| "page", "route at /…", "App Router page" | `/feza-route <segment>` |
| "component", "atom", "card", "panel" | `/feza-component <Name>` |
| "Storybook story" | `/feza-story <Name>` |
| "NASA endpoint", "wrap … API" | `/nasa-fetch <endpoint> <baseUrl>` |
| Lib body / route handler body only (signatures already shipped) | No scaffold — open the file and edit |

If multiple apply (typical for a "page" ticket that also adds a new component), call the primary first then the secondary.

## Step 3 — Branch + scaffold

```bash
git checkout -b feature/$(jira-key-to-kebab "$jiraKey")
```

Run the chosen scaffold skill. After scaffolding, fill in the body following the ticket's acceptance criteria. Reuse existing components from `src/components/` (especially `<PhotoCard>`, `<PhotoGrid>`) — the talk's reuse beat depends on it.

## Step 4 — Verify

```bash
make test       # all tests green
make build      # Turbopack catches type errors npm run dev silently ignores
```

## Step 5 — Report back

Output a checklist to the user:

- [ ] Ticket read: `$jiraKey` — *<title>*
- [ ] Scaffold skill dispatched: `<which one>`
- [ ] Files touched: `<list>`
- [ ] Acceptance criteria covered: `<which ones, which still pending>`
- [ ] `make test` green
- [ ] `make build` green
- [ ] Branch: `feature/<kebab>`

Do **not** push or open a PR automatically — the user runs `gh pr create` on stage as a separate beat.

## Notes

- This skill is composition-first. It deliberately calls existing skills rather than duplicating their logic. If a scaffold pattern is missing, add it as its own skill — don't inline it here.
- The Atlassian MCP tool calls are gated by the OAuth scope granted at MCP-add time. If a tool call fails with an auth error, point the user at `documents/ATLASSIAN_SETUP.md` § 5.
- For Epic 3 lib + route handler bodies (tickets like KAN-6 / E3-T2), there's no scaffold to run — the signatures were pre-shipped. Skip Step 2 and edit `src/lib/nasa.ts` and `src/app/api/asteroids/route.ts` directly.
