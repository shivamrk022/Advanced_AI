# <p align="center">🔮 SHIVAM NEXUS — AI SUPER PLATFORM</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-f59e0b?style=for-the-badge&logo=thunderstore&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
</p>

<p align="center">
  <a href="https://github.com/shivamrk022/Advanced_AI">
    <img src="https://img.shields.io/github/stars/shivamrk022/Advanced_AI?style=social" />
  </a>
  <img src="https://img.shields.io/badge/status-live-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" />
  <a href="https://advanced-ai-eta.vercel.app">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-advanced--ai--eta.vercel.app-6366f1?style=flat-square" />
  </a>
</p>

<p align="center">
  <strong>A production-grade, multi-module AI assistant platform for students, professionals, and businesses.</strong><br/>
  Built by <a href="https://github.com/shivamrk022"><strong>Shivam Maurya</strong></a> · Mumbai, India 🇮🇳
</p>

---

## 🌐 Live Deployment

| Service | URL | Status |
|---------|-----|--------|
| **Frontend (Vercel)** | https://advanced-ai-eta.vercel.app | ✅ Live |
| **Backend API (Render)** | https://advanced-ai-1gz7.onrender.com | ✅ Live |
| **API Health Check** | https://advanced-ai-1gz7.onrender.com/api/health | ✅ Active |
| **Swagger API Docs** | https://advanced-ai-1gz7.onrender.com/docs | ✅ Active |

> ⚠️ **Note:** The Render free tier spins down after 15 minutes of inactivity. The **first request** may take 30–60 seconds to wake the server. Subsequent requests are instant.

---

## 📄 Project Overview

**Shivam Nexus** is a full-stack AI Super Platform powered by **Groq's LLaMA 3.3 70B** model.

The architecture uses a **secure decoupled design**:
- **React + Vite frontend** handles all UI, routing, and language switching
- **FastAPI backend** securely proxies all AI requests to Groq — your API key is **never exposed** to the browser

> This project demonstrates: Full-Stack Development · LLM Integration · API Gateway Architecture · Prompt Engineering · Hindi/English Localization · Secure Key Management · Cloud Deployment (Vercel + Render)

---

## 🚀 AI Modules (9 Workspaces)

| # | Module | Description |
|---|--------|-------------|
| 🎓 | **Student Hub** | Study planner, quiz generator, ELI5 concept explainer |
| 💼 | **AI Career & CV** | ATS resume builder, cover letter optimizer, email templates |
| 🩺 | **Health Assistant** | Symptom checker, medication guide, wellness routines (with safety disclaimers) |
| ⚖ | **Legal Advisor** | Indian law explainer, rights guide, legal draft generation |
| 🔍 | **Live Job Search** | Job query simulation with city and role filters |
| 💻 | **Portfolio Builder** | Instant Markdown portfolio generator from your details |
| 📊 | **Business Intelligence** | Startup planner, competitor analysis, marketing content |
| 💬 | **General AI Chat** | Full-page conversational workspace with chat history |
| 📁 | **RAG Document Chat** | Upload PDF/TXT/DOCX, parse text, chunk, index to local ChromaDB, and query with AI |

---

## 🎨 Key Features

- ✅ **9 specialized AI modules** with custom system prompts
- ✅ **RAG Document Q&A** — Ask questions from uploaded PDF/TXT/DOCX documents locally
- ✅ **Dark / Light mode** with glassmorphic UI design
- ✅ **English & Hindi** dual localization
- ✅ **Secure backend proxy** — API key never exposed in browser
- ✅ **Professional Logo** with custom SVG vector design
- ✅ **Responsive design** — works on mobile, tablet, and desktop
- ✅ **Live deployment** on Vercel + Render

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | FastAPI, Python 3.10+, Uvicorn, ChromaDB, SentenceTransformers (`all-MiniLM-L6-v2`), PyMuPDF, python-docx |
| **AI Model** | LLaMA 3.3 70B via Groq API (with offline chunk summary fallback) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render (Free Tier) |
| **Languages** | English + Hindi |

---

## 📂 Folder Structure

```
Advanced_AI/
│
├── backend/
│   ├── routes/
│   │   └── rag.py            # RAG endpoints (upload, ask, list, delete)
│   ├── services/
│   │   ├── document_service.py # PyMuPDF/python-docx parsers & chunkers
│   │   └── rag_service.py    # Embeddings generator & ChromaDB manager
│   ├── main.py               # FastAPI server startup & general chat
│   ├── requirements.txt      # Python dependencies
│   ├── Procfile              # Render deployment start command
│   └── .env.example          # Backend env variables template
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ChatBot, Logo
│   │   ├── pages/            # Home, ModulePage, ChatPage, DocumentChat
│   │   ├── data/             # modules.js, translations.js
│   │   ├── services/         # api.js (Axios client → Render backend)
│   │   └── context/          # ThemeContext (dark/light)
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── render.yaml               # Render deployment config
├── .env.example              # Root environment variables template
├── .gitignore                # Excludes .env, node_modules, __pycache__, DBs
├── run_all.bat               # Windows one-click launcher (local dev)
└── README.md
```

---

## ⚙️ Local Development Setup

### Step 1 — Clone the Repository
```bash
git clone https://github.com/shivamrk022/Advanced_AI.git
cd Advanced_AI
```

### Step 2 — Configure Environment Variables
```bash
copy .env.example .env
```
Edit `.env` and add your free Groq key:
```env
GROQ_API_KEY=gsk_your_free_key_here
VITE_BACKEND_URL=http://localhost:8000
VITE_GITHUB_USERNAME=shivamrk022
```
> Get your free Groq API key at → [https://console.groq.com](https://console.groq.com)

### Step 3 — Run (Windows One-Click)
```powershell
.\run_all.bat
```
This opens two terminal windows — backend on port `8000`, frontend on port `5173`.

### Step 3 (Manual) — Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### Step 3 (Manual) — Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Cloud Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service
2. Connect `shivamrk022/Advanced_AI`
3. Set **Root Directory**: `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add env variable: `GROQ_API_KEY=your_key`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect `shivamrk022/Advanced_AI`
3. Set **Root Directory**: `frontend`
4. Add env variable: `VITE_BACKEND_URL=https://your-render-url.onrender.com`

---

## 🛰️ API Reference

### `GET /`
Health and info ping.
```json
{ "message": "Shivam Nexus API is running", "docs": "/docs", "health": "/api/health" }
```

### `GET /api/health`
```json
{
  "status": "healthy",
  "backend": "healthy",
  "database": "healthy",
  "ai_provider": "healthy",
  "rag": "available",
  "vector_db": "connected",
  "indexed_documents": 0,
  "timestamp": "2026-05-22T19:17:44.277676Z"
}
```

### `POST /api/ask`
```json
// Request
{
  "system_prompt": "You are a legal advisor specializing in Indian law.",
  "user_message": "Explain the Right to Information Act.",
  "history": []
}

// Response
{
  "response": "The Right to Information Act (RTI) 2005 grants citizens the right to..."
}
```

### `POST /api/rag/upload`
Upload PDF/TXT/DOCX for semantic chunking and index creation.
```json
// Response
{
  "document_id": "unique_id",
  "filename": "document.pdf",
  "file_type": "pdf",
  "chunks": 25,
  "status": "indexed",
  "message": "Document uploaded and indexed successfully"
}
```

### `POST /api/rag/ask`
Ask questions against a specific document using local ChromaDB contexts and Groq LLaMA 3.3.
```json
// Request
{
  "document_id": "unique_id",
  "question": "What is the passcode?"
}

// Response
{
  "answer": "The passcode is...",
  "document_id": "unique_id",
  "sources": [
    {
      "chunk_id": "chunk_0",
      "text_preview": "The passcode is..."
    }
  ]
}
```

### `GET /api/rag/documents`
Lists all uploaded and indexed documents.

### `DELETE /api/rag/documents/{id}`
Deletes vector collection, local upload file, and metadata index.

---

## 🔧 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| First message takes 60s | Render free tier cold start | Wait 30–60s, then retry. Subsequent requests are instant. |
| `localhost:5173` not loading | Port in use by another process | Try `http://localhost:5174` or close other Node servers |
| `run_all.bat` not recognized in PowerShell | PowerShell requires `.\` prefix | Type `.\run_all.bat` |
| `503 AI service not configured` | `GROQ_API_KEY` missing on Render | Add key in Render → Environment Variables |
| Slow first file upload | Embedding model loading | The backend takes 5-10 seconds to load the sentence transformer model into memory during the first upload. Subsequent queries/uploads are fast. |

---

## 🔐 Security

- `GROQ_API_KEY` is **only loaded server-side** in the FastAPI backend on Render
- The key is **never sent to the browser** or included in any frontend build bundle
- `.env` is excluded from git via `.gitignore`

---

## 👤 About the Author

**Shivam Maurya** · Aspiring AI Engineer  
B.Tech in Artificial Intelligence & Machine Learning  
St. John College of Engineering and Management, Mumbai (2022–2026)

<p>
  <a href="https://github.com/shivamrk022">
    <img src="https://img.shields.io/badge/GitHub-shivamrk022-181717?style=for-the-badge&logo=github" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/shivam-maurya-4628a3291/">
    <img src="https://img.shields.io/badge/LinkedIn-Shivam_Maurya-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
  &nbsp;
  <a href="mailto:shivamaurya9702@gmail.com">
    <img src="https://img.shields.io/badge/Email-shivamaurya9702@gmail.com-EA4335?style=for-the-badge&logo=gmail" />
  </a>
</p>

---

<p align="center">
  ⭐ <strong>Star this repo if you found it useful!</strong>
  <br/>
  Built with ❤️ in Mumbai, India
</p>
