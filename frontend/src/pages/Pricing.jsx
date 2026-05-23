import { Check } from 'lucide-react'

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      features: ["Basic AI Chat", "Limited Resume Analysis", "Standard Support", "Access to 2 Modules"],
      highlight: false
    },
    {
      name: "Pro",
      price: "$15",
      period: "/mo",
      features: ["Advanced AI Models", "Unlimited Resume Analysis", "Priority Support", "Access to All Modules", "Custom AI Workflows"],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Dedicated Account Manager", "Custom Integrations", "SLA Guarantee", "White-labeling", "On-premise deployment"],
      highlight: false
    }
  ]

  return (
    <div className="space-y-20 pb-20 pt-10">
      <section className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
          Choose the perfect plan for your needs and unlock the full power of AI.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative flex flex-col rounded-3xl border p-8 transition-transform hover:-translate-y-2 duration-300 ${
              plan.highlight 
                ? 'border-brand-500 shadow-2xl shadow-brand-500/20 bg-brand-500/5 dark:bg-brand-500/10' 
                : 'border-black/10 dark:border-white/10 bg-white dark:bg-slate-900/50 hover:border-black/20 dark:hover:border-white/20 hover:shadow-xl'
            }`}>
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                {plan.period && <span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>}
              </div>
              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-3">
                    <Check className={`h-5 w-5 ${plan.highlight ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full rounded-xl py-3.5 font-bold transition-all ${
                plan.highlight
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-700 hover:shadow-brand-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
