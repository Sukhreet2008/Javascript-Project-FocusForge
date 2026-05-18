// ========================================
// FOCUSFORGE - TASK MANAGEMENT SYSTEM
// Storage & Data Management Documentation
// ========================================

/*
  LOCAL STORAGE IMPLEMENTATION SUMMARY
  =====================================
  
  1. STORAGE STRUCTURE (storage.js)
  ================================
  - Tasks are stored in localStorage with key: 'focusforge_tasks'
  - Each task object contains:
    * id: Unique timestamp-based ID
    * title: Task name
    * description: Task details
    * category: 'myday', 'important', 'myprojects', or 'plan'
    * priority: 'low', 'medium', or 'high'
    * dueDate: Date when task is due
    * completed: Boolean (true/false)
    * completedAt: Timestamp when marked complete
    * createdAt: ISO timestamp of creation

  2. AUTOMATIC CLEANUP SYSTEM
  ===========================
  - Completed tasks are automatically removed 24 hours AFTER their deadline
  - Cleanup triggers on:
    * getStats() call
    * displayTasks() on any page
    * Any page initialization
  
  - Removal Logic:
    * Task must be: completed AND past deadline AND 24+ hours since completion
    * Tasks with no deadline are kept forever (even if completed)
    * Incomplete tasks are always kept

  3. STATISTICS CALCULATION
  =========================
  Properties calculated by getStats():
  - total: All tasks count
  - completed: Completed tasks count
  - inProgress: Uncompleted tasks count
  - completionRate: Percentage (0-100%)
  - overdue: Incomplete tasks past deadline
  - dueToday: Incomplete tasks due today
  - dueThisWeek: Incomplete tasks due within 7 days
  - categories: Task count per category

  4. PAGES & FEATURES
  ===================
  
  Dashboard (dashboard.html / dashboard.js)
  - Shows overall statistics (total, completed, in progress)
  - Displays 5 most recent tasks
  - ❌ "Add Task" button REMOVED from header
  - Checkbox to mark tasks complete/incomplete
  - Delete button to remove tasks
  
  My Day (myday.html / myday.js)
  - Category: 'myday'
  - ✅ Has "Add Task" modal
  - Shows today's date
  - Stats: Total tasks, completed, remaining, progress %
  
  Important (important.html / important.js)
  - Category: 'important'
  - ✅ Has "Add Task" modal
  - Stats: Total tasks, completed, remaining, progress %
  
  My Projects (my-projects.html / myprojects.js)
  - Category: 'myprojects'
  - ✅ Has "Add Task" modal
  - Stats: Total tasks, completed, remaining, progress %
  
  Plan (plan.html / plan.js)
  - Category: 'plan'
  - ✅ Has "Add Task" modal
  - Stats: Total tasks, completed, remaining, progress %
  
  Flagged Tasks (flagged.html / flagged.js)
  - Shows high priority tasks (priority: 'high')
  - Stats: Total flagged, completed, pending, progress %
  - No "Add Task" button (add from other pages with high priority)
  - ❌ All sample data removed
  
  Assigned Tasks (assignedtask.html / assignedtask.js)
  - Shows all user tasks
  - Stats: Total assigned, completed, pending, progress %
  - No "Add Task" button (add from other pages)
  - ❌ All sample data removed

  5. REMOVED SAMPLE DATA
  ======================
  ❌ All hardcoded example tasks removed from:
  - flagged.html
  - assignedtask.html
  - dashboard.html
  - important.html
  - plan.html
  - myday.html

  Tasks are now loaded DYNAMICALLY from localStorage only

  6. KEY METHODS IN TaskStorage CLASS
  ===================================
  
  getAllTasks()
  - Returns all tasks from storage
  - Runs cleanup automatically
  
  getTasksByCategory(category)
  - Returns tasks for specific category
  - Useful for: myday, important, myprojects, plan
  
  addTask(taskData)
  - Creates new task with:
    * title (required)
    * description (optional)
    * category (required)
    * priority (optional, default: 'medium')
    * dueDate (optional)
  - Auto-generates ID and timestamp
  
  toggleTask(taskId)
  - Marks task as complete/incomplete
  - Records completedAt timestamp
  
  deleteTask(taskId)
  - Permanently removes task
  - Can be called manually or via cleanup
  
  updateTask(taskId, updates)
  - Modifies task properties
  
  cleanupCompletedTasks()
  - Removes old completed tasks
  - Called automatically on data operations

  7. TASK LIFECYCLE
  =================
  
  Creating:
    User enters title + details in modal
    → addTask() creates object with timestamp
    → Stored in localStorage
    → displayTasks() refreshes page
    → updateStats() recalculates
  
  Completing:
    User checks checkbox
    → toggleTask() marks completed
    → completedAt timestamp recorded
    → Task kept in storage for 24 hours past deadline
  
  Deleting:
    User clicks delete button
    → deleteTask() removes from storage
    OR
    24+ hours after completion + past deadline
    → cleanupCompletedTasks() auto-removes
  
  Viewing:
    User navigates to page
    → displayTasks() loads from storage
    → cleanupCompletedTasks() runs automatically
    → Old completed tasks are removed
    → updateStats() shows current stats

  8. DATA PERSISTENCE
  ===================
  - Data persists across browser sessions
  - Each browser/device has separate storage
  - Private browsing may not persist data
  - localStorage has ~5-10MB limit per domain
  
  Current approx usage: < 1KB (empty)
  
  9. TESTING THE SYSTEM
  =======================
  
  To add a task:
  1. Go to any page (My Day, Important, My Projects, Plan)
  2. Click "Add Task" button
  3. Fill in title, description, priority, due date
  4. Click "Add Task"
  5. Task appears in list immediately
  
  To mark complete:
  1. Check the checkbox next to task
  2. Task visual updates (strikethrough)
  3. Stats automatically recalculate
  
  To delete:
  1. Click trash icon or delete button
  2. Confirm deletion
  3. Task removed from storage
  
  To see different views:
  - Dashboard: Overview of all tasks
  - My Day: Focus on today's priorities
  - Important: High priority items
  - My Projects: Project-related tasks
  - Plan: Future planning tasks
  - Flagged: High priority items only
  
  10. POMODORO TIMER (pomodoro.js)
  ================================
  - Independent from task storage
  - Tracks sessions completed during work
  - Default: 25 min work, 5 min break
  - Customizable durations
  - Audio notifications
  - Session statistics

*/