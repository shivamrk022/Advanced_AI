import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { profile } from '../data/profile'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-midnight px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
        <div>
          <p className="text-lg font-extrabold text-white">{profile.name}</p>
          <p className="mt-1 text-sm text-slate-400">AI/ML • Agentic AI • RAG • Automation</p>
        </div>
        <div className="flex items-center gap-3">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-slate-300 hover:border-primary/50 hover:text-primary" aria-label="GitHub"><FiGithub /></a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-slate-300 hover:border-primary/50 hover:text-primary" aria-label="LinkedIn"><FiLinkedin /></a>
          <a href={`mailto:${profile.email}`} className="rounded-full border border-white/10 p-3 text-slate-300 hover:border-primary/50 hover:text-primary" aria-label="Email"><FiMail /></a>
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} {profile.name}. Built with React, Vite and Tailwind CSS.</p>
      </div>
    </footer>
  )
}
