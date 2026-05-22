import uuid
from database import get_db_connection
from datetime import datetime

def save_chat_interaction(session_id: str, module: str, user_message: str, ai_response: str) -> str:
    """Save user message and AI response to history, creating session if needed."""
    if not session_id:
        session_id = str(uuid.uuid4())
        
    conn = get_db_connection()
    cursor = conn.cursor()
    
    now = datetime.utcnow().isoformat() + "Z"
    
    # Check if session exists
    cursor.execute("SELECT 1 FROM chat_sessions WHERE session_id = ?", (session_id,))
    if not cursor.fetchone():
        # Title is up to first 50 chars of user message
        title = user_message[:50] + "..." if len(user_message) > 50 else user_message
        cursor.execute(
            "INSERT INTO chat_sessions (session_id, title, module, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            (session_id, title, module, now, now)
        )
    else:
        cursor.execute("UPDATE chat_sessions SET updated_at = ? WHERE session_id = ?", (now, session_id))
    
    # Insert user message
    if user_message:
        cursor.execute(
            "INSERT INTO chat_messages (session_id, role, content, module, created_at) VALUES (?, ?, ?, ?, ?)",
            (session_id, "user", user_message, module, now)
        )
        
    # Insert AI message
    if ai_response:
        cursor.execute(
            "INSERT INTO chat_messages (session_id, role, content, module, created_at) VALUES (?, ?, ?, ?, ?)",
            (session_id, "assistant", ai_response, module, now)
        )
        
    conn.commit()
    conn.close()
    
    return session_id

def get_sessions() -> list[dict]:
    """Retrieve all chat sessions."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT session_id, title, module, created_at, updated_at FROM chat_sessions ORDER BY updated_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_session_messages(session_id: str) -> list[dict]:
    """Retrieve all messages for a specific session."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT role, content, created_at FROM chat_messages WHERE session_id = ? ORDER BY id ASC", (session_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def delete_session(session_id: str) -> bool:
    """Delete a chat session and all its messages."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chat_sessions WHERE session_id = ?", (session_id,))
    # chat_messages will be deleted by CASCADE if foreign key pragmas are on, 
    # but let's do it explicitly to be safe as well
    cursor.execute("DELETE FROM chat_messages WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return True
