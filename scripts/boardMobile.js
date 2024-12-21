async function init() {
    await loadContacts();
    await loadTasks();
    userLog();
    const dropZones = document.querySelectorAll(".dropZone");

    dropZones.forEach(dropZone => {
        updateNoTasksDisplay(dropZone);
    });
    console.log("Board loaded and no tasks visibility updated.");
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
    //dynamische hinzugefügte elemente erhalten keine bestehenden event listener!!(deshalb nicht in init aufrufen)
}

function renderTaskCard() {
    let ref = document.getElementById('task');
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



























/*function updateProgressBar(card) {
    let bar = card.querySelector('#progressBar');
    let checkBoxes = card.querySelector('#checkBoxes');

    // Finde die angeklickten Checkboxen innerhalb der Karte
    let boxes = checkBoxes.querySelectorAll("input[type='checkbox']:checked");
    let checked = boxes.length;

    // Aktualisiere die Breite der Progressbar basierend auf den Checkboxen
    bar.style.width = ((checked / 2) * 100) + "%";
}

function addProgressbarEventListener() {
    document.querySelectorAll('.taskCard').forEach((card) => {
        let checkboxes = card.querySelectorAll("input[type='checkbox']");
        
        // Füge den Event Listener für jede Checkbox in der Karte hinzu
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                updateProgressBar(card);
            });
        });
    });
}*/

