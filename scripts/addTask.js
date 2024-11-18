document.addEventListener("DOMContentLoaded", function () {
    let select = document.getElementById('dropdown-arrow');
    let placeHolder = document.getElementsByClassName('dropdown-selected')[0];
    let isClicked = false;
    let arrow = document.querySelector('#dropdown-arrow');
    let dropDown = document.getElementsByClassName('dropdown-list')[0];
    select.addEventListener('click', () => {
        if (!isClicked) {
            arrow.style.transform = "translateY(-50%) rotate(180deg)";
            placeHolder.querySelector('span').textContent = 'An'
            dropDown.style.display = 'block';
            isClicked = true;
        } else {
            arrow.style.transform = "translateY(-50%) rotate(0deg)";
            placeHolder.querySelector('span').textContent = 'select contact';
            dropDown.style.display = 'none';
            isClicked = false;
        }
    })
});


