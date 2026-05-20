import { useState } from 'react'
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi'
import { profile } from '../data/profile'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'AI Chat', href: '#chat-section' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-midnight/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#home" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary font-extrabold text-midnight shadow-glow">
            SM
          </span>
          <span>
            <span className="block text-sm font-bold text-white">{profile.name}</span>
            <span className="block text-xs text-slate-400">AI/ML Portfolio</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-slate-300 transition hover:text-primary">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:border-primary/50 hover:text-primary" aria-label="GitHub">
            <FiGithub />
          </a>
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 p-3 text-slate-300 transition hover:border-primary/50 hover:text-primary" aria-label="LinkedIn">
            <FiLinkedin />
          </a>
          <a href="#contact" className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-midnight transition hover:bg-secondary">
            Hire / Connect
          </a>
        </div>

        <button className="rounded-2xl border border-white/10 p-3 text-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-midnight px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-primary">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
