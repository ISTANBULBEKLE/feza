"use client";

import { useMemo, useState } from "react";
import styles from "./ExplorePanel.module.scss";
import { Select } from "@/components/Select/Select";
import { Button } from "@/components/Button/Button";
import { PhotoGrid } from "@/components/PhotoGrid/PhotoGrid";
import {
  MEDIA_TYPES,
  TOPIC_PRESETS,
  YEAR_OPTIONS,
  type MediaType,
} from "@/constants/nasa";
import { useNasaSearch } from "@/hooks/useNasaSearch";

const DEFAULT_TOPIC = TOPIC_PRESETS[0].value;

export function ExplorePanel() {
  const [topic, setTopic] = useState<string>(DEFAULT_TOPIC);
  const [mediaType, setMediaType] = useState<MediaType | "">("image");
  const [yearStart, setYearStart] = useState<string>("");
  const [yearEnd, setYearEnd] = useState<string>("");

  const filters = useMemo(
    () => ({
      q: topic,
      mediaType: mediaType || undefined,
      yearStart: yearStart || undefined,
      yearEnd: yearEnd || undefined,
    }),
    [topic, mediaType, yearStart, yearEnd],
  );

  const { items, totalHits, loading, error } = useNasaSearch(filters);

  return (
    <section className={styles.panel} aria-busy={loading}>
      <div className={styles.controls}>
        <Select
          id="topic"
          label="Topic"
          value={topic}
          options={TOPIC_PRESETS.map((p) => ({ label: p.label, value: p.value }))}
          onChange={(v) => setTopic(v || DEFAULT_TOPIC)}
        />
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
          options={YEAR_OPTIONS}
          onChange={setYearStart}
          placeholder="Earliest"
        />
        <Select
          id="year-end"
          label="Year to"
          value={yearEnd}
          options={YEAR_OPTIONS}
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
        {loading ? (
          <span>Searching…</span>
        ) : error ? (
          <span className={styles.error}>{error}</span>
        ) : (
          <span>
            {items.length} of {totalHits.toLocaleString()} results
          </span>
        )}
      </div>

      <PhotoGrid items={items} emptyMessage={loading ? "" : "No results — try a different filter."} />
    </section>
  );
}
