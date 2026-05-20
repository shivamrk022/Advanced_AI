import { translations } from '../../data/translations'
import { Github, Linkedin, Mail } from 'lucide-react'
import Logo from './Logo'

export default function Footer({ lang }) {
  const t = translations[lang]
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/30 text-slate-500 dark:text-slate-400 py-12 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed max-w-xs">
              {t.taglineSub}
            </p>
          </div>

          {/* Core Info & Disclaimers */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wider uppercase">
              {t.disclaimer}
            </h4>
            <p className="text-xs leading-relaxed">
              {t.healthDisclaimer}
            </p>
            <p className="text-xs leading-relaxed border-t border-black/5 dark:border-white/5 pt-2">
              {t.legalDisclaimer}
            </p>
          </div>

          {/* Social / Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white tracking-wider uppercase">
              Connect & Source
            </h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a 
                href="https://github.com/shivamrk022" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-brand-500 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>{t.githubLink}</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/shivam-maurya-4628a3291/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-brand-500 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span>LinkedIn Profile</span>
              </a>
              <a 
                href="mailto:shivamaurya9702@gmail.com" 
                className="flex items-center gap-2 hover:text-brand-500 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>shivamaurya9702@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-black/5 dark:border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} {t.title}. All rights reserved.</p>
          <p className="text-slate-400 dark:text-slate-500">
            {t.aboutCreator}
          </p>
        </div>
      </div>
    </footer>
  )
}
