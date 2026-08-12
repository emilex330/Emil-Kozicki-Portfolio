import { motion } from 'motion/react'

function Section({ id, label, title, children }) {
  return (
    <motion.section
      id={id}
      className="section"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container">
        {label && <p className="section__label">{label}</p>}
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </motion.section>
  )
}

export default Section