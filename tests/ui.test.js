import { TaskStore } from '../src/store';
import { mountApp, TITLE } from '../src/ui';

function memoryStorage() {
  const data = {};
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
  };
}

const q = (id) => document.querySelector(`[data-testid="${id}"]`);
const qa = (id) => Array.from(document.querySelectorAll(`[data-testid="${id}"]`));

function addTask({ title, description = '', assignee = '' }) {
  q('title-input').value = title;
  q('desc-input').value = description;
  q('assignee-input').value = assignee;
  q('task-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
}

describe('Mars mission app', () => {
  let store;
  let app;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    store = new TaskStore(memoryStorage());
    store.setCurrentUser('Ripley');
    app = mountApp(document.getElementById('app'), store, {
      imageLoader: () => Promise.resolve('mars.jpg'),
    });
  });

  test('renders a titled header', () => {
    expect(q('header').textContent).toBe(TITLE);
  });

  test('renders the hero image asynchronously', async () => {
    await app.imageReady;
    expect(q('hero').querySelector('img')).not.toBeNull();
  });

  test('shows the current user and a zero task count in the side panel', () => {
    expect(q('current-user').value).toBe('Ripley');
    expect(q('task-count').textContent).toBe('0');
    expect(q('empty-state')).not.toBeNull();
  });

  test('creates a task and updates the list and count', () => {
    addTask({ title: 'Fix rover', description: 'Left wheel', assignee: 'Mark' });
    expect(qa('task-item')).toHaveLength(1);
    const item = q('task-item');
    expect(item.textContent).toContain('Fix rover');
    expect(item.textContent).toContain('Left wheel');
    expect(item.textContent).toContain('Created by Ripley');
    expect(item.textContent).toContain('Assigned to Mark');
    expect(q('task-count').textContent).toBe('1');
    expect(q('title-input').value).toBe('');
  });

  test('shows a validation error when the title is missing', () => {
    addTask({ title: '  ' });
    expect(q('form-error').textContent).toMatch(/title/i);
    expect(qa('task-item')).toHaveLength(0);
  });

  test('edits an existing task', () => {
    addTask({ title: 'Old title', assignee: 'A' });
    q('edit-task').click();
    expect(q('title-input').value).toBe('Old title');
    expect(q('submit-task').textContent).toBe('Save changes');

    q('title-input').value = 'New title';
    q('assignee-input').value = 'B';
    q('task-form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    expect(qa('task-item')).toHaveLength(1);
    expect(q('task-item').textContent).toContain('New title');
    expect(q('task-item').textContent).toContain('Assigned to B');
    expect(q('submit-task').textContent).toBe('Add task');
  });

  test('deletes a single task', () => {
    addTask({ title: 'One' });
    addTask({ title: 'Two' });
    expect(q('task-count').textContent).toBe('2');
    qa('delete-task')[0].click();
    expect(qa('task-item')).toHaveLength(1);
    expect(q('task-item').textContent).toContain('Two');
    expect(q('task-count').textContent).toBe('1');
  });

  test('delete-all button clears every task after confirmation', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    addTask({ title: 'One' });
    addTask({ title: 'Two' });
    q('delete-all').click();
    expect(qa('task-item')).toHaveLength(0);
    expect(q('task-count').textContent).toBe('0');
    expect(q('delete-all').disabled).toBe(true);
  });

  test('delete-all keeps tasks if the user cancels', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    addTask({ title: 'One' });
    q('delete-all').click();
    expect(qa('task-item')).toHaveLength(1);
  });

  test('changing the current user applies to new tasks', () => {
    const input = q('current-user');
    input.value = 'Bishop';
    input.dispatchEvent(new Event('input', { bubbles: true })); 
    addTask({ title: 'Reboot' });
    expect(q('task-item').textContent).toContain('Created by Bishop');
  });

  test('header is styled to stay fixed while scrolling', () => {
    // The sticky rule lives in the stylesheet; assert it so a regression is caught.
    const css = require('fs').readFileSync(require('path').join(__dirname, '../src/styles.css'), 'utf8');
    expect(css).toMatch(/\.header\s*{[^}]*position:\s*sticky/);
    expect(css).toMatch(/\.header\s*{[^}]*background/);
  });
});
