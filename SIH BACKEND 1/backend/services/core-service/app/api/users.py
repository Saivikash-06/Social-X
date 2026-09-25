from fastapi import APIRouter, Depends, status
from app.api.deps import SessionDep, CurrentUser, get_current_active_admin
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: CurrentUser):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_in: UserUpdate,
    session: SessionDep,
    current_user: CurrentUser
):
    user_service = UserService(session)
    await user_service.update_user(current_user.id, user_in)
    return await user_service.get_user(current_user.id)

@router.get("", response_model=list[UserResponse], dependencies=[Depends(get_current_active_admin)])
async def read_users(
    session: SessionDep,
    skip: int = 0,
    limit: int = 100
):
    user_service = UserService(session)
    return await user_service.get_users(skip=skip, limit=limit)

@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_active_admin)])
async def read_user_by_id(
    user_id: str,
    session: SessionDep
):
    user_service = UserService(session)
    return await user_service.get_user(user_id)

@router.put("/{user_id}", response_model=UserResponse, dependencies=[Depends(get_current_active_admin)])
async def update_user(
    user_id: str,
    user_in: UserUpdate,
    session: SessionDep
):
    user_service = UserService(session)
    await user_service.update_user(user_id, user_in)
    return await user_service.get_user(user_id)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(get_current_active_admin)])
async def delete_user(
    user_id: str,
    session: SessionDep
):
    user_service = UserService(session)
    await user_service.delete_user(user_id)
