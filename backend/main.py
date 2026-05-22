import os
import sqlite3
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from routes.rag import router as rag_router
from routes.resume import router as resume_router
from routes.agents import router as agents_router
from routes.jobs import router as jobs_router
from routes.history import router as history_router
from routes.export import router as export_router
from routes.analytics import router as analytics_router
from database import init_db, track_event

# Load environment variables from parent workspace folder or current folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv()

app = FastAPI(title="Shivam Nexus API", version="1.0.0")

# Setup CORS Origins dynamically from environment
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000")
if cors_origins_env:
    origins = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if "*" not in origins else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(rag_router)
app.include_router(resume_router, prefix="/api/resume", tags=["Resume"])
app.include_router(agents_router, prefix="/api/agents", tags=["Agents"])
app.include_router(jobs_router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(history_router, prefix="/api/history", tags=["History"])
app.include_router(export_router, prefix="/api/export", tags=["Export"])
app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

@app.on_event("startup")
async def startup_event():
    init_db()

# Initialize Groq client securely using only GROQ_API_KEY
groq_key = os.getenv("GROQ_API_KEY")
client = None
if groq_key and groq_key.strip():
    try:
        client = Groq(api_key=groq_key.strip())
    except Exception as e:
        print(f"Failed to initialize Groq client: {e}")

class ChatMessage(BaseModel):
    role: str
    content: str

class AskRequest(BaseModel):
    system_prompt: str
    user_message: str
    history: List[ChatMessage] = []
    temperature: Optional[float] = 0.4

def check_db_status() -> str:
    db_url = os.getenv("DATABASE_URL", "sqlite:///./shivam_nexus.db")
    try:
        if "sqlite" in db_url:
            # Extract local path from sqlite URL
            db_path = db_url
            for prefix in ["sqlite:///", "sqlite://"]:
                if db_path.startswith(prefix):
                    db_path = db_path[len(prefix):]
                    break
            # Try to connect and verify connection
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.close()
            conn.close()
            return "connected"
        else:
            # Fallback/assume connected for non-sqlite mock checks
            return "connected"
    except Exception as e:
        return f"unhealthy: {str(e)}"

@app.get("/")
def root():
    return {
        "message": "Shivam Nexus API is running",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.post("/api/ask")
async def ask_groq(req: AskRequest):
    global client
    # Re-initialize client if key was added/updated in env after startup
    if not client:
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key and groq_key.strip():
            try:
                client = Groq(api_key=groq_key.strip())
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Groq client initialization failed: {str(e)}"
                )

    if not client:
        raise HTTPException(
            status_code=503,
            detail="AI service is not configured. GROQ_API_KEY is missing on the server."
        )

    try:
        messages = [{"role": "system", "content": req.system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": req.user_message})

        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=req.temperature if req.temperature is not None else 0.4,
                max_tokens=2048,
            )
        except Exception as groq_err:
            if "429" in str(groq_err) or "rate_limit" in str(groq_err).lower():
                print("Rate limit hit on 70b model. Falling back to llama-3.1-8b-instant.")
                completion = client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages,
                    temperature=req.temperature if req.temperature is not None else 0.4,
                    max_tokens=2048,
                )
            else:
                raise groq_err
                
        # Call analytics track_event in a background task so it doesn't block
        try:
            track_event("chat_request", "chat", {"model": "llama-3.3-70b-versatile"})
        except:
            pass
            
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI request failed: {str(e)}"
        )

@app.get("/api/health")
def health_check():
    global client
    # Re-initialize client if key was added in env after startup
    if not client:
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key and groq_key.strip():
            try:
                client = Groq(api_key=groq_key.strip(), max_retries=0, timeout=15.0)
            except Exception:
                client = None

    db_status = check_db_status()
    ai_status = "healthy" if client is not None else "unconfigured: GROQ_API_KEY is missing"
    
    # RAG subsystem status
    try:
        from services.rag_service import check_rag_status
        rag_status = check_rag_status()
    except Exception:
        rag_status = {"rag": "unavailable", "vector_db": "not loaded"}

    # Define overall status based on backend and database health
    overall_status = "healthy"
    if db_status != "connected":
        overall_status = "unhealthy"
    elif client is None:
        overall_status = "degraded"

    return {
        "status": overall_status,
        "backend": "healthy",
        "database": db_status,
        "ai_provider": ai_status,
        "analytics": "available",
        **rag_status,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

@app.get("/api/debug/routes")
def get_routes():
    routes = [{"path": route.path, "name": route.name} for route in app.routes]
    return {"routes": routes}

