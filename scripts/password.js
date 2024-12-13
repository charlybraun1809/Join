function initializePasswordToggle() {
    // Holen der Passwortfelder mit den Namen
    const passwordInput = document.querySelector("input[name='password']");
    const confirmPasswordInput = document.querySelector("input[name='confirmed']");

    // Erstelle das Eye-Icon nur für das erste Passwortfeld
    const passwordWrapper = passwordInput.parentElement;
    const toggleIcon = document.createElement("img");
    toggleIcon.classList.add("password-toggle");
    toggleIcon.src = "./assets/icons/visibility_off.svg"; // Anfangs geschlossen
    toggleIcon.alt = "Toggle Password";
    
    // Füge das Icon in den Wrapper des ersten Passwortfelds ein
    passwordWrapper.appendChild(toggleIcon);

    // Toggle-Logik für das Passwort-Feld (beide Felder werden gleichzeitig geändert)
    toggleIcon.addEventListener("click", () => {
        const currentType = passwordInput.type;

        // Wenn das Passwort-Feld "password" ist, dann ändern wir es in "text" (sichtbar)
        if (currentType === "password") {
            passwordInput.type = "text";
            confirmPasswordInput.type = "text"; // Auch das Bestätigungsfeld wird sichtbar
            toggleIcon.src = "./assets/icons/visibility.svg"; // Offenes Auge
        } else {
            passwordInput.type = "password";
            confirmPasswordInput.type = "password"; // Auch das Bestätigungsfeld wird unsichtbar
            toggleIcon.src = "./assets/icons/visibility_off.svg"; // Geschlossenes Auge
        }
    });

    // Zeige das Icon an, wenn der Benutzer etwas im Passwortfeld eingibt
    passwordInput.addEventListener("input", () => {
        if (passwordInput.value) {
            passwordInput.style.backgroundImage = "none"; // Schloss entfernen
            toggleIcon.style.display = "block"; // Auge-Icon anzeigen
        } else {
            passwordInput.style.backgroundImage = "url('../assets/icons/lock.svg')"; // Schloss anzeigen
            toggleIcon.style.display = "none"; // Auge-Icon verstecken
        }
    });
}

// Aufruf, wenn das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", initializePasswordToggle);
