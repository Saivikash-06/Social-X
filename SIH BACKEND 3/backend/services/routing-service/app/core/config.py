from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SERVICE_NAME: str = "routing-service"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"

    # Database Settings
    # Supports PostgreSQL (asyncpg) or falls back gracefully to async SQLite for testing
    DATABASE_URL: str = "sqlite+aiosqlite:///./routing_service.db"
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 10

    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_ENABLED: bool = False  # Set to True when Redis is connected
    CACHE_EXPIRATION_SECONDS: int = 3600

    # SLA Default Hours per Priority
    SLA_HOURS_CRITICAL: int = 12
    SLA_HOURS_HIGH: int = 24
    SLA_HOURS_MEDIUM: int = 72
    SLA_HOURS_LOW: int = 168

    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
