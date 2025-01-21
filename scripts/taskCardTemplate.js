// function getTaskCardTemplate(task, contactsTaskCard) {
//     let assignedToHTML = "";
//     let categoryHTML = "";

//     task["assigned to"].forEach(name => {
//         assignedToHTML += `<div class="assignedToTask">${name}</div>`;
//     });

//     task["category"].forEach(category => {
//         categoryHTML += `<div class="subtaskHTML">${category}</div>`;
//     });

//     let initialsHTML = getInitialsAndBackgroundColor(contactsTaskCard);

//     return `
//         <div class="taskCard">
//             <div class="cardHeader">
//                 <span class="categoryTask">${categoryHTML}</span>
//             </div>
//             <div class="cardTextContent">
//                 <span class="titleTask">${task.title}</span>
//                 <span class="descriptionTask">${task.description}</span>
//             </div>
//                 <div id="progressBarDiv">
//                     <div id="progressBarWrapper">
//                         <div id="progressBar"></div>
//                     </div>
//                 </div>
//             <div id="assignedContactsWrapper">
//             <div id="assignedContacts"> ${initialsHTML}</div>
//                <img src="${task.prioImg}" data-task='${JSON.stringify({task, contactsTaskCard})}' onclick="renderTaskOverlay(this)">
//             </div>
//         </div>
//     `;
// }


function getTaskCardTemplate(task, contactsTaskCard) {
    let assignedToHTML = "";
    let categoryHTML = "";
    let subtasksHTML = "";
    task["assigned to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}</div>`;
    });
    task["category"].forEach(category => {
        categoryHTML += `<div class="subtaskHTML">${category}</div>`;
    });
    if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach(subtask => {
            subtasksHTML += `
                <li class="subtask">
                    <span>${subtask}</span>
                </li>
            `;
        });
    }
    let initialsHTML = getInitialsAndBackgroundColor(contactsTaskCard);
    return createTaskCardHTML(task, categoryHTML, assignedToHTML, initialsHTML, subtasksHTML);
}

function createTaskCardHTML(task, categoryHTML, assignedToHTML, initialsHTML, subtasksHTML) {
    return `
        <div class="taskCard">
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
                <div id="assignedContacts">${initialsHTML}</div>
                <img src="${task.prioImg}" data-task='${JSON.stringify({ task, contactsTaskCard })}' onclick="renderTaskOverlay(this)">
            </div>
            <ul class="subtask-list">
                ${subtasksHTML}
            </ul>
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
        <li class="addedSubtaskContent">
            <span class="addedSubtaskInput" ondblclick="editSubtask(this)">${inputRef.value}</span>
            <div class="addedSubtaskImages">
                <img src="assets/icons/edit.png" class="editSubtask" onclick="editSubtask(this)">
                <div class="seperatorAddedSubtasks"></div>
                <img src="assets/icons/delete.png" class="deleteSubtask" onclick="deleteSubtask(this)">
            </div>
            <span class="error-message dNone">This field is required</span>
        </li>
    `;
}


function getDropdownContactsTemplate(contact) {
    const initials = getInitials(contact.name);
    return `
    <li class="dropdown-item-contacts">
        <div class="contacts-logo-adressbook" style="background-color: ${contact.background};">
            ${initials}
        </div>
        <label class="custom-checkbox">
            ${contact.name}
            <input type="checkbox">
            <span><img class="dNone" src="./assets/icons/addTaskCheck.png" alt="Checkbox"></span>
        </label>
        <span class="error-message dNone">Please select at least one contact</span>
    </li>`;
}


