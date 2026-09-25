from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.issue_repo import IssueRepository
from app.schemas.issue import IssueCreate, IssueUpdate
from shared.exceptions.custom import NotFoundException, ForbiddenException
from shared.constants.roles import RoleEnum
from app.models.user import User

class IssueService:
    def __init__(self, session: AsyncSession):
        self.repo = IssueRepository(session)

    async def create_issue(self, issue_in: IssueCreate, current_user: User):
        return await self.repo.create(issue_in, current_user.id)

    async def get_issue(self, issue_id: str, current_user: User):
        issue = await self.repo.get_by_id(issue_id)
        if not issue:
            raise NotFoundException("Issue not found")
        
        # Access control
        if current_user.role == RoleEnum.ADMIN:
            return issue
        if current_user.role == RoleEnum.CITIZEN and issue.reporter_id != current_user.id:
            raise ForbiddenException("Not enough permissions")
        if current_user.role in [RoleEnum.GOVERNMENT, RoleEnum.UNIVERSITY, RoleEnum.INDUSTRY] and issue.assignee_id != current_user.id and issue.reporter_id != current_user.id:
             # In a real system, government might see all issues in their department, but for now we simplify
             raise ForbiddenException("Not enough permissions")
             
        return issue

    async def get_issues(self, current_user: User, skip: int = 0, limit: int = 100):
        if current_user.role == RoleEnum.ADMIN:
            return await self.repo.get_all(skip, limit)
        elif current_user.role == RoleEnum.CITIZEN:
            return await self.repo.get_by_reporter(current_user.id, skip, limit)
        else:
            return await self.repo.get_by_assignee(current_user.id, skip, limit)

    async def update_issue(self, issue_id: str, issue_in: IssueUpdate, current_user: User):
        issue = await self.repo.get_by_id(issue_id)
        if not issue:
            raise NotFoundException("Issue not found")
            
        # Role-based update permission
        if current_user.role == RoleEnum.CITIZEN and issue.reporter_id != current_user.id:
            raise ForbiddenException("Not enough permissions")
            
        if current_user.role in [RoleEnum.GOVERNMENT, RoleEnum.UNIVERSITY, RoleEnum.INDUSTRY]:
             if issue.assignee_id != current_user.id:
                 raise ForbiddenException("Not enough permissions to update unassigned issue")
                 
        return await self.repo.update(issue, issue_in)

    async def delete_issue(self, issue_id: str, current_user: User):
        issue = await self.repo.get_by_id(issue_id)
        if not issue:
            raise NotFoundException("Issue not found")
            
        if current_user.role != RoleEnum.ADMIN:
            raise ForbiddenException("Only admins can delete issues")
            
        await self.repo.delete(issue)

    async def add_media_to_issue(self, issue_id: str, url: str, media_type: str, current_user: User):
        # We need to verify if user can add media (reporter or assignee or admin)
        await self.get_issue(issue_id, current_user)
        return await self.repo.add_media(issue_id, url, media_type)
