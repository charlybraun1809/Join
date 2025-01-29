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
};

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

let selectedContacts = [];

function saveSelectedContact() {
    let dropdownItems = document.querySelectorAll('.dropdown-item-contacts input[type="checkbox"]');
    dropdownItems.forEach(item => {
        item.addEventListener('change', () => {
            let contactName = item.closest('.dropdown-item-contacts')?.dataset.contactName;
            
            if (!contacts || contacts.length === 0) {
                return;
            }
            let contact = contacts.find(c => c.name === contactName);
            if (!contact) {
                return;
            }
            if (item.checked) {
                if (!selectedContacts.includes(contact)) {
                    selectedContacts.push(contact);
                }
            } else {
                selectedContacts = selectedContacts.filter(c => c.name !== contactName);
            }
            renderAssignedToInitials();
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

function renderAssignedToInitials() {
    const initialsContainer = document.getElementById('assignedToInitials');
    initialsContainer.innerHTML = '';
    if (!selectedContacts || selectedContacts.length === 0) {
        return;
    }
    selectedContacts.forEach(contact => {
        if (!contact.name) {
            console.error('Invalid contact object:', contact);
            return;
        }
        const initials = getInitials(contact.name);
        const background = contact.background || getRandomColor();
        initialsContainer.innerHTML += `
            <div class="initials" style="background-color: ${background};">
                ${initials}
            </div>
        `;
    });
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
    inputField.addEventListener('blur', () => {
        inputField.classList.remove('blueFrame');
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

document.addEventListener("DOMContentLoaded", function() {
    let clearButton = document.getElementById("clear");
    if (clearButton) {
        clearButton.addEventListener("click", clearInputs);
    }
});

function clearInputs(event) {
    if (event) event.preventDefault();
    ["titleInput", "descriptionInput", "date", "input-subtask"].forEach(id => {
        let field = document.getElementById(id);
        if (field) field.value = "";
    });
    let contactDropdown = document.getElementById("assignedToDropdownContacts");
    if (contactDropdown) {
        contactDropdown.querySelector('span').innerText = 'Select contact';
        selectedContacts = [];
        renderAssignedToInitials();
    }
    let categoryDropdown = document.getElementById("categoryPlaceholder");
    if (categoryDropdown) {
        categoryDropdown.innerText = 'Select task category';
        selectedCategory = [];
    }
    let prioElements = document.querySelectorAll('.prioGrade');
    prioElements.forEach(el => {
    el.classList.remove('redColor', 'orangeColor', 'greenColor', 'isClicked', 'whitePrioFont');
    let prioImg = el.querySelector('img');
    prioImg.classList.remove('filterWhite');
    });
    document.querySelectorAll("error-border").forEach(el => el.classList.remove("error-border"));
    let subtaskContainer = document.getElementById('addedSubtaskWrapper');
    if (subtaskContainer) {
        subtaskContainer.innerHTML = "";
        subtascs = [];
    }
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
    let subtaskItem = subtaskElement.closest('li');
    taskList.removeChild(subtaskItem);
    let index = Array.from(taskList.children).indexOf(subtaskItem);
    subtascs.splice(index, 1);
}

let subtascs = [];

function saveSubtaskInput() {
    let inputRef = document.getElementById('input-subtask');
    let htmlTarget = document.getElementById('addedSubtaskWrapper');

    if (inputRef.value.trim() !== "") {
        const li = document.createElement('li');
        li.classList.add('addedSubtaskContent');
        li.innerHTML = `
            <span class="addedSubtaskInput" onclick="editSubtask(this)">${inputRef.value}</span>
            <div class="addedSubtaskImages">
                <img src="assets/icons/edit.png" class="editSubtask" onclick="editSubtask(this)">
                <div class="seperatorAddedSubtasks"></div>
                <img src="assets/icons/delete.png" class="deleteSubtask" onclick="deleteSubtask(this)">
            </div>`;
        htmlTarget.appendChild(li);
        subtascs.push(inputRef.value.trim());
    }
    inputRef.value = "";
    deleteEditSubtaskEventlistener();
}

function editSubtaskEventListener() {
    let subtasks = document.querySelectorAll('.addedSubtaskContent');
    subtasks.forEach(subtask => {
        subtask.addEventListener('dblclick', () => editSubtask(subtask));
    });
}

function editSubtask(subtaskElement) {
    let parentLi = subtaskElement.closest('li');
    let originalText = subtaskElement.innerText;
    parentLi.classList.add('editing'),
    subtaskElement.innerHTML = `
        <input type="text" class="editSubtask" value="${originalText}" 
        onblur="saveSubtaskChanges(this)" 
        onkeydown="if(event.key === 'Enter') saveSubtaskChanges(this)">`;
    let inputField = subtaskElement.querySelector('input');
    inputField.focus();
}

function saveSubtaskChanges(inputField) {
    let newValue = inputField.value.trim();
    let parentLi = inputField.closest('li');
    let subtaskElement = inputField.parentElement;
    if (newValue) {
        subtaskElement.innerHTML = newValue;
    } else {
        subtaskElement.innerHTML = "Empty subtask";
    }
    parentLi.classList.remove('editing');
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
    let index = editInputField.dataset.editIndex;
    let targetSubtask = subtascsContent[index].querySelector('.addedSubtaskInput');
    targetSubtask.textContent = editInputField.value;
    subtascs[index] = editInputField.value;
    document.getElementById('addedEditSubtask').style.display = 'none';
}

function deleteEditSubtaskEventlistener() {
    let deleteButtons = document.querySelectorAll('.deleteSubtask');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const subtaskElement = button.closest('.addedSubtaskContent');
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

function resetErrorStates() {
    document.getElementById("reqTitle").classList.add("dNone");
    document.getElementById("reqDate").classList.add("dNone");
    document.getElementById("reqCategory").classList.add("dNone");
    document.getElementById("titleInput").classList.remove("error-border");
    document.getElementById("date").classList.remove("error-border");
    document.getElementById("assignedToDropdownCategory").classList.remove("error-border");
}

function confirmInputs(event) {
    let requiredFields = ["titleInput", "descriptionInput", "date"];
    let isValid = true;
    requiredFields.forEach((fieldId) => {
        let field = document.getElementById(fieldId);
        if (field && field.value.trim() === "") {
            field.classList.add("error-border");
            isValid = false;
        } else {
            field.classList.remove("error-border");
        }
    });
    if (selectedContacts.length === 0) {
        document.getElementById("assignedToDropdownContacts").classList.add("error-border");
        isValid = false;
    } else {
        document.getElementById("assignedToDropdownContacts").classList.remove("error-border");
    }
    let categoryText = document.getElementById("categoryPlaceholder").innerText.trim();
    if (categoryText === "Select task category") {
        document.getElementById("assignedToDropdownCategory").classList.add("error-border");
        isValid = false;
    } else {
        document.getElementById("assignedToDropdownCategory").classList.remove("error-border");
    }
    if (isValid) {
        const data = {
            title: document.getElementById("titleInput").value,
            description: document.getElementById("descriptionInput").value,
            date: document.getElementById("date").value,
            assignedTo: selectedContacts.map(contact => contact.name),
            category: categoryText,
        };
        saveTask("tasks", data)
            .then(() => {
                window.location.href = "boardMobile.html";
        })
    }
}

function toggleCheckIcon(checkbox) {
    let checkIcon = checkbox.parentElement.querySelector('.check-icon');
    if (!checkIcon) {
        return;
    }
    if (checkbox.checked) {
        checkIcon.classList.remove('dNone');
    } else {
        checkIcon.classList.add('dNone');
    }
}

function showErrorMessage(fieldId) {
    let errorMessage = document.getElementById(`error-${fieldId}`);
    if (errorMessage) {
        errorMessage.classList.remove("dNone");
    }
}

function hideErrorMessage(fieldId) {
    let errorMessage = document.getElementById(`error-${fieldId}`);
    if (errorMessage) {
        errorMessage.classList.add("dNone");
    }
}
