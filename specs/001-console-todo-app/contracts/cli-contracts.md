# CLI Contracts: Phase I Console Todo App

**Feature**: 001-console-todo-app
**Date**: 2026-01-01
**Purpose**: Define command interface, input/output formats, and error responses

---

## Command Overview

### Available Commands

| Command | Arguments | Purpose |
|----------|-----------|---------|
| `add <description>` | `description`: task text (1-500 chars) | Create new task |
| `list` | None | Display all tasks |
| `done <id>` | `id`: task number (positive integer) | Mark task as completed |
| `update <id> <description>` | `id`: task number, `description`: new text | Update task description |
| `delete <id>` | `id`: task number | Delete task |
| `help` | None | Display command help |
| `exit` | None | Exit application |

---

## Command Specifications

### 1. Add Task

**Command**: `add <description>`

**Input**:
- `description`: String, 1-500 characters, non-empty and non-whitespace

**Success Output**:
```
✓ Task 1 added: Buy groceries
```

**Error Scenarios**:

| Error | Condition | Output |
|-------|-----------|--------|
| `InvalidDescriptionError` | Empty or whitespace-only description | `✗ Error: Task description cannot be empty` |
| `InvalidDescriptionError` | Description exceeds 500 characters | `✗ Error: Task description exceeds 500 characters (got 501)` |

**Examples**:
```bash
# Success
> add Buy groceries
✓ Task 1 added: Buy groceries

# Success (with quotes for multi-word descriptions)
> add "Buy milk and eggs"
✓ Task 2 added: Buy milk and eggs

# Error - empty description
> add
✗ Error: Task description cannot be empty

# Error - too long
> add [501-character string]
✗ Error: Task description exceeds 500 characters (got 501)
```

---

### 2. List Tasks

**Command**: `list`

**Input**: None

**Success Output (Tasks Present)**:
```
Tasks:
  1. [ ] Buy groceries
  2. [✓] Call mom
  3. [ ] Write code review

3 tasks (1 completed)
```

**Success Output (Empty List)**:
```
No tasks found
```

**Error Scenarios**: None (never errors)

**Examples**:
```bash
# Multiple tasks with mixed status
> list
Tasks:
  1. [ ] Buy groceries
  2. [✓] Call mom
  3. [ ] Write code review

3 tasks (1 completed)

# No tasks
> list
No tasks found
```

---

### 3. Mark Task as Completed

**Command**: `done <id>`

**Input**:
- `id`: Positive integer (1, 2, 3, ...)

**Success Output**:
```
✓ Task 2 marked as completed
```

**Idempotent Output** (Task already completed):
```
✓ Task 2 is already completed
```

**Error Scenarios**:

| Error | Condition | Output |
|-------|-----------|--------|
| `TaskNotFoundError` | Task ID doesn't exist | `✗ Error: Task 5 not found` |
| `TaskNotFoundError` | Invalid task ID (≤0) | `✗ Error: Invalid task ID: 0` |

**Examples**:
```bash
# Success
> done 2
✓ Task 2 marked as completed

# Idempotent (already completed)
> done 2
✓ Task 2 is already completed

# Error - not found
> done 5
✗ Error: Task 5 not found

# Error - invalid ID
> done 0
✗ Error: Invalid task ID: 0
```

---

### 4. Update Task Description

**Command**: `update <id> <description>`

**Input**:
- `id`: Positive integer (existing task ID)
- `description`: String, 1-500 characters, non-empty and non-whitespace

**Success Output**:
```
✓ Task 1 updated: Buy almond milk
```

**Error Scenarios**:

| Error | Condition | Output |
|-------|-----------|--------|
| `TaskNotFoundError` | Task ID doesn't exist | `✗ Error: Task 5 not found` |
| `TaskNotFoundError` | Invalid task ID (≤0) | `✗ Error: Invalid task ID: 0` |
| `InvalidDescriptionError` | Empty or whitespace-only description | `✗ Error: Task description cannot be empty` |
| `InvalidDescriptionError` | Description exceeds 500 characters | `✗ Error: Task description exceeds 500 characters (got 501)` |

**Examples**:
```bash
# Success
> update 1 Buy almond milk
✓ Task 1 updated: Buy almond milk

# Error - task not found
> update 5 Buy groceries
✗ Error: Task 5 not found

# Error - empty description
> update 1
✗ Error: Task description cannot be empty
```

---

### 5. Delete Task

**Command**: `delete <id>`

**Input**:
- `id`: Positive integer (existing task ID)

**Success Output**:
```
✓ Task 2 deleted
```

**Error Scenarios**:

| Error | Condition | Output |
|-------|-----------|--------|
| `TaskNotFoundError` | Task ID doesn't exist | `✗ Error: Task 5 not found` |
| `TaskNotFoundError` | Invalid task ID (≤0) | `✗ Error: Invalid task ID: 0` |

**Examples**:
```bash
# Success
> delete 2
✓ Task 2 deleted

# Error - task not found
> delete 5
✗ Error: Task 5 not found

# Error - invalid ID
> delete 0
✗ Error: Invalid task ID: 0
```

---

### 6. Help

**Command**: `help`

**Input**: None

**Output**:
```
H2 Todo - Console Todo Manager

Commands:
  add <description>     Create a new task
  list                  Display all tasks
  done <id>             Mark task as completed
  update <id> <desc>    Update task description
  delete <id>           Delete a task
  help                  Show this help message
  exit                  Exit application

Examples:
  add Buy groceries
  list
  done 1
  update 1 "Buy almond milk"
  delete 2
```

---

### 7. Exit

**Command**: `exit`

**Input**: None

**Output**:
```
Goodbye!
```

**Behavior**: Application terminates, all in-memory task data is lost.

**Examples**:
```bash
> exit
Goodbye!
```

---

## Unknown Commands

**Input**: Any unrecognized command

**Output**:
```
✗ Error: Unknown command 'foo'. Type 'help' for available commands.
```

**Examples**:
```bash
> foo
✗ Error: Unknown command 'foo'. Type 'help' for available commands.

> addtodo Buy milk
✗ Error: Unknown command 'addtodo'. Type 'help' for available commands.
```

---

## Interactive Mode

### Welcome Message

On application start:
```
H2 Todo - Console Todo Manager
Type 'help' for available commands
```

### Command Prompt

```
>
```

### Command Loop

1. Display prompt (`> `)
2. Read user input line
3. Parse and execute command
4. Display result or error
5. Repeat from step 1 until `exit` command

---

## Input Parsing Rules

### Argument Parsing

1. **Whitespace Separation**: Arguments separated by spaces
2. **Quoted Strings**: Double or single quotes for descriptions with spaces
3. **Trailing Whitespace**: Ignored
4. **Empty Input**: No operation, redisplay prompt

### Examples

```bash
# Simple description (single word)
> add milk
✓ Task 1 added: milk

# Multi-word description (quoted)
> add "Buy milk and eggs"
✓ Task 2 added: Buy milk and eggs

# Multi-word description (unquoted, uses first word only)
> add Buy milk
✓ Task 3 added: Buy

# Multiple spaces (treated as single separator)
> add    milk
✓ Task 4 added: milk
```

---

## Output Formatting Rules

### Success Messages
- Prefix: `✓ ` (check mark + space)
- Format: Action verb + task reference
- Examples:
  - `✓ Task 1 added: Buy groceries`
  - `✓ Task 2 marked as completed`
  - `✓ Task 1 updated: Buy almond milk`
  - `✓ Task 2 deleted`

### Error Messages
- Prefix: `✗ Error:` (cross mark + space + "Error:")
- Format: Descriptive problem statement
- Examples:
  - `✗ Error: Task 5 not found`
  - `✗ Error: Task description cannot be empty`
  - `✗ Error: Invalid task ID: 0`

### Task List Display
- Header: `Tasks:` (or "No tasks found" for empty list)
- Format: `  ID. [status] description`
- Status indicator: `[ ]` for incomplete, `[✓]` for completed
- Footer: `X tasks (Y completed)` (X = total, Y = completed)

### Help Display
- Header: App name + description
- Section: Commands with descriptions
- Examples: Common usage patterns
- All commands aligned in two-column format

---

## Character Encoding

- **Supported**: UTF-8 (supports unicode and special characters)
- **Example**: `add "Buy 🥛 and 🥝"`
- **Display**: Show unicode characters as-is

---

## Performance Requirements

Per spec success criteria:

| Operation | Target | Notes |
|-----------|--------|-------|
| Add task | <1 second | Includes validation |
| List tasks (50) | <2 seconds | Full list display |
| Update/Delete/Done | <1 second | Includes lookup |
| Help command | <1 second | Static text |

---

## Scripting Support

Commands support batch execution via shell pipes:

```bash
# Batch add tasks
echo -e "add Buy groceries\nadd Call mom\nadd Write code" | python -m todo

# Add and immediately list
echo "add Buy groceries" | python -m todo | python -m todo list
```

---

## Testing Checklist

For each command, verify:
- [ ] Correct success output
- [ ] Correct error output for all error scenarios
- [ ] Idempotency where specified (e.g., `done` on already-completed task)
- [ ] Edge cases (empty list, invalid IDs, unicode descriptions)
- [ ] Command parsing with quoted/unquoted arguments
- [ ] Scripting/batch mode support
