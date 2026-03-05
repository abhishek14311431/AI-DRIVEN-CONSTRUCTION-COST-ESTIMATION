from pydantic_settings import BaseSettings
import os
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "Construction AI Cost Estimator"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    SQLALCHEMY_DATABASE_URI: str = DATABASE_URL

    # Reports
    REPORTS_DIR: str = "reports"

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure reports directory exists
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
