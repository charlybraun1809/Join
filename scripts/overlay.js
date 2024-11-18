document.getElementById('btn-contact').addEventListener('click', function () {
    document.getElementById('contact-overlay').classList.remove('d-none');
    document.getElementById('about-page').classList.add('d-none');
});

document.getElementById('btn-about').addEventListener('click', function () {
    document.getElementById('about-page').classList.remove('d-none');
    document.getElementById('contact-overlay').classList.add('d-none');
});


function showNotificationAndButtons() {
    let container = document.getElementById('notification-container');
    let notificationHtml = createNotificationHtml("Contact successfully created", "success");
    let actionButtonsHtml = createActionButtonsHtml();
    container.innerHTML = notificationHtml + actionButtonsHtml;
}
  

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

document.getElementById('submit-button').addEventListener('click', showNotificationAndButtons);
