from sqlmodel import Field
from .base import BaseIDModel

class User(BaseIDModel, table=True):
    __tablename__ = "users"

    email: str = Field(unique=True, index=True, nullable=False)
    # Better Auth manages name, image, etc. on the frontend/auth database.
    # We store what we need for local task ownership.
