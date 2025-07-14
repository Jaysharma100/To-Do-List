const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos-v1') || '[]');

function saveTodos() {
  localStorage.setItem('todos-v1', JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener('change', () => {
      todos[idx].completed = !todos[idx].completed;
      saveTodos();
      renderTodos();
    });

    // Description or editing input
    let descEl;
    if (todo.editing) {
      descEl = document.createElement('input');
      descEl.type = 'text';
      descEl.className = 'edit-input';
      descEl.value = todo.desc;
      descEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') finishEdit(idx, descEl.value.trim());
        if (e.key === 'Escape') cancelEdit(idx);
      });
      setTimeout(() => descEl.focus(), 10);
    } else {
      descEl = document.createElement('span');
      descEl.className = 'desc';
      descEl.textContent = todo.desc;
    }

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.textContent = todo.editing ? 'Save' : 'Edit';
    editBtn.addEventListener('click', () => {
      if (todo.editing) finishEdit(idx, descEl.value.trim());
      else startEdit(idx);
    });

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      if (confirm('Delete this task?')) {
        todos.splice(idx, 1);
        saveTodos();
        renderTodos();
      }
    });

    li.appendChild(checkbox);
    li.appendChild(descEl);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });
}

function startEdit(idx) {
  todos.forEach((t, i) => t.editing = i === idx); // Only one can be in editing state
  saveTodos();
  renderTodos();
}

function finishEdit(idx, newDesc) {
  if (!newDesc) {
    alert('Task cannot be empty.');
    return;
  }
  todos[idx].desc = newDesc;
  todos[idx].editing = false;
  saveTodos();
  renderTodos();
}

function cancelEdit(idx) {
  todos[idx].editing = false;
  saveTodos();
  renderTodos();
}

// Add new task
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) {
    input.classList.add('error');
    input.placeholder = "Please enter a task!";
    setTimeout(() => {
      input.classList.remove('error');
      input.placeholder = "Add a new task...";
    }, 1200);
    return;
  }
  todos.unshift({ desc: val, completed: false });
  saveTodos();
  input.value = '';
  renderTodos();
});

// Initial render
renderTodos();
