# Implementation Plan: Phase I – In-Memory Python Console Todo App

**Branch**: `001-console-todo-app` | **Date**: 2026-01-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-console-todo-app/spec.md`

## Summary

Phase I implements a console-based todo application with in-memory storage, demonstrating clean architecture and the Agentic Dev Stack workflow. The application provides 5 core features (add, view, update, delete, and mark tasks as completed) through a command-line interface, following PEP-8 standards and production-quality code practices from the start.

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**: None (stdlib only: dataclasses, typing, argparse or click)
**Storage**: In-memory (list or dict data structure)
**Testing**: pytest (standard Python testing framework)
**Target Platform**: Console/CLI (cross-platform)
**Project Type**: single
**Performance Goals**: Task operations <1 second, view 50 tasks <2 seconds, handle 100+ tasks without degradation
**Constraints**: No files, no database, no persistence, no network calls (strictly in-memory per Phase I constraints)
**Scale/Scope**: Single-user console app, sequential task IDs, max 500 character descriptions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase I Constraints Verification
- ✅ **Console Application Only**: Implementation uses console interface, no GUI or web components
- ✅ **In-Memory Storage**: All task data stored in list/dict, no files or database
- ✅ **No Network Calls**: Application does not make network requests
- ✅ **PEP-8 Compliance**: Will enforce via linting (ruff or black/flake8)
- ✅ **Entry Criteria**: Project initialized with PEP-8 configuration (pyproject.toml or setup.cfg)

### Core Principles Verification
- ✅ **Correctness First**: All operations deterministic, behavior matches spec requirements, explicit validation
- ✅ **Progressive Evolution**: Code structure supports future phases (service layer isolated, clean separation)
- ✅ **Simplicity Before Abstraction**: Minimal abstractions (domain models only), no premature complexity
- ✅ **Clear Separation of Concerns**: Domain → Service → UI layers with explicit contracts
- ✅ **Production Mindset from Phase I**: Logging, error handling, type hints from the start

### Per-Phase Requirements Verification
- ✅ **Clear Architecture Sketch**: Provided in user input (domain → service → ui → in-memory)
- ✅ **Defined Data Models**: Task entity with id, description, completed fields
- ✅ **Explicit Contracts**: Command contracts documented in Phase 1 (contracts/)
- ✅ **Error Handling Strategy**: Comprehensive validation and user feedback messages

### Testing Strategy Compliance
- ✅ **Unit Tests**: Required for service layer business logic (TodoService methods)
- ✅ **Integration Tests**: Required for CLI command execution flows
- ✅ **Manual Validation**: Quickstart.md will be validated before phase completion
- ✅ **Phase Gate Tests**: Exit criteria tests will verify all features work correctly

**CONCLUSION**: All constitution gates passed. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```text
specs/001-console-todo-app/
├── plan.md              # This file (/sp.plan command output)
├── spec.md               # Feature specification (/sp.specify command output)
├── research.md           # Phase 0 output (/sp.plan command)
├── data-model.md         # Phase 1 output (/sp.plan command)
├── quickstart.md         # Phase 1 output (/sp.plan command)
├── contracts/            # Phase 1 output (/sp.plan command)
│   └── cli-contracts.md  # Command interface specifications
├── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
└── checklists/
    └── requirements.md   # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── __init__.py
│   └── task.py           # Task entity (id, title, completed)
├── services/
│   ├── __init__.py
│   └── todo_service.py   # Business logic (add, update, delete, list, complete)
├── ui/
│   ├── __init__.py
│   ├── console.py        # Input/output handling, menus, prompts
│   └── commands.py       # Command parsing and dispatch
├── __init__.py
└── main.py              # Application bootstrap and run loop

tests/
├── __init__.py
├── unit/
│   ├── __init__.py
│   └── test_todo_service.py  # Service layer unit tests
├── integration/
│   ├── __init__.py
│   └── test_console_cli.py    # End-to-end CLI flow tests
└── conftest.py           # pytest fixtures and configuration

pyproject.toml             # Project configuration (UV, linting, testing)
README.md                  # Project documentation (phase-specific)
```

**Structure Decision**: Single project structure with three-layer architecture (domain → service → ui). This aligns with the "Clean Separation of Concerns" principle and supports progressive evolution to Phase II (web) by isolating business logic in the service layer. The domain layer defines entities, services contain business logic, and UI handles console interaction—enabling future addition of web UI without touching core logic.

## Complexity Tracking

> No constitution violations requiring justification. All design choices align with simplicity-first principle.

| Decision | Rationale | Simpler Alternative Considered and Rejected |
|----------|-----------|----------------------------------------|
| Three-layer architecture (domain/service/ui) | Enables progressive evolution to Phase II web while isolating business logic | Single-file script rejected because it creates coupling between UI and business logic, violating "Clear Separation of Concerns" |
| Dataclass for Task entity | Provides type hints, immutability by default, and clean serialization support | Simple dict or namedtuple rejected because dataclasses provide clearer contract and better tooling support for Phase II+ |
| pytest for testing | Standard Python testing framework with fixture support and community best practices | unittest rejected due to more verbose fixture syntax and less modern testing patterns |
| Separate commands.py for parsing | Encapsulates command routing logic, keeps console.py focused on I/O | Inline command parsing rejected because it creates monolithic UI module, harder to test |

---

## Phase 0: Research Decisions

*See [research.md](research.md) for detailed analysis of technical choices.*

### Key Decisions Made

1. **Task Storage: List vs Dict**
   - **Decision**: Use `list[Task]` for storage with sequential integer IDs
   - **Rationale**: Simpler implementation, natural ordering, O(1) append operations, efficient for sequential access patterns in view/list operations
   - **Alternative Considered**: `dict[int, Task]` provides O(1) lookup by ID but complicates ordering and adds complexity without clear performance benefit for this scale (<100 tasks)

2. **Task ID Generation Strategy**
   - **Decision**: Sequential integers starting at 1, generated as `len(tasks) + 1` on each add
   - **Rationale**: Simple, deterministic, no ID reuse concerns (tasks are only deleted, not recycled), aligns with spec requirement FR-002
   - **Alternative Considered**: UUIDs rejected due to complexity and poor console UX (hard to type)

3. **Console Input Mode: Menu vs Command-Based**
   - **Decision**: Command-based with `argparse` for CLI arguments + interactive prompts
   - **Rationale**: Better for automation/scripting, more flexible for batch operations, cleaner command parsing than manual menu logic
   - **Alternative Considered**: Interactive menu (choose option 1, 2, 3...) rejected due to poorer scripting support and repetitive user experience for power users

4. **Description Handling: Truncation vs Full Display**
   - **Decision**: Display full descriptions up to 500 characters, no automatic truncation (but validate on input)
   - **Rationale**: Respects user input, console wrapping handles display naturally
   - **Alternative Considered**: Auto-truncate to N characters rejected because it hides information; better to let user manage length via validation

5. **Error Handling: Exception-Based vs Return-Codes**
   - **Decision**: Domain-specific exceptions (e.g., `TaskNotFoundError`, `InvalidDescriptionError`) raised by service layer, caught and formatted in UI layer
   - **Rationale**: Separation of concerns (service knows what went wrong, UI knows how to display it), enables testing business logic without I/O concerns
   - **Alternative Considered**: Return `(success, result, error)` tuples rejected because exception-based error handling is Pythonic and cleaner

## Phase 1 Design Artifacts

*See these files for detailed design specifications:*
- [data-model.md](data-model.md) - Task entity schema and validation rules
- [contracts/cli-contracts.md](contracts/cli-contracts.md) - Command interface specifications
- [quickstart.md](quickstart.md) - Step-by-step user guide

### Data Model Overview

**Task Entity**:
- `id: int` (unique, sequential, immutable)
- `description: str` (1-500 characters, mutable)
- `completed: bool` (default False, mutable)

**Validation Rules**:
- Description cannot be empty or whitespace-only
- Description length: 1-500 characters
- Task IDs must exist for update/delete/mark operations

### Command Contracts

Five console commands:
1. `add <description>` - Create new task, returns assigned ID
2. `list` - Display all tasks with ID, description, completion status
3. `done <id>` - Mark task as completed
4. `update <id> <description>` - Update task description
5. `delete <id>` - Remove task from list

All commands return clear success messages or descriptive errors.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Input                         │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│   UI Layer (console.py, commands.py)                  │
│   - Command parsing and dispatch                         │
│   - Input validation and prompts                        │
│   - Output formatting and display                       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│   Service Layer (todo_service.py)                       │
│   - Business logic (add, update, delete, list, done)   │
│   - In-memory task list management                       │
│   - Domain-specific exceptions                             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│   Domain Layer (task.py)                               │
│   - Task entity definition (dataclass)                    │
│   - Type hints and validation                            │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│   In-Memory Storage (list[Task])                       │
│   - Ephemeral data, lost on application exit             │
└─────────────────────────────────────────────────────────────┘
```

## Next Steps

After this plan is approved, proceed with:
1. `/sp.tasks` to generate executable task list
2. `/sp.implement` to execute the implementation
3. Validate quickstart.md against running application
4. Verify all exit criteria before Phase II planning

## Exit Criteria (Phase I)

Before proceeding to Phase II:
- ✅ All 5 features working: add, list, update, delete, done
- ✅ In-memory storage confirmed (no files, no database)
- ✅ PEP-8 compliance verified via linting (no errors)
- ✅ Unit tests for service layer (80%+ coverage)
- ✅ Integration tests for CLI flows (all user stories pass)
- ✅ Quickstart.md validated (user can run app end-to-end)
- ✅ Code structure supports Phase II evolution (service layer isolated)
- ✅ Documentation complete (README.md, inline docstrings, type hints)
