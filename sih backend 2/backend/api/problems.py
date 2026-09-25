"""Problem management endpoints: create, list, view details."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query
from backend.core.database import db_manager
from backend.core.rbac import get_current_user
from backend.models.user import UserResponse
from backend.models.problem import (
    ProblemCreateRequest,
    ProblemResponse,
    ProblemInDB,
)
from backend.shared.constants.departments import CATEGORY_TO_DEPARTMENT
from backend.shared.constants.sla import SLA_HOURS_MAP
from backend.shared.enums.civic import IssueCategory, PriorityLevel, ResponsibleDepartment

router = APIRouter(prefix="/problems", tags=["Problems & Civic Issues"])


@router.post(
    "",
    response_model=ProblemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Submit a new civic problem report",
)
async def create_problem(
    payload: ProblemCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
):
    """Submits a civic issue with category, location, and evidence."""
    # Determine responsible government department automatically
    dept_enum = CATEGORY_TO_DEPARTMENT.get(
        payload.category,
        ResponsibleDepartment.MUNICIPAL_CORPORATION,
    )
    assigned_dept = dept_enum.value

    # Determine resolution timeline SLA in hours
    sla = SLA_HOURS_MAP.get(payload.priority or PriorityLevel.MEDIUM, 120)

    new_problem = ProblemInDB(
        title=payload.title.strip(),
        description=payload.description.strip(),
        category=payload.category.value,
        sub_category=payload.sub_category.value if payload.sub_category else None,
        priority=payload.priority.value if payload.priority else "MEDIUM",
        severity=payload.severity.value if payload.severity else "MODERATE",
        location=payload.location.model_dump() if payload.location else None,
        citizen_id=current_user.id,
        citizen_name=current_user.name,
        assigned_department=assigned_dept,
        evidence_urls=payload.evidence_urls,
        sla_hours=sla,
    )

    doc = new_problem.model_dump()
    await db_manager.insert_one("problems", doc)

    return ProblemResponse(**doc)


@router.get(
    "",
    response_model=List[ProblemResponse],
    status_code=status.HTTP_200_OK,
    summary="List civic problems with filtering",
)
async def list_problems(
    category: Optional[str] = Query(None, description="Filter by category"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    department: Optional[str] = Query(None, description="Filter by department"),
    limit: int = Query(50, ge=1, le=100),
):
    """Retrieves civic problems matching search or filter criteria."""
    query = {}
    if category:
        query["category"] = category.upper()
    if status_filter:
        query["status"] = status_filter.upper()
    if department:
        query["assigned_department"] = department.upper()

    docs = await db_manager.find_many("problems", query=query, limit=limit)
    return [ProblemResponse(**d) for d in docs]


@router.get(
    "/{problem_id}",
    response_model=ProblemResponse,
    status_code=status.HTTP_200_OK,
    summary="Get problem report details",
)
async def get_problem(problem_id: str):
    """Fetches details for a specific civic issue report."""
    doc = await db_manager.find_one("problems", {"id": problem_id})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Problem report with ID '{problem_id}' was not found.",
        )
    return ProblemResponse(**doc)
