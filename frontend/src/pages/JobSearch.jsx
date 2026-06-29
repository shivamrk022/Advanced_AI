import { useState, useEffect } from 'react'
import { searchJobs } from '../services/api'
import JobCard from '../components/JobCard'
import { Search, MapPin, Loader, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function JobSearch() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e?.preventDefault()

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const data = await searchJobs(keyword, location)
      setResult(data)
    } catch (err) {
      setError(err.message)
      toast.error('Job search failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-brand-500/10 rounded-2xl">
            <Search className="h-10 w-10 text-brand-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 mb-4">
          AI Job Search
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Search AI, software, data, and remote jobs using our backend-powered job search engine fetching real-time from multiple public APIs.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 mb-12 max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="AI Engineer, Backend Developer, Data Analyst..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Mumbai, Palghar, Boisar, India, Remote..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-shadow text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="py-3.5 px-8 rounded-xl font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-sm"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : 'Search'}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 mb-8 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-3 border border-red-200 dark:border-red-500/20 max-w-4xl mx-auto">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p>Enter a keyword and location to discover live jobs.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400">
          <Loader className="animate-spin h-12 w-12 text-brand-500 mx-auto mb-4" />
          <p>Searching multiple job boards...</p>
        </div>
      )}

      {result && !loading && (
        <div>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Found {result.count} Jobs
            </h2>
            {result.source_summary?.length > 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Sources: <span className="font-medium uppercase text-xs ml-1">{result.source_summary.join(', ')}</span>
              </p>
            )}
          </div>

          {result.jobs?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400">No jobs found matching your criteria. Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {result.jobs.map((job, idx) => (
                <JobCard key={idx} job={job} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
