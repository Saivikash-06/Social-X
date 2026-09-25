from typing import Dict, List, Set, Tuple
from shared.enums import WorkflowStatus
from shared.exceptions import InvalidStateTransitionError


class WorkflowEngine:
    """
    Finite State Machine engine enforcing the platform's 8-stage civic issue workflow.
    Submitted -> Verified -> Assigned -> Accepted -> In Progress -> Completed -> Citizen Verification -> Closed
    Also supports authorized Rejection and Reopen cycles.
    """

    # Allowed transitions graph: {from_state: set(to_states)}
    ALLOWED_TRANSITIONS: Dict[WorkflowStatus, Set[WorkflowStatus]] = {
        WorkflowStatus.SUBMITTED: {
            WorkflowStatus.VERIFIED,
            WorkflowStatus.REJECTED,
        },
        WorkflowStatus.VERIFIED: {
            WorkflowStatus.ASSIGNED,
            WorkflowStatus.REJECTED,
        },
        WorkflowStatus.ASSIGNED: {
            WorkflowStatus.ACCEPTED,
            WorkflowStatus.ASSIGNED,  # Reassignment allowed in assigned state
            WorkflowStatus.REJECTED,
        },
        WorkflowStatus.ACCEPTED: {
            WorkflowStatus.IN_PROGRESS,
            WorkflowStatus.ASSIGNED,  # Return/reassign if out of jurisdiction
        },
        WorkflowStatus.IN_PROGRESS: {
            WorkflowStatus.COMPLETED,
            WorkflowStatus.ASSIGNED,  # Escalate/reassign during progress
        },
        WorkflowStatus.COMPLETED: {
            WorkflowStatus.CITIZEN_VERIFICATION,
            WorkflowStatus.IN_PROGRESS,  # Internal rework
        },
        WorkflowStatus.CITIZEN_VERIFICATION: {
            WorkflowStatus.CLOSED,
            WorkflowStatus.REOPENED,
        },
        WorkflowStatus.REOPENED: {
            WorkflowStatus.IN_PROGRESS,
            WorkflowStatus.ASSIGNED,
        },
        WorkflowStatus.REJECTED: {
            WorkflowStatus.SUBMITTED,  # Appeal/Resubmission
        },
        WorkflowStatus.CLOSED: set(),  # Terminal state
    }

    @classmethod
    def can_transition(cls, current_state: WorkflowStatus, target_state: WorkflowStatus) -> bool:
        allowed = cls.ALLOWED_TRANSITIONS.get(current_state, set())
        return target_state in allowed

    @classmethod
    def validate_transition(
        cls,
        current_state: WorkflowStatus,
        target_state: WorkflowStatus,
        assigned_department_id: str = None,
        owner_id: str = None,
        resolution_notes: str = None,
    ) -> None:
        """
        Validate whether the transition is topologically allowed and satisfies business guards.
        """
        if not cls.can_transition(current_state, target_state):
            allowed_list = [s.value for s in cls.ALLOWED_TRANSITIONS.get(current_state, set())]
            raise InvalidStateTransitionError(
                current_state=current_state.value,
                attempted_state=target_state.value,
                reason=f"Permitted next states from '{current_state.value}' are: {allowed_list}",
            )

        # Guard 1: To transition to Assigned, a department must be designated
        if target_state == WorkflowStatus.ASSIGNED and not assigned_department_id:
            raise InvalidStateTransitionError(
                current_state=current_state.value,
                attempted_state=target_state.value,
                reason="Cannot transition to 'Assigned' without an assigned department.",
            )

        # Guard 2: To transition to Completed, resolution notes must be provided
        if target_state == WorkflowStatus.COMPLETED and not resolution_notes:
            raise InvalidStateTransitionError(
                current_state=current_state.value,
                attempted_state=target_state.value,
                reason="Cannot transition to 'Completed' without resolution notes.",
            )
