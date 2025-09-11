// Events Page JavaScript

// DOM elements
const joinEventBtn = document.getElementById('joinEventBtn');

// Event state
let isEventJoined = false;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadEventStatus();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    joinEventBtn.addEventListener('click', joinEvent);
    
    // Add click effects
    joinEventBtn.addEventListener('click', function() {
        this.classList.add('btn-click');
        setTimeout(() => {
            this.classList.remove('btn-click');
        }, 200);
    });
}

// Load event status from localStorage
function loadEventStatus() {
    const eventStatus = localStorage.getItem('adsmanat_event_status');
    if (eventStatus) {
        isEventJoined = JSON.parse(eventStatus);
        updateEventButton();
    }
}

// Update event button based on status
function updateEventButton() {
    if (isEventJoined) {
        joinEventBtn.innerHTML = '<i class="fas fa-check"></i> QOŞULUBSUNUZ';
        joinEventBtn.disabled = true;
        joinEventBtn.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';
        joinEventBtn.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.3)';
    } else {
        joinEventBtn.innerHTML = '<i class="fas fa-plus"></i> QOŞUL';
        joinEventBtn.disabled = false;
        joinEventBtn.style.background = 'linear-gradient(135deg, #ff00ff 0%, #cc00cc 100%)';
        joinEventBtn.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.3)';
    }
}

// Join event function
function joinEvent() {
    if (isEventJoined) return;
    
    // Show loading state
    joinEventBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> QOŞULUR...';
    joinEventBtn.disabled = true;
    
    // Simulate joining process
    setTimeout(() => {
        // Mark as joined
        isEventJoined = true;
        localStorage.setItem('adsmanat_event_status', JSON.stringify(true));
        
        // Update button
        updateEventButton();
        
        // Show success message
        showSuccessMessage();
        
        // Add reward to balance
        addEventReward();
        
    }, 1500);
}

// Show success message
function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h4>Təbriklər!</h4>
        <p>Hadisəyə uğurla qoşuldunuz!<br>50 ADSCOİN balansınıza əlavə edildi.</p>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 500);
    }, 3000);
}

// Add event reward to balance
function addEventReward() {
    if (window.ADSMANAT) {
        // Add 50 ADSCOİN
        window.ADSMANAT.addAdscoin(50);
    } else {
        // Fallback to localStorage
        const savedData = localStorage.getItem('adsmanat_user_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            data.adscoinBalance = (data.adscoinBalance || 0) + 50;
            data.aznBalance = data.adscoinBalance * 0.001;
            localStorage.setItem('adsmanat_user_data', JSON.stringify(data));
        }
    }
}

// Add haptic feedback
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Add haptic feedback to join button
joinEventBtn.addEventListener('click', addHapticFeedback);

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!isEventJoined) {
            joinEvent();
        }
    }
});

// Add confetti effect for joining
function showConfetti() {
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
    
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${['#ff00ff', '#00ffff', '#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4'][Math.floor(Math.random() * 6)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        confetti.appendChild(piece);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, 4000);
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

// Show confetti when joining event
const originalJoinEvent = joinEvent;
joinEvent = function() {
    originalJoinEvent();
    setTimeout(() => {
        showConfetti();
    }, 2000);
};

// Add event countdown timer (optional)
function addEventTimer() {
    const eventEndDate = new Date();
    eventEndDate.setDate(eventEndDate.getDate() + 7); // 7 days from now
    
    const timerElement = document.createElement('div');
    timerElement.className = 'event-timer';
    timerElement.innerHTML = `
        <div class="timer-content">
            <i class="fas fa-clock"></i>
            <span>Hadisə bitir: <span id="countdown"></span></span>
        </div>
    `;
    
    const eventCard = document.querySelector('.special-event');
    eventCard.appendChild(timerElement);
    
    // Update countdown every second
    const countdownElement = document.getElementById('countdown');
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventEndDate.getTime() - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = 'Bitib';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.textContent = `${days}g ${hours}s ${minutes}d ${seconds}s`;
    }, 1000);
}

// Add timer styles
const timerStyle = document.createElement('style');
timerStyle.textContent = `
    .event-timer {
        margin-top: 15px;
        padding: 10px 15px;
        background: rgba(255, 0, 255, 0.1);
        border: 1px solid #ff00ff;
        border-radius: 10px;
        text-align: center;
    }
    
    .timer-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #ff00ff;
        font-size: 14px;
        font-weight: 500;
    }
    
    .timer-content i {
        font-size: 16px;
    }
`;
document.head.appendChild(timerStyle);

// Initialize timer
document.addEventListener('DOMContentLoaded', function() {
    addEventTimer();
});

// Add event sharing functionality
function shareEvent() {
    if (navigator.share) {
        navigator.share({
            title: 'ADSMANAT Hadisəsi',
            text: 'ADSMANAT botunun ilk həftə hadisəsinə qoşulun və 50 ADSCOİN qazanın!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const shareText = 'ADSMANAT botunun ilk həftə hadisəsinə qoşulun və 50 ADSCOİN qazanın! ' + window.location.href;
        navigator.clipboard.writeText(shareText).then(() => {
            showSuccessMessage('Link kopyalandı!');
        });
    }
}

// Add share button
function addShareButton() {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'share-btn';
    shareBtn.innerHTML = '<i class="fas fa-share"></i> PAYLAŞ';
    shareBtn.style.cssText = `
        background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        color: #000000;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 10px;
        transition: all 0.3s ease;
    `;
    
    shareBtn.addEventListener('click', shareEvent);
    shareBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.3)';
    });
    shareBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    const eventCard = document.querySelector('.special-event');
    eventCard.appendChild(shareBtn);
}

// Initialize share button
document.addEventListener('DOMContentLoaded', function() {
    addShareButton();
});