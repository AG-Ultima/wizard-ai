// ============================================
// WIZARD.AI PRO v15.1.0 — WIZPROFILE UPDATE
// Complete Frontend Controller — Grimoire Edition
// Created by Arnav Gupta
// ============================================

const API_BASE_URL = 'https://arnav0928.pythonanywhere.com';

// ============================================
// STARFIELD (ecosystem-matched)
// ============================================
(function () {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const N = 220;
    const stars = [];

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < N; i++) {
        stars.push({
            x: Math.random(), y: Math.random(),
            r: Math.random() * 1.4 + 0.2,
            a: Math.random(), speed: Math.random() * 0.0006 + 0.0002,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = Date.now() / 1000;
        stars.forEach(s => {
            const alpha = 0.2 + 0.55 * Math.sin(t * s.speed * 6000 + s.a * 100);
            ctx.beginPath();
            ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212,208,232,${alpha})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
})();

// ============================================
// MARKDOWN RENDERER
// ============================================
function renderMarkdown(text) {
    if (!text) return '';
    let html = text;
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm,  '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm,   '<h1>$1</h1>');
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/^\s*[-*]\s+(.*$)/gm, '<li>$1</li>');
    html = html.replace(/^\s*\d+\.\s+(.*$)/gm, '<li class="ol">$1</li>');
    html = html.replace(/(<li>(?!.*class="ol")[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>');
    html = html.replace(/(<li class="ol">[\s\S]*?<\/li>\n?)+/g, m =>
        '<ol>' + m.replace(/class="ol"/g, '') + '</ol>');
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/\n/g, '<br>');
    html = '<p>' + html.replace(/<br><br>/g, '</p><p>') + '</p>';
    html = html.replace(/<p><\/p>/g, '');
    return html;
}

// ============================================
// UTILS
// ============================================
function escapeHtml(s) {
    if (!s) return '';
    return String(s)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function $(id) { return document.getElementById(id); }

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.style.animation = '';
    void modal.offsetWidth; // reflow
    const box = modal.querySelector('.modal-box');
    if (box) { box.style.animation = 'none'; void box.offsetWidth; box.style.animation = ''; }
    const focusable = modal.querySelectorAll('input, button, select, textarea');
    if (focusable.length) setTimeout(() => focusable[0].focus(), 50);
}

function closeModal(modal) {
    if (!modal) return;
    const box = modal.querySelector('.modal-box');
    if (box) {
        box.style.animation = 'modalOut 0.22s cubic-bezier(0.4,0,0.6,1) both';
    }
    setTimeout(() => {
        modal.classList.remove('active');
        if (box) box.style.animation = '';
    }, 200);
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m));
}

// Inject modalOut keyframe
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalOut {
            from { opacity:1; transform:scale(1) translateY(0); }
            to   { opacity:0; transform:scale(0.93) translateY(14px); }
        }
    `;
    document.head.appendChild(style);
})();

function showNotification(message, type = 'info', duration = 3200) {
    const toast = $('notification-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'notification-toast';
    // Slight delay to trigger transition
    requestAnimationFrame(() => {
        toast.classList.add('show');
        if (type === 'error')   toast.classList.add('error');
        if (type === 'success') toast.classList.add('success');
    });
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================================
// RIPPLE EFFECT (for primary buttons)
// ============================================
function addRipple(btn) {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position:absolute; border-radius:50%; pointer-events:none;
            width:${size}px; height:${size}px;
            left:${e.clientX - rect.left - size/2}px;
            top:${e.clientY - rect.top - size/2}px;
            background:rgba(255,255,255,0.25);
            animation:rippleAnim 0.55s ease-out both;
            z-index:10;
        `;
        btn.style.overflow = 'hidden';
        btn.style.position = 'relative';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
}
(function() {
    const style = document.createElement('style');
    style.textContent = `@keyframes rippleAnim { from{transform:scale(0);opacity:1;} to{transform:scale(2.2);opacity:0;} }`;
    document.head.appendChild(style);
})();

// ============================================
// STATE
// ============================================
let messages         = [];
let isThinking       = false;
let currentMode      = 'JARVIS';
let turboMode        = false;
let searchMode       = false;
let currentUser      = null;
let activeChatId     = 'default';
let chats            = {};
let chatIds          = ['default'];
let customPersonalities  = [];
let publicPersonalities  = [];
let isLoginMode      = true;
let signupEmail      = '';
let chatToRename     = null;
let userProfile      = null;
let voiceRecognition = null;
let isVoiceListening = false;
let sessionCheckInterval = null;
let pwaDeferredPrompt    = null;

let userStats = {
    messages: 0, files: 0, memories: 0, images: 0, searches: 0,
    codeExecutions: 0, responseTimes: [], todayMessages: 0
};

const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
let sidebarState = { left: false, right: false };

// ============================================
// MODE DATA
// ============================================
const modeData = {
    'Fast':      { emoji:'⚡', name:'Fast Mode',      desc:'Lightning quick responses.',     model:'Llama 4 Scout', color:'#5cb87a' },
    'Normal':    { emoji:'✨', name:'Normal Mode',    desc:'Balanced conversation.',          model:'Llama 4 Scout', color:'#5cb87a' },
    'Fun':       { emoji:'🎉', name:'Fun Mode',       desc:'Playful and energetic!',          model:'Llama 4 Scout', color:'#7c5cbf' },
    'Sarcastic': { emoji:'😏', name:'Sarcastic Mode', desc:'Witty and sarcastic.',            model:'Llama 4 Scout', color:'#5cb87a' },
    'Nerd':      { emoji:'🧠', name:'Nerd Mode',      desc:'Detailed and academic.',          model:'Llama 4 Scout', color:'#7c5cbf' },
    'JARVIS':    { emoji:'🎩', name:'JARVIS Mode',    desc:'Sophisticated AI assistant.',     model:'Llama 4 Scout', color:'#4a8fe8' },
    'ORACLE':    { emoji:'🔮', name:'ORACLE Mode',    desc:'Mystical and all-knowing.',       model:'Llama 4 Scout', color:'#7c5cbf' }
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Wizard.AI v15.1.0 initializing…');
    showNotification('🧙 Summoning the Wizard…', 'info', 2000);

    setupMobileSidebars();
    setupDropdown();
    setupModalCloseButtons();
    setupBackdropClose();
    setupKeyboardShortcuts();
    initProfileTabs();
    initPersonalityTabs();
    initVoiceRecognition();
    setupEventListeners();
    setupPWAInstallPrompt();
    registerServiceWorker();
    setupRippleButtons();

    loadGuestData();
    await checkAuth();
    if (currentUser) {
        startSessionCheck();
        await detectAndSaveTimezone();
        await loadProfile();
    }
    loadCustomPersonalities();
    loadChats();
    await loadStats();
    await loadUserApiKeys();
    loadPublicPersonalities();
    checkBackendStatus();
    setInterval(checkBackendStatus, 30000);
    setInterval(updateStatsDisplay, 30000);

    if (window.matchMedia('(display-mode: standalone)').matches) {
        document.body.classList.add('pwa-installed');
    }

    // Staggered entrance animation for stat tiles
    document.querySelectorAll('.stat-tile').forEach((tile, i) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(12px)';
        setTimeout(() => {
            tile.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';
            tile.style.opacity = '1';
            tile.style.transform = '';
        }, 600 + i * 80);
    });

    console.log('✅ Wizard.AI v15.1.0 ready!');
});

// ============================================
// RIPPLE SETUP
// ============================================
function setupRippleButtons() {
    document.querySelectorAll('.primary-btn, .send-btn').forEach(addRipple);
}

// ============================================
// SERVICE WORKER
// ============================================
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log('✅ SW registered'))
            .catch(err => console.log('❌ SW error:', err));
    }
}

// ============================================
// MOBILE SIDEBARS
// ============================================
function setupMobileSidebars() {
    const sidebar      = $('sidebar');
    const chatsSidebar = $('chats-sidebar');
    const hamburger    = $('hamburger-btn');
    const overlay      = $('mobile-overlay');

    function openLeft() {
        sidebar?.classList.add('open');
        overlay?.classList.add('active');
        sidebarState.left = true;
    }
    function closeLeft() {
        sidebar?.classList.remove('open');
        if (!sidebarState.right) overlay?.classList.remove('active');
        sidebarState.left = false;
    }
    function toggleLeft() { sidebarState.left ? closeLeft() : openLeft(); }

    if (hamburger) hamburger.addEventListener('click', toggleLeft);
    if (overlay)   overlay.addEventListener('click', () => closeLeft());

    window._closeLeftSidebar = closeLeft;
}

// ============================================
// BACKEND STATUS
// ============================================
async function checkBackendStatus() {
    const statusTxt = $('status-text');
    const statusDot = document.querySelector('.status-dot');
    if (!statusTxt || !statusDot) return;
    try {
        const res = await fetch(`${API_BASE_URL}/status`, { mode:'cors', credentials:'omit' });
        if (res.ok) {
            const data = await res.json();
            if (data.maintenance) {
                statusTxt.textContent = 'Maintenance';
                statusDot.style.background = '#f0a832';
                statusDot.style.boxShadow  = '0 0 8px #f0a832';
            } else {
                statusTxt.textContent = 'Connected';
                statusDot.style.background = '#5cb87a';
                statusDot.style.boxShadow  = '0 0 8px #5cb87a';
            }
        } else {
            statusTxt.textContent = 'Degraded';
            statusDot.style.background = '#f0a832';
        }
    } catch {
        statusTxt.textContent = 'Offline';
        statusDot.style.background = '#e05555';
        statusDot.style.boxShadow  = '0 0 8px #e05555';
    }
}

// ============================================
// MODAL CLOSE BUTTONS — X rotates red on hover
// ============================================
function setupModalCloseButtons() {
    document.querySelectorAll('.modal-close, .close-x').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            if (overlay) closeModal(overlay);
        });
        // Animate the text inside (× symbol) separately for polish
        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)';
        });
    });
}

function setupBackdropClose() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal(overlay);
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeAllModals();
        if (e.key === 'F2') emergencyReset();
    });
}

function emergencyReset() {
    isThinking = false;
    const sendBtn = $('send-btn');
    if (sendBtn) { sendBtn.disabled = false; sendBtn.classList.remove('loading'); }
    const typingIndicator = $('typing-indicator');
    if (typingIndicator) typingIndicator.style.display = 'none';
    const chatInput = $('chat-input');
    if (chatInput) { chatInput.disabled = false; chatInput.focus(); }
    showNotification('⚠️ Emergency reset', 'error');
}

// ============================================
// DROPDOWN SETUP
// ============================================
function setupDropdown() {
    const dropdown        = $('mode-dropdown');
    const dropdownBtn     = $('dropdown-btn');
    const dropdownContent = $('dropdown-content');
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
        dropdownBtn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dropdown.classList.toggle('open'); }
        });
    }
    document.addEventListener('click', e => {
        if (dropdown && !dropdown.contains(e.target)) dropdown.classList.remove('open');
    });
}

function createDropdownItem(mode, emoji, isCustom = false) {
    const item = document.createElement('div');
    item.className = `dropdown-item${mode === currentMode ? ' selected' : ''}${isCustom ? ' custom' : ''}`;
    item.setAttribute('data-mode', mode);
    item.setAttribute('role', 'option');
    item.innerHTML = `<span style="font-size:17px">${emoji}</span><span>${mode}</span>`;
    item.addEventListener('click', () => selectMode(mode));
    // Hover micro-animation
    item.addEventListener('mouseenter', () => { item.style.transform = 'translateX(4px)'; });
    item.addEventListener('mouseleave', () => { item.style.transform = ''; });
    return item;
}

function selectMode(mode) {
    currentMode = mode;
    updateModeDisplay();
    const dropdown = $('mode-dropdown');
    if (dropdown) dropdown.classList.remove('open');
    if (chats[activeChatId]) chats[activeChatId].mode = mode;
    saveChats();
    const md = modeData[mode] || customPersonalities.find(p => p.name === mode) || {};
    showNotification(`${md.emoji || '🤖'} Switched to ${mode} mode`, 'info');
}

function updateModeDisplay() {
    const mode = modeData[currentMode] || customPersonalities.find(p => p.name === currentMode) || { emoji:'🤖' };
    const display = $('selected-mode-display');
    if (display) {
        display.style.opacity = '0';
        display.style.transform = 'scale(0.9)';
        setTimeout(() => {
            display.innerHTML = `${mode.emoji || '🤖'} ${currentMode}`;
            display.style.transition = 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)';
            display.style.opacity = '1';
            display.style.transform = '';
        }, 120);
    }
    document.querySelectorAll('.dropdown-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.mode === currentMode);
    });
}

// ============================================
// CUSTOM PERSONALITIES
// ============================================
function loadCustomPersonalities() {
    const saved = localStorage.getItem('wizard_custom_personalities');
    if (saved) { try { customPersonalities = JSON.parse(saved); updateCustomPersonalitiesDropdown(); } catch {} }
}

function saveCustomPersonalitiesToStorage() {
    localStorage.setItem('wizard_custom_personalities', JSON.stringify(customPersonalities));
}

function updateCustomPersonalitiesDropdown() {
    const dropdownContent = $('dropdown-content');
    if (!dropdownContent) return;
    dropdownContent.querySelectorAll('.custom, .dropdown-separator').forEach(el => el.remove());
    if (customPersonalities.length > 0) {
        const sep = document.createElement('div');
        sep.className = 'dropdown-separator';
        sep.textContent = '✨ Custom Personalities';
        dropdownContent.appendChild(sep);
        customPersonalities.forEach(p => {
            dropdownContent.appendChild(createDropdownItem(p.name, p.emoji || '🤖', true));
        });
    }
}

function toggleCreatorPanel() {
    const panel = $('creator-panel');
    const icon  = $('creator-toggle-icon');
    if (!panel) return;
    const isOpen = panel.style.display !== 'none' && panel.style.display !== '';
    if (isOpen) {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-6px)';
        setTimeout(() => { panel.style.display = 'none'; panel.style.opacity = ''; panel.style.transform = ''; }, 180);
    } else {
        panel.style.display = 'block';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-6px)';
        requestAnimationFrame(() => {
            panel.style.transition = 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)';
            panel.style.opacity = '1';
            panel.style.transform = '';
        });
    }
    if (icon) icon.textContent = isOpen ? '➕' : '➖';
}

function closeCreatorPanel() {
    const panel = $('creator-panel');
    const icon  = $('creator-toggle-icon');
    if (panel) panel.style.display = 'none';
    if (icon)  icon.textContent = '➕';
    clearCreatorForm();
}

function clearCreatorForm() {
    ['custom-name','custom-emoji','custom-prompt','custom-greeting'].forEach(id => {
        const el = $(id); if (el) el.value = '';
    });
    const pub = $('custom-public');
    if (pub) pub.checked = true;
}

async function saveCustomPersonality() {
    if (!currentUser) { showNotification('Please login to create personalities', 'error'); return; }
    const name     = $('custom-name')?.value.trim();
    const emoji    = $('custom-emoji')?.value.trim() || '🤖';
    const prompt   = $('custom-prompt')?.value.trim();
    const greeting = $('custom-greeting')?.value.trim() || `Hello! I'm ${name}.`;
    const isPublic = $('custom-public')?.checked ?? true;

    if (!name || !prompt) { showNotification('Name and prompt are required', 'error'); return; }
    try {
        const res = await fetch(`${API_BASE_URL}/api/personalities`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ name, emoji, prompt, greeting, is_public: isPublic })
        });
        if (res.ok) {
            const p = await res.json();
            customPersonalities.push({ name:p.name, emoji:p.emoji, system_prompt:p.system_prompt, greeting:p.greeting, id:p.id });
            saveCustomPersonalitiesToStorage();
            updateCustomPersonalitiesDropdown();
            showNotification(`✨ Personality "${name}" created!`, 'success');
            closeCreatorPanel();
        } else {
            const err = await res.json();
            showNotification(err.error || 'Failed to create personality', 'error');
        }
    } catch { showNotification('Error creating personality', 'error'); }
}

// ============================================
// PROFILE TAB SYSTEM
// ============================================
function initProfileTabs() {
    document.querySelectorAll('.profile-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll('.profile-tabs .tab-btn').forEach(b => b.classList.toggle('active', b === btn));
            document.querySelectorAll('#profile-modal-overlay .tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane.id === `profile-tab-${tab}`);
            });
        });
    });
}

function initPersonalityTabs() {
    document.querySelectorAll('.persona-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.persona-tabs .tab-btn').forEach(b => b.classList.toggle('active', b === btn));
            loadPersonalitiesGrid(btn.dataset.tab);
        });
    });
}

// ============================================
// TIMEZONE
// ============================================
async function detectAndSaveTimezone() {
    if (!currentUser) return;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return;
    try {
        await fetch(`${API_BASE_URL}/api/user/timezone`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ timezone: tz })
        });
    } catch {}
}

// ============================================
// PROFILE
// ============================================
async function loadProfile() {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/profile`, { credentials:'include' });
        if (res.ok) {
            const data = await res.json();
            userProfile = data.profile;
            updateProfileForm();
            updateProfileCompleteness();
        }
    } catch {}
}

function updateProfileForm() {
    if (!userProfile) return;
    const set = (id, val) => { const el = $(id); if (el) el.value = val || ''; };
    set('profile-full-name',    userProfile.full_name);
    set('profile-display-name', userProfile.display_name);
    set('profile-birthday',     userProfile.birthday);
    set('profile-bio',          userProfile.bio);
    set('profile-phone',        userProfile.phone);
    set('profile-website',      userProfile.website);
    set('profile-greeting',     userProfile.custom_greeting);
    set('profile-occupation',   userProfile.occupation);
    set('profile-company',      userProfile.company);
    set('profile-experience',   userProfile.experience_years);
    const arrToComma = arr => Array.isArray(arr) ? arr.join(', ') : '';
    set('profile-education',    arrToComma(userProfile.education));
    set('profile-skills',       arrToComma(userProfile.skills));
    set('profile-interests',    arrToComma(userProfile.interests));
    set('profile-fav-topics',   arrToComma(userProfile.favorite_topics));
    set('profile-learning',     arrToComma(userProfile.learning_interests));
    set('profile-known',        arrToComma(userProfile.known_topics));
    set('profile-instructions', userProfile.custom_instructions);
    set('profile-goals',     Array.isArray(userProfile.goals)     ? userProfile.goals.map(g => typeof g === 'object' ? g.text : g).join('\n') : '');
    set('profile-reminders', Array.isArray(userProfile.reminders) ? userProfile.reminders.join('\n') : '');

    const gender    = $('profile-gender');    if (gender    && userProfile.gender)            gender.value    = userProfile.gender;
    const pMode     = $('profile-preferred-mode'); if (pMode && userProfile.preferred_mode)   pMode.value     = userProfile.preferred_mode;
    const rStyle    = $('profile-response-style'); if (rStyle && userProfile.response_style)  rStyle.value    = userProfile.response_style;
    const formality = $('profile-formality');  if (formality && userProfile.formality_level)  formality.value = userProfile.formality_level;
    const emojis    = $('profile-emojis');
    if (emojis) emojis.value = userProfile.emoji_preference !== false ? 'true' : 'false';
}

function updateProfileCompleteness() {
    const pct  = userProfile?.profile_completeness || 0;
    const fill = $('profile-completeness-fill');
    const text = $('profile-completeness-text');
    const stat = $('stat-profile-completeness');

    if (fill) {
        fill.style.transition = 'width 1s cubic-bezier(0.34,1.56,0.64,1)';
        fill.style.width = `${pct}%`;
    }
    if (text) text.textContent = `${pct}%`;
    if (stat) stat.textContent = `${pct}%`;
}

async function saveProfile() {
    if (!currentUser) { showNotification('Please login to save profile', 'error'); return; }
    const commaToArr = id => { const el = $(id); return el?.value ? el.value.split(',').map(s => s.trim()).filter(Boolean) : []; };
    const val = id => $(id)?.value || null;

    const profileData = {
        full_name:           val('profile-full-name'),
        display_name:        val('profile-display-name'),
        birthday:            val('profile-birthday'),
        gender:              val('profile-gender'),
        bio:                 val('profile-bio'),
        phone:               val('profile-phone'),
        website:             val('profile-website'),
        custom_greeting:     val('profile-greeting'),
        occupation:          val('profile-occupation'),
        company:             val('profile-company'),
        experience_years:    $('profile-experience')?.value ? parseInt($('profile-experience').value) : null,
        education:           commaToArr('profile-education'),
        skills:              commaToArr('profile-skills'),
        interests:           commaToArr('profile-interests'),
        favorite_topics:     commaToArr('profile-fav-topics'),
        learning_interests:  commaToArr('profile-learning'),
        known_topics:        commaToArr('profile-known'),
        preferred_mode:      val('profile-preferred-mode') || 'JARVIS',
        response_style:      val('profile-response-style') || 'balanced',
        formality_level:     val('profile-formality') || 'casual',
        emoji_preference:    $('profile-emojis')?.value === 'true',
        custom_instructions: val('profile-instructions'),
        goals:     $('profile-goals')?.value     ? $('profile-goals').value.split('\n').filter(s => s.trim()) : [],
        reminders: $('profile-reminders')?.value ? $('profile-reminders').value.split('\n').filter(s => s.trim()) : []
    };

    const btn = $('save-profile');
    if (btn) { btn.disabled = true; btn.textContent = '✦ Saving…'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/api/profile/update`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify(profileData)
        });
        if (res.ok) {
            const data = await res.json();
            userProfile = data.profile;
            updateProfileCompleteness();
            showNotification('✅ Profile saved!', 'success');
            closeModal($('profile-modal-overlay'));
        } else {
            const err = await res.json();
            showNotification(err.error || 'Failed to save', 'error');
        }
    } catch { showNotification('Error saving profile', 'error'); }
    finally {
        if (btn) { btn.disabled = false; btn.textContent = '💾 Save Profile'; }
    }
}

async function openProfileModal() {
    if (!currentUser) { showNotification('Please login to view profile', 'error'); showAuthModal(true); return; }
    await loadProfile();
    openModal($('profile-modal-overlay'));
}

// ============================================
// VOICE RECOGNITION
// ============================================
function initVoiceRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn  = $('voice-input-btn');
    if (!SpeechRec) { if (voiceBtn) voiceBtn.style.display = 'none'; return; }

    voiceRecognition = new SpeechRec();
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = false;
    voiceRecognition.lang = 'en-US';

    voiceRecognition.onstart = () => {
        isVoiceListening = true;
        if (voiceBtn) voiceBtn.classList.add('listening');
        showNotification('🎤 Listening…', 'info');
    };
    voiceRecognition.onend = () => {
        isVoiceListening = false;
        if (voiceBtn) voiceBtn.classList.remove('listening');
    };
    voiceRecognition.onresult = e => {
        const transcript = e.results[0][0].transcript;
        const chatInput = $('chat-input');
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
    if (!voiceRecognition) { initVoiceRecognition(); if (!voiceRecognition) return; }
    if (isVoiceListening) voiceRecognition.stop();
    else voiceRecognition.start();
}

// ============================================
// TURBO & SEARCH MODES
// ============================================
function toggleTurboMode() {
    turboMode = !turboMode;
    const btn    = $('turbo-btn');
    const status = $('turbo-status');
    if (btn) {
        btn.classList.toggle('active', turboMode);
        if (turboMode) {
            btn.style.transform = 'scale(1.04)';
            setTimeout(() => btn.style.transform = '', 300);
        }
    }
    if (status) status.textContent = turboMode ? 'ON' : 'OFF';
    showNotification(`Turbo mode ${turboMode ? 'ON ⚡' : 'off'}`, turboMode ? 'success' : 'info');
}

function toggleSearchMode() {
    searchMode = !searchMode;
    const btn = $('search-btn');
    if (btn) {
        btn.classList.toggle('active', searchMode);
        const span = btn.querySelector('span:last-child');
        if (span) span.textContent = searchMode ? 'Search ON' : 'Search';
    }
    showNotification(`Web search ${searchMode ? 'enabled 🌐' : 'disabled'}`, 'info');
}

function shouldAutoSearch(text) {
    const triggers = ['latest','news','current','today','now','2024','2025','2026','recent',
        'update','weather','stock','price','score','results','who is','what is','tell me about',
        'find','search','ww3','war','conflict','election','president','breaking','live','trending'];
    const lower = text.toLowerCase();
    return triggers.some(t => lower.includes(t));
}

// ============================================
// SEND MESSAGE (streaming)
// ============================================
async function sendMessage() {
    if (isThinking) return;
    const chatInput        = $('chat-input');
    const sendBtn          = $('send-btn');
    const typingIndicator  = $('typing-indicator');
    const inputSearchIndicator = $('input-search-indicator');

    const text = chatInput.value.trim();
    if (!text) {
        // Shake animation on empty send
        chatInput.style.animation = 'none';
        void chatInput.offsetWidth;
        chatInput.style.animation = 'shake 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both';
        setTimeout(() => chatInput.style.animation = '', 400);
        return;
    }

    // Inject shake keyframe if needed
    if (!document.querySelector('#shake-style')) {
        const s = document.createElement('style');
        s.id = 'shake-style';
        s.textContent = `@keyframes shake { 10%,90%{transform:translateX(-2px);} 20%,80%{transform:translateX(4px);} 30%,50%,70%{transform:translateX(-4px);} 40%,60%{transform:translateX(4px);} }`;
        document.head.appendChild(s);
    }

    addMessage('user', text);
    chatInput.value = '';
    chatInput.focus();

    isThinking = true;
    if (sendBtn) { sendBtn.disabled = true; sendBtn.classList.add('loading'); }
    if (typingIndicator) typingIndicator.style.display = 'flex';

    const doSearch = searchMode || shouldAutoSearch(text);
    if (doSearch && inputSearchIndicator) inputSearchIndicator.style.display = 'inline';

    // Create streaming message element
    const streamId = 'stream-' + Date.now();
    const msgDiv   = document.createElement('div');
    msgDiv.id = streamId;
    msgDiv.className = 'message assistant streaming';
    msgDiv.innerHTML = `<div class="message-content"><div class="message-text" id="st-${streamId}"></div><div class="message-time">${new Date().toLocaleTimeString()}</div></div>`;

    const chatHistory = $('chat-history');
    if (chatHistory) { chatHistory.appendChild(msgDiv); chatHistory.scrollTop = chatHistory.scrollHeight; }

    const respEl = $(`st-${streamId}`);
    let fullResponse = '';

    try {
        const start = Date.now();
        const res = await fetch(`${API_BASE_URL}/api/chat/stream`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ prompt:text, mode:currentMode, turbo:turboMode, search:doSearch, chat_id:activeChatId })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            for (const line of chunk.split('\n\n')) {
                if (!line.startsWith('data: ')) continue;
                const raw = line.slice(6);
                if (raw === '[DONE]') continue;
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed.token) {
                        fullResponse += parsed.token;
                        if (respEl) respEl.innerHTML = renderMarkdown(fullResponse);
                        if (chatHistory) chatHistory.scrollTop = chatHistory.scrollHeight;
                    } else if (parsed.error) {
                        fullResponse = 'Error: ' + parsed.error;
                        if (respEl) respEl.innerHTML = renderMarkdown(fullResponse);
                    }
                } catch {}
            }
        }

        const elapsed = (Date.now() - start) / 1000;
        msgDiv.classList.remove('streaming');
        messages.push({ sender:'assistant', text:fullResponse, mode:currentMode, timestamp:new Date().toISOString() });
        if (chats[activeChatId]) { chats[activeChatId].messages = [...messages]; saveChats(); }
        trackMessage(elapsed);
        if (doSearch) trackSearch();

    } catch (err) {
        console.error('Stream error:', err);
        const errMsg = 'Error getting response. Please try again.';
        if (respEl) { respEl.innerHTML = errMsg; respEl.style.color = '#e05555'; }
        msgDiv.classList.remove('streaming');
        messages.push({ sender:'assistant', text:errMsg, mode:currentMode, timestamp:new Date().toISOString() });
        if (chats[activeChatId]) { chats[activeChatId].messages = [...messages]; saveChats(); }
    } finally {
        isThinking = false;
        if (sendBtn) { sendBtn.disabled = false; sendBtn.classList.remove('loading'); }
        if (typingIndicator) typingIndicator.style.display = 'none';
        if (inputSearchIndicator) inputSearchIndicator.style.display = 'none';
    }
}

// ============================================
// CHAT MANAGEMENT
// ============================================
function addMessage(sender, text) {
    const chatHistory = $('chat-history');
    if (!chatHistory) return;

    const msgEl   = document.createElement('div');
    msgEl.className = `message ${sender}`;
    const content = sender === 'user' ? escapeHtml(text) : renderMarkdown(text);
    msgEl.innerHTML = `<div class="message-content"><div class="message-text">${content}</div><div class="message-time">${new Date().toLocaleTimeString()}</div></div>`;

    chatHistory.appendChild(msgEl);
    messages.push({ sender, text, timestamp:new Date().toISOString() });
    if (chats[activeChatId]) { chats[activeChatId].messages = [...messages]; saveChats(); }
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function renderMessages() {
    const chatHistory = $('chat-history');
    if (!chatHistory) return;
    chatHistory.innerHTML = '';
    messages.forEach((msg, idx) => {
        const msgEl = document.createElement('div');
        msgEl.className = `message ${msg.sender}`;
        msgEl.style.animationDelay = `${Math.min(idx * 0.04, 0.4)}s`;
        const content = msg.sender === 'user' ? escapeHtml(msg.text) : renderMarkdown(msg.text);
        msgEl.innerHTML = `<div class="message-content"><div class="message-text">${content}</div><div class="message-time">${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</div></div>`;
        chatHistory.appendChild(msgEl);
    });
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function loadChats() {
    const saved = localStorage.getItem('wizard_chats');
    if (saved) {
        try {
            const data    = JSON.parse(saved);
            chats         = data.chats        || {};
            chatIds       = data.chatIds      || ['default'];
            activeChatId  = data.activeChatId || 'default';
            messages      = chats[activeChatId]?.messages || [];
            if (!chats['default']) createDefaultChatObj();
        } catch { createDefaultChatObj(); }
    } else { createDefaultChatObj(); }
    renderChatsList();
    renderMessages();
    updateActiveChatHeader();
}

function createDefaultChatObj() {
    chats        = { default: { chat_id:'default', name:'Main Chat', emoji:'🧙', mode:'JARVIS', messages:[] } };
    chatIds      = ['default'];
    activeChatId = 'default';
    messages     = [];
}

function renderChatsList() {
    const chatsList = $('chats-list');
    if (!chatsList) return;
    chatsList.innerHTML = '';
    chatIds.forEach((id, index) => {
        const chat = chats[id];
        if (!chat) return;
        const item = document.createElement('div');
        item.className = `chat-item${id === activeChatId ? ' active' : ''}`;
        item.dataset.chatId = id;
        item.style.animationDelay = `${index * 0.06}s`;
        item.innerHTML = `
            <span class="chat-emoji">${chat.emoji || '💬'}</span>
            <span class="chat-name">${escapeHtml(chat.name)}</span>
            <div class="chat-item-actions">
                <button class="rename-chat-item" data-id="${id}" title="Rename">✏️</button>
                ${id !== 'default' ? `<button class="delete-chat-item" data-id="${id}" title="Delete">🗑️</button>` : ''}
            </div>`;
        item.addEventListener('click', e => { if (!e.target.closest('button')) switchChat(id); });
        item.querySelector('.rename-chat-item').addEventListener('click', e => { e.stopPropagation(); openRenameModal(id); });
        if (id !== 'default') {
            item.querySelector('.delete-chat-item')?.addEventListener('click', e => { e.stopPropagation(); deleteChat(id); });
        }
        chatsList.appendChild(item);
    });
}

function switchChat(id) {
    if (chats[activeChatId]) chats[activeChatId].messages = [...messages];
    activeChatId = id;
    messages     = chats[id]?.messages ? [...chats[id].messages] : [];
    currentMode  = chats[id]?.mode || 'JARVIS';
    updateModeDisplay();
    renderMessages();
    renderChatsList();
    updateActiveChatHeader();
    saveChats();
    if (isMobile && window._closeLeftSidebar) window._closeLeftSidebar();
}

function updateActiveChatHeader() {
    const chat    = chats[activeChatId];
    const nameEl  = $('current-chat-name');
    const emojiEl = $('current-chat-emoji');
    if (nameEl) {
        nameEl.style.opacity = '0';
        setTimeout(() => { nameEl.textContent = chat?.name || 'Chat'; nameEl.style.transition = 'opacity 0.25s'; nameEl.style.opacity = '1'; }, 80);
    }
    if (emojiEl) emojiEl.textContent = chat?.emoji || '🧙';
}

function createNewChat() {
    const id     = 'chat_' + Date.now();
    const emojis = ['💬','🤖','🌟','⭐','✨','🎯','🔮','🧙'];
    chats[id]    = { chat_id:id, name:`Chat ${chatIds.length + 1}`, emoji:emojis[Math.floor(Math.random() * emojis.length)], mode:'JARVIS', messages:[] };
    chatIds.push(id);
    saveChats();
    renderChatsList();
    switchChat(id);
    showNotification('✨ New chat created', 'success');
}

function deleteChat(id) {
    if (id === 'default') { showNotification('Cannot delete the default chat', 'error'); return; }
    if (!confirm('Delete this chat?')) return;
    delete chats[id];
    chatIds = chatIds.filter(i => i !== id);
    if (activeChatId === id) switchChat('default');
    saveChats();
    renderChatsList();
    showNotification('Chat deleted', 'info');
}

function openRenameModal(id) {
    chatToRename = id;
    const input = $('rename-input');
    if (input) input.value = chats[id]?.name || '';
    openModal($('rename-modal-overlay'));
    setTimeout(() => input?.select(), 80);
}

function saveRename() {
    const input   = $('rename-input');
    const newName = input?.value.trim();
    if (newName && chatToRename && chats[chatToRename]) {
        chats[chatToRename].name = newName;
        saveChats();
        renderChatsList();
        updateActiveChatHeader();
        showNotification('✅ Chat renamed', 'success');
    }
    closeModal($('rename-modal-overlay'));
}

function resetCurrentChat() {
    if (!confirm('Clear all messages in this chat?')) return;
    messages = [];
    if (chats[activeChatId]) chats[activeChatId].messages = [];
    renderMessages();
    saveChats();
    showNotification('🧹 Chat cleared', 'info');
}

function saveChats() {
    localStorage.setItem('wizard_chats', JSON.stringify({ chats, chatIds, activeChatId, messages }));
    if (currentUser) {
        fetch(`${API_BASE_URL}/api/save-chats`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ chats:Object.values(chats), chat_order:chatIds })
        }).catch(() => {});
    }
}

// ============================================
// STATS
// ============================================
function trackMessage(rt) {
    userStats.messages++;
    userStats.todayMessages++;
    if (rt) { userStats.responseTimes.push(rt); if (userStats.responseTimes.length > 100) userStats.responseTimes.shift(); }
    updateStatsDisplay();
    saveStatsToStorage();
}
function trackFile()   { userStats.files++;         updateStatsDisplay(); saveStatsToStorage(); }
function trackImage()  { userStats.images++;         updateStatsDisplay(); saveStatsToStorage(); }
function trackSearch() { userStats.searches++;       updateStatsDisplay(); saveStatsToStorage(); }
function trackCode()   { userStats.codeExecutions++; updateStatsDisplay(); saveStatsToStorage(); }

function animateStatCounter(el, newVal) {
    if (!el) return;
    const current  = parseInt(el.textContent) || 0;
    const duration = 600;
    const start    = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(current + (newVal - current) * ease);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

function updateStatsDisplay() {
    const set = (id, val) => {
        const el = $(id);
        if (!el) return;
        const numVal = parseInt(val);
        if (!isNaN(numVal) && String(numVal) === String(val)) {
            animateStatCounter(el, numVal);
        } else {
            el.textContent = val;
        }
    };
    set('stat-messages', userStats.messages);
    set('stat-files',    userStats.files);
    set('stat-images',   userStats.images);
    set('stat-searches', userStats.searches);
    const avg = userStats.responseTimes.length
        ? (userStats.responseTimes.reduce((a,b) => a+b, 0) / userStats.responseTimes.length).toFixed(1)
        : '0.4';
    const speedEl = $('stat-response'); if (speedEl) speedEl.textContent = avg + 's';
    const todayEl = $('quick-today');   if (todayEl) todayEl.textContent  = userStats.todayMessages + ' msgs';
    const totalEl = $('quick-total');   if (totalEl) totalEl.textContent  = userStats.messages + ' msgs';
}

async function loadStats() {
    if (currentUser) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/stats`, { credentials:'include' });
            if (res.ok) {
                const data = await res.json();
                userStats.messages       = data.messages || 0;
                userStats.files          = data.files    || 0;
                userStats.images         = data.images   || 0;
                userStats.searches       = data.searches || 0;
                userStats.codeExecutions = data.code     || 0;

                const s = (id,val) => { const el=$(id); if(el) el.textContent=val; };
                s('stats-created',           data.account_created || '—');
                s('stats-last',              data.last_login      || '—');
                s('stats-total-msgs',        data.messages        || 0);
                s('stats-total-chats',       data.chats           || 0);
                s('stats-files-detailed',    data.files           || 0);
                s('stats-images-detailed',   data.images          || 0);
                s('stats-code-detailed',     data.code            || 0);
                s('stats-searches-detailed', data.searches        || 0);
                s('stats-avg-response',      (data.avg_response_time || 0.4) + 's');
                s('stats-fastest',           (data.fastest_response  || 0.2) + 's');
                s('stats-api-keys-detailed', data.api_keys        || 0);

                if (userProfile) {
                    s('stats-profile-completeness', (userProfile.profile_completeness || 0) + '%');
                    s('stats-skills-count',    (userProfile.skills?.length    || 0));
                    s('stats-interests-count', (userProfile.interests?.length || 0));
                    s('stats-goals-count',     (userProfile.goals?.length     || 0));
                }
            }
        } catch { loadStatsFromStorage(); }
    } else { loadStatsFromStorage(); }
    updateStatsDisplay();
}

function loadStatsFromStorage() {
    const saved = localStorage.getItem('wizard_stats');
    if (saved) { try { userStats = { ...userStats, ...JSON.parse(saved) }; } catch {} }
}

function saveStatsToStorage() {
    if (!currentUser) {
        localStorage.setItem('wizard_stats', JSON.stringify({
            messages: userStats.messages, files: userStats.files,
            images: userStats.images, searches: userStats.searches,
            codeExecutions: userStats.codeExecutions
        }));
    }
}

// ============================================
// AUTHENTICATION
// ============================================
async function checkAuth() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/check-auth?_=${Date.now()}`, {
            credentials:'include', headers:{'Cache-Control':'no-cache'}
        });
        if (res.ok) {
            const data = await res.json();
            currentUser = data.user;
            updateUIForAuth();
            if (data.memories) userStats.memories = data.memories.length;
            loadUserPersonalitiesFromServer();
            localStorage.setItem('auth_time', Date.now().toString());
            detectAndSaveTimezone();
        } else { updateUIForAuth(); }
    } catch { updateUIForAuth(); }
}

async function loadUserPersonalitiesFromServer() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/personalities/mine`, { credentials:'include' });
        if (res.ok) {
            const list = await res.json();
            customPersonalities = list.map(p => ({ name:p.name, emoji:p.emoji, system_prompt:p.system_prompt, greeting:p.greeting, id:p.id }));
            saveCustomPersonalitiesToStorage();
            updateCustomPersonalitiesDropdown();
        }
    } catch {}
}

function updateUIForAuth() {
    const userInfo    = $('user-info');
    const authButtons = $('auth-buttons');
    const userEmailEl = $('user-email');
    const userNameEl  = $('user-name');
    const userAvatarEl = $('user-avatar');

    if (currentUser && userInfo && authButtons) {
        // Fade in the user info
        userInfo.style.opacity = '0';
        userInfo.style.display = 'flex';
        authButtons.style.display = 'none';
        setTimeout(() => { userInfo.style.transition = 'opacity 0.4s'; userInfo.style.opacity = '1'; }, 50);
        if (userEmailEl) userEmailEl.textContent = currentUser.email || '';
        if (userNameEl)  userNameEl.textContent  = `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Wizard';
        if (userAvatarEl) userAvatarEl.textContent = currentUser.first_name?.[0]?.toUpperCase() || '🧙';
    } else if (userInfo && authButtons) {
        userInfo.style.display    = 'none';
        authButtons.style.display = 'flex';
    }
}

function showAuthModal(login = true) {
    isLoginMode = login;
    const title   = $('auth-modal-title');
    const submit  = $('auth-submit');
    const swText  = $('auth-switch-text');
    const swBtn   = $('auth-switch-btn');
    const vGroup  = $('verification-group');
    const fnGroup = $('first-name-group');
    const lnGroup = $('last-name-group');
    const cpGroup = $('confirm-password-group');

    if (title)   title.textContent  = login ? 'Login to Wizard.AI' : 'Create Account';
    if (submit)  submit.textContent = login ? 'Enter the Sanctum' : 'Begin the Journey';
    if (swText)  swText.textContent = login ? "Don't have an account?" : "Already have an account?";
    if (swBtn)   swBtn.textContent  = login ? 'Sign Up' : 'Login';
    if (fnGroup) fnGroup.style.display = login ? 'none' : 'block';
    if (lnGroup) lnGroup.style.display = login ? 'none' : 'block';
    if (cpGroup) cpGroup.style.display = login ? 'none' : 'block';
    if (vGroup)  vGroup.style.display  = 'none';

    const authError = $('auth-error');
    if (authError) { authError.textContent = ''; authError.style.color = ''; }
    ['auth-email','auth-password','auth-confirm','first-name','last-name'].forEach(id => { const el=$(id); if(el) el.value=''; });
    openModal($('auth-modal-overlay'));
}

function toggleAuthMode() { showAuthModal(!isLoginMode); }

async function handleAuthSubmit() {
    const vGroup = $('verification-group');
    const isVerifying = vGroup && vGroup.style.display !== 'none';
    if (isLoginMode)      await handleLogin();
    else if (isVerifying) await handleVerify();
    else                  await handleSignup();
}

async function handleLogin() {
    const email    = $('auth-email')?.value.trim();
    const password = $('auth-password')?.value.trim();
    const authError = $('auth-error');
    const submitBtn = $('auth-submit');

    if (!email || !password) { if (authError) authError.textContent = 'Email and password required'; return; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Summoning…'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/api/login`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            currentUser = data.user;
            localStorage.setItem('auth_time', Date.now().toString());
            if (data.chats) {
                chats = {};
                data.chats.forEach(c => chats[c.chat_id] = c);
                chatIds      = data.chat_order || ['default'];
                activeChatId = chatIds[0];
                messages     = chats[activeChatId]?.messages || [];
            }
            updateUIForAuth();
            renderChatsList();
            renderMessages();
            updateStatsDisplay();
            loadUserPersonalitiesFromServer();
            await loadUserApiKeys();
            closeModal($('auth-modal-overlay'));
            detectAndSaveTimezone();
            await loadProfile();
            showNotification(`✨ Welcome back, ${currentUser.first_name || 'Wizard'}!`, 'success');
        } else {
            if (authError) { authError.textContent = data.error || 'Invalid credentials'; }
        }
    } catch {
        if (authError) authError.textContent = 'Connection error';
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enter the Sanctum'; }
    }
}

async function handleSignup() {
    const firstName = $('first-name')?.value.trim();
    const lastName  = $('last-name')?.value.trim();
    const email     = $('auth-email')?.value.trim();
    const password  = $('auth-password')?.value.trim();
    const confirm   = $('auth-confirm')?.value.trim();
    const authError = $('auth-error');
    const submitBtn = $('auth-submit');

    if (!firstName || !lastName || !email || !password || !confirm) {
        if (authError) authError.textContent = 'All fields required'; return;
    }
    if (password !== confirm) { if (authError) authError.textContent = 'Passwords do not match'; return; }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '✦ Creating…'; }
    try {
        const res  = await fetch(`${API_BASE_URL}/api/register/init`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ firstName, lastName, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            signupEmail = email;
            if (data.pending_id) localStorage.setItem('wizard_pending_id', data.pending_id);
            $('first-name-group').style.display    = 'none';
            $('last-name-group').style.display     = 'none';
            $('confirm-password-group').style.display = 'none';
            $('verification-group').style.display  = 'block';
            $('auth-submit').textContent = 'Verify the Seal';
            $('auth-modal-title').textContent = 'Verify Your Email';
            if (authError) {
                authError.textContent = data.dev_code ? `🔐 Dev code: ${data.dev_code}` : `📧 Code sent to ${email}`;
                authError.style.color = 'var(--success)';
            }
            showNotification('📧 Verification code sent!', 'success');
        } else {
            if (authError) authError.textContent = data.error || 'Signup failed';
        }
    } catch { if (authError) authError.textContent = 'Connection error'; }
    finally  { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Begin the Journey'; } }
}

async function handleVerify() {
    const code      = $('verification-code')?.value.trim();
    const authError = $('auth-error');
    const pendingId = localStorage.getItem('wizard_pending_id');
    const submitBtn = $('auth-submit');

    if (!code || code.length !== 6) { if (authError) authError.textContent = 'Enter 6-digit code'; return; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Verifying…'; }
    try {
        const res  = await fetch(`${API_BASE_URL}/api/register/verify`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ email:signupEmail, code, pending_id:pendingId })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.removeItem('wizard_pending_id');
            currentUser = data.user;
            if (data.chats) {
                chats = {};
                data.chats.forEach(c => chats[c.chat_id] = c);
                chatIds      = data.chat_order || ['default'];
                activeChatId = chatIds[0];
                messages     = chats[activeChatId]?.messages || [];
            }
            updateUIForAuth();
            renderChatsList();
            renderMessages();
            closeModal($('auth-modal-overlay'));
            detectAndSaveTimezone();
            await loadProfile();
            showNotification('🌟 Welcome to Wizard.AI!', 'success');
        } else {
            if (authError) authError.textContent = data.error || 'Verification failed';
        }
    } catch { if (authError) authError.textContent = 'Connection error'; }
    finally  { if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Verify the Seal'; } }
}

async function resendVerificationCode() {
    const pendingId = localStorage.getItem('wizard_pending_id');
    try {
        const res  = await fetch(`${API_BASE_URL}/api/resend-code`, {
            method:'POST', credentials:'include', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ pending_id:pendingId })
        });
        const data = await res.json();
        const authError = $('auth-error');
        if (res.ok) {
            if (authError) { authError.textContent = data.dev_code ? `🔐 New code: ${data.dev_code}` : 'Code resent!'; authError.style.color = 'var(--success)'; }
            showNotification('📧 Code resent!', 'success');
        } else {
            if (authError) authError.textContent = data.error || 'Failed to resend';
        }
    } catch { if ($('auth-error')) $('auth-error').textContent = 'Connection error'; }
}

async function handleLogout() {
    try { await fetch(`${API_BASE_URL}/api/logout`, { method:'POST', credentials:'include' }); } catch {}
    localStorage.removeItem('auth_time');
    currentUser = null;
    userProfile = null;
    updateUIForAuth();
    loadGuestData();
    await loadUserApiKeys();
    showNotification('Logged out', 'info');
}

function loadGuestData() {
    const saved = localStorage.getItem('wizard_guest_data');
    if (saved) { try { userStats = { ...userStats, ...JSON.parse(saved).stats }; updateStatsDisplay(); } catch {} }
}

function startSessionCheck() {
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);
    sessionCheckInterval = setInterval(async () => {
        if (!currentUser) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/check-auth`, { credentials:'include' });
            if (res.status === 401) {
                currentUser = null;
                userProfile = null;
                updateUIForAuth();
                showNotification('Session expired. Please log in again.', 'error', 5000);
                setTimeout(() => showAuthModal(true), 1500);
            }
        } catch {}
    }, 300000);
}

// ============================================
// PUBLIC PERSONALITIES
// ============================================
async function loadPublicPersonalities() {
    const list = $('personalities-list');
    if (!list) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/personalities`);
        if (res.ok) {
            const data = await res.json();
            publicPersonalities = data;
            if (!data.length) { list.innerHTML = '<div class="empty-state-sm">No public personalities yet</div>'; return; }
            list.innerHTML = '';
            data.slice(0, 6).forEach((p, i) => {
                const item = document.createElement('div');
                item.className = 'personality-item';
                item.dataset.id = p.id;
                item.style.opacity = '0';
                item.style.transform = 'translateY(6px)';
                item.innerHTML = `<span>${p.emoji || '🤖'}</span><span class="personality-name">${escapeHtml(p.name)}</span><span class="personality-likes">❤️ ${p.likes || 0}</span>`;
                item.addEventListener('click', () => usePersonality(p.id));
                list.appendChild(item);
                setTimeout(() => { item.style.transition = 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)'; item.style.opacity = '1'; item.style.transform = ''; }, 100 + i * 60);
            });
        }
    } catch { if (list) list.innerHTML = '<div class="empty-state-sm">Failed to load</div>'; }
}

async function openPersonalitiesBrowser() {
    openModal($('personalities-modal-overlay'));
    await loadPersonalitiesGrid('featured');
}

async function loadPersonalitiesGrid(tab = 'featured') {
    const grid = $('personalities-grid');
    if (!grid) return;
    grid.innerHTML = '<div style="color:var(--muted);padding:20px;text-align:center">✦ Loading…</div>';
    try {
        const endpoints = { featured:'/api/personalities/featured', popular:'/api/personalities/popular', recent:'/api/personalities/recent', mine:'/api/personalities/mine' };
        const res = await fetch(`${API_BASE_URL}${endpoints[tab] || '/api/personalities'}`, { credentials:'include' });
        if (res.ok) {
            const list = await res.json();
            if (!list.length) { grid.innerHTML = '<div style="color:var(--muted);padding:20px;text-align:center">No personalities found</div>'; return; }
            grid.innerHTML = '';
            list.forEach((p, i) => {
                const card = document.createElement('div');
                card.className = 'personality-card';
                card.style.opacity = '0';
                card.style.transform = 'translateY(12px) scale(0.96)';
                card.innerHTML = `<span class="personality-card-emoji">${p.emoji || '🤖'}</span><div class="personality-card-name">${escapeHtml(p.name)}</div><div class="personality-card-creator">by ${escapeHtml(p.creator || 'Anonymous')}</div><div class="personality-card-stats"><span>❤️ ${p.likes || 0}</span><span>🔄 ${p.uses || 0}</span></div>`;
                card.addEventListener('click', () => { usePersonality(p.id); closeModal($('personalities-modal-overlay')); });
                grid.appendChild(card);
                setTimeout(() => { card.style.transition = 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)'; card.style.opacity = '1'; card.style.transform = ''; }, 40 + i * 50);
            });
        } else { grid.innerHTML = '<div style="color:var(--muted)">Failed to load</div>'; }
    } catch { grid.innerHTML = '<div style="color:var(--muted)">Failed to load</div>'; }
}

async function usePersonality(id) {
    const p = publicPersonalities.find(p => p.id == id);
    if (!p) return;
    try { await fetch(`${API_BASE_URL}/api/personalities/${id}/use`, { method:'POST', credentials:'include' }); } catch {}
    if (!modeData[p.name]) {
        modeData[p.name] = { emoji:p.emoji || '🤖', name:p.name, desc:p.system_prompt?.substring(0,100) || 'Custom', model:'Custom', color:'#c9a84c' };
    }
    selectMode(p.name);
    showNotification(`${p.emoji || '🤖'} Switched to ${p.name}`, 'success');
}

// ============================================
// FILE UPLOAD
// ============================================
async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!currentUser) { showNotification('Please login to upload files', 'error'); return; }

    const uploadProgress = $('upload-progress');
    const progressFill   = $('progress-bar-fill');
    const progressText   = $('progress-text');
    if (uploadProgress) uploadProgress.style.display = 'flex';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chat_id', activeChatId);

    try {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', ev => {
            if (ev.lengthComputable) {
                const pct = (ev.loaded / ev.total) * 100;
                if (progressFill) progressFill.style.width = pct + '%';
                if (progressText) progressText.textContent = `Uploading: ${Math.round(pct)}%`;
            }
        });
        const promise = new Promise((resolve, reject) => {
            xhr.onload  = () => (xhr.status === 200 ? resolve(JSON.parse(xhr.responseText)) : reject());
            xhr.onerror = () => reject();
        });
        xhr.open('POST', `${API_BASE_URL}/api/upload`);
        xhr.withCredentials = true;
        xhr.send(formData);
        const data = await promise;

        setTimeout(() => { if (uploadProgress) uploadProgress.style.display = 'none'; }, 1000);

        if (data.success) {
            trackFile();
            addMessage('assistant', `📎 **${data.filename}** uploaded successfully.\n${data.preview || ''}`);
            showNotification(`✅ ${file.name} uploaded!`, 'success');
        } else {
            showNotification(data.error || 'Upload failed', 'error');
        }
    } catch {
        if (uploadProgress) uploadProgress.style.display = 'none';
        showNotification('Upload failed', 'error');
    }
    e.target.value = '';
}

// ============================================
// CODE EXECUTION
// ============================================
async function executeCode() {
    const code       = $('code-input')?.value.trim();
    const codeOutput = $('code-output');
    if (!code) return;
    if (!currentUser) { showNotification('Please login to execute code', 'error'); return; }

    codeOutput.innerHTML = '<div class="loading">⚡ Running…</div>';
    const runBtn = $('run-code');
    if (runBtn) { runBtn.disabled = true; runBtn.textContent = '⏳ Running…'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/api/execute`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ code })
        });
        const data = await res.json();
        if (data.error) {
            codeOutput.innerHTML = `<div class="error-output">❌ ${escapeHtml(data.error)}</div>`;
        } else {
            let html = '';
            if (data.stdout) html += `<pre class="stdout">${escapeHtml(data.stdout)}</pre>`;
            if (data.stderr) html += `<pre class="stderr">${escapeHtml(data.stderr)}</pre>`;
            codeOutput.innerHTML = html || '<div class="no-output">✓ No output (ran successfully)</div>';
        }
        trackCode();
    } catch {
        codeOutput.innerHTML = '<div class="error-output">❌ Connection error</div>';
    } finally {
        if (runBtn) { runBtn.disabled = false; runBtn.textContent = '▶ Run Code'; }
    }
}

// ============================================
// IMAGE GENERATION
// ============================================
async function generateImage() {
    const prompt = $('image-prompt')?.value.trim();
    const genBtn = $('generate-image');
    const imageResult = $('image-result');
    if (!prompt) { showNotification('Please enter a prompt', 'error'); return; }
    if (!currentUser) { showNotification('Please login to generate images', 'error'); return; }

    imageResult.innerHTML = '<div style="color:var(--muted);padding:20px;text-align:center;font-family:\'Cormorant Garamond\',serif;font-size:18px;">🎨 Weaving the vision…</div>';
    if (genBtn) { genBtn.disabled = true; genBtn.textContent = '✦ Generating…'; }

    try {
        const res  = await fetch(`${API_BASE_URL}/api/generate-image`, {
            method:'POST', headers:{'Content-Type':'application/json'}, credentials:'include',
            body: JSON.stringify({ prompt, size:$('image-size')?.value || '512x512' })
        });
        const data = await res.json();
        if (res.ok && data.url) {
            imageResult.innerHTML = `
                <img src="${data.url}" alt="${escapeHtml(prompt)}" loading="lazy">
                <div class="image-actions">
                    <button class="glass-button" onclick="window.open('${escapeHtml(data.url)}','_blank')">🔍 Full Size</button>
                    <button class="glass-button" onclick="downloadImage('${escapeHtml(data.url)}')">💾 Download</button>
                </div>`;
            trackImage();
            showNotification('🎨 Image generated!', 'success');
        } else {
            imageResult.innerHTML = `<div class="error-output">❌ ${escapeHtml(data.error || 'Generation failed')}</div>`;
            showNotification(data.error || 'Failed to generate', 'error');
        }
    } catch {
        imageResult.innerHTML = '<div class="error-output">❌ Connection error</div>';
        showNotification('Connection error', 'error');
    } finally {
        if (genBtn) { genBtn.disabled = false; genBtn.textContent = '✦ Generate'; }
    }
}

function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url; a.download = `wizard-image-${Date.now()}.png`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ============================================
// API KEYS
// ============================================
async function loadUserApiKeys() {
    const list = $('api-keys-list');
    if (!list) return;
    if (!currentUser) { list.innerHTML = '<div class="empty-state-sm">🔐 Login to view your API keys</div>'; return; }
    try {
        const res = await fetch(`${API_BASE_URL}/api/keys`, { credentials:'include' });
        if (res.ok) {
            const keys = await res.json();
            if (!keys?.length) {
                list.innerHTML = '<div class="empty-state-sm">No API keys yet. Visit <a href="/devhub/" style="color:var(--gold)">Dev Hub</a> to create one.</div>';
                return;
            }
            list.innerHTML = keys.map(k => `
                <div class="api-key-item">
                    <div class="api-key-name">${escapeHtml(k.name)}</div>
                    <div class="api-key-value">${k.key.substring(0,15)}…${k.key.slice(-8)}</div>
                    <div class="api-key-stats">📊 ${k.requests || 0} requests ${k.is_active ? '✅' : '❌'}</div>
                </div>`).join('');
        } else { list.innerHTML = '<div class="empty-state-sm">⚠️ Failed to load</div>'; }
    } catch { list.innerHTML = '<div class="empty-state-sm">⚠️ Error loading keys</div>'; }
}

// ============================================
// PWA
// ============================================
function setupPWAInstallPrompt() {
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pwaDeferredPrompt = e; });
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Send
    const sendBtn   = $('send-btn');
    const chatInput = $('chat-input');
    if (sendBtn)   sendBtn.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

    // Voice
    $('voice-input-btn')?.addEventListener('click', toggleVoiceInput);

    // Toolbar
    $('turbo-btn')?.addEventListener('click', toggleTurboMode);
    $('search-btn')?.addEventListener('click', toggleSearchMode);
    $('upload-btn')?.addEventListener('click', () => $('file-upload')?.click());
    $('code-btn')?.addEventListener('click', () => openModal($('code-modal-overlay')));
    $('image-btn')?.addEventListener('click', () => openModal($('image-modal-overlay')));
    $('profile-btn')?.addEventListener('click', openProfileModal);
    $('stats-btn')?.addEventListener('click', () => { openModal($('stats-modal-overlay')); loadStats(); });
    $('personalities-btn')?.addEventListener('click', openPersonalitiesBrowser);
    $('devhub-btn')?.addEventListener('click', () => window.open('/devhub/', '_blank'));
    $('agent-studio-btn')?.addEventListener('click', () => window.open('/agent-studio/', '_blank'));
    $('update-history-btn')?.addEventListener('click', () => openModal($('update-modal-overlay')));

    // Chat controls
    $('new-chat-btn')?.addEventListener('click', createNewChat);
    $('rename-chat-btn')?.addEventListener('click', () => openRenameModal(activeChatId));
    $('delete-chat-btn')?.addEventListener('click', () => deleteChat(activeChatId));
    $('reset-current-btn')?.addEventListener('click', resetCurrentChat);

    // Rename modal
    $('modal-save')?.addEventListener('click', saveRename);
    $('modal-cancel')?.addEventListener('click', () => closeModal($('rename-modal-overlay')));
    $('rename-input')?.addEventListener('keypress', e => { if (e.key === 'Enter') saveRename(); });

    // Auth
    $('show-login-btn')?.addEventListener('click', () => showAuthModal(true));
    $('show-signup-btn')?.addEventListener('click', () => showAuthModal(false));
    $('logout-btn')?.addEventListener('click', handleLogout);
    $('auth-submit')?.addEventListener('click', handleAuthSubmit);
    $('auth-switch-btn')?.addEventListener('click', toggleAuthMode);
    $('resend-code-btn')?.addEventListener('click', resendVerificationCode);
    $('auth-email')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleAuthSubmit(); });
    $('auth-password')?.addEventListener('keypress', e => { if (e.key === 'Enter') handleAuthSubmit(); });

    // Profile
    $('save-profile')?.addEventListener('click', saveProfile);
    $('close-profile')?.addEventListener('click', () => closeModal($('profile-modal-overlay')));

    // Code
    $('run-code')?.addEventListener('click', executeCode);
    $('clear-code')?.addEventListener('click', () => { if ($('code-input')) $('code-input').value = ''; if ($('code-output')) $('code-output').innerHTML = ''; });

    // Image
    $('generate-image')?.addEventListener('click', generateImage);
    $('image-prompt')?.addEventListener('keypress', e => { if (e.key === 'Enter') generateImage(); });

    // Personality creator
    $('toggle-creator-btn')?.addEventListener('click', toggleCreatorPanel);
    $('save-personality')?.addEventListener('click', saveCustomPersonality);
    $('cancel-personality')?.addEventListener('click', closeCreatorPanel);
    $('close-creator')?.addEventListener('click', closeCreatorPanel);

    // File upload
    $('file-upload')?.addEventListener('change', handleFileUpload);

    // API Keys / Dev Hub
    $('create-api-key-sidebar')?.addEventListener('click', () => {
        if (!currentUser) { showNotification('Please login first', 'error'); showAuthModal(true); return; }
        window.open('/devhub/', '_blank');
    });

    // Smooth hover effects on tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = 'translateY(-2px)';
            }
        });
        btn.addEventListener('mouseleave', () => {
            if (!btn.classList.contains('active')) {
                btn.style.transform = '';
            }
        });
    });

    // Ripple on dynamically added buttons
    document.addEventListener('click', e => {
        const btn = e.target.closest('.primary-btn, .send-btn');
        if (btn && !btn._rippleAttached) {
            btn._rippleAttached = true;
            addRipple(btn);
        }
    });
}

console.log('✅ Wizard.AI v15.1.0 — Grimoire Edition loaded');
