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
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT UNIQUE NOT NULL,
            title TEXT,
            module TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)
    
    # 2. Chat Messages Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            module TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE
        )
    """)
    
    # 3. Analytics Events Table
    # Drop and recreate to match new schema if needed (since it's a dev database, it's safer to just drop and recreate if we change columns)
    try:
        cursor.execute("PRAGMA table_info(analytics_events)")
        columns = [row[1] for row in cursor.fetchall()]
        if "module" not in columns:
            cursor.execute("DROP TABLE analytics_events")
    except Exception:
        pass
        
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS analytics_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            module TEXT,
            metadata TEXT,
            created_at TEXT NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()

import json
def track_event(event_type: str, module: str = None, metadata: dict = None):
    """Log an event for the analytics dashboard. Fails silently to prevent crashing."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        meta_str = json.dumps(metadata) if metadata else None
        cursor.execute(
            "INSERT INTO analytics_events (event_type, module, metadata, created_at) VALUES (?, ?, ?, ?)",
            (event_type, module, meta_str, datetime.utcnow().isoformat() + "Z")
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error logging analytics event '{event_type}': {e}")
