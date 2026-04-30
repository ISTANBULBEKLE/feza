// Next.js 16 Proxy (replaces middleware.ts). Runs on the Node.js runtime.
// Lightweight request logging — useful for the live demo so the audience
// can see traffic when the dev hits /explore or /apod.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") {
    const { method } = request;
    const { pathname, search } = request.nextUrl;
    // eslint-disable-next-line no-console
    console.log(`[proxy] ${method} ${pathname}${search}`);
  }
  return NextResponse.next();
}

export const config = {
  // Skip Next.js internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif)).*)"],
};
