# Task Manager CLI Application - Project Plan

## Project Overview

The Task Manager CLI is a command-line application that enables users to efficiently manage their daily tasks. It provides core task management operations (create, read, update, delete) with advanced filtering and sorting capabilities. Tasks persist in memory during each session and include metadata such as title, description, status, priority, and timestamps. The application prioritizes simplicity and usability, making it suitable for developers and teams who prefer terminal-based workflows.

The feature scope now includes optional task categories so users can organize tasks by context (for example: work, personal, urgent). Category is assigned at creation or update time, defaults to general when omitted, and is supported as an additional list filter.

## User Stories

1. **Create a Task**
   - As a user, I want to create a new task with a title and optional description.
   - Acceptance Criteria:
     - CLI accepts `add` command with title and description parameters
     - New task receives a unique ID, todo status, and medium priority by default
       - New task receives category `general` by default when category is omitted
     - createdAt and updatedAt are set to current timestamp
     - Task is added to the in-memory store and confirmed to user

2. **List All Tasks**
   - As a user, I want to view all tasks in a readable tabular format.
   - Acceptance Criteria:
     - CLI accepts `list` command with optional flags (--status, --priority, --sort)
     - Task information (ID, title, status, priority, createdAt) is displayed
     - Tasks are displayed in a clear, sortable format

3. **Update Task Details**
   - As a user, I want to modify a task's title, description, status, or priority.
   - Acceptance Criteria:
     - CLI accepts `update` command with task ID and one or more parameters
     - updatedAt timestamp is changed when modification occurs
     - User receives confirmation of successful update

4. **Delete a Task**
   - As a user, I want to remove a task from my list.
   - Acceptance Criteria:
     - CLI accepts `delete` command with task ID
     - Task is removed from the in-memory store
     - User receives confirmation of deletion

5. **Filter Tasks by Status**
   - As a user, I want to filter tasks by their current status (todo, in-progress, done).
   - Acceptance Criteria:
     - CLI accepts `list --status <status>` to filter results
     - Only tasks matching the specified status are displayed

6. **Filter Tasks by Priority**
   - As a user, I want to filter tasks by priority (low, medium, high).
   - Acceptance Criteria:
     - CLI accepts `list --priority <priority>` to filter results
     - Only tasks matching the specified priority are displayed

7. **Assign Category to a Task**
   - As a user, I want to assign a category (for example: work, personal, urgent) so tasks are easier to organize.
   - Acceptance Criteria:
     - CLI accepts an optional `--category <category>` value on `add` and `update`
     - Category is normalized and stored as lowercase text
     - When omitted, category defaults to `general`
     - Empty category values are rejected

8. **Filter Tasks by Category**
   - As a user, I want to filter tasks by category.
   - Acceptance Criteria:
     - CLI accepts `list --category <category>` to filter results
     - Only tasks matching the specified category are displayed
     - Filtering supports category-only and combined filters with status/priority

9. **Sort Tasks**
   - As a user, I want to sort tasks by priority or creation date.
   - Acceptance Criteria:
     - CLI accepts `list --sort priority` (high → low) or `--sort date` (newest first)
     - Sorting is applied before or after filtering as needed

10. **View Task Details**
   - As a user, I want to see full details of a specific task including description and timestamps.
   - Acceptance Criteria:
     - CLI accepts `view` or `show` command with task ID
     - Task's complete information is displayed clearly

## Data Model

### Task Entity

- `id` (string, UUID or auto-incremented) - Unique identifier for the task
- `title` (string, required) - Brief name/heading of the task
- `description` (string, optional) - Longer explanation or details
- `status` (string, enum: "todo" | "in-progress" | "done") - Current state of task, defaults to "todo"
- `priority` (string, enum: "low" | "medium" | "high") - Task urgency level, defaults to "medium"
- `category` (string, optional) - Task grouping label, defaults to "general"
- `createdAt` (ISO 8601 timestamp) - When the task was created
- `updatedAt` (ISO 8601 timestamp) - When the task was last modified

### In-Memory Store

- Array of Task objects stored in application memory during runtime
- No persistence between sessions unless implemented in future phases

## Error Handling Conventions and Input Validation

### Input Validation Rules

**Title Parameter**
- Must be a non-empty string
- Minimum length: 1 character
- Maximum length: 200 characters
- Trim leading/trailing whitespace before validation
- Error: "Title is required and must be a non-empty string"

**Description Parameter**
- Optional field
- Maximum length: 1000 characters
- Trim leading/trailing whitespace
- Error (if provided): "Description must not exceed 1000 characters"

**Status Parameter**
- Must be one of: "todo", "in-progress", "done"
- Case-insensitive input (normalize to lowercase)
- Default value: "todo" (when creating new task)
- Error: "Status must be one of: todo, in-progress, done"

**Priority Parameter**
- Must be one of: "low", "medium", "high"
- Case-insensitive input (normalize to lowercase)
- Default value: "medium" (when creating new task)
- Error: "Priority must be one of: low, medium, high"

**Category Parameter**
- Optional field
- Must be a non-empty string when provided
- Minimum length: 1 character (after trim)
- Maximum length: 50 characters
- Case-insensitive input (normalize to lowercase)
- Default value: "general" (when creating new task)
- Error: "Category must be a non-empty string up to 50 characters"

**Task ID Parameter**
- Must be a valid ID format matching the store's ID scheme
- ID must exist in the task store
- Error: "Task ID is invalid or task not found"

**Sort Parameter**
- Must be one of: "priority", "date"
- Case-insensitive input
- Error: "Sort must be one of: priority, date"

**Filter Parameter (Status/Priority/Category)**
- Must be a valid value for the respective field
- Status/Priority validation rules same as parameters above
- Category follows Category Parameter rules

### Error Handling Conventions

**Error Response Format**
- All errors output to stderr with red coloring (if color support available)
- Error messages prefixed with "Error: " identifier
- Format: `Error: [error message]`
- Exit with code 1 for validation errors
- Exit with code 0 for successful operations

**Common Error Scenarios**

| Scenario | Exit Code | Message |
|----------|-----------|---------|
| Missing required field | 1 | "Error: [field name] is required" |
| Invalid enum value | 1 | "Error: [field name] must be one of: [options]" |
| Task not found | 1 | "Error: Task not found with ID: [id]" |
| Duplicate operation | 1 | "Error: Cannot [action] - [reason]" |
| Parser error | 1 | "Error: Invalid command or arguments. Use --help for usage" |
| Success | 0 | Confirmation message to stdout |

**Error Recovery Strategy**
- Do not modify state if validation fails
- Provide clear guidance on what went wrong and how to fix it
- Suggest valid options for enum fields
- Do not attempt silent corrections or data coercion

### Validation Flow

1. Parse CLI arguments
2. Validate argument count and format
3. Extract and trim string inputs
4. Normalize enum values (lowercase)
5. Validate each field against rules
6. Check business logic constraints (e.g., task exists)
7. Proceed with operation or return error

### Success Confirmation Messages

- **Add**: "Task created successfully (ID: [id])"
- **Update**: "Task updated successfully (ID: [id])"
- **Delete**: "Task deleted successfully (ID: [id])"
- **List**: Display table (no additional message needed)
- **View**: Display task details (no additional message needed)

## File Structure

```
src/
├── index.js               # Entry point and CLI command dispatcher
├── models/
│   └── Task.js            # Task entity class with validation logic
├── storage/
│   └── TaskStore.js       # In-memory store and CRUD operations
├── commands/
│   ├── add.js             # Create task command handler
│   ├── list.js            # List/filter/sort tasks command handler
│   ├── update.js          # Update task command handler
│   ├── delete.js          # Delete task command handler
│   └── view.js            # View task details command handler
├── utils/
│   ├── parser.js          # CLI argument parsing
│   ├── validator.js       # Input validation (status, priority, etc.)
│   └── formatter.js       # Output formatting (tables, timestamps)
└── cli.js                 # CLI interface setup and help text
```

## Implementation Phases

### Phase 1: Core Infrastructure (Foundation)
- Set up project structure and entry point
- Implement Task model with validation
- Create in-memory TaskStore with CRUD operations
- Build basic CLI argument parser
- Implement helper utilities (formatter, validator)
- **Deliverable**: Basic CRUD operations via CLI (add, list, delete)

### Phase 2: Extended Operations (Functionality)
- Implement update command with partial modification support
- Implement view/show command for individual task details
- Add filtering by status
- Add filtering by priority
- Add category assignment and default behavior
- Add filtering by category
- **Deliverable**: Full task management with status/priority/category filtering

### Phase 3: Advanced Features (Enhancement)
- Implement sorting by priority (high → low)
- Implement sorting by creation date (newest first)
- Combine filtering and sorting in list command
- Improve table formatting and readability
- Add color output for status/priority indicators
- **Deliverable**: Professional CLI with sorting, filtering, and visual enhancements

### Phase 4: Polish & Documentation (Refinement)
- Add comprehensive help text and usage examples
- Implement error handling and user-friendly error messages
- Add input validation with clear error feedback
- Write inline code comments and README
- **Deliverable**: Production-ready CLI application with full documentation
