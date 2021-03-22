from enum import Enum

from pydantic import BaseSettings


class Environment(Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    ENVIRONMENT: Environment = Environment.DEVELOPMENT


class Config:
    case_sensitive = True


settings = Settings()
