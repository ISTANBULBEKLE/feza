import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>feza · live demo app</span>
        <h1 className={styles.title}>Explore the universe with NASA + Claude Code</h1>
        <p className={styles.subtitle}>
          Two tiny user journeys to showcase Claude Code, CLAUDE.md, Skills, MCP,
          and Claude Desktop in everyday dev work.
        </p>
      </section>

      <section className={styles.cards}>
        <Link href="/explore" className={styles.card}>
          <span className={styles.cardTag}>Epic 1 · pre-built</span>
          <h2 className={styles.cardTitle}>Explore NASA Image Library</h2>
          <p className={styles.cardBody}>
            Topic preset + media type + year range filters. Card grid of NASA images.
          </p>
        </Link>

        <Link href="/apod" className={styles.card}>
          <span className={styles.cardTag}>Epic 2 · live-coded</span>
          <h2 className={styles.cardTitle}>Astronomy Picture of the Day</h2>
          <p className={styles.cardBody}>
            Date picker or random count → image/video card list. We build this on stage.
          </p>
        </Link>
      </section>

      <p className={styles.footer}>
        Built with Next.js 16 · SCSS modules · Vitest · Claude Code skills.
      </p>
    </main>
  );
}
