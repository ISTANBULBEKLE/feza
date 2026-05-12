/* Header — sticky brand + nav */
const FezaMark = ({ size = 20 }) =>
<svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="feza">
    <path d="M42 18 C 42 14 36 12 31 14 C 26 16 25 21 25 26 L 25 54"
  stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15 30 L 37 30"
  stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <circle cx="50" cy="16" r="4" fill="currentColor" />
  </svg>;


const Header = ({ active = "explore" }) =>
<header className="fz-header">
    <div className="fz-header__inner">
      <a className="fz-brand" href="#">
        <span className="fz-brand__mark"><FezaMark /></span>
        <span className="fz-brand__text" style={{ fontSize: "20px" }}>feza</span>
      </a>
      <nav className="fz-nav">
        <a className={`fz-nav__link ${active === "home" ? "is-active" : ""}`} href="#" style={{ fontSize: "16px" }}>Home</a>
        <a className={`fz-nav__link ${active === "explore" ? "is-active" : ""}`} href="#" style={{ fontSize: "16px" }}>Explore</a>
        <a className={`fz-nav__link ${active === "apod" ? "is-active" : ""}`} href="#" style={{ fontSize: "16px" }}>APOD</a>
        <a className={`fz-nav__link ${active === "asteroids" ? "is-active" : ""}`} href="#" style={{ fontSize: "16px" }}>Asteroids</a>
      </nav>
    </div>
  </header>;


const Footer = () =>
<footer className="fz-footer">
    <div className="fz-footer__inner">
      <span className="fz-footer__tag" style={{ fontSize: "15px" }}>
        <span className="fz-footer__brand" style={{ fontSize: "16px" }}>feza</span>
        <span>·</span><span>NASA explorer demo</span>
        <span>·</span><span>Next.js 16</span>
        <span>·</span><span>SCSS modules</span>
        <span>·</span><span>Vitest</span>
      </span>
      <span className="fz-footer__meta" style={{ fontSize: "15px" }}>
        <span>© 2026</span><span>·</span>
        <a className="fz-footer__link" href="#">NASA Image Library</a>
        <span>·</span>
        <a className="fz-footer__link" href="#">api.nasa.gov</a>
      </span>
    </div>
  </footer>;


window.FezaMark = FezaMark;
window.Header = Header;
window.Footer = Footer;