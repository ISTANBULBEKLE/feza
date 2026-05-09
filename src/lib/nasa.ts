import { APOD_BASE, IMAGE_LIBRARY_BASE, NEO_BASE, type MediaType } from "@/constants/nasa";

// ──────────────────────────────────────────────────────────────────────────────
// NASA Image Library — https://images-api.nasa.gov/search
// ──────────────────────────────────────────────────────────────────────────────

export interface NasaSearchItem {
  nasaId: string;
  title: string;
  description: string;
  center: string;
  dateCreated: string;
  mediaType: MediaType;
  thumbnail?: string;
  detailHref: string;
}

export interface NasaSearchResult {
  items: NasaSearchItem[];
  totalHits: number;
}

interface RawCollectionItem {
  href: string;
  data: Array<{
    nasa_id: string;
    title: string;
    description?: string;
    center?: string;
    date_created: string;
    media_type: MediaType;
  }>;
  links?: Array<{ href: string; rel?: string; render?: string }>;
}

interface RawSearchResponse {
  collection: {
    items: RawCollectionItem[];
    metadata?: { total_hits: number };
  };
}

export interface SearchImagesParams {
  q: string;
  mediaType?: MediaType;
  yearStart?: string;
  yearEnd?: string;
  pageSize?: number;
  signal?: AbortSignal;
}

export async function searchImages(params: SearchImagesParams): Promise<NasaSearchResult> {
  const url = new URL("/search", IMAGE_LIBRARY_BASE);
  url.searchParams.set("q", params.q);
  if (params.mediaType) url.searchParams.set("media_type", params.mediaType);
  if (params.yearStart) url.searchParams.set("year_start", params.yearStart);
  if (params.yearEnd) url.searchParams.set("year_end", params.yearEnd);
  if (params.pageSize) url.searchParams.set("page_size", String(params.pageSize));

  const res = await fetch(url, { signal: params.signal });
  if (!res.ok) {
    throw new Error(`NASA Image Library returned ${res.status}`);
  }

  const raw = (await res.json()) as RawSearchResponse;
  const items: NasaSearchItem[] = (raw.collection?.items ?? []).map((it) => {
    const meta = it.data[0];
    const preview = it.links?.find((l) => l.rel === "preview" && l.render === "image");
    return {
      nasaId: meta.nasa_id,
      title: meta.title,
      description: meta.description ?? "",
      center: meta.center ?? "",
      dateCreated: meta.date_created,
      mediaType: meta.media_type,
      thumbnail: preview?.href,
      detailHref: it.href,
    };
  });

  return { items, totalHits: raw.collection?.metadata?.total_hits ?? items.length };
}

// ──────────────────────────────────────────────────────────────────────────────
// APOD — https://api.nasa.gov/planetary/apod (live-coded on stage; signature
// shipped now so Epic 1 can compile before Epic 2 is fleshed out)
// ──────────────────────────────────────────────────────────────────────────────

export interface ApodItem {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: "image" | "video";
  copyright?: string;
}

export interface GetApodParams {
  apiKey: string;
  date?: string;
  count?: number;
  signal?: AbortSignal;
}

export async function getApod(params: GetApodParams): Promise<ApodItem | ApodItem[]> {
  const url = new URL(APOD_BASE);
  url.searchParams.set("api_key", params.apiKey);
  if (params.date) url.searchParams.set("date", params.date);
  if (params.count) url.searchParams.set("count", String(params.count));
  url.searchParams.set("thumbs", "true");

  const res = await fetch(url, { signal: params.signal });
  if (!res.ok) {
    throw new Error(`NASA APOD returned ${res.status}`);
  }
  return res.json();
}

// ──────────────────────────────────────────────────────────────────────────────
// NeoWs (Near-Earth Objects) — https://api.nasa.gov/neo/rest/v1/feed
// Live-coded in Part 2 (Epic 3). Signature shipped now so the placeholder
// route handler at src/app/api/asteroids/route.ts can compile.
// ──────────────────────────────────────────────────────────────────────────────

export interface AsteroidItem {
  id: string;
  name: string;
  closeApproachDate: string;
  estimatedDiameterKmMin: number;
  estimatedDiameterKmMax: number;
  missDistanceKm: string;
  relativeVelocityKps: string;
  isPotentiallyHazardous: boolean;
  nasaJplUrl: string;
}

export interface AsteroidsResult {
  items: AsteroidItem[];
  elementCount: number;
}

export interface GetAsteroidsParams {
  apiKey: string;
  startDate: string;
  endDate?: string;
  signal?: AbortSignal;
}

export async function getAsteroids(_params: GetAsteroidsParams): Promise<AsteroidsResult> {
  // Stub — body is filled in live during Part 2 (E3-T2). Will hit
  // `${NEO_BASE}/feed?start_date=...&end_date=...&api_key=...`, then map
  // raw `near_earth_objects[date][]` into the flat AsteroidItem above.
  void NEO_BASE;
  throw new Error("getAsteroids — not implemented (Part 2 / E3-T2)");
}
