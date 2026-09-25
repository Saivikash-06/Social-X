from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ReportFilterParams(BaseModel):
    report_type: str = "SUMMARY"
    format: str = "JSON"
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    department_id: Optional[int] = None
    district_id: Optional[int] = None


class ReportItem(BaseModel):
    id: int
    ticket_id: str
    title: str
    category: str
    status: str
    severity: str
    department_name: Optional[str] = None
    district_name: Optional[str] = None
    reported_at: datetime
    resolved_at: Optional[datetime] = None
    resolution_hours: Optional[float] = None
    is_sla_breached: bool
    feedback_rating: Optional[int] = None


class ReportSummaryData(BaseModel):
    report_id: int
    report_title: str
    report_type: str
    format: str
    generated_at: datetime
    total_records: int
    summary_stats: Dict[str, Any]
    items: List[ReportItem]
