// Global variables
let socket;
let currentUser = null;
let selectedContact = null;
let users = [];
let messages = [];
let typingTimeout;
let selectionMode = false;
let selectedMessageIds = new Set();

// Emoji data
const emojiData = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'],
    people: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋'],
    nature: ['🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌶️', '🍄', '🌾', '💐', '🌿', '🍀', '🍃', '🍂', '🍁', '🌊', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌟', '⭐', '🌠', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '☁️', '🌪️', '🌫️', '🌙', '🌛', '🌜', '🌚', '🌝', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌕'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧇', '🥞', '🧈', '🍯', '🥛', '🍼', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊', '🥄', '🍴', '🍽️'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🎢', '🎡', '🎠', '🏗️', '🌁', '🗼', '🏭', '⛲', '🎑', '⛰️', '🏔️', '🗻', '🌋', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️'],
    objects: ['💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🪚', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪃', '🏹', '🛡️', '🪚', '🔪', '⚔️', '💊', '🩹', '🩺', '🌡️', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '🧪', '🧫', '🧮', '🧿', '🪬', '📿', '💈', '⚗️'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲']
};

// DOM Elements
const authModal = document.getElementById('authModal');
const chatApp = document.getElementById('chatApp');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const contactsList = document.getElementById('contactsList');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatHeader = document.getElementById('chatHeader');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    checkAuthStatus();
});

// Event Listeners
function initializeEventListeners() {
    // Auth forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Chat input
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
        handleTyping();
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

// Authentication functions
window.showLoginForm = function () {
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
}

window.showRegisterForm = function () {
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showChatApp();
            showSuccessToast('Login successful!');
        } else {
            showErrorToast(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showErrorToast('Network error. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                email,
                password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccessToast('Registration successful! Please login.');
            showLoginForm();
            // Clear form
            document.getElementById('registerFormElement').reset();
        } else {
            showErrorToast(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showErrorToast('Network error. Please try again.');
    }
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showChatApp();
    }
}

function logout() {
    if (socket) {
        socket.disconnect();
    }
    localStorage.removeItem('currentUser');
    currentUser = null;
    selectedContact = null;
    users = [];
    messages = [];
    
    // Reset chat area to welcome message
    resetChatArea();
    
    // Clear contacts list
    contactsList.innerHTML = '';
    
    // Show auth modal
    authModal.classList.add('active');
    chatApp.classList.remove('active');
    showLoginForm();
}

function resetChatArea() {
    // Hide chat header and input
    chatHeader.style.display = 'none';
    chatInput.style.display = 'none';
    typingIndicator.style.display = 'none';
    
    // Show welcome message
    chatMessages.innerHTML = `
        <div class="welcome-message">
            <div class="welcome-content">
                <i class="fab fa-telegram-plane"></i>
                <h2>Welcome to Telegram Clone</h2>
                <p>Select a contact from the sidebar to start chatting</p>
            </div>
        </div>
    `;
    
    // Clear selected contact styling
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Chat application functions
async function showChatApp() {
    authModal.classList.remove('active');
    chatApp.classList.add('active');
    
    // Update current user info
    document.getElementById('currentUserName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('currentUserAvatar').querySelector('img').src = currentUser.avatar;
    
    // Initialize socket connection
    initializeSocket();
    
    // Load users
    await loadUsers();
}

function initializeSocket() {
    socket = io();
    
    // Connection events
    socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('user_online', currentUser.id);
    });
    
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
    
    // Message events
    socket.on('receive_message', (message) => {
        if (selectedContact && (message.senderId === selectedContact.id || message.receiverId === selectedContact.id)) {
            displayMessage(message);
        }
        updateContactLastMessage(message);
    });
    
    socket.on('message_sent', (message) => {
        displayMessage(message);
    });
    
    // Typing events
    socket.on('user_typing', (data) => {
        if (selectedContact && data.senderName !== currentUser.username) {
            showTypingIndicator(data.senderName, data.isTyping);
        }
    });
    
    // User status events
    socket.on('user_status_change', (data) => {
        updateUserStatus(data.userId, data.isOnline);
    });
}

async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const data = await response.json();
        
        if (response.ok) {
            users = data.filter(user => user.id !== currentUser.id);
            displayContacts();
        } else {
            showErrorToast('Failed to load users');
        }
    } catch (error) {
        console.error('Load users error:', error);
        showErrorToast('Network error while loading users');
    }
}

function displayContacts() {
    contactsList.innerHTML = '';
    
    users.forEach(user => {
        const contactElement = createContactElement(user);
        contactsList.appendChild(contactElement);
    });
}

function createContactElement(user) {
    const contactDiv = document.createElement('div');
    contactDiv.className = 'contact-item';
    contactDiv.onclick = () => selectContact(user);
    
    contactDiv.innerHTML = `
        <div class="contact-avatar">
            <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}">
            <span class="online-indicator ${user.isOnline ? '' : 'offline'}"></span>
        </div>
        <div class="contact-info">
            <div class="contact-name">${user.firstName} ${user.lastName}</div>
            <div class="contact-status">${user.isOnline ? 'Online' : formatLastSeen(user.lastSeen)}</div>
        </div>
    `;
    
    return contactDiv;
}


async function loadMessages(userId) {
    try {
        const response = await fetch(`/api/messages/${userId}`);
        const data = await response.json();
        
        if (response.ok) {
            messages = data;
            displayMessages();
        } else {
            showErrorToast('Failed to load messages');
        }
    } catch (error) {
        console.error('Load messages error:', error);
        showErrorToast('Network error while loading messages');
    }
}

function displayMessages() {
    chatMessages.innerHTML = '';
    
    messages.forEach(message => {
        displayMessage(message);
    });
    
    scrollToBottom();
}

async function displayMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.senderId === currentUser.id ? 'sent' : 'received'}`;
    messageDiv.dataset.messageId = message.id;
    messageDiv.style.position = 'relative';
    
    let messageContent = '';
    
    if (message.type === 'file') {
        // File message
        const file = message.file;
        // If this is an S3 file and the data is not a signed URL, fetch a fresh signed URL
        if (file && file.isS3 && file.key && (!file.data || !file.data.startsWith('http'))) {
            try {
                // synchronous await to get fresh URL before rendering
                const res = await fetch(`/api/files/${encodeURIComponent(file.key)}/signed`);
                const js = await res.json();
                if (js.success) {
                    file.data = js.url;
                }
            } catch (e) {
                console.warn('Failed to fetch signed URL for display');
            }
        }
        const fileIcon = getFileIcon(file.type);
        const fileSize = formatFileSize(file.size);
        
        if (file.type.startsWith('image/')) {
            // Image message
            messageContent = `
                <div class="message-image">
                    <img src="${file.data}" alt="${file.name}" onclick="downloadFile('${file.name}', '${file.data}')">
                </div>
            `;
        } else {
            // Other file types
            messageContent = `
                <div class="message-file">
                    <div class="file-icon">
                        <i class="${fileIcon}"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${fileSize}</div>
                    </div>
                    <button class="file-download" onclick="downloadFile('${file.name}', '${file.data}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            `;
        }
    } else {
        // Text message
        messageContent = `
            <div class="message-bubble">
                ${message.message || message.text}
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        <input type="checkbox" class="select-checkbox" onchange="toggleSelectMessage('${message.id}', this.checked)">
        ${messageContent}
        <div class="message-time">
            ${formatMessageTime(message.timestamp)}
        </div>
        ${message.senderId === currentUser.id ? `<div class="message-actions">
            <button class="btn-mini" title="Delete" onclick="deleteMessage('${message.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>` : ''}
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}
// Bulk selection mode controls
function enterSelectionMode() {
    selectionMode = true;
    selectedMessageIds.clear();
    document.querySelector('.chat-messages').classList.add('selection-mode');
    document.getElementById('bulkConfirmDeleteBtn').style.display = 'inline-flex';
    document.getElementById('bulkCancelBtn').style.display = 'inline-flex';
    // Show all checkboxes
    document.querySelectorAll('.select-checkbox').forEach(cb => cb.style.display = 'block');
}

function exitSelectionMode() {
    selectionMode = false;
    selectedMessageIds.clear();
    document.querySelector('.chat-messages').classList.remove('selection-mode');
    document.getElementById('bulkConfirmDeleteBtn').style.display = 'none';
    document.getElementById('bulkCancelBtn').style.display = 'none';
    document.querySelectorAll('.select-checkbox').forEach(cb => {
        cb.checked = false;
        cb.style.display = 'none';
    });
    document.querySelectorAll('.message').forEach(m => m.classList.remove('selected'));
}

function toggleSelectMessage(id, checked) {
    const el = document.querySelector(`.message[data-message-id="${id}"]`);
    if (checked) {
        selectedMessageIds.add(id);
        if (el) el.classList.add('selected');
    } else {
        selectedMessageIds.delete(id);
        if (el) el.classList.remove('selected');
    }
}

async function confirmBulkDelete() {
    if (selectedMessageIds.size === 0) {
        showErrorToast('Select messages to delete');
        return;
    }
    try {
        // Delete sequentially (simple). Could be parallel if needed.
        for (const id of Array.from(selectedMessageIds)) {
            await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            const el = document.querySelector(`.message[data-message-id="${id}"]`);
            if (el) el.remove();
            messages = messages.filter(m => m.id !== id);
        }
        showSuccessToast('Selected messages deleted');
    } catch (e) {
        showErrorToast('Failed to delete some messages');
    } finally {
        exitSelectionMode();
    }
}

async function deleteMessage(messageId) {
    try {
        const res = await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Failed to delete');
        // Remove from UI and local array
        const el = document.querySelector(`.message[data-message-id="${messageId}"]`);
        if (el) el.remove();
        messages = messages.filter(m => m.id !== messageId);
        showSuccessToast('Message deleted');
    } catch (e) {
        showErrorToast(e.message);
    }
}

function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || !selectedContact) return;
    
    const messageData = {
        senderId: currentUser.id,
        receiverId: selectedContact.id,
        message: message,
        senderName: currentUser.username
    };
    
    socket.emit('send_message', messageData);
    messageInput.value = '';
    
    // Stop typing indicator
    socket.emit('typing', {
        receiverId: selectedContact.id,
        senderName: currentUser.username,
        isTyping: false
    });
}

function handleTyping() {
    if (!selectedContact) return;
    
    socket.emit('typing', {
        receiverId: selectedContact.id,
        senderName: currentUser.username,
        isTyping: true
    });
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit('typing', {
            receiverId: selectedContact.id,
            senderName: currentUser.username,
            isTyping: false
        });
    }, 1000);
}

function showTypingIndicator(senderName, isTyping) {
    const typingText = document.querySelector('.typing-text');
    
    if (isTyping) {
        typingText.textContent = `${senderName} is typing...`;
        typingIndicator.style.display = 'flex';
    } else {
        typingIndicator.style.display = 'none';
    }
}

function updateUserStatus(userId, isOnline) {
    const user = users.find(u => u.id === userId);
    if (user) {
        user.isOnline = isOnline;
        
        // Update contact list
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.alt.includes(user.firstName)) {
                const indicator = item.querySelector('.online-indicator');
                indicator.className = `online-indicator ${isOnline ? '' : 'offline'}`;
                
                const status = item.querySelector('.contact-status');
                status.textContent = isOnline ? 'Online' : formatLastSeen(user.lastSeen);
            }
        });
        
        // Update chat header if this is the selected contact
        if (selectedContact && selectedContact.id === userId) {
            document.getElementById('chatUserStatus').textContent = isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`;
            document.getElementById('chatUserOnlineIndicator').className = `online-indicator ${isOnline ? '' : 'offline'}`;
        }
    }
}

function updateContactLastMessage(message) {
    // This would update the last message preview in contact list
    // Implementation depends on your specific requirements
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const name = item.querySelector('.contact-name').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Utility functions
function formatMessageTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        return `${Math.floor(diff / 60000)}m ago`;
    } else if (date.toDateString() === now.toDateString()) { // Same day
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
}

function formatLastSeen(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        return `${Math.floor(diff / 60000)} minutes ago`;
    } else if (diff < 86400000) { // Less than 24 hours
        return `${Math.floor(diff / 3600000)} hours ago`;
    } else if (date.toDateString() === now.toDateString()) { // Same day
        return 'Today';
    } else {
        const days = Math.floor(diff / 86400000);
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Toast notifications
function showErrorToast(message) {
    const toast = document.getElementById('errorToast');
    const messageElement = document.getElementById('errorMessage');
    
    messageElement.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showSuccessToast(message) {
    const toast = document.getElementById('successToast');
    const messageElement = document.getElementById('successMessage');
    
    messageElement.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Mobile functions
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    sidebar.classList.toggle('mobile-active');
    overlay.classList.toggle('active');
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    sidebar.classList.remove('mobile-active');
    overlay.classList.remove('active');
}

// Close mobile sidebar when contact is selected
async function selectContact(user) {
    selectedContact = user;
    
    // Close mobile sidebar if open
    closeMobileSidebar();
    
    // Update UI
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Show chat header and input
    chatHeader.style.display = 'flex';
    chatInput.style.display = 'flex';
    
    // Update chat header
    document.getElementById('chatUserName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('chatUserStatus').textContent = user.isOnline ? 'Online' : `Last seen ${formatLastSeen(user.lastSeen)}`;
    document.getElementById('chatUserAvatar').src = user.avatar;
    document.getElementById('chatUserOnlineIndicator').className = `online-indicator ${user.isOnline ? '' : 'offline'}`;
    
    // Load messages
    await loadMessages(user.id);
    
    // Clear welcome message
    const welcomeMessage = document.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
}

// File attachment functions
function triggerFileUpload() {
    document.getElementById('fileInput').click();
}

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (1MB = 1024 * 1024 bytes)
    const maxSize = 1024 * 1024;
    if (file.size > maxSize) {
        showErrorToast('File size must be less than 1MB');
        return;
    }
    
    if (!selectedContact) {
        showErrorToast('Please select a contact first');
        return;
    }
    
    try {
        // Show upload progress
        showUploadProgress();
        
        // Upload to server (S3)
        const formData = new FormData();
        formData.append('file', file);
        // send folder per-conversation
        const ids = [String(currentUser.id), String(selectedContact.id)].sort();
        formData.append('folder', `chat-files/${ids[0]}_${ids[1]}`);
        const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadResult.success) {
            throw new Error(uploadResult.error || 'Upload failed');
        }
        
        // Create file message with S3 URL (private). Also fetch a signed URL for immediate access.
        let signedUrl = uploadResult.url;
        try {
            const signRes = await fetch(`/api/files/${encodeURIComponent(uploadResult.key)}/signed`);
            const signJson = await signRes.json();
            if (signJson.success) {
                signedUrl = signJson.url;
            }
        } catch (e) {
            console.warn('Signed URL fetch failed, fallback to raw URL');
        }

        const fileMessage = {
            senderId: currentUser.id,
            receiverId: selectedContact.id,
            senderName: currentUser.username,
            type: 'file',
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                data: signedUrl,
                key: uploadResult.key,
                isS3: true
            }
        };
        
        // Send file message via socket
        socket.emit('send_message', fileMessage);
        
        // Hide upload progress
        hideUploadProgress();
        
        // Clear file input
        event.target.value = '';
        
        showSuccessToast('File sent successfully!');
    } catch (error) {
        console.error('File upload error:', error);
        hideUploadProgress();
        showErrorToast('Failed to send file');
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function showUploadProgress() {
    const progressHtml = `
        <div class="upload-progress" id="uploadProgress">
            <h3>Uploading file...</h3>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="upload-status">Processing file...</div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', progressHtml);
    
    // Simulate progress
    const progressFill = document.querySelector('.progress-fill');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 100);
}

function hideUploadProgress() {
    const progress = document.getElementById('uploadProgress');
    if (progress) {
        progress.remove();
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType.startsWith('video/')) return 'fas fa-video';
    if (fileType.startsWith('audio/')) return 'fas fa-music';
    if (fileType.includes('pdf')) return 'fas fa-file-pdf';
    if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
    if (fileType.includes('text')) return 'fas fa-file-alt';
    return 'fas fa-file';
}

function downloadFile(fileName, fileData) {
    const link = document.createElement('a');
    link.href = fileData; // works for both base64 data URL and https S3 URL
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Emoji picker functions
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    const isVisible = emojiPicker.style.display === 'flex';
    
    if (isVisible) {
        emojiPicker.style.display = 'none';
    } else {
        emojiPicker.style.display = 'flex';
        loadEmojis('smileys');
    }
}

function loadEmojis(category) {
    const emojiGrid = document.getElementById('emojiGrid');
    const emojis = emojiData[category] || [];
    
    emojiGrid.innerHTML = '';
    
    emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.className = 'emoji-item';
        emojiButton.textContent = emoji;
        emojiButton.onclick = () => insertEmoji(emoji);
        emojiGrid.appendChild(emojiButton);
    });
    
    // Update active category
    document.querySelectorAll('.emoji-category').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

function insertEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    const currentValue = messageInput.value;
    const cursorPosition = messageInput.selectionStart;
    
    const newValue = currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
    messageInput.value = newValue;
    
    // Set cursor position after emoji
    messageInput.focus();
    messageInput.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
    
    // Hide emoji picker
    document.getElementById('emojiPicker').style.display = 'none';
}

// Initialize emoji picker categories
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for emoji categories
    document.querySelectorAll('.emoji-category').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            loadEmojis(category);
        });
    });
    
    // Close emoji picker when clicking outside
    document.addEventListener('click', function(event) {
        const emojiPicker = document.getElementById('emojiPicker');
        const emojiButton = event.target.closest('[onclick="toggleEmojiPicker()"]');
        
        if (!emojiPicker.contains(event.target) && !emojiButton) {
            emojiPicker.style.display = 'none';
        }
    });
});

// Settings and other functions
function showSettings() {
    // Implementation for settings modal
    showSuccessToast('Settings feature coming soon!');
}
