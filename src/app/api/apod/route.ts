// Stub — fleshed out during the live demo (Phase 2).
// Will wrap https://api.nasa.gov/planetary/apod, attaching NASA_API_KEY server-side.
//
// import { NextResponse } from "next/server";
// import { getApod } from "@/lib/nasa";
// import { nasaApiKey } from "@/lib/env";
//
// export async function GET(request: Request) { ... }

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "not implemented — live demo target. See PROJECT_PLAN.md → Epic 2." },
    { status: 501 },
  );
}
