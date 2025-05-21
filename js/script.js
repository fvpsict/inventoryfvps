// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('inventory')) {
        localStorage.setItem('inventory', JSON.stringify([]));
    }

    // Make headers sortable
    const headers = document.querySelectorAll('table thead th');
    headers.forEach((header, index) => {
        if (index < headers.length - 1) { // Don't make the Actions column sortable
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => sortTable(index));
            header.title = 'Click to sort';
        }
    });

    // Add search functionality
    document.getElementById('searchInput').addEventListener('keyup', function() {
        loadInventory(this.value);
    });
});

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
        equipmentType: document.getElementById('equipmentType').value,
        vendor: document.getElementById('vendor').value,
        brandModel: document.getElementById('brandModel').value,
        assetNo: document.getElementById('assetNo').value,
        serialNumber: document.getElementById('serialNumber').value,
        endDate: document.getElementById('endDate').value,
        startDate: document.getElementById('startDate').value,
        room: document.getElementById('room').value,
        roomNumber: document.getElementById('roomNumber').value,
        level: document.getElementById('level').value,
        lamphour: document.getElementById('lamphour').value
    };

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    document.getElementById('inventoryForm').reset();
    alert('Item added successfully!');
    showInventory();
}

function calculateDuration(startDate) {
    try {
        const start = new Date(startDate);
        const today = new Date();
        
        const diffTime = Math.abs(today - start);
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;
        
        let duration = '';
        if (years > 0) {
            duration += `${years} year${years > 1 ? 's' : ''} `;
        }
        if (months > 0) {
            duration += `${months} month${months > 1 ? 's' : ''} `;
        }
        if (remainingDays > 0 || duration === '') {
            duration += `${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
        }
        
        return duration.trim();
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 'Invalid date';
    }
}

function loadInventory(searchTerm = '') {
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        inventory = inventory.filter(item => 
            item.equipmentType.toLowerCase().includes(searchTerm) ||
            item.vendor.toLowerCase().includes(searchTerm) ||
            item.brandModel.toLowerCase().includes(searchTerm) ||
            item.assetNo.toLowerCase().includes(searchTerm) ||
            item.serialNumber.toLowerCase().includes(searchTerm) ||
            item.room.toLowerCase().includes(searchTerm) ||
            item.roomNumber.toLowerCase().includes(searchTerm)
        );
    }

    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        const duration = calculateDuration(item.startDate);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.equipmentType}</td>
            <td>${item.vendor}</td>
            <td>${item.brandModel}</td>
            <td>${item.assetNo}</td>
            <td>${item.serialNumber}</td>
            <td>${item.endDate}</td>
            <td>${item.startDate}</td>
            <td>${duration}</td>
            <td>${item.room}</td>
            <td>${item.roomNumber}</td>
            <td>${item.level}</td>
            <td>${item.lamphour}</td>
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
    
    const newItem = {
        equipmentType: prompt('Enter new Equipment Type:', item.equipmentType),
        vendor: prompt('Enter new Vendor:', item.vendor),
        brandModel: prompt('Enter new Brand & Model:', item.brandModel),
        assetNo: prompt('Enter new Asset No:', item.assetNo),
        serialNumber: prompt('Enter new Serial Number:', item.serialNumber),
        endDate: prompt('Enter new End Date (YYYY-MM-DD):', item.endDate),
        startDate: prompt('Enter new Start Date (YYYY-MM-DD):', item.startDate),
        room: prompt('Enter new Room:', item.room),
        roomNumber: prompt('Enter new Room Number:', item.roomNumber),
        level: prompt('Enter new Level:', item.level),
        lamphour: prompt('Enter new Lamp Hour:', item.lamphour)
    };

    // Check if any field was cancelled
    if (Object.values(newItem).includes(null)) {
        return; // Exit if any field was cancelled
    }

    inventory[index] = newItem;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory();
}

function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        const inventory = JSON.parse(localStorage.getItem('inventory'));
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        loadInventory();
