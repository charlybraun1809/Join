function userLog(){
    let logo = document.getElementById('logo');
    let loggedIn = sessionStorage.getItem('Logged In') === "true";
    if (loggedIn) {
        logo.innerHTML = getInitialsHeader();
    } else {
        logo.innerHTML = "G"            
    }
}

function openBurgerMenu(){
    document.getElementById('burger-menu').classList.toggle('show-burger-menu');
}

function getInitialsHeader() {
    let name = localStorage.getItem('userName')
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

function loggedInHeader(){
    let logo = document.getElementById('navRight');
    let loggedIn = sessionStorage.getItem('Logged In') === 'true'
    let guest = sessionStorage.getItem('GuestLogIn');

    if (!loggedIn && !guest || !loggedIn && guest == null) {
        logo.classList.add('d-none')
    }
}

function checkBurgerMenu(){
    let popup = document.getElementById('burger-menu');
        if (popup.classList.contains('show-burger-menu')) {
            openBurgerMenu()
        }
}

