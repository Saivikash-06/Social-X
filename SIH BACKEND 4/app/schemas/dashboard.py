from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# --- Common Dashboard Sub-schemas ---
class KPIOverview(BaseModel):
    total_issues: int
    resolved_issues: int
    pending_issues: int
    in_progress_issues: int
    escalated_issues: int
    resolution_rate: float
    sla_breaches: int


class DepartmentLeaderboardItem(BaseModel):
    department_id: int
    department_name: str
    department_code: str
    total_issues: int
    resolved_issues: int
    resolution_rate: float
    avg_resolution_hours: Optional[float] = None
    sla_compliance_rate: float


class CategoryBreakdownItem(BaseModel):
    category: str
    count: int
    percentage: float


class RecentActivityItem(BaseModel):
    id: int
    actor_id: Optional[str]
    actor_role: str
    action: str
    entity_type: str
    description: str
    created_at: datetime


class IssueCardItem(BaseModel):
    id: int
    ticket_id: str
    title: str
    category: str
    status: str
    severity: str
    department_name: Optional[str] = None
    district_name: Optional[str] = None
    reported_at: datetime
    is_sla_breached: bool
    sla_due_at: Optional[datetime] = None


class StakeholderProjectItem(BaseModel):
    id: int
    project_code: str
    title: str
    stakeholder_type: str
    stakeholder_name: str
    status: str
    students_involved: int
    funding_committed: float
    funding_disbursed: float
    target_completion_date: Optional[datetime] = None


# --- 1. Admin Dashboard Response Schema ---
class AdminDashboardData(BaseModel):
    kpis: KPIOverview
    department_leaderboard: List[DepartmentLeaderboardItem]
    category_distribution: List[CategoryBreakdownItem]
    critical_alerts: List[IssueCardItem]
    recent_activities: List[RecentActivityItem]
    total_academic_projects: int
    total_csr_allocated: float
    total_csr_disbursed: float


# --- 2. Gov Dashboard Response Schema ---
class GovDashboardData(BaseModel):
    department_id: Optional[int]
    department_name: Optional[str]
    assigned_total: int
    in_progress: int
    resolved: int
    pending_action: int
    sla_breached_count: int
    avg_resolution_hours: Optional[float]
    sla_compliance_rate: float
    priority_action_items: List[IssueCardItem]
    district_distribution: List[Dict[str, Any]]
    active_collaborations: List[StakeholderProjectItem]


# --- 3. University Dashboard Response Schema ---
class UniversityDashboardData(BaseModel):
    university_id: Optional[int]
    university_name: Optional[str]
    active_research_projects: int
    total_students_engaged: int
    challenges_adopted: int
    solutions_deployed: int
    open_challenges: List[IssueCardItem]
    my_active_projects: List[StakeholderProjectItem]
    top_research_focus_areas: List[str]


# --- 4. Industry Dashboard Response Schema ---
class IndustryDashboardData(BaseModel):
    industry_id: Optional[int]
    industry_name: Optional[str]
    csr_budget_allocated: float
    csr_budget_disbursed: float
    active_partnerships: int
    estimated_citizens_impacted: int
    sponsored_projects: List[StakeholderProjectItem]
    open_funding_opportunities: List[IssueCardItem]
    active_sectors: List[str]


# --- 5. Citizen Dashboard Response Schema ---
class CitizenIssueItem(BaseModel):
    ticket_id: str
    title: str
    category: str
    status: str
    severity: str
    reported_at: datetime
    resolved_at: Optional[datetime]
    feedback_rating: Optional[int]
    citizen_feedback: Optional[str]


class CitizenDashboardData(BaseModel):
    citizen_id: Optional[str]
    district_name: Optional[str]
    community_total_issues: int
    community_resolved_issues: int
    community_resolution_rate: float
    avg_resolution_days: float
    my_reported_issues: List[CitizenIssueItem]
    recent_community_resolutions: List[IssueCardItem]
