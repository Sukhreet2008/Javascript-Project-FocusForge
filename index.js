// Index / Home Page Script
class HomePage {
    constructor() {
        this.storage = taskStorage;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.displayWelcome();
    }

    setupNavigation() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // Navigation is handled by href, just track usage
                console.log('Navigating to:', link.href);
            });
        });
    }

    displayWelcome() {
        const welcomeEl = document.querySelector('.hero-section');
        if (welcomeEl) {
            const stats = this.storage.getStats();
            console.log('Current tasks stats:', stats);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
