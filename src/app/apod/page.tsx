import styles from "./placeholder.module.scss";

export const metadata = {
  title: "APOD · feza",
  description: "Astronomy Picture of the Day — live-coded on stage.",
};

// ─── LIVE-DEMO TARGET ────────────────────────────────────────────────────────
//
// This page is intentionally a placeholder.
//
// On stage we will:
//   1. /feza-route apod      → scaffold page + route handler from the Epic 1 pattern
//   2. /feza-component DatePicker
//   3. wire date OR count selectors
//   4. reuse <PhotoGrid> from Epic 1 (with media_type === "video" handling)
//   5. push branch → GitHub Actions runs the 4 gates → @claude review → merge
//
// Design hand-off: design-handoff/epic-2/README.md (markdown spec) +
//                  design-handoff/epic-2/preview.standalone.html (visual ref).
// Reference impl spec: documents/PROJECT_PLAN.md → "Phase 2 — Epic 2".
// ─────────────────────────────────────────────────────────────────────────────

export default function ApodPage() {
  return (
    <main>
      <div className={styles.wrap}>
        <span className={styles.tag}>Epic 2 · live demo target</span>
        <h1 className={`${styles.title} fz-shine`}>Astronomy Picture of the Day</h1>
        <p className={styles.lead}>
          We will build this together on stage using <code>/feza-route</code> and{" "}
          <code>/feza-component</code> skills, the local{" "}
          <code>design-handoff/epic-2/</code> contract, and a Claude PR review
          summoned from the GitHub Action.
        </p>
        <ol className={styles.steps}>
          <li>Scaffold page + route handler with <code>/feza-route apod</code></li>
          <li>Add <code>getApod()</code> to <code>src/lib/nasa.ts</code></li>
          <li>Generate <code>DatePicker</code> via <code>/feza-component DatePicker</code></li>
          <li>Wire date OR count selector + reuse <code>PhotoGrid</code></li>
          <li>Push, watch Claude review the PR on GitHub</li>
        </ol>
      </div>
    </main>
  );
}
