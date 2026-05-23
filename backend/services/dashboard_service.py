import os
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import AnalyticsEvent, ChatSession, RagDocument

def get_dashboard_summary(db: Session) -> dict:
    try:
        # Get event counts
        counts = db.query(AnalyticsEvent.event_type, func.count(AnalyticsEvent.id)).group_by(AnalyticsEvent.event_type).all()
        event_counts = {row[0]: row[1] for row in counts}
        
        summary_stats = {
            "chat_sessions": event_counts.get("chat_request", 0) + event_counts.get("history_save", 0),
            "documents_uploaded": event_counts.get("rag_upload", 0),
            "resume_analyses": event_counts.get("resume_analysis", 0),
            "agent_workflows": event_counts.get("agent_run", 0),
            "job_searches": event_counts.get("job_search", 0),
            "reports_exported": event_counts.get("export_pdf", 0) + event_counts.get("export_docx", 0)
        }
        
        # Get recent activities (limit 5)
        recent_records = db.query(AnalyticsEvent).order_by(AnalyticsEvent.id.desc()).limit(5).all()
        recent_activities = []
        
        # Process simple activity names
        for act in recent_records:
            et = act.event_type
            if et == "chat_request": action_text = "You asked AI a question"
            elif et == "rag_upload": action_text = "You uploaded a document"
            elif et == "rag_question": action_text = "You asked a document question"
            elif et == "resume_analysis": action_text = "You analyzed a resume"
            elif et == "agent_run": action_text = "You ran an agent workflow"
            elif et == "job_search": action_text = "You searched jobs"
            elif et in ["export_pdf", "export_docx"]: action_text = "You exported a report"
            elif et == "history_save": action_text = "You saved a chat session"
            else: action_text = f"You used {act.module or 'a feature'}"
            
            recent_activities.append({
                "event_type": et,
                "module": act.module,
                "created_at": act.created_at.isoformat() + "Z",
                "action_text": action_text
            })
        
        # Get recent chat sessions
        chat_records = db.query(ChatSession).order_by(ChatSession.id.desc()).limit(3).all()
        recent_chats = [
            {
                "session_id": c.session_id,
                "module": c.module,
                "created_at": c.created_at.isoformat() + "Z"
            } for c in chat_records
        ]
        
        # Get recent documents
        doc_records = db.query(RagDocument).order_by(RagDocument.id.desc()).limit(3).all()
        recent_documents = [
            {
                "document_id": d.document_id,
                "filename": d.filename,
                "file_type": d.file_type,
                "chunks": d.chunk_count,
                "uploaded_at": d.uploaded_at.isoformat() + "Z"
            } for d in doc_records
        ]

        # Generate recommendations
        recommendations = []
        if summary_stats["documents_uploaded"] == 0:
            recommendations.append("Upload your resume or project PDF and ask AI questions.")
        if summary_stats["resume_analyses"] > 0:
            recommendations.append("Export your ATS report as PDF.")
        if summary_stats["agent_workflows"] > 0:
            recommendations.append("Save this workflow result to your portfolio.")
        if summary_stats["job_searches"] == 0:
            recommendations.append("Search AI jobs in Mumbai, Palghar, Boisar, or Remote.")
            
        if not recommendations:
            recommendations.append("Try starting a new Agent Workflow for your next big task!")

        groq_key = os.getenv("GROQ_API_KEY")

        return {
            "summary": summary_stats,
            "recent_chats": recent_chats,
            "recent_documents": recent_documents,
            "recent_activities": recent_activities,
            "recommendations": recommendations,
            "system_health": {
                "backend": "online",
                "database": "connected",
                "groq": "configured" if groq_key else "missing"
            }
        }
    except Exception as e:
        import logging
        logging.getLogger(__name__).exception("Dashboard service failed")
        return {
            "summary": {
                "chat_sessions": 0, "documents_uploaded": 0, "resume_analyses": 0,
                "agent_workflows": 0, "job_searches": 0, "reports_exported": 0
            },
            "recent_chats": [],
            "recent_documents": [],
            "recent_activities": [],
            "recommendations": ["Upload your resume or project PDF and ask AI questions.", "Search AI jobs in Mumbai, Palghar, Boisar, or Remote."],
            "system_health": {
                "backend": "online",
                "database": "error",
                "groq": "unknown"
            },
            "error": str(e)
        }
