import { Mail, Phone, MapPin, Send } from 'lucide-react'

export default function Contact() {
  return (
    <div className="space-y-20 pb-20 pt-10">
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Have a question or want to work together? We'd love to hear from you. Drop us a message below.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 p-8 backdrop-blur-xl space-y-8">
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Email Us</h3>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">support@shivamnexus.com</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Call Us</h3>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visit Us</h3>
                  <p className="mt-1 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    123 AI Boulevard, Tech City<br/>
                    TC 90210, United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form className="space-y-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 p-8 shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                <input type="text" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                <input type="text" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
              <textarea rows={4} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 font-bold text-white shadow-lg shadow-brand-500/30 transition-all hover:bg-brand-700 hover:shadow-brand-500/40">
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
