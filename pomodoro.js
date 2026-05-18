// Pomodoro Timer Script
class PomodoroTimer {
    constructor() {
        this.workMinutes = 25;
        this.breakMinutes = 5;
        this.timeLeft = this.workMinutes * 60;
        this.isRunning = false;
        this.isWorkSession = true;
        this.timerInterval = null;
        this.totalSessionsCompleted = 0;
        this.storage = taskStorage;

        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.displayTime();
        this.loadUserSettings();
    }

    setupElements() {
        this.timerDisplay = document.querySelector('.timer-display');

        // Get buttons by their position in control-btn group
        const buttons = document.querySelectorAll('.control-btn');
        this.startBtn = buttons[0]; // Start button
        this.pauseBtn = buttons[1]; // Pause button
        this.resetBtn = buttons[2]; // Reset button

        // Get input fields
        const inputs = document.querySelectorAll('.input-group input');
        this.workInput = inputs[0];
        this.breakInput = inputs[1];

        this.timerLabel = document.querySelector('.timer-label');
        this.statsRow = document.querySelector('.stats-row');
    }

    setupEventListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.start());
        }
        if (this.pauseBtn) {
            this.pauseBtn.addEventListener('click', () => this.pause());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.reset());
        }
        if (this.workInput) {
            this.workInput.addEventListener('change', (e) => {
                this.workMinutes = parseInt(e.target.value) || 25;
                if (!this.isRunning && this.isWorkSession) {
                    this.timeLeft = this.workMinutes * 60;
                    this.displayTime();
                }
            });
        }
        if (this.breakInput) {
            this.breakInput.addEventListener('change', (e) => {
                this.breakMinutes = parseInt(e.target.value) || 5;
                if (!this.isRunning && !this.isWorkSession) {
                    this.timeLeft = this.breakMinutes * 60;
                    this.displayTime();
                }
            });
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        if (this.startBtn) this.startBtn.disabled = true;
        if (this.pauseBtn) this.pauseBtn.disabled = false;

        this.timerInterval = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft <= 0) {
                this.sessionComplete();
            } else {
                this.displayTime();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerInterval);

        if (this.startBtn) this.startBtn.disabled = false;
        if (this.pauseBtn) this.pauseBtn.disabled = true;
    }

    reset() {
        this.isRunning = false;
        clearInterval(this.timerInterval);

        this.isWorkSession = true;
        this.timeLeft = this.workMinutes * 60;
        this.displayTime();
        this.updateSessionLabel();

        if (this.startBtn) this.startBtn.disabled = false;
        if (this.pauseBtn) this.pauseBtn.disabled = true;
    }

    sessionComplete() {
        clearInterval(this.timerInterval);
        this.isRunning = false;

        if (this.isWorkSession) {
            this.totalSessionsCompleted++;
            this.isWorkSession = false;
            this.timeLeft = this.breakMinutes * 60;

            // Play notification
            this.playNotification();
            alert('✅ Great work! Time for a break. (Break: ' + this.breakMinutes + ' min)');
        } else {
            this.isWorkSession = true;
            this.timeLeft = this.workMinutes * 60;

            // Play notification
            this.playNotification();
            alert('⏰ Break over! Ready for another work session? (' + this.workMinutes + ' min)');
        }

        this.displayTime();
        this.updateSessionLabel();
        this.updateStats();

        if (this.startBtn) this.startBtn.disabled = false;
        if (this.pauseBtn) this.pauseBtn.disabled = true;
    }

    displayTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (this.timerDisplay) {
            this.timerDisplay.textContent = timeString;
        }

        // Update page title
        document.title = `${timeString} - Pomodoro Timer | FocusForge`;
    }

    updateSessionLabel() {
        const label = this.isWorkSession ? '⏱️ Work Session - Focus Time!' : '☕ Break Time - Relax!';
        if (this.timerLabel) {
            this.timerLabel.textContent = label;
        }
    }

    updateStats() {
        if (this.statsRow) {
            const focusTime = this.totalSessionsCompleted * this.workMinutes;
            this.statsRow.innerHTML = `
                <div class="stat-item">
                    <div class="stat-number">${this.totalSessionsCompleted}</div>
                    <div class="stat-label">Sessions Completed</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${focusTime}</div>
                    <div class="stat-label">Total Minutes</div>
                </div>
            `;
        }
    }

    playNotification() {
        // Use Web Audio API for a simple beep
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio notification not available');
        }
    }

    loadUserSettings() {
        if (this.workInput) {
            this.workMinutes = parseInt(this.workInput.value) || 25;
        }
        if (this.breakInput) {
            this.breakMinutes = parseInt(this.breakInput.value) || 5;
        }

        this.timeLeft = this.workMinutes * 60;
        this.displayTime();
        this.updateSessionLabel();
        this.updateStats();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
