// Biletcoin page functionality
let isSpinning = false;
let currentRotation = 0;

// DOM elements
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const resultMessage = document.getElementById('resultMessage');
const resultText = document.getElementById('resultText');
const biletBalanceDisplay = document.getElementById('biletBalance');
const adscoinBalanceDisplay = document.getElementById('adscoinBalance');
const aznBalanceDisplay = document.getElementById('aznBalance');

// Initialize biletcoin page
document.addEventListener('DOMContentLoaded', function() {
    loadBalanceData();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    spinBtn.addEventListener('click', spinWheel);
}

// Load balance data
function loadBalanceData() {
    const savedData = localStorage.getItem('adsmanat_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        biletBalanceDisplay.textContent = data.biletBalance || 0;
        adscoinBalanceDisplay.textContent = data.adscoinBalance || 0;
        aznBalanceDisplay.textContent = (data.aznBalance || 0).toFixed(2);
    }
}

// Spin wheel function
function spinWheel() {
    if (isSpinning) return;
    
    // Check if user has bilet
    const biletBalance = parseInt(biletBalanceDisplay.textContent);
    if (biletBalance < 1) {
        showResultMessage('Kifayət qədər bilet yoxdur!', true);
        return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.classList.add('spinning');
    spinBtn.innerHTML = '<i class="fas fa-sync-alt"></i> ÇEVİRİLİR...';
    
    // Calculate random result with weighted probabilities
    const result = getWeightedResult();
    
    // Calculate rotation
    const segmentAngle = 60; // 360 / 6 segments
    const targetAngle = result * segmentAngle;
    const spinAngle = 360 * 5 + targetAngle; // 5 full rotations + target
    const finalRotation = currentRotation + spinAngle;
    
    // Apply rotation
    wheel.style.transform = `rotate(${finalRotation}deg)`;
    currentRotation = finalRotation % 360;
    
    // Update balance after spin
    setTimeout(() => {
        updateBalance(result);
        showResultMessage(result);
        resetSpinButton();
    }, 3000);
}

// Get weighted result (1 ADSCOİN most likely, 5 ADSCOİN least likely)
function getWeightedResult() {
    const random = Math.random();
    
    if (random < 0.4) return 1;      // 40% chance
    if (random < 0.65) return 2;     // 25% chance
    if (random < 0.8) return 3;      // 15% chance
    if (random < 0.9) return 4;      // 10% chance
    if (random < 0.95) return 5;     // 5% chance
    return 0;                        // 5% chance
}

// Update balance after spin
function updateBalance(result) {
    // Deduct 1 bilet
    const currentBilet = parseInt(biletBalanceDisplay.textContent);
    const newBilet = Math.max(0, currentBilet - 1);
    biletBalanceDisplay.textContent = newBilet;
    
    // Add ADSCOİN
    const currentAdscoin = parseInt(adscoinBalanceDisplay.textContent);
    const newAdscoin = currentAdscoin + result;
    adscoinBalanceDisplay.textContent = newAdscoin;
    
    // Update AZN (1 ADSCOİN = 0.001 AZN)
    const currentAzn = parseFloat(aznBalanceDisplay.textContent);
    const newAzn = currentAzn + (result * 0.001);
    aznBalanceDisplay.textContent = newAzn.toFixed(2);
    
    // Save to localStorage
    saveBalanceData(newBilet, newAdscoin, newAzn);
}

// Save balance data
function saveBalanceData(bilet, adscoin, azn) {
    const data = {
        biletBalance: bilet,
        adscoinBalance: adscoin,
        aznBalance: azn,
        adCount: JSON.parse(localStorage.getItem('adsmanat_data') || '{}').adCount || 0
    };
    localStorage.setItem('adsmanat_data', JSON.stringify(data));
}

// Show result message
function showResultMessage(result, isError = false) {
    if (isError) {
        resultText.textContent = result;
        resultMessage.className = 'result-message error show';
    } else {
        if (result === 0) {
            resultText.textContent = 'Təəssüf ki, heç nə qazana bilmədiniz!';
            resultMessage.className = 'result-message error show';
        } else {
            resultText.textContent = `Siz ${result} ADSCOİN QAZANDINIZ!`;
            resultMessage.className = 'result-message show';
        }
    }
    
    setTimeout(() => {
        resultMessage.classList.remove('show');
    }, 3000);
}

// Reset spin button
function resetSpinButton() {
    isSpinning = false;
    spinBtn.disabled = false;
    spinBtn.classList.remove('spinning');
    spinBtn.innerHTML = '<i class="fas fa-sync-alt"></i> ÇEVİR';
    
    // Check if user can still spin
    const biletBalance = parseInt(biletBalanceDisplay.textContent);
    if (biletBalance < 1) {
        spinBtn.disabled = true;
        spinBtn.innerHTML = '<i class="fas fa-times"></i> BİLET YOXDUR';
    }
}

// Add click effect to spin button
spinBtn.addEventListener('click', function() {
    this.classList.add('btn-click');
    setTimeout(() => {
        this.classList.remove('btn-click');
    }, 300);
});

// Add wheel animation on hover
wheel.addEventListener('mouseenter', function() {
    if (!isSpinning) {
        this.style.transform = `rotate(${currentRotation}deg) scale(1.05)`;
    }
});

wheel.addEventListener('mouseleave', function() {
    if (!isSpinning) {
        this.style.transform = `rotate(${currentRotation}deg) scale(1)`;
    }
});

// Add sound effects (optional)
function playSpinSound() {
    // You can add sound effects here
    // const audio = new Audio('spin-sound.mp3');
    // audio.play();
}

function playWinSound() {
    // You can add sound effects here
    // const audio = new Audio('win-sound.mp3');
    // audio.play();
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isSpinning && !spinBtn.disabled) {
            spinWheel();
        }
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

wheel.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

wheel.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - spin wheel
            if (!isSpinning && !spinBtn.disabled) {
                spinWheel();
            }
        }
    }
}

// Add confetti effect for big wins (5 ADSCOİN)
function showConfetti() {
    // Simple confetti effect
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
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${['#ff00ff', '#00ffff', '#ffff00', '#ff0000'][Math.floor(Math.random() * 4)]};
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

// Add confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Enhanced result message for big wins
function showEnhancedResult(result) {
    if (result === 5) {
        showConfetti();
        playWinSound();
    }
    showResultMessage(result);
}