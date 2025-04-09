document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => document.getElementById('header').innerHTML = html);
    
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => document.getElementById('footer').innerHTML = html);

    // Load saved settings
    const settings = JSON.parse(localStorage.getItem('settings')) || {
        darkMode: false,
        fontSize: 16,
        notifications: true,
        reminderTime: 30,
        username: 'User'
    };

    // Apply settings
    document.getElementById('dark-mode-toggle').checked = settings.darkMode;
    document.getElementById('font-size').value = settings.fontSize;
    document.getElementById('notifications-toggle').checked = settings.notifications;
    document.getElementById('reminder-time').value = settings.reminderTime;
    document.getElementById('username').value = settings.username;

    // Set up event listeners
    document.getElementById('dark-mode-toggle').addEventListener('change', (e) => {
        settings.darkMode = e.target.checked;
        document.documentElement.classList.toggle('dark', settings.darkMode);
        saveSettings();
    });

    document.getElementById('font-size').addEventListener('input', (e) => {
        settings.fontSize = e.target.value;
        document.documentElement.style.fontSize = `${settings.fontSize}px`;
        saveSettings();
    });

    document.getElementById('notifications-toggle').addEventListener('change', (e) => {
        settings.notifications = e.target.checked;
        saveSettings();
    });

    document.getElementById('reminder-time').addEventListener('change', (e) => {
        settings.reminderTime = e.target.value;
        saveSettings();
    });

    document.getElementById('username').addEventListener('change', (e) => {
        settings.username = e.target.value;
        saveSettings();
    });

    document.getElementById('upload-btn').addEventListener('click', (e) => {
        e.preventDefault();
        // In a real app, this would open a file dialog
        alert('Avatar upload functionality would be implemented here');
    });

    function saveSettings() {
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    // Apply initial theme
    if (settings.darkMode) {
        document.documentElement.classList.add('dark');
    }
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
});