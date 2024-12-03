/**
 * Zeigt die Kontaktseite an und versteckt die Über-uns-Seite.
 * Wird ausgelöst, wenn auf den "btn-contact"-Button geklickt wird.
 */
document.getElementById('btn-contact').addEventListener('click', function () {
    document.getElementById('contact-overlay').classList.remove('d-none');
    document.getElementById('about-page').classList.add('d-none');
});

/**
 * Zeigt die Über-uns-Seite an und versteckt die Kontaktseite.
 * Wird ausgelöst, wenn auf den "btn-about"-Button geklickt wird.
 */
document.getElementById('btn-about').addEventListener('click', function () {
    document.getElementById('about-page').classList.remove('d-none');
    document.getElementById('contact-overlay').classList.add('d-none');
});

/**
 * Fügt eine Benachrichtigung und Aktionsbuttons in einen Container ein.
 * Die Benachrichtigung zeigt eine Erfolgsmeldung, und die Buttons ermöglichen weitere Aktionen.
 */
function showNotificationAndButtons() {
    let container = document.getElementById('notification-container');
    let notificationHtml = createNotificationHtml("Contact successfully created", "success");
    let actionButtonsHtml = createActionButtonsHtml();

    container.innerHTML = notificationHtml + actionButtonsHtml;
}

/**
 * Zeigt eine Erfolgsmeldung und zwei Aktionsbuttons im dynamischen Container an.
 * Erfolgsnachricht: "Contact successfully created".
 * Buttons: Bearbeiten und Löschen.
 */
function showNotificationAndButtons() {
    let container = document.getElementById('dynamic-container');
    let notificationHtml = `s
        <div class="notification">
            Contact successfully created
        </div>`;
    let buttonsHtml = `
        <div class="action-buttons">
            <button class="btn-action">
                <img src="./icons/edit.svg" alt="Edit" class="icon"> Edit
            </button>
            <button class="btn-action">
                <img src="./icons/delete.svg" alt="Delete" class="icon"> Delete
            </button>
        </div>`;

    container.innerHTML = notificationHtml + buttonsHtml;
}

/**
 * Zeigt Benachrichtigung und Aktionsbuttons an, wenn der Submit-Button geklickt wird.
 */
document.getElementById('submit-button').addEventListener('click', showNotificationAndButtons);

/**
 * 
 * @param {*} index 
 */
function blueInput(index) {
    let inputContainer = document.getElementById('input-Field')[index];

    inputContainer.addEventListener('input-Field', () => {
        if(inputContainer.value.trim() !== "") {
            inputContainer.classList.add('blueBorder');
        } else {
            inputContainer.classList.remove('blueBorder');
        }
    });
}

function openPopup() {
    document.getElementById('popup-overlay').classList.remove('d-none');
    document.body.style.overflow = 'hidden'; // Disable body scroll when popup is open
}

function closePopup() {
    document.getElementById('popup-overlay').classList.add('d-none');
    document.body.style.overflow = ''; // Re-enable body scroll
}

function editContact() {
    console.log("Edit Contact");
    closePopup();
}

function deleteContact() {
    console.log("Delete Contact");
    closePopup();
}
