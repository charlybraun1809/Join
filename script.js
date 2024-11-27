<<<<<<< Updated upstream
=======
const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = {
    "contacts": {
      "contact1": {
        "name": "Alice Smith",
        "email": "alice.smith@example.com",
        "phone": "+49123456789",
        "address": "Berlin",
        "notes": "VIP Kunde"
      },
      "contact2": {
        "name": "Bob Johnson",
        "email": "bob.johnson@example.com",
        "phone": "+49234567890",
        "address": "Hamburg",
        "notes": "Partner"
      },
      "contact3": {
        "name": "Charlie Brown",
        "email": "charlie.brown@example.com",
        "phone": "+49345678901",
        "address": "Munich",
        "notes": "Lead"
      },
      "contact4": {
        "name": "Diana Prince",
        "email": "diana.prince@example.com",
        "phone": "+49456789012",
        "address": "Cologne",
        "notes": "Supporter"
      },
      "contact5": {
        "name": "Eve Adams",
        "email": "eve.adams@example.com",
        "phone": "+49567890123",
        "address": "Frankfurt",
        "notes": "Frequent Buyer"
      },
      "contact6": {
        "name": "Frank Castle",
        "email": "frank.castle@example.com",
        "phone": "+49678901234",
        "address": "Stuttgart",
        "notes": "Neuer Kunde"
      },
      "contact7": {
        "name": "Grace Hopper",
        "email": "grace.hopper@example.com",
        "phone": "+49789012345",
        "address": "Düsseldorf",
        "notes": "Wissenschaftler"
      },
      "contact8": {
        "name": "Hank Pym",
        "email": "hank.pym@example.com",
        "phone": "+49890123456",
        "address": "Leipzig",
        "notes": "Langjährig"
      },
      "contact9": {
        "name": "Ivy League",
        "email": "ivy.league@example.com",
        "phone": "+49901234567",
        "address": "Nürnberg",
        "notes": "Empfohlen"
      },
      "contact10": {
        "name": "Jack Sparrow",
        "email": "jack.sparrow@example.com",
        "phone": "+49123456789",
        "address": "Berlin",
        "notes": "Abenteuerlich"
      }
    }
  };
  


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
>>>>>>> Stashed changes
