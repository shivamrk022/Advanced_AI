"""
RAG service — Lightweight version for Render free tier (512MB RAM).
Uses TF-IDF + cosine similarity instead of heavy sentence-transformers + ChromaDB.
Documents and vectors are stored in PostgreSQL (persistent on Render).
"""
import os
import json
import logging
from sqlalchemy.orm import Session
from sqlalchemy import Column, Text
from models import RagDocument

logger = logging.getLogger(__name__)

# Paths — resolved relative to the backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------------------------------------------------------
# Lightweight in-memory vector store (backed by PostgreSQL for persistence)
# ---------------------------------------------------------------------------

def _tfidf_similarity(query: str, documents: list[str]) -> list[float]:
    """Compute cosine similarity between query and documents using TF-IDF."""
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity

    if not documents:
        return []

    corpus = [query] + documents
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(corpus)

    # Similarity of query (row 0) against all documents (rows 1+)
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    return similarities.tolist()


# ---------------------------------------------------------------------------
# Core RAG operations
# ---------------------------------------------------------------------------

def index_document(db: Session, doc_id: str, filename: str, file_type: str, chunks: list[str]) -> dict:
    """Store document chunks in PostgreSQL for lightweight RAG."""
    # Save metadata + chunks as JSON in the database
    doc = RagDocument(
        document_id=doc_id,
        filename=filename,
        stored_filename=f"{doc_id}.{file_type}",
        file_type=file_type,
        chunk_count=len(chunks),
        chunks_json=json.dumps(chunks)  # Store chunks directly in DB
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {
        "document_id": doc.document_id,
        "filename": doc.filename,
        "file_type": doc.file_type,
        "chunks": doc.chunk_count,
        "uploaded_at": doc.uploaded_at.isoformat() + "Z"
    }


def retrieve_chunks(doc_id: str, question: str, top_k: int = 5, db: Session = None) -> list[dict]:
    """Retrieve the most relevant chunks for a question using TF-IDF similarity."""
    if db is None:
        from database import SessionLocal
        db = SessionLocal()
        should_close = True
    else:
        should_close = False

    try:
        doc = db.query(RagDocument).filter(RagDocument.document_id == doc_id).first()
        if not doc:
            raise ValueError(f"Document '{doc_id}' not found in database.")

        chunks = json.loads(doc.chunks_json) if doc.chunks_json else []
        if not chunks:
            return []

        # Compute TF-IDF similarity
        similarities = _tfidf_similarity(question, chunks)

        # Get top-k chunks by similarity
        indexed_sims = sorted(enumerate(similarities), key=lambda x: x[1], reverse=True)[:top_k]

        sources = []
        for idx, score in indexed_sims:
            if score > 0.01:  # Filter out near-zero matches
                text = chunks[idx]
                sources.append({
                    "chunk_id": f"chunk_{idx}",
                    "text_preview": text[:300] + ("..." if len(text) > 300 else ""),
                    "full_text": text,
                    "distance": round(1 - score, 4),  # Convert similarity to distance
                })
        return sources
    finally:
        if should_close:
            db.close()


def build_rag_prompt(question: str, sources: list[dict]) -> str:
    """Build the RAG prompt from retrieved context."""
    context = "\n\n---\n\n".join([s["full_text"] for s in sources])
    return f"""You are a helpful document analysis assistant.
Use only the provided document context to answer the user's question.
Do not make up information.
If the answer is not found in the context, clearly say that the document does not contain enough information.

Context:
{context}

Question:
{question}

Answer:"""


def generate_fallback_answer(question: str, sources: list[dict]) -> str:
    """Generate a basic answer from retrieved chunks when Groq is unavailable."""
    if not sources:
        return "The uploaded document does not contain enough information to answer this question."
    context_preview = "\n\n".join([f"• {s['text_preview']}" for s in sources[:3]])
    return f"**Fallback answer** (AI model unavailable — showing relevant document excerpts):\n\n{context_preview}"


def get_all_documents(db: Session) -> list[dict]:
    """Return metadata for all indexed documents."""
    docs = db.query(RagDocument).order_by(RagDocument.uploaded_at.desc()).all()
    return [
        {
            "document_id": d.document_id,
            "filename": d.filename,
            "file_type": d.file_type,
            "chunks": d.chunk_count,
            "uploaded_at": d.uploaded_at.isoformat() + "Z"
        } for d in docs
    ]


def get_document_meta(db: Session, doc_id: str) -> dict | None:
    """Return metadata for a single document."""
    d = db.query(RagDocument).filter(RagDocument.document_id == doc_id).first()
    if d:
        return {
            "document_id": d.document_id,
            "filename": d.filename,
            "file_type": d.file_type,
            "chunks": d.chunk_count,
            "uploaded_at": d.uploaded_at.isoformat() + "Z"
        }
    return None


def delete_document(db: Session, doc_id: str) -> bool:
    """Delete a document's metadata and stored chunks."""
    d = db.query(RagDocument).filter(RagDocument.document_id == doc_id).first()
    if d:
        db.delete(d)
        db.commit()
        return True
    return False


def check_rag_status() -> dict:
    """Return RAG subsystem health info."""
    try:
        from database import SessionLocal
        db = SessionLocal()
        count = db.query(RagDocument).count()
        db.close()
        return {
            "rag": "available",
            "vector_db": "postgresql (lightweight TF-IDF)",
            "indexed_documents": count,
        }
    except Exception as e:
        return {
            "rag": "unavailable",
            "vector_db": f"error: {str(e)}",
            "indexed_documents": 0,
        }
