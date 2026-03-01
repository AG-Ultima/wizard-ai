// ============================================
// GLOBAL CONFIGURATION
// ============================================
const API_BASE_URL = 'https://Arnav0928.pythonanywhere.com';
// ============================================

// DOM Elements
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const messageCount = document.getElementById('message-count');
const currentModel = document.getElementById('current-model');
const responseTimeEl = document.getElementById('response-time');
const modelList = document.getElementById('model-list');
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');

// Dropdown Elements
const dropdown = document.getElementById('mode-dropdown');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');
const selectedDisplay = document.getElementById('selected-mode-display');

// Chat Sidebar Elements
const chatsList = document.getElementById('chats-list');
const newChatBtn = document.getElementById('new-chat-btn');
const currentChatName = document.getElementById('current-chat-name');
const currentChatEmoji = document.getElementById('current-chat-emoji');
const renameChatBtn = document.getElementById('rename-chat-btn');
const deleteChatBtn = document.getElementById('delete-chat-btn');
const resetCurrentBtn = document.getElementById('reset-current-btn');

// Auth Elements
const authModal = document.getElementById('auth-modal');
const authModalTitle = document.getElementById('auth-modal-title');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authConfirm = document.getElementById('auth-confirm');
const authConfirmGroup = document.getElementById('confirm-password-group');
const authError = document.getElementById('auth-error');
const authSubmit = document.getElementById('auth-submit');
const authSwitchBtn = document.getElementById('auth-switch-btn');
const authSwitchText = document.getElementById('auth-switch-text');
const showLoginBtn = document.getElementById('show-login-btn');
const showSignupBtn = document.getElementById('show-signup-btn');
const closeAuthModal = document.getElementById('close-auth-modal');
const userInfo = document.getElementById('user-info');
const authButtons = document.getElementById('auth-buttons');
const userEmail = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const saveCloudBtn = document.getElementById('save-cloud-btn');
const loadCloudBtn = document.getElementById('load-cloud-btn');

// Rename Modal
const renameModal = document.getElementById('rename-modal');
const renameInput = document.getElementById('rename-input');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');

// State
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;
let tooltipEl = null;
let tooltipTimeout = null;
let currentUser = null;

// Multi-Chat State
let chats = {};
let chatIds = ['default'];
let activeChatId = 'default';
let chatToRename = null;

// Auth State
let isLoginMode = true;

// ============================================
// MODE DATA - With Hidden WIZARD Mode
// ============================================
const modeData = {
    'WIZARD': {
        emoji: '🧙',
        name: 'The Wizard',
        desc: 'The mystical guide who welcomes you to Wizard.AI',
        model: 'System Message',
        modelSpeed: 'MAGIC',
        color: '#c4b5fd',
        hidden: true
    },
    'Fast': {
        emoji: '⚡',
        name: 'Fast Mode',
        desc: 'Lightning quick responses for when you need speed. Perfect for casual chat and quick answers.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'Normal': {
        emoji: '✨',
        name: 'Normal Mode',
        desc: 'Balanced, friendly conversation. Your go-to for everyday chat and general questions.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'Fun': {
        emoji: '🎉',
        name: 'Fun Mode',
        desc: 'Playful and energetic! Tells jokes, uses emojis, and keeps things light and entertaining.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6',
        hidden: false
    },
    'Sarcastic': {
        emoji: '😏',
        name: 'Sarcastic Mode',
        desc: 'Witty and slightly sassy, but still helpful. Adds playful sarcasm to responses.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'Nerd': {
        emoji: '🧠',
        name: 'Nerd Mode',
        desc: 'Detailed, factual, and academic. Shares interesting facts and explains things thoroughly.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6',
        hidden: false
    },
    'JARVIS': {
        emoji: '🎩',
        name: 'JARVIS Mode',
        desc: 'Sophisticated and precise, like Tony Stark\'s AI. Professional, polite, and highly capable.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'ORACLE': {
        emoji: '🔮',
        name: 'ORACLE Mode',
        desc: 'Mystical and all-knowing. Speaks in riddles and metaphors with profound wisdom.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6',
        hidden: false
    }
};

// Mode greetings
const modeGreetings = {
    'Fast': '⚡ Fast mode on! Getting quick responses...',
    'Normal': '✨ Ready to chat!',
    'Fun': '🎉 Fun mode activated! Let\'s keep it light!',
    'Sarcastic': '😏 Sarcasm engine engaged... just kidding! Ready!',
    'Nerd': '🤓 Nerd mode! Time to get smart!',
    'JARVIS': '🎩 JARVIS at your service. How may I help?',
    'ORACLE': '🔮 The Oracle awakens... I see infinite possibilities in your words.'
};

// ============================================
// WIZARD MESSAGE FUNCTION - ALWAYS USES 🧙
// ============================================
function addWizardMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message wizard';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.textContent = '🧙'; // ALWAYS wizard emoji for system messages
    
    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    textSpan.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const now = new Date();
    timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contentDiv.appendChild(iconSpan);
    contentDiv.appendChild(textSpan);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    return messageDiv;
}

// ============================================
// AUTH FUNCTIONS
// ============================================

async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/check-auth`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateUIForAuth();
            loadUserChats();
        } else {
            updateUIForAuth();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUIForAuth();
    }
}

function updateUIForAuth() {
    if (currentUser) {
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
        userEmail.textContent = currentUser.email;
        if (saveCloudBtn) saveCloudBtn.style.display = 'block';
        if (loadCloudBtn) loadCloudBtn.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
        if (saveCloudBtn) saveCloudBtn.style.display = 'none';
        if (loadCloudBtn) loadCloudBtn.style.display = 'none';
    }
}

function showAuthModal(loginMode = true) {
    isLoginMode = loginMode;
    authModalTitle.textContent = loginMode ? 'Login to Wizard.AI' : 'Create Wizard.AI Account';
    authSubmit.textContent = loginMode ? 'Login' : 'Sign Up';
    authSwitchText.textContent = loginMode ? "Don't have an account?" : "Already have an account?";
    authSwitchBtn.textContent = loginMode ? 'Sign Up' : 'Login';
    authConfirmGroup.style.display = loginMode ? 'none' : 'block';
    authEmail.value = '';
    authPassword.value = '';
    authConfirm.value = '';
    authError.textContent = '';
    authModal.classList.add('show');
}

async function handleLogin() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    
    if (!email || !password) {
        authError.textContent = 'Please enter email and password';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authModal.classList.remove('show');
            updateUIForAuth();
            loadUserChats();
            addWizardMessage(`✨ Welcome back, ${currentUser.email}!`);
        } else {
            authError.textContent = data.error || 'Login failed';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
        console.error(error);
    }
}

async function handleSignup() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    const confirm = authConfirm.value.trim();
    
    if (!email || !password || !confirm) {
        authError.textContent = 'Please fill all fields';
        return;
    }
    
    if (password !== confirm) {
        authError.textContent = 'Passwords do not match';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authModal.classList.remove('show');
            updateUIForAuth();
            initializeNewUserChats();
            addWizardMessage(`✨ Welcome to Wizard.AI, ${currentUser.email}!`);
        } else {
            authError.textContent = data.error || 'Signup failed';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
        console.error(error);
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    currentUser = null;
    updateUIForAuth();
    initializeLocalChats();
    addWizardMessage('👋 You have been logged out.');
}

// ============================================
// CHAT FUNCTIONS
// ============================================

function initializeLocalChats() {
    const defaultChat = {
        chat_id: 'default',
        name: 'Main Chat',
        emoji: '🧙',
        mode: 'JARVIS',
        messages: []
    };
    
    chats = { 'default': defaultChat };
    chatIds = ['default'];
    activeChatId = 'default';
    currentMode = 'JARVIS';
    
    renderChatsList();
    updateModeDisplay();
    clearChatDisplay();
    addWizardMessage('✨ Welcome to Wizard.AI! Select a mode from the dropdown and start your magical journey!');
}

function initializeNewUserChats() {
    const defaultChat = {
        chat_id: 'default',
        name: 'Main Chat',
        emoji: '🧙',
        mode: 'JARVIS',
        messages: []
    };
    
    chats = { 'default': defaultChat };
    chatIds = ['default'];
    activeChatId = 'default';
    currentMode = 'JARVIS';
    
    renderChatsList();
    updateModeDisplay();
    clearChatDisplay();
    addWizardMessage('✨ Welcome to Wizard.AI! Select a mode from the dropdown and start your magical journey!');
    saveUserChats();
}

async function loadUserChats() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chats`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.chats && data.chats.length > 0) {
                // Rebuild chats object
                chats = {};
                chatIds = [];
                
                data.chats.forEach(chat => {
                    chats[chat.chat_id] = chat;
                    chatIds.push(chat.chat_id);
                });
                
                activeChatId = chatIds[0];
                currentMode = chats[activeChatId].mode || 'JARVIS';
                
                renderChatsList();
                updateModeDisplay();
                loadActiveChatMessages();
            } else {
                initializeNewUserChats();
            }
        } else {
            initializeNewUserChats();
        }
    } catch (error) {
        console.error('Failed to load chats:', error);
        initializeNewUserChats();
    }
}

async function saveUserChats() {
    if (!currentUser) return;
    
    const chatsArray = chatIds.map(id => chats[id]);
    
    try {
        await fetch(`${API_BASE_URL}/api/save-chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chats: chatsArray }),
            credentials: 'include'
        });
    } catch (error) {
        console.error('Failed to save chats:', error);
    }
}

function clearChatDisplay() {
    chatHistory.innerHTML = '';
    messages = [];
    updateMessageCount();
}

function loadActiveChatMessages() {
    chatHistory.innerHTML = '';
    
    if (chats[activeChatId] && chats[activeChatId].messages) {
        messages = [...chats[activeChatId].messages];
        
        messages.forEach(msg => {
            if (msg.sender === 'user') {
                renderUserMessage(msg.text);
            } else {
                renderWizardMessage(msg.text, msg.mode);
            }
        });
        
        chatHistory.scrollTop = chatHistory.scrollHeight;
        updateMessageCount();
    } else {
        // No messages, show welcome message
        addWizardMessage(`✨ Welcome to ${chats[activeChatId].name}! Select a mode to begin.`);
    }
}

function renderUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.textContent = '👤';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    textSpan.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const now = new Date();
    timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contentDiv.appendChild(iconSpan);
    contentDiv.appendChild(textSpan);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    
    chatHistory.appendChild(messageDiv);
}

function renderWizardMessage(text, mode = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message wizard';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    
    // Use mode emoji if provided, otherwise use wizard
    if (mode && modeData[mode]) {
        iconSpan.textContent = modeData[mode].emoji;
    } else {
        iconSpan.textContent = '🧙';
    }
    
    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    textSpan.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const now = new Date();
    timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contentDiv.appendChild(iconSpan);
    contentDiv.appendChild(textSpan);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    
    chatHistory.appendChild(messageDiv);
}

function renderChatsList() {
    if (!chatsList) return;
    
    chatsList.innerHTML = '';
    
    chatIds.forEach(chatId => {
        const chat = chats[chatId];
        if (!chat) return;
        
        // Format time
        const lastActive = chat.updated_at ? new Date(chat.updated_at) : new Date();
        const now = new Date();
        const diffMs = now - lastActive;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        let timeStr = 'now';
        if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins}m`;
        if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours}h`;
        if (diffDays > 0) timeStr = `${diffDays}d`;
        
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${chatId === activeChatId ? 'active' : ''}`;
        chatItem.dataset.chatId = chatId;
        
        chatItem.innerHTML = `
            <span class="chat-emoji">${chat.emoji || '💬'}</span>
            <span class="chat-name">${chat.name}</span>
            <div class="chat-item-actions">
                <button class="rename-chat-item" data-chat-id="${chatId}" title="Rename">✏️</button>
                <button class="delete-chat-item" data-chat-id="${chatId}" title="Delete">🗑️</button>
            </div>
            <span class="chat-time">${timeStr}</span>
        `;
        
        chatItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('rename-chat-item') || 
                e.target.classList.contains('delete-chat-item')) {
                return;
            }
            switchChat(chatId);
        });
        
        const renameBtn = chatItem.querySelector('.rename-chat-item');
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openRenameModal(chatId);
        });
        
        const deleteBtn = chatItem.querySelector('.delete-chat-item');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(chatId);
        });
        
        chatsList.appendChild(chatItem);
    });
    
    if (currentChatName && chats[activeChatId]) {
        currentChatName.textContent = chats[activeChatId].name;
    }
    if (currentChatEmoji && chats[activeChatId]) {
        currentChatEmoji.textContent = chats[activeChatId].emoji || '🧙';
    }
}

function switchChat(chatId) {
    if (!chats[chatId]) return;
    
    // Save current chat
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [...messages];
        chats[activeChatId].mode = currentMode;
        chats[activeChatId].updated_at = new Date().toISOString();
    }
    
    // Switch to new chat
    activeChatId = chatId;
    const newChat = chats[activeChatId];
    newChat.updated_at = new Date().toISOString();
    
    // Load new chat's mode
    currentMode = newChat.mode || 'JARVIS';
    
    // Update UI
    updateModeDisplay();
    loadActiveChatMessages();
    renderChatsList();
    
    if (currentUser) {
        saveUserChats();
    }
}

function createNewChat() {
    const chatNumber = chatIds.length + 1;
    const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    const emojis = ['💬', '🤖', '🌟', '⭐', '✨', '🎯', '🎲', '🎮', '📚', '🎨'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const newChat = {
        chat_id: chatId,
        name: `Chat ${chatNumber}`,
        emoji: randomEmoji,
        mode: 'JARVIS',
        messages: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    chats[chatId] = newChat;
    chatIds.push(chatId);
    
    switchChat(chatId);
    
    if (currentUser) {
        saveUserChats();
    }
}

function deleteChat(chatId) {
    if (chatIds.length <= 1) {
        alert('Cannot delete the last chat');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${chats[chatId].name}"?`)) {
        return;
    }
    
    const currentIndex = chatIds.indexOf(chatId);
    
    delete chats[chatId];
    chatIds = chatIds.filter(id => id !== chatId);
    
    if (chatId === activeChatId) {
        const newIndex = Math.min(currentIndex, chatIds.length - 1);
        switchChat(chatIds[newIndex]);
    }
    
    renderChatsList();
    
    if (currentUser) {
        saveUserChats();
    }
}

function renameChat(chatId, newName) {
    if (!newName.trim()) return;
    
    const chat = chats[chatId];
    if (!chat) return;
    
    chat.name = newName.trim();
    chat.updated_at = new Date().toISOString();
    
    if (chatId === activeChatId && currentChatName) {
        currentChatName.textContent = chat.name;
    }
    
    renderChatsList();
    
    if (currentUser) {
        saveUserChats();
    }
}

function openRenameModal(chatId) {
    chatToRename = chatId;
    const chat = chats[chatId];
    if (!chat) return;
    
    renameInput.value = chat.name;
    renameModal.classList.add('show');
    renameInput.focus();
    renameInput.select();
}

function resetCurrentChat() {
    if (!confirm('Clear all messages in this chat?')) return;
    
    messages = [];
    chatHistory.innerHTML = '';
    
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [];
        chats[activeChatId].updated_at = new Date().toISOString();
    }
    
    updateMessageCount();
    addWizardMessage(`🧹 Chat cleared! Ready for new messages.`);
    
    if (currentUser) {
        saveUserChats();
    }
}

function updateMessageCount() {
    if (messageCount) {
        messageCount.textContent = messages.length;
    }
}

// ============================================
// MODE FUNCTIONS
// ============================================

function updateModeDisplay() {
    const mode = modeData[currentMode] || modeData['JARVIS'];
    if (selectedDisplay) {
        selectedDisplay.innerHTML = `${mode.emoji} ${currentMode}`;
    }
    
    document.querySelectorAll('.dropdown-item').forEach(el => {
        const itemMode = el.getAttribute('data-mode');
        if (itemMode === currentMode) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
    
    updateModelInfo();
}

function updateModelInfo() {
    const mode = modeData[currentMode] || { emoji: '✨', model: 'Loading...' };
    if (currentModel) {
        currentModel.innerHTML = `${mode.emoji} ${mode.model}`;
    }
}

// ============================================
// DROPDOWN SETUP
// ============================================

function setupDropdown() {
    if (!dropdown || !dropdownContent) return;
    
    dropdownContent.innerHTML = '';
    
    Object.keys(modeData).forEach(modeKey => {
        const mode = modeData[modeKey];
        if (mode.hidden) return; // Skip hidden WIZARD mode
        
        const item = document.createElement('div');
        item.className = `dropdown-item ${modeKey === currentMode ? 'selected' : ''}`;
        item.setAttribute('data-mode', modeKey);
        
        item.innerHTML = `
            <span style="font-size: 18px;">${mode.emoji}</span>
            <span>${modeKey}</span>
        `;
        
        item.addEventListener('mouseenter', (e) => showTooltip(modeKey, e));
        item.addEventListener('mousemove', (e) => updateTooltipPosition(e));
        item.addEventListener('mouseleave', hideTooltip);
        
        item.addEventListener('click', () => {
            currentMode = modeKey;
            updateModeDisplay();
            dropdown.classList.remove('open');
            hideTooltip();
            
            if (chats[activeChatId]) {
                chats[activeChatId].mode = currentMode;
                chats[activeChatId].updated_at = new Date().toISOString();
            }
            
            addWizardMessage(`🔄 Switched to ${modeKey} mode! ${modeGreetings[modeKey] || ''}`);
            
            if (currentUser) {
                saveUserChats();
            }
        });
        
        dropdownContent.appendChild(item);
    });
    
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    updateModeDisplay();
}

// ============================================
// TOOLTIP FUNCTIONS
// ============================================

function createTooltip() {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'mode-tooltip';
    tooltipEl.className = 'mode-tooltip';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);
}

function showTooltip(modeKey, event) {
    if (!tooltipEl) return;
    
    const mode = modeData[modeKey];
    if (!mode) return;
    
    clearTimeout(tooltipTimeout);
    
    tooltipEl.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 12px;">
            <div style="font-size: 32px; line-height: 1;">${mode.emoji}</div>
            <div style="flex: 1;">
                <div style="font-weight: bold; color: #c4b5fd; font-size: 16px; margin-bottom: 5px;">${mode.name}</div>
                <div style="color: #e0e7ff; font-size: 13px; line-height: 1.5; margin-bottom: 10px;">${mode.desc}</div>
                <div style="display: flex; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(139, 92, 246, 0.3);">
                    <span style="color: #9ca3af; font-size: 12px;">🧠 ${mode.model}</span>
                    <span style="background: ${mode.color}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: bold;">${mode.modelSpeed}</span>
                </div>
            </div>
        </div>
    `;
    
    positionTooltip(event);
    tooltipEl.style.display = 'block';
}

function updateTooltipPosition(event) {
    if (tooltipEl && tooltipEl.style.display === 'block') {
        positionTooltip(event);
    }
}

function positionTooltip(event) {
    const x = event.clientX + 15;
    const y = event.clientY - 20;
    
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const maxX = window.innerWidth - tooltipRect.width - 10;
    const maxY = window.innerHeight - tooltipRect.height - 10;
    
    tooltipEl.style.left = Math.min(x, maxX) + 'px';
    tooltipEl.style.top = Math.max(10, Math.min(y, maxY)) + 'px';
}

function hideTooltip() {
    clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(() => {
        if (tooltipEl) {
            tooltipEl.style.display = 'none';
        }
    }, 200);
}

// ============================================
// TYPING EFFECT
// ============================================

async function typeMessage(messageDiv, textSpan, fullText, baseSpeed = 20) {
    return new Promise((resolve) => {
        let i = 0;
        messageDiv.classList.add('typing-active');
        
        const textLength = fullText.length;
        let speed = baseSpeed;
        
        if (textLength > 2000) speed = 5;
        else if (textLength > 1000) speed = 8;
        else if (textLength > 500) speed = 12;
        else if (textLength > 200) speed = 15;
        
        if (turboMode) {
            speed = Math.max(3, speed / 2);
        }
        
        const typing = setInterval(() => {
            if (i < fullText.length) {
                textSpan.textContent += fullText.charAt(i);
                i++;
                chatHistory.scrollTop = chatHistory.scrollHeight;
            } else {
                clearInterval(typing);
                messageDiv.classList.remove('typing-active');
                resolve();
            }
        }, speed);
    });
}

// ============================================
// SEND MESSAGE
// ============================================

async function sendMessage() {
    if (isThinking) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    // Add user message
    renderUserMessage(text);
    messages.push({ sender: 'user', text });
    chatInput.value = '';
    updateMessageCount();
    
    // Save to chat
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [...messages];
        chats[activeChatId].updated_at = new Date().toISOString();
    }
    
    if (currentUser) {
        saveUserChats();
    }
    
    isThinking = true;
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    
    // Show thinking indicator (using wizard emoji)
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message wizard thinking';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.textContent = '⏳';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    textSpan.textContent = '✨';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    const now = new Date();
    timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contentDiv.appendChild(iconSpan);
    contentDiv.appendChild(textSpan);
    thinkingDiv.appendChild(contentDiv);
    thinkingDiv.appendChild(timeSpan);
    
    chatHistory.appendChild(thinkingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: text,
                mode: currentMode,
                turbo: turboMode
            })
        });
        
        const data = await response.json();
        const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}s`;
        }
        
        // Remove thinking indicator
        thinkingDiv.remove();
        
        // Create wizard response with current mode emoji
        const mode = modeData[currentMode] || { emoji: '🧙' };
        
        const wizardMsgDiv = document.createElement('div');
        wizardMsgDiv.className = 'message wizard';
        
        const respContentDiv = document.createElement('div');
        respContentDiv.className = 'message-content';
        
        const respIconSpan = document.createElement('span');
        respIconSpan.className = 'message-icon';
        respIconSpan.textContent = mode.emoji;
        
        const respTextSpan = document.createElement('span');
        respTextSpan.className = 'message-text';
        respTextSpan.textContent = '';
        
        const respTimeSpan = document.createElement('span');
        respTimeSpan.className = 'message-time';
        const respNow = new Date();
        respTimeSpan.textContent = respNow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        respContentDiv.appendChild(respIconSpan);
        respContentDiv.appendChild(respTextSpan);
        wizardMsgDiv.appendChild(respContentDiv);
        wizardMsgDiv.appendChild(respTimeSpan);
        
        chatHistory.appendChild(wizardMsgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Type response
        let baseSpeed = 20;
        if (currentMode === 'Fast') baseSpeed = 12;
        else if (currentMode === 'Nerd' || currentMode === 'ORACLE') baseSpeed = 25;
        
        await typeMessage(wizardMsgDiv, respTextSpan, data.reply, baseSpeed);
        
        // Save message with mode
        messages.push({ 
            sender: 'wizard', 
            text: data.reply,
            mode: currentMode
        });
        
        updateMessageCount();
        
        // Save to chat
        if (chats[activeChatId]) {
            chats[activeChatId].messages = [...messages];
            chats[activeChatId].updated_at = new Date().toISOString();
        }
        
        if (currentUser) {
            saveUserChats();
        }
        
    } catch (error) {
        console.error('Chat error:', error);
        thinkingDiv.remove();
        addWizardMessage('⚠️ Connection error! Please try again.');
    } finally {
        isThinking = false;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        chatInput.focus();
    }
}

// ============================================
// TURBO MODE TOGGLE
// ============================================

function addTurboToggle() {
    const container = document.getElementById('turbo-toggle-container');
    if (!container) return;
    
    const turboDiv = document.createElement('div');
    turboDiv.className = 'mode-selector';
    turboDiv.innerHTML = `
        <h3 style="color: #c4b5fd; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
            <span>⚡</span> TURBO MODE
        </h3>
        <button id="turbo-btn" style="width: 100%; padding: 10px; background: #4b5563; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>🔴</span> TURBO OFF
        </button>
        <p style="color: #9ca3af; font-size: 11px; margin-top: 8px; text-align: center;">
            ⚡ Makes responses faster while keeping the same personality!
        </p>
    `;
    
    container.appendChild(turboDiv);
    
    const turboBtn = document.getElementById('turbo-btn');
    if (turboBtn) {
        turboBtn.addEventListener('click', () => {
            turboMode = !turboMode;
            
            if (turboMode) {
                turboBtn.style.background = '#ef4444';
                turboBtn.innerHTML = '<span>⚡</span> TURBO ON';
                addWizardMessage('⚡ Turbo mode activated - faster responses, same personality!');
            } else {
                turboBtn.style.background = '#4b5563';
                turboBtn.innerHTML = '<span>🔴</span> TURBO OFF';
                addWizardMessage('✨ Turbo mode deactivated.');
            }
        });
    }
}

// ============================================
// BACKEND STATUS
// ============================================

async function checkSystemStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        
        if (response.ok) {
            const data = await response.json();
            updateConnectionStatus('connected');
            
            if (modelList) {
                modelList.innerHTML = `
                    <div class="model-item">
                        <div class="model-name">
                            <span>⚡</span>
                            <span>Llama 3.1 8B</span>
                            <span class="model-badge" style="background:#10b981;">FAST</span>
                        </div>
                        <span class="model-status-badge">✅</span>
                    </div>
                    <div class="model-item">
                        <div class="model-name">
                            <span>🧠</span>
                            <span>Llama 3.3 70B</span>
                            <span class="model-badge" style="background:#8b5cf6;">POWERFUL</span>
                        </div>
                        <span class="model-status-badge">✅</span>
                    </div>
                `;
            }
        } else {
            updateConnectionStatus('offline');
        }
    } catch (error) {
        console.error('Status check failed:', error);
        updateConnectionStatus('offline');
    }
}

function updateConnectionStatus(status) {
    if (!statusText || !statusDot) return;
    
    if (status === 'connected') {
        statusText.textContent = 'Connected';
        statusDot.classList.remove('offline');
    } else if (status === 'connecting') {
        statusText.textContent = 'Connecting...';
        statusDot.classList.add('offline');
    } else {
        statusText.textContent = 'Offline';
        statusDot.classList.add('offline');
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    console.log('🚀 Initializing Wizard.AI...');
    console.log('🔗 Backend URL:', API_BASE_URL);
    
    createTooltip();
    updateConnectionStatus('connecting');
    
    // Check auth status
    await checkAuth();
    
    // If not logged in, initialize local chats
    if (!currentUser) {
        initializeLocalChats();
    }
    
    await checkSystemStatus();
    setupDropdown();
    setupEventListeners();
    addTurboToggle();
}

function setupEventListeners() {
    sendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewChat);
    }
    
    if (renameChatBtn) {
        renameChatBtn.addEventListener('click', () => {
            openRenameModal(activeChatId);
        });
    }
    
    if (deleteChatBtn) {
        deleteChatBtn.addEventListener('click', () => {
            deleteChat(activeChatId);
        });
    }
    
    if (resetCurrentBtn) {
        resetCurrentBtn.addEventListener('click', resetCurrentChat);
    }
    
    // Auth event listeners
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => showAuthModal(true));
    }
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => showAuthModal(false));
    }
    
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.remove('show');
        });
    }
    
    if (authSwitchBtn) {
        authSwitchBtn.addEventListener('click', () => {
            showAuthModal(!isLoginMode);
        });
    }
    
    if (authSubmit) {
        authSubmit.addEventListener('click', () => {
            if (isLoginMode) {
                handleLogin();
            } else {
                handleSignup();
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (saveCloudBtn) {
        saveCloudBtn.addEventListener('click', () => {
            saveUserChats();
            addWizardMessage('☁️ Chats saved to cloud!');
        });
    }
    
    if (loadCloudBtn) {
        loadCloudBtn.addEventListener('click', async () => {
            await loadUserChats();
            addWizardMessage('☁️ Chats loaded from cloud!');
        });
    }
    
    // Rename modal
    if (modalSave) {
        modalSave.addEventListener('click', () => {
            if (chatToRename) {
                renameChat(chatToRename, renameInput.value);
                renameModal.classList.remove('show');
                chatToRename = null;
            }
        });
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', () => {
            renameModal.classList.remove('show');
            chatToRename = null;
        });
    }
    
    if (renameInput) {
        renameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modalSave.click();
            }
        });
    }
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.remove('show');
        }
        if (e.target === renameModal) {
            renameModal.classList.remove('show');
            chatToRename = null;
        }
    });
}

// Emergency reset
document.addEventListener('keydown', (e) => {
    if (e.key === 'F2') {
        console.log('🔧 Emergency reset triggered');
        isThinking = false;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        chatInput.focus();
        addWizardMessage('🔧 Emergency reset - you can type again!');
    }
});

// Hide tooltip when scrolling
window.addEventListener('scroll', () => {
    if (tooltipEl) {
        tooltipEl.style.display = 'none';
    }
});

// Start the app
document.addEventListener('DOMContentLoaded', init);
