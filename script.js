// Telegram Web App initialization
let tg = window.Telegram.WebApp;
tg.expand();

// Global variables
let userBalance = {
    tickets: 0,
    adscoin: 0,
    azn: 0.000
};

let adViewsToday = 0;
const maxAdViews = 20;

// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const slideMenu = document.getElementById('slideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const closeBtn = document.getElementById('closeBtn');
const watchAdBtn = document.getElementById('watchAdBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const loadingCounter = document.getElementById('loadingCounter');
const successMessage = document.getElementById('successMessage');
const header = document.getElementById('header');
const tabsContainer = document.getElementById('tabsContainer');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    loadUserData();
    setupEventListeners();
    setupScrollEffects();
});

// Initialize user from Telegram
function initializeUser() {
    if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        document.getElementById('profileName').textContent = user.first_name || 'İstifadəçi';
        document.getElementById('profileUsername').textContent = '@' + (user.username || 'username');
        
        if (user.photo_url) {
            document.getElementById('profileImage').src = user.photo_url;
        }
        
        // Save user data to backend
        saveUserData(user);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Menu functionality
    menuBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
    
    // Watch ad functionality
    watchAdBtn.addEventListener('click', watchAd);
    
    // Add click effects to all buttons
    addClickEffects();
}

// Menu functions
function openMenu() {
    slideMenu.classList.add('open');
    menuOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    slideMenu.classList.remove('open');
    menuOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Watch ad functionality
function watchAd() {
    if (adViewsToday >= maxAdViews) {
        showMessage('Günlük limit doldu!', 'error');
        return;
    }
    
    watchAdBtn.disabled = true;
    showLoadingOverlay();
    
    // Simulate ad watching (7-10 seconds)
    const watchTime = Math.floor(Math.random() * 4) + 7; // 7-10 seconds
    let countdown = watchTime;
    
    const countdownInterval = setInterval(() => {
        loadingCounter.textContent = countdown;
        countdown--;
        
        if (countdown < 0) {
            clearInterval(countdownInterval);
            completeAdWatch();
        }
    }, 1000);
}

function showLoadingOverlay() {
    loadingOverlay.classList.add('show');
}

function hideLoadingOverlay() {
    loadingOverlay.classList.remove('show');
}

function completeAdWatch() {
    hideLoadingOverlay();
    
    // Add 1 ticket to balance
    userBalance.tickets += 1;
    adViewsToday += 1;
    
    // Update UI
    updateBalanceDisplay();
    updateAdCounter();
    
    // Show success message
    showSuccessMessage();
    
    // Save to backend
    updateUserBalance();
    
    // Re-enable button
    watchAdBtn.disabled = false;
    
    // Check if limit reached
    if (adViewsToday >= maxAdViews) {
        watchAdBtn.textContent = 'LİMİT DOLDU';
        watchAdBtn.disabled = true;
    }
}

function showSuccessMessage() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

function showMessage(text, type = 'success') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <span class="message-icon">${type === 'success' ? '✅' : '❌'}</span>
        <span>${text}</span>
    `;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        backdrop-filter: blur(10px);
        border: 1px solid ${type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Update balance display
function updateBalanceDisplay() {
    document.getElementById('ticketBalance').textContent = userBalance.tickets;
    document.getElementById('adscoinBalance').textContent = userBalance.adscoin;
    document.getElementById('aznBalance').textContent = userBalance.azn.toFixed(3);
}

// Update ad counter
function updateAdCounter() {
    document.getElementById('adCount').textContent = adViewsToday;
}

// Add click effects to buttons
function addClickEffects() {
    const buttons = document.querySelectorAll('button, .tab, .menu-item');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Scroll effects for header and tabs
function setupScrollEffects() {
    let lastScrollTop = 0;
    let scrollTimeout;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.classList.add('hidden');
                tabsContainer.classList.add('hidden');
            } else {
                // Scrolling up
                header.classList.remove('hidden');
                tabsContainer.classList.remove('hidden');
            }
            lastScrollTop = scrollTop;
        }, 100);
    });
}

// Backend API functions
async function saveUserData(user) {
    try {
        const response = await fetch('api/save_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegram_id: user.id,
                username: user.username,
                first_name: user.first_name,
                profile_photo_url: user.photo_url
            })
        });
        
        const result = await response.json();
        if (result.success) {
            console.log('User data saved successfully');
        }
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

async function loadUserData() {
    try {
        const user = tg.initDataUnsafe.user;
        if (!user) return;
        
        const response = await fetch(`api/get_user_data.php?telegram_id=${user.id}`);
        const result = await response.json();
        
        if (result.success) {
            userBalance = result.balance;
            adViewsToday = result.ad_views;
            updateBalanceDisplay();
            updateAdCounter();
            
            if (adViewsToday >= maxAdViews) {
                watchAdBtn.textContent = 'LİMİT DOLDU';
                watchAdBtn.disabled = true;
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

async function updateUserBalance() {
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
                azn: userBalance.azn,
                ad_views: adViewsToday
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

// Handle back button
tg.onEvent('backButtonClicked', function() {
    if (slideMenu.classList.contains('open')) {
        closeMenu();
    } else {
        tg.close();
    }
});

// Show back button when menu is open
function updateBackButton() {
    if (slideMenu.classList.contains('open')) {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
}

// Update back button visibility when menu state changes
menuBtn.addEventListener('click', updateBackButton);
closeBtn.addEventListener('click', updateBackButton);