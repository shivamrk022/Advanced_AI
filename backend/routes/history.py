from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
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
async def save_history(request: SaveHistoryRequest, db: Session = Depends(get_db)):
    try:
        session_id = save_chat_interaction(
            db=db,
            session_id=request.session_id,
            module=request.module,
            user_message=request.user_message,
            ai_response=request.ai_response
        )
        
        from services.analytics_service import track_event
        track_event("history_save", "history", {"session_id": session_id, "module": request.module})
        
        return {
            "session_id": session_id,
            "status": "saved"
        }
    except Exception as e:
        print(f"Error saving history: {e}")
        raise HTTPException(status_code=500, detail="Failed to save chat history")

@router.get("/sessions")
async def list_sessions(db: Session = Depends(get_db)):
    try:
        sessions = get_sessions(db)
        return {"sessions": sessions}
    except Exception as e:
        print(f"Error getting sessions: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history sessions")

@router.get("/sessions/{session_id}")
async def get_session(session_id: str, db: Session = Depends(get_db)):
    try:
        messages = get_session_messages(db, session_id)
        return {
            "session_id": session_id,
            "messages": messages
        }
    except Exception as e:
        print(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch session messages")

from security import verify_admin_key
import logging

logger = logging.getLogger(__name__)

@router.delete("/sessions/{session_id}", dependencies=[Depends(verify_admin_key)])
async def delete_history_session(session_id: str, db: Session = Depends(get_db)):
    try:
        delete_session(db, session_id)
        return {"status": "deleted"}
    except Exception as e:
        logger.exception("Error deleting session")
        raise HTTPException(status_code=500, detail="Failed to delete session")
