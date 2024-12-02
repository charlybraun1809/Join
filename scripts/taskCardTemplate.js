function getTaskCardTemplate(task) {
    let assignedToHTML = "";
    task["assigned to"].forEach(name => {
        assignedToHTML += `<div class="assignedToTask">${name}, </div>`
    });
    return `
     <div class="taskCard">
        <span class="titleTask">${task.title}</span>
        <span class="descriptionTask">${task.description}</span>
        <span class="dateTask">${task.date}</span>
        <div class="assignedContacts"><b>Assigned to:</b> ${assignedToHTML}</div>    
     </div>
    `;
}