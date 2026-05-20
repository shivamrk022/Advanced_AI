import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import Section from './Section'
import { profile } from '../data/profile'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleSubmit(event) {
    event.preventDefault()
    const subject = encodeURIComponent(`Portfolio contact from ${form.name || 'Visitor'}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    toast.success('Opening email app...')
  }

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let’s connect for AI/ML opportunities."
      subtitle="Whether it's an internship, job opportunity, freelance project, or collaboration — I'd love to hear from you."
      className="bg-surface/50"
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <ContactLine icon={<FiMail />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactLine icon={<FiPhone />} label="Phone" value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, '')}`} />
          <ContactLine icon={<FiMapPin />} label="Location" value={profile.location} />
          <ContactLine icon={<FiGithub />} label="GitHub" value="github.com/shivamrk022" href={profile.githubUrl} />
          <ContactLine icon={<FiLinkedin />} label="LinkedIn" value="linkedin.com/in/shivam-maurya-4628a3291" href={profile.linkedinUrl} />
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-[2rem] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Your name"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary/60"
            />
            <input
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              type="email"
              placeholder="Your email"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary/60"
            />
          </div>
          <textarea
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            rows={7}
            placeholder="Write your message..."
            className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-slate-500 focus:border-primary/60"
          />
          <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-midnight transition hover:bg-secondary">
            Send Message <FiSend />
          </button>
        </form>
      </div>
    </Section>
  )
}

function ContactLine({ icon, label, value, href }) {
  const content = (
    <div className="card-hover flex items-center gap-4 rounded-3xl border border-white/10 bg-midnight/70 p-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">{label}</p>
        <p className="truncate text-sm font-bold text-white sm:text-base">{value}</p>
      </div>
    </div>
  )

  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}
