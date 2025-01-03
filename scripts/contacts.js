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
}

async function initAdressbook() {
    await loadContacts();
    renderContactsHtml();
    userLog();
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
                localStorage.setItem('contactCreated', 'true');
                window.location.href = `contacts.html?contactId=${response.name}`;
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

function showEditContactOverlay(contactId) {
    console.log(`Editing contact with ID: ${contactId}`);
    console.log(`Edit Contact Overlay geöffnet für Kontakt-ID: ${contactId}`);
    let editContactOverlay = document.getElementById('edit-contact');
    

    if (!editContactOverlay) {
        console.error("Edit Contact Overlay nicht gefunden.");
        return;
    }


    let contact = contacts.find(c => c.id === contactId);
    if (contact) {
        document.getElementById('editName').value = contact.name || '';
        document.getElementById('editEmail').value = contact.mail || '';
        editContactOverlay.classList.remove('d-none');
        document.body.style.overflow = 'hidden';
    } else {
        console.error("Kontakt nicht gefunden!");
    }
}

function closeEditContactOverlay() {
    let editContactOverlay = document.getElementById('edit-contact');
    if (editContactOverlay) {
        editContactOverlay.classList.add('d-none');
        document.body.style.overflow = '';
    }
}


function openPopupMenu(event) {
    let popup = document.getElementById('popup-content');
    if (!popup) {
        createPopup();
        popup = document.getElementById('popup-content');
    }
    if (popup.classList.toggle('show-burger-menu')) {
        popup.classList.toggle('show-burger-menu');
    } else {
        popup.classList.toggle('show-burger-menu');
        document.body.addEventListener('click', closePopupOnOutsideClick);
    }
}

function closePopupOnOutsideClick(event) {
    let popup = document.getElementById('popup-content');
    if (popup && !popup.contains(event.target)) {
        popup.classList.toggle('show-burger-menu');
        document.body.removeEventListener('click', closePopupOnOutsideClick);
    }
}

function createPopup() {
    let popup = document.getElementById("popup-content");
    if (!popup) {
        document.body.innerHTML += popUpRenderHTML();

    }
}


//Edit contacts
function editContact(contactId) {
    let contact = contacts.find(c => c.id === contactId);
    if (contact) {
        document.querySelector('#edit-contact input[placeholder="Name"]').value = contact.name;
        document.querySelector('#edit-contact input[placeholder="Email"]').value = contact.mail;
        toggleOverlay('edit-contact');
    }
}

document.querySelectorAll('.edit-button').forEach(button => {
    button.addEventListener('click', () => {
        let contactId = button.getAttribute('data-contact-id');
        editContact(contactId);
    });
});

function createBanner(message) {
    let banner = document.getElementById("banner-message");
    if (!banner) {
        document.body.innerHTML += bannerHtmlRender();
        banner = document.getElementById("banner-message");
    }
    banner.querySelector('p').textContent = message;
    banner.classList.remove("d-none");
    banner.classList.add("banner-slide-in");
    setTimeout(() => {
        banner.classList.add("d-none");
        banner.classList.remove("banner-slide-in");
    }, 3000);
}


//Banner
function bannerHtmlRender() {
    return `
        <div id="banner-message" class="banner d-none">
            <p></p>
        </div>
    `;
}

// Burger-menu
function popUpRenderHTML() {
    return `
        <div class="popup-overlay">
            <div class="popup-content" id="popup-content" onclick="event.stopPropagation()>
                <div class="action-buttons">
                    <div class="popup-icon">
                        <img src="assets/icons/edit.png" alt="Edit Pen">
                        <button onclick="showEditContactOverlay('${contact.id}')">Edit</button>
                    </div>
                    <div class="popup-icon">
                        <img src="assets/icons/delete.png" alt="Garbage Icon">
                        <button onclick="deleteContact()">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

//Adressbook

function renderContactItemTemplate(contact) {
    let initials = getInitials(contact.name);
    return `
        <a class="contact-container" href="contacts.html?contactId=${contact.id}">
            <div class="contact-item">
                <div class="contacts-logo-adressbook" style="background-color: ${contact.background};">
                    ${initials}
                </div>
                <div class="contact-info">
                    <p class="contact-name">${contact.name}</p>
                    <p class="contact-email">${contact.mail}</p>
                </div>
            </div>
        </a>
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
            <h3>${contact.name}</h3>
        </div>
        <div class="contact-information">
            Contact Information
        </div>
        <div class="contacts-info">
            <div class="mail">
                <strong>Email</strong>
                
                <a href="mailto:${contact.mail}">
                    <span class="email-first-char">${contact.mail || 'Keine E-Mail verfügbar'}</span>
                </a>
            </div>
            <div class="phone">
                <strong>Phone</strong>
                <a style="color: #2A3647" href="tel:${contact.phone}">
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
    console.log(insertOverlayInput());
}


function deleteContact() {
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    deleteData("/contacts/" + contactId);
    window.location.href = "addressbook.html"
}

 async function insertOverlayInput() {
    let name = document.getElementById('nameInput');
    let mail = document.getElementById('mailInput');
    let phone = document.getElementById('phoneInput');
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    let contactData = await getData(`/contacts/${contactId}`);
    name.value = contactData.name;
    mail.value = contactData.mail;
    phone.value = contactData.phone;
}

async function getExistingColor() {
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('contactId');
    let contactData = await getData(`/contacts/${contactId}`);
    let color = contactData.background;
    return color;
    
}

