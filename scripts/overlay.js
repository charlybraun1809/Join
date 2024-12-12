function showNewContactOverlay() {
    let name = document.getElementById('inputName').value = "";
    let inputMail = document.getElementById('inputEmail').value = "";
    let phone = document.getElementById('inputPhone').value = "";
    toggleOverlay('overlayNewContact')
    toggleOverlay('add-contact')
    toggleOverflow('body')
    setTimeout(() => {
        animate('add-contact')
    }, 5);
}


function HideNewContactOverlay() {
    animate('add-contact')
    setTimeout(() => {
        toggleOverlay('overlayNewContact');
        toggleOverlay('add-contact');
        toggleOverflow('body');
    }, 300);
}


function showEditContactOverlay() {
    toggleOverlay('editOverlay')
    toggleOverlay('edit-contact')
    toggleOverflow('body')
    insertOverlayInput();
    getinfo();
    setTimeout(() => {
        animate('edit-contact')
    }, 5);

}


function HideEditContactOverlay() {
    animate('edit-contact')
    setTimeout(() => {
        toggleOverlay('editOverlay');
        toggleOverlay('edit-contact');
        toggleOverflow('body');
    }, 300);
}

function toggleOverlay(id) {
    let overlay = document.getElementById(id);
    overlay.classList.toggle('d-none');
}

function animate(id) {
    let animate = document.getElementById(id);
    animate.classList.toggle('showOverlay')
}

function toggleOverflow(id) {
    let body = document.getElementById(id);
    body.classList.toggle('overflow-h')
}


function burgerMenus(){
    checkPopUp();
    checkBurgerMenu();
 }


function toggleFooterBurgerMenu() {
    document.getElementById('popup-content').classList.toggle('show-PopUp');
}

function checkPopUp() {
    let popup = document.getElementById('popup-content');
    if (!popup) {
        return
    } else {
        popup.classList.contains('show-PopUp') ? toggleFooterBurgerMenu() : "";
    }
}

function toastMSG(){
    document.getElementById('toastMSG').classList.toggle('show-toast');
}