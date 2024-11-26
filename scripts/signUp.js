let baseUrl = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";
let contacts = [];

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
        console.log("richtiges password");
        saveUser("/users", {
            "name": name.value,
            "mail": inputMail.value,
            "password": password.value
        })
        window.location.href = 'login.html?msg=You Signed Up succesfully ';
    } else {
        alert("Wrong Password")
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
    let msgBox = document.getElementById('msg-box')
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg) {
        msgBox.classList.remove('d-none')
        msgBox.innerHTML = msg;
    } else {
        msgBox.classList.add('d-none')
    }
}



async function logIn() {
    let mail = document.getElementById('mail').value;
    let password = document.getElementById('password').value;
    let users = await getDataFromFirebase("users");
    console.log(users);
    let user = Object.entries(users).find(([keys, user]) => user.mail === mail && user.password === password)
    console.log(user);

    if (user) {
        console.log('You are Logged in ');
        window.location.href = 'summary.html';
    } else {
        console.log(' Email or Password are wrong, pls try again');
    }
}

function getTime() {
    let time = new Date;
    let hours = time.getHours()
    return hours;
}


function greeting() {
    let time = getTime();
    let html = document.getElementById('greeting');

    if (time >= 0 && time < 12) {
        html.innerHTML = `
            <h2>Good morning,</h2>
            <h1>Sofia Müller</h1>`
    } else if (time >= 12 && time < 18) {
        html.innerHTML = `
            <h2>Good afternoon,</h2>
            <h1>Sofia Müller</h1>`
    } else if (time >= 18 && time <= 23) {
        html.innerHTML = `
            <h2>Good evening,</h2>
            <h1>Sofia Müller</h1>`
    }
}