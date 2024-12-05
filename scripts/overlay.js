function showNewContactOverlay() {
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

function toggleFooterBurgerMenu(){
    document.getElementById('popup-content').classList.toggle('show-PopUp');
}

function checkPopUp(){
    let popup = document.getElementById('popup-content');
        if (popup.classList.contains('show-PopUp')) {
            toggleFooterBurgerMenu();
        }
}