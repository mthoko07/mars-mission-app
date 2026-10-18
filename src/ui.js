import { renderMarsImage } from './image';

const el = (tag, props = {}, ...children) => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
    else node.setAttribute(key, value);
  });
  children.flat().forEach((c) => c && node.appendChild(c));
  return node;
};

export const TITLE = 'Houston, We Have a To-Do List';

/**
 * Builds the whole application inside `root` and wires it to `store`.
 * Returns a small handle that is handy for tests.
 */
export function mountApp(root, store, { imageLoader } = {}) {
  root.innerHTML = '';
  let editingId = null;

  // ---- Header (sticky via CSS) ----
  const header = el(
    'header',
    { class: 'header', 'data-testid': 'header' },
    el('h1', { class: 'header__title', text: TITLE })
  );

  // ---- Hero image ----
  const hero = el('section', { class: 'hero', 'data-testid': 'hero', 'aria-label': 'Mars' });

  // ---- Side panel ----
  const userInput = el('input', {
    id: 'current-user',
    class: 'input',
    value: store.currentUser,
    'data-testid': 'current-user',
    onchange: (e) => store.setCurrentUser(e.target.value),
  });
  const countValue = el('strong', { class: 'panel__count', 'data-testid': 'task-count', text: '0' });
  const deleteAllBtn = el('button', {
    class: 'btn btn--danger',
    type: 'button',
    'data-testid': 'delete-all',
    text: 'Delete all tasks',
    onclick: () => {
      if (store.count() === 0) return;
      if (window.confirm('Jettison every task? This cannot be undone.')) store.clear();
    },
  });
  const panel = el(
    'aside',
    { class: 'panel', 'data-testid': 'side-panel' },
    el('h2', { class: 'panel__heading', text: 'Crew Console' }),
    el('label', { for: 'current-user', class: 'label', text: 'Current user' }),
    userInput,
    el('p', { class: 'panel__stat' }, document.createTextNode('Tasks on board: '), countValue),
    deleteAllBtn
  );

  // ---- Form ----
  const titleInput = el('input', { id: 'task-title', class: 'input', required: 'required', placeholder: 'e.g. Pack more oxygen', 'data-testid': 'title-input' });
  const descInput = el('textarea', { id: 'task-desc', class: 'input', rows: '3', placeholder: 'What needs doing?', 'data-testid': 'desc-input' });
  const assigneeInput = el('input', { id: 'task-assignee', class: 'input', placeholder: 'Who is on it?', 'data-testid': 'assignee-input' });
  const formError = el('p', { class: 'form__error', role: 'alert', 'data-testid': 'form-error' });
  const submitBtn = el('button', { class: 'btn btn--primary', type: 'submit', 'data-testid': 'submit-task', text: 'Add task' });
  const cancelBtn = el('button', { class: 'btn', type: 'button', 'data-testid': 'cancel-edit', text: 'Cancel', hidden: 'hidden', onclick: () => resetForm() });
  const form = el(
    'form',
    { class: 'form', 'data-testid': 'task-form', novalidate: 'novalidate' },
    el('h2', { class: 'form__heading', text: 'New mission task' }),
    el('label', { for: 'task-title', class: 'label', text: 'Title' }),
    titleInput,
    el('label', { for: 'task-desc', class: 'label', text: 'Description' }),
    descInput,
    el('label', { for: 'task-assignee', class: 'label', text: 'Assigned to' }),
    assigneeInput,
    formError,
    el('div', { class: 'form__actions' }, submitBtn, cancelBtn)
  );

  function resetForm() {
    editingId = null;
    form.reset();
    formError.textContent = '';
    submitBtn.textContent = 'Add task';
    form.querySelector('.form__heading').textContent = 'New mission task';
    cancelBtn.hidden = true;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const data = { title: titleInput.value, description: descInput.value, assignee: assigneeInput.value };
      if (editingId) store.update(editingId, data);
      else store.create(data);
      resetForm();
    } catch (err) {
      formError.textContent = err.message;
    }
  });

  function startEdit(task) {
    editingId = task.id;
    titleInput.value = task.title;
    descInput.value = task.description;
    assigneeInput.value = task.assignedTo === 'Unassigned' ? '' : task.assignedTo;
    submitBtn.textContent = 'Save changes';
    form.querySelector('.form__heading').textContent = 'Edit task';
    cancelBtn.hidden = false;
    titleInput.focus();
  }

  // ---- Task list ----
  const list = el('ul', { class: 'tasks', 'data-testid': 'task-list' });

  function renderList(tasks) {
    list.innerHTML = '';
    if (tasks.length === 0) {
      list.appendChild(el('li', { class: 'tasks__empty', 'data-testid': 'empty-state', text: 'No tasks yet. The void is very quiet.' }));
      return;
    }
    tasks.forEach((task) => {
      list.appendChild(
        el(
          'li',
          { class: 'task', 'data-testid': 'task-item', 'data-id': task.id },
          el('h3', { class: 'task__title', text: task.title }),
          task.description ? el('p', { class: 'task__desc', text: task.description }) : null,
          el(
            'p',
            { class: 'task__meta' },
            el('span', { text: `Created by ${task.createdBy}` }),
            el('span', { text: `Assigned to ${task.assignedTo}` })
          ),
          el(
            'div',
            { class: 'task__actions' },
            el('button', { class: 'btn', type: 'button', 'data-testid': 'edit-task', text: 'Edit', onclick: () => startEdit(task) }),
            el('button', {
              class: 'btn btn--danger',
              type: 'button',
              'data-testid': 'delete-task',
              text: 'Delete',
              onclick: () => {
                if (editingId === task.id) resetForm();
                store.remove(task.id);
              },
            })
          )
        )
      );
    });
  }

  function render(tasks) {
    countValue.textContent = String(tasks.length);
    deleteAllBtn.disabled = tasks.length === 0;
    if (document.activeElement !== userInput) userInput.value = store.currentUser;
    renderList(tasks);
  }

  const main = el('main', { class: 'main' }, form, el('section', { class: 'board' }, el('h2', { class: 'board__heading', text: 'Mission tasks' }), list));
  root.append(header, hero, el('div', { class: 'layout' }, panel, main));

  store.subscribe(render);
  render(store.getAll());

  const imageReady = renderMarsImage(hero, undefined, imageLoader);

  return { imageReady, header, hero, panel, form, list };
}
