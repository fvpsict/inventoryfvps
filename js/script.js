// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('inventory')) {
        localStorage.setItem('inventory', JSON.stringify([]));
    }

    // Add click handler to mass update button
    const massUpdateBtn = document.querySelector('.btn-success');
    if (massUpdateBtn) {
        massUpdateBtn.addEventListener('click', function() {
            console.log('Mass Update button clicked');
            showImportModal();
        });
    } else {
        console.error('Mass Update button not found');
    }

    // Check if modal exists
    const modalElement = document.getElementById('importModal');
    if (!modalElement) {
        console.error('Modal element not found');
    } else {
        console.log('Modal element found');
    }
});

function showAddItem() {
    document.getElementById('addItemForm').style.display = 'block';
    document.getElementById('inventoryList').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'none';
}

function showInventory() {
    console.log("Showing inventory"); // Debug line
    document.getElementById('addItemForm').style.display = 'none';
    document.getElementById('inventoryList').style.display = 'block';
    document.getElementById('welcomeMessage').style.display = 'none';
    loadInventory(); // This loads the inventory data
}

function addItem(event) {
    event.preventDefault();

    const item = {
        serialNumber: document.getElementById('serialNumber').value,
        equipmentType: document.getElementById('equipmentType').value,
        equipmentBrandModel: document.getElementById('equipmentBrandModel').value,
        location: document.getElementById('location').value,
        quantity: document.getElementById('quantity').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };

    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));

    document.getElementById('inventoryForm').reset();
    alert('Item added successfully!');
    showInventory();
}

function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.serialNumber}</td>
            <td>${item.equipmentType}</td>
            <td>${item.equipmentBrandModel}</td>
            <td>${item.location}</td>
            <td>${item.quantity}</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
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
    
    const newSerialNumber = prompt('Enter new Serial Number:', item.serialNumber);
    const newEquipmentType = prompt('Enter new Equipment Type:', item.equipmentType);
    const newBrandModel = prompt('Enter new Brand & Model:', item.equipmentBrandModel);
    const newLocation = prompt('Enter new Location:', item.location);
    const newQuantity = prompt('Enter new Quantity:', item.quantity);
    const newStartDate = prompt('Enter new Start Date (YYYY-MM-DD):', item.startDate);
    const newEndDate = prompt('Enter new End Date (YYYY-MM-DD):', item.endDate);
    
    if (newSerialNumber !== null && newEquipmentType !== null && newBrandModel !== null && 
        newLocation !== null && newQuantity !== null && newStartDate !== null && newEndDate !== null) {
        
        inventory[index] = {
            serialNumber: newSerialNumber,
            equipmentType: newEquipmentType,
            equipmentBrandModel: newBrandModel,
            location: newLocation,
            quantity: newQuantity,
            startDate: newStartDate,
            endDate: newEndDate
        };
        
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

function showImportModal() {
    const modalElement = document.getElementById('importModal');
    if (!modalElement) {
        console.error('Modal element not found');
        return;
    }
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function processData() {
    const fileInput = document.getElementById('fileInput');
    const dataInput = document.getElementById('dataInput');
    
    if (fileInput.files.length > 0) {
        processFile(fileInput.files[0]);
    } else if (dataInput.value.trim() !== '') {
        processPastedData(dataInput.value);
    } else {
        alert('Please either upload a file or paste data');
    }
}

function processPastedData(data) {
    const rows = data.trim().split('\n');
    const inventory = [];
    
    for (let i = 0; i < rows.length; i++) {
        if (i === 0 && rows[i].toLowerCase().includes('serial number')) continue; // Skip header row
        
        const columns = rows[i].split(',').map(col => col.trim());
        if (columns.length >= 7) {
            inventory.push({
                serialNumber: columns[0],
                equipmentType: columns[1],
                equipmentBrandModel: columns[2],
                location: columns[3],
                quantity: columns[4],
                startDate: columns[5],
                endDate: columns[6]
            });
        }
    }
    
    updateInventory(inventory);
}

function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        processPastedData(e.target.result);
    };
    reader.readAsText(file);
}

function updateInventory(newInventory) {
    localStorage.setItem('inventory', JSON.stringify(newInventory));
    loadInventory();
    const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
    modal.hide();
    alert('Inventory updated successfully!');
}

// Search functionality
document.getElementById('searchInput').addEventListener('keyup', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const filteredInventory = inventory.filter(item => 
        item.serialNumber.toLowerCase().includes(searchTerm) ||
        item.equipmentType.toLowerCase().includes(searchTerm) ||
        item.equipmentBrandModel.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm)
    );

    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    filteredInventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.serialNumber}</td>
            <td>${item.equipmentType}</td>
            <td>${item.equipmentBrandModel}</td>
            <td>${item.location}</td>
            <td>${item.quantity}</td>
            <td>${item.startDate}</td>
            <td>${item.endDate}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editItem(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
});

function exportToCSV() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    if (inventory.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = ['Serial Number,Equipment Type,Equipment Brand & Model,Location,Quantity,Start Date,End Date'];
    const csvData = inventory.map(item => {
        return `${item.serialNumber},${item.equipmentType},${item.equipmentBrandModel},${item.location},${item.quantity},${item.startDate},${item.endDate}`;
    });

    const csvContent = headers.concat(csvData).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, 'inventory.csv');
    } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'inventory.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
