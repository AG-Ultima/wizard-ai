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
    await loadStats(); // Now this is defined
    loadPublicPersonalities();
    
    // Set up periodic stats update
    setInterval(updateStatsDisplay, 30000);
    
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
// STATS FUNCTIONS - REAL IMPLEMENTATION
// ============================================

// Load stats from localStorage or API
async function loadStats() {
    console.log('📊 Loading real stats...');
    
    if (currentUser) {
        // Load from API for logged-in users
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                userStats.messages = data.messages || 0;
                userStats.files = data.files || 0;
                userStats.memories = data.memories || 0;
                userStats.images = data.images || 0;
                userStats.searches = data.searches || 0;
                userStats.codeExecutions = data.code || 0;
            }
        } catch (error) {
            console.error('Failed to load stats from API:', error);
            loadStatsFromStorage();
        }
    } else {
        // Load from localStorage for guests
        loadStatsFromStorage();
    }
    
    updateStatsDisplay();
}

// Load stats from localStorage
function loadStatsFromStorage() {
    const saved = localStorage.getItem('wizard_stats');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userStats = { ...userStats, ...data };
        } catch (e) {
            console.error('Failed to parse saved stats:', e);
        }
    }
}

// Save stats to localStorage (for guests)
function saveStatsToStorage() {
    if (!currentUser) {
        localStorage.setItem('wizard_stats', JSON.stringify({
            messages: userStats.messages,
            files: userStats.files,
            memories: userStats.memories,
            images: userStats.images,
            searches: userStats.searches,
            codeExecutions: userStats.codeExecutions
        }));
    }
}

// Update the stats display in UI
function updateStatsDisplay() {
    if (statMessages) statMessages.textContent = userStats.messages;
    if (statFiles) statFiles.textContent = userStats.files;
    if (statMemories) statMemories.textContent = userStats.memories;
    if (statImages) statImages.textContent = userStats.images;
    if (statSearches) statSearches.textContent = userStats.searches;
    
    // Calculate average response time
    const avgResponse = userStats.responseTimes.length > 0 
        ? (userStats.responseTimes.reduce((a, b) => a + b, 0) / userStats.responseTimes.length).toFixed(1)
        : '0.4';
    if (statResponse) statResponse.textContent = avgResponse + 's';
    
    // Update quick stats
    if (quickToday) quickToday.textContent = userStats.todayMessages + ' msgs';
    if (quickTotal) quickTotal.textContent = userStats.messages + ' msgs';
}

// Track a new message
function trackMessage(responseTime) {
    userStats.messages++;
    userStats.todayMessages++;
    if (responseTime) {
        userStats.responseTimes.push(responseTime);
        // Keep only last 100 response times
        if (userStats.responseTimes.length > 100) {
            userStats.responseTimes.shift();
        }
    }
    updateStatsDisplay();
    saveStatsToStorage();
}

function trackFile() {
    userStats.files++;
    updateStatsDisplay();
    saveStatsToStorage();
}

function trackImage() {
    userStats.images++;
    updateStatsDisplay();
    saveStatsToStorage();
}

function trackSearch() {
    userStats.searches++;
    updateStatsDisplay();
    saveStatsToStorage();
}

function trackCode() {
    userStats.codeExecutions++;
    updateStatsDisplay();
    saveStatsToStorage();
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
        const span = toggleCreatorBtn.querySelector('span');
        if (span) span.textContent = creatorPanel.style.display === 'block' ? '➖' : '➕';
    }
}

function closeCreatorPanel() {
    if (!creatorPanel) return;
    creatorPanel.style.display = 'none';
    if (toggleCreatorBtn) {
        const span = toggleCreatorBtn.querySelector('span');
        if (span) span.textContent = '➕';
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
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/personalities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, emoji, prompt, greeting, is_public: true })
        });
        
        if (response.ok) {
            const personality = await response.json();
            customPersonalities.push(personality);
            showNotification('Personality created!', 'success');
            closeCreatorPanel();
        } else {
            showNotification('Failed to create personality', 'error');
        }
    } catch (error) {
        console.error('Error creating personality:', error);
        showNotification('Error creating personality', 'error');
    }
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
// AUTO SEARCH DETECTION
// ============================================
function shouldAutoSearch(text) {
    const searchTriggers = [
        'latest', 'news', 'current', 'today', 'now', 
        '2024', '2025', '2026', 'recent', 'update',
        'weather', 'stock', 'price', 'score', 'results',
        'who is', 'what is', 'tell me about'
    ];
    
    const lowerText = text.toLowerCase();
    return searchTriggers.some(trigger => lowerText.includes(trigger));
}

// ============================================
// STREAMING CHAT
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
    
    // Determine if we should search
    const shouldSearch = searchMode || shouldAutoSearch(text);
    if (shouldSearch && inputSearchIndicator) {
        inputSearchIndicator.style.display = 'inline';
    }
    
    // Create message container for streaming
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message wizard streaming';
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${modeData[currentMode]?.emoji || '🧙'}</span>
            <span class="message-text" id="streaming-response"></span>
        </div>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
    `;
    if (chatHistory) chatHistory.appendChild(messageDiv);
    
    const responseSpan = document.getElementById('streaming-response');
    let fullResponse = '';
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                prompt: text,
                mode: currentMode,
                turbo: turboMode,
                search: shouldSearch,
                chat_id: activeChatId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.token) {
                            fullResponse += parsed.token;
                            if (responseSpan) responseSpan.textContent = fullResponse;
                            if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
                        } else if (parsed.error) {
                            console.error('Stream error:', parsed.error);
                            fullResponse = 'Error: ' + parsed.error;
                            if (responseSpan) responseSpan.textContent = fullResponse;
                        }
                    } catch (e) {
                        // Not JSON, ignore
                    }
                }
            }
        }
        
        const responseTime = (Date.now() - startTime) / 1000;
        
        // Finalize message
        if (messageDiv) messageDiv.classList.remove('streaming');
        
        messages.push({ sender: 'user', text });
        messages.push({ sender: 'assistant', text: fullResponse, mode: currentMode });
        
        // Update chat
        if (chats[activeChatId]) {
            chats[activeChatId].messages = messages;
            saveChats();
        }
        
        // Update stats
        trackMessage(responseTime);
        if (shouldSearch) trackSearch();
        
    } catch (error) {
        console.error('Streaming error:', error);
        if (responseSpan) responseSpan.textContent = 'Error getting response. Please try again.';
        if (messageDiv) messageDiv.classList.remove('streaming');
    } finally {
        isThinking = false;
        if (sendBtn) {
            sendBtn.disabled = false;
            sendBtn.classList.remove('loading');
        }
        if (typingIndicator) typingIndicator.style.display = 'none';
        if (inputSearchIndicator) inputSearchIndicator.style.display = 'none';
    }
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
    
    // If user is logged in, also save to server
    if (currentUser) {
        fetch(`${API_BASE_URL}/api/save-chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                chats: Object.values(chats),
                chat_order: chatIds
            })
        }).catch(e => console.error('Failed to save chats to server:', e));
    }
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
            
            // Load user data
            if (data.memories) {
                userStats.memories = data.memories.length;
            }
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
        if (userName) userName.textContent = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'User';
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
            
            // Load chats
            if (data.chats) {
                chats = {};
                data.chats.forEach(c => chats[c.chat_id] = c);
                chatIds = data.chat_order || ['default'];
                activeChatId = chatIds[0];
                messages = chats[activeChatId]?.messages || [];
            }
            
            // Load memories
            if (data.memories) {
                userStats.memories = data.memories.length;
            }
            
            updateUIForAuth();
            renderChatsList();
            renderMessages();
            updateStatsDisplay();
            
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
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/register/init`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        
        if (response.ok) {
            signupEmail = email;
            
            if (firstNameGroup) firstNameGroup.style.display = 'none';
            if (lastNameGroup) lastNameGroup.style.display = 'none';
            if (confirmPasswordGroup) confirmPasswordGroup.style.display = 'none';
            if (verificationGroup) verificationGroup.style.display = 'block';
            if (authSubmit) authSubmit.textContent = 'Verify Code';
            if (authModalTitle) authModalTitle.textContent = 'Verify Your Email';
            if (authError) {
                authError.textContent = `Code sent to ${email}`;
                authError.style.color = '#10b981';
            }
        } else {
            const error = await response.json();
            if (authError) authError.textContent = error.error || 'Signup failed';
        }
    } catch (error) {
        console.error('Signup error:', error);
        if (authError) authError.textContent = 'Connection error';
    }
}

async function handleVerify() {
    const code = verificationInput ? verificationInput.value.trim() : '';
    
    if (!code || code.length !== 6) {
        if (authError) authError.textContent = 'Enter 6-digit code';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/register/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email: signupEmail, code })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            
            if (data.chats) {
                chats = {};
                data.chats.forEach(c => chats[c.chat_id] = c);
                chatIds = data.chat_order || ['default'];
                activeChatId = chatIds[0];
                messages = chats[activeChatId]?.messages || [];
            }
            
            updateUIForAuth();
            renderChatsList();
            renderMessages();
            
            if (authModal) closeModal(authModal);
            showNotification('Account verified! Welcome!', 'success');
        } else {
            const error = await response.json();
            if (authError) authError.textContent = error.error || 'Verification failed';
        }
    } catch (error) {
        console.error('Verify error:', error);
        if (authError) authError.textContent = 'Connection error';
    }
}

async function resendVerificationCode() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/resend-code`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            if (authError) {
                authError.textContent = 'Code resent!';
                authError.style.color = '#10b981';
            }
        } else {
            if (authError) authError.textContent = 'Failed to resend';
        }
    } catch (error) {
        console.error('Resend error:', error);
        if (authError) authError.textContent = 'Connection error';
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    currentUser = null;
    updateUIForAuth();
    loadGuestData();
    showNotification('Logged out', 'success');
}

function loadGuestData() {
    const saved = localStorage.getItem('wizard_guest_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userStats = data.stats || userStats;
            updateStatsDisplay();
        } catch (e) {}
    }
}

// ============================================
// MEMORY FUNCTIONS
// ============================================
async function loadMemories() {
    if (!currentUser) {
        showNotification('Login to view memories', 'error');
        return;
    }
    
    if (memoryModal) openModal(memoryModal);
    if (memoryList) memoryList.innerHTML = '<div class="loading">Loading memories...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/memory`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const memories = data.memories || [];
            
            userStats.memories = memories.length;
            updateStatsDisplay();
            
            if (memoryList) {
                if (memories.length === 0) {
                    memoryList.innerHTML = '<div class="empty-state">No memories yet. Tell me about yourself!</div>';
                } else {
                    let html = '';
                    memories.forEach(m => {
                        html += `
                            <div class="memory-item">
                                <div class="memory-key">${escapeHtml(m.key)}</div>
                                <div class="memory-value">${escapeHtml(m.value)}</div>
                                <span class="memory-category">${escapeHtml(m.category)}</span>
                            </div>
                        `;
                    });
                    memoryList.innerHTML = html;
                }
            }
        } else {
            if (memoryList) memoryList.innerHTML = '<div class="error">Failed to load memories</div>';
        }
    } catch (error) {
        console.error('Error loading memories:', error);
        if (memoryList) memoryList.innerHTML = '<div class="error">Error loading memories</div>';
    }
}

// ============================================
// PUBLIC PERSONALITIES
// ============================================
async function loadPublicPersonalities() {
    if (!personalitiesList) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/personalities`);
        if (response.ok) {
            const data = await response.json();
            publicPersonalities = data;
            
            if (publicPersonalities.length === 0) {
                personalitiesList.innerHTML = '<div class="empty-state">No public personalities yet</div>';
            } else {
                let html = '';
                publicPersonalities.slice(0, 5).forEach(p => {
                    html += `
                        <div class="personality-item" data-id="${p.id}">
                            <span class="personality-emoji">${p.emoji || '🤖'}</span>
                            <span class="personality-name">${p.name}</span>
                            <span class="personality-likes">❤️ ${p.likes || 0}</span>
                        </div>
                    `;
                });
                personalitiesList.innerHTML = html;
                
                // Add click handlers
                document.querySelectorAll('.personality-item').forEach(el => {
                    el.addEventListener('click', () => usePersonality(el.dataset.id));
                });
            }
        }
    } catch (error) {
        console.error('Failed to load personalities:', error);
        personalitiesList.innerHTML = '<div class="error">Failed to load</div>';
    }
}

async function usePersonality(id) {
    const personality = publicPersonalities.find(p => p.id == id);
    
    if (personality) {
        // Track usage
        try {
            await fetch(`${API_BASE_URL}/api/personalities/${id}/use`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (e) {
            console.error('Failed to track usage:', e);
        }
        
        // Add to mode data temporarily
        modeData[personality.name] = {
            emoji: personality.emoji || '🤖',
            name: personality.name,
            desc: 'Custom personality',
            model: 'Custom',
            color: '#8b5cf6'
        };
        
        selectMode(personality.name);
        showNotification(`Switched to ${personality.name}`, 'success');
    }
}

async function openPersonalitiesBrowser() {
    if (personalitiesModal) openModal(personalitiesModal);
    await loadPersonalitiesGrid('featured');
}

async function loadPersonalitiesGrid(tab = 'featured') {
    if (!personalitiesGrid) return;
    
    personalitiesGrid.innerHTML = '<div class="loading">Loading personalities...</div>';
    
    try {
        let url = `${API_BASE_URL}/api/personalities`;
        if (tab === 'featured') url += '/featured';
        else if (tab === 'popular') url += '/popular';
        else if (tab === 'recent') url += '/recent';
        else if (tab === 'mine' && currentUser) url += '/mine';
        
        const response = await fetch(url, { credentials: 'include' });
        if (response.ok) {
            const personalities = await response.json();
            renderPersonalitiesGrid(personalities);
        } else {
            personalitiesGrid.innerHTML = '<div class="error">Failed to load</div>';
        }
    } catch (error) {
        console.error('Failed to load personalities:', error);
        personalitiesGrid.innerHTML = '<div class="error">Failed to load</div>';
    }
}

function renderPersonalitiesGrid(personalities) {
    if (!personalitiesGrid) return;
    
    if (personalities.length === 0) {
        personalitiesGrid.innerHTML = '<div class="empty-state">No personalities found</div>';
        return;
    }
    
    let html = '';
    personalities.forEach(p => {
        html += `
            <div class="personality-card" data-id="${p.id}">
                <div class="personality-card-header">
                    <span class="personality-card-emoji">${p.emoji || '🤖'}</span>
                    <span class="personality-card-name">${p.name}</span>
                </div>
                <div class="personality-card-creator">by ${p.creator || 'Anonymous'}</div>
                <div class="personality-card-stats">
                    <span class="personality-card-likes">❤️ ${p.likes || 0}</span>
                    <span class="personality-card-uses">🔄 ${p.uses || 0}</span>
                </div>
            </div>
        `;
    });
    
    personalitiesGrid.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.personality-card').forEach(el => {
        el.addEventListener('click', () => usePersonality(el.dataset.id));
    });
}

function switchPersonalityTab(tab) {
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
    }
    loadPersonalitiesGrid(tab);
}

// ============================================
// FILE UPLOAD
// ============================================
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!currentUser) {
        showNotification('Please login to upload files', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chat_id', activeChatId);
    
    // Show progress bar
    if (uploadProgress) uploadProgress.style.display = 'block';
    if (progressBarFill) progressBarFill.style.width = '0%';
    if (progressText) progressText.textContent = 'Starting upload...';
    
    try {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                if (progressBarFill) progressBarFill.style.width = percent + '%';
                if (progressText) progressText.textContent = `Uploading: ${Math.round(percent)}%`;
            }
        });
        
        const promise = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
                else reject(new Error('Upload failed'));
            };
            xhr.onerror = () => reject(new Error('Upload failed'));
        });
        
        xhr.open('POST', `${API_BASE_URL}/api/upload`);
        xhr.withCredentials = true;
        xhr.send(formData);
        
        const data = await promise;
        
        setTimeout(() => {
            if (uploadProgress) uploadProgress.style.display = 'none';
        }, 1000);
        
        if (data.success) {
            trackFile();
            if (data.duplicate) {
                showNotification(`File already exists: ${data.filename}`, 'info');
            } else {
                showNotification(`✅ ${file.name} uploaded!`, 'success');
                addMessage('assistant', `📎 File uploaded: ${data.filename}\n${data.preview || ''}`);
            }
        } else {
            showNotification(`❌ Upload failed: ${data.error || 'Unknown error'}`, 'error');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        if (uploadProgress) uploadProgress.style.display = 'none';
        showNotification('❌ Upload failed', 'error');
    }
}

// ============================================
// CODE EXECUTION
// ============================================
async function executeCode() {
    const code = codeInput ? codeInput.value.trim() : '';
    if (!code) return;
    
    if (!currentUser) {
        showNotification('Please login to execute code', 'error');
        return;
    }
    
    if (codeOutput) codeOutput.innerHTML = 'Running...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (data.error) {
            if (codeOutput) codeOutput.innerHTML = `<span class="error">❌ ${escapeHtml(data.error)}</span>`;
        } else {
            let html = '';
            if (data.stdout) html += `<pre class="stdout">${escapeHtml(data.stdout)}</pre>`;
            if (data.stderr) html += `<pre class="stderr">${escapeHtml(data.stderr)}</pre>`;
            if (!data.stdout && !data.stderr) html = 'No output';
            if (codeOutput) codeOutput.innerHTML = html;
            trackCode();
        }
    } catch (error) {
        console.error('Code execution error:', error);
        if (codeOutput) codeOutput.innerHTML = '<span class="error">❌ Execution failed</span>';
    }
}

// ============================================
// IMAGE GENERATION
// ============================================
async function generateImage() {
    const prompt = imagePrompt ? imagePrompt.value.trim() : '';
    if (!prompt) return;
    
    if (!currentUser) {
        showNotification('Please login to generate images', 'error');
        return;
    }
    
    if (imageResult) imageResult.innerHTML = '<div class="loading">Generating image...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ 
                prompt,
                size: imageSize?.value || '512x512'
            })
        });
        
        const data = await response.json();
        
        if (data.url) {
            if (imageResult) imageResult.innerHTML = `<img src="${data.url}" alt="${escapeHtml(prompt)}">`;
            trackImage();
        } else {
            if (imageResult) imageResult.innerHTML = '<div class="error">Generation failed</div>';
        }
    } catch (error) {
        console.error('Image generation error:', error);
        if (imageResult) imageResult.innerHTML = '<div class="error">Generation failed</div>';
    }
}

// ============================================
// DETAILED STATS
// ============================================
async function loadDetailedStats() {
    if (!currentUser) {
        showNotification('Login to view detailed stats', 'error');
        return;
    }
    
    if (statsModal) openModal(statsModal);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/stats`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            
            if (statsCreated) statsCreated.textContent = data.account_created || '-';
            if (statsLast) statsLast.textContent = data.last_login || '-';
            if (statsTotalMsgs) statsTotalMsgs.textContent = data.messages || 0;
            if (statsTotalChats) statsTotalChats.textContent = data.chats || 0;
            if (statsFilesDetail) statsFilesDetail.textContent = data.files || 0;
            if (statsImagesDetail) statsImagesDetail.textContent = data.images || 0;
            if (statsCode) statsCode.textContent = data.code || 0;
            if (statsSearchesDetail) statsSearchesDetail.textContent = data.searches || 0;
            if (statsMemoriesDetail) statsMemoriesDetail.textContent = data.memories || 0;
            if (statsDocs) statsDocs.textContent = data.documents || 0;
            if (statsAvgResponse) statsAvgResponse.textContent = (data.avg_response_time || 0.4) + 's';
            if (statsFastest) statsFastest.textContent = (data.fastest_response || 0.2) + 's';
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
        showNotification('Failed to load stats', 'error');
    }
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
    return String(unsafe)
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
    if (inputSearchIndicator) inputSearchIndicator.style.display = 'none';
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
