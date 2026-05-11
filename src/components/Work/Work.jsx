import { useState } from 'react'
import styles from './Work.module.css'
import Container from '../ui/Container/Container'
import Section from '../ui/Section/Section'

const FILTERS = [
  { label: 'Todos',    value: 'all' },
  { label: 'Branding', value: 'branding' },
  { label: 'Diseño',   value: 'diseno' },
  { label: 'Campañas', value: 'campanas' },
]

const CARDS = [
  { id: 1, category: 'branding',  tag: 'Branding', title: 'Brand Strategy', subtitle: 'Brand Campaign' },
  { id: 2, category: 'diseno',    tag: 'Diseño',   title: 'Brand Strategy', subtitle: 'Brand Campaign' },
  { id: 3, category: 'campanas',  tag: 'Campañas', title: 'Brand Strategy', subtitle: 'Brand Campaign' },
  { id: 4, category: 'branding',  tag: 'Branding', title: 'Brand Strategy', subtitle: 'Brand Campaign' },
  { id: 5, category: 'diseno',    tag: 'Diseño',   title: 'Brand Strategy', subtitle: 'Brand Campaign' },
  { id: 6, category: 'campanas',  tag: 'Campañas', title: 'Brand Strategy', subtitle: 'Brand Campaign' },
]

export default function Work() {
  const [activeFilter, setActiveFilter] = useState('all')

  return (
    <Section className={styles.work} aria-labelledby="work-title" id="work">
      <Container>

        <div className={styles.header}>
          <h2 className={styles.title} id="work-title">Selected Work</h2>
          <p className={styles.subtitle}>Proyectos que hablan por sí solos.</p>
          <div className={styles.filters} role="group" aria-label="Filtrar por categoría">
            {FILTERS.map(({ label, value }) => (
              <button
                key={value}
                className={`${styles.filterBtn} ${activeFilter === value ? styles.active : ''}`}
                onClick={() => setActiveFilter(value)}
                aria-pressed={activeFilter === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {CARDS.map(({ id, category, tag, title, subtitle }) => (
            <article
              key={id}
              className={`${styles.card} ${activeFilter !== 'all' && activeFilter !== category ? styles.hidden : ''}`}
            >
              <div className={styles.cardMedia}>
                <div className={styles.cardPlaceholder}>
                  <span className={styles.cardPlaceholderLabel}>4 × 3</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardTag}>{tag}</span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardSubtitle}>{subtitle}</p>
              </div>
            </article>
          ))}
        </div>

      </Container>
    </Section>
  )
}
