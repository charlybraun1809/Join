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

    // Kombiniert die HTML-Inhalte und fügt sie in den Container ein.
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

    // Fügt HTML direkt in den Container ein.
    container.innerHTML = notificationHtml + buttonsHtml;
}

/**
 * Zeigt Benachrichtigung und Aktionsbuttons an, wenn der Submit-Button geklickt wird.
 */
document.getElementById('submit-button').addEventListener('click', showNotificationAndButtons);
