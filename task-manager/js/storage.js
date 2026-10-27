

const STORAGE_KEY = "taskManagerTasks";

/**
 * Save all tasks to localStorage
 * @param {Array} tasks
 */
export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks:", error);
    }
}

/**
 * Load tasks from localStorage
 * @returns {Array}
 */
export function loadTasks() {
    try {
        const tasks = localStorage.getItem(STORAGE_KEY);

        return tasks ? JSON.parse(tasks) : [];

    } catch (error) {
        console.error("Error loading tasks:", error);
        return [];
    }
}

/**
 * Remove every task
 */
export function clearAllTasks() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error(error);
    }
}

/**
 * Remove completed tasks
 * @param {Array} tasks
 * @returns {Array}
 */
export function clearCompletedTasks(tasks) {

    const activeTasks = tasks.filter(task => !task.completed);

    saveTasks(activeTasks);

    return activeTasks;
}

/**
 * Export Tasks as JSON
 */
export function exportTasks(tasks) {

    const data = JSON.stringify(tasks, null, 2);

    const blob = new Blob([data], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "tasks-backup.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

/**
 * Import Tasks
 * @param {File} file
 * @returns {Promise<Array>}
 */
export function importTasks(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = (event) => {

            try {

                const importedTasks = JSON.parse(event.target.result);

                saveTasks(importedTasks);

                resolve(importedTasks);

            } catch (error) {

                reject("Invalid JSON File");

            }

        };

        reader.onerror = () => reject("Unable to read file");

        reader.readAsText(file);

    });

}