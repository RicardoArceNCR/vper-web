import styles from './LogoStrip.module.css'

const CLIENTS = ['Claro', 'Chevrolet', 'Novasis', 'Vida Nica', 'Drytec', 'Flor de Caña', 'Super Express']

export default function LogoStrip() {
  return (
    <section className={styles.strip} aria-label="Clientes">
      <div className={styles.track} role="marquee" aria-live="off">
        <ul className={styles.list}>
          {CLIENTS.map(name => (
            <li key={name} className={styles.item}>{name}</li>
          ))}
        </ul>
        <ul className={styles.list} aria-hidden="true">
          {CLIENTS.map(name => (
            <li key={name} className={styles.item}>{name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
