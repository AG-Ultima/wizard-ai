// ============================================
// WIZARD.AI - JARVIS ULTIMATE EDITION (WITH MEMORY)
// Created by Arnav Gupta in 15 hours
// Features: SUIT UP, Voice Commands, Diagnostic, Easter Eggs, FULL MEMORY
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

// JARVIS Special Elements
const jarvisVoiceBtn = document.getElementById('jarvis-voice-btn');
const jarvisEasterEgg = document.getElementById('jarvis-easter-egg');

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

// State
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;
let tooltipEl = null;
let tooltipTimeout = null;
let currentUser = null;
let recognition = null;
let isListening = false;

// Multi-Chat State
let chats = {};
let chatIds = ['default'];
let activeChatId = 'default';
let chatToRename = null;

// Auth State
let isLoginMode = true;
let signupEmail = '';
let signupData = {};

// JARVIS Easter Eggs
const jarvisGreetings = [
    "Good to see you again, sir.",
    "At your service, as always.",
    "I've been expecting you.",
    "Systems online and ready.",
    "Ah, there you are. I was beginning to wonder.",
    "Welcome back. Shall we get to work?",
    "I'm always here when you need me, sir.",
    "Another day, another conversation.",
    "Your presence is, as always, appreciated.",
    "Ready when you are."
];

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
        desc: 'Detailed, factual, and academic. Shares interesting facts.',
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
        color: '#10b981',
        hidden: false
    },
    'ORACLE': {
        emoji: '🔮',
        name: 'ORACLE Mode',
        desc: 'Mystical and all-knowing. Speaks with profound wisdom.',
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
// JARVIS SPECIAL FUNCTIONS
// ============================================

function initializeVoiceRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Voice recognition not supported in this browser');
        if (jarvisVoiceBtn) {
            jarvisVoiceBtn.style.display = 'none';
        }
        return false;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
        isListening = true;
        if (jarvisVoiceBtn) {
            jarvisVoiceBtn.classList.add('listening');
            jarvisVoiceBtn.title = 'Listening... click to stop';
        }
        addWizardMessage('🎤 Listening, sir...');
    };
    
    recognition.onend = () => {
        isListening = false;
        if (jarvisVoiceBtn) {
            jarvisVoiceBtn.classList.remove('listening');
            jarvisVoiceBtn.title = 'Voice command';
        }
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        addWizardMessage(`🎤 I heard: "${transcript}"`);
        setTimeout(() => sendMessage(), 500);
    };
    
    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        addWizardMessage(`🎤 Sorry, I couldn't hear you. Error: ${event.error}`);
        isListening = false;
        if (jarvisVoiceBtn) {
            jarvisVoiceBtn.classList.remove('listening');
        }
    };
    
    return true;
}

function toggleVoiceRecognition() {
    if (!recognition) {
        if (!initializeVoiceRecognition()) {
            addWizardMessage('Voice recognition is not supported in your browser, sir.');
            return;
        }
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        try {
            recognition.start();
        } catch (e) {
            console.error('Voice start error:', e);
            addWizardMessage('🎤 Could not start voice recognition. Please try again.');
        }
    }
}

function performSystemDiagnostic() {
    const now = new Date();
    const uptime = Math.floor(Math.random() * 24) + 1;
    const activeUsers = Math.floor(Math.random() * 15) + 5;
    const cpuLoad = Math.floor(Math.random() * 40) + 20;
    const memoryUsage = Math.floor(Math.random() * 30) + 40;
    
    const diagnostic = {
        timestamp: now.toLocaleString(),
        system: 'Wizard.AI v5.0',
        uptime: `${uptime} hours`,
        activeUsers: activeUsers,
        cpuLoad: `${cpuLoad}%`,
        memoryUsage: `${memoryUsage}%`,
        responseTime: responseTimeEl ? responseTimeEl.textContent : '0.4s',
        currentMode: currentMode,
        activeChat: chats[activeChatId]?.name || 'Main Chat',
        totalChats: chatIds.length,
        totalMessages: messages.length,
        database: 'SQLite (synced)',
        apiStatus: 'Groq API: Online',
        emailService: 'Resend: Ready'
    };
    
    return diagnostic;
}

function activateSuitUpMode() {
    document.body.classList.add('jarvis-mode-active');
    
    if (jarvisEasterEgg) {
        jarvisEasterEgg.style.display = 'flex';
    }
    
    if (jarvisVoiceBtn && currentMode === 'JARVIS') {
        jarvisVoiceBtn.style.display = 'flex';
    }
    
    simulateHapticFeedback();
    
    const randomGreeting = jarvisGreetings[Math.floor(Math.random() * jarvisGreetings.length)];
    
    return `🔷 SUIT UP mode activated. ${randomGreeting} All systems are now running in JARVIS configuration.`;
}

function deactivateSuitUpMode() {
    document.body.classList.remove('jarvis-mode-active');
    
    if (jarvisEasterEgg) {
        jarvisEasterEgg.style.display = 'none';
    }
    
    if (jarvisVoiceBtn) {
        jarvisVoiceBtn.style.display = 'none';
    }
}

function simulateHapticFeedback() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.removeEventListener('click', hapticHandler);
        btn.addEventListener('click', hapticHandler);
    });
}

function hapticHandler(e) {
    const btn = e.currentTarget;
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 100);
}

function handleJarvisCommand(text) {
    const lowerText = text.toLowerCase().trim();
    
    // Diagnostic command
    if (lowerText.includes('diagnostic') || lowerText.includes('system status') || lowerText.includes('system report')) {
        const diag = performSystemDiagnostic();
        return `🔷 **System Diagnostic Report**\n\n` +
               `• **Time**: ${diag.timestamp}\n` +
               `• **System**: ${diag.system}\n` +
               `• **Uptime**: ${diag.uptime}\n` +
               `• **Active Users**: ${diag.activeUsers}\n` +
               `• **CPU Load**: ${diag.cpuLoad}\n` +
               `• **Memory**: ${diag.memoryUsage}\n` +
               `• **Response Time**: ${diag.responseTime}\n` +
               `• **Current Mode**: ${diag.currentMode}\n` +
               `• **Active Chat**: ${diag.activeChat}\n` +
               `• **Total Chats**: ${diag.totalChats}\n` +
               `• **Messages**: ${diag.totalMessages}\n` +
               `• **Database**: ${diag.database}\n` +
               `• **API**: ${diag.apiStatus}\n` +
               `• **Email**: ${diag.emailService}\n\n` +
               `All systems are operational, sir. Would you like me to run any specific tests?`;
    }
    
    // Suit up command
    if (lowerText.includes('suit up') || lowerText.includes('jarvis mode') || lowerText === 'suit' || lowerText.includes('suit up')) {
        if (!document.body.classList.contains('jarvis-mode-active')) {
            if (lowerText.includes('suit')) {
                const suitResponse = `*holographic displays flicker to life*\n\n` +
                    `🔷 **Initiating Mark LXXXV (Mark 85) suit-up sequence**\n` +
                    `🔷 **Nanotech particles activating**\n` +
                    `🔷 **Repulsor tech online**\n` +
                    `🔷 **Flight systems calibrated**\n` +
                    `🔷 **Heads-up display engaged**\n\n` +
                    `I should clarify, sir, that I'm not actually connected to a physical suit – this is purely a visual enhancement. ` +
                    `But Tony always said presentation is half the battle. Welcome to SUIT UP mode.`;
                
                activateSuitUpMode();
                return suitResponse;
            }
            return activateSuitUpMode();
        } else {
            return "We're already in SUIT UP mode, sir. All systems are running at optimal performance. Would you like me to run a diagnostic?";
        }
    }
    
    // Voice command help
    if (lowerText.includes('voice') || lowerText.includes('mic') || lowerText.includes('speak') || lowerText.includes('microphone')) {
        if (jarvisVoiceBtn && jarvisVoiceBtn.style.display !== 'none') {
            return `Voice commands are available, sir. Simply click the 🎤 button next to the send button and speak. I'll transcribe your words and process them. Would you like to try it now?`;
        } else {
            return `Voice commands are available in JARVIS mode, sir. Please switch to JARVIS mode first, then look for the 🎤 button.`;
        }
    }
    
    // Status command - FIXED
    if (lowerText.includes('status') || lowerText.includes('how are you') || lowerText.includes("how's it going")) {
        const diag = performSystemDiagnostic();
        return `I'm functioning optimally, sir. Current system load is ${diag.cpuLoad} with ${diag.activeUsers} active users. Response time is ${diag.responseTime}. Everything is running smoothly. How may I assist you?`;
    }
    
    // Easter egg hint
    if (lowerText.includes('easter egg') || lowerText.includes('secret') || lowerText.includes('hidden')) {
        return `Ah, curious about secrets, sir? Try saying "diagnostic", "suit up", or "status". Also, keep an eye on the sidebar when in JARVIS mode for additional hints. Tony always said the best features are the ones you discover yourself.`;
    }
    
    return null;
}

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

// ============================================
// TOOLTIP FUNCTIONS - FIXED POSITIONING
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
                <div style="font-weight: bold; color: #c4b5fd; font-size: 14px; margin-bottom: 4px;">${mode.name}</div>
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
    
    // Default: to the right of cursor
    let left = event.clientX + 20;
    let top = event.clientY - 30;
    
    // Adjust if too far right
    if (left + tooltipRect.width > viewportWidth - 20) {
        left = event.clientX - tooltipRect.width - 20;
    }
    
    // Adjust if too far left
    if (left < 20) {
        left = 20;
    }
    
    // Adjust if too far bottom
    if (top + tooltipRect.height > viewportHeight - 20) {
        top = event.clientY - tooltipRect.height - 20;
    }
    
    // Adjust if too far top
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

async function saveUserChats() {
    if (!currentUser) return;
    
    const chatsArray = chatIds.map(id => {
        const chat = chats[id];
        return {
            chat_id: id,
            name: chat.name,
            emoji: chat.emoji,
            mode: chat.mode,
            messages: chat.messages || [],
            created_at: chat.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    });
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/save-chats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                chats: chatsArray,
                chat_order: chatIds
            }),
            credentials: 'include'
        });
        
        if (response.ok) {
            console.log('✅ Chats saved to cloud');
        } else {
            console.error('❌ Failed to save chats');
        }
    } catch (error) {
        console.error('❌ Error saving chats:', error);
    }
}

function renderChatsList() {
    if (!chatsList) return;
    
    chatsList.innerHTML = '';
    
    chatIds.forEach(chatId => {
        const chat = chats[chatId];
        if (!chat) return;
        
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
    
    if (chats[activeChatId]) {
        chats[activeChatId].messages = [...messages];
        chats[activeChatId].mode = currentMode;
        chats[activeChatId].updated_at = new Date().toISOString();
    }
    
    activeChatId = chatId;
    const newChat = chats[activeChatId];
    newChat.updated_at = new Date().toISOString();
    
    currentMode = newChat.mode || 'JARVIS';
    
    updateModeDisplay();
    loadActiveChatMessages();
    renderChatsList();
    
    if (currentMode === 'JARVIS') {
        if (!document.body.classList.contains('jarvis-mode-active')) {
            activateSuitUpMode();
        } else {
            if (jarvisVoiceBtn) jarvisVoiceBtn.style.display = 'flex';
            if (jarvisEasterEgg) jarvisEasterEgg.style.display = 'flex';
        }
    } else {
        if (document.body.classList.contains('jarvis-mode-active')) {
            deactivateSuitUpMode();
        }
    }
    
    if (currentUser) {
        saveUserChats();
    }
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
        if (mode.hidden) return;
        
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
            
            if (currentMode === 'JARVIS') {
                if (!document.body.classList.contains('jarvis-mode-active')) {
                    addWizardMessage(activateSuitUpMode());
                } else {
                    addWizardMessage(`🔄 Switched to ${modeKey} mode! ${modeGreetings[modeKey] || ''}`);
                }
            } else {
                if (document.body.classList.contains('jarvis-mode-active')) {
                    deactivateSuitUpMode();
                }
                addWizardMessage(`🔄 Switched to ${modeKey} mode! ${modeGreetings[modeKey] || ''}`);
            }
            
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
// TURBO MODE TOGGLE
// ============================================

function addTurboToggle() {
    const container = document.getElementById('turbo-toggle-container');
    if (!container) return;
    
    const turboDiv = document.createElement('div');
    turboDiv.className = 'mode-selector';
    turboDiv.innerHTML = `
        <h3 style="color: #c4b5fd; font-size: 14px; margin-bottom: 10px;">
            <span>⚡</span> TURBO MODE
        </h3>
        <button id="turbo-btn" style="width: 100%; padding: 10px; background: #4b5563; border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
            <span>🔴</span> TURBO OFF
        </button>
    `;
    
    container.appendChild(turboDiv);
    
    const turboBtn = document.getElementById('turbo-btn');
    if (turboBtn) {
        turboBtn.addEventListener('click', () => {
            turboMode = !turboMode;
            
            if (turboMode) {
                turboBtn.style.background = '#ef4444';
                turboBtn.innerHTML = '<span>⚡</span> TURBO ON';
                addWizardMessage('⚡ Turbo mode activated!');
            } else {
                turboBtn.style.background = '#4b5563';
                turboBtn.innerHTML = '<span>🔴</span> TURBO OFF';
                addWizardMessage('✨ Turbo mode deactivated.');
            }
        });
    }
}

// ============================================
// SEND MESSAGE - FIXED WITH MEMORY
// ============================================

async function sendMessage() {
    if (isThinking) return;
    
    const text = chatInput.value.trim();
    if (!text) return;
    
    renderUserMessage(text);
    messages.push({ sender: 'user', text });
    chatInput.value = '';
    updateMessageCount();
    
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
        
        // Check for JARVIS special commands first
        if (currentMode === 'JARVIS') {
            const jarvisResponse = handleJarvisCommand(text);
            if (jarvisResponse) {
                thinkingDiv.remove();
                renderWizardMessage(jarvisResponse, currentMode);
                messages.push({ sender: 'wizard', text: jarvisResponse, mode: currentMode });
                updateMessageCount();
                
                if (chats[activeChatId]) {
                    chats[activeChatId].messages = [...messages];
                    chats[activeChatId].updated_at = new Date().toISOString();
                }
                
                if (currentUser) {
                    saveUserChats();
                }
                
                isThinking = false;
                chatInput.disabled = false;
                sendBtn.disabled = false;
                sendBtn.classList.remove('loading');
                chatInput.focus();
                return;
            }
        }
        
        // Send to backend with conversation history
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: text,
                mode: currentMode,
                turbo: turboMode,
                history: messages.slice(-10)  // Send last 10 messages for context
            })
        });
        
        const data = await response.json();
        const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}s`;
        }
        
        thinkingDiv.remove();
        
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
        
        let baseSpeed = 20;
        if (currentMode === 'Fast') baseSpeed = 12;
        else if (currentMode === 'Nerd' || currentMode === 'ORACLE') baseSpeed = 25;
        
        await typeMessage(wizardMsgDiv, respTextSpan, data.reply, baseSpeed);
        
        messages.push({ 
            sender: 'wizard', 
            text: data.reply,
            mode: currentMode
        });
        
        updateMessageCount();
        
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
            initializeLocalChats();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUIForAuth();
        initializeLocalChats();
    }
}

function updateUIForAuth() {
    if (currentUser) {
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
        userEmail.textContent = currentUser.email;
    } else {
        userInfo.style.display = 'none';
        authButtons.style.display = 'flex';
    }
}

function showAuthModal(loginMode = true) {
    isLoginMode = loginMode;
    authModalTitle.textContent = loginMode ? 'Login to Wizard.AI' : 'Create Account';
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
            authError.textContent = `Code sent to ${email}`;
            authError.style.color = '#10b981';
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
            
            chats = {};
            chatIds = [];
            
            data.chats.forEach(chat => {
                chats[chat.chat_id] = chat;
                chatIds.push(chat.chat_id);
            });
            
            if (data.chat_order && data.chat_order.length > 0) {
                chatIds = data.chat_order;
            }
            
            activeChatId = chatIds[0];
            currentMode = chats[activeChatId].mode || 'JARVIS';
            
            if (currentMode === 'JARVIS') {
                activateSuitUpMode();
            }
            
            renderChatsList();
            updateModeDisplay();
            loadActiveChatMessages();
            addWizardMessage(`✨ Welcome, ${currentUser.first_name}!`);
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
            
            chats = {};
            chatIds = [];
            
            data.chats.forEach(chat => {
                chats[chat.chat_id] = chat;
                chatIds.push(chat.chat_id);
            });
            
            if (data.chat_order && data.chat_order.length > 0) {
                chatIds = data.chat_order;
            }
            
            activeChatId = chatIds[0];
            currentMode = chats[activeChatId].mode || 'JARVIS';
            
            if (currentMode === 'JARVIS') {
                activateSuitUpMode();
            }
            
            renderChatsList();
            updateModeDisplay();
            loadActiveChatMessages();
            addWizardMessage(`✨ Welcome back, ${currentUser.first_name}!`);
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
    initializeLocalChats();
    deactivateSuitUpMode();
    addWizardMessage('👋 You have been logged out.');
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
                chats = {};
                chatIds = [];
                
                data.chats.forEach(chat => {
                    chats[chat.chat_id] = chat;
                    chatIds.push(chat.chat_id);
                });
                
                if (data.chat_order && data.chat_order.length > 0) {
                    chatIds = data.chat_order;
                }
                
                activeChatId = chatIds[0];
                currentMode = chats[activeChatId].mode || 'JARVIS';
                
                if (currentMode === 'JARVIS') {
                    activateSuitUpMode();
                }
                
                renderChatsList();
                updateModeDisplay();
                loadActiveChatMessages();
            }
        }
    } catch (error) {
        console.error('Failed to load chats:', error);
    }
}

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
    
    activateSuitUpMode();
    
    renderChatsList();
    updateModeDisplay();
    chatHistory.innerHTML = '';
    addWizardMessage('✨ Welcome to Wizard.AI! Select a mode to begin.');
}

// ============================================
// STATUS FUNCTIONS
// ============================================

async function checkSystemStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        
        if (response.ok) {
            updateConnectionStatus('connected');
            
            if (modelList) {
                modelList.innerHTML = `
                    <div class="model-item">
                        <span>⚡</span> Llama 3.1 8B <span style="color:#10b981;">✅</span>
                    </div>
                    <div class="model-item">
                        <span>🧠</span> Llama 3.3 70B <span style="color:#10b981;">✅</span>
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
    
    if (jarvisVoiceBtn) {
        jarvisVoiceBtn.addEventListener('click', toggleVoiceRecognition);
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
        resendCodeBtn.addEventListener('click', async () => {
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
            } catch (error) {
                authError.textContent = 'Failed to resend';
                authError.style.color = '#ef4444';
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    console.log('🚀 Initializing Wizard.AI JARVIS ULTIMATE...');
    console.log('🔗 Backend URL:', API_BASE_URL);
    
    createTooltip();
    updateConnectionStatus('connecting');
    
    initializeVoiceRecognition();
    
    await checkAuth();
    
    if (!currentUser) {
        initializeLocalChats();
    }
    
    await checkSystemStatus();
    setupDropdown();
    setupEventListeners();
    setupModal();
    addTurboToggle();
    
    console.log('✅ Wizard.AI JARVIS ULTIMATE initialized successfully');
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

// Start the app
document.addEventListener('DOMContentLoaded', init);



