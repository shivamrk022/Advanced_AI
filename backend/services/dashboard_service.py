import os
from database import get_db_connection, check_db_status

def get_dashboard_summary() -> dict:
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get event counts
        cursor.execute("SELECT event_type, COUNT(*) FROM analytics_events GROUP BY event_type")
        event_counts = dict(cursor.fetchall())
        
        summary_stats = {
            "chat_sessions": event_counts.get("chat_request", 0) + event_counts.get("history_save", 0),
            "documents_uploaded": event_counts.get("rag_upload", 0),
            "resume_analyses": event_counts.get("resume_analysis", 0),
            "agent_workflows": event_counts.get("agent_run", 0),
            "job_searches": event_counts.get("job_search", 0),
            "reports_exported": event_counts.get("export_pdf", 0) + event_counts.get("export_docx", 0)
        }
        
        # Get recent activities (limit 5)
        cursor.execute("SELECT event_type, module, created_at FROM analytics_events ORDER BY id DESC LIMIT 5")
        recent_activities = [dict(row) for row in cursor.fetchall()]
        
        # Process simple activity names
        for act in recent_activities:
            et = act["event_type"]
            if et == "chat_request": act["action_text"] = "You asked AI a question"
            elif et == "rag_upload": act["action_text"] = "You uploaded a document"
            elif et == "rag_question": act["action_text"] = "You asked a document question"
            elif et == "resume_analysis": act["action_text"] = "You analyzed a resume"
            elif et == "agent_run": act["action_text"] = "You ran an agent workflow"
            elif et == "job_search": act["action_text"] = "You searched jobs"
            elif et in ["export_pdf", "export_docx"]: act["action_text"] = "You exported a report"
            elif et == "history_save": act["action_text"] = "You saved a chat session"
            else: act["action_text"] = f"You used {act['module'] or 'a feature'}"
        
        # Get recent chat sessions
        cursor.execute("SELECT session_id, module, created_at FROM chat_sessions ORDER BY id DESC LIMIT 3")
        recent_chats = [dict(row) for row in cursor.fetchall()]
        
        # Get recent documents (mocked from events since we might not have a direct docs table easy to query here)
        # Or we can query metadata if needed. Let's just keep it empty if no dedicated table, or use rag_service.
        try:
            from services.rag_service import get_all_documents
            docs = get_all_documents()
            recent_documents = docs[:3] if docs else []
        except Exception:
            recent_documents = []

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

        conn.close()
        return {
            "summary": summary_stats,
            "recent_chats": recent_chats,
            "recent_documents": recent_documents,
            "recent_activities": recent_activities,
            "recommendations": recommendations,
            "system_health": {
                "backend": "online",
                "database": check_db_status(),
                "groq": "configured" if groq_key else "missing"
            }
        }
    except Exception as e:
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
