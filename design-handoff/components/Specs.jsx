/* Component spec sheets for Epic 3 + Epic 2 atoms */

const SpecCanvas = ({ tag, title, children, width = 800 }) => (
  <div className="fz-spec-canvas">
    <div className="fz-spec-canvas__inner" style={{maxWidth: width}}>
      <span className="fz-tag">{tag}</span>
      <h1 className="fz-display fz-spec-canvas__h1">{title}</h1>
      <div className="fz-spec-canvas__stack">{children}</div>
    </div>
  </div>
);

const SpecVariant = ({ label, children }) => (
  <div className="fz-spec-variant">
    <div>{children}</div>
    <div className="fz-spec-variant__label">{label}</div>
  </div>
);

/* ── 1. AsteroidCard spec ── */
const AsteroidCardSpec = () => {
  const a1 = { name: "(2024 BC1)", date: "2026-05-09", dia: "50–110 m", miss: "3.2M km", vel: "14.1 km/s", mag: "21.4", hazardous: false };
  const a2 = { name: "Apophis (99942)", date: "2026-05-10", dia: "340 m", miss: "31,000 km", vel: "7.4 km/s", mag: "19.7", hazardous: true };
  return (
    <SpecCanvas tag="Component · AsteroidCard" title="AsteroidCard">
      <SpecVariant label="Default"><AsteroidCard a={a1}/></SpecVariant>
      <SpecVariant label="Hazardous — potentially hazardous pill"><AsteroidCard a={a2}/></SpecVariant>
      <SpecVariant label="Loading skeleton">
        <div className="fz-ast">
          <div className="fz-skel__line" style={{width:"100%"}}/>
          <div className="fz-skel__line" style={{width:"60%", marginTop:8}}/>
          <div className="fz-skel__line" style={{width:"40%", marginTop:8}}/>
        </div>
      </SpecVariant>
    </SpecCanvas>
  );
};

/* ── 2. DateRangePicker spec ── */
const DateRangePickerSpec = () => (
  <SpecCanvas tag="Component · DateRangePicker" title="DateRangePicker" width={600}>
    <SpecVariant label="Default">
      <DateRangePicker start="2026-05-09" end="2026-05-15"/>
    </SpecVariant>
    <SpecVariant label="Clamped — end > start + 7 days">
      <DateRangePicker start="2026-05-09" end="2026-05-16" error="End clamped to start + 7 days."/>
    </SpecVariant>
    <SpecVariant label="Empty">
      <DateRangePicker start="" end=""/>
    </SpecVariant>
  </SpecCanvas>
);

/* ── 3. DatePicker spec (Epic 2) ── */
const DatePicker = ({ value = "", disabled = false, placeholder }) => (
  <label className="fz-field" style={{maxWidth: 260}}>
    <span className="fz-field__label">Date</span>
    <input
      className="fz-input fz-input--solo"
      type="date"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={() => {}}
      style={disabled ? {opacity: 0.5} : null}
    />
  </label>
);

const DatePickerSpec = () => (
  <SpecCanvas tag="Component · DatePicker" title="DatePicker" width={480}>
    <SpecVariant label="Default"><DatePicker value="2026-05-09"/></SpecVariant>
    <SpecVariant label="Empty"><DatePicker value="" placeholder="YYYY-MM-DD"/></SpecVariant>
    <SpecVariant label="Disabled"><DatePicker value="2026-05-09" disabled/></SpecVariant>
  </SpecCanvas>
);

Object.assign(window, { AsteroidCardSpec, DateRangePickerSpec, DatePickerSpec, DatePicker });
