import os
import sqlite3
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shivam_nexus.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Create all required tables for history and analytics if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Chat Sessions Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            session_id TEXT PRIMARY KEY,
            module TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    
    # 2. Chat Messages Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
        )
    """)
    
    # 3. Analytics Events Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analytics_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            metadata TEXT,
            timestamp TEXT NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()

def log_analytics_event(event_type: str, metadata: str = None):
    """Log an event for the analytics dashboard."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO analytics_events (event_type, metadata, timestamp) VALUES (?, ?, ?)",
            (event_type, metadata, datetime.utcnow().isoformat() + "Z")
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging analytics: {e}")
