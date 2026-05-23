import uuid
from sqlalchemy.orm import Session
from models import ChatSession, ChatMessage
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def save_chat_interaction(db: Session, session_id: str, module: str, user_message: str, ai_response: str) -> str:
    """Save user message and AI response to history, creating session if needed."""
    if not session_id:
        session_id = str(uuid.uuid4())
        
    # Check if session exists
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    
    if not session:
        # Title is up to first 50 chars of user message
        title = user_message[:50] + "..." if len(user_message) > 50 else user_message
        session = ChatSession(
            session_id=session_id,
            title=title,
            module=module
        )
        db.add(session)
    else:
        session.updated_at = datetime.utcnow()
        
    # Insert user message
    if user_message:
        msg1 = ChatMessage(
            session_id=session_id,
            role="user",
            content=user_message,
            module=module
        )
        db.add(msg1)
        
    # Insert AI message
    if ai_response:
        msg2 = ChatMessage(
            session_id=session_id,
            role="assistant",
            content=ai_response,
            module=module
        )
        db.add(msg2)
        
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.exception("Failed to save chat interaction")
        raise e
        
    return session_id

def get_sessions(db: Session) -> list[dict]:
    """Retrieve all chat sessions."""
    sessions = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).all()
    return [
        {
            "session_id": s.session_id,
            "title": s.title,
            "module": s.module,
            "created_at": s.created_at.isoformat() + "Z",
            "updated_at": s.updated_at.isoformat() + "Z"
        } for s in sessions
    ]

def get_session_messages(db: Session, session_id: str) -> list[dict]:
    """Retrieve all messages for a specific session."""
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.id.asc()).all()
    return [
        {
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat() + "Z"
        } for m in messages
    ]

def delete_session(db: Session, session_id: str) -> bool:
    """Delete a chat session and all its messages."""
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if session:
        db.delete(session)
        
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).all()
    for msg in messages:
        db.delete(msg)
        
    try:
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        logger.exception("Failed to delete session")
        raise e
