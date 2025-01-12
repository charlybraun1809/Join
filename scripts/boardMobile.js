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
        }
        tasks.push(task);
    } renderTaskCard();
}

function renderTaskCard() {
    let ref = document.getElementById('noTasks');
    
    if (tasks.length > 0) {
        ref.innerHTML = "";
        tasks.forEach(task => {
            let contactData = task['assigned to'].map(user => {
                return contacts.find(contact => contact.name === user);
            });
            ref.innerHTML += getTaskCardTemplate(task, contactData);
        });
    } else {
        ref.innerHTML = `
            <div class="noTasksWrapper" id="noTasks">
                    <span class="noTasksContent">No tasks To do</span>
                </div>
        `;
        console.log('No Tasks there...');
    }
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
    const data = {
        taskId: task.id,
        checkedValues: checkedValues,
    };
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
    let targetDiv = document.getElementById('taskOverlayWrapper');
    if (!targetDiv) {
        targetDiv = document.createElement('div');
        targetDiv.id = 'taskOverlayWrapper';
        document.body.appendChild(targetDiv);
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
    if (typeof contactsTaskCard === "string") contactsTaskCard = JSON.parse(contactsTaskCard);

    let overlayRef = document.getElementById('taskOverlayWrapper');
    overlayRef.innerHTML = "";

    overlayRef.innerHTML += getOverlayEditTemplate(task, contactsTaskCard);
    overlayRef.classList.add('overlayEditScroll');

    renderSubtaskOverlay(task);
    markAssignedContacts(task);
    saveSelectedContact(); 
    initializeSubtaskFocus();
    initialiseSavePrioImg();
    saveEditSubtaskEventListener();
    initializeOverlayFunctions();
    deleteEditSubtaskEventlistener();
    editSubtaskEventListener();
}



async function saveEditTask(task) {
    let overlayBackground = document.getElementById('taskOverlayBackground');
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
    const subtasksContainer = document.getElementById('subtasks'); 
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














