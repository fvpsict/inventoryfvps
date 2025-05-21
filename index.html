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
    }
}

function showImportModal() {
    const modalElement = document.getElementById('importModal');
    if (!modalElement) {
        console.error('Modal element not found');
        return;
    }
    // Clear previous inputs
    document.getElementById('fileInput').value = '';
    document.getElementById('dataInput').value = '';
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function processData() {
    try {
        const fileInput = document.getElementById('fileInput');
        const dataInput = document.getElementById('dataInput');
        
        if (fileInput.files.length > 0) {
            processFile(fileInput.files[0]);
        } else if (dataInput.value.trim() !== '') {
            processPastedData(dataInput.value);
        } else {
            alert('Please either upload a file or paste data');
        }
    } catch (error) {
        console.error('Error processing data:', error);
        alert('An error occurred while processing the data. Please check the format and try again.');
    }
}

function processPastedData(data) {
    try {
        const rows = data.trim().split('\n');
        const inventory = [];
        let errorRows = [];
        
        const startIndex = rows[0].toLowerCase().includes('equipmenttype') ? 1 : 0;
        
        for (let i = startIndex; i < rows.length; i++) {
            const columns = rows[i].split('\t').map(col => col.trim());
            
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
            } else {
                errorRows.push(i + 1);
            }
        }
        
        if (errorRows.length > 0) {
            alert(`Warning: Rows ${errorRows.join(', ')} have incorrect format and were skipped.`);
        }
        
        if (inventory.length > 0) {
            updateInventory(inventory);
        } else {
            alert('No valid data found to import.');
        }
    } catch (error) {
        console.error('Error processing pasted data:', error);
        alert('Error processing data. Please check the format and try again.');
    }
}

function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            processPastedData(e.target.result);
        } catch (error) {
            console.error('Error processing file:', error);
            alert('Error processing file. Please check the file format and try again.');
        }
    };
    reader.onerror = function(error) {
        console.error('Error reading file:', error);
        alert('Error reading file. Please try again.');
    };
    reader.readAsText(file);
}

function updateInventory(newInventory) {
    try {
        if (!Array.isArray(newInventory)) {
            throw new Error('Invalid inventory format');
        }
        
        localStorage.setItem('inventory', JSON.stringify(newInventory));
        
        const modalElement = document.getElementById('importModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        loadInventory();
        alert('Inventory updated successfully!');
    } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Error updating inventory. Please try again.');
    }
}

function sortTable(columnIndex) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];

    inventory.sort((a, b) => {
        let valueA, valueB;
        
        // Get values based on column index
        switch(columnIndex) {
            case 0: valueA = a.equipmentType; valueB = b.equipmentType; break;
            case 1: valueA = a.vendor; valueB = b.vendor; break;
            case 2: valueA = a.brandModel; valueB = b.brandModel; break;
            case 3: valueA = a.assetNo; valueB = b.assetNo; break;
            case 4: valueA = a.serialNumber; valueB = b.serialNumber; break;
            case 5: valueA = new Date(a.endDate); valueB = new Date(b.endDate); break;
            case 6: valueA = new Date(a.startDate); valueB = new Date(b.startDate); break;
            case 8: valueA = a.room; valueB = b.room; break;
            case 9: valueA = a.roomNumber; valueB = b.roomNumber; break;
            case 10: valueA = parseInt(a.level) || 0; valueB = parseInt(b.level) || 0; break;
            case 11: valueA = parseInt(a.lamphour) || 0; valueB = parseInt(b.lamphour) || 0; break;
            default: return 0;
        }

        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
    });

    localStorage.setItem('inventory', JSON.stringify(inventory));
    loadInventory();
}

function exportToCSV() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    if (inventory.length === 0) {
        alert('No data to export');
        return;
    }

    const headers = ['Equipment Type,Vendor,Brand & Model,Asset No,Serial Number,End Date,Start Date,Duration in Use,Room,Room Number,Level,Lamp Hour'];
    const csvData = inventory.map(item => {
        const duration = calculateDuration(item.startDate);
        return `${item.equipmentType},${item.vendor},${item.brandModel},${item.assetNo},${item.serialNumber},${item.endDate},${item.startDate},${duration},${item.room},${item.roomNumber},${item.level},${item.lamphour}`;
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
