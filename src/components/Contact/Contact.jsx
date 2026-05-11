import { useState } from 'react'
import styles from './Contact.module.css'
import Container from '../ui/Container/Container'
import Section from '../ui/Section/Section'
import Button from '../ui/Button/Button'

export default function Contact() {
  const [form, setForm] = useState({ name: '', surname: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: conectar con Formspree o EmailJS
    console.log('Form submitted:', form)
  }

  return (
    <Section className={styles.contact} id="contact" aria-labelledby="contact-title">
      <Container className={styles.inner}>

        <div className={styles.info}>
          <h2 className={styles.title} id="contact-title">Contact</h2>
          <p className={styles.desc}>¿Tenés un proyecto en mente? Escribinos y lo hacemos realidad juntos.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-name">Name</label>
              <input
                className={styles.input}
                type="text"
                id="contact-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact-surname">Surname</label>
              <input
                className={styles.input}
                type="text"
                id="contact-surname"
                name="surname"
                value={form.surname}
                onChange={handleChange}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">Email</label>
            <input
              className={styles.input}
              type="email"
              id="contact-email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">Message</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              id="contact-message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className={styles.submit}>
            Submit
          </Button>
        </form>

      </Container>
    </Section>
  )
}
