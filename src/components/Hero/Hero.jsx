import styles from './Hero.module.css'
import Button from '../ui/Button/Button'
import Container from '../ui/Container/Container'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>

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
          <Button href="#contact" variant="secondary">Schedule a call</Button>
          <Button href="#work" variant="primary">View Work</Button>
        </div>

      </Container>
    </section>
  )
}
