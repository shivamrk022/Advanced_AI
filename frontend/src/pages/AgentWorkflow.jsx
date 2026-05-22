import { useState } from 'react'
import { motion } from 'framer-motion'
import { runAgentWorkflow } from '../services/api'
import AgentStepCard from '../components/AgentStepCard'
import { Network, Loader, Copy, Briefcase, GraduationCap, Microscope, Code } from 'lucide-react'
import toast from 'react-hot-toast'
import ExportButtons from '../components/ExportButtons'

export default function AgentWorkflow() {
  const [task, setTask] = useState('')
  const [mode, setMode] = useState('business')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const modes = [
    { id: 'business', label: 'Business', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'career', label: 'Career', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'research', label: 'Research', icon: <Microscope className="h-4 w-4" /> },
    { id: 'project', label: 'Project', icon: <Code className="h-4 w-4" /> }
  ]

  const handleRun = async () => {
    if (!task.trim()) {
      toast.error('Please enter a task.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await runAgentWorkflow(task, mode)
      setResult(data)
      toast.success('Agent workflow complete!')
    } catch (err) {
      setError(err.message)
      toast.error('Workflow failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result?.final_answer) {
      navigator.clipboard.writeText(result.final_answer)
      toast.success('Final answer copied to clipboard!')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-brand-500/10 rounded-2xl">
            <Network className="h-10 w-10 text-brand-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 mb-4">
          Agentic AI Workflow
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Run a task through multiple specialized AI agents: Planner, Researcher, Writer, and Critic. They collaborate to produce a high-quality, polished final output.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 mb-12">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            What is your task?
          </label>
          <textarea
            className="w-full h-32 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow resize-none text-sm"
            placeholder="E.g., Create a business plan for an AI automation service in Palghar..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Select Workflow Mode
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  mode === m.id
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {m.icon}
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="w-full md:w-auto md:px-12 py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <Loader className="animate-spin h-5 w-5" />
              Agents are working...
            </>
          ) : (
            'Run Workflow'
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-500/20 text-center">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <AgentStepCard 
              index={1}
              agentName="Planner Agent" 
              role="Breaks the task down into an execution plan." 
              output={result.planner_output} 
            />
            <AgentStepCard 
              index={2}
              agentName="Research Agent" 
              role="Gathers context and structures facts based on the plan." 
              output={result.research_output} 
            />
            <AgentStepCard 
              index={3}
              agentName="Writer Agent" 
              role="Drafts the document using the research and plan." 
              output={result.writer_output} 
            />
            <AgentStepCard 
              index={4}
              agentName="Critic Agent" 
              role="Reviews the draft for weaknesses and suggests improvements." 
              output={result.critic_output} 
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-slate-900 dark:to-brand-900/20 rounded-3xl p-1 shadow-lg border border-brand-200/50 dark:border-brand-500/30 relative"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[1.4rem] p-6 md:p-8 h-full">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
                    Final Answer
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">Edited and polished by the final review process.</p>
                </div>
                <div className="flex items-center gap-2">
                  <ExportButtons 
                    title="Agentic AI Workflow Report" 
                    content={`Task: ${task}\nMode: ${mode}\n\n[1] Planner Output:\n${result.planner_output}\n\n[2] Research Output:\n${result.research_output}\n\n[3] Writer Output:\n${result.writer_output}\n\n[4] Critic Output:\n${result.critic_output}\n\nFINAL ANSWER:\n${result.final_answer}`} 
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="hidden md:inline">Copy Result</span>
                  </button>
                </div>
              </div>
              
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                {result.final_answer}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
