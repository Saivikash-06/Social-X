from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.api.deps import SessionDep, CurrentUser
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import Token, RefreshTokenRequest
from app.services.user_service import UserService

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, session: SessionDep):
    user_service = UserService(session)
    return await user_service.register(user_in)

@router.post("/login", response_model=Token)
async def login(
    session: SessionDep,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    user_service = UserService(session)
    return await user_service.authenticate(form_data)

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshTokenRequest,
    session: SessionDep
):
    user_service = UserService(session)
    return await user_service.refresh_access_token(request.refresh_token)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: RefreshTokenRequest,
    session: SessionDep,
    current_user: CurrentUser
):
    user_service = UserService(session)
    await user_service.logout(request.refresh_token)
