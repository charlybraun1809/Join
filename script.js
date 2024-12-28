// let baseUrl = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";
// let contacts = [];

function loggedIn() {
    let loggedIn = sessionStorage.getItem('Logged In') === 'true'
    let guest = sessionStorage.getItem('GuestLogIn');
    let footer = `<footer w3-include-html="footerMobile.html"></footer>`;
    if (loggedIn || guest) {
        document.getElementById('footer').innerHTML = footer
    }
}