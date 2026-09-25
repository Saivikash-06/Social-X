import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Enum,
    JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class IssueCategory(str, enum.Enum):
    ROADS = "ROADS"
    DRAINAGE = "DRAINAGE"
    STREETLIGHTS = "STREETLIGHTS"
    WATER_SCARCITY = "WATER_SCARCITY"
    HEALTHCARE = "HEALTHCARE"
    SANITATION = "SANITATION"
    ENVIRONMENT = "ENVIRONMENT"
    EDUCATION = "EDUCATION"
    PUBLIC_SERVICES = "PUBLIC_SERVICES"
    OTHER = "OTHER"


class IssueStatus(str, enum.Enum):
    REPORTED = "REPORTED"
    VERIFIED = "VERIFIED"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"
    REJECTED = "REJECTED"
    ESCALATED = "ESCALATED"


class IssueSeverity(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class District(Base, TimestampMixin):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False, index=True)
    state = Column(String(100), nullable=False)
    zone = Column(String(50), nullable=True)
    population = Column(Integer, default=0)

    # Relationships
    departments = relationship("Department", back_populates="district")
    issues = relationship("Issue", back_populates="district")


class Department(Base, TimestampMixin):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    contact_email = Column(String(150), nullable=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True)
    sla_hours = Column(Integer, default=48)  # SLA standard resolution time

    # Relationships
    district = relationship("District", back_populates="departments")
    issues = relationship("Issue", back_populates="department")


class Issue(Base, TimestampMixin):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticket_id = Column(String(64), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(Enum(IssueCategory), nullable=False, index=True)
    status = Column(Enum(IssueStatus), default=IssueStatus.REPORTED, nullable=False, index=True)
    severity = Column(Enum(IssueSeverity), default=IssueSeverity.MEDIUM, nullable=False, index=True)

    # Geographic & Routing Foreign Keys
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True, index=True)
    district_id = Column(Integer, ForeignKey("districts.id"), nullable=True, index=True)
    citizen_id = Column(String(100), nullable=True, index=True)

    # Location info
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String(255), nullable=True)

    # Timestamps & SLAs
    reported_at = Column(DateTime(timezone=True), nullable=False)
    acknowledged_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    sla_due_at = Column(DateTime(timezone=True), nullable=True)
    resolution_hours = Column(Float, nullable=True)
    is_sla_breached = Column(Boolean, default=False)

    # Feedback
    feedback_rating = Column(Integer, nullable=True)  # 1-5 scale
    citizen_feedback = Column(Text, nullable=True)
    extra_metadata = Column(JSON, nullable=True)

    # Relationships
    department = relationship("Department", back_populates="issues")
    district = relationship("District", back_populates="issues")
    projects = relationship("StakeholderProject", back_populates="issue")
