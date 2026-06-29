from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    title = Column(String)
    module = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    role = Column(String)
    content = Column(Text)
    module = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True)
    module = Column(String, nullable=True)
    metadata_json = Column("metadata", Text, nullable=True) # use metadata_json in python to avoid collision with sqlalchemy metadata
    created_at = Column(DateTime, default=datetime.utcnow)

class RagDocument(Base):
    __tablename__ = "rag_documents"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, unique=True, index=True)
    filename = Column(String)
    stored_filename = Column(String, nullable=True)
    file_type = Column(String)
    chunk_count = Column(Integer)
    chunks_json = Column(Text, nullable=True)  # Store document chunks in DB for Render free tier persistence
    uploaded_at = Column(DateTime, default=datetime.utcnow)

