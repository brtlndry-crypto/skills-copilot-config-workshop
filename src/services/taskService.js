import { Task } from '../models/task.js';
import {
  validateId,
  validateStatus,
  validatePriority,
  ValidationError,
} from '../utils/validators.js';

/** @type {Map<string, Task>} In-memory task store. */
const store = new Map();

/**
 * Creates a new task and adds it to the in-memory store.
 *
 * @param {string} title - The task title.
 * @param {string|undefined} [description] - Optional task description.
 * @param {{ status?: string, priority?: string }} [options={}] - Initial status and priority.
 * @returns {{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }} A copy of the created task.
 * @throws {TypeError} If title is not a string.
 * @throws {ValidationError} If any field fails validation.
 */
export function createTask(title, description = undefined, options = {}) {
  const task = new Task(title, description, options);
  store.set(task.id, task);
  return task.toJSON();
}

/**
 * Retrieves a single task by ID.
 *
 * @param {string} id - The task ID to look up.
 * @returns {{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }} A copy of the found task.
 * @throws {TypeError} If id is not a string.
 * @throws {ValidationError} If the task is not found.
 */
export function getTask(id) {
  validateId(id);
  const task = store.get(id);
  if (!task) {
    throw new ValidationError(`Task not found with ID: ${id}`);
  }
  return task.toJSON();
}

/**
 * Returns all tasks currently in the store.
 *
 * @returns {Array<{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }>} Array of task copies.
 */
export function getAllTasks() {
  return Array.from(store.values()).map(t => t.toJSON());
}

/**
 * Updates one or more fields of an existing task.
 *
 * @param {string} id - The task ID.
 * @param {{ title?: string, description?: string, status?: string, priority?: string }} changes - Fields to update.
 * @returns {{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }} A copy of the updated task.
 * @throws {TypeError} If id is not a string.
 * @throws {ValidationError} If the task is not found or any field fails validation.
 */
export function updateTask(id, changes) {
  validateId(id);
  const task = store.get(id);
  if (!task) {
    throw new ValidationError(`Task not found with ID: ${id}`);
  }
  if (changes.title !== undefined) task.setTitle(changes.title);
  if (changes.description !== undefined) task.setDescription(changes.description);
  if (changes.status !== undefined) task.setStatus(changes.status);
  if (changes.priority !== undefined) task.setPriority(changes.priority);
  return task.toJSON();
}

/**
 * Deletes a task by ID and returns the removed task data.
 *
 * @param {string} id - The task ID.
 * @returns {{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }} A copy of the deleted task.
 * @throws {TypeError} If id is not a string.
 * @throws {ValidationError} If the task is not found.
 */
export function deleteTask(id) {
  validateId(id);
  const task = store.get(id);
  if (!task) {
    throw new ValidationError(`Task not found with ID: ${id}`);
  }
  store.delete(id);
  return task.toJSON();
}

/**
 * Lists tasks with optional filtering by status or priority and optional sorting.
 *
 * @param {{ status?: string, priority?: string, sort?: 'priority'|'date' }} [options={}] - Filter and sort options.
 * @returns {Array<{ id: string, title: string, description: string|undefined, status: string, priority: string, createdAt: string, updatedAt: string }>} Filtered and sorted task copies.
 * @throws {ValidationError} If a provided status or priority is invalid.
 */
export function listTasks(options = {}) {
  let tasks = Array.from(store.values());

  if (options.status !== undefined) {
    const normalized = validateStatus(options.status);
    tasks = tasks.filter(t => t.status === normalized);
  }

  if (options.priority !== undefined) {
    const normalized = validatePriority(options.priority);
    tasks = tasks.filter(t => t.priority === normalized);
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  if (options.sort === 'priority') {
    tasks = tasks.slice().sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (options.sort === 'date') {
    tasks = tasks.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return tasks.map(t => t.toJSON());
}
