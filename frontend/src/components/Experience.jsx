import { motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'
import Section from './Section'
import { profile } from '../data/profile'

export default function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="My journey so far."
      subtitle="Real experience from self-directed AI/ML project building and academic learning — focused on practical skills that matter for the industry."
      className="bg-surface/50"
    >
      <div className="relative space-y-6 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-white/10 md:before:left-8">
        {profile.experience.map((item, index) => (
          <motion.article
            key={`${item.role}-${item.company}`}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="relative ml-12 rounded-[2rem] border border-white/10 bg-midnight/70 p-6 md:ml-20"
          >
            <div className="absolute -left-12 top-7 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-midnight text-primary md:-left-16">
              <FiCheckCircle />
            </div>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <h3 className="text-2xl font-extrabold text-white">{item.role}</h3>
                <p className="mt-1 font-semibold text-primary">{item.company}</p>
              </div>
              <span className="rounded-full bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">{item.duration}</span>
            </div>
            <ul className="mt-6 space-y-3">
              {item.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-7 text-slate-300">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
