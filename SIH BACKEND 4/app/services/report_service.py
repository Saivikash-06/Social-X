import csv
import io
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import (
    Issue,
    Department,
    District,
    GeneratedReport,
    ReportType,
    ReportFormat,
    ActivityLog
)
from app.schemas.reports import ReportItem, ReportSummaryData


class ReportService:
    @staticmethod
    async def generate_report(
        session: AsyncSession,
        report_type_str: str = "SUMMARY",
        report_format_str: str = "JSON",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        department_id: Optional[int] = None,
        district_id: Optional[int] = None,
        generated_by: str = "ADMIN-API"
    ) -> Tuple[Optional[ReportSummaryData], Optional[str], str]:
        """
        Returns:
            Tuple of (ReportSummaryData if JSON else None, csv_content_str if CSV else None, filename)
        """
        # Map string to enums
        try:
            r_type = ReportType[report_type_str.upper()]
        except KeyError:
            r_type = ReportType.SUMMARY

        try:
            r_fmt = ReportFormat[report_format_str.upper()]
        except KeyError:
            r_fmt = ReportFormat.JSON

        # Build query
        query = (
            select(Issue, Department.name.label("dept_name"), District.name.label("dist_name"))
            .outerjoin(Department, Issue.department_id == Department.id)
            .outerjoin(District, Issue.district_id == District.id)
        )

        filters = []
        if start_date:
            filters.append(Issue.reported_at >= start_date)
        if end_date:
            filters.append(Issue.reported_at <= end_date)
        if department_id:
            filters.append(Issue.department_id == department_id)
        if district_id:
            filters.append(Issue.district_id == district_id)

        if filters:
            query = query.where(*filters)

        query = query.order_by(desc(Issue.reported_at))
        rows = (await session.execute(query)).all()

        # Parse items
        items: List[ReportItem] = []
        resolved_count = 0
        sla_breach_count = 0
        total_res_hours = 0.0
        res_hour_count = 0

        for r in rows:
            iss = r.Issue
            cat_val = iss.category.value if hasattr(iss.category, "value") else str(iss.category)
            stat_val = iss.status.value if hasattr(iss.status, "value") else str(iss.status)
            sev_val = iss.severity.value if hasattr(iss.severity, "value") else str(iss.severity)

            if stat_val in ["RESOLVED", "CLOSED"]:
                resolved_count += 1
                if iss.resolution_hours:
                    total_res_hours += iss.resolution_hours
                    res_hour_count += 1

            if iss.is_sla_breached:
                sla_breach_count += 1

            items.append(
                ReportItem(
                    id=iss.id,
                    ticket_id=iss.ticket_id,
                    title=iss.title,
                    category=cat_val,
                    status=stat_val,
                    severity=sev_val,
                    department_name=r.dept_name,
                    district_name=r.dist_name,
                    reported_at=iss.reported_at,
                    resolved_at=iss.resolved_at,
                    resolution_hours=iss.resolution_hours,
                    is_sla_breached=iss.is_sla_breached,
                    feedback_rating=iss.feedback_rating
                )
            )

        total_records = len(items)
        avg_res_hours = round(total_res_hours / res_hour_count, 2) if res_hour_count > 0 else 0.0
        res_rate = round(resolved_count / total_records * 100.0, 2) if total_records > 0 else 0.0

        now_utc = datetime.now(timezone.utc)
        timestamp_str = now_utc.strftime("%Y%m%d_%H%M%S")
        report_title = f"{r_type.value.replace('_', ' ').title()} Report - {now_utc.strftime('%b %d, %Y')}"
        filename = f"report_{r_type.value.lower()}_{timestamp_str}.{r_fmt.value.lower()}"

        summary_stats = {
            "total_records": total_records,
            "resolved_count": resolved_count,
            "pending_count": total_records - resolved_count,
            "resolution_rate_percent": res_rate,
            "sla_breach_count": sla_breach_count,
            "avg_resolution_hours": avg_res_hours
        }

        # Track in GeneratedReport
        report_record = GeneratedReport(
            report_title=report_title,
            report_type=r_type,
            format=r_fmt,
            filter_criteria={
                "department_id": department_id,
                "district_id": district_id,
                "start_date": start_date.isoformat() if start_date else None,
                "end_date": end_date.isoformat() if end_date else None
            },
            record_count=total_records,
            file_path=filename,
            generated_by=generated_by
        )
        session.add(report_record)

        # Audit log
        activity = ActivityLog(
            actor_id=generated_by,
            actor_role="ADMIN",
            action="REPORT_GENERATED",
            entity_type="REPORT",
            entity_id=filename,
            description=f"Generated {r_type.value} report containing {total_records} records in {r_fmt.value} format.",
            details=summary_stats
        )
        session.add(activity)
        await session.commit()
        await session.refresh(report_record)

        if r_fmt == ReportFormat.CSV:
            output = io.StringIO()
            writer = csv.writer(output)
            # Write Header
            writer.writerow([
                "Ticket ID",
                "Title",
                "Category",
                "Status",
                "Severity",
                "Department",
                "District",
                "Reported At",
                "Resolved At",
                "Resolution Hours",
                "SLA Breached",
                "Rating"
            ])
            for item in items:
                writer.writerow([
                    item.ticket_id,
                    item.title,
                    item.category,
                    item.status,
                    item.severity,
                    item.department_name or "Unassigned",
                    item.district_name or "Unspecified",
                    item.reported_at.isoformat(),
                    item.resolved_at.isoformat() if item.resolved_at else "",
                    item.resolution_hours or "",
                    "Yes" if item.is_sla_breached else "No",
                    item.feedback_rating or ""
                ])
            return None, output.getvalue(), filename

        # Return JSON structured model
        json_data = ReportSummaryData(
            report_id=report_record.id,
            report_title=report_title,
            report_type=r_type.value,
            format=r_fmt.value,
            generated_at=now_utc,
            total_records=total_records,
            summary_stats=summary_stats,
            items=items
        )
        return json_data, None, filename
