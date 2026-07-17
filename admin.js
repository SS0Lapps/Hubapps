/* ============================================
   ESAHUB - Admin Panel
   ============================================ */

/**
 * Admin Panel Functions
 */

// Admin credentials (simple - for demo only)
const ADMIN_PASSWORD = 'admin123';

/**
 * Verify admin access
 * @param {string} password - Admin password
 * @returns {boolean} Access granted
 */
function verifyAdminAccess(password) {
    return password === ADMIN_PASSWORD;
}

/**
 * Get admin session
 * @returns {object} Admin session data
 */
function getAdminSession() {
    return getStorageData('adminSession') || null;
}

/**
 * Set admin session
 * @param {object} sessionData - Session data
 */
function setAdminSession(sessionData) {
    setStorageData('adminSession', sessionData);
}

/**
 * Clear admin session
 */
function clearAdminSession() {
    removeStorageData('adminSession');
}

/**
 * Check if admin is logged in
 * @returns {boolean} Login status
 */
function isAdminLoggedIn() {
    const session = getAdminSession();
    if (!session) return false;
    
    // Check if session is expired (24 hours)
    const sessionTime = new Date(session.timestamp).getTime();
    const currentTime = new Date().getTime();
    const diffHours = (currentTime - sessionTime) / (1000 * 60 * 60);
    
    return diffHours < 24;
}

/**
 * Admin login
 * @param {string} password - Admin password
 * @returns {boolean} Login success
 */
function adminLogin(password) {
    if (verifyAdminAccess(password)) {
        setAdminSession({
            loggedIn: true,
            timestamp: new Date().toISOString(),
            loginCount: (getAdminSession()?.loginCount || 0) + 1
        });
        console.log('✅ Admin logged in');
        return true;
    }
    console.log('❌ Admin login failed');
    return false;
}

/**
 * Admin logout
 */
function adminLogout() {
    clearAdminSession();
    console.log('✅ Admin logged out');
}

/**
 * Get all admin logs
 * @returns {array} Admin logs
 */
function getAdminLogs() {
    return getStorageData('adminLogs') || [];
}

/**
 * Add admin log
 * @param {string} action - Action performed
 * @param {object} details - Action details
 */
function addAdminLog(action, details = {}) {
    const logs = getAdminLogs();
    logs.push({
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        adminSession: getAdminSession()?.timestamp
    });
    
    // Keep only last 1000 logs
    if (logs.length > 1000) {
        logs.shift();
    }
    
    setStorageData('adminLogs', logs);
}

/**
 * Get site settings
 * @returns {object} Site settings
 */
function getSiteSettings() {
    return getStorageData('siteSettings') || {
        siteName: 'Esahub',
        siteDescription: 'منصة احترافية للمشاريع والخدمات',
        primaryColor: '#22c55e',
        secondaryColor: '#10b981',
        maintenanceMode: false,
        analyticsEnabled: true
    };
}

/**
 * Update site settings
 * @param {object} settings - New settings
 */
function updateSiteSettings(settings) {
    const currentSettings = getSiteSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    setStorageData('siteSettings', updatedSettings);
    addAdminLog('update_settings', { settings: updatedSettings });
    console.log('✅ Settings updated');
}

/**
 * Get all custom CSS
 * @returns {string} Custom CSS
 */
function getCustomCSS() {
    return getStorageData('customCSS') || '';
}

/**
 * Update custom CSS
 * @param {string} css - Custom CSS code
 */
function updateCustomCSS(css) {
    setStorageData('customCSS', css);
    applyCustomCSS(css);
    addAdminLog('update_css', { cssLength: css.length });
    console.log('✅ Custom CSS updated');
}

/**
 * Apply custom CSS to page
 * @param {string} css - CSS code
 */
function applyCustomCSS(css) {
    // Remove existing custom style
    const existingStyle = document.getElementById('custom-style');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    // Add new custom style
    if (css.trim()) {
        const style = document.createElement('style');
        style.id = 'custom-style';
        style.textContent = css;
        document.head.appendChild(style);
    }
}

/**
 * Get all custom JavaScript
 * @returns {array} Custom scripts
 */
function getCustomScripts() {
    return getStorageData('customScripts') || [];
}

/**
 * Add custom JavaScript
 * @param {string} scriptCode - JavaScript code
 * @param {string} name - Script name
 */
function addCustomScript(scriptCode, name = 'Custom Script') {
    const scripts = getCustomScripts();
    const script = {
        id: Date.now(),
        name: name,
        code: scriptCode,
        enabled: true,
        createdAt: new Date().toISOString()
    };
    
    scripts.push(script);
    setStorageData('customScripts', scripts);
    addAdminLog('add_script', { scriptName: name });
    console.log('✅ Custom script added');
    
    return script.id;
}

/**
 * Execute custom script
 * @param {number} scriptId - Script ID
 */
function executeCustomScript(scriptId) {
    const scripts = getCustomScripts();
    const script = scripts.find(s => s.id === scriptId);
    
    if (script && script.enabled) {
        try {
            const func = new Function(script.code);
            func();
            addAdminLog('execute_script', { scriptId: scriptId });
            console.log('✅ Script executed');
        } catch (error) {
            console.error('Error executing script:', error);
            addAdminLog('script_error', { scriptId: scriptId, error: error.message });
        }
    }
}

/**
 * Execute all enabled custom scripts
 */
function executeAllCustomScripts() {
    const scripts = getCustomScripts();
    scripts.forEach(script => {
        if (script.enabled) {
            executeCustomScript(script.id);
        }
    });
}

/**
 * Remove custom script
 * @param {number} scriptId - Script ID
 */
function removeCustomScript(scriptId) {
    let scripts = getCustomScripts();
    scripts = scripts.filter(s => s.id !== scriptId);
    setStorageData('customScripts', scripts);
    addAdminLog('remove_script', { scriptId: scriptId });
    console.log('✅ Script removed');
}

/**
 * Toggle script enabled status
 * @param {number} scriptId - Script ID
 */
function toggleScriptStatus(scriptId) {
    const scripts = getCustomScripts();
    const script = scripts.find(s => s.id === scriptId);
    
    if (script) {
        script.enabled = !script.enabled;
        setStorageData('customScripts', scripts);
        addAdminLog('toggle_script', { scriptId: scriptId, enabled: script.enabled });
    }
}

/**
 * Get system information
 * @returns {object} System info
 */
function getSystemInfo() {
    const storage = getStorageUsage();
    const validation = validateStorage();
    
    return {
        storageUsage: storage,
        storageValid: validation.valid,
        storageIssues: validation.issues,
        totalProjects: (getStorageData('projects') || []).length,
        totalVisitors: (getStorageData('visitors') || []).length,
        totalEvents: (getTrackedEvents() || []).length,
        customScripts: getCustomScripts().length,
        adminLogs: getAdminLogs().length,
        timestamp: new Date().toISOString()
    };
}

/**
 * Get dashboard data
 * @returns {object} Dashboard data
 */
function getDashboardData() {
    const analytics = getAnalyticsSummary();
    const settings = getSiteSettings();
    const systemInfo = getSystemInfo();
    
    return {
        analytics: analytics,
        settings: settings,
        systemInfo: systemInfo,
        recentLogs: getAdminLogs().slice(-10).reverse()
    };
}

/**
 * Export admin data
 * @returns {object} All admin data
 */
function exportAdminData() {
    return {
        settings: getSiteSettings(),
        customCSS: getCustomCSS(),
        customScripts: getCustomScripts(),
        adminLogs: getAdminLogs(),
        exportDate: new Date().toISOString()
    };
}

/**
 * Import admin data
 * @param {object} data - Admin data to import
 */
function importAdminData(data) {
    if (data.settings) updateSiteSettings(data.settings);
    if (data.customCSS) updateCustomCSS(data.customCSS);
    if (data.customScripts) setStorageData('customScripts', data.customScripts);
    
    addAdminLog('import_data', { timestamp: data.exportDate });
    console.log('✅ Admin data imported');
}

/**
 * Reset all data to default
 */
function resetToDefault() {
    if (confirm('هل أنت متأكد؟ سيتم حذف جميع البيانات!')) {
        clearAllStorageData();
        initializeStorage();
        addAdminLog('reset_to_default', {});
        console.log('✅ All data reset to default');
        location.reload();
    }
}

/**
 * Create backup
 */
function createAdminBackup() {
    backupData();
    addAdminLog('create_backup', {});
    console.log('✅ Backup created');
}

/**
 * Get backup list
 * @returns {array} Backups
 */
function getBackupList() {
    return getBackups();
}

/**
 * Restore from backup
 * @param {number} index - Backup index
 */
function restoreFromBackup(index) {
    if (confirm('هل أنت متأكد من استعادة هذا النسخة الاحتياطية؟')) {
        if (restoreBackup(index)) {
            addAdminLog('restore_backup', { backupIndex: index });
            console.log('✅ Backup restored');
            location.reload();
        }
    }
}

/**
 * Send notification to all users (simulated)
 * @param {string} message - Notification message
 * @param {string} type - Notification type
 */
function sendNotification(message, type = 'info') {
    const notification = {
        message: message,
        type: type,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    const notifications = getStorageData('notifications') || [];
    notifications.push(notification);
    setStorageData('notifications', notifications);
    
    addAdminLog('send_notification', { message: message, type: type });
    console.log('✅ Notification sent');
}

/**
 * Get all notifications
 * @returns {array} Notifications
 */
function getNotifications() {
    return getStorageData('notifications') || [];
}

/**
 * Clear notifications
 */
function clearNotifications() {
    removeStorageData('notifications');
    addAdminLog('clear_notifications', {});
}

// Load custom CSS and scripts on page load
document.addEventListener('DOMContentLoaded', function() {
    const customCSS = getCustomCSS();
    if (customCSS) {
        applyCustomCSS(customCSS);
    }
    
    // Execute enabled custom scripts
    executeAllCustomScripts();
});

console.log('✅ Admin Panel Loaded');
