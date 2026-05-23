import { useState, useRef, useEffect } from 'react'
import { 
  askGroq, saveChatHistory, getHistorySessions, getHistorySession, deleteHistorySession,
  uploadRagDocument, askRagQuestion, getRagDocuments, deleteRagDocument
} from '../services/api'
import { translations } from '../data/translations'
import { Send, Trash2, Brain, Bot, User, MessageSquare, Plus, Loader2, Database, FileUp, FileText, CheckCircle2, Sparkles, Copy, MessageCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'
import ExportButtons from '../components/ExportButtons'

export default function ChatPage({ lang, defaultTab = 'general' }) {
  // Mode selection: 'general' or 'document'
  const [activeTab, setActiveTab] = useState(defaultTab)

  // ---------- General Chat State ----------
  const getDefaultMessage = () => ({
    role: 'assistant',
    content: lang === 'hi'
      ? 'नमस्ते! मैं शिवम नेक्सस एआई सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?'
      : 'Hello! I am Shivam Nexus AI Assistant. How can I help you today?',
  })
  const [messages, setMessages] = useState([getDefaultMessage()])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)

  // ---------- Document Chat State ----------
  const [documents, setDocuments] = useState([])
  const [activeDocId, setActiveDocId] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [docMessages, setDocMessages] = useState([])
  const fileInputRef = useRef(null)

  const chatEndRef = useRef(null)
  const t = translations[lang]

  // Init
  useEffect(() => {
    fetchSessions()
    getRagDocuments().then(docs => {
      setDocuments(docs)
    })
  }, [])

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, docMessages, activeTab])

  // ---------- General Chat Methods ----------
  const fetchSessions = async () => {
    try {
      setSessionsLoading(true)
      const data = await getHistorySessions()
      setSessions(data.filter(s => s.module === 'chat'))
    } catch (err) {
      console.error(err)
    } finally {
      setSessionsLoading(false)
    }
  }

  const handleSendGeneral = async (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const systemPrompt = 'You are Shivam Nexus Assistant, a general-purpose, state-of-the-art AI assistant powered by Groq LLaMA 3.3. Give comprehensive answers.'

    try {
      const answer = await askGroq(systemPrompt, userMsg, messages)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
      
      const result = await saveChatHistory(sessionId, 'chat', userMsg, answer)
      if (result && result.session_id) {
        const isNewSession = !sessionId;
        setSessionId(result.session_id)
        if (isNewSession) fetchSessions()
      }
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ **AI Service Error**: ${error.message}` }
      ])
    } finally {
      setLoading(false)
    }
  }

  const startNewChat = () => {
    setActiveTab('general')
    setMessages([getDefaultMessage()])
    setSessionId(null)
  }

  const loadSession = async (id) => {
    try {
      setActiveTab('general')
      setLoading(true)
      const data = await getHistorySession(id)
      setSessionId(id)
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages)
      } else {
        setMessages([getDefaultMessage()])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load chat history.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this chat?')) return
    try {
      await deleteHistorySession(id)
      toast.success('Chat deleted')
      if (sessionId === id) startNewChat()
      fetchSessions()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete chat')
    }
  }

  // ---------- Document Chat Methods ----------
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
      selectDocument(result.document_id)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileUpload(file)
  }

  const selectDocument = (id) => {
    setActiveTab('document')
    setActiveDocId(id)
    setDocMessages([])
  }

  const handleSendDocument = async (e) => {
    e.preventDefault()
    if (!input.trim() || !activeDocId || loading) return
    const q = input.trim()
    setInput('')
    setDocMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)
    try {
      const result = await askRagQuestion(activeDocId, q)
      setDocMessages(prev => [...prev, {
        role: 'assistant',
        content: result.answer,
        sources: result.sources,
      }])
    } catch (err) {
      setDocMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ **Error**: ${err.message}`,
        sources: [],
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (e, docId) => {
    e.stopPropagation()
    try {
      await deleteRagDocument(docId)
      setDocuments(prev => prev.filter(d => d.document_id !== docId))
      if (activeDocId === docId) {
        setActiveDocId(null)
        setDocMessages([])
      }
      toast.success('Document deleted')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const copyAnswer = async (text) => {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  const activeDoc = documents.find(d => d.document_id === activeDocId)
  const isRtl = false

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid gap-8 lg:grid-cols-[320px_1fr] h-[calc(100vh-140px)]">
        
        {/* ── Left Sidebar ── */}
        <div className="hidden lg:flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Top Actions */}
          <div className="p-4 space-y-3 border-b border-black/10 dark:border-white/10">
            <button
              onClick={startNewChat}
              className="flex items-center gap-2 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span>New General Chat</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'general' ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500'
                }`}
              >
                Chats
              </button>
              <button
                onClick={() => setActiveTab('document')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'document' ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500'
                }`}
              >
                Documents
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {activeTab === 'general' ? (
              <>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 pt-2 pb-1">Recent Chats</div>
                {sessionsLoading ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-5 w-5 animate-spin text-brand-500" /></div>
                ) : sessions.length === 0 ? (
                  <div className="text-center p-4 text-sm text-slate-500">No history yet.</div>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.session_id}
                      onClick={() => loadSession(session.session_id)}
                      className={`group flex flex-col gap-1 rounded-xl p-3 cursor-pointer transition-colors border ${
                        sessionId === session.session_id && activeTab === 'general'
                          ? 'bg-brand-50 border-brand-200 dark:bg-brand-500/10 dark:border-brand-500/20'
                          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <MessageSquare className={`h-4 w-4 shrink-0 ${sessionId === session.session_id && activeTab === 'general' ? 'text-brand-500' : 'text-slate-400'}`} />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                            {session.title || 'New Conversation'}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteSession(e, session.session_id)}
                          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 px-6">{formatDate(session.updated_at)}</div>
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                <div className="px-2 mb-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 cursor-pointer transition-all ${
                      dragOver ? 'border-brand-500 bg-brand-500/5' : 'border-black/10 dark:border-white/10 hover:border-brand-500/40 hover:bg-slate-50 dark:hover:bg-slate-950/40'
                    } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    <FileUp className={`h-6 w-6 ${dragOver ? 'text-brand-500' : 'text-slate-400'}`} />
                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{uploading ? 'Indexing...' : 'Upload Document'}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">PDF, TXT, DOCX</p>
                    </div>
                    <input ref={fileInputRef} type="file" accept=".pdf,.txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
                  </div>
                </div>

                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 pt-2 pb-1">Indexed Documents</div>
                {documents.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No documents yet</p>}
                {documents.map(doc => (
                  <div
                    key={doc.document_id}
                    onClick={() => selectDocument(doc.document_id)}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all text-sm ${
                      activeDocId === doc.document_id && activeTab === 'document'
                        ? 'bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{doc.filename}</p>
                      <p className="text-[10px] text-slate-400">{doc.chunks} chunks</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteDocument(e, doc.document_id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-500 transition-all p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Right Chat Area ── */}
        <div className="flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center gap-3">
              {activeTab === 'general' ? (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                    <Brain className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">General AI Chat</h2>
                    <p className="text-[10px] text-slate-400 font-semibold">LLaMA 3.3 via Groq</p>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-md">
                    <Database className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                      {activeDoc ? activeDoc.filename : 'Document Chat'}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      {activeDoc ? `${activeDoc.chunks} chunks indexed` : 'Select a document to ask questions'}
                    </p>
                  </div>
                  {activeDoc && (
                    <span className="ml-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Ready
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Conversation Timeline */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'document' && !activeDoc && docMessages.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                   <FileText className="h-8 w-8 text-slate-400" />
                 </div>
                 <div className="space-y-2 max-w-sm">
                   <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Select a Document</h3>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     Upload or select a document from the sidebar to start asking questions about its content.
                   </p>
                 </div>
               </div>
            )}

            {(activeTab === 'general' ? messages : docMessages).map((m, idx) => (
              <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                  m.role === 'user' ? 'bg-brand-600' : (activeTab === 'general' ? 'bg-slate-700 dark:bg-slate-800' : 'bg-emerald-600')
                }`}>
                  {m.role === 'user' ? <User className="h-4.5 w-4.5" /> : (activeTab === 'general' ? <Bot className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />)}
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
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() => copyAnswer(m.content)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-brand-500 transition-colors"
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </button>
                        <ExportButtons 
                          title={activeTab === 'document' ? "Document Chat Report" : "AI Chat Response"} 
                          content={m.content} 
                        />
                      </div>
                    )}
                  </div>
                  
                  {activeTab === 'document' && m.sources && m.sources.length > 0 && (
                    <details className="group text-left">
                      <summary className="cursor-pointer text-[10px] font-semibold text-slate-400 hover:text-emerald-500 transition-colors">
                        📄 View {m.sources.length} source chunk{m.sources.length > 1 ? 's' : ''}
                      </summary>
                      <div className="mt-2 space-y-2">
                        {m.sources.map((src, si) => (
                          <div key={si} className="rounded-xl border border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-slate-950/30 p-3 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            <span className="font-mono text-[9px] text-emerald-500 block mb-1">{src.chunk_id}</span>
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
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${activeTab === 'general' ? 'bg-slate-700 dark:bg-slate-800' : 'bg-emerald-600'}`}>
                  {activeTab === 'general' ? <Bot className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
                </span>
                <div className="rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 px-4 py-3 shadow-sm">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className={`h-2 w-2 animate-bounce rounded-full ${activeTab === 'general' ? 'bg-brand-500' : 'bg-emerald-500'}`}></span>
                    <span className={`h-2 w-2 animate-bounce rounded-full ${activeTab === 'general' ? 'bg-brand-500' : 'bg-emerald-500'} [animation-delay:0.2s]`}></span>
                    <span className={`h-2 w-2 animate-bounce rounded-full ${activeTab === 'general' ? 'bg-brand-500' : 'bg-emerald-500'} [animation-delay:0.4s]`}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Panel */}
          <form onSubmit={activeTab === 'general' ? handleSendGeneral : handleSendDocument} className="p-4 border-t border-black/10 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={activeTab === 'document' && !activeDocId}
              placeholder={activeTab === 'general' ? t.placeholderInput : (activeDocId ? 'Ask a question about this document...' : 'Select a document first')}
              className={`flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-4 py-3 text-sm outline-none transition-colors disabled:opacity-50 ${
                activeTab === 'general' ? 'focus:border-brand-500' : 'focus:border-emerald-500'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !input.trim() || (activeTab === 'document' && !activeDocId)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg transition-colors shrink-0 disabled:opacity-50 ${
                activeTab === 'general' ? 'bg-brand-600 hover:bg-brand-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
