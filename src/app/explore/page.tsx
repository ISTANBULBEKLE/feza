import { ExplorePanel } from "./ExplorePanel";
import styles from "./ExplorePanel.module.scss";

export const metadata = {
  title: "Explore · feza",
  description: "Search the NASA Image Library by topic, media type, and year range.",
};

type SearchParamValue = string | string[] | undefined;

interface ExplorePageProps {
  searchParams: Promise<Record<string, SearchParamValue>>;
}

function pickString(v: SearchParamValue): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const sp = await searchParams;
  const initial = {
    q: pickString(sp.q),
    mediaType: pickString(sp.mediaType),
    yearStart: pickString(sp.yearStart),
    yearEnd: pickString(sp.yearEnd),
  };

  return (
    <main>
      <header className={styles.header}>
        <h1 className="fz-shine">Explore the NASA Image Library</h1>
        <p>
          Type a topic or pick a preset, then narrow by media type and year range.
          Results stream from
          <code> images-api.nasa.gov</code> via our own Route Handler.
        </p>
      </header>
      <ExplorePanel initial={initial} />
    </main>
  );
}
