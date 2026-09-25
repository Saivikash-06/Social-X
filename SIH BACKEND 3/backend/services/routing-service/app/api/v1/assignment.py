from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.assignment_service import AssignmentService
from app.services.workflow_service import WorkflowService
from app.schemas.assignment_schemas import AssignOwnerRequest, ReassignOwnerRequest
from app.schemas.workflow_schemas import WorkflowResponse
from app.api.v1.workflow import serialize_workflow
from shared.responses import APIResponse

router = APIRouter()


@router.post(
    "/assignment/owner",
    response_model=APIResponse[WorkflowResponse],
    summary="Allocate primary government owner",
    description="Assigns official responsibility for the issue and advances status to 'Assigned'.",
)
async def assign_owner(req: AssignOwnerRequest, db: AsyncSession = Depends(get_db)):
    assignment_service = AssignmentService(db)
    workflow_service = WorkflowService(db)

    await assignment_service.assign_owner(req)
    await db.commit()

    updated = await workflow_service.get_workflow_by_issue_id(req.issue_id)
    return APIResponse(
        message=f"Issue successfully assigned to government official {req.owner_name}.",
        data=serialize_workflow(updated),
    )


@router.post(
    "/assignment/{issue_id}/reassign",
    response_model=APIResponse[WorkflowResponse],
    summary="Reassign government owner with audit justification",
    description="Transfers ownership to another official or department while adjusting workload.",
)
async def reassign_owner(
    issue_id: str, req: ReassignOwnerRequest, db: AsyncSession = Depends(get_db)
):
    assignment_service = AssignmentService(db)
    workflow_service = WorkflowService(db)

    await assignment_service.reassign_owner(issue_id, req)
    await db.commit()

    updated = await workflow_service.get_workflow_by_issue_id(issue_id)
    return APIResponse(
        message=f"Ownership reassigned to {req.new_owner_name}.",
        data=serialize_workflow(updated),
    )
