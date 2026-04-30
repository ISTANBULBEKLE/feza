import { type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Button.module.scss";
import { cx } from "@/helpers/classNames";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(styles.btn, styles[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
}
