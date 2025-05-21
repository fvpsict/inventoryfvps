// Initialize inventory on page load
document.addEventListener('DOMContentLoaded', function() {
    loadInventory();
    setupSearchListener();
});

// Setup search functionality
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        loadInventory(this.value.toLowerCase());
    });
}

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

function showImportModal() {
    const modal = new bootstrap.Modal(document.getElementById('importModal'));
    modal.show();
}

// Inventory Management Functions
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
    
    // Check for duplicate Asset No or Serial Number
    const isDuplicate = inventory.some(existingItem => 
        existingItem.assetNo === item.assetNo || 
        existingItem.serialNumber === item.serialNumber
    );

    if (isDuplicate) {
        alert('An item with this Asset No or Serial Number already exists!');
        return false;
    }

    inventory.push(item);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    document.getElementById('inventoryForm').reset();
    showInventory();
    return false;
}

function loadInventory(searchTerm = '') {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        // If there's a search term, filter the items
        if (searchTerm) {
            const searchableText = Object.values(item).join(' ').toLowerCase();
            if (!searchableText.includes(searchTerm)) return;
        }

        const row = document.createElement('tr');
        
        // Calculate duration in use
        const startDate = new Date(item.startDate);
        const endDate = new Date(item.endDate);
        const durationInDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const durationInYears = (durationInDays / 365).toFixed(1);

        row.innerHTML = `
            <td>${item.equipmentType}</td>
            <td>${item.vendor}</td>
            <td>${item.brandModel}</td>
            <td>${item.assetNo}</td>
            <td>${item.serialNumber}</td>
            <td>${formatDate(item.endDate)}</td>
            <td>${formatDate(item.startDate)}</td>
            <td>${durationInYears} years</td>
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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function editItem(index) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const item = inventory[index];
    
    document.getElementById('editIndex').value = index;
    document.getElementById('editEquipmentType').value = item.equipmentType;
    document.getElementById('editVendor').value = item.vendor;
    document.getElementById('editBrandModel').value = item.brandModel;
    document.getElementById('editAssetNo').value = item.assetNo;
    document.getElementById('editSerialNumber').value = item.serialNumber;
    document.getElementById('editEndDate').value = item.endDate;
    document.getElementById('editStartDate').value = item.startDate;
    document.getElementById('editRoom').value = item.room;
    document.getElementById('editRoomNumber').value = item.roomNumber;
    document.getElementById('editLevel').value = item.level;
    document.getElementById('editLamphour').value = item.lamphour;

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

// Import/Export Functions
function processPastedData(data) {
    try {
        const rows = data.trim().split('\n');
        if (rows.length < 2) {
            alert('No data found to import');
            return false;
        }

        // Get and process headers
        const headers = rows[0].split('\t').map(header => header.trim().toLowerCase());
        const headerIndexMap = {
            'equipmenttype': -1,
            'vendor': -1,
            'brandmodel': -1,
            'assetno': -1,
            'serialnumber': -1,
            'enddate': -1,
            'startdate': -1,
            'room': -1,
            'room number': -1,
            'level': -1,
            'lamphour': -1
        };

        // Map header indices
        headers.forEach((header, index) => {
            if (headerIndexMap.hasOwnProperty(header.replace(/\s+/g, ''))) {
                headerIndexMap[header.replace(/\s+/g, '')] = index;
            }
        });

        // Get existing inventory
        const existingInventory = JSON.parse(localStorage.getItem('inventory')) || [];
        const newInventory = [...existingInventory];
        let errorRows = [];
        let updatedCount = 0;
        let addedCount = 0;

        // Process data rows
        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split('\t').map(col => col.trim());
            if (columns.length < headers.length) {
                errorRows.push(i + 1);
                continue;
            }

            // Create item object with only the fields present in headers
            const item = {};
            let hasData = false;
            
            // Map data according to headers
            if (headerIndexMap.equipmenttype !== -1) {
                item.equipmentType = columns[headerIndexMap.equipmenttype];
                hasData = true;
            }
            if (headerIndexMap.vendor !== -1) {
                item.vendor = columns[headerIndexMap.vendor];
                hasData = true;
            }
            if (headerIndexMap.brandmodel !== -1) {
                item.brandModel = columns[headerIndexMap.brandmodel];
                hasData = true;
            }
            if (headerIndexMap.assetno !== -1) {
                item.assetNo = columns[headerIndexMap.assetno];
                hasData = true;
            }
            if (headerIndexMap.serialnumber !== -1) {
                item.serialNumber = columns[headerIndexMap.serialnumber];
                hasData = true;
            }
            if (headerIndexMap.enddate !== -1) {
                item.endDate = columns[headerIndexMap.enddate];
                hasData = true;
            }
            if (headerIndexMap.startdate !== -1) {
                item.startDate = columns[headerIndexMap.startdate];
                hasData = true;
            }
            if (headerIndexMap.room !== -1) {
                item.room = columns[headerIndexMap.room];
                hasData = true;
            }
            if (headerIndexMap['room number'] !== -1) {
                item.roomNumber = columns[headerIndexMap['room number']];
                hasData = true;
            }
            if (headerIndexMap.level !== -1) {
                item.level = columns[headerIndexMap.level];
                hasData = true;
            }
            if (headerIndexMap.lamphour !== -1) {
                item.lamphour = columns[headerIndexMap.lamphour];
                hasData = true;
            }

            if (!hasData) {
                errorRows.push(i + 1);
                continue;
            }

            // Try to find existing item by Asset No or Serial Number
            const existingItemIndex = newInventory.findIndex(existing => 
                (item.assetNo && existing.assetNo === item.assetNo) || 
                (item.serialNumber && existing.serialNumber === item.serialNumber)
            );

            if (existingItemIndex !== -1) {
                // Update existing item with new data while preserving existing fields
                const updatedItem = { ...newInventory[existingItemIndex] };
                Object.keys(item).forEach(key => {
                    if (item[key]) {
                        updatedItem[key] = item[key];
                    }
                });
                newInventory[existingItemIndex] = updatedItem;
                updatedCount++;
            } else {
                // For new items, ensure all required fields have default values
                const newItem = {
                    equipmentType: item.equipmentType || '',
                    vendor: item.vendor || '',
                    brandModel: item.brandModel || '',
                    assetNo: item.assetNo || '',
                    serialNumber: item.serialNumber || '',
                    endDate: item.endDate || '',
                    startDate: item.startDate || '',
                    room: item.room || '',
                    roomNumber: item.roomNumber || '',
                    level: item.level || '',
                    lamphour: item.lamphour || ''
                };
                newInventory.push(newItem);
                addedCount++;
            }
        }

        if (errorRows.length > 0) {
            alert(`Warning: Rows ${errorRows.join(', ')} have incorrect format and were skipped.`);
        }

        if (updatedCount > 0 || addedCount > 0) {
            localStorage.setItem('inventory', JSON.stringify(newInventory));
            alert(`Update successful!\nUpdated items: ${updatedCount}\nNew items added: ${addedCount}`);
            
            // Close the modal
            const modalElement = document.getElementById('importModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }

            // Clear inputs
            document.getElementById('fileInput').value = '';
            document.getElementById('dataInput').value = '';

            // Show inventory
            showInventory();
            return true;
        } else {
            alert('No valid data found to import.');
            return false;
        }

    } catch (error) {
        console.error('Error processing pasted data:', error);
        alert('Error processing data. Please check the format and try again.');
        return false;
    }
}

function processData() {
    const fileInput = document.getElementById('fileInput');
    const dataInput = document.getElementById('dataInput');
    
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            processPastedData(e.target.result);
        };
        reader.readAsText(file);
    } else if (dataInput.value.trim() !== '') {
        processPastedData(dataInput.value);
    } else {
        alert('Please either upload a file or paste data');
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
    
    const csvRows = [headers.join('\t')];

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
        csvRows.push(row.join('\t'));
    });

    const csvContent = csvRows.join('\n');
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
