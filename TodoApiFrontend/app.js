const API_BASE = "http://todo-backend-service/api/todo";
const listEl = document.getElementById("todo-list");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const stats = document.getElementById("stats");

let TODOS = [];

// helper: show stats
function updateStats() {
  const total = TODOS.length;
  const done = TODOS.filter(t => t.isCompleted).length;
  stats.textContent = `${total} tasks • ${done} done`;
}

// render the list
function render() {
  listEl.innerHTML = "";
  if (TODOS.length === 0) {
    listEl.innerHTML = `<div class="empty">No tasks yet — add your first one!</div>`;
    updateStats();
    return;
  }

  TODOS.forEach(item => {
    const li = document.createElement("li");
    li.className = "todo-item" + (item.isCompleted ? " done" : "");
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
    delBtn.innerHTML = "🗑";
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);

    // --- interactions ---
    let clickTimeout = null;

    li.addEventListener("click", async (e) => {
      // If this is the second click (double-click), delete and cancel single-click action
      if (e.detail === 2) {
        if (clickTimeout !== null) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }
        if (!confirm("Delete this task?")) return;
        await deleteTodo(item.id);
        return;
      }

      // Handle single click with a short delay to allow double-click detection
      if (clickTimeout !== null) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
      }
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

    listEl.appendChild(li);
  });

  updateStats();
}

// fetch all
async function fetchTodos() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("Failed to load");
    TODOS = await res.json();
    render();
  } catch (e) {
    console.error(e);
    listEl.innerHTML = `<div class="empty">Could not load tasks. Make sure the backend is running.</div>`;
  }
}

// add
form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  input.disabled = true;
  try {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: val, isCompleted: false })
    });
    input.value = "";
    await fetchTodos();
  } catch (e) { console.error(e); alert("Failed to add"); }
  finally { input.disabled = false; }
});

// toggle complete
async function toggleComplete(item) {
  try {
    await fetch(`${API_BASE}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, title: item.title, isCompleted: !item.isCompleted })
    });
    await fetchTodos();
  } catch (e) { console.error(e); alert("Failed to update"); }
}

// delete
async function deleteTodo(id) {
  try {
    await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    await fetchTodos();
  } catch (e) { console.error(e); alert("Failed to delete"); }
}

// init
fetchTodos();