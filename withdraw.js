// Withdraw Page JavaScript

// DOM Elements
const withdrawalForm = document.getElementById('withdrawalForm');
const platformSelect = document.getElementById('platformSelect');
const m10Number = document.getElementById('m10Number');
const withdrawAmount = document.getElementById('withdrawAmount');
const amountInAzn = document.getElementById('amountInAzn');
const submitBtn = document.getElementById('submitBtn');
const withdrawalMessage = document.getElementById('withdrawalMessage');
const currentAdscoin = document.getElementById('currentAdscoin');
const currentAzn = document.getElementById('currentAzn');

// Global variables
let userBalance = {
    tickets: 0,
    adscoin: 0,
    azn: 0.000
};

const minWithdrawal = 3000; // Minimum withdrawal in ADSCoin
const conversionRate = 0.001; // 1 ADSCoin = 0.001 AZN

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadUserBalance();
    setupWithdrawEventListeners();
    setupFormValidation();
});

// Setup event listeners
function setupWithdrawEventListeners() {
    withdrawalForm.addEventListener('submit', handleWithdrawal);
    withdrawAmount.addEventListener('input', updateAznAmount);
    m10Number.addEventListener('input', formatPhoneNumber);
    platformSelect.addEventListener('change', handlePlatformChange);
}

// Load user balance
async function loadUserBalance() {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) {
            // Use default values for testing
            updateBalanceDisplay();
            return;
        }
        
        const response = await fetch(`api/get_user_data.php?telegram_id=${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            userBalance = result.balance;
            updateBalanceDisplay();
        }
    } catch (error) {
        console.error('Error loading user balance:', error);
        // Use default values if API fails
        updateBalanceDisplay();
    }
}

// Update balance display
function updateBalanceDisplay() {
    currentAdscoin.textContent = userBalance.adscoin;
    currentAzn.textContent = userBalance.azn.toFixed(3);
}

// Update AZN amount based on ADSCoin input
function updateAznAmount() {
    const amount = parseInt(withdrawAmount.value) || 0;
    const aznValue = (amount * conversionRate).toFixed(3);
    amountInAzn.textContent = `= ${aznValue} AZN`;
}

// Format phone number input
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Remove country code if user types it
    if (value.startsWith('994')) {
        value = value.substring(3);
    }
    
    // Limit to 9 digits
    value = value.substring(0, 9);
    
    // Format as +994 (XX) XXXXXXX
    if (value.length > 0) {
        if (value.length <= 2) {
            value = `+994 (${value}`;
        } else if (value.length <= 9) {
            value = `+994 (${value.substring(0, 2)}) ${value.substring(2)}`;
        }
    } else {
        value = '';
    }
    
    e.target.value = value;
}

// Handle platform change
function handlePlatformChange() {
    const platform = platformSelect.value;
    if (platform === 'm10') {
        m10Number.disabled = false;
        m10Number.required = true;
    } else {
        m10Number.disabled = true;
        m10Number.required = false;
        m10Number.value = '';
    }
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation
    withdrawAmount.addEventListener('blur', validateAmount);
    m10Number.addEventListener('blur', validatePhoneNumber);
    platformSelect.addEventListener('change', validatePlatform);
}

// Validate withdrawal amount
function validateAmount() {
    const amount = parseInt(withdrawAmount.value) || 0;
    
    clearFieldError(withdrawAmount);
    
    if (amount < minWithdrawal) {
        showFieldError(withdrawAmount, `Minimum çıxarış ${minWithdrawal} ADSCOİN olmalıdır`);
        return false;
    }
    
    if (amount > userBalance.adscoin) {
        showFieldError(withdrawAmount, 'Balansınızda kifayət qədər ADSCOİN yoxdur');
        return false;
    }
    
    showFieldSuccess(withdrawAmount);
    return true;
}

// Validate phone number
function validatePhoneNumber() {
    const phone = m10Number.value.replace(/\D/g, '');
    
    clearFieldError(m10Number);
    
    if (platformSelect.value === 'm10') {
        if (phone.length !== 12 || !phone.startsWith('994')) {
            showFieldError(m10Number, 'Düzgün M10 nömrəsi daxil edin');
            return false;
        }
        
        // Check if it's a valid Azerbaijani mobile number
        const mobilePrefix = phone.substring(3, 5);
        const validPrefixes = ['50', '51', '55', '70', '77', '99'];
        
        if (!validPrefixes.includes(mobilePrefix)) {
            showFieldError(m10Number, 'Düzgün mobil nömrə daxil edin');
            return false;
        }
    }
    
    showFieldSuccess(m10Number);
    return true;
}

// Validate platform selection
function validatePlatform() {
    clearFieldError(platformSelect);
    
    if (!platformSelect.value) {
        showFieldError(platformSelect, 'Platforma seçin');
        return false;
    }
    
    showFieldSuccess(platformSelect);
    return true;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    field.classList.remove('success');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-text';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

// Show field success
function showFieldSuccess(field) {
    field.classList.add('success');
    field.classList.remove('error');
    
    // Remove error message
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error', 'success');
    
    const existingError = field.parentNode.querySelector('.error-text');
    if (existingError) {
        existingError.remove();
    }
}

// Handle withdrawal form submission
async function handleWithdrawal(e) {
    e.preventDefault();
    
    // Validate all fields
    const isValidPlatform = validatePlatform();
    const isValidPhone = validatePhoneNumber();
    const isValidAmount = validateAmount();
    
    if (!isValidPlatform || !isValidPhone || !isValidAmount) {
        showWithdrawalMessage('Xahiş olunur bütün sahələri düzgün doldurun', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'GÖNDƏRİLİR...';
    
    try {
        const withdrawalData = {
            platform: platformSelect.value,
            m10_number: m10Number.value,
            amount: parseInt(withdrawAmount.value),
            amount_azn: (parseInt(withdrawAmount.value) * conversionRate).toFixed(3)
        };
        
        const success = await submitWithdrawal(withdrawalData);
        
        if (success) {
            // Update balance
            userBalance.adscoin -= withdrawalData.amount;
            userBalance.azn = userBalance.adscoin * conversionRate;
            updateBalanceDisplay();
            
            // Show success message
            showWithdrawalMessage('SİZİN ÇIXARIŞINIZ 24 SAAT ƏRZİNDƏ TƏSDİQLƏNƏCƏK', 'success');
            
            // Reset form
            withdrawalForm.reset();
            clearAllFieldErrors();
            updateAznAmount();
        } else {
            showWithdrawalMessage('Çıxarış zamanı xəta baş verdi. Yenidən cəhd edin.', 'error');
        }
    } catch (error) {
        console.error('Withdrawal error:', error);
        showWithdrawalMessage('Çıxarış zamanı xəta baş verdi. Yenidən cəhd edin.', 'error');
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
    }
}

// Submit withdrawal to backend
async function submitWithdrawal(withdrawalData) {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) {
            // For testing without Telegram
            console.log('Withdrawal data:', withdrawalData);
            return true;
        }
        
        const response = await fetch('api/submit_withdrawal.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegram_id: user.id,
                ...withdrawalData
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error submitting withdrawal:', error);
        return false;
    }
}

// Show withdrawal message
function showWithdrawalMessage(text, type) {
    withdrawalMessage.className = `withdrawal-message ${type}`;
    withdrawalMessage.querySelector('.message-text').textContent = text;
    withdrawalMessage.querySelector('.message-icon').textContent = type === 'success' ? '✅' : '❌';
    
    withdrawalMessage.classList.add('show');
    
    setTimeout(() => {
        withdrawalMessage.classList.remove('show');
    }, 5000);
}

// Clear all field errors
function clearAllFieldErrors() {
    const fields = [platformSelect, m10Number, withdrawAmount];
    fields.forEach(field => {
        clearFieldError(field);
    });
}

// Initialize platform change handler
handlePlatformChange();