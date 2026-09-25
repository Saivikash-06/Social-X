import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
    Enum,
    JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class StakeholderType(str, enum.Enum):
    UNIVERSITY = "UNIVERSITY"
    INDUSTRY = "INDUSTRY"
    NGO = "NGO"
    VOLUNTEER = "VOLUNTEER"


class ProjectStatus(str, enum.Enum):
    PROPOSED = "PROPOSED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    DEPLOYED = "DEPLOYED"


class University(Base, TimestampMixin):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    state = Column(String(100), nullable=False)
    contact_email = Column(String(150), nullable=True)
    research_focus = Column(String(255), nullable=True)
    active_teams = Column(Integer, default=0)
    students_enrolled = Column(Integer, default=0)


class Industry(Base, TimestampMixin):
    __tablename__ = "industries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    sector = Column(String(100), nullable=False)  # e.g., TECH, INFRASTRUCTURE, WATER, ENERGY
    contact_email = Column(String(150), nullable=True)
    csr_budget_allocated = Column(Float, default=0.0)  # INR
    csr_budget_spent = Column(Float, default=0.0)      # INR
    active_partnerships = Column(Integer, default=0)


class StakeholderProject(Base, TimestampMixin):
    __tablename__ = "stakeholder_projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_code = Column(String(64), unique=True, index=True, nullable=False)
    issue_id = Column(Integer, ForeignKey("issues.id"), nullable=True, index=True)
    stakeholder_type = Column(Enum(StakeholderType), nullable=False, index=True)
    stakeholder_name = Column(String(200), nullable=False)
    stakeholder_id = Column(Integer, nullable=True)  # Links to University.id or Industry.id
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.IN_PROGRESS, nullable=False, index=True)
    students_involved = Column(Integer, default=0)
    funding_committed = Column(Float, default=0.0)
    funding_disbursed = Column(Float, default=0.0)
    start_date = Column(DateTime(timezone=True), nullable=True)
    target_completion_date = Column(DateTime(timezone=True), nullable=True)
    completion_date = Column(DateTime(timezone=True), nullable=True)
    extra_metadata = Column(JSON, nullable=True)

    # Relationships
    issue = relationship("Issue", back_populates="projects")
    contributions = relationship("StakeholderContribution", back_populates="project")


class StakeholderContribution(Base, TimestampMixin):
    __tablename__ = "stakeholder_contributions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("stakeholder_projects.id"), nullable=False, index=True)
    contribution_type = Column(String(50), nullable=False)  # FINANCIAL, TECH_MENTORING, PROTOTYPE, VOLUNTEERING
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    amount_inr = Column(Float, default=0.0)
    hours_logged = Column(Float, default=0.0)

    # Relationships
    project = relationship("StakeholderProject", back_populates="contributions")
