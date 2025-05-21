document.addEventListener('DOMContentLoaded', function() {
    // Navigation event listeners
    document.getElementById('addItemLink').addEventListener('click', showAddItem);
    document.getElementById('viewInventoryLink').addEventListener('click', showInventory);
    document.getElementById('welcomeAddBtn').addEventListener('click', showAddItem);
    document.getElementById('welcomeViewBtn').addEventListener('click', showInventory);
    document.getElementById('cancelAdd').addEventListener('click', showWelcome);
    document.getElementById('massUpdateBtn').addEventListener('click', showImportModal);
    document.getElementById('exportBtn').addEventListener('click', exportToCSV);
    document.getElementById('processDataBtn').addEventListener('click', processData);
    document.getElementById('saveEditBtn').addEventListener('click', saveEdit);

    // Form submission handler
    document.getElementById('inventoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addItem();
    });

    // Search functionality
    document.getElementById('searchInput').addEventListener('input', function() {
        loadInventory(this.value.toLowerCase());
    });
});

// Navigation Functions
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

function showWelcome() {
    document.getElementById('addItemForm').style.display = 'none';
    document.getElementById('inventoryList').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'block';
}

function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

// Inventory Management Functions
function addItem() {
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
    
    // Check for duplicates
    if (inventory.some(existing => 
        existing.assetNo === item.assetNo || 
        existing.serialNumber === item.serialNumber)) {
        alert('An item with this Asset No or Serial Number already exists!');
        return;
    }

    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    document.getElementById('inventoryForm').reset();
    showInventory();
}

function loadInventory(searchTerm = '') {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        if (searchTerm) {
            const searchableText = Object.values(item).join(' ').toLowerCase();
            if (!searchableText.includes(searchTerm)) return;
        }

        const row = document.createElement('tr');
        const duration = calculateDuration(item.startDate, item.endDate);
        
        row.innerHTML = `
            <td>${item.equipmentType}</td>
            <td>${item.vendor}</td>
            <td>${item.brandModel}</td>
            <td>${item.assetNo}</td>
            <td>${item.serialNumber}</td>
            <td>${formatDate(item.endDate)}</td>
            <td>${formatDate(item.startDate)}</td>
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

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${(diffDays / 365).toFixed(1)} years`;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function editItem(index) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const item = inventory[index];
    
    const modalBody = document.querySelector('#editModal .modal-body form');
    modalBody.innerHTML = `
        <input type="hidden" id="editIndex" value="${index}">
        <div class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Equipment Type</label>
                    <input type="text" class="form-control" id="editEquipmentType" value="${item.equipmentType}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Vendor</label>
                    <input type="text" class="form-control" id="editVendor" value="${item.vendor}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Brand & Model</label>
                    <input type="text" class="form-control" id="editBrandModel" value="${item.brandModel}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Asset No</label>
                    <input type="text" class="form-control" id="editAssetNo" value="${item.assetNo}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Serial Number</label>
                    <input type="text" class="form-control" id="editSerialNumber" value="${item.serialNumber}" required>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" id="editEndDate" value="${item.endDate}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" id="editStartDate" value="${item.startDate}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Room</label>
                    <input type="text" class="form-control" id="editRoom" value="${item.room}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Room Number</label>
                    <input type="text" class="form-control" id="editRoomNumber" value="${item.roomNumber}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Level</label>
                    <input type="number" class="form-control" id="editLevel" value="${item.level}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Lamp Hour</label>
                    <input type="number" class="form-control" id="editLamphour" value="${item.lamphour}" required>
                </div>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function saveEdit() {
    const index = document.getElementById('editIndex').value;
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    const updatedItem = {
        equipmentType: document.getElementById('editEquipmentType').value,
        vendor: document.getElementById('editVendor').value,
        brandModel: document.getElementById('editBrandModel').value,
        assetNo: document.getElementById('editAssetNo').value,
        serialNumber: document.getElementById('editSerialNumber').value,
        endDate: document.getElementById('editEndDate').value,
        startDate: document.getElementById('editStartDate').value,
        room: document.getElementById('editRoom').value,
        roomNumber: document.getElementById('editRoomNumber').value,
        level: document.getElementById('editLevel').value,
        lamphour: document.getElementById('editLamphour').value
    };

    // Check for duplicates excluding the current item
    const isDuplicate = inventory.some((item, i) => 
        i != index && (item.assetNo === updatedItem.assetNo || 
        item.serialNumber === updatedItem.serialNumber)
    );

    if (isDuplicate) {
        alert('An item with this Asset No or Serial Number already exists!');
        return;
    }

    inventory[index] = updatedItem;
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    modal.hide();
    
    loadInventory();
}

function deleteItem(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        inventory.splice(index, 1);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        loadInventory();
    }
}

function processData() {
    const fileInput = document.getElementById('fileInput');
    const dataInput = document.getElementById('dataInput');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            processImportedData(e.target.result);
        };
        reader.readAsText(file);
    } else if (dataInput.value.trim()) {
        processImportedData(dataInput.value);
    } else {
        alert('Please either upload a file or paste data');
    }
}

function processImportedData(data) {
    try {
        const rows = data.trim().split('\n');
        const headers = rows[0].toLowerCase().split('\t');
        const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
        let updated = 0, added = 0;

        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split('\t');
            const item = {};
            
            headers.forEach((header, index) => {
                if (values[index]) {
                    item[header.replace(/\s+/g, '')] = values[index].trim();
                }
            });

            const existingIndex = inventory.findIndex(existing => 
                existing.assetNo === item.assetno || 
                existing.serialNumber === item.serialnumber
            );

            if (existingIndex >= 0) {
                inventory[existingIndex] = {...inventory[existingIndex], ...item};
                updated++;
            } else {
                inventory.push(item);
                added++;
            }
        }

        localStorage.setItem('inventory', JSON.stringify(inventory));
        alert(`Updated ${updated} items and added ${added} new items.`);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
        modal.hide();
        
        loadInventory();
    } catch (error) {
        alert('Error processing data. Please check the format and try again.');
        console.error(error);
    }
}

function exportToCSV() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    if (inventory.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = ['Equipment Type', 'Vendor', 'Brand & Model', 'Asset No', 
                    'Serial Number', 'End Date', 'Start Date', 'Room', 
                    'Room Number', 'Level', 'Lamp Hour'];
    
    const rows = [headers.join('\t')];
    
    inventory.forEach(item => {
        const row = [
            item.equipmentType,
            item.vendor,
            item.brandModel,
            item.assetNo,
            item.serialNumber,
            item.endDate,
            item.startDate,
            item.room,
            item.roomNumber,
            item.level,
            item.lamphour
        ];
        rows.push(row.join('\t'));
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, 'inventory.csv');
    } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'inventory.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
