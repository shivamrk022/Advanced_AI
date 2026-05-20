import { motion } from 'framer-motion'
import { FiBookOpen, FiMapPin, FiTarget } from 'react-icons/fi'
import Section from './Section'
import { profile } from '../data/profile'

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title="Building where AI meets the real world."
      subtitle="Final-year AI/ML student focused on shipping practical, deployable AI systems — from agentic workflows and RAG pipelines to full-stack AI web apps."
      className="bg-surface/50"
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="glass rounded-[2rem] p-7"
        >
          <div className="space-y-5">
            {profile.about.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-slate-300">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="space-y-4"
        >
          <InfoCard icon={<FiBookOpen />} title="Education" value={profile.education.degree} detail={`${profile.education.college} • ${profile.education.duration}`} />
          <InfoCard icon={<FiTarget />} title="Career Goal" value="AI/ML, GenAI and automation-focused software roles" detail="Building job-ready projects with strong explanations and deployment-ready code." />
          <InfoCard icon={<FiMapPin />} title="Location" value={profile.location} detail="Available for internships, entry-level roles and project collaborations." />
        </motion.div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {profile.skills.map((group, index) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="card-hover rounded-3xl border border-white/10 bg-midnight/60 p-6"
          >
            <h3 className="text-lg font-extrabold text-white">{group.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function InfoCard({ icon, title, value, detail }) {
  return (
    <div className="card-hover rounded-3xl border border-white/10 bg-midnight/70 p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500">{title}</p>
      <h3 className="mt-2 text-lg font-extrabold text-white">{value}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-400">{detail}</p>
    </div>
  )
}
