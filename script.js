// ============================================
// GLOBAL CONFIGURATION - Neocities Compatible
// ============================================
const API_BASE_URL = '/proxy/https://Arnav0928.pythonanywhere.com';
// ============================================

// DOM Elements
const chatHistory = document.getElementById('chat-history');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn');
const modeSelect = document.getElementById('mode-select');
const messageCount = document.getElementById('message-count');
const currentModel = document.getElementById('current-model');
const responseTimeEl = document.getElementById('response-time');
const modelStatusEl = document.getElementById('model-status');
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');

// Generate unique session ID
const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

// State
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;

// Model mapping (same as before)
const modelMap = {
    'Fast': { name: 'phi3:mini', emoji: '⚡', description: 'Lightning fast' },
    'Normal': { name: 'phi3:mini', emoji: '✨', description: 'Balanced' },
    'Fun': { name: 'phi3:mini', emoji: '🎉', description: 'Playful' },
    'Sarcastic': { name: 'phi3:mini', emoji: '😏', description: 'Witty' },
    'Nerd': { name: 'gemma:2b', emoji: '🧠', description: 'Smart' },
    'JARVIS': { name: 'gemma:2b', emoji: '🎩', description: 'Sophisticated' },
    'ORACLE': { name: 'llama3', emoji: '🔮', description: 'All-knowing' }
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
    
    updateConnectionStatus('connecting');
    await loadModes();
    await checkSystemStatus();
    setupEventListeners();
    addTurboToggle();
    addMessage('wizard', '✨ Welcome to Wizard.AI! Select a mode and toggle Turbo for extra speed!', false, true);
}

// Update connection status
function updateConnectionStatus(status) {
    const statusText = document.getElementById('status-text');
    const statusDot = document.querySelector('.status-dot');
    
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

// Load modes
async function loadModes() {
    try {
        const response = await fetch(`${API_BASE_URL}/modes`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        modeSelect.innerHTML = data.modes.map(mode => {
            const info = modelMap[mode] || { emoji: '✨' };
            return `<option value="${mode}" ${mode === 'JARVIS' ? 'selected' : ''}>${info.emoji} ${mode}</option>`;
        }).join('');
        
        updateModelInfo();
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
            headers: {
                'Accept': 'application/json',
            }
        });
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Backend connected:', data);
        
        updateConnectionStatus('connected');
        
        // Update model list
        const modelList = document.getElementById('model-list');
        if (modelList) {
            modelList.innerHTML = `
                <div class="model-item">
                    <div class="model-name">
                        <span>⚡</span>
                        <span>Mixtral 8x7B</span>
                        <span class="model-badge" style="background:#10b981;">FAST</span>
                    </div>
                    <span class="model-status-badge">✅</span>
                </div>
                <div class="model-item">
                    <div class="model-name">
                        <span>🧠</span>
                        <span>Llama 3 70B</span>
                        <span class="model-badge" style="background:#8b5cf6;">POWERFUL</span>
                    </div>
                    <span class="model-status-badge">✅</span>
                </div>
            `;
        }
        
    } catch (error) {
        console.error('❌ Connection failed:', error);
        updateConnectionStatus('offline');
        
        const modelList = document.getElementById('model-list');
        if (modelList) {
            modelList.innerHTML = `
                <div style="background:rgba(239,68,68,0.1); border:1px solid #ef4444; border-radius:8px; padding:12px;">
                    <strong style="color:#ef4444;">⚠️ Cannot Connect</strong>
                    <div style="color:#fff; font-size:12px; margin:8px 0;">${error.message}</div>
                    <div style="color:#9ca3af; font-size:11px;">Backend: ${API_BASE_URL}</div>
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
    const mode = modeSelect.value;
    const info = modelMap[mode] || { emoji: '✨' };
    if (currentModel) {
        currentModel.innerHTML = `${info.emoji} ${info.name}`;
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
    
    modeSelect.addEventListener('change', () => {
        const mode = modeSelect.value;
        updateModelInfo();
        const greeting = modeGreetings[mode] || `Switched to ${mode} mode!`;
        addMessage('wizard', `🔄 ${greeting}`, false, true);
    });
}

// Add message
function addMessage(sender, text, isThinkingMsg = false, instant = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}${isThinkingMsg ? ' thinking' : ''}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'message-icon';
    iconSpan.textContent = sender === 'user' ? '👤' : (modelMap[modeSelect.value]?.emoji || '🧙');
    
    const textSpan = document.createElement('span');
    textSpan.className = 'message-text';
    textSpan.textContent = text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contentDiv.appendChild(iconSpan);
    contentDiv.appendChild(textSpan);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timeSpan);
    
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    return messageDiv;
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
    
    const thinkingMsg = addMessage('wizard', '✨', true);
    
    try {
        const startTime = Date.now();
        
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: text,
                mode: modeSelect.value,
                session_id: sessionId,
                turbo: turboMode
            })
        });
        
        const data = await response.json();
        const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}s`;
        }
        
        if (thinkingMsg.parentNode) {
            thinkingMsg.remove();
        }
        
        addMessage('wizard', data.reply);
        
    } catch (error) {
        console.error('Chat error:', error);
        if (thinkingMsg.parentNode) {
            thinkingMsg.remove();
        }
        addMessage('wizard', '⚠️ Connection error!');
    } finally {
        isThinking = false;
        chatInput.disabled = false;
        sendBtn.disabled = false;
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
        
        const mode = modeSelect.value;
        const greeting = modeGreetings[mode] || 'Ready for new adventures!';
        addMessage('wizard', `🧹 Memory wiped! ${greeting}`, false, true);
        
        await checkSystemStatus();
        
    } catch (error) {
        console.error('Reset failed:', error);
        chatHistory.innerHTML = '';
        messages = [];
        if (messageCount) messageCount.textContent = '0';
        addMessage('wizard', '🧹 Memory wiped!', false, true);
    }
}

// Add Turbo toggle
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
        <h2 style="color: #c4b5fd; font-size: 14px; margin-bottom: 10px; display: flex; align-items: center; gap: 5px;">
            <span>⚡</span> TURBO MODE
        </h2>
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
                addMessage('wizard', '⚡ Turbo activated!', false, true);
            } else {
                turboBtn.style.background = '#4b5563';
                turboBtn.innerHTML = '<span>🔴</span> TURBO OFF';
                addMessage('wizard', '✨ Turbo deactivated.', false, true);
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
        chatInput.focus();
        addMessage('wizard', '🔧 Emergency reset - you can type again!', false, true);
    }
});

// Start the app
document.addEventListener('DOMContentLoaded', init);