// In script.js

// Update the showInventory function
function showInventory() {
    console.log('Showing Inventory'); // Debug log
    
    // Hide other sections
    document.getElementById('addItemForm').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'none';
    
    // Show inventory section
    const inventoryList = document.getElementById('inventoryList');
    inventoryList.style.display = 'block';
    
    // Load the inventory data
    loadInventory();
}

// Update the loadInventory function
function loadInventory(searchTerm = '') {
    console.log('Loading inventory data'); // Debug log
    
    // Get inventory from localStorage
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    console.log('Retrieved inventory:', inventory); // Debug log
    
    const tableBody = document.getElementById('inventoryTableBody');
    tableBody.innerHTML = ''; // Clear existing content

    if (inventory.length === 0) {
        // Show message if inventory is empty
        tableBody.innerHTML = `
            <tr>
                <td colspan="13" class="text-center">
                    <p class="my-3">No items in inventory</p>
                </td>
            </tr>`;
        return;
    }

    inventory.forEach((item, index) => {
        if (searchTerm) {
            const searchableText = Object.values(item).join(' ').toLowerCase();
            if (!searchableText.includes(searchTerm)) return;
        }

        const row = document.createElement('tr');
        const duration = calculateDuration(item.startDate, item.endDate);
        
        row.innerHTML = `
            <td>${item.equipmentType || ''}</td>
            <td>${item.vendor || ''}</td>
            <td>${item.brandModel || ''}</td>
            <td>${item.assetNo || ''}</td>
            <td>${item.serialNumber || ''}</td>
            <td>${formatDate(item.endDate) || ''}</td>
            <td>${formatDate(item.startDate) || ''}</td>
            <td>${duration || ''}</td>
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

// Update the event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded'); // Debug log
    
    // Navigation event listeners
    const viewInventoryLink = document.getElementById('viewInventoryLink');
    if (viewInventoryLink) {
        viewInventoryLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('View Inventory clicked'); // Debug log
            showInventory();
        });
    }

    const welcomeViewBtn = document.getElementById('welcomeViewBtn');
    if (welcomeViewBtn) {
        welcomeViewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Welcome View button clicked'); // Debug log
            showInventory();
        });
    }

    // Add some test data if needed (remove in production)
    if (!localStorage.getItem('inventory')) {
        const testData = [{
            equipmentType: 'Test Equipment',
            vendor: 'Test Vendor',
            brandModel: 'Test Model',
            assetNo: 'TEST001',
            serialNumber: 'SN001',
            endDate: '2025-12-31',
            startDate: '2024-01-01',
            room: 'Test Room',
            roomNumber: '101',
            level: '1',
            lamphour: '100'
        }];
        localStorage.setItem('inventory', JSON.stringify(testData));
    }
});

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
        console.error('Error formatting date:', e);
        return dateString;
    }
}

// Helper function to calculate duration
function calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return '';
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${(diffDays / 365).toFixed(1)} years`;
    } catch (e) {
        console.error('Error calculating duration:', e);
        return '';
    }
}

// Add error handling for localStorage
function getInventory() {
    try {
        return JSON.parse(localStorage.getItem('inventory')) || [];
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return [];
    }
}

function saveInventory(inventory) {
    try {
        localStorage.setItem('inventory', JSON.stringify(inventory));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}
