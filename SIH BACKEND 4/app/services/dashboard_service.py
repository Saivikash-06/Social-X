from typing import Any, Dict, List, Optional
from sqlalchemy import func, select, desc, case
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
    ProjectStatus,
    ActivityLog
)
from app.schemas.dashboard import (
    AdminDashboardData,
    KPIOverview,
    DepartmentLeaderboardItem,
    CategoryBreakdownItem,
    RecentActivityItem,
    IssueCardItem,
    GovDashboardData,
    UniversityDashboardData,
    IndustryDashboardData,
    CitizenDashboardData,
    CitizenIssueItem,
    StakeholderProjectItem
)


class DashboardService:
    @staticmethod
    async def get_admin_dashboard(session: AsyncSession) -> AdminDashboardData:
        # 1. Total KPI calculations
        total_stmt = select(
            func.count(Issue.id).label("total"),
            func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved"),
            func.sum(case((Issue.status.in_([IssueStatus.REPORTED, IssueStatus.ASSIGNED]), 1), else_=0)).label("pending"),
            func.sum(case((Issue.status == IssueStatus.IN_PROGRESS, 1), else_=0)).label("in_progress"),
            func.sum(case((Issue.status == IssueStatus.ESCALATED, 1), else_=0)).label("escalated"),
            func.sum(case((Issue.is_sla_breached.is_(True), 1), else_=0)).label("sla_breaches")
        )
        kpi_res = (await session.execute(total_stmt)).one()
        total = kpi_res.total or 0
        resolved = kpi_res.resolved or 0
        pending = kpi_res.pending or 0
        in_progress = kpi_res.in_progress or 0
        escalated = kpi_res.escalated or 0
        sla_breaches = kpi_res.sla_breaches or 0
        resolution_rate = round((resolved / total * 100.0), 2) if total > 0 else 0.0

        kpis = KPIOverview(
            total_issues=total,
            resolved_issues=resolved,
            pending_issues=pending,
            in_progress_issues=in_progress,
            escalated_issues=escalated,
            resolution_rate=resolution_rate,
            sla_breaches=sla_breaches
        )

        # 2. Department Leaderboard
        dept_stmt = (
            select(
                Department.id,
                Department.name,
                Department.code,
                func.count(Issue.id).label("dept_total"),
                func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("dept_resolved"),
                func.avg(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), Issue.resolution_hours), else_=None)).label("avg_hrs"),
                func.sum(case((Issue.is_sla_breached.is_(True), 1), else_=0)).label("sla_breaches")
            )
            .outerjoin(Issue, Issue.department_id == Department.id)
            .group_by(Department.id, Department.name, Department.code)
            .order_by(desc("dept_total"))
        )
        dept_rows = (await session.execute(dept_stmt)).all()
        dept_leaderboard: List[DepartmentLeaderboardItem] = []
        for r in dept_rows:
            d_tot = r.dept_total or 0
            d_res = r.dept_resolved or 0
            d_rate = round((d_res / d_tot * 100.0), 2) if d_tot > 0 else 0.0
            sla_b = r.sla_breaches or 0
            sla_comp = round(((d_tot - sla_b) / d_tot * 100.0), 2) if d_tot > 0 else 100.0
            avg_h = round(float(r.avg_hrs), 2) if r.avg_hrs is not None else None
            dept_leaderboard.append(
                DepartmentLeaderboardItem(
                    department_id=r.id,
                    department_name=r.name,
                    department_code=r.code,
                    total_issues=d_tot,
                    resolved_issues=d_res,
                    resolution_rate=d_rate,
                    avg_resolution_hours=avg_h,
                    sla_compliance_rate=sla_comp
                )
            )

        # 3. Category Distribution
        cat_stmt = (
            select(
                Issue.category,
                func.count(Issue.id).label("cat_count")
            )
            .group_by(Issue.category)
            .order_by(desc("cat_count"))
        )
        cat_rows = (await session.execute(cat_stmt)).all()
        category_distribution: List[CategoryBreakdownItem] = []
        for r in cat_rows:
            c_count = r.cat_count or 0
            c_pct = round((c_count / total * 100.0), 2) if total > 0 else 0.0
            category_distribution.append(
                CategoryBreakdownItem(
                    category=r.category.value if hasattr(r.category, "value") else str(r.category),
                    count=c_count,
                    percentage=c_pct
                )
            )

        # 4. Critical Alerts (Urgent / SLA Breached issues)
        crit_stmt = (
            select(Issue, Department.name.label("dept_name"), District.name.label("dist_name"))
            .outerjoin(Department, Issue.department_id == Department.id)
            .outerjoin(District, Issue.district_id == District.id)
            .where(
                (Issue.severity == IssueSeverity.CRITICAL) |
                (Issue.is_sla_breached.is_(True)) |
                (Issue.status == IssueStatus.ESCALATED)
            )
            .order_by(desc(Issue.reported_at))
            .limit(5)
        )
        crit_rows = (await session.execute(crit_stmt)).all()
        critical_alerts: List[IssueCardItem] = [
            IssueCardItem(
                id=r.Issue.id,
                ticket_id=r.Issue.ticket_id,
                title=r.Issue.title,
                category=r.Issue.category.value if hasattr(r.Issue.category, "value") else str(r.Issue.category),
                status=r.Issue.status.value if hasattr(r.Issue.status, "value") else str(r.Issue.status),
                severity=r.Issue.severity.value if hasattr(r.Issue.severity, "value") else str(r.Issue.severity),
                department_name=r.dept_name,
                district_name=r.dist_name,
                reported_at=r.Issue.reported_at,
                is_sla_breached=r.Issue.is_sla_breached,
                sla_due_at=r.Issue.sla_due_at
            )
            for r in crit_rows
        ]

        # 5. Recent Activity Logs
        act_stmt = select(ActivityLog).order_by(desc(ActivityLog.created_at)).limit(8)
        act_rows = (await session.execute(act_stmt)).scalars().all()
        recent_activities: List[RecentActivityItem] = [
            RecentActivityItem(
                id=a.id,
                actor_id=a.actor_id,
                actor_role=a.actor_role,
                action=a.action,
                entity_type=a.entity_type,
                description=a.description,
                created_at=a.created_at
            )
            for a in act_rows
        ]

        # 6. Stakeholder and CSR totals
        stakeholder_stmt = select(
            func.count(StakeholderProject.id).label("total_projects"),
            func.sum(StakeholderProject.funding_committed).label("funding_committed"),
            func.sum(StakeholderProject.funding_disbursed).label("funding_disbursed")
        )
        stk_res = (await session.execute(stakeholder_stmt)).one()

        return AdminDashboardData(
            kpis=kpis,
            department_leaderboard=dept_leaderboard,
            category_distribution=category_distribution,
            critical_alerts=critical_alerts,
            recent_activities=recent_activities,
            total_academic_projects=stk_res.total_projects or 0,
            total_csr_allocated=float(stk_res.funding_committed or 0.0),
            total_csr_disbursed=float(stk_res.funding_disbursed or 0.0)
        )

    @staticmethod
    async def get_gov_dashboard(
        session: AsyncSession,
        department_id: Optional[int] = None,
        district_id: Optional[int] = None
    ) -> GovDashboardData:
        dept_name = None
        if department_id:
            d_obj = await session.get(Department, department_id)
            if d_obj:
                dept_name = d_obj.name

        query = select(Issue)
        if department_id:
            query = query.where(Issue.department_id == department_id)
        if district_id:
            query = query.where(Issue.district_id == district_id)

        # Totals and counts
        stats_stmt = select(
            func.count(Issue.id).label("assigned_total"),
            func.sum(case((Issue.status == IssueStatus.IN_PROGRESS, 1), else_=0)).label("in_progress"),
            func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved"),
            func.sum(case((Issue.status.in_([IssueStatus.REPORTED, IssueStatus.ASSIGNED]), 1), else_=0)).label("pending_action"),
            func.sum(case((Issue.is_sla_breached.is_(True), 1), else_=0)).label("sla_breached_count"),
            func.avg(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), Issue.resolution_hours), else_=None)).label("avg_hrs")
        )
        if department_id:
            stats_stmt = stats_stmt.where(Issue.department_id == department_id)
        if district_id:
            stats_stmt = stats_stmt.where(Issue.district_id == district_id)

        stats = (await session.execute(stats_stmt)).one()
        assigned = stats.assigned_total or 0
        in_prog = stats.in_progress or 0
        res = stats.resolved or 0
        pending = stats.pending_action or 0
        breached = stats.sla_breached_count or 0
        avg_hrs = round(float(stats.avg_hrs), 2) if stats.avg_hrs is not None else None
        compliance_rate = round(((assigned - breached) / assigned * 100.0), 2) if assigned > 0 else 100.0

        # Priority action items (unresolved, sorted by severity/urgency)
        crit_stmt = (
            select(Issue, Department.name.label("d_name"), District.name.label("dist_name"))
            .outerjoin(Department, Issue.department_id == Department.id)
            .outerjoin(District, Issue.district_id == District.id)
            .where(Issue.status.notin_([IssueStatus.RESOLVED, IssueStatus.CLOSED]))
        )
        if department_id:
            crit_stmt = crit_stmt.where(Issue.department_id == department_id)
        if district_id:
            crit_stmt = crit_stmt.where(Issue.district_id == district_id)

        crit_stmt = crit_stmt.order_by(desc(Issue.severity), desc(Issue.is_sla_breached), Issue.reported_at).limit(5)
        action_rows = (await session.execute(crit_stmt)).all()

        action_items: List[IssueCardItem] = [
            IssueCardItem(
                id=r.Issue.id,
                ticket_id=r.Issue.ticket_id,
                title=r.Issue.title,
                category=r.Issue.category.value if hasattr(r.Issue.category, "value") else str(r.Issue.category),
                status=r.Issue.status.value if hasattr(r.Issue.status, "value") else str(r.Issue.status),
                severity=r.Issue.severity.value if hasattr(r.Issue.severity, "value") else str(r.Issue.severity),
                department_name=r.d_name,
                district_name=r.dist_name,
                reported_at=r.Issue.reported_at,
                is_sla_breached=r.Issue.is_sla_breached,
                sla_due_at=r.Issue.sla_due_at
            )
            for r in action_rows
        ]

        # District distribution
        dist_stmt = (
            select(
                District.id,
                District.name,
                func.count(Issue.id).label("issue_count"),
                func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved_count")
            )
            .join(Issue, Issue.district_id == District.id)
        )
        if department_id:
            dist_stmt = dist_stmt.where(Issue.department_id == department_id)
        dist_stmt = dist_stmt.group_by(District.id, District.name).order_by(desc("issue_count"))
        dist_rows = (await session.execute(dist_stmt)).all()

        district_dist = [
            {
                "district_id": r.id,
                "district_name": r.name,
                "issue_count": r.issue_count or 0,
                "resolved_count": r.resolved_count or 0,
                "resolution_rate": round(((r.resolved_count or 0) / r.issue_count * 100.0), 2) if r.issue_count else 0.0
            }
            for r in dist_rows
        ]

        # Active collaborations
        proj_stmt = (
            select(StakeholderProject)
            .where(StakeholderProject.status.in_([ProjectStatus.IN_PROGRESS, ProjectStatus.PROPOSED]))
            .order_by(desc(StakeholderProject.start_date))
            .limit(5)
        )
        proj_rows = (await session.execute(proj_stmt)).scalars().all()
        collabs: List[StakeholderProjectItem] = [
            StakeholderProjectItem(
                id=p.id,
                project_code=p.project_code,
                title=p.title,
                stakeholder_type=p.stakeholder_type.value if hasattr(p.stakeholder_type, "value") else str(p.stakeholder_type),
                stakeholder_name=p.stakeholder_name,
                status=p.status.value if hasattr(p.status, "value") else str(p.status),
                students_involved=p.students_involved or 0,
                funding_committed=p.funding_committed or 0.0,
                funding_disbursed=p.funding_disbursed or 0.0,
                target_completion_date=p.target_completion_date
            )
            for p in proj_rows
        ]

        return GovDashboardData(
            department_id=department_id,
            department_name=dept_name,
            assigned_total=assigned,
            in_progress=in_prog,
            resolved=res,
            pending_action=pending,
            sla_breached_count=breached,
            avg_resolution_hours=avg_hrs,
            sla_compliance_rate=compliance_rate,
            priority_action_items=action_items,
            district_distribution=district_dist,
            active_collaborations=collabs
        )

    @staticmethod
    async def get_university_dashboard(
        session: AsyncSession,
        university_id: Optional[int] = None
    ) -> UniversityDashboardData:
        univ_name = None
        if university_id:
            u_obj = await session.get(University, university_id)
            if u_obj:
                univ_name = u_obj.name

        # Academic projects
        proj_stmt = select(
            func.count(StakeholderProject.id).label("total_projects"),
            func.sum(StakeholderProject.students_involved).label("students_engaged"),
            func.sum(case((StakeholderProject.status.in_([ProjectStatus.COMPLETED, ProjectStatus.DEPLOYED]), 1), else_=0)).label("solutions_deployed")
        ).where(StakeholderProject.stakeholder_type == StakeholderType.UNIVERSITY)

        if university_id:
            proj_stmt = proj_stmt.where(StakeholderProject.stakeholder_id == university_id)

        stats = (await session.execute(proj_stmt)).one()
        active_projects = stats.total_projects or 0
        students_engaged = stats.students_engaged or 0
        solutions_deployed = stats.solutions_deployed or 0

        # Open Societal Challenges (issues not yet resolved, with high/critical severity, suitable for research adoption)
        open_challenges_stmt = (
            select(Issue, Department.name.label("d_name"), District.name.label("dist_name"))
            .outerjoin(Department, Issue.department_id == Department.id)
            .outerjoin(District, Issue.district_id == District.id)
            .where(Issue.status.in_([IssueStatus.REPORTED, IssueStatus.ASSIGNED, IssueStatus.IN_PROGRESS]))
            .order_by(desc(Issue.severity), desc(Issue.reported_at))
            .limit(5)
        )
        ch_rows = (await session.execute(open_challenges_stmt)).all()
        open_challenges: List[IssueCardItem] = [
            IssueCardItem(
                id=r.Issue.id,
                ticket_id=r.Issue.ticket_id,
                title=r.Issue.title,
                category=r.Issue.category.value if hasattr(r.Issue.category, "value") else str(r.Issue.category),
                status=r.Issue.status.value if hasattr(r.Issue.status, "value") else str(r.Issue.status),
                severity=r.Issue.severity.value if hasattr(r.Issue.severity, "value") else str(r.Issue.severity),
                department_name=r.d_name,
                district_name=r.dist_name,
                reported_at=r.Issue.reported_at,
                is_sla_breached=r.Issue.is_sla_breached,
                sla_due_at=r.Issue.sla_due_at
            )
            for r in ch_rows
        ]

        # Active academic projects list
        p_list_stmt = (
            select(StakeholderProject)
            .where(StakeholderProject.stakeholder_type == StakeholderType.UNIVERSITY)
        )
        if university_id:
            p_list_stmt = p_list_stmt.where(StakeholderProject.stakeholder_id == university_id)
        p_list_stmt = p_list_stmt.order_by(desc(StakeholderProject.created_at)).limit(6)
        p_rows = (await session.execute(p_list_stmt)).scalars().all()

        my_projects: List[StakeholderProjectItem] = [
            StakeholderProjectItem(
                id=p.id,
                project_code=p.project_code,
                title=p.title,
                stakeholder_type=p.stakeholder_type.value if hasattr(p.stakeholder_type, "value") else str(p.stakeholder_type),
                stakeholder_name=p.stakeholder_name,
                status=p.status.value if hasattr(p.status, "value") else str(p.status),
                students_involved=p.students_involved or 0,
                funding_committed=p.funding_committed or 0.0,
                funding_disbursed=p.funding_disbursed or 0.0,
                target_completion_date=p.target_completion_date
            )
            for p in p_rows
        ]

        # Research focus areas
        univ_focus_stmt = select(University.research_focus).where(University.research_focus.isnot(None))
        focus_rows = (await session.execute(univ_focus_stmt)).scalars().all()
        focus_areas = list(set([f for f in focus_rows if f]))

        return UniversityDashboardData(
            university_id=university_id,
            university_name=univ_name,
            active_research_projects=active_projects,
            total_students_engaged=students_engaged,
            challenges_adopted=active_projects,
            solutions_deployed=solutions_deployed,
            open_challenges=open_challenges,
            my_active_projects=my_projects,
            top_research_focus_areas=focus_areas
        )

    @staticmethod
    async def get_industry_dashboard(
        session: AsyncSession,
        industry_id: Optional[int] = None
    ) -> IndustryDashboardData:
        ind_name = None
        if industry_id:
            i_obj = await session.get(Industry, industry_id)
            if i_obj:
                ind_name = i_obj.name

        # Industry CSR numbers
        csr_stmt = select(
            func.sum(Industry.csr_budget_allocated).label("allocated"),
            func.sum(Industry.csr_budget_spent).label("spent"),
            func.sum(Industry.active_partnerships).label("partnerships")
        )
        if industry_id:
            csr_stmt = csr_stmt.where(Industry.id == industry_id)

        csr_res = (await session.execute(csr_stmt)).one()
        csr_allocated = float(csr_res.allocated or 0.0)
        csr_spent = float(csr_res.spent or 0.0)
        partnerships = csr_res.partnerships or 0

        # Sponsored projects
        sp_stmt = (
            select(StakeholderProject)
            .where(StakeholderProject.stakeholder_type == StakeholderType.INDUSTRY)
        )
        if industry_id:
            sp_stmt = sp_stmt.where(StakeholderProject.stakeholder_id == industry_id)
        sp_stmt = sp_stmt.order_by(desc(StakeholderProject.created_at)).limit(6)
        sp_rows = (await session.execute(sp_stmt)).scalars().all()

        sponsored_projects: List[StakeholderProjectItem] = [
            StakeholderProjectItem(
                id=p.id,
                project_code=p.project_code,
                title=p.title,
                stakeholder_type=p.stakeholder_type.value if hasattr(p.stakeholder_type, "value") else str(p.stakeholder_type),
                stakeholder_name=p.stakeholder_name,
                status=p.status.value if hasattr(p.status, "value") else str(p.status),
                students_involved=p.students_involved or 0,
                funding_committed=p.funding_committed or 0.0,
                funding_disbursed=p.funding_disbursed or 0.0,
                target_completion_date=p.target_completion_date
            )
            for p in sp_rows
        ]

        # Open opportunities needing CSR funding / corporate technology
        open_opps_stmt = (
            select(Issue, Department.name.label("d_name"), District.name.label("dist_name"))
            .outerjoin(Department, Issue.department_id == Department.id)
            .outerjoin(District, Issue.district_id == District.id)
            .where(
                Issue.status.in_([IssueStatus.REPORTED, IssueStatus.IN_PROGRESS]),
                Issue.category.in_([IssueCategory.WATER_SCARCITY, IssueCategory.ENVIRONMENT, IssueCategory.ROADS])
            )
            .order_by(desc(Issue.severity), desc(Issue.reported_at))
            .limit(5)
        )
        opps_rows = (await session.execute(open_opps_stmt)).all()
        open_opps: List[IssueCardItem] = [
            IssueCardItem(
                id=r.Issue.id,
                ticket_id=r.Issue.ticket_id,
                title=r.Issue.title,
                category=r.Issue.category.value if hasattr(r.Issue.category, "value") else str(r.Issue.category),
                status=r.Issue.status.value if hasattr(r.Issue.status, "value") else str(r.Issue.status),
                severity=r.Issue.severity.value if hasattr(r.Issue.severity, "value") else str(r.Issue.severity),
                department_name=r.d_name,
                district_name=r.dist_name,
                reported_at=r.Issue.reported_at,
                is_sla_breached=r.Issue.is_sla_breached,
                sla_due_at=r.Issue.sla_due_at
            )
            for r in opps_rows
        ]

        # Industry sectors
        sec_stmt = select(Industry.sector).distinct()
        sec_rows = (await session.execute(sec_stmt)).scalars().all()
        sectors = [s for s in sec_rows if s]

        # Estimated citizens impacted (approx calculation from resolved projects)
        citizens_impacted = int(csr_spent / 120.0) if csr_spent > 0 else 25000

        return IndustryDashboardData(
            industry_id=industry_id,
            industry_name=ind_name,
            csr_budget_allocated=csr_allocated,
            csr_budget_disbursed=csr_spent,
            active_partnerships=partnerships,
            estimated_citizens_impacted=citizens_impacted,
            sponsored_projects=sponsored_projects,
            open_funding_opportunities=open_opps,
            active_sectors=sectors
        )

    @staticmethod
    async def get_citizen_dashboard(
        session: AsyncSession,
        citizen_id: Optional[str] = None,
        district_id: Optional[int] = None
    ) -> CitizenDashboardData:
        dist_name = None
        if district_id:
            dist_obj = await session.get(District, district_id)
            if dist_obj:
                dist_name = dist_obj.name

        # Community stats
        comm_stmt = select(
            func.count(Issue.id).label("total"),
            func.sum(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), 1), else_=0)).label("resolved"),
            func.avg(case((Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]), Issue.resolution_hours), else_=None)).label("avg_hrs")
        )
        if district_id:
            comm_stmt = comm_stmt.where(Issue.district_id == district_id)

        comm_res = (await session.execute(comm_stmt)).one()
        c_tot = comm_res.total or 0
        c_res = comm_res.resolved or 0
        res_rate = round((c_res / c_tot * 100.0), 2) if c_tot > 0 else 0.0
        avg_days = round((float(comm_res.avg_hrs) / 24.0), 1) if comm_res.avg_hrs is not None else 1.5

        # My reported issues (if citizen_id supplied)
        my_issues: List[CitizenIssueItem] = []
        if citizen_id:
            my_stmt = (
                select(Issue)
                .where(Issue.citizen_id == citizen_id)
                .order_by(desc(Issue.reported_at))
            )
            my_rows = (await session.execute(my_stmt)).scalars().all()
            my_issues = [
                CitizenIssueItem(
                    ticket_id=i.ticket_id,
                    title=i.title,
                    category=i.category.value if hasattr(i.category, "value") else str(i.category),
                    status=i.status.value if hasattr(i.status, "value") else str(i.status),
                    severity=i.severity.value if hasattr(i.severity, "value") else str(i.severity),
                    reported_at=i.reported_at,
                    resolved_at=i.resolved_at,
                    feedback_rating=i.feedback_rating,
                    citizen_feedback=i.citizen_feedback
                )
                for i in my_rows
            ]

        # Recent community resolutions
        rec_stmt = (
            select(Issue, Department.name.label("d_name"), District.name.label("dist_name"))
            .outerjoin(Department, Issue.department_id == Department.id)
            .outerjoin(District, Issue.district_id == District.id)
            .where(Issue.status.in_([IssueStatus.RESOLVED, IssueStatus.CLOSED]))
        )
        if district_id:
            rec_stmt = rec_stmt.where(Issue.district_id == district_id)
        rec_stmt = rec_stmt.order_by(desc(Issue.resolved_at)).limit(5)
        rec_rows = (await session.execute(rec_stmt)).all()

        recent_resolutions: List[IssueCardItem] = [
            IssueCardItem(
                id=r.Issue.id,
                ticket_id=r.Issue.ticket_id,
                title=r.Issue.title,
                category=r.Issue.category.value if hasattr(r.Issue.category, "value") else str(r.Issue.category),
                status=r.Issue.status.value if hasattr(r.Issue.status, "value") else str(r.Issue.status),
                severity=r.Issue.severity.value if hasattr(r.Issue.severity, "value") else str(r.Issue.severity),
                department_name=r.d_name,
                district_name=r.dist_name,
                reported_at=r.Issue.reported_at,
                is_sla_breached=r.Issue.is_sla_breached,
                sla_due_at=r.Issue.sla_due_at
            )
            for r in rec_rows
        ]

        return CitizenDashboardData(
            citizen_id=citizen_id,
            district_name=dist_name,
            community_total_issues=c_tot,
            community_resolved_issues=c_res,
            community_resolution_rate=res_rate,
            avg_resolution_days=avg_days,
            my_reported_issues=my_issues,
            recent_community_resolutions=recent_resolutions
        )
