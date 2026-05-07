---
name: sonar-scan
description: Run a SonarCloud scan locally and explain the result — quality gate, new issues, coverage, and security hotspots. Use when the user runs /sonar-scan or asks for a Sonar pass before merging the demo branch.
disable-model-invocation: true
arguments: []
allowed-tools: Bash(npx sonar-scanner*), Bash(npm run test:coverage*), Bash(curl https://sonarcloud.io/*), Bash(printenv SONAR_TOKEN)
---

Run a SonarCloud scan against the configured project and surface the result.

## Step 1 — Preflight

`!printenv SONAR_TOKEN` must return a non-empty value. `sonar-project.properties` must exist at the repo root. If either fails, stop and print: `SONAR_TOKEN unset or sonar-project.properties missing — see documents/SETUP.md.`

## Step 2 — Generate coverage

`!npm run test:coverage`. SonarCloud reads `coverage/lcov.info` — without it, the dashboard reports 0% coverage even when tests are green.

## Step 3 — Run the scanner

`!npx sonar-scanner -Dsonar.token=$SONAR_TOKEN`. Capture the **task id** from the trailing `INFO: More about the report processing at https://sonarcloud.io/api/ce/task?id=<taskId>` line. Note the project key from `sonar-project.properties` (e.g. `ISTANBULBEKLE_feza`).

## Step 4 — Wait for processing

Poll `!curl -s "https://sonarcloud.io/api/ce/task?id=<taskId>"` every 3 s until `task.status` leaves `IN_PROGRESS` / `PENDING`. Time out after 60 s; report partial result.

## Step 5 — Pull the result

Once `task.status` is `SUCCESS`, fetch four endpoints in parallel from `https://sonarcloud.io`: `/api/qualitygates/project_status?projectKey=<key>` (gate), `/api/measures/component?component=<key>&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,security_hotspots` (measures), `/api/issues/search?componentKeys=<key>&resolved=false&inNewCodePeriod=true&ps=50` (new-code issues), and `/api/hotspots/search?projectKey=<key>&inNewCodePeriod=true` (new-code hotspots).

## Step 6 — Print the report

Sections, in order, skipping any that are empty:

1. **Summary** — `Quality gate: <PASSED|FAILED|WARN>. <bugs> bugs · <vulnerabilities> vulnerabilities · <code_smells> smells · <coverage>% coverage · <duplicated_lines_density>% duplication.`
2. **New issues** — grouped by severity (`BLOCKER`, `CRITICAL`, `MAJOR`, `MINOR`, `INFO`), each `<rule> — file:line — <message>`.
3. **Coverage** — `<coverage>% on new code (project total <project_coverage>%)`.
4. **Hotspots** — `<category> — file:line — <message>`. Skip if zero.
5. **URL** — `https://sonarcloud.io/summary/new_code?id=<key>`.

Cite `file:line` for every issue. Quote Sonar messages verbatim. If the gate passed and there are no new issues, print only the Summary line and the URL.
