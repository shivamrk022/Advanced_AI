from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from services.resume_service import extract_text_from_file, analyze_resume

router = APIRouter()

@router.post("/analyze")
async def analyze_resume_endpoint(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    ext = file.filename.split('.')[-1].lower()
    if ext not in ['pdf', 'docx', 'txt']:
        raise HTTPException(status_code=400, detail="Only PDF, DOCX, and TXT files are supported")
    
    try:
        content = await file.read()
        resume_text = extract_text_from_file(content, file.filename)
        
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from the uploaded file")
        
        analysis = analyze_resume(resume_text, job_description)
        
        from database import track_event
        track_event("resume_analysis", "resume", {"filename": file.filename})
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
