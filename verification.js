// Verification page functionality
let currentCode = '';
let codeTimer = null;
let isGenerating = false;

// DOM elements
const codeDisplay = document.getElementById('generatedCode');
const generateBtn = document.getElementById('generateBtn');
const backBtn = document.getElementById('backBtn');
const copyBtn = document.getElementById('copyBtn');

// Initialize verification page
document.addEventListener('DOMContentLoaded', function() {
    generateInitialCode();
    setupEventListeners();
    startCodeTimer();
});

// Setup event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateNewCode);
    backBtn.addEventListener('click', goBack);
    copyBtn.addEventListener('click', copyCode);
    
    // Add click effects
    [generateBtn, backBtn, copyBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 300);
        });
    });
}

// Generate initial code
function generateInitialCode() {
    currentCode = generateCode();
    codeDisplay.textContent = currentCode;
}

// Generate new code
function generateNewCode() {
    if (isGenerating) return;
    
    isGenerating = true;
    generateBtn.disabled = true;
    generateBtn.classList.add('generating');
    generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> YARADILIR...';
    
    // Simulate generation delay
    setTimeout(() => {
        currentCode = generateCode();
        codeDisplay.textContent = currentCode;
        
        // Reset button
        isGenerating = false;
        generateBtn.disabled = false;
        generateBtn.classList.remove('generating');
        generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> YENİ KOD YARAT';
        
        // Restart timer
        startCodeTimer();
        
        // Show success message
        showMessage('Yeni kod yaradıldı!', 'success');
    }, 1500);
}

// Generate random code
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Start code timer (5 minutes)
function startCodeTimer() {
    if (codeTimer) {
        clearInterval(codeTimer);
    }
    
    let timeLeft = 300; // 5 minutes in seconds
    updateTimerDisplay(timeLeft);
    
    codeTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(codeTimer);
            codeExpired();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    // Update page title
    document.title = `ADSMANAT - Kod Təsdiqi (${timeString})`;
}

// Code expired
function codeExpired() {
    showMessage('Kodun müddəti bitdi! Yeni kod yaradın.', 'error');
    codeDisplay.style.opacity = '0.5';
    generateBtn.style.animation = 'pulse 1s infinite';
}

// Copy code to clipboard
async function copyCode() {
    try {
        await navigator.clipboard.writeText(currentCode);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> KOPİYA EDİLDİ';
        
        showMessage('Kod kopyalandı!', 'success');
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> KOPİYA ET';
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentCode;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> KOPİYA EDİLDİ';
        
        showMessage('Kod kopyalandı!', 'success');
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> KOPİYA ET';
        }, 2000);
    }
}

// Go back to tasks page
function goBack() {
    window.location.href = 'tasks.html';
}

// Show message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
        error: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
        info: 'linear-gradient(135deg, #00ffff 0%, #0099cc 100%)'
    };
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1002;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !generateBtn.disabled) {
        generateNewCode();
    } else if (e.key === 'Escape') {
        goBack();
    } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        copyCode();
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'BUTTON') {
        e.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.tagName === 'BUTTON') {
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }
});

// Add code animation
function animateCode() {
    codeDisplay.style.transform = 'scale(1.1)';
    codeDisplay.style.boxShadow = '0 0 30px rgba(255, 0, 255, 0.6)';
    
    setTimeout(() => {
        codeDisplay.style.transform = 'scale(1)';
        codeDisplay.style.boxShadow = '0 0 25px rgba(255, 0, 255, 0.4)';
    }, 200);
}

// Enhanced generate new code function
function generateNewCodeEnhanced() {
    generateNewCode();
    animateCode();
}

// Replace original function
generateBtn.removeEventListener('click', generateNewCode);
generateBtn.addEventListener('click', generateNewCodeEnhanced);

// Add auto-refresh warning
function showAutoRefreshWarning() {
    const warning = document.createElement('div');
    warning.className = 'auto-refresh-warning';
    warning.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>Kod 30 saniyə sonra avtomatik yenilənəcək</span>
    `;
    warning.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ffaa00 0%, #ff8800 100%);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        box-shadow: 0 0 15px rgba(255, 170, 0, 0.5);
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 1001;
        font-size: 12px;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
        warning.remove();
    }, 5000);
}

// Show warning when 30 seconds left
setTimeout(() => {
    showAutoRefreshWarning();
}, 270000); // 4.5 minutes

// Add slide up animation
const slideUpStyle = document.createElement('style');
slideUpStyle.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(slideUpStyle);

// Add page visibility change handler
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause timer when page is hidden
        if (codeTimer) {
            clearInterval(codeTimer);
        }
    } else {
        // Resume timer when page is visible
        startCodeTimer();
    }
});

// Add beforeunload warning
window.addEventListener('beforeunload', function(e) {
    e.preventDefault();
    e.returnValue = 'Kod səhifəsini tərk etmək istədiyinizə əminsiniz?';
});

// Add confetti effect for new code generation
function showConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1003;
    `;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${['#ff00ff', '#00ffff', '#ffff00'][Math.floor(Math.random() * 3)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confetti-fall 1.5s linear forwards;
        `;
        confetti.appendChild(particle);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 1500);
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Enhanced generate new code with confetti
function generateNewCodeWithConfetti() {
    generateNewCodeEnhanced();
    showConfetti();
}

// Replace function again
generateBtn.removeEventListener('click', generateNewCodeEnhanced);
generateBtn.addEventListener('click', generateNewCodeWithConfetti);