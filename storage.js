/* ============================================
   ESAHUB - Storage Management
   ============================================ */

/**
 * Get data from localStorage
 * @param {string} key - The key to retrieve
 * @returns {any} The stored data or null
 */
function getStorageData(key) {
    try {
        const data = localStorage.getItem(`esahub_${key}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error retrieving ${key} from storage:`, error);
        return null;
    }
}

/**
 * Set data in localStorage
 * @param {string} key - The key to store
 * @param {any} value - The value to store
 * @returns {boolean} Success status
 */
function setStorageData(key, value) {
    try {
        localStorage.setItem(`esahub_${key}`, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error storing ${key} in storage:`, error);
        return false;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} Success status
 */
function removeStorageData(key) {
    try {
        localStorage.removeItem(`esahub_${key}`);
        return true;
    } catch (error) {
        console.error(`Error removing ${key} from storage:`, error);
        return false;
    }
}

/**
 * Clear all Esahub data from localStorage
 * @returns {boolean} Success status
 */
function clearAllStorageData() {
    try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('esahub_')) {
                localStorage.removeItem(key);
            }
        });
        console.log('✅ All Esahub data cleared');
        return true;
    } catch (error) {
        console.error('Error clearing storage:', error);
        return false;
    }
}

/**
 * Export all Esahub data as JSON
 * @returns {object} All stored data
 */
function exportAllData() {
    const data = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
        if (key.startsWith('esahub_')) {
            const cleanKey = key.replace('esahub_', '');
            data[cleanKey] = getStorageData(cleanKey);
        }
    });
    
    return data;
}

/**
 * Import data to localStorage
 * @param {object} data - The data to import
 * @returns {boolean} Success status
 */
function importData(data) {
    try {
        Object.keys(data).forEach(key => {
            setStorageData(key, data[key]);
        });
        console.log('✅ Data imported successfully');
        return true;
    } catch (error) {
        console.error('Error importing data:', error);
        return false;
    }
}

/**
 * Download data as JSON file
 */
function downloadData() {
    const data = exportAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esahub-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Get storage usage
 * @returns {object} Storage info
 */
function getStorageUsage() {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
        if (key.startsWith('esahub_')) {
            const value = localStorage.getItem(key);
            totalSize += value.length + key.length;
        }
    });
    
    return {
        used: (totalSize / 1024).toFixed(2) + ' KB',
        items: keys.filter(k => k.startsWith('esahub_')).length
    };
}

/**
 * Initialize storage with default values
 */
function initializeStorage() {
    // Check if already initialized
    if (getStorageData('initialized')) {
        return;
    }
    
    // Set default values
    setStorageData('siteTitle', 'مرحباً في Esahub');
    setStorageData('projects', []);
    setStorageData('visitors', []);
    setStorageData('customCodes', []);
    setStorageData('initialized', true);
    
    console.log('✅ Storage initialized with default values');
}

/**
 * Backup data to localStorage with timestamp
 */
function backupData() {
    const backup = {
        data: exportAllData(),
        timestamp: new Date().toISOString()
    };
    
    const backups = getStorageData('backups') || [];
    backups.push(backup);
    
    // Keep only last 10 backups
    if (backups.length > 10) {
        backups.shift();
    }
    
    setStorageData('backups', backups);
    console.log('✅ Backup created successfully');
}

/**
 * Restore data from backup
 * @param {number} index - Backup index
 * @returns {boolean} Success status
 */
function restoreBackup(index) {
    const backups = getStorageData('backups') || [];
    
    if (index < 0 || index >= backups.length) {
        console.error('Invalid backup index');
        return false;
    }
    
    const backup = backups[index];
    return importData(backup.data);
}

/**
 * Get all backups
 * @returns {array} List of backups
 */
function getBackups() {
    return getStorageData('backups') || [];
}

/**
 * Delete a specific backup
 * @param {number} index - Backup index
 * @returns {boolean} Success status
 */
function deleteBackup(index) {
    const backups = getStorageData('backups') || [];
    
    if (index < 0 || index >= backups.length) {
        return false;
    }
    
    backups.splice(index, 1);
    setStorageData('backups', backups);
    return true;
}

/**
 * Compress storage data
 */
function compressStorage() {
    const data = exportAllData();
    
    // Remove empty arrays and null values
    Object.keys(data).forEach(key => {
        if (Array.isArray(data[key]) && data[key].length === 0) {
            delete data[key];
        }
        if (data[key] === null) {
            delete data[key];
        }
    });
    
    // Re-import cleaned data
    clearAllStorageData();
    importData(data);
    
    console.log('✅ Storage compressed');
}

/**
 * Validate storage data
 * @returns {object} Validation result
 */
function validateStorage() {
    const issues = [];
    const data = exportAllData();
    
    // Check projects
    if (data.projects && !Array.isArray(data.projects)) {
        issues.push('Projects data is not an array');
    }
    
    // Check visitors
    if (data.visitors && !Array.isArray(data.visitors)) {
        issues.push('Visitors data is not an array');
    }
    
    // Check custom codes
    if (data.customCodes && !Array.isArray(data.customCodes)) {
        issues.push('Custom codes data is not an array');
    }
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

// Initialize storage on load
document.addEventListener('DOMContentLoaded', initializeStorage);

console.log('✅ Storage Management Loaded');
