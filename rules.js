// Rules Page JavaScript

// DOM Elements
const generalRulesBtn = document.getElementById('generalRulesBtn');
const eventRulesBtn = document.getElementById('eventRulesBtn');
const generalRulesContent = document.getElementById('generalRulesContent');
const eventRulesContent = document.getElementById('eventRulesContent');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupRulesNavigation();
    checkEventAccess();
});

// Setup rules navigation
function setupRulesNavigation() {
    generalRulesBtn.addEventListener('click', () => {
        showRulesSection('general');
    });
    
    eventRulesBtn.addEventListener('click', () => {
        showRulesSection('event');
    });
}

// Show rules section
function showRulesSection(section) {
    if (section === 'general') {
        // Update navigation buttons
        generalRulesBtn.classList.add('active');
        eventRulesBtn.classList.remove('active');
        
        // Show/hide content with animation
        eventRulesContent.classList.add('fade-out');
        setTimeout(() => {
            eventRulesContent.style.display = 'none';
            eventRulesContent.classList.remove('fade-out');
            
            generalRulesContent.style.display = 'block';
            generalRulesContent.classList.add('fadeIn');
            
            setTimeout(() => {
                generalRulesContent.classList.remove('fadeIn');
            }, 300);
        }, 150);
        
    } else if (section === 'event') {
        // Update navigation buttons
        eventRulesBtn.classList.add('active');
        generalRulesBtn.classList.remove('active');
        
        // Show/hide content with animation
        generalRulesContent.classList.add('fade-out');
        setTimeout(() => {
            generalRulesContent.style.display = 'none';
            generalRulesContent.classList.remove('fade-out');
            
            eventRulesContent.style.display = 'block';
            eventRulesContent.classList.add('fadeIn');
            
            setTimeout(() => {
                eventRulesContent.classList.remove('fadeIn');
            }, 300);
        }, 150);
    }
}

// Check if user came from events page
function checkEventAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    
    if (section === 'event') {
        showRulesSection('event');
    }
    
    // Check referrer
    if (document.referrer.includes('events.html')) {
        showRulesSection('event');
    }
}

// Add smooth scrolling for long content
function addSmoothScrolling() {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    ruleItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize smooth scrolling
setTimeout(addSmoothScrolling, 100);

// Handle profile link click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('link-btn')) {
        e.preventDefault();
        
        // Show message that profile link is not available yet
        showMessage('Profil şəkli linki tezliklə əlavə ediləcək!', 'info');
    }
});

// Show message function
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <span class="message-icon">${getMessageIcon(type)}</span>
        <span>${text}</span>
    `;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${getMessageColor(type)};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        backdrop-filter: blur(10px);
        border: 1px solid ${getMessageBorderColor(type)};
        max-width: 90%;
        text-align: center;
        font-weight: bold;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Get message icon based on type
function getMessageIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'info': return 'ℹ️';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Get message color based on type
function getMessageColor(type) {
    switch (type) {
        case 'success': return 'rgba(34, 197, 94, 0.9)';
        case 'error': return 'rgba(239, 68, 68, 0.9)';
        case 'info': return 'rgba(59, 130, 246, 0.9)';
        case 'warning': return 'rgba(245, 158, 11, 0.9)';
        default: return 'rgba(59, 130, 246, 0.9)';
    }
}

// Get message border color based on type
function getMessageBorderColor(type) {
    switch (type) {
        case 'success': return 'rgba(34, 197, 94, 0.3)';
        case 'error': return 'rgba(239, 68, 68, 0.3)';
        case 'info': return 'rgba(59, 130, 246, 0.3)';
        case 'warning': return 'rgba(245, 158, 11, 0.3)';
        default: return 'rgba(59, 130, 246, 0.3)';
    }
}