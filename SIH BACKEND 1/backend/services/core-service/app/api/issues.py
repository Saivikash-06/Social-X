from fastapi import APIRouter, Depends, status, HTTPException
from app.api.deps import SessionDep, CurrentUser, get_current_active_admin
from app.schemas.issue import IssueCreate, IssueUpdate, IssueResponse, MediaCreate, MediaResponse
from app.services.issue_service import IssueService
from typing import List

router = APIRouter()

@router.post("", response_model=IssueResponse, status_code=status.HTTP_201_CREATED)
async def create_issue(
    issue_in: IssueCreate,
    session: SessionDep,
    current_user: CurrentUser
):
    issue_service = IssueService(session)
    return await issue_service.create_issue(issue_in, current_user)

@router.get("", response_model=List[IssueResponse])
async def read_issues(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100
):
    issue_service = IssueService(session)
    return await issue_service.get_issues(current_user, skip, limit)

@router.get("/{issue_id}", response_model=IssueResponse)
async def read_issue(
    issue_id: str,
    session: SessionDep,
    current_user: CurrentUser
):
    issue_service = IssueService(session)
    return await issue_service.get_issue(issue_id, current_user)

@router.put("/{issue_id}", response_model=IssueResponse)
async def update_issue(
    issue_id: str,
    issue_in: IssueUpdate,
    session: SessionDep,
    current_user: CurrentUser
):
    issue_service = IssueService(session)
    return await issue_service.update_issue(issue_id, issue_in, current_user)

@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_issue(
    issue_id: str,
    session: SessionDep,
    current_user: CurrentUser
):
    issue_service = IssueService(session)
    await issue_service.delete_issue(issue_id, current_user)

@router.post("/{issue_id}/media", response_model=MediaResponse, status_code=status.HTTP_201_CREATED)
async def upload_media_to_issue(
    issue_id: str,
    media_in: MediaCreate,
    session: SessionDep,
    current_user: CurrentUser
):
    # This is a simplified media upload that expects a URL instead of a file.
    # In a real scenario, this would be a multipart/form-data receiving an UploadFile,
    # uploading it to S3, and then storing the URL.
    issue_service = IssueService(session)
    return await issue_service.add_media_to_issue(issue_id, media_in.url, media_in.media_type, current_user)
