// Withdraw Page JavaScript

// DOM elements
const withdrawForm = document.getElementById('withdrawForm');
const platformSelect = document.getElementById('platform');
const m10NumberInput = document.getElementById('m10Number');
const amountInput = document.getElementById('amount');
const withdrawBtn = document.getElementById('withdrawBtn');
const currentBalanceDisplay = document.getElementById('currentBalance');
const withdrawMessage = document.getElementById('withdrawMessage');
const messageText = document.getElementById('messageText');

// Withdraw data
let currentBalance = 0;
const minWithdrawAmount = 3000; // 3000 ADSCOİN = 3 AZN

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBalanceData();
    setupEventListeners();
    setupFormValidation();
});

// Setup event listeners
function setupEventListeners() {
    withdrawForm.addEventListener('submit', handleWithdraw);
    amountInput.addEventListener('input', updateAmountInfo);
    m10NumberInput.addEventListener('input', formatPhoneNumber);
    
    // Add click effects to buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 200);
        });
    });
}

// Load balance data
function loadBalanceData() {
    if (window.ADSMANAT) {
        const balance = window.ADSMANAT.getBalance();
        currentBalance = balance.adscoin;
        updateBalanceDisplay();
    } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem('adsmanat_user_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            currentBalance = data.adscoinBalance || 0;
            updateBalanceDisplay();
        }
    }
}

// Update balance display
function updateBalanceDisplay() {
    currentBalanceDisplay.textContent = currentBalance.toLocaleString();
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation
    amountInput.addEventListener('input', validateAmount);
    m10NumberInput.addEventListener('input', validatePhoneNumber);
    platformSelect.addEventListener('change', validatePlatform);
}

// Validate platform selection
function validatePlatform() {
    const platform = platformSelect.value;
    const formGroup = platformSelect.closest('.form-group');
    
    if (!platform) {
        showFieldError(formGroup, 'Platforma seçin');
        return false;
    } else {
        clearFieldError(formGroup);
        return true;
    }
}

// Validate phone number
function validatePhoneNumber() {
    const phoneNumber = m10NumberInput.value;
    const formGroup = m10NumberInput.closest('.form-group');
    
    // Remove all non-digit characters for validation
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (!phoneNumber) {
        showFieldError(formGroup, 'M10 nömrəsini daxil edin');
        return false;
    } else if (cleanNumber.length !== 12 || !cleanNumber.startsWith('994')) {
        showFieldError(formGroup, 'Düzgün M10 nömrəsi daxil edin (+994XXXXXXXXX)');
        return false;
    } else {
        clearFieldError(formGroup);
        return true;
    }
}

// Validate amount
function validateAmount() {
    const amount = parseInt(amountInput.value);
    const formGroup = amountInput.closest('.form-group');
    
    if (!amountInput.value) {
        showFieldError(formGroup, 'Məbləği daxil edin');
        return false;
    } else if (amount < minWithdrawAmount) {
        showFieldError(formGroup, `Minimum çıxarış ${minWithdrawAmount} ADSCOİN-dir`);
        return false;
    } else if (amount > currentBalance) {
        showFieldError(formGroup, 'Balansınızda kifayət qədər ADSCOİN yoxdur');
        return false;
    } else {
        clearFieldError(formGroup);
        return true;
    }
}

// Show field error
function showFieldError(formGroup, message) {
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    formGroup.appendChild(errorMessage);
}

// Clear field error
function clearFieldError(formGroup) {
    formGroup.classList.remove('error');
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Format phone number input
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.startsWith('994')) {
        value = value.substring(3);
    }
    
    if (value.length > 0) {
        if (value.length <= 2) {
            value = `+994 (${value}`;
        } else if (value.length <= 5) {
            value = `+994 (${value.substring(0, 2)}) ${value.substring(2)}`;
        } else if (value.length <= 9) {
            value = `+994 (${value.substring(0, 2)}) ${value.substring(2, 5)} ${value.substring(5)}`;
        } else {
            value = `+994 (${value.substring(0, 2)}) ${value.substring(2, 5)} ${value.substring(5, 9)}`;
        }
    } else {
        value = '+994 (';
    }
    
    e.target.value = value;
}

// Update amount info
function updateAmountInfo() {
    const amount = parseInt(amountInput.value) || 0;
    const aznAmount = (amount * 0.001).toFixed(2);
    
    // Update amount info if needed
    const amountInfo = document.querySelector('.amount-info');
    if (amountInfo) {
        const aznDisplay = amountInfo.querySelector('.azn-amount');
        if (aznDisplay) {
            aznDisplay.textContent = `(${aznAmount} AZN)`;
        }
    }
}

// Handle withdraw form submission
function handleWithdraw(e) {
    e.preventDefault();
    
    // Validate all fields
    const isPlatformValid = validatePlatform();
    const isPhoneValid = validatePhoneNumber();
    const isAmountValid = validateAmount();
    
    if (!isPlatformValid || !isPhoneValid || !isAmountValid) {
        showMessage('Zəhmət olmasa bütün sahələri düzgün doldurun', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        platform: platformSelect.value,
        phoneNumber: m10NumberInput.value,
        amount: parseInt(amountInput.value)
    };
    
    // Process withdrawal
    processWithdrawal(formData);
}

// Process withdrawal
function processWithdrawal(data) {
    // Show loading state
    withdrawBtn.disabled = true;
    withdrawBtn.classList.add('loading');
    withdrawBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İŞLƏNİR...';
    
    // Simulate processing delay
    setTimeout(() => {
        // Check if user has enough balance
        if (data.amount > currentBalance) {
            showMessage('Balansınızda kifayət qədər ADSCOİN yoxdur!', 'error');
            resetWithdrawButton();
            return;
        }
        
        // Process withdrawal
        if (processWithdrawalRequest(data)) {
            // Success
            showMessage('SİZİN ÇIXARIŞINIZ 24 SAAT ƏRZİNDƏ TƏSDİQLƏNƏCƏK', 'success');
            
            // Update balance
            updateUserBalance(data.amount);
            
            // Reset form
            resetForm();
        } else {
            // Error
            showMessage('Çıxarış zamanı xəta baş verdi. Yenidən cəhd edin.', 'error');
        }
        
        resetWithdrawButton();
    }, 2000);
}

// Process withdrawal request
function processWithdrawalRequest(data) {
    // Simulate API call
    // In real implementation, this would send data to PHP backend
    
    // Store withdrawal request
    const withdrawalData = {
        id: Date.now(),
        platform: data.platform,
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        aznAmount: data.amount * 0.001,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Save to localStorage
    const withdrawals = JSON.parse(localStorage.getItem('adsmanat_withdrawals') || '[]');
    withdrawals.push(withdrawalData);
    localStorage.setItem('adsmanat_withdrawals', JSON.stringify(withdrawals));
    
    return true; // Simulate success
}

// Update user balance
function updateUserBalance(amount) {
    if (window.ADSMANAT) {
        // Remove ADSCOİN from balance
        const currentBalance = window.ADSMANAT.getBalance();
        const newAdscoinBalance = currentBalance.adscoin - amount;
        const newAznBalance = newAdscoinBalance * 0.001;
        
        window.ADSMANAT.updateBalance(currentBalance.bilet, newAdscoinBalance, newAznBalance);
    } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem('adsmanat_user_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            data.adscoinBalance = Math.max(0, data.adscoinBalance - amount);
            data.aznBalance = data.adscoinBalance * 0.001;
            localStorage.setItem('adsmanat_user_data', JSON.stringify(data));
        }
    }
    
    // Update display
    loadBalanceData();
}

// Reset form
function resetForm() {
    withdrawForm.reset();
    m10NumberInput.value = '+994 (';
    
    // Clear all errors
    document.querySelectorAll('.form-group').forEach(group => {
        clearFieldError(group);
    });
}

// Reset withdraw button
function resetWithdrawButton() {
    withdrawBtn.disabled = false;
    withdrawBtn.classList.remove('loading');
    withdrawBtn.innerHTML = '<i class="fas fa-money-bill-wave"></i> ÇIXARIŞ ET';
}

// Show message
function showMessage(text, type = 'success') {
    messageText.textContent = text;
    withdrawMessage.className = `withdraw-message ${type} show`;
    
    // Update icon based on type
    const icon = withdrawMessage.querySelector('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    
    setTimeout(() => {
        withdrawMessage.classList.remove('show');
    }, 5000);
}

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
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        if (withdrawForm.checkValidity()) {
            handleWithdraw(e);
        }
    }
});

// Add input formatting for amount
amountInput.addEventListener('input', function(e) {
    // Remove non-numeric characters
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
    // Update amount info
    updateAmountInfo();
});

// Add amount suggestions
function addAmountSuggestions() {
    const suggestions = [3000, 5000, 10000, 20000, 50000];
    
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'amount-suggestions';
    suggestionsContainer.innerHTML = '<div class="suggestions-label">Tez seçim:</div>';
    
    suggestions.forEach(amount => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'suggestion-btn';
        button.textContent = `${amount.toLocaleString()} ADSCOİN`;
        button.addEventListener('click', () => {
            amountInput.value = amount;
            updateAmountInfo();
            validateAmount();
        });
        suggestionsContainer.appendChild(button);
    });
    
    const amountGroup = amountInput.closest('.form-group');
    amountGroup.appendChild(suggestionsContainer);
}

// Add suggestions styles
const suggestionsStyle = document.createElement('style');
suggestionsStyle.textContent = `
    .amount-suggestions {
        margin-top: 10px;
    }
    
    .suggestions-label {
        color: #cccccc;
        font-size: 12px;
        margin-bottom: 8px;
    }
    
    .suggestion-btn {
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid #00ffff;
        border-radius: 15px;
        padding: 5px 10px;
        margin: 2px;
        color: #00ffff;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .suggestion-btn:hover {
        background: rgba(0, 255, 255, 0.2);
        transform: translateY(-1px);
    }
`;
document.head.appendChild(suggestionsStyle);

// Initialize amount suggestions
document.addEventListener('DOMContentLoaded', function() {
    addAmountSuggestions();
});

// Add withdrawal history display
function addWithdrawalHistory() {
    const withdrawals = JSON.parse(localStorage.getItem('adsmanat_withdrawals') || '[]');
    
    if (withdrawals.length > 0) {
        const historyContainer = document.createElement('div');
        historyContainer.className = 'withdrawal-history';
        historyContainer.innerHTML = `
            <h4>Çıxarış Tarixçəsi</h4>
            <div class="history-list">
                ${withdrawals.slice(-5).reverse().map(withdrawal => `
                    <div class="history-item">
                        <div class="history-info">
                            <span class="history-amount">${withdrawal.amount.toLocaleString()} ADSCOİN</span>
                            <span class="history-date">${new Date(withdrawal.date).toLocaleDateString('az-AZ')}</span>
                        </div>
                        <div class="history-status ${withdrawal.status}">${withdrawal.status}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
        const withdrawCard = document.querySelector('.withdraw-card');
        withdrawCard.appendChild(historyContainer);
    }
}

// Add history styles
const historyStyle = document.createElement('style');
historyStyle.textContent = `
    .withdrawal-history {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid #333;
    }
    
    .withdrawal-history h4 {
        color: #00ffff;
        font-size: 16px;
        margin-bottom: 15px;
        text-align: center;
    }
    
    .history-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .history-item {
        background: rgba(0, 255, 255, 0.05);
        border: 1px solid rgba(0, 255, 255, 0.2);
        border-radius: 8px;
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .history-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    
    .history-amount {
        color: #ffffff;
        font-weight: bold;
        font-size: 14px;
    }
    
    .history-date {
        color: #cccccc;
        font-size: 12px;
    }
    
    .history-status {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
    }
    
    .history-status.pending {
        background: rgba(255, 165, 0, 0.2);
        color: #ffa500;
        border: 1px solid #ffa500;
    }
    
    .history-status.completed {
        background: rgba(0, 255, 0, 0.2);
        color: #00ff00;
        border: 1px solid #00ff00;
    }
`;
document.head.appendChild(historyStyle);

// Initialize withdrawal history
document.addEventListener('DOMContentLoaded', function() {
    addWithdrawalHistory();
});