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
    renderDropdownContacts();
    saveSelectedContact();
    initialiseSavePrioImg();
    initializeSubtaskFocus();
    sendSubtaskForm();
    enableGlobalSubmit();
};


let prioGrade = "";
function confirmInputs() {
    let title = document.getElementById('titleInput');
    let description = document.getElementById('descriptionInput');
    let date = document.getElementById('date');
    if (title.value && description.value) {
        const response = saveTask("tasks/toDo", {
            "title": title.value,
            "description": description.value,
            "assigned_to": selectedContact,
            "date": date.value,
            "priority": prioGrade,
            "category": selectedCategory,
            "subtasks": subtascs,
            "prioImg": selectedPrioImg,
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
        checkBox.addEventListener('change', () => { // 'change'-Event überwacht Checkbox-Änderungen
            let assignedContact = item.textContent.trim();
            if (checkBox.checked) {
                if (!selectedContact.includes(assignedContact)) {
                    selectedContact.push(assignedContact); // Kontakt hinzufügen
                    renderAssignedToInitials();
                }
            } else {
                selectedContact = selectedContact.filter(contact => contact !== assignedContact); // Kontakt entfernen
                renderAssignedToInitials();
            }
            console.log(selectedContact); // Debug-Ausgabe
        });
    });
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
        event.stopPropagation();
        arrow.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
        select.querySelector('span').textContent = isClicked ? 'select contact' : 'An';
        dropDown.style.display = isClicked ? 'none' : 'block';
        isClicked = !isClicked;
    });

    document.body.addEventListener('click', () => {
        if (isClicked) {
            arrow.style.transform = "translateY(-50%) rotate(0deg)";
            select.querySelector('span').textContent = 'Select contact';
            dropDown.style.display = 'none';
            isClicked = false;
        }
    });
}


function dropdownFunctionCategory(arrow2, dropDown2, select2, isClicked, dropDownItem2) {
    select2.addEventListener('click', (event) => {
        event.stopPropagation();
        arrow2.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
        dropDown2.style.display = isClicked ? 'none' : 'block';
        isClicked = !isClicked;
    });

    Array.from(dropDownItem2).forEach(item => {
        item.addEventListener('click', (event) => {
            event.stopPropagation();
            dropDown2.style.display = 'none';
            arrow2.style.transform = isClicked ? "translateY(-50%) rotate(0deg)" : "translateY(-50%) rotate(180deg)";
            isClicked = !isClicked;
        })
    })

    document.body.addEventListener('click', (event) => {
        if (isClicked) {
            arrow2.style.transform = "translateY(-50%) rotate(0deg)";
            dropDown2.style.display = 'none';
            isClicked = false;
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

let selectedPrioImg = [];
isClickedPrio = false;

function initialiseSavePrioImg() {
    let prioRefs = document.getElementsByClassName('prioGrade');
    let prioArray = Array.from(prioRefs);
    prioArray.forEach(element => {
        element.addEventListener('click', () => {
            debugger;
            element.classList.toggle('isClicked');
            let prioImg = element.querySelector('.prioImage');
            let fullImgPath = prioImg.src;
            let localImgPath = fullImgPath.replace(window.location.origin + "/", "");
            if (element.classList.contains('isClicked')) {
                selectedPrioImg = [];
                selectedPrioImg.push(localImgPath);
            } else {
                selectedPrioImg = [];
            }
        })
    })

}

function setPrioColor(index) {
    let prioRefs = document.getElementsByClassName('prioGrade');
    let prioRef = prioRefs[index];
    let images = document.querySelectorAll('.prioGrade .prioImage');
    let prioImg = prioRef.querySelector("img");
    let prioImgSource = prioImg.src;


    images.forEach(image => image.classList.remove('filterWhite'));
    Array.from(prioRefs).forEach(element => element.classList.remove('whitePrioFont'));
    if (prioRef.classList.contains('redColor') || prioRef.classList.contains('orangeColor') || prioRef.classList.contains('greenColor')) {
        prioRef.classList.remove('orangeColor', 'greenColor', 'redColor');
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
        addPrioImgColor(prioRef, prioImg),
    );
    prioGrade = prioRef.id;
}

function addPrioImgColor(prioRef, prioImg) {
    prioRef.classList.add('whitePrioFont');
    prioImg.classList.add('filterWhite');
}

function removePrioImgColor(prioRef, prioImg) {
    prioRef.classList.remove('whitePrioFont');
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
        selectedContact = [];
        subtascs = [];
        addedSubtaskWrapper.innerHTML = "";
    })
    renderAssignedToInitials();
}

function initializeSubtaskFocus() {
    let inputRef = document.getElementsByClassName('dropdown-subtasks');
    let plusImgs = document.getElementsByClassName('dropdown-plus-subtasks');
    let imagesContainers = document.getElementsByClassName('subtask-images-container');

    Array.from(inputRef).forEach((input, index) => {
        let inputField = input.querySelector('input');
        let plusImg = plusImgs[index];
        let imagesContainer = imagesContainers[index];

        input.addEventListener('click', (event) => {
            if (event.target === plusImg || event.target.closest('.dropdown-subtasks')) {
                if (imagesContainer.style.display === 'none') {
                    showSubtaskImg(inputField, plusImg, imagesContainer);
                } else if (event.target.closest('.deleteSubtask')) {
                    closeSubtaskImg(inputField, plusImg, imagesContainer);
                };
            };
        });
    });
};

function closeSubtaskImg(inputField, plusImg, imagesContainer) {
    plusImg.style.display = 'block';
    imagesContainer.style.display = 'none';
    inputField.value = "";
    inputField.blur();
}

function showSubtaskImg(inputField, plusImg, imagesContainer) {
    plusImg.style.display = 'none';
    imagesContainer.style.display = 'flex';
    imagesContainer.classList.add('positioningSubtaskImages');

    inputField.focus();
}

function editSubtaskEventListener() {
    let buttonRef = document.getElementsByClassName('editSubtask');
    Array.from(buttonRef).forEach((button, index) => {
        button.addEventListener('click', () => editSubtask(index))
    })
}

function editSubtask(index) {
    let subtascs = document.getElementsByClassName('addedSubtaskContent');
    let subtascInput = subtascs[index].querySelector('.addedSubtaskInput');
    let editSubtaskRef = document.getElementsByClassName('addedEditSubtask');
    let editInputField = document.getElementsByClassName('subtaskEdit');

    Array.from(editSubtaskRef).forEach(element => {
        element.style.display = 'block';
    })
    Array.from(editInputField).forEach(element => {
        element.value = subtascInput.textContent.trim();
        element.dataset.editIndex = index;
    })
}


function saveEditSubtaskEventListener() {
    let saveButtonRef = document.getElementsByClassName('saveEdit');
    Array.from(saveButtonRef).forEach(button => {
        button.addEventListener('click', (event) => saveEditSubtask(event));
    })
}

function saveEditSubtask(event) {
    debugger;

    // Ermittle den nächsten übergeordneten Container
    let container = event.target.closest('#subtasks') || event.target.closest('#subtasksOverlay');

    // Finde die relevanten Felder im Kontext des Containers
    let editInputField = container.querySelector('.subtaskEdit');
    let index = editInputField.dataset.editIndex;
    let subtascsContent = document.getElementsByClassName('addedSubtaskContent');
    let targetSubtask = subtascsContent[index].querySelector('.addedSubtaskInput');

    // Aktualisiere den Subtask-Inhalt
    targetSubtask.textContent = editInputField.value;
    subtascs[index] = editInputField.value;

    // Blende den Edit-Subtask-Container aus
    container.querySelector('.addedEditSubtask').style.display = 'none';
}


function deleteEditSubtaskEventlistener() {
    let buttons = document.getElementsByClassName('deleteSubtask');
    Array.from(buttons).forEach(button => {
        button.addEventListener('click', deleteEditSubtask)
    })
}

function deleteEditSubtask(event) {
    let targetElement = event.target.closest('.addedSubtaskContent');
    let subtaskDivs = document.getElementsByClassName('addedSubtaskContent');
    let index = Array.from(subtaskDivs).indexOf(targetElement);

    subtascs.splice(index, 1);
    targetElement.remove();
}

function sendSubtaskForm() {
    let inputs = document.getElementsByClassName('input-subtask')
    Array.from(inputs).forEach(input => {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveSubtaskInput(event);
            }
        });
    })
}

let subtascs = [];

function saveSubtaskInput(event) {
    let container = event.target.closest('#subtasks') || event.target.closest('#subtasksOverlay')
    let inputRef = container.querySelector('.input-subtask');
    let htmlTarget = container.querySelector('.addedSubtaskWrapper');
    let plusImg = container.querySelector('.dropdown-plus-subtasks');
    let subtascImages = container.querySelector('.subtask-images-container');

    if (inputRef.value) {
        subtascs.push(inputRef.value);
        htmlTarget.innerHTML += getAddedSubtaskTemplate(inputRef)
    }

    plusImg.style.display = 'block';

    subtascImages.style.display = 'none';
    inputRef.value = "";
    editSubtaskEventListener();
    saveEditSubtaskEventListener();
    deleteEditSubtaskEventlistener();
}

function enableGlobalSubmit() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            // Prüfen, ob kein Eingabefeld oder Button fokussiert ist
            const activeElement = document.activeElement;
            if (
                activeElement.tagName !== 'INPUT' &&
                activeElement.tagName !== 'TEXTAREA' &&
                activeElement.tagName !== 'BUTTON' &&
                activeElement.tagName !== 'SELECT'
            ) {
                event.preventDefault(); // Verhindert das Standardverhalten
                confirmInputs(); // Funktion zum Absenden des Formulars
            }
        }
    });
}

function renderAssignedToInitials() {
    let targetDiv = document.getElementById('assignedToInitials');
    targetDiv.innerHTML = '';
    let assignedContact = Object.values(contacts).filter(contact =>
        selectedContact.includes(contact.name)
    )
    if (assignedContact.length > 0) {
        let initialsHTML = getInitialsAndBackgroundColor(assignedContact);
        targetDiv.style.display = 'flex';
        targetDiv.innerHTML += initialsHTML;
    } else {
        targetDiv.style.display = 'none';
    }
}


//test




