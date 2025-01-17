let tasks = [];
let draggedTaskId = null;

async function init() {
    await loadContacts();
    await loadTasks();
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

    sendSubtaskForm();
    renderDropdownContacts();
    saveSelectedContact();
}

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
            "dropZone": singleTask.dropZone,
            "checkedValues": singleTask.checkedValues || [] // Ensure checkedValues are included
        }
        tasks.push(task);
    } 
    renderTaskCard();
    placeTasksInDropZones();

    const dropZones = document.querySelectorAll(".dropZone");

    dropZones.forEach(dropZone => {
        updateNoTasksDisplay(dropZone);
    });
}

function renderTaskCard() {
    let ref = document.getElementById('task');
    ref.innerHTML = ""; // Clear previous content

    tasks.forEach(task => {
        // Check if 'assigned to' exists and is an array
        let contactData = Array.isArray(task['assigned_to']) ? 
            task['assigned_to'].map(user => {
                return contacts.find(contact => contact.name === user);
            }) : []; // Default to an empty array if not

        // Render the task card using the template
        ref.innerHTML += getTaskCardTemplate(task, contactData);
    });
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

function addProgressbarEventListener(taskCard, task) {
    let overlay = document.getElementById('overlayWrapper');
    let checkBoxes = overlay.querySelectorAll("input[type='checkbox']"); 

    checkBoxes.forEach((checkBox) => {
        checkBox.addEventListener('change', () => {
            let checkedValues = [];
            checkBoxes.forEach((box) => {
                if (box.checked) {
                    checkedValues.push(box.value);
                }
            });
            saveCheckboxStatusToDatabase(checkedValues, task);
        });
    });
}

function saveCheckboxStatusToDatabase(checkedValues, task) {
    fetch(`${baseURL}tasks/toDo/${task.id}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(existingTaskData => {
            const updatedData = {
                ...existingTaskData,
                checkedValues: checkedValues
            };

            return fetch(`${baseURL}tasks/toDo/${task.id}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Successfully saved:', data);
        })
        .catch(error => {
            console.error('Error saving:', error);
        });
}

function renderTaskOverlay(imgElement) {
    let overlay = document.getElementsByClassName('taskOverlayBackground')[0];
    let data = JSON.parse(imgElement.getAttribute('data-task'));
    let task = data.task;
    let contactsTaskCard = data.contactsTaskCard;
    let targetDiv = document.getElementById('taskOverlayWrapper');
    let taskCard = imgElement.closest('.taskCard');

    targetDiv.innerHTML = ""; // Clear the existing overlay content
    overlay.style.display = 'flex'; // Show the overlay
    document.body.style.overflow = 'hidden'; // Disable scrolling
    targetDiv.innerHTML += getTaskOverlayTemplate(task, contactsTaskCard); // Insert the new task overlay
    renderAssignedContactsOverlay(task, contactsTaskCard); // Assuming this function exists and adds assigned contacts
    addProgressbarEventListener(taskCard, task); // Assuming this function adds event listeners for the progress bar
}


function closeOverlay() {
    let overlay = document.getElementsByClassName('taskOverlayBackground')[0];
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    overlay.querySelector('#taskOverlayWrapper').classList.remove('overlayEditScroll');
    
    // Add fade-out effect to the body content
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
    
    // Wait for the transition to finish, then reload the page
    setTimeout(() => {
        location.reload();
    }, 500); // Match this with the duration of the fade-out effect
}


function renderAssignedContactsOverlay(task, contactsTaskCard) {
    let assignedContactsDiv = document.getElementById('overlayContacts');
    assignedContactsDiv.innerHTML = "";
    createContactsElements(task, contactsTaskCard);
}

function createContactsElements(task, contactsTaskCard) {
    let contactsWrapper = document.getElementById('overlayContacts');
    task['assigned_to'].forEach(contactName => {
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
    overlayRef.classList.add('overlayEditScroll');
    
    renderSubtaskOverlay(task);
    markAssignedContacts(task);
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

    subtasksContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('saveEdit')) {
            saveEditSubtask(event.target);
        }
    });
}

async function getTaskFromFirebase(task) {
    const response = await fetch(baseURL + `tasks/toDo/${task.id}.json`);
    if (response.ok) {
        return response.json();
    } else {
        console.error("fehler beim laden des tasks:", response.statusText);
        return null;
    }
}

async function markAssignedContacts(task) {
    const taskData = await getTaskFromFirebase(task);

    if (taskData && taskData.assigned_to) {
        const assignedContacts = taskData.assigned_to;
        const dropdownItems = document.querySelectorAll('.dropdown-item-contacts');

        dropdownItems.forEach(item => {
            let checkBox = item.querySelector('input[type="checkbox"]');
            let contactName = item.textContent.trim();

            
            if (assignedContacts.includes(contactName)) {
                checkBox.checked = true;
                if (!selectedContact.includes(contactName)) {
                    selectedContact.push(contactName);
                }
            } else {
                checkBox.checked = false;
                selectedContact = selectedContact.filter(contact => contact !== contactName);
            }
        });
    } else {
        console.warn("Keine gespeicherten Kontakte für diesen Task gefunden.");
    }

    renderAssignedToInitials();
}

function onDragStart(event, taskId) {
    draggedTaskId = taskId; // Task-ID speichern
    event.dataTransfer.setData("text/plain", taskId); // ID für den Drop-Prozess bereitstellen
    event.target.classList.add("dragging"); 
}

function onDragOver(event) {
    event.preventDefault(); // Drop erlauben
    event.target.classList.add("drop-hover"); // Visuelle Hervorhebung der Drop-Zone
}

function onDragLeave(event) {
    event.target.classList.remove("drop-hover"); // Entfernen der visuellen Hervorhebung
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
    const tasks = document.querySelectorAll(".taskCard");     
    
    tasks.forEach(task => {
        task.style.display = "block"; // Show all tasks after drag ends
    });
    
    clearDragStyles();
    document.getElementById("searchInput").value = "";
}

function clearDragStyles() {
    document.querySelectorAll(".drop-hover").forEach(el => el.classList.remove("drop-hover"));
}

const dropZones = document.querySelectorAll('.dropZone');
dropZones.forEach(dropZone => {
    dropZone.addEventListener('dragover', onDragOver);
    dropZone.addEventListener('dragleave', onDragLeave);
    dropZone.addEventListener('drop', (event) => onDrop(event, dropZone.id));
});


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

function searchTasks() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const tasks = document.querySelectorAll(".taskCard");

    tasks.forEach(task => {
        const title = task.querySelector(".titleTask").textContent.toLowerCase();
        const description = task.querySelector(".descriptionTask").textContent.toLowerCase();

        if (title.includes(input) || description.includes(input)) {
            task.style.display = "block"; // Show task if it matches
        } else {
            task.style.display = "none"; // Hide task if it doesn't match
        }
    });
}

function handleEnter(event) {
    if (event.key === "Enter") {
        document.getElementById("searchInput").value = ""; // Clear the input field
    }
}

function updateInitials(contactName, action) {
    const initialsContainer = document.getElementById("assignedToInitials");
    
    if (action === "add") {
        if (!initialsContainer.querySelector(`[data-contact-name="${contactName}"]`)) {
            const newInitial = document.createElement("div");
            newInitial.className = "contact-initial";
            newInitial.dataset.contactName = contactName;
            newInitial.textContent = contactName
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase();
            initialsContainer.appendChild(newInitial);
        }
    } else if (action === "remove") {
        // Entfernen der Initialen
        const initialToRemove = initialsContainer.querySelector(`[data-contact-name="${contactName}"]`);
        if (initialToRemove) {
            initialsContainer.removeChild(initialToRemove);
        }
    }
}

function initializeContactCheckboxes() {
    const checkboxes = document.querySelectorAll('.dropdown-item-contacts input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("change", (event) => {
            const contactName = event.target.closest('.dropdown-item-contacts').textContent.trim();
            if (event.target.checked) {
                updateInitials(contactName, "add");
            } else {
                updateInitials(contactName, "remove");
            }
        });
    });
}

async function deleteTask(taskId) {
    try {
        const apiUrl = `${baseURL}tasks/toDo/${taskId}.json`;
        const response = await fetch(apiUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Task mit ID ${taskId} wurde erfolgreich gelöscht.`);
            closeOverlay();
            await loadTasks();
        } else {
            console.error(`Fehler beim Löschen der Aufgabe mit ID ${taskId}:`, response.statusText);
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
    }
}