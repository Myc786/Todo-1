"""Todo service - Business logic and state management"""
from typing import List
from ..domain.task import Task, validate_description, find_by_id
from ..domain.exceptions import TaskNotFoundError


class TodoService:
    """In-memory todo service with CRUD operations."""

    def __init__(self) -> None:
        """Initialize with empty task list."""
        self._tasks: List[Task] = []

    @property
    def tasks(self) -> List[Task]:
        """Read-only view of task list."""
        return list(self._tasks)

    def add(self, description: str) -> Task:
        """Add new task and return it.

        Args:
            description: Task description text

        Returns:
            Created task with assigned ID

        Raises:
            InvalidDescriptionError: If description fails validation
        """
        validate_description(description)
        task_id = len(self._tasks) + 1
        task = Task(id=task_id, description=description)
        self._tasks.append(task)
        return task

    def get_all(self) -> List[Task]:
        """Return all tasks in creation order."""
        return list(self._tasks)

    def update(self, task_id: int, description: str) -> Task:
        """Update task description.

        Args:
            task_id: Task ID to update
            description: New description text

        Returns:
            Updated task

        Raises:
            TaskNotFoundError: If task ID doesn't exist
            InvalidDescriptionError: If description fails validation
        """
        task = find_by_id(self._tasks, task_id)
        validate_description(description)
        task.description = description
        return task

    def mark_done(self, task_id: int) -> Task:
        """Mark task as completed (idempotent).

        Args:
            task_id: Task ID to mark as completed

        Returns:
            Updated task

        Raises:
            TaskNotFoundError: If task ID doesn't exist
        """
        task = find_by_id(self._tasks, task_id)
        task.completed = True
        return task

    def delete(self, task_id: int) -> None:
        """Remove task from list.

        Args:
            task_id: Task ID to delete

        Raises:
            TaskNotFoundError: If task ID doesn't exist
        """
        task = find_by_id(self._tasks, task_id)
        self._tasks.remove(task)
