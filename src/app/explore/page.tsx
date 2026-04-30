import { ExplorePanel } from "./ExplorePanel";
import styles from "./ExplorePanel.module.scss";
import Link from "next/link";

export const metadata = {
  title: "Explore · feza",
  description: "Search the NASA Image Library by topic, media type, and year range.",
};

export default function ExplorePage() {
  return (
    <main>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>← feza</Link>
        <h1>Explore the NASA Image Library</h1>
        <p>
          Pick a topic preset, narrow by media type and year range. Results stream from
          <code> images-api.nasa.gov</code> via our own Route Handler.
        </p>
      </header>
      <ExplorePanel />
    </main>
  );
}
