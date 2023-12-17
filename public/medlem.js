async function fetchUsers() {
    try {
        const response = await fetch('/users'); // Henter alle brukere fra databasen
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
        users.forEach(user => { // For hver bruker i databasen, opprett en tabellrad med brukernavn, fornavn, etternavn, telefon, e-post, rolle og rediger/slett-knapper
            if (user.role === 'Medlem') {
                const row = document.createElement('tr');
                [user.username, user.first_name, user.last_name, user.phone, user.email, user.role, user.platoon_name, user.company_name].forEach(text => {
                    const td = document.createElement('td');
                    td.textContent = text;
                    row.appendChild(td);
                });
                const editButton = document.createElement('button');
                editButton.textContent = 'Rediger';
                editButton.addEventListener('click', () => {
                    openModal(user); // Kaller funksjonen for å åpne redigeringsmodalen når knappen klikkes
                });
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Slett';
                deleteButton.addEventListener('click', () => {
                    deleteUser(user.id); // Kaller funksjonen for å slette bruker når knappen klikkes
                });
                const tdEdit = document.createElement('td');
                const tdDelete = document.createElement('td');
                tdEdit.appendChild(editButton);
                tdDelete.appendChild(deleteButton);
                row.appendChild(tdEdit);
                row.appendChild(tdDelete);
                table.appendChild(row);
            }
        });
        userList.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}
fetchUsers();
function openModal(user) { // Funksjon for å åpne redigeringsmodalen
    document.querySelector('.modal').classList.toggle('hidden'); // Veksler på hidden-klassen for å vise eller skjule modalen
    document.getElementById('new_username').value = user.username || '';
    document.getElementById('username').value = user.username || ''; // Setter verdien til brukernavn-inputfeltet til brukernavnet til brukeren som ble klikket på
    document.getElementById('first_name').value = user.first_name || ''; // Setter verdien til fornavn-inputfeltet til fornavnet til brukeren som ble klikket på
    document.getElementById('last_name').value = user.last_name || ''; // Setter verdien til etternavn-inputfeltet til etternavnet til brukeren som ble klikket på
    document.getElementById('phone').value = user.phone || ''; // Setter verdien til telefon-inputfeltet til telefonnummeret til brukeren som ble klikket på
    document.getElementById('email').value = user.email || ''; // Setter verdien til e-post-inputfeltet til e-postadressen til brukeren som ble klikket på
    document.getElementById('role').disabled = true; // Deaktiverer rolle-select-inputfeltet
}
async function deleteUser(id) { // Funksjon for å slette bruker
    try {
        const response = await fetch('/deleteUser/' + id, { // Henter deleteUser-ruten
            method: 'DELETE', 
        });
        location.reload(); // Laster siden på nytt for å oppdatere brukerlisten
    } catch (error) {
        console.error(error);
    }
} 
function logout() {
    fetch('/logout', { method: 'POST' }) // Sender en POST-forespørsel til logout-ruten
        .then(response => {
            if (response.ok) {
                location.reload(); // Laster siden på nytt for å fjerne økten
            } else {
                console.error('Logg ut mislyktes');
            }
        })
        .catch(error => {
            console.error(error);
        });
}