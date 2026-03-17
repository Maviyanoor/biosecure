from pydantic import BaseModel
from typing import Literal


class DeepfakeType(BaseModel):
    face_swap: float
    lip_sync: float
    expression_manipulation: float
    temporal_inconsistency: float


class BioSignals(BaseModel):
    blink_rate: float
    blink_status: Literal['normal', 'suspicious']
    micro_expression_status: Literal['normal', 'inconsistent']
    rppg_bpm: float
    rppg_status: Literal['normal', 'inconsistent', 'unavailable']


class Explainability(BaseModel):
    reason: str
    key_features: list[str]


class FrameResult(BaseModel):
    frame_number: int
    timestamp_ms: float
    confidence: float
    verdict: Literal['REAL', 'FAKE', 'SUSPICIOUS']
    heatmap_url: str


class DetectionResult(BaseModel):
    task_id: str
    status: Literal['processing', 'complete', 'failed']
    verdict: Literal['REAL', 'FAKE', 'SUSPICIOUS']
    confidence: float                   # 0-100
    severity_score: float               # 0-10
    deepfake_type: DeepfakeType
    bio_signals: BioSignals
    explainability: Explainability
    frames: list[FrameResult]
    heatmap_url: str
    processing_time_ms: float


class ChatRequest(BaseModel):
    session_id: str
    message: str
    detection_results: dict = {}


class ChatResponse(BaseModel):
    session_id: str
    reply: str


class StatsResponse(BaseModel):
    total_analyses: int
    fake_count: int
    real_count: int
    suspicious_count: int
