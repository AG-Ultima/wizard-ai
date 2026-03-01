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

// Modal Elements
const renameModal = document.getElementById('rename-modal');
const renameInput = document.getElementById('rename-input');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');

// Generate unique session ID
const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

// State
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;
let tooltipEl = null;
let tooltipTimeout = null;

// Multi-Chat State
let chats = {};
let chatIds = ['default'];
let activeChatId = 'default';
let chatToRename = null;

// Mode data with descriptions and tooltips
const modeData = {
    'Fast': {
        emoji: '⚡',
        name: 'Fast Mode',
        desc: 'Lightning quick responses for when you need speed. Perfect for casual chat and quick answers.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981'
    },
    'Normal': {
        emoji: '✨',
        name: 'Normal Mode',
        desc: 'Balanced, friendly conversation. Your go-to for everyday chat and general questions.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981'
    },
    'Fun': {
        emoji: '🎉',
        name: 'Fun Mode',
        desc: 'Playful and energetic! Tells jokes, uses emojis, and keeps things light and entertaining.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6'
    },
    'Sarcastic': {
        emoji: '😏',
        name: 'Sarcastic Mode',
        desc: 'Witty and slightly sassy, but still helpful. Adds playful sarcasm to responses.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981'
    },
    'Nerd': {
        emoji: '🧠',
        name: 'Nerd Mode',
        desc: 'Detailed, factual, and academic. Shares interesting facts and explains things thoroughly.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6'
    },
    'JARVIS': {
        emoji: '🎩',
        name: 'JARVIS Mode',
        desc: 'Sophisticated and precise, like Tony Stark\'s AI. Professional, polite, and highly capable.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981'
    },
    'ORACLE': {
        emoji: '🔮',
        name: 'ORACLE Mode',
        desc: 'Mystical and all-knowing. Speaks in riddles and metaphors with profound wisdom.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6'
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

// Initialize
async function init() {
    console.log('🚀 Initializing Wizard.AI...');
    console.log('🔗 Backend URL:', API_BASE_URL);
    
    createTooltip();
    initializeChats();
    updateConnectionStatus('connecting');
    await loadModes();
    await checkSystemStatus();
    setupDropdown();
    setupEventListeners();
    addTurboToggle();
    setupModal();
    loadActiveChat();
    
    // Add welcome message only if chat is empty
    if (messages.length === 0) {
        addMessage('wizard', `✨ Welcome to ${chats[activeChatId].name}! Select a mode and start chatting!`, false, true);
    }
}

// Initialize chats from localStorage
function initializeChats() {
    const savedChats = localStorage.getItem('wizardChats');
    const savedChatIds = localStorage.getItem('wizardChatIds');
    const savedActiveChat = localStorage.getItem('wizardActiveChat');
    
    if (savedChats && savedChatIds) {
        chats = JSON.parse(savedChats);
        chatIds = JSON.parse(savedChatIds);
        activeChatId = savedActiveChat || 'default';
        
        // Ensure all chats have a mode property (for backward compatibility)
        Object.keys(chats).forEach(chatId => {
            if (!chats[chatId].mode) {
                chats[chatId].mode = 'JARVIS';
            }
        });
    } else {
        // Create default chat with mode
        const defaultChat = {
            id: 'default',
            name: 'Main Chat',
            messages: [],
            emoji: '🧙',
            mode: 'JARVIS',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        chats = { 'default': defaultChat };
        chatIds = ['default'];
        activeChatId = 'default';
    }
    
    // Set current mode from active chat
    if (chats[activeChatId] && chats[activeChatId].mode) {
        currentMode = chats[activeChatId].mode;
    }
    
    renderChatsList();
    updateModeDisplay();
}

// Save chats to localStorage
function saveChats() {
    // Make sure current chat's mode is saved
    if (chats[activeChatId]) {
        chats[activeChatId].mode = currentMode;
        chats[activeChatId].lastActive = new Date().toISOString();
    }
    
    localStorage.setItem('wizardChats', JSON.stringify(chats));
    localStorage.setItem('wizardChatIds', JSON.stringify(chatIds));
    localStorage.setItem('wizardActiveChat', activeChatId);
}

// Render chats list in sidebar
function renderChatsList() {
    if (!chatsList) return;
    
    chatsList.innerHTML = '';
    
    chatIds.forEach(chatId => {
        const chat = chats[chatId];
        if (!chat) return;
        
        // Format time
        const lastActive = new Date(chat.lastActive);
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
            // Don't switch if clicking on buttons
            if (e.target.classList.contains('rename-chat-item') || 
                e.target.classList.contains('delete-chat-item')) {
                return;
            }
            switchChat(chatId);
        });
        
        // Rename button in chat item
        const renameBtn = chatItem.querySelector('.rename-chat-item');
        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openRenameModal(chatId);
        });
        
        // Delete button in chat item
        const deleteBtn = chatItem.querySelector('.delete-chat-item');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(chatId);
        });
        
        chatsList.appendChild(chatItem);
    });
    
    // Update current chat display
    if (currentChatName && chats[activeChatId]) {
        currentChatName.textContent = chats[activeChatId].name;
    }
    if (currentChatEmoji && chats[activeChatId]) {
        currentChatEmoji.textContent = chats[activeChatId].emoji || '🧙';
    }
}

// Switch to a different chat
function switchChat(chatId) {
    if (!chats[chatId]) return;
    
    // Save current chat messages AND mode
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [...messages];
        chats[activeChatId].mode = currentMode;
        chats[activeChatId].lastActive = new Date().toISOString();
    }
    
    // Switch to new chat
    activeChatId = chatId;
    const newChat = chats[activeChatId];
    newChat.lastActive = new Date().toISOString();
    
    // Load new chat's mode
    currentMode = newChat.mode || 'JARVIS';
    
    // Load messages from new chat
    messages = newChat.messages ? [...newChat.messages] : [];
    
    // Update UI to reflect new mode
    updateModeDisplay();
    
    // Clear and rebuild chat history
    chatHistory.innerHTML = '';
    
    // Re-render all messages
    if (messages.length > 0) {
        messages.forEach(msg => {
            // Use the stored mode for wizard messages
            const wizardMsgDiv = document.createElement('div');
            wizardMsgDiv.className = `message wizard`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'message-icon';
            // For old messages, we don't know which mode, so use default
            iconSpan.textContent = msg.sender === 'wizard' ? '🧙' : '👤';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'message-text';
            textSpan.textContent = msg.text;
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'message-time';
            // We don't store time, so use current time
            const now = new Date();
            timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            contentDiv.appendChild(iconSpan);
            contentDiv.appendChild(textSpan);
            wizardMsgDiv.appendChild(contentDiv);
            wizardMsgDiv.appendChild(timeSpan);
            
            chatHistory.appendChild(wizardMsgDiv);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // Update UI
    renderChatsList();
    updateMessageCount();
    saveChats();
}

// Create new chat
function createNewChat() {
    const chatNumber = chatIds.length + 1;
    const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    // Random emoji for new chat
    const emojis = ['💬', '🤖', '🌟', '⭐', '✨', '🎯', '🎲', '🎮', '📚', '🎨'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const newChat = {
        id: chatId,
        name: `Chat ${chatNumber}`,
        messages: [],
        emoji: randomEmoji,
        mode: 'JARVIS',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
    };
    
    chats[chatId] = newChat;
    chatIds.push(chatId);
    
    // Switch to new chat
    switchChat(chatId);
    
    saveChats();
}

// Delete a chat
function deleteChat(chatId) {
    if (chatIds.length <= 1) {
        alert('Cannot delete the last chat');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${chats[chatId].name}"?`)) {
        return;
    }
    
    const currentIndex = chatIds.indexOf(chatId);
    
    // Remove from chats
    delete chats[chatId];
    chatIds = chatIds.filter(id => id !== chatId);
    
    // Switch to another chat
    if (chatId === activeChatId) {
        const newIndex = Math.min(currentIndex, chatIds.length - 1);
        switchChat(chatIds[newIndex]);
    }
    
    saveChats();
    renderChatsList();
}

// Open rename modal
function openRenameModal(chatId) {
    chatToRename = chatId;
    const chat = chats[chatId];
    if (!chat) return;
    
    renameInput.value = chat.name;
    renameModal.classList.add('show');
    renameInput.focus();
    renameInput.select();
}

// Rename chat
function renameChat(chatId, newName) {
    if (!newName.trim()) return;
    
    const chat = chats[chatId];
    if (!chat) return;
    
    chat.name = newName.trim();
    
    if (chatId === activeChatId && currentChatName) {
        currentChatName.textContent = chat.name;
    }
    
    saveChats();
    renderChatsList();
}

// Setup modal event listeners
function setupModal() {
    if (!renameModal) return;
    
    modalSave.addEventListener('click', () => {
        if (chatToRename) {
            renameChat(chatToRename, renameInput.value);
            renameModal.classList.remove('show');
            chatToRename = null;
        }
    });
    
    modalCancel.addEventListener('click', () => {
        renameModal.classList.remove('show');
        chatToRename = null;
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === renameModal) {
            renameModal.classList.remove('show');
            chatToRename = null;
        }
    });
    
    renameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            modalSave.click();
        }
    });
}

// Load active chat messages
function loadActiveChat() {
    if (chats[activeChatId] && chats[activeChatId].messages) {
        messages = [...chats[activeChatId].messages];
        
        // Re-render messages
        messages.forEach(msg => {
            const wizardMsgDiv = document.createElement('div');
            wizardMsgDiv.className = `message wizard`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'message-icon';
            iconSpan.textContent = msg.sender === 'wizard' ? '🧙' : '👤';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'message-text';
            textSpan.textContent = msg.text;
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'message-time';
            const now = new Date();
            timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            contentDiv.appendChild(iconSpan);
            contentDiv.appendChild(textSpan);
            wizardMsgDiv.appendChild(contentDiv);
            wizardMsgDiv.appendChild(timeSpan);
            
            chatHistory.appendChild(wizardMsgDiv);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}

// Update message count in sidebar
function updateMessageCount() {
    if (messageCount) {
        messageCount.textContent = messages.length;
    }
}

// Reset current chat
function resetCurrentChat() {
    if (!confirm('Clear all messages in this chat?')) return;
    
    messages = [];
    chatHistory.innerHTML = '';
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [];
        // Keep the mode!
        chats[activeChatId].lastActive = new Date().toISOString();
    }
    updateMessageCount();
    addMessage('wizard', `🧹 Chat cleared! Ready for new messages.`, false, true);
    saveChats();
}

// Update mode display in dropdown
function updateModeDisplay() {
    const mode = modeData[currentMode] || modeData['JARVIS'];
    if (selectedDisplay) {
        selectedDisplay.innerHTML = `${mode.emoji} ${currentMode}`;
    }
    
    // Update selected class in dropdown
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

// Create global tooltip element
function createTooltip() {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'mode-tooltip';
    tooltipEl.className = 'mode-tooltip';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);
}

// Show tooltip with mode info
function showTooltip(modeKey, event) {
    if (!tooltipEl) return;
    
    const mode = modeData[modeKey];
    if (!mode) return;
    
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    
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
    
    const x = event.clientX + 15;
    const y = event.clientY - 20;
    
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const maxX = window.innerWidth - tooltipRect.width - 10;
    const maxY = window.innerHeight - tooltipRect.height - 10;
    
    tooltipEl.style.left = Math.min(x, maxX) + 'px';
    tooltipEl.style.top = Math.max(10, Math.min(y, maxY)) + 'px';
    tooltipEl.style.display = 'block';
}

// Hide tooltip with delay
function hideTooltip() {
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
    }
    tooltipTimeout = setTimeout(() => {
        if (tooltipEl) {
            tooltipEl.style.display = 'none';
        }
    }, 200);
}

// Setup custom dropdown with tooltips
function setupDropdown() {
    if (!dropdown || !dropdownContent) return;
    
    dropdownContent.innerHTML = '';
    
    Object.keys(modeData).forEach(modeKey => {
        const mode = modeData[modeKey];
        const item = document.createElement('div');
        item.className = `dropdown-item ${modeKey === currentMode ? 'selected' : ''}`;
        item.setAttribute('data-mode', modeKey);
        
        item.innerHTML = `
            <span style="font-size: 18px;">${mode.emoji}</span>
            <span>${modeKey}</span>
        `;
        
        item.addEventListener('mouseenter', (e) => {
            showTooltip(modeKey, e);
        });
        
        item.addEventListener('mousemove', (e) => {
            if (tooltipEl && tooltipEl.style.display === 'block') {
                const x = e.clientX + 15;
                const y = e.clientY - 20;
                
                const tooltipRect = tooltipEl.getBoundingClientRect();
                const maxX = window.innerWidth - tooltipRect.width - 10;
                const maxY = window.innerHeight - tooltipRect.height - 10;
                
                tooltipEl.style.left = Math.min(x, maxX) + 'px';
                tooltipEl.style.top = Math.max(10, Math.min(y, maxY)) + 'px';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        item.addEventListener('click', () => {
            currentMode = modeKey;
            
            // Update UI
            updateModeDisplay();
            
            dropdown.classList.remove('open');
            
            if (tooltipEl) {
                tooltipEl.style.display = 'none';
            }
            
            // Save mode to current chat
            if (chats[activeChatId]) {
                chats[activeChatId].mode = currentMode;
                saveChats();
            }
            
            const greeting = modeGreetings[modeKey] || `Switched to ${modeKey} mode!`;
            addMessage('wizard', `🔄 ${greeting}`, false, true);
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

// Update connection status
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

// Load modes from backend
async function loadModes() {
    try {
        const response = await fetch(`${API_BASE_URL}/modes`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        console.log('📋 Modes loaded:', data.modes);
    } catch (error) {
        console.error('Failed to load modes:', error);
    }
}

// Check system status
async function checkSystemStatus() {
    try {
        console.log('🔍 Checking backend at:', `${API_BASE_URL}/status`);
        
        const response = await fetch(`${API_BASE_URL}/status`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('✅ Backend connected:', data);
        
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
        
    } catch (error) {
        console.error('❌ Connection failed:', error);
        updateConnectionStatus('offline');
        
        if (modelList) {
            modelList.innerHTML = `
                <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:8px; padding:12px;">
                    <strong style="color:#ef4444;">⚠️ Cannot Connect</strong>
                    <div style="color:#fff; font-size:12px; margin:8px 0;">${error.message}</div>
                    <button onclick="window.location.reload()" style="background:#8b5cf6; color:white; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; margin-top:10px;">
                        🔄 Retry
                    </button>
                </div>
            `;
        }
    }
}

// Update model display
function updateModelInfo() {
    const mode = modeData[currentMode] || { emoji: '✨', model: 'Loading...' };
    
    if (currentModel) {
        currentModel.innerHTML = `${mode.emoji} ${mode.model}`;
    }
}

// Setup event listeners
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
}

// Add message to chat
function addMessage(sender, text, isThinkingMsg = false, instant = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}${isThinkingMsg ? ' thinking' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    
    if (sender === 'user') {
        iconSpan.textContent = '👤';
    } else {
        const mode = modeData[currentMode] || { emoji: '🧙' };
        iconSpan.textContent = isThinkingMsg ? '⏳' : mode.emoji;
    }
    
    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    
    if (sender === 'user' || isThinkingMsg || instant) {
        textSpan.textContent = text;
    } else {
        textSpan.textContent = '';
    }
    
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
    
    if (!isThinkingMsg && !instant) {
        messages.push({ sender, text });
        if (messageCount) {
            messageCount.textContent = messages.length;
        }
        
        // Save to chats
        if (chats[activeChatId]) {
            chats[activeChatId].messages = [...messages];
            chats[activeChatId].lastActive = new Date().toISOString();
            saveChats();
        }
    }
    
    return { div: messageDiv, textSpan: textSpan };
}

// Typing effect with dynamic speed
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

// Send message
async function sendMessage() {
    if (isThinking) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage('user', text);
    chatInput.value = '';
    
    isThinking = true;
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    
    const thinkingMsg = addMessage('wizard', '✨', true, true);
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: text,
                mode: currentMode,
                session_id: sessionId,
                turbo: turboMode
            })
        });
        
        const data = await response.json();
        const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}s`;
        }
        
        if (thinkingMsg.div.parentNode) {
            thinkingMsg.div.remove();
        }
        
        const mode = modeData[currentMode] || { emoji: '🧙' };
        
        const wizardMsgDiv = document.createElement('div');
        wizardMsgDiv.className = 'message wizard';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'message-icon';
        iconSpan.textContent = mode.emoji;
        
        const textSpan = document.createElement('span');
        textSpan.className = 'message-text';
        textSpan.textContent = '';
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(textSpan);
        wizardMsgDiv.appendChild(contentDiv);
        wizardMsgDiv.appendChild(timeSpan);
        
        chatHistory.appendChild(wizardMsgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        let baseSpeed = 20;
        if (currentMode === 'Fast') baseSpeed = 12;
        else if (currentMode === 'Nerd' || currentMode === 'ORACLE') baseSpeed = 25;
        
        await typeMessage(wizardMsgDiv, textSpan, data.reply, baseSpeed);
        
        messages.push({ sender: 'wizard', text: data.reply });
        if (messageCount) {
            messageCount.textContent = messages.length;
        }
        
        // Save to chats
        if (chats[activeChatId]) {
            chats[activeChatId].messages = [...messages];
            chats[activeChatId].lastActive = new Date().toISOString();
            saveChats();
        }
        
        if (data.model && currentModel) {
            currentModel.innerHTML = `${mode.emoji} ${data.model}`;
        }
        
    } catch (error) {
        console.error('Chat error:', error);
        
        if (thinkingMsg.div.parentNode) {
            thinkingMsg.div.remove();
        }
        
        let errorMessage = '⚠️ Connection error! Please try again.';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = '⚠️ Cannot reach the backend. Make sure the server is running.';
        } else if (error.message.includes('500')) {
            errorMessage = '⚠️ Server error. Please try again later.';
        }
        
        addMessage('wizard', errorMessage, false, true);
        
    } finally {
        isThinking = false;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        chatInput.focus();
    }
}

// Add Turbo Mode Toggle
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
                addMessage('wizard', '⚡ Turbo mode activated - faster responses, same personality!', false, true);
            } else {
                turboBtn.style.background = '#4b5563';
                turboBtn.innerHTML = '<span>🔴</span> TURBO OFF';
                addMessage('wizard', '✨ Turbo mode deactivated.', false, true);
            }
        });
    }
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
        addMessage('wizard', '🔧 Emergency reset - you can type again!', false, true);
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
