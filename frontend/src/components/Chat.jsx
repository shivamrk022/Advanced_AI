import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { FiSend, FiCpu } from 'react-icons/fi'
import Section from './Section'
import { profile } from '../data/profile'

const starterQuestions = [
  'Tell me about Shivam',
  'What AI projects has Shivam built?',
  'Explain his skills for an AI/ML role',
  'Why should a recruiter shortlist him?',
]

function localAnswer(question) {
  const lower = question.toLowerCase()
  if (lower.includes('project')) {
    return `${profile.name}'s featured projects include an Agentic AI Business Automation Platform, a Local AI Assistant with Ollama, an AI Resume and Interview Preparation Assistant, and an Industrial AI Website with Smart Chatbot. These show RAG, LLM apps, FastAPI, React and automation skills.`
  }
  if (lower.includes('skill') || lower.includes('tech')) {
    return `${profile.name}'s core stack includes Python, Machine Learning, FastAPI, React, Tailwind CSS, RAG, LLM apps, AI agents, Ollama, Groq API, n8n workflows, SQL, Git and GitHub.`
  }
  if (lower.includes('shortlist') || lower.includes('hire') || lower.includes('recruiter')) {
    return `A recruiter can shortlist ${profile.name} because he is building practical AI/ML and automation projects with a deployable full-stack approach, clear documentation and interview-ready explanations around RAG, agents and LLM workflows.`
  }
  return `${profile.name} is a final-year B.Tech Artificial Intelligence & Machine Learning student from ${profile.education.college}. He is focused on AI agents, RAG systems, LLM apps, FastAPI, React and automation workflows.`
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I am Shivam's AI portfolio assistant. Ask me about his skills, projects, education or AI/ML focus.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  const systemPrompt = useMemo(
    () =>
      `You are an AI assistant for ${profile.name}'s portfolio. Answer in a recruiter-friendly way. Facts: ${JSON.stringify({
        role: profile.role,
        education: profile.education,
        skills: profile.skills,
        projects: profile.projects.map((project) => ({ title: project.title, description: project.description, tech: project.tech })),
        links: { github: profile.githubUrl, linkedin: profile.linkedinUrl, email: profile.email },
      })}`,
    [],
  )

  async function askGroq(userText) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.slice(-5),
          { role: 'user', content: userText },
        ],
        temperature: 0.35,
      }),
    })

    if (!response.ok) throw new Error('Groq API error')
    const data = await response.json()
    return data.choices?.[0]?.message?.content || localAnswer(userText)
  }

  async function sendMessage(text = input) {
    const userText = text.trim()
    if (!userText || loading) return
    setInput('')
    setMessages((previous) => [...previous, { role: 'user', content: userText }])
    setLoading(true)

    try {
      const answer = apiKey ? await askGroq(userText) : localAnswer(userText)
      setMessages((previous) => [...previous, { role: 'assistant', content: answer }])
      if (!apiKey) toast('Offline demo mode: add VITE_GROQ_API_KEY for live AI responses.')
    } catch (error) {
      setMessages((previous) => [...previous, { role: 'assistant', content: localAnswer(userText) }])
      toast.error('AI API failed, so fallback portfolio answer was used.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section
      id="chat-section"
      eyebrow="AI Chatbot"
      title="Ask my AI portfolio assistant."
      subtitle="Powered by Groq API and LLaMA 3.3 70B. Ask anything about my skills, projects, education, or why you should hire me — with smart offline fallback built in."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-surface/70 p-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <FiCpu size={24} />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Portfolio Q&A</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Ask about my education, AI/ML skills, projects, or career direction. Powered by LLaMA 3.3 70B via Groq — with intelligent offline answers when no API key is configured.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {starterQuestions.map((question) => (
              <button key={question} onClick={() => sendMessage(question)} className="rounded-full border border-white/10 px-4 py-2 text-left text-xs font-bold text-slate-300 hover:border-primary/50 hover:text-primary">
                {question}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-4">
          <div className="h-[420px] space-y-4 overflow-y-auto rounded-[1.5rem] border border-white/10 bg-midnight/70 p-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 ${message.role === 'user' ? 'bg-primary text-midnight' : 'bg-white/5 text-slate-200 border border-white/10'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm font-semibold text-primary">Thinking...</p>}
          </div>
          <form
            className="mt-4 flex gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              sendMessage()
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about skills, projects or education..."
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-primary/60"
            />
            <button className="rounded-2xl bg-primary px-5 py-3 font-bold text-midnight transition hover:bg-secondary" type="submit" aria-label="Send message">
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </Section>
  )
}
