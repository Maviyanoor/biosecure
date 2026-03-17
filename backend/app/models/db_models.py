import uuid
from sqlalchemy import (
    Column, String, Float, Integer, Text,
    DateTime, ForeignKey, func
)
from sqlalchemy.orm import relationship
from app.utils.db import Base


class VideoAnalysis(Base):
    __tablename__ = "video_analysis"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, unique=True, nullable=False, index=True)
    status = Column(String, nullable=False, default="processing")  # processing | complete | failed
    verdict = Column(String, nullable=True)                         # REAL | FAKE | SUSPICIOUS
    confidence = Column(Float, nullable=True)                       # 0-100
    severity_score = Column(Float, nullable=True)                   # 0-10
    heatmap_url = Column(String, nullable=True)
    processing_time_ms = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    frames = relationship("FrameAnalysis", back_populates="video", cascade="all, delete-orphan")


class FrameAnalysis(Base):
    __tablename__ = "frame_analysis"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    video_analysis_id = Column(String, ForeignKey("video_analysis.id"), nullable=False)
    frame_number = Column(Integer, nullable=False)
    timestamp_ms = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    verdict = Column(String, nullable=False)   # REAL | FAKE | SUSPICIOUS
    heatmap_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    video = relationship("VideoAnalysis", back_populates="frames")


class ChatConversation(Base):
    __tablename__ = "chat_conversations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False)   # user | assistant
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class GlobalStats(Base):
    __tablename__ = "global_stats"

    id = Column(Integer, primary_key=True, default=1)
    total_analyses = Column(Integer, nullable=False, default=0)
    fake_count = Column(Integer, nullable=False, default=0)
    real_count = Column(Integer, nullable=False, default=0)
    suspicious_count = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
