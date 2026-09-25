from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from shared.enums import StakeholderType, AssignmentRole, CollaborationStatus, IssueCategory, PriorityLevel


class AssignOwnerRequest(BaseModel):
    issue_id: str
    department_id: str
    office_id: Optional[str] = None
    owner_id: str = Field(..., description="User ID of the assigned government official")
    owner_name: str
    owner_email: EmailStr
    assigned_by_id: str
    remarks: Optional[str] = None


class ReassignOwnerRequest(BaseModel):
    new_owner_id: str
    new_owner_name: str
    new_owner_email: EmailStr
    new_department_id: Optional[str] = None
    new_office_id: Optional[str] = None
    reassigned_by_id: str
    reason: str = Field(..., description="Mandatory audit explanation for reassigning")


class GenerateRecommendationsRequest(BaseModel):
    """
    Triggers stakeholder recommendation algorithms for an issue.
    """
    issue_id: str
    category: IssueCategory
    priority: PriorityLevel = PriorityLevel.MEDIUM
    district_name: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = Field(default_factory=list)


class StakeholderRecommendationResponse(BaseModel):
    id: str
    issue_id: str
    stakeholder_type: StakeholderType
    entity_name: str
    entity_id: Optional[str] = None
    match_score: float
    matching_domain: str
    rationale: str
    recommended_role: AssignmentRole
    contact_email: Optional[str] = None
    status: CollaborationStatus
    created_at: str

    model_config = {"from_attributes": True}


class MultiStakeholderRecommendationsResponse(BaseModel):
    issue_id: str
    university_recommendations: List[StakeholderRecommendationResponse] = Field(default_factory=list)
    industry_recommendations: List[StakeholderRecommendationResponse] = Field(default_factory=list)
    volunteer_recommendations: List[StakeholderRecommendationResponse] = Field(default_factory=list)
