from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic_settings import BaseSettings, SettingsConfigDict
from .models.task import Task
from .models.user import User

class Settings(BaseSettings):
    DATABASE_URL: str
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

# Create async engine for Neon PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    future=True
)

# Create session factory
async_session_maker = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

from sqlmodel import SQLModel

async def init_db():
    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
