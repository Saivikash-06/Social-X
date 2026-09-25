"""Role-Based Access Control (RBAC) dependencies and security guards."""

from typing import List, Optional, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.core.security import decode_access_token
from backend.core.database import db_manager
from backend.models.user import UserResponse

security_scheme = HTTPBearer(auto_error=False)

# Normalize role synonyms across civic enums and role tags
ROLE_ALIASES = {
    "CITIZEN": ["CITIZEN"],
    "STUDENT": ["STUDENT", "STUDENT_INNOVATOR"],
    "FACULTY": ["FACULTY", "UNIVERSITY_RESEARCHER"],
    "INDUSTRY": ["INDUSTRY", "INDUSTRY_CSR_PARTNER", "TECH_STARTUP"],
    "GOVERNMENT": ["GOVERNMENT", "GOVERNMENT_OFFICIAL"],
    "ADMIN": ["ADMIN", "SUPERADMIN"],
}


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
) -> UserResponse:
    """Validates bearer token and returns authenticated user."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or malformed.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid, expired, or tampered token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    user_doc = await db_manager.find_one("users", {"id": user_id})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account no longer exists.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated.",
        )

    return UserResponse(**user_doc)


def require_role(*allowed_roles: str) -> Callable:
    """Dependency factory requiring user to hold at least one of the specified roles."""
    # Expand aliases (e.g. "STUDENT" -> ["STUDENT", "STUDENT_INNOVATOR"])
    expanded_allowed = set()
    for r in allowed_roles:
        r_upper = r.upper()
        expanded_allowed.add(r_upper)
        for canonical, aliases in ROLE_ALIASES.items():
            if r_upper == canonical or r_upper in aliases:
                expanded_allowed.update(aliases)
                expanded_allowed.add(canonical)

    async def role_checker(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
        user_role = current_user.role.upper()
        # ADMIN has universal access
        if user_role in ROLE_ALIASES["ADMIN"]:
            return current_user

        if user_role not in expanded_allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Role '{current_user.role}' is not authorized to access this resource.",
            )
        return current_user

    return role_checker
