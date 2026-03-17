---
name: biosecure-backend
description: BioSecure backend development skill. Use this skill for ALL backend tasks related to BioSecure deepfake detection project. Triggers when user mentions BioSecure backend, FastAPI, detection API, database, Redis, MinIO, Celery, chatbot service, or any backend feature. Always read this skill before writing any backend code or making any backend decision.
---

# BioSecure — Backend Development Guide

## Project Overview
BioSecure is a professional deepfake detection web application. We are currently building ONLY the backend. Frontend is already done and must NOT be touched.

---

## ⚠️ STRICT RULES — READ FIRST

1. **ONLY work inside `backend/` folder** — nothing outside
2. **Never touch** `app/` `components/` `lib/` `public/` — frontend is DONE
3. **Never touch** `pdfService.ts` `sessionHistoryService.ts` `AIChatbot.tsx`
4. **Never touch** `package.json` or any `.tsx` `.ts` files
5. **Python 3.11 or 3.12 ONLY** — never suggest Python 3.14
6. **Never use MySQL** — PostgreSQL only
7. **Never use Dlib** — MediaPipe only
8. **Never use TensorFlow** — PyTorch only
9. **Never hardcode API keys** — always os.getenv()
10. **No Docker/Nginx** — skip deployment for now
11. **AI models are NOT connected yet** — backend will return mock detection results for now until AI phase starts

---

## Backend Tech Stack

| Tool | Detail |
|---|---|
| Language | Python 3.11 or 3.12 |
| Framework | FastAPI |
| Task Queue | Celery |
| Cache + Broker | Redis |
| Database | PostgreSQL |
| File Storage | MinIO |
| Data Validation | Pydantic v2 |
| Video Processing | OpenCV + FFmpeg |
| Face Detection | MediaPipe ONLY |
| Chatbot SDK | OpenAI SDK pointed at Groq |
| Chatbot Model | llama-3.3-70b-versatile |

---

## Backend Folder Structure (Build Exactly This)

```
backend/
├── main.py                          ← FastAPI app entry point
├── requirements.txt                 ← all dependencies
├── .env                             ← environment variables
└── app/
    ├── routes/
    │   ├── __init__.py
    │   ├── detection.py             ← video/image/url upload endpoints
    │   ├── chat.py                  ← chatbot endpoint
    │   └── stats.py                 ← global stats endpoint
    ├── services/
    │   ├── __init__.py
    │   ├── detection_service.py     ← main detection logic
    │   ├── ensemble_service.py      ← model fusion (mock for now)
    │   ├── bio_signal_service.py    ← blink + rPPG (mock for now)
    │   ├── gradcam_service.py       ← heatmap (mock for now)
    │   └── chat_service.py          ← Groq chatbot logic
    ├── models/
    │   ├── __init__.py
    │   ├── schemas.py               ← Pydantic request/response schemas
    │   └── db_models.py             ← SQLAlchemy database models
    └── utils/
        ├── __init__.py
        ├── face_extractor.py        ← MediaPipe face crop
        ├── video_processor.py       ← FFmpeg frame extraction
        └── db.py                    ← PostgreSQL connection
```

---

## requirements.txt (Exact)

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.0
pydantic==2.7.0
pydantic-settings==2.3.0
sqlalchemy==2.0.30
asyncpg==0.29.0
alembic==1.13.1
celery==5.4.0
redis==5.0.4
minio==7.2.7
opencv-python==4.10.0.84
mediapipe==0.10.14
numpy==1.26.4
python-multipart==0.0.9
python-dotenv==1.0.1
openai==1.35.0
httpx==0.27.0
pillow==10.3.0
```

---

## Environment Variables

```bash
# backend/.env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost/biosecure
REDIS_URL=redis://localhost:6379/0
MINIO_URL=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=biosecure-media
GROQ_API_KEY=your_groq_api_key_here
```

---

## main.py (Entry Point)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import detection, chat, stats

app = FastAPI(title="BioSecure API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(detection.router, prefix="/api/detection", tags=["detection"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "BioSecure API"}
```

---

## API Endpoints (Build These)

### Detection Routes — `/api/detection`
```
POST /api/detection/video     ← upload video file
POST /api/detection/image     ← upload image file
POST /api/detection/url       ← analyze from URL
GET  /api/detection/{task_id} ← poll result status
```

### Chat Route — `/api/chat`
```
POST /api/chat                ← send message to BioSecure AI
```

### Stats Route — `/api/stats`
```
GET /api/stats                ← global platform statistics
```

---

## DetectionResult Schema (Frontend Depends on This — NEVER Change)

```python
# backend/app/models/schemas.py

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
```

---

## Database Tables (SQLAlchemy)

```python
# backend/app/models/db_models.py

# Tables to create:
# 1. video_analysis      → task_id, verdict, confidence, severity, timestamps
# 2. frame_analysis      → frame data, heatmap refs, video_analysis FK
# 3. chat_conversations  → session_id, role, message, timestamp
# 4. global_stats        → total_analyses, fake_count, real_count, suspicious_count
```

---

## Chatbot Service (OpenAI SDK + Groq)

```python
# backend/app/services/chat_service.py
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """You are BioSecure AI, an expert deepfake detection assistant.
Help users understand their analysis results clearly and professionally.
Never mention Llama, Groq, or OpenAI. You are BioSecure AI only."""

def get_chat_response(session_id: str, message: str, detection_results: dict, history: list) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Analysis: {detection_results}"},
        {"role": "assistant", "content": "I have reviewed the analysis results."},
        *history,
        {"role": "user", "content": message}
    ]
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        max_tokens=300,
        temperature=0.7
    )
    return response.choices[0].message.content
```

---

## Detection Severity Logic

```python
def get_verdict(confidence: float):
    if confidence < 40:
        return "REAL"
    elif confidence < 70:
        return "SUSPICIOUS"
    else:
        return "FAKE"

def get_severity_score(confidence: float) -> float:
    return round(confidence / 10, 1)  # 0-10 scale
```

---

## Mock Detection Response (Use Until AI Models Ready)

```python
mock_result = DetectionResult(
    task_id="mock-123",
    status="complete",
    verdict="FAKE",
    confidence=85.5,
    severity_score=8.5,
    deepfake_type=DeepfakeType(
        face_swap=0.8,
        lip_sync=0.6,
        expression_manipulation=0.4,
        temporal_inconsistency=0.7
    ),
    bio_signals=BioSignals(
        blink_rate=12.0,
        blink_status="suspicious",
        micro_expression_status="inconsistent",
        rppg_bpm=72.0,
        rppg_status="unavailable"
    ),
    explainability=Explainability(
        reason="High probability of face swap detected based on facial boundary inconsistencies.",
        key_features=["facial boundary artifacts", "unnatural blinking", "skin texture mismatch"]
    ),
    frames=[],
    heatmap_url="",
    processing_time_ms=1500.0
)
```

---

## Build Order — Phase by Phase

```
PHASE 2 — Backend Foundation
  Step 1 → Create backend/ folder structure
  Step 2 → Create requirements.txt
  Step 3 → Create .env file
  Step 4 → Create main.py (FastAPI + CORS)
  Step 5 → Create db.py (PostgreSQL connection)
  Step 6 → Create db_models.py (4 tables)
  Step 7 → Run migrations (alembic)
  Step 8 → Test: GET /health → {"status": "ok"}

PHASE 3 — Detection API
  Step 9  → Create schemas.py (DetectionResult)
  Step 10 → Create detection.py routes
  Step 11 → Create detection_service.py (mock response)
  Step 12 → Setup Celery + Redis for async tasks
  Step 13 → Test: POST /api/detection/video → mock result

PHASE 7 — Chatbot
  Step 14 → Get Groq API key from console.groq.com
  Step 15 → Create chat_service.py
  Step 16 → Create chat.py route
  Step 17 → Test: POST /api/chat → AI response

PHASE 8 — Frontend Connection
  Step 18 → Update analysisService.ts → real API calls
  Step 19 → Update AIChatbot.tsx → real /api/chat calls
  Step 20 → End to end test
```

---

## How to Run Backend

```bash
# 1. Go to backend folder
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate (Windows)
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run FastAPI server
uvicorn main:app --reload --port 8000

# 6. Test health check
# Browser: http://localhost:8000/health
# API docs: http://localhost:8000/docs
```

---

## Pending Tasks

- [ ] Create backend/ folder structure
- [ ] requirements.txt
- [ ] .env file
- [ ] main.py
- [ ] db.py (PostgreSQL)
- [ ] db_models.py (4 tables)
- [ ] schemas.py (DetectionResult)
- [ ] detection.py routes
- [ ] detection_service.py (mock)
- [ ] Celery + Redis setup
- [ ] chat_service.py (Groq)
- [ ] chat.py route
- [ ] stats.py route
