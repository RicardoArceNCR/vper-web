import { useState, useEffect, useRef } from 'react'
import styles from './Nav.module.css'
import Button from '../ui/Button/Button'
import Container from '../ui/Container/Container'

const NAV_LINKS = [
  { label: 'Work',     href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
]

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const hamburgerRef = useRef(null)
  const menuRef = useRef(null)

  const toggle = () => setIsOpen(prev => !prev)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        hamburgerRef.current?.focus()
      }
    }

    const handleClickOutside = (e) => {
      if (
        !hamburgerRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <Container className={styles.navInner}>

          <a href="/" className={styles.logo} aria-label="VPER Media — Inicio">
            VPER·MEDIA
          </a>

          <button
            ref={hamburgerRef}
            className={styles.hamburger}
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
            onClick={toggle}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

          <div
            ref={menuRef}
            id="nav-menu"
            className={`${styles.menu} ${isOpen ? styles.open : ''}`}
          >
            <ul className={styles.links}>
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={`${styles.link} ${label === 'Work' ? styles.active : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.divider} aria-hidden="true" />
            <Button href="#contact" variant="secondary" className={styles.cta}>
              Schedule a call
            </Button>
          </div>

        </Container>
      </nav>
    </header>
  )
}
