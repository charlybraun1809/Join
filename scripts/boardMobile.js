async function init() {
    await loadContacts();
    await loadTasks();
    dropdownFunctionCategory();
    userLog();
}

function initializeOverlayFunctions() {
    let select = document.getElementById('assignedToDropdownContacts');
    let select2 = document.getElementById('assignedToDropdownCategory');
    let dropDownItem2 = document.getElementsByClassName('dropdown-item-category');
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow-contacts');
    let arrow2 = document.querySelector('#dropdown-arrow-subtasks');
    let dropDown = document.getElementById('dropdown-list-contacts');
    let dropDown2 = document.getElementById('dropdown-list-category');

    // Reinitialisiere Dropdowns
    dropdownFunctionContacts(arrow, dropDown, select, isClicked);
    dropdownFunctionCategory(arrow2, dropDown2, select2, isClicked, dropDownItem2);

    // Neu rendern und Events hinzufügen
    renderDropdownContacts();
    saveSelectedContact();
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

function addProgressbarEventListener(taskCard) {
    let overlay = document.getElementById('overlayWrapper');
    let checkBoxes = overlay.querySelectorAll("input[type='checkbox']");

    checkBoxes.forEach((checkBox) => {
        checkBox.addEventListener('change', () => {
            updateProgressBar(taskCard, overlay);
        });
    });
}

function updateProgressBar(taskCard, overlay) {
    let progressBar = taskCard.querySelector('#progressBar');
    let checkBoxes = overlay.querySelectorAll(".subtaskCheckbox");
    let checkedBoxes = overlay.querySelectorAll(".subtaskCheckbox:checked");

    let progress = (checkedBoxes.length / checkBoxes.length) * 100;
    progressBar.style.width = progress + "%";
}


function renderTaskOverlay(imgElement) {
    let data = JSON.parse(imgElement.getAttribute('data-task'));
    let task = data.task; // Enthält die Subtasks
    let contactsTaskCard = data.contactsTaskCard;
    let targetDiv = document.getElementById('taskOverlayWrapper');
    let taskCard = imgElement.closest('.taskCard');

    targetDiv.innerHTML = "";

    // Render Overlay mit den dynamischen Subtasks
    targetDiv.innerHTML += getTaskOverlayTemplate(task, contactsTaskCard);
    renderAssignedContactsOverlay(task, contactsTaskCard);
    addProgressbarEventListener(taskCard);
}


function renderAssignedContactsOverlay(task, contactsTaskCard) {
    let assignedContactsDiv = document.getElementById('overlayContacts');
    assignedContactsDiv.innerHTML = "";
    createContactsElements(task, contactsTaskCard);
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

function editOverlayContent(task, contactsTaskCard) {
    if (typeof task === "string") task = JSON.parse(task);
    if (typeof contactsTaskCard === "string") contactsTaskCard = JSON.parse(contactsTaskCard)
    let overlayRef = document.getElementById('taskOverlayWrapper');
    overlayRef.innerHTML = "";

    overlayRef.innerHTML += getOverlayEditTemplate(task, contactsTaskCard);

    renderSubtaskOverlay(task);
    initializeSubtaskFocus();
    initializeOverlayFunctions();
    deleteEditSubtaskEventlistener();
    editSubtaskEventListener();
}

function renderSubtaskOverlay(task) {
    let ref = document.getElementById('addedSubtaskWrapperOverlay');
    ref.innerHTML = "";
    let subtasks = task['subtasks'];

    for (let index = 0; index < subtasks.length; index++) {
        let singleSubtask = subtasks[index];
        ref.innerHTML += overlaySubtaskTemplate(singleSubtask)
    }
}

function initializeSaveEditSubtaskEventListener() {
    const subtasksContainer = document.getElementById('subtasks'); // Container für alle Subtasks

    // Event Delegation für alle Save-Buttons
    subtasksContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('saveEdit')) {
            saveEditSubtask(event.target);
        }
    });
}






