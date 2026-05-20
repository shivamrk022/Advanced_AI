import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({ baseURL: API_BASE, timeout: 60000 })

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
    const serverMsg = error.response?.data?.detail
    if (serverMsg) {
      return `Backend Error: ${serverMsg}`
    }
    return `Connection Error: Could not connect to the backend server.\n\nMake sure the FastAPI server is running on port 8000 and your GROQ_API_KEY is configured in the .env file.`
  }
}

export default api
