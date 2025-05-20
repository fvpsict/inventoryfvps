// Add these functions to your existing script.js

// Show import modal
function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

// Process the imported data
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

// Process pasted data
function processPastedData(data) {
    const rows = data.trim().split('\n');
    const inventory = [];
    
    for (let i = 0; i < rows.length; i++) {
        if (i === 0 && rows[i].toLowerCase().includes('equipmenttype')) continue; // Skip header row
        
        const columns = rows[i].split(',').map(col => col.trim());
        if (columns.length >= 11) {
            inventory.push({
                equipmentType: columns[0],
                vendor: columns[1],
                brandModel: columns[2],
                assetNo: columns[3],
                serialNumber: columns[4],
                endDate: columns[5],
                startDate: columns[6],
                room: columns[7],
                roomNumber: columns[8],
                level: columns[9],
                lamphour: columns[10]
            });
        }
    }
    
    updateInventory(inventory);
}

// Process uploaded file
function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        processPastedData(e.target.result);
    };
    reader.readAsText(file);
}

// Update the inventory
function updateInventory(newInventory) {
    localStorage.setItem('inventory', JSON.stringify(newInventory));
    loadInventory();
    const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
    modal.hide();
    alert('Inventory updated successfully!');
}

// Update the loadInventory function
function loadInventory() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.equipmentType || ''}</td>
            <td>${item.vendor || ''}</td>
            <td>${item.brandModel || ''}</td>
            <td>${item.assetNo || ''}</td>
            <td>${item.serialNumber || ''}</td>
            <td>${item.endDate || ''}</td>
            <td>${item.startDate || ''}</td>
            <td>${item.room || ''}</td>
            <td>${item.roomNumber || ''}</td>
            <td>${item.level || ''}</td>
            <td>${item.lamphour || ''}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editItem(${index})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update the addItem function to include new fields
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
