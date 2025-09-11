// Biletcoin Page JavaScript

// DOM elements
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultMessage = document.getElementById('resultMessage');
const resultText = document.getElementById('resultText');

// Balance displays
const biletBalanceDisplay = document.getElementById('biletBalance');
const adscoinBalanceDisplay = document.getElementById('adscoinBalance');
const aznBalanceDisplay = document.getElementById('aznBalance');

// Wheel configuration
const wheelSegments = [
    { value: 1, probability: 0.35 }, // 35% chance
    { value: 2, probability: 0.25 }, // 25% chance
    { value: 3, probability: 0.20 }, // 20% chance
    { value: 4, probability: 0.15 }, // 15% chance
    { value: 5, probability: 0.04 }, // 4% chance
    { value: 0, probability: 0.01 }  // 1% chance
];

let isSpinning = false;
let currentRotation = 0;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBalanceData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    spinBtn.addEventListener('click', spinWheel);
    
    // Add click effects
    spinBtn.addEventListener('click', function() {
        this.classList.add('btn-click');
        setTimeout(() => {
            this.classList.remove('btn-click');
        }, 200);
    });
}

// Load balance data from main app
function loadBalanceData() {
    if (window.ADSMANAT) {
        const balance = window.ADSMANAT.getBalance();
        updateBalanceDisplay(balance.bilet, balance.adscoin, balance.azn);
    } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem('adsmanat_user_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            updateBalanceDisplay(data.biletBalance || 0, data.adscoinBalance || 0, data.aznBalance || 0);
        }
    }
}

// Update balance display
function updateBalanceDisplay(bilet, adscoin, azn) {
    biletBalanceDisplay.textContent = bilet;
    adscoinBalanceDisplay.textContent = adscoin;
    aznBalanceDisplay.textContent = azn.toFixed(2);
}

// Spin wheel function
function spinWheel() {
    if (isSpinning) return;
    
    // Check if user has bilet
    const currentBilet = parseInt(biletBalanceDisplay.textContent);
    if (currentBilet < 1) {
        showResultMessage('Biletiniz yoxdur!', true);
        return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Çevirilir...';
    
    // Select random result based on probabilities
    const result = selectRandomResult();
    
    // Calculate rotation
    const segmentAngle = 60; // 360 / 6 segments
    const resultIndex = wheelSegments.findIndex(seg => seg.value === result);
    const targetAngle = resultIndex * segmentAngle;
    
    // Add multiple full rotations for spinning effect
    const fullRotations = 5 + Math.random() * 3; // 5-8 full rotations
    const finalRotation = currentRotation + (fullRotations * 360) + targetAngle;
    
    // Apply rotation
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    currentRotation = finalRotation % 360;
    
    // Wait for animation to complete
    setTimeout(() => {
        completeSpin(result);
    }, 3000);
}

// Select random result based on probabilities
function selectRandomResult() {
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const segment of wheelSegments) {
        cumulativeProbability += segment.probability;
        if (random <= cumulativeProbability) {
            return segment.value;
        }
    }
    
    return wheelSegments[0].value; // Fallback
}

// Complete spin and process result
function completeSpin(result) {
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.innerHTML = '<i class="fas fa-sync-alt"></i> ÇEVİR';
    
    if (result === 0) {
        // No reward
        showResultMessage('Təəssüf! Bu dəfə uduş yoxdur!', true);
    } else {
        // Add reward
        if (window.ADSMANAT) {
            // Remove 1 bilet
            if (window.ADSMANAT.removeBilet(1)) {
                // Add ADSCOİN
                window.ADSMANAT.addAdscoin(result);
                showResultMessage(`Təbriklər! Siz ${result} ADSCOİN QAZANDINIZ!`, false);
            }
        } else {
            // Fallback to localStorage
            updateLocalStorage(result);
            showResultMessage(`Təbriklər! Siz ${result} ADSCOİN QAZANDINIZ!`, false);
        }
        
        // Reload balance data
        loadBalanceData();
    }
}

// Update localStorage (fallback)
function updateLocalStorage(adscoinReward) {
    const savedData = localStorage.getItem('adsmanat_user_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        data.biletBalance = Math.max(0, data.biletBalance - 1);
        data.adscoinBalance = (data.adscoinBalance || 0) + adscoinReward;
        data.aznBalance = data.adscoinBalance * 0.001;
        localStorage.setItem('adsmanat_user_data', JSON.stringify(data));
    }
}

// Show result message
function showResultMessage(message, isError = false) {
    resultText.textContent = message;
    resultMessage.className = `result-message show ${isError ? 'error' : ''}`;
    
    setTimeout(() => {
        resultMessage.classList.remove('show');
    }, 3000);
}

// Add wheel hover effects
wheel.addEventListener('mouseenter', function() {
    if (!isSpinning) {
        this.style.transform = `rotate(${currentRotation}deg) scale(1.05)`;
        this.style.transition = 'transform 0.3s ease';
    }
});

wheel.addEventListener('mouseleave', function() {
    if (!isSpinning) {
        this.style.transform = `rotate(${currentRotation}deg) scale(1)`;
    }
});

// Add sound effects (if supported)
function playSpinSound() {
    // Create audio context for sound effects
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Add haptic feedback for mobile
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Add haptic feedback to spin button
spinBtn.addEventListener('click', addHapticFeedback);

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isSpinning) {
            spinWheel();
        }
    }
});

// Add touch gestures
let touchStartY = 0;
let touchEndY = 0;

wheel.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

wheel.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleWheelTouch();
});

function handleWheelTouch() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold && !isSpinning) {
        if (diff > 0) {
            // Swipe up - spin wheel
            spinWheel();
        }
    }
}

// Add visual feedback for wheel segments
document.querySelectorAll('.wheel-segment').forEach((segment, index) => {
    segment.addEventListener('mouseenter', function() {
        if (!isSpinning) {
            this.style.filter = 'brightness(1.2)';
            this.style.transform = 'scale(1.1)';
        }
    });
    
    segment.addEventListener('mouseleave', function() {
        if (!isSpinning) {
            this.style.filter = 'brightness(1)';
            this.style.transform = 'scale(1)';
        }
    });
});

// Add confetti effect for big wins
function showConfetti() {
    // Simple confetti effect using CSS animations
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
    
    for (let i = 0; i < 50; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        confetti.appendChild(piece);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, 5000);
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

// Show confetti for big wins (5 ADSCOİN)
function checkForBigWin(result) {
    if (result === 5) {
        showConfetti();
    }
}

// Update the completeSpin function to include confetti
const originalCompleteSpin = completeSpin;
completeSpin = function(result) {
    originalCompleteSpin(result);
    if (result === 5) {
        showConfetti();
    }
};