"""Authentication endpoints for SOCIAL-X: register, login, me."""

from fastapi import APIRouter, HTTPException, status, Depends, Response
from backend.core.security import hash_password, verify_password, create_access_token
from backend.core.database import db_manager
from backend.core.rbac import get_current_user
from backend.models.user import (
    UserRegisterRequest,
    UserLoginRequest,
    GoogleLoginRequest,
    UserResponse,
    TokenResponse,
    UserInDB,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register new user account",
)
async def register(payload: UserRegisterRequest, response: Response):
    """Registers a citizen, student, faculty, industry, or government official."""
    email_clean = payload.email.lower().strip()
    existing = await db_manager.find_one("users", {"email": email_clean})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Disallow public registration as ADMIN
    role_normalized = payload.role.upper().strip()
    if role_normalized in ["ADMIN", "SUPERADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative accounts cannot be created via public registration.",
        )

    hashed_pw = hash_password(payload.password)
    new_user = UserInDB(
        email=email_clean,
        name=payload.name.strip(),
        role=role_normalized,
        hashed_password=hashed_pw,
        phone_number=payload.phone_number,
        department=payload.department,
        university=payload.university,
        company_name=payload.company_name,
    )

    user_dict = new_user.model_dump()
    await db_manager.insert_one("users", user_dict)

    # Create JWT token
    token = create_access_token(
        subject=new_user.id,
        email=new_user.email,
        role=new_user.role,
    )

    response.set_cookie(
        key="social_x_session",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=86400 * 7,
        path="/",
    )

    return TokenResponse(
        access_token=token,
        user=UserResponse(**user_dict),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User login with email and password",
)
async def login(payload: UserLoginRequest, response: Response):
    """
    Authenticates user credentials:
    1. Verify that the email exists. If not: 'No account found. Please register first.'
    2. If the email exists, verify the password hash. If incorrect: 'Incorrect password. Please try again.'
    3. Only on successful verification: create JWT/session, store secure HttpOnly cookie.
    """
    email_clean = payload.email.lower().strip()
    user_doc = await db_manager.find_one("users", {"email": email_clean})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found. Please register first.",
        )

    if not verify_password(payload.password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please try again.",
        )

    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact administration.",
        )

    token = create_access_token(
        subject=user_doc["id"],
        email=user_doc["email"],
        role=user_doc["role"],
    )

    # Store secure HttpOnly session cookie
    response.set_cookie(
        key="social_x_session",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=86400 * 7,
        path="/",
    )

    return TokenResponse(
        access_token=token,
        user=UserResponse(**user_doc),
    )


@router.post(
    "/google",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Continue with Google authentication",
)
async def login_with_google(payload: GoogleLoginRequest, response: Response):
    """
    PHASE 4 – GOOGLE SIGN-IN
    Rules:
    1. Authenticate with Google.
    2. Retrieve the Google email.
    3. Check whether this email already exists in the Social-X database.
    4. If it exists:
       Sign in to the existing account.
       Do not create a duplicate account.
    5. If it does not exist:
       Block login.
       Display: 'This Google account is not registered. Please create an account first using the same email address.'
       Never auto-create accounts from Google Sign-In.
    """
    email_clean = payload.email.lower().strip()
    user_doc = await db_manager.find_one("users", {"email": email_clean})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="This Google account is not registered. Please create an account first using the same email address.",
        )

    if not user_doc.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact administration.",
        )

    token = create_access_token(
        subject=user_doc["id"],
        email=user_doc["email"],
        role=user_doc["role"],
    )

    # Store secure HttpOnly session cookie
    response.set_cookie(
        key="social_x_session",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=86400 * 7,
        path="/",
    )

    return TokenResponse(
        access_token=token,
        user=UserResponse(**user_doc),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Returns profile information for the authenticated bearer token."""
    return current_user
