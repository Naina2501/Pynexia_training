/**
 * Generate Unique Task ID
 */
export function generateID() {
    return Date.now() + Math.floor(Math.random() * 1000);
}

/**
 * Format Date
 */
export function formatDate(date) {

    if (!date) return "No Due Date";

    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    return new Date(date).toLocaleDateString("en-IN", options);

}

/**
 * Check if task is overdue
 */
export function isOverdue(date) {

    if (!date) return false;

    const today = new Date();

    today.setHours(0,0,0,0);

    return new Date(date) < today;

}

/**
 * Search Tasks
 */export function searchTasks(tasks, keyword) {

    keyword = keyword.trim().toLowerCase();

    if (keyword === "") return tasks;

    return tasks.filter(task => {

        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();
        const priority = (task.priority || "").toLowerCase();

        return (
            title.includes(keyword) ||
            description.includes(keyword) ||
            priority.includes(keyword)
        );

    });

}

/**
 * Filter Tasks
 */
export function filterTasks(tasks, filter) {

    switch(filter){

        case "active":
            return tasks.filter(task => !task.completed);

        case "completed":
            return tasks.filter(task => task.completed);

        case "high":
            return tasks.filter(task => task.priority === "High");

        case "today":

            const today = new Date().toISOString().split("T")[0];

            return tasks.filter(task => task.dueDate === today);

        case "overdue":

            return tasks.filter(task => isOverdue(task.dueDate));

        default:
            return tasks;
    }

}

/**
 * Sort Tasks
 */
export function sortTasks(tasks) {

    return [...tasks].sort((a,b)=>{

        return new Date(a.dueDate || "2999-12-31")
             - new Date(b.dueDate || "2999-12-31");

    });

}

/**
 * Calculate Statistics
 */
export function calculateStats(tasks){

    const total = tasks.length;

    const completed = tasks.filter(task=>task.completed).length;

    const pending = total - completed;

    const overdue = tasks.filter(task=>isOverdue(task.dueDate)).length;

    const progress = total === 0
        ? 0
        : Math.round((completed/total)*100);

    return{

        total,
        completed,
        pending,
        overdue,
        progress

    };

}

/**
 * Debounce
 */
export function debounce(callback, delay = 300){

    let timer;

    return (...args)=>{

        clearTimeout(timer);

        timer = setTimeout(()=>{

            callback(...args);

        },delay);

    };

}

/**
 * Validate Task
 */
export function validateTask(title){

    if(title.trim()===""){

        return{

            valid:false,

            message:"Task title cannot be empty."

        };

    }

    return{

        valid:true,

        message:""

    };

}