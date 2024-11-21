const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";

function onloadFunction() {
    console.log("test");
    loadData
}

async function loadData() {
    let response = await fetch(BASE_URL + ".jaon")
    let responseToJson = response.json();
    console.log(response);
}