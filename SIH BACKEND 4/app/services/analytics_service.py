from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy import func, select, desc, asc, case
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import (
    Issue,
    IssueCategory,
    IssueStatus,
    IssueSeverity,
    Department,
    District,
    University,
    Industry,
    StakeholderProject,
    StakeholderType,
    ProjectStatus
)
from app.schemas.analytics import (
    AnalyticsData,
    IssueOverviewMetrics,
    DepartmentPerformanceMetric,
    DistrictPerformanceMetric,
    UniversityParticipationMetric,
    IndustryParticipationMetric,
    CategoryTrendMetric,
    MonthlyTrendMetric
)


class AnalyticsService:
    @staticmethod
    async def get_comprehensive_analytics(
        session: AsyncSession,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        department_id: Optional[int] = None,
        district_id: Optional[int] = None,
        category: Optional[str] = None
    ) -> AnalyticsData:
        # Build base filter criteria
        filters = []
        filter_applied: Dict[str, Any] = {}

        if start_date:
            filters.append(Issue.reported_at >= start_date)
            filter_applied["start_date"] = start_date.isoformat()
        if end_date:
            filters.append(Issue.reported_at <= end_date)
            filter_applied["end_date"] = end_date.isoformat()
        if department_id:
            filters.append(Issue.department_id == department_id)
            filter_applied["department_id"] = department_id
        if district_id:
            filters.append(Issue.district_id == district_id)
            filter_applied["district_id"] = district_id
        if category:
            cat_upper = category.upper()
            filters.append(Issue.category == cat_upper)
            filter_applied["category"] = cat_upper

        # 1. Issues Overview
        overview_stmt = select(
            func.count(Issue.id).label("total"),
            func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved"),
            func.sum(case((Issue.status.in_([IssueStatus.REPORTED, IssueStatus.ASSIGNED]), 1), else_=0)).label("pending"),
            func.sum(case((Issue.status == IssueStatus.IN_PROGRESS, 1), else_=0)).label("in_prog"),
            func.sum(case((Issue.status == IssueStatus.ESCALATED, 1), else_=0)).label("escalated"),
            func.sum(case((Issue.status == IssueStatus.CLOSED, 1), else_=0)).label("closed"),
            func.sum(case((Issue.status == IssueStatus.REJECTED, 1), else_=0)).label("rejected"),
            func.sum(case((Issue.is_sla_breached.is_(True), 1), else_=0)).label("sla_breaches"),
            func.avg(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), Issue.resolution_hours), else_=None)).label("avg_hrs")
        )
        if filters:
            overview_stmt = overview_stmt.where(*filters)

        ov_res = (await session.execute(overview_stmt)).one()
        tot = ov_res.total or 0
        res = ov_res.resolved or 0
        pend = ov_res.pending or 0
        in_p = ov_res.in_prog or 0
        esc = ov_res.escalated or 0
        cls = ov_res.closed or 0
        rej = ov_res.rejected or 0
        sla_b = ov_res.sla_breaches or 0
        res_rate = round((res / tot * 100.0), 2) if tot > 0 else 0.0
        avg_hrs = round(float(ov_res.avg_hrs), 2) if ov_res.avg_hrs is not None else None

        issues_overview = IssueOverviewMetrics(
            total_issues=tot,
            resolved_issues=res,
            pending_issues=pend,
            in_progress_issues=in_p,
            escalated_issues=esc,
            closed_issues=cls,
            rejected_issues=rej,
            sla_breaches=sla_b,
            resolution_rate=res_rate,
            avg_resolution_hours=avg_hrs
        )

        # 2. Department Performance
        dept_stmt = (
            select(
                Department.id,
                Department.name,
                Department.code,
                func.count(Issue.id).label("total"),
                func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved"),
                func.sum(case((Issue.status.in_([IssueStatus.REPORTED, IssueStatus.ASSIGNED]), 1), else_=0)).label("pending"),
                func.sum(case((Issue.status == IssueStatus.IN_PROGRESS, 1), else_=0)).label("in_prog"),
                func.avg(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), Issue.resolution_hours), else_=None)).label("avg_hrs"),
                func.sum(case((Issue.is_sla_breached.is_(True), 1), else_=0)).label("sla_b")
            )
            .outerjoin(Issue, Issue.department_id == Department.id)
        )
        # Apply date or district filters to department performance if applicable
        dept_filters = []
        if start_date:
            dept_filters.append(Issue.reported_at >= start_date)
        if end_date:
            dept_filters.append(Issue.reported_at <= end_date)
        if district_id:
            dept_filters.append(Issue.district_id == district_id)
        if category:
            dept_filters.append(Issue.category == category.upper())
        if dept_filters:
            dept_stmt = dept_stmt.where(*dept_filters)

        dept_stmt = dept_stmt.group_by(Department.id, Department.name, Department.code)
        dept_rows = (await session.execute(dept_stmt)).all()

        dept_metrics: List[DepartmentPerformanceMetric] = []
        for r in dept_rows:
            d_tot = r.total or 0
            d_res = r.resolved or 0
            d_pen = r.pending or 0
            d_inp = r.in_prog or 0
            d_sla_b = r.sla_b or 0
            d_avg_h = round(float(r.avg_hrs), 2) if r.avg_hrs is not None else None
            d_rate = round((d_res / d_tot * 100.0), 2) if d_tot > 0 else 0.0
            sla_comp = round(((d_tot - d_sla_b) / d_tot * 100.0), 2) if d_tot > 0 else 100.0
            # Composite performance score (60% weight on resolution rate, 40% on SLA compliance)
            score = round((0.6 * d_rate + 0.4 * sla_comp), 1)

            dept_metrics.append(
                DepartmentPerformanceMetric(
                    department_id=r.id,
                    department_name=r.name,
                    department_code=r.code,
                    total_issues=d_tot,
                    resolved_issues=d_res,
                    pending_issues=d_pen,
                    in_progress_issues=d_inp,
                    avg_resolution_hours=d_avg_h,
                    sla_compliance_rate=sla_comp,
                    performance_score=score
                )
            )
        # Sort departments by composite performance score descending
        dept_metrics.sort(key=lambda x: x.performance_score, reverse=True)

        # 3. District Performance
        dist_stmt = (
            select(
                District.id,
                District.name,
                District.state,
                District.population,
                func.count(Issue.id).label("total"),
                func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved")
            )
            .outerjoin(Issue, Issue.district_id == District.id)
        )
        dist_filters = []
        if start_date:
            dist_filters.append(Issue.reported_at >= start_date)
        if end_date:
            dist_filters.append(Issue.reported_at <= end_date)
        if department_id:
            dist_filters.append(Issue.department_id == department_id)
        if category:
            dist_filters.append(Issue.category == category.upper())
        if dist_filters:
            dist_stmt = dist_stmt.where(*dist_filters)

        dist_stmt = dist_stmt.group_by(District.id, District.name, District.state, District.population)
        dist_rows = (await session.execute(dist_stmt)).all()

        dist_list = []
        for r in dist_rows:
            dtot = r.total or 0
            dres = r.resolved or 0
            d_pop = r.population or 100000
            res_r = round((dres / dtot * 100.0), 2) if dtot > 0 else 0.0
            per_100k = round((dtot / (d_pop / 100000.0)), 2)
            dist_list.append({
                "district_id": r.id,
                "district_name": r.name,
                "state": r.state,
                "population": r.population,
                "total_issues": dtot,
                "resolved_issues": dres,
                "resolution_rate": res_r,
                "issues_per_100k": per_100k
            })
        # Rank districts by resolution rate descending
        dist_list.sort(key=lambda x: x["resolution_rate"], reverse=True)
        district_performance = [
            DistrictPerformanceMetric(
                district_id=d["district_id"],
                district_name=d["district_name"],
                state=d["state"],
                population=d["population"],
                total_issues=d["total_issues"],
                resolved_issues=d["resolved_issues"],
                resolution_rate=d["resolution_rate"],
                issues_per_100k=d["issues_per_100k"],
                rank=idx + 1
            )
            for idx, d in enumerate(dist_list)
        ]

        # 4. University Participation
        univ_count_stmt = select(func.count(University.id))
        total_univs = (await session.execute(univ_count_stmt)).scalar() or 0

        univ_proj_stmt = select(
            func.count(StakeholderProject.id).label("active_projects"),
            func.sum(StakeholderProject.students_involved).label("students"),
            func.sum(case((StakeholderProject.status.in_([ProjectStatus.COMPLETED, ProjectStatus.DEPLOYED]), 1), else_=0)).label("deployed")
        ).where(StakeholderProject.stakeholder_type == StakeholderType.UNIVERSITY)
        univ_proj_res = (await session.execute(univ_proj_stmt)).one()

        top_univs_stmt = select(University).order_by(desc(University.active_teams)).limit(5)
        top_u_rows = (await session.execute(top_univs_stmt)).scalars().all()
        top_univs = [
            {
                "id": u.id,
                "name": u.name,
                "code": u.code,
                "active_teams": u.active_teams,
                "students_enrolled": u.students_enrolled,
                "research_focus": u.research_focus
            }
            for u in top_u_rows
        ]

        univ_part = UniversityParticipationMetric(
            total_institutions=total_univs,
            active_projects=univ_proj_res.active_projects or 0,
            total_students_engaged=univ_proj_res.students or 0,
            deployed_innovations=univ_proj_res.deployed or 0,
            top_universities=top_univs
        )

        # 5. Industry Participation
        ind_stmt = select(
            func.count(Industry.id).label("total_ind"),
            func.sum(Industry.csr_budget_allocated).label("allocated"),
            func.sum(Industry.csr_budget_spent).label("spent")
        )
        ind_res = (await session.execute(ind_stmt)).one()
        ind_alloc = float(ind_res.allocated or 0.0)
        ind_spent = float(ind_res.spent or 0.0)
        util_rate = round((ind_spent / ind_alloc * 100.0), 2) if ind_alloc > 0 else 0.0

        ind_proj_count_stmt = select(func.count(StakeholderProject.id)).where(
            StakeholderProject.stakeholder_type == StakeholderType.INDUSTRY
        )
        ind_proj_count = (await session.execute(ind_proj_count_stmt)).scalar() or 0

        top_ind_stmt = select(Industry).order_by(desc(Industry.csr_budget_spent)).limit(5)
        top_i_rows = (await session.execute(top_ind_stmt)).scalars().all()
        top_corporates = [
            {
                "id": i.id,
                "name": i.name,
                "code": i.code,
                "sector": i.sector,
                "csr_budget_allocated": i.csr_budget_allocated,
                "csr_budget_spent": i.csr_budget_spent,
                "active_partnerships": i.active_partnerships
            }
            for i in top_i_rows
        ]

        ind_part = IndustryParticipationMetric(
            active_corporates=ind_res.total_ind or 0,
            total_csr_allocated=ind_alloc,
            total_csr_spent=ind_spent,
            budget_utilization_rate=util_rate,
            sponsored_projects_count=ind_proj_count,
            top_corporate_sponsors=top_corporates
        )

        # 6. Category Trends
        cat_stmt = (
            select(
                Issue.category,
                func.count(Issue.id).label("total"),
                func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved"),
                func.sum(case((Issue.status.in_([IssueStatus.REPORTED, IssueStatus.ASSIGNED]), 1), else_=0)).label("pending")
            )
        )
        if filters:
            cat_stmt = cat_stmt.where(*filters)
        cat_stmt = cat_stmt.group_by(Issue.category).order_by(desc("total"))
        cat_rows = (await session.execute(cat_stmt)).all()

        category_trends: List[CategoryTrendMetric] = []
        for r in cat_rows:
            c_tot = r.total or 0
            c_pct = round((c_tot / tot * 100.0), 2) if tot > 0 else 0.0
            category_trends.append(
                CategoryTrendMetric(
                    category=r.category.value if hasattr(r.category, "value") else str(r.category),
                    total_reported=c_tot,
                    resolved_count=r.resolved or 0,
                    pending_count=r.pending or 0,
                    share_percentage=c_pct
                )
            )

        # 7. Monthly Trends (Time-series aggregations)
        # Note: across SQLite and PostgreSQL, we can select reported_at, resolved_at and group in memory or via date functions
        time_stmt = select(Issue.reported_at, Issue.resolved_at, Issue.status)
        if filters:
            time_stmt = time_stmt.where(*filters)
        time_rows = (await session.execute(time_stmt)).all()

        monthly_map: Dict[str, Dict[str, Any]] = {}
        for r in time_rows:
            dt = r.reported_at
            if dt:
                m_key = dt.strftime("%Y-%m")
                m_name = dt.strftime("%B")
                m_year = dt.year
                if m_key not in monthly_map:
                    monthly_map[m_key] = {
                        "month_key": m_key,
                        "month_name": m_name,
                        "year": m_year,
                        "reported": 0,
                        "resolved": 0
                    }
                monthly_map[m_key]["reported"] += 1
                if r.status in [IssueStatus.RESOLVED, IssueStatus.CLOSED]:
                    monthly_map[m_key]["resolved"] += 1

        monthly_trends: List[MonthlyTrendMetric] = []
        for k in sorted(monthly_map.keys()):
            item = monthly_map[k]
            rep = item["reported"]
            resv = item["resolved"]
            r_rate = round((resv / rep * 100.0), 2) if rep > 0 else 0.0
            monthly_trends.append(
                MonthlyTrendMetric(
                    month_key=item["month_key"],
                    month_name=item["month_name"],
                    year=item["year"],
                    issues_reported=rep,
                    issues_resolved=resv,
                    resolution_rate=r_rate
                )
            )

        return AnalyticsData(
            filter_applied=filter_applied,
            issues_overview=issues_overview,
            department_performance=dept_metrics,
            district_performance=district_performance,
            university_participation=univ_part,
            industry_participation=ind_part,
            category_trends=category_trends,
            monthly_trends=monthly_trends
        )
