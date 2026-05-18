// Plan Page Script
class Plan {
    constructor() {
        this.storage = taskStorage;
        this.category = 'plan';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.displayTasks();
        this.updateDate();
    }

    setupEventListeners() {
        const addBtn = document.querySelector('.add-task-btn') || document.querySelector('button[aria-label="Add Task"]');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showAddTaskModal());
        }
    }

    updateDate() {
        const dateDisplay = document.querySelector('.date-display');
        if (dateDisplay) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateDisplay.textContent = today.toLocaleDateString('en-US', options);
        }
    }

    displayTasks() {
        const tasks = this.storage.getTasksByCategory(this.category);
        const taskContainer = document.querySelector('.task-list');

        if (!taskContainer) return;

        if (tasks.length === 0) {
            taskContainer.innerHTML = '<p style="color: #8a92a8; text-align: center; padding: 40px;">No planned tasks yet. Plan your next task!</p>';
            return;
        }

        taskContainer.innerHTML = tasks.map(task => this.createTaskElement(task)).join('');
        this.attachTaskListeners();
        this.updateStats();
    }

    createTaskElement(task) {
        return `
      <div class="task-item" data-task-id="${task.id}">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
        <div class="task-content" style="flex: 1;">
          <p style="${task.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${task.title}</p>
          <small style="color: #8a92a8; display: block; margin-top: 4px;">
            ${task.priority.toUpperCase()} ${task.dueDate ? ' • Due: ' + task.dueDate : ''}
          </small>
        </div>
        <button class="task-delete-btn" title="Delete" style="background: none; border: none; color: #ff6b6b; cursor: pointer;">
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

    updateStats() {
        const tasks = this.storage.getTasksByCategory(this.category);
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const remaining = total - completed;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        const statsRow = document.querySelector('.stats-row');
        if (statsRow) {
            statsRow.innerHTML = `
        <div class="stat-item">
          <div class="stat-number">${total}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${completed}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${remaining}</div>
          <div class="stat-label">Remaining</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">${progress}%</div>
          <div class="stat-label">Progress</div>
        </div>
      `;
        }
    }

    showAddTaskModal() {
        const modal = `
      <div id="addTaskModal" class="modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
        <div class="modal-content" style="background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 30px; max-width: 500px; width: 90%; color: #333;">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0; font-size: 24px;">Add Planned Task</h3>
            <button class="modal-close" style="background: none; border: none; font-size: 28px; cursor: pointer;">&times;</button>
          </div>
          <form id="addTaskForm">
            <div class="form-group" style="margin-bottom: 16px;">
              <label for="taskTitle" style="display: block; margin-bottom: 8px; font-weight: 600;">Task Title *</label>
              <input type="text" id="taskTitle" required placeholder="Enter task title" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
            </div>
            <div class="form-group" style="margin-bottom: 16px;">
              <label for="taskDescription" style="display: block; margin-bottom: 8px; font-weight: 600;">Description</label>
              <textarea id="taskDescription" placeholder="Enter task description" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; min-height: 80px;"></textarea>
            </div>
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div class="form-group">
                <label for="taskPriority" style="display: block; margin-bottom: 8px; font-weight: 600;">Priority</label>
                <select id="taskPriority" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="form-group">
                <label for="taskDueDate" style="display: block; margin-bottom: 8px; font-weight: 600;">Due Date *</label>
                <input type="date" id="taskDueDate" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
              </div>
            </div>
            <div class="modal-footer" style="display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid #eee; padding-top: 20px;">
              <button type="button" class="btn-cancel" style="padding: 10px 20px; background: #eee; border: none; border-radius: 8px; cursor: pointer;">Cancel</button>
              <button type="submit" class="btn-submit" style="padding: 10px 20px; background: #079ef5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Add Task</button>
            </div>
          </form>
        </div>
      </div>
    `;

        const existingModal = document.getElementById('addTaskModal');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modal);
        this.setupModalListeners();
    }

    setupModalListeners() {
        const modal = document.getElementById('addTaskModal');
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.btn-cancel');
        const form = modal.querySelector('#addTaskForm');

        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const priority = document.getElementById('taskPriority').value;
            const dueDate = document.getElementById('taskDueDate').value;

            this.storage.addTask({
                title,
                description,
                category: this.category,
                priority,
                dueDate
            });

            modal.remove();
            this.displayTasks();
            alert('Task added to Plan!');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Plan();
});
