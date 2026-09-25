from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, RefreshToken
from app.schemas.user import UserCreate, UserUpdate
from shared.security.jwt import get_password_hash

class UserRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: str) -> User | None:
        stmt = select(User).where(User.id == user_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user_in: UserCreate) -> User:
        db_user = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            role=user_in.role,
            full_name=user_in.full_name,
            phone_number=user_in.phone_number,
            organization_name=user_in.organization_name,
            department=user_in.department,
        )
        self.session.add(db_user)
        await self.session.commit()
        await self.session.refresh(db_user)
        return db_user

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        stmt = select(User).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user
        
    async def delete(self, user: User) -> None:
        await self.session.delete(user)
        await self.session.commit()

    async def store_refresh_token(self, user_id: str, token: str, expires_at):
        db_token = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
        self.session.add(db_token)
        await self.session.commit()
        
    async def get_refresh_token(self, token: str) -> RefreshToken | None:
        stmt = select(RefreshToken).where(RefreshToken.token == token)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
        
    async def revoke_refresh_token(self, token: str):
        db_token = await self.get_refresh_token(token)
        if db_token:
            db_token.revoked = True
            await self.session.commit()
