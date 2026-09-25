from typing import List, Optional
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import (
    StakeholderRecommendationModel,
    CollaborationModel,
    WorkflowInstanceModel,
)
from shared.enums import StakeholderType, CollaborationStatus


class AssignmentRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # Stakeholder recommendations
    async def create_recommendation(
        self, recommendation: StakeholderRecommendationModel
    ) -> StakeholderRecommendationModel:
        self.session.add(recommendation)
        await self.session.flush()
        return recommendation

    async def list_recommendations_for_issue(
        self, issue_id: str, stakeholder_type: Optional[StakeholderType] = None
    ) -> List[StakeholderRecommendationModel]:
        query = select(StakeholderRecommendationModel).where(StakeholderRecommendationModel.issue_id == issue_id)
        if stakeholder_type:
            query = query.where(StakeholderRecommendationModel.stakeholder_type == stakeholder_type)
        res = await self.session.execute(query.order_by(StakeholderRecommendationModel.match_score.desc()))
        return list(res.scalars().all())

    # Collaborations
    async def create_collaboration(self, collaboration: CollaborationModel) -> CollaborationModel:
        self.session.add(collaboration)
        await self.session.flush()
        return collaboration

    async def get_collaboration_by_id(self, collab_id: str) -> Optional[CollaborationModel]:
        res = await self.session.execute(select(CollaborationModel).where(CollaborationModel.id == collab_id))
        return res.scalar_one_or_none()

    async def list_collaborations_for_issue(
        self, issue_id: str, status: Optional[CollaborationStatus] = None
    ) -> List[CollaborationModel]:
        query = select(CollaborationModel).where(CollaborationModel.issue_id == issue_id)
        if status:
            query = query.where(CollaborationModel.status == status)
        res = await self.session.execute(query.order_by(CollaborationModel.created_at.asc()))
        return list(res.scalars().all())

    async def update_collaboration(self, collab_id: str, updates: dict) -> Optional[CollaborationModel]:
        await self.session.execute(
            update(CollaborationModel).where(CollaborationModel.id == collab_id).values(**updates)
        )
        await self.session.flush()
        return await self.get_collaboration_by_id(collab_id)
