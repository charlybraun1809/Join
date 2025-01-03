let baseURL = 'https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/';
document.addEventListener('DOMContentLoaded', init);
async function init() {
    let select = document.getElementById('assignedToDropdownContacts');
    let select2 = document.getElementById('assignedToDropdownCategory');
    let dropDownItem2 = document.getElementsByClassName('dropdown-item-category');
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow-contacts');
    let arrow2 = document.querySelector('#dropdown-arrow-subtasks');
    let dropDown = document.getElementById('dropdown-list-contacts');
    let dropDown2 = document.getElementById('dropdown-list-category');
    dropdownFunctionContacts(arrow, dropDown, select, isClicked);
    dropdownFunctionCategory(arrow2, dropDown2, select2, isClicked, dropDownItem2);
    await loadContacts();
    console.log(contacts);
    renderDropdownContacts();
    changeSubtaskImg();
};

let prioGrade = "";
function confirmInputs() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');
    let date = document.getElementById('date');
    if (title.value && description.value) {
        saveSelectedContact();
        const response = saveTask("tasks/toDo", {
            "title": title.value,
            "description": description.value,
            "assigned_to": selectedContact,
            "date": date.value,
            "priority": prioGrade,
            "category": selectedCategory,
            "subtasks": subtascs,
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
function saveSelectedCategory(index) {
    let categoryInputRef = document.getElementById('categoryPlaceholder');
    let dropDownItem = document.getElementsByClassName('dropdown-item-category')[index];
    let dropDownItemContent = dropDownItem.textContent.trim();
    if (selectedCategory.length === 0) {
        selectedCategory.push(dropDownItemContent);
        categoryInputRef.innerHTML = selectedCategory;
        return
    } else {
        selectedCategory = [];
        selectedCategory.push(dropDownItemContent);
        categoryInputRef.innerHTML = selectedCategory;
        return

    }
}

function renderDropdownContacts() {
    let dropDownRef = document.getElementById('dropdown-list-contacts');
    dropDownRef.innerHTML = "";
    if (contacts.length >= 1) {
        console.log(contacts);
        
        for (let index = 0; index < contacts.length; index++) {
            const contact = contacts[index];
            dropDownRef.innerHTML += getDropdownContactsTemplate(contact);
        }
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


function dropdownFunctionCategory(arrow2, dropDown2, select2, isClicked, dropDownItem2) {
    select2.addEventListener('click', (event) => {
        arrow2.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
        dropDown2.style.display = isClicked ? 'none' : 'block';
        isClicked = !isClicked;
    });

    Array.from(dropDownItem2).forEach(item => {
        item.addEventListener('click', () => {
            dropDown2.style.display = 'none';
            arrow2.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
            isClicked = !isClicked;

        })
    })

    dropDown2.addEventListener('click', (event) => {
        event.stopPropagation();
    })
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

function changeSubtaskImg() {
    let inputRef = document.getElementById('input-subtask');
    let plusImg = document.getElementById('dropdown-plus-subtasks');
    let imagesContainer = document.getElementById('subtask-images-container');

    inputRef.addEventListener('click', () => {
        plusImg.style.display = 'none';
        imagesContainer.style.display = 'flex';
        imagesContainer.classList.add('positioningSubtaskImages')
    });
}

function deleteSubtaskInput() {
    let inputRef = document.getElementById('input-subtask');
    let subtaskImages = document.getElementById('subtask-images-container');
    let plusImg = document.getElementById('dropdown-plus-subtasks');
    plusImg.style.display = 'block';
    subtaskImages.style.display = 'none';
    inputRef.value = "";
}

let subtascs = [];

function saveSubtaskInput() {
    let inputRef = document.getElementById('input-subtask');
    let htmlTarget = document.getElementById('addedSubtaskWrapper');
    let plusImg = document.getElementById('dropdown-plus-subtasks');
    let subtaskImages = document.getElementById('subtask-images-container');
    if (inputRef.value) {
        subtascs.push(inputRef.value);
    }
    plusImg.style.display = 'block';
    htmlTarget.innerHTML += getAddedSubtaskTemplate(inputRef)
    subtaskImages.style.display = 'none';
    inputRef.value = "";
}









