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

/** Analyze resume against job description */
export async function analyzeResume(file, jobDescription) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_description', jobDescription)
    const res = await api.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000, // 3 mins for API
    })
    return res.data
  } catch (error) {
    console.error('Resume Analysis Error:', error)
    const serverMsg = error.response?.data?.detail
    if (serverMsg) throw new Error(serverMsg)
    throw new Error('Failed to analyze resume.')
  }
}

/** Run Agentic AI Workflow */
export async function runAgentWorkflow(task, mode) {
  try {
    const res = await api.post('/agents/run', { task, mode }, {
      timeout: 300000, // 5 mins since it calls LLM 4 times
    })
    return res.data
  } catch (error) {
    console.error('Agent Workflow Error:', error)
    const serverMsg = error.response?.data?.detail
    if (serverMsg) throw new Error(serverMsg)
    throw new Error('Failed to run agent workflow.')
  }
}

/** Search Live Jobs */
export async function searchJobs(keyword, location, limit = 20) {
  try {
    const res = await api.get('/jobs/search', {
      params: { keyword, location, limit },
      timeout: 30000, // 30s timeout for external APIs
    })
    return res.data
  } catch (error) {
    console.error('Job Search Error:', error)
    const serverMsg = error.response?.data?.detail
    if (serverMsg) throw new Error(serverMsg)
    throw new Error('Failed to search jobs.')
  }
}

// ---------------------------------------------------------------------------
// Chat History API functions
// ---------------------------------------------------------------------------

/** Save chat history */
export async function saveChatHistory(sessionId, module, userMessage, aiResponse) {
  try {
    const res = await api.post('/history/save', {
      session_id: sessionId,
      module,
      user_message: userMessage,
      ai_response: aiResponse
    })
    return res.data
  } catch (error) {
    console.error('Save Chat History Error:', error)
    // we don't throw to avoid crashing the chat flow
    return null
  }
}

/** Get list of all chat sessions */
export async function getHistorySessions() {
  try {
    const res = await api.get('/history/sessions')
    return res.data.sessions
  } catch (error) {
    console.error('Get History Sessions Error:', error)
    return []
  }
}

/** Get a specific chat session's messages */
export async function getHistorySession(sessionId) {
  try {
    const res = await api.get(`/history/sessions/${sessionId}`)
    return res.data
  } catch (error) {
    console.error('Get History Session Error:', error)
    throw new Error('Failed to get session messages.')
  }
}

/** Delete a specific chat session */
export async function deleteHistorySession(sessionId) {
  try {
    const res = await api.delete(`/history/sessions/${sessionId}`)
    return res.data
  } catch (error) {
    console.error('Delete History Session Error:', error)
    throw new Error('Failed to delete session.')
  }
}

// ---------------------------------------------------------------------------
// Export API functions
// ---------------------------------------------------------------------------

export async function exportPdf(title, content) {
  try {
    const res = await api.post('/export/pdf', { title, content }, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Convert title to safe filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'report'
    link.setAttribute('download', `${safeTitle}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    console.error('PDF Export Error:', error)
    throw new Error('Failed to export PDF.')
  }
}

export async function exportDocx(title, content) {
  try {
    const res = await api.post('/export/docx', { title, content }, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Convert title to safe filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'report'
    link.setAttribute('download', `${safeTitle}.docx`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  } catch (error) {
    console.error('DOCX Export Error:', error)
    throw new Error('Failed to export DOCX.')
  }
}

export default api
