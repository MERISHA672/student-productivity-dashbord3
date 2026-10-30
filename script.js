let tasks = JSON.parse(localStorage.getItem("studyflow_tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const notesBox = document.getElementById("notesBox");

notesBox.value = localStorage.getItem("studyflow_notes") || "";

function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    taskInput.value = "";

    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.className = task.completed
            ? "task completed"
            : "task";

        li.innerHTML = `
            <span>${escapeHTML(task.text)}</span>

            <div class="task-actions">
                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "Undo" : "Complete"}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

function saveTasks() {
    localStorage.setItem(
        "studyflow_tasks",
        JSON.stringify(tasks)
    );
}

function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("taskCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("progress").textContent = `${percentage}%`;
}

function saveNotes() {
    localStorage.setItem(
        "studyflow_notes",
        notesBox.value
    );

    document.getElementById("saveMessage").textContent =
        "Notes saved successfully!";
}

function scrollToTasks() {
    document.getElementById("tasks").scrollIntoView({
        behavior: "smooth"
    });
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

displayTasks();
