import { useState, useEffect, useRef } from 'react'
import { uploadRagDocument, askRagQuestion, getRagDocuments, deleteRagDocument } from '../services/api'
import { FileUp, Send, FileText, Trash2, Copy, X, CheckCircle2, AlertCircle, Bot, User, Sparkles, Database } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function DocumentChat() {
  // Document state
  const [documents, setDocuments] = useState([])
  const [activeDocId, setActiveDocId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  // Chat state
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  // Fetch existing documents on mount
  useEffect(() => {
    getRagDocuments().then(docs => {
      setDocuments(docs)
      if (docs.length > 0) setActiveDocId(docs[0].document_id)
    })
  }, [])

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // File upload handler
  const handleFileUpload = async (file) => {
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'txt', 'docx'].includes(ext)) {
      toast.error('Unsupported file type. Please upload PDF, TXT, or DOCX.')
      return
    }
    setUploading(true)
    try {
      const result = await uploadRagDocument(file)
      toast.success(`"${result.filename}" indexed (${result.chunks} chunks)`)
      setDocuments(prev => [result, ...prev])
      setActiveDocId(result.document_id)
      setMessages([])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  // Ask question
  const handleAsk = async (e) => {
    e.preventDefault()
    if (!question.trim() || !activeDocId || loading) return
    const q = question.trim()
    setQuestion('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const result = await askRagQuestion(activeDocId, q)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.answer,
        sources: result.sources,
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Error**: ${err.message}`,
        sources: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  // Delete document
  const handleDelete = async (docId) => {
    try {
      await deleteRagDocument(docId)
      setDocuments(prev => prev.filter(d => d.document_id !== docId))
      if (activeDocId === docId) {
        setActiveDocId(null)
        setMessages([])
      }
      toast.success('Document deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  // Copy answer to clipboard
  const copyAnswer = async (text) => {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const activeDoc = documents.find(d => d.document_id === activeDocId)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr] h-[calc(100vh-140px)]">

        {/* ── Left Sidebar ── */}
        <div className="flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10 px-5 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md">
              <Database className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">Document Chat</h2>
              <p className="text-[10px] text-slate-400 font-semibold">RAG · Upload & Ask</p>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="p-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-brand-500 bg-brand-500/5 scale-[1.02]'
                  : 'border-black/10 dark:border-white/10 hover:border-brand-500/40 hover:bg-slate-50 dark:hover:bg-slate-950/40'
              } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <FileUp className={`h-8 w-8 ${dragOver ? 'text-brand-500' : 'text-slate-400'}`} />
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {uploading ? 'Processing...' : 'Drop file or click to upload'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">PDF, TXT, DOCX · Max 20 MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                    Indexing document...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1">Indexed Documents</p>
            {documents.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">No documents yet</p>
            )}
            {documents.map(doc => (
              <div
                key={doc.document_id}
                onClick={() => { setActiveDocId(doc.document_id); setMessages([]) }}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all text-sm ${
                  activeDocId === doc.document_id
                    ? 'bg-brand-500/10 border border-brand-500/20 text-brand-700 dark:text-brand-300'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{doc.filename}</p>
                  <p className="text-[10px] text-slate-400">{doc.chunks} chunks · {doc.file_type.toUpperCase()}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(doc.document_id) }}
                  className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-500 transition-all"
                  title="Delete document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Chat Area ── */}
        <div className="flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                  {activeDoc ? activeDoc.filename : 'Document Chat'}
                </h2>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {activeDoc ? `${activeDoc.chunks} chunks indexed · Ask anything` : 'Upload a document to start'}
                </p>
              </div>
            </div>
            {activeDoc && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Ready
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!activeDoc && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Upload a Document</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Upload a PDF, TXT, or DOCX file. The AI will read it, chunk it, create vector embeddings,
                    and let you ask questions based on the document's content.
                  </p>
                </div>
              </div>
            )}

            {activeDoc && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Document Ready</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-600 dark:text-slate-300">{activeDoc.filename}</strong> has been indexed with{' '}
                    <strong className="text-slate-600 dark:text-slate-300">{activeDoc.chunks} chunks</strong>.
                    Ask any question about its content below.
                  </p>
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                  m.role === 'user' ? 'bg-brand-600' : 'bg-emerald-600'
                }`}>
                  {m.role === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </span>
                <div className={`max-w-[75%] space-y-3 ${m.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 text-slate-800 dark:text-slate-100 rounded-tl-none'
                  }`}>
                    <ReactMarkdown className="prose dark:prose-invert prose-sm break-words max-w-none">
                      {m.content}
                    </ReactMarkdown>
                    {m.role === 'assistant' && !m.content.startsWith('⚠️') && (
                      <button
                        onClick={() => copyAnswer(m.content)}
                        className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-brand-500 transition-colors"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    )}
                  </div>

                  {/* Source previews */}
                  {m.sources && m.sources.length > 0 && (
                    <details className="group text-left">
                      <summary className="cursor-pointer text-[10px] font-semibold text-slate-400 hover:text-brand-500 transition-colors">
                        📄 View {m.sources.length} source chunk{m.sources.length > 1 ? 's' : ''}
                      </summary>
                      <div className="mt-2 space-y-2">
                        {m.sources.map((src, si) => (
                          <div
                            key={si}
                            className="rounded-xl border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/30 p-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed"
                          >
                            <span className="font-mono text-[9px] text-brand-500 block mb-1">{src.chunk_id}</span>
                            {src.text_preview}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Bot className="h-4.5 w-4.5" />
                </span>
                <div className="rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 px-4 py-3 shadow-sm">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleAsk} className="p-4 border-t border-black/10 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-slate-900">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={!activeDocId}
              placeholder={activeDocId ? 'Ask a question about this document...' : 'Upload a document first'}
              className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-4 py-3 text-sm outline-none focus:border-brand-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !question.trim() || !activeDocId}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-lg transition-colors shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
