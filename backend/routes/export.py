from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from services.export_service import generate_pdf_report, generate_docx_report
from starlette.background import BackgroundTask

router = APIRouter()

class ExportRequest(BaseModel):
    title: str = "AI Generated Report"
    content: str

def cleanup_file(path: str):
    """Deletes the temporary file after it has been sent."""
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"Failed to delete temp file {path}: {e}")

@router.post("/pdf")
async def export_pdf(req: ExportRequest):
    if not req.content or not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    try:
        file_path = generate_pdf_report(req.title, req.content)
        safe_title = "".join(c for c in req.title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_title}.pdf" if safe_title else "report.pdf"
        
        from database import track_event
        track_event("export_pdf", "export", {"title": req.title})
        
        return FileResponse(
            path=file_path, 
            filename=filename, 
            media_type="application/pdf",
            background=BackgroundTask(cleanup_file, file_path)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.post("/docx")
async def export_docx(req: ExportRequest):
    if not req.content or not req.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    try:
        file_path = generate_docx_report(req.title, req.content)
        safe_title = "".join(c for c in req.title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_title}.docx" if safe_title else "report.docx"
        
        from database import track_event
        track_event("export_docx", "export", {"title": req.title})
        
        return FileResponse(
            path=file_path, 
            filename=filename, 
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            background=BackgroundTask(cleanup_file, file_path)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate DOCX: {str(e)}")
