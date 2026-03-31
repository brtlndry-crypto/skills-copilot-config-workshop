import {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
  listTasks,
} from './services/taskService.js';

console.log('=== Task Manager Demo ===\n');

// --- Create tasks ---
console.log('--- Creating tasks ---');
const task1 = createTask('Buy groceries', 'Milk, eggs, and bread', { priority: 'high' });
console.log('Created:', task1);

const task2 = createTask('Write report', 'Q1 financial summary', { status: 'in-progress', priority: 'medium' });
console.log('Created:', task2);

const task3 = createTask('  Call dentist  ', 'Schedule annual check-up', { priority: 'low' });
console.log('Created (title trimmed):', task3);

// --- Get a task by ID ---
console.log('\n--- Getting task by ID ---');
const fetched = getTask(task1.id);
console.log('Fetched:', fetched);

// --- List all tasks ---
console.log('\n--- All tasks ---');
const all = getAllTasks();
console.log(`Total: ${all.length} tasks`);
all.forEach(t => console.log(` [${t.priority}] ${t.title} — ${t.status}`));

// --- Filter by status ---
console.log('\n--- Filter: status = in-progress ---');
const inProgress = listTasks({ status: 'in-progress' });
inProgress.forEach(t => console.log(` ${t.title}`));

// --- Sort by priority (high → low) ---
console.log('\n--- Sorted by priority ---');
const byPriority = listTasks({ sort: 'priority' });
byPriority.forEach(t => console.log(` [${t.priority}] ${t.title}`));

// --- Update a task ---
console.log('\n--- Updating task ---');
const updated = updateTask(task1.id, { status: 'done', title: 'Buy groceries (done)' });
console.log('Updated:', updated);

// --- Delete a task ---
console.log('\n--- Deleting task ---');
const deleted = deleteTask(task3.id);
console.log('Deleted:', deleted.title);
console.log(`Remaining tasks: ${getAllTasks().length}`);

// --- Error handling ---
console.log('\n--- Error handling ---');

try {
  getTask('nonexistent-id');
} catch (err) {
  console.error(`Caught ${err.name}: ${err.message}`);
}

try {
  createTask('');
} catch (err) {
  console.error(`Caught ${err.name}: ${err.message}`);
}

try {
  createTask(42);
} catch (err) {
  console.error(`Caught ${err.name}: ${err.message}`);
}

try {
  updateTask(task2.id, { status: 'flying' });
} catch (err) {
  console.error(`Caught ${err.name}: ${err.message}`);
}

console.log('\n=== Demo complete ===');
