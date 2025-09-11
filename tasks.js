// Tasks page functionality
let currentTask = null;
let generatedCode = '';
let verificationModal = null;
let codeInput = null;
let generatedCodeDisplay = null;

// Initialize tasks page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadTaskStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Task buttons
    const taskBtns = document.querySelectorAll('.task-btn');
    taskBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const task = this.getAttribute('data-task');
            const link = this.getAttribute('data-link');
            handleTaskClick(task, link, this);
        });
    });
    
    // Verification modal
    verificationModal = document.getElementById('verificationModal');
    codeInput = document.getElementById('codeInput');
    generatedCodeDisplay = document.getElementById('generatedCode');
    
    // Close verification modal
    document.getElementById('closeVerification').addEventListener('click', closeVerificationModal);
    document.getElementById('cancelVerification').addEventListener('click', closeVerificationModal);
    document.getElementById('confirmVerification').addEventListener('click', confirmVerification);
    
    // Close modal when clicking outside
    verificationModal.addEventListener('click', function(e) {
        if (e.target === verificationModal) {
            closeVerificationModal();
        }
    });
    
    // Code input handling
    codeInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
    
    codeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            confirmVerification();
        }
    });
}

// Handle task click
function handleTaskClick(task, link, button) {
    if (button.disabled) return;
    
    if (task === 'shortlink') {
        // Show verification modal for short link tasks
        showVerificationModal(task, link, button);
    } else {
        // Direct link tasks (YouTube, Telegram, TikTok)
        handleDirectLinkTask(task, link, button);
    }
}

// Handle direct link tasks
function handleDirectLinkTask(task, link, button) {
    // Open link in new tab
    window.open(link, '_blank');
    
    // Start countdown for verification
    startTaskCountdown(task, button);
}

// Start task countdown
function startTaskCountdown(task, button) {
    let countdown = 5;
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-clock"></i> ${countdown} Saniyə`;
    
    const timer = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            button.innerHTML = `<i class="fas fa-clock"></i> ${countdown} Saniyə`;
        } else {
            clearInterval(timer);
            completeTask(task, button);
        }
    }, 1000);
}

// Complete task
function completeTask(task, button) {
    // Mark task as completed
    button.classList.add('completed');
    button.innerHTML = '<i class="fas fa-check"></i> TAMAMLANDI';
    button.disabled = true;
    
    // Save task status
    saveTaskStatus(task, true);
    
    // Add reward
    addTaskReward(task);
    
    // Show success message
    showSuccessMessage(`Görev tamamlandı! ${getTaskReward(task)} ADSCOİN qazandınız.`);
}

// Show verification modal
function showVerificationModal(task, link, button) {
    currentTask = { task, link, button };
    generatedCode = generateCode();
    generatedCodeDisplay.textContent = generatedCode;
    
    // Reset input
    codeInput.value = '';
    
    // Show modal
    verificationModal.classList.add('show');
    
    // Focus on input
    setTimeout(() => {
        codeInput.focus();
    }, 300);
    
    // Open link in new tab
    window.open(link, '_blank');
}

// Generate verification code
function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Close verification modal
function closeVerificationModal() {
    verificationModal.classList.remove('show');
    currentTask = null;
    generatedCode = '';
}

// Confirm verification
function confirmVerification() {
    const inputCode = codeInput.value.trim().toUpperCase();
    
    if (inputCode === generatedCode) {
        // Correct code
        completeTask(currentTask.task, currentTask.button);
        closeVerificationModal();
        showSuccessMessage(`Kod düzgündür! ${getTaskReward(currentTask.task)} ADSCOİN qazandınız.`);
    } else {
        // Wrong code
        showErrorMessage('Kod yanlışdır! Zəhmət olmasa düzgün kodu daxil edin.');
        codeInput.value = '';
        codeInput.focus();
    }
}

// Get task reward
function getTaskReward(task) {
    const rewards = {
        'youtube': 5,
        'telegram': 5,
        'tiktok': 5,
        'shortlink': 3
    };
    return rewards[task] || 0;
}

// Add task reward
function addTaskReward(task) {
    const reward = getTaskReward(task);
    if (reward > 0) {
        // Update balance
        updateBalance(reward);
    }
}

// Update balance
function updateBalance(adscoin) {
    const savedData = localStorage.getItem('adsmanat_data');
    let data = savedData ? JSON.parse(savedData) : {};
    
    data.adscoinBalance = (data.adscoinBalance || 0) + adscoin;
    data.aznBalance = (data.aznBalance || 0) + (adscoin * 0.001);
    
    localStorage.setItem('adsmanat_data', JSON.stringify(data));
}

// Save task status
function saveTaskStatus(task, completed) {
    const taskStatus = JSON.parse(localStorage.getItem('task_status') || '{}');
    taskStatus[task] = completed;
    localStorage.setItem('task_status', JSON.stringify(taskStatus));
}

// Load task status
function loadTaskStatus() {
    const taskStatus = JSON.parse(localStorage.getItem('task_status') || '{}');
    
    Object.keys(taskStatus).forEach(task => {
        if (taskStatus[task]) {
            const button = document.querySelector(`[data-task="${task}"]`);
            if (button) {
                button.classList.add('completed');
                button.innerHTML = '<i class="fas fa-check"></i> TAMAMLANDI';
                button.disabled = true;
            }
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
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

// Show error message
function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
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

// Add click effects
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('task-btn')) {
        e.target.classList.add('btn-click');
        setTimeout(() => {
            e.target.classList.remove('btn-click');
        }, 300);
    }
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && verificationModal.classList.contains('show')) {
        closeVerificationModal();
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('task-btn')) {
        e.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.classList.contains('task-btn')) {
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }
});

// Add animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const taskItems = document.querySelectorAll('.task-item, .daily-task-item');
    taskItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add confetti effect for completed tasks
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
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${['#ff00ff', '#00ffff', '#ffff00'][Math.floor(Math.random() * 3)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confetti-fall 2s linear forwards;
        `;
        confetti.appendChild(particle);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
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

// Enhanced complete task function
function completeTaskEnhanced(task, button) {
    completeTask(task, button);
    showConfetti();
}

// Replace original complete task function
const originalCompleteTask = completeTask;
completeTask = completeTaskEnhanced;