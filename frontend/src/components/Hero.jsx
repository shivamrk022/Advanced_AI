import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FiArrowRight, FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi'
import { profile } from '../data/profile'

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:pt-44">
      <div className="absolute left-1/2 top-20 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            Open to AI/ML, GenAI and Automation Roles
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Hi, I am <span className="gradient-text">{profile.name}</span>
          </h1>
          <div className="mt-5 text-2xl font-bold text-slate-200 sm:text-3xl">
            <TypeAnimation
              sequence={[
                'Aspiring AI Engineer',
                1400,
                'Agentic AI Builder',
                1400,
                'RAG & LLM App Developer',
                1400,
                'Automation Workflow Creator',
                1400,
              ]}
              repeat={Infinity}
            />
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{profile.headline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {profile.labels.map((label) => (
              <span key={label} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300">
                {label}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#projects" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-midnight transition hover:bg-secondary">
              View Projects <FiArrowRight />
            </a>
            <a href={profile.resumeUrl} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 font-bold text-white transition hover:border-primary/50 hover:text-primary">
              Resume <FiDownload />
            </a>
            <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-300 transition hover:border-primary/50 hover:text-primary">
              <FiGithub /> GitHub
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-slate-300 transition hover:border-primary/50 hover:text-primary">
              <FiLinkedin /> LinkedIn
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="glass relative rounded-[2rem] p-6 shadow-glow"
        >
          <div className="absolute -right-5 -top-5 rounded-3xl bg-primary px-5 py-3 text-sm font-extrabold text-midnight shadow-glow">
            AI Portfolio
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-surface p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-2xl font-extrabold text-midnight">SM</div>
              <div>
                <h2 className="text-xl font-extrabold text-white">{profile.name}</h2>
                <p className="text-sm text-slate-400">{profile.role} • {profile.location}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {profile.stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-bold text-primary">Current focus</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Building practical AI systems using RAG, AI agents, FastAPI, React, Ollama and automation workflows that can be explained confidently in interviews.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
