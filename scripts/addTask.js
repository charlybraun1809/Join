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
    changeSubtaskImg();
    sendSubtaskForm();
    enableGlobalSubmit();
    const dateInput = document.querySelector("#date");
    if (!dateInput.hasAttribute("data-flatpickr-initialized")) {
        flatpickr("#date", {
            dateFormat: "dd/mm/yy",
            allowInput: true
        });
        dateInput.setAttribute("data-flatpickr-initialized", "true");
    }
};


// let prioGrade = "";
// function confirmInputs() {
//     let title = document.getElementById('titleInput');
//     let description = document.getElementById('descriptionInput');
//     let date = document.getElementById('date');
//     if (title.value && description.value) {
//         const response = saveTask("tasks/toDo", {
//             "title": title.value,
//             "description": description.value,
//             "assigned_to": selectedContact,
//             "date": date.value,
//             "priority": prioGrade,
//             "category": selectedCategory,
//             "subtasks": subtascs,
//             "prioImg": selectedPrioImg,
//         });
//         if (response) {
//             window.location.href = 'boardMobile.html';
//         }
//         console.log(contacts);

//     } else {
//         alert('bitte Felder ausfüllen');
//     }
// 

async function saveTask(path = "", data = {}) {
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

}

let selectedContact = [];
function saveSelectedContact() {
    let dropdownItems = document.querySelectorAll('.dropdown-item-contacts');
    dropdownItems.forEach(item => {
        let checkBox = item.querySelector('input[type="checkbox"]');
        checkBox.addEventListener('change', () => {
            let assignedContact = item.textContent.trim();
            if (checkBox.checked) {
                if (!selectedContact.includes(assignedContact)) {
                    selectedContact.push(assignedContact);
                    renderAssignedToInitials();
                }
            } else {
                selectedContact = selectedContact.filter(contact => contact !== assignedContact);
                renderAssignedToInitials();
            }
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
        for (let index = 0; index < contacts.length; index++) {
            const contact = contacts[index];
            dropDownRef.innerHTML += getDropdownContactsTemplate(contact);
        }
    }
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitials = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() : '';
    let lastNameInitials = nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '';
    return firstNameInitials + lastNameInitials;
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

function clearInputs(event) {
    event.preventDefault();
    let requiredFields = [
        "titleInput",
        "descriptionInput",
        "assignedToDropdownContacts",
        "date",
        "urgent",
        "medium",
        "low",
        "assignedToDropdownCategory",
        "input-subtask"
    ];

    let allFieldsValid = true;
    requiredFields.forEach((fieldId) => {
        let field = document.getElementById(fieldId);

        if (field) {
            if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
                if (field.value.trim() === "") {
                    field.classList.add("error-border");
                    allFieldsValid = false;
                } else {
                    field.classList.remove("error-border");
                }
            }
            else if (fieldId === "assignedToDropdownContacts") {
                let selectedContactText = field.querySelector('.dropdown-selected span').innerText.trim();
                if (selectedContactText === "Select contact") {
                    field.classList.add("error-border");
                    allFieldsValid = false;
                } else {
                    field.classList.remove("error-border");
                }
            }
            else if (fieldId === "assignedToDropdownCategory") {
                let categoryText = field.querySelector('#categoryPlaceholder').innerText.trim();
                if (categoryText === "Select task category") {
                    field.classList.add("error-border");
                    allFieldsValid = false;
                } else {
                    field.classList.remove("error-border");
                }
            }
            else if (fieldId === "date") {
                if (field.value.trim() === "") {
                    field.classList.add("error-border");
                    allFieldsValid = false;
                } else {
                    field.classList.remove("error-border");
                }
            }
            else if (fieldId === "input-subtask") {
                let subtaskInput = field;
                if (subtaskInput.value.trim() === "") {
                    field.classList.add("error-border");
                    allFieldsValid = false;
                } else {
                    field.classList.remove("error-border");
                }
            }
            else {
                let selectedPriority = document.querySelectorAll('.prioGrade');
                let prioValid = false;
                selectedPriority.forEach(function(prio) {
                    if (prio.classList.contains('isClicked')) {
                        prioValid = true;
                    }
                });
                if (!prioValid) {
                    let prioFields = document.querySelectorAll('.prioGrade');
                    prioFields.forEach(function(field) {
                        field.classList.add("error-border");
                    });
                    allFieldsValid = false;
                } else {
                    selectedPriority.forEach(function(prio) {
                        prio.classList.remove("error-border");
                    });
                }
            }
        }
    });
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

function deleteSubtask(subtaskElement) {
    let taskList = document.getElementById('addedSubtaskWrapper');
    taskList.removeChild(subtaskElement.closest('li'));
    let index = Array.from(taskList.children).indexOf(subtaskElement.closest('li'));
    subtascs.splice(index, 1);
}


let subtascs = [];

function saveSubtaskInput() {
    let inputRef = document.getElementById('input-subtask');
    let htmlTarget = document.getElementById('addedSubtaskWrapper');
    let plusImg = document.getElementById('dropdown-plus-subtasks');
    let subtascImages = document.getElementById('subtask-images-container');
    if (inputRef.value.trim() !== "") {
        subtascs.push(inputRef.value.trim());
        htmlTarget.innerHTML += getAddedSubtaskTemplate(inputRef);
    }
    inputRef.value = "";
        plusImg.style.display = 'block';
        subtascImages.style.display = 'none';
        editSubtaskEventListener();
        deleteEditSubtaskEventlistener();
}

function editSubtaskEventListener() {
    let subtasks = document.querySelectorAll('.addedSubtaskInput');
    subtasks.forEach(subtask => {
        subtask.addEventListener('dblclick', () => editSubtask(subtask));
    });
}

function editSubtask(subtaskElement) {
    let originalText = subtaskElement.innerText;
    let inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = originalText;
    inputField.classList.add('editingSubtask');
    subtaskElement.innerHTML = '';
    subtaskElement.appendChild(inputField);
    inputField.focus();
    inputField.addEventListener('blur', () => saveSubtaskChanges(inputField, subtaskElement)); // Wenn der Fokus verloren geht
    inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveSubtaskChanges(inputField, subtaskElement);
        }
    });
}

function saveSubtaskChanges(inputField, subtaskElement) {
    let newValue = inputField.value.trim();
    if (newValue !== "") {
        subtaskElement.innerHTML = newValue;
        updateSubtaskInArray(subtaskElement, newValue);
    } else {
        subtaskElement.innerHTML = "Empty subtask";
    }
}

function updateSubtaskInArray(subtaskElement, newValue) {
    let subtasks = document.querySelectorAll('.addedSubtaskContent');
    let index = Array.from(subtasks).indexOf(subtaskElement);
    subtascs[index] = newValue;
}

function saveEditSubtaskEventListener() {
    let saveButtonRef = document.getElementById('saveEdit');
    saveButtonRef.addEventListener('click', () => saveEditSubtask());
}

function saveEditSubtask() {
    let editInputField = document.getElementById('subtaskEdit');
    let subtascsContent = document.getElementsByClassName('addedSubtaskContent');
    let index = editInputField.dataset.editIndex; // Index des bearbeiteten Subtasks
    let targetSubtask = subtascsContent[index].querySelector('.addedSubtaskInput');

    targetSubtask.textContent = editInputField.value;
    subtascs[index] = editInputField.value;

    document.getElementById('addedEditSubtask').style.display = 'none';
}

function deleteEditSubtaskEventlistener() {
    let deleteButtons = document.querySelectorAll('.deleteSubtask');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            let subtaskElement = button.closest('.addedSubtaskContent');
            deleteSubtask(subtaskElement);
        });
    });
}

function deleteEditSubtask(event) {
    let targetElement = event.target.closest('.addedSubtaskContent');
    let subtaskDivs = document.getElementsByClassName('addedSubtaskContent');
    let index = Array.from(subtaskDivs).indexOf(targetElement);
    subtascs.splice(index, 1);
    targetElement.remove();
}

function sendSubtaskForm() {
    document.getElementById('input-subtask').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveSubtaskInput();
        }
    });
}

function enableGlobalSubmit() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            let activeElement = document.activeElement;
            if (
                activeElement.tagName !== 'INPUT' &&
                activeElement.tagName !== 'TEXTAREA' &&
                activeElement.tagName !== 'BUTTON' &&
                activeElement.tagName !== 'SELECT'
            ) {
                event.preventDefault();
                confirmInputs();
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
        let initialsHTML = getInitialsAndBackgroundColor(assignedContact)
        targetDiv.style.display = 'flex';
        targetDiv.innerHTML += initialsHTML;
    } else {
        targetDiv.style.display = 'none';
    }
}

function resetErrorStates() {
    document.getElementById("reqTitle").classList.add("dNone");
    document.getElementById("reqDate").classList.add("dNone");
    document.getElementById("reqCategory").classList.add("dNone");
    document.getElementById("titleInput").classList.remove("error-border");
    document.getElementById("date").classList.remove("error-border");
    document.getElementById("assignedToDropdownCategory").classList.remove("error-border");
}

function confirmInputs(event) {
    let requiredFields = [
        "titleInput",
        "descriptionInput",
        "assignedToDropdownContacts",
        "date",
        "urgent",
        "medium",
        "low",
        "assignedToDropdownCategory"
    ];
    let isValid = true;
    requiredFields.forEach((fieldId) => {
        let field = document.getElementById(fieldId);
        if (field) {
            let isEmpty = 
                (field.tagName === "INPUT" && field.type !== "checkbox" && field.value.trim() === "") ||
                (field.tagName === "TEXTAREA" && field.value.trim() === "") ||
                (fieldId === "assignedToDropdownContacts" && field.querySelector('.dropdown-selected span').innerText.trim() === "Select contact") ||
                (fieldId === "category" && document.getElementById("categoryPlaceholder").innerText.trim() === "Select task category");
            if (isEmpty) {
                field.classList.add("error-border");
                if (fieldId === "titleInput") document.getElementById("reqTitle").classList.remove("dNone");
                if (fieldId === "date") document.getElementById("reqDate").classList.remove("dNone");
                if (fieldId === "assignedToDropdownCategory") document.getElementById("reqCategory").classList.remove("dNone");
                isValid = false;
            } else {
                field.classList.remove("error-border");
            }
        }
    });
}


function resetErrorStates() {
    document.getElementById("reqTitle").classList.add("dNone");
    document.getElementById("reqDate").classList.add("dNone");
    document.getElementById("reqCategory").classList.add("dNone");

    document.getElementById("titleInput").classList.remove("error-border");
    document.getElementById("date").classList.remove("error-border");
    document.getElementById("assignedToDropdownCategory").classList.remove("error-border");
}