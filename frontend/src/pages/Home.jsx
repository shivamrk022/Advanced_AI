import { Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { translations } from '../data/translations'
import { ArrowRight, Sparkles, CheckCircle2, Languages, Cpu, Zap } from 'lucide-react'

export default function Home({ lang }) {
  const t = translations[lang]
  const isRtl = false

  const stats = [
    { label: t.statsModules, value: '8', icon: Cpu, color: 'text-blue-500' },
    { label: t.statsFeatures, value: '195+', icon: Zap, color: 'text-amber-500' },
    { label: t.statsLanguages, value: '2', icon: Languages, color: 'text-indigo-500' },
    { label: t.statsFree, value: '100%', icon: CheckCircle2, color: 'text-emerald-500' },
  ]

  return (
    <div className="space-y-20 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-20">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px] md:h-96 md:w-96" />
        <div className="absolute top-1/3 left-1/3 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen AI Workspace</span>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.15]">
            {t.tagline}
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-500 dark:text-slate-400 sm:text-lg leading-relaxed">
            {t.taglineSub}
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/module/student"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 hover:bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-600/10 transition-all hover:scale-105"
            >
              <span>{t.startFree}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#modules-section"
              className="inline-flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-all"
            >
              {t.exploreModules}
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 rounded-3xl border border-black/10 dark:border-white/10 bg-white/40 dark:bg-slate-900/30 p-6 md:p-8 backdrop-blur-xl">
          {stats.map((s, idx) => {
            const Icon = s.icon
            return (
              <div key={idx} className="text-center space-y-2">
                <div className="flex justify-center">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">{s.value}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.label}</div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Empowering AI Workspace Modules
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Click on any module below to launch the dedicated workspace and utilize powerful LLaMA 3.3 models.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.id}
                to={m.id === 'chat' ? '/chat' : `/module/${m.id}`}
                className="group relative flex flex-col justify-between rounded-3xl border border-black/5 dark:border-white/5 bg-white dark:bg-slate-900/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/20 hover:shadow-xl dark:hover:bg-slate-900"
              >
                <div className="space-y-4">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${m.color} text-white shadow-lg`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open Module</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
