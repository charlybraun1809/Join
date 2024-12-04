
function openPopup() {
    document.getElementById('popup-overlay').classList.remove('d-none');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    document.getElementById('popup-overlay').classList.add('d-none');
    document.body.style.overflow = '';
}

function editContact() {
    console.log("Edit Contact");
    closePopup();
}

function deleteContact() {
    console.log("Delete Contact");
    closePopup();
}
