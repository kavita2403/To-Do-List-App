let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let dragIndex = null;

function renderTasks(filter = "all") {
  const list = document.getElementById("task-list");
  list.innerHTML = "";
  tasks.forEach((task, index) => {
    if (filter !== "all" && filter !== task.status) return;
    const li = document.createElement("li");
    li.className = "task-item" + (task.status === "done" ? " done" : "");
    li.setAttribute("draggable", "true");
    li.setAttribute("data-index", index);
    li.innerHTML = `
      <div onclick="editTask(${index})">
        <strong>${task.title}</strong><br>
        <small>${task.due}</small>
      </div>
      <div>
        <input type="checkbox" ${task.status === "done" ? "checked" : ""} onchange="toggleStatus(${index})" />
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>`;
    li.ondragstart = () => dragIndex = index;
    li.ondrop = () => dropTask(index);
    list.appendChild(li);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("add-btn").onclick = () => {
  const title = document.getElementById("task-input").value.trim();
  const due = document.getElementById("task-date").value;
  if (!title || !due) return alert("Enter title and date!");
  tasks.push({ title, due, status: "pending" });
  renderTasks();
  document.getElementById("task-input").value = "";
  document.getElementById("task-date").value = "";
};

function editTask(index) {
  const task = tasks[index];
  const newTitle = prompt("Edit task title:", task.title);
  const newDue = prompt("Edit due date:", task.due);
  if (newTitle !== null && newDue !== null) {
    tasks[index].title = newTitle.trim() || task.title;
    tasks[index].due = newDue || task.due;
    renderTasks();
  }
}

function toggleStatus(index) {
  tasks[index].status = tasks[index].status === "done" ? "pending" : "done";
  renderTasks();
}

function addTask() {
    const taskText = document.getElementById('taskTitle').value;
    const taskList = document.getElementById('task-list');

    const newTask = document.createElement('div');
    newTask.style.color = '#FFFFFF'; // Set task text to white
    newTask.innerText = taskText;

    taskList.appendChild(newTask);
}


function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function dropTask(targetIndex) {
  if (dragIndex === null) return;
  const draggedTask = tasks.splice(dragIndex, 1)[0];
  tasks.splice(targetIndex, 0, draggedTask);
  dragIndex = null;
  renderTasks();
}

function allowDrop(event) {
  event.preventDefault();
}

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.onclick = () => renderTasks(btn.dataset.filter);
});

document.getElementById("theme-switch").onchange = (e) => {
  document.body.classList.toggle("dark", e.target.checked);
  localStorage.setItem("theme", e.target.checked ? "dark" : "light");
};

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("theme-switch").checked = true;
  }
  renderTasks();
};

