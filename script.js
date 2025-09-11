// Global variables
let adCount = 0;
let biletBalance = 0;
let adscoinBalance = 0;
let aznBalance = 0.00;
let isAdWatching = false;
let adTimer = null;

// DOM elements
const menuToggle = document.getElementById('menuToggle');
const slideMenu = document.getElementById('slideMenu');
const closeMenu = document.getElementById('closeMenu');
const watchAdBtn = document.getElementById('watchAdBtn');
const adProgress = document.getElementById('adProgress');
const adCountDisplay = document.getElementById('adCount');
const confirmationMessage = document.getElementById('confirmationMessage');
const biletBalanceDisplay = document.getElementById('biletBalance');
const adscoinBalanceDisplay = document.getElementById('adscoinBalance');
const aznBalanceDisplay = document.getElementById('aznBalance');
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
    // Add click effect to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 300);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Menu toggle
    menuToggle.addEventListener('click', toggleSlideMenu);
    closeMenu.addEventListener('click', closeSlideMenu);
    
    // Slide menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
            closeSlideMenu();
        });
    });
    
    // Tab navigation
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Ad watch button
    watchAdBtn.addEventListener('click', startAdWatching);
    
    // Close slide menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!slideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeSlideMenu();
        }
    });
}

// Toggle slide menu
function toggleSlideMenu() {
    slideMenu.classList.toggle('active');
    if (slideMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close slide menu
function closeSlideMenu() {
    slideMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate to page
function navigateToPage(page) {
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-page') === page) {
            item.classList.add('active');
        }
    });
    
    // Update active tab
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-page') === page) {
            tab.classList.add('active');
        }
    });
    
    // Navigate to page
    if (page === 'index') {
        window.location.href = 'index.html';
    } else if (page === 'biletcoin') {
        window.location.href = 'biletcoin.html';
    } else if (page === 'events') {
        window.location.href = 'events.html';
    } else if (page === 'tasks') {
        window.location.href = 'tasks.html';
    } else if (page === 'withdraw') {
        window.location.href = 'withdraw.html';
    } else if (page === 'rules') {
        window.location.href = 'rules.html';
    } else if (page === 'settings') {
        window.location.href = 'settings.html';
    } else if (page === 'friends') {
        showMessage('Bu bölmə gələcəkdə hazırlanacaq', 'info');
    }
}

// Load user data
function loadUserData() {
    // Get user data from Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;
        if (user) {
            userName.textContent = user.first_name || 'İstifadəçi';
            userUsername.textContent = '@' + (user.username || 'username');
            
            // Set profile avatar
            if (user.photo_url) {
                profileAvatar.innerHTML = `<img src="${user.photo_url}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            }
        }
    }
    
    // Load balance data from localStorage or server
    loadBalanceData();
}

// Load balance data
function loadBalanceData() {
    const savedData = localStorage.getItem('adsmanat_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        adCount = data.adCount || 0;
        biletBalance = data.biletBalance || 0;
        adscoinBalance = data.adscoinBalance || 0;
        aznBalance = data.aznBalance || 0.00;
    }
    
    updateBalanceDisplay();
    updateAdProgress();
}

// Save balance data
function saveBalanceData() {
    const data = {
        adCount: adCount,
        biletBalance: biletBalance,
        adscoinBalance: adscoinBalance,
        aznBalance: aznBalance
    };
    localStorage.setItem('adsmanat_data', JSON.stringify(data));
}

// Update balance display
function updateBalanceDisplay() {
    biletBalanceDisplay.textContent = biletBalance;
    adscoinBalanceDisplay.textContent = adscoinBalance;
    aznBalanceDisplay.textContent = aznBalance.toFixed(2);
}

// Update ad progress
function updateAdProgress() {
    const progress = (adCount / 20) * 100;
    adProgress.style.width = progress + '%';
    adCountDisplay.textContent = adCount;
    
    // Enable/disable watch button
    if (adCount >= 20) {
        watchAdBtn.disabled = true;
        watchAdBtn.innerHTML = '<i class="fas fa-check"></i> GÜNLÜK LİMİT TAMAM';
    } else {
        watchAdBtn.disabled = false;
        watchAdBtn.innerHTML = '<i class="fas fa-play"></i> REKLAM İZLƏ';
    }
}

// Start ad watching
function startAdWatching() {
    if (isAdWatching || adCount >= 20) return;
    
    isAdWatching = true;
    watchAdBtn.disabled = true;
    watchAdBtn.innerHTML = '<div class="loading"></div> REKLAM İZLƏNİR...';
    
    // Simulate ad watching (7-10 seconds)
    const adDuration = Math.random() * 3000 + 7000; // 7-10 seconds
    
    adTimer = setTimeout(() => {
        completeAdWatching();
    }, adDuration);
}

// Complete ad watching
function completeAdWatching() {
    adCount++;
    biletBalance++;
    
    updateAdProgress();
    updateBalanceDisplay();
    saveBalanceData();
    
    // Show confirmation message
    showConfirmationMessage();
    
    // Reset button
    isAdWatching = false;
    if (adCount < 20) {
        watchAdBtn.disabled = false;
        watchAdBtn.innerHTML = '<i class="fas fa-play"></i> REKLAM İZLƏ';
    }
}

// Show confirmation message
function showConfirmationMessage() {
    confirmationMessage.classList.add('show');
    setTimeout(() => {
        confirmationMessage.classList.remove('show');
    }, 3000);
}

// Show message
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles for message
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)' : 'linear-gradient(135deg, #00ffff 0%, #0099cc 100%)'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px ${type === 'error' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 255, 0.5)'};
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

// Telegram WebApp integration
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    // Set theme
    window.Telegram.WebApp.setHeaderColor('#000000');
    window.Telegram.WebApp.setBackgroundColor('#1a1a1a');
}

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isAdWatching) {
        // Pause ad watching if user switches tabs
        if (adTimer) {
            clearTimeout(adTimer);
            isAdWatching = false;
            watchAdBtn.disabled = false;
            watchAdBtn.innerHTML = '<i class="fas fa-play"></i> REKLAM İZLƏ';
        }
    }
});

// Prevent context menu on long press
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Handle back button
window.addEventListener('popstate', function(e) {
    closeSlideMenu();
});

// Add smooth scrolling
document.documentElement.style.scrollBehavior = 'smooth';

// Add touch feedback
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        e.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeSlideMenu();
    }
});

// Add loading states
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    showMessage('Xəta baş verdi. Zəhmət olmasa səhifəni yeniləyin.', 'error');
});

// Add offline detection
window.addEventListener('online', function() {
    showMessage('İnternet bağlantısı bərpa olundu', 'info');
});

window.addEventListener('offline', function() {
    showMessage('İnternet bağlantısı kəsildi', 'error');
});

// Add service worker for offline functionality
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
    });
}