import { Users, Target, Shield, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="space-y-20 pb-20 pt-10">
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          About Shivam Nexus
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          We are on a mission to empower individuals and businesses with next-generation AI tools.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              To build a seamless ecosystem where AI naturally augments human capabilities, making complex tasks simpler, faster, and more efficient.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Privacy & Security First</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">Uncompromising Performance</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                  <Users className="h-5 w-5" />
                </div>
                <span className="text-slate-600 dark:text-slate-300 font-medium">User-Centric Design</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
