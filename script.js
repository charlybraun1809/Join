const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";

function onloadFunction() {
    console.log("test");
    loadData
}

async function loadData() {
    let response = await fetch(BASE_URL + ".json")
    let responseToJson = response.json();
    console.log(response);
}

async function uploadContacts(contactsData) {
    try {
        let response = await fetch(BASE_URL + "contacts.json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contactsData),
        });
        if (!response.ok) throw new Error("Fehler beim Hochladen der Kontakte");
        console.log("Kontakte erfolgreich hochgeladen:", await response.json());
    } catch (error) {
        console.error("Error beim Hochladen der Kontakte:", error);
    }
}

uploadContacts(contacts);