"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";
import { ROUTES } from "@/constants/routes";
import { cx } from "@/helpers/classNames";

const NAV_LINKS = [
  { href: ROUTES.explore, label: "Explore" },
  { href: ROUTES.apod, label: "APOD" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link href={ROUTES.home} className={styles.brand} aria-label="feza · home">
          <span className={styles.brandMark} aria-hidden>✦</span>
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
