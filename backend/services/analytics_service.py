from database import get_db_connection
from main import check_db_status

def get_analytics_summary() -> dict:
    """Returns aggregated analytics data for the dashboard."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total events
        cursor.execute("SELECT COUNT(*) FROM analytics_events")
        total_events = cursor.fetchone()[0] or 0
        
        # Event type counts
        cursor.execute("SELECT event_type, COUNT(*) FROM analytics_events GROUP BY event_type")
        event_counts = dict(cursor.fetchall())
        
        # Most used module
        cursor.execute("SELECT module, COUNT(*) as count FROM analytics_events WHERE module IS NOT NULL GROUP BY module ORDER BY count DESC LIMIT 1")
        most_used_row = cursor.fetchone()
        most_used_module = most_used_row["module"] if most_used_row else "none"
        
        # Recent events (up to 5 for summary)
        cursor.execute("SELECT event_type, module, created_at FROM analytics_events ORDER BY id DESC LIMIT 5")
        recent_events = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "backend_status": "ok",
            "database_status": check_db_status(),
            "total_events": total_events,
            "total_ai_requests": event_counts.get("chat_request", 0),
            "rag_uploads": event_counts.get("rag_upload", 0),
            "rag_questions": event_counts.get("rag_question", 0),
            "resume_analyses": event_counts.get("resume_analysis", 0),
            "agent_runs": event_counts.get("agent_run", 0),
            "job_searches": event_counts.get("job_search", 0),
            "exports": event_counts.get("export_pdf", 0) + event_counts.get("export_docx", 0),
            "history_saves": event_counts.get("history_save", 0),
            "most_used_module": most_used_module,
            "recent_events": recent_events
        }
    except Exception as e:
        return {
            "backend_status": "error",
            "database_status": "error",
            "error": str(e),
            "total_events": 0,
            "total_ai_requests": 0,
            "rag_uploads": 0,
            "rag_questions": 0,
            "resume_analyses": 0,
            "agent_runs": 0,
            "job_searches": 0,
            "exports": 0,
            "history_saves": 0,
            "most_used_module": "unknown",
            "recent_events": []
        }

def get_recent_events(limit: int = 50) -> dict:
    """Returns recent analytics events."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, event_type, module, metadata, created_at FROM analytics_events ORDER BY id DESC LIMIT ?", (limit,))
        events = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"events": events}
    except Exception as e:
        return {"events": [], "error": str(e)}
