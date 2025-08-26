const API_BASE = "http://todo-backend-service:80/api/todo";

// --- DOM elements ---
const listEl = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const stats = document.getElementById("stats");

// --- State ---
let TODOS = [];

// --- Helper functions ---
function updateStats() {
  const total = TODOS.length;
  const done = TODOS.filter(t => t.isCompleted).length;
  stats.textContent = `${total} tasks • ${done} done`;
}

function createTodoElement(item) {
  const li = document.createElement("li");
  li.className = `todo-item${item.isCompleted ? " done" : ""}`;
  li.dataset.id = item.id;

  const left = document.createElement("div");
  left.className = "left";

  const check = document.createElement("button");
  check.className = "check";
  check.innerHTML = `<div class="burst"></div><svg viewBox="0 0 24 24"><use href="#check"></use></svg>`;
  left.appendChild(check);

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = item.title;

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `#${item.id}`;

  left.appendChild(title);
  left.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "actions";

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.title = "Delete";
  delBtn.textContent = "🗑";
  actions.appendChild(delBtn);

  li.appendChild(left);
  li.appendChild(actions);

  // --- Interactions ---
  let clickTimeout = null;

  // single/double click handling
  li.addEventListener("click", async (e) => {
    if (e.detail === 2) { // double click
      if (clickTimeout) clearTimeout(clickTimeout);
      clickTimeout = null;
      if (!confirm("Delete this task?")) return;
      await deleteTodo(item.id);
      return;
    }

    if (clickTimeout) clearTimeout(clickTimeout);
    clickTimeout = setTimeout(async () => {
      li.classList.add("burst");
      setTimeout(() => li.classList.remove("burst"), 700);
      await toggleComplete(item);
      clickTimeout = null;
    }, 250);
  });

  delBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    if (!confirm("Delete this task?")) return;
    await deleteTodo(item.id);
  });

  return li;
}

function render() {
  listEl.innerHTML = "";
  if (TODOS.length === 0) {
    listEl.innerHTML = `<div class="empty">No tasks yet — add your first one!</div>`;
  } else {
    TODOS.forEach(item => listEl.appendChild(createTodoElement(item)));
  }
  updateStats();
}

// --- API calls ---
async function fetchTodos() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to load");
    TODOS = await res.json();
    render();
  } catch (err) {
    console.error(err);
    listEl.innerHTML = `<div class="empty">Could not load tasks. Make sure the backend is running.</div>`;
  }
}

async function addTodo(title) {
  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, isCompleted: false })
  });
  await fetchTodos();
}

async function toggleComplete(item) {
  await fetch(`${API_BASE}/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...item, isCompleted: !item.isCompleted })
  });
  await fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  await fetchTodos();
}

// --- Event listeners ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;

  input.disabled = true;
  try {
    await addTodo(val);
    input.value = "";
  } catch (err) {
    console.error(err);
    alert("Failed to add task");
  } finally {
    input.disabled = false;
  }
});

// --- Init ---
fetchTodos();