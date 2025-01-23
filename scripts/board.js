let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';
async function init() {
    await loadContacts();
    await loadTasks();
    userLog();
}

let tasks = [];

async function getTaskData(path = '') {
    try {
        let response = await fetch(baseURL + path + '.json');
        let responseToJson = await response.json();
        return responseToJson;
    } catch (error) {
        console.error('failed to fetch', error);
    }
}

async function loadTasks(path = "", data = {}) {
    let tasksData = await getTaskData('tasks/toDo');
    let contactsData = await getTaskData('contacts');
    for (const key in tasksData) {
        const singleTask = tasksData[key];

        let task = {
            "id": key,
            "title": singleTask.title,
            "description": singleTask.description,
            "priority": singleTask.priority,
            "assigned to": singleTask.assigned_to,
            "date": singleTask.date,
            "category": singleTask.category,
            "subtasks": singleTask.subtasks,
            "prioImg": singleTask.prioImg,
        }
        tasks.push(task);
    } renderTaskCard();
}

function renderTaskCard() {
    let ref = document.getElementById('noTasks');
    ref.innerHTML = "";
    tasks.forEach(task => {
        let contactData = task['assigned to'].map(user => {
            return contacts.find(contact => contact.name === user);
        });
        ref.innerHTML += getTaskCardTemplate(task, contactData);
    });

}

function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

function addProgressbarEventListener() {
    let overlay = document.getElementById('overlayWrapper')
    let checkBoxes = overlay.querySelectorAll("input[type='checkbox']");
    let taskCard = document.getElementsByClassName('taskCard');

    Array.from(taskCard).forEach(card => {
        checkBoxes.forEach((checkBox) => {
            checkBox.addEventListener('change', () => {
                updateProgressBar(card, overlay);
            })
        })
    })
}

function updateProgressBar(taskCard, overlay) {
    let progressBar = taskCard.querySelector('#progressBar');

    let selectedCheckbox = overlay.querySelectorAll("input[type='checkbox']:checked");
    let checked = selectedCheckbox.length;

    progressBar.style.width = ((checked / 2) * 100) + "%";
}

function renderTaskOverlay(imgElement) {
    let data = JSON.parse(imgElement.getAttribute('data-task'));
    let task = data.task;
    let contactsTaskCard = data.contactsTaskCard;
    let targetDiv = document.getElementById('taskOverlayWrapper')
    targetDiv.innerHTML = "";

    targetDiv.innerHTML += getTaskOverlayTemplate(task);
    renderAssignedContactsOverlay(task, contactsTaskCard)
    addProgressbarEventListener();
}

function renderAssignedContactsOverlay(task, contactsTaskCard) {
    let assignedContactsDiv = document.getElementById('overlayContacts');
    assignedContactsDiv.innerHTML = "";
    createContactsElements(task, contactsTaskCard)
}

function createContactsElements(task, contactsTaskCard) {
    let contactsWrapper = document.getElementById('overlayContacts');
    task['assigned to'].forEach(contactName => {
        let { background: bgColor } = contactsTaskCard.find(contact => contact.name === contactName);
        let singleContactSpan = document.createElement('div');
        singleContactSpan.classList.add('overlayContact');
        singleContactSpan.innerHTML = `
            <span class="initialsColor" style="background-color: ${bgColor};">${getInitials(contactName)}</span>
            <span>${contactName}</span>`;
        contactsWrapper.appendChild(singleContactSpan);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let addTaskButton = document.querySelector('add-task-btn');
    let taskOverlay = document.getElementById('taskOverlayWrapper');

    if (addTaskButton) {
        addTaskButton.addEventListener("click", () => {
            taskOverlay.innerHTML = getAddTaskOverlayTemplate();
            toggleOverlay("taskOverlayWrapper");
            setTimeout(() => {
                animate("taskOverlayWrapper");
            }, 5);
            document.getElementById('closeAddTaskOverlay').addEventListener("click", () => {
                animate("taskOverlayWrapper");
                setTimeout(() => {
                    toggleOverlay('taskOverlayWrapper');
                }, 300);
            });
            document.getElementById('addTaskForm').addEventListener("submit", (event) => {
                event.preventDefault();
                let taskTitle = document.getElementById('taskTitle').value;
                let taskDescription = document.getElementById("taskDescription").value;

                console.log("Task Submitted:", { taskTitle, taskDescription });
                animate('taskOverlayWrapper');
                setTimeout(() => {
                    toggleOverlay('taskOverlayWrapper');
                }, 300);
            });
        });
    }
});
addTaskButton.addEventListener("click", () => {
    let categories = ["Bug", "Feature", "Improvement"];
    taskOverlay.innerHTML = getAddTaskOverlayTemplate(categories);

});
