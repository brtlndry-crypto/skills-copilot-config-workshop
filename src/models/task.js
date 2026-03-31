import { randomUUID } from 'crypto';
import {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
} from '../utils/validators.js';

/**
 * Generates a unique task ID using a UUID v4.
 *
 * @returns {string} A UUID string.
 */
export function generateId() {
  return randomUUID();
}

/**
 * Represents a task in the task manager.
 * Validates all properties on construction and mutation.
 */
export class Task {
  #id;
  #title;
  #description;
  #status;
  #priority;
  #createdAt;
  #updatedAt;

  /**
   * Creates a new Task instance.
   *
   * @param {string} title - The task title (1–200 characters after trim).
   * @param {string|undefined} [description] - Optional description (max 1000 chars).
   * @param {object} [options={}] - Optional overrides for status and priority.
   * @param {string} [options.status='todo'] - Initial status ('todo', 'in-progress', 'done').
   * @param {string} [options.priority='medium'] - Initial priority ('low', 'medium', 'high').
   * @throws {TypeError} If title is not a string.
   * @throws {ValidationError} If any field value fails validation.
   */
  constructor(title, description = undefined, options = {}) {
    this.#id = generateId();
    this.#title = validateTitle(title);
    this.#description = validateDescription(description);
    this.#status = options.status !== undefined ? validateStatus(options.status) : 'todo';
    this.#priority = options.priority !== undefined ? validatePriority(options.priority) : 'medium';
    const now = new Date().toISOString();
    this.#createdAt = now;
    this.#updatedAt = now;
  }

  /** @returns {string} The immutable task ID. */
  get id() {
    return this.#id;
  }

  /** @returns {string} The task title. */
  get title() {
    return this.#title;
  }

  /** @returns {string|undefined} The task description. */
  get description() {
    return this.#description;
  }

  /** @returns {string} The task status. */
  get status() {
    return this.#status;
  }

  /** @returns {string} The task priority. */
  get priority() {
    return this.#priority;
  }

  /** @returns {string} The creation timestamp (ISO 8601). */
  get createdAt() {
    return this.#createdAt;
  }

  /** @returns {string} The last-updated timestamp (ISO 8601). */
  get updatedAt() {
    return this.#updatedAt;
  }

  /**
   * Updates the task title and refreshes the updatedAt timestamp.
   *
   * @param {string} value - The new title.
   * @throws {TypeError} If value is not a string.
   * @throws {ValidationError} If title fails length validation.
   */
  setTitle(value) {
    this.#title = validateTitle(value);
    this.updateTimestamp();
  }

  /**
   * Updates the task description and refreshes the updatedAt timestamp.
   *
   * @param {string|undefined} value - The new description, or undefined to clear.
   * @throws {TypeError} If value is not a string or undefined.
   * @throws {ValidationError} If description exceeds 1000 characters.
   */
  setDescription(value) {
    this.#description = validateDescription(value);
    this.updateTimestamp();
  }

  /**
   * Updates the task status and refreshes the updatedAt timestamp.
   *
   * @param {string} value - The new status.
   * @throws {TypeError} If value is not a string.
   * @throws {ValidationError} If value is not a valid status enum.
   */
  setStatus(value) {
    this.#status = validateStatus(value);
    this.updateTimestamp();
  }

  /**
   * Updates the task priority and refreshes the updatedAt timestamp.
   *
   * @param {string} value - The new priority.
   * @throws {TypeError} If value is not a string.
   * @throws {ValidationError} If value is not a valid priority enum.
   */
  setPriority(value) {
    this.#priority = validatePriority(value);
    this.updateTimestamp();
  }

  /**
   * Sets the updatedAt timestamp to the current time.
   */
  updateTimestamp() {
    this.#updatedAt = new Date().toISOString();
  }

  /**
   * Returns a plain object representation of this task.
   *
   * @returns {{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }}
   */
  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      description: this.#description,
      status: this.#status,
      priority: this.#priority,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }
}
