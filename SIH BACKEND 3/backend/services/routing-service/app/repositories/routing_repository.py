from typing import List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import RoutingRuleModel
from shared.enums import IssueCategory


class RoutingRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_rule_by_id(self, rule_id: str) -> Optional[RoutingRuleModel]:
        res = await self.session.execute(select(RoutingRuleModel).where(RoutingRuleModel.id == rule_id))
        return res.scalar_one_or_none()

    async def list_rules(
        self,
        category: Optional[IssueCategory] = None,
        district_id: Optional[str] = None,
        is_active: Optional[bool] = None,
    ) -> List[RoutingRuleModel]:
        query = select(RoutingRuleModel)
        if category:
            query = query.where(RoutingRuleModel.category == category)
        if district_id:
            query = query.where(
                (RoutingRuleModel.district_id == district_id) | (RoutingRuleModel.district_id.is_(None))
            )
        if is_active is not None:
            query = query.where(RoutingRuleModel.is_active == is_active)
        # Order by priority_order ascending (lower number = highest evaluation precedence)
        res = await self.session.execute(query.order_by(RoutingRuleModel.priority_order.asc()))
        return list(res.scalars().all())

    async def create_rule(self, rule: RoutingRuleModel) -> RoutingRuleModel:
        self.session.add(rule)
        await self.session.flush()
        return rule

    async def update_rule(self, rule_id: str, updates: dict) -> Optional[RoutingRuleModel]:
        await self.session.execute(
            update(RoutingRuleModel).where(RoutingRuleModel.id == rule_id).values(**updates)
        )
        await self.session.flush()
        return await self.get_rule_by_id(rule_id)

    async def delete_rule(self, rule_id: str) -> bool:
        res = await self.session.execute(delete(RoutingRuleModel).where(RoutingRuleModel.id == rule_id))
        await self.session.flush()
        return res.rowcount > 0
