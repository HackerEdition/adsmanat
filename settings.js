// Settings page functionality
const languageBtns = document.querySelectorAll('.language-btn');
const helpBtn = document.getElementById('helpBtn');
const referralBtn = document.getElementById('referralBtn');

// Language translations
const translations = {
    az: {
        // Main navigation
        'QAZANC': 'QAZANC',
        'DOSTLAR': 'DOSTLAR',
        'QAYDALAR': 'QAYDALAR',
        'AYARLAR': 'AYARLAR',
        // Settings
        'DİL': 'DİL',
        'YARDIM VƏ DƏSTƏK': 'YARDIM VƏ DƏSTƏK',
        'TƏFƏRRÜATLAR': 'TƏFƏRRÜATLAR',
        'Versiya': 'Versiya',
        'Tarix': 'Tarix',
        'Developer': 'Developer'
    },
    ru: {
        // Main navigation
        'QAZANC': 'ЗАРАБОТОК',
        'DOSTLAR': 'ДРУЗЬЯ',
        'QAYDALAR': 'ПРАВИЛА',
        'AYARLAR': 'НАСТРОЙКИ',
        // Settings
        'DİL': 'ЯЗЫК',
        'YARDIM VƏ DƏSTƏK': 'ПОМОЩЬ И ПОДДЕРЖКА',
        'TƏFƏRRÜATLAR': 'ДЕТАЛИ',
        'Versiya': 'Версия',
        'Tarix': 'Дата',
        'Developer': 'Разработчик'
    },
    en: {
        // Main navigation
        'QAZANC': 'EARNINGS',
        'DOSTLAR': 'FRIENDS',
        'QAYDALAR': 'RULES',
        'AYARLAR': 'SETTINGS',
        // Settings
        'DİL': 'LANGUAGE',
        'YARDIM VƏ DƏSTƏK': 'HELP & SUPPORT',
        'TƏFƏRRÜATLAR': 'DETAILS',
        'Versiya': 'Version',
        'Tarix': 'Date',
        'Developer': 'Developer'
    }
};

// Initialize settings page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadLanguagePreference();
});

// Setup event listeners
function setupEventListeners() {
    // Language selection
    languageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            selectLanguage(lang);
        });
    });
    
    // Help button
    helpBtn.addEventListener('click', function() {
        window.open('https://t.me/c/2252090240/123', '_blank');
    });
    
    // Referral button
    referralBtn.addEventListener('click', function() {
        showMessage('Bu bölmə gələcəkdə hazırlanacaq', 'info');
    });
    
    // Add click effects
    [...languageBtns, helpBtn, referralBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.add('btn-click');
            setTimeout(() => {
                this.classList.remove('btn-click');
            }, 300);
        });
    });
}

// Select language
function selectLanguage(lang) {
    // Update active language button
    languageBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Apply translations
    applyTranslations(lang);
    
    // Show success message
    showMessage('Dil dəyişdirildi!', 'success');
}

// Apply translations
function applyTranslations(lang) {
    const translation = translations[lang];
    if (!translation) return;
    
    // Update all translatable elements
    Object.keys(translation).forEach(key => {
        const elements = document.querySelectorAll(`[data-translate="${key}"]`);
        elements.forEach(element => {
            element.textContent = translation[key];
        });
    });
    
    // Update page title
    document.title = `ADSMANAT - ${translation['AYARLAR']}`;
}

// Load language preference
function loadLanguagePreference() {
    const savedLang = localStorage.getItem('language') || 'az';
    selectLanguage(savedLang);
}

// Show message
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

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === '1') {
        selectLanguage('az');
    } else if (e.key === '2') {
        selectLanguage('ru');
    } else if (e.key === '3') {
        selectLanguage('en');
    }
});

// Add touch support for mobile
document.addEventListener('touchstart', function(e) {
    if (e.target.tagName === 'BUTTON') {
        e.target.style.transform = 'scale(0.95)';
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.tagName === 'BUTTON') {
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }
});

// Add animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const settingItems = document.querySelectorAll('.setting-item');
    settingItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add hover effects
document.addEventListener('DOMContentLoaded', function() {
    const languageBtns = document.querySelectorAll('.language-btn');
    languageBtns.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(5px)';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
            }
        });
    });
});

// Add ripple effect
function addRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('language-btn') || 
        e.target.classList.contains('help-btn') || 
        e.target.classList.contains('referral-btn')) {
        addRippleEffect(e.target, e);
    }
});

// Add theme toggle (optional)
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff00ff 0%, #00ffff 100%);
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    document.body.appendChild(themeToggle);
}

// Add theme toggle
addThemeToggle();

// Add dark theme styles
const darkThemeStyle = document.createElement('style');
darkThemeStyle.textContent = `
    .dark-theme {
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%) !important;
    }
    
    .dark-theme .header {
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%) !important;
    }
    
    .dark-theme .slide-menu {
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%) !important;
    }
    
    .dark-theme .tabs-container {
        background: linear-gradient(135deg, #000000 0%, #0a0a0a 100%) !important;
    }
`;
document.head.appendChild(darkThemeStyle);

// Add export settings functionality
function addExportSettings() {
    const exportBtn = document.createElement('button');
    exportBtn.innerHTML = '<i class="fas fa-download"></i> EKSPORT';
    exportBtn.className = 'export-btn';
    exportBtn.style.cssText = `
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
    
    exportBtn.addEventListener('click', function() {
        const settings = {
            language: localStorage.getItem('language') || 'az',
            theme: localStorage.getItem('theme') || 'light',
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'adsmanat-settings.json';
        link.click();
        
        URL.revokeObjectURL(url);
        showMessage('Ayarlar eksport edildi!', 'success');
    });
    
    document.body.appendChild(exportBtn);
}

// Add export settings
addExportSettings();

// Add import settings functionality
function addImportSettings() {
    const importBtn = document.createElement('button');
    importBtn.innerHTML = '<i class="fas fa-upload"></i> İMPORT';
    importBtn.className = 'import-btn';
    importBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 120px;
        padding: 12px 20px;
        background: linear-gradient(135deg, #00ffff 0%, #0099cc 100%);
        border: none;
        border-radius: 25px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const settings = JSON.parse(e.target.result);
                    if (settings.language) {
                        selectLanguage(settings.language);
                    }
                    if (settings.theme) {
                        document.body.classList.toggle('dark-theme', settings.theme === 'dark');
                    }
                    showMessage('Ayarlar import edildi!', 'success');
                } catch (error) {
                    showMessage('Fayl formatı düzgün deyil!', 'error');
                }
            };
            reader.readAsText(file);
        }
    });
    
    importBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    document.body.appendChild(importBtn);
    document.body.appendChild(fileInput);
}

// Add import settings
addImportSettings();