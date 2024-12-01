function getTaskCardTemplate(task) {
    return `
     <div class="taskCard">
        <span class="titleTask">${task.title}</span>
        <span class="descriptionTask">${task.description}</span>
        <span class="dateTask">${task.date}</span>
        <span class="assignedToTask">${task.assigned_to}</span>    
     </div>
    `
}