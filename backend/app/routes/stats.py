from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.schemas import StatsResponse
from app.models.db_models import GlobalStats
from app.utils.db import get_db

router = APIRouter()


@router.get("", response_model=StatsResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(GlobalStats).where(GlobalStats.id == 1))
    stats = result.scalar_one_or_none()

    if stats is None:
        # Return zeroed stats if row doesn't exist yet
        return StatsResponse(
            total_analyses=0,
            fake_count=0,
            real_count=0,
            suspicious_count=0,
        )

    return StatsResponse(
        total_analyses=stats.total_analyses,
        fake_count=stats.fake_count,
        real_count=stats.real_count,
        suspicious_count=stats.suspicious_count,
    )
