from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.routing_service import RoutingService
from app.schemas.routing_schemas import (
    RoutingEvaluationRequest,
    RoutingEvaluationResponse,
    RoutingRuleCreate,
    RoutingRuleUpdate,
    RoutingRuleResponse,
)
from shared.enums import IssueCategory
from shared.responses import APIResponse

router = APIRouter()


@router.post(
    "/routing/evaluate",
    response_model=APIResponse[RoutingEvaluationResponse],
    summary="Evaluate routing engine for an issue",
    description="Maps an issue's category, location, and severity to the responsible government department and field office.",
)
async def evaluate_routing(req: RoutingEvaluationRequest, db: AsyncSession = Depends(get_db)):
    service = RoutingService(db)
    result = await service.evaluate_routing(req)
    return APIResponse(message="Routing evaluated successfully", data=result)


@router.get(
    "/routing/rules",
    response_model=APIResponse[List[RoutingRuleResponse]],
    summary="List all routing rules",
)
async def list_rules(
    category: Optional[IssueCategory] = Query(None),
    district_id: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    service = RoutingService(db)
    rules = await service.list_rules(category=category, district_id=district_id, is_active=is_active)
    data = [
        RoutingRuleResponse(
            id=r.id,
            name=r.name,
            priority_order=r.priority_order,
            category=r.category,
            subcategory=r.subcategory,
            district_id=r.district_id,
            min_severity=r.min_severity,
            max_severity=r.max_severity,
            target_department_id=r.target_department_id,
            target_office_id=r.target_office_id,
            fallback_department_id=r.fallback_department_id,
            conditions=r.conditions or {},
            is_active=r.is_active,
            created_at=r.created_at.isoformat(),
            updated_at=r.updated_at.isoformat(),
        )
        for r in rules
    ]
    return APIResponse(message=f"Retrieved {len(data)} rules", data=data)


@router.post(
    "/routing/rules",
    response_model=APIResponse[RoutingRuleResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new routing rule",
)
async def create_rule(req: RoutingRuleCreate, db: AsyncSession = Depends(get_db)):
    service = RoutingService(db)
    rule = await service.create_rule(req)
    await db.commit()
    await db.refresh(rule)
    res = RoutingRuleResponse(
        id=rule.id,
        name=rule.name,
        priority_order=rule.priority_order,
        category=rule.category,
        subcategory=rule.subcategory,
        district_id=rule.district_id,
        min_severity=rule.min_severity,
        max_severity=rule.max_severity,
        target_department_id=rule.target_department_id,
        target_office_id=rule.target_office_id,
        fallback_department_id=rule.fallback_department_id,
        conditions=rule.conditions or {},
        is_active=rule.is_active,
        created_at=rule.created_at.isoformat(),
        updated_at=rule.updated_at.isoformat(),
    )
    return APIResponse(message="Routing rule created successfully", data=res)


@router.delete(
    "/routing/rules/{rule_id}",
    response_model=APIResponse[bool],
    summary="Delete a routing rule",
)
async def delete_rule(rule_id: str, db: AsyncSession = Depends(get_db)):
    service = RoutingService(db)
    await service.delete_rule(rule_id)
    await db.commit()
    return APIResponse(message="Routing rule deleted successfully", data=True)
