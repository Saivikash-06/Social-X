from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.escalation_service import EscalationService
from app.schemas.escalation_schemas import (
    EscalationTriggerRequest,
    EscalationLogResponse,
    EscalationPolicyCreate,
    EscalationPolicyResponse,
    SLACheckResponse,
)
from shared.enums import PriorityLevel
from shared.responses import APIResponse

router = APIRouter()


@router.post(
    "/escalations/trigger",
    response_model=APIResponse[EscalationLogResponse],
    summary="Trigger escalation for an issue",
    description="Escalates an issue to a higher administrative hierarchy due to delay or citizen distress.",
)
async def trigger_escalation(req: EscalationTriggerRequest, db: AsyncSession = Depends(get_db)):
    service = EscalationService(db)
    log_entry = await service.trigger_escalation(req)
    await db.commit()
    await db.refresh(log_entry)
    res = EscalationLogResponse(
        id=log_entry.id,
        workflow_instance_id=log_entry.workflow_instance_id,
        issue_id=log_entry.issue_id,
        escalation_level=log_entry.escalation_level,
        reason=log_entry.reason,
        triggered_by=log_entry.triggered_by,
        previous_owner_id=log_entry.previous_owner_id,
        new_owner_id=log_entry.new_owner_id,
        notified_stakeholders=log_entry.notified_stakeholders or [],
        created_at=log_entry.created_at.isoformat(),
    )
    return APIResponse(
        message=f"Issue escalated to {req.target_level.value}",
        data=res,
    )


@router.get(
    "/escalations/{issue_id}/sla",
    response_model=APIResponse[SLACheckResponse],
    summary="Check SLA and breach status",
    description="Calculates remaining hours and returns whether the issue has breached its SLA.",
)
async def check_sla(issue_id: str, db: AsyncSession = Depends(get_db)):
    service = EscalationService(db)
    result = await service.check_sla_status(issue_id)
    return APIResponse(message="SLA status evaluated", data=result)


@router.get(
    "/escalations/{issue_id}/logs",
    response_model=APIResponse[List[EscalationLogResponse]],
    summary="Get escalation history for an issue",
)
async def list_escalation_logs(issue_id: str, db: AsyncSession = Depends(get_db)):
    service = EscalationService(db)
    logs = await service.list_escalation_logs(issue_id)
    data = [
        EscalationLogResponse(
            id=l.id,
            workflow_instance_id=l.workflow_instance_id,
            issue_id=l.issue_id,
            escalation_level=l.escalation_level,
            reason=l.reason,
            triggered_by=l.triggered_by,
            previous_owner_id=l.previous_owner_id,
            new_owner_id=l.new_owner_id,
            notified_stakeholders=l.notified_stakeholders or [],
            created_at=l.created_at.isoformat(),
        )
        for l in logs
    ]
    return APIResponse(message=f"Retrieved {len(data)} escalation logs", data=data)


@router.post(
    "/escalations/policies",
    response_model=APIResponse[EscalationPolicyResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create an escalation policy",
)
async def create_escalation_policy(req: EscalationPolicyCreate, db: AsyncSession = Depends(get_db)):
    service = EscalationService(db)
    policy = await service.create_policy(req)
    await db.commit()
    await db.refresh(policy)
    res = EscalationPolicyResponse(
        id=policy.id,
        name=policy.name,
        department_id=policy.department_id,
        priority=policy.priority,
        level=policy.level,
        breach_hours_threshold=policy.breach_hours_threshold,
        escalate_to_role=policy.escalate_to_role,
        notify_emails=policy.notify_emails or [],
        is_active=policy.is_active,
        created_at=policy.created_at.isoformat(),
    )
    return APIResponse(message="Escalation policy created successfully", data=res)


@router.get(
    "/escalations/policies",
    response_model=APIResponse[List[EscalationPolicyResponse]],
    summary="List escalation policies",
)
async def list_escalation_policies(
    department_id: Optional[str] = Query(None),
    priority: Optional[PriorityLevel] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    service = EscalationService(db)
    policies = await service.list_policies(department_id=department_id, priority=priority)
    data = [
        EscalationPolicyResponse(
            id=p.id,
            name=p.name,
            department_id=p.department_id,
            priority=p.priority,
            level=p.level,
            breach_hours_threshold=p.breach_hours_threshold,
            escalate_to_role=p.escalate_to_role,
            notify_emails=p.notify_emails or [],
            is_active=p.is_active,
            created_at=p.created_at.isoformat(),
        )
        for p in policies
    ]
    return APIResponse(message=f"Retrieved {len(data)} policies", data=data)
