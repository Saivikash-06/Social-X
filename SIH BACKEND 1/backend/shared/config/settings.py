import os
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
db_path = os.path.join(BASE_DIR, "societal.db").replace("\\", "/")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Societal Innovation Platform"
    API_V1_STR: str = "/api/v1"
    
    # Use SQLite for local development since Docker is not available
    DATABASE_URL: str = f"sqlite+aiosqlite:///{db_path}"
    
    SECRET_KEY: str = "supersecretkey_please_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
