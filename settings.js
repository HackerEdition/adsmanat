// Settings Page JavaScript

// DOM Elements
const languageOptions = document.querySelectorAll('.language-option');
const languageMessage = document.getElementById('languageMessage');

// Current language
let currentLanguage = 'az'; // Default to Azerbaijani

// Language translations
const translations = {
    az: {
        // Azerbaijani (default)
        title: 'ADSMANAT',
        earnings: 'QAZANC',
        friends: 'DOSTLAR',
        rules: 'QAYDALAR',
        settings: 'AYARLAR',
        balance: 'BALANS',
        tickets: 'BİLET',
        adscoin: 'ADSCOİN',
        watchAd: 'REKLAM İZLƏ',
        spin: 'ÇEVİR',
        withdraw: 'ÇIXARIŞ',
        tasks: 'GÖREVLƏR',
        events: 'HADİSƏLƏR'
    },
    ru: {
        // Russian
        title: 'ADSMANAT',
        earnings: 'ЗАРАБОТОК',
        friends: 'ДРУЗЬЯ',
        rules: 'ПРАВИЛА',
        settings: 'НАСТРОЙКИ',
        balance: 'БАЛАНС',
        tickets: 'БИЛЕТ',
        adscoin: 'ADSCOİN',
        watchAd: 'СМОТРЕТЬ РЕКЛАМУ',
        spin: 'КРУТИТЬ',
        withdraw: 'ВЫВОД',
        tasks: 'ЗАДАНИЯ',
        events: 'СОБЫТИЯ'
    },
    en: {
        // English
        title: 'ADSMANAT',
        earnings: 'EARNINGS',
        friends: 'FRIENDS',
        rules: 'RULES',
        settings: 'SETTINGS',
        balance: 'BALANCE',
        tickets: 'TICKET',
        adscoin: 'ADSCOİN',
        watchAd: 'WATCH AD',
        spin: 'SPIN',
        withdraw: 'WITHDRAW',
        tasks: 'TASKS',
        events: 'EVENTS'
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCurrentLanguage();
    setupLanguageSelection();
    setupComingSoonFeatures();
});

// Load current language from storage
function loadCurrentLanguage() {
    const savedLanguage = localStorage.getItem('adsmanat_language');
    if (savedLanguage && translations[savedLanguage]) {
        currentLanguage = savedLanguage;
        updateLanguageSelection();
    }
}

// Setup language selection
function setupLanguageSelection() {
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
            if (selectedLang !== currentLanguage) {
                changeLanguage(selectedLang);
            }
        });
    });
}

// Update language selection UI
function updateLanguageSelection() {
    languageOptions.forEach(option => {
        const lang = option.dataset.lang;
        if (lang === currentLanguage) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// Change language
function changeLanguage(newLanguage) {
    if (!translations[newLanguage]) return;
    
    // Update current language
    currentLanguage = newLanguage;
    
    // Save to storage
    localStorage.setItem('adsmanat_language', newLanguage);
    
    // Update UI
    updateLanguageSelection();
    
    // Show language change message
    showLanguageChangeMessage();
    
    // Apply translations to current page
    setTimeout(() => {
        applyTranslations();
    }, 1000);
}

// Show language change message
function showLanguageChangeMessage() {
    const messages = {
        az: 'Dil dəyişdirildi! Səhifə yenilənir...',
        ru: 'Язык изменен! Страница обновляется...',
        en: 'Language changed! Page refreshing...'
    };
    
    languageMessage.querySelector('.message-text').textContent = messages[currentLanguage];
    languageMessage.classList.add('show');
    
    setTimeout(() => {
        languageMessage.classList.remove('show');
    }, 3000);
}

// Apply translations to current page
function applyTranslations() {
    const lang = translations[currentLanguage];
    
    // Update menu items
    const menuItems = document.querySelectorAll('.menu-item span:last-child');
    if (menuItems.length >= 4) {
        menuItems[0].textContent = lang.earnings;
        menuItems[1].textContent = lang.friends;
        menuItems[2].textContent = lang.rules;
        menuItems[3].textContent = lang.settings;
    }
    
    // Update tab labels
    const tabLabels = document.querySelectorAll('.tab span');
    const tabKeys = ['earnings', 'spin', 'events', 'tasks', 'withdraw'];
    tabLabels.forEach((label, index) => {
        if (tabKeys[index] && lang[tabKeys[index]]) {
            label.textContent = getTabText(tabKeys[index], lang);
        }
    });
    
    // Update other page elements based on current page
    updatePageSpecificTranslations(lang);
}

// Get tab text based on language
function getTabText(key, lang) {
    const tabTexts = {
        earnings: {
            az: 'BİLET QAZAN',
            ru: 'ПОЛУЧИТЬ БИЛЕТ',
            en: 'GET TICKET'
        },
        spin: {
            az: 'BİLET-COİN',
            ru: 'БИЛЕТ-КОИН',
            en: 'TICKET-COIN'
        },
        events: {
            az: 'HADİSƏLƏR',
            ru: 'СОБЫТИЯ',
            en: 'EVENTS'
        },
        tasks: {
            az: 'GÖREVLƏR',
            ru: 'ЗАДАНИЯ',
            en: 'TASKS'
        },
        withdraw: {
            az: 'ÇIXARIŞ',
            ru: 'ВЫВОД',
            en: 'WITHDRAW'
        }
    };
    
    return tabTexts[key] ? tabTexts[key][currentLanguage] : lang[key];
}

// Update page-specific translations
function updatePageSpecificTranslations(lang) {
    // Update settings page specific elements
    const settingsTitle = document.querySelector('.settings-header h2');
    if (settingsTitle) {
        settingsTitle.textContent = lang.settings;
    }
    
    // Update section headers
    const languageSection = document.querySelector('.section-header h3');
    if (languageSection && languageSection.textContent === 'Language') {
        const sectionTitles = {
            az: 'DİL',
            ru: 'ЯЗЫК',
            en: 'LANGUAGE'
        };
        languageSection.textContent = sectionTitles[currentLanguage];
    }
    
    // Update support section
    const supportHeaders = document.querySelectorAll('.section-header h3');
    supportHeaders.forEach(header => {
        if (header.textContent.includes('YARDIM') || header.textContent.includes('DƏSTƏK')) {
            const supportTitles = {
                az: 'YARDIM VƏ DƏSTƏK',
                ru: 'ПОМОЩЬ И ПОДДЕРЖКА',
                en: 'HELP & SUPPORT'
            };
            header.textContent = supportTitles[currentLanguage];
        }
    });
}

// Setup coming soon features
function setupComingSoonFeatures() {
    const comingSoonOptions = document.querySelectorAll('.coming-soon-option');
    
    comingSoonOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            showComingSoonMessage();
        });
    });
}

// Show coming soon message
function showComingSoonMessage() {
    const messages = {
        az: 'Bu xüsusiyyət tezliklə əlavə ediləcək!',
        ru: 'Эта функция скоро будет добавлена!',
        en: 'This feature will be added soon!'
    };
    
    showMessage(messages[currentLanguage], 'info');
}

// Show message function
function showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <span class="message-icon">${getMessageIcon(type)}</span>
        <span>${text}</span>
    `;
    message.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${getMessageColor(type)};
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        backdrop-filter: blur(10px);
        border: 1px solid ${getMessageBorderColor(type)};
        max-width: 90%;
        text-align: center;
        font-weight: bold;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Get message icon based on type
function getMessageIcon(type) {
    switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'info': return 'ℹ️';
        case 'warning': return '⚠️';
        default: return 'ℹ️';
    }
}

// Get message color based on type
function getMessageColor(type) {
    switch (type) {
        case 'success': return 'rgba(34, 197, 94, 0.9)';
        case 'error': return 'rgba(239, 68, 68, 0.9)';
        case 'info': return 'rgba(59, 130, 246, 0.9)';
        case 'warning': return 'rgba(245, 158, 11, 0.9)';
        default: return 'rgba(59, 130, 246, 0.9)';
    }
}

// Get message border color based on type
function getMessageBorderColor(type) {
    switch (type) {
        case 'success': return 'rgba(34, 197, 94, 0.3)';
        case 'error': return 'rgba(239, 68, 68, 0.3)';
        case 'info': return 'rgba(59, 130, 246, 0.3)';
        case 'warning': return 'rgba(245, 158, 11, 0.3)';
        default: return 'rgba(59, 130, 246, 0.3)';
    }
}

// Export current language for other pages
window.getCurrentLanguage = function() {
    return currentLanguage;
};

// Export translations for other pages
window.getTranslations = function() {
    return translations[currentLanguage];
};