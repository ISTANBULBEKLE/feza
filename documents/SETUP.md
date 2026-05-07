# SETUP.md — one-time CI wiring

Manual steps to make the four GitHub Actions workflows go green. Run these once, outside Claude. ≈ 20 minutes.

| Workflow | Secrets required |
|---|---|
| `lint.yml` | none |
| `claude-pr-review.yml` | `CLAUDE_CODE_OAUTH_TOKEN` (already wired) |
| `sonarcloud.yml` | `SONAR_TOKEN` |
| `chromatic.yml` | `CHROMATIC_PROJECT_TOKEN` |

Third-party actions (`chromaui/action`, `SonarSource/sonarqube-scan-action`) are pinned to full commit SHAs for supply-chain hardening; first-party `actions/*` use major-version tags. Update with Dependabot.

## 0. GitHub repo settings

Settings → Actions → General → confirm **Read and write permissions** + **Allow GitHub Actions to create and approve pull requests**.

## 1. SonarCloud

1. Sign in via GitHub at <https://sonarcloud.io/sessions/new>.
2. Install the **SonarCloud GitHub App** on `ISTANBULBEKLE/feza` only.
3. Create the SonarCloud project via the *With GitHub Actions* path. Do **not** let it auto-add a workflow — `.github/workflows/sonarcloud.yml` is already present.
4. Confirm the project key matches `sonar.projectKey=ISTANBULBEKLE_feza` in `sonar-project.properties`. If SonarCloud assigned a different key (case, separators), update the properties file rather than the dashboard.
5. **Disable Automatic Analysis**: Administration → Analysis Method → toggle off. The workflow is the only analysis path; running both produces "duplicate analysis" errors.
6. Generate `SONAR_TOKEN`: My Account → Security → type **User Token** → name `feza-ci` → copy once.
7. Add `SONAR_TOKEN` to repo secrets at <https://github.com/ISTANBULBEKLE/feza/settings/secrets/actions>.
8. Set **New Code definition** to *Reference branch `main`* (Administration → New Code) so the quality gate measures only the diff.

For local `make sonar` runs: `export SONAR_TOKEN=<value>` in your shell first.

## 2. Chromatic

1. Sign up via GitHub at <https://www.chromatic.com/start>.
2. Create the Chromatic project, link it to `ISTANBULBEKLE/feza`, copy the project token (`chpt_...`).
3. Add `CHROMATIC_PROJECT_TOKEN` to repo secrets.
4. Approve the **Chromatic GitHub App** on the repo (separate confirmation popup — required for the `UI Tests / Chromatic` status check to post on PRs).
5. Open `README.md` and replace `YOUR_APP_ID` in the Chromatic badge URL with the appId (visible in the dashboard URL `https://www.chromatic.com/library?appId=...`).

First Chromatic publish is auto-accepted as the baseline; the second publish needs a visible UI diff for Chromatic's onboarding wizard to advance into normal CI mode.

## 3. Verify

Open a small PR and confirm five status checks land:

- `lint` · `typecheck` · `test` (from `lint.yml`)
- `SonarCloud Code Analysis`
- `UI Tests / Chromatic`

(Six counting `Claude PR Review`.)

Once green: Settings → Branches → `main` → require those checks to pass before merge.

## 4. Local equivalents

| Workflow | Local command |
|---|---|
| `lint` | `make lint` / `make lint-check` (triaged via `/eslint-check`) |
| `test` | `make test` |
| `typecheck` | `npx tsc --noEmit` |
| `sonarcloud` | `make sonar` (requires `SONAR_TOKEN`) |
| `chromatic` | `npm run chromatic` (requires `CHROMATIC_PROJECT_TOKEN`) |

## 5. Troubleshooting

| Error | Fix |
|---|---|
| `Project not found` (SonarCloud) | SonarCloud project not imported, or key mismatch with `sonar-project.properties`. |
| `Both automatic and CI-based analysis enabled` | Step 1.5 above (disable Automatic Analysis). |
| `Missing project token` (Chromatic) | `CHROMATIC_PROJECT_TOKEN` secret not set, or set with a typo. |
| `No changes found` (Chromatic, second publish) | Onboarding wizard expects a visible diff — make a small UI tweak and re-publish. |
| `Use full commit SHA hash for this dependency` (Sonar hotspot) | Pin the flagged third-party action to a 40-char commit SHA. |
