from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import EscalationPolicyModel, EscalationLogModel
from shared.enums import PriorityLevel, EscalationLevel


class EscalationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # Escalation Policies
    async def get_policy_by_id(self, policy_id: str) -> Optional[EscalationPolicyModel]:
        res = await self.session.execute(select(EscalationPolicyModel).where(EscalationPolicyModel.id == policy_id))
        return res.scalar_one_or_none()

    async def list_policies(
        self,
        department_id: Optional[str] = None,
        priority: Optional[PriorityLevel] = None,
        is_active: Optional[bool] = None,
    ) -> List[EscalationPolicyModel]:
        query = select(EscalationPolicyModel)
        if department_id:
            query = query.where(
                (EscalationPolicyModel.department_id == department_id) | (EscalationPolicyModel.department_id.is_(None))
            )
        if priority:
            query = query.where(EscalationPolicyModel.priority == priority)
        if is_active is not None:
            query = query.where(EscalationPolicyModel.is_active == is_active)
        res = await self.session.execute(query.order_by(EscalationPolicyModel.breach_hours_threshold.asc()))
        return list(res.scalars().all())

    async def create_policy(self, policy: EscalationPolicyModel) -> EscalationPolicyModel:
        self.session.add(policy)
        await self.session.flush()
        return policy

    # Escalation Logs
    async def create_escalation_log(self, log_entry: EscalationLogModel) -> EscalationLogModel:
        self.session.add(log_entry)
        await self.session.flush()
        return log_entry

    async def list_logs_for_issue(self, issue_id: str) -> List[EscalationLogModel]:
        res = await self.session.execute(
            select(EscalationLogModel)
            .where(EscalationLogModel.issue_id == issue_id)
            .order_by(EscalationLogModel.created_at.desc())
        )
        return list(res.scalars().all())
