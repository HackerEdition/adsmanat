// Verification Page JavaScript

// DOM elements
const codeDisplay = document.getElementById('codeDisplay');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const backBtn = document.getElementById('backBtn');
const successMessage = document.getElementById('successMessage');

// Generated code
let currentCode = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateCode();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateCode);
    copyBtn.addEventListener('click', copyCode);
    backBtn.addEventListener('click', goBack);
    
    // Add click effects to all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 200);
        });
    });
}

// Generate verification code
function generateCode() {
    // Show loading state
    codeDisplay.textContent = 'KOD YARADILIR...';
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<div class="loading"></div> YARADILIR...';
    
    // Generate random code
    setTimeout(() => {
        currentCode = generateRandomCode();
        codeDisplay.textContent = currentCode;
        
        // Add generation animation
        const codeContainer = document.querySelector('.generated-code');
        codeContainer.classList.add('code-generating');
        
        setTimeout(() => {
            codeContainer.classList.remove('code-generating');
        }, 1000);
        
        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> YENİ KOD';
        
        // Enable copy button
        copyBtn.disabled = false;
        
    }, 1500);
}

// Generate random code
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
}

// Copy code to clipboard
function copyCode() {
    if (!currentCode) {
        showMessage('Əvvəlcə kod yaradın!', 'error');
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(currentCode).then(() => {
        showMessage('Kod kopyalandı!', 'success');
        addHapticFeedback();
    }).catch(() => {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(currentCode);
    });
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showMessage('Kod kopyalandı!', 'success');
            addHapticFeedback();
        } else {
            showMessage('Kopyalama uğursuz oldu!', 'error');
        }
    } catch (err) {
        showMessage('Kopyalama uğursuz oldu!', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show message
function showMessage(text, type = 'success') {
    successMessage.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${text}</span>
    `;
    
    successMessage.className = `success-message ${type} show`;
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Go back to tasks page
function goBack() {
    // Check if we're in an iframe or popup
    if (window.opener) {
        window.close();
    } else if (window.parent !== window) {
        window.parent.postMessage('closeVerification', '*');
    } else {
        window.history.back();
    }
}

// Add haptic feedback
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        goBack();
    } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (e.target === generateBtn) {
            generateCode();
        } else if (e.target === copyBtn) {
            copyCode();
        }
    }
});

// Add auto-refresh code every 5 minutes
setInterval(() => {
    if (currentCode) {
        generateCode();
    }
}, 300000); // 5 minutes

// Add code expiration warning
function addExpirationWarning() {
    const warning = document.createElement('div');
    warning.className = 'expiration-warning';
    warning.innerHTML = `
        <i class="fas fa-clock"></i>
        <span>Kod 5 dəqiqə sonra yenilənəcək</span>
    `;
    
    const verificationCard = document.querySelector('.verification-card');
    verificationCard.appendChild(warning);
    
    // Remove warning after 4 minutes
    setTimeout(() => {
        if (warning.parentNode) {
            warning.parentNode.removeChild(warning);
        }
    }, 240000);
}

// Add expiration warning styles
const warningStyle = document.createElement('style');
warningStyle.textContent = `
    .expiration-warning {
        background: rgba(255, 165, 0, 0.1);
        border: 1px solid #ffa500;
        border-radius: 10px;
        padding: 10px 15px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #ffa500;
        font-size: 14px;
        animation: warningPulse 2s infinite;
    }
    
    .expiration-warning i {
        font-size: 16px;
    }
    
    @keyframes warningPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(warningStyle);

// Initialize expiration warning
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addExpirationWarning();
    }, 60000); // Show warning after 1 minute
});

// Add code history (store last 5 codes)
function addCodeHistory() {
    const history = JSON.parse(localStorage.getItem('adsmanat_code_history') || '[]');
    
    // Add current code to history
    if (currentCode && !history.includes(currentCode)) {
        history.unshift(currentCode);
        if (history.length > 5) {
            history.pop();
        }
        localStorage.setItem('adsmanat_code_history', JSON.stringify(history));
    }
}

// Update generateCode to include history
const originalGenerateCode = generateCode;
generateCode = function() {
    originalGenerateCode();
    setTimeout(() => {
        addCodeHistory();
    }, 2000);
};

// Add sound effects
function playGenerateSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play generation sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Play sound when code is generated
const originalGenerateCodeWithSound = generateCode;
generateCode = function() {
    originalGenerateCodeWithSound();
    setTimeout(() => {
        playGenerateSound();
    }, 1500);
};

// Add code validation
function validateCode(code) {
    // Check if code is 6 characters long and contains only alphanumeric characters
    return /^[A-Z0-9]{6}$/.test(code);
}

// Add code strength indicator
function addCodeStrengthIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'code-strength';
    indicator.innerHTML = `
        <div class="strength-label">Kod Gücü:</div>
        <div class="strength-bar">
            <div class="strength-fill" id="strengthFill"></div>
        </div>
        <div class="strength-text" id="strengthText">Yüksək</div>
    `;
    
    const codeGenerator = document.querySelector('.code-generator');
    codeGenerator.appendChild(indicator);
}

// Add strength indicator styles
const strengthStyle = document.createElement('style');
strengthStyle.textContent = `
    .code-strength {
        margin-top: 15px;
        text-align: center;
    }
    
    .strength-label {
        color: #cccccc;
        font-size: 12px;
        margin-bottom: 5px;
    }
    
    .strength-bar {
        width: 100%;
        height: 4px;
        background: rgba(0, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
        margin-bottom: 5px;
    }
    
    .strength-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ff00 0%, #00ffff 100%);
        border-radius: 2px;
        width: 100%;
        transition: width 0.3s ease;
    }
    
    .strength-text {
        color: #00ff00;
        font-size: 11px;
        font-weight: bold;
    }
`;
document.head.appendChild(strengthStyle);

// Initialize strength indicator
document.addEventListener('DOMContentLoaded', function() {
    addCodeStrengthIndicator();
});

// Add touch gestures for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - generate new code
            generateCode();
        } else {
            // Swipe down - go back
            goBack();
        }
    }
}