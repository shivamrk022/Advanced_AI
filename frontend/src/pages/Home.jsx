import { Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { translations } from '../data/translations'
import { ArrowRight, Sparkles, CheckCircle2, Languages, Cpu, Zap, Star, Shield, Globe, Activity, PlayCircle } from 'lucide-react'

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
            {t.tagline.split(',')[0]},{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              {t.tagline.split(',').slice(1).join(',').trim()}
            </span>
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
                to={m.id === 'chat' ? '/chat' : m.id === 'jobs' ? '/job-search' : `/module/${m.id}`}
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

      {/* Features Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 py-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Star className="h-3.5 w-3.5" />
            <span>Why Choose Us</span>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Built for Peak Performance
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Everything you need to accelerate your productivity, in one unified ecosystem.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Enterprise-Grade Security",
              desc: "Your data never leaves your environment. We use industry-standard encryption for all AI interactions.",
              icon: Shield,
              color: "text-emerald-500"
            },
            {
              title: "Global Accessibility",
              desc: "Supports multiple languages and regional contexts, allowing you to work from anywhere in the world seamlessly.",
              icon: Globe,
              color: "text-blue-500"
            },
            {
              title: "Real-time Analytics",
              desc: "Track your usage, optimize your workflows, and get actionable insights from our advanced dashboard.",
              icon: Activity,
              color: "text-purple-500"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="group relative rounded-3xl border border-black/5 dark:border-white/5 bg-white/60 dark:bg-slate-900/40 p-8 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden bg-slate-900 py-24 dark:bg-black/50">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                Seamless AI Integration
              </h2>
              <p className="text-lg text-slate-300">
                Getting started is incredibly easy. Connect your API keys, select your module, and start generating insights in seconds.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "1", title: "Configure Platform", desc: "Set up your secure API keys and preferences." },
                  { step: "2", title: "Choose a Module", desc: "Select from Chat, Resume Analysis, Job Search, etc." },
                  { step: "3", title: "Generate Results", desc: "Get highly accurate, context-aware outputs instantly." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 font-bold text-white shadow-lg shadow-brand-500/30">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">{item.title}</h4>
                      <p className="mt-1 text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/30 to-purple-500/30 blur-3xl" />
              <div className="relative flex aspect-video items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
                <div className="flex flex-col items-center gap-4 text-white/80 hover:text-white cursor-pointer transition-colors">
                  <PlayCircle className="h-16 w-16" />
                  <span className="font-semibold tracking-wide">Watch Demo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-violet-600 px-8 py-16 text-center shadow-2xl">
          <div className="absolute top-0 right-0 -m-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -m-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to supercharge your workflow?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-white/80 text-lg">
            Join thousands of professionals using our AI suite to automate tasks and boost productivity.
          </p>
          <div className="relative mt-8 flex justify-center gap-4">
            <Link to="/pricing" className="rounded-xl bg-white px-8 py-3.5 font-bold text-brand-600 hover:bg-slate-50 transition-all shadow-xl">
              View Pricing
            </Link>
            <Link to="/contact" className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 font-bold text-white backdrop-blur-sm hover:bg-white/20 transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
