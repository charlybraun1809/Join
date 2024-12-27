let baseUrl = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";
// let contacts = [];

function init() {
    greeting();
    checkAnimation();
    userLog();
    loggedInHeader();
    showPassword()
}

async function getDataFromFirebase(path = "") {
    let response = await fetch(baseUrl + path + '.json');
    let responseAsJson = await response.json();
    return responseAsJson;
}

function confirmPassword() {
    let name = document.getElementById('name');
    let inputMail = document.getElementById('mail');
    let password = document.getElementById('password');
    let confirmed = document.getElementById('confirmed');
    if (confirmed.value === password.value) {
        saveUser("/users", {
            "name": name.value,
            "mail": inputMail.value,
            "password": password.value
        });
        signedUp();
        setTimeout(() => {
            window.location.href = 'login.html?msg=';
        }, 1000);
    } else {
        checkPassword();
    }
}

function checkPassword() {
    let password = document.getElementById('password');
    let confirmedPass = document.getElementById('confirmed');
    let alert = document.getElementById('alert')

    if (confirmedPass.value !== password.value) {
        alert.classList.remove('d-none')
        password.classList.add('error-border');
        confirmedPass.classList.add('error-border');
        password.value = "";
        confirmedPass.value = "";
    }
}


async function saveUser(path = "", data = {}) {
    let firebase = await fetch(baseUrl + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return firebaseToJson = await firebase.json();
}


function signedUp() {
    let msgBox = document.getElementById('msg-box');
    msgBox.classList.remove('d-none');
}


async function logIn() {
    let mail = document.getElementById('mail').value;
    let password = document.getElementById('password').value;
    let users = await getDataFromFirebase("users");
    let user = Object.entries(users).find(([keys, user]) => user.mail === mail && user.password === password)
    let userName = user ? user[1].name : "";
    if (user) {
        console.log('You are Logged in ');
        localStorage.setItem('userName', userName)
        sessionStorage.setItem('Logged In', 'true');
        window.location.href = 'summary.html';
        userLog(userName);
    } else {
        console.log(' Email or Password are wrong, pls try again');
        wrongLogIn();
        emptyPassword();
    }
}

function wrongLogIn() {
    let mail = document.getElementById('mail');
    let password = document.getElementById('password');
    let alert = document.getElementById('alert');
    mail.classList.add('error-border');
    password.classList.add('error-border');
    alert.classList.remove('d-none')
}

function getTime() {
    let time = new Date;
    let hours = time.getHours()
    return hours;
}


function greeting() {
    let userName = localStorage.getItem('userName')
    let time = getTime();
    let html = document.getElementById('greeting');
    let loggedIn = sessionStorage.getItem('Logged In') === 'true';
    let greetingFn = loggedIn
        ? time < 12 ? loggedInGreetingMorning
            : time < 18 ? loggedInGreetingMidday
                : loggedInGreetingEvening
        : time < 12 ? guestGreetingMorning
            : time < 18 ? guestGreetingMidday
                : guestGreetingEvening;
    html.innerHTML = greetingFn(userName);
}



function checkAnimation() {
    let overlay = document.getElementById('greeting');
    let hasPlayed = sessionStorage.getItem('animationPlayed');
    if (hasPlayed) {
        overlay.classList.add('d-none')
    } else {
        sessionStorage.setItem('animationPlayed', 'true');
    }
}



function guestLogin() {
    sessionStorage.setItem('Logged In', 'false');
    sessionStorage.setItem('GuestLogIn', 'True');
    window.location.href = "summary.html"
}


function loggedInGreetingMorning(userName) {
    return `
        <h2>Good morning,</h2>
        <h1>${userName}</h1>
    `;
}

function loggedInGreetingMidday(userName) {
    return `
        <h2>Good afternoon,</h2>
        <h1>${userName}</h1>
    `;
}

function loggedInGreetingEvening(userName) {
    return `
        <h2>Good evening,</h2>
        <h1>${userName}</h1>
    `;
}




function guestGreetingMorning() {
    return `
        <h2>Good morning!</h2>
    `;
}

function guestGreetingMidday() {
    return `
        <h2>Good afternoon!</h2>
    `;
}

function guestGreetingEvening() {
    return `
        <h2>Good evening!</h2>
    `;
}


function emptyPassword(){
    let pass = document.getElementById('password');
    pass.value = "";
}

function initializePasswordToggle() {
    const passwordInput = document.getElementById("password");
    const passwordWrapper = passwordInput.parentElement;

    // Überprüfen, ob das Element schon initialisiert wurde
    if (passwordWrapper.querySelector(".password-toggle")) return;

    // Erstelle das Auge-Icon
    const toggleIcon = document.createElement("img");
    toggleIcon.classList.add("password-toggle");
    toggleIcon.src = "./assets/icons/visibility_off.svg"; // Anfangs geschlossen
    toggleIcon.alt = "Toggle Password";

    // Füge das Icon in den Wrapper ein
    passwordWrapper.appendChild(toggleIcon);

    // Toggle-Logik für das Passwort-Feld
    toggleIcon.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.src = "./assets/icons/visibility.svg"; // Offenes Auge
        } else {
            passwordInput.type = "password";
            toggleIcon.src = "./assets/icons/visibility_off.svg"; // Geschlossenes Auge
        }
    });

    // Input-Logik: Schloss-Icon entfernen und Auge-Icon anzeigen, wenn getippt wird
    passwordInput.addEventListener("input", () => {
        if (passwordInput.value) {
            passwordInput.style.backgroundImage = "none"; // Schloss entfernen
            toggleIcon.style.display = "block"; // Auge-Icon anzeigen
        } else {
            passwordInput.style.backgroundImage = "url('../assets/icons/lock.svg')"; // Schloss anzeigen
            toggleIcon.style.display = "none"; // Auge-Icon verstecken
        }
    });
}

// Aufruf beim Laden der Seite
window.onload = initializePasswordToggle;