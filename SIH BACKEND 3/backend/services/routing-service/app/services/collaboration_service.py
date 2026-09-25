from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import CollaborationModel
from app.repositories.assignment_repository import AssignmentRepository
from app.schemas.collaboration_schemas import (
    CollaborationInviteRequest,
    CollaborationActionRequest,
    AddContributionRequest,
)
from shared.enums import CollaborationStatus
from shared.exceptions import EntityNotFoundError


class CollaborationService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.assignment_repo = AssignmentRepository(session)

    async def invite_stakeholder(self, request: CollaborationInviteRequest) -> CollaborationModel:
        collab = CollaborationModel(
            issue_id=request.issue_id,
            stakeholder_type=request.stakeholder_type,
            stakeholder_id=request.stakeholder_id,
            stakeholder_name=request.stakeholder_name,
            role=request.role,
            status=CollaborationStatus.INVITED,
            notes=request.notes,
            contributions=[],
        )
        return await self.assignment_repo.create_collaboration(collab)

    async def respond_invitation(self, collab_id: str, request: CollaborationActionRequest) -> CollaborationModel:
        collab = await self.assignment_repo.get_collaboration_by_id(collab_id)
        if not collab:
            raise EntityNotFoundError("Collaboration", collab_id)

        updates = {"status": request.action}
        if request.notes:
            updates["notes"] = f"{collab.notes or ''}\nResponse: {request.notes}".strip()
        return await self.assignment_repo.update_collaboration(collab_id, updates)

    async def add_contribution(self, collab_id: str, request: AddContributionRequest) -> CollaborationModel:
        collab = await self.assignment_repo.get_collaboration_by_id(collab_id)
        if not collab:
            raise EntityNotFoundError("Collaboration", collab_id)

        contributions = list(collab.contributions or [])
        contributions.append({
            "type": request.contribution_type,
            "summary": request.summary,
            "details": request.details,
        })
        return await self.assignment_repo.update_collaboration(collab_id, {
            "contributions": contributions,
            "status": CollaborationStatus.ACTIVE,
        })

    async def list_collaborations(
        self, issue_id: str, status: Optional[CollaborationStatus] = None
    ) -> List[CollaborationModel]:
        return await self.assignment_repo.list_collaborations_for_issue(issue_id, status)
