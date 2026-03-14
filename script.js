// ============================================
// WIZARD.AI PRO v9.0 - COMPLETE JAVASCRIPT
// Created by Arnav Gupta
// ============================================

// ============================================
// GLOBAL CONFIGURATION
// ============================================
const API_BASE_URL = 'https://arnav0928.pythonanywhere.com';
const SITE_URL = 'https://www.wizardai.dpdns.org';

// ============================================
// DOM ELEMENTS
// ============================================
// Main containers
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-input-btn');

// Status elements
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');

// Mode dropdown
const dropdown = document.getElementById('mode-dropdown');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');
const selectedDisplay = document.getElementById('selected-mode-display');

// Chat sidebar
const chatsList = document.getElementById('chats-list');
const newChatBtn = document.getElementById('new-chat-btn');
const currentChatName = document.getElementById('current-chat-name');
const currentChatEmoji = document.getElementById('current-chat-emoji');
const renameChatBtn = document.getElementById('rename-chat-btn');
const deleteChatBtn = document.getElementById('delete-chat-btn');
const resetCurrentBtn = document.getElementById('reset-current-btn');

// Stats elements
const statMessages = document.getElementById('stat-messages');
const statFiles = document.getElementById('stat-files');
const statMemories = document.getElementById('stat-memories');
const statImages = document.getElementById('stat-images');
const statSearches = document.getElementById('stat-searches');
const statResponse = document.getElementById('stat-response');
const quickToday = document.getElementById('quick-today');
const quickTotal = document.getElementById('quick-total');

// Toolbar buttons
const searchBtn = document.getElementById('search-btn');
const uploadBtn = document.getElementById('upload-btn');
const codeBtn = document.getElementById('code-btn');
const imageBtn = document.getElementById('image-btn');
const memoryBtn = document.getElementById('memory-btn');
const statsBtn = document.getElementById('stats-btn');
const personalitiesBtn = document.getElementById('personalities-btn');

// Indicators
const searchIndicator = document.getElementById('search-indicator');
const inputSearchIndicator = document.getElementById('input-search-indicator');
const typingIndicator = document.getElementById('typing-indicator');

// Progress elements
const uploadProgress = document.getElementById('upload-progress');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');

// Modals
const authModal = document.getElementById('auth-modal-overlay');
const renameModal = document.getElementById('rename-modal-overlay');
const codeModal = document.getElementById('code-modal-overlay');
const imageModal = document.getElementById('image-modal-overlay');
const memoryModal = document.getElementById('memory-modal-overlay');
const statsModal = document.getElementById('stats-modal-overlay');
const personalitiesModal = document.getElementById('personalities-modal-overlay');

// Modal close buttons
const closeAuth = document.getElementById('close-auth-modal');
const closeRename = document.getElementById('close-rename-modal');
const closeCode = document.getElementById('close-code-modal');
const closeImage = document.getElementById('close-image-modal');
const closeMemory = document.getElementById('close-memory-modal');
const closeStats = document.getElementById('close-stats-modal');
const closePersonalities = document.getElementById('close-personalities-modal');

// Auth elements
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authConfirm = document.getElementById('auth-confirm');
const authError = document.getElementById('auth-error');
const authSubmit = document.getElementById('auth-submit');
const authSwitchBtn = document.getElementById('auth-switch-btn');
const authSwitchText = document.getElementById('auth-switch-text');
const authModalTitle = document.getElementById('auth-modal-title');
const firstNameGroup = document.getElementById('first-name-group');
const lastNameGroup = document.getElementById('last-name-group');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const verificationGroup = document.getElementById('verification-group');
const verificationInput = document.getElementById('verification-code');
const resendCodeBtn = document.getElementById('resend-code-btn');

// 🔥 FIXED: Added missing confirmPasswordGroup
const confirmPasswordGroup = document.getElementById('confirm-password-group');

// User elements
const userInfo = document.getElementById('user-info');
const authButtons = document.getElementById('auth-buttons');
const userEmail = document.getElementById('user-email');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');

// Personality creator
const toggleCreatorBtn = document.getElementById('toggle-creator-btn');
const creatorPanel = document.getElementById('creator-panel');
const customName = document.getElementById('custom-name');
const customEmoji = document.getElementById('custom-emoji');
const customPrompt = document.getElementById('custom-prompt');
const customGreeting = document.getElementById('custom-greeting');
const savePersonality = document.getElementById('save-personality');
const cancelPersonality = document.getElementById('cancel-personality');

// Personalities browser
const personalitiesList = document.getElementById('personalities-list');
const personalitiesGrid = document.getElementById('personalities-grid');
const tabBtns = document.querySelectorAll('.tab-btn');

// Hidden inputs
const fileUpload = document.getElementById('file-upload');

// Code modal elements
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const runCodeBtn = document.getElementById('run-code');
const clearCodeBtn = document.getElementById('clear-code');

// Image modal elements
const imagePrompt = document.getElementById('image-prompt');
const imageSize = document.getElementById('image-size');
const generateImageBtn = document.getElementById('generate-image');
const imageResult = document.getElementById('image-result');

// Memory elements
const memoryList = document.getElementById('memory-list');

// Stats elements
const statsCreated = document.getElementById('stats-created');
const statsLast = document.getElementById('stats-last');
const statsTotalMsgs = document.getElementById('stats-total-msgs');
const statsTotalChats = document.getElementById('stats-total-chats');
const statsFilesDetail = document.getElementById('stats-files');
const statsImagesDetail = document.getElementById('stats-images');
const statsCode = document.getElementById('stats-code');
const statsSearchesDetail = document.getElementById('stats-searches');
const statsMemoriesDetail = document.getElementById('stats-memories');
const statsDocs = document.getElementById('stats-docs');
const statsAvgResponse = document.getElementById('stats-avg-response');
const statsFastest = document.getElementById('stats-fastest');

// Rename modal
const renameInput = document.getElementById('rename-input');
const renameSave = document.getElementById('modal-save');
const renameCancel = document.getElementById('modal-cancel');

// Toast
const notificationToast = document.getElementById('notification-toast');

// Turbo button
const turboBtn = document.getElementById('turbo-btn');
const turboStatus = document.getElementById('turbo-status');

// ============================================
// STATE MANAGEMENT
// ============================================
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;
let searchMode = false;
let currentUser = null;
let activeChatId = 'default';
let chats = {};
let chatIds = ['default'];
let memories = [];
let customPersonalities = [];
let publicPersonalities = [];
let isLoginMode = true;
let chatToRename = null;
let signupEmail = '';
let streamingController = null;
let autoSearchActive = false;

// Voice recognition
let voiceRecognition = null;
let isVoiceListening = false;

// Stats tracking
let userStats = {
    messages: 0,
    files: 0,
    memories: 0,
    images: 0,
    searches: 0,
    codeExecutions: 0,
    responseTimes: [],
    todayMessages: 0,
    sessionStart: Date.now()
};

// ============================================
// MODE DATA
// ============================================
const modeData = {
    'Fast': {
        emoji: '⚡',
        name: 'Fast Mode',
        desc: 'Lightning quick responses for when you need speed.',
        model: 'Llama 3.1 8B',
        color: '#10b981'
    },
    'Normal': {
        emoji: '✨',
        name: 'Normal Mode',
        desc: 'Balanced, friendly conversation.',
        model: 'Llama 3.1 8B',
        color: '#10b981'
    },
    'Fun': {
        emoji: '🎉',
        name: 'Fun Mode',
        desc: 'Playful and energetic! Tells jokes and keeps things light.',
        model: 'Llama 3.3 70B',
        color: '#8b5cf6'
    },
    'Sarcastic': {
        emoji: '😏',
        name: 'Sarcastic Mode',
        desc: 'Witty and slightly sarcastic, but still helpful.',
        model: 'Llama 3.1 8B',
        color: '#10b981'
    },
    'Nerd': {
        emoji: '🧠',
        name: 'Nerd Mode',
        desc: 'Detailed, factual, and academic.',
        model: 'Llama 3.3 70B',
        color: '#8b5cf6'
    },
    'JARVIS': {
        emoji: '🎩',
        name: 'JARVIS Mode',
        desc: 'Sophisticated and professional, like Tony Stark\'s AI.',
        model: 'Llama 3.1 8B',
        color: '#00aaff'
    },
    'ORACLE': {
        emoji: '🔮',
        name: 'ORACLE Mode',
        desc: 'Mystical and all-knowing.',
        model: 'Llama 3.3 70B',
        color: '#8b5cf6'
    }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Wizard.AI v9.0...');
    
    // Register service worker for PWA
    registerServiceWorker();
    
    // Initialize UI
    setupEventListeners();
    setupDropdown();
    setupModals();
    initVoiceRecognition();
    loadGuestData();
    
    // Check authentication
    await checkAuth();
    
    // Load initial data
    loadChats();
    loadStats(); // 🔥 FIXED: Now this function exists
    loadPublicPersonalities();
    
    // Set up periodic stats update
    setInterval(updateStats, 30000);
    
    console.log('✅ Wizard.AI v9.0 ready!');
});

// ============================================
// SERVICE WORKER (PWA)
// ============================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker error:', err));
    }
}

// ============================================
// 🔥 FIXED: Added missing loadStats function
// ============================================
function loadStats() {
    console.log('📊 Loading stats...');
    updateStats();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Send message
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Voice input
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
    }
    
    // Turbo mode
    if (turboBtn) {
        turboBtn.addEventListener('click', toggleTurboMode);
    }
    
    // Toolbar buttons
    if (searchBtn) searchBtn.addEventListener('click', toggleSearchMode);
    if (uploadBtn) uploadBtn.addEventListener('click', () => fileUpload.click());
    if (codeBtn) codeBtn.addEventListener('click', () => openModal(codeModal));
    if (imageBtn) imageBtn.addEventListener('click', () => openModal(imageModal));
    if (memoryBtn) memoryBtn.addEventListener('click', loadMemories);
    if (statsBtn) statsBtn.addEventListener('click', loadDetailedStats);
    if (personalitiesBtn) personalitiesBtn.addEventListener('click', openPersonalitiesBrowser);
    
    // File upload
    if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
    
    // Chat actions
    if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);
    if (renameChatBtn) renameChatBtn.addEventListener('click', () => openRenameModal(activeChatId));
    if (deleteChatBtn) deleteChatBtn.addEventListener('click', () => deleteChat(activeChatId));
    if (resetCurrentBtn) resetCurrentBtn.addEventListener('click', resetCurrentChat);
    
    // Auth buttons
    const loginBtn = document.getElementById('show-login-btn');
    const signupBtn = document.getElementById('show-signup-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => showAuthModal(true));
    if (signupBtn) signupBtn.addEventListener('click', () => showAuthModal(false));
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    
    // Auth modal
    if (authSwitchBtn) authSwitchBtn.addEventListener('click', toggleAuthMode);
    if (authSubmit) authSubmit.addEventListener('click', handleAuthSubmit);
    if (closeAuth) closeAuth.addEventListener('click', () => closeModal(authModal));
    if (resendCodeBtn) resendCodeBtn.addEventListener('click', resendVerificationCode);
    
    // Modal close buttons
    if (closeRename) closeRename.addEventListener('click', () => closeModal(renameModal));
    if (closeCode) closeCode.addEventListener('click', () => closeModal(codeModal));
    if (closeImage) closeImage.addEventListener('click', () => closeModal(imageModal));
    if (closeMemory) closeMemory.addEventListener('click', () => closeModal(memoryModal));
    if (closeStats) closeStats.addEventListener('click', () => closeModal(statsModal));
    if (closePersonalities) closePersonalities.addEventListener('click', () => closeModal(personalitiesModal));
    
    // Rename modal
    if (renameSave) renameSave.addEventListener('click', saveRename);
    if (renameCancel) renameCancel.addEventListener('click', () => closeModal(renameModal));
    if (renameInput) {
        renameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveRename();
        });
    }
    
    // Code modal
    if (runCodeBtn) runCodeBtn.addEventListener('click', executeCode);
    if (clearCodeBtn) {
        clearCodeBtn.addEventListener('click', () => {
            if (codeInput) codeInput.value = '';
            if (codeOutput) codeOutput.textContent = '';
        });
    }
    
    // Image modal
    if (generateImageBtn) generateImageBtn.addEventListener('click', generateImage);
    
    // Personality creator
    if (toggleCreatorBtn) toggleCreatorBtn.addEventListener('click', toggleCreatorPanel);
    if (savePersonality) savePersonality.addEventListener('click', saveCustomPersonality);
    if (cancelPersonality) cancelPersonality.addEventListener('click', closeCreatorPanel);
    
    // Tab buttons
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchPersonalityTab(btn.dataset.tab));
        });
    }
    
    // Click outside modals
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal(e.target);
        }
    });
    
    // Emergency reset (F2)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F2') {
            e.preventDefault();
            emergencyReset();
        }
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openModal(modal) {
    if (modal) modal.classList.add('active');
}

function closeModal(modal) {
    if (modal) modal.classList.remove('active');
}

// ============================================
// DROPDOWN SETUP
// ============================================
function setupDropdown() {
    if (!dropdownContent) return;
    
    // Clear existing
    dropdownContent.innerHTML = '';
    
    // Add built-in modes
    Object.keys(modeData).forEach(mode => {
        const item = createDropdownItem(mode, modeData[mode].emoji);
        dropdownContent.appendChild(item);
    });
    
    // Dropdown toggle
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
    }
    
    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

function createDropdownItem(mode, emoji) {
    const item = document.createElement('div');
    item.className = `dropdown-item ${mode === currentMode ? 'selected' : ''}`;
    item.setAttribute('data-mode', mode);
    item.innerHTML = `<span style="font-size: 18px;">${emoji}</span><span>${mode}</span>`;
    
    item.addEventListener('click', () => selectMode(mode));
    
    return item;
}

function selectMode(mode) {
    currentMode = mode;
    updateModeDisplay();
    if (dropdown) dropdown.classList.remove('open');
    
    // Save to current chat
    if (chats[activeChatId]) {
        chats[activeChatId].mode = mode;
        saveChats();
    }
    
    showNotification(`Switched to ${mode} mode`, 'info');
}

function updateModeDisplay() {
    const mode = modeData[currentMode] || { emoji: '🎩', name: currentMode };
    if (selectedDisplay) {
        selectedDisplay.innerHTML = `${mode.emoji} ${currentMode}`;
    }
    
    // Update selected class
    document.querySelectorAll('.dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.mode === currentMode);
    });
}

// ============================================
// CUSTOM PERSONALITIES
// ============================================
function toggleCreatorPanel() {
    if (!creatorPanel) return;
    creatorPanel.style.display = creatorPanel.style.display === 'none' ? 'block' : 'none';
    if (toggleCreatorBtn) {
        toggleCreatorBtn.querySelector('span').textContent = 
            creatorPanel.style.display === 'block' ? '➖' : '➕';
    }
}

function closeCreatorPanel() {
    if (!creatorPanel) return;
    creatorPanel.style.display = 'none';
    if (toggleCreatorBtn) {
        toggleCreatorBtn.querySelector('span').textContent = '➕';
    }
    clearCreatorForm();
}

function clearCreatorForm() {
    if (customName) customName.value = '';
    if (customEmoji) customEmoji.value = '';
    if (customPrompt) customPrompt.value = '';
    if (customGreeting) customGreeting.value = '';
}

async function saveCustomPersonality() {
    if (!currentUser) {
        showNotification('Please login to create personalities', 'error');
        return;
    }
    
    const name = customName ? customName.value.trim() : '';
    const emoji = customEmoji ? customEmoji.value.trim() || '🤖' : '🤖';
    const prompt = customPrompt ? customPrompt.value.trim() : '';
    const greeting = customGreeting ? customGreeting.value.trim() || `Hello! I'm ${name}.` : `Hello! I'm ${name}.`;
    
    if (!name || !prompt) {
        showNotification('Name and prompt are required', 'error');
        return;
    }
    
    showNotification('Personality created! (demo)', 'success');
    closeCreatorPanel();
}

// ============================================
// VOICE RECOGNITION
// ============================================
function initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.log('Voice recognition not supported');
        if (voiceBtn) voiceBtn.style.display = 'none';
        return;
    }
    
    try {
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
        voiceRecognition.lang = 'en-US';
        
        voiceRecognition.onstart = () => {
            isVoiceListening = true;
            if (voiceBtn) voiceBtn.classList.add('listening');
            showNotification('🎤 Listening...', 'info');
        };
        
        voiceRecognition.onend = () => {
            isVoiceListening = false;
            if (voiceBtn) voiceBtn.classList.remove('listening');
        };
        
        voiceRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            if (chatInput) chatInput.value = transcript;
            showNotification(`🎤 "${transcript}"`, 'success');
            setTimeout(() => sendMessage(), 500);
        };
        
        voiceRecognition.onerror = (event) => {
            isVoiceListening = false;
            if (voiceBtn) voiceBtn.classList.remove('listening');
            showNotification(`Voice error: ${event.error}`, 'error');
        };
    } catch (e) {
        console.error('Voice init error:', e);
    }
}

function toggleVoiceInput() {
    if (!voiceRecognition) {
        initVoiceRecognition();
        if (!voiceRecognition) return;
    }
    
    if (isVoiceListening) {
        voiceRecognition.stop();
    } else {
        voiceRecognition.start();
    }
}

// ============================================
// TURBO MODE
// ============================================
function toggleTurboMode() {
    turboMode = !turboMode;
    if (turboBtn) turboBtn.classList.toggle('active', turboMode);
    if (turboStatus) turboStatus.textContent = turboMode ? 'ON' : 'OFF';
    showNotification(`Turbo mode ${turboMode ? 'activated' : 'deactivated'}`, 'info');
}

// ============================================
// SEARCH MODE
// ============================================
function toggleSearchMode() {
    searchMode = !searchMode;
    if (searchBtn) searchBtn.classList.toggle('active', searchMode);
    showNotification(`Web search ${searchMode ? 'manual mode' : 'auto mode'}`, 'info');
}

// ============================================
// STREAMING CHAT (Simplified for now)
// ============================================
async function sendMessage() {
    if (isThinking) return;
    
    const text = chatInput ? chatInput.value.trim() : '';
    if (!text) return;
    
    // Add user message
    addMessage('user', text);
    if (chatInput) chatInput.value = '';
    
    isThinking = true;
    if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.classList.add('loading');
    }
    
    // Show typing indicator
    if (typingIndicator) typingIndicator.style.display = 'flex';
    
    // Simulate response for now (replace with actual API call)
    setTimeout(() => {
        const response = "Thanks for your message! The streaming API will be connected soon.";
        addMessage('assistant', response, currentMode);
        
        isThinking = false;
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
        }
        if (typingIndicator) typingIndicator.style.display = 'none';
        
        messages.push({ sender: 'user', text });
        messages.push({ sender: 'assistant', text: response, mode: currentMode });
        
        if (chats[activeChatId]) {
            chats[activeChatId].messages = messages;
        }
        
        trackMessage();
    }, 1000);
}

// ============================================
// MESSAGE HANDLING
// ============================================
function addMessage(sender, text, mode = null) {
    if (!chatHistory) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    let icon = sender === 'user' ? '👤' : (modeData[mode]?.emoji || '🧙');
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${icon}</span>
            <span class="message-text">${escapeHtml(text)}</span>
        </div>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
    `;
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    return messageDiv;
}

// ============================================
// CHAT MANAGEMENT
// ============================================
function loadChats() {
    // Load from localStorage for guest
    const saved = localStorage.getItem('wizard_chats');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            chats = data.chats || {};
            chatIds = data.chatIds || ['default'];
            activeChatId = data.activeChatId || 'default';
            messages = data.messages || [];
            
            // Ensure default chat exists
            if (!chats['default']) {
                chats['default'] = {
                    chat_id: 'default',
                    name: 'Main Chat',
                    emoji: '🧙',
                    mode: 'JARVIS',
                    messages: []
                };
            }
            
            renderChatsList();
            renderMessages();
        } catch (e) {
            console.error('Failed to load chats:', e);
            createDefaultChat();
        }
    } else {
        createDefaultChat();
    }
}

function createDefaultChat() {
    chats = {
        'default': {
            chat_id: 'default',
            name: 'Main Chat',
            emoji: '🧙',
            mode: 'JARVIS',
            messages: []
        }
    };
    chatIds = ['default'];
    activeChatId = 'default';
    messages = [];
    renderChatsList();
    renderMessages();
}

function renderChatsList() {
    if (!chatsList) return;
    
    let html = '';
    chatIds.forEach(id => {
        const chat = chats[id];
        if (!chat) return;
        
        html += `
            <div class="chat-item ${id === activeChatId ? 'active' : ''}" data-chat-id="${id}">
                <span class="chat-emoji">${chat.emoji}</span>
                <span class="chat-name">${chat.name}</span>
                <div class="chat-item-actions">
                    <button class="rename-chat-item" data-chat-id="${id}" title="Rename">✏️</button>
                    ${id !== 'default' ? `<button class="delete-chat-item" data-chat-id="${id}" title="Delete">🗑️</button>` : ''}
                </div>
            </div>
        `;
    });
    
    chatsList.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.chat-item').forEach(el => {
        el.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                switchChat(el.dataset.chatId);
            }
        });
    });
    
    document.querySelectorAll('.rename-chat-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openRenameModal(btn.dataset.chatId);
        });
    });
    
    document.querySelectorAll('.delete-chat-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteChat(btn.dataset.chatId);
        });
    });
}

function renderMessages() {
    if (!chatHistory) return;
    chatHistory.innerHTML = '';
    messages.forEach(msg => {
        addMessage(msg.sender, msg.text, msg.mode);
    });
}

function switchChat(chatId) {
    // Save current chat
    if (chats[activeChatId]) {
        chats[activeChatId].messages = messages;
    }
    
    // Switch to new chat
    activeChatId = chatId;
    messages = chats[chatId]?.messages || [];
    currentMode = chats[chatId]?.mode || 'JARVIS';
    
    // Update UI
    updateModeDisplay();
    renderMessages();
    renderChatsList();
    
    if (currentChatName) {
        currentChatName.textContent = chats[chatId]?.name || 'Chat';
    }
    if (currentChatEmoji) {
        currentChatEmoji.textContent = chats[chatId]?.emoji || '💬';
    }
}

function createNewChat() {
    const id = 'chat_' + Date.now();
    const name = `Chat ${chatIds.length + 1}`;
    const emojis = ['💬', '🤖', '🌟', '⭐', '✨', '🎯', '🎲'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    chats[id] = {
        chat_id: id,
        name,
        emoji,
        mode: 'JARVIS',
        messages: []
    };
    
    chatIds.push(id);
    saveChats();
    renderChatsList();
    switchChat(id);
}

function deleteChat(chatId) {
    if (chatId === 'default') {
        showNotification('Cannot delete default chat', 'error');
        return;
    }
    
    if (!confirm('Delete this chat?')) return;
    
    delete chats[chatId];
    chatIds = chatIds.filter(id => id !== chatId);
    
    if (activeChatId === chatId) {
        switchChat('default');
    }
    
    saveChats();
    renderChatsList();
    showNotification('Chat deleted', 'success');
}

function openRenameModal(chatId) {
    chatToRename = chatId;
    if (renameInput) renameInput.value = chats[chatId]?.name || '';
    if (renameModal) openModal(renameModal);
}

function saveRename() {
    const newName = renameInput ? renameInput.value.trim() : '';
    if (newName && chatToRename && chats[chatToRename]) {
        chats[chatToRename].name = newName;
        saveChats();
        renderChatsList();
        
        if (chatToRename === activeChatId && currentChatName) {
            currentChatName.textContent = newName;
        }
        
        showNotification('Chat renamed', 'success');
    }
    if (renameModal) closeModal(renameModal);
}

function resetCurrentChat() {
    if (confirm('Clear all messages in this chat?')) {
        messages = [];
        if (chats[activeChatId]) chats[activeChatId].messages = [];
        if (chatHistory) chatHistory.innerHTML = '';
        saveChats();
        showNotification('Chat cleared', 'success');
    }
}

function saveChats() {
    localStorage.setItem('wizard_chats', JSON.stringify({
        chats,
        chatIds,
        activeChatId,
        messages
    }));
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
        } else {
            updateUIForAuth();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUIForAuth();
    }
}

function updateUIForAuth() {
    if (currentUser && userInfo && authButtons) {
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
        if (userEmail) userEmail.textContent = currentUser.email;
        if (userName) userName.textContent = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`;
        if (userAvatar) userAvatar.textContent = currentUser.first_name?.[0] || '👤';
    } else if (userInfo && authButtons) {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

function showAuthModal(login = true) {
    isLoginMode = login;
    if (authModalTitle) authModalTitle.textContent = login ? 'Login to Wizard.AI' : 'Create Account';
    if (authSubmit) authSubmit.textContent = login ? 'Login' : 'Sign Up';
    if (authSwitchText) authSwitchText.textContent = login ? "Don't have an account?" : "Already have an account?";
    if (authSwitchBtn) authSwitchBtn.textContent = login ? 'Sign Up' : 'Login';
    
    if (firstNameGroup) firstNameGroup.style.display = login ? 'none' : 'block';
    if (lastNameGroup) lastNameGroup.style.display = login ? 'none' : 'block';
    // 🔥 FIXED: Using confirmPasswordGroup
    if (confirmPasswordGroup) confirmPasswordGroup.style.display = login ? 'none' : 'block';
    if (verificationGroup) verificationGroup.style.display = 'none';
    
    if (authEmail) authEmail.value = '';
    if (authPassword) authPassword.value = '';
    if (authConfirm) authConfirm.value = '';
    if (firstNameInput) firstNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';
    if (authError) authError.textContent = '';
    
    if (authModal) openModal(authModal);
}

function toggleAuthMode() {
    showAuthModal(!isLoginMode);
}

async function handleAuthSubmit() {
    if (isLoginMode) {
        await handleLogin();
    } else if (verificationGroup && verificationGroup.style.display === 'block') {
        await handleVerify();
    } else {
        await handleSignup();
    }
}

async function handleLogin() {
    const email = authEmail ? authEmail.value.trim() : '';
    const password = authPassword ? authPassword.value.trim() : '';
    
    if (!email || !password) {
        if (authError) authError.textContent = 'Email and password required';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            chats = {};
            if (data.chats) {
                data.chats.forEach(c => chats[c.chat_id] = c);
            }
            chatIds = data.chat_order || ['default'];
            activeChatId = chatIds[0];
            messages = chats[activeChatId]?.messages || [];
            
            updateUIForAuth();
            renderChatsList();
            renderMessages();
            if (authModal) closeModal(authModal);
            showNotification(`Welcome back, ${currentUser.first_name || ''}!`, 'success');
        } else {
            const error = await response.json();
            if (authError) authError.textContent = error.error || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        if (authError) authError.textContent = 'Connection error';
    }
}

async function handleSignup() {
    const firstName = firstNameInput ? firstNameInput.value.trim() : '';
    const lastName = lastNameInput ? lastNameInput.value.trim() : '';
    const email = authEmail ? authEmail.value.trim() : '';
    const password = authPassword ? authPassword.value.trim() : '';
    const confirm = authConfirm ? authConfirm.value.trim() : '';
    
    if (!firstName || !lastName || !email || !password || !confirm) {
        if (authError) authError.textContent = 'All fields required';
        return;
    }
    
    if (password !== confirm) {
        if (authError) authError.textContent = 'Passwords do not match';
        return;
    }
    
    showNotification('Signup will be implemented with the backend', 'info');
    if (authModal) closeModal(authModal);
}

async function handleVerify() {
    showNotification('Verification coming soon', 'info');
    if (authModal) closeModal(authModal);
}

async function resendVerificationCode() {
    showNotification('Resend code coming soon', 'info');
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    currentUser = null;
    updateUIForAuth();
    showNotification('Logged out', 'success');
}

function loadGuestData() {
    const saved = localStorage.getItem('wizard_guest_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userStats = data.stats || userStats;
            updateStats();
        } catch (e) {}
    }
}

// ============================================
// STATS FUNCTIONS
// ============================================
function trackMessage() {
    userStats.messages++;
    userStats.todayMessages++;
    updateStats();
    saveGuestData();
}

function trackFile() {
    userStats.files++;
    updateStats();
    saveGuestData();
}

function trackImage() {
    userStats.images++;
    updateStats();
    saveGuestData();
}

function trackSearch() {
    userStats.searches++;
    if (statSearches) {
        statSearches.textContent = userStats.searches;
    }
    saveGuestData();
}

function trackCode() {
    userStats.codeExecutions++;
    updateStats();
    saveGuestData();
}

function updateStats() {
    if (statMessages) statMessages.textContent = userStats.messages;
    if (statFiles) statFiles.textContent = userStats.files;
    if (statMemories) statMemories.textContent = userStats.memories;
    if (statImages) statImages.textContent = userStats.images;
    if (statSearches) statSearches.textContent = userStats.searches;
    
    const avg = userStats.responseTimes.length > 0 
        ? (userStats.responseTimes.reduce((a, b) => a + b, 0) / userStats.responseTimes.length).toFixed(1)
        : '0.4';
    if (statResponse) statResponse.textContent = avg + 's';
    
    if (quickToday) quickToday.textContent = userStats.todayMessages + ' msgs';
    if (quickTotal) quickTotal.textContent = userStats.messages + ' msgs';
}

function saveGuestData() {
    if (!currentUser) {
        localStorage.setItem('wizard_guest_data', JSON.stringify({ stats: userStats }));
    }
}

async function loadDetailedStats() {
    if (!currentUser) {
        showNotification('Login to view detailed stats', 'error');
        return;
    }
    
    if (statsModal) openModal(statsModal);
    showNotification('Stats coming soon', 'info');
}

async function loadMemories() {
    if (!currentUser) {
        showNotification('Login to view memories', 'error');
        return;
    }
    
    if (memoryModal) openModal(memoryModal);
    if (memoryList) memoryList.innerHTML = '<div class="empty-state">No memories yet. Tell me about yourself!</div>';
}

async function loadPublicPersonalities() {
    if (personalitiesList) {
        personalitiesList.innerHTML = '<div class="empty-state">Personalities coming soon</div>';
    }
}

async function openPersonalitiesBrowser() {
    if (personalitiesModal) openModal(personalitiesModal);
    if (personalitiesGrid) {
        personalitiesGrid.innerHTML = '<div class="loading">Loading personalities...</div>';
        setTimeout(() => {
            if (personalitiesGrid) {
                personalitiesGrid.innerHTML = '<div class="empty-state">Personalities coming soon</div>';
            }
        }, 1000);
    }
}

function switchPersonalityTab(tab) {
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
    }
}

// ============================================
// FILE UPLOAD
// ============================================
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Show progress bar
    if (uploadProgress) uploadProgress.style.display = 'block';
    if (progressBarFill) progressBarFill.style.width = '0%';
    if (progressText) progressText.textContent = 'Starting upload...';
    
    // Simulate upload
    setTimeout(() => {
        if (progressBarFill) progressBarFill.style.width = '100%';
        if (progressText) progressText.textContent = 'Upload complete!';
        
        setTimeout(() => {
            if (uploadProgress) uploadProgress.style.display = 'none';
        }, 1000);
        
        trackFile();
        showNotification(`✅ ${file.name} uploaded! (demo)`, 'success');
        addMessage('assistant', `📎 File uploaded: ${file.name} (demo mode)`);
    }, 1500);
}

// ============================================
// CODE EXECUTION
// ============================================
async function executeCode() {
    const code = codeInput ? codeInput.value.trim() : '';
    if (!code) return;
    
    if (codeOutput) codeOutput.innerHTML = 'Running...';
    
    setTimeout(() => {
        if (codeOutput) {
            codeOutput.innerHTML = '<pre class="stdout">Hello from demo mode!\n\nThis is a simulated response.</pre>';
        }
        trackCode();
    }, 1000);
}

// ============================================
// IMAGE GENERATION
// ============================================
async function generateImage() {
    const prompt = imagePrompt ? imagePrompt.value.trim() : '';
    if (!prompt) return;
    
    if (imageResult) imageResult.innerHTML = '<div class="loading">Generating image...</div>';
    
    setTimeout(() => {
        if (imageResult) {
            imageResult.innerHTML = `<div class="demo-image">🎨 [Demo] Image for: "${prompt}"</div>`;
        }
        trackImage();
    }, 1500);
}

// ============================================
// NOTIFICATION TOAST
// ============================================
function showNotification(message, type = 'info', duration = 3000) {
    if (!notificationToast) return;
    
    notificationToast.textContent = message;
    notificationToast.className = 'notification-toast';
    notificationToast.classList.add('show');
    
    if (type === 'success') notificationToast.classList.add('success');
    if (type === 'error') notificationToast.classList.add('error');
    
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, duration);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function emergencyReset() {
    isThinking = false;
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
    }
    if (typingIndicator) typingIndicator.style.display = 'none';
    if (chatInput) {
        chatInput.disabled = false;
        chatInput.focus();
    }
    showNotification('Emergency reset activated', 'info');
}

// ============================================
// MODAL SETUP
// ============================================
function setupModals() {
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(closeModal);
        }
    });
}
