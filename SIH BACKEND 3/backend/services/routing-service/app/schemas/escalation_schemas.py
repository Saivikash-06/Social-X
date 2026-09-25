from typing import List, Optional
from pydantic import BaseModel, Field
from shared.enums import PriorityLevel, EscalationLevel


class EscalationPolicyBase(BaseModel):
    name: str
    department_id: Optional[str] = None
    priority: PriorityLevel
    level: EscalationLevel
    breach_hours_threshold: int
    escalate_to_role: str
    notify_emails: List[str] = Field(default_factory=list)
    is_active: bool = True


class EscalationPolicyCreate(EscalationPolicyBase):
    pass


class EscalationPolicyResponse(EscalationPolicyBase):
    id: str
    created_at: str

    model_config = {"from_attributes": True}


class EscalationTriggerRequest(BaseModel):
    issue_id: str
    target_level: EscalationLevel
    reason: str = Field(..., description="Justification for manual or automated escalation")
    triggered_by: str = Field(..., description="Officer ID, Citizen ID, or 'SLA_SYSTEM'")
    new_owner_id: Optional[str] = None


class EscalationLogResponse(BaseModel):
    id: str
    workflow_instance_id: str
    issue_id: str
    escalation_level: EscalationLevel
    reason: str
    triggered_by: str
    previous_owner_id: Optional[str] = None
    new_owner_id: Optional[str] = None
    notified_stakeholders: List[str] = Field(default_factory=list)
    created_at: str

    model_config = {"from_attributes": True}


class SLACheckResponse(BaseModel):
    issue_id: str
    sla_hours: int
    sla_due_at: Optional[str] = None
    is_breached: bool
    hours_remaining: Optional[float] = None
    current_escalation_level: Optional[EscalationLevel] = None
