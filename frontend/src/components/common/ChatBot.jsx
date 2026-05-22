import { useState, useRef, useEffect } from 'react'
import { askGroq } from '../../services/api'
import { translations } from '../../data/translations'
import { MessageSquare, X, Send, Trash2, Brain } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function ChatBot({ lang }) {
  const [isOpen, setIsOpen] = useState(false)
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

    const systemPrompt = `You are Shivam Nexus AI Assistant, an advanced AI module helper built by Shivam Maurya (an aspiring AI Engineer from Mumbai, India). Help the user answer questions about coding, technology, study advice, career tips, legal guidance, health queries, or business intelligence. Ensure you respond in the language they request (${lang === 'hi' ? 'Hindi' : 'English'}). Always maintain a professional, helpful tone.`

    try {
      const answer = await askGroq(systemPrompt, userMsg, messages)
      setMessages(prev => [...prev, { role: 'assistant', content: answer }])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ **AI Service Error**: ${error.message || 'An unexpected error occurred. Please check your connection.'}` }
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
  }

  const isRtl = false

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="mb-4 h-[480px] w-[350px] sm:w-[400px] flex flex-col rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-cyan-600 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                <Brain className="h-4 w-4" />
              </span>
              <div>
                <h3 className="font-display text-sm font-semibold">{t.title} Chat</h3>
                <p className="text-[10px] text-white/80">Llama 3.3 Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearHistory} title={t.clearHistory} className="text-white/80 hover:text-white transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-black/5 dark:border-white/5'
                  }`}
                >
                  <ReactMarkdown className="prose dark:prose-invert prose-sm leading-relaxed break-words">
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-none border border-black/5 dark:border-white/5 bg-white dark:bg-slate-800 px-4 py-3 shadow-sm">
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
          <form onSubmit={handleSend} className="p-3 border-t border-black/10 dark:border-white/10 flex items-center gap-2 bg-white dark:bg-slate-900">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholderInput}
              className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 px-3.5 py-2 text-sm outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-md transition-colors"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-12 hover:shadow-brand-500/20"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>
    </div>
  )
}
