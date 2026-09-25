import sys
from pathlib import Path

# Ensure 'backend' and 'backend/services/routing-service' are in Python path
current_file = Path(__file__).resolve()
routing_service_dir = current_file.parent
backend_dir = routing_service_dir.parent.parent

if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(routing_service_dir) not in sys.path:
    sys.path.insert(0, str(routing_service_dir))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.database import init_db
from app.core.redis import cache_client
from app.api.router import api_router
from shared.exceptions import AppException
from shared.responses import APIErrorResponse, APIResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    await cache_client.connect()
    yield
    # Shutdown
    await cache_client.close()


app = FastAPI(
    title="Societal Innovation Platform - Routing & Workflow Service",
    description="""
    Enterprise Governance Orchestration & Routing Engine for Civic Issue Resolution.

    ### Key Capabilities:
    * **Department & District Mapping**: Administrative hierarchy, office capacity, and jurisdiction resolution.
    * **Intelligent Rule-Based Routing**: Maps issue category, location, and severity to the responsible government department.
    * **8-Stage Workflow State Machine**: `Submitted` -> `Verified` -> `Assigned` -> `Accepted` -> `In Progress` -> `Completed` -> `Citizen Verification` -> `Closed`.
    * **Issue Ownership & Government Allocation**: Accountable public official assignment with SLA monitoring.
    * **Multi-Stakeholder Innovation Matchmaking**:
        * **Universities**: Research opportunities, student capstones, and academic pilots.
        * **Industries**: Corporate Social Responsibility (CSR) funding, tech solutions, and equipment sponsorship.
        * **Volunteers**: NSS, NCC, and local NGOs for grassroots mobilization.
    * **Escalation Engine**: Automated SLA breach detection and hierarchical escalation tracking.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(AppException)
async def handle_app_exception(request: Request, exc: AppException):
    error_payload = APIErrorResponse(
        error_code=exc.error_code,
        message=exc.message,
        details=exc.details,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_payload.model_dump(),
    )


@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    error_payload = APIErrorResponse(
        error_code="VALIDATION_ERROR",
        message="Request payload failed schema validation",
        details=exc.errors(),
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=error_payload.model_dump(),
    )


@app.exception_handler(Exception)
async def handle_generic_exception(request: Request, exc: Exception):
    error_payload = APIErrorResponse(
        error_code="INTERNAL_SERVER_ERROR",
        message=str(exc) if settings.DEBUG else "An unexpected server error occurred.",
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=error_payload.model_dump(),
    )


# Health Check
@app.get("/health", response_model=APIResponse[dict], tags=["System Health"])
async def health_check():
    return APIResponse(
        message="Routing & Workflow Service is operational",
        data={
            "service": settings.SERVICE_NAME,
            "status": "HEALTHY",
            "environment": settings.ENVIRONMENT,
        },
    )


# Mount Versioned API Routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
