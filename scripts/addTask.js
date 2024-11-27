document.addEventListener("DOMContentLoaded", function () {
    let select = document.getElementById('assignedToDropdown');
    let placeHolder = document.getElementsByClassName('dropdown-selected')[0];
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow');
    let dropDown = document.getElementsByClassName('dropdown-list')[0];
    dropdownFunction(arrow, placeHolder, dropDown, select, isClicked);
});

let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';

function confirmInputs() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');

    if (title.value && description.value) {
        saveSelectedContact();
        saveTask("./tasks", {
            "Title": title.value,
            "Description": description.value,
            "Assigned to": selectedContact,
        });
        window.location.href = 'boardMobile.html';
    } else {
        alert('bitte Felder ausfüllen');
    }
}

async function saveTask(path = "", data = {}) {
    let response = await fetch(baseURL + path + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return responseToJson = await response.json();
}

let selectedContact = [];

function saveSelectedContact() {
    let dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        let checkBox = item.querySelector('input[type="checkbox"]');
        let assignedContact = item.textContent.trim();
        if (checkBox.checked) {
            if (!selectedContact.includes(assignedContact)) {
                selectedContact.push(assignedContact);
            }

        } else {
            selectedContact = selectedContact.filter(contact => contact !== assignedContact);
        };
    }); console.log(selectedContact);
}

function dropdownFunction(arrow, placeHolder, dropDown, select, isClicked) {
    select.addEventListener('click', (event) => {
        if (event.target === arrow || event.target === assignedToDropdown) {
            arrow.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
            placeHolder.querySelector('span').textContent = isClicked ? 'select contact' : 'An';
            dropDown.style.display = isClicked ? 'none' : 'block';
            isClicked = !isClicked;

        }
    });
}


function keepInputBlue(index) {
    let inputField = document.getElementsByClassName('title')[index];

    inputField.addEventListener('input', () => {
        if (inputField.value !== "") {
            inputField.classList.add('blueFrame');
        } else {
            inputField.classList.remove('blueFrame');
        }
    });
}


function setPrioColor(index) {
    let prioRefs = document.getElementsByClassName('prioGrade');
    let prioRef = prioRefs[index];
    let images = document.querySelectorAll('.prioGrade .prioImage');
    let prioImg = prioRef.querySelector("img");

    images.forEach(image => image.classList.remove('filterWhite'));
    if (prioRef.classList.contains('redColor') || prioRef.classList.contains('orangeColor') || prioRef.classList.contains('greenColor')) {
        prioRef.classList.remove('orangeColor', 'greenColor', 'redColor');
        removePrioImgColor(prioImg);
        return;
    }
    Array.from(prioRefs).forEach(ref => ref.classList.remove('redColor', 'orangeColor', 'greenColor'));
    addBackgroundColor(prioRef, prioImg);
}

function addBackgroundColor(prioRef, prioImg) {
    prioRef.classList.add(
        prioRef.id === "urgent" ? 'redColor' :
            prioRef.id === "medium" ? 'orangeColor' :
                'greenColor',
                addPrioImgColor(prioImg)
    );
}

function addPrioImgColor(prioImg) {
    prioImg.classList.add('filterWhite');
}

function removePrioImgColor(prioImg) {
    prioImg.classList.remove('filterWhite');
}








