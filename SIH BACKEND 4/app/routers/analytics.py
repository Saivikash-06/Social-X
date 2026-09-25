from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.response import ApiResponse, ResponseMeta
from app.schemas.analytics import AnalyticsData
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "",
    response_model=ApiResponse[AnalyticsData],
    summary="Comprehensive Societal Analytics & Metrics",
    description="""
Calculates multi-dimensional analytics for societal issue management:
- **Issue Overview**: Total volume, resolved count, active pending/in-progress, resolution rate, and SLA adherence.
- **Department Performance**: Resolution rates, average resolution duration (hours), SLA compliance, and composite performance rankings.
- **District Performance**: Issue density per 100k population, resolution efficiency, and inter-district rankings.
- **University Participation**: Active academic institutions, student innovation teams, deployed prototypes, and research specializations.
- **Industry Participation**: CSR capital commitment, disbursement rates, corporate sponsor leaderboards, and funded civil interventions.
- **Category Trends**: Distribution breakdown across civic sectors (Roads, Water, Sanitation, Streetlights, etc.).
- **Monthly Trends**: Longitudinal time-series monitoring reported vs. resolved patterns.
    """
)
async def get_analytics(
    start_date: Optional[datetime] = Query(None, description="Filter issues reported on or after (ISO-8601 UTC)"),
    end_date: Optional[datetime] = Query(None, description="Filter issues reported on or before (ISO-8601 UTC)"),
    department_id: Optional[int] = Query(None, description="Filter analytics by specific Department ID"),
    district_id: Optional[int] = Query(None, description="Filter analytics by specific District ID"),
    category: Optional[str] = Query(None, description="Filter analytics by issue category (e.g., ROADS, WATER_SCARCITY)"),
    session: AsyncSession = Depends(get_db)
):
    data = await AnalyticsService.get_comprehensive_analytics(
        session=session,
        start_date=start_date,
        end_date=end_date,
        department_id=department_id,
        district_id=district_id,
        category=category
    )

    return ApiResponse(
        success=True,
        message="Analytics metrics computed successfully",
        data=data,
        meta=ResponseMeta()
    )
