from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.collaboration_service import CollaborationService
from app.schemas.collaboration_schemas import (
    CollaborationInviteRequest,
    CollaborationActionRequest,
    AddContributionRequest,
    CollaborationResponse,
)
from shared.enums import CollaborationStatus
from shared.responses import APIResponse

router = APIRouter()


@router.post(
    "/collaborations/invite",
    response_model=APIResponse[CollaborationResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Invite external stakeholder to collaborate",
    description="Invites a University, Industry partner, or Volunteer group to participate in solving an issue.",
)
async def invite_stakeholder(req: CollaborationInviteRequest, db: AsyncSession = Depends(get_db)):
    service = CollaborationService(db)
    collab = await service.invite_stakeholder(req)
    await db.commit()
    await db.refresh(collab)
    res = CollaborationResponse(
        id=collab.id,
        issue_id=collab.issue_id,
        stakeholder_type=collab.stakeholder_type,
        stakeholder_id=collab.stakeholder_id,
        stakeholder_name=collab.stakeholder_name,
        role=collab.role,
        status=collab.status,
        notes=collab.notes,
        contributions=collab.contributions or [],
        created_at=collab.created_at.isoformat(),
        updated_at=collab.updated_at.isoformat(),
    )
    return APIResponse(message=f"Invitation sent to {collab.stakeholder_name}", data=res)


@router.post(
    "/collaborations/{collab_id}/respond",
    response_model=APIResponse[CollaborationResponse],
    summary="Respond to collaboration invitation",
    description="Accept or decline an invitation to collaborate on an issue.",
)
async def respond_invitation(
    collab_id: str, req: CollaborationActionRequest, db: AsyncSession = Depends(get_db)
):
    service = CollaborationService(db)
    collab = await service.respond_invitation(collab_id, req)
    await db.commit()
    await db.refresh(collab)
    res = CollaborationResponse(
        id=collab.id,
        issue_id=collab.issue_id,
        stakeholder_type=collab.stakeholder_type,
        stakeholder_id=collab.stakeholder_id,
        stakeholder_name=collab.stakeholder_name,
        role=collab.role,
        status=collab.status,
        notes=collab.notes,
        contributions=collab.contributions or [],
        created_at=collab.created_at.isoformat(),
        updated_at=collab.updated_at.isoformat(),
    )
    return APIResponse(message=f"Collaboration status updated to {req.action.value}", data=res)


@router.post(
    "/collaborations/{collab_id}/contributions",
    response_model=APIResponse[CollaborationResponse],
    summary="Log contribution or progress update",
    description="Adds funding, technical reports, volunteer hours, or project milestones.",
)
async def add_contribution(
    collab_id: str, req: AddContributionRequest, db: AsyncSession = Depends(get_db)
):
    service = CollaborationService(db)
    collab = await service.add_contribution(collab_id, req)
    await db.commit()
    await db.refresh(collab)
    res = CollaborationResponse(
        id=collab.id,
        issue_id=collab.issue_id,
        stakeholder_type=collab.stakeholder_type,
        stakeholder_id=collab.stakeholder_id,
        stakeholder_name=collab.stakeholder_name,
        role=collab.role,
        status=collab.status,
        notes=collab.notes,
        contributions=collab.contributions or [],
        created_at=collab.created_at.isoformat(),
        updated_at=collab.updated_at.isoformat(),
    )
    return APIResponse(message="Contribution logged successfully", data=res)


@router.get(
    "/collaborations/issue/{issue_id}",
    response_model=APIResponse[List[CollaborationResponse]],
    summary="List all active collaborations for an issue",
)
async def list_collaborations(
    issue_id: str,
    status_filter: Optional[CollaborationStatus] = Query(None, alias="status"),
    db: AsyncSession = Depends(get_db),
):
    service = CollaborationService(db)
    collabs = await service.list_collaborations(issue_id, status=status_filter)
    data = [
        CollaborationResponse(
            id=c.id,
            issue_id=c.issue_id,
            stakeholder_type=c.stakeholder_type,
            stakeholder_id=c.stakeholder_id,
            stakeholder_name=c.stakeholder_name,
            role=c.role,
            status=c.status,
            notes=c.notes,
            contributions=c.contributions or [],
            created_at=c.created_at.isoformat(),
            updated_at=c.updated_at.isoformat(),
        )
        for c in collabs
    ]
    return APIResponse(message=f"Retrieved {len(data)} collaborations", data=data)
