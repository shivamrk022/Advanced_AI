# Shivam Nexus: AI Super Platform

Shivam Nexus is a multi-module workspace platform providing specialized AI assistance across education, careers, health, legal rights, and business workflows, built on top of **React 18 + Vite** for the frontend and **FastAPI** for the backend proxy.

It leverages Groq's high-speed **LLaMA 3.3 70B** models with local offline mock fallbacks for resilient runtime operations.

---

## 📂 Clean Architecture Split

The project has been separated into independent frontend and backend workspaces:

```txt
advanced_ai/
├── backend/                  # FastAPI Python Proxy Backend
│   ├── main.py               # API Gateway & LLaMA proxy handlers
│   ├── requirements.txt      # Python dependencies (fastapi, groq, dotenv, etc)
│   └── .env                  # Backend API keys configuration
├── frontend/                 # React & Vite Frontend
│   ├── src/                  # React Workspace (Components, Pages, Services)
│   ├── public/               # Static Assets
│   ├── index.html            # SPA Entrypoint
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Glassmorphism & premium typography config
│   └── .env                  # Frontend build configs
├── run_all.bat               # Root-level batch script to launch both servers with one click!
└── .env                      # Global environment keys configuration
```

---

## ⚡ Direct Launch (Windows)

To start both the frontend and backend servers automatically in separate console windows, double-click the root batch script:

```bash
run_all.bat
```

---

## 🛠️ Manual Launch Instructions

### 1. Backend Setup (FastAPI)
Navigate to the `backend/` folder, install requirements, and run the server:
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```
*The backend API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).*

### 2. Frontend Setup (React/Vite)
Navigate to the `frontend/` folder, install dependencies, and run:
```bash
cd frontend
npm install
npm run dev
```
*The web interface is available at [http://localhost:5173](http://localhost:5173).*

---

## 🔑 AI Credentials Setup
Create or open the `.env` file in the project root folder:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```
The FastAPI backend reads this file and securely relays requests to Groq's supercomputer without exposing your private API key to the client's browser!

---

## 🚀 Key Modules
1. **Student Hub**: Study planners, explanation guides (ELI5 mode), and interactive mock quizzes.
2. **AI Career & CV**: ATS resume builder, cover letter optimizer, and professional email draft tools.
3. **Health Assistant**: Safe symptom triage, medication profiles, wellness routines, and wellness Q&A.
4. **Legal Advisor**: Regional law advisor, rights guides, and legal explanations (with disclaimer alerts).
5. **Live Job Search**: Interactive job search simulation matching Mumbai parameters.
6. **Portfolio Builder**: Markdown-based personal developer portfolio generator.
7. **Business Intelligence**: Startup plans outlines, competitor analysis, and marketing planners.
8. **General AI Chat**: Full-page conversational workspace interface.

---

## 🎨 Professional Themes & Hindi Localization
- **Theme Switcher**: Fluid dark/light theme state with high-contrast, fully hydrated styles.
- **Multilingual Localization**: Effortless runtime switching between English (`en`) and Hindi (`hi`).
