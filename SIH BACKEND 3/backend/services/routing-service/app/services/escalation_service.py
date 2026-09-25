from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import (
    WorkflowInstanceModel,
    WorkflowHistoryModel,
    EscalationPolicyModel,
    EscalationLogModel,
)
from app.repositories.workflow_repository import WorkflowRepository
from app.repositories.escalation_repository import EscalationRepository
from app.core.redis import cache_client
from app.schemas.escalation_schemas import (
    EscalationPolicyCreate,
    EscalationTriggerRequest,
    SLACheckResponse,
)
from shared.enums import EscalationLevel, PriorityLevel
from shared.exceptions import EntityNotFoundError


class EscalationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.workflow_repo = WorkflowRepository(session)
        self.escalation_repo = EscalationRepository(session)

    async def check_sla_status(self, issue_id: str) -> SLACheckResponse:
        instance = await self.workflow_repo.get_by_issue_id(issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", issue_id)

        now = datetime.now(timezone.utc)
        is_breached = False
        hours_remaining = None

        if instance.sla_due_at:
            sla_due = instance.sla_due_at
            if sla_due.tzinfo is None:
                sla_due = sla_due.replace(tzinfo=timezone.utc)
            delta = (sla_due - now).total_seconds() / 3600.0
            hours_remaining = round(delta, 2)
            is_breached = hours_remaining < 0

        return SLACheckResponse(
            issue_id=instance.issue_id,
            sla_hours=instance.sla_hours,
            sla_due_at=instance.sla_due_at.isoformat() if instance.sla_due_at else None,
            is_breached=is_breached,
            hours_remaining=hours_remaining,
            current_escalation_level=instance.escalation_level,
        )

    async def trigger_escalation(self, request: EscalationTriggerRequest) -> EscalationLogModel:
        instance = await self.workflow_repo.get_by_issue_id(request.issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", request.issue_id)

        previous_owner = instance.owner_id
        instance.is_escalated = True
        instance.escalation_level = request.target_level

        if request.new_owner_id:
            instance.owner_id = request.new_owner_id

        # Create Escalation Log
        log_entry = EscalationLogModel(
            workflow_instance_id=instance.id,
            issue_id=instance.issue_id,
            escalation_level=request.target_level,
            reason=request.reason,
            triggered_by=request.triggered_by,
            previous_owner_id=previous_owner,
            new_owner_id=instance.owner_id,
            notified_stakeholders=["district_collector@gov.in", "department_head@gov.in"],
        )
        saved_log = await self.escalation_repo.create_escalation_log(log_entry)

        # Record History in Workflow
        history = WorkflowHistoryModel(
            workflow_instance_id=instance.id,
            issue_id=instance.issue_id,
            from_state=instance.current_state,
            to_state=instance.current_state,
            trigger=f"ESCALATION_TRIGGERED_{request.target_level.name}",
            actor_id=request.triggered_by,
            actor_role="EscalationManager",
            remarks=f"Escalated to {request.target_level.value}. Reason: {request.reason}",
            metadata_snapshot={
                "escalation_level": request.target_level.value,
                "previous_owner": previous_owner,
                "new_owner": instance.owner_id,
            },
        )
        await self.workflow_repo.add_history(history)

        await cache_client.publish_event("escalation_events", {
            "event_type": "ISSUE_ESCALATED",
            "issue_id": instance.issue_id,
            "escalation_level": request.target_level.value,
            "reason": request.reason,
        })
        return saved_log

    async def create_policy(self, request: EscalationPolicyCreate) -> EscalationPolicyModel:
        policy = EscalationPolicyModel(
            name=request.name,
            department_id=request.department_id,
            priority=request.priority,
            level=request.level,
            breach_hours_threshold=request.breach_hours_threshold,
            escalate_to_role=request.escalate_to_role,
            notify_emails=request.notify_emails,
            is_active=request.is_active,
        )
        return await self.escalation_repo.create_policy(policy)

    async def list_policies(
        self,
        department_id: Optional[str] = None,
        priority: Optional[PriorityLevel] = None,
    ) -> List[EscalationPolicyModel]:
        return await self.escalation_repo.list_policies(department_id=department_id, priority=priority)

    async def list_escalation_logs(self, issue_id: str) -> List[EscalationLogModel]:
        return await self.escalation_repo.list_logs_for_issue(issue_id)
