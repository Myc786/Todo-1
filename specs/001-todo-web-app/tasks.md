---

description: "Task list for Phase II: Todo Full-Stack Web Application"
---

# Tasks: Phase II - Todo Full-Stack Web Application

**Input**: Design documents from `/specs/001-todo-web-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/api-contracts.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing. Following the SDD workflow, this feature transitions the in-memory console app to a full-stack web application.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and directory structure for the monorepo-style split.

- [x] T001 Create `backend/` and `frontend/` directories per implementation plan
- [x] T002 Initialize FastAPI project in `backend/` with SQLModel and async dependencies
- [x] T003 Initialize Next.js 16+ project in `frontend/` with Tailwind CSS and App Router
- [x] T004 [P] Configure shared linting (Ruff for backend, ESLint for frontend)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure including database connectivity and authentication framework.

- [x] T005 Configure Neon PostgreSQL connection in `backend/.env` and `backend/src/db.py`
- [x] T006 Implement async database session dependency in `backend/src/dependencies.py`
- [x] T007 Setup Better Auth library in `frontend/` and configure shared secret with backend
- [x] T008 [P] Implement authentication middleware in `backend/src/middleware/auth.py` to extract `user_id`
- [x] T009 [P] Create base SQLModel metadata and migration setup in `backend/src/models/base.py`

**Checkpoint**: Foundation ready - multi-user authentication and database access are established.

---

## Phase 3: User Story 1 - Secure User Onboarding (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts and sign in securely.

**Independent Test**: Navigate to `/signup`, create a user, verify redirect to `/dashboard`, then sign out and sign in again.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create User model in `backend/src/models/user.py`
- [ ] T011 [US1] Implement signup/signin logic using Better Auth in `frontend/lib/auth.ts`
- [ ] T012 [P] [US1] Create login and signup pages in `frontend/app/(auth)/`
- [ ] T013 [US1] Implement Next.js middleware in `frontend/middleware.ts` for protected route redirection
- [ ] T014 [US1] Add user registration success/error feedback toasts in `frontend/components/auth-feedback.tsx`

**Checkpoint**: User Story 1 is functional. Users can persist identities in Neon PostgreSQL.

---

## Phase 4: User Story 2 - Basic Task Management (Priority: P1)

**Goal**: CRUD operations for tasks scoped to the authenticated user.

**Independent Test**: Add a task, verify it appears in the list, then delete it and verify it's removed from both UI and database.

### Implementation for User Story 2

- [ ] T015 [P] [US2] Create Task model in `backend/src/models/task.py` with `owner_id` foreign key
- [ ] T016 [US2] Implement `POST /api/tasks` and `GET /api/tasks` in `backend/src/api/tasks.py` with ownership filtering
- [ ] T017 [P] [US2] Create `TaskList` and `TaskItem` components in `frontend/components/tasks/`
- [ ] T018 [US2] Implement `useTasks` hook using SWR for optimistic UI in `frontend/lib/hooks/use-tasks.ts`
- [ ] T019 [US2] Create `TaskForm` component in `frontend/components/tasks/task-form.tsx` for task creation
- [ ] T020 [US2] Implement `DELETE /api/tasks/{id}` in `backend/src/api/tasks.py` with ownership check

**Checkpoint**: User Story 2 is functional. Users can manage their private task lists.

---

## Phase 5: User Story 3 - Task Status and Updates (Priority: P2)

**Goal**: Enable marking tasks as complete and updating details.

**Independent Test**: Toggle the completion checkbox and verify the status persists after a page refresh.

### Implementation for User Story 3

- [ ] T021 [US3] Implement `PATCH /api/tasks/{id}` for toggling `is_completed` in `backend/src/api/tasks.py`
- [ ] T022 [US3] Implement `PUT /api/tasks/{id}` for updating task title/description in `backend/src/api/tasks.py`
- [ ] T023 [P] [US3] Add edit mode UI to `TaskItem` in `frontend/components/tasks/task-item.tsx`
- [ ] T024 [US3] Integrate completion toggle with optimistic UI in `frontend/hooks/use-tasks.ts`

**Checkpoint**: All core features from the console app are successfully migrated to the full-stack web app.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design refinements and documentation.

- [ ] T025 [P] Refine responsive layout for mobile in `frontend/app/globals.css` using Tailwind
- [ ] T026 Add error boundary and loading states to `frontend/app/(dashboard)/layout.tsx`
- [ ] T027 [P] Update `specs/001-todo-web-app/quickstart.md` with verified setup steps
- [ ] T028 Perform final validation of all success criteria (SC-001 to SC-005)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must be completed first.
- **Foundational (Phase 2)**: Depends on Phase 1 - Blocks all subsequent work.
- **User Stories**: All depend on Phase 2. US1 should ideally precede US2/US3 to enable authenticated testing.

### Parallel Opportunities

- T010 (User Model) and T012 (Auth Pages) can happen in parallel after Phase 2.
- T015 (Task Model) can happen in parallel with T017 (Task UI) once US1 is stable.
- Polish tasks marked [P] can run any time after the respective stories are implemented.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Setup and Foundation.
2. Implement Auth (US1) to establish user sessions.
3. Implement Basic CRUD (US2) to achieve functional parity with Phase I.
4. **STOP and VALIDATE**: Verify end-to-end task management for multiple users in the web UI.

### Incremental Delivery

1. Each Phase adds a testable layer.
2. User management is delivered first, followed by the core task functionality.
3. Polish and mobile-responsiveness are finalized last.
