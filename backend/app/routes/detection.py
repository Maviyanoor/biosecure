import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.models.schemas import DetectionResult
from app.services.detection_service import run_mock_detection

router = APIRouter()


class URLRequest(BaseModel):
    url: str


@router.post("/video", response_model=DetectionResult)
async def detect_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video.")
    task_id = str(uuid.uuid4())
    result = run_mock_detection(task_id)
    return DetectionResult(**result)


@router.post("/image", response_model=DetectionResult)
async def detect_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")
    task_id = str(uuid.uuid4())
    result = run_mock_detection(task_id)
    return DetectionResult(**result)


@router.post("/url", response_model=DetectionResult)
async def detect_url(body: URLRequest):
    if not body.url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid URL.")
    task_id = str(uuid.uuid4())
    result = run_mock_detection(task_id)
    return DetectionResult(**result)
