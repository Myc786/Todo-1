# Tasks: Phase I – In-Memory Python Console Todo App

**Input**: Design documents from `/specs/001-console-todo-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure per implementation plan: src/domain/, src/services/, src/ui/, tests/unit/, tests/integration/
- [ ] T002 Initialize Python 3.13+ project with pyproject.toml (using UV or pip)
- [ ] T003 [P] Configure ruff for PEP-8 linting in pyproject.toml (line-length: 100, target-version: py313)
- [ ] T004 [P] Configure pytest in pyproject.toml (testpaths: ["tests"])

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Create domain exceptions hierarchy in src/domain/exceptions.py (TodoError, TaskNotFoundError, InvalidDescriptionError)
- [ ] T006 Create Task entity dataclass in src/domain/task.py with fields: id (int), description (str), completed (bool)
- [ ] T007 Implement validation functions in src/domain/task.py (validate_description, find_by_id)
- [ ] T008 Create TodoService class in src/services/todo_service.py with in-memory task list (List[Task])
- [ ] T009 Implement add() method in TodoService with description validation and sequential ID generation
- [ ] T010 Implement get_all() method in TodoService to return all tasks
- [ ] T011 Implement update() method in TodoService with task lookup and description update
- [ ] T012 Implement mark_done() method in TodoService with idempotent completion logic
- [ ] T013 Implement delete() method in TodoService with task lookup and removal
- [ ] T014 Create command parser in src/ui/commands.py using argparse (add, list, update, delete, done, help, exit commands)
- [ ] T015 Create console I/O handler in src/ui/console.py with display functions and input loop
- [ ] T016 Create main application bootstrap in src/main.py with entry point and run loop
- [ ] T017 Create empty conftest.py in tests/ for pytest fixtures

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable users to add new tasks with descriptions and view all tasks in a list

**Independent Test**: Can be fully tested by starting application, adding 2-3 tasks with different descriptions, and verifying they appear in the task list with correct IDs and descriptions

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Unit test: validate_description() rejects empty strings in tests/unit/test_task.py
- [ ] T019 [P] [US1] Unit test: validate_description() rejects descriptions >500 characters in tests/unit/test_task.py
- [ ] T020 [P] [US1] Unit test: add() method creates task with sequential ID in tests/unit/test_todo_service.py
- [ ] T021 [P] [US1] Unit test: get_all() returns tasks in creation order in tests/unit/test_todo_service.py
- [ ] T022 [P] [US1] Integration test: CLI accepts 'add' command and displays success message in tests/integration/test_console_cli.py
- [ ] T023 [P] [US1] Integration test: CLI 'list' command displays tasks with IDs and descriptions in tests/integration/test_console_cli.py

### Implementation for User Story 1

- [ ] T024 [P] [US1] Validate validate_description() accepts non-empty descriptions 1-500 chars in src/domain/task.py
- [ ] T025 [P] [US1] Validate validate_description() rejects empty/whitespace descriptions in src/domain/task.py
- [ ] T026 [P] [US1] Validate validate_description() rejects >500 char descriptions in src/domain/task.py
- [ ] T027 [US1] Implement add() to generate ID as len(tasks) +1 in src/services/todo_service.py
- [ ] T028 [US1] Implement add() to append Task to internal list in src/services/todo_service.py
- [ ] T029 [US1] Implement add() to return created Task with confirmation in src/services/todo_service.py
- [ ] T030 [US1] Implement get_all() to return copy of task list in src/services/todo_service.py
- [ ] T031 [US1] Implement add command parser in src/ui/commands.py with description argument
- [ ] T032 [US1] Implement list command parser in src/ui/commands.py (no arguments)
- [ ] T033 [US1] Implement display_add_success(task) in src/ui/console.py showing "✓ Task {id} added: {description}"
- [ ] T034 [US1] Implement display_tasks(tasks) in src/ui/console.py showing "ID. [ ] description" format
- [ ] T035 [US1] Implement display_tasks_empty() in src/ui/console.py showing "No tasks found"
- [ ] T036 [US1] Wire add command in src/ui/console.py command loop to call service.add() and display success
- [ ] T037 [US1] Wire list command in src/ui/console.py command loop to call service.get_all() and display tasks
- [ ] T038 [US1] Add display_add_success() output to main run loop in src/main.py
- [ ] T039 [US1] Add display_tasks() output to main run loop in src/main.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Mark Task as Completed (Priority: P2)

**Goal**: Enable users to mark specific tasks as completed with visual indication in task list

**Independent Test**: Can be fully tested by creating multiple tasks, marking one or more as completed, and verifying completion status updates correctly in the task view

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T040 [P] [US2] Unit test: mark_done() sets completed=True in tests/unit/test_todo_service.py
- [ ] T041 [P] [US2] Unit test: mark_done() is idempotent when task already completed in tests/unit/test_todo_service.py
- [ ] T042 [P] [US2] Integration test: CLI 'done <id>' command displays success message in tests/integration/test_console_cli.py
- [ ] T043 [P] [US2] Integration test: CLI list shows [✓] indicator for completed tasks in tests/integration/test_console_cli.py
- [ ] T044 [P] [US2] Integration test: CLI 'done' on already-completed task shows idempotent message in tests/integration/test_console_cli.py

### Implementation for User Story 2

- [ ] T045 [P] [US2] Implement mark_done() to find task by ID in src/services/todo_service.py
- [ ] T046 [US2] Implement mark_done() to set task.completed = True in src/services/todo_service.py
- [ ] T047 [US2] Implement mark_done() to be idempotent (no-op if already completed) in src/services/todo_service.py
- [ ] T048 [US2] Implement mark_done() to return updated Task in src/services/todo_service.py
- [ ] T049 [US2] Implement done command parser in src/ui/commands.py with id argument
- [ ] T050 [US2] Implement display_mark_done_success(task, is_idempotent) in src/ui/console.py
- [ ] T051 [US2] Update display_tasks(tasks) in src/ui/console.py to show [ ] for incomplete, [✓] for completed
- [ ] T052 [US2] Wire done command in src/ui/console.py command loop to call service.mark_done() and display appropriate message
- [ ] T053 [US2] Add task count footer to display_tasks() showing "X tasks (Y completed)" in src/ui/console.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update Task Descriptions (Priority: P3)

**Goal**: Enable users to correct or modify descriptions of existing tasks

**Independent Test**: Can be fully tested by creating a task, changing its description to something different, and verifying update reflects in subsequent views

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T054 [P] [US3] Unit test: update() changes task description in tests/unit/test_todo_service.py
- [ ] T055 [P] [US3] Unit test: update() preserves completed status in tests/unit/test_todo_service.py
- [ ] T056 [P] [US3] Unit test: update() validates new description in tests/unit/test_todo_service.py
- [ ] T057 [P] [US3] Integration test: CLI 'update <id> <desc>' command displays success in tests/integration/test_console_cli.py
- [ ] T058 [P] [US3] Integration test: CLI update preserves completion status in tests/integration/test_console_cli.py

### Implementation for User Story 3

- [ ] T059 [P] [US3] Implement update() to find task by ID in src/services/todo_service.py
- [ ] T060 [US3] Implement update() to validate new description in src/services/todo_service.py
- [ ] T061 [US3] Implement update() to set task.description = new_description in src/services/todo_service.py
- [ ] T062 [US3] Implement update() to preserve task.completed status in src/services/todo_service.py
- [ ] T063 [US3] Implement update() to return updated Task in src/services/todo_service.py
- [ ] T064 [US3] Implement update command parser in src/ui/commands.py with id and description arguments
- [ ] T065 [US3] Implement display_update_success(task) in src/ui/console.py showing "✓ Task {id} updated: {description}"
- [ ] T066 [US3] Wire update command in src/ui/console.py command loop to call service.update() and display success

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

---

## Phase 6: User Story 4 - Delete Tasks (Priority: P4)

**Goal**: Enable users to remove tasks to maintain a clean task list

**Independent Test**: Can be fully tested by creating multiple tasks, deleting one, and verifying it no longer appears in the view command

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [ ] T067 [P] [US4] Unit test: delete() removes task from list in tests/unit/test_todo_service.py
- [ ] T068 [P] [US4] Unit test: delete() raises TaskNotFoundError for non-existent ID in tests/unit/test_todo_service.py
- [ ] T069 [P] [US4] Integration test: CLI 'delete <id>' command displays success message in tests/integration/test_console_cli.py
- [ ] T070 [P] [US4] Integration test: CLI delete removes task from subsequent list commands in tests/integration/test_console_cli.py
- [ ] T071 [P] [US4] Integration test: CLI delete shows error for non-existent task ID in tests/integration/test_console_cli.py

### Implementation for User Story 4

- [ ] T072 [P] [US4] Implement delete() to find task by ID in src/services/todo_service.py
- [ ] T073 [US4] Implement delete() to remove task from internal list in src/services/todo_service.py
- [ ] T074 [P] [US4] Implement delete() to raise TaskNotFoundError if task not found in src/services/todo_service.py
- [ ] T075 [US4] Implement delete command parser in src/ui/commands.py with id argument
- [ ] T076 [US4] Implement display_delete_success(task_id) in src/ui/console.py showing "✓ Task {id} deleted"
- [ ] T077 [US4] Wire delete command in src/ui/console.py command loop to call service.delete() and display success
- [ ] T078 [US4] Wire TaskNotFoundError exception in src/ui/console.py to display "✗ Error: Task {id} not found"

**Checkpoint**: All user stories should now be independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T079 [P] Implement help command display in src/ui/commands.py showing all commands with descriptions
- [ ] T080 [P] Implement exit command in src/ui/commands.py with "Goodbye!" message
- [ ] T081 [P] Implement unknown command error handler in src/ui/console.py showing "✗ Error: Unknown command 'xxx'. Type 'help' for available commands"
- [ ] T082 [P] Implement InvalidDescriptionError handling in src/ui/console.py showing "✗ Error: {message}"
- [ ] T083 [P] Add welcome message "H2 Todo - Console Todo Manager\nType 'help' for available commands" in src/main.py
- [ ] T084 [P] Add docstrings to all public methods in src/domain/task.py and src/services/todo_service.py
- [ ] T085 [P] Add type hints to all functions in src/services/todo_service.py and src/ui/console.py
- [ ] T086 Add inline comments for complex logic in src/services/todo_service.py (if any)
- [ ] T087 Run ruff linting and fix any PEP-8 violations (target: 0 errors)
- [ ] T088 Run pytest and verify all unit tests pass (if tests were implemented)
- [ ] T089 Run pytest and verify all integration tests pass (if tests were implemented)
- [ ] T090 Validate quickstart.md by running through all examples manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses display_tasks() from US1 but display logic can be added separately
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 display but should be independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - May integrate with US1 list view but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Service methods before UI integration
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T002, T003, T004) can run in parallel
- Tests for each user story marked [P] can run in parallel
- Validation functions in US1 (T024, T025, T026) can run in parallel
- Service methods within stories (T045, T048 vs T059, T062) can run in parallel
- Display functions within stories (T033, T034, T035 vs T050, T051 vs T065) can run in parallel
- Different user stories can be worked on in parallel by different team members after Foundational phase

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: T018 - Unit test: validate_description() rejects empty strings
Task: T019 - Unit test: validate_description() rejects descriptions >500 characters
Task: T020 - Unit test: add() method creates task with sequential ID
Task: T021 - Unit test: get_all() returns tasks in creation order

# Launch all validation functions together:
Task: T024 - Validate validate_description() accepts non-empty descriptions
Task: T025 - Validate validate_description() rejects empty/whitespace descriptions
Task: T026 - Validate validate_description() rejects >500 char descriptions

# Launch display functions together:
Task: T033 - Implement display_add_success(task)
Task: T034 - Implement display_tasks(tasks)
Task: T035 - Implement display_tasks_empty()
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Task Count Summary

- **Total Tasks**: 90 tasks
- **Setup (Phase 1)**: 4 tasks
- **Foundational (Phase 2)**: 13 tasks (BLOCKS all user stories)
- **User Story 1 (Phase 3)**: 22 tasks (P1 - MVP)
- **User Story 2 (Phase 4)**: 14 tasks (P2)
- **User Story 3 (Phase 5)**: 13 tasks (P3)
- **User Story 4 (Phase 6)**: 12 tasks (P4)
- **Polish (Phase 7)**: 12 tasks

**Parallelizable Tasks**: 33 tasks marked with [P] can run in parallel
**Test Tasks**: 18 tasks (optional - only if tests explicitly requested)
**Implementation Tasks**: 72 tasks

---

## Suggested MVP Scope

For minimum viable product (MVP), complete:
- Phase 1: Setup (4 tasks)
- Phase 2: Foundational (13 tasks)
- Phase 3: User Story 1 only (22 tasks)

**MVP Total**: 39 tasks

This delivers core functionality: add tasks and view tasks. Users can then provide feedback before implementing remaining stories.
