# Quickstart Guide: Phase I Console Todo App

**Feature**: 001-console-todo-app
**Date**: 2026-01-01
**Purpose**: Step-by-step guide for installing, running, and using the application

---

## Prerequisites

- Python 3.13 or higher
- UV package manager (optional, for faster dependency management)
- Terminal or command-line interface

---

## Installation

### Option 1: Using UV (Recommended)

```bash
# Clone or navigate to project directory
cd H2

# Create virtual environment and install (no external dependencies for Phase I)
uv sync
```

### Option 2: Using pip

```bash
# Clone or navigate to project directory
cd H2

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install (no external dependencies for Phase I)
pip install -e .
```

---

## Running the Application

### Start the App

```bash
# Run as module
python -m src.main

# Or if installed as package
h2-todo
```

### Expected Output

```
H2 Todo - Console Todo Manager
Type 'help' for available commands
>
```

---

## Basic Usage

### Adding Tasks

Create tasks with the `add` command:

```bash
> add Buy groceries
✓ Task 1 added: Buy groceries

> add "Call mom"
✓ Task 2 added: Call mom

> add Write code review
✓ Task 3 added: Write code review
```

### Viewing Tasks

Display all tasks with the `list` command:

```bash
> list
Tasks:
  1. [ ] Buy groceries
  2. [ ] Call mom
  3. [ ] Write code review

3 tasks (0 completed)
```

### Marking Tasks as Completed

Mark tasks done with the `done` command:

```bash
> done 2
✓ Task 2 marked as completed

> list
Tasks:
  1. [ ] Buy groceries
  2. [✓] Call mom
  3. [ ] Write code review

3 tasks (1 completed)
```

### Updating Tasks

Change task descriptions with the `update` command:

```bash
> update 1 "Buy almond milk"
✓ Task 1 updated: Buy almond milk

> list
Tasks:
  1. [ ] Buy almond milk
  2. [✓] Call mom
  3. [ ] Write code review

3 tasks (1 completed)
```

### Deleting Tasks

Remove tasks with the `delete` command:

```bash
> delete 3
✓ Task 3 deleted

> list
Tasks:
  1. [ ] Buy almond milk
  2. [✓] Call mom

2 tasks (1 completed)
```

### Getting Help

Display available commands:

```bash
> help

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

### Exiting

Quit the application:

```bash
> exit
Goodbye!
```

---

## Common Workflows

### Workflow 1: Create and Prioritize

1. Add tasks for today
2. List all tasks to review
3. Mark high-priority tasks as done as you complete them

```bash
> add Review PR #123
✓ Task 1 added: Review PR #123

> add "Deploy to staging"
✓ Task 2 added: Deploy to staging

> add "Write documentation"
✓ Task 3 added: Write documentation

> list
Tasks:
  1. [ ] Review PR #123
  2. [ ] Deploy to staging
  3. [ ] Write documentation

3 tasks (0 completed)

> done 2
✓ Task 2 marked as completed

> list
Tasks:
  1. [ ] Review PR #123
  2. [✓] Deploy to staging
  3. [ ] Write documentation

3 tasks (1 completed)
```

### Workflow 2: Update and Cleanup

1. Create task
2. Update description if plans change
3. Delete when no longer relevant

```bash
> add "Schedule meeting"
✓ Task 1 added: Schedule meeting

> update 1 "Schedule team standup for Friday"
✓ Task 1 updated: Schedule team standup for Friday

> list
Tasks:
  1. [ ] Schedule team standup for Friday

1 tasks (0 completed)

> delete 1
✓ Task 1 deleted

> list
No tasks found
```

---

## Handling Errors

### Task Not Found

```bash
> done 5
✗ Error: Task 5 not found

> update 10 "New description"
✗ Error: Task 10 not found

> delete 3
✗ Error: Task 3 not found
```

### Empty Description

```bash
> add
✗ Error: Task description cannot be empty
```

### Invalid Task ID

```bash
> done 0
✗ Error: Invalid task ID: 0
```

### Unknown Command

```bash
> foo
✗ Error: Unknown command 'foo'. Type 'help' for available commands.
```

---

## Testing Your Installation

### Quick Validation Test

Run these commands to verify the application works:

```bash
# Start application
python -m src.main

# Test adding tasks
> add Test task 1
> add Test task 2

# Test viewing
> list

# Test completion
> done 1
> list

# Test update
> update 2 "Updated test task"
> list

# Test deletion
> delete 2
> list

# Exit
> exit
```

### Expected Output

```
> add Test task 1
✓ Task 1 added: Test task 1

> add Test task 2
✓ Task 2 added: Test task 2

> list
Tasks:
  1. [ ] Test task 1
  2. [ ] Test task 2

2 tasks (0 completed)

> done 1
✓ Task 1 marked as completed

> list
Tasks:
  1. [✓] Test task 1
  2. [ ] Test task 2

2 tasks (1 completed)

> update 2 "Updated test task"
✓ Task 2 updated: Updated test task

> list
Tasks:
  1. [✓] Test task 1
  2. [ ] Updated test task

2 tasks (1 completed)

> delete 2
✓ Task 2 deleted

> list
Tasks:
  1. [✓] Test task 1

1 tasks (1 completed)

> exit
Goodbye!
```

---

## Tips and Best Practices

### Using Quotes for Multi-Word Descriptions

```bash
# Good - quoted
> add "Buy milk, eggs, and bread"

# Works but only uses first word
> add Buy milk, eggs, and bread
✓ Task 1 added: Buy
```

### Tracking Task IDs

Task IDs are sequential and don't reuse after deletion:

```bash
> add Task A
✓ Task 1 added: Task A

> add Task B
✓ Task 2 added: Task B

> delete 1
✓ Task 1 deleted

> add Task C
✓ Task 3 added: Task C  # Note: ID is 3, not 1
```

### Special Characters and Unicode

```bash
> add "Buy 🥛 and 🥝"
✓ Task 1 added: Buy 🥛 and 🥝

> list
Tasks:
  1. [ ] Buy 🥛 and 🥝

1 tasks (0 completed)
```

### Clearing All Tasks

Since there's no "clear all" command, delete tasks individually or restart the application (data is in-memory and lost on exit anyway).

---

## Troubleshooting

### Application Won't Start

**Problem**: `ModuleNotFoundError: No module named 'src'`

**Solution**: Run from project root (H2 directory) and use `python -m src.main` or install as package.

### Commands Not Recognized

**Problem**: Command works in example but not in your terminal

**Solution**: Check for typos, ensure proper spacing, use quotes for multi-word descriptions.

### Virtual Environment Issues

**Problem**: Dependencies not found or wrong Python version

**Solution**:
```bash
# Check Python version
python --version  # Should be 3.13+

# Deactivate and recreate venv
deactivate
rm -rf .venv  # Windows: rmdir /s .venv
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/macOS
pip install -e .
```

---

## Next Steps

Once you've successfully run the quickstart test:

1. Read the full [specification](spec.md) for detailed requirements
2. Review the [implementation plan](plan.md) for architecture
3. Explore the [data model](data-model.md) to understand Task entity
4. Check [CLI contracts](contracts/cli-contracts.md) for all command details

---

## Performance Notes

- **Expected Performance**: All operations complete in <1 second
- **Capacity**: Handles 100+ tasks without degradation
- **Memory**: All data stored in RAM, lost when application exits

---

## Support

For issues or questions:
1. Check error messages (they're descriptive)
2. Review this quickstart guide
3. Run help command: `> help`
4. Refer to specification and implementation plan documents
