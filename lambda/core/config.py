from enum import Enum

from pydantic import AnyHttpUrl, BaseSettings


class Environment(Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"



class Settings(BaseSettings):
    ENVIRONMENT: Environment = Environment.DEVELOPMENT
    BACKEND_CORS_ORIGINS: AnyHttpUrl = "http://localhost"

class Config:
    case_sensitive = True


settings = Settings()
