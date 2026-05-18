// Storage System - Manages all task data in localStorage
class TaskStorage {
    constructor() {
        this.storageKey = 'focusforge_tasks';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Get all tasks
    getAllTasks() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || [];
        } catch (e) {
            console.error('Error reading tasks:', e);
            return [];
        }
    }

    // Get tasks by category
    getTasksByCategory(category) {
        const tasks = this.getAllTasks();
        return tasks.filter(task => task.category === category);
    }

    // Add a new task
    addTask(taskData) {
        const tasks = this.getAllTasks();
        const newTask = {
            id: Date.now(),
            title: taskData.title,
            description: taskData.description || '',
            category: taskData.category, // 'myday', 'important', 'myprojects', 'plan'
            priority: taskData.priority || 'medium',
            dueDate: taskData.dueDate || '',
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
        return newTask;
    }

    // Update task
    updateTask(taskId, updates) {
        const tasks = this.getAllTasks();
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return tasks[taskIndex];
        }
        return null;
    }

    // Delete task
    deleteTask(taskId) {
        let tasks = this.getAllTasks();
        tasks = tasks.filter(t => t.id !== taskId);
        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    // Toggle task completion
    toggleTask(taskId) {
        const tasks = this.getAllTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return task;
        }
        return null;
    }

    // Get statistics with proper calculations
    getStats() {
        const tasks = this.getAllTasks();
        const now = new Date();

        // Clean up completed tasks that are past deadline + 24 hours
        this.cleanupCompletedTasks();

        const allTasks = this.getAllTasks();
        const completed = allTasks.filter(t => t.completed).length;
        const total = allTasks.length;
        const inProgress = total - completed;

        // Calculate tasks by category
        const categories = {
            myday: allTasks.filter(t => t.category === 'myday').length,
            important: allTasks.filter(t => t.category === 'important').length,
            myprojects: allTasks.filter(t => t.category === 'myprojects').length,
            plan: allTasks.filter(t => t.category === 'plan').length
        };

        // Calculate completion rates
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            completionRate,
            categories,
            // Additional stats
            overdue: allTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length,
            dueToday: allTasks.filter(t => !t.completed && t.dueDate &&
                new Date(t.dueDate).toDateString() === now.toDateString()).length,
            dueThisWeek: allTasks.filter(t => !t.completed && t.dueDate &&
                new Date(t.dueDate) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) &&
                new Date(t.dueDate) > now).length
        };
    }

    // Clean up completed tasks after 24 hours past deadline
    cleanupCompletedTasks() {
        const tasks = this.getAllTasks();
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const filteredTasks = tasks.filter(task => {
            // Keep task if not completed
            if (!task.completed) return true;

            // Keep task if no due date
            if (!task.dueDate) return true;

            // Keep task if completed but deadline not reached yet
            const dueDate = new Date(task.dueDate);
            if (dueDate > now) return true;

            // Remove task if completed and 24+ hours past deadline
            const completedTime = task.completedAt ? new Date(task.completedAt) : new Date(task.createdAt);
            return completedTime > twentyFourHoursAgo;
        });

        if (filteredTasks.length !== tasks.length) {
            localStorage.setItem(this.storageKey, JSON.stringify(filteredTasks));
        }
    }

    // Update task with completion timestamp
    toggleTask(taskId) {
        const tasks = this.getAllTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                task.completedAt = new Date().toISOString();
            } else {
                delete task.completedAt;
            }
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
            return task;
        }
        return null;
    }
}

// Create global instance
const taskStorage = new TaskStorage();
