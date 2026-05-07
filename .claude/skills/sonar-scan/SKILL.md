---
name: sonar-scan
description: Run a SonarCloud scan locally and explain the result — quality gate, new issues, coverage, and security hotspots. Use when the user runs /sonar-scan or asks for a Sonar pass before merging the demo branch.
disable-model-invocation: true
arguments: []
allowed-tools: Bash(npx sonar-scanner*), Bash(npm run test:coverage*), Bash(curl https://sonarcloud.io/*), Bash(printenv SONAR_TOKEN)
---

Run a SonarCloud scan against the configured project and surface the result.

## Step 1 — Preflight

Confirm two preconditions, in order:

1. `!printenv SONAR_TOKEN` returns a non-empty value. If empty, stop and print: `SONAR_TOKEN is unset — see SETUP.md for the one-time setup steps.`
2. `sonar-project.properties` exists at the repo root. If missing, stop and print: `sonar-project.properties is missing — see SETUP.md.`

If either fails, do not run the scanner.

## Step 2 — Generate coverage

Run `!npm run test:coverage`. SonarCloud reads `coverage/lcov.info` — without it, the dashboard reports 0% coverage even if the tests are green.

## Step 3 — Run the scanner

Run `!npx sonar-scanner -Dsonar.token=$SONAR_TOKEN`. Capture the **task id** from the trailing log line `INFO: More about the report processing at https://sonarcloud.io/api/ce/task?id=<taskId>`. Note the project key from `sonar-project.properties` (e.g. `ISTANBULBEKLE_feza`) — you will need both.

## Step 4 — Wait for processing

Poll `!curl -s "https://sonarcloud.io/api/ce/task?id=<taskId>"` every 3 seconds until `task.status` leaves `IN_PROGRESS` or `PENDING`. Time out after 60 seconds and report the partial result.

## Step 5 — Pull the result

Once processing is `SUCCESS`, fetch in parallel:

- `!curl -s "https://sonarcloud.io/api/qualitygates/project_status?projectKey=<projectKey>"` — gate status.
- `!curl -s "https://sonarcloud.io/api/measures/component?component=<projectKey>&metricKeys=bugs,vulnerabilities,code_smells,coverage,duplicated_lines_density,security_hotspots"` — top-line measures.
- `!curl -s "https://sonarcloud.io/api/issues/search?componentKeys=<projectKey>&resolved=false&inNewCodePeriod=true&ps=50"` — new-code issues.
- `!curl -s "https://sonarcloud.io/api/hotspots/search?projectKey=<projectKey>&inNewCodePeriod=true"` — new-code hotspots.

## Step 6 — Print the report

Sections, in order, skipping any that are empty:

1. **Summary** — `Quality gate: <PASSED|FAILED|WARN>. <bugs> bugs · <vulnerabilities> vulnerabilities · <code_smells> smells · <coverage>% coverage · <duplicated_lines_density>% duplication.`
2. **New issues** — grouped by severity (`BLOCKER`, `CRITICAL`, `MAJOR`, `MINOR`, `INFO`), each as `<rule> — file:line — <message>`.
3. **Coverage** — single line: `<coverage>% on new code (project total <project_coverage>%)`.
4. **Hotspots** — each as `<category> — file:line — <message>`. Skip if zero.
5. **URL** — single line: `https://sonarcloud.io/summary/new_code?id=<projectKey>`.

## Tone

Cite `file:line` for every issue. Quote Sonar messages verbatim. No praise, no recap. If the gate passed and there are no new issues, print only the Summary line and the URL.
