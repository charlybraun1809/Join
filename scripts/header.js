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

