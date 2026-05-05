"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./ExplorePanel.module.scss";
import { Select } from "@/components/Select/Select";
import { Button } from "@/components/Button/Button";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { PresetChips } from "@/components/PresetChips/PresetChips";
import { SkeletonCard } from "@/components/SkeletonCard/SkeletonCard";
import { PhotoGrid } from "@/components/PhotoGrid/PhotoGrid";
import {
  MEDIA_TYPES,
  TOPIC_PRESETS,
  YEAR_OPTIONS,
  type MediaType,
} from "@/constants/nasa";
import { useNasaSearch } from "@/hooks/useNasaSearch";

const DEFAULT_TOPIC = TOPIC_PRESETS[0].value;
const SKELETON_COUNT = 8;

export interface ExplorePanelInitial {
  q?: string;
  mediaType?: string;
  yearStart?: string;
  yearEnd?: string;
}

export interface ExplorePanelProps {
  initial?: ExplorePanelInitial;
}

function normalizeMediaType(v: string | undefined): MediaType | "" {
  if (v === "image" || v === "video" || v === "audio") return v;
  return "image";
}

function filterYearOptions(
  options: typeof YEAR_OPTIONS,
  { min, max }: { min?: string; max?: string },
) {
  return options.filter((o) => {
    const year = Number(o.value);
    if (min && year < Number(min)) return false;
    if (max && year > Number(max)) return false;
    return true;
  });
}

export function ExplorePanel({ initial }: ExplorePanelProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  const [topic, setTopic] = useState<string>(initial?.q ?? DEFAULT_TOPIC);
  const [mediaType, setMediaType] = useState<MediaType | "">(
    normalizeMediaType(initial?.mediaType),
  );
  const [yearStart, setYearStart] = useState<string>(initial?.yearStart ?? "");
  const [yearEnd, setYearEnd] = useState<string>(initial?.yearEnd ?? "");

  const yearError = useMemo(() => {
    if (yearStart && yearEnd && Number(yearStart) > Number(yearEnd)) {
      return "Year from must be ≤ year to.";
    }
    return undefined;
  }, [yearStart, yearEnd]);

  const filters = useMemo(
    () => ({
      q: topic,
      mediaType: mediaType || undefined,
      yearStart: yearStart || undefined,
      yearEnd: yearEnd || undefined,
    }),
    [topic, mediaType, yearStart, yearEnd],
  );

  const safeFilters = yearError ? { ...filters, q: "" } : filters;
  const { items, totalHits, loading, error } = useNasaSearch(safeFilters);

  useEffect(() => {
    if (!router || !pathname) return;
    if (yearError) return;

    const params = new URLSearchParams();
    if (topic && topic !== DEFAULT_TOPIC) params.set("q", topic);
    if (mediaType && mediaType !== "image") params.set("mediaType", mediaType);
    if (yearStart) params.set("yearStart", yearStart);
    if (yearEnd) params.set("yearEnd", yearEnd);

    const qs = params.toString();
    const next = qs ? `${pathname}?${qs}` : pathname;
    const current = window.location.pathname + window.location.search;
    if (current === next) return;

    router.replace(next, { scroll: false });
  }, [topic, mediaType, yearStart, yearEnd, yearError, router, pathname]);

  const activePreset = TOPIC_PRESETS.find(
    (p) => p.value === topic.trim().toLowerCase(),
  )?.value;

  const yearStartOptions = useMemo(
    () => filterYearOptions(YEAR_OPTIONS, { max: yearEnd }),
    [yearEnd],
  );
  const yearEndOptions = useMemo(
    () => filterYearOptions(YEAR_OPTIONS, { min: yearStart }),
    [yearStart],
  );

  const hasTopic = !!topic.trim();
  const showSkeletons = loading && items.length === 0 && hasTopic;

  const statusMessage = (() => {
    if (yearError) return { type: "error", text: yearError } as const;
    if (!hasTopic)
      return {
        type: "info",
        text: "Type a topic or pick a preset to search.",
      } as const;
    if (loading) return { type: "info", text: "Searching…" } as const;
    if (error) return { type: "error", text: error } as const;
    return {
      type: "info",
      text: `${items.length} of ${totalHits.toLocaleString()} results`,
    } as const;
  })();

  const emptyMessage =
    !hasTopic || loading
      ? ""
      : "No results — try a different topic or filter.";

  return (
    <section className={styles.panel} aria-busy={loading}>
      <div className={styles.searchRow}>
        <SearchBox
          id="topic"
          label="Search NASA images"
          value={topic}
          onChange={setTopic}
          placeholder="e.g. saturn rings, perseverance landing, helix nebula…"
          autoFocus
        />
      </div>

      <PresetChips
        presets={TOPIC_PRESETS.map((p) => ({ label: p.label, value: p.value }))}
        active={activePreset}
        onSelect={(v) => setTopic(v)}
        ariaLabel="Topic presets"
        className={styles.chips}
      />

      <div className={styles.controls}>
        <Select
          id="media"
          label="Media type"
          value={mediaType}
          options={MEDIA_TYPES.map((m) => ({ label: m.label, value: m.value }))}
          onChange={(v) => setMediaType(v as MediaType | "")}
          placeholder="Any"
        />
        <Select
          id="year-start"
          label="Year from"
          value={yearStart}
          options={yearStartOptions}
          onChange={setYearStart}
          placeholder="Earliest"
        />
        <Select
          id="year-end"
          label="Year to"
          value={yearEnd}
          options={yearEndOptions}
          onChange={setYearEnd}
          placeholder="Latest"
        />
        <div className={styles.actions}>
          <Button
            variant="ghost"
            onClick={() => {
              setTopic(DEFAULT_TOPIC);
              setMediaType("image");
              setYearStart("");
              setYearEnd("");
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className={styles.statusRow} aria-live="polite">
        <span
          className={statusMessage.type === "error" ? styles.error : undefined}
        >
          {statusMessage.text}
        </span>
      </div>

      {showSkeletons ? (
        <div className={styles.grid} role="list" aria-label="Loading results">
          <SkeletonCard count={SKELETON_COUNT} />
        </div>
      ) : (
        <PhotoGrid items={items} emptyMessage={emptyMessage} />
      )}
    </section>
  );
}
