import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ValidationError,
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateCategory,
  validateId,
} from '../../src/utils/validators.js';

// ValidationError
test('ValidationError is an instance of Error', () => {
  const err = new ValidationError('oops');
  assert.ok(err instanceof Error);
  assert.equal(err.name, 'ValidationError');
  assert.equal(err.message, 'oops');
});

// validateTitle
test('validateTitle returns the trimmed title', () => {
  assert.equal(validateTitle('  Buy groceries  '), 'Buy groceries');
});

test('validateTitle accepts a title at the maximum length', () => {
  const title = 'a'.repeat(200);
  assert.equal(validateTitle(title), title);
});

test('validateTitle throws TypeError when value is not a string', () => {
  assert.throws(() => validateTitle(42), TypeError);
});

test('validateTitle throws ValidationError for empty string', () => {
  assert.throws(() => validateTitle('   '), ValidationError);
});

test('validateTitle throws ValidationError when title exceeds 200 characters', () => {
  assert.throws(() => validateTitle('a'.repeat(201)), ValidationError);
});

// validateDescription
test('validateDescription returns undefined when value is undefined', () => {
  assert.equal(validateDescription(undefined), undefined);
});

test('validateDescription returns undefined when value is null', () => {
  assert.equal(validateDescription(null), undefined);
});

test('validateDescription returns undefined for whitespace-only string', () => {
  assert.equal(validateDescription('   '), undefined);
});

test('validateDescription returns the trimmed description', () => {
  assert.equal(validateDescription('  Details  '), 'Details');
});

test('validateDescription throws TypeError when value is not a string', () => {
  assert.throws(() => validateDescription(123), TypeError);
});

test('validateDescription throws ValidationError when description exceeds 1000 characters', () => {
  assert.throws(() => validateDescription('x'.repeat(1001)), ValidationError);
});

// validateStatus
test('validateStatus returns "todo" for valid input', () => {
  assert.equal(validateStatus('todo'), 'todo');
});

test('validateStatus returns "in-progress" for valid input', () => {
  assert.equal(validateStatus('in-progress'), 'in-progress');
});

test('validateStatus returns "done" for valid input', () => {
  assert.equal(validateStatus('done'), 'done');
});

test('validateStatus normalizes value to lowercase', () => {
  assert.equal(validateStatus('IN-PROGRESS'), 'in-progress');
});

test('validateStatus trims surrounding whitespace', () => {
  assert.equal(validateStatus('  done  '), 'done');
});

test('validateStatus throws TypeError when value is not a string', () => {
  assert.throws(() => validateStatus(true), TypeError);
});

test('validateStatus throws ValidationError for an unknown status', () => {
  assert.throws(() => validateStatus('pending'), ValidationError);
});

// validatePriority
test('validatePriority returns "low" for valid input', () => {
  assert.equal(validatePriority('low'), 'low');
});

test('validatePriority returns "medium" for valid input', () => {
  assert.equal(validatePriority('medium'), 'medium');
});

test('validatePriority returns "high" for valid input', () => {
  assert.equal(validatePriority('high'), 'high');
});

test('validatePriority normalizes value to lowercase', () => {
  assert.equal(validatePriority('HIGH'), 'high');
});

test('validatePriority trims surrounding whitespace', () => {
  assert.equal(validatePriority('  medium  '), 'medium');
});

test('validatePriority throws TypeError when value is not a string', () => {
  assert.throws(() => validatePriority(1), TypeError);
});

test('validatePriority throws ValidationError for an unknown priority', () => {
  assert.throws(() => validatePriority('critical'), ValidationError);
});

// validateCategory
test('validateCategory returns "general" when value is undefined', () => {
  assert.equal(validateCategory(undefined), 'general');
});

test('validateCategory returns "general" when value is null', () => {
  assert.equal(validateCategory(null), 'general');
});

test('validateCategory returns the normalized lowercase category', () => {
  assert.equal(validateCategory('Work'), 'work');
});

test('validateCategory normalizes uppercase categories', () => {
  assert.equal(validateCategory('PERSONAL'), 'personal');
});

test('validateCategory trims surrounding whitespace', () => {
  assert.equal(validateCategory('  urgent  '), 'urgent');
});

test('validateCategory accepts a single-character category', () => {
  assert.equal(validateCategory('a'), 'a');
});

test('validateCategory accepts a category at the maximum length', () => {
  const category = 'x'.repeat(50);
  assert.equal(validateCategory(category), category);
});

test('validateCategory throws TypeError when value is not a string, null, or undefined', () => {
  assert.throws(() => validateCategory(123), TypeError);
});

test('validateCategory throws TypeError for boolean values', () => {
  assert.throws(() => validateCategory(true), TypeError);
});

test('validateCategory throws ValidationError when category is empty string', () => {
  assert.throws(() => validateCategory(''), ValidationError);
});

test('validateCategory throws ValidationError when category is whitespace-only', () => {
  assert.throws(() => validateCategory('   '), ValidationError);
});

test('validateCategory throws ValidationError when category exceeds 50 characters', () => {
  assert.throws(() => validateCategory('x'.repeat(51)), ValidationError);
});

// validateId
test('validateId returns the trimmed id', () => {
  assert.equal(validateId('  abc-123  '), 'abc-123');
});

test('validateId throws TypeError when value is not a string', () => {
  assert.throws(() => validateId(null), TypeError);
});

test('validateId throws ValidationError for an empty string', () => {
  assert.throws(() => validateId('   '), ValidationError);
});
