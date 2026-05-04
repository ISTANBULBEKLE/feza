import styles from "./Footer.module.scss";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <p className={styles.tag}>
          <span className={styles.brand}>feza</span>
          <span aria-hidden> · </span>
          <span>NASA explorer demo · Next.js 16 · SCSS modules · Vitest</span>
        </p>
        <p className={styles.meta}>
          <span>© {year}</span>
          <span aria-hidden> · </span>
          <a
            href="https://images.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            NASA Image Library
          </a>
          <span aria-hidden> · </span>
          <a
            href="https://api.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            api.nasa.gov
          </a>
        </p>
      </div>
    </footer>
  );
}
