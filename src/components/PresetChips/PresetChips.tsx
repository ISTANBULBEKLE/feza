"use client";

import styles from "./PresetChips.module.scss";
import { cx } from "@/helpers/classNames";

export interface PresetChipsProps {
  presets: ReadonlyArray<{ label: string; value: string }>;
  active?: string;
  onSelect: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function PresetChips({
  presets,
  active,
  onSelect,
  className,
  ariaLabel = "Topic presets",
}: PresetChipsProps) {
  return (
    <div className={cx(styles.row, className)} role="group" aria-label={ariaLabel}>
      {presets.map((p) => {
        const isActive = active === p.value;
        return (
          <button
            key={p.value}
            type="button"
            className={cx(styles.chip, isActive && styles.active)}
            onClick={() => onSelect(p.value)}
            aria-pressed={isActive}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
