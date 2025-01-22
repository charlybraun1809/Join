document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const dropdowns = document.querySelectorAll('.dropdown');
    const priorities = document.querySelectorAll('.priority-btn');
    const subtaskInput = document.getElementById('subtask-input');
    const subtaskList = document.getElementById('subtasks-list');
    let selectedPriority = null;
    let selectedCategory = null;
    let selectedContacts = [];
    let subtasks = [];

    // Dropdown toggle
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            const menu = dropdown.querySelector('.dropdown-menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Select priority
    priorities.forEach(btn => {
        btn.addEventListener('click', () => {
            priorities.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedPriority = btn.id;
        });
    });

    // Add subtask
    document.getElementById('add-subtask').addEventListener('click', () => {
        const value = subtaskInput.value.trim();
        if (value) {
            subtasks.push(value);
            renderSubtasks();
            subtaskInput.value = '';
        }
    });

    // Submit form
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const task = {
            title: document.getElementById('titleInput').value.trim(),
            description: document.getElementById('descriptionInput').value.trim(),
            date: document.getElementById('date').value.trim(),
            priority: selectedPriority,
            category: selectedCategory,
            subtasks: subtasks
        };
        console.log('Task submitted:', task);
        taskForm.reset();
    });

    function renderSubtasks() {
        subtaskList.innerHTML = '';
        subtasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${task} <button onclick="removeSubtask(${index})">x</button>`;
            subtaskList.appendChild(li);
        });
    }

    window.removeSubtask = (index) => {
        subtasks.splice(index, 1);
        renderSubtasks();
    };
});
