// Assigned Tasks Page Script
class AssignedTasks {
    constructor() {
        this.storage = taskStorage;
        this.init();
    }

    init() {
        this.displayTasks();
        this.setupEventListeners();
    }

    displayTasks() {
        // Get all tasks (could filter by assigned status in future)
        const tasks = this.storage.getAllTasks();
        const taskContainer = document.querySelector('.task-list') || document.querySelector('.tasks-container');

        if (!taskContainer) return;

        if (tasks.length === 0) {
            taskContainer.innerHTML = '<p style="color: #8a92a8; text-align: center; padding: 40px;">No assigned tasks.</p>';
            this.updateStats(tasks);
            return;
        }

        taskContainer.innerHTML = tasks.map(task => this.createTaskElement(task)).join('');
        this.attachTaskListeners();
        this.updateStats(tasks);
    }

    createTaskElement(task) {
        return `
      <div class="task-item" data-task-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-content">
          <p style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</p>
          <small style="color: #8a92a8;">${task.category.toUpperCase()} • ${task.priority}</small>
        </div>
        <button class="task-delete-btn" style="background: none; border: none; color: #ff6b6b; cursor: pointer;">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    }

    attachTaskListeners() {
        document.querySelectorAll('.task-item').forEach(item => {
            const checkbox = item.querySelector('.task-checkbox');
            const deleteBtn = item.querySelector('.task-delete-btn');
            const taskId = parseInt(item.dataset.taskId);

            checkbox.addEventListener('change', () => {
                this.storage.toggleTask(taskId);
                this.displayTasks();
            });

            deleteBtn.addEventListener('click', () => {
                if (confirm('Delete this task?')) {
                    this.storage.deleteTask(taskId);
                    this.displayTasks();
                }
            });
        });
    }

    setupEventListeners() {
        const addBtn = document.querySelector('.add-task-btn');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                alert('Add task functionality available on main pages');
            });
        }
    }

    updateStats(tasks) {
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const pending = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const statsRow = document.querySelector('.stats-row');
        if (statsRow) {
            statsRow.innerHTML = `
                <div class="stat-item">
                    <div class="stat-number">${total}</div>
                    <div class="stat-label">Assigned</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${completed}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${pending}</div>
                    <div class="stat-label">Pending</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${progress}%</div>
                    <div class="stat-label">Progress</div>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AssignedTasks();
});
