import { ExternalLink, MapPin, Building2, Clock, Briefcase } from 'lucide-react'

export default function JobCard({ job }) {
  const getSourceColor = (source) => {
    switch (source) {
      case 'remotive': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300'
      case 'arbeitnow': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300'
      case 'remoteok': return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300'
      case 'sample': return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-500/20 dark:text-slate-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300'
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString()
    } catch {
      return dateStr
    }
  }

  const stripHtml = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 mt-2 text-slate-600 dark:text-slate-400">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">{job.company}</span>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${getSourceColor(job.source)}`}>
          {job.source}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
          <Briefcase className="h-3.5 w-3.5" />
          {job.type}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
          <Clock className="h-3.5 w-3.5" />
          {formatDate(job.posted_at)}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow line-clamp-3 mb-6">
        {stripHtml(job.description) || 'No description provided for this job listing.'}
      </p>

      <a
        href={job.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded-xl font-medium transition-colors border border-brand-200 dark:border-brand-500/20"
      >
        <span>Open / Apply</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}
