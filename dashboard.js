// Dashboard Main Page Script
class Dashboard {
    constructor() {
        this.storage = taskStorage;
        this.allTasks = [];
        this.filteredTasks = [];
        this.init();
    }

    init() {
        this.setupSearchListener();
        this.updateStats();
        this.displayTasksByCategory();
        this.attachTaskListeners();
    }

    setupSearchListener() {
        const searchInput = document.querySelector('.header-search input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filterAndDisplayTasks(searchTerm);
            });
        }
    }

    filterAndDisplayTasks(searchTerm) {
        const tasks = this.storage.getAllTasks();

        if (searchTerm.trim() === '') {
            // If search is empty, display by category
            this.displayTasksByCategory();
        } else {
            // Filter tasks by title or description
            this.filteredTasks = tasks.filter(task =>
                task.title.toLowerCase().includes(searchTerm) ||
                (task.description && task.description.toLowerCase().includes(searchTerm))
            );

            // Display all filtered results in first section
            const allTaskLists = document.querySelectorAll('.task-list');
            allTaskLists.forEach(list => list.innerHTML = '');

            if (this.filteredTasks.length === 0) {
                allTaskLists[0].innerHTML = '<p style="color: #8a92a8; text-align: center; padding: 20px;">No tasks match your search.</p>';
                return;
            }

            // Show filtered results
            allTaskLists[0].innerHTML = this.filteredTasks.map(task => this.createTaskElement(task)).join('');
            this.attachTaskListeners();
        }
    }

    updateStats() {
        const stats = this.storage.getStats();

        const totalTasksEl = document.querySelector('[data-stat="total"]');
        const completedEl = document.querySelector('[data-stat="completed"]');
        const inProgressEl = document.querySelector('[data-stat="inProgress"]');

        if (totalTasksEl) totalTasksEl.textContent = stats.total;
        if (completedEl) completedEl.textContent = stats.completed;
        if (inProgressEl) inProgressEl.textContent = stats.inProgress;
    }

    displayTasksByCategory() {
        const allTasks = this.storage.getAllTasks();
        const taskLists = document.querySelectorAll('.task-list');

        if (taskLists.length < 4) return;

        // My Day - category: 'myday'
        const myDayTasks = allTasks.filter(t => t.category === 'myday').slice(0, 3);
        taskLists[0].innerHTML = this.renderTaskList(myDayTasks);

        // Important - category: 'important'
        const importantTasks = allTasks.filter(t => t.category === 'important').slice(0, 3);
        taskLists[1].innerHTML = this.renderTaskList(importantTasks);

        // Planned Tasks - category: 'myprojects'
        const plannedTasks = allTasks.filter(t => t.category === 'myprojects').slice(0, 3);
        taskLists[2].innerHTML = this.renderTaskList(plannedTasks);

        // Assigned Tasks - all tasks
        const assignedTasks = allTasks.slice(0, 3);
        taskLists[3].innerHTML = this.renderTaskList(assignedTasks);

        this.attachTaskListeners();
    }

    renderTaskList(tasks) {
        if (tasks.length === 0) {
            return '<p style="color: #8a92a8; text-align: center; padding: 20px;">No tasks in this category.</p>';
        }
        return tasks.map(task => this.createTaskElement(task)).join('');
    }

    createTaskElement(task) {
        return `
      <div class="task-item" data-task-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-content">
          <p class="task-title" style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</p>
          <p class="task-meta">${task.category.toUpperCase()} • ${task.priority}</p>
        </div>
        <button class="task-delete-btn" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    }

    attachTaskListeners() {
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.removeEventListener('change', this.handleCheckboxChange);
            checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));
        });

        document.querySelectorAll('.task-delete-btn').forEach(btn => {
            btn.removeEventListener('click', this.handleDeleteClick);
            btn.addEventListener('click', (e) => this.handleDeleteClick(e));
        });
    }

    handleCheckboxChange = (e) => {
        const taskId = parseInt(e.target.closest('.task-item').dataset.taskId);
        this.storage.toggleTask(taskId);
        this.updateStats();
        this.displayTasksByCategory();
    }

    handleDeleteClick = (e) => {
        e.preventDefault();
        const taskId = parseInt(e.target.closest('.task-item').dataset.taskId);
        if (confirm('Delete this task?')) {
            this.storage.deleteTask(taskId);
            this.updateStats();
            this.displayTasksByCategory();
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
