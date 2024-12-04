let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';

document.addEventListener("DOMContentLoaded", async function () {
    let select = document.getElementById('assignedToDropdownContacts');
    let select2 = document.getElementById('assignedToDropdownCategory');
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow-contacts');
    let arrow2 = document.querySelector('#dropdown-arrow-subtasks');
    let dropDown = document.getElementById('dropdown-list-contacts');
    let dropDown2 = document.getElementById('dropdown-list-category');
    dropdownFunctionContacts(arrow, dropDown, select, isClicked);
    dropdownFunctionCategory(arrow2, dropDown2, select2, isClicked);
    await loadContacts();
    renderDropdownContacts();
    console.log(contacts);
    
});

let prioGrade = "";
function confirmInputs() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');
    let date = document.getElementById('date');
    if (title.value && description.value) {
        saveSelectedContact();
        saveSelectedCategory();
        saveSubtaskInput();
        const response = saveTask("tasks/toDo", {
            "title": title.value,
            "description": description.value,
            "assigned_to": selectedContact,
            "date": date.value,
            "priority": prioGrade,
            "category": selectedCategory,
            "subtasks": subtasks,
        });
        if (response) {
        window.location.href = 'boardMobile.html';
        }
        console.log(contacts);
        
    } else {
        alert('bitte Felder ausfüllen');
    }
}


async function saveTask(path = "", data = {}) {
    try {
        console.log("Sending request to:", baseURL + path + '.json');
        console.log("Data being sent:", data);
        
        let response = await fetch(baseURL + path + '.json', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let responseToJson = await response.json();
        console.log("Response from server:", responseToJson);
        return responseToJson;
    } catch (error) {
        console.error("Error saving task:", error);
        alert("Fehler beim Speichern der Daten. Überprüfe die Konsole für Details.");
    }
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

let selectedCategory = [];
function saveSelectedCategory() {
    let categoryInputRef = document.getElementById('assignedToDropdownCategory');
    let dropDownItems = document.querySelectorAll('.dropdown-item-category');
    dropDownItems.forEach(item => {
        let checkBox = item.querySelector('input[type="checkbox"]');
        let assignedCategory = item.textContent.trim();
        if (checkBox.checked) {
            if (!selectedCategory.includes(assignedCategory)) {
                selectedCategory.push(assignedCategory);
            }
        } else {
            selectedCategory = selectedCategory.filter(category => category !== assignedCategory);
        }
        })
}

function renderDropdownContacts() {
    let dropDownRef = document.getElementById('dropdown-list-contacts');
    dropDownRef.innerHTML = "";
    for (let index = 0; index < contacts.length; index++) {
        const contact = contacts[index];
        dropDownRef.innerHTML += getDropdownContactsTemplate(contact);
    }

}

let subtasks = [];
function saveSubtaskInput() {
    let inputRef = document.getElementById('input-subtask');
    let input = inputRef.value
    if (input) {
        subtasks.push(input);
    }
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


function dropdownFunctionCategory(arrow2, dropDown2, select2, isClicked) {
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








