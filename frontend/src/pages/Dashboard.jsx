import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Activity, RefreshCw, MessageSquare, 
  Upload, FileText, Bot, Search, Clock, 
  ChevronRight, Sparkles, Server, Database
} from 'lucide-react'
import { getDashboardSummary } from '../services/api'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const summary = await getDashboardSummary()
      if (!summary) throw new Error('Failed to load dashboard data')
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
        <p className="text-slate-500 dark:text-slate-400">Loading your workspace...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 mb-4">
          <Activity className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Workspace Unavailable</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button onClick={fetchData} className="px-6 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600">
          Try Again
        </button>
      </div>
    )
  }

  const { summary, recent_activities, recommendations, system_health } = data
  const hasActivity = Object.values(summary).some(val => val > 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 flex items-center gap-3">
            Welcome back to Shivam Nexus
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Continue your AI tasks, documents, resumes, jobs, and workflows from one place.
          </p>
        </div>
      </div>

      {/* Recommendations / AI Suggestions */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-10 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-900/20 dark:to-indigo-900/20 border border-brand-100 dark:border-brand-800/30 rounded-2xl p-5 flex items-start gap-4">
          <div className="p-2 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl mt-1">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Smart Suggestions</h3>
            <ul className="space-y-1">
              {recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-400"></div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        <Link to="/chat" className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
          <MessageSquare className="h-8 w-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Start AI Chat</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions or brainstorm ideas</p>
        </Link>
        <Link to="/document-chat" className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
          <Upload className="h-8 w-8 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Upload Document</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Chat with your PDFs</p>
        </Link>
        <Link to="/resume-analyzer" className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
          <FileText className="h-8 w-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Analyze Resume</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Optimize for ATS tracking</p>
        </Link>
        <Link to="/agent-workflow" className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
          <Bot className="h-8 w-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Agent Workflow</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Run multi-step AI agents</p>
        </Link>
        <Link to="/job-search" className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 transition-all shadow-sm hover:shadow-md">
          <Search className="h-8 w-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Search Jobs</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Find live opportunities</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* My Activity Summary */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">My Productivity</h2>
          {!hasActivity ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Start using Shivam Nexus</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Your productivity dashboard is currently empty. Use the quick actions above to start exploring AI capabilities.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard title="Chat Sessions" value={summary.chat_sessions || 0} icon={<MessageSquare />} delay={0} />
              <StatCard title="Documents" value={summary.documents_uploaded || 0} icon={<Upload />} delay={0.1} />
              <StatCard title="Resume Scans" value={summary.resume_analyses || 0} icon={<FileText />} delay={0.2} />
              <StatCard title="Agent Workflows" value={summary.agent_workflows || 0} icon={<Bot />} delay={0.3} />
              <StatCard title="Job Searches" value={summary.job_searches || 0} icon={<Search />} delay={0.4} />
              <StatCard title="Reports Exported" value={summary.reports_exported || 0} icon={<Activity />} delay={0.5} />
            </div>
          )}
        </div>

        {/* Recent Activity Timeline */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
            <Link to="/history" className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
            {(!recent_activities || recent_activities.length === 0) ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No recent activity.</p>
            ) : (
              <div className="space-y-6">
                {recent_activities.map((act, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Clock className="h-4 w-4" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{act.action_text}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {new Date(act.created_at).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Continue Where You Left Off */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Continue Where You Left Off</h2>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
          {(!data.recent_chats?.length && !data.recent_documents?.length) ? (
            <div className="text-center py-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">No recent workspaces found.</p>
              <Link to="/chat" className="text-sm font-medium text-brand-500 hover:text-brand-600">
                Start a new session <ChevronRight className="inline h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recent_chats?.map((chat, idx) => (
                <Link key={`chat-${idx}`} to="/history" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{chat.module || 'Chat'} Session</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(chat.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </Link>
              ))}
              
              {data.recent_documents?.map((doc, idx) => (
                <Link key={`doc-${idx}`} to="/document-chat" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{doc.filename}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Document Chat</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
