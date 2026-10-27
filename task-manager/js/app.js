import {
    loadTasks,
    saveTasks
} from "./storage.js";

import {
    generateID,
    validateTask,
    searchTasks,
    filterTasks
} from "./utils.js";

import {
    updateUI,
    showToast
} from "./ui.js";

/* ==============================
    App State
============================== */

let tasks = loadTasks();
let currentFilter = "all";

/* ==============================
    DOM Elements
============================== */

const taskForm = document.getElementById("taskForm");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const filterButtons = document.querySelectorAll(".filter");

function render() {

    let filteredTasks = filterTasks(tasks, currentFilter);

    filteredTasks = searchTasks(filteredTasks, searchInput.value);

    updateUI(filteredTasks);

}

/* ==============================
    Initial Render
============================== */

render();

/* ==============================
    Add Task
============================== */

taskForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const dueDate = document.getElementById("taskDate").value;
    const priority = document.getElementById("taskPriority").value;

    const validation = validateTask(title);

    if (!validation.valid) {
        showToast(validation.message, "error");
        return;
    }

    const task = {
        id: generateID(),
        title,
        description,
        dueDate,
        priority,
        completed: false
    };

    tasks.unshift(task);

    saveTasks(tasks);

    render();
    taskForm.reset();

    showToast("Task Added Successfully");
});

/* ==============================
    Edit / Delete / Complete
============================== */

document.addEventListener("click", (e) => {

    // ================= EDIT =================

    if (e.target.classList.contains("edit-btn")) {

        const id = Number(e.target.dataset.id);

        const task = tasks.find(task => task.id === id);

        if (!task) return;

        const newTitle = prompt("Task Title", task.title);

        if (newTitle === null) return;

        const newDescription = prompt(
            "Description",
            task.description
        );

        const newPriority = prompt(
            "Priority (High/Medium/Low)",
            task.priority
        );

        task.title = newTitle.trim() || task.title;
        task.description = newDescription ?? task.description;
        task.priority = newPriority || task.priority;

        saveTasks(tasks);

        updateUI(tasks);

        showToast("Task Updated Successfully");

        return;
    }

    // ================= DELETE =================

    if (e.target.classList.contains("delete-btn")) {

        const id = Number(e.target.dataset.id);

        tasks = tasks.filter(task => task.id !== id);

        saveTasks(tasks);

        updateUI(tasks);

        showToast("Task Deleted");

        return;
    }

    // ================= COMPLETE =================

    if (e.target.classList.contains("complete-task")) {

        const id = Number(e.target.dataset.id);

        tasks = tasks.map(task => {

            if (task.id === id) {
                task.completed = !task.completed;
            }

            return task;

        });

        saveTasks(tasks);

        updateUI(tasks);

    }

});


      

/* ==============================
    Search
============================== */

searchInput.addEventListener("input", () => {

    render();

});

/* ==============================
    Filters
============================== */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelector(".filter.active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        render();

    });

});

/* ==============================
    Dark Mode
============================== */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark")
            ? "dark"
            : "light"

    );

});

/* ==============================
    Keyboard Shortcut
============================== */

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key === "n") {

        e.preventDefault();

        document.getElementById("taskTitle").focus();

    }

});