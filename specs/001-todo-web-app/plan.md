# Implementation Plan: Phase II - Todo Full-Stack Web Application

**Branch**: `001-todo-web-app` | **Date**: 2026-01-02 | **Spec**: [specs/001-todo-web-app/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-todo-web-app/spec.md`

## Summary

The objective of Phase II is to transition from an in-memory console application to a full-stack web application. The technical approach involves building a **FastAPI** backend with **SQLModel** for ORM persistence via **Neon PostgreSQL**, and a **Next.js 16+** frontend using **Tailwind CSS**. Authentication will be handled by **Better Auth** to ensure multi-user isolation and secure access to tasks.

## Technical Context

**Language/Version**: Python 3.10+, Node.js 20+
**Primary Dependencies**: FastAPI, SQLModel, Next.js, Tailwind CSS, Better Auth
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (backend), Vitest/Playwright (frontend)
**Target Platform**: Web (Modern Browsers)
**Project Type**: web (frontend + backend)
**Performance Goals**: <500ms initial load, <200ms API response time
**Constraints**: No third-party UI frameworks beyond Next.js & Tailwind; strictly multi-user data isolation.
**Scale/Scope**: Initial deployment for test users, scalable to 10k+ users via serverless infrastructure.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Correctness First**: All web features (CRUD) are mapped from Phase I and explicitly tested.
- [x] **Progressive Evolution**: Phase II introduces web interfaces without deleting the Phase I CLI logic (which can be adapted to call the API or stay isolated).
- [x] **Clear Separation of Concerns**: Frontend and Backend are decoupled with RESTful contracts.
- [x] **Production Mindset**: Neon DB, SQLModel, and Better Auth are production-grade choices.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-web-app/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
├── checklists/          # Quality validation checklists
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/                # FastAPI Application
├── src/
│   ├── models/         # SQLModel entities (Task, User)
│   ├── api/            # Router endpoints
│   ├── services/       # Business logic / domain services
│   └── main.py         # App entry point
└── tests/
    ├── integration/    # API endpoint tests
    └── unit/           # Business logic tests

frontend/               # Next.js Application
├── app/                # App Router (Pages: /, /login, /signup, /dashboard)
├── components/         # Shared UI: TaskList, TaskItem, Navbar
├── lib/                # Better Auth client, API fetchers
└── tests/              # Frontend unit and E2E tests
```

**Structure Decision**: Multi-directory Layout. The project is split into `backend/` and `frontend/` to support the different runtimes (Python and Node.js) and allow independent scaling and deployment.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multi-directory split | Separate runtimes (Python/Node) required for FastAPI and Next.js. | Next.js API Routes alone would sacrifice Python's robust business logic ecosystem. |
| Serverless PostgreSQL | Need for persistent, multi-user storage. | Local SQLite doesn't scale to web/cloud deployment requirements. |
