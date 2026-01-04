from typing import AsyncGenerator
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db import async_session_maker

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session
