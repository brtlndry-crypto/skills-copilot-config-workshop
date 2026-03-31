import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Task, generateId } from '../../src/models/task.js';
import { ValidationError } from '../../src/utils/validators.js';

// generateId
test('generateId returns a non-empty string', () => {
  const id = generateId();
  assert.equal(typeof id, 'string');
  assert.ok(id.length > 0);
});

test('generateId returns a unique value on each call', () => {
  assert.notEqual(generateId(), generateId());
});

// Task construction
test('Task constructor creates a task with default status and priority', () => {
  const task = new Task('Fix bug');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
});

test('Task constructor sets the trimmed title', () => {
  const task = new Task('  Fix bug  ');
  assert.equal(task.title, 'Fix bug');
});

test('Task constructor accepts a custom status and priority', () => {
  const task = new Task('Deploy', undefined, { status: 'in-progress', priority: 'high' });
  assert.equal(task.status, 'in-progress');
  assert.equal(task.priority, 'high');
});

test('Task constructor assigns a unique string id', () => {
  const t1 = new Task('A');
  const t2 = new Task('B');
  assert.equal(typeof t1.id, 'string');
  assert.notEqual(t1.id, t2.id);
});

test('Task constructor sets createdAt and updatedAt to the same ISO timestamp', () => {
  const task = new Task('Timestamp test');
  assert.equal(task.createdAt, task.updatedAt);
  assert.ok(!isNaN(Date.parse(task.createdAt)));
});

test('Task constructor stores the trimmed description', () => {
  const task = new Task('With desc', '  Some details  ');
  assert.equal(task.description, 'Some details');
});

test('Task constructor stores undefined when description is omitted', () => {
  const task = new Task('No desc');
  assert.equal(task.description, undefined);
});

test('Task constructor throws ValidationError for invalid status', () => {
  assert.throws(() => new Task('Bad status', undefined, { status: 'invalid' }), ValidationError);
});

test('Task constructor throws ValidationError for invalid priority', () => {
  assert.throws(() => new Task('Bad priority', undefined, { priority: 'urgent' }), ValidationError);
});

test('Task constructor throws TypeError for non-string title', () => {
  assert.throws(() => new Task(123), TypeError);
});

// Setters
test('Task setTitle updates the title and refreshes updatedAt', async () => {
  const task = new Task('Old title');
  const before = task.updatedAt;
  await new Promise(r => setTimeout(r, 5));
  task.setTitle('New title');
  assert.equal(task.title, 'New title');
  assert.ok(task.updatedAt >= before);
});

test('Task setTitle throws ValidationError for empty string', () => {
  const task = new Task('Valid');
  assert.throws(() => task.setTitle(''), ValidationError);
});

test('Task setDescription updates the description', () => {
  const task = new Task('Has desc', 'old');
  task.setDescription('new details');
  assert.equal(task.description, 'new details');
});

test('Task setDescription clears description when undefined is passed', () => {
  const task = new Task('Has desc', 'old');
  task.setDescription(undefined);
  assert.equal(task.description, undefined);
});

test('Task setStatus updates the status', () => {
  const task = new Task('Status test');
  task.setStatus('done');
  assert.equal(task.status, 'done');
});

test('Task setStatus throws ValidationError for invalid value', () => {
  const task = new Task('Status test');
  assert.throws(() => task.setStatus('archived'), ValidationError);
});

test('Task setPriority updates the priority', () => {
  const task = new Task('Priority test');
  task.setPriority('low');
  assert.equal(task.priority, 'low');
});

test('Task setPriority throws ValidationError for invalid value', () => {
  const task = new Task('Priority test');
  assert.throws(() => task.setPriority('urgent'), ValidationError);
});

// toJSON
test('Task toJSON returns a plain object with all required fields', () => {
  const task = new Task('JSON test', 'desc', { status: 'in-progress', priority: 'high' });
  const json = task.toJSON();
  assert.equal(typeof json, 'object');
  assert.equal(json.title, 'JSON test');
  assert.equal(json.description, 'desc');
  assert.equal(json.status, 'in-progress');
  assert.equal(json.priority, 'high');
  assert.equal(typeof json.id, 'string');
  assert.equal(typeof json.createdAt, 'string');
  assert.equal(typeof json.updatedAt, 'string');
});

test('Task toJSON returns a copy and does not expose the private id setter', () => {
  const task = new Task('Immutable');
  const json = task.toJSON();
  json.id = 'tampered';
  assert.notEqual(task.id, 'tampered');
});
