import styles from "./PhotoGrid.module.scss";
import { PhotoCard } from "@/components/PhotoCard/PhotoCard";
import type { NasaSearchItem } from "@/lib/nasa";

export interface PhotoGridProps {
  items: NasaSearchItem[];
  emptyMessage?: string;
}

export function PhotoGrid({ items, emptyMessage = "No results yet." }: PhotoGridProps) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }
  return (
    <div className={styles.grid} role="list">
      {items.map((item) => (
        <div role="listitem" key={item.nasaId}>
          <PhotoCard item={item} />
        </div>
      ))}
    </div>
  );
}
