// Rules page functionality
const ruleTabs = document.querySelectorAll('.rule-tab');
const ruleContents = document.querySelectorAll('.rule-content');

// Initialize rules page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadRulePreference();
});

// Setup event listeners
function setupEventListeners() {
    ruleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const ruleType = this.getAttribute('data-rule');
            switchRule(ruleType);
        });
    });
    
    // Add click effects
    ruleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 300);
        });
    });
}

// Switch rule content
function switchRule(ruleType) {
    // Update active tab
    ruleTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-rule') === ruleType) {
            tab.classList.add('active');
        }
    });
    
    // Update active content
    ruleContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === ruleType + 'Rules') {
            content.classList.add('active');
        }
    });
    
    // Save preference
    localStorage.setItem('rule_preference', ruleType);
    
    // Add animation
    const activeContent = document.getElementById(ruleType + 'Rules');
    if (activeContent) {
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            activeContent.style.transition = 'all 0.3s ease';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translateY(0)';
        }, 50);
    }
}

// Load rule preference
function loadRulePreference() {
    const preference = localStorage.getItem('rule_preference');
    if (preference) {
        switchRule(preference);
    }
}

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === '1') {
        switchRule('general');
    } else if (e.key === '2') {
        switchRule('event');
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.classList.contains('rule-tab')) {
        e.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.classList.contains('rule-tab')) {
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }
});

// Add animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const ruleItems = document.querySelectorAll('.rule-item');
    ruleItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    scrollBtn.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
            scrollBtn.style.alignItems = 'center';
            scrollBtn.style.justifyContent = 'center';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
}

// Add scroll to top button
addScrollToTopButton();

// Add hover effects to rule items
document.addEventListener('DOMContentLoaded', function() {
    const ruleItems = document.querySelectorAll('.rule-item');
    ruleItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 20px rgba(0, 255, 255, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});

// Add copy functionality for profile link
document.addEventListener('DOMContentLoaded', function() {
    const profileLink = document.querySelector('.profile-link a');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Copy link to clipboard
            const linkText = this.textContent;
            navigator.clipboard.writeText(linkText).then(() => {
                showMessage('Link kopyalandı!', 'success');
            }).catch(() => {
                showMessage('Link kopyalanmadı', 'error');
            });
        });
    }
});

// Show message function
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    const colors = {
        success: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
        error: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
        info: 'linear-gradient(135deg, #00ffff 0%, #0099cc 100%)'
    };
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type]};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
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

// Add search functionality
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Qaydalarda axtar...';
    searchInput.className = 'rule-search';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 15px;
        background: rgba(0, 255, 255, 0.1);
        border: 2px solid #00ffff;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        margin-bottom: 20px;
    `;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const ruleItems = document.querySelectorAll('.rule-item');
        
        ruleItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0.3';
            }
        });
    });
    
    // Insert search input before rule content
    const rulesCard = document.querySelector('.rules-card');
    const ruleSelection = document.querySelector('.rule-selection');
    rulesCard.insertBefore(searchInput, ruleSelection.nextSibling);
}

// Add search functionality
addSearchFunctionality();

// Add print functionality
function addPrintFunctionality() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i> ÇAP ET';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
        border: none;
        border-radius: 25px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printBtn);
}

// Add print functionality
addPrintFunctionality();

// Add print styles
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .header, .slide-menu, .tabs-container, .bubbles, .scroll-to-top, .print-btn {
            display: none !important;
        }
        
        .main-content {
            margin-top: 0 !important;
        }
        
        .rules-card {
            box-shadow: none !important;
            border: 2px solid #000 !important;
        }
        
        .rule-item {
            break-inside: avoid;
            page-break-inside: avoid;
        }
    }
`;
document.head.appendChild(printStyle);

// Add accessibility features
function addAccessibilityFeatures() {
    // Add ARIA labels
    ruleTabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', tab.classList.contains('active'));
        tab.setAttribute('tabindex', '0');
    });
    
    ruleContents.forEach((content, index) => {
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-hidden', !content.classList.contains('active'));
    });
    
    // Add keyboard navigation
    ruleTabs.forEach(tab => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Add accessibility features
addAccessibilityFeatures();