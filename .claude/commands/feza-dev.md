---
description: Start the feza dev server (Next.js 16 + Turbopack) in the background.
argument-hint: "[port]"
allowed-tools:
  - Bash(make dev*)
  - Bash(make stop)
  - Bash(npm run dev*)
  - Bash(lsof -ti:*)
---

Start the feza dev server.

1. Determine the port: use `$ARGUMENTS` if provided, otherwise `3000`.
2. If something is already bound to that port, run `make stop` first.
3. Start `make dev PORT=<port>` with `run_in_background: true` so the server keeps running after this command returns.
4. Print the URL `http://localhost:<port>` once the server is ready.
