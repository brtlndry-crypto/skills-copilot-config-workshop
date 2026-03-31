const STATUS = ['todo', 'in-progress', 'done'];
const PRIORITY = ['low', 'medium', 'high'];

/**
 * Custom error class for validation failures.
 */
export class ValidationError extends Error {
  /**
   * @param {string} message - Descriptive error message.
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates a task title value.
 * Trims whitespace and checks length constraints.
 *
 * @param {*} value - The value to validate.
 * @returns {string} The trimmed title.
 * @throws {TypeError} If value is not a string.
 * @throws {ValidationError} If title is empty or exceeds 200 characters.
 *
 * @example
 * validateTitle('Buy groceries'); // returns 'Buy groceries'
 * @example
 * validateTitle('  New task  '); // returns 'New task'
 */
export function validateTitle(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Title must be a string');
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Title is required and must be a non-empty string');
  }
  if (trimmed.length > 200) {
    throw new ValidationError('Title must not exceed 200 characters');
  }
  return trimmed;
}

/**
 * Validates a task description value.
 * Trims whitespace; returns undefined if empty or not provided.
 *
 * @param {*} value - The value to validate (string or undefined).
 * @returns {string|undefined} The trimmed description, or undefined.
 * @throws {TypeError} If value is not a string or undefined.
 * @throws {ValidationError} If description exceeds 1000 characters.
 *
 * @example
 * validateDescription(undefined); // returns undefined
 * @example
 * validateDescription('  Details  '); // returns 'Details'
 */
export function validateDescription(value) {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new TypeError('Description must be a string or undefined');
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  if (trimmed.length > 1000) {
    throw new ValidationError('Description must not exceed 1000 characters');
  }
  return trimmed;
}

/**
 * Validates a task status value.
 * Trims and normalizes to lowercase before checking against allowed enums.
 *
 * @param {*} value - The value to validate.
 * @returns {string} The normalized status ('todo', 'in-progress', or 'done').
 * @throws {TypeError} If value is not a string.
 * @throws {ValidationError} If value is not a valid status.
 *
 * @example
 * validateStatus('todo'); // returns 'todo'
 * @example
 * validateStatus('IN-PROGRESS'); // returns 'in-progress'
 */
export function validateStatus(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Status must be a string');
  }
  const normalized = value.trim().toLowerCase();
  if (!STATUS.includes(normalized)) {
    throw new ValidationError(`Status must be one of: ${STATUS.join(', ')}`);
  }
  return normalized;
}

/**
 * Validates a task priority value.
 * Trims and normalizes to lowercase before checking against allowed enums.
 *
 * @param {*} value - The value to validate.
 * @returns {string} The normalized priority ('low', 'medium', or 'high').
 * @throws {TypeError} If value is not a string.
 * @throws {ValidationError} If value is not a valid priority.
 *
 * @example
 * validatePriority('high'); // returns 'high'
 * @example
 * validatePriority('MEDIUM'); // returns 'medium'
 */
export function validatePriority(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Priority must be a string');
  }
  const normalized = value.trim().toLowerCase();
  if (!PRIORITY.includes(normalized)) {
    throw new ValidationError(`Priority must be one of: ${PRIORITY.join(', ')}`);
  }
  return normalized;
}

/**
 * Validates that a task ID is a non-empty string.
 *
 * @param {*} value - The value to validate.
 * @returns {string} The trimmed ID.
 * @throws {TypeError} If value is not a string.
 * @throws {ValidationError} If value is empty after trimming.
 *
 * @example
 * validateId('abc-123'); // returns 'abc-123'
 * @example
 * validateId('550e8400-e29b-41d4-a716-446655440000'); // returns the UUID
 */
export function validateId(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Id must be a string');
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new ValidationError('Id must not be empty');
  }
  return trimmed;
}
