from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from shared.enums import WorkflowStatus, PriorityLevel, IssueCategory, EscalationLevel


class WorkflowCreateRequest(BaseModel):
    issue_id: str
    category: Optional[IssueCategory] = None
    priority: PriorityLevel = PriorityLevel.MEDIUM
    district_id: Optional[str] = None
    assigned_department_id: Optional[str] = None
    assigned_office_id: Optional[str] = None
    sla_hours: Optional[int] = None
    initial_remarks: Optional[str] = "Issue registered in system."


class WorkflowTransitionRequest(BaseModel):
    """
    Request payload to perform a state transition.
    Actor credentials and roles are supplied via request payload or auth headers.
    """
    to_state: WorkflowStatus
    actor_id: str = Field(..., description="ID of the citizen, officer, or system making the transition")
    actor_role: str = Field(..., description="Role of the actor (e.g., Citizen, DepartmentOfficer, Admin)")
    remarks: Optional[str] = None
    resolution_notes: Optional[str] = None
    resolution_evidence_url: Optional[str] = None
    metadata_snapshot: Dict[str, Any] = Field(default_factory=dict)


class CitizenVerificationRequest(BaseModel):
    citizen_id: str
    verified_satisfactory: bool = Field(..., description="Whether citizen is satisfied with completion")
    feedback: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5, description="1-5 star citizen rating")


class WorkflowHistoryResponse(BaseModel):
    id: str
    workflow_instance_id: str
    issue_id: str
    from_state: WorkflowStatus
    to_state: WorkflowStatus
    trigger: str
    actor_id: str
    actor_role: str
    remarks: Optional[str] = None
    created_at: str

    model_config = {"from_attributes": True}


class WorkflowResponse(BaseModel):
    id: str
    issue_id: str
    current_state: WorkflowStatus
    previous_state: Optional[WorkflowStatus] = None
    priority: PriorityLevel
    category: Optional[IssueCategory] = None
    district_id: Optional[str] = None
    assigned_department_id: Optional[str] = None
    assigned_office_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_name: Optional[str] = None
    owner_email: Optional[str] = None
    sla_hours: int
    sla_due_at: Optional[str] = None
    is_escalated: bool
    escalation_level: Optional[EscalationLevel] = None
    resolution_notes: Optional[str] = None
    resolution_evidence_url: Optional[str] = None
    citizen_verified: bool
    citizen_feedback: Optional[str] = None
    citizen_rating: Optional[int] = None
    created_at: str
    updated_at: str
    history: List[WorkflowHistoryResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}
