function getTaskCardTemplate(task, contactsTaskCard) {
    let assignedToHTML = "";
    let categoryHTML = "";

    task["assigned to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}</div>`;
    });

    task["category"].forEach(category => {
        categoryHTML += `<div class="subtaskHTML">${category}</div>`;
    });

    let initialsHTML = getInitialsAndBackgroundColor(contactsTaskCard);

    return `
        <div class="taskCard" draggable="true" 
            ondragstart="onDragStart(event, '${task.id}')" 
            ondragend="onDragEnd(event)"
            id="${task.id}">
            <div class="cardHeader">
                <span class="categoryTask">${categoryHTML}</span>
            </div>
            <div class="cardTextContent">
                <span class="titleTask">${task.title}</span>
                <span class="descriptionTask">${task.description}</span>
            </div>
            <div id="progressBarDiv">
                <div id="progressBarWrapper">
                    <div id="progressBar"></div>
                </div>
            </div>
            <div id="assignedContactsWrapper">
                <div id="assignedContacts"> ${initialsHTML}</div>
                <img src="${task.prioImg}" data-task='${JSON.stringify({
                    task,
                    contactsTaskCard,
                })}' onclick="renderTaskOverlay(this)">
            </div>
        </div>
    `;
}

/**WICHTIG!!! -> ZEILE 31 -> TASK WIRD IN STRING GESPEICHERT,
 *  DA OBJEKTE NICHT ALS PARAMETER IN FUNKTION ÜBERGEBEN WERDEN KÖNNEN:
 * IN RENDERTASKOVERLAY-FUNKTION WIRD DIESER STRING WIEDER IN JSON GEPARSED
 */

function getTaskOverlayTemplate(task) {
    return`
        <div id="overlayWrapper">
            <div class="overlayHeader">
            <span class="overlayTaskCat ${task.category == 'Userstory' ? 'bg-userstory' : 'bg-technical'}">${task.category}</span><img src="assets/icons/crossOverlay.png">
            </div>
            <div class="overlayBody">
                <div class="overlayMainInfos">
                <span class="overlayTitle">${task.title}</span>
                    <span class="overlayDescription">${task.description}</span>
                <table>
                    <tr>
                        <td>
                            <span class="overlayTitles">Due date:</span>
                        </td>
                        <td>
                            <span>${task.date}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>    
                            <span class="overlayPriority overlayTitles">Priority:</span>
                        </td>
                        <td>
                            <span class="overlayPrio">
                            <span>${task.priority}</span>
                            <img src="${task.prioImg}" data-task='${JSON.stringify(task)}'>
                            </span>
                        </td>
                    </tr>
                </table>
                </div> 
                <div class="overlayAssignedTo">
                    <span class="overlayTitles"> Assigned To:</span>
                    <span id="overlayContacts"></span>
                </div>
                <div class="overlaySubtasks">
                    <span class="overlayTitles">Subtasks</span>
                    <div id="checkBoxes">
                        <input type="checkbox">
                        <input type="checkbox">
                    </div>
                </div>    
            </div>
        </div>
    `   
}
function getInitialsAndBackgroundColor(contacts) {
    return Object.values(contacts)
        .map(contact => {
            let name = contact.name;
            let backgroundColor = contact ? contact.background : 'gray';
            let initial = getInitials(name);
            return `<span class="initials" style="background-color: ${backgroundColor};">${initial}</span>`;
        })
        .join('');
}

function getAddedSubtaskTemplate(inputRef) {
    return `
        <ul id="ulSubtasks"> 
            <li class="addedSubtaskContent">
                <span class="addedSubtaskInput">${inputRef.value}</span>
                <div class="addedSubtaskImages">
                    <img src="assets/icons/delete.png" class="deleteSubtask">
                    <div class="seperatorAddedSubtasks"></div>
                    <img src="assets/icons/edit.png" class="editSubtask">
                </div>
            </li>
        </ul>
    `;
}


function getDropdownContactsTemplate(contact) {
    return `
    <li class="dropdown-item-contacts">
        <label class="custom-checkbox">
            ${contact.name}
            <input type="checkbox">
            <span></span>
        </label>
    </li>`
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

function onDrop(event, dropZoneId) {
    event.preventDefault(); // Standard-Drop-Verhalten verhindern
    const taskId = event.dataTransfer.getData("text/plain"); // Task-ID abrufen
    const dropZone = document.getElementById(dropZoneId); // Ziel-Drop-Zone abrufen

    if (taskId && dropZone) {
        const draggedTask = document.querySelector(`[id='${taskId}']`);
        const previousDropZone = draggedTask.parentElement; // Vorherige Drop-Zone abrufen

        if (draggedTask) {
            dropZone.appendChild(draggedTask); // Aufgabe in die neue Drop-Zone verschieben
            
            // Alte Drop-Zone (vor dem Verschieben) aktualisieren
            updateNoTasksDisplay(previousDropZone);
            
            // Neue Drop-Zone (nach dem Verschieben) aktualisieren
            updateNoTasksDisplay(dropZone);
        } else {
            console.error(`No task element found for ID: ${taskId}`);
        }
    } else {
        console.error("Task ID or drop zone not found");
    }

    clearDragStyles(); // Stile zurücksetzen
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