from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate
from app.schemas.token import Token
from shared.exceptions.custom import UnauthorizedException, BadRequestException
from shared.security.jwt import verify_password, create_access_token, create_refresh_token
from shared.config.settings import settings
from datetime import datetime, timezone, timedelta

class UserService:
    def __init__(self, session: AsyncSession):
        self.repo = UserRepository(session)

    async def register(self, user_in: UserCreate):
        existing_user = await self.repo.get_by_email(user_in.email)
        if existing_user:
            raise BadRequestException("Email already registered")
        return await self.repo.create(user_in)

    async def authenticate(self, form_data: OAuth2PasswordRequestForm) -> Token:
        user = await self.repo.get_by_email(form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise UnauthorizedException("Incorrect email or password")
        if not user.is_active:
            raise BadRequestException("Inactive user")

        access_token = create_access_token(data={"sub": user.id, "role": user.role.value})
        refresh_token = create_refresh_token(data={"sub": user.id})
        
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        await self.repo.store_refresh_token(user.id, refresh_token, expires_at)

        return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

    async def refresh_access_token(self, refresh_token: str) -> Token:
        db_token = await self.repo.get_refresh_token(refresh_token)
        if not db_token or db_token.revoked:
            raise UnauthorizedException("Invalid or expired refresh token")
            
        expires_at = db_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
            
        if expires_at < datetime.now(timezone.utc):
            raise UnauthorizedException("Invalid or expired refresh token")
            
        user = await self.repo.get_by_id(db_token.user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("Invalid user")

        access_token = create_access_token(data={"sub": user.id, "role": user.role.value})
        new_refresh_token = create_refresh_token(data={"sub": user.id})
        
        # Revoke old one and issue new one
        await self.repo.revoke_refresh_token(refresh_token)
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        await self.repo.store_refresh_token(user.id, new_refresh_token, expires_at)
        
        return Token(access_token=access_token, refresh_token=new_refresh_token, token_type="bearer")
        
    async def logout(self, refresh_token: str):
        await self.repo.revoke_refresh_token(refresh_token)

    async def get_user(self, user_id: str):
        return await self.repo.get_by_id(user_id)

    async def get_users(self, skip: int = 0, limit: int = 100):
        return await self.repo.get_all(skip, limit)

    async def update_user(self, user_id: str, user_in) -> bool:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise BadRequestException("User not found")
        await self.repo.update(user, user_in)
        return True

    async def delete_user(self, user_id: str) -> bool:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise BadRequestException("User not found")
        await self.repo.delete(user)
        return True
