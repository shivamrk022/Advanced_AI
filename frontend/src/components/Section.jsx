import { motion } from 'framer-motion'

export default function Section({ id, eyebrow, title, subtitle, children, className = '' }) {
  return (
    <section id={id} className={`relative px-5 py-24 sm:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mb-12 max-w-3xl"
          >
            {eyebrow && <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>}
            {title && <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>}
            {subtitle && <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">{subtitle}</p>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
