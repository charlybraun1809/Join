let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';

document.addEventListener("DOMContentLoaded", function () {
    let select = document.getElementById('assignedToDropdownContacts');
    let select2 = document.getElementById('assignedToDropdownSubtasks');
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow-contacts');
    let arrow2 = document.querySelector('#dropdown-arrow-subtasks');
    let dropDown = document.getElementById('dropdown-list-contacts');
    let dropDown2 = document.getElementById('dropdown-list-subtasks');
    dropdownFunctionContacts(arrow, dropDown, select, isClicked);
    dropdownFunctionSubtasks(arrow2, dropDown2, select2, isClicked)
});

let prioGrade = "";
function confirmInputs() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');
    let date = document.getElementById('date');
    if (title.value && description.value) {
        saveSelectedContact();
        saveSelectedSubtasks();
        saveTask("./tasks", {
            "title": title.value,
            "description": description.value,
            "assigned_to": selectedContact,
            "date": date.value,
            "priority": prioGrade,
            "subtasks": selectedSubtasks,
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
    let dropdownItems = document.querySelectorAll('.dropdown-item-contacts');
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

let selectedSubtasks = [];
function saveSelectedSubtasks() {
    let dropdownItems = document.querySelectorAll('.dropdown-item-subtasks');
    dropdownItems.forEach(item => {
        let checkBox = item.querySelector('input[type="checkbox"]');
        let assignedSubtask = item.textContent.trim();
        if (checkBox.checked) {
            if (!selectedSubtasks.includes(assignedSubtask)) {
                selectedSubtasks.push(assignedSubtask);
            }
        } else {
            selectedSubtasks = selectedSubtasks.filter(contact => contact !== assignedSubtask);
        };
    })
}

function dropdownFunctionContacts(arrow, dropDown, select, isClicked) {
    select.addEventListener('click', (event) => {
        arrow.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
        select.querySelector('span').textContent = isClicked ? 'select contact' : 'An';
        dropDown.style.display = isClicked ? 'none' : 'block';
        isClicked = !isClicked;
    });

    // Stop propagation for clicks within the dropdown
    dropDown.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}


function dropdownFunctionSubtasks(arrow2, dropDown2, select2, isClicked) {
    select2.addEventListener('click', (event) => {
        arrow2.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
        dropDown2.style.display = isClicked ? 'none' : 'block';
        isClicked = !isClicked;
    });

        // Stop propagation for clicks within the dropdown
        dropDown2.addEventListener('click', (event) => {
            event.stopPropagation();
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
        addPrioImgColor(prioImg),
    );
    prioGrade = prioRef.id;
}

function addPrioImgColor(prioImg) {
    prioImg.classList.add('filterWhite');
}

function removePrioImgColor(prioImg) {
    prioImg.classList.remove('filterWhite');
}

function clearInputs() {
    let inputs = document.querySelectorAll('.title');
    inputs.forEach(element => {
        element.value = "";
    });
    let checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    checkBoxes.forEach(checkBox => {
        checkBox.checked = false;
    })
}








