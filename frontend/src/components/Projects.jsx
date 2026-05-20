import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiExternalLink, FiGithub, FiRefreshCw, FiStar } from 'react-icons/fi'
import Section from './Section'
import { profile } from '../data/profile'

const tabs = ['Featured', 'GitHub Live']

export default function Projects() {
  const [active, setActive] = useState('Featured')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (active !== 'GitHub Live' || repos.length > 0 || loading) return
    loadRepos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  async function loadRepos() {
    try {
      setLoading(true)
      setError('')
      const response = await fetch(`https://api.github.com/users/${profile.githubUsername}/repos?sort=updated&per_page=8`)
      if (!response.ok) throw new Error('GitHub API request failed')
      const data = await response.json()
      setRepos(data.filter((repo) => !repo.fork))
    } catch (err) {
      setError('Could not load live GitHub repos right now. Featured projects are still available.')
    } finally {
      setLoading(false)
    }
  }

  const visibleRepos = useMemo(() => repos.slice(0, 6), [repos])

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Projects I've shipped."
      subtitle="Curated AI/ML and automation projects with live GitHub integration. Each project demonstrates real-world problem-solving and production-ready architecture."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
              active === tab ? 'bg-primary text-midnight' : 'border border-white/10 text-slate-300 hover:border-primary/50 hover:text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === 'Featured' && (
        <div className="grid gap-6 md:grid-cols-2">
          {profile.projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="card-hover flex h-full flex-col rounded-[2rem] border border-white/10 bg-surface/70 p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="rounded-full bg-primary/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-primary">{project.category}</span>
                <span className="text-xs font-semibold text-slate-500">AI-ready</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">{project.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">{project.description}</p>
              <p className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm font-semibold leading-7 text-slate-200">{project.impact}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-primary/50 hover:text-primary">
                  <FiGithub /> Code
                </a>
                <a href={project.demo} target={project.demo.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-midnight hover:bg-secondary">
                  <FiExternalLink /> Demo / Details
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {active === 'GitHub Live' && (
        <div>
          <div className="mb-5 flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-surface/70 p-5">
            <div>
              <h3 className="font-extrabold text-white">Live repositories from @{profile.githubUsername}</h3>
              <p className="mt-1 text-sm text-slate-400">Auto-fetches latest public repos using GitHub REST API.</p>
            </div>
            <button onClick={loadRepos} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-slate-300 hover:border-primary/50 hover:text-primary">
              <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          {error && <p className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-200">{error}</p>}
          {loading && <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">Loading GitHub repositories...</p>}

          {!loading && visibleRepos.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleRepos.map((repo) => (
                <article key={repo.id} className="card-hover rounded-3xl border border-white/10 bg-surface/70 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-extrabold text-white">{repo.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-slate-400"><FiStar /> {repo.stargazers_count}</span>
                  </div>
                  <p className="mt-3 min-h-16 text-sm leading-7 text-slate-400">{repo.description || 'No description added yet.'}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-primary">{repo.language || 'Code'}</span>
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-primary">
                      Open <FiExternalLink />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </Section>
  )
}
