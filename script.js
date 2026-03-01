// ============================================
// GLOBAL CONFIGURATION
// ============================================
const API_BASE_URL = 'https://Arnav0928.pythonanywhere.com';
// ============================================

// DOM Elements
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');
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

// Generate unique session ID
const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

// State
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;
let tooltipEl = null;
let tooltipTimeout = null;

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
    updateConnectionStatus('connecting');
    await loadModes();
    await checkSystemStatus();
    setupDropdown();
    setupEventListeners();
    addTurboToggle();
    addMessage('wizard', '✨ Welcome to Wizard.AI! Select a mode and toggle Turbo for extra speed!', false, true);
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
    
    // Clear any pending hide timeout
    if (tooltipTimeout) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = null;
    }
    
    // Set tooltip content
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
    
    // Position tooltip near mouse
    const x = event.clientX + 15;
    const y = event.clientY - 20;
    
    // Keep tooltip within window bounds
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
    
    // Clear existing content
    dropdownContent.innerHTML = '';
    
    // Create dropdown items from modeData
    Object.keys(modeData).forEach(modeKey => {
        const mode = modeData[modeKey];
        const item = document.createElement('div');
        item.className = `dropdown-item ${modeKey === currentMode ? 'selected' : ''}`;
        item.setAttribute('data-mode', modeKey);
        
        // Item content (without inline tooltip)
        item.innerHTML = `
            <span style="font-size: 18px;">${mode.emoji}</span>
            <span>${modeKey}</span>
        `;
        
        // Mouse enter - show tooltip
        item.addEventListener('mouseenter', (e) => {
            showTooltip(modeKey, e);
        });
        
        // Mouse move - update tooltip position
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
        
        // Mouse leave - hide tooltip
        item.addEventListener('mouseleave', () => {
            hideTooltip();
        });
        
        // Click handler
        item.addEventListener('click', () => {
            // Update selected mode
            currentMode = modeKey;
            selectedDisplay.innerHTML = `${mode.emoji} ${modeKey}`;
            
            // Update selected class
            document.querySelectorAll('.dropdown-item').forEach(el => {
                el.classList.remove('selected');
            });
            item.classList.add('selected');
            
            // Close dropdown
            dropdown.classList.remove('open');
            
            // Hide tooltip immediately
            if (tooltipEl) {
                tooltipEl.style.display = 'none';
            }
            
            // Show mode change message
            const greeting = modeGreetings[modeKey] || `Switched to ${modeKey} mode!`;
            addMessage('wizard', `🔄 ${greeting}`, false, true);
            
            // Update model display
            updateModelInfo();
        });
        
        dropdownContent.appendChild(item);
    });
    
    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Set initial display
    const initialMode = modeData[currentMode];
    selectedDisplay.innerHTML = `${initialMode.emoji} ${currentMode}`;
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
        
        // Update model list with accurate info
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
    
    resetBtn.addEventListener('click', resetChat);
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
        
        if (textLength > 2000) {
            speed = 5;
        } else if (textLength > 1000) {
            speed = 8;
        } else if (textLength > 500) {
            speed = 12;
        } else if (textLength > 200) {
            speed = 15;
        }
        
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
        if (currentMode === 'Fast') {
            baseSpeed = 12;
        } else if (currentMode === 'Nerd' || currentMode === 'ORACLE') {
            baseSpeed = 25;
        }
        
        await typeMessage(wizardMsgDiv, textSpan, data.reply, baseSpeed);
        
        messages.push({ sender: 'wizard', text: data.reply });
        if (messageCount) {
            messageCount.textContent = messages.length;
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

// Reset chat
async function resetChat() {
    try {
        const msgs = document.querySelectorAll('.message');
        msgs.forEach(msg => {
            msg.style.transition = 'opacity 0.3s, transform 0.3s';
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        chatHistory.innerHTML = '';
        messages = [];
        
        if (messageCount) {
            messageCount.textContent = '0';
        }
        
        await fetch(`${API_BASE_URL}/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        
        const greeting = modeGreetings[currentMode] || 'Ready for new adventures!';
        addMessage('wizard', `🧹 Memory wiped! ${greeting}`, false, true);
        
        await checkSystemStatus();
        
    } catch (error) {
        console.error('Reset failed:', error);
        chatHistory.innerHTML = '';
        messages = [];
        if (messageCount) messageCount.textContent = '0';
        addMessage('wizard', '🧹 Memory wiped locally!', false, true);
    }
}

// Add Turbo Mode Toggle
function addTurboToggle() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    const turboDiv = document.createElement('div');
    turboDiv.className = 'mode-selector';
    turboDiv.style.marginTop = '10px';
    turboDiv.style.marginBottom = '15px';
    turboDiv.style.padding = '10px';
    turboDiv.style.background = 'rgba(139, 92, 246, 0.15)';
    turboDiv.style.borderRadius = '12px';
    turboDiv.style.border = '1px solid #8b5cf6';
    
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
    
    const modeSelector = document.querySelector('.mode-selector');
    if (modeSelector) {
        modeSelector.parentNode.insertBefore(turboDiv, modeSelector.nextSibling);
    }
    
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
