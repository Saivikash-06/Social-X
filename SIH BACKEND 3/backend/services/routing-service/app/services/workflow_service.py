from datetime import datetime, timezone, timedelta
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import WorkflowInstanceModel, WorkflowHistoryModel
from app.repositories.workflow_repository import WorkflowRepository
from app.repositories.department_repository import DepartmentRepository
from app.workflow.engine import WorkflowEngine
from app.core.redis import cache_client
from app.core.config import settings
from app.schemas.workflow_schemas import (
    WorkflowCreateRequest,
    WorkflowTransitionRequest,
    CitizenVerificationRequest,
)
from shared.enums import WorkflowStatus, PriorityLevel, EscalationLevel
from shared.exceptions import EntityNotFoundError, InvalidStateTransitionError


class WorkflowService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.workflow_repo = WorkflowRepository(session)
        self.dept_repo = DepartmentRepository(session)

    def calculate_sla_hours(self, priority: PriorityLevel) -> int:
        if priority == PriorityLevel.CRITICAL:
            return settings.SLA_HOURS_CRITICAL
        elif priority == PriorityLevel.HIGH:
            return settings.SLA_HOURS_HIGH
        elif priority == PriorityLevel.MEDIUM:
            return settings.SLA_HOURS_MEDIUM
        return settings.SLA_HOURS_LOW

    async def create_workflow(self, request: WorkflowCreateRequest) -> WorkflowInstanceModel:
        existing = await self.workflow_repo.get_by_issue_id(request.issue_id)
        if existing:
            return existing

        sla_hours = request.sla_hours or self.calculate_sla_hours(request.priority)
        sla_due_at = datetime.now(timezone.utc) + timedelta(hours=sla_hours)

        instance = WorkflowInstanceModel(
            issue_id=request.issue_id,
            current_state=WorkflowStatus.SUBMITTED,
            previous_state=None,
            priority=request.priority,
            category=request.category,
            district_id=request.district_id,
            assigned_department_id=request.assigned_department_id,
            assigned_office_id=request.assigned_office_id,
            sla_hours=sla_hours,
            sla_due_at=sla_due_at,
        )
        saved = await self.workflow_repo.create_instance(instance)

        # Initial history
        history = WorkflowHistoryModel(
            workflow_instance_id=saved.id,
            issue_id=saved.issue_id,
            from_state=WorkflowStatus.SUBMITTED,
            to_state=WorkflowStatus.SUBMITTED,
            trigger="ISSUE_REGISTERED",
            actor_id="SYSTEM",
            actor_role="SystemInit",
            remarks=request.initial_remarks,
            metadata_snapshot={"priority": request.priority.value, "sla_hours": sla_hours},
        )
        await self.workflow_repo.add_history(history)

        await cache_client.publish_event("workflow_events", {
            "event_type": "WORKFLOW_CREATED",
            "issue_id": saved.issue_id,
            "status": saved.current_state.value,
        })
        return saved

    async def get_workflow_by_issue_id(self, issue_id: str) -> WorkflowInstanceModel:
        instance = await self.workflow_repo.get_by_issue_id(issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", issue_id)
        return instance

    async def transition_state(
        self, issue_id: str, request: WorkflowTransitionRequest
    ) -> WorkflowInstanceModel:
        instance = await self.workflow_repo.get_by_issue_id(issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", issue_id)

        current_state = instance.current_state
        target_state = request.to_state

        # Validate with WorkflowEngine
        WorkflowEngine.validate_transition(
            current_state=current_state,
            target_state=target_state,
            assigned_department_id=instance.assigned_department_id,
            owner_id=instance.owner_id,
            resolution_notes=request.resolution_notes or instance.resolution_notes,
        )

        # Update state
        instance.previous_state = current_state
        instance.current_state = target_state

        if request.resolution_notes:
            instance.resolution_notes = request.resolution_notes
        if request.resolution_evidence_url:
            instance.resolution_evidence_url = request.resolution_evidence_url

        # Auto-trigger Citizen Verification when state becomes Completed
        auto_citizen_step = False
        if target_state == WorkflowStatus.COMPLETED:
            instance.previous_state = WorkflowStatus.COMPLETED
            instance.current_state = WorkflowStatus.CITIZEN_VERIFICATION
            auto_citizen_step = True

        # Record History
        history = WorkflowHistoryModel(
            workflow_instance_id=instance.id,
            issue_id=instance.issue_id,
            from_state=current_state,
            to_state=instance.current_state,
            trigger=f"TRANSITION_TO_{target_state.value.upper().replace(' ', '_')}",
            actor_id=request.actor_id,
            actor_role=request.actor_role,
            remarks=request.remarks or (
                "Completed by official and sent for citizen verification." if auto_citizen_step else f"Transitioned from {current_state.value} to {target_state.value}."
            ),
            metadata_snapshot=request.metadata_snapshot,
        )
        await self.workflow_repo.add_history(history)

        await cache_client.publish_event("workflow_events", {
            "event_type": "WORKFLOW_TRANSITIONED",
            "issue_id": instance.issue_id,
            "from_state": current_state.value,
            "to_state": instance.current_state.value,
            "actor_id": request.actor_id,
        })
        return instance

    async def verify_by_citizen(
        self, issue_id: str, request: CitizenVerificationRequest
    ) -> WorkflowInstanceModel:
        instance = await self.workflow_repo.get_by_issue_id(issue_id)
        if not instance:
            raise EntityNotFoundError("WorkflowInstance", issue_id)

        if instance.current_state != WorkflowStatus.CITIZEN_VERIFICATION:
            raise InvalidStateTransitionError(
                current_state=instance.current_state.value,
                attempted_state=WorkflowStatus.CLOSED.value if request.verified_satisfactory else WorkflowStatus.REOPENED.value,
                reason="Citizen verification can only be performed when issue is in 'Citizen Verification' state.",
            )

        instance.citizen_verified = True
        instance.citizen_feedback = request.feedback
        instance.citizen_rating = request.rating

        previous_state = instance.current_state
        if request.verified_satisfactory:
            instance.previous_state = previous_state
            instance.current_state = WorkflowStatus.CLOSED
            trigger = "CITIZEN_VERIFIED_CLOSED"
            remarks = f"Citizen verified resolution successfully with rating {request.rating or 'N/A'}."
        else:
            instance.previous_state = previous_state
            instance.current_state = WorkflowStatus.REOPENED
            trigger = "CITIZEN_REJECTED_REOPENED"
            remarks = f"Citizen unsatisfied with resolution. Reopened with feedback: {request.feedback}"

        history = WorkflowHistoryModel(
            workflow_instance_id=instance.id,
            issue_id=instance.issue_id,
            from_state=previous_state,
            to_state=instance.current_state,
            trigger=trigger,
            actor_id=request.citizen_id,
            actor_role="Citizen",
            remarks=remarks,
            metadata_snapshot={
                "rating": request.rating,
                "feedback": request.feedback,
                "verified_satisfactory": request.verified_satisfactory,
            },
        )
        await self.workflow_repo.add_history(history)

        await cache_client.publish_event("workflow_events", {
            "event_type": trigger,
            "issue_id": instance.issue_id,
            "to_state": instance.current_state.value,
        })
        return instance
