import enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Enum,
    JSON
)
from app.core.database import Base
from app.models.base import TimestampMixin


class ReportType(str, enum.Enum):
    SUMMARY = "SUMMARY"
    DEPARTMENT_PERFORMANCE = "DEPARTMENT_PERFORMANCE"
    DISTRICT_PERFORMANCE = "DISTRICT_PERFORMANCE"
    STAKEHOLDER_COLLABORATION = "STAKEHOLDER_COLLABORATION"
    MONTHLY_TRENDS = "MONTHLY_TRENDS"


class ReportFormat(str, enum.Enum):
    JSON = "JSON"
    CSV = "CSV"


class GeneratedReport(Base, TimestampMixin):
    __tablename__ = "generated_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    report_title = Column(String(200), nullable=False)
    report_type = Column(Enum(ReportType), nullable=False, index=True)
    format = Column(Enum(ReportFormat), default=ReportFormat.JSON, nullable=False)
    filter_criteria = Column(JSON, nullable=True)
    record_count = Column(Integer, default=0)
    file_path = Column(String(255), nullable=True)
    generated_by = Column(String(100), default="SYSTEM")
