// Initialize inventory data in localStorage if it doesn't exist
if (!localStorage.getItem('inventory')) {
    localStorage.setItem('inventory', JSON.stringify([]));
}

function showAddItem() {
    document.getElementById('addItemForm').style.display = 'block';
    document.getElementById('inventoryList').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'none';
}

function showInventory() {
    document.getElementById('addItemForm').style.display = 'none';
    document.getElementById('inventoryList').style.display = 'block';
    document.getElementById('welcomeMessage').style.display = 'none';
    loadInventory();
}

function addItem(event) {
    event.preventDefault();

    const item = {
        serialNumber: document.getElementById('serialNumber').value,
        category: document.getElementById('category').value,
        name: document.getElementById('itemName').value,
        location: document.getElementById('location').value,
        quantity: document.getElementById('quantity').value,
        dateAdded: new Date().toISOString()
    };

    let inventory = JSON.parse(localStorage.getItem('inventory'));
    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    // Clear form
    document.getElementById('inventoryForm').reset();
    
    // Show success message
    alert('Item added successfully!');
    showInventory();
}

function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.serialNumber}</td>
            <td>${item.category}</td>
            <td>${item.name}</td>
            <td>${item.location}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editItem(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editItem(index) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const item = inventory[index];
    
    const newLocation = prompt('Enter new location:', item.location);
    if (newLocation !== null) {
        item.location = newLocation;
        inventory[index] = item;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        loadInventory();
    }
}

function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        const inventory = JSON.parse(localStorage.getItem('inventory'));
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        loadInventory();
    }
}

// Search functionality
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const filteredInventory = inventory.filter(item => 
        item.serialNumber.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm)
    );

    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    filteredInventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.serialNumber}</td>
            <td>${item.category}</td>
            <td>${item.name}</td>
            <td>${item.location}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editItem(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
});
