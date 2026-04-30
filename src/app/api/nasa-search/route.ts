import { NextResponse } from "next/server";
import { searchImages } from "@/lib/nasa";
import type { MediaType } from "@/constants/nasa";

const VALID_MEDIA: ReadonlySet<MediaType> = new Set(["image", "video", "audio"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) {
    return NextResponse.json({ error: "missing query 'q'" }, { status: 400 });
  }

  const mediaParam = searchParams.get("mediaType") ?? undefined;
  const mediaType =
    mediaParam && VALID_MEDIA.has(mediaParam as MediaType) ? (mediaParam as MediaType) : undefined;

  try {
    const result = await searchImages({
      q,
      mediaType,
      yearStart: searchParams.get("yearStart") ?? undefined,
      yearEnd: searchParams.get("yearEnd") ?? undefined,
      pageSize: 24,
    });
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
