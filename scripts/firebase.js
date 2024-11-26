let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';
let contacts = [];

async function init() {

}

function confirmInputs() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');

    if (title.value && description.value) {
        saveSelectedContact();
        saveTask("./tasks", {
            "Title": title.value,
            "Description": description.value,
            "Assigned to": selectedContact,
            
        })
    } else {
        alert('bitte Felder ausfüllen');
    }
}

async function saveTask(path = "", data = {}) {
    let response = await fetch(baseURL + path + '.json', {
        method: "Post",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

let selectedContact = [];

function saveSelectedContact() {
    let dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        let checkBox = item.querySelector('input[type="checkbox"]');
        let assignedContact = item.textContent.trim();
        checkBox.addEventListener('change', () => {
            if (checkBox.checked) {
                if (!selectedContact.includes(assignedContact)) {
                    selectedContact.push(assignedContact);
                }
                
            } else {
                selectedContact = selectedContact.filter(contact => contact !== assignedContact);
            }
        });
    });        console.log(selectedContact);
}


