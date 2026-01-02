"""Domain exceptions for todo application"""


class TodoError(Exception):
    """Base exception for all todo application errors."""
    pass


class TaskNotFoundError(TodoError):
    """Raised when operation references non-existent task ID."""
    pass


class InvalidDescriptionError(TodoError):
    """Raised when task description fails validation."""
    pass