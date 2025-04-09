// Calendar functionality
let currentDate = new Date();
let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];

function getEventColorClass(color) {
    switch(color) {
        case 'blue': return 'bg-blue-100 text-blue-800';
        case 'green': return 'bg-green-100 text-green-800';
        case 'red': return 'bg-red-100 text-red-800';
        case 'yellow': return 'bg-yellow-100 text-yellow-800';
        case 'purple': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

function renderEvents() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    
    events.forEach(event => {
        const eventDate = new Date(event.date);
        if (eventDate.getFullYear() === year && eventDate.getMonth() === month) {
            const day = eventDate.getDate();
            const dayIndex = firstDay + day;
            const dayCell = document.querySelector(`#calendar-days > div:nth-child(${dayIndex})`);
            if (dayCell) {
                const eventElement = document.createElement('div');
                eventElement.className = `flex justify-between items-center text-xs p-1 mb-1 rounded ${getEventColorClass(event.color)} group`;
                eventElement.innerHTML = `
                    <span class="flex-1">${event.time ? `${event.time} ${event.title}` : event.title}</span>
                    <button class="delete-event text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" 
                            data-id="${event.id}" 
                            title="Delete event">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                dayCell.querySelector('div:last-child').appendChild(eventElement);
            }
        }
    });
}

function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    if (calendarDays) {
        // Fade out effect
        calendarDays.style.opacity = '0';
        calendarDays.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Update month/year display
            document.querySelector('h1').textContent = 
                new Date(year, month).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                });
            
            // Get first day of month and total days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Clear existing calendar
            calendarDays.innerHTML = '';
            
            // Add empty cells for days before first day of month
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'p-2 h-24 border border-gray-100 bg-gray-50';
                calendarDays.appendChild(emptyDay);
            }
            
            // Add cells for each day of month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'p-2 h-24 border border-gray-100 overflow-y-auto';
                dayCell.innerHTML = `
                    <div class="font-medium">${day}</div>
                    <div class="text-xs space-y-1 mt-1"></div>
                `;
                calendarDays.appendChild(dayCell);
            }
            
            // Render events
            renderEvents();
            
            // Fade in effect
            setTimeout(() => {
                calendarDays.style.opacity = '1';
            }, 50);
        }, 50);
    }
}

// Mobile swipe-to-delete variables
let touchStartX = 0;
let touchEndX = 0;

// Handle touch events for swipe-to-delete
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 100) { // Swipe left threshold
        const eventElement = e.target.closest('[class*="bg-"]');
        if (eventElement) {
            const deleteBtn = eventElement.querySelector('.delete-event');
            if (deleteBtn) {
                deleteBtn.style.opacity = '1'; // Make delete button visible
                setTimeout(() => deleteBtn.click(), 300); // Auto-confirm after delay
            }
        }
    }
}

// Event deletion handler
function handleEventDeletion(e) {
    if (e.target.closest('.delete-event')) {
        if (confirm('Are you sure you want to delete this event?')) {
            const eventId = parseInt(e.target.closest('.delete-event').dataset.id);
            events = events.filter(event => event.id !== eventId);
            localStorage.setItem('calendarEvents', JSON.stringify(events));
            renderCalendar();
        }
    }
}
document.addEventListener('click', handleEventDeletion);

// Navigation buttons
document.getElementById('prev-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('today').addEventListener('click', () => {
    currentDate = new Date();
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Update month/year display
function updateMonthYearDisplay() {
    const display = document.getElementById('month-year-display');
    if (display) {
        display.textContent = currentDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }
}

// Call this in renderCalendar()

// Add Event Button
document.getElementById('add-event')?.addEventListener('click', (e) => {
    e.preventDefault();
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.remove('hidden');
        // Reset form and set default date
        document.getElementById('event-form')?.reset();
        const dateInput = document.getElementById('event-date');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
    }
});

// Cancel Event Button
document.getElementById('cancel-event')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('event-modal')?.classList.add('hidden');
});

// Handle event form submission
document.getElementById('event-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('event-title')?.value;
    const date = document.getElementById('event-date')?.value;
    const time = document.getElementById('event-time')?.value;
    const color = document.getElementById('event-color')?.value;
    
    if (title && date) {
        const newEvent = {
            id: Date.now(),
            title,
            date,
            time: time || null,
            color: color || 'blue'
        };
        
        events.push(newEvent);
        localStorage.setItem('calendarEvents', JSON.stringify(events));
        document.getElementById('event-modal')?.classList.add('hidden');
        renderCalendar();
    }
});

// Initial render
renderCalendar();
