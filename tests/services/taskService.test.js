import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
  listTasks,
} from '../../src/services/taskService.js';
import { ValidationError } from '../../src/utils/validators.js';

// createTask
test('createTask returns a task object with correct fields including category', () => {
  const task = createTask('Write tests', 'cover all paths', { status: 'todo', priority: 'high', category: 'work' });
  assert.equal(task.title, 'Write tests');
  assert.equal(task.description, 'cover all paths');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'high');
  assert.equal(task.category, 'work');
  assert.equal(typeof task.id, 'string');
  assert.equal(typeof task.createdAt, 'string');
  assert.equal(typeof task.updatedAt, 'string');
});

test('createTask stores the task so it can be retrieved by id', () => {
  const created = createTask('Stored task');
  const found = getTask(created.id);
  assert.equal(found.id, created.id);
  deleteTask(created.id);
});

test('createTask applies default status of "todo"', () => {
  const task = createTask('Default status');
  assert.equal(task.status, 'todo');
  deleteTask(task.id);
});

test('createTask applies default priority of "medium"', () => {
  const task = createTask('Default priority');
  assert.equal(task.priority, 'medium');
  deleteTask(task.id);
});

test('createTask applies default category of "general"', () => {
  const task = createTask('Default category');
  assert.equal(task.category, 'general');
  deleteTask(task.id);
});

test('createTask throws TypeError when title is not a string', () => {
  assert.throws(() => createTask(null), TypeError);
});

// getTask
test('getTask returns the task matching the given id', () => {
  const task = createTask('Findable task');
  const result = getTask(task.id);
  assert.equal(result.id, task.id);
  deleteTask(task.id);
});

test('getTask returns a copy and does not expose internal mutable state', () => {
  const task = createTask('Copy check');
  const first = getTask(task.id);
  first.title = 'tampered';
  const second = getTask(task.id);
  assert.equal(second.title, 'Copy check');
  deleteTask(task.id);
});

test('getTask throws ValidationError when the task does not exist', () => {
  assert.throws(() => getTask('non-existent-id'), ValidationError);
});

test('getTask throws TypeError when id is not a string', () => {
  assert.throws(() => getTask(99), TypeError);
});

// getAllTasks
test('getAllTasks returns an array', () => {
  const result = getAllTasks();
  assert.ok(Array.isArray(result));
});

test('getAllTasks includes a recently created task', () => {
  const task = createTask('In all tasks');
  const all = getAllTasks();
  const found = all.find(t => t.id === task.id);
  assert.ok(found !== undefined);
  deleteTask(task.id);
});

test('getAllTasks returns copies that do not mutate stored tasks', () => {
  const task = createTask('All copy check');
  const all = getAllTasks();
  const found = all.find(t => t.id === task.id);
  found.title = 'tampered';
  const fetched = getTask(task.id);
  assert.equal(fetched.title, 'All copy check');
  deleteTask(task.id);
});

// updateTask
test('updateTask changes the task title', () => {
  const task = createTask('Old title');
  const updated = updateTask(task.id, { title: 'New title' });
  assert.equal(updated.title, 'New title');
  deleteTask(task.id);
});

test('updateTask changes the task status', () => {
  const task = createTask('Status update');
  const updated = updateTask(task.id, { status: 'done' });
  assert.equal(updated.status, 'done');
  deleteTask(task.id);
});

test('updateTask changes the task priority', () => {
  const task = createTask('Priority update');
  const updated = updateTask(task.id, { priority: 'low' });
  assert.equal(updated.priority, 'low');
  deleteTask(task.id);
});

test('updateTask changes the task category', () => {
  const task = createTask('Category update', undefined, { category: 'general' });
  const updated = updateTask(task.id, { category: 'work' });
  assert.equal(updated.category, 'work');
  deleteTask(task.id);
});

test('updateTask changes the task description', () => {
  const task = createTask('Desc update', 'original');
  const updated = updateTask(task.id, { description: 'revised' });
  assert.equal(updated.description, 'revised');
  deleteTask(task.id);
});

test('updateTask ignores description change when value is undefined', () => {
  const task = createTask('Clear desc', 'to remove');
  const updated = updateTask(task.id, { description: undefined });
  assert.equal(updated.description, 'to remove');
  deleteTask(task.id);
});

test('updateTask throws ValidationError when the task does not exist', () => {
  assert.throws(() => updateTask('no-such-id', { title: 'x' }), ValidationError);
});

test('updateTask throws TypeError when id is not a string', () => {
  assert.throws(() => updateTask(5, { title: 'x' }), TypeError);
});

// deleteTask
test('deleteTask returns the deleted task data', () => {
  const task = createTask('To be deleted');
  const result = deleteTask(task.id);
  assert.equal(result.id, task.id);
});

test('deleteTask removes the task from the store', () => {
  const task = createTask('Temporary task');
  deleteTask(task.id);
  assert.throws(() => getTask(task.id), ValidationError);
});

test('deleteTask returns a copy that cannot mutate previous store data', () => {
  const task = createTask('Delete copy check');
  const deleted = deleteTask(task.id);
  deleted.title = 'tampered';
  assert.equal(deleted.title, 'tampered');
  assert.throws(() => getTask(task.id), ValidationError);
});

test('deleteTask throws ValidationError when the task does not exist', () => {
  assert.throws(() => deleteTask('ghost-id'), ValidationError);
});

// listTasks
test('listTasks returns only tasks matching the given status', () => {
  const t1 = createTask('Status filter A', undefined, { status: 'done' });
  const t2 = createTask('Status filter B', undefined, { status: 'done' });
  const t3 = createTask('Status filter C', undefined, { status: 'todo' });
  const results = listTasks({ status: 'done' });
  const ids = results.map(t => t.id);
  assert.ok(ids.includes(t1.id));
  assert.ok(ids.includes(t2.id));
  assert.ok(!ids.includes(t3.id));
  deleteTask(t1.id);
  deleteTask(t2.id);
  deleteTask(t3.id);
});

test('listTasks returns only tasks matching the given priority', () => {
  const t1 = createTask('Priority filter A', undefined, { priority: 'high' });
  const t2 = createTask('Priority filter B', undefined, { priority: 'low' });
  const results = listTasks({ priority: 'high' });
  const ids = results.map(t => t.id);
  assert.ok(ids.includes(t1.id));
  assert.ok(!ids.includes(t2.id));
  deleteTask(t1.id);
  deleteTask(t2.id);
});

test('listTasks returns only tasks matching the given category', () => {
  const t1 = createTask('Category filter A', undefined, { category: 'work' });
  const t2 = createTask('Category filter B', undefined, { category: 'personal' });
  const results = listTasks({ category: 'work' });
  const ids = results.map(t => t.id);
  assert.ok(ids.includes(t1.id));
  assert.ok(!ids.includes(t2.id));
  deleteTask(t1.id);
  deleteTask(t2.id);
});

test('listTasks applies status and priority filters together', () => {
  const a = createTask('Combined filter A', undefined, { status: 'done', priority: 'high' });
  const b = createTask('Combined filter B', undefined, { status: 'done', priority: 'low' });
  const c = createTask('Combined filter C', undefined, { status: 'todo', priority: 'high' });
  const results = listTasks({ status: 'done', priority: 'high' });
  const ids = results.map(t => t.id);
  assert.ok(ids.includes(a.id));
  assert.ok(!ids.includes(b.id));
  assert.ok(!ids.includes(c.id));
  deleteTask(a.id);
  deleteTask(b.id);
  deleteTask(c.id);
});

test('listTasks applies status, priority, and category filters together', () => {
  const a = createTask('Triple A', undefined, { status: 'done', priority: 'high', category: 'work' });
  const b = createTask('Triple B', undefined, { status: 'done', priority: 'high', category: 'personal' });
  const c = createTask('Triple C', undefined, { status: 'todo', priority: 'high', category: 'work' });
  const results = listTasks({ status: 'done', priority: 'high', category: 'work' });
  const ids = results.map(t => t.id);
  assert.ok(ids.includes(a.id));
  assert.ok(!ids.includes(b.id));
  assert.ok(!ids.includes(c.id));
  deleteTask(a.id);
  deleteTask(b.id);
  deleteTask(c.id);
});

test('listTasks sorted by priority returns high before low', () => {
  const t1 = createTask('Sort low', undefined, { priority: 'low' });
  const t2 = createTask('Sort high', undefined, { priority: 'high' });
  const results = listTasks({ sort: 'priority' });
  const positions = results.map(t => t.id);
  assert.ok(positions.indexOf(t2.id) < positions.indexOf(t1.id));
  deleteTask(t1.id);
  deleteTask(t2.id);
});

test('listTasks sorted by date returns most recent first', async () => {
  const t1 = createTask('Date sort first');
  await new Promise(r => setTimeout(r, 5));
  const t2 = createTask('Date sort second');
  const results = listTasks({ sort: 'date' });
  const positions = results.map(t => t.id);
  assert.ok(positions.indexOf(t2.id) < positions.indexOf(t1.id));
  deleteTask(t1.id);
  deleteTask(t2.id);
});

test('listTasks throws ValidationError for an invalid status filter', () => {
  assert.throws(() => listTasks({ status: 'archived' }), ValidationError);
});

test('listTasks throws ValidationError for an invalid priority filter', () => {
  assert.throws(() => listTasks({ priority: 'urgent' }), ValidationError);
});

test('listTasks throws ValidationError for an invalid category filter', () => {
  assert.throws(() => listTasks({ category: 'x'.repeat(51) }), ValidationError);
});
