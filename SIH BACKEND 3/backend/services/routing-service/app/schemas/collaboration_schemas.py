from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from shared.enums import StakeholderType, AssignmentRole, CollaborationStatus


class CollaborationInviteRequest(BaseModel):
    issue_id: str
    stakeholder_type: StakeholderType
    stakeholder_id: str
    stakeholder_name: str
    role: AssignmentRole
    notes: Optional[str] = None


class CollaborationActionRequest(BaseModel):
    action: CollaborationStatus = Field(..., description="ACCEPTED or DECLINED")
    notes: Optional[str] = None


class AddContributionRequest(BaseModel):
    contribution_type: str = Field(..., description="e.g. Funding, Research Report, Volunteer Drive, Tech Solution")
    summary: str
    details: Dict[str, Any] = Field(default_factory=dict)


class CollaborationResponse(BaseModel):
    id: str
    issue_id: str
    stakeholder_type: StakeholderType
    stakeholder_id: str
    stakeholder_name: str
    role: AssignmentRole
    status: CollaborationStatus
    notes: Optional[str] = None
    contributions: List[Any] = Field(default_factory=list)
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}
