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
const modeSelect = document.getElementById('mode-select');
const messageCount = document.getElementById('message-count');
const currentModel = document.getElementById('current-model');
const responseTimeEl = document.getElementById('response-time');
const modelList = document.getElementById('model-list');
const statusText = document.getElementById('status-text');
const statusDot = document.querySelector('.status-dot');

// Generate unique session ID
const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

// State
let messages = [];
let isThinking = false;
let currentMode = 'JARVIS';
let turboMode = false;

// Model mapping with CORRECT emojis and info
const modelMap = {
    'Fast': { name: 'Llama 3.1 8B', emoji: '⚡', description: 'Lightning fast', apiModel: 'llama-3.1-8b-instant' },
    'Normal': { name: 'Llama 3.1 8B', emoji: '✨', description: 'Balanced', apiModel: 'llama-3.1-8b-instant' },
    'Fun': { name: 'Llama 3.3 70B', emoji: '🎉', description: 'Creative', apiModel: 'llama-3.3-70b-versatile' },
    'Sarcastic': { name: 'Llama 3.1 8B', emoji: '😏', description: 'Witty', apiModel: 'llama-3.1-8b-instant' },
    'Nerd': { name: 'Llama 3.3 70B', emoji: '🧠', description: 'Smart', apiModel: 'llama-3.3-70b-versatile' },
    'JARVIS': { name: 'Llama 3.1 8B', emoji: '🎩', description: 'Sophisticated', apiModel: 'llama-3.1-8b-instant' },
    'ORACLE': { name: 'Llama 3.3 70B', emoji: '🔮', description: 'All-knowing', apiModel: 'llama-3.3-70b-versatile' }
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
    const mode = modeSelect.value;
    const info = modelMap[mode] || { emoji: '✨', name: 'Loading...' };
    
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
        const mode = modeSelect.value;
        const info = modelMap[mode] || { emoji: '🧙' };
        iconSpan.textContent = isThinkingMsg ? '⏳' : info.emoji;
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

// Typing effect with dynamic speed based on response length
async function typeMessage(messageDiv, textSpan, fullText, baseSpeed = 20) {
    return new Promise((resolve) => {
        let i = 0;
        messageDiv.classList.add('typing-active');
        
        // Calculate dynamic speed based on text length
        // Longer text = faster typing so user doesn't wait forever
        const textLength = fullText.length;
        let speed = baseSpeed;
        
        if (textLength > 2000) {
            speed = 5; // Super fast for extremely long responses
        } else if (textLength > 1000) {
            speed = 8; // Very fast for very long responses
        } else if (textLength > 500) {
            speed = 12; // Fast for long responses
        } else if (textLength > 200) {
            speed = 15; // Medium-fast
        }
        
        // Turbo mode overrides to be faster
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
    
    // Add user message instantly
    addMessage('user', text);
    chatInput.value = '';
    
    // Disable input
    isThinking = true;
    chatInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.classList.add('loading');
    
    // Show thinking indicator
    const thinkingMsg = addMessage('wizard', '✨', true, true);
    
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
        
        // Update response time in sidebar
        if (responseTimeEl) {
            responseTimeEl.textContent = `${responseTime}s`;
        }
        
        // Remove thinking indicator
        if (thinkingMsg.div.parentNode) {
            thinkingMsg.div.remove();
        }
        
        // Create wizard message container
        const mode = modeSelect.value;
        const info = modelMap[mode] || { emoji: '🧙' };
        
        const wizardMsgDiv = document.createElement('div');
        wizardMsgDiv.className = 'message wizard';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'message-icon';
        iconSpan.textContent = info.emoji;
        
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
        
        // Determine base typing speed based on mode
        let baseSpeed = 20; // Default
        
        if (mode === 'Fast') {
            baseSpeed = 12; // Faster for Fast mode
        } else if (mode === 'Nerd' || mode === 'ORACLE') {
            baseSpeed = 25; // Slightly slower for dramatic effect
        }
        
        // Type the response with dynamic speed
        await typeMessage(wizardMsgDiv, textSpan, data.reply, baseSpeed);
        
        // Add to messages array
        messages.push({ sender: 'wizard', text: data.reply });
        if (messageCount) {
            messageCount.textContent = messages.length;
        }
        
        // Update model info
        if (data.model && currentModel) {
            const info = modelMap[modeSelect.value] || { emoji: '✨' };
            currentModel.innerHTML = `${info.emoji} ${data.model}`;
        }
        
    } catch (error) {
        console.error('Chat error:', error);
        
        if (thinkingMsg.div.parentNode) {
            thinkingMsg.div.remove();
        }
        
        // Show user-friendly error message
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
        // Fade out messages
        const msgs = document.querySelectorAll('.message');
        msgs.forEach(msg => {
            msg.style.transition = 'opacity 0.3s, transform 0.3s';
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
        });
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Clear chat
        chatHistory.innerHTML = '';
        messages = [];
        
        if (messageCount) {
            messageCount.textContent = '0';
        }
        
        // Reset on backend
        await fetch(`${API_BASE_URL}/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sessionId })
        });
        
        const mode = modeSelect.value;
        const greeting = modeGreetings[mode] || 'Ready for new adventures!';
        addMessage('wizard', `🧹 Memory wiped! ${greeting}`, false, true);
        
        // Refresh status
        await checkSystemStatus();
        
    } catch (error) {
        console.error('Reset failed:', error);
        // Even if backend reset fails, clear local chat
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
    
    // Insert after mode selector
    const modeSelector = document.querySelector('.mode-selector');
    if (modeSelector) {
        modeSelector.parentNode.insertBefore(turboDiv, modeSelector.nextSibling);
    }
    
    // Add event listener
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

// Emergency reset (F2 key)
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .message {
        animation: slideIn 0.3s ease;
    }
    
    .send-button.loading {
        position: relative;
        overflow: hidden;
    }
    
    .send-button.loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        from { left: -100%; }
        to { left: 100%; }
    }
    
    .message.thinking .message-icon {
        animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    /* Only show cursor when typing is active */
    .message.wizard.typing-active .message-text::after {
        content: '|';
        animation: blink 1s infinite;
        margin-left: 2px;
        color: #8b5cf6;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;

document.head.appendChild(style);

// Start the app
document.addEventListener('DOMContentLoaded', init);
