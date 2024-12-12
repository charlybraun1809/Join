const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

async function init() {
    // let urlParams = new URLSearchParams(window.location.search);
    // let contactId = urlParams.get('contactId');
    // let contactCreated = localStorage.getItem('contactCreated');
    // if (contactCreated === 'true') {
    //     createBanner("Contact successfully created");
    //     localStorage.removeItem('contactCreated');

    // if (contactId) {
    //     await initContactDetail();
    // } else {
    //     await loadContacts();
    //     renderContacts();

    userLog();
    showToast();
    addEventListener("resize", resize)

}

async function initAdressbook() {
    await loadContacts();
    renderContactsHtml();
    userLog();
    loggedInHeader();
}

function resize() {
    let width = window.innerWidth;
    if (width > 1023.99) {
        window.location.href = 'addressbook.html'
    }
}

function renderSingleContact(contact) {
    let contactContainer = document.getElementById('contact-list');
    if (!contactContainer) {
        return;
    }
    contactContainer.innerHTML = addNewContactTemplate(contact);
}


async function loadContacts() {
    contacts = [];
    let contactsData = await getData('contacts');
    if (!contactsData) {
        console.error("keine kontakte gefunden");
        return;
    }
    for (let key in contactsData) {
        let singleContact = contactsData[key];
        let contact = {
            "id": key,
            "name": singleContact.name,
            "mail": singleContact.mail,
            "phone": singleContact.phone,
            "background": singleContact.background,
        };
        contacts.push(contact);
    }
    contacts.sort((a, b) => a.name.localeCompare(b.name));
}

function renderContacts() {
    let contactContainer = document.getElementById('contact-list');
    if (!contactContainer) {
        return;
    }
    contactContainer.innerHTML = '';
    if (contacts.length === 0) {
        contactContainer.innerHTML = `<p>Keine Kontakte gefunden.</p>`;
        return;
    }
    contacts.forEach(contact => {
        contactContainer.innerHTML += addNewContactTemplate(contact);
    });
}


function renderContactsHtml() {
    let contactListContainer = document.getElementById("contact-list");
    if (!contactListContainer) {
        return;
    }
    contactListContainer.innerHTML = '';
    let groupedContacts = groupContactsByLetter(contacts);
    for (let letter in groupedContacts) {
        let group = groupedContacts[letter];
        let groupHtml = renderContactGroupTemplate(letter, group);
        contactListContainer.innerHTML += groupHtml;
    }
}

async function initContactDetail() {
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    if (contactId) {
        let contactData = await getData(`contacts/${contactId}`);
        if (contactData) {
            renderSingleContact({ id: contactId, ...contactData });
        } else {
            console.error("Contact data is empty or could not be loaded.");
        }
    }
}

initContactDetail();

function groupContactsByLetter(contacts) {
    let grouped = {};
    contacts.forEach(contact => {
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(contact);
    });
    return grouped;
}

async function getData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
}

function viewContact(contactId) {
    let contact = contacts.find(c => c.id === contactId);

    if (contact) {
        let contactDetailContainer = document.getElementById('contact-list');
        contactDetailContainer.innerHTML = addNewContactTemplate(contact);
    } else {
        console.error("Kontakt nicht gefunden.");
    }
}

async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to post data:", error);
    }
}

async function putData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to update data:", error);
    }
}


async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to delete data:", error);
    }
}


function addContact() {
    let name = document.getElementById('inputName').value;
    let inputMail = document.getElementById('inputEmail').value;
    let phone = document.getElementById('inputPhone').value;
    let newContact = {
        name: name,
        mail: inputMail,
        phone: phone,
        background: getRandomColor(),
    };
    postData("contacts", newContact)
        .then(response => {
            if (response && response.name) {
                // localStorage.setItem('contactCreated', 'true');
                HideNewContactOverlay();
                initAdressbook();
                renderContactForMobileOrDesktop(response.name);
                // window.location.href = `contacts.html?contactId=${response.name}`;
            } else {
                console.error("Keine ID für den neuen Kontakt erhalten.");
            }
        })
        .catch(error => {
            console.error("Fehler beim Hinzufügen des Kontakts:", error);
        });
}


function showToast() {
    let status = localStorage.getItem('contactCreated') === "true";
    if (status) {
        toastMSG()
    }
    localStorage.setItem('contactCreated', 'false');
}



// for the logo
function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

//automatically creation of a logo background Color
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// table sections
function renderContactGroupTemplate(letter, contacts) {
    let groupHtml = `
        <div class="contact-group">
            <h3>${letter}</h3>
            <div class="divider"></div>
    `;
    contacts.forEach(contact => {
        groupHtml += renderContactItemTemplate(contact);
    });
    groupHtml += `</div>`;
    return groupHtml;
}


function renderContactItemTemplate(contact) {
    let initials = getInitials(contact.name);
    return `
        <div class="contact-container" onclick="renderContactForMobileOrDesktop('${contact.id}')">
            <div class="contact-item">
                <div class="contacts-logo-adressbook" style="background-color: ${contact.background};">
                    ${initials}
                </div>
                <div class="contact-info">
                    <p class="contact-name">${contact.name}</p>
                    <p class="contact-email">${contact.mail}</p>
                </div>
            </div>
        </div>
    `;
}



//Contacts
function addNewContactTemplate(contact) {
    let initials = getInitials(contact.name);
    return `
        <div class="contacts-header">
            <div class="contacts-logo" style="background-color: ${contact.background};">
                ${initials}
            </div>
            <div class="action-area">
                <div>
                    <h3 id="editName">${contact.name}</h3>
                </div> 
                <div class="action-buttons">
                    <div class="popup-icon" onclick="showEditContactOverlay()">
                        <img src="./assets/icons/edit.svg" alt="Edit Pen">
                        <span>Edit</span>
                    </div>
                    <div class="popup-icon" onclick="deleteContactByName('${contact.name}')">
                        <img src="./assets/icons/delete.png" alt="Garbage Icon">
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div class="contact-information">
            Contact Information
        </div>
        <div class="contacts-info">
            <div class="mail">
                <strong>Email</strong>
                
                <a href="mailto:${contact.mail}">
                    <span id="editMail" class="email-first-char">${contact.mail || 'Keine E-Mail verfügbar'}</span>
                </a>
            </div>
            <div class="mail">
                <strong>Phone</strong>
                <a style="color: #2A3647" id="editPhone" href="tel:${contact.phone}">
                   ${contact.phone || 'Keine Telefonnummer verfügbar'}
                </a>
            </div>
        </div>
    `;
}


async function editContact() {
    let name = document.getElementById('nameInput');
    let mail = document.getElementById('mailInput');
    let phone = document.getElementById('phoneInput');
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    let newData = {
        name: name.value,
        mail: mail.value,
        phone: phone.value,
        background: await getExistingColor(),
    }
    putData(`/contacts/${contactId}`, newData);
    setTimeout(() => {
        window.location.href = `contacts.html?contactId=${contactId}`;

    }, 500);
}


async function editContactByName() {
    let name = document.getElementById('editName').innerText;
    let mail = document.getElementById('editMail').innerText;
    let phone = document.getElementById('editPhone').innerText;
    let nameInput = document.getElementById('nameInput');
    let mailInput = document.getElementById('mailInput');
    let phoneInput = document.getElementById('phoneInput');
    let data = await getData('/contacts');
    let contactKey = Object.keys(data).find(key => data[key].name === name);

    let newData = {
        name: nameInput.value,
        mail: mailInput.value,
        phone: phoneInput.value,
        background: await getExistingColorByName(name),
    }
    if (contactKey) {
        putData(`/contacts/${contactKey}`, newData);
        setTimeout(() => {
            // window.location.href = `addressbook.html`;

            // initAdressbook();
            renderContactForMobileOrDesktop(contactKey)
            HideEditContactOverlay();
        }, 250);
    }

}


function deleteContact() {
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId')
    deleteData("/contacts/" + contactId);
    setTimeout(() => {
        window.location.href = "addressbook.html"
    }, 100);
}


async function deleteContactByName() {
    let name = document.getElementById('editName').innerText;

    try {
        let data = await getData("/contacts");
        let contactKey = Object.keys(data).find(key => data[key].name === name);
        if (contactKey) {
            deleteData(`/contacts/${contactKey}`)
            setTimeout(() => {
                window.location.href = "addressbook.html"
            }, 100);
        } else {
            console.error(("Contact not found"));
        }
    }
    catch (error) {
        console.error("coudnt reach contacts", error);
    }
}

function getName(){
    let name = document.getElementById('editName').innerText;
    if (!name) {
        return
    } else{
        console.log(name);
    }
}


function getinfo() {
    let nameInput = document.getElementById('nameInput');
    let mailInput = document.getElementById('mailInput');
    let phoneInput = document.getElementById('phoneInput');
    let name = document.getElementById('editName').innerText;
    let mail = document.getElementById('editMail').innerText;
    let phone = document.getElementById('editPhone').innerText;
    if (!name) {
        return
    } else {
        nameInput.value = name;
        mailInput.value = mail;
        phoneInput.value = phone;
    }
}


async function insertOverlayInput() {
    let name = document.getElementById('nameInput');
    let mail = document.getElementById('mailInput');
    let phone = document.getElementById('phoneInput');
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    if (!contactId) {
        return
    } else {
        let contactData = await getData(`/contacts/${contactId}`);
        name.value = contactData.name;
        mail.value = contactData.mail;
        phone.value = contactData.phone;
    }
}


async function getExistingColor() {
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    let contactData = await getData(`/contacts/${contactId}`);
    let color = contactData.background;
    return color;
}


async function getExistingColorByName(name) {
    let data = await getData('/contacts');
    let contactKey = Object.keys(data).find(key => data[key].name === name)
    let color = data[contactKey].background
    return color
}


function renderContactForMobileOrDesktop(contactId) {
    if (window.innerWidth < 1024) {
        window.location.href = `contacts.html?contactId=${contactId}`;
    } else {
        loadAndRenderSingleContact(contactId);
    }
}


async function loadAndRenderSingleContact(contactId) {
    let html = document.getElementById('contact-space');
    let contact = await getData(`contacts/${contactId}`);
    html.innerHTML = addNewContactTemplate(contact);
}

async function insertLogo() {
    let htmldiv = document.getElementById('logoOverlay')
    let name = document.getElementById('editName').innerText;
    let initials = getInitials(name);
    let data = await getData('/contacts');
    let objectKey = Object.keys(data).find(key => data[key].name === name);
    let color = data[objectKey].background;
    htmldiv.innerHTML = `
        <div class="contacts-logo-Overlay" style="background-color:${color};">
            ${initials}
        </div>
    `;
}