from typing import Annotated
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError

from shared.database.core import get_db
from shared.config.settings import settings
from shared.exceptions.custom import UnauthorizedException, ForbiddenException
from shared.constants.roles import RoleEnum
from app.models.user import User
from app.schemas.token import TokenPayload
from app.repositories.user_repo import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

SessionDep = Annotated[AsyncSession, Depends(get_db)]

async def get_current_user(
    session: SessionDep,
    token: Annotated[str, Depends(oauth2_scheme)]
) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise UnauthorizedException("Could not validate credentials")
        
    repo = UserRepository(session)
    user = await repo.get_by_id(token_data.sub)
    if not user:
        raise UnauthorizedException("User not found")
    if not user.is_active:
        raise UnauthorizedException("Inactive user")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

def get_current_active_admin(current_user: CurrentUser) -> User:
    if current_user.role != RoleEnum.ADMIN:
        raise ForbiddenException("The user doesn't have enough privileges")
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: list[RoleEnum]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: CurrentUser) -> User:
        if user.role not in self.allowed_roles and user.role != RoleEnum.ADMIN:
            raise ForbiddenException("Operation not permitted")
        return user
