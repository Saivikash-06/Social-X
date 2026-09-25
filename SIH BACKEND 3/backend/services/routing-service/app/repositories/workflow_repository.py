from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import WorkflowInstanceModel, WorkflowHistoryModel
from shared.enums import WorkflowStatus


class WorkflowRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_issue_id(self, issue_id: str) -> Optional[WorkflowInstanceModel]:
        res = await self.session.execute(
            select(WorkflowInstanceModel)
            .where(WorkflowInstanceModel.issue_id == issue_id)
            .options(selectinload(WorkflowInstanceModel.history))
        )
        return res.scalar_one_or_none()

    async def get_by_id(self, instance_id: str) -> Optional[WorkflowInstanceModel]:
        res = await self.session.execute(
            select(WorkflowInstanceModel)
            .where(WorkflowInstanceModel.id == instance_id)
            .options(selectinload(WorkflowInstanceModel.history))
        )
        return res.scalar_one_or_none()

    async def create_instance(self, instance: WorkflowInstanceModel) -> WorkflowInstanceModel:
        self.session.add(instance)
        await self.session.flush()
        return instance

    async def update_instance(self, instance_id: str, updates: dict) -> Optional[WorkflowInstanceModel]:
        await self.session.execute(
            update(WorkflowInstanceModel).where(WorkflowInstanceModel.id == instance_id).values(**updates)
        )
        await self.session.flush()
        return await self.get_by_id(instance_id)

    async def add_history(self, history_entry: WorkflowHistoryModel) -> WorkflowHistoryModel:
        self.session.add(history_entry)
        await self.session.flush()
        return history_entry

    async def list_instances(
        self,
        status: Optional[WorkflowStatus] = None,
        department_id: Optional[str] = None,
        owner_id: Optional[str] = None,
        is_escalated: Optional[bool] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[WorkflowInstanceModel]:
        query = select(WorkflowInstanceModel).options(selectinload(WorkflowInstanceModel.history))
        if status:
            query = query.where(WorkflowInstanceModel.current_state == status)
        if department_id:
            query = query.where(WorkflowInstanceModel.assigned_department_id == department_id)
        if owner_id:
            query = query.where(WorkflowInstanceModel.owner_id == owner_id)
        if is_escalated is not None:
            query = query.where(WorkflowInstanceModel.is_escalated == is_escalated)
        res = await self.session.execute(query.order_by(WorkflowInstanceModel.created_at.desc()).limit(limit).offset(offset))
        return list(res.scalars().all())
