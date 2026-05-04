import styles from "./SkeletonCard.module.scss";

export interface SkeletonCardProps {
  /** number of skeleton cards to render */
  count?: number;
}

/** Loading placeholder mirroring the shape of a PhotoCard. */
export function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.card} aria-hidden role="presentation" data-testid="skeleton-card">
          <div className={styles.media} />
          <div className={styles.body}>
            <div className={`${styles.line} ${styles.title}`} />
            <div className={`${styles.line} ${styles.meta}`} />
            <div className={`${styles.line} ${styles.desc}`} />
          </div>
        </div>
      ))}
    </>
  );
}
