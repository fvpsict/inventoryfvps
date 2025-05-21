// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('inventory')) {
        localStorage.setItem('inventory', JSON.stringify([]));
    }

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

    // Validate dates
    if (!isValidDate(item.startDate) || !isValidDate(item.endDate)) {
        alert('Please enter valid dates in YYYY-MM-DD format');
        return false;
    }

    // Check for duplicate serial number
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    if (inventory.some(existingItem => existingItem.serialNumber === item.serialNumber)) {
        alert('An item with this serial number already exists!');
        return false;
    }

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
        
        if (!(start instanceof Date) || isNaN(start)) {
            return 'Invalid date';
        }

        const diffTime = Math.abs(today - start);
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;
        
        let duration = [];
        
        if (years > 0) {
            duration.push(`${years} year${years > 1 ? 's' : ''}`);
        }
        if (months > 0) {
            duration.push(`${months} month${months > 1 ? 's' : ''}`);
        }
        if (remainingDays > 0 || duration.length === 0) {
            duration.push(`${remainingDays} day${remainingDays !== 1 ? 's' : ''}`);
        }
        
        return duration.join(', ');
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
            Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchTerm)
            )
        );
    }

    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = '';

    inventory.forEach((item, index) => {
        const duration = calculateDuration(item.startDate);
        const row = document.createElement('tr');
        
        // Add warning class if equipment is near end date
        const endDate = new Date(item.endDate);
        const today = new Date();
        const daysUntilEnd = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilEnd < 30 && daysUntilEnd >= 0) {
            row.classList.add('table-warning');
        } else if (daysUntilEnd < 0) {
            row.classList.add('table-danger');
        }

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

    // Add summary information
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'alert alert-info mt-3';
    summaryDiv.innerHTML = `
        <h5>Inventory Summary</h5>
        <p>Total Items: ${inventory.length}</p>
        <p>Items Expiring Soon (within 30 days): ${inventory.filter(item => {
            const daysUntilEnd = Math.floor((new Date(item.endDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilEnd < 30 && daysUntilEnd >= 0;
        }).length}</p>
        <p>Expired Items: ${inventory.filter(item => new Date(item.endDate) < new Date()).length}</p>
    `;
    
    const existingDiv = document.querySelector('.alert-info');
    if (existingDiv) {
        existingDiv.remove();
    }
    document.getElementById('inventoryList').appendChild(summaryDiv);
}

function editItem(index) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const item = inventory[index];
    
    const modalHTML = `
        <div class="modal fade" id="editModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Item</h5>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="toggleAll" 
                                   onchange="toggleAllFields(this.checked)">
                            <label class="form-check-label" for="toggleAll">Select All Fields</label>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editForm">
                            ${createEditField('Equipment Type', 'equipmentType', item.equipmentType)}
                            ${createEditField('Vendor', 'vendor', item.vendor)}
                            ${createEditField('Brand & Model', 'brandModel', item.brandModel)}
                            ${createEditField('Asset No', 'assetNo', item.assetNo)}
                            ${createEditField('Serial Number', 'serialNumber', item.serialNumber)}
                            ${createEditField('End Date', 'endDate', item.endDate, 'date')}
                            ${createEditField('Start Date', 'startDate', item.startDate, 'date')}
                            ${createEditField('Room', 'room', item.room)}
                            ${createEditField('Room Number', 'roomNumber', item.roomNumber)}
                            ${createEditField('Level', 'level', item.level, 'number')}
                            ${createEditField('Lamp Hour', 'lamphour', item.lamphour, 'number')}
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="saveEdit(${index})">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('editModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to document
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listeners to checkboxes
    const fields = ['equipmentType', 'vendor', 'brandModel', 'assetNo', 'serialNumber', 
                   'endDate', 'startDate', 'room', 'roomNumber', 'level', 'lamphour'];
    
    fields.forEach(field => {
        const checkbox = document.getElementById(`check_${field}`);
        const input = document.getElementById(`edit_${field}`);
        
        checkbox.addEventListener('change', function() {
            input.disabled = !this.checked;
            if (this.checked) {
                input.focus();
            }
        });
    });

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

function createEditField(label, id, value, type = 'text') {
    return `
        <div class="mb-3">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="check_${id}">
                <label class="form-check-label">${label}</label>
            </div>
            <input type="${type}" class="form-control mt-2" id="edit_${id}" 
                value="${value}" disabled>
        </div>
    `;
}

function saveEdit(index) {
    const inventory = JSON.parse(localStorage.getItem('inventory'));
    const currentItem = inventory[index];
    const updatedItem = { ...currentItem };
    
    const fields = ['equipmentType', 'vendor', 'brandModel', 'assetNo', 'serialNumber', 
                   'endDate', 'startDate', 'room', 'roomNumber', 'level', 'lamphour'];
    
    let hasChanges = false;
    
    fields.forEach(field => {
        const checkbox = document.getElementById(`check_${field}`);
        if (checkbox.checked) {
            const newValue = document.getElementById(`edit_${field}`).value;
            
            if ((field === 'startDate' || field === 'endDate') && !isValidDate(newValue)) {
                alert(`Please enter a valid date for ${field} in YYYY-MM-DD format`);
                return;
            }
            
            if (field === 'serialNumber' && newValue !== currentItem.serialNumber) {
                // Check for duplicate serial number
                if (inventory.some(item => item.serialNumber === newValue)) {
                    alert('An item with this serial number already exists!');
                    return;
                }
            }
            
            if (newValue !== currentItem[field]) {
                updatedItem[field] = newValue;
                hasChanges = true;
            }
        }
    });
    
    if (hasChanges) {
        inventory[index] = updatedItem;
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
        
        loadInventory();
        alert('Item updated successfully!');
    } else {
        alert('No changes were made');
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

function toggleAllFields(checked) {
    const fields = ['equipmentType', 'vendor', 'brandModel', 'assetNo', 'serialNumber', 
                   'endDate', 'startDate', 'room', 'roomNumber', 'level', 'lamphour'];
    
    fields.forEach(field => {
        const checkbox = document.getElementById(`check_${field}`);
        const input = document.getElementById(`edit_${field}`);
        if (checkbox) {
            checkbox.checked = checked;
            input.disabled = !checked;
        }
    });
}

function showImportModal() {
    const modalElement = document.getElementById('importModal');
    if (!modalElement) {
        console.error('Modal element not found');
        return;
    }
    
    document.getElementById('fileInput').value = '';
    document.getElementById('dataInput').value = '';
    
    const currentInventory = JSON.parse(localStorage.getItem('inventory')) || [];
    if (currentInventory.length > 0) {
        const header = 'Equipment Type\tVendor\tBrand & Model\tAsset No\tSerial Number\tEnd Date\tStart Date\tRoom\tRoom Number\tLevel\tLamp Hour';
        const inventoryText = currentInventory.map(item => 
            `${item.equipmentType}\t${item.vendor}\t${item.brandModel}\t${item.assetNo}\t${item.serialNumber}\t${item.endDate}\t${item.startDate}\t${item.room}\t${item.roomNumber}\t${item.level}\t${item.lamphour}`
        ).join('\n');
        document.getElementById('dataInput').value = `${header}\n${inventoryText}`;
    }
    
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
        let duplicates = [];
        
        const startIndex = rows[0].toLowerCase().includes('equipment type') ? 1 : 0;
        const existingSerials = new Set();
        
        for (let i = startIndex; i < rows.length; i++) {
            const columns = rows[i].split('\t').map(col => col.trim());
            
            if (columns.length >= 11) {
                const item = {
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
                };

                if (!isValidDate(item.startDate) || !isValidDate(item.endDate)) {
                    errorRows.push(`Row ${i + 1}: Invalid date format. Use YYYY-MM-DD`);
                    continue;
                }

                if (existingSerials.has(item.serialNumber)) {
                    duplicates.push(`Row ${i + 1}: Duplicate serial number ${item.serialNumber}`);
                    continue;
                }

                existingSerials.add(item.serialNumber);
                inventory.push(item);
            } else {
                errorRows.push(`Row ${i + 1}: Incorrect number of columns`);
            }
        }
        
        if (errorRows.length > 0 || duplicates.length > 0) {
            const messages = [];
            if (errorRows.length > 0) {
                messages.push('Errors:\n' + errorRows.join('\n'));
            }
            if (duplicates.length > 0) {
                messages.push('Duplicates:\n' + duplicates.join('\n'));
            }
            
            if (!confirm(`${messages.join('\n\n')}\n\nDo you want to continue with valid entries?`)) {
                return;
            }
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

function updateInventory(newInventory) {
    try {
        if (!Array.isArray(newInventory)) {
            throw new Error('Invalid inventory format');
        }
        
        const oldInventory = localStorage.getItem('inventory');
        localStorage.setItem('inventory_backup', oldInventory);
        
        localStorage.setItem('inventory', JSON.stringify(newInventory));
        
        const modalElement = document.getElementById('importModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
        
        loadInventory();
        
        const restoreButton = createRestoreButton();
        document.querySelector('.container').insertBefore(restoreButton, document.querySelector('#inventoryList'));
        
        alert(`Inventory updated successfully! ${newInventory.length} items imported.`);
    } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Error updating inventory. Please try again.');
    }
}

function createRestoreButton() {
    const button = document.createElement('button');
    button.className = 'btn btn-warning mb-3';
    button.textContent = 'Undo Last Import';
    button.onclick = function() {
        if (confirm('Are you sure you want to restore the previous inventory?')) {
            const backup = localStorage.getItem('inventory_backup');
            if (backup) {
                localStorage.setItem('inventory', backup);
                loadInventory();
                this.remove();
                alert('Previous inventory restored successfully!');
            }
        }
    };
    return button;
}

function copyToClipboard() {
    const textarea = document.getElementById('dataInput');
    textarea.select();
    document.execCommand('copy');
    alert('Content copied to clipboard!');
}

function clearTextarea() {
    if (confirm('Are you sure you want to clear the textarea?')) {
        document.getElementById('dataInput').value = '';
    }
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}
