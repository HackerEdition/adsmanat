// Global variables
let adCount = 0;
let biletBalance = 0;
let adscoinBalance = 0;
let aznBalance = 0.00;
let isWatchingAd = false;

// DOM elements
const menuToggle = document.getElementById('menuToggle');
const slideMenu = document.getElementById('slideMenu');
const closeMenu = document.getElementById('closeMenu');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

const watchAdBtn = document.getElementById('watchAdBtn');
const adProgress = document.getElementById('adProgress');
const adCountDisplay = document.getElementById('adCount');
const confirmationMessage = document.getElementById('confirmationMessage');

// Balance displays
const biletBalanceDisplay = document.getElementById('biletBalance');
const adscoinBalanceDisplay = document.getElementById('adscoinBalance');
const aznBalanceDisplay = document.getElementById('aznBalance');

// Profile elements
const profileAvatar = document.getElementById('profileAvatar');
const userName = document.getElementById('userName');
const userUsername = document.getElementById('userUsername');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
});

// Initialize app
function initializeApp() {
    // Set initial balance values
    updateBalanceDisplay();
    
    // Initialize Telegram WebApp if available
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Get user data from Telegram
        const user = tg.initDataUnsafe?.user;
        if (user) {
            userName.textContent = user.first_name || 'İstifadəçi';
            userUsername.textContent = '@' + (user.username || 'username');
            
            if (user.photo_url) {
                profileAvatar.innerHTML = `<img src="${user.photo_url}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            }
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Menu toggle
    menuToggle.addEventListener('click', toggleSlideMenu);
    closeMenu.addEventListener('click', closeSlideMenu);
    overlay.addEventListener('click', closeSlideMenu);
    
    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateToPage(page);
            closeSlideMenu();
        });
    });
    
    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Watch ad button
    watchAdBtn.addEventListener('click', watchAd);
    
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

// Toggle slide menu
function toggleSlideMenu() {
    slideMenu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = slideMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Close slide menu
function closeSlideMenu() {
    slideMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate to page
function navigateToPage(page) {
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    
    // Update active menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.menu-item[data-page="${page}"]`).classList.add('active');
    
    // Navigate to page
    if (page !== 'index') {
        window.location.href = page + '.html';
    }
}

// Watch ad function
function watchAd() {
    if (isWatchingAd || adCount >= 20) {
        return;
    }
    
    isWatchingAd = true;
    watchAdBtn.disabled = true;
    watchAdBtn.innerHTML = '<div class="loading"></div> Gözləyin...';
    
    // Simulate ad watching with progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        adProgress.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            completeAdWatching();
        }
    }, 100);
}

// Complete ad watching
function completeAdWatching() {
    adCount++;
    biletBalance++;
    
    // Update displays
    updateBalanceDisplay();
    adCountDisplay.textContent = adCount;
    
    // Show confirmation message
    showConfirmationMessage();
    
    // Reset button
    isWatchingAd = false;
    watchAdBtn.disabled = adCount >= 20;
    watchAdBtn.innerHTML = adCount >= 20 ? 
        '<i class="fas fa-check"></i> TAMAMLANDI' : 
        '<i class="fas fa-play"></i> REKLAM İZLƏ';
    
    // Save data
    saveUserData();
}

// Show confirmation message
function showConfirmationMessage() {
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
    }, 3000);
}

// Update balance display
function updateBalanceDisplay() {
    biletBalanceDisplay.textContent = biletBalance;
    adscoinBalanceDisplay.textContent = adscoinBalance;
    aznBalanceDisplay.textContent = aznBalance.toFixed(2);
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('adsmanat_user_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        adCount = data.adCount || 0;
        biletBalance = data.biletBalance || 0;
        adscoinBalance = data.adscoinBalance || 0;
        aznBalance = data.aznBalance || 0.00;
        
        updateBalanceDisplay();
        adCountDisplay.textContent = adCount;
        adProgress.style.width = (adCount / 20) * 100 + '%';
        
        // Update watch ad button
        watchAdBtn.disabled = adCount >= 20;
        watchAdBtn.innerHTML = adCount >= 20 ? 
            '<i class="fas fa-check"></i> TAMAMLANDI' : 
            '<i class="fas fa-play"></i> REKLAM İZLƏ';
    }
}

// Save user data to localStorage
function saveUserData() {
    const data = {
        adCount: adCount,
        biletBalance: biletBalance,
        adscoinBalance: adscoinBalance,
        aznBalance: aznBalance,
        lastUpdate: new Date().toISOString()
    };
    localStorage.setItem('adsmanat_user_data', JSON.stringify(data));
}

// Reset daily limits (call this at midnight)
function resetDailyLimits() {
    const now = new Date();
    const lastReset = localStorage.getItem('adsmanat_last_reset');
    
    if (!lastReset || new Date(lastReset).toDateString() !== now.toDateString()) {
        adCount = 0;
        updateBalanceDisplay();
        adCountDisplay.textContent = adCount;
        adProgress.style.width = '0%';
        
        watchAdBtn.disabled = false;
        watchAdBtn.innerHTML = '<i class="fas fa-play"></i> REKLAM İZLƏ';
        
        localStorage.setItem('adsmanat_last_reset', now.toISOString());
        saveUserData();
    }
}

// Check for daily reset on page load
document.addEventListener('DOMContentLoaded', function() {
    resetDailyLimits();
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
        const speed = (index + 1) * 0.5;
        const x = (e.clientX * speed) / 100;
        const y = (e.clientY * speed) / 100;
        bubble.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSlideMenu();
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - close menu
            closeSlideMenu();
        } else {
            // Swipe right - open menu
            if (!slideMenu.classList.contains('active')) {
                toggleSlideMenu();
            }
        }
    }
}

// Add haptic feedback for mobile
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Add haptic feedback to buttons
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', addHapticFeedback);
});

// Export functions for use in other pages
window.ADSMANAT = {
    updateBalance: function(bilet, adscoin, azn) {
        biletBalance = bilet;
        adscoinBalance = adscoin;
        aznBalance = azn;
        updateBalanceDisplay();
        saveUserData();
    },
    getBalance: function() {
        return {
            bilet: biletBalance,
            adscoin: adscoinBalance,
            azn: aznBalance
        };
    },
    addBilet: function(amount) {
        biletBalance += amount;
        updateBalanceDisplay();
        saveUserData();
    },
    addAdscoin: function(amount) {
        adscoinBalance += amount;
        aznBalance = adscoinBalance * 0.001;
        updateBalanceDisplay();
        saveUserData();
    },
    removeBilet: function(amount) {
        if (biletBalance >= amount) {
            biletBalance -= amount;
            updateBalanceDisplay();
            saveUserData();
            return true;
        }
        return false;
    }
};