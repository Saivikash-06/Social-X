from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from shared.constants.issues import IssueStatus, IssueSeverity, IssueCategory
from datetime import datetime

class MediaBase(BaseModel):
    url: str
    media_type: str

class MediaCreate(MediaBase):
    pass

class MediaResponse(MediaBase):
    id: str
    issue_id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class IssueBase(BaseModel):
    title: str
    description: str
    category: IssueCategory = IssueCategory.OTHER
    severity: IssueSeverity = IssueSeverity.MEDIUM
    location: Optional[str] = None

class IssueCreate(IssueBase):
    pass

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IssueStatus] = None
    category: Optional[IssueCategory] = None
    severity: Optional[IssueSeverity] = None
    location: Optional[str] = None
    assignee_id: Optional[str] = None

class IssueResponse(IssueBase):
    id: str
    status: IssueStatus
    reporter_id: str
    assignee_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    media: List[MediaResponse] = []
    
    model_config = ConfigDict(from_attributes=True)
