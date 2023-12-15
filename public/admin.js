async function fetchUsers() {
    try {
        const response = await fetch('/users'); // Fetch all users from the database
        const users = await response.json();
        const userList = document.getElementById('queryList');
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        ['Brukernavn', 'Fornavn', 'Etternavn', 'Telefon', 'E-post', 'Rolle', 'Peletong', 'Kompani', 'Rediger', 'Slett'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);
        users.forEach(user => { // For each user in the database, create a table row with the username, first name, last name, phone, email, role, and edit/delete buttons
            const row = document.createElement('tr');
            [user.username, user.first_name, user.last_name, user.phone, user.email, user.role, user.platoon_name, user.company_name].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                openModal(user); // Calls function to open the edit modal form when the button is clicked
            });
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteUser(user.id); // Calls function to delete user when the button is clicked
            });
            const tdEdit = document.createElement('td');
            const tdDelete = document.createElement('td');
            tdEdit.appendChild(editButton);
            tdDelete.appendChild(deleteButton);
            row.appendChild(tdEdit);
            row.appendChild(tdDelete);
            table.appendChild(row);
        });
        userList.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}
fetchUsers();
function openModal(user) { // Function to open the edit modal form
    document.querySelector('.modal').classList.toggle('hidden'); // Toggles the hidden class on the modal to show or hide the modal
    document.getElementById('new_username').value = user.username || '';
    document.getElementById('username').value = user.username || ''; // Sets the value of the username input field to the username of the user that was clicked
    document.getElementById('first_name').value = user.first_name || ''; // Sets the value of the first name input field to the first name of the user that was clicked
    document.getElementById('last_name').value = user.last_name || ''; // Sets the value of the last name input field to the last name of the user that was clicked
    document.getElementById('phone').value = user.phone || ''; // Sets the value of the phone input field to the phone of the user that was clicked
    document.getElementById('email').value = user.email || ''; // Sets the value of the email input field to the email of the user that was clicked
}
async function deleteUser(id) { // Function to delete user
    try {
        const response = await fetch('/deleteUser/' + id, { // Fetches the deleteUser route
            method: 'DELETE', 
        });
        location.reload(); // Reloads the page to update the user list
    } catch (error) {
        console.error(error);
    }
} 
function logout() {
fetch('/logout', { method: 'POST' }) // Sends a POST request to the logout route
    .then(response => {
        if (response.ok) {
            location.reload(); // Reloads the page to clear the session
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error(error);
    });
 }