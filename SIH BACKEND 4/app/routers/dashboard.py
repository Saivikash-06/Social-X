from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.response import ApiResponse, ResponseMeta
from app.schemas.dashboard import (
    AdminDashboardData,
    GovDashboardData,
    UniversityDashboardData,
    IndustryDashboardData,
    CitizenDashboardData
)
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboards"])


@router.get(
    "/admin",
    response_model=ApiResponse[AdminDashboardData],
    summary="Admin Command Center Dashboard",
    description="Returns overarching governance KPIs, department resolution leaderboards, category distributions, critical SLA breaches, and recent activity logs."
)
async def get_admin_dashboard(
    session: AsyncSession = Depends(get_db)
):
    data = await DashboardService.get_admin_dashboard(session)
    return ApiResponse(
        success=True,
        message="Admin dashboard metrics retrieved successfully",
        data=data,
        meta=ResponseMeta()
    )


@router.get(
    "/gov",
    response_model=ApiResponse[GovDashboardData],
    summary="Government Department Operations Dashboard",
    description="Returns department-level metrics, priority action backlogs, SLA compliance stats, and district breakdown."
)
async def get_gov_dashboard(
    department_id: Optional[int] = Query(None, description="Filter by specific Department ID"),
    district_id: Optional[int] = Query(None, description="Filter by specific District ID"),
    session: AsyncSession = Depends(get_db)
):
    data = await DashboardService.get_gov_dashboard(
        session=session,
        department_id=department_id,
        district_id=district_id
    )
    return ApiResponse(
        success=True,
        message="Government operations dashboard retrieved successfully",
        data=data,
        meta=ResponseMeta()
    )


@router.get(
    "/university",
    response_model=ApiResponse[UniversityDashboardData],
    summary="University Research & Innovation Dashboard",
    description="Returns student innovation projects, active research teams, and open societal challenges ripe for academic intervention."
)
async def get_university_dashboard(
    university_id: Optional[int] = Query(None, description="Filter by University ID"),
    session: AsyncSession = Depends(get_db)
):
    data = await DashboardService.get_university_dashboard(
        session=session,
        university_id=university_id
    )
    return ApiResponse(
        success=True,
        message="University collaboration dashboard retrieved successfully",
        data=data,
        meta=ResponseMeta()
    )


@router.get(
    "/industry",
    response_model=ApiResponse[IndustryDashboardData],
    summary="Industry CSR & Partnership Dashboard",
    description="Returns CSR budget allocation vs disbursement, active corporate partnerships, and high-impact funding opportunities."
)
async def get_industry_dashboard(
    industry_id: Optional[int] = Query(None, description="Filter by Industry ID"),
    session: AsyncSession = Depends(get_db)
):
    data = await DashboardService.get_industry_dashboard(
        session=session,
        industry_id=industry_id
    )
    return ApiResponse(
        success=True,
        message="Industry CSR dashboard retrieved successfully",
        data=data,
        meta=ResponseMeta()
    )


@router.get(
    "/citizen",
    response_model=ApiResponse[CitizenDashboardData],
    summary="Citizen Public Transparency Dashboard",
    description="Returns public transparency metrics, average days to resolve civic issues, user's submitted complaints, and recent resolutions."
)
async def get_citizen_dashboard(
    citizen_id: Optional[str] = Query(None, description="Citizen identifier to view personal tickets"),
    district_id: Optional[int] = Query(None, description="District ID for localized transparency statistics"),
    session: AsyncSession = Depends(get_db)
):
    data = await DashboardService.get_citizen_dashboard(
        session=session,
        citizen_id=citizen_id,
        district_id=district_id
    )
    return ApiResponse(
        success=True,
        message="Citizen transparency dashboard retrieved successfully",
        data=data,
        meta=ResponseMeta()
    )
