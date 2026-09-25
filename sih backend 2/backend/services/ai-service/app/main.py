"""Main FastAPI application for AI Service."""

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.shared.schemas.response import ErrorResponse, APIErrorDetail
except ImportError:
    from shared.schemas.response import ErrorResponse, APIErrorDetail

from app.config import settings
from app.api.v1.router import api_v1_router
from app.utils.errors import AIServiceException
from app.utils.logger import logger

app = FastAPI(
    title="Societal Innovation & Smart Governance AI Service",
    description="Enterprise AI Microservice for OCR, Speech-to-Text, Vision Analysis, NLP, Translation, Classification, Priority Detection, and Multi-modal Pipeline Processing.",
    version=settings.SERVICE_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# CORS configuration - safe default without wildcard credentials
cors_allow_creds = False if "*" in settings.CORS_ORIGINS else True
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=cors_allow_creds,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Global Exception Handler for AIServiceException
@app.exception_handler(AIServiceException)
async def ai_service_exception_handler(request: Request, exc: AIServiceException):
    logger.error(f"AIServiceException: {exc.code} - {exc.message} - Path: {request.url.path}")
    err = ErrorResponse(
        error=APIErrorDetail(
            code=exc.code,
            message=exc.message,
            details=exc.details,
        )
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=err.model_dump(),
    )


# Generic Exception Handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled Internal Error at {request.url.path}: {str(exc)}")
    err = ErrorResponse(
        error=APIErrorDetail(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected internal AI service error occurred.",
            details=str(exc) if settings.DEBUG else None,
        )
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=err.model_dump(),
    )


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    return {
        "status": "online",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
        "docs": "/docs",
    }


# Health check endpoints
@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.SERVICE_NAME,
        "version": settings.SERVICE_VERSION,
    }



# Include API v1 routes
app.include_router(api_v1_router, prefix=settings.API_V1_STR)
