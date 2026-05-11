import styles from './Button.module.css'

export default function Button({ href, variant = 'primary', children, className = '', ...props }) {
  const classes = `${styles.btn} ${styles[`btn--${variant}`]} ${className}`.trim()
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
