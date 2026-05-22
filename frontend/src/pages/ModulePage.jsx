import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { translations, prompts } from '../data/translations'
import { askGroq } from '../services/api'
import { Copy, Check, Sparkles, AlertTriangle, Search, Briefcase, MapPin, Calendar, HeartHandshake } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function ModulePage({ lang }) {
  const { id } = useParams()
  const moduleData = MODULES.find(m => m.id === id)
  const t = translations[lang]

  const [activeSub, setActiveSub] = useState('')
  const [formData, setFormData] = useState({})
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Job Search specific states
  const [jobs, setJobs] = useState([])
  const [searchingJobs, setSearchingJobs] = useState(false)

  useEffect(() => {
    if (moduleData && moduleData.subModules.length > 0) {
      setActiveSub(moduleData.subModules[0].id)
      setFormData({})
      setOutput('')
      setJobs([])
    }
  }, [id, moduleData])

  if (!moduleData) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Module not found</h2>
        <Link to="/" className="text-brand-600 hover:underline">Return Home</Link>
      </div>
    )
  }

  const subModule = moduleData.subModules.find(s => s.id === activeSub)
  const isRtl = false

  const handleInputChange = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // Handle Job Search locally or via API
    if (id === 'jobs' && activeSub === 'search-jobs') {
      triggerJobSearch()
      return
    }

    if (loading) return
    setLoading(true)
    setOutput('')

    // Build Prompt
    const promptTemplate = prompts[id]?.[activeSub]
    if (!promptTemplate) {
      setOutput('Prompt template missing.')
      setLoading(false)
      return
    }

    let finalPrompt = promptTemplate
    if (subModule && subModule.fields) {
      subModule.fields.forEach(f => {
        const val = formData[f.name] || f.placeholder || ''
        finalPrompt = finalPrompt.replace(`{${f.name}}`, val)
      })
    }

    const systemPrompt = `You are a helpful AI Assistant specialized in Shivam Nexus's ${moduleData.title} -> ${subModule?.label} module. Give a comprehensive, structured response in Markdown. Respond in the requested language: ${lang === 'hi' ? 'Hindi' : 'English'}.`

    try {
      const res = await askGroq(systemPrompt, finalPrompt)
      setOutput(res)
    } catch (error) {
      setOutput(`⚠️ **AI Service Error**: ${error.message || 'An error occurred while generating the output. Please verify your internet connection or API settings.'}`)
    } finally {
      setLoading(false)
    }
  }

  const triggerJobSearch = () => {
    setSearchingJobs(true)
    // Simulate real job listings fetching with custom details
    const keyword = formData.keyword || 'AI Engineer'
    const locationVal = formData.location || 'Mumbai'

    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: `Junior ${keyword}`,
          company: 'Nexus Automations Ltd.',
          location: locationVal,
          salary: '₹6,00,000 - ₹8,50,000 / year',
          type: 'Full-time',
          posted: '1 day ago',
          description: `Exciting opportunity for a junior professional specializing in ${keyword}. Experience with Python, machine learning, and workflow automation is highly preferred.`
        },
        {
          id: 2,
          title: `Associate ${keyword} (GenAI/RAG)`,
          company: 'Enterprise Ops Co.',
          location: `${locationVal} (Hybrid)`,
          salary: '₹8,00,000 - ₹12,00,000 / year',
          type: 'Full-time',
          posted: '3 days ago',
          description: `Join our team to build LLM applications, private RAG architectures, and custom AI agents. Strong background in Python, FastAPI, and React.`
        },
        {
          id: 3,
          title: `${keyword} Intern`,
          company: 'InnoTech Solutions',
          location: 'Remote (India)',
          salary: '₹25,000 - ₹35,000 / month',
          type: 'Internship',
          posted: 'Just now',
          description: 'A great internship role for B.Tech AI/ML students. Learn model pre-processing, web scraping, and deploy production-ready AI solutions.'
        }
      ]
      setJobs(mockJobs)
      setSearchingJobs(false)
      toast.success('Job search complete!')
    }, 1000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    toast.success(t.copied)
    setTimeout(() => setCopied(false), 2000)
  }

  const Icon = moduleData.icon

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/10 dark:border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${moduleData.color} text-white shadow-lg`}>
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{moduleData.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{moduleData.description}</p>
          </div>
        </div>
        <Link to="/" className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          &larr; Back to Modules
        </Link>
      </div>

      {/* Warning/Disclaimer bar */}
      {moduleData.disclaimer && (
        <div className="flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="leading-relaxed">{moduleData.disclaimer}</p>
        </div>
      )}

      {/* Submodule tabs */}
      <div className="flex flex-wrap gap-2 border-b border-black/5 dark:border-white/5 pb-2">
        {moduleData.subModules.map((sub) => {
          const SubIcon = sub.icon
          return (
            <button
              key={sub.id}
              onClick={() => {
                setActiveSub(sub.id)
                setOutput('')
                setJobs([])
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeSub === sub.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              <SubIcon className="h-4 w-4" />
              <span>{sub.label}</span>
            </button>
          )
        })}
      </div>

      {/* Workspace Panel */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left: Input Form */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Configure Parameters</span>
          </h2>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            {subModule && subModule.fields && subModule.fields.map((f) => (
              <div key={f.name} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {f.label}
                </label>
                {f.type === 'select' ? (
                  <select
                    value={formData[f.name] || ''}
                    onChange={(e) => handleInputChange(f.name, e.target.value)}
                    required
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                  >
                    <option value="" disabled>Select option</option>
                    {f.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={formData[f.name] || ''}
                    onChange={(e) => handleInputChange(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    required
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[f.name] || ''}
                    onChange={(e) => handleInputChange(f.name, e.target.value)}
                    placeholder={f.placeholder}
                    required
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading || searchingJobs}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors mt-6"
            >
              {loading || searchingJobs ? (
                <span>{t.generating}</span>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{id === 'jobs' ? 'Search Live Listings' : t.generate}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Output Result */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-6 md:p-8 flex flex-col justify-between min-h-[400px]">
          {/* Main output container */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {id === 'jobs' ? 'Job Match Results' : t.response}
              </h2>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? t.copied : t.copyBtn}</span>
                </button>
              )}
            </div>

            {/* Render job listings if it is Job Search module */}
            {id === 'jobs' ? (
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="rounded-2xl border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-950/20 p-4 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">{job.title}</h3>
                            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-0.5">{job.company}</p>
                          </div>
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {job.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{job.description}</p>

                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400 pt-2 border-t border-black/5 dark:border-white/5">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                    <Briefcase className="h-10 w-10 text-slate-300" />
                    <p className="text-sm font-medium">No search results generated yet</p>
                  </div>
                )}
              </div>
            ) : (
              /* Render generic LLM markdown output */
              <div className="prose dark:prose-invert prose-sm leading-relaxed max-w-none break-words">
                {output ? (
                  <ReactMarkdown>{output}</ReactMarkdown>
                ) : loading ? (
                  <div className="space-y-4 animate-pulse pt-4">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
                    <HeartHandshake className="h-10 w-10 text-slate-300 animate-float" />
                    <p className="text-sm font-medium">{t.selectSubmodule}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
