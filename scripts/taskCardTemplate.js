function getTaskCardTemplate(task) {
    let assignedToHTML = "";
    let categoryHTML = "";
    let names = task['assigned to'];

    task["assigned to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}</div>`;
    });

    task["category"].forEach(task => {
        categoryHTML += `<div class="subtaskHTML">${task}</div>`;
    });

    let initials = getInitials(names).map(initial => `<span class="initials"}>${initial}</span>`).join(' ');
    
    return `
        <div class="taskCard">
        <div class="cardHeader">
            <span class="categoryTask">${categoryHTML}</span>
        </div>
        <div class="cardBody">
            <span class="titleTask">${task.title}</span>
            <span class="descriptionTask">${task.description}</span>
        </div>
            <div class="assignedContacts">
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

async function getInitialsColor(names) {
    let contactsData = await getData('contacts');
    if (contactsData) {
        Object.values(contactsData).forEach(contact => {
            if (contact.name === names) {
                let backgroundColor = contact.background;
                console.log(backgroundColor);
                return backgroundColor;
                
            }
        })
    }
}