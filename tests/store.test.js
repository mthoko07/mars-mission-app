import { TaskStore, DEFAULT_USER } from '../src/store';

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
    _data: data,
  };
}

describe('TaskStore', () => {
  let store;
  beforeEach(() => {
    store = new TaskStore(memoryStorage());
  });

  test('starts empty', () => {
    expect(store.count()).toBe(0);
    expect(store.getAll()).toEqual([]);
  });

  test('creates a task with title, description, creator and assignee', () => {
    store.setCurrentUser('Ripley');
    const task = store.create({ title: 'Check airlock', description: 'Twice', assignee: 'Bishop' });
    expect(task).toMatchObject({
      title: 'Check airlock',
      description: 'Twice',
      createdBy: 'Ripley',
      assignedTo: 'Bishop',
    });
    expect(task.id).toBeTruthy();
    expect(store.count()).toBe(1);
  });

  test('rejects a task without a title', () => {
    expect(() => store.create({ title: '   ' })).toThrow('title');
    expect(store.count()).toBe(0);
  });

  test('defaults to Unassigned when no assignee is given', () => {
    expect(store.create({ title: 'Solo job' }).assignedTo).toBe('Unassigned');
  });

  test('updates a task', () => {
    const { id } = store.create({ title: 'Old', assignee: 'A' });
    const updated = store.update(id, { title: 'New', description: 'Desc', assignee: 'B' });
    expect(updated).toMatchObject({ title: 'New', description: 'Desc', assignedTo: 'B' });
    expect(store.get(id).title).toBe('New');
  });

  test('update keeps the original creator', () => {
    store.setCurrentUser('Alice');
    const { id } = store.create({ title: 'T' });
    store.setCurrentUser('Bob');
    expect(store.update(id, { title: 'T2' }).createdBy).toBe('Alice');
  });

  test('update rejects an empty title and unknown ids', () => {
    const { id } = store.create({ title: 'T' });
    expect(() => store.update(id, { title: '' })).toThrow('title');
    expect(() => store.update('nope', { title: 'x' })).toThrow('No task');
  });

  test('removes a single task', () => {
    const a = store.create({ title: 'A' });
    store.create({ title: 'B' });
    expect(store.remove(a.id)).toBe(true);
    expect(store.getAll().map((t) => t.title)).toEqual(['B']);
    expect(store.remove(a.id)).toBe(false);
  });

  test('clear deletes every task', () => {
    store.create({ title: 'A' });
    store.create({ title: 'B' });
    store.clear();
    expect(store.count()).toBe(0);
  });

  test('persists tasks and the current user to storage', () => {
    const storage = memoryStorage();
    const first = new TaskStore(storage);
    first.setCurrentUser('Watney');
    first.create({ title: 'Grow potatoes' });
    const second = new TaskStore(storage);
    expect(second.count()).toBe(1);
    expect(second.currentUser).toBe('Watney');
  });

  test('survives corrupt storage data', () => {
    const storage = memoryStorage({ 'mars.tasks': '{not json' });
    expect(new TaskStore(storage).count()).toBe(0);
  });

  test('falls back to the default user when given a blank name', () => {
    store.setCurrentUser('   ');
    expect(store.currentUser).toBe(DEFAULT_USER);
  });

  test('notifies subscribers and supports unsubscribe', () => {
    const fn = jest.fn();
    const off = store.subscribe(fn);
    store.create({ title: 'A' });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0][0]).toHaveLength(1);
    off();
    store.create({ title: 'B' });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
