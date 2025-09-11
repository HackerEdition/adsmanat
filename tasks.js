// Tasks Page JavaScript

// DOM elements
const youtubeTask = document.getElementById('youtubeTask');
const telegramTask = document.getElementById('telegramTask');
const tiktokTask = document.getElementById('tiktokTask');
const shortLinkTask = document.getElementById('shortLinkTask');
const verificationModal = document.getElementById('verificationModal');
const closeVerification = document.getElementById('closeVerification');
const verificationCode = document.getElementById('verificationCode');
const generateCodeBtn = document.getElementById('generateCodeBtn');
const cancelVerification = document.getElementById('cancelVerification');
const confirmVerification = document.getElementById('confirmVerification');

// Task links
const taskLinks = {
    youtube: 'https://youtube.com/@adsmanat?si=p5erKFg_4Ds3SU2d',
    telegram: 'https://t.me/adsmanatofficial',
    tiktok: 'https://www.tiktok.com/@adsmanat?is_from_webapp=1&sender_device=pc'
};

// Generated verification code
let currentVerificationCode = '';
let currentTaskType = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadTaskStatus();
});

// Setup event listeners
function setupEventListeners() {
    // Task buttons
    youtubeTask.addEventListener('click', () => handleTaskClick('youtube'));
    telegramTask.addEventListener('click', () => handleTaskClick('telegram'));
    tiktokTask.addEventListener('click', () => handleTaskClick('tiktok'));
    shortLinkTask.addEventListener('click', () => handleShortLinkTask());
    
    // Verification modal
    closeVerification.addEventListener('click', closeVerificationModal);
    cancelVerification.addEventListener('click', closeVerificationModal);
    confirmVerification.addEventListener('click', verifyCode);
    generateCodeBtn.addEventListener('click', generateNewCode);
    
    // Close modal on overlay click
    verificationModal.addEventListener('click', function(e) {
        if (e.target === verificationModal) {
            closeVerificationModal();
        }
    });
    
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

// Handle task click
function handleTaskClick(taskType) {
    if (isTaskCompleted(taskType)) {
        showMessage('Bu görev artıq tamamlanıb!', 'error');
        return;
    }
    
    // Open link in new tab
    window.open(taskLinks[taskType], '_blank');
    
    // Start verification process after a delay
    setTimeout(() => {
        startVerificationProcess(taskType);
    }, 2000);
}

// Handle short link task
function handleShortLinkTask() {
    if (isTaskCompleted('shortlink')) {
        showMessage('Bu görev artıq tamamlanıb!', 'error');
        return;
    }
    
    // Open verification page
    window.open('verification.html', '_blank');
    
    // Start verification process
    setTimeout(() => {
        startVerificationProcess('shortlink');
    }, 2000);
}

// Start verification process
function startVerificationProcess(taskType) {
    currentTaskType = taskType;
    generateNewCode();
    showVerificationModal();
}

// Show verification modal
function showVerificationModal() {
    verificationModal.classList.add('show');
    verificationCode.focus();
    verificationCode.value = '';
}

// Close verification modal
function closeVerificationModal() {
    verificationModal.classList.remove('show');
    currentTaskType = '';
    currentVerificationCode = '';
}

// Generate new verification code
function generateNewCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    currentVerificationCode = '';
    
    for (let i = 0; i < 6; i++) {
        currentVerificationCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Show code generation animation
    generateCodeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    setTimeout(() => {
        generateCodeBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        showMessage(`Yeni kod yaradıldı: ${currentVerificationCode}`, 'success');
    }, 1000);
}

// Verify code
function verifyCode() {
    const enteredCode = verificationCode.value.toUpperCase().trim();
    
    if (!enteredCode) {
        showMessage('Zəhmət olmasa kodu daxil edin!', 'error');
        return;
    }
    
    if (enteredCode === currentVerificationCode) {
        // Code is correct
        completeTask(currentTaskType);
        closeVerificationModal();
        showMessage('Təbriklər! Görev tamamlandı!', 'success');
    } else {
        // Code is incorrect
        showMessage('Yanlış kod! Yenidən cəhd edin.', 'error');
        verificationCode.value = '';
        verificationCode.focus();
    }
}

// Complete task
function completeTask(taskType) {
    const rewards = {
        youtube: 5,
        telegram: 5,
        tiktok: 5,
        shortlink: 3
    };
    
    const reward = rewards[taskType];
    
    // Mark task as completed
    const completedTasks = getCompletedTasks();
    completedTasks[taskType] = true;
    localStorage.setItem('adsmanat_completed_tasks', JSON.stringify(completedTasks));
    
    // Add reward to balance
    if (window.ADSMANAT) {
        window.ADSMANAT.addAdscoin(reward);
    } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem('adsmanat_user_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            data.adscoinBalance = (data.adscoinBalance || 0) + reward;
            data.aznBalance = data.adscoinBalance * 0.001;
            localStorage.setItem('adsmanat_user_data', JSON.stringify(data));
        }
    }
    
    // Update button state
    updateTaskButton(taskType);
    
    // Show confetti for completion
    showConfetti();
}

// Get completed tasks
function getCompletedTasks() {
    const completed = localStorage.getItem('adsmanat_completed_tasks');
    return completed ? JSON.parse(completed) : {};
}

// Check if task is completed
function isTaskCompleted(taskType) {
    const completedTasks = getCompletedTasks();
    return completedTasks[taskType] || false;
}

// Load task status
function loadTaskStatus() {
    const completedTasks = getCompletedTasks();
    
    Object.keys(completedTasks).forEach(taskType => {
        if (completedTasks[taskType]) {
            updateTaskButton(taskType);
        }
    });
}

// Update task button
function updateTaskButton(taskType) {
    const buttonMap = {
        youtube: youtubeTask,
        telegram: telegramTask,
        tiktok: tiktokTask,
        shortlink: shortLinkTask
    };
    
    const button = buttonMap[taskType];
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> TAMAMLANDI';
        button.disabled = true;
        button.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
        button.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
    }
}

// Show message
function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `task-message ${type} show`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${text}</span>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

// Show confetti effect
function showConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2000;
    `;
    
    for (let i = 0; i < 40; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${['#00ffff', '#ff00ff', '#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4'][Math.floor(Math.random() * 6)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        confetti.appendChild(piece);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, 4000);
}

// Add confetti CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
        }
    }
`;
document.head.appendChild(style);

// Add haptic feedback
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Add haptic feedback to buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', addHapticFeedback);
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (verificationModal.classList.contains('show')) {
        if (e.key === 'Escape') {
            closeVerificationModal();
        } else if (e.key === 'Enter') {
            verifyCode();
        }
    }
});

// Add input validation for verification code
verificationCode.addEventListener('input', function(e) {
    // Only allow alphanumeric characters
    e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Limit to 6 characters
    if (e.target.value.length > 6) {
        e.target.value = e.target.value.slice(0, 6);
    }
});

// Add auto-focus to verification code input
verificationCode.addEventListener('focus', function() {
    this.select();
});

// Add task completion sound effect
function playCompletionSound() {
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play success sound
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Play sound when task is completed
const originalCompleteTask = completeTask;
completeTask = function(taskType) {
    originalCompleteTask(taskType);
    playCompletionSound();
};

// Add task progress tracking
function getTaskProgress() {
    const completedTasks = getCompletedTasks();
    const totalTasks = 4; // youtube, telegram, tiktok, shortlink
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    
    return {
        completed: completedCount,
        total: totalTasks,
        percentage: Math.round((completedCount / totalTasks) * 100)
    };
}

// Add progress display
function addProgressDisplay() {
    const progress = getTaskProgress();
    const progressElement = document.createElement('div');
    progressElement.className = 'task-progress';
    progressElement.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
        </div>
        <div class="progress-text">${progress.completed}/${progress.total} görev tamamlandı</div>
    `;
    
    const tasksCard = document.querySelector('.tasks-card');
    tasksCard.insertBefore(progressElement, tasksCard.firstChild);
}

// Add progress styles
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .task-progress {
        margin-bottom: 20px;
        text-align: center;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(0, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 10px;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #00ffff 0%, #0080ff 100%);
        border-radius: 4px;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
    
    .progress-text {
        color: #cccccc;
        font-size: 14px;
    }
`;
document.head.appendChild(progressStyle);

// Initialize progress display
document.addEventListener('DOMContentLoaded', function() {
    addProgressDisplay();
});