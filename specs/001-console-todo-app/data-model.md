# Data Model: Phase I Console Todo App

**Feature**: 001-console-todo-app
**Date**: 2026-01-01
**Purpose**: Define Task entity schema, validation rules, and state transitions

---

## Task Entity

### Definition

```python
from dataclasses import dataclass

@dataclass
class Task:
    """Represents a todo item with unique identifier, description, and completion status."""

    id: int                # Unique, sequential identifier (immutable after creation)
    description: str        # Task description, 1-500 characters (mutable)
    completed: bool = False  # Completion status (mutable)
```

### Attributes

| Attribute | Type | Mutability | Description |
|-----------|------|-------------|-------------|
| `id` | `int` | Immutable | Unique sequential identifier starting at 1, assigned on creation |
| `description` | `str` | Mutable | Task description text, 1-500 characters, cannot be empty or whitespace |
| `completed` | `bool` | Mutable | Task completion status, defaults to False (incomplete) |

---

## Validation Rules

### Description Validation

**Rule 1: Non-Empty**
- Description cannot be empty string ("")
- Description cannot be whitespace-only ("   ", "\t", "\n")

**Rule 2: Length Constraints**
- Minimum: 1 character
- Maximum: 500 characters

**Rule 3: Content Validation**
- Unicode and special characters are allowed
- No content filtering or sanitization required

**Implementation**:
```python
def validate_description(description: str) -> None:
    """Validate task description meets requirements."""
    if not description or not description.strip():
        raise InvalidDescriptionError("Task description cannot be empty")
    if len(description) > 500:
        raise InvalidDescriptionError(f"Task description exceeds 500 characters (got {len(description)})")
```

### Task ID Validation

**Rule 1: Existence Check**
- Task ID must exist in task list for operations (update, delete, mark done)

**Rule 2: Type Check**
- Task ID must be a positive integer

**Implementation**:
```python
def find_by_id(tasks: List[Task], task_id: int) -> Task:
    """Find task by ID, raise exception if not found."""
    if task_id < 1:
        raise TaskNotFoundError(f"Invalid task ID: {task_id}")
    for task in tasks:
        if task.id == task_id:
            return task
    raise TaskNotFoundError(f"Task {task_id} not found")
```

---

## State Transitions

### Task Lifecycle

```
[Not Created]
      │
      ▼ add(description)
[Incomplete] (completed=False)
      │
      ├─────────────┬─────────────────┐
      ▼             ▼                 ▼
  done(id)     update(id, desc)   delete(id)
      │             │                 │
      ▼             ▼                 ▼
[Completed]   [Incomplete]      [Deleted]
(completed=True)
```

### State Transition Table

| From State | Operation | To State | Validation |
|------------|------------|-----------|--------------|
| Not Created | `add(description)` | Incomplete | Description non-empty, 1-500 chars |
| Incomplete | `done(id)` | Completed | ID exists |
| Incomplete | `update(id, description)` | Incomplete | ID exists, description valid |
| Completed | `done(id)` | Completed (no-op) | ID exists, idempotent |
| Completed | `update(id, description)` | Completed | ID exists, description valid, status preserved |
| Incomplete/Completed | `delete(id)` | Deleted | ID exists |
| Deleted | Any operation | Error | ID not found |

---

## Task List Collection

### Definition

```python
from typing import List

class TaskList:
    """In-memory collection of tasks with business operations."""

    def __init__(self) -> None:
        self._tasks: List[Task] = []

    @property
    def tasks(self) -> List[Task]:
        """Read-only view of task list."""
        return list(self._tasks)

    def add(self, description: str) -> Task:
        """Add new task and return it."""
        validate_description(description)
        task_id = len(self._tasks) + 1
        task = Task(id=task_id, description=description)
        self._tasks.append(task)
        return task

    def get_all(self) -> List[Task]:
        """Return all tasks in creation order."""
        return list(self._tasks)

    def update(self, task_id: int, description: str) -> Task:
        """Update task description."""
        task = find_by_id(self._tasks, task_id)
        validate_description(description)
        task.description = description
        return task

    def mark_done(self, task_id: int) -> Task:
        """Mark task as completed."""
        task = find_by_id(self._tasks, task_id)
        task.completed = True
        return task

    def delete(self, task_id: int) -> None:
        """Remove task from list."""
        task = find_by_id(self._tasks, task_id)
        self._tasks.remove(task)
```

### Invariants

1. **ID Uniqueness**: No two tasks have the same ID
2. **Sequential IDs**: IDs are 1, 2, 3, ... without gaps (until deletion)
3. **Creation Order**: `tasks[i].id < tasks[j].id` if `i < j`
4. **Non-Empty Descriptions**: All tasks have non-empty descriptions ≤500 chars

---

## Exception Hierarchy

```python
class TodoError(Exception):
    """Base exception for all todo application errors."""
    pass

class TaskNotFoundError(TodoError):
    """Raised when operation references non-existent task ID."""
    pass

class InvalidDescriptionError(TodoError):
    """Raised when task description fails validation."""
    pass
```

### Exception Usage by Operation

| Operation | Exceptions Raised | When |
|------------|-------------------|------|
| `add(description)` | `InvalidDescriptionError` | Empty, whitespace-only, or >500 char description |
| `get_all()` | None | Never (always returns list, possibly empty) |
| `update(id, description)` | `TaskNotFoundError`, `InvalidDescriptionError` | ID not found, description invalid |
| `mark_done(id)` | `TaskNotFoundError` | ID not found |
| `delete(id)` | `TaskNotFoundError` | ID not found |

---

## Data Flow Diagram

```
User Input (Console)
        │
        ▼
┌─────────────────────┐
│  Input Validation   │  ← Check description length, emptiness
│  (UI Layer)       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Business Logic    │  ← Find task, validate operations
│  (Service Layer)   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Domain Operations  │  ← Create/modify Task instances
│  (Domain Layer)     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  In-Memory Store   │  ← List[Task] in memory
│  (List[Task])       │
└─────────────────────┘
```

---

## Phase II Evolution Notes

When transitioning to Phase II (web + database):

1. **Task Entity**: Remains same, add ORM annotations (SQLModel)
2. **ID Generation**: Database auto-increment replaces `len(tasks) + 1`
3. **Validation**: Move to domain model or use ORM constraints
4. **Operations**: Service layer interface unchanged, storage backend swaps
5. **Exceptions**: Keep domain exceptions, map to HTTP errors in API layer

Example Phase II Task entity:
```python
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    description: str = Field(min_length=1, max_length=500)
    completed: bool = False
```

---

## Edge Cases and Validation

### Edge Case 1: Empty Task List
- **Scenario**: User runs `list` with no tasks
- **Expected**: Display "No tasks found" message (not error)

### Edge Case 2: Task with Special Characters
- **Scenario**: Description contains unicode, emojis, or symbols
- **Expected**: Accepted and displayed as-is

### Edge Case 3: Delete Non-Existent Task
- **Scenario**: User deletes ID that doesn't exist
- **Expected**: Raise `TaskNotFoundError`, UI displays error message

### Edge Case 4: Mark Completed Twice
- **Scenario**: User marks already-completed task as done again
- **Expected**: Idempotent operation, confirm "Task 1 is already completed"

### Edge Case 5: 500 Character Description
- **Scenario**: User enters exactly 500 characters
- **Expected**: Accepted and stored

### Edge Case 6: 501 Character Description
- **Scenario**: User enters 501 characters
- **Expected**: Raise `InvalidDescriptionError`, UI displays error

---

## Summary

**Task Entity**: Simple dataclass with 3 fields (id, description, completed)
**Storage**: In-memory `List[Task]` with sequential IDs
**Validation**: Non-empty descriptions, 1-500 chars, ID existence checks
**Exceptions**: `TaskNotFoundError`, `InvalidDescriptionError` with clear messages
**State Transitions**: Simple lifecycle (Not Created → Incomplete → Completed/Deleted)
**Phase II Ready**: Entity structure supports ORM annotations without schema changes
