import styles from './Footer.module.css'
import Container from '../ui/Container/Container'
import Section from '../ui/Section/Section'

const NAV_LINKS = [
  { label: 'Work',     href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
]

const CONTACT_INFO = {
  general: {
    email: 'hola@vpermedia.com'
  },
  team: [
    {
      name: 'Carlos Escobar',
      email: 'carlos@vpermedia.com',
      phone: '+505 7782 4749'
    },
    {
      name: 'Jader Vanegas',
      email: 'jader@vpermedia.com',
      phone: '+507 6896-7401'
    }
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com/vpermedia' },
    { label: 'LinkedIn',  href: 'https://linkedin.com/company/vpermedia' },
  ],
  office: {
    location: 'Managua, Nicaragua',
    remote: 'Remote LATAM'
  }
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Section>
        <Container className={styles.inner}>

          <div className={styles.brandBlock}>
            <a href="/" className={styles.logo} aria-label="VPER Media — Inicio">
              VPER·MEDIA
            </a>
            <p className={styles.tagline}>
              Campaigns, content & experiences that convert.
            </p>
            <div className={styles.group}>
              <p className={styles.colTitle}>Social</p>
              <div className={styles.socialRow}>
                <a
                  href="https://instagram.com/vpermedia"
                  className={styles.socialLink}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37a4 4 0 1 1-2.63-2.63A4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/vpermedia"
                  className={styles.socialLink}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-7.85c0-1.87-.03-4.27-2.6-4.27-2.6 0-3 2.03-3 4.13V23h-4V8z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <nav className={styles.column} aria-label="Footer navigation">
            <p className={styles.colTitle}>Navigation</p>
            <ul className={styles.navList}>
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className={styles.navLink}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.contactGroup}>
            <p className={styles.colTitle}>Contacto</p>
            <div className={styles.group}>
              <p className={styles.colTitle}>Equipo</p>
              <div className={styles.teamList}>
                {CONTACT_INFO.team.map((person) => (
                  <div key={person.name} className={styles.contactPerson}>
                    <p className={styles.contactName}>{person.name}</p>
                    <ul className={styles.contactMeta}>
                      <li>
                        <a href={`mailto:${person.email}`} className={styles.navLink}>
                          {person.email}
                        </a>
                      </li>
                      <li>
                        <a href={`tel:${person.phone.replace(/\s/g, '')}`} className={styles.navLink}>
                          {person.phone}
                        </a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </Container>
      </Section>

      <Container className={styles.bottom}>
        <p className={styles.copy}>
          © {year} VPER Media. Todos los derechos reservados.
        </p>
        <div className={styles.officeInfo}>
          <p className={styles.copy}>{CONTACT_INFO.office.location}</p>
          <p className={styles.copy}>{CONTACT_INFO.office.remote}</p>
        </div>
      </Container>
    </footer>
  )
}
