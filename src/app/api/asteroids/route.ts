// Stub — fleshed out during the Part 2 live demo (Epic 3).
// Will wrap https://api.nasa.gov/neo/rest/v1/feed, attaching NASA_API_KEY server-side.
//
// import { NextResponse } from "next/server";
// import { getAsteroids } from "@/lib/nasa";
// import { nasaApiKey } from "@/lib/env";
//
// export async function GET(request: Request) { ... }

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "not implemented — Part 2 live demo target. See documents/EPICS_E3.md." },
    { status: 501 },
  );
}
