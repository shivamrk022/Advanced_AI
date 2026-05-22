from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.history_service import (
    save_chat_interaction,
    get_sessions,
    get_session_messages,
    delete_session
)

router = APIRouter()

class SaveHistoryRequest(BaseModel):
    session_id: Optional[str] = None
    module: str
    user_message: str
    ai_response: str

@router.post("/save")
async def save_history(request: SaveHistoryRequest):
    try:
        session_id = save_chat_interaction(
            session_id=request.session_id,
            module=request.module,
            user_message=request.user_message,
            ai_response=request.ai_response
        )
        return {
            "session_id": session_id,
            "status": "saved"
        }
    except Exception as e:
        print(f"Error saving history: {e}")
        raise HTTPException(status_code=500, detail="Failed to save chat history")

@router.get("/sessions")
async def list_sessions():
    try:
        sessions = get_sessions()
        return {"sessions": sessions}
    except Exception as e:
        print(f"Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history sessions")

@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    try:
        messages = get_session_messages(session_id)
        return {
            "session_id": session_id,
            "messages": messages
        }
    except Exception as e:
        print(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch session messages")

@router.delete("/sessions/{session_id}")
async def delete_history_session(session_id: str):
    try:
        delete_session(session_id)
        return {"status": "deleted"}
    except Exception as e:
        print(f"Error deleting session: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete session")
