"""Configuration settings for AI Service."""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SERVICE_NAME: str = "ai-service"
    SERVICE_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8001

    # CORS
    CORS_ORIGINS: List[str] = ["*"]

    # Model parameters
    OCR_ENGINE: str = "paddleocr"
    WHISPER_MODEL_SIZE: str = "base"
    CONFIDENCE_VERIFICATION_THRESHOLD: float = 0.70
    MAX_IMAGE_SIZE_MB: int = 15
    MAX_AUDIO_SIZE_MB: int = 25

    # Supported audio formats
    ALLOWED_AUDIO_EXTENSIONS: List[str] = [".wav", ".mp3", ".m4a", ".ogg", ".webm", ".flac"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".bmp", ".webp"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="allow",
    )


settings = Settings()
