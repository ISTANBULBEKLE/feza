import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <span className={styles.eyebrow}>feza · live demo app</span>
        <h1 className={`${styles.title} fz-shine`}>Explore the universe with NASA + Claude Code</h1>
        <p className={styles.subtitle}>
          Three tiny user journeys to showcase Claude Code, CLAUDE.md, Skills, MCP,
          Claude Design, and Atlassian (Jira + Confluence) in everyday dev work.
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
          <span className={styles.cardTag}>Epic 2 · live-coded · Part 1</span>
          <h2 className={styles.cardTitle}>Astronomy Picture of the Day</h2>
          <p className={styles.cardBody}>
            Date picker or random count → image/video card list. We build this on stage.
          </p>
        </Link>

        <Link href="/asteroids" className={styles.card}>
          <span className={styles.cardTag}>Epic 3 · live-coded · Part 2</span>
          <h2 className={styles.cardTitle}>Near-Earth Objects</h2>
          <p className={styles.cardBody}>
            From Confluence spec → Jira tickets → Claude Design → Claude Code. Date-range
            picker + hazardous-pill cards.
          </p>
        </Link>
      </section>

    </main>
  );
}
