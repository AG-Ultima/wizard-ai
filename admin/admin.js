// admin.js - Wizard.AI Admin Dashboard
const API_BASE_URL = 'https://arnav0928.pythonanywhere.com';
let adminToken = null;
let refreshInterval = null;

// Check for existing admin session
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        adminToken = token;
        verifyAdminSession();
    }
});

// Login handler
document.getElementById('admin-login-btn').addEventListener('click', async () => {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');
    
    if (!username || !password) {
        errorEl.textContent = 'Please enter username and password';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            adminToken = data.token;
            localStorage.setItem('admin_token', adminToken);
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('dashboard-container').style.display = 'block';
            startDashboard();
            showNotification('✅ Admin access granted!', 'success');
        } else {
            errorEl.textContent = data.error || 'Invalid credentials';
        }
    } catch (error) {
        errorEl.textContent = 'Connection error';
    }
});

// Logout handler
document.getElementById('admin-logout-btn').addEventListener('click', async () => {
    localStorage.removeItem('admin_token');
    adminToken = null;
    if (refreshInterval) clearInterval(refreshInterval);
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('dashboard-container').style.display = 'none';
    showNotification('Logged out successfully', 'info');
});

async function verifyAdminSession() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/verify`, {
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('dashboard-container').style.display = 'block';
            startDashboard();
        } else {
            localStorage.removeItem('admin_token');
        }
    } catch (error) {
        localStorage.removeItem('admin_token');
    }
}

function startDashboard() {
    loadDashboardData();
    refreshInterval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    
    // Setup refresh buttons
    document.getElementById('refresh-logs').addEventListener('click', loadLogs);
    document.getElementById('refresh-users').addEventListener('click', loadUsers);
    document.getElementById('refresh-api').addEventListener('click', loadApiStats);
    document.getElementById('clear-logs').addEventListener('click', clearLogs);
    document.getElementById('backup-db').addEventListener('click', backupDatabase);
    document.getElementById('clear-cache').addEventListener('click', clearCache);
    document.getElementById('restart-server').addEventListener('click', restartServer);
    document.getElementById('maintenance-mode').addEventListener('click', toggleMaintenance);
}

async function loadDashboardData() {
    await Promise.all([
        loadStats(),
        loadLogs(),
        loadUsers(),
        loadApiStats(),
        loadServerStatus()
    ]);
}

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('stat-total-users').textContent = data.total_users || 0;
            document.getElementById('stat-total-messages').textContent = data.total_messages || 0;
            document.getElementById('stat-today-active').textContent = data.active_today || 0;
            document.getElementById('stat-api-keys').textContent = data.total_api_keys || 0;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

async function loadLogs() {
    const container = document.getElementById('logs-container');
    container.innerHTML = '<div class="loading">Loading logs...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/logs`, {
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const logs = data.logs || [];
            
            if (logs.length === 0) {
                container.innerHTML = '<div class="loading">No logs available</div>';
            } else {
                let html = '';
                logs.forEach(log => {
                    const levelClass = log.level || 'info';
                    html += `
                        <div class="log-entry">
                            <span class="log-time">${log.timestamp || '--:--'}</span>
                            <span class="log-level ${levelClass}">${levelClass.toUpperCase()}</span>
                            <span class="log-message">${escapeHtml(log.message)}</span>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }
        } else {
            container.innerHTML = '<div class="loading">Failed to load logs</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="loading">Error loading logs</div>';
    }
}

async function loadUsers() {
    const container = document.getElementById('users-container');
    container.innerHTML = '<div class="loading">Loading users...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const users = data.users || [];
            
            if (users.length === 0) {
                container.innerHTML = '<div class="loading">No users found</div>';
            } else {
                let html = '';
                users.forEach(user => {
                    html += `
                        <div class="user-item">
                            <div class="user-info">
                                <span class="user-email">${escapeHtml(user.email)}</span>
                                <span class="user-name">${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</span>
                            </div>
                            <div class="user-stats">
                                <span>💬 ${user.message_count || 0}</span>
                                <span>📅 ${new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }
        } else {
            container.innerHTML = '<div class="loading">Failed to load users</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="loading">Error loading users</div>';
    }
}

async function loadApiStats() {
    const container = document.getElementById('api-stats-container');
    container.innerHTML = '<div class="loading">Loading API stats...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/api-stats`, {
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const keys = data.api_keys || [];
            
            if (keys.length === 0) {
                container.innerHTML = '<div class="loading">No API keys generated yet</div>';
            } else {
                let html = '';
                keys.forEach(key => {
                    html += `
                        <div class="api-stat-item">
                            <div class="api-key-name">🔑 ${escapeHtml(key.name)}</div>
                            <div class="api-requests">📊 ${key.requests || 0} requests | Created: ${new Date(key.created_at).toLocaleDateString()}</div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }
        } else {
            container.innerHTML = '<div class="loading">Failed to load API stats</div>';
        }
    } catch (error) {
        container.innerHTML = '<div class="loading">Error loading API stats</div>';
    }
}

async function loadServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/server-status`, {
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('server-uptime').textContent = data.uptime || '--';
            document.getElementById('db-size').textContent = data.db_size || '--';
            document.getElementById('memory-usage').textContent = data.memory_usage || '--';
            document.getElementById('last-backup').textContent = data.last_backup || 'Never';
        }
    } catch (error) {
        console.error('Failed to load server status:', error);
    }
}

async function clearLogs() {
    if (!confirm('Are you sure you want to clear all logs? This cannot be undone.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/clear-logs`, {
            method: 'POST',
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            showNotification('✅ Logs cleared successfully', 'success');
            loadLogs();
        } else {
            showNotification('❌ Failed to clear logs', 'error');
        }
    } catch (error) {
        showNotification('❌ Error clearing logs', 'error');
    }
}

async function backupDatabase() {
    showNotification('📀 Starting database backup...', 'info');
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/backup`, {
            method: 'POST',
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification(`✅ Backup created: ${data.filename}`, 'success');
        } else {
            showNotification('❌ Backup failed', 'error');
        }
    } catch (error) {
        showNotification('❌ Backup failed', 'error');
    }
}

async function clearCache() {
    if (!confirm('Clear system cache? This may temporarily slow down responses.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/clear-cache`, {
            method: 'POST',
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            showNotification('✅ Cache cleared successfully', 'success');
        } else {
            showNotification('❌ Failed to clear cache', 'error');
        }
    } catch (error) {
        showNotification('❌ Error clearing cache', 'error');
    }
}

async function restartServer() {
    if (!confirm('⚠️ Restart server? This may cause a brief downtime.')) return;
    
    showNotification('🔄 Restarting server...', 'warning');
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/restart`, {
            method: 'POST',
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            showNotification('✅ Server restart initiated', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            showNotification('❌ Restart failed', 'error');
        }
    } catch (error) {
        showNotification('❌ Restart failed', 'error');
    }
}

async function toggleMaintenance() {
    if (!confirm('⚠️ Toggle maintenance mode? Users will see a maintenance page.')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/maintenance`, {
            method: 'POST',
            headers: { 'X-Admin-Token': adminToken },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification(data.message, 'info');
        } else {
            showNotification('❌ Failed to toggle maintenance mode', 'error');
        }
    } catch (error) {
        showNotification('❌ Error', 'error');
    }
}

function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    toast.textContent = message;
    toast.className = 'notification-toast show';
    if (type === 'success') toast.style.borderColor = '#10b981';
    if (type === 'error') toast.style.borderColor = '#ef4444';
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
