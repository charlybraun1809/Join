const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];

async function init() {
    userLog();
    showToast();
    initAdressbook();
    addEventListener("resize", resize);
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
                localStorage.setItem('contactCreated', 'true');
                HideNewContactOverlay();
                initAdressbook();
                renderContactForMobileOrDesktop(response.name);
                toastMSG();
                setTimeout(() => {
                toastMSG();
                }, 3750);
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

{/* <img src="./assets/icons/edit.svg" alt="Edit Pen"></img> */ }

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
                            <svg width="19" height="19" viewBox="0 0 19 19"  xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" fill="#2A3647"/>
                            </svg>
                        
                        <div>
                            <span>Edit</span>
                        </div>
                    </div>
                    <div class="popup-icon" onclick="deleteContactByName('${contact.name}')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_263172_4144" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_263172_4144)">
                        <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/>
                        </g>
                        </svg>
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

function getName() {
    let name = document.getElementById('editName').innerText;
    if (!name) {
        return
    } else {
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
        document.getElementById('contact-space').classList.add('contact-slide');
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
