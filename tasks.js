// Tasks Page Specific JavaScript

// Global variables
let currentTaskCodes = {};
let completedTasks = [];
let userBalance = {
    tickets: 0,
    adscoin: 0,
    azn: 0.000
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCompletedTasks();
    setupTaskEventListeners();
    generateTaskCodes();
});

// Setup event listeners
function setupTaskEventListeners() {
    // Special task buttons
    const specialTaskBtns = document.querySelectorAll('.task-btn:not(.daily-task-btn)');
    specialTaskBtns.forEach(btn => {
        btn.addEventListener('click', handleSpecialTask);
    });
    
    // Daily task buttons
    const dailyTaskBtns = document.querySelectorAll('.daily-task-btn');
    dailyTaskBtns.forEach(btn => {
        btn.addEventListener('click', handleDailyTask);
    });
    
    // Code input handlers
    setupCodeInputHandlers();
}

// Handle special tasks (YouTube, Telegram, TikTok)
function handleSpecialTask(e) {
    const btn = e.target;
    const link = btn.dataset.link;
    const reward = parseInt(btn.dataset.reward);
    const taskId = getTaskId(btn);
    
    if (completedTasks.includes(taskId)) {
        showTaskMessage('Bu görevi artıq tamamladınız!', 'error');
        return;
    }
    
    // Open link
    window.open(link, '_blank');
    
    // Mark as loading
    btn.classList.add('loading');
    btn.textContent = 'YÖKLƏNİR...';
    btn.disabled = true;
    
    // Simulate verification after 5 seconds
    setTimeout(() => {
        completeSpecialTask(btn, taskId, reward);
    }, 5000);
}

// Handle daily tasks (Short links)
function handleDailyTask(e) {
    const btn = e.target;
    const taskItem = btn.closest('.task-item');
    const codeSection = taskItem.querySelector('.code-input-section');
    const link = btn.dataset.link;
    const taskId = getTaskId(btn);
    
    if (completedTasks.includes(taskId)) {
        showTaskMessage('Bu görevi artıq tamamladınız!', 'error');
        return;
    }
    
    // Open link and show code input
    window.open(link, '_blank');
    
    // Generate new code for this task
    generateCodeForTask(taskId);
    
    // Show code input section
    codeSection.style.display = 'block';
    
    // Focus on input
    const codeInput = codeSection.querySelector('.code-input');
    setTimeout(() => {
        codeInput.focus();
    }, 300);
}

// Setup code input handlers
function setupCodeInputHandlers() {
    const codeInputSections = document.querySelectorAll('.code-input-section');
    
    codeInputSections.forEach(section => {
        const codeInput = section.querySelector('.code-input');
        const cancelBtn = section.querySelector('.code-cancel-btn');
        const confirmBtn = section.querySelector('.code-confirm-btn');
        
        // Cancel button
        cancelBtn.addEventListener('click', () => {
            hideCodeInput(section);
        });
        
        // Confirm button
        confirmBtn.addEventListener('click', () => {
            const taskItem = section.closest('.task-item');
            const taskBtn = taskItem.querySelector('.daily-task-btn');
            const taskId = getTaskId(taskBtn);
            const enteredCode = codeInput.value.trim().toUpperCase();
            const correctCode = currentTaskCodes[taskId];
            
            if (enteredCode === correctCode) {
                // Correct code
                const reward = parseInt(taskBtn.dataset.reward);
                completeDailyTask(taskBtn, taskId, reward);
                hideCodeInput(section);
            } else {
                // Wrong code
                showTaskMessage('Yanlış kod! Yenidən cəhd edin.', 'error');
                codeInput.value = '';
                codeInput.focus();
            }
        });
        
        // Enter key support
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                confirmBtn.click();
            }
        });
        
        // Input validation
        codeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
            confirmBtn.disabled = e.target.value.trim().length === 0;
        });
    });
}

// Generate codes for all tasks
function generateTaskCodes() {
    const dailyTasks = document.querySelectorAll('.daily-task-btn');
    dailyTasks.forEach(btn => {
        const taskId = getTaskId(btn);
        currentTaskCodes[taskId] = generateRandomCode();
    });
}

// Generate code for specific task
function generateCodeForTask(taskId) {
    currentTaskCodes[taskId] = generateRandomCode();
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

// Get task ID from button
function getTaskId(btn) {
    const taskItem = btn.closest('.task-item');
    const taskTitle = taskItem.querySelector('.task-title').textContent;
    return taskTitle.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

// Complete special task
function completeSpecialTask(btn, taskId, reward) {
    btn.classList.remove('loading');
    btn.classList.add('completed');
    btn.textContent = 'TAMAMLANDI';
    btn.disabled = true;
    
    // Add to completed tasks
    completedTasks.push(taskId);
    
    // Update balance
    updateBalance(reward);
    
    // Show success message
    showTaskMessage(`Təbriklər! ${reward} ADSCOİN qazandınız!`, 'success');
    
    // Save to backend
    saveCompletedTask(taskId, reward);
}

// Complete daily task
function completeDailyTask(btn, taskId, reward) {
    btn.classList.add('completed');
    btn.textContent = 'TAMAMLANDI';
    btn.disabled = true;
    
    // Add to completed tasks
    completedTasks.push(taskId);
    
    // Update balance
    updateBalance(reward);
    
    // Show success message
    showTaskMessage(`Təbriklər! ${reward} ADSCOİN qazandınız!`, 'success');
    
    // Save to backend
    saveCompletedTask(taskId, reward);
}

// Update user balance
function updateBalance(reward) {
    userBalance.adscoin += reward;
    userBalance.azn = userBalance.adscoin * 0.001;
    
    // Update balance display if elements exist
    const adscoinElement = document.getElementById('adscoinBalance');
    const aznElement = document.getElementById('aznBalance');
    
    if (adscoinElement) adscoinElement.textContent = userBalance.adscoin;
    if (aznElement) aznElement.textContent = userBalance.azn.toFixed(3);
}

// Hide code input section
function hideCodeInput(section) {
    section.classList.add('hiding');
    setTimeout(() => {
        section.style.display = 'none';
        section.classList.remove('hiding');
        
        // Clear input
        const codeInput = section.querySelector('.code-input');
        codeInput.value = '';
    }, 300);
}

// Show task message
function showTaskMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.task-message');
    existingMessages.forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `task-message ${type}`;
    message.innerHTML = `
        <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span>${text}</span>
    `;
    
    document.body.appendChild(message);
    
    // Show message
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    // Hide message after 3 seconds
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

// Load completed tasks from backend
async function loadCompletedTasks() {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        const response = await fetch(`api/get_completed_tasks.php?telegram_id=${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            completedTasks = result.tasks;
            updateTasksUI();
        }
    } catch (error) {
        console.error('Error loading completed tasks:', error);
    }
}

// Update tasks UI based on completed tasks
function updateTasksUI() {
    completedTasks.forEach(taskId => {
        const taskButtons = document.querySelectorAll('.task-btn');
        taskButtons.forEach(btn => {
            if (getTaskId(btn) === taskId) {
                btn.classList.add('completed');
                btn.textContent = 'TAMAMLANDI';
                btn.disabled = true;
            }
        });
    });
}

// Save completed task to backend
async function saveCompletedTask(taskId, reward) {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        const response = await fetch('api/complete_task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegram_id: user.id,
                task_id: taskId,
                reward: reward
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Task completed and saved successfully');
        }
    } catch (error) {
        console.error('Error saving completed task:', error);
    }
}

// Get current code for verification page
function getCurrentCode(taskId) {
    return currentTaskCodes[taskId] || null;
}

// Export for verification page
window.getCurrentTaskCode = getCurrentCode;