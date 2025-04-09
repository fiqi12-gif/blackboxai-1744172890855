// Load header and footer components
document.addEventListener('DOMContentLoaded', () => {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header').innerHTML = html;
        });
    
    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('footer').innerHTML = html;
        })
        .then(() => {
            // Mobile menu toggle - added after footer loads to ensure elements exist
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mobileMenu.classList.toggle('hidden');
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                });
            }
        });
    
    // Display current date
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.querySelector('h1').textContent += ` - ${now.toLocaleDateString(undefined, options)}`;
    
    // Load and display calendar events
    const todaySchedule = document.getElementById('today-schedule');
    const upcomingEvents = document.getElementById('upcoming-events');
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // Get events from localStorage or use sample data
    const events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    
    // Filter today's events
    const todaysEvents = events.filter(event => event.date === today)
        .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));
    
    // Filter upcoming events (next 7 days)
    const upcoming = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > new Date(today) && eventDate <= nextWeek;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Display today's schedule
    if (todaysEvents.length > 0) {
        todaysEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'flex items-start border-b pb-4';
            eventElement.innerHTML = `
                <div class="w-20 font-medium text-gray-500">${event.time || 'All day'}</div>
                <div class="flex-1">
                    <h3 class="font-medium">${event.title}</h3>
                    <p class="text-sm text-gray-500">${event.date}</p>
                </div>
            `;
            todaySchedule.appendChild(eventElement);
        });
    } else {
        todaySchedule.innerHTML = '<p class="text-gray-500">No events scheduled for today</p>';
    }
    
    // Display recent tasks
    const recentTasks = document.getElementById('recent-tasks');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const recent = tasks.slice(0, 5).reverse(); // Show 5 most recent tasks (newest first)
    
    if (recent.length > 0) {
        recent.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `flex items-center p-3 rounded-lg ${getPriorityClass(task.priority)}`;
            taskElement.innerHTML = `
                <div class="flex-1">
                    <h3 class="font-medium ${task.completed ? 'line-through text-gray-500' : ''}">${task.title}</h3>
                    ${task.dueDate ? `<p class="text-xs text-gray-500 mt-1">Due: ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                </div>
                <span class="ml-2 text-xs font-medium ${task.completed ? 'text-green-500' : 'text-gray-500'}">
                    ${task.completed ? '✓ Done' : 'Pending'}
                </span>
            `;
            recentTasks.appendChild(taskElement);
        });
    } else {
        recentTasks.innerHTML = '<p class="text-gray-500">No recent tasks</p>';
    }

    function getPriorityClass(priority) {
        switch(priority) {
            case 'high': return 'bg-red-50 border border-red-100';
            case 'medium': return 'bg-yellow-50 border border-yellow-100';
            default: return 'bg-gray-50 border border-gray-100';
        }
    }
});