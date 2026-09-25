from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import RoutingRuleModel
from app.repositories.routing_repository import RoutingRepository
from app.routing.engine import RoutingEngine
from app.schemas.routing_schemas import (
    RoutingRuleCreate,
    RoutingRuleUpdate,
    RoutingEvaluationRequest,
    RoutingEvaluationResponse,
)
from shared.enums import IssueCategory
from shared.exceptions import EntityNotFoundError


class RoutingService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.routing_repo = RoutingRepository(session)
        self.routing_engine = RoutingEngine(session)

    async def evaluate_routing(self, request: RoutingEvaluationRequest) -> RoutingEvaluationResponse:
        return await self.routing_engine.evaluate_routing(request)

    async def get_rule(self, rule_id: str) -> RoutingRuleModel:
        rule = await self.routing_repo.get_rule_by_id(rule_id)
        if not rule:
            raise EntityNotFoundError("RoutingRule", rule_id)
        return rule

    async def list_rules(
        self,
        category: Optional[IssueCategory] = None,
        district_id: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> List[RoutingRuleModel]:
        return await self.routing_repo.list_rules(category=category, district_id=district_id, is_active=is_active)

    async def create_rule(self, req: RoutingRuleCreate) -> RoutingRuleModel:
        rule = RoutingRuleModel(
            name=req.name,
            priority_order=req.priority_order,
            category=req.category,
            subcategory=req.subcategory,
            district_id=req.district_id,
            min_severity=req.min_severity,
            max_severity=req.max_severity,
            target_department_id=req.target_department_id,
            target_office_id=req.target_office_id,
            fallback_department_id=req.fallback_department_id,
            conditions=req.conditions,
            is_active=req.is_active,
        )
        return await self.routing_repo.create_rule(rule)

    async def update_rule(self, rule_id: str, req: RoutingRuleUpdate) -> RoutingRuleModel:
        updates = req.model_dump(exclude_unset=True)
        updated = await self.routing_repo.update_rule(rule_id, updates)
        if not updated:
            raise EntityNotFoundError("RoutingRule", rule_id)
        return updated

    async def delete_rule(self, rule_id: str) -> bool:
        deleted = await self.routing_repo.delete_rule(rule_id)
        if not deleted:
            raise EntityNotFoundError("RoutingRule", rule_id)
        return True
