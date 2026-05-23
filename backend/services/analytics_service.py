from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import AnalyticsEvent
from database import SessionLocal
import json
import logging

logger = logging.getLogger(__name__)

def track_event(event_type: str, module: str = None, metadata: dict = None):
    """Log an event for the analytics dashboard. Fails silently to prevent crashing."""
    try:
        db = SessionLocal()
        meta_str = json.dumps(metadata) if metadata else None
        event = AnalyticsEvent(
            event_type=event_type,
            module=module,
            metadata_json=meta_str
        )
        db.add(event)
        db.commit()
    except Exception as e:
        logger.error(f"Error logging analytics event '{event_type}': {e}")
    finally:
        try:
            db.close()
        except:
            pass

def get_analytics_summary(db: Session) -> dict:
    """Returns aggregated analytics data for the dashboard."""
    try:
        # Total events
        total_events = db.query(AnalyticsEvent).count()
        
        # Event type counts
        counts = db.query(
            AnalyticsEvent.event_type, 
            func.count(AnalyticsEvent.id)
        ).group_by(AnalyticsEvent.event_type).all()
        event_counts = {row[0]: row[1] for row in counts}
        
        # Most used module
        most_used = db.query(
            AnalyticsEvent.module, 
            func.count(AnalyticsEvent.id).label('count')
        ).filter(AnalyticsEvent.module.isnot(None)).group_by(AnalyticsEvent.module).order_by(desc('count')).first()
        most_used_module = most_used[0] if most_used else "none"
        
        # Recent events
        recent_records = db.query(AnalyticsEvent).order_by(AnalyticsEvent.id.desc()).limit(5).all()
        recent_events = [
            {
                "event_type": r.event_type,
                "module": r.module,
                "created_at": r.created_at.isoformat() + "Z"
            } for r in recent_records
        ]
        
        return {
            "backend_status": "ok",
            "database_status": "connected",
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
        logger.exception("Failed to get analytics summary")
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

def get_recent_events(db: Session, limit: int = 50) -> dict:
    """Returns recent analytics events."""
    try:
        events = db.query(AnalyticsEvent).order_by(AnalyticsEvent.id.desc()).limit(limit).all()
        result = [
            {
                "id": r.id,
                "event_type": r.event_type,
                "module": r.module,
                "metadata": r.metadata_json,
                "created_at": r.created_at.isoformat() + "Z"
            } for r in events
        ]
        return {"events": result}
    except Exception as e:
        logger.exception("Failed to get recent events")
        return {"events": [], "error": str(e)}
