from typing import Optional
from sqlmodel import Field, Relationship, SQLModel
from .base import BaseIDModel
from .user import User

class TaskBase(BaseIDModel):
    title: str = Field(index=True)
    description: Optional[str] = Field(default=None)
    is_completed: bool = Field(default=False)
    owner_id: int = Field(foreign_key="users.id", index=True)

class Task(TaskBase, table=True):
    __tablename__ = "tasks"

    owner: User = Relationship()

class TaskCreate(TaskBase):
    # id and timestamps are handled by BaseIDModel/DB
    # owner_id will be injected from the auth session
    id: Optional[int] = None
    created_at: Optional[bool] = None
    updated_at: Optional[bool] = None
    owner_id: Optional[int] = None

class TaskRead(TaskBase):
    pass

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None
