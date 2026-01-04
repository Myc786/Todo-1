from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from src.dependencies import get_session
from src.middleware.auth import get_current_user_id
from src.models.task import Task, TaskCreate, TaskRead, TaskUpdate
from src.models.user import User

router = APIRouter(tags=["tasks"])

@router.get("/tasks", response_model=List[TaskRead])
async def list_tasks(
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user_id)
):
    # Depending on how User model id is stored (int or str)
    # The middleware returns str, User model uses int (BaseIDModel)
    # We may need conversion or User model adjustment.
    # For now, assuming current_user_id can be cast to int if needed,
    # or updating User model to use str/UUID is better.
    # BaseIDModel uses int.
    statement = select(Task).where(Task.owner_id == int(current_user_id))
    result = await session.execute(statement)
    tasks = result.scalars().all()
    return tasks

@router.post("/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user_id)
):
    # First, ensure the user exists (for development/testing purposes)
    user_id = int(current_user_id)
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        # Create a default user if it doesn't exist (for development purposes)
        new_user = User(
            id=user_id,
            email=f"user{user_id}@example.com"
        )
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)

    # Create task with the input data and owner_id
    db_task = Task(
        title=task_in.title,
        description=task_in.description,
        is_completed=task_in.is_completed,
        owner_id=user_id
        # created_at and updated_at will be set automatically by the model
    )
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if db_task.owner_id != int(current_user_id):
        raise HTTPException(status_code=403, detail="Forbidden: Not the owner")

    await session.delete(db_task)
    await session.commit()


@router.patch("/tasks/{task_id}", response_model=TaskRead)
async def update_task_status(
    task_id: int,
    task_update: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if db_task.owner_id != int(current_user_id):
        raise HTTPException(status_code=403, detail="Forbidden: Not the owner")

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task


@router.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    session: AsyncSession = Depends(get_session),
    current_user_id: str = Depends(get_current_user_id)
):
    statement = select(Task).where(Task.id == task_id)
    result = await session.execute(statement)
    db_task = result.scalar_one_or_none()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if db_task.owner_id != int(current_user_id):
        raise HTTPException(status_code=403, detail="Forbidden: Not the owner")

    task_data = task_update.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task
