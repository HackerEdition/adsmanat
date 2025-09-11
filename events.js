// Events page functionality
const joinEventBtn = document.getElementById('joinEventBtn');

// Initialize events page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkEventStatus();
});

// Setup event listeners
function setupEventListeners() {
    joinEventBtn.addEventListener('click', joinEvent);
}

// Check event status
function checkEventStatus() {
    const eventStatus = localStorage.getItem('event_joined');
    if (eventStatus === 'true') {
        joinEventBtn.classList.add('joined');
        joinEventBtn.innerHTML = '<i class="fas fa-check"></i> QOŞULUB';
        joinEventBtn.disabled = true;
    }
}

// Join event function
function joinEvent() {
    // Navigate to rules page
    window.location.href = 'rules.html';
}

// Add click effect to join button
joinEventBtn.addEventListener('click', function() {
    this.classList.add('btn-click');
    setTimeout(() => {
        this.classList.remove('btn-click');
    }, 300);
});

// Add hover effects
joinEventBtn.addEventListener('mouseenter', function() {
    if (!this.disabled) {
        this.style.transform = 'translateY(-2px)';
    }
});

joinEventBtn.addEventListener('mouseleave', function() {
    if (!this.disabled) {
        this.style.transform = 'translateY(0)';
    }
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!joinEventBtn.disabled) {
            joinEvent();
        }
    }
});

// Add touch support for mobile
joinEventBtn.addEventListener('touchstart', function(e) {
    if (!this.disabled) {
        this.style.transform = 'scale(0.95)';
    }
});

joinEventBtn.addEventListener('touchend', function(e) {
    if (!this.disabled) {
        this.style.transform = 'scale(1)';
    }
});

// Add animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const eventItem = document.querySelector('.event-item');
    if (eventItem) {
        eventItem.style.opacity = '0';
        eventItem.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            eventItem.style.transition = 'all 0.5s ease';
            eventItem.style.opacity = '1';
            eventItem.style.transform = 'translateY(0)';
        }, 200);
    }
});

// Add pulse animation to join button
function addPulseAnimation() {
    if (!joinEventBtn.disabled) {
        joinEventBtn.style.animation = 'pulse 2s infinite';
    }
}

// Remove pulse animation
function removePulseAnimation() {
    joinEventBtn.style.animation = 'none';
}

// Add pulse animation after 3 seconds
setTimeout(addPulseAnimation, 3000);

// Remove pulse animation when button is clicked
joinEventBtn.addEventListener('click', removePulseAnimation);

// Add confetti effect when joining event
function showJoinConfetti() {
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
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${['#ff00ff', '#00ffff', '#ffff00'][Math.floor(Math.random() * 3)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confetti-fall 2s linear forwards;
        `;
        confetti.appendChild(particle);
    }
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

// Add confetti animation CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);

// Add success message
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Hadisəyə qoşuldunuz!</span>
    `;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1002;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Add event tracking
function trackEventJoin() {
    // You can add analytics tracking here
    console.log('Event joined:', new Date().toISOString());
}

// Enhanced join event function
function joinEventEnhanced() {
    trackEventJoin();
    showJoinConfetti();
    showSuccessMessage();
    
    // Mark event as joined
    localStorage.setItem('event_joined', 'true');
    
    // Update button state
    joinEventBtn.classList.add('joined');
    joinEventBtn.innerHTML = '<i class="fas fa-check"></i> QOŞULUB';
    joinEventBtn.disabled = true;
    
    // Navigate to rules page after delay
    setTimeout(() => {
        window.location.href = 'rules.html';
    }, 2000);
}

// Replace original join event function
joinEventBtn.removeEventListener('click', joinEvent);
joinEventBtn.addEventListener('click', joinEventEnhanced);