# Research: Phase II - Todo Full-Stack Web Application

**Created**: 2026-01-02
**Feature**: Phase II: Todo Full-Stack Web Application

## Overview

The goal of Phase II is to transform the existing in-memory console application into a modern, multi-user full-stack web application. This involves introducing persistent storage, a RESTful API, and a responsive web interface.

## Research Findings

### Decision: Technology Stack Alignment
**Rationale**:
- **Next.js 16+** (App Router) provides a modern, SEO-friendly, and efficient frontend framework with built-in routing and server actions.
- **FastAPI** is chosen for the backend due to its high performance, ease of use, and native support for asynchronous programming and type hints.
- **SQLModel** acts as a bridge between FastAPI and SQLAlchemy, providing a clean way to define both database models and API schemas.
- **Neon Serverless PostgreSQL** offers a cloud-native, scalable database with branching support, which aligns with the "Serverless" and "Progressive Evolution" principles.
- **Better Auth** provides a robust, developer-friendly authentication solution that integrates seamlessly with Next.js.

### Decision: API Data Flow (Ownership Validation)
**Rationale**: In a multi-user environment, data isolation is critical. Every API request must be scoped to the authenticated user.
- The `user_id` should be extracted from the secure session/token handled by Better Auth.
- The backend (FastAPI) will enforce ownership by adding `WHERE user_id = :current_user` to all SQL queries.

### Decision: Multi-Project Structure
**Rationale**: To maintain clear separation of concerns, the project will be structured with distinct `backend/` and `frontend/` directories. This allows each to scale, test, and evolve independently while sharing documentation and versioning.

## Unknowns Resolved

| Unknown | Finding |
|---------|---------|
| Next.js / FastAPI Integration | Use a proxy or CORS configuration to allow the Next.js frontend to communicate with the FastAPI backend. |
| Better Auth Deployment | Resides in the Next.js edge layer but provides user identifiers that the FastAPI backend can verify. |
| Database Migration | SQLModel combined with Alembic can handle schema migrations for the Neon database. |

## Alternatives Considered

- **Next.js API Routes only**: Rejected because using a dedicated FastAPI backend leverages Python's business logic and provides better separation for future Phase III/IV complexity.
- **Custom Auth**: Rejected to avoid "reinventing the wheel" and to ensure industry-standard security practices via Better Auth.
- **Local SQLite**: Rejected as it does not satisfy the "Full-Stack Web" requirement for cloud-native persistence (Neon).
