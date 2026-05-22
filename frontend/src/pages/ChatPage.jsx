import { useState, useRef, useEffect } from 'react'
import { askGroq } from '../services/api'
import { translations } from '../data/translations'
import { Send, Trash2, Brain, Bot, User, Trash, Settings2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function ChatPage({ lang }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: lang === 'hi'
        ? 'नमस्ते! मैं शिवम नेक्सस एआई सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?'
        : 'Hello! I am Shivam Nexus AI Assistant. How can I help you today?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)
  const t = translations[lang]

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (e) => {
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
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ **AI Service Error**: ${error.message || 'Could not contact Groq LLaMA 3.3. Verify network config.'}` }
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: lang === 'hi'
          ? 'नमस्ते! मैं शिवम नेक्सस एआई सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?'
          : 'Hello! I am Shivam Nexus AI Assistant. How can I help you today?',
      },
    ])
    toast.success('Chat history cleared')
  }

  const isRtl = false

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr] h-[calc(100vh-140px)]">
        {/* Left Side: Sidebar / Quick actions / Settings */}
        <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 p-6 space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                <Settings2 className="h-4.5 w-4.5" />
              </span>
              <h2 className="font-display text-sm font-bold text-slate-800 dark:text-white">Workspace Config</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 space-y-2 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Active LLM Model</span>
                <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">llama-3.3-70b-versatile</span>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 space-y-2 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Context Window</span>
                <span className="font-mono font-semibold">128k Tokens</span>
              </div>
            </div>
          </div>

          <button
            onClick={clearHistory}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-rose-500/10 hover:bg-rose-500/5 hover:border-rose-500/20 px-4 py-2.5 text-xs font-semibold text-rose-500 transition-colors"
          >
            <Trash className="h-4 w-4" />
            <span>{t.clearHistory}</span>
          </button>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md">
                <Brain className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white">General AI Assistant</h2>
                <p className="text-[10px] text-slate-400 font-semibold">LLaMA 3.3 via Groq</p>
              </div>
            </div>
            <button
              onClick={clearHistory}
              title={t.clearHistory}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 text-rose-500 hover:bg-rose-500/5 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Conversation Timeline */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
                  m.role === 'user' ? 'bg-brand-600' : 'bg-slate-700 dark:bg-slate-800'
                }`}>
                  {m.role === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </span>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 text-slate-800 dark:text-slate-100 rounded-tl-none'
                }`}>
                  <ReactMarkdown className="prose dark:prose-invert prose-sm break-words max-w-none">
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 dark:bg-slate-800 text-white">
                  <Bot className="h-4.5 w-4.5" />
                </span>
                <div className="rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 px-4 py-3 shadow-sm">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:0.2s]"></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:0.4s]"></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSend} className="p-4 border-t border-black/10 dark:border-white/10 flex items-center gap-3 bg-white dark:bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholderInput}
              className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-4 py-3 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-lg transition-colors shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
