import { formatDate, calculateStats, isOverdue } from "./utils.js";

/*=========================================
    Render Task List
=========================================*/

export function renderTasks(tasks) {

    const taskList = document.getElementById("taskList");

    if (tasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty">
                <h2>📭 No Tasks Found</h2>
                <p>Add your first task to get started.</p>
            </div>
        `;

        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = `task-card ${task.completed ? "completed" : ""}`;

        taskCard.dataset.id = task.id;

        taskCard.innerHTML = `
        
        <div class="task-left">

            <input
                type="checkbox"
                class="complete-task"
                data-id="${task.id}"
                ${task.completed ? "checked" : ""}
            >

            <div>

                <h3>${task.title}</h3>

                <p>${task.description || ""}</p>

                <div class="task-info">

                    <span class="priority ${task.priority.toLowerCase()}">
                        ${task.priority}
                    </span>

                    <span>
                        📅 ${formatDate(task.dueDate)}
                    </span>

                    ${
                        isOverdue(task.dueDate) && !task.completed
                        ? `<span class="overdue">Overdue</span>`
                        : ""
                    }

                </div>

            </div>

        </div>

        <div class="task-actions">

            <button
                class="edit-btn"
                data-id="${task.id}"
            >
                ✏
            </button>

            <button
                class="delete-btn"
                data-id="${task.id}"
            >
                🗑
            </button>

        </div>

        `;

        taskList.appendChild(taskCard);

    });

}

/*=========================================
    Render Statistics
=========================================*/

export function renderStatistics(tasks) {

    const stats = calculateStats(tasks);

    document.getElementById("totalTasks").textContent =
        stats.total;

    document.getElementById("completedTasks").textContent =
        stats.completed;

    document.getElementById("pendingTasks").textContent =
        stats.pending;

}

/*=========================================
    Update UI
=========================================*/

export function updateUI(tasks) {

    renderTasks(tasks);

    renderStatistics(tasks);

}

/*=========================================
    Show Toast Notification
=========================================*/

export function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}