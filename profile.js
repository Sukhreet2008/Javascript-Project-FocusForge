// Profile Page Script
class Profile {
    constructor() {
        this.storage = taskStorage;
        this.init();
    }

    init() {
        this.setupProfile();
        this.displayStats();
    }

    setupProfile() {
        const profileForm = document.querySelector('form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Profile saved successfully!');
            });
        }
    }

    displayStats() {
        const stats = this.storage.getStats();
        console.log('Task Statistics:', stats);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Profile();
});
