# Data Model: Phase II - Todo Full-Stack Web Application

## Entities

### User
Represents a registered user in the system. Authentication is managed by Better Auth, but the system tracks local references.

- **id**: UUID (Primary Key)
- **email**: String (Unique, Indexed)
- **created_at**: DateTime (ISO 8601)

### Task
Represents an individual todo item.

- **id**: UUID (Primary Key)
- **user_id**: UUID (Foreign Key -> User.id, Indexed)
- **title**: String (1-255 chars, mandatory)
- **description**: Text (Optional, max 1000 chars)
- **is_completed**: Boolean (Default: false)
- **created_at**: DateTime (ISO 8601)
- **updated_at**: DateTime (ISO 8601)

## Relationships

- **User (1) <-> (*) Task**: A user can have multiple tasks; a task belongs to exactly one user.

## Validation Rules

- **Task Title**: Must not be empty or purely whitespace.
- **Task Description**: Optional, but if provided, must not exceed 1000 characters.
- **Ownership**: Users can only read, update, or delete tasks where `task.user_id == current_user.id`.
