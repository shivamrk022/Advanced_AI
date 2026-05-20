import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiClipboard, FiZap } from 'react-icons/fi'
import Section from './Section'

const defaultPrompt = 'Build an AI chatbot for my portfolio website that can answer recruiter questions about my skills and projects.'

function localOptimize(text) {
  return `Act as a senior AI product engineer and portfolio mentor. Improve and implement the following request with production-quality structure, clean UI, error handling and clear documentation:\n\nGoal: ${text}\n\nRequirements:\n1. Explain the final feature clearly for a recruiter.\n2. Use a clean React frontend and API-ready architecture.\n3. Add fallback behavior if the AI API is unavailable.\n4. Keep code modular, readable and beginner-friendly.\n5. Include setup, run and deployment instructions.\n\nExpected output: complete files, folder structure, code comments where useful, and a short explanation of how the feature works.`
}

export default function PromptTool() {
  const [prompt, setPrompt] = useState(defaultPrompt)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  async function optimize() {
    const cleanPrompt = prompt.trim()
    if (!cleanPrompt) return toast.error('Please enter a prompt first.')
    setLoading(true)
    try {
      if (!apiKey) {
        setResult(localOptimize(cleanPrompt))
        toast('Offline optimizer used. Add Groq key for live AI optimization.')
        return
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert prompt engineer. Rewrite user prompts into clear, structured, implementation-ready prompts for AI coding agents. Keep output practical and concise.',
            },
            { role: 'user', content: cleanPrompt },
          ],
          temperature: 0.25,
        }),
      })
      if (!response.ok) throw new Error('Groq request failed')
      const data = await response.json()
      setResult(data.choices?.[0]?.message?.content || localOptimize(cleanPrompt))
    } catch (error) {
      setResult(localOptimize(cleanPrompt))
      toast.error('AI optimizer failed, so fallback optimizer was used.')
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    toast.success('Optimized prompt copied!')
  }

  return (
    <Section
      id="prompt-tool"
      eyebrow="Prompt Optimizer"
      title="AI prompt optimizer tool."
      subtitle="Transform rough ideas into clear, structured, implementation-ready prompts. Showcasing prompt engineering skills with real-time AI enhancement."
      className="bg-surface/50"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-midnight/70 p-6">
          <label className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Your rough prompt</label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={10}
            className="mt-4 w-full resize-none rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white outline-none placeholder:text-slate-500 focus:border-primary/60"
            placeholder="Write a rough prompt here..."
          />
          <button onClick={optimize} className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-midnight transition hover:bg-secondary">
            <FiZap /> {loading ? 'Optimizing...' : 'Optimize Prompt'}
          </button>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-midnight/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm font-bold uppercase tracking-[0.25em] text-primary">Optimized output</label>
            <button onClick={copyResult} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:border-primary/50 hover:text-primary">
              <FiClipboard /> Copy
            </button>
          </div>
          <pre className="mt-4 min-h-[280px] whitespace-pre-wrap rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-300">
            {result || 'Your optimized prompt will appear here.'}
          </pre>
        </div>
      </div>
    </Section>
  )
}
