# Task Manager CLI - Technical Schema

## Data Models

### Task Entity

| Property | Type | Required | Default | Validation Rules |
|----------|------|----------|---------|------------------|
| `id` | string | Yes | Auto-generated | Unique identifier; immutable after creation |
| `title` | string | Yes | N/A | Non-empty after trim; 1–200 characters |
| `description` | string | No | `undefined` | If provided: max 1000 chars (trimmed) |
| `status` | enum | No | `'todo'` | One of: `'todo'`, `'in-progress'`, `'done'` (case-insensitive input, normalized to lowercase) |
| `priority` | enum | No | `'medium'` | One of: `'low'`, `'medium'`, `'high'` (case-insensitive input, normalized to lowercase) |
| `createdAt` | ISO 8601 string | Yes | Current timestamp | Valid date; immutable after creation |
| `updatedAt` | ISO 8601 string | Yes | Current timestamp | Valid date; updated on any modification |

### Validation Rules by Property

#### `id`
**Input Validation:**
- Type check: Must be a string
- Format: Matches auto-generated ID scheme (numeric or UUID)
- Immutability: Cannot be changed after task creation
- Uniqueness: Must not conflict with existing task IDs in store

**Processing:**
- Auto-generated at creation time if not provided

**Error Conditions:**
- `TypeError`: "Id must be a string" (if not string type)
- `ValidationError`: "Task not found with ID: [id]" (if referenced ID doesn't exist in store)
- `ValidationError`: "Id is immutable and cannot be changed" (if update attempted)

---

#### `title`
**Input Validation:**
- Type check: Must be a string
- Length check: Minimum 1 character (after trim)
- Length check: Maximum 200 characters (after trim)
- Content check: Cannot be null or undefined before assignment
- Whitespace handling: Trim leading/trailing whitespace before validation

**Processing:**
- Input: Trim whitespace (`value.trim()`)
- Validation: Check length constraints
- Storage: Store trimmed value

**Error Conditions:**
- `TypeError`: "Title must be a string" (if not string type)
- `ValidationError`: "Title is required and must be a non-empty string" (if empty after trim)
- `ValidationError`: "Title must not exceed 200 characters" (if trimmed length > 200)

**Example Valid Inputs:**
- `"Buy groceries"` → stored as `"Buy groceries"`
- `"  New task  "` → stored as `"New task"`
- `"A"` (1 char minimum)
- `200-char string` (200 char maximum)

---

#### `description`
**Input Validation:**
- Type check: Must be string or undefined
- Length check: If provided, maximum 1000 characters (after trim)
- Whitespace handling: Trim leading/trailing whitespace before validation
- Optional: Can be omitted or undefined

**Processing:**
- Input: If provided, trim whitespace
- Validation: Check length constraint
- Null-coalescing: Store undefined if not provided or empty after trim
- Storage: Store trimmed value or undefined

**Error Conditions:**
- `TypeError`: "Description must be a string or undefined" (if not string/undefined)
- `ValidationError`: "Description must not exceed 1000 characters" (if trimmed length > 1000)

**Example Valid Inputs:**
- `undefined` → stored as `undefined`
- `"Detailed notes"` → stored as `"Detailed notes"`
- `"  Details  "` → stored as `"Details"`
- `""` (empty after trim) → stored as `undefined`
- `1000-char string` (1000 char maximum)

---

#### `status`
**Input Validation:**
- Type check: Must be a string
- Enum check: Must be one of: `'todo'`, `'in-progress'`, `'done'`
- Case handling: Input normalized to lowercase (case-insensitive acceptance)
- Whitespace handling: Trim before normalization

**Processing:**
- Input: Trim, then convert to lowercase
- Validation: Check against allowed enums
- Storage: Store lowercase-normalized value
- Default: If omitted during creation, default to `'todo'`

**Error Conditions:**
- `TypeError`: "Status must be a string" (if not string type)
- `ValidationError`: "Status must be one of: todo, in-progress, done" (if not in enum after normalization)

**Example Valid Inputs:**
- `"todo"` → stored as `"todo"`
- `"TODO"` → stored as `"todo"` (normalized)
- `"In-Progress"` → stored as `"in-progress"` (normalized)
- Omitted at creation → stored as `"todo"` (default)

---

#### `priority`
**Input Validation:**
- Type check: Must be a string
- Enum check: Must be one of: `'low'`, `'medium'`, `'high'`
- Case handling: Input normalized to lowercase (case-insensitive acceptance)
- Whitespace handling: Trim before normalization

**Processing:**
- Input: Trim, then convert to lowercase
- Validation: Check against allowed enums
- Storage: Store lowercase-normalized value
- Default: If omitted during creation, default to `'medium'`

**Error Conditions:**
- `TypeError`: "Priority must be a string" (if not string type)
- `ValidationError`: "Priority must be one of: low, medium, high" (if not in enum after normalization)

**Example Valid Inputs:**
- `"high"` → stored as `"high"`
- `"HIGH"` → stored as `"high"` (normalized)
- `"Medium"` → stored as `"medium"` (normalized)
- Omitted at creation → stored as `"medium"` (default)

---

#### `createdAt`
**Input Validation:**
- Type check: Must be an ISO 8601 string
- Format check: Valid date string parseable by `Date.parse()`
- Immutability: Cannot be changed after task creation
- Automatic: Set automatically to current timestamp if not explicitly provided

**Processing:**
- Generation: If not provided, set to `new Date().toISOString()`
- Validation: Parse to verify valid date format
- Storage: Store ISO 8601 string as-is
- Enforcement: Reject any attempt to modify after creation

**Error Conditions:**
- `TypeError`: "CreatedAt must be an ISO 8601 string" (if not string)
- `ValidationError`: "CreatedAt must be a valid ISO 8601 date" (if unparseable)
- `ValidationError`: "CreatedAt is immutable and cannot be changed" (if update attempted)

**Example Valid Inputs:**
- `"2026-03-31T14:30:00.000Z"` (ISO 8601 with milliseconds)
- `"2026-03-31T14:30:00Z"` (ISO 8601 no milliseconds)
- Omitted at creation → set to current timestamp

---

#### `updatedAt`
**Input Validation:**
- Type check: Must be an ISO 8601 string
- Format check: Valid date string parseable by `Date.parse()`
- Temporal consistency: Must be >= createdAt timestamp
- Automatic: Set automatically to current timestamp on creation; updated on any modification

**Processing:**
- Generation: Set to `new Date().toISOString()` on creation
- Update: Reset to `new Date().toISOString()` on any property modification
- Validation: Parse to verify valid date format
- Storage: Store ISO 8601 string as-is

**Mutation Triggers:**
- Updated when any of these properties change: `title`, `description`, `status`, `priority`
- Not updated when `id`, `createdAt`, or `updatedAt` are accessed

**Error Conditions:**
- `TypeError`: "UpdatedAt must be an ISO 8601 string" (if not string)
- `ValidationError`: "UpdatedAt must be a valid ISO 8601 date" (if unparseable)
- `ValidationError`: "UpdatedAt cannot be before createdAt" (if temporal ordering violated)

**Example Valid Inputs:**
- `"2026-03-31T14:30:00.000Z"` (ISO 8601 with milliseconds)
- Auto-updated when task is modified
- Always >= createdAt timestamp

## File Structure

```
src/
├── index.js                 # Entry point, argument parsing, command dispatching, error handling
├── cli.js                   # Help text, command validation, CLI setup
├── constants.js             # Enum constants: STATUS, PRIORITY, SORT_FIELDS
│
├── models/
│   └── Task.js              # Task class; property validation, ID generation, timestamp management
│
├── storage/
│   └── TaskStore.js         # In-memory store; CRUD operations, filtering, sorting
│
├── commands/
│   ├── add.js               # Handler for 'add' command; creates and stores task
│   ├── delete.js            # Handler for 'delete' command; removes task by ID
│   ├── list.js              # Handler for 'list' command; applies filters and sorting
│   ├── update.js            # Handler for 'update' command; modifies task fields
│   └── view.js              # Handler for 'view/show' command; displays single task
│
└── utils/
    ├── parser.js            # Parses CLI arguments into { command, options } structure
    ├── validator.js         # Field validators; throws ValidationError on failure
    └── formatter.js         # Formats tasks for console output (tables, details, dates)
```

## Module Responsibilities

### `src/index.js`
**Exports:**
```javascript
export async function main(args);
```

**Responsibilities:**
- Parses command-line arguments via `parser`
- Routes to appropriate command handler
- Catches errors, logs to stderr with `Error: ` prefix, and exits with code 1
- Logs success messages to stdout and exits with code 0

**Dependencies:** `./cli.js`, `./parser.js`, all command modules (`./commands/*.js`)

---

### `src/cli.js`
**Exports:**
```javascript
export function showHelp();
export function validateCommand(cmdName);
```

**Responsibilities:**
- Displays usage help and command examples
- Validates that command names are recognized

**Dependencies:** `./constants.js`

---

### `src/constants.js`
**Exports:**
```javascript
export const STATUS = ['todo', 'in-progress', 'done'];
export const PRIORITY = ['low', 'medium', 'high'];
export const SORT_FIELDS = ['priority', 'date'];
```

**Responsibilities:**
- Single source of truth for enum values
- Used by validators and commands

**Dependencies:** none

---

### `src/models/Task.js`
**Exports:**
```javascript
export class Task {
  constructor(title, description = undefined, options = {});
  // Read-only properties
  get id();
  get title();
  get description();
  get status();
  get priority();
  get createdAt();
  get updatedAt();
  
  // Mutation methods
  setTitle(value);
  setDescription(value);
  setStatus(value);
  setPriority(value);
  updateTimestamp();
}

export function generateId();
```

**Responsibilities:**
- Validates all Task properties during construction and setters
- Generates unique task IDs
- Maintains immutable `createdAt` and auto-updating `updatedAt`
- Throws `ValidationError` for invalid field values

**Dependencies:** `./utils/validator.js`, `./constants.js`

---

### `src/storage/TaskStore.js`
**Exports:**
```javascript
export class TaskStore {
  add(task);                          // Returns task with assigned ID
  get(id);                            // Returns Task or throws ValidationError
  getAll();                           // Returns array of all tasks
  update(id, changes);                // Returns updated Task or throws ValidationError
  delete(id);                         // Removes and returns deleted Task or throws error
  filter(criteria);                   // Returns filtered tasks
  sort(field, direction = 'desc');    // Returns sorted array
}
```

**Responsibilities:**
- Maintains in-memory array of tasks
- Implements CRUD operations
- Validates task existence and ID format
- Supports filtering by status and priority
- Supports sorting by priority (high→low) or date (newest first)

**Dependencies:** `./models/Task.js`

---

### `src/commands/add.js`
**Exports:**
```javascript
export async function execute(options);
// options = { title: string, description?: string }
// Returns: { success: true, message: string, taskId: string }
```

**Responsibilities:**
- Validates `title` and `description` parameters
- Creates new Task instance
- Adds to TaskStore
- Returns success confirmation with task ID

**Dependencies:** `../storage/TaskStore.js`, `../models/Task.js`, `../utils/validator.js`

---

### `src/commands/delete.js`
**Exports:**
```javascript
export async function execute(options);
// options = { id: string }
// Returns: { success: true, message: string }
```

**Responsibilities:**
- Validates task ID exists
- Removes task from TaskStore
- Returns confirmation message

**Dependencies:** `../storage/TaskStore.js`, `../utils/validator.js`

---

### `src/commands/list.js`
**Exports:**
```javascript
export async function execute(options);
// options = { status?: string, priority?: string, sort?: string }
// Returns: { success: true, output: string }
```

**Responsibilities:**
- Retrieves all tasks from TaskStore
- Applies status filter if provided
- Applies priority filter if provided
- Applies sorting (priority or date) if specified
- Formats output as table via formatter
- Returns formatted output

**Dependencies:** `../storage/TaskStore.js`, `../utils/validator.js`, `../utils/formatter.js`, `../constants.js`

---

### `src/commands/update.js`
**Exports:**
```javascript
export async function execute(options);
// options = { id: string, title?: string, description?: string, status?: string, priority?: string }
// Returns: { success: true, message: string }
```

**Responsibilities:**
- Validates task ID exists
- Validates only provided fields
- Updates task properties via Task setters
- Updates `updatedAt` timestamp
- Returns confirmation message

**Dependencies:** `../storage/TaskStore.js`, `../utils/validator.js`

---

### `src/commands/view.js`
**Exports:**
```javascript
export async function execute(options);
// options = { id: string }
// Returns: { success: true, output: string }
```

**Responsibilities:**
- Validates task ID exists
- Retrieves task from TaskStore
- Formats complete task details via formatter
- Returns formatted output

**Dependencies:** `../storage/TaskStore.js`, `../utils/validator.js`, `../utils/formatter.js`

---

### `src/utils/parser.js`
**Exports:**
```javascript
export function parse(args);
// Returns: { command: string, options: Object }
// Throws: ParserError for invalid command or malformed arguments
```

**Responsibilities:**
- Extracts command from first argument
- Parses positional arguments (title, description, id, etc.)
- Extracts flag/option pairs (e.g., `--status todo`)
- Validates argument structure

**Dependencies:** none

---

### `src/utils/validator.js`
**Exports:**
```javascript
export function validateTitle(value);                    // Throws ValidationError if invalid
export function validateDescription(value);             // Throws ValidationError if invalid
export function validateStatus(value);                  // Throws ValidationError if invalid
export function validatePriority(value);                // Throws ValidationError if invalid
export function validateId(value);                      // Basic format check
export function validateSort(value);                    // Throws ValidationError if invalid
```

**Responsibilities:**
- Validates individual field values
- Trims and normalizes string inputs
- Normalizes enums to lowercase
- Checks against constraints (min/max length, enum values)
- Throws `ValidationError` with descriptive messages

**Dependencies:** `./constants.js`

---

### `src/utils/formatter.js`
**Exports:**
```javascript
export function formatTaskTable(tasks);                 // Returns ASCII table string
export function formatTaskDetail(task);                 // Returns multi-line task details
export function formatDate(isoString);                  // Returns human-readable date
```

**Responsibilities:**
- Formats array of tasks as console-friendly ASCII table
- Formats individual task with all fields
- Converts ISO 8601 timestamps to readable format (e.g., "2026-03-31 14:30:00")
- Handles edge cases (empty task lists, long descriptions)

**Dependencies:** none

---

## Error Handling Strategy

### Error Types and Where They Are Thrown

**ValidationError** (Exit Code 1)
- **Thrown by:** `validator.js` functions, `Task` class setters, `TaskStore` operations
- **When:**
  - Title missing or exceeds character limits
  - Description exceeds 1000 characters
  - Invalid status/priority enum value
  - Invalid sort parameter
  - Task ID format invalid or ID not found in store
  - Filter criteria invalid
- **Message format:** `Error: [specific rule violated]`
- **Examples:**
  - "Error: Title is required and must be a non-empty string"
  - "Error: Priority must be one of: low, medium, high"
  - "Error: Task not found with ID: abc123"

**ParserError** (Exit Code 1)
- **Thrown by:** `parser.js` module during argument parsing
- **When:**
  - Command is unknown or invalid
  - Wrong number of positional arguments
  - Malformed flag/option syntax
- **Message format:** `Error: [parsing error]. Use --help for usage`
- **Examples:**
  - "Error: Unknown command 'foo'. Use --help for usage"
  - "Error: Invalid command or arguments. Use --help for usage"

**OperationError** (Exit Code 1)
- **Thrown by:** Command handlers, `TaskStore`
- **When:**
  - Cannot update a task (not found, validation failed)
  - Cannot delete a task (not found)
  - Unexpected runtime error
- **Message format:** `Error: Cannot [action] - [reason]`
- **Examples:**
  - "Error: Cannot update task - task not found with ID: xyz"
  - "Error: Cannot delete task - task not found with ID: xyz"

### Error Handling Flow

```
Input → Parser
  ├─ ParserError? → Exit 1
  └─ OK → Extract command & options
         │
         → Command Handler
            ├─ Validators called
            │  ├─ ValidationError? → Exit 1
            │  └─ OK
            │
            ├─ TaskStore operations
            │  ├─ ValidationError? → Exit 1
            │  ├─ OperationError? → Exit 1
            │  └─ OK
            │
            └─ Success → Log output, Exit 0
```

### Error Output Convention

```javascript
// All errors logged as:
console.error(`Error: ${message}`);
process.exit(1);

// All success messages logged as:
console.log(message);
process.exit(0);
```

---

## Command-Line Interface Summary

| Command | Arguments | Flags | Example |
|---------|-----------|-------|---------|
| `add` | `<title> [description]` | — | `add "Buy milk" "at the store"` |
| `list` | — | `--status <status>` `--priority <priority>` `--sort <field>` | `list --status todo --sort priority` |
| `update` | `<id>` | `--title` `--description` `--status` `--priority` | `update 1 --status done` |
| `delete` | `<id>` | — | `delete 1` |
| `view` or `show` | `<id>` | — | `view 1` |

---

## Implementation Dependencies Graph

```
index.js (main)
  ├─ parser.js
  ├─ cli.js
  │  └─ constants.js
  ├─ add.js
  │  ├─ TaskStore.js
  │  │  └─ Task.js
  │  │     ├─ validator.js
  │  │     │  └─ constants.js
  │  │     └─ constants.js
  │  ├─ validator.js
  │  │  └─ constants.js
  │  └─ Task.js ↑
  ├─ delete.js
  │  ├─ TaskStore.js ↑
  │  └─ validator.js ↑
  ├─ list.js
  │  ├─ TaskStore.js ↑
  │  ├─ validator.js ↑
  │  ├─ formatter.js
  │  └─ constants.js ↑
  ├─ update.js
  │  ├─ TaskStore.js ↑
  │  └─ validator.js ↑
  └─ view.js
     ├─ TaskStore.js ↑
     ├─ validator.js ↑
     └─ formatter.js ↑
```

All modules follow ES6 module syntax (`import`/`export`) and use only Node.js built-in modules per project conventions.
