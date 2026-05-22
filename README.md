# Shivam Nexus — Full-Stack Agentic AI Productivity Platform

## Description
A full-stack AI productivity platform built with React, FastAPI, Groq LLaMA, RAG, ATS resume analysis, agentic AI workflows, real job search, chat history, export reports, user dashboard, and admin analytics.

## Features
- **AI Chat:** Converse with Groq LLaMA 3.3 for seamless and incredibly fast chat interactions.
- **RAG Document Chat:** Upload PDF, DOCX, or TXT documents, extract content, and chat directly with your files using Retrieval-Augmented Generation.
- **ATS Resume Analyzer:** Optimize resumes for applicant tracking systems. Get scores, keyword matches, and actionable AI feedback.
- **Agentic AI Workflow:** Run complex, multi-agent workflows including Planner, Researcher, Writer, and Critic agents.
- **Real Backend Job Search:** Search live jobs across global locations.
- **Chat History:** Automatically save your interactions for future reference.
- **Export PDF/DOCX:** Export AI chats, workflows, and analyses to downloadable documents.
- **User Productivity Dashboard:** A centralized, beautiful hub for tracking all your recent activity and continuing where you left off.
- **Admin Analytics Dashboard:** Monitor comprehensive backend API metrics, system health, database connection, and total events.
- **Bilingual Support:** Seamlessly switch between English and Hindi interfaces.

## Tech Stack
**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios
- Framer Motion

**Backend:**
- FastAPI (Python)
- Groq API (LLaMA)
- SQLite
- ChromaDB & sentence-transformers (RAG)
- PyMuPDF, python-docx, reportlab

**Deployment:**
- Frontend: Vercel
- Backend: Render

## Folder Structure
```
.
├── backend
│   ├── main.py
│   ├── database.py
│   ├── routes/
│   ├── services/
│   └── storage/
└── frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/api.js
    └── index.html
```

## Environment Variables
Create a `.env` file in your `backend` directory:
```env
GROQ_API_KEY=your_api_key_here
DATABASE_URL=sqlite:///./shivam_nexus.db
CORS_ORIGINS=http://localhost:5173,https://your-vercel-app.vercel.app
```

Create a `.env` file in your `frontend` directory:
```env
VITE_BACKEND_URL=http://localhost:8000
```
*(In production, set this to your Render backend URL like `https://your-backend.onrender.com` without a trailing `/api`.)*

## Local Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## API Endpoints
| Feature | Endpoint | Method |
|---------|----------|--------|
| Health | `/api/health` | GET |
| Routes | `/api/debug/routes` | GET |
| Chat | `/api/chat/ask` | POST |
| RAG | `/api/rag/upload` | POST |
| RAG | `/api/rag/ask` | POST |
| Resume | `/api/resume/analyze` | POST |
| Agents | `/api/agents/run` | POST |
| Jobs | `/api/jobs/search` | GET |
| Dashboard | `/api/dashboard/summary` | GET |
| Analytics | `/api/analytics/summary` | GET |
| History | `/api/history/save` | POST |
| History | `/api/history/sessions` | GET |
| Export | `/api/export/pdf` | POST |

## Deployment Guide

### Backend (Render)
1. Push your code to GitHub.
2. In Render, create a new Web Service and link your repository.
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add your `GROQ_API_KEY` to Render Environment Variables.

*Note on Render Free Tier:* Uploaded documents and SQLite databases may be reset upon container restarts. For persistent production, consider connecting to a hosted PostgreSQL/Supabase database and AWS S3 for storage.

### Frontend (Vercel)
1. In Vercel, import your repository.
2. Root Directory: `frontend`
3. Framework Preset: Vite
4. Add Environment Variable: `VITE_BACKEND_URL=https://your-render-app.onrender.com`
5. Deploy.

## Resume Project Bullets
- Built a full-stack AI productivity platform using React, FastAPI, Groq LLaMA, SQLite, and RAG.
- Implemented document chat with PDF/DOCX/TXT upload, text extraction, retrieval, and AI-based answers.
- Developed ATS resume analyzer with keyword matching, scoring, missing keyword detection, and AI suggestions.
- Created agentic AI workflow with planner, researcher, writer, and critic agents.
- Added backend job search, chat history, PDF/DOCX export, user dashboard, and admin analytics.
