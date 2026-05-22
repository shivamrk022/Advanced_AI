import { useState } from 'react'
import { motion } from 'framer-motion'
import { analyzeResume } from '../services/api'
import { UploadCloud, CheckCircle, XCircle, AlertTriangle, FileText, Copy, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      const ext = selected.name.split('.').pop().toLowerCase()
      if (['pdf', 'docx', 'txt'].includes(ext)) {
        setFile(selected)
      } else {
        toast.error('Only PDF, DOCX, and TXT files are supported.')
      }
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload a resume first.')
      return
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeResume(file, jobDescription)
      setResult(data)
      toast.success('Analysis complete!')
    } catch (err) {
      setError(err.message)
      toast.error('Analysis failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2))
      toast.success('Result copied to clipboard!')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 mb-4">
          ATS Resume Analyzer
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upload your resume and the job description to get a detailed ATS compatibility score, missing keywords, and actionable improvements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Input */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="text-brand-500" />
            Input Details
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Upload Resume (PDF, DOCX, TXT)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud className="h-10 w-10 text-slate-400 mb-3" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-slate-500 mt-1">PDF, DOCX, TXT up to 10MB</span>
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Job Description
            </label>
            <textarea
              className="w-full h-48 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow resize-none text-sm"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-medium bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Analyze Resume'}
          </button>
          
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-500/20">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Analysis Results
            </h2>
            {result && (
              <button
                onClick={handleCopy}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Copy JSON result"
              >
                <Copy className="h-5 w-5" />
              </button>
            )}
          </div>

          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
              <FileText className="h-16 w-16 mb-4 opacity-50" />
              <p>Upload a resume and job description to see results.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[300px]">
              <Loader className="animate-spin h-10 w-10 text-brand-500 mb-4" />
              <p>Analyzing resume against job description...</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="relative h-24 w-24 rounded-full flex items-center justify-center bg-white dark:bg-slate-900 shadow-inner">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${251.2 * (result.ats_score / 100)} 251.2`}
                      className={`${
                        result.ats_score >= 80 ? 'text-green-500' :
                        result.ats_score >= 50 ? 'text-yellow-500' : 'text-red-500'
                      } transition-all duration-1000 ease-out`}
                    />
                  </svg>
                  <span className="text-2xl font-bold">{result.ats_score}%</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">ATS Match Score</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Matched Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_keywords?.length > 0 ? (
                      result.matched_keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-xs text-green-700 dark:text-green-400 font-medium">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-green-600/70">None found</span>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Missing Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords?.length > 0 ? (
                      result.missing_keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-1 bg-white dark:bg-slate-800 rounded text-xs text-red-700 dark:text-red-400 font-medium">
                          {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-red-600/70">None missing!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Weak Points */}
              {result.weak_points?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
                    <AlertTriangle className="h-4 w-4" /> Weak Points
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {result.weak_points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improved Bullets */}
              {result.improved_bullets?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-brand-600 dark:text-brand-400">
                    Suggested Bullet Improvements
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    {result.improved_bullets.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Plan */}
              {result.action_plan?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-semibold mb-3">Action Plan</h4>
                  <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {result.action_plan.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
