function getTaskCardTemplate(task, contacts) {
    let assignedToHTML = "";
    let categoryHTML = "";

    task["assigned to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}</div>`;
    });

    task["category"].forEach(category => {
        categoryHTML += `<div class="subtaskHTML">${category}</div>`;
    });

    let initials = task["assigned to"]
        .map(name => {
            let contact = contacts.find(contact => contact.name === name);
            let backgroundColor = contact ? contact.background : 'gray';
            let initial = getInitials([name]);
            return `<span class="initials" style="background-color: ${backgroundColor};">${initial}</span>`;
        })
        .join('');

    return `
        <div class="taskCard">
            <div class="cardHeader">
                <span class="categoryTask">${categoryHTML}</span>
            </div>
            <div class="cardBody">
                <span class="titleTask">${task.title}</span>
                <span class="descriptionTask">${task.description}</span>
            </div>
            <div id="assignedContacts">
                ${initials}
            </div>
        </div>
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
