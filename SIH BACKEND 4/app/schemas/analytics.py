from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class IssueOverviewMetrics(BaseModel):
    total_issues: int
    resolved_issues: int
    pending_issues: int
    in_progress_issues: int
    escalated_issues: int
    closed_issues: int
    rejected_issues: int
    sla_breaches: int
    resolution_rate: float
    avg_resolution_hours: Optional[float] = None


class DepartmentPerformanceMetric(BaseModel):
    department_id: int
    department_name: str
    department_code: str
    total_issues: int
    resolved_issues: int
    pending_issues: int
    in_progress_issues: int
    avg_resolution_hours: Optional[float] = None
    sla_compliance_rate: float
    performance_score: float  # Composite score out of 100 based on resolution rate & SLA


class DistrictPerformanceMetric(BaseModel):
    district_id: int
    district_name: str
    state: str
    population: int
    total_issues: int
    resolved_issues: int
    resolution_rate: float
    issues_per_100k: float
    rank: int


class UniversityParticipationMetric(BaseModel):
    total_institutions: int
    active_projects: int
    total_students_engaged: int
    deployed_innovations: int
    top_universities: List[Dict[str, Any]]


class IndustryParticipationMetric(BaseModel):
    active_corporates: int
    total_csr_allocated: float
    total_csr_spent: float
    budget_utilization_rate: float
    sponsored_projects_count: int
    top_corporate_sponsors: List[Dict[str, Any]]


class CategoryTrendMetric(BaseModel):
    category: str
    total_reported: int
    resolved_count: int
    pending_count: int
    share_percentage: float


class MonthlyTrendMetric(BaseModel):
    month_key: str  # YYYY-MM
    month_name: str
    year: int
    issues_reported: int
    issues_resolved: int
    resolution_rate: float


class AnalyticsData(BaseModel):
    filter_applied: Dict[str, Any]
    issues_overview: IssueOverviewMetrics
    department_performance: List[DepartmentPerformanceMetric]
    district_performance: List[DistrictPerformanceMetric]
    university_participation: UniversityParticipationMetric
    industry_participation: IndustryParticipationMetric
    category_trends: List[CategoryTrendMetric]
    monthly_trends: List[MonthlyTrendMetric]
