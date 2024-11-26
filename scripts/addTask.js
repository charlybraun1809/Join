document.addEventListener("DOMContentLoaded", function () {
    let select = document.getElementById('assignedToDropdown');
    let placeHolder = document.getElementsByClassName('dropdown-selected')[0];
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow');
    let dropDown = document.getElementsByClassName('dropdown-list')[0];
    dropdownFunction(arrow, placeHolder, dropDown, select, isClicked);
    saveSelectedContact();
});

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








