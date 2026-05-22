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

// ---------------------------------------------------------------------------
// RAG Document Chat API functions
// ---------------------------------------------------------------------------

/** Upload a document for RAG indexing */
export async function uploadRagDocument(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/rag/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,  // 2 minutes for large files
    })
    return res.data
  } catch (error) {
    console.error('RAG Upload Error:', error)
    const serverMsg = error.response?.data?.detail
    if (serverMsg) throw new Error(serverMsg)
    throw new Error('Failed to upload document.')
  }
}

/** Ask a question about an uploaded document */
export async function askRagQuestion(documentId, question) {
  try {
    const res = await api.post('/rag/ask', {
      document_id: documentId,
      question,
    })
    return res.data
  } catch (error) {
    console.error('RAG Ask Error:', error)
    const serverMsg = error.response?.data?.detail
    if (serverMsg) throw new Error(serverMsg)
    throw new Error('Failed to get answer from document.')
  }
}

/** Get list of all indexed documents */
export async function getRagDocuments() {
  try {
    const res = await api.get('/rag/documents')
    return res.data.documents
  } catch (error) {
    console.error('RAG Documents Error:', error)
    return []
  }
}

/** Delete an indexed document */
export async function deleteRagDocument(documentId) {
  try {
    const res = await api.delete(`/rag/documents/${documentId}`)
    return res.data
  } catch (error) {
    console.error('RAG Delete Error:', error)
    const serverMsg = error.response?.data?.detail
    if (serverMsg) throw new Error(serverMsg)
    throw new Error('Failed to delete document.')
  }
}

export default api
