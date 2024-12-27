async function init() {
    await loadContacts();
    await loadTasks();
    userLog();
    const dropZones = document.querySelectorAll(".dropZone");

    dropZones.forEach(dropZone => {
        updateNoTasksDisplay(dropZone);
    });
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

    sendSubtaskForm();
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
    tasks = [];
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
            "dropZone": singleTask.dropZone /*|| "defaultDropZoneId"*/
        }
        tasks.push(task);
    } 
    renderTaskCard();
    //dynamische hinzugefügte elemente erhalten keine bestehenden event listener!!(deshalb nicht in init aufrufen)
    placeTasksInDropZones();
}

function renderTaskCard() {
    let ref = document.getElementById('tasking');
    if (tasks.length > 0) {
        ref.innerHTML = "";
        tasks.forEach(task => {
            let contactData = task['assigned_to'].map(user => {
                return contacts.find(contact => contact.name === user);
            });
            ref.innerHTML += getTaskCardTemplate(task, contactData);
        });
    } else {
        console.log('No Tasks there...');
    }
}

function placeTasksInDropZones() {
    tasks.forEach(task => {
        const taskElement = document.getElementById(task.id);
        const dropZone = document.getElementById(task.dropZone);
        if (taskElement && dropZone) {
            dropZone.appendChild(taskElement); // Move task to its saved drop zone
        }
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
    initialiseSavePrioImg();
    saveEditSubtaskEventListener();
    initializeOverlayFunctions();
    deleteEditSubtaskEventlistener();
    editSubtaskEventListener();
}

async function saveEditTask(task) {
    debugger;
    let title = document.getElementById('titleInput').value;
    let description = document.getElementById('descriptionInput').value;
    let assignedContacts = selectedContact;
    let date = document.getElementById('date').value;
    let prio = prioGrade;
    let subtasks = Array.from(document.getElementsByClassName('addedSubtaskInput')).map(input => input.textContent);

    let taskData = {
        "title": title,
        "description": description,
        "assigned_to": assignedContacts,
        "date": date,
        "priority": prio,
        "subtasks": subtasks,
        "prioImg": selectedPrioImg,
        "category": task.category,
    };
    let path = `tasks/toDo/${task.id}`;
    await putTaskDataOnFirebase(path, taskData);
    loadTasks();
}

async function putTaskDataOnFirebase(path = '', data = {}) {
    await fetch(baseURL + path + '.json', {
        method: 'PUT',
        header: {
            'Content-Type:': 'application/json',
        },
        body: JSON.stringify(data)
    });
    console.log('Data updated!');

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

let draggedTaskId = null;

function onDragStart(event, taskId) {
    draggedTaskId = taskId; // Task-ID speichern
    event.dataTransfer.setData("text/plain", taskId); // ID für den Drop-Prozess bereitstellen
    event.target.classList.add("dragging"); // Visuelles Feedback beim Ziehen
}

function onDragOver(event) {
    event.preventDefault(); // Drop erlauben
    event.target.classList.add("drop-hover"); // Visuelle Hervorhebung der Drop-Zone
}

async function onDrop(event, dropZoneId) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const dropZone = document.getElementById(dropZoneId);

    if (taskId && dropZone) {
        const draggedTask = document.querySelector(`[id='${taskId}']`);
        const previousDropZone = draggedTask.closest('.dropZone');

        if (draggedTask) {
            dropZone.appendChild(draggedTask);

            // Update the task's drop zone in Firebase
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex !== -1) {
                // Create a copy of the task without the id field
                const { id, ...taskWithoutId } = tasks[taskIndex];
                taskWithoutId.dropZone = dropZoneId; // Update drop zone in local tasks array
                await putTaskDataOnFirebase(`tasks/toDo/${taskId}`, taskWithoutId); // Save to Firebase without id
            }

            updateNoTasksDisplay(previousDropZone);
            updateNoTasksDisplay(dropZone);
        }
    }
    clearDragStyles();
}

function onDragEnd(event) {
    event.target.classList.remove("dragging"); // Dragging-Stil entfernen
    
    clearDragStyles();
}

function clearDragStyles() {
    document.querySelectorAll(".drop-hover").forEach(el => el.classList.remove("drop-hover"));
}

/**
 * Updates the visibility of the "no tasks" messages in the given drop zone.
 * @param {HTMLElement} dropZone - The drop zone to update.
 */
function updateNoTasksDisplay(dropZone) {
    const noTasksWrapper = dropZone.querySelector(".noTasksWrapper");
    const taskCards = dropZone.querySelectorAll(".taskCard"); // Alle Aufgaben in der Zone

    if (noTasksWrapper) {
        if (taskCards.length > 0) {
            noTasksWrapper.style.display = "none"; // Aufgaben vorhanden, Nachricht ausblenden
        } else {
            noTasksWrapper.style.display = "flex"; // Keine Aufgaben, Nachricht anzeigen
        }
    }
}




