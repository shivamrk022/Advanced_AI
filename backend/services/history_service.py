from database import get_db_connection
from datetime import datetime

def save_chat_message(session_id: str, module: str, role: str, content: str):
    """Save a user or assistant message, creating the session if it doesn't exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if session exists
    cursor.execute("SELECT 1 FROM chat_sessions WHERE session_id = ?", (session_id,))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO chat_sessions (session_id, module, created_at) VALUES (?, ?, ?)",
            (session_id, module, datetime.utcnow().isoformat() + "Z")
        )
    
    # Insert message
    cursor.execute(
        "INSERT INTO chat_messages (session_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (session_id, role, content, datetime.utcnow().isoformat() + "Z")
    )
    conn.commit()
    conn.close()

def get_sessions(module: str = None) -> list[dict]:
    """Retrieve all chat sessions, optionally filtered by module."""
    conn = get_db_connection()
    cursor = conn.cursor()
    if module:
        cursor.execute("SELECT * FROM chat_sessions WHERE module = ? ORDER BY created_at DESC", (module,))
    else:
        cursor.execute("SELECT * FROM chat_sessions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_session_messages(session_id: str) -> list[dict]:
    """Retrieve all messages for a specific session."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM chat_messages WHERE session_id = ? ORDER BY timestamp ASC", (session_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

def delete_session(session_id: str) -> bool:
    """Delete a chat session and all its messages."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chat_messages WHERE session_id = ?", (session_id,))
    cursor.execute("DELETE FROM chat_sessions WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return True
