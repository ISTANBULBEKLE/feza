"use client";

import { type ChangeEvent, type ReactNode } from "react";
import styles from "./Select.module.scss";
import { cx } from "@/helpers/classNames";

export interface SelectOption<V extends string = string> {
  label: string;
  value: V;
}

export interface SelectProps<V extends string = string> {
  id: string;
  label: ReactNode;
  value: V | "";
  options: ReadonlyArray<SelectOption<V>>;
  onChange: (value: V | "") => void;
  placeholder?: string;
  className?: string;
  ariaDescribedBy?: string;
}

export function Select<V extends string = string>(props: SelectProps<V>) {
  const { id, label, value, options, onChange, placeholder, className, ariaDescribedBy } = props;

  function handleChange(e: ChangeEvent<HTMLSelectElement>) {
    onChange(e.target.value as V | "");
  }

  return (
    <label htmlFor={id} className={cx(styles.field, className)}>
      <span className={styles.label}>{label}</span>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={handleChange}
        aria-describedby={ariaDescribedBy}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
