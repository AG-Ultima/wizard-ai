// ============================================
// WIZARD.AI PRO v9.5.0 - COMPLETE FRONTEND CONTROLLER
// FULLY REWRITTEN - FIXED MESSAGE OVERWRITING & AUTH
// Created by Arnav Gupta
// ============================================

const API_BASE_URL = 'https://arnav0928.pythonanywhere.com';
const SITE_URL = 'https://www.wizardai.dpdns.org';

// ============================================
// DOM ELEMENTS
// ============================================

const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-input-btn');
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');
const dropdown = document.getElementById('mode-dropdown');
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');
const selectedDisplay = document.getElementById('selected-mode-display');
const chatsList = document.getElementById('chats-list');
const newChatBtn = document.getElementById('new-chat-btn');
const currentChatName = document.getElementById('current-chat-name');
const currentChatEmoji = document.getElementById('current-chat-emoji');
const renameChatBtn = document.getElementById('rename-chat-btn');
const deleteChatBtn = document.getElementById('delete-chat-btn');
const resetCurrentBtn = document.getElementById('reset-current-btn');
const updateHistoryBtn = document.getElementById('update-history-btn');
const statMessages = document.getElementById('stat-messages');
const statFiles = document.getElementById('stat-files');
const statMemories = document.getElementById('stat-memories');
const statImages = document.getElementById('stat-images');
const statSearches = document.getElementById('stat-searches');
const statResponse = document.getElementById('stat-response');
const quickToday = document.getElementById('quick-today');
const quickTotal = document.getElementById('quick-total');
const searchBtn = document.getElementById('search-btn');
const uploadBtn = document.getElementById('upload-btn');
const codeBtn = document.getElementById('code-btn');
const imageBtn = document.getElementById('image-btn');
const memoryBtn = document.getElementById('memory-btn');
const statsBtn = document.getElementById('stats-btn');
const personalitiesBtn = document.getElementById('personalities-btn');
const apiKeysBtn = document.getElementById('api-keys-btn');
const searchIndicator = document.getElementById('search-indicator');
const inputSearchIndicator = document.getElementById('input-search-indicator');
const typingIndicator = document.getElementById('typing-indicator');
const uploadProgress = document.getElementById('upload-progress');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const authModal = document.getElementById('auth-modal-overlay');
const renameModal = document.getElementById('rename-modal-overlay');
const codeModal = document.getElementById('code-modal-overlay');
const imageModal = document.getElementById('image-modal-overlay');
const memoryModal = document.getElementById('memory-modal-overlay');
const statsModal = document.getElementById('stats-modal-overlay');
const personalitiesModal = document.getElementById('personalities-modal-overlay');
const apiKeysModal = document.getElementById('api-keys-modal-overlay');
const newKeyModal = document.getElementById('new-key-modal-overlay');
const updateModal = document.getElementById('update-modal-overlay');
const closeAuth = document.getElementById('close-auth-modal');
const closeRename = document.getElementById('close-rename-modal');
const closeCode = document.getElementById('close-code-modal');
const closeImage = document.getElementById('close-image-modal');
const closeMemory = document.getElementById('close-memory-modal');
const closeStats = document.getElementById('close-stats-modal');
const closePersonalities = document.getElementById('close-personalities-modal');
const closeApiKeys = document.getElementById('close-api-keys-modal');
const closeNewKey = document.getElementById('close-new-key-modal');
const closeUpdate = document.getElementById('close-update-modal');
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
const userInfo = document.getElementById('user-info');
const authButtons = document.getElementById('auth-buttons');
const userEmail = document.getElementById('user-email');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');
const logoutBtn = document.getElementById('logout-btn');
const toggleCreatorBtn = document.getElementById('toggle-creator-btn');
const creatorPanel = document.getElementById('creator-panel');
const customName = document.getElementById('custom-name');
const customEmoji = document.getElementById('custom-emoji');
const customPrompt = document.getElementById('custom-prompt');
const customGreeting = document.getElementById('custom-greeting');
const customPublic = document.getElementById('custom-public');
const savePersonality = document.getElementById('save-personality');
const cancelPersonality = document.getElementById('cancel-personality');
const closeCreator = document.getElementById('close-creator');
const personalitiesList = document.getElementById('personalities-list');
const personalitiesGrid = document.getElementById('personalities-grid');
const tabBtns = document.querySelectorAll('.tab-btn');
const fileUpload = document.getElementById('file-upload');
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const runCodeBtn = document.getElementById('run-code');
const clearCodeBtn = document.getElementById('clear-code');
const imagePrompt = document.getElementById('image-prompt');
const imageSize = document.getElementById('image-size');
const generateImageBtn = document.getElementById('generate-image');
const imageResult = document.getElementById('image-result');
const memoryList = document.getElementById('memory-list');
const statsCreated = document.getElementById('stats-created');
const statsLast = document.getElementById('stats-last');
const statsTotalMsgs = document.getElementById('stats-total-msgs');
const statsTotalChats = document.getElementById('stats-total-chats');
const statsFiles = document.getElementById('stats-files');
const statsImages = document.getElementById('stats-images');
const statsCode = document.getElementById('stats-code');
const statsSearches = document.getElementById('stats-searches');
const statsMemories = document.getElementById('stats-memories');
const statsDocs = document.getElementById('stats-docs');
const statsAvgResponse = document.getElementById('stats-avg-response');
const statsFastest = document.getElementById('stats-fastest');
const statsApiKeys = document.getElementById('stats-api-keys');
const statsApiRequests = document.getElementById('stats-api-requests');
const renameInput = document.getElementById('rename-input');
const renameSave = document.getElementById('modal-save');
const renameCancel = document.getElementById('modal-cancel');
const notificationToast = document.getElementById('notification-toast');
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
let signupEmail = '';
let sessionCheckInterval = null;
let voiceRecognition = null;
let isVoiceListening = false;
let chatToRename = null;
let userStats = {
    messages: 0, files: 0, memories: 0, images: 0, searches: 0,
    codeExecutions: 0, responseTimes: [], todayMessages: 0
};

// ============================================
// MODE DATA
// ============================================
const modeData = {
    'Fast': { emoji: '⚡', name: 'Fast Mode', desc: 'Lightning quick responses.', model: 'Llama 3.1 8B', color: '#10b981' },
    'Normal': { emoji: '✨', name: 'Normal Mode', desc: 'Balanced conversation.', model: 'Llama 3.1 8B', color: '#10b981' },
    'Fun': { emoji: '🎉', name: 'Fun Mode', desc: 'Playful and energetic!', model: 'Llama 3.3 70B', color: '#8b5cf6' },
    'Sarcastic': { emoji: '😏', name: 'Sarcastic Mode', desc: 'Witty and sarcastic.', model: 'Llama 3.1 8B', color: '#10b981' },
    'Nerd': { emoji: '🧠', name: 'Nerd Mode', desc: 'Detailed and academic.', model: 'Llama 3.3 70B', color: '#8b5cf6' },
    'JARVIS': { emoji: '🎩', name: 'JARVIS Mode', desc: 'Sophisticated AI assistant.', model: 'Llama 3.1 8B', color: '#00aaff' },
    'ORACLE': { emoji: '🔮', name: 'ORACLE Mode', desc: 'Mystical and all-knowing.', model: 'Llama 3.3 70B', color: '#8b5cf6' }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initializing Wizard.AI v9.5.0...');
    showNotification('🧙 Summoning the Wizard...', 'info', 2000);
    registerServiceWorker();
    setupEventListeners();
    setupDropdown();
    setupModals();
    initVoiceRecognition();
    loadGuestData();
    await checkAuth();
    if (currentUser) startSessionCheck();
    loadCustomPersonalities();
    loadChats();
    await loadStats();
    loadPublicPersonalities();
    setInterval(updateStatsDisplay, 30000);
    checkBackendStatus();
    console.log('✅ Wizard.AI v9.5.0 ready!');
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker error:', err));
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function openModal(modal) {
    if (modal) modal.classList.add('active');
}

function closeModal(modal) {
    if (modal) modal.classList.remove('active');
}

function showNotification(message, type = 'info', duration = 3000) {
    if (!notificationToast) return;
    notificationToast.textContent = message;
    notificationToast.className = 'notification-toast show';
    if (type === 'success') notificationToast.classList.add('success');
    if (type === 'error') notificationToast.classList.add('error');
    setTimeout(() => notificationToast.classList.remove('show'), duration);
}

function emergencyReset() {
    isThinking = false;
    if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
    }
    if (typingIndicator) typingIndicator.style.display = 'none';
    if (chatInput) chatInput.disabled = false;
    if (chatInput) chatInput.focus();
    if (inputSearchIndicator) inputSearchIndicator.style.display = 'none';
    showNotification('⚠️ Emergency reset activated', 'warning', 3000);
}

function setupModals() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                closeModal(modal);
            });
        }
    });
}

// ============================================
// BACKEND STATUS
// ============================================
async function checkBackendStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (response.ok) {
            statusText.textContent = 'Connected';
            statusDot.classList.remove('offline');
        } else {
            statusText.textContent = 'Offline';
            statusDot.classList.add('offline');
        }
    } catch (error) {
        statusText.textContent = 'Offline Mode';
        statusDot.classList.add('offline');
    }
}

// ============================================
// DROPDOWN SETUP
// ============================================
function setupDropdown() {
    if (!dropdownContent) return;
    dropdownContent.innerHTML = '';
    Object.keys(modeData).forEach(mode => {
        dropdownContent.appendChild(createDropdownItem(mode, modeData[mode].emoji, false));
    });
    updateCustomPersonalitiesDropdown();
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });
    }
    document.addEventListener('click', e => {
        if (!dropdown.contains(e.target)) dropdown.classList.remove('open');
    });
}

function createDropdownItem(mode, emoji, isCustom = false) {
    const item = document.createElement('div');
    item.className = `dropdown-item ${mode === currentMode ? 'selected' : ''} ${isCustom ? 'custom' : ''}`;
    item.setAttribute('data-mode', mode);
    item.innerHTML = `<span style="font-size: 18px;">${emoji}</span><span>${mode}</span>`;
    item.addEventListener('mouseenter', e => showTooltip(mode, e));
    item.addEventListener('mouseleave', hideTooltip);
    item.addEventListener('click', () => selectMode(mode));
    return item;
}

function selectMode(mode) {
    currentMode = mode;
    updateModeDisplay();
    if (dropdown) dropdown.classList.remove('open');
    hideTooltip();
    if (chats[activeChatId]) chats[activeChatId].mode = mode;
    saveChats();
    showNotification(`Switched to ${mode} mode`, 'info');
}

function updateModeDisplay() {
    const mode = modeData[currentMode] || customPersonalities.find(p => p.name === currentMode) || { emoji: '🎩', name: currentMode };
    if (selectedDisplay) selectedDisplay.innerHTML = `${mode.emoji || '🤖'} ${currentMode}`;
    document.querySelectorAll('.dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.mode === currentMode);
    });
}

// ============================================
// TOOLTIP SYSTEM
// ============================================
let tooltipEl = null;

function createTooltip() {
    if (tooltipEl) return;
    tooltipEl = document.createElement('div');
    tooltipEl.style.cssText = `position:fixed; display:none; z-index:10000; background:linear-gradient(135deg,#1a1035,#0d0a1f); border:2px solid #8b5cf6; border-radius:12px; padding:12px 16px; max-width:280px; box-shadow:0 0 30px rgba(139,92,246,0.5); backdrop-filter:blur(10px); color:white; font-size:13px; pointer-events:none; border-left:4px solid #8b5cf6;`;
    document.body.appendChild(tooltipEl);
}

function showTooltip(modeKey, event) {
    if (!tooltipEl) createTooltip();
    const mode = modeData[modeKey] || customPersonalities.find(p => p.name === modeKey);
    if (!mode) return;
    tooltipEl.innerHTML = `<div style="display:flex; gap:12px;"><div style="font-size:32px;">${mode.emoji || '🤖'}</div><div><div style="font-weight:bold; color:${mode.color || '#8b5cf6'}; font-size:15px;">${mode.name || modeKey}</div><div style="color:#e0e7ff; font-size:12px; margin-top:4px;">${mode.desc || (mode.system_prompt ? mode.system_prompt.substring(0,100)+'...' : 'Custom personality')}</div><div style="color:#9ca3af; font-size:11px; margin-top:8px;">🧠 ${mode.model || 'Custom'}</div></div></div>`;
    const rect = event.target.getBoundingClientRect();
    tooltipEl.style.display = 'block';
    tooltipEl.style.left = `${rect.right + 15}px`;
    tooltipEl.style.top = `${rect.top}px`;
    const tooltipRect = tooltipEl.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth) tooltipEl.style.left = `${rect.left - tooltipRect.width - 15}px`;
}

function hideTooltip() {
    if (tooltipEl) tooltipEl.style.display = 'none';
}

// ============================================
// CUSTOM PERSONALITIES
// ============================================
function loadCustomPersonalities() {
    const saved = localStorage.getItem('wizard_custom_personalities');
    if (saved) {
        try {
            customPersonalities = JSON.parse(saved);
            updateCustomPersonalitiesDropdown();
        } catch (e) {}
    }
}

function saveCustomPersonalitiesToStorage() {
    localStorage.setItem('wizard_custom_personalities', JSON.stringify(customPersonalities));
}

function updateCustomPersonalitiesDropdown() {
    if (!dropdownContent) return;
    document.querySelectorAll('.dropdown-item.custom, .dropdown-separator').forEach(el => el.remove());
    if (customPersonalities.length > 0) {
        const sep = document.createElement('div');
        sep.className = 'dropdown-separator';
        sep.style.cssText = 'padding:8px 15px; color:#9ca3af; font-size:11px; text-transform:uppercase; letter-spacing:1px; border-top:1px solid rgba(139,92,246,0.3); border-bottom:1px solid rgba(139,92,246,0.3); background:rgba(0,0,0,0.2);';
        sep.textContent = '✨ CUSTOM PERSONALITIES';
        dropdownContent.appendChild(sep);
        customPersonalities.forEach(p => {
            dropdownContent.appendChild(createDropdownItem(p.name, p.emoji || '🤖', true));
        });
    }
}

function toggleCreatorPanel() {
    if (!creatorPanel) return;
    creatorPanel.style.display = creatorPanel.style.display === 'none' ? 'block' : 'none';
    if (toggleCreatorBtn) {
        const span = toggleCreatorBtn.querySelector('.btn-icon');
        if (span) span.textContent = creatorPanel.style.display === 'block' ? '➖' : '➕';
    }
}

function closeCreatorPanel() {
    if (!creatorPanel) return;
    creatorPanel.style.display = 'none';
    if (toggleCreatorBtn) {
        const span = toggleCreatorBtn.querySelector('.btn-icon');
        if (span) span.textContent = '➕';
    }
    clearCreatorForm();
}

function clearCreatorForm() {
    if (customName) customName.value = '';
    if (customEmoji) customEmoji.value = '';
    if (customPrompt) customPrompt.value = '';
    if (customGreeting) customGreeting.value = '';
    if (customPublic) customPublic.checked = true;
}

async function saveCustomPersonality() {
    if (!currentUser) {
        showNotification('Please login to create personalities', 'error');
        return;
    }
    const name = customName.value.trim();
    const emoji = customEmoji.value.trim() || '🤖';
    const prompt = customPrompt.value.trim();
    const greeting = customGreeting.value.trim() || `Hello! I'm ${name}.`;
    const isPublic = customPublic.checked;
    if (!name || !prompt) {
        showNotification('Name and prompt are required', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/personalities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, emoji, prompt, greeting, is_public: isPublic })
        });
        if (response.ok) {
            const personality = await response.json();
            customPersonalities.push({
                name: personality.name,
                emoji: personality.emoji,
                system_prompt: personality.system_prompt,
                greeting: personality.greeting,
                id: personality.id
            });
            saveCustomPersonalitiesToStorage();
            updateCustomPersonalitiesDropdown();
            showNotification('Personality created!', 'success');
            closeCreatorPanel();
        } else {
            const error = await response.json();
            showNotification(error.error || 'Failed to create personality', 'error');
        }
    } catch (error) {
        showNotification('Error creating personality', 'error');
    }
}

// ============================================
// VOICE RECOGNITION
// ============================================
function initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        if (voiceBtn) voiceBtn.style.display = 'none';
        return;
    }
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
    voiceRecognition.onresult = e => {
        const transcript = e.results[0][0].transcript;
        if (chatInput) chatInput.value = transcript;
        showNotification(`🎤 "${transcript}"`, 'success');
        setTimeout(() => sendMessage(), 500);
    };
    voiceRecognition.onerror = e => {
        isVoiceListening = false;
        if (voiceBtn) voiceBtn.classList.remove('listening');
        showNotification(`Voice error: ${e.error}`, 'error');
    };
}

function toggleVoiceInput() {
    if (!voiceRecognition) {
        initVoiceRecognition();
        if (!voiceRecognition) return;
    }
    if (isVoiceListening) voiceRecognition.stop();
    else voiceRecognition.start();
}

// ============================================
// TURBO & SEARCH MODES
// ============================================
function toggleTurboMode() {
    turboMode = !turboMode;
    if (turboBtn) turboBtn.classList.toggle('active', turboMode);
    if (turboStatus) turboStatus.textContent = turboMode ? 'ON' : 'OFF';
    showNotification(`Turbo mode ${turboMode ? 'activated' : 'deactivated'}`, 'info');
}

function toggleSearchMode() {
    searchMode = !searchMode;
    if (searchBtn) searchBtn.classList.toggle('active', searchMode);
    showNotification(`Web search ${searchMode ? 'manual mode' : 'auto mode'}`, 'info');
}

function shouldAutoSearch(text) {
    const triggers = ['latest', 'news', 'current', 'today', 'now', '2024', '2025', '2026', 'recent', 'update', 'weather', 'stock', 'price', 'score', 'results', 'who is', 'what is', 'tell me about'];
    return triggers.some(t => text.toLowerCase().includes(t));
}

// ============================================
// CHAT MANAGEMENT - FIXED MESSAGE HANDLING
// ============================================
function createMessageElement(sender, text, mode = null) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    const icon = sender === 'user' ? '👤' : (modeData[mode]?.emoji || '🧙');
    msg.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${icon}</span>
            <span class="message-text">${escapeHtml(text)}</span>
        </div>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
    `;
    return msg;
}

function addMessage(sender, text, mode = null) {
    if (!chatHistory) return;
    const msgElement = createMessageElement(sender, text, mode);
    chatHistory.appendChild(msgElement);
    messages.push({
        sender: sender,
        text: text,
        mode: mode,
        timestamp: new Date().toISOString()
    });
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [...messages];
        saveChats();
    }
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function renderMessages() {
    if (!chatHistory) return;
    chatHistory.innerHTML = '';
    if (messages && messages.length > 0) {
        messages.forEach(msg => {
            const msgElement = createMessageElement(msg.sender, msg.text, msg.mode);
            chatHistory.appendChild(msgElement);
        });
    }
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function sendMessage() {
    if (isThinking) return;
    const text = chatInput.value.trim();
    if (!text) return;
    
    addMessage('user', text);
    chatInput.value = '';
    
    isThinking = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    if (typingIndicator) typingIndicator.style.display = 'flex';
    
    const shouldSearch = searchMode || shouldAutoSearch(text);
    if (shouldSearch && inputSearchIndicator) inputSearchIndicator.style.display = 'inline';
    
    const streamingMsgId = 'streaming-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.id = streamingMsgId;
    msgDiv.className = 'message wizard streaming';
    msgDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">${modeData[currentMode]?.emoji || '🧙'}</span>
            <span class="message-text" id="streaming-text-${streamingMsgId}"></span>
        </div>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
    `;
    chatHistory.appendChild(msgDiv);
    
    const respSpan = document.getElementById(`streaming-text-${streamingMsgId}`);
    let fullResponse = '';
    
    try {
        const start = Date.now();
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
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
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
                            if (respSpan) respSpan.textContent = fullResponse;
                            chatHistory.scrollTop = chatHistory.scrollHeight;
                        } else if (parsed.error) {
                            fullResponse = 'Error: ' + parsed.error;
                            if (respSpan) respSpan.textContent = fullResponse;
                        }
                    } catch (e) {}
                }
            }
        }
        
        const elapsed = (Date.now() - start) / 1000;
        msgDiv.classList.remove('streaming');
        
        messages.push({
            sender: 'assistant',
            text: fullResponse,
            mode: currentMode,
            timestamp: new Date().toISOString()
        });
        
        if (chats[activeChatId]) {
            chats[activeChatId].messages = [...messages];
            saveChats();
        }
        
        trackMessage(elapsed);
        if (shouldSearch) trackSearch();
        
    } catch (error) {
        console.error('Stream error:', error);
        if (respSpan) respSpan.textContent = 'Error getting response. Please try again.';
        msgDiv.classList.remove('streaming');
        messages.push({
            sender: 'assistant',
            text: 'Error getting response. Please try again.',
            mode: currentMode,
            timestamp: new Date().toISOString()
        });
        if (chats[activeChatId]) {
            chats[activeChatId].messages = [...messages];
            saveChats();
        }
    } finally {
        isThinking = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        if (typingIndicator) typingIndicator.style.display = 'none';
        if (inputSearchIndicator) inputSearchIndicator.style.display = 'none';
    }
}

function loadChats() {
    const saved = localStorage.getItem('wizard_chats');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            chats = data.chats || {};
            chatIds = data.chatIds || ['default'];
            activeChatId = data.activeChatId || 'default';
            if (chats[activeChatId]) {
                messages = chats[activeChatId].messages || [];
            } else {
                messages = [];
            }
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
            console.error('Error loading chats:', e);
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
        html += `<div class="chat-item ${id === activeChatId ? 'active' : ''}" data-chat-id="${id}">
            <span class="chat-emoji">${chat.emoji}</span>
            <span class="chat-name">${escapeHtml(chat.name)}</span>
            <div class="chat-item-actions">
                <button class="rename-chat-item" data-chat-id="${id}" title="Rename">✏️</button>
                ${id !== 'default' ? `<button class="delete-chat-item" data-chat-id="${id}" title="Delete">🗑️</button>` : ''}
            </div>
        </div>`;
    });
    chatsList.innerHTML = html;
    
    document.querySelectorAll('.chat-item').forEach(el => {
        el.addEventListener('click', e => {
            if (!e.target.closest('button')) switchChat(el.dataset.chatId);
        });
    });
    document.querySelectorAll('.rename-chat-item').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            openRenameModal(btn.dataset.chatId);
        });
    });
    document.querySelectorAll('.delete-chat-item').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            deleteChat(btn.dataset.chatId);
        });
    });
}

function switchChat(id) {
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [...messages];
    }
    activeChatId = id;
    if (chats[id]) {
        messages = chats[id].messages ? [...chats[id].messages] : [];
        currentMode = chats[id].mode || 'JARVIS';
        updateModeDisplay();
    } else {
        messages = [];
        currentMode = 'JARVIS';
    }
    renderMessages();
    renderChatsList();
    if (currentChatName) currentChatName.textContent = chats[id]?.name || 'Chat';
    if (currentChatEmoji) currentChatEmoji.textContent = chats[id]?.emoji || '💬';
    saveChats();
}

function createNewChat() {
    const id = 'chat_' + Date.now();
    const name = `Chat ${chatIds.length + 1}`;
    const emojis = ['💬', '🤖', '🌟', '⭐', '✨', '🎯', '🎲'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    chats[id] = {
        chat_id: id,
        name: name,
        emoji: emoji,
        mode: 'JARVIS',
        messages: []
    };
    chatIds.push(id);
    saveChats();
    renderChatsList();
    switchChat(id);
}

function deleteChat(id) {
    if (id === 'default') {
        showNotification('Cannot delete default chat', 'error');
        return;
    }
    if (!confirm('Delete this chat?')) return;
    delete chats[id];
    chatIds = chatIds.filter(i => i !== id);
    if (activeChatId === id) {
        switchChat('default');
    }
    saveChats();
    renderChatsList();
    showNotification('Chat deleted', 'success');
}

function openRenameModal(id) {
    chatToRename = id;
    renameInput.value = chats[id]?.name || '';
    openModal(renameModal);
}

function saveRename() {
    const newName = renameInput.value.trim();
    if (newName && chatToRename && chats[chatToRename]) {
        chats[chatToRename].name = newName;
        saveChats();
        renderChatsList();
        if (chatToRename === activeChatId && currentChatName) {
            currentChatName.textContent = newName;
        }
        showNotification('Chat renamed', 'success');
    }
    closeModal(renameModal);
}

function resetCurrentChat() {
    if (confirm('Clear all messages in this chat?')) {
        messages = [];
        if (chats[activeChatId]) {
            chats[activeChatId].messages = [];
        }
        renderMessages();
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
// STATS FUNCTIONS
// ============================================
function trackMessage(rt) {
    userStats.messages++;
    userStats.todayMessages++;
    if (rt) {
        userStats.responseTimes.push(rt);
        if (userStats.responseTimes.length > 100) userStats.responseTimes.shift();
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

function updateStatsDisplay() {
    if (statMessages) statMessages.textContent = userStats.messages;
    if (statFiles) statFiles.textContent = userStats.files;
    if (statMemories) statMemories.textContent = userStats.memories;
    if (statImages) statImages.textContent = userStats.images;
    if (statSearches) statSearches.textContent = userStats.searches;
    const avg = userStats.responseTimes.length ? (userStats.responseTimes.reduce((a,b)=>a+b,0)/userStats.responseTimes.length).toFixed(1) : '0.4';
    if (statResponse) statResponse.textContent = avg + 's';
    if (quickToday) quickToday.textContent = userStats.todayMessages + ' msgs';
    if (quickTotal) quickTotal.textContent = userStats.messages + ' msgs';
}

async function loadStats() {
    if (currentUser) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                userStats.messages = data.messages || 0;
                userStats.files = data.files || 0;
                userStats.memories = data.memories || 0;
                userStats.images = data.images || 0;
                userStats.searches = data.searches || 0;
                userStats.codeExecutions = data.code || 0;
                if (statsCreated) statsCreated.textContent = data.account_created || '-';
                if (statsLast) statsLast.textContent = data.last_login || '-';
                if (statsTotalMsgs) statsTotalMsgs.textContent = data.messages || 0;
                if (statsTotalChats) statsTotalChats.textContent = data.chats || 0;
                if (statsFiles) statsFiles.textContent = data.files || 0;
                if (statsImages) statsImages.textContent = data.images || 0;
                if (statsCode) statsCode.textContent = data.code || 0;
                if (statsSearches) statsSearches.textContent = data.searches || 0;
                if (statsMemories) statsMemories.textContent = data.memories || 0;
                if (statsDocs) statsDocs.textContent = data.documents || 0;
                if (statsAvgResponse) statsAvgResponse.textContent = (data.avg_response_time || 0.4) + 's';
                if (statsFastest) statsFastest.textContent = (data.fastest_response || 0.2) + 's';
                if (statsApiKeys) statsApiKeys.textContent = data.api_keys || 0;
            }
        } catch (error) {
            loadStatsFromStorage();
        }
    } else {
        loadStatsFromStorage();
    }
    updateStatsDisplay();
}

function loadStatsFromStorage() {
    const saved = localStorage.getItem('wizard_stats');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userStats = { ...userStats, ...data };
        } catch (e) {}
    }
}

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

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/check-auth`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateUIForAuth();
            if (data.memories) userStats.memories = data.memories.length;
            loadUserPersonalitiesFromServer();
        } else {
            updateUIForAuth();
        }
    } catch (error) {
        updateUIForAuth();
    }
}

async function loadUserPersonalitiesFromServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/personalities/mine`, { credentials: 'include' });
        if (response.ok) {
            const personalities = await response.json();
            customPersonalities = personalities.map(p => ({
                name: p.name,
                emoji: p.emoji,
                system_prompt: p.system_prompt,
                greeting: p.greeting,
                id: p.id,
                likes: p.likes,
                uses: p.uses
            }));
            saveCustomPersonalitiesToStorage();
            updateCustomPersonalitiesDropdown();
        }
    } catch (error) {}
}

function updateUIForAuth() {
    if (currentUser && userInfo && authButtons) {
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
        userEmail.textContent = currentUser.email;
        userName.textContent = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'User';
        userAvatar.textContent = currentUser.first_name?.[0] || '👤';
    } else if (userInfo && authButtons) {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

function showAuthModal(login = true) {
    isLoginMode = login;
    authModalTitle.textContent = login ? 'Login to Wizard.AI' : 'Create Account';
    authSubmit.textContent = login ? 'Login' : 'Sign Up';
    authSwitchText.textContent = login ? "Don't have an account?" : "Already have an account?";
    authSwitchBtn.textContent = login ? 'Sign Up' : 'Login';
    firstNameGroup.style.display = login ? 'none' : 'block';
    lastNameGroup.style.display = login ? 'none' : 'block';
    confirmPasswordGroup.style.display = login ? 'none' : 'block';
    verificationGroup.style.display = 'none';
    authEmail.value = '';
    authPassword.value = '';
    authConfirm.value = '';
    firstNameInput.value = '';
    lastNameInput.value = '';
    authError.textContent = '';
    openModal(authModal);
}

function toggleAuthMode() {
    showAuthModal(!isLoginMode);
}

async function handleAuthSubmit() {
    if (isLoginMode) {
        await handleLogin();
    } else if (verificationGroup.style.display === 'block') {
        await handleVerify();
    } else {
        await handleSignup();
    }
}

async function handleLogin() {
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    if (!email || !password) {
        authError.textContent = 'Email and password required';
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
            if (data.chats) {
                chats = {};
                data.chats.forEach(c => chats[c.chat_id] = c);
                chatIds = data.chat_order || ['default'];
                activeChatId = chatIds[0];
                messages = chats[activeChatId]?.messages || [];
            }
            if (data.memories) userStats.memories = data.memories.length;
            updateUIForAuth();
            renderChatsList();
            renderMessages();
            updateStatsDisplay();
            loadUserPersonalitiesFromServer();
            closeModal(authModal);
            showNotification(`Welcome back, ${currentUser.first_name || ''}!`, 'success');
        } else {
            const error = await response.json();
            authError.textContent = error.error || 'Login failed';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
    }
}

async function handleSignup() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    const confirm = authConfirm.value.trim();
    if (!firstName || !lastName || !email || !password || !confirm) {
        authError.textContent = 'All fields required';
        return;
    }
    if (password !== confirm) {
        authError.textContent = 'Passwords do not match';
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
            const data = await response.json();
            signupEmail = email;
            if (data.pending_id) {
                localStorage.setItem('wizard_pending_id', data.pending_id);
                console.log('✅ Stored pending_id in localStorage:', data.pending_id);
            }
            firstNameGroup.style.display = 'none';
            lastNameGroup.style.display = 'none';
            confirmPasswordGroup.style.display = 'none';
            verificationGroup.style.display = 'block';
            authSubmit.textContent = 'Verify Code';
            authModalTitle.textContent = 'Verify Your Email';
            if (authError) {
                if (data.dev_code) {
                    authError.textContent = `🔐 Development code: ${data.dev_code}`;
                    authError.style.color = '#10b981';
                } else {
                    authError.textContent = `📧 Verification code sent to ${email}`;
                    authError.style.color = '#10b981';
                }
            }
            showNotification('📧 Verification code sent!', 'success');
        } else {
            const error = await response.json();
            authError.textContent = error.error || 'Signup failed';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
    }
}

async function handleVerify() {
    const code = verificationInput.value.trim();
    if (!code || code.length !== 6) {
        authError.textContent = 'Enter 6-digit code';
        return;
    }
    const pendingId = localStorage.getItem('wizard_pending_id');
    try {
        const response = await fetch(`${API_BASE_URL}/api/register/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: signupEmail,
                code: code,
                pending_id: pendingId
            })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.removeItem('wizard_pending_id');
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
            closeModal(authModal);
            showNotification('Account verified! Welcome!', 'success');
        } else {
            if (authError) authError.textContent = data.error || 'Verification failed';
        }
    } catch (error) {
        console.error('Verify error:', error);
        if (authError) authError.textContent = 'Connection error';
    }
}

async function resendVerificationCode() {
    const pendingId = localStorage.getItem('wizard_pending_id');
    try {
        const response = await fetch(`${API_BASE_URL}/api/resend-code`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pending_id: pendingId })
        });
        const data = await response.json();
        if (response.ok) {
            if (authError) {
                if (data.dev_code) {
                    authError.textContent = `🔐 New code: ${data.dev_code}`;
                } else {
                    authError.textContent = 'Verification code resent! Check your email.';
                }
                authError.style.color = '#10b981';
            }
            showNotification('📧 Code resent!', 'success');
        } else {
            const error = await response.json();
            if (authError) authError.textContent = error.error || 'Failed to resend code';
        }
    } catch (error) {
        console.error('Resend error:', error);
        if (authError) authError.textContent = 'Connection error';
    }
}

async function handleLogout() {
    try {
        await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
    } catch (error) {}
    localStorage.removeItem('wizard_pending_id');
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

function startSessionCheck() {
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    sessionCheckInterval = setInterval(async () => {
        if (currentUser) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/check-auth`, { credentials: 'include' });
                if (response.status === 401) {
                    currentUser = null;
                    updateUIForAuth();
                    showNotification('Your session has expired. Please log in again.', 'warning');
                    setTimeout(() => showAuthModal(true), 1000);
                }
            } catch (error) {}
        }
    }, 300000);
}

function stopSessionCheck() {
    if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
        sessionCheckInterval = null;
    }
}

function handleApiKeysClick() {
    if (!currentUser) {
        showNotification('Please log in to manage API keys', 'error');
        showAuthModal(true);
        return;
    }
    window.location.href = `${SITE_URL}/api-keys/`;
}

// ============================================
// MEMORY FUNCTIONS
// ============================================
async function loadMemories() {
    if (!currentUser) {
        showNotification('Login to view memories', 'error');
        return;
    }
    openModal(memoryModal);
    memoryList.innerHTML = '<div class="loading">Loading memories...</div>';
    try {
        const response = await fetch(`${API_BASE_URL}/api/memory`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            const memoriesData = data.memories || [];
            userStats.memories = memoriesData.length;
            updateStatsDisplay();
            if (memoriesData.length === 0) {
                memoryList.innerHTML = '<div class="empty-state">No memories yet. Tell me about yourself!</div>';
            } else {
                let html = '';
                memoriesData.forEach(m => {
                    html += `<div class="memory-item"><div class="memory-key">${escapeHtml(m.key)}</div><div class="memory-value">${escapeHtml(m.value)}</div><span class="memory-category">${escapeHtml(m.category)}</span></div>`;
                });
                memoryList.innerHTML = html;
            }
        } else {
            memoryList.innerHTML = '<div class="error">Failed to load memories</div>';
        }
    } catch (error) {
        memoryList.innerHTML = '<div class="error">Error loading memories</div>';
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
                    html += `<div class="personality-item" data-id="${p.id}"><span class="personality-emoji">${p.emoji || '🤖'}</span><span class="personality-name">${p.name}</span><span class="personality-likes">❤️ ${p.likes || 0}</span></div>`;
                });
                personalitiesList.innerHTML = html;
                document.querySelectorAll('.personality-item').forEach(el => {
                    el.addEventListener('click', () => usePersonality(el.dataset.id));
                    el.addEventListener('mouseenter', e => {
                        const p = publicPersonalities.find(p => p.id == el.dataset.id);
                        if (p) showTooltip(p.name, e);
                    });
                    el.addEventListener('mouseleave', hideTooltip);
                });
            }
        }
    } catch (error) {
        personalitiesList.innerHTML = '<div class="error">Failed to load</div>';
    }
}

async function usePersonality(id) {
    const personality = publicPersonalities.find(p => p.id == id);
    if (!personality) return;
    try {
        await fetch(`${API_BASE_URL}/api/personalities/${id}/use`, { method: 'POST', credentials: 'include' });
    } catch (e) {}
    if (!modeData[personality.name]) {
        modeData[personality.name] = {
            emoji: personality.emoji || '🤖',
            name: personality.name,
            desc: personality.system_prompt ? personality.system_prompt.substring(0, 100) + '...' : 'Custom personality',
            model: 'Custom',
            color: '#8b5cf6',
            likes: personality.likes,
            uses: personality.uses
        };
    }
    selectMode(personality.name);
    showNotification(`Switched to ${personality.name}`, 'success');
}

async function openPersonalitiesBrowser() {
    openModal(personalitiesModal);
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
        html += `<div class="personality-card" data-id="${p.id}">
            <div class="personality-card-header">
                <span class="personality-card-emoji">${p.emoji || '🤖'}</span>
                <span class="personality-card-name">${p.name}</span>
            </div>
            <div class="personality-card-creator">by ${p.creator || 'Anonymous'}</div>
            <div class="personality-card-stats">
                <span class="personality-card-likes">❤️ ${p.likes || 0}</span>
                <span class="personality-card-uses">🔄 ${p.uses || 0}</span>
            </div>
        </div>`;
    });
    personalitiesGrid.innerHTML = html;
    document.querySelectorAll('.personality-card').forEach(el => {
        el.addEventListener('click', () => usePersonality(el.dataset.id));
        el.addEventListener('mouseenter', e => {
            const p = personalities.find(p => p.id == el.dataset.id);
            if (p) showTooltip(p.name, e);
        });
        el.addEventListener('mouseleave', hideTooltip);
    });
}

function switchPersonalityTab(tab) {
    if (tabBtns.length) tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
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
    uploadProgress.style.display = 'block';
    progressBarFill.style.width = '0%';
    progressText.textContent = 'Starting upload...';
    try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
                const pct = (e.loaded / e.total) * 100;
                progressBarFill.style.width = pct + '%';
                progressText.textContent = `Uploading: ${Math.round(pct)}%`;
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
        setTimeout(() => { uploadProgress.style.display = 'none'; }, 1000);
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
        uploadProgress.style.display = 'none';
        showNotification('❌ Upload failed', 'error');
    }
}

// ============================================
// CODE EXECUTION
// ============================================
async function executeCode() {
    const code = codeInput.value.trim();
    if (!code) return;
    if (!currentUser) {
        showNotification('Please login to execute code', 'error');
        return;
    }
    codeOutput.innerHTML = 'Running...';
    try {
        const response = await fetch(`${API_BASE_URL}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ code })
        });
        const data = await response.json();
        if (data.error) {
            codeOutput.innerHTML = `<span class="error">❌ ${escapeHtml(data.error)}</span>`;
        } else {
            let html = '';
            if (data.stdout) html += `<pre class="stdout">${escapeHtml(data.stdout)}</pre>`;
            if (data.stderr) html += `<pre class="stderr">${escapeHtml(data.stderr)}</pre>`;
            if (!data.stdout && !data.stderr) html = 'No output';
            codeOutput.innerHTML = html;
            trackCode();
        }
    } catch (error) {
        codeOutput.innerHTML = '<span class="error">❌ Execution failed</span>';
    }
}

// ============================================
// IMAGE GENERATION
// ============================================
async function generateImage() {
    const prompt = imagePrompt.value.trim();
    if (!prompt) return;
    if (!currentUser) {
        showNotification('Please login to generate images', 'error');
        return;
    }
    imageResult.innerHTML = '<div class="loading">Generating image...</div>';
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ prompt, size: imageSize?.value || '512x512' })
        });
        const data = await response.json();
        if (data.url) {
            imageResult.innerHTML = `<img src="${data.url}" alt="${escapeHtml(prompt)}">`;
            trackImage();
        } else {
            imageResult.innerHTML = '<div class="error">Generation failed</div>';
        }
    } catch (error) {
        imageResult.innerHTML = '<div class="error">Generation failed</div>';
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
    openModal(statsModal);
    try {
        const response = await fetch(`${API_BASE_URL}/api/stats`, { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            if (statsCreated) statsCreated.textContent = data.account_created || '-';
            if (statsLast) statsLast.textContent = data.last_login || '-';
            if (statsTotalMsgs) statsTotalMsgs.textContent = data.messages || 0;
            if (statsTotalChats) statsTotalChats.textContent = data.chats || 0;
            if (statsFiles) statsFiles.textContent = data.files || 0;
            if (statsImages) statsImages.textContent = data.images || 0;
            if (statsCode) statsCode.textContent = data.code || 0;
            if (statsSearches) statsSearches.textContent = data.searches || 0;
            if (statsMemories) statsMemories.textContent = data.memories || 0;
            if (statsDocs) statsDocs.textContent = data.documents || 0;
            if (statsAvgResponse) statsAvgResponse.textContent = (data.avg_response_time || 0.4) + 's';
            if (statsFastest) statsFastest.textContent = (data.fastest_response || 0.2) + 's';
            if (statsApiKeys) statsApiKeys.textContent = data.api_keys || 0;
        }
    } catch (error) {
        showNotification('Failed to load stats', 'error');
    }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    if (voiceBtn) voiceBtn.addEventListener('click', toggleVoiceInput);
    if (turboBtn) turboBtn.addEventListener('click', toggleTurboMode);
    if (searchBtn) searchBtn.addEventListener('click', toggleSearchMode);
    if (uploadBtn) uploadBtn.addEventListener('click', () => fileUpload.click());
    if (codeBtn) codeBtn.addEventListener('click', () => openModal(codeModal));
    if (imageBtn) imageBtn.addEventListener('click', () => openModal(imageModal));
    if (memoryBtn) memoryBtn.addEventListener('click', loadMemories);
    if (statsBtn) statsBtn.addEventListener('click', loadDetailedStats);
    if (personalitiesBtn) personalitiesBtn.addEventListener('click', openPersonalitiesBrowser);
    if (apiKeysBtn) apiKeysBtn.addEventListener('click', handleApiKeysClick);
    if (updateHistoryBtn) updateHistoryBtn.addEventListener('click', () => openModal(updateModal));
    if (closeUpdate) closeUpdate.addEventListener('click', () => closeModal(updateModal));
    if (fileUpload) fileUpload.addEventListener('change', handleFileUpload);
    if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);
    if (renameChatBtn) renameChatBtn.addEventListener('click', () => openRenameModal(activeChatId));
    if (deleteChatBtn) deleteChatBtn.addEventListener('click', () => deleteChat(activeChatId));
    if (resetCurrentBtn) resetCurrentBtn.addEventListener('click', resetCurrentChat);
    
    const loginBtn = document.getElementById('show-login-btn');
    const signupBtn = document.getElementById('show-signup-btn');
    if (loginBtn) loginBtn.addEventListener('click', () => showAuthModal(true));
    if (signupBtn) signupBtn.addEventListener('click', () => showAuthModal(false));
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (authSwitchBtn) authSwitchBtn.addEventListener('click', toggleAuthMode);
    if (authSubmit) authSubmit.addEventListener('click', handleAuthSubmit);
    if (closeAuth) closeAuth.addEventListener('click', () => closeModal(authModal));
    if (resendCodeBtn) resendCodeBtn.addEventListener('click', resendVerificationCode);
    if (closeRename) closeRename.addEventListener('click', () => closeModal(renameModal));
    if (closeCode) closeCode.addEventListener('click', () => closeModal(codeModal));
    if (closeImage) closeImage.addEventListener('click', () => closeModal(imageModal));
    if (closeMemory) closeMemory.addEventListener('click', () => closeModal(memoryModal));
    if (closeStats) closeStats.addEventListener('click', () => closeModal(statsModal));
    if (closePersonalities) closePersonalities.addEventListener('click', () => closeModal(personalitiesModal));
    if (closeApiKeys) closeApiKeys.addEventListener('click', () => closeModal(apiKeysModal));
    if (closeNewKey) closeNewKey.addEventListener('click', () => closeModal(newKeyModal));
    if (renameSave) renameSave.addEventListener('click', saveRename);
    if (renameCancel) renameCancel.addEventListener('click', () => closeModal(renameModal));
    if (renameInput) renameInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') saveRename();
    });
    if (runCodeBtn) runCodeBtn.addEventListener('click', executeCode);
    if (clearCodeBtn) clearCodeBtn.addEventListener('click', () => {
        codeInput.value = '';
        codeOutput.textContent = '';
    });
    if (generateImageBtn) generateImageBtn.addEventListener('click', generateImage);
    if (toggleCreatorBtn) toggleCreatorBtn.addEventListener('click', toggleCreatorPanel);
    if (savePersonality) savePersonality.addEventListener('click', saveCustomPersonality);
    if (cancelPersonality) cancelPersonality.addEventListener('click', closeCreatorPanel);
    if (closeCreator) closeCreator.addEventListener('click', closeCreatorPanel);
    if (tabBtns.length) tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchPersonalityTab(btn.dataset.tab));
    });
    
    window.addEventListener('click', e => {
        if (e.target.classList.contains('modal-overlay')) closeModal(e.target);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'F2') {
            e.preventDefault();
            emergencyReset();
        }
    });
}
