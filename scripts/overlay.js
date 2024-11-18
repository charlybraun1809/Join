document.getElementById('btn-contact').addEventListener('click', function () {
    document.getElementById('contact-overlay').classList.remove('d-none');
    document.getElementById('about-page').classList.add('d-none');
});

document.getElementById('btn-about').addEventListener('click', function () {
    document.getElementById('about-page').classList.remove('d-none');
    document.getElementById('contact-overlay').classList.add('d-none');
});
s