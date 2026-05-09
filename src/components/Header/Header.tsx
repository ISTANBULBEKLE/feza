"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import { ROUTES } from "@/constants/routes";
import { cx } from "@/helpers/classNames";

const NAV_LINKS = [
  { href: ROUTES.explore, label: "Explore" },
  { href: ROUTES.apod, label: "APOD" },
  { href: ROUTES.asteroids, label: "Asteroids" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link href={ROUTES.home} className={styles.brand} aria-label="feza · home">
          <svg
            className={styles.brandMark}
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden
            focusable="false"
          >
            <path
              d="M42 18 C 42 14 36 12 31 14 C 26 16 25 21 25 26 L 25 54"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 30 L 37 30"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="50" cy="16" r="4" fill="currentColor" />
          </svg>
          <span className={styles.brandText}>feza</span>
        </Link>
        <nav aria-label="Primary" className={styles.nav}>
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cx(styles.navLink, isActive && styles.active)}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
