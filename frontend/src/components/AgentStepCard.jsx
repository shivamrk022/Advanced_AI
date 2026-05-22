import { motion } from 'framer-motion'
import { FileText, Search, PenTool, CheckCircle, Lightbulb } from 'lucide-react'

export default function AgentStepCard({ agentName, role, output, index }) {
  const icons = {
    'Planner Agent': <FileText className="h-6 w-6 text-blue-500" />,
    'Research Agent': <Search className="h-6 w-6 text-purple-500" />,
    'Writer Agent': <PenTool className="h-6 w-6 text-amber-500" />,
    'Critic Agent': <CheckCircle className="h-6 w-6 text-emerald-500" />
  }
  
  const icon = icons[agentName] || <Lightbulb className="h-6 w-6 text-brand-500" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{agentName}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
      <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
        {output || 'Awaiting output...'}
      </div>
    </motion.div>
  )
}
