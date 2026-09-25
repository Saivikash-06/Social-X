"""Configuration settings for SOCIAL-X Central Core Gateway."""

from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SOCIAL-X Civic Operating System"
    SERVICE_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DEBUG: bool = False

    # Server settings
    HOST: str = "127.0.0.1"
    PORT: int = 8002

    # Security & JWT
    SECRET_KEY: str = "social-x-enterprise-civic-security-key-production-change-in-env"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database settings
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "social_x_db"

    # CORS configuration - strict trusted frontend origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    # External service configurations
    FIREBASE_PROJECT_ID: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
