from datetime import datetime
from typing import Optional, Union
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.response import ApiResponse, ResponseMeta
from app.schemas.reports import ReportSummaryData
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get(
    "",
    response_model=Union[ApiResponse[ReportSummaryData], str],
    summary="Generate & Export Governance Reports",
    description="""
Generates on-demand governance and societal issue reports in either structured **JSON** format or direct downloadable **CSV** format.

### Supported Report Types:
- `SUMMARY`: High-level aggregated overview of all civic issues.
- `DEPARTMENT_PERFORMANCE`: Department-focused resolution and backlog audit.
- `DISTRICT_PERFORMANCE`: District geographical compliance and resolution ranking.
- `STAKEHOLDER_COLLABORATION`: University & Industry CSR engagement reports.
- `MONTHLY_TRENDS`: Longitudinal monthly distribution.

### Export Formats:
- `JSON`: Returns standard `ApiResponse[ReportSummaryData]` envelope.
- `CSV`: Returns raw downloadable CSV stream with `Content-Disposition: attachment`.
    """
)
async def get_reports(
    report_type: str = Query("SUMMARY", description="Report type: SUMMARY, DEPARTMENT_PERFORMANCE, DISTRICT_PERFORMANCE, STAKEHOLDER_COLLABORATION, MONTHLY_TRENDS"),
    format: str = Query("JSON", description="Export format: JSON or CSV"),
    start_date: Optional[datetime] = Query(None, description="Start date filter (ISO-8601 UTC)"),
    end_date: Optional[datetime] = Query(None, description="End date filter (ISO-8601 UTC)"),
    department_id: Optional[int] = Query(None, description="Filter report by Department ID"),
    district_id: Optional[int] = Query(None, description="Filter report by District ID"),
    session: AsyncSession = Depends(get_db)
):
    json_data, csv_content, filename = await ReportService.generate_report(
        session=session,
        report_type_str=report_type,
        report_format_str=format,
        start_date=start_date,
        end_date=end_date,
        department_id=department_id,
        district_id=district_id
    )

    if csv_content is not None:
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )

    return ApiResponse(
        success=True,
        message=f"Report '{json_data.report_title}' generated successfully",
        data=json_data,
        meta=ResponseMeta(count=json_data.total_records)
    )
