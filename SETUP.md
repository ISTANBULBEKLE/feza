# SETUP.md — one-time wiring

This file lists the manual steps to make the four CI workflows go green. You run these once, outside Claude. Total ≈ 20 minutes.

The four workflows live in `.github/workflows/`:

- `claude-pr-review.yml` — Claude PR Review (already wired; needs `CLAUDE_CODE_OAUTH_TOKEN`).
- `lint.yml` — `lint`, `typecheck`, `test` (no secrets needed).
- `sonarcloud.yml` — SonarCloud Code Analysis (needs `SONAR_TOKEN`).
- `chromatic.yml` — Storybook visual regression (needs `CHROMATIC_PROJECT_TOKEN`).

## 0. GitHub repo settings

1. Settings → Actions → General.
2. Confirm **Read and write permissions** is selected.
3. Confirm **Allow GitHub Actions to create and approve pull requests** is enabled.

## 1. SonarCloud

1. Sign in via GitHub at <https://sonarcloud.io/sessions/new>.
2. Install the **SonarCloud GitHub App** on `ISTANBULBEKLE/feza` only (no org-wide grant needed).
3. Create the SonarCloud project for `feza` via the *With GitHub Actions* path. Do **not** let it auto-add a workflow — `.github/workflows/sonarcloud.yml` is already present.
4. Confirm the project key on SonarCloud matches `sonar.projectKey=ISTANBULBEKLE_feza` in `sonar-project.properties`. If SonarCloud assigned a different key (case, separators), update the properties file rather than the dashboard.
5. **Disable Automatic Analysis** on the SonarCloud project: Administration → Analysis Method → toggle off. The `sonarcloud.yml` workflow is the only analysis path.
6. Generate `SONAR_TOKEN`: My Account → Security → token type *User Token* → name `feza-ci` → copy the value.
7. Add `SONAR_TOKEN` to repo secrets at <https://github.com/ISTANBULBEKLE/feza/settings/secrets/actions>.
8. Set the project's **New Code definition** to "Previous version" (Administration → New Code) so the quality gate measures only the diff.

For local `make sonar` runs, `export SONAR_TOKEN=<value>` in your shell first.

## 2. Chromatic

1. Sign up via GitHub at <https://www.chromatic.com/start>.
2. Create the Chromatic project, link it to `ISTANBULBEKLE/feza`, copy the project token (`chpt_...`).
3. Add `CHROMATIC_PROJECT_TOKEN` to repo secrets.
4. Approve the **Chromatic GitHub App** on the repo (separate confirmation popup — required for the `UI Tests / Chromatic` status check to post on PRs).
5. Open the README and replace `YOUR_APP_ID` in the Chromatic badge URL with the Chromatic appId (visible in the dashboard URL `https://www.chromatic.com/library?appId=...`).

## 3. Verify

Open a small PR and confirm five status checks land:

- `lint`
- `typecheck`
- `test`
- `SonarCloud Code Analysis`
- `UI Tests / Chromatic`

(Six counting the existing `Claude PR Review`.)

Once green: Settings → Branches → `main` → require those checks to pass before merge.

## 4. Local equivalents

| Workflow | Local command |
|---|---|
| `lint` | `make lint` / `make lint-check` (triaged via `/eslint-check`) |
| `test` | `make test` |
| `typecheck` | `npx tsc --noEmit` |
| `sonarcloud` | `make sonar` (requires `SONAR_TOKEN`) |
| `chromatic` | `npm run chromatic` (requires `CHROMATIC_PROJECT_TOKEN`) |
