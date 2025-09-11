// Rules Page JavaScript

// DOM elements
const ruleTypeBtns = document.querySelectorAll('.rule-type-btn');
const ruleContents = document.querySelectorAll('.rule-content');
const profileLink = document.getElementById('profileLink');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupProfileLink();
});

// Setup event listeners
function setupEventListeners() {
    // Rule type buttons
    ruleTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const ruleType = this.dataset.type;
            switchRuleType(ruleType);
        });
    });
    
    // Add click effects to all buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 200);
        });
    });
}

// Switch rule type
function switchRuleType(type) {
    // Update active button
    ruleTypeBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // Update active content
    ruleContents.forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${type}Rules`).classList.add('active');
    
    // Add haptic feedback
    addHapticFeedback();
}

// Setup profile link
function setupProfileLink() {
    // Set the actual profile image link
    profileLink.href = 'https://t.me/adsmanatofficial'; // Replace with actual profile image link
    
    // Add click tracking
    profileLink.addEventListener('click', function() {
        // Track profile link click
        trackProfileLinkClick();
    });
}

// Track profile link click
function trackProfileLinkClick() {
    // Store click event
    const clickData = {
        timestamp: new Date().toISOString(),
        action: 'profile_link_click',
        source: 'rules_page'
    };
    
    const clicks = JSON.parse(localStorage.getItem('adsmanat_profile_clicks') || '[]');
    clicks.push(clickData);
    localStorage.setItem('adsmanat_profile_clicks', JSON.stringify(clicks));
}

// Add haptic feedback
function addHapticFeedback() {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const activeBtn = document.querySelector('.rule-type-btn.active');
        const currentType = activeBtn.dataset.type;
        
        if (e.key === 'ArrowLeft') {
            // Switch to general rules
            switchRuleType('general');
        } else if (e.key === 'ArrowRight') {
            // Switch to event rules
            switchRuleType('event');
        }
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
            // Swipe left - switch to event rules
            switchRuleType('event');
        } else {
            // Swipe right - switch to general rules
            switchRuleType('general');
        }
    }
}

// Add rule item animations
function addRuleItemAnimations() {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    ruleItems.forEach(item => {
        item.style.animationPlayState = 'paused';
        observer.observe(item);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    addRuleItemAnimations();
});

// Add copy functionality for important text
function addCopyFunctionality() {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    ruleItems.forEach(item => {
        item.addEventListener('longpress', function() {
            const text = this.querySelector('.rule-text').textContent;
            copyToClipboard(text);
            showCopyMessage('Mətn kopyalandı!');
        });
    });
}

// Long press detection
let pressTimer = null;

document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.rule-item')) {
        pressTimer = setTimeout(() => {
            e.target.closest('.rule-item').dispatchEvent(new Event('longpress'));
        }, 500);
    }
});

document.addEventListener('touchend', function() {
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
});

document.addEventListener('touchmove', function() {
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
});

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        addHapticFeedback();
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        addHapticFeedback();
    });
}

// Show copy message
function showCopyMessage(message) {
    const copyMessage = document.createElement('div');
    copyMessage.className = 'copy-message';
    copyMessage.innerHTML = `
        <i class="fas fa-check"></i>
        <span>${message}</span>
    `;
    
    copyMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
        color: #000000;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: bold;
        animation: copyPop 0.3s ease;
    `;
    
    document.body.appendChild(copyMessage);
    
    setTimeout(() => {
        copyMessage.remove();
    }, 2000);
}

// Add copy message styles
const copyStyle = document.createElement('style');
copyStyle.textContent = `
    @keyframes copyPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(copyStyle);

// Initialize copy functionality
document.addEventListener('DOMContentLoaded', function() {
    addCopyFunctionality();
});

// Add search functionality
function addSearchFunctionality() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" id="ruleSearch" placeholder="Qaydalarda axtarış...">
            <button class="clear-search" id="clearSearch">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    const rulesCard = document.querySelector('.rules-card');
    rulesCard.insertBefore(searchContainer, rulesCard.firstChild);
    
    // Add search functionality
    const searchInput = document.getElementById('ruleSearch');
    const clearBtn = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchRules(searchTerm);
    });
    
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchRules('');
    });
}

// Search rules
function searchRules(searchTerm) {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    ruleItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
            item.style.animation = 'highlight 0.3s ease';
        } else {
            item.style.display = searchTerm ? 'none' : 'flex';
        }
    });
}

// Add search styles
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .search-container {
        margin-bottom: 20px;
    }
    
    .search-box {
        position: relative;
        display: flex;
        align-items: center;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid #00ffff;
        border-radius: 25px;
        padding: 10px 15px;
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
    }
    
    .search-box i {
        color: #00ffff;
        margin-right: 10px;
    }
    
    .search-box input {
        flex: 1;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 14px;
        outline: none;
    }
    
    .search-box input::placeholder {
        color: #666666;
    }
    
    .clear-search {
        background: none;
        border: none;
        color: #666666;
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .clear-search:hover {
        color: #ff0000;
        background: rgba(255, 0, 0, 0.1);
    }
    
    @keyframes highlight {
        0% { background: rgba(255, 255, 0, 0.3); }
        100% { background: rgba(0, 255, 255, 0.05); }
    }
`;
document.head.appendChild(searchStyle);

// Initialize search functionality
document.addEventListener('DOMContentLoaded', function() {
    addSearchFunctionality();
});

// Add rule bookmarking
function addBookmarking() {
    const ruleItems = document.querySelectorAll('.rule-item');
    
    ruleItems.forEach((item, index) => {
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-btn';
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        bookmarkBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            color: #666666;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
            z-index: 10;
        `;
        
        bookmarkBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBookmark(index);
        });
        
        item.style.position = 'relative';
        item.appendChild(bookmarkBtn);
    });
}

// Toggle bookmark
function toggleBookmark(ruleIndex) {
    const bookmarks = JSON.parse(localStorage.getItem('adsmanat_rule_bookmarks') || '[]');
    const bookmarkIndex = bookmarks.indexOf(ruleIndex);
    
    if (bookmarkIndex > -1) {
        bookmarks.splice(bookmarkIndex, 1);
    } else {
        bookmarks.push(ruleIndex);
    }
    
    localStorage.setItem('adsmanat_rule_bookmarks', JSON.stringify(bookmarks));
    updateBookmarkDisplay();
    addHapticFeedback();
}

// Update bookmark display
function updateBookmarkDisplay() {
    const bookmarks = JSON.parse(localStorage.getItem('adsmanat_rule_bookmarks') || '[]');
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    
    bookmarkBtns.forEach((btn, index) => {
        if (bookmarks.includes(index)) {
            btn.style.color = '#ffa500';
            btn.innerHTML = '<i class="fas fa-bookmark"></i>';
        } else {
            btn.style.color = '#666666';
            btn.innerHTML = '<i class="far fa-bookmark"></i>';
        }
    });
}

// Initialize bookmarking
document.addEventListener('DOMContentLoaded', function() {
    addBookmarking();
    updateBookmarkDisplay();
});