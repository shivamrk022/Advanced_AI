import { useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { exportPdf, exportDocx } from '../services/api'
import toast from 'react-hot-toast'

export default function ExportButtons({ title, content }) {
  const [exporting, setExporting] = useState(null) // 'pdf' or 'docx' or null

  const handleExport = async (type) => {
    if (!content) {
      toast.error('No content to export')
      return
    }

    setExporting(type)
    try {
      if (type === 'pdf') {
        await exportPdf(title, content)
      } else if (type === 'docx') {
        await exportDocx(title, content)
      }
      toast.success(`${type.toUpperCase()} exported successfully!`)
    } catch (error) {
      toast.error(error.message || `Failed to export ${type.toUpperCase()}`)
    } finally {
      setExporting(null)
    }
  }

  if (!content) return null

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">
        Export Report:
      </span>
      <button
        onClick={() => handleExport('pdf')}
        disabled={exporting !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors text-sm font-medium dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
      >
        {exporting === 'pdf' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        PDF
      </button>
      <button
        onClick={() => handleExport('docx')}
        disabled={exporting !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/20 bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors text-sm font-medium dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
      >
        {exporting === 'docx' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        DOCX
      </button>
    </div>
  )
}
