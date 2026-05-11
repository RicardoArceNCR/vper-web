import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Work',     href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/vpermedia' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/company/vpermedia' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        <div>
          <a href="/" className={styles.logo} aria-label="VPER Media — Inicio">
            VPER·MEDIA
          </a>
          <p className={styles.tagline}>
            Campaigns, content & experiences that convert.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className={styles.colTitle}>Navigation</p>
          <ul className={styles.navList}>
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={styles.navLink}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={styles.colTitle}>Contacto</p>
          <ul className={styles.navList}>
            <li>
              <a href="mailto:hola@vpermedia.com" className={styles.navLink}>
                hola@vpermedia.com
              </a>
            </li>
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={styles.navLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {year} VPER Media. Todos los derechos reservados.
        </p>
        <p className={styles.copy}>Managua, Nicaragua</p>
      </div>
    </footer>
  )
}
