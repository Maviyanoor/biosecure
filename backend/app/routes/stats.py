from fastapi import APIRouter
from app.models.schemas import StatsResponse

router = APIRouter()


@router.get("", response_model=StatsResponse)
async def get_stats():
    return StatsResponse(
        total_analyses=142,
        fake_count=58,
        real_count=71,
        suspicious_count=13,
    )
