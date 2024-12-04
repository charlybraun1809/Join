async function init() {
    await loadContacts();
    await loadTasks();
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
    let contactsData = await getTaskData('contacts');
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
            
        }
        tasks.push(task);
        console.log(tasks);
    } renderTaskCard();
}

function renderTaskCard() {
    let ref = document.getElementById('noTasks');
    ref.innerHTML = "";
    tasks.forEach(task => {
        for (let index = 0; index < contacts.length; index++) {
            const contact = contacts[index];
            ref.innerHTML += getTaskCardTemplate(task, contact);
        };
    })

}

function getInitials(name) {
    return name.map(name => {
        let nameParts = name.split(' ');
        let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
        let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
        return firstNameInitials + lastNameInitials;
    });
}

