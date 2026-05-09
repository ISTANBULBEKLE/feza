import styles from "./placeholder.module.scss";

export const metadata = {
  title: "Asteroids · feza",
  description: "Near-Earth Objects browser — live-coded on stage in Part 2.",
};

// ─── LIVE-DEMO TARGET (Part 2) ───────────────────────────────────────────────
//
// This page is intentionally a placeholder.
//
// On stage we will:
//   1. /atlassian:search-company-knowledge KAN-2 → reads Epic 3 from Jira
//   2. claude.ai/design → prototype the page, hand off to Claude Code
//   3. /feza-from-jira KAN-8 → dispatches /feza-route asteroids
//   4. /feza-from-jira KAN-7 → dispatches /feza-component DateRangePicker
//   5. /feza-from-jira KAN-6 → fills in getAsteroids body in src/lib/nasa.ts
//   6. push branch → 4 GitHub workflows post checks
//
// Demo runbook in documents/EPIC_3_TICKETS.md.
// Full spec in documents/EPICS_E3.md.
// ─────────────────────────────────────────────────────────────────────────────

export default function AsteroidsPage() {
  return (
    <main>
      <div className={styles.wrap}>
        <span className={styles.tag}>Epic 3 · Part 2 live demo target</span>
        <h1 className={`${styles.title} fz-shine`}>Near-Earth Objects</h1>
        <p className={styles.lead}>
          We will build this together on stage starting from a Confluence spec, via
          Jira tickets, through <code>claude.ai/design</code>, and out to a PR — using
          the <code>atlassian</code> MCP, <code>/feza-from-jira</code>, and the existing
          scaffold skills.
        </p>
        <ol className={styles.steps}>
          <li><code>/atlassian:search-company-knowledge KAN-2</code> → reads Epic 3 from Jira</li>
          <li><code>claude.ai/design</code> → prototype, hand off to Claude Code</li>
          <li><code>/feza-from-jira KAN-8</code> → scaffold the page</li>
          <li><code>/feza-from-jira KAN-7</code> → scaffold DateRangePicker</li>
          <li><code>/feza-from-jira KAN-6</code> → fill in getAsteroids lib body</li>
          <li>Push, watch 4 GitHub workflows, merge</li>
        </ol>
      </div>
    </main>
  );
}
