const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

async function init() {
    console.log("Seite geladen...");
    await loadContacts();
    renderContactsHtml();
}


async function initAdressbook() {
    await loadContacts();
    renderContactsHtml(); 
}


function renderSingleContact(contact) {
    let contactContainer = document.getElementById('contact-detail');
    if (!contactContainer) {
        console.error("Element nicht gefunden");
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
    for (const key in contactsData) {
      const singleContact = contactsData[key];
      let contact = {
        "id": key,
        "name": singleContact.name,
        "mail": singleContact.mail,
        "phone": singleContact.phone,
      };
        contacts.push(contact);
      }
 }

 function renderContactsHtml() {
    let contactListContainer = document.getElementById("contact-list");
    if (!contactListContainer) {
        console.error("Element mit ID 'contact-list' wurde nicht gefunden");
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
    let backgroundColor = getRandomColor();
    return `
        <div class="contact-item" onclick="viewContact('${contact.id}')">
        <div class="contacts-logo" style="background-color: ${backgroundColor};">
        ${initials}
        </div>
            <div class="contact-info">
                <p class="contact-name">${contact.name}</p>
                <p class="contact-email">${contact.mail}</p>
            </div>
        </div>
    `;
}

async function initContactDetail() {
    let urlParams = new URLSearchParams(window.location.search);
    let contactId = urlParams.get('id');

    if (contactId) {
        let contactData = await getData(`contacts/${contactId}`);
        console.log("Geladene Kontaktdaten:", contactData);
        if (contactData) {
            renderSingleContact({
                id: contactId,
                ...contactData
            });
        } else {
            console.error("Kontakt mit dieser ID nicht gefunden.");
        }
    } else {
        console.error("Keine Kontakt-ID in der URL gefunden.");
    }
}


initContactDetail();

function groupContactsByLetter(contacts) {
    const grouped = {};
    contacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!grouped[firstLetter]) {
            grouped[firstLetter] = [];
        }
        grouped[firstLetter].push(contact);
    });
    return grouped;
}

function renderContacts() {
    let contactContainer = document.getElementById('contact-list');
    if (!contactContainer) {
        console.error("Element nicht gefunden");
        return;
    }
    contactContainer.innerHTML = '';
    let loggedInContactId = localStorage.getItem('loggedInContactId');
    let contactToRender;
    if (loggedInContactId) {
        contactToRender = contacts.find(contact => contact.id === loggedInContactId);
    } else if (contacts.length > 0) {
        contactToRender = contacts[0];
    } if (contactToRender) {
        contactContainer.innerHTML = addNewContactTemplate(contactToRender);
    } else {
        contactContainer.innerHTML = `<p>Keine Kontakte gefunden.</p>`;
    }
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
        const contactDetailContainer = document.getElementById('contact-list');
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

function confirmPassword() {
    let name = document.getElementById('inputName');
    let inputMail = document.getElementById('inputEmail');
    let phone = document.getElementById('inputPhone');

        postData("contacts", {
            "name": name.value,
            "mail": inputMail.value,
            "phone": phone.value,
        }).then(() => {
            window.location.href = 'contacts.html';
        }).catch(error => {
            console.error("Fehler beim Hinzufügen des Kontakts:", error);
        });
}

function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function addNewContactTemplate(contact) {
    let initials = getInitials(contact.name);
    return `
        <div class="contacts-header">
            <div class="contacts-logo">${initials || '?'}</div>
            <h1>${contact.name || 'Unbekannter Kontakt'}</h1>
        </div>
        <h3>Kontaktinformationen</h3>
        <div class="contacts-info">
            <p>
                <strong>E-Mail:</strong>
                <br>
                <a href="mailto:${contact.mail}">
                    <span class="email-first-char">${contact.mail || 'Keine E-Mail verfügbar'}</span>
                </a>
            </p>
            <br>
            <p>
                <strong>Telefon:</strong>
                <br>
                <a style="color: #2A3647" href="tel:${contact.phone}">
                    ${contact.phone || 'Keine Telefonnummer verfügbar'}
                </a>
            </p>
            <br>
        </div>
    `;
}




