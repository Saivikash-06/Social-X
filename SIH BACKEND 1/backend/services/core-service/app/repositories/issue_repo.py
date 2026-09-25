from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.issue import Issue, Media
from app.schemas.issue import IssueCreate, IssueUpdate

class IssueRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, issue_in: IssueCreate, reporter_id: str) -> Issue:
        db_issue = Issue(
            title=issue_in.title,
            description=issue_in.description,
            category=issue_in.category,
            severity=issue_in.severity,
            location=issue_in.location,
            reporter_id=reporter_id
        )
        self.session.add(db_issue)
        await self.session.commit()
        await self.session.refresh(db_issue)
        return db_issue

    async def get_by_id(self, issue_id: str) -> Issue | None:
        stmt = select(Issue).options(selectinload(Issue.media)).where(Issue.id == issue_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Issue]:
        stmt = select(Issue).options(selectinload(Issue.media)).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_reporter(self, reporter_id: str, skip: int = 0, limit: int = 100) -> list[Issue]:
        stmt = select(Issue).options(selectinload(Issue.media)).where(Issue.reporter_id == reporter_id).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_by_assignee(self, assignee_id: str, skip: int = 0, limit: int = 100) -> list[Issue]:
        stmt = select(Issue).options(selectinload(Issue.media)).where(Issue.assignee_id == assignee_id).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, issue: Issue, issue_in: IssueUpdate) -> Issue:
        update_data = issue_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(issue, field, value)
        
        self.session.add(issue)
        await self.session.commit()
        await self.session.refresh(issue)
        return issue

    async def delete(self, issue: Issue) -> None:
        await self.session.delete(issue)
        await self.session.commit()

    async def add_media(self, issue_id: str, url: str, media_type: str) -> Media:
        db_media = Media(issue_id=issue_id, url=url, media_type=media_type)
        self.session.add(db_media)
        await self.session.commit()
        await self.session.refresh(db_media)
        return db_media
