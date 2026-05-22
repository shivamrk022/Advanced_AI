from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.history_service import save_chat_message, get_sessions, get_session_messages, delete_session
from database import log_analytics_event

router = APIRouter(prefix="/api/history", tags=["Chat History"])

class MessageSaveRequest(BaseModel):
    session_id: str
    module: str
    role: str
    content: str

@router.post("/save")
async def save_message(req: MessageSaveRequest):
    try:
        save_chat_message(req.session_id, req.module, req.role, req.content)
        # Log analytics event only for new user requests to keep request counts accurate
        if req.role == "user":
            log_analytics_event("ai_request", req.module)
        return {"status": "success", "message": "Message saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def list_sessions(module: Optional[str] = None):
    try:
        sessions = get_sessions(module)
        return {"sessions": sessions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    try:
        messages = get_session_messages(session_id)
        return {"session_id": session_id, "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/sessions/{session_id}")
async def remove_session(session_id: str):
    try:
        delete_session(session_id)
        return {"status": "success", "message": f"Session {session_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
