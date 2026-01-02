"""Task entity and validation logic"""
from dataclasses import dataclass
from typing import List
from .exceptions import InvalidDescriptionError, TaskNotFoundError


@dataclass
class Task:
    """Represents a todo item with unique identifier, description and completion status."""

    id: int                # Unique, sequential identifier (immutable after creation)
    description: str        # Task description, 1-500 characters (mutable)
    completed: bool = False  # Completion status (mutable)


def validate_description(description: str) -> None:
    """Validate task description meets requirements.

    Raises:
        InvalidDescriptionError: If description is empty or exceeds 500 characters
    """
    if not description or not description.strip():
        raise InvalidDescriptionError("Task description cannot be empty")
    if len(description) > 500:
        raise InvalidDescriptionError(
            f"Task description exceeds 500 characters (got {len(description)})"
        )


def find_by_id(tasks: List[Task], task_id: int) -> Task:
    """Find task by ID in task list.

    Args:
        tasks: List of tasks to search
        task_id: Task ID to find

    Returns:
        Task with matching ID

    Raises:
        TaskNotFoundError: If task ID doesn't exist or is invalid
    """
    if task_id < 1:
        raise TaskNotFoundError(f"Invalid task ID: {task_id}")

    for task in tasks:
        if task.id == task_id:
            return task

    raise TaskNotFoundError(f"Task {task_id} not found")
