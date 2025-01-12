function getTaskCardTemplate(task, contactsTaskCard) {
    let assignedToHTML = "";
    let categoryHTML = "";

    task["assigned_to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}</div>`;
    });
    if (task["category"]) {
        task["category"].forEach(category => {
            categoryHTML += `<div class="subtaskHTML">${category}</div>`;
        });
    } else if (contactsTaskCard?.category) {
        contactsTaskCard.category.forEach(category => {
            categoryHTML += `<div class="subtaskHTML">${category}</div>`;
        });
    }


    let initialsHTML = getInitialsAndBackgroundColor(contactsTaskCard);

    return /*HTML*/`
        <div class="taskCard" draggable="true" 
            ondragstart="onDragStart(event, '${task.id}')" 
            ondragend="onDragEnd(event)"
            id="${task.id}">
            <div class="cardHeader">
                <span class="categoryTask ${task.category == 'Userstory' ? 'bg-userstory' : 'bg-technical'}">${categoryHTML}</span>
            </div>
            <div class="cardTextContent">
                <span class="titleTask">${task.title}</span>
                <span class="descriptionTask">${task.description}</span>
            </div>
            <div id="progressBarDiv">
                <div id="progressBarWrapper">
                    <div id="progressBar"></div>
                </div>
                <span> 1/2 Subtasks </span>
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

function checkCheckbox(id) {
    let checkBox = document.getElementById(id);
    checkBox.checked = true;
}

function getTaskOverlayTemplate(task, contactsTaskCard) {
    let subtasks = () => {
        let subtasksHTML = "";
        for (let i = 0; i < task.subtasks.length; i++) {
            const singleSubtask = task.subtasks[i];
            subtasksHTML += `
                <div class="subtaskItem" onclick="checkCheckbox(${i})">
                    <input type="checkbox" class="subtaskCheckbox" data-index="${i}" id=${i}>
                    <label for="subtask-${i}" class="subtaskDescription no-wrap">${singleSubtask}</label>
                </div>
            `;
        }
        return subtasksHTML;
    };
<<<<<<< HEAD
    return `
=======
    

    return /*HTML*/`
>>>>>>> BackUpFromBackUp--AllTest
        <div id="overlayWrapper">
            <div class="overlayHeader">
                <span class="overlayTaskCat ${task.category == 'Userstory' ? 'bg-userstory' : 'bg-technical'}">${task.category}</span>
                <img src="assets/icons/crossOverlay.png" onclick="closeOverlay()">
            </div>
            <div class="overlayBody">
                <div class="overlayMainInfos">
                    <span class="overlayTitle">${task.title}</span>
                    <span class="overlayDescription">${task.description}</span>
                    <table>
                        <tr>
                            <td><span class="overlayTitles">Due date:</span></td>
                            <td><span>${task.date}</span></td>
                        </tr>
                        <tr>
                            <td><span class="overlayPriority overlayTitles">Priority:</span></td>
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
                    <span class="overlayTitles">Assigned To:</span>
                    <span id="overlayContacts"></span>
                </div>
                <div class="overlaySubtasks">
                    <span class="overlayTitles">Subtasks</span>
                    <div id="checkBoxes">
                        ${subtasks()}
                    </div>
                </div>
                    <div class="overlayActions">
        <button id="editTask" onclick='editOverlayContent(${JSON.stringify(task)}, ${JSON.stringify(contactsTaskCard)})'>Edit</button>
        <button id="deleteTask" onclick="deleteTask('${task.id}')">Delete</button>


    </div>
            </div>
        </div>
    `;
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
    return /*HTML*/`
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

function overlaySubtaskTemplate(singleSubtask) {
    return /*HTML*/`
        <ul id="ulSubtasksOverlay"> 
            <li class="addedSubtaskContent">
                <span class="addedSubtaskInput">${singleSubtask}</span>
                <div class="addedSubtaskImages">
                    <img src="assets/icons/delete.png" class="deleteSubtask">
                    <div class="seperatorAddedSubtasks"></div>
                    <img src="assets/icons/edit.png" class="editSubtask">
                </div>
            </li>
        </ul>
    `
}


function getDropdownContactsTemplate(contact) {
    return /*HTML*/`
    <li class="dropdown-item-contacts">
        <label class="custom-checkbox">
            ${contact.name}
            <input type="checkbox">
            <span></span>
        </label>
    </li>`
}

function getOverlayEditTemplate(task, contactsTaskCard) {
    let initialsHTML = getInitialsAndBackgroundColor(contactsTaskCard);
    let subtaskHTML =  overlaySubtaskTemplate(task);
    let taskData = JSON.stringify(task);
    return /*HTML*/`
        <div id="editOverlayHeader">
        <img src="assets/icons/crossOverlay.png" onclick="closeOverlay()">
        </div>
        <div class="inputFlexbox">
                <span id="requiredHeaders">Title <img src="assets/icons/required.png" alt="" id="required"></span>
                <input class="title" id="titleInput" type="text" placeholder="Enter a title" required
                    onclick="keepInputBlue(0)" value="${task.title}">
                   
            </div>
            <div class="inputFlexbox">
                <span>Description</span>
                <textarea rows="5" cols="50" class="title" id="descriptionInput" type="text"
                    placeholder="Enter description" required onclick="keepInputBlue(1)">${task.description}</textarea>
            </div>
            <div class="inputFlexbox">
                <span>Assigned to</span>
                <div id="assignedToDropdownContacts" class="title" tabindex="0" onclick="keepInputBlue(2)">
                    <div class="dropdown-selected">
                        <span>Select contact</span>
                        <img src="assets/icons/arrow_drop_downaa.png" id="dropdown-arrow-contacts"></img>
                    </div>
                    <ul id="dropdown-list-contacts"></ul>
                </div>
                <div id="assignedToInitials">
                    ${initialsHTML}
                </div>

            </div>
            <div class="inputFlexbox">
                <span id="requiredHeaders">Due date <img src="assets/icons/required.png" alt="" id="required"></span>
                <input class="title" id="date" value="${task.date}" type="date" tabindex="0" required onclick="keepInputBlue(3)">
            </div>
            <div class="inputFlexbox">
                <span>Prio</span>
                <div class="prioDivsWrapper">
                    <div id="urgent" class="prioGrade" onclick="setPrioColor(0)">
                        <span>Urgent</span> <img src="assets/icons/prioUrgentRed.png" class="prioImage" alt="">
                    </div>
                    <div id="medium" class="prioGrade" onclick="setPrioColor(1)" >
                        <span>Medium</span> <img src="assets/icons/prioMediumOrange.png" class="prioImage" alt="">
                    </div>
                    <div id="low" class="prioGrade" onclick="setPrioColor(2)">
                        <span>Low</span> <img src="assets/icons/prioLowGreen.png" class="prioImage" alt="">
                    </div>
                </div>
            </div>
            <div class="inputFlexbox" id="category" style="display: none;">
                <span id="requiredHeaders">Category <img src="assets/icons/required.png" alt="" id="required"></span>
                <div id="assignedToDropdownCategory" class="title" tabindex="0" onclick="keepInputBlue(4)">
                    <div class="dropdown-selected" id="input-category">
                        <span id="categoryPlaceholder">Select task category</span>
                        <img src="assets/icons/arrow_drop_downaa.png" id="dropdown-arrow-subtasks"></img>
                    </div>
                    
                </div>

            </div>
            <div class="inputFlexbox" id="subtasksOverlay">
                <span>Subtasks</span>
                <div class="dropdown-subtasks" class="dropdown-container">
                    <input type="text" class="dropdown-selected input-subtask" placeholder="Select new subtask">
                    <img src="assets/icons/plus.png" class="dropdown-plus-subtasks">

                    <div class="subtask-images-container" style="display: none;">
                        <img src="assets/icons/closeSubtask.png" class="subtaskImages deleteSubtask"
                            alt="Delete Subtask" onclick="deleteSubtaskInput()">
                        <div class="divider"></div> <!-- Trennlinie -->
                        <img src="assets/icons/checkSubtask.png" class="subtaskImages saveSubtask"
                            alt="Save Subtask" onclick="saveSubtaskInput(event)">
                    </div>
                </div>
                <div class="addedEditSubtask" style="display: none;">
                    <input type="text" class="subtaskEdit title" data-edit-index="1" class="title">
                    <div id="editSubtaskImgOverlay" class="editSubtaskImg">
                        <img src=assets/icons/checkSubtask.png class="saveEdit">
                    <div class="dividerEditSubtask"></div>
                        <img src="assets/icons/delete.png" class="deleteIcon">
                    </div>
                </div>    
                <div class="addedSubtaskWrapper"></div>

            </div>

            <div id="addedSubtaskWrapperOverlay">${subtaskHTML}</div>
            <button onclick='saveEditTask(${taskData})'>save</button>            
    `
}

