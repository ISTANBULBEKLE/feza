/* Three feza screens, each rendered inside its own DCArtboard */

const fezaTopics = [
  { label: "Mars Rover", value: "mars rover" },
  { label: "Apollo Missions", value: "apollo" },
  { label: "Hubble", value: "hubble" },
  { label: "James Webb (JWST)", value: "james webb" },
  { label: "ISS", value: "international space station" },
  { label: "Earth from Orbit", value: "earth from orbit" },
];

const sampleResults = [
  {
    title: "Pillars of Creation — JWST NIRCam",
    meta: "GSFC · 19 Oct 2022",
    desc: "Webb's near-infrared view of the Eagle Nebula's iconic dust pillars, dotted with newly forming stars peeking through the clouds.",
    src: "https://images-assets.nasa.gov/image/PIA23405/PIA23405~medium.jpg",
    kind: "image",
  },
  {
    title: "Curiosity self-portrait at Mont Mercou",
    meta: "JPL · 26 Mar 2021",
    desc: "Mosaic of 60 images taken by the rover's MAHLI camera at the base of a six-meter-tall outcrop in Gale Crater.",
    src: "https://images-assets.nasa.gov/image/PIA24430/PIA24430~medium.jpg",
    kind: "image",
  },
  {
    title: "Earth from the Cupola, Expedition 70",
    meta: "ISS · 14 Feb 2024",
    desc: "View of the Mediterranean coastline at sunrise, taken from the seven-window observatory module of the International Space Station.",
    src: "https://images-assets.nasa.gov/image/iss070e027389/iss070e027389~medium.jpg",
    kind: "image",
  },
  {
    title: "Apollo 11 — Buzz Aldrin on the Moon",
    meta: "JSC · 20 Jul 1969",
    desc: "Astronaut Buzz Aldrin photographed by Neil Armstrong on the lunar surface during the first crewed Moon landing.",
    src: "https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg",
    kind: "image",
  },
  { title: "Hubble Deep Field — repurposed audio tour", meta: "GSFC · 11 Jan 2018", desc: "Sonification of the famous Hubble Deep Field released as part of NASA's accessibility outreach programme.", kind: "audio" },
  {
    title: "Saturn — Cassini final orbits",
    meta: "JPL · 28 Aug 2017",
    desc: "Composite of Saturn's northern hemisphere captured during Cassini's Grand Finale dives between the planet and its rings.",
    src: "https://images-assets.nasa.gov/image/PIA21046/PIA21046~medium.jpg",
    kind: "image",
  },
];

/* ───────── Screen 1: Home ───────── */
const HomeScreen = () => (
  <div className="fz-page">
    <Header active="home" />
    <main className="fz-main">
      <section className="fz-hero">
        <div className="fz-eyebrow">feza · live demo app</div>
        <h1 className="fz-display">Explore the universe with NASA + Claude Code</h1>
        <p className="fz-lede">Three user journeys showcasing Claude Code, CLAUDE.md, Skills, MCP, and Claude Desktop in everyday dev work.</p>
      </section>
      <section className="fz-landing-cards">
        <a className="fz-landing-card" href="#">
          <span className="fz-landing-card__tag">Epic 1 · Pre-built</span>
          <h2 className="fz-landing-card__title">Explore NASA Image Library</h2>
          <p className="fz-landing-card__body">Topic preset + media type + year range filters. Card grid of NASA images.</p>
        </a>
        <a className="fz-landing-card is-target" href="#">
          <span className="fz-landing-card__tag">Epic 2 · Live-coded</span>
          <h2 className="fz-landing-card__title">Astronomy Picture of the Day</h2>
          <p className="fz-landing-card__body">Date picker or random count → image/video card list. We build this on stage.</p>
        </a>
        <a className="fz-landing-card" href="#">
          <span className="fz-landing-card__tag">Epic 3 · Near-Earth Objects</span>
          <h2 className="fz-landing-card__title">Asteroids close approach</h2>
          <p className="fz-landing-card__body">Date-range feed from NeoWs with hazard flags, miss distance, velocity, and magnitude.</p>
        </a>
      </section>
    </main>
    <Footer/>
  </div>
);

/* ───────── Screen 2: Explore (interactive) ───────── */
const ExploreScreen = () => {
  const [q, setQ] = React.useState("international");
  const [topic, setTopic] = React.useState("international space station");
  const [media, setMedia] = React.useState("image");
  const [yearFrom, setYearFrom] = React.useState("");
  const [yearTo, setYearTo] = React.useState("");

  const allYears = [{label: "Earliest", value: ""}, ...Array.from({length: 30}, (_, i) => {
    const y = 2025 - i;
    return { label: String(y), value: String(y) };
  })];
  const allYearsTo = [{label: "Latest", value: ""}, ...Array.from({length: 30}, (_, i) => {
    const y = 2025 - i;
    return { label: String(y), value: String(y) };
  })];

  const results = React.useMemo(() => {
    let r = sampleResults;
    if (media === "image") r = r.filter(x => x.kind === "image");
    if (media === "video") r = r.filter(x => x.kind === "video");
    if (media === "audio") r = r.filter(x => x.kind === "audio");
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      r = r.filter(x => (x.title + " " + (x.desc || "")).toLowerCase().includes(t));
    }
    return r;
  }, [q, media]);

  const reset = () => { setQ(""); setTopic(""); setMedia("all"); setYearFrom(""); setYearTo(""); };

  return (
    <div className="fz-page">
      <Header active="explore"/>
      <main className="fz-main">
        <header className="fz-explore-header">
          <h1>Explore the NASA Image Library</h1>
          <p>Type a topic or pick a preset, then narrow by media type and year range. Results stream from <code>images-api.nasa.gov</code> via our own Route Handler.</p>
        </header>
        <section className="fz-panel">
          <SearchBox value={q} onChange={(v) => { setQ(v); setTopic(""); }} onClear={() => setQ("")} />
          <PresetChips items={fezaTopics} active={topic} onPick={(v) => { setTopic(v); setQ(v); }} />
          <div className="fz-controls">
            <Select label="Media type" value={media} onChange={setMedia} options={[
              {label: "All", value: "all"},
              {label: "Image", value: "image"},
              {label: "Video", value: "video"},
              {label: "Audio", value: "audio"},
            ]}/>
            <Select label="Year from" value={yearFrom} onChange={setYearFrom} options={allYears}/>
            <Select label="Year to" value={yearTo} onChange={setYearTo} options={allYearsTo}/>
            <div className="fz-actions"><Button variant="ghost" onClick={reset}>Reset</Button></div>
          </div>
          <div className="fz-status">{results.length} of {sampleResults.length} results</div>
          <div className="fz-grid">
            {results.map((r, i) => <PhotoCard key={i} {...r}/>)}
            {results.length < 3 ? <SkeletonCard/> : null}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

/* ───────── Screen 3: APOD (live-coded designed view) ───────── */
const apodFeed = [
  {
    title: "NGC 7331 and Beyond",
    date: "2026-05-07",
    copyright: "Adam Block",
    src: "https://apod.nasa.gov/apod/image/2305/NGC7331_Block_2530.jpg",
    explanation: "Big, beautiful spiral galaxy NGC 7331 is often touted as an analog to our own Milky Way. About 50 million light-years distant in the northern constellation Pegasus, NGC 7331 was recognized early on as a spiral nebula and is actually one of the brighter galaxies not included in Charles Messier's famous 18th century catalog.",
    kind: "image",
  },
  {
    title: "Stereo Jupiter near Opposition",
    date: "2026-05-06",
    copyright: "Damian Peach",
    src: "https://apod.nasa.gov/apod/image/2311/Jupiter_Peach_960.jpg",
    explanation: "Jupiter looks sharp in these two recent telescopic images. Captured on November 17 from Selsey, UK, they belong to a stereo pair showing the planet and its complex banded atmosphere in detail.",
    kind: "image",
  },
  {
    title: "Comet Tsuchinshan-ATLAS over Bishop",
    date: "2026-05-05",
    copyright: "Jeff Sullivan",
    src: "https://apod.nasa.gov/apod/image/2410/CometTsuchinshanATLAS_Sullivan_960.jpg",
    explanation: "What's that long streak across the sky? A comet tail. Specifically, it's the dust tail of Comet Tsuchinshan-ATLAS, which passed near the Sun last week and is now becoming visible in the early evening sky in the northern hemisphere.",
    kind: "image",
  },
  {
    title: "Perseid Meteors over the Pyrenees",
    date: "2026-05-04",
    copyright: "Public domain",
    src: "https://apod.nasa.gov/apod/image/2208/PerseidsPyrenees_Spinelli_960.jpg",
    explanation: "From a height of 100 kilometers, non-existent Persids streak through the Earth's atmosphere as small bits cast off from Comet Swift-Tuttle.",
    kind: "image",
  },
];

const ApodScreen = () => {
  const [mode, setMode] = React.useState("date");
  const [date, setDate] = React.useState("2026-05-07");
  const [count, setCount] = React.useState(4);
  const [picked, setPicked] = React.useState(0);

  const list = mode === "date" ? apodFeed.slice(0, 1) : apodFeed.slice(0, Math.max(1, Math.min(count, apodFeed.length)));
  const featured = list[Math.min(picked, list.length - 1)];

  return (
    <div className="fz-page">
      <Header active="apod"/>
      <main className="fz-main">
        <header className="fz-apod-header">
          <span className="fz-tag">Epic 2 · Astronomy Picture of the Day</span>
          <h1>{featured.title}</h1>
          <p className="fz-apod-meta">{new Date(featured.date).toLocaleDateString("en-GB", {day: "numeric", month: "long", year: "numeric"})} · © {featured.copyright}</p>
        </header>

        <section className="fz-apod-feature">
          <div className="fz-apod-feature__media">
            <img src={featured.src} alt={featured.title}
              onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.classList.add("is-empty"); }}/>
            <div className="fz-apod-feature__placeholder">
              <span>{featured.kind.toUpperCase()}</span>
            </div>
          </div>
          <div className="fz-apod-feature__body">
            <p>{featured.explanation}</p>
          </div>
        </section>

        <section className="fz-panel fz-apod-panel">
          <div className="fz-apod-mode">
            <button className={`fz-apod-mode__btn ${mode === "date" ? "is-active" : ""}`} onClick={() => setMode("date")}>By date</button>
            <button className={`fz-apod-mode__btn ${mode === "random" ? "is-active" : ""}`} onClick={() => setMode("random")}>Random count</button>
          </div>
          <div className="fz-controls fz-controls--apod">
            {mode === "date" ? (
              <label className="fz-field">
                <span className="fz-field__label">Date</span>
                <input className="fz-input fz-input--solo" type="date" value={date} onChange={(e) => setDate(e.target.value)}/>
              </label>
            ) : (
              <label className="fz-field">
                <span className="fz-field__label">How many ({count})</span>
                <input className="fz-range" type="range" min="1" max="4" value={count} onChange={(e) => setCount(Number(e.target.value))}/>
              </label>
            )}
            <div className="fz-actions"><Button variant="primary">Fetch</Button></div>
          </div>
          <div className="fz-status">Showing {list.length} of {apodFeed.length}</div>
          <div className="fz-grid">
            {list.map((r, i) => (
              <div key={i} onClick={() => setPicked(i)} style={{cursor: "pointer"}}>
                <PhotoCard
                  title={r.title}
                  meta={new Date(r.date).toLocaleDateString("en-GB", {day: "numeric", month: "short", year: "numeric"}) + " · © " + r.copyright}
                  desc={r.explanation}
                  src={r.src}
                  kind={r.kind}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

Object.assign(window, { HomeScreen, ExploreScreen, ApodScreen });
