from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class BaseIDModel(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False
    )

def upate_timestamp(mapper, connection, target):
    target.updated_at = datetime.utcnow()
