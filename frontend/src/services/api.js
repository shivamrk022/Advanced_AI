import axios from 'axios'

const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'https://advanced-ai-1gz7.onrender.com') + '/api'

const api = axios.create({ baseURL: API_BASE, timeout: 90000 })

// Route AI queries through the backend FastAPI proxy
export async function askGroq(systemPrompt, userMessage, history = []) {
  try {
    const res = await api.post('/ask', {
      system_prompt: systemPrompt,
      user_message: userMessage,
      history: history.map(h => ({ role: h.role, content: h.content }))
    })
    return res.data.response
  } catch (error) {
    console.error('API Error:', error)

    // Backend returned a structured error
    const serverMsg = error.response?.data?.detail
    if (serverMsg) {
      return `⚠️ ${serverMsg}`
    }

    // Network / timeout — likely Render cold start
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return `⏳ The AI server is waking up (Render free tier sleeps after inactivity). Please wait 30–60 seconds and try again.`
    }

    // Generic connection failure
    return `⚠️ Could not reach the AI backend. The server may be starting up — please try again in a moment.\n\nBackend: ${API_BASE}`
  }
}

export default api
