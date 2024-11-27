const BASE_URL = "https://remotestoragejoin-8362d-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  renderContacts()
}


async function getData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json");
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
}

async function postData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to post data:", error);
    }
}

async function putData(path = "", data = {}) {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to update data:", error);
    }
}

async function deleteData(path = "") {
    try {
        let response = await fetch(BASE_URL + path + ".json", {
            method: "DELETE",
        });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Failed to delete data:", error);
    }
}

// (async function saveUser() {
//     let users = await getData("users");
//     console.log("Users:", users);

//     let newUser = await postData("users", { name: "Alice", age: 25 });
//     console.log("New user added:", newUser);


//     await putData("users/user1", { name: "Alice", age: 30 });
//     console.log("User updated");

//     await deleteData("users/user1");
//     console.log("User deleted");
// })();


function confirmPassword() {
    let name = document.getElementById('inputName');
    let inputMail = document.getElementById('inputEmail');
    let phone = document.getElementById('inputPhone');
        postData("/contacts", {
            "name": name.value,
            "mail": inputMail.value,
            "phone": phone.value
        })
        window.location.href = 'contacts.html';
}


function renderContacts() {
  let contactContainer = document.getElementById('contactsSection');
  let contactsHtml = addNewContactTemplate();
  console.log(renderContacts);
  
  contactContainer.innerHTML = contactsHtml;
}


function addNewContactTemplate() {
  return `
    <div class="contacts-header">
          <div class="contacts-logo">AB</div>
          <h1>John Doe</h1>
        </div>
        <h3>Contact Information</h3>
        <div class="contacts-info">
          <p>
            <strong>
              E-Mail:
            </strong>
            <br>
            <br>
            <a style="color: rgb(23, 20, 223);" href="mailto:info@example.com">
              info@example.com
            </a>
          </p>
          <br>
          <p>
            <strong>
              Telefon:
            </strong>
            <br>
            <br>
            <a href="tel:+4917612345678">
              +49 176 12345678
            </a>
          </p>
          <br>
        </div>
      </div>
    `;
}