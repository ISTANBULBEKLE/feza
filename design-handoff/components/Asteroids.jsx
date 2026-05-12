/* Asteroids landing — Epic 3 — /asteroids */

const asteroidData = [
  { name: "(2024 BC1)",      date: "2026-05-09", dia: "50–110 m",   miss: "3.2M km",   vel: "14.1 km/s", mag: "21.4", hazardous: false },
  { name: "Apophis (99942)", date: "2026-05-10", dia: "340 m",      miss: "31,000 km", vel: "7.4 km/s",  mag: "19.7", hazardous: true  },
  { name: "(2025 GH3)",      date: "2026-05-11", dia: "18–40 m",    miss: "1.1M km",   vel: "9.8 km/s",  mag: "23.1", hazardous: false },
  { name: "(2026 KN5)",      date: "2026-05-12", dia: "120–270 m",  miss: "4.7M km",   vel: "12.3 km/s", mag: "20.8", hazardous: false },
  { name: "Bennu (101955)",  date: "2026-05-13", dia: "490 m",      miss: "750,000 km",vel: "6.1 km/s",  mag: "20.4", hazardous: true  },
  { name: "(2026 MM2)",      date: "2026-05-15", dia: "25–55 m",    miss: "2.4M km",   vel: "11.0 km/s", mag: "22.5", hazardous: false },
];

const HazardousPill = () => (
  <span className="fz-pill fz-pill--danger">Potentially Hazardous</span>
);

const AsteroidCard = ({ a }) => (
  <article className="fz-ast">
    <div className="fz-ast__head">
      <h3 className="fz-ast__name">{a.name}</h3>
      {a.hazardous ? <HazardousPill/> : null}
    </div>
    <div className="fz-ast__meta">{new Date(a.date).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"})} · close approach</div>
    <dl className="fz-ast__stats">
      <dt>Diameter</dt><dd>{a.dia}</dd>
      <dt>Miss distance</dt><dd>{a.miss}</dd>
      <dt>Velocity</dt><dd>{a.vel}</dd>
      <dt>Magnitude</dt><dd>{a.mag}</dd>
    </dl>
    <a className="fz-ast__link" href="#">View on JPL →</a>
  </article>
);

const DateRangePicker = ({ start, end, onStart, onEnd, error }) => (
  <div className="fz-drp">
    <div className="fz-drp__row">
      <label className="fz-field">
        <span className="fz-field__label">Start</span>
        <input className="fz-input fz-input--solo" type="date" value={start} onChange={(e) => onStart && onStart(e.target.value)}/>
      </label>
      <label className="fz-field">
        <span className="fz-field__label">End</span>
        <input className="fz-input fz-input--solo" type="date" value={end} onChange={(e) => onEnd && onEnd(e.target.value)}/>
      </label>
    </div>
    <div className={"fz-drp__caption" + (error ? " is-error" : "")}>
      {error || "Max 7 days (NeoWs API limit)"}
    </div>
  </div>
);

const AsteroidsScreen = () => {
  const [start, setStart] = React.useState("2026-05-09");
  const [end, setEnd] = React.useState("2026-05-15");

  const clamp = (s, e) => {
    const ds = new Date(s), de = new Date(e);
    const max = new Date(ds); max.setDate(max.getDate() + 7);
    return de > max ? max.toISOString().slice(0, 10) : e;
  };
  const setStartSafe = (v) => { setStart(v); setEnd(clamp(v, end)); };
  const setEndSafe = (v) => setEnd(clamp(start, v));

  return (
    <div className="fz-page">
      <Header active="asteroids"/>
      <main className="fz-main">
        <header className="fz-explore-header">
          <span className="fz-tag">Epic 3 · Near-Earth Objects</span>
          <h1>Near-Earth Objects</h1>
          <p>Asteroids passing close to Earth in your selected window. Source: <code>NASA NeoWs feed</code>.</p>
        </header>
        <section className="fz-panel">
          <DateRangePicker start={start} end={end} onStart={setStartSafe} onEnd={setEndSafe}/>
          <div className="fz-status">{asteroidData.length} asteroids found · {start} → {end}</div>
          <div className="fz-grid fz-grid--ast">
            {asteroidData.map((a, i) => <AsteroidCard key={i} a={a}/>)}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

Object.assign(window, { AsteroidsScreen, AsteroidCard, HazardousPill, DateRangePicker });
