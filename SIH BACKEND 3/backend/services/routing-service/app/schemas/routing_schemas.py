from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from shared.enums import IssueCategory, PriorityLevel


class RoutingRuleBase(BaseModel):
    name: str
    priority_order: int = Field(default=100, description="Lower order takes evaluation precedence")
    category: IssueCategory
    subcategory: Optional[str] = None
    district_id: Optional[str] = None
    min_severity: float = Field(default=0.0, ge=0.0, le=1.0)
    max_severity: float = Field(default=1.0, ge=0.0, le=1.0)
    target_department_id: str
    target_office_id: Optional[str] = None
    fallback_department_id: Optional[str] = None
    conditions: Dict[str, Any] = Field(default_factory=dict)
    is_active: bool = True


class RoutingRuleCreate(RoutingRuleBase):
    pass


class RoutingRuleUpdate(BaseModel):
    name: Optional[str] = None
    priority_order: Optional[int] = None
    min_severity: Optional[float] = None
    max_severity: Optional[float] = None
    target_department_id: Optional[str] = None
    target_office_id: Optional[str] = None
    fallback_department_id: Optional[str] = None
    conditions: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class RoutingRuleResponse(RoutingRuleBase):
    id: str
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class RoutingEvaluationRequest(BaseModel):
    """
    Input received by the Routing Engine.
    Takes structured issue details (from AI or citizen form) and routes to government authority.
    """
    issue_id: str
    category: IssueCategory
    subcategory: Optional[str] = None
    severity_score: float = Field(default=0.5, ge=0.0, le=1.0, description="Estimated severity score between 0.0 and 1.0")
    priority: PriorityLevel = PriorityLevel.MEDIUM
    state: Optional[str] = None
    district_name: Optional[str] = None
    pincode: Optional[str] = None
    taluk: Optional[str] = None
    keywords: List[str] = Field(default_factory=list)


class RoutingEvaluationResponse(BaseModel):
    issue_id: str
    matched_rule_id: Optional[str] = None
    matched_rule_name: Optional[str] = None
    assigned_department_id: str
    assigned_department_name: str
    assigned_district_id: Optional[str] = None
    assigned_office_id: Optional[str] = None
    assigned_office_name: Optional[str] = None
    confidence: float = 1.0
    routing_rationale: str
