# Research Document: Phase I Console Todo App

**Feature**: 001-console-todo-app
**Date**: 2026-01-01
**Purpose**: Document technical decisions and rationale for architecture, data structures, and implementation approach

---

## Decision 1: Task Storage Data Structure

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: List[Task]** | Sequential list with index-based access | Simple, natural ordering, O(1) append, no key management | O(n) lookup by ID, deletion shifts elements |
| **B: Dict[int, Task]** | Hash map with task ID as key | O(1) lookup by ID, O(1) deletion | Ordering complexity, key management overhead |
| **C: NamedTuple + List** | Immutable tuples in list | Memory efficient, simple | Mutation requires recreation, no clear separation from list |

### Chosen Solution: **Option A - List[Task]**

**Rationale**:
1. **Simplicity**: List is simplest data structure for sequential operations. No key management or ordering logic required.
2. **Natural Ordering**: Tasks naturally appear in creation order, which is expected user experience.
3. **Performance**: At expected scale (100+ tasks per spec SC-005), O(n) lookup is negligible (<1ms for n=100).
4. **ID Management**: Sequential IDs can be generated as `len(tasks) + 1` without maintaining a counter.
5. **Deletion Simplicity**: Element shifting is acceptable for this scale; deleted IDs are not reused.

**Performance Estimate**:
- Add: O(1) - list append
- List All: O(n) - iterate list
- Update/Delete by ID: O(n) - linear search, but n≤100 so <1ms per operation
- **Total**: Meets SC-003 (<1 second per operation) with margin

**Phase II Consideration**:
When transitioning to Phase II (database), list-based approach can be replaced with SQL queries without changing service layer interface. The service layer's `find_by_id()` method abstracts storage details.

---

## Decision 2: Task ID Generation

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Sequential Integers** | 1, 2, 3, ... generated as `len + 1` | Simple, predictable, easy to type in console | Gaps when tasks deleted, no reuse |
| **B: UUID4** | Random UUID string | Guaranteed unique, no coordination | 36 chars, hard to type, poor console UX |
| **C: Timestamp-Based** | Milliseconds since epoch | Time-ordered, unique | Large numbers, collision risk at scale |

### Chosen Solution: **Option A - Sequential Integers**

**Rationale**:
1. **User Experience**: Short, easy to remember and type in console commands (e.g., "done 1" vs "done 550e8400-e29b-41d4-a716-446655440000").
2. **Predictability**: Users can anticipate next ID, which aids in mental model of task list.
3. **Spec Alignment**: FR-002 explicitly requires "unique, sequential identifier".
4. **No Coordination Needed**: Single-user app has no concurrency concerns.
5. **Simple Implementation**: `len(tasks) + 1` suffices; no counter state required.

**Gap Handling**:
- Deleted tasks create gaps (e.g., IDs 1, 2, 4 after deleting task 3).
- This is acceptable: gaps are harmless and actually indicate task history.
- Alternative (reuse deleted IDs) adds complexity without clear benefit.

**Implementation Note**:
```python
def next_id(tasks: List[Task]) -> int:
    return len(tasks) + 1
```

---

## Decision 3: Console Input Mode

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Command-Based with argparse** | `python -m todo add "Buy groceries"` | Scriptable, standardized parsing, help generation | Requires CLI knowledge |
| **B: Interactive Menu** | 1. Add task, 2. List tasks... | No CLI knowledge needed, guided | Repetitive, hard to script, verbose interaction |
| **C: Read-Execute Loop** | REPL-style: `>>> add "Buy groceries"` | Familiar to developers, simple | Requires tooling, harder for non-devs |

### Chosen Solution: **Option A - Command-Based with argparse**

**Rationale**:
1. **Scripting Support**: Commands can be batched in shell scripts or called from other tools.
2. **Standard Tooling**: `argparse` is Python stdlib, well-documented, provides help generation.
3. **Flexibility**: Supports both interactive use (enter commands one by one) and batch mode (pipe commands).
4. **Extensibility**: Easy to add new commands without modifying menu logic.
5. **User Scenarios**: Evaluators (target audience) likely prefer command-line tools over menus.

**Implementation Approach**:
- Use `argparse` for command parsing and validation.
- Interactive mode: Read line, parse, execute, repeat until exit.
- Command set: `add`, `list`, `update`, `delete`, `done`, `help`, `exit`.

**Alternative Rejected**: Interactive menu (Option B) is simpler for non-technical users but violates "scriptability" requirement and creates poor UX for power users (multiple prompts to perform one action).

---

## Decision 4: Task Description Display

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Full Display (Validate on Input)** | Show entire description, limit input to 500 chars | Preserves user intent, simple | Long descriptions may clutter output |
| **B: Truncation** | "This is a long d..." (30 chars) | Clean output, consistent width | Information loss, confusing for users |
| **C: Word Wrap** | Wrap long descriptions across multiple lines | Preserves info, readable | Complex console formatting logic |

### Chosen Solution: **Option A - Full Display with Input Validation**

**Rationale**:
1. **User Intent**: Full display respects user input; truncation or wrapping modifies message.
2. **Console Wrapping**: Modern terminals wrap text automatically; no manual wrapping needed.
3. **Spec Alignment**: SC-006 requires "learn and use all 5 core commands in under 5 minutes"; full display supports this by showing actual task content.
4. **Edge Cases**: Special characters and unicode (spec EC-6) are handled naturally by full display.

**Implementation Details**:
- Input validation: Reject empty, whitespace-only, or >500 character descriptions.
- Output: Display full description as-is, let terminal handle wrapping.
- Exception: If description exceeds terminal width, let terminal wrap (not app responsibility).

**Spec Constraint**: Maximum 500 characters per assumption, enforced at input time.

---

## Decision 5: Error Handling Strategy

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: Domain-Specific Exceptions** | `TaskNotFoundError`, `InvalidDescriptionError` | Clean separation of concerns, Pythonic, testable | Multiple exception classes to maintain |
| **B: Return Tuples** | `(success, result, error)` | Explicit, no exception handling | Noisy call sites, error checking can be forgotten |
| **C: Generic Exceptions** | `ValueError`, `RuntimeError` | Simple, no custom classes | Vague, hard to catch specific errors |

### Chosen Solution: **Option A - Domain-Specific Exceptions**

**Rationale**:
1. **Separation of Concerns**: Service layer knows *what* went wrong (domain logic), UI layer knows *how* to display it (user feedback).
2. **Testability**: Unit tests for service layer can assert specific exception types without I/O concerns.
3. **Pythonic**: Exception-based error handling is standard in Python; return tuples are un-Pythonic (explicit vs implicit).
4. **Type Safety**: IDEs can infer exception types from function signatures; no static analysis for return tuple fields.
5. **Phase II Evolution**: Web API layer can catch these exceptions and return HTTP error codes without changing service logic.

**Exception Hierarchy**:
```python
class TodoError(Exception): pass
class TaskNotFoundError(TodoError): pass
class InvalidDescriptionError(TodoError): pass
```

**Implementation Example**:
```python
# Service layer
def mark_done(task_id: int) -> None:
    task = self._find_by_id(task_id)
    if not task:
        raise TaskNotFoundError(f"Task {task_id} not found")
    task.completed = True

# UI layer
try:
    service.mark_done(task_id)
except TaskNotFoundError as e:
    print(f"Error: {e}")
```

---

## Decision 6: Project Structure and Dependency Management

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: UV + pyproject.toml** | Modern Python package manager, stdlib-only | Fast, simple, modern tooling | UV is newer but widely adopted |
| **B: pip + requirements.txt** | Traditional approach | Universal, well-known | No lockfile, slower, no built-in linting config |
| **C: Poetry** | Full-featured package manager | Dependency management, publishing | Overkill for simple console app, slow |

### Chosen Solution: **Option A - UV + pyproject.toml**

**Rationale**:
1. **Modern Tooling**: UV is 10-100x faster than pip, minimal dependencies, Python-focused.
2. **Stdlib Only**: Phase I requires no external packages; UV + pyproject.toml supports this cleanly.
3. **PEP-8 Enforcement**: pyproject.toml can configure `ruff` for linting without separate setup.
4. **Testing Configuration**: pytest configuration in pyproject.toml (single source of truth).
5. **Phase II Evolution**: Easy to add dependencies (FastAPI, SQLModel) when transitioning to Phase II.

**pyproject.toml Structure**:
```toml
[project]
name = "h2-todo"
version = "0.1.0"
requires-python = ">=3.13"

[tool.ruff]
line-length = 100
target-version = "py313"

[tool.pytest.ini_options]
testpaths = ["tests"]
```

---

## Decision 7: Testing Framework and Strategy

### Options Evaluated

| Option | Description | Pros | Cons |
|--------|-------------|------|------|
| **A: pytest** | Modern testing framework | Fixtures, parametrization, plugins, community best practices | None (industry standard) |
| **B: unittest** | Python stdlib framework | No dependencies | Verbose fixtures, less modern syntax |
| **C: nose2** | pytest alternative | Simple | Less popular, fewer plugins |

### Chosen Solution: **Option A - pytest**

**Rationale**:
1. **Industry Standard**: pytest is de facto standard for Python testing.
2. **Fixtures**: `conftest.py` fixtures simplify test setup (e.g., create empty TodoService instance).
3. **Parametrization**: `@pytest.mark.parametrize` allows testing multiple edge cases concisely.
4. **Readability**: `assert` statements are more readable than `self.assertEqual()`.
5. **Coverage Integration**: `pytest-cov` plugin provides coverage reporting (target: 80%+ per exit criteria).

**Test Strategy**:
- **Unit Tests**: `tests/unit/test_todo_service.py` - Test service layer methods in isolation.
- **Integration Tests**: `tests/integration/test_console_cli.py` - Test CLI command flows end-to-end.
- **Fixtures**: `conftest.py` provides `service` fixture for empty service, `tasks` fixture for populated service.

---

## Summary of Technical Choices

| Decision | Choice | Key Reason |
|----------|--------|------------|
| Storage | `List[Task]` | Simplicity, natural ordering, sufficient for <100 tasks |
| ID Generation | Sequential integers | Predictable, easy to type, matches spec |
| Input Mode | Command-based with argparse | Scriptable, standard tooling, flexible |
| Display | Full description | Preserves user intent, console wraps naturally |
| Error Handling | Domain-specific exceptions | Clean separation of concerns, testable |
| Package Manager | UV + pyproject.toml | Modern, fast, simple configuration |
| Testing | pytest | Industry standard, fixtures, readable |
| Project Structure | Three-layer (domain/service/ui) | Supports Phase II evolution |

---

## Constitutional Compliance Check

All decisions comply with H2 Todo Evolution Project Constitution:

1. **Correctness First**: All operations deterministic, validation explicit, error paths handled.
2. **Progressive Evolution**: Three-layer architecture supports Phase II web without breaking Phase I.
3. **Simplicity Before Abstraction**: Minimal abstractions (dataclasses, simple exceptions), no premature optimization.
4. **Clear Separation of Concerns**: Domain → Service → UI layers with explicit contracts.
5. **Production Mindset from Phase I**: Type hints, error handling, testing from the start.

---

## Next Steps

Proceed to Phase 1 design:
1. Create `data-model.md` - Detailed Task entity schema
2. Create `contracts/cli-contracts.md` - Command interface specifications
3. Create `quickstart.md` - User guide for running application
4. Update agent context with new technology decisions
5. Re-validate Constitution Check post-design
