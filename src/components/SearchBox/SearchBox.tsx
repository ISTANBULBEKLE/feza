"use client";

import { type ChangeEvent, type ReactNode } from "react";
import styles from "./SearchBox.module.scss";
import { cx } from "@/helpers/classNames";

export interface SearchBoxProps {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBox({
  id,
  label,
  value,
  onChange,
  placeholder,
  className,
  autoFocus,
}: SearchBoxProps) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return (
    <label htmlFor={id} className={cx(styles.field, className)}>
      <span className={styles.label}>{label}</span>
      <div className={styles.inputWrap}>
        <span className={styles.icon} aria-hidden>⌕</span>
        <input
          id={id}
          type="search"
          className={styles.input}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
        />
        {value ? (
          <button
            type="button"
            className={styles.clear}
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}
      </div>
    </label>
  );
}
