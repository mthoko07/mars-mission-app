const TASKS_KEY = 'mars.tasks';
const USER_KEY = 'mars.currentUser';
export const DEFAULT_USER = 'Mission Commander';

function safeStorage() {
  try {
    return window.localStorage;
  } catch (e) {
    return null;
  }
}

function makeId() {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Holds tasks in memory and persists them to localStorage so they
 * survive a page refresh. Subscribers are notified after every change.
 */
export class TaskStore {
  constructor(storage = safeStorage()) {
    this.storage = storage;
    this.listeners = new Set();
    this.tasks = this._load();
    this.currentUser = (storage && storage.getItem(USER_KEY)) || DEFAULT_USER;
  }

  _load() {
    if (!this.storage) return [];
    try {
      const parsed = JSON.parse(this.storage.getItem(TASKS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  _commit() {
    if (this.storage) this.storage.setItem(TASKS_KEY, JSON.stringify(this.tasks));
    this.listeners.forEach((fn) => fn(this.getAll()));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getAll() {
    return this.tasks.map((t) => ({ ...t }));
  }

  get(id) {
    const task = this.tasks.find((t) => t.id === id);
    return task ? { ...task } : undefined;
  }

  count() {
    return this.tasks.length;
  }

  create({ title, description = '', assignee = '' }) {
    const cleanTitle = (title || '').trim();
    if (!cleanTitle) throw new Error('A task needs a title');
    const task = {
      id: makeId(),
      title: cleanTitle,
      description: description.trim(),
      createdBy: this.currentUser,
      assignedTo: assignee.trim() || 'Unassigned',
      createdAt: Date.now(),
    };
    this.tasks.push(task);
    this._commit();
    return { ...task };
  }

  update(id, changes) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) throw new Error(`No task with id ${id}`);
    if (changes.title !== undefined) {
      const cleanTitle = changes.title.trim();
      if (!cleanTitle) throw new Error('A task needs a title');
      task.title = cleanTitle;
    }
    if (changes.description !== undefined) task.description = changes.description.trim();
    if (changes.assignee !== undefined) task.assignedTo = changes.assignee.trim() || 'Unassigned';
    this._commit();
    return { ...task };
  }

  remove(id) {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    if (this.tasks.length === before) return false;
    this._commit();
    return true;
  }

  clear() {
    this.tasks = [];
    this._commit();
  }

  setCurrentUser(name) {
    this.currentUser = (name || '').trim() || DEFAULT_USER;
    if (this.storage) this.storage.setItem(USER_KEY, this.currentUser);
    this.listeners.forEach((fn) => fn(this.getAll()));
  }
}
