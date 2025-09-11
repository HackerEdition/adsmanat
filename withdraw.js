// Withdraw page functionality
const withdrawForm = document.getElementById('withdrawForm');
const platformSelect = document.getElementById('platform');
const m10NumberInput = document.getElementById('m10Number');
const amountInput = document.getElementById('amount');
const withdrawBtn = document.getElementById('withdrawBtn');
const currentBalanceDisplay = document.getElementById('currentBalance');
const aznEquivalentDisplay = document.getElementById('aznEquivalent');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Initialize withdraw page
document.addEventListener('DOMContentLoaded', function() {
    loadBalanceData();
    setupEventListeners();
    setupFormValidation();
});

// Setup event listeners
function setupEventListeners() {
    withdrawForm.addEventListener('submit', handleWithdraw);
    amountInput.addEventListener('input', updateAmountDisplay);
    m10NumberInput.addEventListener('input', formatPhoneNumber);
    
    // Add click effects
    withdrawBtn.addEventListener('click', function() {
        this.classList.add('btn-click');
        setTimeout(() => {
            this.classList.remove('btn-click');
        }, 300);
    });
}

// Load balance data
function loadBalanceData() {
    const savedData = localStorage.getItem('adsmanat_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        const adscoinBalance = data.adscoinBalance || 0;
        const aznBalance = data.aznBalance || 0;
        
        currentBalanceDisplay.textContent = `${adscoinBalance} ADSCOİN`;
        aznEquivalentDisplay.textContent = `${aznBalance.toFixed(2)} AZN`;
        
        // Set max amount
        amountInput.max = adscoinBalance;
    }
}

// Setup form validation
function setupFormValidation() {
    // Real-time validation
    amountInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        const minAmount = 3000;
        
        if (value < minAmount) {
            this.setCustomValidity(`Minimum ${minAmount} ADSCOİN olmalıdır`);
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Phone number validation
    m10NumberInput.addEventListener('input', function() {
        const value = this.value.replace(/\D/g, '');
        if (value.length > 0 && !value.startsWith('994')) {
            this.setCustomValidity('Nömrə +994 ilə başlamalıdır');
        } else {
            this.setCustomValidity('');
        }
    });
}

// Format phone number
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.startsWith('994')) {
            value = '+994 ' + value.substring(3);
        } else if (value.startsWith('0')) {
            value = '+994 ' + value.substring(1);
        } else {
            value = '+994 ' + value;
        }
        
        // Format as +994 (XX) XXX XXXX
        if (value.length > 6) {
            value = value.replace(/(\+994 \d{2})(\d{3})(\d{3})/, '$1 $2 $3');
        }
    }
    
    e.target.value = value;
}

// Update amount display
function updateAmountDisplay() {
    const amount = parseInt(amountInput.value) || 0;
    const aznAmount = (amount * 0.001).toFixed(2);
    
    // Update AZN equivalent in real-time
    if (amount > 0) {
        aznEquivalentDisplay.textContent = `${aznAmount} AZN`;
    }
}

// Handle withdraw form submission
async function handleWithdraw(e) {
    e.preventDefault();
    
    if (withdrawBtn.disabled) return;
    
    // Validate form
    if (!withdrawForm.checkValidity()) {
        showError('Zəhmət olmasa bütün sahələri düzgün doldurun');
        return;
    }
    
    const formData = new FormData(withdrawForm);
    const platform = formData.get('platform');
    const m10Number = formData.get('m10Number');
    const amount = parseInt(formData.get('amount'));
    
    // Additional validation
    if (amount < 3000) {
        showError('Minimum çıxarış 3000 ADSCOİN (3 AZN) olmalıdır');
        return;
    }
    
    // Check balance
    const savedData = localStorage.getItem('adsmanat_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        const currentBalance = data.adscoinBalance || 0;
        
        if (amount > currentBalance) {
            showError('Kifayət qədər balans yoxdur');
            return;
        }
    }
    
    // Process withdrawal
    await processWithdrawal(platform, m10Number, amount);
}

// Process withdrawal
async function processWithdrawal(platform, m10Number, amount) {
    // Show processing state
    withdrawBtn.disabled = true;
    withdrawBtn.classList.add('processing');
    withdrawBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> İŞLƏNİR...';
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update balance
        updateBalanceAfterWithdrawal(amount);
        
        // Show success message
        showSuccess();
        
        // Reset form
        withdrawForm.reset();
        loadBalanceData();
        
    } catch (error) {
        showError('Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin');
    } finally {
        // Reset button
        withdrawBtn.disabled = false;
        withdrawBtn.classList.remove('processing');
        withdrawBtn.innerHTML = '<i class="fas fa-money-bill-wave"></i> ÇIXARIŞ ET';
    }
}

// Update balance after withdrawal
function updateBalanceAfterWithdrawal(amount) {
    const savedData = localStorage.getItem('adsmanat_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        data.adscoinBalance = Math.max(0, (data.adscoinBalance || 0) - amount);
        data.aznBalance = Math.max(0, (data.aznBalance || 0) - (amount * 0.001));
        localStorage.setItem('adsmanat_data', JSON.stringify(data));
    }
}

// Show success message
function showSuccess() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !withdrawBtn.disabled) {
        withdrawForm.dispatchEvent(new Event('submit'));
    }
});

// Add input formatting
m10NumberInput.addEventListener('keypress', function(e) {
    // Allow only numbers and backspace
    if (!/\d/.test(e.key) && e.key !== 'Backspace') {
        e.preventDefault();
    }
});

amountInput.addEventListener('keypress', function(e) {
    // Allow only numbers and backspace
    if (!/\d/.test(e.key) && e.key !== 'Backspace') {
        e.preventDefault();
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

// Add form animation
document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add confetti effect for successful withdrawal
function showWithdrawConfetti() {
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
    
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${['#ff00ff', '#00ffff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confetti-fall 3s linear forwards;
        `;
        confetti.appendChild(particle);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Enhanced success function
function showSuccessEnhanced() {
    showSuccess();
    showWithdrawConfetti();
}

// Replace original success function
const originalShowSuccess = showSuccess;
showSuccess = showSuccessEnhanced;

// Add withdrawal history (optional)
function addToWithdrawalHistory(platform, m10Number, amount) {
    const history = JSON.parse(localStorage.getItem('withdrawal_history') || '[]');
    const withdrawal = {
        id: Date.now(),
        platform: platform,
        m10Number: m10Number,
        amount: amount,
        aznAmount: amount * 0.001,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    history.unshift(withdrawal);
    localStorage.setItem('withdrawal_history', JSON.stringify(history));
}

// Enhanced process withdrawal function
async function processWithdrawalEnhanced(platform, m10Number, amount) {
    // Add to history
    addToWithdrawalHistory(platform, m10Number, amount);
    
    // Process withdrawal
    await processWithdrawal(platform, m10Number, amount);
}

// Replace original function
const originalProcessWithdrawal = processWithdrawal;
processWithdrawal = processWithdrawalEnhanced;