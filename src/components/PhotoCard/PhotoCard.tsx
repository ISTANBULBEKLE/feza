import styles from "./PhotoCard.module.scss";
import { formatDate } from "@/helpers/formatDate";
import type { NasaSearchItem } from "@/lib/nasa";

export interface PhotoCardProps {
  item: NasaSearchItem;
}

export function PhotoCard({ item }: PhotoCardProps) {
  return (
    <article className={styles.card} aria-labelledby={`title-${item.nasaId}`}>
      <div className={styles.media}>
        {item.thumbnail ? (
          // Plain <img> on purpose — NASA serves S3 URLs that change daily
          // and remotePatterns config would need to allow * which is risky.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.thumbnail} alt={item.title} loading="lazy" />
        ) : (
          <div className={styles.fallback} aria-hidden>
            {item.mediaType.toUpperCase()}
          </div>
        )}
      </div>
      <div className={styles.body}>
        <h3 id={`title-${item.nasaId}`} className={styles.title}>
          {item.title}
        </h3>
        <p className={styles.meta}>
          <span>{item.center || "NASA"}</span>
          <span aria-hidden> · </span>
          <span>{formatDate(item.dateCreated)}</span>
        </p>
        {item.description ? <p className={styles.desc}>{item.description}</p> : null}
      </div>
    </article>
  );
}
