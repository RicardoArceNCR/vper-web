import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>

      <div className={styles.pill}>
        <span className={styles.pillText}>Agencia Creativa</span>
      </div>

      <h1 className={styles.heading}>
        No hacemos marketing, hacemos que tenga sentido.
      </h1>

      <p className={styles.subtitle}>
        Campaigns content and experiences that convert.
      </p>

      <div className={styles.cta}>
        <a href="#contact" className="btn btn--secondary">Schedule a call</a>
        <a href="#work" className="btn btn--primary">View Work</a>
      </div>

    </section>
  )
}
