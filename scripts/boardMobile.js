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
            "assigned_to": singleTask.assigned_to,
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
    let ref = document.getElementById('task');
    if (tasks.length > 0) {
        ref.innerHTML = "";
        tasks.forEach(task => {
            // Check if 'assigned to' exists and is an array
            let assignedTo = task['assigned_to'];
            let contactData = Array.isArray(assignedTo) ? assignedTo.map(user => {
                return contacts.find(contact => contact.name === user);
            }) : []; // Default to an empty array if 'assigned to' is not an array
            
            ref.innerHTML += getTaskCardTemplate(task, contactData);
        });
    } else {
        console.log('No Tasks there...');
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    placeTasksInDropZones();
});

function placeTasksInDropZones() {
    if (!tasks || !tasks.toDo) {
        console.error("Tasks object is not properly initialized.");
        return;
    }

    Object.keys(tasks.toDo).forEach(taskId => {
        const task = tasks.toDo[taskId];
        const taskElement = document.getElementById(taskId);
        const dropZone = document.getElementById(task.dropZone);

        if (taskElement && dropZone) {
            dropZone.appendChild(taskElement); // Move task to its saved drop zone
        } else {
            if (!taskElement) {
                console.warn(`Task element with id '${taskId}' not found.`);
            }
            if (!dropZone) {
                console.warn(`Drop zone with id '${task.dropZone}' not found.`);
            }
        }
    });
}

function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

function addProgressbarEventListener(taskCard, task) {
    let overlay = document.getElementById('overlayWrapper');
    let checkBoxes = overlay.querySelectorAll("input[type='checkbox']"); 

    checkBoxes.forEach((checkBox) => {
        checkBox.addEventListener('change', () => {
            // Sammle alle checked Checkboxen
            let checkedValues = [];
            checkBoxes.forEach((box) => {
                if (box.checked) {
                    checkedValues.push(box.value); // Hier wird der Wert der Checkbox gespeichert
                }
            });

            updateProgressBar(taskCard, overlay);
            saveCheckboxStatusToDatabase(checkedValues, task);
        });
    });
}

function saveCheckboxStatusToDatabase(checkedValues, task) {
    const data = {
        taskId: task.id,
        checkedValues: checkedValues,
    };

    // Sende die Daten an den Server (hier mit fetch als Beispiel)
    fetch(baseURL + `tasks/toDo/${task.id}` + '.json', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Erfolgreich gespeichert:', data);
    })
    .catch(error => {
        console.error('Fehler beim Speichern:', error);
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
    let overlay = document.getElementsByClassName('taskOverlayBackground')[0];
    let data = JSON.parse(imgElement.getAttribute('data-task'));
    let task = data.task; // Enthält die Subtasks
    let contactsTaskCard = data.contactsTaskCard;
    let targetDiv = document.getElementById('taskOverlayWrapper');
    let taskCard = imgElement.closest('.taskCard');

    targetDiv.innerHTML = "";
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    targetDiv.innerHTML += getTaskOverlayTemplate(task, contactsTaskCard);
    renderAssignedContactsOverlay(task, contactsTaskCard);
    addProgressbarEventListener(taskCard, task);
}

function closeOverlay() {
    let overlay = document.getElementsByClassName('taskOverlayBackground')[0];
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    overlay.querySelector('#taskOverlayWrapper').classList.remove('overlayEditScroll');
}

function renderAssignedContactsOverlay(task, contactsTaskCard) {
    let assignedContactsDiv = document.getElementById('overlayContacts');
    assignedContactsDiv.innerHTML = "";
    createContactsElements(task, contactsTaskCard);
}


function createContactsElements(task, contactsTaskCard) {
    let contactsWrapper = document.getElementById('overlayContacts');

    if (Array.isArray(task['assigned_to'])) {
        task['assigned_to'].forEach(contactName => {
            let contact = contactsTaskCard.find(contact => contact.name === contactName);
            let bgColor = contact?.background || '#ccc'; // Fallback-Farbe

            let singleContactSpan = document.createElement('div');
            singleContactSpan.classList.add('overlayContact');
            singleContactSpan.innerHTML = `
                <span class="initialsColor" style="background-color: ${bgColor};">${getInitials(contactName)}</span>
                <span>${contactName}</span>`;
            contactsWrapper.appendChild(singleContactSpan);
        });
    } else {
        console.error("'assigned to' is not defined or not an array:", task['assigned to']);
    }
}

function editOverlayContent(task, contactsTaskCard) {
    if (typeof task === "string") task = JSON.parse(task);
    if (typeof contactsTaskCard === "string") contactsTaskCard = JSON.parse(contactsTaskCard)
    let overlayRef = document.getElementById('taskOverlayWrapper');
    overlayRef.innerHTML = "";

    overlayRef.innerHTML += getOverlayEditTemplate(task, contactsTaskCard);
    overlayRef.classList.add('overlayEditScroll');

    renderSubtaskOverlay(task);
    initializeSubtaskFocus();
    initialiseSavePrioImg();
    saveEditSubtaskEventListener();
    initializeOverlayFunctions();
    deleteEditSubtaskEventlistener();
    editSubtaskEventListener();
}

async function saveEditTask(task) {
    let overlayBackground = document.getElementsByClassName('taskOverlayBackground')[0];
    let overlay = document.getElementById('taskOverlayWrapper');
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
    overlay.classList.remove('overlayEditScroll');
    overlayBackground.style.display = 'none';
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
            saveEditTask(event.target);
        }
    });
}

let draggedTaskId = null;

function onDragStart(event, taskId) {
    if (!taskId) {
        console.error("Invalid taskId passed to onDragStart");
        return;
    }
    draggedTaskId = taskId;
    event.dataTransfer.setData("text/plain", taskId);
    console.log(`Task started dragging: ${taskId}`); // Debug log
    event.target.classList.add("dragging");
}

function onDragOver(event) {
    event.preventDefault(); // Allow drop
    event.target.classList.add("drop-hover"); // Visually highlight the drop zone
}

async function onDrop(event, dropZoneId) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    console.log(`TaskId from dataTransfer: ${taskId}`);

    const dropZone = document.getElementById(dropZoneId);
    console.log(`DropZone element:`, dropZone);

    if (taskId && dropZone) {
        const draggedTask = document.querySelector(`[id='${taskId}']`);
        console.log(`Dragged Task element:`, draggedTask); // Log the dragged task

        if (!draggedTask) {
            console.error(`Task with id '${taskId}' not found in the DOM.`);
            return;
        }

        const previousDropZone = draggedTask.closest('.dropZone');
        console.log(`Previous DropZone element:`, previousDropZone);

        if (previousDropZone) {
            dropZone.appendChild(draggedTask);

            if (tasks && tasks.toDo && tasks.toDo[taskId]) {
                const taskData = tasks.toDo[taskId];
                console.log(`Original Task Data:`, taskData);

                const updatedTaskData = {
                    ...taskData,
                    dropZone: dropZoneId, // Update drop zone
                };
                console.log(`Updated Task Data:`, updatedTaskData);

                try {
                    await putTaskDataOnFirebase(`tasks/toDo/${taskId}`, updatedTaskData);
                } catch (error) {
                    console.error(`Error updating task data on Firebase:`, error);
                }
            } else {
                console.warn(`Task data for id '${taskId}' not found in tasks.toDo.`);
                console.log(`tasks object:`, tasks);
            }

            updateNoTasksDisplay(previousDropZone);
            updateNoTasksDisplay(dropZone);
        } else {
            console.warn("Dragged task was not inside a valid drop zone.");
        }
    } else {
        console.warn("Invalid taskId or dropZoneId.");
    }

    clearDragStyles();
}

function onDragEnd(event) {
    event.target.classList.remove("dragging"); // Remove dragging style
    
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
    const taskCards = dropZone.querySelectorAll(".taskCard"); // All tasks in the zone

    if (noTasksWrapper) {
        if (taskCards.length > 0) {
            noTasksWrapper.style.display = "none"; // Tasks present, hide message
        } else {
            noTasksWrapper.style.display = "flex"; // No tasks, show message
        }
    }
}



