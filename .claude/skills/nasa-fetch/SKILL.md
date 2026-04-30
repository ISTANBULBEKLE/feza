---
name: nasa-fetch
description: Add a typed NASA API wrapper to src/lib/nasa.ts and a Route Handler at src/app/api/<endpoint>/route.ts. Use when the user wants to integrate a new NASA endpoint into feza.
arguments: [endpoint, baseUrl]
---

Wrap a NASA endpoint named `$endpoint` (base URL: `$baseUrl`) into feza.

## Step 1 — Append a typed wrapper to `src/lib/nasa.ts`

```ts
export interface ${endpoint}Params {
  // TODO: fill in params based on the endpoint's documented query string.
  signal?: AbortSignal;
}

export interface ${endpoint}Result {
  // TODO: fill in based on the endpoint's documented response shape.
}

export async function get$endpoint(params: ${endpoint}Params): Promise<${endpoint}Result> {
  const url = new URL("$baseUrl");
  // TODO: url.searchParams.set(...) for each param.
  const res = await fetch(url, { signal: params.signal });
  if (!res.ok) throw new Error(`NASA $endpoint returned ${res.status}`);
  return res.json();
}
```

## Step 2 — Create `src/app/api/$endpoint/route.ts`

```ts
import { NextResponse } from "next/server";
import { get$endpoint } from "@/lib/nasa";
// import { nasaApiKey } from "@/lib/env";  // uncomment if the endpoint requires the API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  try {
    const result = await get$endpoint({
      // TODO: read params from searchParams and pass them through
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
```

## Step 3 — Verify

Run `npm run build` to ensure the route compiles. If the endpoint requires authentication, pass `apiKey: nasaApiKey()` from the route handler — never embed the key in the lib wrapper itself.

Do NOT call the endpoint from the client. Always go through the Route Handler.
