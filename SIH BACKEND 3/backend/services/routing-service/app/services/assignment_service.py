from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import WorkflowInstanceModel, StakeholderRecommendationModel
from app.assignment.engine import AssignmentEngine
from app.repositories.assignment_repository import AssignmentRepository
from app.schemas.assignment_schemas import (
    AssignOwnerRequest,
    ReassignOwnerRequest,
    GenerateRecommendationsRequest,
)
from shared.enums import StakeholderType


class AssignmentService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.assignment_engine = AssignmentEngine(session)
        self.assignment_repo = AssignmentRepository(session)

    async def assign_owner(self, request: AssignOwnerRequest) -> WorkflowInstanceModel:
        return await self.assignment_engine.assign_government_owner(request)

    async def reassign_owner(self, issue_id: str, request: ReassignOwnerRequest) -> WorkflowInstanceModel:
        return await self.assignment_engine.reassign_government_owner(issue_id, request)

    async def generate_recommendations(
        self, request: GenerateRecommendationsRequest
    ) -> List[StakeholderRecommendationModel]:
        return await self.assignment_engine.generate_recommendations(request)

    async def get_recommendations(
        self, issue_id: str, stakeholder_type: Optional[StakeholderType] = None
    ) -> List[StakeholderRecommendationModel]:
        return await self.assignment_repo.list_recommendations_for_issue(issue_id, stakeholder_type)
