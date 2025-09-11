// Verification Page JavaScript

// DOM Elements
const generatedCode = document.getElementById('generatedCode');
const copyBtn = document.getElementById('copyBtn');
const refreshBtn = document.getElementById('refreshBtn');
const backBtn = document.getElementById('backBtn');
const successMessage = document.getElementById('successMessage');

// Current code
let currentCode = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateNewCode();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    copyBtn.addEventListener('click', copyCode);
    refreshBtn.addEventListener('click', generateNewCode);
    backBtn.addEventListener('click', goBack);
}

// Generate new verification code
function generateNewCode() {
    refreshBtn.classList.add('loading');
    refreshBtn.textContent = 'YENİLƏNİR...';
    generatedCode.classList.add('loading');
    
    setTimeout(() => {
        currentCode = generateRandomCode();
        generatedCode.textContent = currentCode;
        generatedCode.classList.remove('loading');
        
        refreshBtn.classList.remove('loading');
        refreshBtn.textContent = '🔄 YENİ KOD';
        
        // Save code to session storage for verification
        saveCodeToStorage(currentCode);
        
        // Set expiration timer (5 minutes)
        setTimeout(() => {
            expireCode();
        }, 5 * 60 * 1000);
        
    }, 1000);
}

// Generate random code (6 characters: letters and numbers)
function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Copy code to clipboard
async function copyCode() {
    if (!currentCode || currentCode === 'YOXDUR') {
        showMessage('Kod mövcud deyil!', 'error');
        return;
    }
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(currentCode);
            showSuccessMessage();
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = currentCode;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                showSuccessMessage();
            } catch (err) {
                showMessage('Kopyalama uğursuz!', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    } catch (err) {
        showMessage('Kopyalama uğursuz!', 'error');
    }
}

// Show success message
function showSuccessMessage() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 2000);
}

// Show general message
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span>${text}</span>
    `;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        backdrop-filter: blur(10px);
        border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Expire code
function expireCode() {
    currentCode = '';
    generatedCode.textContent = 'MÜDDƏTİ BİTDİ';
    generatedCode.style.color = '#ff4444';
    copyBtn.disabled = true;
    copyBtn.style.opacity = '0.5';
    
    // Show expiration message
    showMessage('Kodun müddəti bitdi. Yeni kod alın!', 'error');
}

// Save code to storage for verification
function saveCodeToStorage(code) {
    const codeData = {
        code: code,
        timestamp: Date.now(),
        expires: Date.now() + (5 * 60 * 1000) // 5 minutes
    };
    
    sessionStorage.setItem('verification_code', JSON.stringify(codeData));
}

// Get code from storage
function getCodeFromStorage() {
    const stored = sessionStorage.getItem('verification_code');
    if (!stored) return null;
    
    try {
        const codeData = JSON.parse(stored);
        if (Date.now() > codeData.expires) {
            sessionStorage.removeItem('verification_code');
            return null;
        }
        return codeData.code;
    } catch (err) {
        sessionStorage.removeItem('verification_code');
        return null;
    }
}

// Go back to previous page
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'tasks.html';
    }
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, check if code is still valid
        const storedCode = getCodeFromStorage();
        if (!storedCode && currentCode !== 'MÜDDƏTİ BİTDİ') {
            expireCode();
        }
    }
});

// Check URL parameters for task reference
function checkTaskReference() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('task');
    
    if (taskId) {
        // This verification is for a specific task
        sessionStorage.setItem('current_task_id', taskId);
    }
}

// Initialize task reference check
checkTaskReference();

// Export for external access
window.getCurrentVerificationCode = function() {
    return getCodeFromStorage();
};

// Auto-refresh code every 4 minutes to prevent expiration
setInterval(() => {
    if (currentCode && currentCode !== 'MÜDDƏTİ BİTDİ' && currentCode !== 'YOXDUR') {
        const stored = sessionStorage.getItem('verification_code');
        if (stored) {
            const codeData = JSON.parse(stored);
            const timeLeft = codeData.expires - Date.now();
            
            // Refresh if less than 1 minute left
            if (timeLeft < 60000) {
                generateNewCode();
            }
        }
    }
}, 30000); // Check every 30 seconds