from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.department_repository import DepartmentRepository
from app.repositories.routing_repository import RoutingRepository
from app.schemas.routing_schemas import RoutingEvaluationRequest, RoutingEvaluationResponse
from app.models.models import DepartmentModel, DistrictModel, OfficeModel, RoutingRuleModel
from shared.exceptions import EntityNotFoundError


class RoutingEngine:
    """
    Deterministic rule-based routing engine that maps issues to the
    appropriate government department and field office based on category,
    severity, administrative jurisdiction, and office capacity.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self.dept_repo = DepartmentRepository(session)
        self.routing_repo = RoutingRepository(session)

    async def resolve_district(self, request: RoutingEvaluationRequest) -> Optional[DistrictModel]:
        """Resolve geographical district via pincode, district_name, or taluk."""
        if request.pincode:
            district = await self.dept_repo.find_district_by_pincode(request.pincode)
            if district:
                return district

        if request.district_name:
            district = await self.dept_repo.get_district_by_name_or_code(request.district_name)
            if district:
                return district

        # Default to first active district if available
        districts = await self.dept_repo.list_districts(is_active=True)
        return districts[0] if districts else None

    async def evaluate_routing(self, request: RoutingEvaluationRequest) -> RoutingEvaluationResponse:
        district = await self.resolve_district(request)
        district_id = district.id if district else None

        # Fetch active rules for category & district ordered by priority_order (ascending)
        rules = await self.routing_repo.list_rules(
            category=request.category,
            district_id=district_id,
            is_active=True,
        )

        matched_rule: Optional[RoutingRuleModel] = None
        for rule in rules:
            # 1. Severity threshold check
            if not (rule.min_severity <= request.severity_score <= rule.max_severity):
                continue

            # 2. Subcategory check (if specified in rule)
            if rule.subcategory and request.subcategory:
                if rule.subcategory.lower() not in request.subcategory.lower():
                    continue

            # 3. Keyword / condition check
            conditions = rule.conditions or {}
            required_keywords = conditions.get("keywords", [])
            if required_keywords:
                matched_kw = any(kw.lower() in [k.lower() for k in request.keywords] for kw in required_keywords)
                if not matched_kw:
                    continue

            matched_rule = rule
            break

        if matched_rule:
            target_dept = await self.dept_repo.get_department_by_id(matched_rule.target_department_id)
            if not target_dept or not target_dept.is_active:
                if matched_rule.fallback_department_id:
                    target_dept = await self.dept_repo.get_department_by_id(matched_rule.fallback_department_id)

            assigned_office: Optional[OfficeModel] = None
            if matched_rule.target_office_id:
                assigned_office = await self.dept_repo.get_office_by_id(matched_rule.target_office_id)
            elif target_dept and district_id:
                # Find available office in district with lowest workload
                offices = await self.dept_repo.list_offices(
                    department_id=target_dept.id,
                    district_id=district_id,
                    is_active=True,
                )
                if offices:
                    offices.sort(key=lambda o: o.current_workload)
                    assigned_office = offices[0]

            dept_name = target_dept.name if target_dept else "General Municipal Administration"
            dept_id = target_dept.id if target_dept else "UNASSIGNED"

            return RoutingEvaluationResponse(
                issue_id=request.issue_id,
                matched_rule_id=matched_rule.id,
                matched_rule_name=matched_rule.name,
                assigned_department_id=dept_id,
                assigned_department_name=dept_name,
                assigned_district_id=district_id,
                assigned_office_id=assigned_office.id if assigned_office else None,
                assigned_office_name=assigned_office.office_name if assigned_office else None,
                confidence=0.95,
                routing_rationale=f"Matched active routing rule '{matched_rule.name}' for category '{request.category.value}' and severity {request.severity_score:.2f}.",
            )

        # Fallback default routing if no explicit rule matched
        all_depts = await self.dept_repo.list_departments(is_active=True)
        fallback_dept = all_depts[0] if all_depts else None

        return RoutingEvaluationResponse(
            issue_id=request.issue_id,
            matched_rule_id=None,
            matched_rule_name=None,
            assigned_department_id=fallback_dept.id if fallback_dept else "UNASSIGNED",
            assigned_department_name=fallback_dept.name if fallback_dept else "Default Civic Authority",
            assigned_district_id=district_id,
            assigned_office_id=None,
            assigned_office_name=None,
            confidence=0.70,
            routing_rationale=f"No specialized rule matched for category '{request.category.value}'. Routed to default civic authority.",
        )
