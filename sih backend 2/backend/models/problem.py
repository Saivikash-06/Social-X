"""Problem models and civic complaint schemas."""

from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from uuid import uuid4
from pydantic import BaseModel, Field

from backend.shared.enums.civic import (
    IssueCategory,
    SubCategory,
    PriorityLevel,
    SeverityLevel,
    ResponsibleDepartment,
)
from backend.shared.schemas.common import GeoLocation
from backend.shared.constants.departments import CATEGORY_TO_DEPARTMENT
from backend.shared.constants.sla import SLA_HOURS_MAP


class ProblemCreateRequest(BaseModel):
    title: str = Field(..., min_length=3, description="Brief summary of the issue")
    description: str = Field(..., min_length=10, description="Detailed problem description")
    category: IssueCategory = Field(..., description="Primary civic issue domain")
    sub_category: Optional[SubCategory] = None
    priority: Optional[PriorityLevel] = PriorityLevel.MEDIUM
    severity: Optional[SeverityLevel] = SeverityLevel.MODERATE
    location: Optional[GeoLocation] = None
    evidence_urls: List[str] = Field(default_factory=list, description="URLs or references to images/evidence")


class ProblemResponse(BaseModel):
    id: str
    title: str
    description: str
    category: str
    sub_category: Optional[str] = None
    priority: str
    severity: str
    status: str = "SUBMITTED"
    location: Optional[GeoLocation] = None
    citizen_id: str
    citizen_name: str
    assigned_department: str
    evidence_urls: List[str] = Field(default_factory=list)
    sla_hours: int = 120
    created_at: str
    updated_at: str


class ProblemInDB(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str
    description: str
    category: str
    sub_category: Optional[str] = None
    priority: str
    severity: str
    status: str = "SUBMITTED"
    location: Optional[Dict[str, Any]] = None
    citizen_id: str
    citizen_name: str
    assigned_department: str
    evidence_urls: List[str] = Field(default_factory=list)
    sla_hours: int = 120
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
