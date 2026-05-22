import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, RefreshCw, Server, Database, MessageSquare, 
  Upload, HelpCircle, FileText, Bot, Search, Download, History,
  AlertCircle
} from 'lucide-react'
import { getAnalyticsSummary } from '../services/api'
import StatCard from '../components/StatCard'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const summary = await getAnalyticsSummary()
      if (!summary) throw new Error('Failed to load analytics data')
      setData(summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading && !data) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand-500 mb-4" />
        <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Error Loading Admin Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Unable to load admin analytics. Please check backend connection. ({error})</p>
        <button onClick={fetchData} className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 flex items-center gap-3">
            <Activity className="h-8 w-8 text-brand-500" />
            Admin Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Monitor AI platform usage, feature activity, and backend status.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Backend Status" 
          value={data.backend_status === 'ok' ? 'Online' : 'Offline'} 
          icon={<Server className={data.backend_status === 'ok' ? "text-emerald-500" : "text-red-500"} />} 
          delay={0}
        />
        <StatCard 
          title="Database" 
          value={data.database_status === 'connected' ? 'Connected' : 'Error'} 
          icon={<Database className={data.database_status === 'connected' ? "text-emerald-500" : "text-red-500"} />} 
          delay={0.1}
        />
        <StatCard 
          title="Total Events" 
          value={data.total_events || 0} 
          icon={<Activity />} 
          delay={0.2}
        />
        <StatCard 
          title="Most Used Module" 
          value={<span className="capitalize">{data.most_used_module || 'None'}</span>} 
          icon={<Activity />} 
          delay={0.3}
        />
        
        <StatCard title="AI Chat Requests" value={data.total_ai_requests || 0} icon={<MessageSquare />} delay={0.4} />
        <StatCard title="RAG Uploads" value={data.rag_uploads || 0} icon={<Upload />} delay={0.5} />
        <StatCard title="RAG Questions" value={data.rag_questions || 0} icon={<HelpCircle />} delay={0.6} />
        <StatCard title="Resume Analyses" value={data.resume_analyses || 0} icon={<FileText />} delay={0.7} />
        <StatCard title="Agent Workflow Runs" value={data.agent_runs || 0} icon={<Bot />} delay={0.8} />
        <StatCard title="Job Searches" value={data.job_searches || 0} icon={<Search />} delay={0.9} />
        <StatCard title="Exports (PDF/DOCX)" value={data.exports || 0} icon={<Download />} delay={1.0} />
        <StatCard title="History Saves" value={data.history_saves || 0} icon={<History />} delay={1.1} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <History className="h-5 w-5 text-brand-500" />
          Recent Activity
        </h2>
        
        {(!data.recent_events || data.recent_events.length === 0) ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No analytics events recorded yet. Use AI Chat, Document Chat, Resume Analyzer, Agent Workflow, Job Search, or Export features to generate activity.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-medium">
                <tr>
                  <th className="px-6 py-3 rounded-l-xl">Event Type</th>
                  <th className="px-6 py-3">Module</th>
                  <th className="px-6 py-3 rounded-r-xl">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_events.map((event, idx) => (
                  <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {event.event_type}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {event.module || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
