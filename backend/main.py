import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from groq import Groq

# Load environment variables from parent workspace folder or current folder
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv()

app = FastAPI(title="Shivam Nexus API")

# Allow requests from Vercel frontend & local dev
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
DEFAULT_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://advanced-ai-1gz7.onrender.com",
    "https://advanced-ai-shivam.vercel.app",
]
origins = list(set(ALLOWED_ORIGINS + DEFAULT_ORIGINS)) if ALLOWED_ORIGINS[0] else DEFAULT_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq client
groq_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
client = None
if groq_key:
    client = Groq(api_key=groq_key)

class ChatMessage(BaseModel):
    role: str
    content: str

class AskRequest(BaseModel):
    system_prompt: str
    user_message: str
    history: List[ChatMessage] = []

@app.post("/api/ask")
async def ask_groq(req: AskRequest):
    global client
    # Re-read client if key was added after startup
    if not client:
        groq_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
        if groq_key:
            client = Groq(api_key=groq_key)

    if not client:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured. Please add GROQ_API_KEY=your_key in the .env file and restart/verify the server."
        )

    try:
        messages = [{"role": "system", "content": req.system_prompt}]
        for msg in req.history:
            messages.append({"role": msg.role, "content": msg.content})
        messages.append({"role": "user", "content": req.user_message})

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.4,
            max_tokens=2048,
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    global client
    if not client:
        groq_key = os.getenv("GROQ_API_KEY") or os.getenv("VITE_GROQ_API_KEY")
        if groq_key:
            client = Groq(api_key=groq_key)
    return {
        "status": "ok",
        "groq_configured": client is not None
    }
