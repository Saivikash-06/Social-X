from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.workflow_service import WorkflowService
from app.schemas.workflow_schemas import (
    WorkflowCreateRequest,
    WorkflowTransitionRequest,
    CitizenVerificationRequest,
    WorkflowResponse,
    WorkflowHistoryResponse,
)
from shared.enums import WorkflowStatus
from shared.responses import APIResponse

router = APIRouter()


def serialize_workflow(w) -> WorkflowResponse:
    history_items = [
        WorkflowHistoryResponse(
            id=h.id,
            workflow_instance_id=h.workflow_instance_id,
            issue_id=h.issue_id,
            from_state=h.from_state,
            to_state=h.to_state,
            trigger=h.trigger,
            actor_id=h.actor_id,
            actor_role=h.actor_role,
            remarks=h.remarks,
            created_at=h.created_at.isoformat(),
        )
        for h in (w.history or [])
    ]
    return WorkflowResponse(
        id=w.id,
        issue_id=w.issue_id,
        current_state=w.current_state,
        previous_state=w.previous_state,
        priority=w.priority,
        category=w.category,
        district_id=w.district_id,
        assigned_department_id=w.assigned_department_id,
        assigned_office_id=w.assigned_office_id,
        owner_id=w.owner_id,
        owner_name=w.owner_name,
        owner_email=w.owner_email,
        sla_hours=w.sla_hours,
        sla_due_at=w.sla_due_at.isoformat() if w.sla_due_at else None,
        is_escalated=w.is_escalated,
        escalation_level=w.escalation_level,
        resolution_notes=w.resolution_notes,
        resolution_evidence_url=w.resolution_evidence_url,
        citizen_verified=w.citizen_verified,
        citizen_feedback=w.citizen_feedback,
        citizen_rating=w.citizen_rating,
        created_at=w.created_at.isoformat(),
        updated_at=w.updated_at.isoformat(),
        history=history_items,
    )


@router.post(
    "/workflow",
    response_model=APIResponse[WorkflowResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Initialize workflow for an issue",
    description="Registers a new issue in the Submitted state with automated SLA calculation.",
)
async def create_workflow(req: WorkflowCreateRequest, db: AsyncSession = Depends(get_db)):
    service = WorkflowService(db)
    instance = await service.create_workflow(req)
    await db.commit()
    # Re-fetch with history eager loaded
    full_instance = await service.get_workflow_by_issue_id(instance.issue_id)
    return APIResponse(message="Workflow initialized in 'Submitted' state", data=serialize_workflow(full_instance))


@router.get(
    "/workflow/{issue_id}",
    response_model=APIResponse[WorkflowResponse],
    summary="Get workflow status and complete audit trail",
)
async def get_workflow(issue_id: str, db: AsyncSession = Depends(get_db)):
    service = WorkflowService(db)
    instance = await service.get_workflow_by_issue_id(issue_id)
    return APIResponse(message="Workflow status retrieved", data=serialize_workflow(instance))


@router.post(
    "/workflow/{issue_id}/transition",
    response_model=APIResponse[WorkflowResponse],
    summary="Transition workflow state",
    description="Validates and moves the issue through the 8-state governance lifecycle.",
)
async def transition_workflow(
    issue_id: str, req: WorkflowTransitionRequest, db: AsyncSession = Depends(get_db)
):
    service = WorkflowService(db)
    updated = await service.transition_state(issue_id, req)
    await db.commit()
    full_instance = await service.get_workflow_by_issue_id(issue_id)
    return APIResponse(
        message=f"State transitioned to '{full_instance.current_state.value}'",
        data=serialize_workflow(full_instance),
    )


@router.post(
    "/workflow/{issue_id}/verify",
    response_model=APIResponse[WorkflowResponse],
    summary="Citizen Verification of completion",
    description="Citizen verifies resolution satisfaction, closing the issue or reopening it.",
)
async def verify_by_citizen(
    issue_id: str, req: CitizenVerificationRequest, db: AsyncSession = Depends(get_db)
):
    service = WorkflowService(db)
    updated = await service.verify_by_citizen(issue_id, req)
    await db.commit()
    full_instance = await service.get_workflow_by_issue_id(issue_id)
    action = "closed" if req.verified_satisfactory else "reopened"
    return APIResponse(
        message=f"Citizen verification recorded. Issue is now '{full_instance.current_state.value}'.",
        data=serialize_workflow(full_instance),
    )


@router.get(
    "/workflow",
    response_model=APIResponse[List[WorkflowResponse]],
    summary="List workflows with optional filters",
)
async def list_workflows(
    status_filter: Optional[WorkflowStatus] = Query(None, alias="status"),
    department_id: Optional[str] = Query(None),
    owner_id: Optional[str] = Query(None),
    is_escalated: Optional[bool] = Query(None),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    service = WorkflowService(db)
    instances = await service.workflow_repo.list_instances(
        status=status_filter,
        department_id=department_id,
        owner_id=owner_id,
        is_escalated=is_escalated,
        limit=limit,
        offset=offset,
    )
    data = [serialize_workflow(inst) for inst in instances]
    return APIResponse(message=f"Retrieved {len(data)} workflows", data=data)
