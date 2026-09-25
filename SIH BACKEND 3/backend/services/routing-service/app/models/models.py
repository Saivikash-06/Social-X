import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    Integer,
    Float,
    DateTime,
    Text,
    JSON,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from shared.enums import (
    WorkflowStatus,
    IssueCategory,
    PriorityLevel,
    DepartmentType,
    StakeholderType,
    EscalationLevel,
    CollaborationStatus,
    AssignmentRole,
)


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class DepartmentModel(Base):
    __tablename__ = "departments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False, unique=True, index=True)
    code = Column(String(50), nullable=False, unique=True, index=True)
    department_type = Column(SQLEnum(DepartmentType), nullable=False, index=True)
    description = Column(Text, nullable=True)
    contact_email = Column(String(255), nullable=False)
    contact_phone = Column(String(50), nullable=True)
    jurisdiction_level = Column(String(50), default="District")  # State, District, Taluk, Ward
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    offices = relationship("OfficeModel", back_populates="department", cascade="all, delete-orphan")


class DistrictModel(Base):
    __tablename__ = "districts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    state = Column(String(100), nullable=False, index=True)
    district_name = Column(String(150), nullable=False, unique=True, index=True)
    district_code = Column(String(50), nullable=False, unique=True, index=True)
    headquarters = Column(String(150), nullable=True)
    taluks = Column(JSON, default=list, nullable=False)  # List of taluks/sub-districts
    pincodes = Column(JSON, default=list, nullable=False)  # List of covered pincodes
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    offices = relationship("OfficeModel", back_populates="district", cascade="all, delete-orphan")


class OfficeModel(Base):
    __tablename__ = "offices"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=False, index=True)
    district_id = Column(String(36), ForeignKey("districts.id"), nullable=False, index=True)
    office_name = Column(String(255), nullable=False)
    office_code = Column(String(50), nullable=False, unique=True, index=True)
    address = Column(Text, nullable=True)
    officer_in_charge_name = Column(String(150), nullable=False)
    officer_in_charge_email = Column(String(255), nullable=False)
    officer_in_charge_phone = Column(String(50), nullable=True)
    current_workload = Column(Integer, default=0, nullable=False)
    capacity = Column(Integer, default=50, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    department = relationship("DepartmentModel", back_populates="offices")
    district = relationship("DistrictModel", back_populates="offices")


class RoutingRuleModel(Base):
    __tablename__ = "routing_rules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    priority_order = Column(Integer, default=100, nullable=False, index=True)  # Lower number = higher priority
    category = Column(SQLEnum(IssueCategory), nullable=False, index=True)
    subcategory = Column(String(150), nullable=True)
    district_id = Column(String(36), ForeignKey("districts.id"), nullable=True, index=True)
    min_severity = Column(Float, default=0.0, nullable=False)
    max_severity = Column(Float, default=1.0, nullable=False)
    target_department_id = Column(String(36), ForeignKey("departments.id"), nullable=False, index=True)
    target_office_id = Column(String(36), ForeignKey("offices.id"), nullable=True)
    fallback_department_id = Column(String(36), ForeignKey("departments.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    conditions = Column(JSON, default=dict, nullable=False)  # Keywords, tag rules, etc.
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class WorkflowInstanceModel(Base):
    __tablename__ = "workflow_instances"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(100), nullable=False, unique=True, index=True)
    current_state = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.SUBMITTED, nullable=False, index=True)
    previous_state = Column(SQLEnum(WorkflowStatus), nullable=True)
    priority = Column(SQLEnum(PriorityLevel), default=PriorityLevel.MEDIUM, nullable=False, index=True)
    category = Column(SQLEnum(IssueCategory), nullable=True, index=True)
    district_id = Column(String(36), ForeignKey("districts.id"), nullable=True, index=True)
    assigned_department_id = Column(String(36), ForeignKey("departments.id"), nullable=True, index=True)
    assigned_office_id = Column(String(36), ForeignKey("offices.id"), nullable=True, index=True)
    owner_id = Column(String(100), nullable=True, index=True)  # Primary Government Officer User ID
    owner_name = Column(String(150), nullable=True)
    owner_email = Column(String(255), nullable=True)
    sla_hours = Column(Integer, default=72, nullable=False)
    sla_due_at = Column(DateTime(timezone=True), nullable=True)
    is_escalated = Column(Boolean, default=False, nullable=False)
    escalation_level = Column(SQLEnum(EscalationLevel), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    resolution_evidence_url = Column(String(500), nullable=True)
    citizen_verified = Column(Boolean, default=False, nullable=False)
    citizen_feedback = Column(Text, nullable=True)
    citizen_rating = Column(Integer, nullable=True)  # 1-5 scale
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    history = relationship("WorkflowHistoryModel", back_populates="instance", cascade="all, delete-orphan", order_by="WorkflowHistoryModel.created_at")


class WorkflowHistoryModel(Base):
    __tablename__ = "workflow_history"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workflow_instance_id = Column(String(36), ForeignKey("workflow_instances.id"), nullable=False, index=True)
    issue_id = Column(String(100), nullable=False, index=True)
    from_state = Column(SQLEnum(WorkflowStatus), nullable=False)
    to_state = Column(SQLEnum(WorkflowStatus), nullable=False)
    trigger = Column(String(100), nullable=False)
    actor_id = Column(String(100), nullable=False)
    actor_role = Column(String(100), nullable=False)
    remarks = Column(Text, nullable=True)
    metadata_snapshot = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    instance = relationship("WorkflowInstanceModel", back_populates="history")


class StakeholderRecommendationModel(Base):
    __tablename__ = "stakeholder_recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(100), nullable=False, index=True)
    stakeholder_type = Column(SQLEnum(StakeholderType), nullable=False, index=True)
    entity_name = Column(String(255), nullable=False)
    entity_id = Column(String(100), nullable=True)
    match_score = Column(Float, nullable=False)  # 0.0 - 1.0 match relevance
    matching_domain = Column(String(150), nullable=False)
    rationale = Column(Text, nullable=False)
    recommended_role = Column(SQLEnum(AssignmentRole), nullable=False)
    contact_email = Column(String(255), nullable=True)
    status = Column(SQLEnum(CollaborationStatus), default=CollaborationStatus.INVITED, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class CollaborationModel(Base):
    __tablename__ = "collaborations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    issue_id = Column(String(100), nullable=False, index=True)
    stakeholder_type = Column(SQLEnum(StakeholderType), nullable=False, index=True)
    stakeholder_id = Column(String(100), nullable=False, index=True)
    stakeholder_name = Column(String(255), nullable=False)
    role = Column(SQLEnum(AssignmentRole), nullable=False)
    status = Column(SQLEnum(CollaborationStatus), default=CollaborationStatus.INVITED, nullable=False)
    notes = Column(Text, nullable=True)
    contributions = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)


class EscalationPolicyModel(Base):
    __tablename__ = "escalation_policies"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    department_id = Column(String(36), ForeignKey("departments.id"), nullable=True, index=True)
    priority = Column(SQLEnum(PriorityLevel), nullable=False, index=True)
    level = Column(SQLEnum(EscalationLevel), nullable=False)
    breach_hours_threshold = Column(Integer, nullable=False)
    escalate_to_role = Column(String(100), nullable=False)
    notify_emails = Column(JSON, default=list, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)


class EscalationLogModel(Base):
    __tablename__ = "escalation_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    workflow_instance_id = Column(String(36), ForeignKey("workflow_instances.id"), nullable=False, index=True)
    issue_id = Column(String(100), nullable=False, index=True)
    escalation_level = Column(SQLEnum(EscalationLevel), nullable=False)
    reason = Column(Text, nullable=False)
    triggered_by = Column(String(100), nullable=False)  # AUTO_SLA, MANUAL_OFFICER, CITIZEN_REOPEN
    previous_owner_id = Column(String(100), nullable=True)
    new_owner_id = Column(String(100), nullable=True)
    notified_stakeholders = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
