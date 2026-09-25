from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.core.redis import redis_service
from app.core.exceptions import register_exception_handlers
from app.core.response import ApiResponse, ResponseMeta
from app.routers import dashboard, analytics, reports, notify, websocket

logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("governance_service")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Analytics and Notification Service...")
    await init_db()
    await redis_service.connect()
    yield
    logger.info("Shutting down Analytics and Notification Service...")
    await redis_service.disconnect()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="""
# AI-Powered Societal Innovation & Smart Governance Platform
### Analytics and Notification Microservice

Provides enterprise-grade:
- **Dashboards**: Multi-stakeholder views for Admin, Government Departments, Universities, Industries (CSR), and Citizens.
- **Analytics**: Real-time cross-dimensional performance metrics, SLA tracking, district health, and category trends.
- **Reports**: On-demand JSON and CSV reporting.
- **Notifications**: Transactional Email dispatch via SMTP and in-app system notifications.
- **Real-Time Updates**: Multi-channel WebSocket stream (`/live`) with Redis Pub/Sub integration.
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
register_exception_handlers(app)

# Health check
@app.get("/health", response_model=ApiResponse[dict], tags=["System Health"])
async def health_check():
    return ApiResponse(
        success=True,
        message="Service is operational",
        data={
            "status": "healthy",
            "redis_connected": redis_service.is_connected,
            "environment": settings.APP_ENV
        },
        meta=ResponseMeta()
    )

# Include routers
app.include_router(dashboard.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(notify.router)
app.include_router(websocket.router)
