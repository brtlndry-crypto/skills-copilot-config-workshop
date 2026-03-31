# Task Manager - Technical Schema

## 1. Data Models

### Task

| Property | Type | Required | Default | Validation Rules |
|----------|------|----------|---------|------------------|
| id | string | Yes | Generated via randomUUID | Must be a non-empty string when referenced; unique in store; immutable after creation |
| title | string | Yes | None | Trimmed; length 1-200 |
| description | string or undefined | No | undefined | If provided, trimmed length 1-1000; empty string normalizes to undefined |
| status | 'todo' \| 'in-progress' \| 'done' | No | 'todo' | String input; trimmed and lowercased; must match enum |
| priority | 'low' \| 'medium' \| 'high' | No | 'medium' | String input; trimmed and lowercased; must match enum |
| category | string | No | 'general' | String input; trimmed and lowercased; length 1-50; omitted or null defaults to general |
| createdAt | ISO 8601 string | Yes | Current timestamp | Generated at creation; immutable |
| updatedAt | ISO 8601 string | Yes | Current timestamp | Updated whenever title, description, status, priority, or category changes |

### Store Model

| Structure | Type | Required | Validation Rules |
|-----------|------|----------|------------------|
| taskStore | Map<string, Task> | Yes | Keys are task IDs; values are Task instances; internal map is never exposed directly |

## 2. File Structure

```text
src/
├── index.js                 # Demo entry point that creates, updates, lists, filters, and deletes tasks
├── models/
│   └── task.js              # Task class and ID generator with field validation and timestamp rules
├── services/
│   └── taskService.js       # CRUD and query functions over in-memory task map
└── utils/
    └── validators.js        # Pure validators and ValidationError class for all task inputs
```

## 3. Module Responsibilities

### src/utils/validators.js
- Exports ValidationError, validateTitle, validateDescription, validateStatus, validatePriority, validateCategory, and validateId.
- Performs normalization and validation only; no side effects.
- Used by model and service modules.

### src/models/task.js
- Exports generateId and Task.
- Task constructor validates title, description, status, priority, and category.
- Task provides mutation methods setTitle, setDescription, setStatus, setPriority, and setCategory.
- Task exposes toJSON to return a plain object copy.
- Depends on src/utils/validators.js and crypto.randomUUID.

### src/services/taskService.js
- Exports createTask, getTask, getAllTasks, updateTask, deleteTask, and listTasks.
- Maintains an in-memory Map keyed by task ID.
- Returns plain object copies from every read and write API.
- listTasks supports filtering by status, priority, and category plus sorting by priority or date.
- Depends on src/models/task.js and src/utils/validators.js.

### src/index.js
- No exports; demonstrates feature behavior.
- Shows create with default and explicit category values.
- Shows list filtering including category-only and combined filters.
- Demonstrates update and delete flows with error handling examples.
- Depends on src/services/taskService.js.

## 4. Error Handling Strategy

### Error Types
- TypeError: thrown when an argument has the wrong JavaScript type.
- ValidationError: thrown when a value has the right type but violates business rules.

### Throw Locations
- src/utils/validators.js:
  - validateTitle: TypeError for non-string, ValidationError for empty or >200.
  - validateDescription: TypeError for invalid type, ValidationError for >1000.
  - validateStatus: TypeError for non-string, ValidationError for invalid enum.
  - validatePriority: TypeError for non-string, ValidationError for invalid enum.
  - validateCategory: TypeError for non-string (except omitted/null), ValidationError for empty after trim or >50.
  - validateId: TypeError for non-string, ValidationError for empty after trim.
- src/services/taskService.js:
  - getTask, updateTask, deleteTask: ValidationError when ID does not exist.
  - listTasks: ValidationError via validators for invalid filter values.

### Error Propagation
- Service layer does not swallow errors; it propagates validator and not-found errors to callers.
- Entry point catches thrown errors and logs them with console.error for demonstration.
