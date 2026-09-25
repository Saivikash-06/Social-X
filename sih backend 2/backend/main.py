"""Central unified FastAPI application for SOCIAL-X Civic Operating System."""

import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Ensure workspace root is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
WORKSPACE_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if WORKSPACE_DIR not in sys.path:
    sys.path.insert(0, WORKSPACE_DIR)

from backend.core.config import settings
from backend.core.database import db_manager
from backend.api.auth import router as auth_router
from backend.api.problems import router as problems_router
from backend.api.dashboards import router as dashboards_router

# Import AI microservice routes
try:
    from backend.services.ai_service.app.api.v1.router import api_v1_router as ai_router
except ImportError:
    try:
        from backend.services.ai_service.app.api.v1.endpoints.ocr import router as ocr_router
        from backend.services.ai_service.app.api.v1.endpoints.speech import router as speech_router
        ai_router = None
    except Exception:
        ai_router = None


async def seed_default_users():
    """Seeds baseline registered users across all roles if not present."""
    from backend.core.security import hash_password
    default_users = [
        {"id": "usr-cit-1", "email": "citizen.vikash@example.com", "name": "Vikash (Citizen)", "role": "CITIZEN", "password": "Password123!"},
        {"id": "usr-cit-2", "email": "citizen@test.socialx.org", "name": "Citizen User", "role": "CITIZEN", "password": "Password123!"},
        {"id": "usr-gov-1", "email": "collector@tn.gov.in", "name": "Thiru S. Sivakumar, IAS", "role": "GOVERNMENT", "password": "GovAdminPass2026!"},
        {"id": "usr-gov-2", "email": "government@test.socialx.org", "name": "Government Officer", "role": "GOVERNMENT", "password": "GovAdminPass2026!"},
        {"id": "usr-fac-1", "email": "faculty.kumar@annauniv.edu", "name": "Dr. R. Kumar (Faculty)", "role": "FACULTY", "password": "FacultyPass2026!"},
        {"id": "usr-fac-2", "email": "faculty@test.socialx.org", "name": "Faculty Member", "role": "FACULTY", "password": "FacultyPass2026!"},
        {"id": "usr-stu-1", "email": "student.aarav@annauniv.edu", "name": "Aarav Sharma (Student)", "role": "STUDENT", "password": "StudentPass2026!"},
        {"id": "usr-stu-2", "email": "student@test.socialx.org", "name": "Student Scholar", "role": "STUDENT", "password": "StudentPass2026!"},
        {"id": "usr-ind-1", "email": "csr.lead@tatatrusts.org", "name": "Tata CSR Partner", "role": "INDUSTRY", "password": "IndustryPass2026!"},
        {"id": "usr-ind-2", "email": "industry@test.socialx.org", "name": "Industry Partner", "role": "INDUSTRY", "password": "IndustryPass2026!"},
        {"id": "usr-ngo-1", "email": "director@ruralwater.ngo", "name": "Rural Water NGO Lead", "role": "NGO", "password": "NgoPass2026!"},
        {"id": "usr-ngo-2", "email": "ngo@test.socialx.org", "name": "NGO Leader", "role": "NGO", "password": "NgoPass2026!"},
        {"id": "usr-res-1", "email": "lead@csir-neeri.res.in", "name": "CSIR Lead Scientist", "role": "RESEARCH", "password": "ResearchPass2026!"},
        {"id": "usr-res-2", "email": "research@test.socialx.org", "name": "Research Scientist", "role": "RESEARCH", "password": "ResearchPass2026!"},
        {"id": "usr-adm-1", "email": "owner@socialx.gov.in", "name": "Dr. Vikramaditya Sen (Admin)", "role": "ADMIN", "password": "AdminPass2026!"},
        {"id": "usr-adm-2", "email": "admin@test.socialx.org", "name": "Platform Admin", "role": "ADMIN", "password": "AdminPass2026!"},
    ]
    for u in default_users:
        existing = await db_manager.find_one("users", {"email": u["email"]})
        if not existing:
            await db_manager.insert_one("users", {
                "id": u["id"],
                "email": u["email"],
                "name": u["name"],
                "role": u["role"],
                "hashed_password": hash_password(u["password"]),
                "is_active": True,
                "email_verified": True,
                "created_at": "2026-09-01T00:00:00Z",
                "updated_at": "2026-09-01T00:00:00Z",
            })


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    await db_manager.connect()
    await seed_default_users()
    yield
    await db_manager.disconnect()


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=(
        "Enterprise Civic Operating System unifying Citizens, Students, Faculty, "
        "Industry CSR Partners, Government Agencies, and Platform Administrators."
    ),
    version=settings.SERVICE_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# HTTP Security Headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


# Strict CORS configuration
cors_allow_creds = False if "*" in settings.CORS_ORIGINS else True
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=cors_allow_creds,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    """System information and operational status."""
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "version": settings.SERVICE_VERSION,
        "docs": "/docs",
        "health": "/api/health",
    }


# Health check endpoint
@app.get("/api/health", tags=["System"])
@app.get("/health", tags=["System"])
async def health_check():
    """Real health status check including database connectivity."""
    db_status = await db_manager.check_health()
    return {
        "status": "healthy",
        "service": "social-x-core-gateway",
        "version": settings.SERVICE_VERSION,
        "database": db_status,
    }


# Include business routers
app.include_router(auth_router, prefix=settings.API_PREFIX)
app.include_router(problems_router, prefix=settings.API_PREFIX)
app.include_router(dashboards_router, prefix=settings.API_PREFIX)

# Include AI microservice routes under /api/v1
try:
    from backend.services.ai_service.app.api.v1.endpoints.ocr import router as ocr_router
    from backend.services.ai_service.app.api.v1.endpoints.speech import router as speech_router
    app.include_router(ocr_router, prefix="/api/v1")
    app.include_router(speech_router, prefix="/api/v1")
except Exception:
    # Alternative import path when hyphens exist in folder name
    import importlib
    try:
        ocr_mod = importlib.import_module("backend.services.ai-service.app.api.v1.endpoints.ocr")
        speech_mod = importlib.import_module("backend.services.ai-service.app.api.v1.endpoints.speech")
        app.include_router(ocr_mod.router, prefix="/api/v1")
        app.include_router(speech_mod.router, prefix="/api/v1")
    except Exception as e:
        pass


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
