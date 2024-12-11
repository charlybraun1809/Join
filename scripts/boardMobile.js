async function init() {
    await loadContacts();
    await loadTasks();
    userLog();
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
    } renderTaskCard();
    //dynamische hinzugefügte elemente erhalten keine bestehenden event listener!!(deshalb nicht in init aufrufen)
    addProgressbarEventListener();
}

function renderTaskCard() {
    let ref = document.getElementById('noTasks');
    ref.innerHTML = "";
    tasks.forEach(task => {
        let contactData = task['assigned to'].map(user => {
            return contacts.find(contact => contact.name === user);
        });
        // Übergabe der Task und Kontakte an das Template
        ref.innerHTML += getTaskCardTemplate(task, contactData);
    });
    
}

function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

function addProgressbarEventListener() {
    let cards = document.querySelectorAll('.taskCard')
    cards.forEach((card) => {
        let checkBoxes = card.querySelectorAll("input[type='checkbox']");

        checkBoxes.forEach((checkBox) => {
            checkBox.addEventListener('change', () => {
                updateProgressBar(card)
            })
        })
    })
}

function updateProgressBar(card) {
    let progressBar = card.querySelector('#progressBar');
    let checkboxes = card.querySelector('#checkBoxes');

    let selectedCheckbox = checkboxes.querySelectorAll("input[type='checkbox']:checked");
    let checked = selectedCheckbox.length;

    progressBar.style.width = ((checked / 2) * 100) + "%";
}




























/*function updateProgressBar(card) {
    let bar = card.querySelector('#progressBar');
    let checkBoxes = card.querySelector('#checkBoxes');

    // Finde die angeklickten Checkboxen innerhalb der Karte
    let boxes = checkBoxes.querySelectorAll("input[type='checkbox']:checked");
    let checked = boxes.length;

    // Aktualisiere die Breite der Progressbar basierend auf den Checkboxen
    bar.style.width = ((checked / 2) * 100) + "%";
}

function addProgressbarEventListener() {
    document.querySelectorAll('.taskCard').forEach((card) => {
        let checkboxes = card.querySelectorAll("input[type='checkbox']");
        
        // Füge den Event Listener für jede Checkbox in der Karte hinzu
        checkboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                updateProgressBar(card);
            });
        });
    });
}*/

