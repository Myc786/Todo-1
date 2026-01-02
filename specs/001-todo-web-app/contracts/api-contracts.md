# API Contracts: Phase II - Todo Full-Stack Web Application

## Base URL
`http://api.todo.local/api`

## Authentication
All requests (except health check) must include a valid session token (Better Auth cookie).

## Endpoints

### 1. List Tasks
`GET /tasks`

**Response (200 OK)**
```json
[
  {
    "id": "uuid-v4",
    "title": "Buy milk",
    "description": "2% milk from grocery store",
    "is_completed": false,
    "created_at": "2026-01-02T12:00:00Z"
  }
]
```

### 2. Create Task
`POST /tasks`

**Request Body**
```json
{
  "title": "String (required)",
  "description": "String (optional)"
}
```

**Response (201 Created)**
```json
{
  "id": "uuid-v4",
  "title": "Buy milk",
  "description": "2% milk from grocery store",
  "is_completed": false,
  "created_at": "2026-01-02T12:00:00Z"
}
```

### 3. Get Task Details
`GET /tasks/{id}`

**Response (200 OK)**
```json
 {
    "id": "uuid-v4",
    "title": "Buy milk",
    "description": "2% milk from grocery store",
    "is_completed": false,
    "created_at": "2026-01-02T12:00:00Z"
 }
```

**Errors**
- `404 Not Found`: Task does not exist.
- `403 Forbidden`: Task belongs to another user.

### 4. Update Task (Full)
`PUT /tasks/{id}`

**Request Body**
```json
{
  "title": "New Title",
  "description": "New Description",
  "is_completed": true
}
```

**Response (200 OK)**
```json
 {
    "id": "uuid-v4",
    "title": "New Title",
    "description": "New Description",
    "is_completed": true,
    "created_at": "2026-01-02T12:00:00Z"
 }
```

### 5. Toggle Completion (Partial)
`PATCH /tasks/{id}`

**Request Body**
```json
{
  "is_completed": true
}
```

**Response (200 OK)** - Returns updated task object.

### 6. Delete Task
`DELETE /tasks/{id}`

**Response (204 No Content)**
