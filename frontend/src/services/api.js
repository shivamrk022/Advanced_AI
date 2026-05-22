import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API_BASE = `${API_BASE_URL}/api`;

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
      throw new Error(serverMsg)
    }

    // Network / timeout — likely server not running or starting up
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('The AI server request timed out. Please wait a moment and try again.')
    }

    // Generic connection failure
    throw new Error('Could not reach the AI backend.')
  }
}

export default api
