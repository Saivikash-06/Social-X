from sqlalchemy import Column, String, Text, Enum, ForeignKey, func, DateTime
from sqlalchemy.orm import relationship
import uuid
from shared.database.core import Base
from shared.constants.issues import IssueStatus, IssueSeverity, IssueCategory

class Issue(Base):
    __tablename__ = "issues"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    status = Column(Enum(IssueStatus), default=IssueStatus.OPEN, nullable=False, index=True)
    category = Column(Enum(IssueCategory), default=IssueCategory.OTHER, nullable=False, index=True)
    severity = Column(Enum(IssueSeverity), default=IssueSeverity.MEDIUM, nullable=False, index=True)
    location = Column(String, nullable=True)  # Simple string for now, can be PostGIS later
    
    reporter_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    reporter = relationship("User", foreign_keys=[reporter_id])
    assignee = relationship("User", foreign_keys=[assignee_id])
    media = relationship("Media", back_populates="issue", cascade="all, delete-orphan", lazy="selectin")

class Media(Base):
    __tablename__ = "media"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    issue_id = Column(String, ForeignKey("issues.id"), nullable=False, index=True)
    url = Column(String, nullable=False)
    media_type = Column(String, nullable=False)  # e.g., image/jpeg, video/mp4
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    issue = relationship("Issue", back_populates="media")
