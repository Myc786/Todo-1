from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

class BaseIDModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False
    )

def upate_timestamp(mapper, connection, target):
    target.updated_at = datetime.now(timezone.utc)
