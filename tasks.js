document.addEventListener('DOMContentLoaded', () => {
    // Load header and footer
    fetch('components/header.html')
        .then(response => response.text())
        .then(html => document.getElementById('header').innerHTML = html);
    
    fetch('components/footer.html')
        .then(response => response.text())
        .then(html => document.getElementById('footer').innerHTML = html);

    // Task management
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `p-4 rounded-lg border ${getPriorityClass(task.priority)}`;
            taskElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-medium ${task.completed ? 'line-through text-gray-500' : ''}">${task.title}</h3>
                        ${task.description ? `<p class="text-sm text-gray-600 mt-1">${task.description}</p>` : ''}
                        ${task.dueDate ? `<p class="text-xs mt-2"><i class="far fa-calendar-alt mr-1"></i>${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
                    </div>
                    <div class="flex space-x-2">
                        <button class="complete-btn p-1 text-gray-500 hover:text-green-500" data-index="${index}">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="delete-btn p-1 text-gray-500 hover:text-red-500" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            taskList.appendChild(taskElement);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.closest('button').dataset.index;
                tasks[index].completed = !tasks[index].completed;
                saveTasks();
                renderTasks();
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.closest('button').dataset.index;
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });
        });
    }

    function getPriorityClass(priority) {
        switch(priority) {
            case 'high': return 'border-red-200 bg-red-50';
            case 'medium': return 'border-yellow-200 bg-yellow-50';
            default: return 'border-green-200 bg-green-50';
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTask = {
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-desc').value,
            priority: document.getElementById('task-priority').value,
            dueDate: document.getElementById('task-due').value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        
        // Reset form
        taskForm.reset();
        document.getElementById('task-title').focus();
    });

    // Initial render
    renderTasks();
});