---
name: feza-route
description: Scaffold a Next.js 16 App Router route in feza — src/app/<segment>/page.tsx (server, async) plus a colocated <Segment>Panel.tsx (client stub), and the paired src/app/api/<segment>/route.ts handler. Use when the user asks to "scaffold a route", "create a page at /X", or names a new app route.
arguments: [segment]
---

Scaffold a route at `/$segment`.

## Substitutions

Apply these everywhere they appear in the templates below:

- `$segment` — the URL slug as provided (lowercase, kebab-case). Example: `apod`, `solar-flares`.
- `$Segment` — the PascalCase form for React component names. Example: `Apod`, `SolarFlares`.

Worked example: `/feza-route apod` → `$segment` = `apod`, `$Segment` = `Apod`, so `$SegmentPanel` becomes `ApodPanel`.

Create exactly these four files using the Write tool.

## File 1: `src/app/$segment/page.tsx`

```tsx
import Link from "next/link";
import { $SegmentPanel } from "./$SegmentPanel";
import styles from "./$SegmentPanel.module.scss";

export const metadata = {
  title: "$segment · feza",
};

export default async function $SegmentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await searchParams;
  return (
    <main>
      <Link href="/" className={styles.back}>← feza</Link>
      <h1>$segment</h1>
      <$SegmentPanel />
    </main>
  );
}
```

## File 2: `src/app/$segment/$SegmentPanel.tsx`

```tsx
"use client";

import styles from "./$SegmentPanel.module.scss";

export function $SegmentPanel() {
  return (
    <section className={styles.panel}>
      {/* Render the panel body here — wire form, fetch, and render results. */}
    </section>
  );
}
```

## File 3: `src/app/$segment/$SegmentPanel.module.scss`

```scss
.back {
  font-size: 13px;
  color: var(--muted);
}

.panel {
  display: grid;
  gap: 20px;
  padding: 24px 0;
}
```

## File 4: `src/app/api/$segment/route.ts`

```ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // TODO: validate params and call into src/lib/.
  return NextResponse.json({ ok: true, segment: "$segment" });
}
```

## Cleanup

If `src/app/$segment/placeholder.module.scss` exists, delete it after writing the four files — it was a staged placeholder we just replaced. Use the Bash tool: `rm src/app/$segment/placeholder.module.scss`.

## Verify

Run `npm run build` to confirm the route compiles cleanly. The route handler intentionally returns a stub `{ ok: true }` — connecting it to NASA (via `src/lib/nasa.ts` and `nasaApiKey()` from `src/lib/env.ts`) is the next ticket.

Do NOT pre-build complex UI — leave the panel body empty so the live demo can fill it in.
