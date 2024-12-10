function getTaskCardTemplate(task, contacts) {
    let assignedToHTML = "";
    let categoryHTML = "";

    task["assigned to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}</div>`;
    });

    task["category"].forEach(category => {
        categoryHTML += `<div class="subtaskHTML">${category}</div>`;
    });

    let initialsHTML = getInitialsAndBackgroundColor(contacts);

    return `
        <div class="taskCard">
            <div class="cardHeader">
                <span class="categoryTask">${categoryHTML}</span>
            </div>
            <div class="cardBody">
                <span class="titleTask">${task.title}</span>
                <span class="descriptionTask">${task.description}</span>
                <div id="progressBar"></div>
            </div>
            <div id="assignedContacts">
                ${initialsHTML}
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

