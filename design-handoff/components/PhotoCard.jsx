/* PhotoCard, SkeletonCard, PresetChips, SearchBox, Select, Button */

const Button = ({ variant = "ghost", children, ...rest }) => (
  <button className={`fz-btn fz-btn--${variant}`} {...rest}>{children}</button>
);

const SearchBox = ({ label = "Search NASA images", value = "", placeholder = "Try \"mars rover\"…", onChange = () => {}, onClear = () => {} }) => (
  <label className="fz-field">
    <span className="fz-field__label">{label}</span>
    <span className="fz-input-wrap">
      <span className="fz-input-wrap__icon">⌕</span>
      <input
        className="fz-input"
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {value ? (
        <button className="fz-input-wrap__clear" onClick={onClear} aria-label="Clear">×</button>
      ) : null}
    </span>
  </label>
);

const Select = ({ label, value, options = [], onChange = () => {} }) => (
  <label className="fz-field">
    <span className="fz-field__label">{label}</span>
    <select className="fz-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </label>
);

const PresetChips = ({ items = [], active = null, onPick = () => {} }) => (
  <div className="fz-chips">
    {items.map((it) => (
      <button
        key={it.value}
        className={`fz-chip ${active === it.value ? "is-active" : ""}`}
        onClick={() => onPick(it.value)}
      >
        {it.label}
      </button>
    ))}
  </div>
);

const PhotoCard = ({ title, meta, desc, src, kind = "image" }) => (
  <a className="fz-card" href="#">
    <div className="fz-card__inner">
      <div className="fz-card__media">
        {src ? (
          <img src={src} alt={title} loading="lazy"/>
        ) : (
          <div className="fz-card__fallback">{kind.toUpperCase()}</div>
        )}
      </div>
      <div className="fz-card__body">
        <h3 className="fz-card__title">{title}</h3>
        <div className="fz-card__meta">{meta}</div>
        {desc ? <p className="fz-card__desc">{desc}</p> : null}
      </div>
    </div>
  </a>
);

const SkeletonCard = () => (
  <div className="fz-skel">
    <div className="fz-skel__media"/>
    <div className="fz-skel__body">
      <div className="fz-skel__line" style={{width: "70%"}}/>
      <div className="fz-skel__line" style={{width: "40%"}}/>
      <div className="fz-skel__line" style={{width: "90%"}}/>
      <div className="fz-skel__line" style={{width: "85%"}}/>
    </div>
  </div>
);

Object.assign(window, { Button, SearchBox, Select, PresetChips, PhotoCard, SkeletonCard });
