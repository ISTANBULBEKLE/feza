---
name: feza-route
description: Scaffold a Next.js 16 App Router route in feza — both src/app/<segment>/page.tsx (server) and a paired src/app/api/<segment>/route.ts handler. Use when the user asks to "scaffold a route", "create a page at /X", or names a new app route.
arguments: [segment]
---

Scaffold a route at `/$segment`.

Create exactly these files using the Write tool:

## File 1: `src/app/$segment/page.tsx`

```tsx
import Link from "next/link";
import styles from "./$segment.module.scss";

export const metadata = {
  title: "$segment · feza",
};

export default function ${segment}Page() {
  return (
    <main>
      <Link href="/" className={styles.back}>← feza</Link>
      <h1>$segment</h1>
      {/* Render the page body here. */}
    </main>
  );
}
```

## File 2: `src/app/$segment/$segment.module.scss`

```scss
.back {
  font-size: 13px;
  color: var(--muted);
}
```

## File 3: `src/app/api/$segment/route.ts`

```ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // TODO: validate params and call into src/lib/.
  return NextResponse.json({ ok: true, segment: "$segment" });
}
```

After writing, run `npm run build` to confirm the route compiles cleanly. If the segment name is multi-word (e.g. `solar-flares`), use the kebab-case form for the URL segment but PascalCase for the React component name (`SolarFlaresPage`).

Do NOT pre-build complex UI — leave a clear `// TODO:` for the page body so the live demo can fill it in.
