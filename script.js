// ============================================
// WIZARD.AI PRO v8.0 - COMPLETE FRONTEND
// Created by Arnav Gupta
// Features: Voice for ALL Modes, Stats Dashboard, File Upload Progress, Image Generation
// ============================================

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

// v8.0 New Elements
const voiceBtn = document.getElementById('voice-input-btn');
const turboBtn = document.getElementById('turbo-btn');
const turboStatus = document.getElementById('turbo-status');
const uploadProgress = document.getElementById('upload-progress');
const progressBarFill = document.getElementById('progress-bar-fill');
const progressText = document.getElementById('progress-text');
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsModal = document.getElementById('close-stats-modal');
const notificationToast = document.getElementById('notification-toast');

// Stat Elements
const statMessages = document.getElementById('stat-messages');
const statFiles = document.getElementById('stat-files');
const statMemories = document.getElementById('stat-memories');
const statImages = document.getElementById('stat-images');
const statSearches = document.getElementById('stat-searches');
const statResponse = document.getElementById('stat-response');
const quickToday = document.getElementById('quick-today');
const quickTotal = document.getElementById('quick-total');

// Detailed Stats Elements
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

// Pro Elements
const searchBtn = document.getElementById('search-btn');
const uploadBtn = document.getElementById('upload-btn');
const codeBtn = document.getElementById('code-btn');
const imageBtn = document.getElementById('image-btn');
const memoryBtn = document.getElementById('memory-btn');
const fileUpload = document.getElementById('file-upload');
const codeModal = document.getElementById('code-modal');
const imageModal = document.getElementById('image-modal');
const memoryModal = document.getElementById('memory-modal');
const closeCodeModal = document.getElementById('close-code-modal');
const closeImageModal = document.getElementById('close-image-modal');
const closeMemoryModal = document.getElementById('close-memory-modal');
const runCodeBtn = document.getElementById('run-code');
const clearCodeBtn = document.getElementById('clear-code');
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const generateImageBtn = document.getElementById('generate-image');
const imagePrompt = document.getElementById('image-prompt');
const imageSize = document.getElementById('image-size');
const imageResult = document.getElementById('image-result');
const memoryList = document.getElementById('memory-list');

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
const firstNameGroup = document.getElementById('first-name-group');
const lastNameGroup = document.getElementById('last-name-group');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const verificationGroup = document.getElementById('verification-group');
const verificationInput = document.getElementById('verification-code');
const resendCodeBtn = document.getElementById('resend-code-btn');

// Rename Modal
const renameModal = document.getElementById('rename-modal');
const renameInput = document.getElementById('rename-input');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');

// Generate unique session ID
const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

// ============================================
// STATE MANAGEMENT
// ============================================
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;
let tooltipEl = null;
let tooltipTimeout = null;
let currentUser = null;
let searchMode = false;
let uploadedFiles = [];
let guestChats = {};
let guestChatIds = ['default'];
let activeChatId = 'default';
let guestMessages = [];
let isLoginMode = true;
let chatToRename = null;
let chats = {};
let chatIds = [];
let signupEmail = '';
let signupData = {};

// Voice Recognition (works for ALL modes)
let voiceRecognition = null;
let isVoiceListening = false;

// Stats Tracking
let userStats = {
    messages: 0,
    files: 0,
    memories: 0,
    images: 0,
    searches: 0,
    codeExecutions: 0,
    responseTimes: [],
    todayMessages: 0
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
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'Normal': {
        emoji: '✨',
        name: 'Normal Mode',
        desc: 'Balanced, friendly conversation.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'Fun': {
        emoji: '🎉',
        name: 'Fun Mode',
        desc: 'Playful and energetic! Tells jokes and keeps things light.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6',
        hidden: false
    },
    'Sarcastic': {
        emoji: '😏',
        name: 'Sarcastic Mode',
        desc: 'Witty and slightly sarcastic, but still helpful.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#10b981',
        hidden: false
    },
    'Nerd': {
        emoji: '🧠',
        name: 'Nerd Mode',
        desc: 'Detailed, factual, and academic.',
        model: 'Llama 3.3 70B',
        modelSpeed: 'POWERFUL',
        color: '#8b5cf6',
        hidden: false
    },
    'JARVIS': {
        emoji: '🎩',
        name: 'JARVIS Mode',
        desc: 'Sophisticated and professional, like Tony Stark\'s AI.',
        model: 'Llama 3.1 8B',
        modelSpeed: 'FAST',
        color: '#00aaff',
        hidden: false
    },
    'ORACLE': {
        emoji: '🔮',
        name: 'ORACLE Mode',
        desc: 'Mystical and all-knowing.',
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
    'ORACLE': '🔮 The Oracle awakens... I see infinite possibilities.'
};

// ============================================
// VOICE INPUT FOR ALL MODES v8.0
// ============================================

function initVoiceInput() {
    // Check if browser supports voice recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.log('Voice recognition not supported');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
        return false;
    }
    
    try {
        voiceRecognition = new SpeechRecognition();
        voiceRecognition.continuous = false;
        voiceRecognition.interimResults = false;
        voiceRecognition.lang = 'en-US';
        
        voiceRecognition.onstart = () => {
            console.log('Voice recognition started');
            isVoiceListening = true;
            voiceBtn.classList.add('listening');
            showNotification('🎤 Listening... Speak now', 'info');
        };
        
        voiceRecognition.onend = () => {
            console.log('Voice recognition ended');
            isVoiceListening = false;
            voiceBtn.classList.remove('listening');
        };
        
        voiceRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log('Voice transcript:', transcript);
            
            // Fill the input with the transcribed text
            chatInput.value = transcript;
            
            // Auto-send after voice input (optional - comment out if you don't want auto-send)
            setTimeout(() => sendMessage(), 500);
            
            showNotification(`🎤 "${transcript}"`, 'success');
        };
        
        voiceRecognition.onerror = (event) => {
            console.error('Voice error:', event.error);
            isVoiceListening = false;
            voiceBtn.classList.remove('listening');
            
            let errorMsg = 'Voice recognition error';
            if (event.error === 'not-allowed') {
                errorMsg = 'Microphone access denied. Please allow microphone access.';
            } else if (event.error === 'no-speech') {
                errorMsg = 'No speech detected. Please try again.';
            } else if (event.error === 'network') {
                errorMsg = 'Network error. Check your connection.';
            }
            showNotification(errorMsg, 'error');
        };
        
        return true;
    } catch (e) {
        console.error('Failed to initialize voice:', e);
        return false;
    }
}

function toggleVoiceInput() {
    if (!voiceRecognition) {
        if (!initVoiceInput()) {
            showNotification('Voice recognition not supported in this browser', 'error');
            return;
        }
    }
    
    if (isVoiceListening) {
        try {
            voiceRecognition.stop();
        } catch (e) {
            console.error('Error stopping voice:', e);
        }
    } else {
        try {
            voiceRecognition.start();
        } catch (e) {
            console.error('Error starting voice:', e);
            showNotification('Could not start voice recognition. Try again.', 'error');
        }
    }
}

// ============================================
// NOTIFICATION TOAST v8.0
// ============================================

function showNotification(message, type = 'info', duration = 3000) {
    if (!notificationToast) return;
    
    notificationToast.textContent = message;
    notificationToast.className = 'notification-toast';
    notificationToast.classList.add('show');
    
    if (type === 'success') {
        notificationToast.classList.add('success');
    } else if (type === 'error') {
        notificationToast.classList.add('error');
    }
    
    setTimeout(() => {
        notificationToast.classList.remove('show');
    }, duration);
}

// ============================================
// STATS FUNCTIONS v8.0
// ============================================

function updateStats() {
    // Update stat cards
    if (statMessages) {
        statMessages.textContent = userStats.messages;
    }
    if (statFiles) {
        statFiles.textContent = userStats.files;
    }
    if (statMemories) {
        statMemories.textContent = userStats.memories;
    }
    if (statImages) {
        statImages.textContent = userStats.images;
    }
    if (statSearches) {
        statSearches.textContent = userStats.searches;
    }
    if (statResponse && userStats.responseTimes.length > 0) {
        const avg = userStats.responseTimes.reduce((a, b) => a + b, 0) / userStats.responseTimes.length;
        statResponse.textContent = avg.toFixed(1) + 's';
    }
    
    // Update quick stats
    if (quickToday) {
        quickToday.textContent = userStats.todayMessages + ' msgs';
    }
    if (quickTotal) {
        quickTotal.textContent = userStats.messages + ' msgs';
    }
}

function trackMessage(responseTime) {
    userStats.messages++;
    userStats.todayMessages++;
    userStats.responseTimes.push(responseTime);
    
    // Keep only last 100 response times
    if (userStats.responseTimes.length > 100) {
        userStats.responseTimes.shift();
    }
    
    updateStats();
}

function trackFile() {
    userStats.files++;
    updateStats();
}

function trackImage() {
    userStats.images++;
    updateStats();
}

function trackSearch() {
    userStats.searches++;
    updateStats();
}

function trackCode() {
    userStats.codeExecutions++;
    updateStats();
}

async function loadDetailedStats() {
    if (!currentUser) {
        showNotification('Please login to view detailed stats', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/stats`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update detailed stats modal
            if (statsCreated) {
                statsCreated.textContent = data.account_created || 'Unknown';
            }
            if (statsLast) {
                statsLast.textContent = data.last_login || 'Today';
            }
            if (statsTotalMsgs) {
                statsTotalMsgs.textContent = data.messages || userStats.messages;
            }
            if (statsTotalChats) {
                statsTotalChats.textContent = data.chats || Object.keys(chats).length;
            }
            if (statsFilesDetail) {
                statsFilesDetail.textContent = data.files || userStats.files;
            }
            if (statsImagesDetail) {
                statsImagesDetail.textContent = data.images || userStats.images;
            }
            if (statsCode) {
                statsCode.textContent = data.code || userStats.codeExecutions;
            }
            if (statsSearchesDetail) {
                statsSearchesDetail.textContent = data.searches || userStats.searches;
            }
            if (statsMemoriesDetail) {
                statsMemoriesDetail.textContent = data.memories || userStats.memories;
            }
            if (statsDocs) {
                statsDocs.textContent = data.documents || 0;
            }
            if (statsAvgResponse && userStats.responseTimes.length > 0) {
                const avg = userStats.responseTimes.reduce((a, b) => a + b, 0) / userStats.responseTimes.length;
                statsAvgResponse.textContent = avg.toFixed(1) + 's';
            }
            if (statsFastest && userStats.responseTimes.length > 0) {
                const fastest = Math.min(...userStats.responseTimes);
                statsFastest.textContent = fastest.toFixed(1) + 's';
            }
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// ============================================
// FILE UPLOAD WITH PROGRESS BAR v8.0
// ============================================

async function uploadFileWithProgress(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('chat_id', activeChatId);
    
    // Show progress bar
    uploadProgress.style.display = 'block';
    progressBarFill.style.width = '0%';
    progressText.textContent = 'Starting upload...';
    
    try {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBarFill.style.width = percentComplete + '%';
                progressText.textContent = `Uploading: ${Math.round(percentComplete)}%`;
            }
        });
        
        const uploadPromise = new Promise((resolve, reject) => {
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error('Upload failed'));
                }
            };
            xhr.onerror = () => reject(new Error('Upload failed'));
        });
        
        xhr.open('POST', `${API_BASE_URL}/api/upload`);
        xhr.withCredentials = true;
        xhr.send(formData);
        
        const data = await uploadPromise;
        
        // Hide progress bar
        setTimeout(() => {
            uploadProgress.style.display = 'none';
        }, 1000);
        
        if (data.success) {
            uploadedFiles.push(data);
            trackFile();
            showNotification(`✅ ${file.name} uploaded successfully!`, 'success');
            
            if (data.duplicate) {
                addWizardMessage(`📎 File already exists: ${data.filename}\n${data.preview}`);
            } else {
                addWizardMessage(`📎 File uploaded: ${data.filename}\n${data.preview}`);
            }
        } else {
            showNotification(`❌ Upload failed: ${data.error || 'Unknown error'}`, 'error');
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        uploadProgress.style.display = 'none';
        showNotification('❌ Upload failed. Please try again.', 'error');
    }
}

// ============================================
// IMAGE GENERATION WITH SIZE OPTIONS v8.0
// ============================================

async function generateImage() {
    const prompt = imagePrompt.value.trim();
    if (!prompt) {
        showNotification('Please enter a prompt', 'error');
        return;
    }
    
    const size = imageSize ? imageSize.value : '512x512';
    
    imageResult.innerHTML = '<div class="loading-spinner">🎨 Generating image...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                prompt,
                size: size 
            }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.url) {
            imageResult.innerHTML = `<img src="${data.url}" alt="${escapeHtml(prompt)}" style="max-width: 100%; border-radius: 12px;">`;
            trackImage();
            showNotification('✅ Image generated!', 'success');
        } else {
            imageResult.innerHTML = '❌ Image generation failed.';
            showNotification('❌ Image generation failed', 'error');
        }
    } catch (error) {
        console.error('Image generation error:', error);
        imageResult.innerHTML = '❌ Image generation failed.';
        showNotification('❌ Image generation error', 'error');
    }
}

// ============================================
// TOOLTIP FUNCTIONS
// ============================================

function createTooltip() {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'mode-tooltip';
    tooltipEl.className = 'mode-tooltip';
    tooltipEl.style.display = 'none';
    tooltipEl.style.position = 'fixed';
    tooltipEl.style.zIndex = '10000';
    tooltipEl.style.pointerEvents = 'none';
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
                <div style="font-weight: bold; color: ${mode.color}; font-size: 14px; margin-bottom: 4px;">${mode.name}</div>
                <div style="color: #e0e7ff; font-size: 12px; line-height: 1.4;">${mode.desc}</div>
                <div style="color: #9ca3af; font-size: 11px; margin-top: 6px; display: flex; align-items: center; gap: 6px;">
                    <span>🧠 ${mode.model}</span>
                    <span style="background: ${mode.color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 9px;">${mode.modelSpeed}</span>
                </div>
            </div>
        </div>
    `;
    
    positionTooltip(event);
    tooltipEl.style.display = 'block';
}

function positionTooltip(event) {
    if (!tooltipEl) return;
    
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.clientX + 20;
    let top = event.clientY - 30;
    
    if (left + tooltipRect.width > viewportWidth - 20) {
        left = event.clientX - tooltipRect.width - 20;
    }
    
    if (left < 20) {
        left = 20;
    }
    
    if (top + tooltipRect.height > viewportHeight - 20) {
        top = event.clientY - tooltipRect.height - 20;
    }
    
    if (top < 20) {
        top = 20;
    }
    
    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
}

function updateTooltipPosition(event) {
    if (tooltipEl && tooltipEl.style.display === 'block') {
        positionTooltip(event);
    }
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
// CHAT FUNCTIONS
// ============================================

function addWizardMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message wizard';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.textContent = '🧙';
    
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
    
    const ids = currentUser ? chatIds : guestChatIds;
    const chatsObj = currentUser ? chats : guestChats;
    
    if (!chatsObj || Object.keys(chatsObj).length === 0) {
        // Create default chat if none exists
        const defaultChat = {
            chat_id: 'default',
            name: 'Main Chat',
            emoji: '🧙',
            mode: 'JARVIS',
            messages: []
        };
        if (currentUser) {
            chats['default'] = defaultChat;
        } else {
            guestChats['default'] = defaultChat;
        }
    }
    
    ids.forEach(chatId => {
        const chat = (currentUser ? chats : guestChats)[chatId];
        if (!chat) return;
        
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
    
    if (currentChatName) {
        const currentChat = (currentUser ? chats : guestChats)[activeChatId];
        currentChatName.textContent = currentChat?.name || 'Main Chat';
    }
    if (currentChatEmoji) {
        const currentChat = (currentUser ? chats : guestChats)[activeChatId];
        currentChatEmoji.textContent = currentChat?.emoji || '🧙';
    }
}

function switchChat(chatId) {
    const chatsObj = currentUser ? chats : guestChats;
    if (!chatsObj[chatId]) return;
    
    // Save current chat messages
    if (chatsObj[activeChatId]) {
        chatsObj[activeChatId].messages = [...messages];
        chatsObj[activeChatId].mode = currentMode;
    }
    
    // Switch to new chat
    activeChatId = chatId;
    const newChat = chatsObj[activeChatId];
    
    // Load new chat's mode
    if (newChat.mode) {
        currentMode = newChat.mode;
        updateModeDisplay();
    }
    
    // Load messages
    messages = newChat.messages ? [...newChat.messages] : [];
    
    // Clear and rebuild chat history
    chatHistory.innerHTML = '';
    
    if (messages.length === 0) {
        addWizardMessage(`✨ Welcome to ${newChat.name}! Select a mode to begin.`);
    } else {
        messages.forEach(msg => {
            if (msg.sender === 'user') {
                renderUserMessage(msg.text);
            } else {
                renderWizardMessage(msg.text, msg.mode);
            }
        });
    }
    
    chatHistory.scrollTop = chatHistory.scrollHeight;
    updateMessageCount();
    renderChatsList();
    
    // Handle JARVIS mode activation
    if (currentMode === 'JARVIS' && !document.body.classList.contains('jarvis-mode-active')) {
        activateSuitUpMode();
    } else if (currentMode !== 'JARVIS' && document.body.classList.contains('jarvis-mode-active')) {
        deactivateSuitUpMode();
    }
}

function createNewChat() {
    const chatNumber = (currentUser ? chatIds.length : guestChatIds.length) + 1;
    const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    
    const emojis = ['💬', '🤖', '🌟', '⭐', '✨', '🎯', '🎲', '🎮', '📚', '🎨'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const newChat = {
        chat_id: chatId,
        name: `Chat ${chatNumber}`,
        emoji: randomEmoji,
        mode: 'JARVIS',
        messages: []
    };
    
    if (currentUser) {
        chats[chatId] = newChat;
        chatIds.push(chatId);
    } else {
        guestChats[chatId] = newChat;
        guestChatIds.push(chatId);
    }
    
    switchChat(chatId);
}

function deleteChat(chatId) {
    const chatsObj = currentUser ? chats : guestChats;
    const ids = currentUser ? chatIds : guestChatIds;
    
    if (ids.length <= 1) {
        showNotification('Cannot delete the last chat', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete this chat?`)) {
        return;
    }
    
    const currentIndex = ids.indexOf(chatId);
    
    delete chatsObj[chatId];
    const newIds = ids.filter(id => id !== chatId);
    
    if (currentUser) {
        chatIds = newIds;
    } else {
        guestChatIds = newIds;
    }
    
    if (chatId === activeChatId) {
        const newIndex = Math.min(currentIndex, newIds.length - 1);
        switchChat(newIds[newIndex]);
    }
    
    renderChatsList();
    showNotification('Chat deleted', 'success');
}

function renameChat(chatId, newName) {
    if (!newName.trim()) return;
    
    const chatsObj = currentUser ? chats : guestChats;
    const chat = chatsObj[chatId];
    if (!chat) return;
    
    chat.name = newName.trim();
    
    if (chatId === activeChatId && currentChatName) {
        currentChatName.textContent = chat.name;
    }
    
    renderChatsList();
    showNotification('Chat renamed', 'success');
}

function openRenameModal(chatId) {
    chatToRename = chatId;
    const chatsObj = currentUser ? chats : guestChats;
    const chat = chatsObj[chatId];
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
    
    const chatsObj = currentUser ? chats : guestChats;
    if (chatsObj[activeChatId]) {
        chatsObj[activeChatId].messages = [];
    }
    
    updateMessageCount();
    addWizardMessage(`🧹 Chat cleared! Ready for new messages.`);
    showNotification('Chat cleared', 'success');
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
        currentModel.innerHTML = `
            <span class="model-icon">${mode.emoji}</span>
            <span class="model-name">${mode.model}</span>
        `;
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
            
            // Save mode to current chat
            const chatsObj = currentUser ? chats : guestChats;
            if (chatsObj[activeChatId]) {
                chatsObj[activeChatId].mode = currentMode;
            }
            
            if (currentMode === 'JARVIS') {
                if (!document.body.classList.contains('jarvis-mode-active')) {
                    addWizardMessage(activateSuitUpMode());
                } else {
                    addWizardMessage(`🔄 Switched to JARVIS mode.`);
                }
            } else {
                if (document.body.classList.contains('jarvis-mode-active')) {
                    deactivateSuitUpMode();
                }
                addWizardMessage(`🔄 Switched to ${modeKey} mode! ${modeGreetings[modeKey] || ''}`);
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
// JARVIS SPECIAL FUNCTIONS
// ============================================

function activateSuitUpMode() {
    document.body.classList.add('jarvis-mode-active');
    return "🔷 SUIT UP mode activated. All systems at your command.";
}

function deactivateSuitUpMode() {
    document.body.classList.remove('jarvis-mode-active');
}

// ============================================
// TURBO MODE v8.0
// ============================================

function toggleTurboMode() {
    turboMode = !turboMode;
    
    if (turboMode) {
        turboBtn.classList.add('active');
        turboStatus.textContent = 'ON';
        showNotification('⚡ Turbo mode activated! Faster responses!', 'success');
    } else {
        turboBtn.classList.remove('active');
        turboStatus.textContent = 'OFF';
        showNotification('Turbo mode deactivated', 'info');
    }
}

// ============================================
// SEND MESSAGE
// ============================================

async function sendMessage() {
    if (isThinking) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    renderUserMessage(text);
    messages.push({ sender: 'user', text });
    chatInput.value = '';
    updateMessageCount();
    
    // Save to current chat
    const chatsObj = currentUser ? chats : guestChats;
    if (chatsObj[activeChatId]) {
        chatsObj[activeChatId].messages = [...messages];
    }
    
    isThinking = true;
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    
    const thinkingDiv = document.createElement('div');
    thinkingDiv.className = 'message wizard thinking';
    thinkingDiv.innerHTML = `
        <div class="message-content">
            <span class="message-icon">⏳</span>
            <span class="message-text">✨</span>
        </div>
        <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    `;
    chatHistory.appendChild(thinkingDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    try {
        const startTime = Date.now();
        
        const requestBody = {
            prompt: text,
            mode: currentMode,
            turbo: turboMode,
            search: searchMode,
            chat_id: activeChatId
        };
        
        if (!currentUser) {
            requestBody.guest = true;
        }
        
        const response = await fetch(`${API_BASE_URL}/api/chat/pro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });
        
        const data = await response.json();
        const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}s`;
        }
        
        // Track stats
        trackMessage(parseFloat(responseTime));
        
        thinkingDiv.remove();
        
        // Show search results if any
        if (data.search_results && data.search_results.length > 0) {
            trackSearch();
            const resultsDiv = document.createElement('div');
            resultsDiv.className = 'message wizard';
            let resultsHtml = '';
            data.search_results.forEach(r => {
                resultsHtml += `• <a href="${r.url}" target="_blank" style="color: #8b5cf6;">${escapeHtml(r.title)}</a><br><small style="color: #9ca3af;">${escapeHtml(r.snippet)}</small><br><br>`;
            });
            resultsDiv.innerHTML = `
                <div class="message-content">
                    <span class="message-icon">🌐</span>
                    <span class="message-text">
                        <strong>Web Search Results:</strong><br>
                        ${resultsHtml}
                    </span>
                </div>
                <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            `;
            chatHistory.appendChild(resultsDiv);
        }
        
        renderWizardMessage(data.reply, currentMode);
        messages.push({ sender: 'wizard', text: data.reply, mode: currentMode });
        updateMessageCount();
        
        if (chatsObj[activeChatId]) {
            chatsObj[activeChatId].messages = [...messages];
        }
        
        // Save chats if logged in
        if (currentUser) {
            saveChatsToServer();
        }
        
    } catch (error) {
        console.error('Chat error:', error);
        thinkingDiv.remove();
        
        if (!currentUser) {
            addWizardMessage('✨ Having trouble? Create a free account for a better experience!');
        } else {
            addWizardMessage('⚠️ Connection error! Please try again.');
        }
    } finally {
        isThinking = false;
        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
        chatInput.focus();
    }
}

// ============================================
// SAVE CHATS TO SERVER
// ============================================

async function saveChatsToServer() {
    if (!currentUser) return;
    
    const chatsArray = [];
    chatIds.forEach(id => {
        if (chats[id]) {
            chatsArray.push({
                chat_id: id,
                name: chats[id].name,
                emoji: chats[id].emoji,
                mode: chats[id].mode,
                messages: chats[id].messages || []
            });
        }
    });
    
    try {
        await fetch(`${API_BASE_URL}/api/save-chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chats: chatsArray,
                chat_order: chatIds
            }),
            credentials: 'include'
        });
    } catch (error) {
        console.error('Failed to save chats:', error);
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
            
            // Load user's chats
            try {
                const chatsResponse = await fetch(`${API_BASE_URL}/api/chats`, {
                    credentials: 'include'
                });
                if (chatsResponse.ok) {
                    const chatsData = await chatsResponse.json();
                    chats = {};
                    chatIds = [];
                    
                    if (chatsData.chats && chatsData.chats.length > 0) {
                        chatsData.chats.forEach(chat => {
                            chats[chat.chat_id] = chat;
                            chatIds.push(chat.chat_id);
                        });
                        
                        if (chatsData.chat_order && chatsData.chat_order.length > 0) {
                            chatIds = chatsData.chat_order;
                        }
                        
                        activeChatId = chatIds[0];
                        currentMode = chats[activeChatId]?.mode || 'JARVIS';
                        
                        if (currentMode === 'JARVIS') {
                            activateSuitUpMode();
                        }
                        
                        renderChatsList();
                        updateModeDisplay();
                        
                        // Load messages from active chat
                        if (chats[activeChatId] && chats[activeChatId].messages) {
                            messages = [...chats[activeChatId].messages];
                            messages.forEach(msg => {
                                if (msg.sender === 'user') {
                                    renderUserMessage(msg.text);
                                } else {
                                    renderWizardMessage(msg.text, msg.mode);
                                }
                            });
                            updateMessageCount();
                            
                            // Update message stats
                            userStats.messages = messages.length;
                            updateStats();
                        } else {
                            addWizardMessage(`✨ Welcome back, ${currentUser.first_name}!`);
                        }
                    }
                    
                    // Load detailed stats
                    loadDetailedStats();
                }
            } catch (error) {
                console.error('Failed to load chats:', error);
                initializeGuestChat();
            }
        } else {
            updateUIForAuth();
            initializeGuestChat();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUIForAuth();
        initializeGuestChat();
    }
}

function updateUIForAuth() {
    if (currentUser) {
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
        userEmail.textContent = currentUser.email;
        
        // Enable pro features
        if (searchBtn) searchBtn.disabled = false;
        if (uploadBtn) uploadBtn.disabled = false;
        if (codeBtn) codeBtn.disabled = false;
        if (imageBtn) imageBtn.disabled = false;
        if (memoryBtn) memoryBtn.disabled = false;
        
    } else {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

function initializeGuestChat() {
    guestChats = {
        'default': {
            chat_id: 'default',
            name: 'Main Chat',
            emoji: '🧙',
            mode: 'JARVIS',
            messages: []
        }
    };
    guestChatIds = ['default'];
    activeChatId = 'default';
    currentMode = 'JARVIS';
    messages = [];
    
    activateSuitUpMode();
    renderChatsList();
    updateModeDisplay();
    chatHistory.innerHTML = '';
    addWizardMessage('✨ Welcome to Wizard.AI Pro v8.0! Chat with me, or sign up to save your conversations!');
    
    setTimeout(() => {
        addWizardMessage('🔐 Click "Sign Up" in the sidebar to create a free account!');
    }, 2000);
}

function showAuthModal(loginMode = true) {
    isLoginMode = loginMode;
    authModalTitle.textContent = loginMode ? 'Login to Wizard.AI Pro' : 'Create Account';
    authSubmit.textContent = loginMode ? 'Login' : 'Sign Up';
    authSwitchText.textContent = loginMode ? "Don't have an account?" : "Already have an account?";
    authSwitchBtn.textContent = loginMode ? 'Sign Up' : 'Login';
    authConfirmGroup.style.display = loginMode ? 'none' : 'block';
    firstNameGroup.style.display = loginMode ? 'none' : 'block';
    lastNameGroup.style.display = loginMode ? 'none' : 'block';
    verificationGroup.style.display = 'none';
    authEmail.value = '';
    authPassword.value = '';
    authConfirm.value = '';
    if (firstNameInput) firstNameInput.value = '';
    if (lastNameInput) lastNameInput.value = '';
    authError.textContent = '';
    authModal.classList.add('show');
}

async function handleSignupStep1() {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    const confirm = authConfirm.value.trim();
    
    if (!firstName || !lastName || !email || !password || !confirm) {
        authError.textContent = 'Please fill all fields';
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
            body: JSON.stringify({ firstName, lastName, email, password }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            signupEmail = email;
            signupData = { firstName, lastName };
            
            authModalTitle.textContent = 'Verify Your Email';
            authSubmit.textContent = 'Verify Code';
            firstNameGroup.style.display = 'none';
            lastNameGroup.style.display = 'none';
            authConfirmGroup.style.display = 'none';
            verificationGroup.style.display = 'block';
            authError.textContent = `✅ Code sent to ${email}`;
            authError.style.color = '#10b981';
            showNotification(`Verification code sent to ${email}`, 'success');
        } else {
            authError.textContent = data.error || 'Signup failed';
            authError.style.color = '#ef4444';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
        authError.style.color = '#ef4444';
    }
}

async function handleSignupStep2() {
    const code = verificationInput.value.trim();
    
    if (!code || code.length !== 6) {
        authError.textContent = 'Please enter 6-digit code';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/register/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: signupEmail, code }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            authModal.classList.remove('show');
            updateUIForAuth();
            showNotification('✅ Account verified! Welcome to Wizard.AI!', 'success');
            
            // Transfer guest chats to user account
            if (Object.keys(guestChats).length > 0) {
                const chatsArray = [];
                guestChatIds.forEach(id => {
                    if (guestChats[id]) {
                        chatsArray.push({
                            chat_id: id,
                            name: guestChats[id].name,
                            emoji: guestChats[id].emoji,
                            mode: guestChats[id].mode,
                            messages: guestChats[id].messages || []
                        });
                    }
                });
                
                await fetch(`${API_BASE_URL}/api/save-chats`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chats: chatsArray,
                        chat_order: guestChatIds
                    }),
                    credentials: 'include'
                });
            }
            
            // Reload user data
            window.location.reload();
            
        } else {
            authError.textContent = data.error || 'Invalid code';
            authError.style.color = '#ef4444';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
        authError.style.color = '#ef4444';
    }
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
            showNotification(`✅ Welcome back, ${currentUser.first_name}!`, 'success');
            
            // Transfer guest chats if any
            if (Object.keys(guestChats).length > 0) {
                const chatsArray = [];
                guestChatIds.forEach(id => {
                    if (guestChats[id]) {
                        chatsArray.push({
                            chat_id: id,
                            name: guestChats[id].name,
                            emoji: guestChats[id].emoji,
                            mode: guestChats[id].mode,
                            messages: guestChats[id].messages || []
                        });
                    }
                });
                
                await fetch(`${API_BASE_URL}/api/save-chats`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        chats: chatsArray,
                        chat_order: guestChatIds
                    }),
                    credentials: 'include'
                });
            }
            
            window.location.reload();
            
        } else {
            authError.textContent = data.error || 'Login failed';
            authError.style.color = '#ef4444';
        }
    } catch (error) {
        authError.textContent = 'Connection error';
        authError.style.color = '#ef4444';
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
    initializeGuestChat();
    deactivateSuitUpMode();
    addWizardMessage('👋 You have been logged out. Your guest chat is still here!');
    showNotification('Logged out successfully', 'success');
}

async function resendVerificationCode() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/resend-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: signupEmail }),
            credentials: 'include'
        });
        
        const data = await response.json();
        authError.textContent = data.message || 'Code resent';
        authError.style.color = '#10b981';
        showNotification('Verification code resent!', 'success');
    } catch (error) {
        authError.textContent = 'Failed to resend';
        authError.style.color = '#ef4444';
    }
}

// ============================================
// STATUS FUNCTIONS
// ============================================

async function checkSystemStatus() {
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
        console.error('Status check failed:', error);
        statusText.textContent = 'Offline';
        statusDot.classList.add('offline');
    }
}

// ============================================
// MEMORY FUNCTIONS
// ============================================

async function loadMemories() {
    if (!memoryModal) return;
    
    memoryModal.style.display = 'flex';
    if (memoryList) {
        memoryList.innerHTML = 'Loading memories...';
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/memory`, {
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (memoryList) {
            if (data.memories && data.memories.length > 0) {
                let html = '';
                data.memories.forEach(mem => {
                    html += `
                        <div class="memory-item">
                            <div class="memory-key">${escapeHtml(mem.key)}</div>
                            <div class="memory-value">${escapeHtml(mem.value)}</div>
                            <span class="memory-category">${escapeHtml(mem.category)}</span>
                        </div>
                    `;
                });
                memoryList.innerHTML = html;
                userStats.memories = data.memories.length;
                updateStats();
            } else {
                memoryList.innerHTML = 'No memories yet. Chat with me and I\'ll remember things!';
                userStats.memories = 0;
                updateStats();
            }
        }
    } catch (error) {
        console.error('Memory load error:', error);
        if (memoryList) {
            memoryList.innerHTML = 'Failed to load memories.';
        }
    }
}

// ============================================
// CODE EXECUTION
// ============================================

async function executeCode() {
    const code = codeInput.value.trim();
    if (!code) {
        showNotification('Please enter code to run', 'error');
        return;
    }
    
    codeOutput.innerHTML = 'Running...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        let outputHtml = '';
        if (data.error) {
            outputHtml = `<span style="color: #ff6b6b;">❌ Error: ${escapeHtml(data.error)}</span>`;
        } else {
            if (data.stdout) {
                outputHtml += `<span style="color: #00ff00;">${escapeHtml(data.stdout)}</span>`;
            }
            if (data.stderr) {
                outputHtml += `<span style="color: #ff6b6b;">${escapeHtml(data.stderr)}</span>`;
            }
            if (data.code !== undefined) {
                outputHtml += `<div style="color: #888; margin-top: 10px;">Exit code: ${data.code}</div>`;
            }
        }
        
        codeOutput.innerHTML = outputHtml || 'No output';
        
        if (!data.error && data.success) {
            trackCode();
            showNotification('✅ Code executed successfully', 'success');
        }
        
    } catch (error) {
        console.error('Code execution error:', error);
        codeOutput.innerHTML = '❌ Error executing code.';
        showNotification('❌ Code execution failed', 'error');
    }
}

// ============================================
// SEARCH TOGGLE
// ============================================

function toggleSearchMode() {
    searchMode = !searchMode;
    if (searchMode) {
        searchBtn.classList.add('active');
        showNotification('🌐 Web search activated', 'success');
    } else {
        searchBtn.classList.remove('active');
        showNotification('Web search deactivated', 'info');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ============================================
// MODAL SETUP
// ============================================

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
    
    renameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            modalSave.click();
        }
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === renameModal) {
            renameModal.classList.remove('show');
            chatToRename = null;
        }
        if (e.target === authModal) {
            authModal.classList.remove('show');
        }
        if (e.target === statsModal) {
            statsModal.style.display = 'none';
        }
    });
}

// ============================================
// PRO FEATURES INITIALIZATION
// ============================================

function initProFeatures() {
    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearchMode);
    }
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to upload files', 'error');
                showAuthModal(false);
                return;
            }
            fileUpload.click();
        });
    }
    
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadFileWithProgress(file);
            }
            fileUpload.value = '';
        });
    }
    
    if (codeBtn) {
        codeBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to use code interpreter', 'error');
                showAuthModal(false);
                return;
            }
            codeModal.style.display = 'flex';
            codeOutput.innerHTML = '';
        });
    }
    
    if (imageBtn) {
        imageBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to generate images', 'error');
                showAuthModal(false);
                return;
            }
            imageModal.style.display = 'flex';
            imageResult.innerHTML = '';
            imagePrompt.value = '';
        });
    }
    
    if (memoryBtn) {
        memoryBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to view memories', 'error');
                showAuthModal(false);
                return;
            }
            loadMemories();
        });
    }
    
    if (statsBtn) {
        statsBtn.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to view stats', 'error');
                showAuthModal(false);
                return;
            }
            statsModal.style.display = 'flex';
            loadDetailedStats();
        });
    }
    
    if (closeCodeModal) {
        closeCodeModal.addEventListener('click', () => codeModal.style.display = 'none');
    }
    
    if (closeImageModal) {
        closeImageModal.addEventListener('click', () => imageModal.style.display = 'none');
    }
    
    if (closeMemoryModal) {
        closeMemoryModal.addEventListener('click', () => memoryModal.style.display = 'none');
    }
    
    if (closeStatsModal) {
        closeStatsModal.addEventListener('click', () => statsModal.style.display = 'none');
    }
    
    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', executeCode);
    }
    
    if (clearCodeBtn) {
        clearCodeBtn.addEventListener('click', () => {
            codeInput.value = '';
            codeOutput.innerHTML = '';
        });
    }
    
    if (generateImageBtn) {
        generateImageBtn.addEventListener('click', generateImage);
    }
    
    if (turboBtn) {
        turboBtn.addEventListener('click', toggleTurboMode);
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === codeModal) codeModal.style.display = 'none';
        if (e.target === imageModal) imageModal.style.display = 'none';
        if (e.target === memoryModal) memoryModal.style.display = 'none';
        if (e.target === statsModal) statsModal.style.display = 'none';
    });
}

// ============================================
// EVENT LISTENERS
// ============================================

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
        renameChatBtn.addEventListener('click', () => openRenameModal(activeChatId));
    }
    
    if (deleteChatBtn) {
        deleteChatBtn.addEventListener('click', () => deleteChat(activeChatId));
    }
    
    if (resetCurrentBtn) {
        resetCurrentBtn.addEventListener('click', resetCurrentChat);
    }
    
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => showAuthModal(true));
    }
    
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', () => showAuthModal(false));
    }
    
    if (closeAuthModal) {
        closeAuthModal.addEventListener('click', () => authModal.classList.remove('show'));
    }
    
    if (authSwitchBtn) {
        authSwitchBtn.addEventListener('click', () => showAuthModal(!isLoginMode));
    }
    
    if (authSubmit) {
        authSubmit.addEventListener('click', () => {
            if (authModalTitle.textContent === 'Verify Your Email') {
                handleSignupStep2();
            } else if (isLoginMode) {
                handleLogin();
            } else {
                handleSignupStep1();
            }
        });
    }
    
    if (resendCodeBtn) {
        resendCodeBtn.addEventListener('click', resendVerificationCode);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// ============================================
// BRAVE BROWSER DETECTION
// ============================================

function isBraveBrowser() {
    if (window.navigator.brave && typeof window.navigator.brave.isBrave === 'function') {
        return true;
    }
    const isChromium = window.chrome !== undefined;
    const userAgent = window.navigator.userAgent;
    return isChromium && userAgent.includes("Brave");
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    console.log('🚀 Initializing Wizard.AI PRO v8.0...');
    console.log('🔗 Backend URL:', API_BASE_URL);
    
    createTooltip();
    statusText.textContent = 'Connecting...';
    
    if (isBraveBrowser()) {
        addWizardMessage('⚠️ You\'re using Brave browser. Voice features work best in Chrome, Edge, or Safari.');
        if (voiceBtn) {
            voiceBtn.style.display = 'none';
        }
    } else {
        initVoiceInput();
    }
    
    await checkAuth();
    await checkSystemStatus();
    setupDropdown();
    setupEventListeners();
    setupModal();
    initProFeatures();
    
    // Initialize stats
    updateStats();
    
    console.log('✅ Wizard.AI PRO v8.0 initialized successfully');
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
        showNotification('Emergency reset activated', 'info');
    }
});

// Start the app
document.addEventListener('DOMContentLoaded', init);
