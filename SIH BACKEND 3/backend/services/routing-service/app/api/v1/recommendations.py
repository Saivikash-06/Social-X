from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.assignment_service import AssignmentService
from app.schemas.assignment_schemas import (
    GenerateRecommendationsRequest,
    StakeholderRecommendationResponse,
    MultiStakeholderRecommendationsResponse,
)
from shared.enums import StakeholderType
from shared.responses import APIResponse

router = APIRouter()


@router.post(
    "/recommendations/generate",
    response_model=APIResponse[MultiStakeholderRecommendationsResponse],
    summary="Generate multi-stakeholder recommendations",
    description="Matches issue attributes to Universities (R&D), Industries (CSR), and Volunteers (NSS/NCC).",
)
async def generate_recommendations(
    req: GenerateRecommendationsRequest, db: AsyncSession = Depends(get_db)
):
    service = AssignmentService(db)
    recs = await service.generate_recommendations(req)
    await db.commit()

    univs = [
        StakeholderRecommendationResponse(
            id=r.id,
            issue_id=r.issue_id,
            stakeholder_type=r.stakeholder_type,
            entity_name=r.entity_name,
            entity_id=r.entity_id,
            match_score=r.match_score,
            matching_domain=r.matching_domain,
            rationale=r.rationale,
            recommended_role=r.recommended_role,
            contact_email=r.contact_email,
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in recs
        if r.stakeholder_type == StakeholderType.UNIVERSITY
    ]
    inds = [
        StakeholderRecommendationResponse(
            id=r.id,
            issue_id=r.issue_id,
            stakeholder_type=r.stakeholder_type,
            entity_name=r.entity_name,
            entity_id=r.entity_id,
            match_score=r.match_score,
            matching_domain=r.matching_domain,
            rationale=r.rationale,
            recommended_role=r.recommended_role,
            contact_email=r.contact_email,
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in recs
        if r.stakeholder_type == StakeholderType.INDUSTRY
    ]
    vols = [
        StakeholderRecommendationResponse(
            id=r.id,
            issue_id=r.issue_id,
            stakeholder_type=r.stakeholder_type,
            entity_name=r.entity_name,
            entity_id=r.entity_id,
            match_score=r.match_score,
            matching_domain=r.matching_domain,
            rationale=r.rationale,
            recommended_role=r.recommended_role,
            contact_email=r.contact_email,
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in recs
        if r.stakeholder_type == StakeholderType.VOLUNTEER
    ]

    payload = MultiStakeholderRecommendationsResponse(
        issue_id=req.issue_id,
        university_recommendations=univs,
        industry_recommendations=inds,
        volunteer_recommendations=vols,
    )
    return APIResponse(
        message=f"Generated {len(univs)} university, {len(inds)} industry, and {len(vols)} volunteer recommendations",
        data=payload,
    )


@router.get(
    "/recommendations/{issue_id}",
    response_model=APIResponse[MultiStakeholderRecommendationsResponse],
    summary="Get existing recommendations for an issue",
)
async def get_recommendations(issue_id: str, db: AsyncSession = Depends(get_db)):
    service = AssignmentService(db)
    recs = await service.get_recommendations(issue_id)

    univs = [
        StakeholderRecommendationResponse(
            id=r.id,
            issue_id=r.issue_id,
            stakeholder_type=r.stakeholder_type,
            entity_name=r.entity_name,
            entity_id=r.entity_id,
            match_score=r.match_score,
            matching_domain=r.matching_domain,
            rationale=r.rationale,
            recommended_role=r.recommended_role,
            contact_email=r.contact_email,
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in recs
        if r.stakeholder_type == StakeholderType.UNIVERSITY
    ]
    inds = [
        StakeholderRecommendationResponse(
            id=r.id,
            issue_id=r.issue_id,
            stakeholder_type=r.stakeholder_type,
            entity_name=r.entity_name,
            entity_id=r.entity_id,
            match_score=r.match_score,
            matching_domain=r.matching_domain,
            rationale=r.rationale,
            recommended_role=r.recommended_role,
            contact_email=r.contact_email,
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in recs
        if r.stakeholder_type == StakeholderType.INDUSTRY
    ]
    vols = [
        StakeholderRecommendationResponse(
            id=r.id,
            issue_id=r.issue_id,
            stakeholder_type=r.stakeholder_type,
            entity_name=r.entity_name,
            entity_id=r.entity_id,
            match_score=r.match_score,
            matching_domain=r.matching_domain,
            rationale=r.rationale,
            recommended_role=r.recommended_role,
            contact_email=r.contact_email,
            status=r.status,
            created_at=r.created_at.isoformat(),
        )
        for r in recs
        if r.stakeholder_type == StakeholderType.VOLUNTEER
    ]

    payload = MultiStakeholderRecommendationsResponse(
        issue_id=issue_id,
        university_recommendations=univs,
        industry_recommendations=inds,
        volunteer_recommendations=vols,
    )
    return APIResponse(message="Recommendations retrieved", data=payload)
