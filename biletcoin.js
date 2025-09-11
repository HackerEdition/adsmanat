// Bilet-Coin Page Specific JavaScript

// Wheel configuration
const wheelSegments = [
    { value: 1, probability: 40 },  // 40% chance for 1 ADSCoin
    { value: 2, probability: 25 },  // 25% chance for 2 ADSCoin
    { value: 3, probability: 15 },  // 15% chance for 3 ADSCoin
    { value: 4, probability: 10 },  // 10% chance for 4 ADSCoin
    { value: 5, probability: 5 },   // 5% chance for 5 ADSCoin
    { value: 0, probability: 5 }    // 5% chance for 0 ADSCoin
];

// DOM Elements
const spinBtn = document.getElementById('spinBtn');
const wheel = document.getElementById('wheel');
const winMessage = document.getElementById('winMessage');
const winText = document.getElementById('winText');

// Global variables
let isSpinning = false;
let userBalance = {
    tickets: 0,
    adscoin: 0,
    azn: 0.000
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadUserBalance();
    setupBiletCoinEventListeners();
});

// Setup event listeners
function setupBiletCoinEventListeners() {
    spinBtn.addEventListener('click', spinWheel);
}

// Load user balance
async function loadUserBalance() {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        const response = await fetch(`api/get_user_data.php?telegram_id=${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            userBalance = result.balance;
            updateBalanceDisplay();
            
            // Check if user has tickets
            if (userBalance.tickets === 0) {
                spinBtn.disabled = true;
                spinBtn.textContent = 'BİLETİNİZ YOX';
            }
        }
    } catch (error) {
        console.error('Error loading user balance:', error);
        // Use default values if API fails
        updateBalanceDisplay();
    }
}

// Update balance display
function updateBalanceDisplay() {
    document.getElementById('ticketBalance').textContent = userBalance.tickets;
    document.getElementById('adscoinBalance').textContent = userBalance.adscoin;
    document.getElementById('aznBalance').textContent = userBalance.azn.toFixed(3);
}

// Spin wheel function
function spinWheel() {
    if (isSpinning || userBalance.tickets === 0) {
        return;
    }
    
    // Decrease ticket count
    userBalance.tickets -= 1;
    updateBalanceDisplay();
    
    // Disable button and start spinning
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.classList.add('spinning');
    spinBtn.textContent = 'ÇEVRİLİR...';
    
    // Calculate result based on probability
    const result = getWheelResult();
    
    // Calculate rotation
    const segmentAngle = 45; // 360/8 segments
    const baseRotation = 1800; // 5 full rotations
    const resultIndex = getSegmentIndex(result);
    const targetAngle = (resultIndex * segmentAngle) + (segmentAngle / 2);
    const finalRotation = baseRotation + (360 - targetAngle);
    
    // Apply rotation
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    
    // Handle result after animation
    setTimeout(() => {
        handleSpinResult(result);
    }, 4000);
}

// Get wheel result based on probability
function getWheelResult() {
    const random = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const segment of wheelSegments) {
        cumulativeProbability += segment.probability;
        if (random <= cumulativeProbability) {
            return segment.value;
        }
    }
    
    return 1; // Fallback
}

// Get segment index for rotation calculation
function getSegmentIndex(value) {
    const segmentMap = {
        1: 0,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        0: 5,
        // Duplicate segments for visual variety
        1: 6,
        2: 7
    };
    
    // Find first occurrence of the value
    for (let i = 0; i < 8; i++) {
        const segmentValue = parseInt(document.querySelector(`.wheel-segment:nth-child(${i + 1})`).dataset.value);
        if (segmentValue === value) {
            return i;
        }
    }
    
    return 0; // Fallback
}

// Handle spin result
function handleSpinResult(result) {
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.classList.remove('spinning');
    
    // Update balance
    userBalance.adscoin += result;
    userBalance.azn = userBalance.adscoin * 0.001;
    
    // Update display
    updateBalanceDisplay();
    
    // Show result message
    if (result > 0) {
        winText.textContent = `Siz ${result} ADSCOİN qazandınız!`;
        winMessage.classList.remove('lose');
        winMessage.classList.add('show');
    } else {
        winText.textContent = 'Təəssüf ki, bu dəfə qazana bilmədiniz!';
        winMessage.classList.add('lose');
        winMessage.classList.add('show');
    }
    
    // Hide message after 3 seconds
    setTimeout(() => {
        winMessage.classList.remove('show');
        winMessage.classList.remove('lose');
    }, 3000);
    
    // Update button text
    if (userBalance.tickets > 0) {
        spinBtn.textContent = 'ÇEVİR';
    } else {
        spinBtn.textContent = 'BİLETİNİZ YOX';
        spinBtn.disabled = true;
    }
    
    // Save to backend
    updateUserBalanceAPI();
}

// Update user balance via API
async function updateUserBalanceAPI() {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        const response = await fetch('api/update_balance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegram_id: user.id,
                tickets: userBalance.tickets,
                adscoin: userBalance.adscoin,
                azn: userBalance.azn
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('Balance updated successfully');
        }
    } catch (error) {
        console.error('Error updating balance:', error);
    }
}

// Add visual effects to wheel segments
function addWheelEffects() {
    const segments = document.querySelectorAll('.wheel-segment');
    segments.forEach((segment, index) => {
        segment.addEventListener('mouseenter', function() {
            if (!isSpinning) {
                this.style.transform += ' scale(1.1)';
                this.style.zIndex = '5';
            }
        });
        
        segment.addEventListener('mouseleave', function() {
            if (!isSpinning) {
                this.style.transform = this.style.transform.replace(' scale(1.1)', '');
                this.style.zIndex = '1';
            }
        });
    });
}

// Initialize wheel effects
setTimeout(addWheelEffects, 100);