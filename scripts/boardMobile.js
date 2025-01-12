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
    placeTasksInDropZones();
    //dynamische hinzugefügte elemente erhalten keine bestehenden event listener!!(deshalb nicht in init aufrufen)
}

function renderTaskCard() {
<<<<<<< HEAD
    let ref = document.getElementById('noTasks');
    
    if (tasks.length > 0) {
        ref.innerHTML = ""; // Leert das Element, falls Tasks existieren
        tasks.forEach(task => {
            let contactData = task['assigned to'].map(user => {
                return contacts.find(contact => contact.name === user);
            });
            ref.innerHTML += getTaskCardTemplate(task, contactData); // Fügt Task-Template hinzu
        });
    } else {
        // Wenn keine Tasks mehr vorhanden sind, zeige eine Nachricht an
        ref.innerHTML = `
            <div class="noTasksWrapper" id="noTasks">
                    <span class="noTasksContent">No tasks To do</span>
                </div>
        `;
        console.log('No Tasks there...');
    }
=======
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
>>>>>>> BackUpFromBackUp--AllTest
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

            // Rufe die Funktion auf, um die Daten an den Server zu senden
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
        method: 'POST',
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
    let overlay = document.getElementById('taskOverlayBackground');
    let data = JSON.parse(imgElement.getAttribute('data-task'));
    let task = data.task;
    let contactsTaskCard = data.contactsTaskCard;

    // Überprüfen, ob das targetDiv existiert, und ggf. neu erstellen
    let targetDiv = document.getElementById('taskOverlayWrapper');
    if (!targetDiv) {
        // Neues Element erstellen, falls nicht vorhanden
        targetDiv = document.createElement('div');
        targetDiv.id = 'taskOverlayWrapper';
        document.body.appendChild(targetDiv); // Oder an einen anderen Container anhängen
    }

    let taskCard = imgElement.closest('.taskCard');

    targetDiv.innerHTML = "";
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    targetDiv.innerHTML += getTaskOverlayTemplate(task, contactsTaskCard);
    renderAssignedContactsOverlay(task, contactsTaskCard);
    addProgressbarEventListener(taskCard, task);
}


function closeOverlay() {
    let overlay = document.getElementById('taskOverlayBackground');
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
    if (typeof contactsTaskCard === "string") contactsTaskCard = JSON.parse(contactsTaskCard);

    let overlayRef = document.getElementById('taskOverlayWrapper');
    overlayRef.innerHTML = "";

    overlayRef.innerHTML += getOverlayEditTemplate(task, contactsTaskCard);
    overlayRef.classList.add('overlayEditScroll');

    renderSubtaskOverlay(task);
    markAssignedContacts(task); // Initiale Zuordnungen setzen
    saveSelectedContact(); // Event-Listener für Checkboxen setzen und Initialen rendern
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
        const assignedContacts = taskData.assigned_to; // Liste der gespeicherten Kontakte
        const dropdownItems = document.querySelectorAll('.dropdown-item-contacts');

        dropdownItems.forEach(item => {
            let checkBox = item.querySelector('input[type="checkbox"]');
            let contactName = item.textContent.trim();

            // Überprüfen, ob der Kontakt zugewiesen ist
            if (assignedContacts.includes(contactName)) {
                checkBox.checked = true; // Checkbox aktivieren
                if (!selectedContact.includes(contactName)) {
                    selectedContact.push(contactName); // Initial hinzugefügt
                }
            } else {
                checkBox.checked = false; // Checkbox deaktivieren
                selectedContact = selectedContact.filter(contact => contact !== contactName);
            }
        });
    } else {
        console.warn("Keine gespeicherten Kontakte für diesen Task gefunden.");
    }

    renderAssignedToInitials(); // Initialen basierend auf initialen Zuweisungen rendern
}


function updateInitials(contactName, action) {
    const initialsContainer = document.getElementById("assignedToInitials");
    
    if (action === "add") {
        // Überprüfen, ob die Initialen bereits existieren
        if (!initialsContainer.querySelector(`[data-contact-name="${contactName}"]`)) {
            const newInitial = document.createElement("div");
            newInitial.className = "contact-initial";
            newInitial.dataset.contactName = contactName; // Kontaktname speichern
            newInitial.textContent = contactName
                .split(' ')
                .map(name => name[0]) // Initialen generieren
                .join('')
                .toUpperCase(); // Großbuchstaben verwenden
            initialsContainer.appendChild(newInitial); // Hinzufügen
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
                updateInitials(contactName, "add"); // Kontakt hinzufügen
            } else {
                updateInitials(contactName, "remove"); // Kontakt entfernen
            }
        });
    });
}

async function deleteTask(taskId) {
    try {
        const apiUrl = `${baseURL}tasks/toDo/${taskId}.json`;

        // DELETE-Anfrage senden
        const response = await fetch(apiUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            console.log(`Task mit ID ${taskId} wurde erfolgreich gelöscht.`);
            // Overlay schließen
            closeOverlay();
            // Tasks neu laden und rendern
            await loadTasks();
        } else {
            console.error(`Fehler beim Löschen der Aufgabe mit ID ${taskId}:`, response.statusText);
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
    }
}

let draggedTaskId = null;

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
    const tasks = document.querySelectorAll(".taskCard");     
    
    tasks.forEach(task => {
        task.style.display = "block"; // Show all tasks after drag ends
    });
    
    clearDragStyles();
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

<<<<<<< HEAD









=======
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
>>>>>>> BackUpFromBackUp--AllTest
