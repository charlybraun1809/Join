let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';
let contacts = [];

async function init() {
    await loadContacts();
    renderContacts();
}

async function getDataFromFirebase(path = '') {
    let response = await fetch(baseURL + path + '.json');
    return responseToJson = await response.json();
}

async function loadContacts() {
    let contactsData = await getDataFromFirebase('users');
    for (let key in contactsData) {
        let singleContact = contactsData[key];
        let contact = {
            "name": singleContact.name,
            "id": key,
            "mail": singleContact.mail,
            "password": singleContact.password,
        }
        contacts.push(contact);
    }
    console.log(contacts);
}

function renderContacts() {
    let contentRef = document.getElementById('contactCard');
    for (let index = 0; index < contacts.length; index++) {
        let contact = contacts[index];
        contentRef.innerHTML += getContactsTemplate(contact);
    }
}

