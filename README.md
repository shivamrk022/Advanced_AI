# <p align="center">🔮 SHIVAM NEXUS — AI SUPER PLATFORM</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Groq-f59e0b?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Groq" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

<p align="center">
  <a href="https://github.com/shivamrk022/Advanced_AI"><img src="https://img.shields.io/github/stars/shivamrk022/Advanced_AI?style=social" alt="GitHub Stars" /></a>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=flat-square" alt="Status" />
  <a href="https://nexus.shivamrk022.dev"><img src="https://img.shields.io/badge/Live%20Demo-nexus.shivamrk022.dev-6366f1?style=flat-square&logo=vercel" alt="Live Demo" /></a>
</p>

<p align="center">
  <strong>A production-grade, multi-module AI platform for students, professionals & businesses.</strong><br/>
  Built by <a href="https://github.com/shivamrk022">Shivam Maurya</a> · Mumbai, India
</p>

---

## 📄 Project Overview

**Shivam Nexus** is a full-stack AI Super Platform powered by **Groq's LLaMA 3.3 70B** model — providing 8 specialized AI modules across education, careers, health, legal guidance, job search, portfolio generation, and business planning.

The architecture uses a **decoupled frontend/backend design**:
- The **React + Vite frontend** handles all UI interactions
- The **FastAPI backend** securely proxies requests to Groq, keeping your API key safe on the server side

> This project demonstrates: Full-Stack Development · LLM Integration · API Gateway Design · Prompt Engineering · Multi-Language UI · Secure Environment Management

---

## 🚀 AI Modules

| # | Module | Description |
|---|--------|-------------|
| 🎓 | **Student Hub** | Study planner, quiz generator, ELI5 concept explainer |
| 💼 | **AI Career & CV** | ATS resume builder, cover letter optimizer, email templates |
| 🩺 | **Health Assistant** | Symptom checker, medication guide, wellness routines |
| ⚖️ | **Legal Advisor** | Indian law explainer, rights definitions, legal drafts |
| 🔍 | **Live Job Search** | Job query simulation with city & role filters |
| 💻 | **Portfolio Builder** | Instant Markdown portfolio generator |
| 📊 | **Business Intelligence** | Startup planner, competitor analysis, marketing strategy |
| 💬 | **General AI Chat** | Full-page conversational workspace with chat history |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | FastAPI, Python 3.10+, Uvicorn |
| **AI Model** | LLaMA 3.3 70B via Groq API |
| **Language** | English + Hindi (dual localization) |
| **Theme** | Dark / Light mode with glassmorphism |

---

## 📂 Folder Structure

```
Advanced_AI/
│
├── backend/
│   ├── main.py               # FastAPI server — /api/ask & /api/health
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Backend env template
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Footer, ChatBot, Logo
│   │   ├── pages/            # Home, ModulePage, ChatPage
│   │   ├── data/             # modules.js, translations.js, profile.js
│   │   ├── services/         # api.js (Axios backend client)
│   │   └── context/          # ThemeContext (dark/light mode)
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js        # Port 5173 config
│   └── tailwind.config.js
│
├── .env.example              # Root env template
├── .gitignore
├── run_all.bat               # One-click Windows launcher
└── README.md
```

---

## ⚙️ Setup & Installation

### Step 1 — Clone the Repository
```bash
git clone https://github.com/shivamrk022/Advanced_AI.git
cd Advanced_AI
```

### Step 2 — Configure Environment Variables
Create a `.env` file in the project root:
```bash
copy .env.example .env
```

Then open `.env` and add your free Groq API key:
```env
GROQ_API_KEY=gsk_your_free_key_here
VITE_BACKEND_URL=http://localhost:8000
VITE_GITHUB_USERNAME=shivamrk022
```

> Get your **free** Groq API key at → [https://console.groq.com](https://console.groq.com)

---

## ▶️ Running the Project

### ⚡ Windows One-Click Launch
Double-click `run_all.bat` **or** run in PowerShell:
```powershell
.\run_all.bat
```
This opens **two terminal windows** — one for the backend and one for the frontend.

---

### 🐍 Backend (Manual)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### ⚛️ Frontend (Manual)
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Frontend (Live)** | https://nexus.shivamrk022.dev |
| **Backend API (Live)** | https://advanced-ai-1gz7.onrender.com |
| **Local Frontend** | http://localhost:5173 |
| **Local Backend** | http://localhost:8000/api |
| **API Health Check** | https://advanced-ai-1gz7.onrender.com/api/health |
| **FastAPI Docs (Swagger)** | https://advanced-ai-1gz7.onrender.com/docs |

> **Note:** If port 5173 is busy, Vite auto-shifts to port `5174`. Check your terminal for the exact URL.

---

## 🛰️ API Reference

### `POST /api/ask`
Proxies multi-turn prompts to Groq LLaMA 3.3 70B.

**Request Body:**
```json
{
  "system_prompt": "You are a specialized legal assistant.",
  "user_message": "Explain the Right to Information Act.",
  "history": []
}
```

**Response:**
```json
{
  "response": "The RTI Act (2005) grants Indian citizens the right to..."
}
```

### `GET /api/health`
Returns server and Groq configuration status.

**Response:**
```json
{
  "status": "ok",
  "groq_configured": true
}
```

---

## 🔧 Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `localhost:5173` not loading | Port 5173 is occupied by another process | Try `http://localhost:5174` or close other Node servers |
| `500 Internal Server Error` | `GROQ_API_KEY` not set | Add key to `.env` and restart the backend |
| `run_all.bat` not recognized | Running in PowerShell instead of CMD | Type `.\run_all.bat` with the `.\` prefix |
| Frontend can't reach backend | Backend not started | Run backend first: `uvicorn main:app --port 8000` |

---

## 🔐 Security

- Your `GROQ_API_KEY` is **only loaded server-side** in the FastAPI backend
- The key is **never exposed** to the browser or included in any frontend bundle
- The `.env` file is excluded from git via `.gitignore`

---

## 👤 Author

**Shivam Maurya**
Aspiring AI Engineer · B.Tech AI/ML · St. John College of Engineering and Management (2022–2026)

<p>
  <a href="https://github.com/shivamrk022">
    <img src="https://img.shields.io/badge/GitHub-shivamrk022-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://www.linkedin.com/in/shivam-maurya-4628a3291/">
    <img src="https://img.shields.io/badge/LinkedIn-Shivam_Maurya-0A66C2?style=for-the-badge&logo=linkedin" />
  </a>
  <a href="mailto:shivamaurya9702@gmail.com">
    <img src="https://img.shields.io/badge/Email-shivamaurya9702@gmail.com-EA4335?style=for-the-badge&logo=gmail" />
  </a>
</p>

---

<p align="center">⭐ Star this repo if you found it useful!</p>
