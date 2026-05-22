import { motion } from 'framer-motion'

export default function StatCard({ title, value, icon, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-start gap-4"
    >
      {icon && (
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
