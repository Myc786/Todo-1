# ADR-001: Phase II Technology Stack and Auth Strategy

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2026-01-02
- **Feature:** todo-web-app
- **Context:** Transitioning from a Phase I console application to a Phase II full-stack web application requires a cohesive set of technologies that support multi-user isolation, persistent storage, and responsive UI while adhering to the SDD principles of "Production Mindset" and "Clear Separation of Concerns."

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security? (YES)
     2) Alternatives: Multiple viable options considered with tradeoffs? (YES)
     3) Scope: Cross-cutting concern (not an isolated detail)? (YES)
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

We have adopted an integrated full-stack architecture consisting of:
- **Frontend Framework**: Next.js 16+ (App Router) for hybrid rendering and modern UI patterns.
- **Styling**: Tailwind CSS for mobile-first, utility-driven responsive design.
- **Backend Framework**: FastAPI with Pydantic v2 for high-performance, async RESTful APIs.
- **ORM & Data Modeling**: SQLModel (SQLAlchemy + Pydantic) to unify domain and database schemas.
- **Persistence Layer**: Neon Serverless PostgreSQL for scalable, cloud-native storage.
- **Authentication & Security**: Better Auth for session management and user identity, integrated with FastAPI for data ownership enforcement.

## Consequences

### Positive

- **Unified Schemas**: SQLModel reduces boilerplate by using the same models for API validation and database persistence.
- **Integrated Auth**: Better Auth simplifies the implementation of secure signup/signin flows specifically within the Next.js ecosystem.
- **Scalability**: Neon's serverless nature and FastAPI's async core allow the application to scale efficiently without managing infrastructure.
- **Developer Experience**: The combination of Next.js and Tailwind provides rapid UI development cycles.

### Negative

- **Runtime Overhead**: Managing separate Node.js (frontend) and Python (backend) runtimes increases operational complexity compared to a monostack (e.g., pure Next.js).
- **Tooling Learning Curve**: Requires proficiency in both Next.js App Router patterns and FastAPI dependency injection/async patterns.
- **Database Cold Starts**: Serverless Postgres (Neon) may introduce minor latency on initial requests after inactivity.

## Alternatives Considered

- **Alternative 1: Pure Next.js (Full Monostack)**: Use Next.js Route Handlers for the backend. Rejected to leverage Python's robust business logic ecosystem and ensure Phase I logic can be easily migrated/reused.
- **Alternative 2: Django + React SPA**: Rejected as it is too "heavy" for the current project requirements and lacks the built-in modern hydration/SSR features of Next.js.
- **Alternative 3: Custom JWT Auth**: Rejected to avoid security risks associated with custom implementations and to follow the "Simplicity Before Abstraction" principle.

## References

- Feature Spec: [specs/001-todo-web-app/spec.md](spec.md)
- Implementation Plan: [specs/001-todo-web-app/plan.md](plan.md)
- Related ADRs: None
- Evaluator Evidence: [history/prompts/todo-web-app/004-execute-planning.plan.prompt.md](../prompts/todo-web-app/004-execute-planning.plan.prompt.md)
