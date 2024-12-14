function initializePasswordToggle() {
    // Holen der Passwortfelder mit den Namen
    const passwordInputs = document.querySelectorAll(".password-wrapper input[type='password']");

    const toggleIcons = []; // Array, um alle Icons zu speichern

    passwordInputs.forEach(input => {
        const wrapper = input.parentElement;

        // Erstelle das Toggle-Icon (geschlossener Blick initial)
        const toggleIcon = document.createElement("img");
        toggleIcon.classList.add("password-toggle");
        toggleIcon.src = "./assets/icons/visibility_off.svg"; // Anfangs geschlossen
        toggleIcon.alt = "Toggle Password";
        toggleIcon.style.width = "24px"; // Einheitliche Größe
        toggleIcon.style.height = "24px"; // Einheitliche Größe

        toggleIcons.push(toggleIcon); // Speichere das Icon

        // Füge das Icon in den Wrapper ein
        wrapper.appendChild(toggleIcon);

        // Zeige das Icon an, wenn der Benutzer etwas in das Feld eingibt
        input.addEventListener("input", () => {
            if (input.value) {
                input.style.backgroundImage = "none"; // Schloss entfernen
                toggleIcon.style.display = "block"; // Auge-Icon anzeigen
            } else {
                input.style.backgroundImage = "url('../assets/icons/lock.svg')"; // Schloss anzeigen
                toggleIcon.style.display = "none"; // Auge-Icon verstecken
            }
        });

        // Wiederhole die Anzeige von Schloss, wenn das Feld verlassen wird und leer ist
        input.addEventListener("blur", () => {
            if (!input.value) {
                input.style.backgroundImage = "url('../assets/icons/lock.svg')";
                toggleIcon.style.display = "none";
            }
        });
    });

    // Gemeinsame Toggle-Logik für alle Felder
    toggleIcons.forEach(toggleIcon => {
        toggleIcon.addEventListener("click", () => {
            const currentType = passwordInputs[0].type; // Prüfe den Typ des ersten Feldes

            if (currentType === "password") {
                // Passwort anzeigen
                passwordInputs.forEach(field => field.type = "text");
                toggleIcons.forEach(icon => icon.src = "./assets/icons/visibility.svg"); // Alle zu offenen Augen ändern
                icon.style.filter = "hue-rotate(180deg) saturate(500%) brightness(80%)"; // Farbe ändern zu #29ABE2

            } else {
                // Passwort verstecken
                passwordInputs.forEach(field => field.type = "password");
                toggleIcons.forEach(icon => icon.src = "./assets/icons/visibility_off.svg"); // Alle zu geschlossenen Augen ändern
            }
        });
    });
}

// Aufruf, wenn das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", initializePasswordToggle);