"""
RAG service — manages embeddings, ChromaDB vector store, and LLM-based Q&A.
"""
import os
import chromadb
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from models import RagDocument

# Paths — resolved relative to the backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VECTOR_DB_DIR = os.path.join(BACKEND_DIR, "storage", "vector_db")

# Ensure storage directories exist
os.makedirs(VECTOR_DB_DIR, exist_ok=True)

# Initialize embedding model (loaded once, reused)
_embedding_model = None

def get_embedding_model() -> SentenceTransformer:
    """Lazy-load the embedding model to avoid slow import-time startup."""
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model

# Initialize ChromaDB persistent client
_chroma_client = None

def get_chroma_client() -> chromadb.ClientAPI:
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(path=VECTOR_DB_DIR)
    return _chroma_client

# ---------------------------------------------------------------------------
# Core RAG operations
# ---------------------------------------------------------------------------

def index_document(db: Session, doc_id: str, filename: str, file_type: str, chunks: list[str]) -> dict:
    """Create embeddings for chunks and store them in ChromaDB and Postgres."""
    model = get_embedding_model()
    client = get_chroma_client()

    # Create or get a collection for this document
    collection = client.get_or_create_collection(
        name=f"doc_{doc_id}",
        metadata={"hnsw:space": "cosine"},
    )

    # Generate embeddings and add to collection
    ids = [f"chunk_{i}" for i in range(len(chunks))]
    embeddings = model.encode(chunks).tolist()

    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=[{"chunk_index": i} for i in range(len(chunks))],
    )

    # Save metadata to DB
    doc = RagDocument(
        document_id=doc_id,
        filename=filename,
        stored_filename=f"{doc_id}.{file_type}",
        file_type=file_type,
        chunk_count=len(chunks)
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


def retrieve_chunks(doc_id: str, question: str, top_k: int = 5) -> list[dict]:
    """Retrieve the most relevant chunks for a question."""
    model = get_embedding_model()
    client = get_chroma_client()

    try:
        collection = client.get_collection(name=f"doc_{doc_id}")
    except Exception:
        raise ValueError(f"Document '{doc_id}' not found in vector database.")

    query_embedding = model.encode([question]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=min(top_k, collection.count()),
        include=["documents", "distances"],
    )

    sources = []
    if results and results["ids"] and results["ids"][0]:
        for i, chunk_id in enumerate(results["ids"][0]):
            sources.append({
                "chunk_id": chunk_id,
                "text_preview": results["documents"][0][i][:300] + ("..." if len(results["documents"][0][i]) > 300 else ""),
                "full_text": results["documents"][0][i],
                "distance": results["distances"][0][i] if results.get("distances") else None,
            })
    return sources


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
    """Delete a document's vectors and metadata."""
    client = get_chroma_client()

    # Remove collection from ChromaDB
    try:
        client.delete_collection(name=f"doc_{doc_id}")
    except Exception:
        pass  # collection may not exist

    # Remove from metadata
    d = db.query(RagDocument).filter(RagDocument.document_id == doc_id).first()
    if d:
        db.delete(d)
        db.commit()
        return True
    return False


def check_rag_status() -> dict:
    """Return RAG subsystem health info."""
    try:
        client = get_chroma_client()
        collections = client.list_collections()
        return {
            "rag": "available",
            "vector_db": "connected",
            "indexed_documents": len(collections),
        }
    except Exception as e:
        return {
            "rag": "unavailable",
            "vector_db": f"error: {str(e)}",
            "indexed_documents": 0,
        }
