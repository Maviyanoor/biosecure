import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.models.schemas import DetectionResult
from app.tasks.detection_task import run_detection_task

router = APIRouter()


class URLRequest(BaseModel):
    url: str


class TaskAccepted(BaseModel):
    task_id: str
    status: str


@router.post("/video", response_model=TaskAccepted)
async def detect_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video.")
    task_id = str(uuid.uuid4())
    run_detection_task.delay(task_id)
    return TaskAccepted(task_id=task_id, status="processing")


@router.post("/image", response_model=TaskAccepted)
async def detect_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    task_id = str(uuid.uuid4())
    run_detection_task.delay(task_id)
    return TaskAccepted(task_id=task_id, status="processing")


@router.post("/url", response_model=TaskAccepted)
async def detect_url(body: URLRequest):
    if not body.url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid URL.")
    task_id = str(uuid.uuid4())
    run_detection_task.delay(task_id)
    return TaskAccepted(task_id=task_id, status="processing")


@router.get("/{task_id}", response_model=DetectionResult)
async def get_result(task_id: str):
    from celery.result import AsyncResult
    from app.celery_app import celery

    task = AsyncResult(task_id, app=celery)

    if task.state == "PENDING":
        raise HTTPException(status_code=404, detail="Task not found.")

    if task.state in ("STARTED", "RETRY"):
        return DetectionResult(
            task_id=task_id,
            status="processing",
            verdict="REAL",
            confidence=0.0,
            severity_score=0.0,
            deepfake_type={"face_swap": 0, "lip_sync": 0, "expression_manipulation": 0, "temporal_inconsistency": 0},
            bio_signals={"blink_rate": 0, "blink_status": "normal", "micro_expression_status": "normal", "rppg_bpm": 0, "rppg_status": "unavailable"},
            explainability={"reason": "Processing...", "key_features": []},
            frames=[],
            heatmap_url="",
            processing_time_ms=0.0,
        )

    if task.state == "FAILURE":
        raise HTTPException(status_code=500, detail="Detection task failed.")

    return DetectionResult(**task.result)
