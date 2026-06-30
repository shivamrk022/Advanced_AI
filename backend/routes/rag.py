"""
RAG routes — document upload, question-answering, list, and delete endpoints.
"""
import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import uuid
import pathlib
from pydantic import BaseModel

from services.document_service import extract_text, clean_text, chunk_text
from services.rag_service import (
    index_document,
    retrieve_chunks,
    build_rag_prompt,
    generate_fallback_answer,
    get_all_documents,
    get_document_meta,
    delete_document,
)
from services.analytics_service import track_event

router = APIRouter(prefix="/api/rag", tags=["RAG Document Chat"])

# Storage folder for uploaded files
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BACKEND_DIR, "storage", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "txt", "docx"}
MAX_FILE_SIZE_MB = 20

# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class AskRagRequest(BaseModel):
    document_id: str
    question: str


# ---------------------------------------------------------------------------
# Upload endpoint
# ---------------------------------------------------------------------------

@router.post("/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a document, extract text, create embeddings, and index it."""
    # Validate extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '.{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read file content and check size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.1f} MB). Maximum is {MAX_FILE_SIZE_MB} MB."
        )

    # Save to uploads directory using secure server-generated filename
    doc_id = uuid.uuid4().hex[:12]
    safe_filename = f"{doc_id}.{ext}"
    
    target_path = pathlib.Path(UPLOADS_DIR) / safe_filename
    resolved_path = target_path.resolve()
    upload_root = pathlib.Path(UPLOADS_DIR).resolve()
    
    if upload_root not in resolved_path.parents and resolved_path != upload_root:
        raise HTTPException(status_code=400, detail="Invalid file path")
        
    with open(resolved_path, "wb") as f:
        f.write(content)

    try:
        # Extract and clean text
        raw_text = extract_text(str(resolved_path), ext)
        cleaned = clean_text(raw_text)

        if not cleaned or len(cleaned.split()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Document contains too little text to index."
            )

        # Chunk the text
        chunks = chunk_text(cleaned, chunk_size=500, overlap=50)

        # Index into vector DB
        meta = index_document(db, doc_id, file.filename, ext, chunks)

        track_event("rag_upload", "rag", {"filename": file.filename, "file_type": ext, "chunks": meta["chunks"]})

        return {
            "document_id": meta["document_id"],
            "filename": meta["filename"],
            "file_type": meta["file_type"],
            "chunks": meta["chunks"],
            "status": "indexed",
            "message": "Document uploaded and indexed successfully",
        }

    except HTTPException:
        raise
    except Exception as e:
        # Clean up on failure
        if resolved_path.exists():
            resolved_path.unlink()
        import logging
        logging.getLogger(__name__).exception("Failed to process document")
        raise HTTPException(status_code=500, detail="Failed to process document. Please try again.")


# ---------------------------------------------------------------------------
# Ask endpoint
# ---------------------------------------------------------------------------

@router.post("/ask")
async def ask_document(req: AskRagRequest, db: Session = Depends(get_db)):
    """Answer a question using RAG over a previously uploaded document."""
    if not req.document_id or not req.question.strip():
        raise HTTPException(status_code=400, detail="document_id and question are required.")

    # Verify document exists
    meta = get_document_meta(db, req.document_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Document '{req.document_id}' not found.")

    try:
        # Retrieve relevant chunks
        sources = retrieve_chunks(req.document_id, req.question.strip(), top_k=5, db=db)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    if not sources:
        return {
            "answer": "The uploaded document does not contain enough information to answer this question.",
            "document_id": req.document_id,
            "sources": [],
        }

    # Try Groq LLM first, fallback to chunk-based answer
    answer = None
    groq_key = os.environ.get("GROQ_API_KEY", "")

    if groq_key and groq_key.strip():
        try:
            from groq import Groq
            client = Groq(api_key=groq_key.strip())
            rag_prompt = build_rag_prompt(req.question.strip(), sources)
            try:
                completion = client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You are a helpful document analysis assistant. Answer only from the provided context."},
                        {"role": "user", "content": rag_prompt},
                    ],
                    temperature=0.3,
                    max_tokens=1024,
                )
            except Exception as groq_err:
                if "429" in str(groq_err) or "rate_limit" in str(groq_err).lower():
                    print("Rate limit hit on 70b model. Falling back to llama-3.1-8b-instant in RAG.")
                    completion = client.chat.completions.create(
                        model="llama-3.1-8b-instant",
                        messages=[
                            {"role": "system", "content": "You are a helpful document analysis assistant. Answer only from the provided context."},
                            {"role": "user", "content": rag_prompt},
                        ],
                        temperature=0.3,
                        max_tokens=1024,
                    )
                else:
                    raise groq_err
            answer = completion.choices[0].message.content
        except Exception as e:
            print(f"Groq RAG request failed, using fallback: {e}")

    if not answer:
        answer = generate_fallback_answer(req.question.strip(), sources)

    # Strip full_text from response sources to keep payload lean
    response_sources = [
        {"chunk_id": s["chunk_id"], "text_preview": s["text_preview"]}
        for s in sources
    ]

    track_event("rag_question", "rag", {"document_id": req.document_id})

    return {
        "answer": answer,
        "document_id": req.document_id,
        "sources": response_sources,
    }


# ---------------------------------------------------------------------------
# List documents endpoint
# ---------------------------------------------------------------------------

@router.get("/documents")
async def list_documents(db: Session = Depends(get_db)):
    """Return metadata for all indexed documents."""
    docs = get_all_documents(db)
    return {"documents": docs}


# ---------------------------------------------------------------------------
# Delete document endpoint
# ---------------------------------------------------------------------------

@router.delete("/documents/{document_id}")
async def remove_document(document_id: str, db: Session = Depends(get_db)):
    """Delete a document's vectors, metadata, and uploaded file."""
    meta = get_document_meta(db, document_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found.")

    # Remove from vector DB and metadata
    delete_document(db, document_id)

    # Remove uploaded file securely
    ext = meta.get("file_type", "pdf")
    safe_filename = f"{document_id}.{ext}"
    target_path = pathlib.Path(UPLOADS_DIR) / safe_filename
    resolved_path = target_path.resolve()
    upload_root = pathlib.Path(UPLOADS_DIR).resolve()
    
    if upload_root in resolved_path.parents or resolved_path == upload_root:
        if resolved_path.exists():
            resolved_path.unlink()

    return {"message": f"Document '{document_id}' deleted successfully.", "document_id": document_id}
