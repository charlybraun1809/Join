function userLog(){
    let logo = document.getElementById('logo');
    let loggedIn = sessionStorage.getItem('Logged In') === "true";
    if (loggedIn) {
        logo.innerHTML = getInitials();
    } else {
        logo.innerHTML = "G"            
    }
}

function openBurgerMenu(){
    document.getElementById('burger-menu').classList.toggle('show-burger-menu');
}

function getInitials() {
    let name = localStorage.getItem('userName')
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
}

