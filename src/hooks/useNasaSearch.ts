"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaType } from "@/constants/nasa";
import type { NasaSearchItem } from "@/lib/nasa";
import { useDebounce } from "@/hooks/useDebounce";

export interface NasaSearchFilters {
  q: string;
  mediaType?: MediaType;
  yearStart?: string;
  yearEnd?: string;
}

export interface NasaSearchState {
  items: NasaSearchItem[];
  totalHits: number;
  loading: boolean;
  error?: string;
}

export function useNasaSearch(filters: NasaSearchFilters): NasaSearchState {
  const debounced = useDebounce(filters, 350);
  const [state, setState] = useState<NasaSearchState>({
    items: [],
    totalHits: 0,
    loading: false,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debounced.q.trim()) return;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const params = new URLSearchParams({ q: debounced.q.trim() });
    if (debounced.mediaType) params.set("mediaType", debounced.mediaType);
    if (debounced.yearStart) params.set("yearStart", debounced.yearStart);
    if (debounced.yearEnd) params.set("yearEnd", debounced.yearEnd);

    // Sync the loading flag with the in-flight fetch (the external system this
    // effect is synchronizing with) — the rule's cascading-render concern does
    // not apply to a single flip immediately before the network call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({ ...s, loading: true, error: undefined }));

    fetch(`/api/nasa-search?${params.toString()}`, { signal: ctrl.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        return (await res.json()) as { items: NasaSearchItem[]; totalHits: number };
      })
      .then((data) => setState({ items: data.items, totalHits: data.totalHits, loading: false }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ items: [], totalHits: 0, loading: false, error: message });
      });

    return () => ctrl.abort();
  }, [debounced.q, debounced.mediaType, debounced.yearStart, debounced.yearEnd]);

  // Empty-query state is derived, not stored — avoids the
  // react-hooks/set-state-in-effect cascading-render warning.
  if (!debounced.q.trim()) {
    return { items: [], totalHits: 0, loading: false };
  }

  return state;
}
